// Edge Function: wiki-chat
//
// Recebe a pergunta de um visitante, busca os trechos de lore mais
// relevantes (wiki_chunks via match_wiki_chunks) e usa o Gemini Flash
// para gerar uma resposta fiel ao que foi recuperado. Ver docs/RAG.md
// para a arquitetura completa e a política de conteúdo redigido/GM-only
// (aplicada na indexação, em rag/lib/chunking.js — este arquivo confia
// que o que está em wiki_chunks já é seguro para qualquer visitante ler).
//
// Deploy:
//   supabase functions deploy wiki-chat
//   supabase secrets set GEMINI_API_KEY=...
// (SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY já existem automaticamente
// no ambiente de toda Edge Function do projeto.)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')!;

// Modelo Gemini Flash — confira o id atual em ai.google.dev/gemini-api/docs/models
// antes de subir em produção; a Google descontinua/renomeia versões de tempos
// em tempos e este arquivo não é atualizado automaticamente.
const EMBEDDING_MODEL = 'text-embedding-004';
const EMBEDDING_DIM = 768;
const GENERATION_MODEL = 'gemini-2.0-flash';
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

const MATCH_COUNT = 6;
const MAX_QUESTION_LENGTH = 500;

// ── Rate limiting ────────────────────────────────────────────
// Janela fixa por client_key (hash do IP — nunca guardamos o IP em
// texto puro). Números conservadores para um portfólio público sem
// autenticação: ver docs/RAG.md §7 para o raciocínio.
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hora
const RATE_LIMIT_MAX_REQUESTS = 20;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'content-type': 'application/json' },
  });
}

async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function embedQuestion(question: string): Promise<number[]> {
  const url = `${GEMINI_API_BASE}/models/${EMBEDDING_MODEL}:embedContent?key=${GEMINI_API_KEY}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      model: `models/${EMBEDDING_MODEL}`,
      content: { parts: [{ text: question }] },
      outputDimensionality: EMBEDDING_DIM,
    }),
  });
  if (!res.ok) throw new Error(`Gemini embedContent falhou (${res.status}): ${await res.text()}`);
  const data = await res.json();
  return data.embedding.values;
}

type ChunkRow = {
  entity_type: string;
  entity_id: string;
  entity_name: string;
  section_title: string | null;
  content: string;
  similarity: number;
};

function buildPrompt(question: string, chunks: ChunkRow[]): string {
  const context = chunks
    .map((c, i) => {
      const heading = `[${i + 1}] ${c.entity_name}${c.section_title ? ` — ${c.section_title}` : ''}`;
      return `${heading}\n${c.content}`;
    })
    .join('\n\n---\n\n');

  return [
    'Você é o guardião do Arquivo de Valiran, uma wiki de campanha de RPG de mesa dark-fantasy.',
    'Responda em português (PT-BR), em tom levemente arquivístico/narrativo, coerente com o lore.',
    '',
    'REGRAS ESTRITAS:',
    '- Use APENAS as informações do CONTEXTO abaixo. Não invente nomes, eventos ou relações que não estejam nele.',
    '- Se o contexto não tiver a resposta, diga claramente que esse registro não consta no Arquivo — não tente adivinhar.',
    '- Não revele nem especule sobre informações de mestre/bastidores; responda só o que um jogador poderia consultar na wiki pública.',
    '- Seja conciso: 2 a 4 parágrafos curtos, salvo se a pergunta pedir uma lista.',
    '',
    `CONTEXTO RECUPERADO:\n${context}`,
    '',
    `PERGUNTA: ${question}`,
  ].join('\n');
}

async function generateAnswer(prompt: string): Promise<string> {
  const url = `${GEMINI_API_BASE}/models/${GENERATION_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.4, maxOutputTokens: 1024 },
    }),
  });
  if (!res.ok) throw new Error(`Gemini generateContent falhou (${res.status}): ${await res.text()}`);
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text).join('') ?? '';
  if (!text) throw new Error('Gemini não retornou texto (possível bloqueio de safety).');
  return text;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS_HEADERS });
  if (req.method !== 'POST') return jsonResponse({ error: 'Método não suportado.' }, 405);

  let question: string;
  try {
    const body = await req.json();
    question = String(body?.question ?? '').trim();
  } catch {
    return jsonResponse({ error: 'JSON inválido.' }, 400);
  }

  if (!question) return jsonResponse({ error: 'Pergunta vazia.' }, 400);
  if (question.length > MAX_QUESTION_LENGTH) {
    return jsonResponse({ error: `Pergunta muito longa (máx. ${MAX_QUESTION_LENGTH} caracteres).` }, 400);
  }

  const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // ── Rate limit ──
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const clientKey = await sha256Hex(ip);
  const now = Date.now();

  const { data: rl } = await sb
    .from('wiki_chat_rate_limit')
    .select('window_start, request_count')
    .eq('client_key', clientKey)
    .maybeSingle();

  if (rl && now - new Date(rl.window_start).getTime() < RATE_LIMIT_WINDOW_MS) {
    if (rl.request_count >= RATE_LIMIT_MAX_REQUESTS) {
      return jsonResponse(
        { error: 'Limite de perguntas por hora atingido. Tente novamente mais tarde.' },
        429,
      );
    }
    await sb
      .from('wiki_chat_rate_limit')
      .update({ request_count: rl.request_count + 1 })
      .eq('client_key', clientKey);
  } else {
    await sb
      .from('wiki_chat_rate_limit')
      .upsert({ client_key: clientKey, window_start: new Date().toISOString(), request_count: 1 });
  }

  // ── Recuperação + geração ──
  try {
    const embedding = await embedQuestion(question);
    const { data: chunks, error: rpcErr } = await sb.rpc('match_wiki_chunks', {
      query_embedding: `[${embedding.join(',')}]`,
      match_count: MATCH_COUNT,
    });
    if (rpcErr) throw new Error(`match_wiki_chunks falhou: ${rpcErr.message}`);

    if (!chunks || chunks.length === 0) {
      return jsonResponse({
        answer: 'Não encontrei nada no Arquivo sobre isso ainda. Tente reformular a pergunta.',
        sources: [],
      });
    }

    const prompt = buildPrompt(question, chunks as ChunkRow[]);
    const answer = await generateAnswer(prompt);

    const sources = (chunks as ChunkRow[]).map(c => ({
      entity_type: c.entity_type,
      entity_id: c.entity_id,
      entity_name: c.entity_name,
      section_title: c.section_title,
    }));

    return jsonResponse({ answer, sources });
  } catch (err) {
    console.error('wiki-chat error:', err);
    return jsonResponse({ error: 'Falha ao gerar resposta. Tente novamente em instantes.' }, 500);
  }
});
