# Guia de SQL para Artigos — O Arquivo de Valiran

> Instruções para geração e execução de SQL ao criar ou atualizar artigos de personagem, divindade ou sessão na wiki.
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

## 10. Divindades (`deities`)

### 10.1 Mapa de campos

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | text PK | ✓ | Slug único via slugify |
| `name` | text | ✓ | Nome da divindade |
| `epithet` | text | | Epíteto exibido no subtítulo (ex: `"O que Sangra Luz"`) |
| `sigil` | text | | Nome do ícone SVG — ver lista abaixo |
| `hero` | text | | Citação de abertura do artigo |
| `placeholder` | boolean | | `true` = sem artigo ainda · `false` = artigo completo |
| `infobox` | jsonb | | Mesma estrutura de personagens |
| `sections` | jsonb | | Mesma estrutura de personagens (`"paras"`) |
| `related` | jsonb | | Mesma estrutura de personagens |

### 10.2 Sigils disponíveis

`Dragon` · `Dawn` · `Chain` · `Sun` · `Moon` · `Skull` · `Eye` · `Flame` · `Wave` · `Tree` · `Crown` · `Sword` · `Tome`

> O sigil é o ícone SVG exibido na infobox e na grade do Panteão. Se o valor não corresponder a um nome da lista, nenhum ícone é renderizado.

### 10.3 Estrutura `infobox` para divindades

Mesma estrutura de personagens. Campos comuns para divindades:

```json
{
  "rows": [
    { "k": "Tipo",       "v": "Divindade Maior" },
    { "k": "Domínio",    "v": "Luz, Sacrifício",    "danger": true },
    { "k": "Alinhamento","v": "Leal-Bom",            "ok": true },
    { "k": "Plano",      "v": "Sétimo Céu" },
    { "k": "Símbolo",    "v": "Chama ascendente" },
    { "k": "Adoradores", "v": "Paladinos, clérigos" },
    { "k": "Status",     "v": "Ativo" }
  ],
  "statusNote": "Nota opcional exibida no rodapé da infobox."
}
```

### 10.4 Template INSERT — nova divindade

```sql
INSERT INTO deities (id, name, epithet, sigil, placeholder, hero, infobox, sections, related)
VALUES (
  'nome-da-divindade',
  'Nome da Divindade',
  'O Epíteto · A Descrição',
  'Flame',
  false,
  '"Citação de abertura da divindade."',
  '{
    "rows": [
      {"k": "Tipo",       "v": "Divindade Maior"},
      {"k": "Domínio",    "v": "Domínio aqui",   "danger": true},
      {"k": "Alinhamento","v": "Alinhamento"},
      {"k": "Plano",      "v": "Plano de existência"},
      {"k": "Símbolo",    "v": "Descrição do símbolo sagrado"},
      {"k": "Adoradores", "v": "Quem a adora"},
      {"k": "Status",     "v": "Ativo"}
    ]
  }'::jsonb,
  '[
    {
      "title": "Origem",
      "paras": [
        "Primeiro parágrafo sobre a origem da divindade.",
        "Segundo parágrafo."
      ]
    },
    {
      "title": "Culto e Adoradores",
      "paras": [
        "Como a divindade é venerada."
      ]
    }
  ]'::jsonb,
  '[
    {"tag": "Plano",  "title": "Nome do plano",    "target": "article"},
    {"tag": "Evento", "title": "Evento relacionado","target": "timeline"}
  ]'::jsonb
);
```

### 10.5 Template UPDATE — atualizar divindade existente

```sql
UPDATE deities
SET
  epithet  = 'Novo Epíteto',
  hero     = '"Nova citação."',
  sections = '[
    {
      "title": "Origem",
      "paras": ["Texto atualizado."]
    }
  ]'::jsonb,
  related  = '[
    {"tag": "Titã", "title": "Lamidriel", "target": "deity:lamidriel"}
  ]'::jsonb,
  infobox  = '{
    "rows": [
      {"k": "Status", "v": "Ativo"}
    ]
  }'::jsonb,
  updated_at = NOW()
WHERE id = 'id-da-divindade';
```

---

## 11. Sessões (`sessions`)

### 11.1 Mapa de campos

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `num` | integer UNIQUE | ✓ | Número da sessão (1, 2, 3…) — chave lógica de navegação |
| `title` | text | ✓ | Título narrativo da sessão |
| `date` | text | | Data por extenso (ex: `"21 do Segundo Mês, 1281"`) |
| `dateShort` | text | | Data abreviada para chips (ex: `"21 · MAI · 1281"`) |
| `location` | text | | Local principal da sessão |
| `locationDetail` | text | | Descrição geográfica do local |
| `duration` | text | | Duração real da sessão (ex: `"4h30"`) |
| `session_xp` | text | | XP concedida na sessão |
| `summary` | text | | Resumo de uma linha exibido no card |
| `cast` | jsonb | | Array de strings com nomes dos presentes |
| `places` | jsonb | | Array de strings com lugares visitados |
| `narrative` | jsonb | | Array de parágrafos da narrativa |
| `keypoints` | jsonb | | Array de `{text, danger}` — pontos-chave |
| `loot` | jsonb | | Array de itens coletados (opcional) |
| `gmnote` | text | | Nota privada do GM (não exibida para viewers) |
| `next` | text | | Gancho para a próxima sessão |

> **Atenção**: `num` é o identificador lógico de sessão. A rota de navegação é `session:num` (ex: `session:5`). O `id` UUID é gerado automaticamente pelo banco.

### 11.2 Estrutura do campo `cast`

Array de strings simples. Para NPCs, adicione `(NPC)` ao final — o componente detecta e exibe o badge NPC automaticamente.

```json
["Käthryn", "Lawrence", "Halric", "Tannis (NPC)", "Cael (NPC · guia)"]
```

### 11.3 Estrutura do campo `places`

Array de strings com os locais visitados na sessão:

```json
["Catacumbas de Lindhaven", "Torre do Vigia", "Estalagem do Junco Partido"]
```

### 11.4 Estrutura do campo `narrative`

Array de parágrafos. Cada string se torna um `<p>` na seção Narrativa:

```json
[
  "O grupo chegou às muralhas de Lindhaven ao entardecer.",
  "Dentro, o silêncio era absoluto — os guardas haviam sido substituídos.",
  "Foi Käthryn quem notou a marca da Blackflame na pedra da entrada."
]
```

### 11.5 Estrutura do campo `keypoints`

Array de objetos `{text, danger}`. Itens com `"danger": true` são exibidos em vermelho:

```json
[
  {"text": "Käthryn encontrou o diário de seu pai nas ruínas",    "danger": false},
  {"text": "Lawrence foi marcado pela mácula de Ayael",           "danger": true},
  {"text": "Diego entregou-se à Princesa Pálida em troca do grupo","danger": true},
  {"text": "Brotherhood of Hope foi fundada em Silverhain",       "danger": false}
]
```

> Convenção: use `danger: true` para eventos de alto impacto — mortes, capturas, revelações críticas, mudanças de campanha.

### 11.6 Template INSERT — nova sessão

```sql
INSERT INTO sessions (
  num, title, date, "dateShort", location, "locationDetail",
  duration, session_xp, summary, cast, places, narrative, keypoints, loot, gmnote, next
)
VALUES (
  7,
  'O Preço de Lindhaven',
  '14 do Terceiro Mês, 1281',
  '14 · JUN · 1281',
  'Castelo de Lindhaven',
  'Muralhas norte do Ducado de Lindhaven, fronteira com Oshain',
  '4h',
  '350 XP',
  'O grupo desce às catacumbas e encontra a Blackflame — Diego não volta.',
  '["Käthryn", "Lawrence", "Halric", "Tannis (NPC)"]'::jsonb,
  '["Catacumbas de Lindhaven", "Câmara do Selo", "Torre Norte"]'::jsonb,
  '[
    "O grupo infiltrou o castelo pelo aqueduto antigo.",
    "Nas catacumbas, encontraram a Princesa Pálida com uma Shadow de Ayael.",
    "Lawrence foi gravemente ferido. A criatura deixou uma mácula.",
    "Diego entregou-se. O grupo escapou. O silêncio que se seguiu durou horas."
  ]'::jsonb,
  '[
    {"text": "Lawrence recebeu a mácula de Ayael",                         "danger": true},
    {"text": "Diego Vans Loupd''or capturado pela Blackflame",             "danger": true},
    {"text": "Käthryn recuperou a espada de família nas ruínas do castelo", "danger": false}
  ]'::jsonb,
  '[]'::jsonb,
  'Investigar a origem da mácula de Lawrence. Encontrar rastro de Diego.',
  'O grupo precisa chegar a Silverhain antes que Oshain feche as estradas.'
);
```

### 11.7 Template UPDATE — atualizar sessão existente

```sql
UPDATE sessions
SET
  title           = 'Título Atualizado',
  summary         = 'Novo resumo de uma linha.',
  narrative       = '[
    "Parágrafo atualizado da narrativa.",
    "Segundo parágrafo."
  ]'::jsonb,
  keypoints       = '[
    {"text": "Ponto-chave atualizado", "danger": false}
  ]'::jsonb,
  cast            = '["Käthryn", "Lawrence"]'::jsonb,
  places          = '["Local 1", "Local 2"]'::jsonb,
  updated_at      = NOW()
WHERE num = 7;
```

> O UPDATE de sessão usa `WHERE num = 7` (número da sessão), não o UUID.

---

## 12. Checklist antes de executar

### Geral (todos os tipos)
- [ ] Aspas simples dentro de strings estão duplicadas (`''`)
- [ ] Todos os campos JSONB terminam com `::jsonb`
- [ ] JSON válido (sem trailing commas, chaves com aspas duplas)
- [ ] Nomes próprios com grafia correta (ex: **Lindhaven**, não Lidhaven)
- [ ] Targets de `related` apontam para slugs/nums existentes
- [ ] UPDATE inclui `updated_at = NOW()`
- [ ] UPDATE inclui **todos** os campos JSONB (não apenas os que mudaram)

### Personagens (`characters`)
- [ ] ID gerado via slugify (sem acentos, sem símbolos)
- [ ] `sections` usa `"paras"` e não `"body"` ou `"paragraphs"`
- [ ] `tag` e `tagClass` estão sincronizados (ex: `PC` / `pc`)
- [ ] `"tagClass"` com aspas duplas no nome da coluna SQL
- [ ] `placeholder = false` se o artigo está completo

### Divindades (`deities`)
- [ ] ID gerado via slugify
- [ ] `sigil` é um dos valores válidos da lista (Dragon, Dawn, Chain…)
- [ ] `sections` usa `"paras"`
- [ ] `placeholder = false` se o artigo está completo

### Sessões (`sessions`)
- [ ] `num` é único e não conflita com sessões existentes
- [ ] `"dateShort"` e `"locationDetail"` com aspas duplas no nome da coluna SQL
- [ ] `keypoints` usa `{text, danger}` e não apenas strings
- [ ] UPDATE usa `WHERE num = X` (não o UUID)
- [ ] `cast` com `(NPC)` para identificar NPCs corretamente

---

## 13. Onde executar

**Supabase Dashboard → SQL Editor**

1. Acesse o painel do Supabase do projeto
2. Clique em **SQL Editor** no menu lateral
3. Cole o SQL e clique em **Run**
4. Se aparecer `Success` sem erros, recarregue a wiki — os dados aparecem imediatamente

Se houver erro de sintaxe JSON, o Supabase vai indicar a posição do problema na mensagem de erro.
