#!/usr/bin/env node
// Teste isolado de recuperação — SEM chamar nenhum modelo de geração.
// Só confere se a busca por similaridade está trazendo os chunks certos
// para uma pergunta de exemplo. Rode isso antes de conectar o endpoint
// de geração: é aqui que problemas de chunking mal cortado aparecem.
//
// Uso:
//   node test-search.js "Quem é Lamidriel?"
//   node test-search.js "O que aconteceu na queda de Lancaster?" --limit 8

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { embedText } = require('./lib/gemini');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const args = process.argv.slice(2);
const limitFlagIdx = args.indexOf('--limit');
const limit = limitFlagIdx >= 0 ? Number(args[limitFlagIdx + 1]) : 5;
const question = args.filter((a, i) => a !== '--limit' && i !== limitFlagIdx + 1).join(' ').trim();

if (!question) {
  console.error('Uso: node test-search.js "sua pergunta aqui" [--limit N]');
  process.exit(1);
}
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !GEMINI_API_KEY) {
  console.error('Faltam variáveis: SUPABASE_URL, SUPABASE_SERVICE_KEY e GEMINI_API_KEY são obrigatórias.');
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function main() {
  console.log(`Pergunta: "${question}"\n`);

  const embedding = await embedText(question, GEMINI_API_KEY);
  const vectorLiteral = `[${embedding.join(',')}]`;

  const { data, error } = await sb.rpc('match_wiki_chunks', {
    query_embedding: vectorLiteral,
    match_count: limit,
  });

  if (error) {
    console.error('Falha na busca:', error.message);
    process.exit(1);
  }

  if (!data || data.length === 0) {
    console.log('Nenhum chunk retornado — o índice está vazio? Rode index-wiki.js primeiro.');
    return;
  }

  data.forEach((row, i) => {
    console.log(`${i + 1}. [${row.entity_type}/${row.entity_id}] ${row.entity_name}` +
      (row.section_title ? ` — ${row.section_title}` : ''));
    console.log(`   similaridade: ${row.similarity.toFixed(4)}`);
    console.log(`   ${row.content.slice(0, 220).replace(/\n/g, ' ')}${row.content.length > 220 ? '…' : ''}`);
    console.log('');
  });

  console.log(
    'Confira: os chunks fazem sentido para a pergunta? Se um chunk relevante não\n' +
    'aparece, ou vem cortado no meio de uma ideia, ajuste o chunking em\n' +
    'rag/lib/chunking.js antes de reindexar.'
  );
}

main().catch(err => {
  console.error('Falha fatal:', err);
  process.exit(1);
});
