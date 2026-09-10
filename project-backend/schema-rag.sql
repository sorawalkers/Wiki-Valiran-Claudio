-- ============================================================
-- RAG da Wiki — Busca semântica sobre o lore (schema extension)
-- Execute no SQL Editor do painel Supabase, depois de schema.sql
-- ============================================================
--
-- Alimenta o chatbot de lore (rag/index-wiki.js indexa, a Edge
-- Function wiki-chat consulta). Ver docs/RAG.md para a arquitetura
-- completa e a política de conteúdo redigido/GM-only.

create extension if not exists vector;

-- ── wiki_chunks ──────────────────────────────────────────────
-- Uma linha por trecho indexável (uma seção de artigo, um resumo
-- de sessão, uma regra da casa...). embedding é gerado pelo
-- modelo text-embedding-004 do Gemini com output_dimensionality=768.
create table if not exists wiki_chunks (
  id             uuid primary key default gen_random_uuid(),
  entity_type    text not null check (entity_type in (
                   'character', 'deity', 'session', 'faction', 'realm', 'houserule'
                 )),
  entity_id      text not null,       -- id/slug da entidade de origem (ex: 'lamidriel', ou num::text para sessions)
  entity_name    text not null,       -- nome de exibição, pra citar a fonte na resposta sem precisar de join
  section_title  text,                -- título da seção/subseção; null quando o chunk é o registro inteiro (ex: resumo de sessão)
  content        text not null,       -- texto em si, já concatenado/formatado — o que vai pro embedding e pro prompt
  content_hash   text not null,       -- hash do content, usado pra reindexação incremental (pular chunk inalterado)
  embedding      vector(768) not null,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

create unique index if not exists wiki_chunks_entity_section_uidx
  on wiki_chunks (entity_type, entity_id, coalesce(section_title, ''));

create index if not exists wiki_chunks_entity_idx
  on wiki_chunks (entity_type, entity_id);

-- ivfflat exige ANALYZE após popular a tabela para escolher bons
-- centróides; com poucas linhas (dezenas/centenas de chunks, o
-- caso desta wiki) um índice exato (sem index) já seria rápido o
-- bastante, mas o ivfflat é adicionado desde já para escalar sem
-- precisar de migração depois. lists=100 é um valor de partida
-- razoável até a tabela crescer na casa dos milhares de linhas.
create index if not exists wiki_chunks_embedding_idx
  on wiki_chunks using ivfflat (embedding vector_cosine_ops) with (lists = 100);

-- ── match_wiki_chunks ────────────────────────────────────────
-- RPC de busca por similaridade — chamado pela Edge Function e
-- pelo script de teste isolado (rag/test-search.js). Roda com os
-- privilégios do chamador (RLS abaixo decide o que cada um vê).
create or replace function match_wiki_chunks(
  query_embedding vector(768),
  match_count     int default 5
)
returns table (
  id            uuid,
  entity_type   text,
  entity_id     text,
  entity_name   text,
  section_title text,
  content       text,
  similarity    float
)
language sql stable
as $$
  select
    wc.id,
    wc.entity_type,
    wc.entity_id,
    wc.entity_name,
    wc.section_title,
    wc.content,
    1 - (wc.embedding <=> query_embedding) as similarity
  from wiki_chunks wc
  order by wc.embedding <=> query_embedding
  limit match_count;
$$;

-- ── Row Level Security ──────────────────────────────────────
-- Leitura pública: o conteúdo aqui já passou pela política de
-- redação/spoiler no momento da indexação (rag/lib/redaction.js) —
-- o que está em wiki_chunks é, por definição, seguro para
-- qualquer visitante ler. Escrita só pela service_role key
-- (rag/index-wiki.js roda com ela, nunca com a anon key).
alter table wiki_chunks enable row level security;

create policy "Leitura pública" on wiki_chunks for select using (true);
-- Nenhuma policy de INSERT/UPDATE/DELETE: sem policy = negado por
-- padrão para anon/authenticated. A service_role key ignora RLS
-- inteiramente, então o indexador continua funcionando.

-- ── wiki_chat_rate_limit ─────────────────────────────────────
-- Limite de uso por visitante (chave = hash do IP, calculado na
-- Edge Function — nunca guardamos o IP em texto puro). Ver
-- docs/RAG.md §7 para os números escolhidos e o motivo.
create table if not exists wiki_chat_rate_limit (
  client_key   text primary key,
  window_start timestamptz not null default now(),
  request_count integer not null default 0
);

alter table wiki_chat_rate_limit enable row level security;
-- Sem policies: só a service_role key (usada pela Edge Function)
-- lê/escreve aqui. Nunca exposta a anon/authenticated.
