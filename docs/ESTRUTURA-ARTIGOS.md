# Estrutura de Artigos — O Arquivo de Valiran

> Guia técnico para geração de MDs de importação em massa.
> Cada seção descreve os campos, tipos, formatações especiais e exemplos de INSERT SQL prontos.

---

## Convenções globais

### Slugify (geração de ID)
```
nome → minúsculas → remover acentos (NFD) → substituir não-alfanumérico por "-" → trim hyphens
Exemplo: "Annabella Whiteflame" → "annabella-whiteflame"
         "Lamidriel, o Titã"    → "lamidriel-o-tita"
```

### Timestamps
Todos os campos `created_at` e `updated_at` aceitam ISO 8601 ou `NOW()`.

### Rotas de navegação (campo `target`)
| Formato | Destino |
|---|---|
| `deity:slug` | Artigo de divindade |
| `character:slug` | Artigo de personagem/NPC |
| `session:num` | Sessão específica |
| `pantheon` | Página do panteão |
| `kingdoms` | Página de reinos |
| `factions` | Página de facções |
| `timeline` | Linha do tempo |
| `sessions` | Diário de sessões |
| `house-rules` | Regras da casa |
| `article` | Artigo estático (Ayael) |

---

## 1. Divindades (`deities`)

### Tabela SQL
```sql
CREATE TABLE IF NOT EXISTS deities (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  epithet     TEXT,
  sigil       TEXT,
  infobox     JSONB DEFAULT '{"rows":[]}',
  hero        TEXT,
  sections    JSONB DEFAULT '[]',
  related     JSONB DEFAULT '[]',
  placeholder BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### Campos

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | text | ✓ | Slug único (slugify do nome) |
| `name` | text | ✓ | Nome da divindade |
| `epithet` | text | | Epíteto (ex: "O que Sangra Luz") |
| `sigil` | text | | ID do ícone SVG (ver lista abaixo) |
| `placeholder` | boolean | | `true` = entrada incompleta, sem artigo |
| `hero` | text | | Citação ou parágrafo de abertura |
| `infobox` | jsonb | | Ver estrutura abaixo |
| `sections` | jsonb | | Ver estrutura abaixo |
| `related` | jsonb | | Ver estrutura abaixo |

### Sigils disponíveis
`Dragon` · `Dawn` · `Chain` · `Sun` · `Moon` · `Skull` · `Eye` · `Flame` · `Wave` · `Tree` · `Crown` · `Sword`

### Estrutura: `infobox`
```json
{
  "rows": [
    { "k": "Tipo",       "v": "Divindade Maior" },
    { "k": "Domínio",    "v": "Luz, Sacrifício", "danger": true },
    { "k": "Alinhamento","v": "Leal-Bom",         "ok": true },
    { "k": "Plano",      "v": "Sétimo Céu" },
    { "k": "Símbolo",    "v": "Chama ascendente" },
    { "k": "Adoradores", "v": "Paladinos, clérigos de Pelor" },
    { "k": "Status",     "v": "Ativo" }
  ],
  "statusNote": "Texto opcional no rodapé da infobox."
}
```
- `danger: true` → texto em vermelho  
- `ok: true` → texto em verde

### Estrutura: `sections`
```json
[
  {
    "title": "Origem",
    "paras": [
      "Primeiro parágrafo da seção.",
      "Segundo parágrafo. Cada string é um <p>."
    ]
  },
  {
    "title": "O Aprisionamento",
    "paras": ["Texto da segunda seção."]
  }
]
```

### Estrutura: `related`
```json
[
  { "tag": "Plano",        "title": "Plano de Energia Negativa", "target": "article" },
  { "tag": "Titã",         "title": "Lamidriel, a Mão que Cria", "target": "character:lamidriel" },
  { "tag": "Evento",       "title": "A Queda de Lancaster",      "target": "timeline" },
  { "tag": "Organização",  "title": "Blackflame",               "target": "factions" }
]
```

### Exemplo de INSERT
```sql
INSERT INTO deities (id, name, epithet, sigil, placeholder, hero, infobox, sections, related)
VALUES (
  'lamidriel',
  'Lamidriel',
  'A Mão que Cria',
  'Tree',
  false,
  'Antes do mundo, havia apenas a vontade.',
  '{
    "rows": [
      {"k":"Tipo","v":"Titã"},
      {"k":"Domínio","v":"Criação, Magia"},
      {"k":"Plano","v":"Além da Trama"},
      {"k":"Status","v":"Retirado"}
    ]
  }'::jsonb,
  '[
    {"title":"Origem","paras":["Lamidriel existia antes da Trama.","Ele teceu os primeiros fios do mundo."]},
    {"title":"O Silêncio","paras":["Após a criação, retirou-se para além do alcance dos mortais."]}
  ]'::jsonb,
  '[
    {"tag":"Filho","title":"Ayael, o que Sangra Luz","target":"article"},
    {"tag":"Conceito","title":"A Trama Mágica","target":"article"}
  ]'::jsonb
);
```

---

## 2. Personagens (PCs e NPCs) (`characters`)

PCs e NPCs compartilham a mesma tabela. O campo `tag` diferencia.

### Tabela SQL
```sql
CREATE TABLE IF NOT EXISTS characters (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  role        TEXT,
  tag         TEXT DEFAULT 'NPC',
  tagClass    TEXT DEFAULT 'npc',
  campaign    TEXT,
  hero        TEXT,
  placeholder BOOLEAN DEFAULT true,
  infobox     JSONB DEFAULT '{"rows":[]}',
  sections    JSONB DEFAULT '[]',
  related     JSONB DEFAULT '[]',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### Campos

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | text | ✓ | Slug único |
| `name` | text | ✓ | Nome completo |
| `role` | text | | Papel curto (ex: "Paladina dissidente · Lancaster") |
| `tag` | text | | `PC` \| `ALIADO` \| `INIMIGO` \| `NPC` |
| `tagClass` | text | | Classe CSS: `pc` \| `ally` \| `foe` \| `npc` |
| `campaign` | text | | Nome da campanha (usado nos filtros) |
| `hero` | text | | Citação de abertura do artigo |
| `placeholder` | boolean | | `true` = sem artigo completo |
| `infobox` | jsonb | | Mesma estrutura das divindades |
| `sections` | jsonb | | Mesma estrutura das divindades |
| `related` | jsonb | | Mesma estrutura das divindades |

### Mapa tag → tagClass
| tag | tagClass |
|---|---|
| `PC` | `pc` |
| `ALIADO` | `ally` |
| `INIMIGO` | `foe` |
| `NPC` | `npc` |

### Campo `Status` no infobox (afeta badge visual)
O sistema detecta automaticamente o bucket de status pela chave `"Status"` no infobox:

| Valor (começo) | Badge | Cor |
|---|---|---|
| `ATIV…` | ATIVO | Verde-musgo |
| `MORT…` / `FALEC…` | MORTO | Vinho (+ faixa diagonal) |
| `DESAPAREC…` | DESAPARECIDO | Dourado |
| `CATIV…` / `PRISIONEIR…` / `REFÉM…` | CATIVO | Dourado |
| `EM FUGA` / `FORAGID…` | EM FUGA | Vinho |
| Qualquer outro texto | Primeiros 16 chars | Dourado |

### Exemplo de INSERT (PC completo)
```sql
INSERT INTO characters (id, name, role, tag, tagClass, campaign, hero, placeholder, infobox, sections, related)
VALUES (
  'kathryn',
  'Käthryn Velhaur',
  'Paladina dissidente · herdeira de Lancaster',
  'PC',
  'pc',
  'Campanha 3 — A Queda',
  '"Eu não sirvo a deuses. Eu sirvo ao que restou deles."',
  false,
  '{
    "rows": [
      {"k":"Classe","v":"Paladina / Cavaleira Negra"},
      {"k":"Origem","v":"Lancaster (destruída)"},
      {"k":"Raça","v":"Humana"},
      {"k":"Filiação","v":"Patrulha Prateada (ex)"},
      {"k":"Status","v":"Ativa"},
      {"k":"Nível","v":"12"}
    ]
  }'::jsonb,
  '[
    {"title":"História","paras":["Nascida na nobreza de Lancaster...","Após a queda do reino..."]},
    {"title":"Personalidade","paras":["Käthryn é reservada e pragmática."]}
  ]'::jsonb,
  '[
    {"tag":"Reino","title":"Lancaster (destruída)","target":"kingdoms"},
    {"tag":"Evento","title":"A Queda de Lancaster","target":"timeline"}
  ]'::jsonb
);
```

### Exemplo de INSERT (NPC simples / placeholder)
```sql
INSERT INTO characters (id, name, role, tag, tagClass, campaign, hero, placeholder)
VALUES (
  'annabella-whiteflame',
  'Annabella Whiteflame',
  'Rainha de Oshain · antagonista principal',
  'INIMIGO',
  'foe',
  'Campanha 3 — A Queda',
  '"A proteção tem um custo. Sempre teve."',
  true
);
```

---

## 3. Sessões (`sessions`)

### Tabela SQL
```sql
CREATE TABLE IF NOT EXISTS sessions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  num             INTEGER NOT NULL,
  title           TEXT NOT NULL,
  date            TEXT,
  "dateShort"     TEXT,
  location        TEXT,
  "locationDetail" TEXT,
  summary         TEXT,
  cast            JSONB DEFAULT '[]',
  places          JSONB DEFAULT '[]',
  narrative       JSONB DEFAULT '[]',
  keypoints       JSONB DEFAULT '[]',
  loot            JSONB DEFAULT '[]',
  gmnote          TEXT,
  next            TEXT,
  duration        TEXT,
  session_xp      TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### Campos

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `num` | integer | ✓ | Número da sessão |
| `title` | text | ✓ | Título da sessão |
| `date` | text | | Data por extenso (ex: "14 do Segundo Mês, 1281") |
| `dateShort` | text | | Data curta (ex: "14 · MAI · 1281") |
| `location` | text | | Nome do local principal |
| `locationDetail` | text | | Descrição geográfica do local |
| `summary` | text | | Resumo de uma linha |
| `cast` | jsonb (string[]) | | Lista de nomes; NPCs com " (NPC)" no final |
| `places` | jsonb (string[]) | | Lista de locais visitados |
| `narrative` | jsonb (string[]) | | Parágrafos de narração (cada string = 1 `<p>`) |
| `keypoints` | jsonb (object[]) | | Ver estrutura abaixo |

### Estrutura: `cast`
```json
["Käthryn", "Halric", "Tannis (NPC)", "Guardião da Tumba (NPC)"]
```

### Estrutura: `keypoints`
```json
[
  { "text": "Käthryn jurou silêncio perante o Conselho.",  "danger": false },
  { "text": "Tannis: corrupção detectada — grau II.",      "danger": true  },
  { "text": "Encontrado mapa parcial da Tumba dos Hereges.", "danger": false }
]
```
`danger: true` → linha exibida em vermelho.

### Exemplo de INSERT
```sql
INSERT INTO sessions (num, title, date, "dateShort", location, "locationDetail", summary, cast, places, narrative, keypoints)
VALUES (
  24,
  'As Marcas no Pântano',
  '21 do Segundo Mês, 1281',
  '21 · MAI · 1281',
  'Pântanos de Velheath',
  'Região fronteiriça entre Oshain e Nova Lancaster',
  'O grupo descobre marcas planares nos pântanos e enfrenta um arauto corrompido.',
  '["Käthryn","Halric","Tannis (NPC)"]'::jsonb,
  '["Pântanos de Velheath","Posto Abandonado de Oshain"]'::jsonb,
  '["A névoa ainda cobria o pântano quando o grupo avistou as primeiras marcas.","Eram círculos gravados na lama — geometria que nenhum deles reconhecia."]'::jsonb,
  '[{"text":"Marcas identificadas como selagem planar invertida","danger":false},{"text":"Arauto corrompido eliminado — fragmento de cristal recuperado","danger":false},{"text":"Käthryn absorveu traço de energia negativa","danger":true}]'::jsonb
);
```

---

## 4. Reinos (`kingdoms`)

### Tabela SQL
```sql
CREATE TABLE IF NOT EXISTS kingdoms (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  eyebrow     TEXT,
  sigil       TEXT,
  motto       TEXT,
  desc        TEXT,
  stats       JSONB DEFAULT '[]',
  target      TEXT,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### Campos

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `name` | text | ✓ | Nome do reino |
| `eyebrow` | text | | Descriptor (ex: "Monarquia · expansionista") |
| `sigil` | text | | ID do ícone (mesma lista das divindades) |
| `motto` | text | | Lema entre aspas |
| `desc` | text | | Descrição em prosa |
| `stats` | jsonb | | Ver estrutura abaixo |
| `target` | text | | Rota de navegação ao clicar no card |
| `sort_order` | integer | | Ordem de exibição |

### Estrutura: `stats`
```json
[
  { "k": "Capital",    "v": "Halensgard" },
  { "k": "Liderança",  "v": "Rainha Annabella" },
  { "k": "População",  "v": "≈ 4.2M" },
  { "k": "Alinhamento","v": "Tirânico", "danger": true }
]
```

### Exemplo de INSERT
```sql
INSERT INTO kingdoms (name, eyebrow, sigil, motto, desc, stats, target, sort_order)
VALUES (
  'Império de Ferro',
  'Império militar · isolacionista',
  'Crown',
  '"O ferro não se curva, e não é curvado."',
  'Cortaram sua própria conexão com a Trama Mágica três gerações atrás. Imunes a manipulação arcana — e a benções, e a cura.',
  '[{"k":"Capital","v":"Tor Klain"},{"k":"Liderança","v":"Korvath VII"},{"k":"População","v":"≈ 3.0M"},{"k":"Alinhamento","v":"Leal-Neutro"}]'::jsonb,
  'kingdoms',
  40
);
```

---

## 5. Facções (`factions`)

### Tabela SQL
```sql
CREATE TABLE IF NOT EXISTS factions (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  alias       TEXT,
  stamp       TEXT,
  stamp_class TEXT,
  rows        JSONB DEFAULT '[]',
  summary     TEXT,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### Campos

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | text | ✓ | Slug único |
| `name` | text | ✓ | Nome da facção |
| `alias` | text | | Subtítulo / apelido |
| `stamp` | text | | Texto do carimbo (ex: "CONFIDENCIAL", "OFICIAL") |
| `stamp_class` | text | | `""` = vermelho (padrão) · `"green"` = verde |
| `rows` | jsonb | | Linhas do dossiê (ver estrutura abaixo) |
| `summary` | text | | Resumo/intel da facção |
| `sort_order` | integer | | Ordem de exibição |

### Estrutura: `rows`
```json
[
  { "k": "Fundação",   "v": "Desconhecida" },
  { "k": "Sede",       "v": "[REDIGIDO]",  "redacted": true },
  { "k": "Membros",    "v": "≈ 400 agentes confirmados" },
  { "k": "Operações",  "v": "Espionagem, assassinato político" },
  { "k": "Afiliação",  "v": "Oshain (não confirmada)" }
]
```
`redacted: true` → valor exibido com estilo censurado.

### Exemplo de INSERT
```sql
INSERT INTO factions (id, name, alias, stamp, stamp_class, rows, summary, sort_order)
VALUES (
  'blackflame',
  'Blackflame',
  'A Chama que Não Aparece nos Mapas',
  'CONFIDENCIAL',
  '',
  '[{"k":"Fundação","v":"Desconhecida"},{"k":"Sede","v":"[REDIGIDO]","redacted":true},{"k":"Membros","v":"≈ 400 confirmados"},{"k":"Afiliação","v":"Oshain (não confirmada)"}]'::jsonb,
  'Organização de inteligência e operações encobertas que aparece nas sombras de cada expansão oshainita. Oficialmente inexistente.',
  10
);
```

---

## 6. Linha do Tempo (`timeline_events`)

### Tabela SQL
```sql
CREATE TABLE IF NOT EXISTS timeline_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  era         TEXT,
  year        TEXT,
  label       TEXT,
  title       TEXT,
  desc        TEXT,
  tag         TEXT,
  kind        TEXT,
  sort_order  INTEGER DEFAULT 0
);
```

### Campos

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `era` | text | | Se preenchido, cria **divisor de era** (ignora `title`) |
| `title` | text | | Título do evento (não usar junto com `era`) |
| `year` | text | | Ano in-universe (ex: "3ªE 1276") |
| `label` | text | | Rótulo curto (ex: "Catástrofe", "Fundação") |
| `desc` | text | | Descrição do evento |
| `tag` | text | | Tag de categoria |
| `kind` | text | | `divine` · `catastrophe` · `political` · `arcane` · vazio |
| `sort_order` | integer | | Ordem de exibição (cresce cronologicamente) |

### Regra importante
- Se `era` está preenchido → é um **separador de era** (cabeçalho visual), sem evento associado.
- Se `title` está preenchido → é um **evento normal**. Deixe `era` como NULL.

### Exemplo de INSERT (era)
```sql
INSERT INTO timeline_events (era, sort_order)
VALUES ('A Terceira Era · O Vazamento', 1000);
```

### Exemplo de INSERT (evento)
```sql
INSERT INTO timeline_events (year, label, title, desc, tag, kind, sort_order)
VALUES (
  '3ªE 1276',
  'Catástrofe',
  'A Queda de Lancaster',
  'O Selo da Tumba dos Hereges foi rompido. O reino sagrado de Lancaster colapsa em semanas. Oshain ocupa os destroços.',
  'Político',
  'catastrophe',
  1276
);
```

---

## 7. Eventos de Era (`events`)

> Página diferente da Linha do Tempo — lista categórica de eventos recentes.

### Tabela SQL
```sql
CREATE TABLE IF NOT EXISTS events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year        TEXT,
  cat         TEXT DEFAULT 'pol',
  "catLabel"  TEXT,
  title       TEXT NOT NULL,
  desc        TEXT,
  region      TEXT,
  target      TEXT,
  sort_order  INTEGER DEFAULT 0
);
```

### Campos

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `title` | text | ✓ | Título do evento |
| `year` | text | | Ano (ex: "3ªE 1281") |
| `cat` | text | | `div` · `pol` · `cata` · `arc` |
| `catLabel` | text | | Label gerado do cat (ver tabela abaixo) |
| `desc` | text | | Descrição |
| `region` | text | | Região/local |
| `target` | text | | Rota de navegação ao clicar |
| `sort_order` | integer | | Ordem de exibição |

### Mapa cat → catLabel
| cat | catLabel |
|---|---|
| `div` | Divino |
| `pol` | Político |
| `cata` | Catástrofe |
| `arc` | Arcano |

### Exemplo de INSERT
```sql
INSERT INTO events (year, cat, "catLabel", title, desc, region, target, sort_order)
VALUES (
  '3ªE 1281',
  'div',
  'Divino',
  'Novo Vazamento na Tumba dos Hereges',
  'Patrulheiros da República Prateada reportam aumento na atividade planar próxima a Nova Lancaster.',
  'Nova Lancaster',
  'map',
  10
);
```

---

## 8. Regras da Casa (`houserules`)

### Tabela SQL
```sql
CREATE TABLE IF NOT EXISTS houserules (
  id             TEXT PRIMARY KEY,
  title          TEXT NOT NULL,
  paragraphs     JSONB DEFAULT '[]',
  callout_label  TEXT,
  callout_text   TEXT,
  sort_order     INTEGER DEFAULT 0,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);
```

### Campos

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | text | ✓ | Slug único |
| `title` | text | ✓ | Título da regra |
| `paragraphs` | jsonb (string[]) | | Parágrafos da regra (cada string = 1 `<p>`) |
| `callout_label` | text | | Rótulo do destaque (ex: "Lembrete · Aviso ao Mestre") |
| `callout_text` | text | | Texto do destaque |
| `sort_order` | integer | | Ordem de exibição |

### Exemplo de INSERT
```sql
INSERT INTO houserules (id, title, paragraphs, callout_label, callout_text, sort_order)
VALUES (
  'morte-e-ressurreicao',
  'Morte e Ressurreição',
  '["Personagens reduzidos a 0 PV fazem testes de estabilização normais (D&D 5e p. 197).","Ressurreição requer componentes raros e aprovação narrativa do Mestre — não é garantida.","Morte permanente ativa o protocolo de novo personagem (ver Sessão 0)."]'::jsonb,
  'Aviso ao Mestre',
  'Ressurreições devem ter peso narrativo. Use com parcimônia.',
  30
);
```

---

## Referência rápida de estruturas JSON reutilizáveis

### `infobox` (deities e characters)
```json
{
  "rows": [
    { "k": "Chave", "v": "Valor" },
    { "k": "Chave Perigo", "v": "Valor", "danger": true },
    { "k": "Chave Ok",     "v": "Valor", "ok": true }
  ],
  "statusNote": "Nota opcional no rodapé."
}
```

### `sections` (deities e characters)
```json
[
  {
    "title": "Nome da Seção",
    "paras": ["Parágrafo 1.", "Parágrafo 2."]
  }
]
```

### `related` (deities e characters)
```json
[
  { "tag": "Categoria", "title": "Título do link", "target": "rota-de-navegacao" }
]
```

### `keypoints` (sessions)
```json
[
  { "text": "Ponto normal.", "danger": false },
  { "text": "Ponto crítico — exibido em vermelho.", "danger": true }
]
```

### `stats` (kingdoms)
```json
[
  { "k": "Chave", "v": "Valor" },
  { "k": "Chave Perigo", "v": "Valor", "danger": true }
]
```

### `rows` (factions)
```json
[
  { "k": "Chave", "v": "Valor" },
  { "k": "Censurado", "v": "[REDIGIDO]", "redacted": true }
]
```
