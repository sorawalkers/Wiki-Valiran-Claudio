#!/usr/bin/env node
// Indexador do RAG da wiki — lê as entidades do Supabase, corta em
// chunks (rag/lib/chunking.js), embeda com o Gemini e grava em
// wiki_chunks. Rodar manualmente sempre que o lore mudar de forma
// relevante (não roda automaticamente — sem trigger/cron por enquanto).
//
// Uso:
//   cp .env.example .env   # preencher as 3 variáveis
//   npm install
//   npm run index
//
// Requer a service_role key do Supabase (não a anon key) — wiki_chunks
// não tem policy de escrita para ninguém além dela. Ver docs/RAG.md.

require('dotenv').config();
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');
const { buildChunks } = require('./lib/chunking');
const { embedTexts } = require('./lib/gemini');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !GEMINI_API_KEY) {
  console.error('Faltam variáveis: SUPABASE_URL, SUPABASE_SERVICE_KEY e GEMINI_API_KEY são obrigatórias.');
  console.error('Copie rag/.env.example para rag/.env e preencha.');
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

function sha256(text) {
  return crypto.createHash('sha256').update(text, 'utf8').digest('hex');
}

// pgvector aceita o literal de texto '[v1,v2,...]' via PostgREST.
function toVectorLiteral(values) {
  return `[${values.join(',')}]`;
}

// Um "job" por tipo de entidade: como buscar as linhas de origem e quais
// campos usar como id/nome estável do chunk.
const JOBS = [
  {
    entityType: 'character',
    fetch: () => sb.from('characters').select('id, name, sections'),
    idField: 'id',
    nameField: 'name',
  },
  {
    entityType: 'deity',
    fetch: () => sb.from('deities').select('id, name, sections'),
    idField: 'id',
    nameField: 'name',
  },
  {
    entityType: 'session',
    // "num" (não o uuid "id") é o identificador estável usado no resto do
    // app (ex: rota session:23) — usamos ele como entity_id do chunk.
    fetch: () => sb.from('sessions').select('num, title, summary, narrative, keypoints'),
    idField: 'num',
    nameField: 'title',
  },
  {
    entityType: 'faction',
    fetch: () => sb.from('factions').select('id, name, summary, rows'),
    idField: 'id',
    nameField: 'name',
  },
  {
    entityType: 'realm',
    fetch: () => sb.from('realms').select('slug, name, motto, "desc", resources, stats6'),
    idField: 'slug',
    nameField: 'name',
  },
  {
    entityType: 'houserule',
    fetch: () => sb.from('houserules').select('id, title, paragraphs, callout_label, callout_text'),
    idField: 'id',
    nameField: 'title',
  },
];

async function indexJob({ entityType, fetch, idField, nameField }) {
  const { data: sourceRows, error: fetchErr } = await fetch();
  if (fetchErr) throw new Error(`[${entityType}] falha ao buscar linhas: ${fetchErr.message}`);

  const { data: existing, error: exErr } = await sb
    .from('wiki_chunks')
    .select('entity_id, section_title, content_hash, embedding')
    .eq('entity_type', entityType);
  if (exErr) throw new Error(`[${entityType}] falha ao ler chunks existentes: ${exErr.message}`);

  const existingByKey = new Map();
  for (const row of existing || []) {
    existingByKey.set(`${row.entity_id}::${row.section_title ?? ''}`, row);
  }

  const ready = [];   // chunks cujo embedding pode ser reaproveitado (hash igual)
  const toEmbed = [];  // chunks novos/alterados que precisam de embedding novo

  for (const row of sourceRows || []) {
    const entityId = String(row[idField]);
    const entityName = row[nameField];
    const chunks = buildChunks(entityType, row);

    for (const chunk of chunks) {
      const hash = sha256(chunk.content);
      const key = `${entityId}::${chunk.sectionTitle ?? ''}`;
      const base = {
        entity_type: entityType,
        entity_id: entityId,
        entity_name: entityName,
        section_title: chunk.sectionTitle,
        content: chunk.content,
        content_hash: hash,
      };
      const prev = existingByKey.get(key);
      if (prev && prev.content_hash === hash) {
        ready.push({ ...base, embedding: prev.embedding });
      } else {
        toEmbed.push(base);
      }
    }
  }

  if (toEmbed.length) {
    console.log(`[${entityType}] gerando embedding para ${toEmbed.length} chunk(s) novo(s)/alterado(s)...`);
    const vectors = await embedTexts(toEmbed.map(c => c.content), GEMINI_API_KEY);
    toEmbed.forEach((c, i) => ready.push({ ...c, embedding: vectors[i] }));
  }

  // Substitui todo o conjunto desse entity_type — writes no Postgres são
  // baratos, e isso limpa de graça seções renomeadas/removidas e
  // entidades apagadas na origem. O que a etapa de reaproveitar hash acima
  // evita é só a chamada (paga/limitada) ao Gemini, não o write em si.
  const { error: delErr } = await sb.from('wiki_chunks').delete().eq('entity_type', entityType);
  if (delErr) throw new Error(`[${entityType}] falha ao limpar chunks antigos: ${delErr.message}`);

  if (ready.length) {
    const { error: insErr } = await sb.from('wiki_chunks').insert(
      ready.map(c => ({ ...c, embedding: toVectorLiteral(c.embedding) }))
    );
    if (insErr) throw new Error(`[${entityType}] falha ao inserir chunks: ${insErr.message}`);
  }

  return {
    entityType,
    entities: (sourceRows || []).length,
    chunks: ready.length,
    embedded: toEmbed.length,
    reused: ready.length - toEmbed.length,
  };
}

async function main() {
  console.log('Indexando a wiki para o RAG...\n');
  const summary = [];
  for (const job of JOBS) {
    try {
      const result = await indexJob(job);
      summary.push(result);
      console.log(
        `  ${result.entityType}: ${result.entities} entidade(s) → ${result.chunks} chunk(s) ` +
        `(${result.embedded} embedado(s), ${result.reused} reaproveitado(s))`
      );
    } catch (err) {
      console.error(`  ERRO em ${job.entityType}:`, err.message);
      process.exitCode = 1;
    }
  }

  const totalChunks = summary.reduce((n, s) => n + s.chunks, 0);
  const totalEmbedded = summary.reduce((n, s) => n + s.embedded, 0);
  console.log(`\nConcluído: ${totalChunks} chunk(s) no índice, ${totalEmbedded} gerado(s) nesta rodada.`);

  if (totalChunks > 0) {
    console.log(
      '\nLembrete: rode ANALYZE wiki_chunks; no SQL Editor do Supabase após uma indexação\n' +
      'grande — ajuda o índice ivfflat a escolher bons centróides.'
    );
  }
}

main().catch(err => {
  console.error('Falha fatal:', err);
  process.exit(1);
});
