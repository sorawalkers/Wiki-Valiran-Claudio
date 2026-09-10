# Página de Reinos & Potências e Integração com Mapa de Valiran

> Documentação técnica e arquitetural para a aba de Reinos e sua relação com o Mapa Interativo.

---

## 1. Visão Geral

O projeto Arquivo de Valiran possui **duas visualizações complementares do mundo político-geográfico**:

| Elemento | Tipo | Função | Dados |
|----------|------|--------|-------|
| **Mapa de Valiran** | Visualização estática | Mostrar regiões geográficas, capitais, cidades | Hardcoded em `data.jsx` |
| **Reinos & Potências** | Galeria dinâmica | Exibir potências políticas com estatísticas detalhadas | Carregados do Supabase |

Apesar de complementares, **não possuem integração direta no código**. Regiões e Reinos são entidades independentes que poderiam ser conectadas através de um campo relacional.

---

## 2. Página de Reinos & Potências (`kingdoms.jsx`)

### 2.1 Localização e Routing

```
project-backend/pages/kingdoms.jsx
Rota: #/kingdoms (hash routing)
Menu: "Geopolítica · Reinos & Potências"
Ícone: navSword
```

### 2.2 Estrutura de Dados — `Data.kingdoms`

Os dados vêm da tabela `kingdoms` no Supabase PostgreSQL, carregados em tempo de execução via `db.js`.

**Fonte**: `window.sb.from('kingdoms').select('*').order('sort_order')`

**Cada reino é um objeto com**:

```javascript
{
  _id:        "uuid",           // ID único do banco de dados
  name:       "Monarquia de Oshain",  // Nome do reino
  eyebrow:    "Monarquia · expansionista", // Subtítulo / tipo de governo
  sigil:      "Crown",          // Brasão (Crown | Dragon | Tome | Chain | Sword | Skull | Moon | Eye | Flame | Wave | Tree | Dawn)
  motto:      "Sob a chama...", // Lema / divisa (opcional)
  desc:       "Reino expansionista da Rainha Branca...", // Descrição narrativa
  stats: [                       // Estatísticas customizáveis
    { k: "Capital", v: "Halensgard", danger: false },
    { k: "Liderança", v: "Rainha Annabella Whiteflame", danger: false },
    { k: "População", v: "≈ 4.2M almas", danger: false },
    { k: "Alinhamento", v: "Tirânico (oculto)", danger: true },
  ],
  target:     "deity:oshain",    // Link de navegação (opcional) — deity:id | character:id | session:num | kingdoms | factions
  sort_order: 0,                 // Ordem de exibição (crescente)
  created_at: "2024-05-18T...",  // Timestamp de criação
  updated_at: "2024-05-18T...",  // Timestamp de última edição
}
```

**Campos opcionais**: `motto`, `target`, `created_at`, `updated_at` podem ser `null`.

### 2.3 Fluxo de Carregamento

1. **Inicialização** (`index.html` carrega `db.js`)
2. **`window.DB.loadAll()` é chamado** (geralmente na primeira renderização de `App`)
3. **Consulta Supabase**:
   ```javascript
   const kingRes = await window.sb.from('kingdoms').select('*').order('sort_order');
   ```
4. **Mapeamento e normalização** (`db.js`, linhas 210-224):
   ```javascript
   if (kingRes.data) {
     Data.kingdoms = kingRes.data.map(k => ({
       _id:        k.id,
       sigil:      k.sigil || null,
       eyebrow:    k.eyebrow || null,
       name:       k.name,
       motto:      k.motto || null,
       desc:       k.desc || null,
       stats:      k.stats || [],
       target:     k.target || null,
       sort_order: k.sort_order || 0,
       created_at: k.created_at || null,
       updated_at: k.updated_at || null,
     }));
   }
   ```
5. **Dispatch `db-refresh`** — trigger para re-render de componentes
6. **Componente `Kingdoms` renderiza**:
   ```javascript
   const list = (Data.kingdoms || []).slice().sort((a, b) => a.sort_order - b.sort_order);
   ```

### 2.4 Componente Principal — `Kingdoms`

**Props**:
- `onNav` — callback para navegação inter-página (recebe `route:id` como argumento)

**Estado interno**:
- `modal` — `null | 'new' | kingdom object` — controla modal de edição
- `tick` — força re-render quando `db-refresh` é disparado

**Estrutura JSX**:

```
<div className="page">
  ├─ <header className="page-header">
  │  ├─ Eyebrow, título, descrição
  │  └─ Botão "+ Novo Reino" (apenas para editores)
  │
  └─ <div className="kingdom-list">
     ├─ {map} kingdom-card
     │  ├─ <div className="kingdom-crest"> {Sigil icon}
     │  ├─ <div className="kingdom-body">
     │  │  ├─ .kingdom-eyebrow {eyebrow}
     │  │  ├─ .kingdom-name {name}
     │  │  ├─ .kingdom-motto {motto}
     │  │  └─ .kingdom-desc {desc}
     │  └─ <div className="kingdom-stats">
     │     └─ {map} stat-row { k: label, v: value }
     │
     └─ <KingdomModal /> (condicional)
```

### 2.5 Modal de Edição — `KingdomModal`

**Triggered por**:
- Clique no botão "+ Novo Reino"
- Clique no botão "Editar" em um kingdom-card

**Campos editáveis**:
- Nome (obrigatório)
- Eyebrow (tipo de governo / descrição curta)
- Sigilo (dropdown com 12 opções)
- Lema
- Descrição
- Estatísticas (dinâmicas — adicionar/remover linhas)
- Link para artigo (target)
- Ordem de exibição (sort_order)

**Fluxo de salvamento**:

```javascript
async function handleSave(e) {
  e.preventDefault();
  const payload = {
    ...form,
    sort_order: Number(form.sort_order) || 0,
    stats: stats.filter(s => s.k || s.v).map(s => ({
      k: s.k,
      v: s.v,
      danger: s.danger ? true : undefined
    })),
  };
  if (!payload._id) delete payload._id; // NEW — Supabase gera UUID
  await window.DB.saveKingdom(payload); // CRUD em db.js
  onClose();
}
```

**Validações**:
- Nome é obrigatório
- Estatísticas vazias são filtradas antes de salvar
- Campo `danger` é opcional (marca item como crítico em vermelho)

### 2.6 Acesso e Permissões

**Leitura** — público (RLS permite `select` para todos)

**Criação/Edição** — apenas editores e admins
```javascript
const { isEditor } = useAuth(); // Hook em auth.jsx
{isEditor && <button>+ Novo Reino</button>}
{isEditor && <button onClick={() => setModal(k)}>Editar</button>}
```

**Row-Level Security** (RLS) — executada no Supabase:
```sql
create policy "Editores escrevem kingdoms" on kingdoms for all
  using (auth.uid() in (select id from profiles where role in ('editor','admin')));
```

---

## 3. Página do Mapa Interativo (`map.jsx`)

### 3.1 Localização e Routing

```
project-backend/pages/map.jsx
Rota: #/map (hash routing)
Menu: "Geopolítica · Mapa de Valiran"
Ícone: navMap
Restrição: adminOnly (não aparece no menu para viewers/editors)
```

### 3.2 Estrutura de Dados — `Data.regions`

Os dados são **estáticos** e definidos diretamente em `data.jsx`, **não carregados do banco de dados**.

**Cada região é um objeto com**:

```javascript
{
  id:       "oshain",           // ID único (usado para identificar na seleção)
  name:     "Oshain",           // Nome da região
  type:     "Monarquia",        // Tipo de governo / classificação
  desc:     "Reino expansionista...", // Descrição narrativa
  stats: [                       // Estatísticas (idêntico ao format de kingdoms)
    { k: "Capital", v: "Halensgard" },
    { k: "Liderança", v: "Rainha Annabella Whiteflame" },
    { k: "Alinhamento", v: "Tirânico (oculto)", danger: true },
  ],
  
  // Dados gráficos (SVG)
  fill:     "#7a2535",          // Cor de preenchimento (hex)
  stroke:   "#a83545",          // Cor da borda (hex)
  d:        "M 380 120 L 540 100 L 620 180 L 600 280 L 480 320 L 380 280 Z", // SVG path data
  labelX:   490,                // Coordenada X do rótulo no mapa
  labelY:   220,                // Coordenada Y do rótulo no mapa
  
  // Flags opcionais
  cursed:   true,               // [opcional] true = região corrompida (marca com hachura + aviso)
}
```

**Regiões atualmente definidas** (5 regiões):
1. **Oshain** (id: `oshain`) — Monarquia expansionista, capital Halensgard
2. **República Prateada** (id: `bahamut`) — República dracônica, capital Aerithys
3. **Magocracia de Lorean Treaz** (id: `lorean`) — Magocracia, capital Torre Plúrima
4. **Império de Ferro** (id: `iron`) — Império militar, capital Tor Klain
5. **Nova Lancaster** (id: `lancaster`) — Ruínas ocupadas, **CURSED**, capital destruída

### 3.3 Componente Principal — `MapPage`

**Props**:
- `onNav` — callback para navegação inter-página

**Estado interno**:
- `selected` — ID da região selecionada (padrão: `"lancaster"`)

**Estrutura JSX**:

```
<div className="map-page">
  ├─ <div className="map-canvas">
  │  ├─ <div className="map-overlay-top"> Título e eyebrow
  │  ├─ <svg viewBox="0 0 900 600" className="map-svg">
  │  │  ├─ Backgrounds (padrão papel, gradiente mar)
  │  │  ├─ Linhas de coordenada (faint grid)
  │  │  ├─ Outline do continente
  │  │  ├─ {map} regions → <path> clickable
  │  │  │  └─ {map} cursed hatch pattern (se region.cursed === true)
  │  │  ├─ {map} cities → <circle> markers + labels
  │  │  ├─ {map} region labels
  │  │  ├─ Compass rose (canto superior direito)
  │  │  └─ Scale bar (canto inferior esquerdo)
  │  ├─ <div className="map-controls"> +/− Recentralizar (não funcionais)
  │  └─ <div className="map-legend"> Legenda colorida
  │
  └─ <aside className="map-info">
     ├─ Eyebrow "Região selecionada"
     ├─ <h2>{region.name}
     ├─ Tipo de governo
     ├─ Descrição
     ├─ <dl className="map-stats"> Estatísticas
     ├─ {IF region.cursed} Aviso arquivístico (box vermelho)
     └─ Botão "Abrir artigo completo" → onNav('article')
```

### 3.4 Interação — Seleção de Região

**Ao clicar em uma região no mapa**:

```javascript
onClick={() => setSelected(r.id)} // classe CSS 'selected' é aplicada
```

**Efeitos visuais**:
- Classe `.selected` é adicionada ao `<path>` (estilizado em `styles-extra.css`)
- Painel lateral direito atualiza com dados da região selecionada

**O painel lateral renderiza** a região selecionada:
```javascript
const region = Data.regions.find(r => r.id === selected) || Data.regions[0];
```

### 3.5 Elementos Visuais

#### SVG Renderizado:
- **Fundo**: gradiente radial (mar) + padrão de papel (faint dot grid)
- **Continente**: path outline com stroke
- **Regiões**: path preenchido + borda, opacidade 50%
  - **Se cursed**: hachura diagonal em vermelho sobreposta
- **Cidades**: círculos dourados com rótulos (nomes + capitais)
- **Rosa dos ventos**: canto superior direito
- **Escala**: 500 léguas (canto inferior esquerdo)

#### Painel de Legenda:
```
Legenda
━━━━━━━━━━━━━━━━━━━
■ Monarquia de Oshain
■ República Prateada
■ Magocracia Lorean Treaz
■ Império de Ferro
■ Terra Corrompida
```

#### Aviso de Região Cursed:
Se `region.cursed === true`, renderiza box vermelho com ícone ⚠️:
```
⚠ AVISO ARQUIVÍSTICO
Esta região contém uma fenda planar ativa. Não é recomendado
ingresso sem proteção arcana de nível V ou superior.
```

---

## 4. Conexão Entre Reinos e Mapa

### 4.1 Estado Atual — Independência

**No código atual, Reinos e Regiões SÃO INDEPENDENTES**:

| Aspecto | Reinos | Regiões |
|---------|--------|---------|
| **Dados** | Banco de dados (dinâmico) | Hardcoded em data.jsx (estático) |
| **Edição** | Sim — modal CRUD | Não — requer edição de código |
| **Estrutura** | `name`, `eyebrow`, `sigil`, `stats`, `target` | `name`, `type`, `desc`, `stats`, + dados SVG |
| **Renderização** | Cards em galeria | Regiões em mapa SVG |
| **Acesso** | Rota `#/kingdoms` | Rota `#/map` (admin-only) |

### 4.2 Relação Lógica no Mundo de Valiran

Logicamente, **5 Regiões == 5 Reinos**:

| Região | Reino | Capital | Tipo |
|--------|-------|---------|------|
| **oshain** | Monarquia de Oshain | Halensgard | Monarquia expansionista |
| **bahamut** | República Prateada | Aerithys | República dracônica |
| **lorean** | Magocracia de Lorean Treaz | Torre Plúrima | Magocracia |
| **iron** | Império de Ferro | Tor Klain | Império militar |
| **lancaster** | Nova Lancaster (ruínas) | — | Ruínas ocupadas (cursed) |

**Porém**: não há campo relacional conectando `regions[id]` ↔ `kingdoms[region_id]`.

### 4.3 Como Poderiam Ser Integrados

**Opção 1: Adicionar campo `region_id` ao `kingdoms` table**

```sql
ALTER TABLE kingdoms ADD COLUMN region_id TEXT;
```

Então cada reino teria:
```javascript
{
  ...
  region_id: "oshain", // foreign key → Data.regions[id]
  ...
}
```

Benefício: permitir renderizar nome da região no card do reino.

**Opção 2: Sem mudança no banco — apenas nomenclatura**

Manter `id` de reino igual ao `id` de região:
```javascript
// kingdom.id === "oshain" sempre corresponde a region.id === "oshain"
// Implícito, não explícito
```

Benefício: zero mudanças no schema, menos campo para editar.

**Opção 3: Links de navegação cruzada**

Adicionar botão "Ver no mapa" nos cards de reino:
```javascript
<button onClick={() => onNav('map')} // select region automático
  title="Visualizar região no mapa">
  🗺 Ver localização
</button>
```

Benefício: melhor UX para explorar mundo de Valiran.

### 4.4 Navegação Cruzada Atual

Atualmente, **há um botão de navegação no Mapa para artigos estáticos**:

```javascript
// map.jsx, linha 168-182
<button onClick={() => onNav('article')} ...>
  Abrir artigo completo →
</button>
```

Mas não há navegação do Mapa para Reinos ou vice-versa.

---

## 5. Schema de Banco de Dados

### 5.1 Tabela `kingdoms`

```sql
CREATE TABLE kingdoms (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  sigil text,                    -- Nome do sigilo (Crown, Dragon, etc)
  eyebrow text,                  -- Subtítulo / tipo de governo
  name text NOT NULL,            -- Nome do reino (obrigatório)
  motto text,                    -- Lema / divisa
  desc text,                     -- Descrição narrativa
  stats jsonb DEFAULT '[]',      -- Array de {k, v, danger}
  target text,                   -- Link de navegação (deity:id, character:id, etc)
  sort_order integer DEFAULT 0,  -- Ordem de exibição
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

**RLS Policies**:
- `SELECT`: público (everyone can read)
- `INSERT/UPDATE/DELETE`: apenas `editor` ou `admin`

### 5.2 Regiões (não tem tabela — estático)

Regiões são hardcoded em `data.jsx` e não possuem tabela no banco.

**Se forem migrar para banco de dados** (recomendado para edição):

```sql
CREATE TABLE regions (
  id text PRIMARY KEY,
  name text NOT NULL,
  type text,
  desc text,
  stats jsonb DEFAULT '[]',
  fill text,           -- cor hex
  stroke text,         -- cor hex
  d text,              -- SVG path data
  labelX float,        -- coordenada X
  labelY float,        -- coordenada Y
  cursed boolean DEFAULT false
);
```

---

## 6. Fluxo Completo de UX

### 6.1 Usuário explora Reinos

```
Clica em "Reinos & Potências" no menu
  ↓
kingdoms.jsx renderiza lista de cards
  ↓
Cada card mostra:
  - Sigilo (ícone SVG)
  - Eyebrow (tipo)
  - Nome
  - Lema
  - Descrição
  - Stats (Capital, Liderança, População, Alinhamento, etc)
  ↓
Usuário clica em um card
  ↓
Se tem target (ex: 'deity:oshain'):
  → onNav('deity:oshain') → navigate para página da divindade
  
Se editor clica "Editar":
  → Modal abre
  → Edita campos
  → Salva em Supabase
  → db-refresh dispatchado
  → kingdoms.jsx re-renderiza
```

### 6.2 Usuário explora Mapa

```
Clica em "Mapa de Valiran" no menu (admin-only)
  ↓
MapPage renderiza SVG interativo
  ↓
Usuário clica em uma região no mapa
  ↓
Region selecionada muda
  ↓
Painel lateral direito atualiza:
  - Nome
  - Tipo
  - Descrição
  - Stats
  - [IF cursed] Aviso em vermelho
  ↓
Clica "Abrir artigo completo"
  → onNav('article') → navigate para página Ayael
```

### 6.3 Usuário quer conectar Reinos ao Mapa

Não é possível atualmente sem código. Futura melhoria:
1. Adicionar campo `region_id` ao schema kingdoms
2. Modificar modal para dropdown de regiões
3. Adicionar botão "Ver no mapa" no card de reino
4. Ao clicar, pré-selecionar a região no MapPage

---

## 7. Arquivo de Estilos

### Kingdoms

Arquivo: `project-backend/styles-extra.css`

Seletores principais:
- `.kingdom-list` — grid layout dos cards
- `.kingdom-card` — card individual
  - `.kingdom-crest` — área do sigilo
  - `.kingdom-body` — conteúdo
    - `.kingdom-eyebrow`
    - `.kingdom-name`
    - `.kingdom-motto`
    - `.kingdom-desc`
  - `.kingdom-stats` — tabela de stats
    - `.kingdom-stat-k` — chave
    - `.kingdom-stat-v` — valor (`.danger` para vermelho)

### Mapa

Arquivo: `project-backend/styles-extra.css`

Seletores principais:
- `.map-page` — container principal (flex layout)
  - `.map-canvas` — lado esquerdo (SVG)
    - `.map-svg` — SVG responsivo
    - `.region` — path clicável (`.selected` para highlight)
    - `.map-label` — rótulos SVG
    - `.map-controls` — botões +/−
    - `.map-legend` — legenda
  - `.map-info` — lado direito (painel de info)
    - `.map-info-eyebrow`
    - `.map-stats` — definição list

---

## 8. Checklist de Funcionalidades

### Reinos

- [x] Carregar dados do Supabase
- [x] Renderizar cards em galeria
- [x] Editar reino (modal CRUD)
- [x] Criar novo reino
- [x] Apagar reino
- [x] Adicionar/remover estatísticas
- [x] Marcar stat como "danger" (vermelho)
- [x] Ordenar por `sort_order`
- [x] Permissões: apenas editores podem CRUD
- [x] Navegação via `target` field
- [ ] Validação: require capitais / lideranças
- [ ] Sugerir presets de stats por tipo

### Mapa

- [x] Renderizar SVG interativo
- [x] Seleção de região
- [x] Atualizar painel lateral
- [x] Exibir stats
- [x] Marca "cursed" com hachura + aviso
- [x] Rótulos de cidades
- [x] Rosa dos ventos
- [x] Escala
- [x] Legenda
- [ ] Zoom/pan (botões não funcionais)
- [ ] Exportar como imagem
- [ ] Editar regiões (atualmente requer código)

### Integração

- [ ] Campo `region_id` em `kingdoms`
- [ ] Botão "Ver no mapa" em kingdom-card
- [ ] Auto-select região ao navegar do reino
- [ ] Tooltip com dados de região ao hover em region-path
- [ ] Sidebar com lista de reinos quando região selecionada

---

## 9. Referências e Imports

### kingdoms.jsx

```javascript
// Imports globais esperados
- React (global)
- useAuth() → auth.jsx
- Data.kingdoms → data.jsx
- Sigil → sigils.jsx (SVG icons)
- window.DB.saveKingdom()
- window.DB.deleteKingdom()
```

### map.jsx

```javascript
// Imports globais esperados
- React (global)
- Data.regions → data.jsx (hardcoded array)
- onNav() prop
```

### data.jsx

```javascript
// Exports globais
- window.Data.kingdoms = [] (populated by db.js)
- window.Data.regions = [...] (hardcoded)
- window.Data.nav (includes "reinos" link)
```

### db.js

```javascript
// Lê e popula:
- Data.kingdoms (line 72, 211)
- window.DB.saveKingdom(payload)
- window.DB.deleteKingdom(id)
```

---

## 10. Próximos Passos Sugeridos

### Curto Prazo
1. Migrar `regions` para tabela Supabase (permite edição sem código)
2. Adicionar campo `region_id` ao `kingdoms`
3. Atualizar modal de reinos com dropdown de regiões

### Médio Prazo
1. Botão "Ver no mapa" em cada kingdom-card
2. Ao navegar para reino, pre-selecionar região no mapa
3. Dropdown de reinos na seleção de região no mapa

### Longo Prazo
1. Implementar zoom/pan no SVG do mapa
2. Adicionar camadas no mapa (clima, magia, população)
3. Histórico: mostrar mudanças de fronteiras ao longo do tempo
4. Integração com timeline: marcar eventos importantes no mapa

---

## Glossário

| Termo | Significado |
|-------|------------|
| **Region** | Área geográfica estática no mapa (5 regiões em Valiran) |
| **Kingdom** | Potência política dinâmica com edição em tempo real |
| **Eyebrow** | Subtítulo ou classificação curta (ex: "Monarquia expansionista") |
| **Sigil** | Brasão heráldico (ícone SVG renderizado de um preset) |
| **Stats** | Pares chave-valor customizáveis (ex: Capital, População) |
| **Cursed** | Região corrompida por magia sombria / fenda planar |
| **Sort Order** | Campo numérico que controla ordem de exibição crescente |
| **Target** | Campo de navegação (formato: `type:id` ou page name) |
| **Danger** | Flag em uma stat que a marca em vermelho (crítico/ameaça) |
| **RLS** | Row-Level Security (segurança ao nível de linha no Supabase) |

