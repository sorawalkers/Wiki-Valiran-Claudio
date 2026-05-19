# Guia de SQL para Artigos de Personagem — O Arquivo de Valiran

> Instruções para geração e execução de SQL ao criar ou atualizar artigos de personagem na wiki.
> Inclui templates prontos, mapa de campos e cuidados técnicos obrigatórios.

---

## 1. Quando usar INSERT vs UPDATE

| Situação | Operação |
|---|---|
| Personagem **não existe** no banco | `INSERT INTO characters ...` |
| Personagem **já existe** (placeholder ou parcial) | `UPDATE characters SET ... WHERE id = '...'` |
| Não sabe se existe | Use `INSERT ... ON CONFLICT (id) DO UPDATE` (upsert seguro) |

> **Dica**: Se o personagem já aparece na aba de Personagens/NPCs da wiki, ele existe — use UPDATE.

---

## 2. Mapa completo de campos

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | text PK | ✓ | Slug único — ver regra de geração abaixo |
| `name` | text | ✓ | Nome completo do personagem |
| `role` | text | | Papel curto exibido no infobox (ex: `"Paladino · Cavaleiro de Lamidriel"`) |
| `tag` | text | | Classificação: `PC` · `NPC` · `ALIADO` · `INIMIGO` |
| `tagClass` | text | | Classe CSS: `pc` · `npc` · `ally` · `foe` |
| `campaign` | text | | Nome da campanha (ex: `"Campanha 3 — A Queda"`) |
| `hero` | text | | Citação de abertura exibida no topo do artigo |
| `placeholder` | boolean | | `true` = sem artigo ainda · `false` = artigo completo |
| `infobox` | jsonb | | Ficha lateral (ver estrutura §3) |
| `sections` | jsonb | | Corpo do artigo em seções (ver estrutura §4) |
| `related` | jsonb | | Links relacionados na barra lateral (ver estrutura §5) |
| `updated_at` | timestamptz | | Sempre incluir `NOW()` ao fazer UPDATE |

### Regra de geração de ID (slugify)

```
nome → minúsculas → remover acentos → substituir espaços/símbolos por "-" → trim "-"

Exemplos:
  "Lawrence Cainhurst"      → "lawrence-cainhurst"
  "Diego Vans Loupd'or"     → "diego-vans-loupd-or"
  "Annabella Whiteflame"    → "annabella-whiteflame"
  "Lamidriel, o Titã"       → "lamidriel-o-tita"
```

### Mapa tag → tagClass (obrigatório manter sincronizado)

| `tag` | `tagClass` |
|---|---|
| `PC` | `pc` |
| `NPC` | `npc` |
| `ALIADO` | `ally` |
| `INIMIGO` | `foe` |

---

## 3. Estrutura do campo `infobox`

```json
{
  "rows": [
    { "k": "Classe",    "v": "Paladino / Cavaleiro de Lamidriel" },
    { "k": "Origem",    "v": "Floresta das Rosas" },
    { "k": "Raça",      "v": "Humano" },
    { "k": "Filiação",  "v": "Brotherhood of Hope" },
    { "k": "Status",    "v": "Ativo" },
    { "k": "Domínio",   "v": "Energia Negativa (mácula)", "danger": true },
    { "k": "Nível",     "v": "10",                        "ok": true }
  ],
  "statusNote": "Texto opcional exibido no rodapé da infobox."
}
```

- `"danger": true` → valor exibido em **vermelho**
- `"ok": true` → valor exibido em **verde**
- Sem flag → cor padrão (dourado/pérola)

### Badge de status (detectado automaticamente pelo campo `"Status"`)

O sistema lê o valor do campo `"Status"` no infobox e aplica o badge automaticamente:

| Valor começa com... | Badge exibido | Variante visual |
|---|---|---|
| `ATIV…` | ATIVO | Verde |
| `MORT…` / `FALEC…` | MORTO | Vinho + lápide |
| `DESAPAREC…` | DESAPARECIDO | Dourado + nota |
| `CATIV…` / `PRISIONEIR…` / `REFÉM…` | CATIVO | Dourado |
| `EM FUGA` / `FORAGID…` | EM FUGA | Vinho |
| Qualquer outro texto | Primeiros 16 chars | Dourado |

---

## 4. Estrutura do campo `sections`

```json
[
  {
    "title": "Título da Seção",
    "paras": [
      "Primeiro parágrafo. Cada string se torna um <p> no HTML.",
      "Segundo parágrafo da mesma seção.",
      "Terceiro parágrafo."
    ]
  },
  {
    "title": "Segunda Seção",
    "paras": [
      "O primeiro parágrafo da primeira seção recebe dropcap automático."
    ]
  }
]
```

> **Atenção**: o campo se chama `"paras"` (não `"body"`, não `"paragraphs"`, não `"text"`).
> O componente `character-detail.jsx` lê especificamente `sec.paras`.

---

## 5. Estrutura do campo `related`

```json
[
  { "tag": "Amigo",   "title": "Diego Vans Loupd'or",  "target": "character:diego-vans-loupd-or" },
  { "tag": "Mentor",  "title": "Jorah Londor",          "target": "character:jorah-londor" },
  { "tag": "Facção",  "title": "Brotherhood of Hope",   "target": "factions" },
  { "tag": "Local",   "title": "Lancaster",             "target": "kingdoms" },
  { "tag": "Evento",  "title": "A Queda de Lancaster",  "target": "timeline" },
  { "tag": "Divind.", "title": "Lamidriel",             "target": "deity:lamidriel" }
]
```

### Formatos de `target` disponíveis

| `target` | Destino |
|---|---|
| `character:slug` | Artigo de personagem/NPC |
| `deity:slug` | Artigo de divindade |
| `session:num` | Sessão específica (ex: `session:5`) |
| `pantheon` | Página do Panteão |
| `kingdoms` | Página de Reinos |
| `factions` | Página de Facções |
| `timeline` | Linha do Tempo |
| `sessions` | Diário de Sessões |
| `house-rules` | Regras da Casa |
| `article` | Artigo estático (Ayael) |

---

## 6. Template INSERT — novo personagem

```sql
INSERT INTO characters (
  id, name, role, tag, "tagClass", campaign,
  hero, placeholder, infobox, sections, related
)
VALUES (
  'id-do-personagem',
  'Nome Completo',
  'Papel curto · contexto',
  'PC',       -- PC | NPC | ALIADO | INIMIGO
  'pc',       -- pc | npc | ally | foe
  'Campanha 3 — A Queda',
  '"Citação de abertura do personagem."',
  false,
  '{
    "rows": [
      {"k": "Classe",   "v": "Classe / Subclasse"},
      {"k": "Origem",   "v": "Cidade ou Região"},
      {"k": "Raça",     "v": "Raça"},
      {"k": "Filiação", "v": "Organização ou Facção"},
      {"k": "Status",   "v": "Ativo"}
    ]
  }'::jsonb,
  '[
    {
      "title": "Origens",
      "paras": [
        "Primeiro parágrafo da seção de origens.",
        "Segundo parágrafo."
      ]
    },
    {
      "title": "Situação Atual",
      "paras": [
        "O que o personagem está fazendo agora."
      ]
    }
  ]'::jsonb,
  '[
    {"tag": "Tag", "title": "Nome do relacionado", "target": "character:slug-do-relacionado"}
  ]'::jsonb
);
```

---

## 7. Template UPDATE — atualizar personagem existente

```sql
UPDATE characters
SET
  hero     = '"Nova citação de abertura."',
  sections = '[
    {
      "title": "Origens",
      "paras": [
        "Parágrafo atualizado.",
        "Segundo parágrafo."
      ]
    }
  ]'::jsonb,
  related  = '[
    {"tag": "Amigo", "title": "Nome", "target": "character:slug"}
  ]'::jsonb,
  infobox  = '{
    "rows": [
      {"k": "Status", "v": "Ativo"}
    ]
  }'::jsonb,
  updated_at = NOW()
WHERE id = 'id-do-personagem';
```

> O UPDATE **substitui o campo inteiro** — sempre inclua todos os dados, não apenas o que mudou.

---

## 8. Upsert seguro (INSERT ou UPDATE automático)

Use quando não souber se o registro já existe:

```sql
INSERT INTO characters (
  id, name, role, tag, "tagClass", campaign,
  hero, placeholder, infobox, sections, related, updated_at
)
VALUES (
  'id-do-personagem',
  'Nome Completo',
  'Papel curto',
  'PC', 'pc',
  'Campanha 3 — A Queda',
  '"Citação."',
  false,
  '{"rows": [{"k": "Status", "v": "Ativo"}]}'::jsonb,
  '[{"title": "Origens", "paras": ["Parágrafo."]}]'::jsonb,
  '[]'::jsonb,
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  hero       = EXCLUDED.hero,
  sections   = EXCLUDED.sections,
  related    = EXCLUDED.related,
  infobox    = EXCLUDED.infobox,
  updated_at = NOW();
```

---

## 9. Cuidados técnicos obrigatórios

### 9.1 Aspas simples dentro de strings SQL

Em SQL, strings são delimitadas por aspas simples `'`. Toda aspas simples **dentro do texto** deve ser duplicada `''`.

```sql
-- ❌ ERRADO — vai quebrar o SQL
'Diego Vans Loupd'or'
'"Não sei se foi Lamidriel que me atendeu naquela noite."'

-- ✅ CORRETO — aspas simples duplicadas
'Diego Vans Loupd''or'
'"Não sei se foi Lamidriel que me atendeu naquela noite."'
```

Isso afeta principalmente:
- Nomes com apóstrofo: `Loupd'or` → `Loupd''or`
- Citações no campo `hero`: `'"Citação."'` (as aspas inglesas `"` não precisam de escape)
- Qualquer texto com contração ou possessivo em inglês

### 9.2 O cast `::jsonb` é obrigatório

Todo campo JSONB precisa do cast explícito no final:

```sql
-- ❌ ERRADO
sections = '[{"title": "Origens", "paras": ["Texto."]}]'

-- ✅ CORRETO
sections = '[{"title": "Origens", "paras": ["Texto."]}]'::jsonb
```

### 9.3 JSON deve ser válido

O PostgreSQL rejeita JSONB mal formado. Pontos de atenção:

```jsonc
// ❌ Vírgula no último item (trailing comma) — inválido em JSON
{ "rows": [
    {"k": "Status", "v": "Ativo"},   ← vírgula aqui quebra
] }

// ✅ Sem vírgula no último item
{ "rows": [
    {"k": "Status", "v": "Ativo"}
] }
```

Outros erros comuns:
- Chaves sem aspas: `{k: "Status"}` → deve ser `{"k": "Status"}`
- Aspas simples em vez de duplas: `{'k': 'Status'}` → deve ser `{"k": "Status"}`

### 9.4 O campo se chama `"paras"`, não `"body"`

O componente `character-detail.jsx` lê especificamente `sec.paras[]`. IAs costumam gerar `"body"` por analogia com outras estruturas. Verifique antes de executar.

```json
// ❌ Gerado erroneamente por IA
{"title": "Origens", "body": "Texto aqui"}

// ❌ Também errado
{"title": "Origens", "paragraphs": ["Texto aqui"]}

// ✅ Correto
{"title": "Origens", "paras": ["Texto aqui"]}
```

### 9.5 `tagClass` usa aspas duplas no nome da coluna

O PostgreSQL é case-sensitive com identificadores. A coluna `tagClass` tem letra maiúscula e precisa de aspas duplas:

```sql
-- ❌ ERRADO — interpretado como "tagclass" (lowercase)
INSERT INTO characters (id, name, tagClass, ...)

-- ✅ CORRETO
INSERT INTO characters (id, name, "tagClass", ...)
```

### 9.6 `tag` e `tagClass` devem estar sincronizados

Se você colocar `tag = 'PC'` mas `tagClass = 'npc'`, o badge visual vai aparecer errado.

```sql
-- ✅ Pares corretos
tag = 'PC',     "tagClass" = 'pc'
tag = 'NPC',    "tagClass" = 'npc'
tag = 'ALIADO', "tagClass" = 'ally'
tag = 'INIMIGO',"tagClass" = 'foe'
```

### 9.7 `placeholder = false` para artigos completos

Se o personagem existia como placeholder e você está adicionando o artigo completo, lembre de mudar o campo:

```sql
UPDATE characters SET
  placeholder = false,
  hero = '...',
  sections = '...'::jsonb,
  -- ...
WHERE id = 'id-do-personagem';
```

Enquanto `placeholder = true`, o componente renderiza apenas a ficha mínima — o corpo do artigo não aparece.

### 9.8 Consistência de nomes próprios

O banco possui registros históricos com grafias. Verifique os nomes canônicos antes de usar em `related` ou nos textos:

| ❌ Grafia antiga (incorreta) | ✅ Grafia correta |
|---|---|
| Lidhaven | **Lindhaven** |

Use sempre a grafia correta nos campos `title`, `paras` e `target`.

### 9.9 IDs de `target` devem existir no banco

Um `related` com `"target": "character:personagem-que-nao-existe"` não vai quebrar a aplicação, mas o link aparecerá sem destino válido. Antes de incluir um target do tipo `character:slug` ou `deity:slug`, confirme que o registro existe na respectiva tabela.

### 9.10 UPDATE substitui o campo inteiro

O PostgreSQL não faz merge de JSONB automaticamente no UPDATE. Se você fizer:

```sql
UPDATE characters SET sections = '[{"title": "Novo"}]'::jsonb WHERE id = '...';
```

As seções antigas são **completamente substituídas**. Sempre inclua todo o conteúdo no UPDATE, não apenas as partes que mudaram.

---

## 10. Checklist antes de executar

- [ ] ID gerado corretamente via slugify (sem acentos, sem símbolos)
- [ ] Aspas simples dentro de strings estão duplicadas (`''`)
- [ ] Todos os campos JSONB terminam com `::jsonb`
- [ ] JSON válido (sem trailing commas, chaves com aspas duplas)
- [ ] `sections` usa `"paras"` e não `"body"` ou `"paragraphs"`
- [ ] `tag` e `tagClass` estão sincronizados
- [ ] `"tagClass"` está com aspas duplas no nome da coluna
- [ ] `placeholder = false` se o artigo é completo
- [ ] Nomes próprios com grafia correta (ex: Lindhaven)
- [ ] Targets de `related` apontam para slugs existentes
- [ ] UPDATE inclui `updated_at = NOW()`
- [ ] UPDATE inclui **todos** os campos JSONB (não apenas os que mudaram)

---

## 11. Onde executar

**Supabase Dashboard → SQL Editor**

1. Acesse o painel do Supabase do projeto
2. Clique em **SQL Editor** no menu lateral
3. Cole o SQL e clique em **Run**
4. Se aparecer `Success` sem erros, recarregue a wiki — os dados aparecem imediatamente

Se houver erro de sintaxe JSON, o Supabase vai indicar a posição do problema na mensagem de erro.
