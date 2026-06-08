# Guia de Estrutura dos Artigos — Arquivo de Valiran

> **Versão:** Junho 2026  
> **Stack:** React 18 (Babel) · Supabase (PostgreSQL) · GitHub Pages  
> Documento de referência para a equipe de conteúdo.

---

## Sumário

1. [Como os dados funcionam](#1-como-os-dados-funcionam)
2. [Personagens — PC e NPC](#2-personagens--pc-e-npc)
3. [Estrutura de Seções (compartilhada)](#3-estrutura-de-seções-compartilhada)
4. [Divindades](#4-divindades)
5. [Sessões](#5-sessões)
6. [Linha do Tempo](#6-linha-do-tempo)
7. [Eventos](#7-eventos)
8. [Facções](#8-facções)
9. [Reinos — Mapa Hexagonal](#9-reinos--mapa-hexagonal)
10. [Regras da Casa](#10-regras-da-casa)
11. [Cuidados técnicos com SQL](#11-cuidados-técnicos-com-sql)
12. [Referência rápida de rotas](#12-referência-rápida-de-rotas)

---

## 1. Como os dados funcionam

Todos os dados vivos da wiki ficam no **Supabase** (PostgreSQL). O frontend carrega tudo via `DB.loadAll()` quando a página abre e atualiza a interface ao receber o evento `db-refresh`.

**PCs e NPCs usam a mesma tabela** (`characters`), separados pelo campo `tag`.  
**Artigos de campanha** (`campanha3`, `rogue1`, etc.) também ficam nessa tabela com `tag = 'ARTICLE'`.

---

## 2. Personagens — PC e NPC

**Tabela:** `characters`

### Campos principais

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | `text` PK | Sim | Slug único. Ex: `"diego-vans-loupd-or"`. Nunca mudar após criar. |
| `name` | `text` | Sim | Nome completo do personagem |
| `role` | `text` | Não | Subtítulo/função. Ex: `"Guerreiro · Campanha 3"` |
| `tag` | `text` | Sim | Define onde aparece (ver tabela abaixo) |
| `tagClass` | `text` | Sim | Classe CSS do badge (ver tabela abaixo) |
| `campaign` | `text` | Não | Nome da campanha. Ex: `"Campanha 3 — The Walker's"` |
| `hero` | `text` | Não | Frase de abertura exibida em destaque no topo do artigo |
| `placeholder` | `boolean` | Sim | `false` = artigo ativo · `true` = exibe banner "Em compilação" |
| `infobox` | `jsonb` | Sim | Coluna lateral (ver estrutura abaixo) |
| `sections` | `jsonb` | Sim | Array de seções colapsáveis (ver Seção 3) |
| `related` | `jsonb` | Não | Links relacionados no rodapé do infobox |

### Valores de `tag` e `tagClass`

| `tag` | `tagClass` | Aparece em | Badge |
|---|---|---|---|
| `"PC"` | `"pc"` | Galeria de PCs (`#/characters`) | Dourado |
| `"ALIADO"` | `"ally"` | Galeria de NPCs (`#/npcs`) | Verde |
| `"INIMIGO"` | `"foe"` | Galeria de NPCs (`#/npcs`) | Vermelho |
| `"NPC"` | `"npc"` | Galeria de NPCs (`#/npcs`) | Neutro |
| `"ARTICLE"` | `null` | Não aparece em galeriais | — |

### Estrutura do `infobox`

```json
{
  "rows": [
    { "k": "Raça",    "v": "Humano" },
    { "k": "Classe",  "v": "Guerreiro · Nível 8" },
    { "k": "Status",  "v": "Ativo",   "ok": true },
    { "k": "Status",  "v": "Morto",   "danger": true },
    { "k": "Origem",  "v": "Lindhaven" }
  ],
  "statusNote": "Texto opcional no rodapé do infobox."
}
```

- `"ok": true` → valor aparece em verde
- `"danger": true` → valor aparece em vermelho
- `"statusNote"` → caixa de nota separada abaixo das linhas

### Estrutura do `related`

```json
[
  { "tag": "FACÇÃO",  "title": "Os Caminhantes",  "target": "factions" },
  { "tag": "SESSÃO",  "title": "S12 · O Ritual",  "target": "session:12" },
  { "tag": "DIVIND.", "title": "Bahamut",           "target": "deity:bahamut" }
]
```

- `target` usa o mesmo formato das rotas do hash: `deity:id`, `character:id`, `npc:id`, `session:num`, `factions`, `pantheon`, `map`, etc.

### SQL — Criar personagem

```sql
INSERT INTO characters (
  id, name, role, tag, "tagClass", campaign,
  hero, placeholder, infobox, sections, related, updated_at
) VALUES (
  'nome-do-personagem',
  'Nome Completo',
  'Guerreiro · Campanha 3',
  'PC',
  'pc',
  'Campanha 3 — The Walker''s',
  'Frase de abertura do personagem.',
  false,
  '{"rows":[{"k":"Raça","v":"Humano"},{"k":"Classe","v":"Guerreiro · Nível 8"}]}'::jsonb,
  '[]'::jsonb,
  '[]'::jsonb,
  now()
);
```

### SQL — Atualizar seções de um personagem

```sql
UPDATE characters
SET
  sections = '[
    {
      "title": "Título da Seção",
      "eyebrow": "Texto acima do título",
      "location": "Lindhaven",
      "session": "Sessão 12",
      "date": "14 · Out · 1277",
      "tags": ["encontro", "intriga"],
      "paras": [
        "Primeiro parágrafo.",
        "Segundo parágrafo."
      ]
    }
  ]'::jsonb,
  updated_at = now()
WHERE id = 'nome-do-personagem';
```

---

## 3. Estrutura de Seções (compartilhada)

As seções aparecem em **Personagens (PC e NPC)** e **Divindades**. São exibidas como acordeões colapsáveis com toolbar de busca e filtro por tag.

### Campos de uma seção

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `title` | `string` | Sim | Título principal do acordeão |
| `paras` | `string[]` | Sim | Array de parágrafos. Cada item = um `<p>`. |
| `eyebrow` | `string` | Não | Texto pequeno acima do título (ex: "Primeiro Contato") |
| `location` | `string` | Não | Local do evento — exibido com ícone de pin |
| `session` | `string` | Não | Número da sessão — exibido com ícone de pergaminho |
| `date` | `string` | Não | Data in-game — exibido com ícone de relógio |
| `tags` | `string[]` | Não | Tags de filtro. Ex: `["encontro", "intriga"]` |
| `redacted` | `boolean` | Não | `true` → substitui `[REDIGIDO]` nos parágrafos por barra preta |

### Exemplo completo de seção

```json
{
  "title": "A Chegada em Lindhaven",
  "eyebrow": "Primeira Sessão",
  "location": "Lindhaven",
  "session": "Sessão 1",
  "date": "03 · Mar · 1277",
  "tags": ["chegada", "aliança"],
  "redacted": false,
  "paras": [
    "O grupo chegou à cidade portuária após três dias de viagem.",
    "Foi em Lindhaven que Diego conheceu [REDIGIDO] pela primeira vez."
  ]
}
```

> **Dica:** Parágrafos com `[REDIGIDO]` só aparecem como barra se `"redacted": true`. Sem essa flag, `[REDIGIDO]` aparece como texto literal.

---

## 4. Divindades

**Tabela:** `deities`

### Campos principais

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | `text` PK | Sim | Slug. Ex: `"bahamut"` |
| `name` | `text` | Sim | Nome da divindade |
| `epithet` | `text` | Não | Epíteto. Ex: `"O Deus Platina"` |
| `sigil` | `text` | Não | Nome do componente SVG do símbolo sagrado |
| `hero` | `text` | Não | Frase de abertura |
| `placeholder` | `boolean` | Sim | `false` = ativo · `true` = Em compilação |
| `infobox` | `jsonb` | Sim | Mesma estrutura de Personagens |
| `sections` | `jsonb` | Sim | Mesma estrutura (Seção 3) |
| `related` | `jsonb` | Não | Mesma estrutura de Personagens |

### Sigils disponíveis

Os sigils são componentes SVG criados manualmente. Os existentes são:
`Crown`, `Dragon`, `Tome`, `Chain`, `Sword`, `Skull`, `Moon`, `Eye`, `Flame`, `Wave`, `Tree`, `Dawn`

> Novos sigils precisam ser criados em `sigils.jsx` ou `sigils-deities.jsx` pelo dev.

### SQL — Criar divindade

```sql
INSERT INTO deities (
  id, name, epithet, sigil, hero, placeholder,
  infobox, sections, related, updated_at
) VALUES (
  'nome-da-divindade',
  'Nome da Divindade',
  'O Epíteto',
  'Flame',
  'Frase de abertura.',
  false,
  '{"rows":[{"k":"Domínio","v":"Fogo e Destruição"},{"k":"Status","v":"Ativo","ok":true}]}'::jsonb,
  '[]'::jsonb,
  '[]'::jsonb,
  now()
);
```

---

## 5. Sessões

**Tabela:** `sessions`

### Campos principais

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `num` | `integer` | Sim | Número da sessão (chave natural, ex: `45`) |
| `title` | `text` | Sim | Título. Ex: `"O Encontro em Lindhaven"` |
| `date` | `text` | Não | Data real da sessão. Ex: `"2026-04-12"` |
| `dateShort` | `text` | Não | Data abreviada. Ex: `"12 Abr"` |
| `location` | `text` | Não | Local principal da sessão |
| `locationDetail` | `text` | Não | Detalhe do local |
| `duration` | `text` | Não | Duração. Ex: `"4h30"` |
| `session_xp` | `text` | Não | XP ganho na sessão |
| `summary` | `text` | Não | Resumo curto (uma frase) |
| `cast` | `jsonb` | Sim | Array de nomes dos jogadores presentes |
| `places` | `jsonb` | Sim | Array de locais visitados |
| `narrative` | `jsonb` | Sim | Array de parágrafos da narrativa |
| `keypoints` | `jsonb` | Sim | Array de pontos-chave (bullets) |
| `loot` | `jsonb` | Sim | Array de itens obtidos |
| `gmnote` | `text` | Não | Nota privada do GM (não exibida para jogadores) |
| `next` | `text` | Não | Prévia da próxima sessão |

### SQL — Criar sessão

```sql
INSERT INTO sessions (
  num, title, date, "dateShort", location, duration, session_xp,
  summary, cast, places, narrative, keypoints, loot, next, updated_at
) VALUES (
  45,
  'O Encontro em Lindhaven',
  '2026-04-12',
  '12 Abr',
  'Lindhaven',
  '4h',
  '450 XP',
  'O grupo chega a Lindhaven e descobre um segredo antigo.',
  '["Diego", "Lawrence", "Revna"]'::jsonb,
  '["Porto de Lindhaven", "Taverna do Corvo"]'::jsonb,
  '["Primeiro parágrafo da narrativa.", "Segundo parágrafo."]'::jsonb,
  '["Descobriram o contrabando no porto.", "Lawrence reconheceu o símbolo da Ordem."]'::jsonb,
  '["Mapa do porto (comum)", "50 po cada"]'::jsonb,
  'O grupo planeja investigar os armazéns na próxima sessão.',
  now()
);
```

---

## 6. Linha do Tempo

**Tabela:** `timeline_events`

### Campos principais

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `era` | `text` | Não | Era histórica. Ex: `"Segunda Era"` |
| `year` | `text` | Sim | Ano. Ex: `"1277"` ou `"c. 800"` |
| `label` | `text` | Não | Rótulo curto exibido na linha |
| `title` | `text` | Sim | Título do evento |
| `description` | `text` | Não | Descrição detalhada |
| `tag` | `text` | Não | Tag de categoria. Ex: `"guerra"`, `"magia"`, `"política"` |
| `kind` | `text` | Não | Tipo visual: `"major"` (destaque) ou deixar vazio |
| `sort_order` | `integer` | Sim | Ordem de exibição na linha do tempo |

### SQL — Criar evento de linha do tempo

```sql
INSERT INTO timeline_events (
  era, year, label, title, description, tag, kind, sort_order
) VALUES (
  'Terceira Era',
  '1277',
  'Queda de Ash''tor',
  'A Queda de Ash''tor',
  'A cidade caiu após o cerco de três meses pelas forças de Drakenmoor.',
  'guerra',
  'major',
  320
);
```

---

## 7. Eventos

**Tabela:** `events`

Eventos são diferentes da Linha do Tempo — aparecem na aba **Eventos** como um registro mais operacional da campanha.

### Campos principais

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `year` | `text` | Não | Ano in-game |
| `cat` | `text` | Não | Categoria interna. Ex: `"politica"` |
| `catLabel` | `text` | Não | Label exibido. Ex: `"Política"` |
| `title` | `text` | Sim | Título do evento |
| `desc` | `text` | Não | Descrição |
| `region` | `text` | Não | Região do mapa |
| `target` | `text` | Não | Rota de navegação ao clicar |
| `sort_order` | `integer` | Sim | Ordem de exibição |

---

## 8. Facções

**Tabela:** `factions`

### Campos principais

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | `text` PK | Sim | Slug. Ex: `"os-caminhantes"` |
| `name` | `text` | Sim | Nome da facção |
| `alias` | `text` | Não | Apelido ou nome alternativo |
| `stamp` | `text` | Não | Código do brasão/stamp |
| `stamp_class` | `text` | Não | Classe CSS do stamp |
| `rows` | `jsonb` | Sim | Array de linhas de stats (mesmo formato do infobox) |
| `summary` | `text` | Não | Resumo |
| `sort_order` | `integer` | Sim | Ordem de exibição |

---

## 9. Reinos — Mapa Hexagonal

O mapa hexagonal usa **4 tabelas** interligadas. Os dados do mapa de hexágonos substituíram a aba antiga de Reinos — `#/kingdoms` redireciona para `#/map`.

### 9.1 Tabela `realms` (reinos)

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | `uuid` PK | ID automático |
| `slug` | `text` | Slug único. Ex: `"oshain"` |
| `name` | `text` | Nome completo. Ex: `"Reino de Oshain"` |
| `short` | `text` | Nome curto para o mapa. Ex: `"Oshain"` |
| `eyebrow` | `text` | Subtítulo. Ex: `"Monarquia · Expansionista"` |
| `sigil` | `text` | Nome do sigil SVG |
| `motto` | `text` | Lema do reino |
| `desc` | `text` | Descrição |
| `accent` | `text` | Cor hex do reino no mapa. Ex: `"#c47a3a"` |
| `accent_deep` | `text` | Cor escura (hover/seleção). Ex: `"#8a5020"` |
| `cursed` | `boolean` | `true` = exibe efeito especial no mapa |
| `capital_q`, `capital_r` | `integer` | Coordenadas hex da capital |
| `capital_name` | `text` | Nome da cidade capital |
| `stats6` | `jsonb` | 6 estatísticas para radar. Ex: `{"Militar":80,"Econômico":60,...}` |
| `resources` | `jsonb` | Array de recursos. Ex: `["Ferro","Trigo"]` |
| `sort_order` | `integer` | Ordem de exibição na galeria |

### 9.2 Tabela `realm_hexes` (hexágonos)

| Campo | Tipo | Descrição |
|---|---|---|
| `realm_id` | `uuid` FK | ID do reino |
| `q`, `r` | `integer` | Coordenadas do hexágono (sistema axial) |
| `biome` | `text` | Tipo de bioma: `"plain"`, `"forest"`, `"mountain"`, `"desert"`, `"swamp"`, `"tundra"` |

### 9.3 Tabela `realm_cities` (cidades)

| Campo | Tipo | Descrição |
|---|---|---|
| `realm_id` | `uuid` FK | ID do reino |
| `q`, `r` | `integer` | Coordenadas do hexágono onde fica a cidade |
| `kind` | `text` | Tipo: `"capital"`, `"city"`, `"town"`, `"fortress"` |
| `name` | `text` | Nome da cidade |
| `critical` | `boolean` | `true` = destaque especial no mapa |

### 9.4 Tabela `realm_rivers` (rios)

| Campo | Tipo | Descrição |
|---|---|---|
| `realm_id` | `uuid` FK | ID do reino |
| `path` | `jsonb` | Array de coordenadas do percurso. Ex: `[{"q":2,"r":3},{"q":2,"r":4}]` |
| `name` | `text` | Nome do rio |

---

## 10. Regras da Casa

**Tabela:** `houserules`

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | `uuid` PK | Auto | ID automático |
| `title` | `text` | Sim | Título da regra |
| `paragraphs` | `jsonb` | Sim | Array de parágrafos |
| `callout_label` | `text` | Não | Label da caixa de destaque. Ex: `"ATENÇÃO"` |
| `callout_text` | `text` | Não | Texto da caixa de destaque |
| `sort_order` | `integer` | Sim | Ordem de exibição |

---

## 11. Cuidados técnicos com SQL

### 1. Apóstrofos em strings SQL
Use `''` (dois apóstrofos) para escapar aspas simples dentro de strings:
```sql
-- Errado:
'Loupd'or'

-- Correto:
'Loupd''or'
```

### 2. Cast de JSONB
Todo campo JSON precisa do cast `::jsonb`:
```sql
sections = '[...]'::jsonb
infobox  = '{...}'::jsonb
```

### 3. JSON válido — vírgulas e aspas
- **Sem vírgula** após o último elemento de array/objeto
- **Aspas duplas** `"` para chaves e valores string (nunca `'` dentro do JSON)
- Valide em [jsonlint.com](https://jsonlint.com) antes de rodar

### 4. `"tagClass"` entre aspas duplas
O nome da coluna tem camelCase e precisa de aspas duplas no SQL:
```sql
UPDATE characters SET "tagClass" = 'ally' WHERE id = '...';
```

### 5. `"dateShort"` e `"locationDetail"` também precisam de aspas
```sql
INSERT INTO sessions (..., "dateShort", "locationDetail") VALUES (...);
```

### 6. `placeholder = false` para artigos ativos
Sempre defina explicitamente. Se omitir, o artigo pode aparecer como "Em compilação".

### 7. UPDATE substitui o campo inteiro
Um `UPDATE` em `sections` ou `infobox` apaga o conteúdo anterior. Sempre inclua o JSON completo com todas as seções existentes + as novas.

### 8. `id` nunca muda
O `id` (slug) é a chave primária e é usado nas URLs (`#/character:id`). Mudar o id quebra todos os links externos.

### 9. Targets em `related` devem existir
Se colocar `"target": "deity:xathyr"`, o artigo `xathyr` precisa existir em `deities`. Links quebrados não causam erro, mas geram tela de "não encontrado".

### 10. Colunas `paras` vs `body`
A coluna correta é `sections` (JSONB com array de seções). Não existe coluna `body` ou `paras` no nível da tabela — `paras` é um campo **dentro** de cada objeto do array `sections`.

---

## 12. Referência rápida de rotas

| Rota hash | Componente | Dados |
|---|---|---|
| `#/` ou `#/home` | Portal | Feed de recentes |
| `#/characters` | Galeria de PCs | `characters` onde `tag = 'PC'` |
| `#/character:id` | Detalhe PC | `characters[id]` |
| `#/npcs` | Galeria de NPCs | `characters` onde `tag ≠ 'PC'` e `≠ 'ARTICLE'` |
| `#/npc:id` | Detalhe NPC | `characters[id]` |
| `#/pantheon` | Panteão | `deities` |
| `#/deity:id` | Detalhe Divindade | `deities[id]` |
| `#/sessions` | Lista de Sessões | `sessions` |
| `#/session:num` | Detalhe Sessão | `sessions[num]` |
| `#/timeline` | Linha do Tempo | `timeline_events` |
| `#/events` | Eventos | `events` |
| `#/factions` | Facções | `factions` |
| `#/map` | Mapa Hexagonal | `realms` + `realm_hexes` + `realm_cities` |
| `#/kingdoms` | — | Redireciona para `#/map` |
| `#/house-rules` | Regras da Casa | `houserules` |
| `#/recent` | Recentes | Feed agregado |

---

*Gerado automaticamente a partir do código-fonte — projeto Wiki Valiran Claudio.*
