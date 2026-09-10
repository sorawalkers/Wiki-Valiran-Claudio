# RAG da Wiki — Pergunte ao Arquivo

> Chatbot de lore com busca semântica (RAG) sobre o conteúdo da wiki.
> Leia isto antes de mexer em qualquer peça do sistema — indexador,
> Edge Function, ou a página `chat-lore.jsx`.

---

## 1. Visão geral

```
Visitante → chat-lore.jsx → Edge Function (wiki-chat) → Gemini embedding
                                    │                          │
                                    │                          ▼
                                    │                  match_wiki_chunks (RPC)
                                    │                          │
                                    │                          ▼
                                    │                     wiki_chunks (pgvector)
                                    │
                                    └──→ Gemini Flash (geração) ──→ resposta + fontes
```

- **Indexação** (offline, manual): `rag/index-wiki.js` lê as entidades do Supabase, corta em chunks, gera embeddings via Gemini (`text-embedding-004`, 768 dimensões) e grava em `wiki_chunks`.
- **Consulta** (online, a cada pergunta): a Edge Function `wiki-chat` embeda a pergunta, busca os chunks mais similares (`match_wiki_chunks`), monta um prompt com esse contexto e chama o **Gemini Flash** para gerar a resposta final.
- Geração e embeddings usam **só a Gemini API** (tier free) — decisão deliberada para manter esta feature sem custo previsível num link de portfólio público, em vez do Claude.

---

## 2. Schema

`project-backend/schema-rag.sql` (execute no SQL Editor do Supabase, depois de `schema.sql`):

- `create extension vector` — pgvector.
- `wiki_chunks` — uma linha por trecho indexável. `entity_type` + `entity_id` + `section_title` identificam a origem; `content_hash` permite reindexação incremental (pula chunk que não mudou); `embedding vector(768)`.
- Índice `ivfflat` em `embedding` (cosine) — desde já, mesmo com poucas dezenas/centenas de linhas hoje, para não precisar migrar depois.
- `match_wiki_chunks(query_embedding, match_count)` — RPC de busca por similaridade, usado pelo indexador (teste) e pela Edge Function.
- `wiki_chat_rate_limit` — contador por `client_key` (hash do IP) para o rate limit da Edge Function.
- RLS: `wiki_chunks` tem leitura pública (o conteúdo já passou pela política de redação na indexação) e nenhuma policy de escrita — só a `service_role` key grava. `wiki_chat_rate_limit` não tem nenhuma policy — só a Edge Function (com `service_role`) acessa.

---

## 3. Política de conteúdo — o que nunca entra no índice

Decidido e implementado em `rag/lib/chunking.js` (comentário no topo do arquivo tem os detalhes técnicos). Resumo:

1. **`sessions.gmnote` nunca é lido pelo indexador.** É um campo carregado no client por `db.js` mas nunca renderizado em `pages/sessions.jsx` — hoje só não vaza porque ninguém abre o DevTools. Indexar isso deixaria o chatbot capaz de *citar ativamente* o que a wiki hoje só esconde por omissão de UI.
2. **Linhas de `factions.rows` com `redacted: true` são descartadas inteiramente** (chave e valor, não só o valor). Na wiki, `redacted` é puramente um efeito CSS — texto na cor do fundo (`styles-extra.css`, `.dossier-row dd.redacted`) — o valor real continua no HTML enviado ao navegador. O índice do RAG **não herda** esse esconderijo cosmético de graça; a exclusão é feita explicitamente na hora de montar os chunks.

Tudo o mais que já é publicamente renderizado (sections de personagens/divindades, resumo/narrativa/keypoints de sessão, dossiê não-redigido de facções, regras da casa e seus avisos, visão geral/recursos/stats de reinos) entra no índice normalmente — não há necessidade de esconder o que a própria wiki já mostra.

**Gap conhecido, fora do escopo desta feature:** a tabela `houserules` existe no Supabase e é usada por `db.js`, mas não está em `project-backend/schema.sql` (falta o `CREATE TABLE`). O indexador assume o schema documentado em `docs/GUIA-ESTRUTURA-ARTIGOS.md` §8, que bate com o que `db.js` lê/escreve. Vale corrigir `schema.sql` separadamente.

---

## 4. Setup — ordem de execução

> **Rodando isso pela primeira vez a partir de uma sessão sem acesso à rede do Supabase?** Veja [`rag/SETUP.md`](../rag/SETUP.md) — lista exatamente o que precisa ter em mãos (chaves, tokens) e o que uma sessão local do Claude Code consegue rodar sozinha a partir disso.

1. **Schema**: rode `project-backend/schema-rag.sql` no SQL Editor do Supabase.
2. **Indexador**:
   ```bash
   cd rag
   cp .env.example .env   # preencher SUPABASE_URL, SUPABASE_SERVICE_KEY, GEMINI_API_KEY
   npm install
   npm run index
   ```
   A `SUPABASE_SERVICE_KEY` é a `service_role` key (Project Settings → API) — **nunca** a `anon` key; `wiki_chunks` não aceita escrita de mais ninguém. A `GEMINI_API_KEY` vem do [Google AI Studio](https://aistudio.google.com/apikey).
3. **Teste de recuperação isolado** (sem gastar chamada de geração):
   ```bash
   npm run test-search -- "Quem é Lamidriel?"
   ```
   Confira se os chunks retornados fazem sentido para a pergunta **antes** de mexer na Edge Function — é aqui que chunking mal cortado costuma aparecer (uma seção cortada no meio, um resumo genérico demais competindo com o específico, etc.). Ajuste `rag/lib/chunking.js` e rode `npm run index` de novo se precisar.
4. **Edge Function**:
   ```bash
   supabase functions deploy wiki-chat
   supabase secrets set GEMINI_API_KEY=sua_chave_aqui
   ```
   `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` já existem automaticamente no ambiente de toda Edge Function do projeto — não precisa configurar.
5. **Front-end**: `project-backend/pages/chat-lore.jsx` já está ligada em `index.html`, `app.jsx` (rota `chat-lore`) e `data.jsx` (nav "Assistente"). Chama a função via `window.sb.functions.invoke('wiki-chat', { body: { question } })` — não precisa montar URL manualmente, usa a mesma configuração de `window.sb` já existente.

---

## 5. Reindexação

Não há trigger automático — rode `npm run index` manualmente sempre que o lore mudar de forma relevante (nova sessão, personagem, divindade, etc.). O indexador é incremental no custo de embedding (reaproveita o vetor de qualquer chunk cujo `content_hash` não mudou) mas sempre reescreve as linhas de `wiki_chunks` do tipo de entidade processado — writes no Postgres são baratos, e isso limpa de graça seções renomeadas ou entidades removidas.

---

## 6. Modelo Gemini Flash — atenção

`supabase/functions/wiki-chat/index.ts` usa `gemini-2.0-flash` como `GENERATION_MODEL`. A Google renomeia/descontinua versões do Gemini Flash com alguma frequência — confira o id atual em [ai.google.dev/gemini-api/docs/models](https://ai.google.dev/gemini-api/docs/models) antes de depender disso em produção por muito tempo.

---

## 7. Limites de uso (item 7 do roteiro)

Duas camadas, porque uma sozinha não é suficiente para uma feature paga (mesmo que no tier free) exposta num link público sem login:

1. **Rate limit na Edge Function** (`wiki_chat_rate_limit`): 20 perguntas por hora por IP (hash SHA-256, nunca o IP em texto puro). Números de partida conservadores para um chat de curiosidade num portfólio — ajuste `RATE_LIMIT_MAX_REQUESTS`/`RATE_LIMIT_WINDOW_MS` em `index.ts` se dificultar demais o uso normal. Isso reduz abuso automatizado, mas **não impede que muitos IPs diferentes** consumam a cota do tier free simultaneamente.
2. **Teto de gasto no console do Gemini** — configurar manualmente em [aistudio.google.com](https://aistudio.google.com) (ou no Google Cloud Console, se o projeto usa billing habilitado). Isso não pode ser feito por código: é a rede de segurança final caso o rate limit da Edge Function seja contornado ou insuficiente. **Não pule esta etapa antes de divulgar o link publicamente.**

---

## 8. Arquivos desta feature

| Arquivo | Papel |
|---|---|
| `project-backend/schema-rag.sql` | Extensão pgvector, tabela `wiki_chunks`, RPC `match_wiki_chunks`, tabela de rate limit, RLS |
| `rag/lib/chunking.js` | Política de conteúdo + chunking por tipo de entidade |
| `rag/lib/gemini.js` | Cliente mínimo de embeddings da Gemini API |
| `rag/index-wiki.js` | Script de indexação (rodar manualmente) |
| `rag/test-search.js` | Teste isolado de busca vetorial (sem geração) |
| `supabase/functions/wiki-chat/index.ts` | Edge Function: embedding da pergunta → busca → prompt → Gemini Flash → resposta |
| `project-backend/pages/chat-lore.jsx` | Widget de chat no front-end |
