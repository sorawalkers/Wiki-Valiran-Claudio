# Setup do RAG — handoff para sessão local

> Este projeto (o RAG da wiki, ver [`docs/RAG.md`](../docs/RAG.md)) foi
> implementado numa sessão remota sem acesso de rede ao Supabase — o
> código está pronto, mas nada foi rodado contra o projeto real ainda.
> Este arquivo é o ponto de partida para continuar numa sessão local do
> Claude Code, que já não tem esse bloqueio de rede.

---

## O que você precisa ter em mãos antes de começar

Ações amarradas à sua conta — ninguém mais consegue fazer isso por você, nem rodando localmente:

1. **Gemini API key** — [aistudio.google.com/apikey](https://aistudio.google.com/apikey) (conta Google).
2. **Supabase `service_role` key** — painel Supabase → Project Settings → API → `service_role` (não a `anon`).
3. **Supabase Postgres connection string** (opcional, mas evita abrir o SQL Editor manualmente) — painel Supabase → Project Settings → Database → Connection string.
4. **Supabase Personal Access Token** (opcional, evita o fluxo de login por navegador) — painel Supabase → Account → Access Tokens → Generate new token. Com isso dá pra rodar `supabase login --token <token>` sem abrir browser.
5. **Teto de gasto configurado no Gemini** — [aistudio.google.com](https://aistudio.google.com) (ou Google Cloud Console, se o projeto tiver billing). Fazer isso *antes* do link ficar público — ver `docs/RAG.md` §7 para o raciocínio.

Sem pelo menos os itens 1 e 2, nada do resto funciona — comece por eles.

---

## O que uma sessão local do Claude Code pode fazer por você

Com as chaves acima em mãos (via `.env` ou coladas na conversa), uma sessão local — sem o bloqueio de rede deste sandbox — consegue rodar sozinha:

1. Executar `project-backend/schema-rag.sql` no Postgres do projeto (via connection string, sem precisar do SQL Editor manualmente).
2. `cd rag && npm install && npm run index` — popular `wiki_chunks`.
3. `npm run test-search -- "pergunta de teste"` — conferir a qualidade da busca antes de seguir.
4. `supabase login --token <token>` (ou guiar o fluxo interativo, se preferir logar você mesmo).
5. `supabase link --project-ref ytphxqybjxokokbnnbrz`
6. `supabase functions deploy wiki-chat` + `supabase secrets set GEMINI_API_KEY=...`
7. Testar a function deployada com curl.
8. Ajustar chunking/prompt e reindexar, iterando com base no que o teste de busca mostrar.

O que continua exclusivamente seu mesmo depois disso: o teto de gasto no console do Gemini (item 5 da lista acima) e, claro, revisar/aprovar o que for gerado.

---

## Como retomar

Na sessão local, referencie este arquivo e `docs/RAG.md` — eles têm todo o contexto de arquitetura, decisões (por que Gemini e não Claude para embeddings/geração, a política de redação de conteúdo GM-only) e a ordem de execução. Não precisa reexplicar o projeto do zero.
