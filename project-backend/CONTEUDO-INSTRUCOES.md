# O Arquivo de Valiran — Instruções de Conteúdo

Este documento descreve a estrutura exata de cada tipo de entrada na wiki.
Use-o para gerar conteúdo que será inserido via o painel de edição do site.

---

## Como inserir conteúdo

Cada seção tem um botão **"+ Novo [tipo]"** visível apenas para editores/admins logados.
Artigos de personagem e divindade têm um botão **"Editar Artigo"** dentro da página de detalhe.

---

## 1. SESSÕES

Cada sessão é uma entrada no **Diário de Sessões**. Representa uma sessão real de RPG jogada.

### Campos

| Campo | Tipo | Descrição | Exemplo |
|---|---|---|---|
| `num` | número | Número da sessão (único) | `24` |
| `title` | texto | Nome da sessão | `"O Pastor Cego de Velheath"` |
| `date` | texto | Data completa no calendário do mundo | `"21 do Segundo Mês, 1281"` |
| `dateShort` | texto | Data curta para exibição | `"21 · MAI · 1281"` |
| `location` | texto | Local principal da sessão | `"Pântanos de Velheath"` |
| `locationDetail` | texto | Descrição geográfica do local | `"três léguas a leste de Nova Lancaster · território neutro"` |
| `duration` | texto | Duração real da sessão | `"4h 00min"` |
| `session_xp` | texto | XP distribuído | `"1.500 XP"` |
| `summary` | texto | Resumo de uma linha do que aconteceu | `"O grupo encontrou o pastor e descobriu..."` |
| `cast` | lista | Participantes da sessão | ver abaixo |
| `places` | lista | Lugares visitados | ver abaixo |
| `narrative` | lista | Parágrafos da narração | ver abaixo |
| `keypoints` | lista | Pontos-chave e revelações | ver abaixo |
| `loot` | lista | Itens encontrados ou ganhos | ver abaixo |
| `gmnote` | texto | Nota interna do Mestre (não exibida publicamente) | `"Revelar X na próxima sessão"` |
| `next` | texto | Preview da próxima sessão | `"Próxima sessão · 28 · MAI · 1281"` |

### Formato das listas

**`cast`** — Um nome por linha. NPCs recebem `(NPC)` ao final:
```
Käthryn
Halric
Sothia
Mavor
Tannis (NPC)
Pastor Cego (NPC)
```

**`places`** — Um lugar por linha:
```
Pântanos de Velheath
Cabana do Pastor
Charco do Sussurro
```

**`narrative`** — Parágrafos separados por linha em branco. Escreva como narração literária, em terceira pessoa, no passado:
```
O pastor vivia sozinho há quarenta anos numa cabana que parecia mais crescida do que construída.

Ele conhecia a marca. Não disse como.
```

**`keypoints`** — Um ponto por linha. Prefixe com `!` para marcar como perigo/alerta:
```
Pastor identificou a marca como Selo de Contenção antigo
!Tannis tem menos de dez dias antes da corrupção se tornar irreversível
Halric prometeu silêncio ao pastor (rolagem de Enganação: 18)
Käthryn encontrou referência a Lancaster nos arquivos da cabana
```

**`loot`** — Um item por linha:
```
1× pergaminho com símbolos de contenção (linguagem desconhecida)
Ervas de purificação suficientes para um ritual menor
```

---

## 2. PERSONAGENS

Cada personagem tem uma **ficha de galeria** (nome, papel, tag) e um **artigo completo** (biografio, seções, infobox).

### Ficha de galeria (criada via "Novo Personagem")

| Campo | Tipo | Opções | Descrição |
|---|---|---|---|
| `id` | texto (slug) | — | Identificador único. Use letras minúsculas sem acentos, sem espaços. Ex: `kathryn`, `ven-sothiel`, `rei-vaglies` |
| `name` | texto | — | Nome completo do personagem |
| `role` | texto | — | Descrição curta em duas partes separadas por `·`. Ex: `"Paladina dissidente · órfã de Lancaster"` |
| `tag` | texto | `PC`, `ALIADO`, `INIMIGO`, `NPC` | Classificação do personagem |

### Artigo completo (editado via "Editar Artigo")

**`hero`** — Frase ou parágrafo de abertura. Aparece em destaque no topo do artigo. Tom literário, evocativo:
```
Quando Lancaster caiu, Käthryn tinha vinte e quatro anos e estava a duas léguas
da cidade. A demora salvou sua vida. Ela nunca perdoou a si mesma por isso.
```

**`placeholder`** — Marque como `true` se o artigo ainda não está completo. Exibe banner "Em compilação".

**`infobox.rows`** — Linhas de dados do painel lateral. Cada linha tem:
- `k`: chave (ex: `"Classe"`, `"Origem"`, `"Idade"`)
- `v`: valor (ex: `"Paladina · nv. 7"`, `"Lancaster"`, `"27 anos"`)
- Estilo opcional: marque como **ok** (verde) ou **perigo** (vermelho)

Exemplos de linhas comuns para personagens:
```
Classe       → "Paladina · nv. 7"          (normal)
Origem       → "Lancaster (caído)"          (normal)
Idade        → "27 anos"                    (normal)
Alinhamento  → "Leal-Neutro"               (normal)
Status       → "Em campanha"               (OK/verde)
Procurado    → "Sim · Oshain"              (perigo/vermelho)
```

**`infobox.statusNote`** — Nota de rodapé do infobox. Use para avisos, status especiais ou informação restrita:
```
Procurada por Oshain sob o nome "a paladina de Lancaster".
Identidade civil ainda intacta no resto do continente.
```

**`sections`** — Seções do artigo. Cada seção tem título e parágrafos:

Seções comuns para **PCs e aliados**:
- `Biografia` — história e origem
- `Personalidade` — traços, maneirismos, motivações
- `Eventos notáveis` — momentos importantes das sessões

Seções comuns para **inimigos**:
- `O que se sabe` — informações confirmadas pelos heróis
- `Hipóteses` — teorias e especulações
- `Perigo` — ameaças concretas

**`related`** — Links relacionados no painel lateral. Cada link:
- `tag`: rótulo curto (ex: `"Reino"`, `"Sessão"`, `"Divindade"`, `"Facção"`)
- `title`: texto do link (ex: `"Lancaster (caído)"`)
- `target`: rota de navegação (ver tabela de rotas abaixo)

---

## 3. DIVINDADES

Estrutura similar a personagens, com campos adicionais de epiteto e sigilo.

### Campos específicos de divindades

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | texto (slug) | Ex: `esmir`, `bahamut`, `cerigane` |
| `name` | texto | Nome da divindade |
| `epithet` | texto | Subtítulo/epíteto. Ex: `"A Alvorada Sacrificial · O Mortal que Virou Manhã"` |
| `sigil` | texto | ID do ícone (ver lista abaixo) |

### Sigilos disponíveis

| ID | Descrição |
|---|---|
| `Dragon` | Dragão / Bahamut |
| `Dawn` | Alvorada / sol nascente |
| `Chain` | Corrente / prisão |
| `Sun` | Sol pleno |
| `Moon` | Lua |
| `Skull` | Morte / necromancia |
| `Eye` | Vigilância / conhecimento |
| `Flame` | Fogo |
| `Wave` | Água / mar |
| `Tree` | Natureza |
| `Crown` | Realeza / poder |
| `Sword` | Guerra / combate |

*(Se o sigilo do deus não existir na lista, deixe o campo vazio — nenhum ícone será exibido.)*

### Infobox de divindades

Linhas comuns:
```
Tipo         → "Deus Maior · panteão estabelecido"
Forma        → "Dragão metálico ancião"
Domínio      → "Justiça, Honra, Lei"
Alinhamento  → "Leal-Bom"
Plano        → "Celeste"
Símbolo      → "Crânio dracônico em prata"
Adoradores   → "Paladinos, juízes, dragões metálicos"
Estado       → "Ativo"       (OK/verde)
Estado       → "Silencioso"  (perigo/vermelho)
```

### Seções comuns para divindades
- `Origem` — como surgiu ou ascendeu
- `Tenets / Dogmas` — mandamentos e ensinamentos
- `Manifestações` — formas de aparição no mundo
- `Culto` — quem adora, onde, como
- `Relação com outros deuses`
- `O Silêncio` (se aplicável) — por que está inativo

---

## 4. LINHA DO TEMPO

A Linha do Tempo suporta dois tipos de entrada: **divisores de era** e **eventos**.

### Divisor de era

Separa visualmente as eras históricas. Apenas um campo:
- `era`: nome da era. Ex: `"Primeira Era · O Tecimento"`, `"Segunda Era · A Expansão"`, `"Terceira Era · O Vazamento"`

Use `sort_order` para controlar a ordem de exibição (números menores aparecem primeiro).

### Evento de timeline

| Campo | Tipo | Descrição | Exemplo |
|---|---|---|---|
| `year` | texto | Ano no calendário do mundo | `"3ªE 1276"`, `"1ªE 489"`, `"T-???"` |
| `label` | texto | Rótulo curto do tipo do evento | `"Catástrofe"`, `"Divino"`, `"Político"` |
| `title` | texto | Nome do evento | `"A Queda de Lancaster"` |
| `desc` | texto | Descrição em uma ou duas frases | `"O selo é rompido. O reino sagrado cai em uma noite."` |
| `tag` | texto | Tag adicional (opcional) | `"Lancaster"` |
| `kind` | texto | Tipo visual do evento | ver abaixo |
| `sort_order` | número | Ordem de exibição | `1`, `2`, `3`... |

**`kind`** — controla a cor/estilo visual do evento:
| Valor | Uso |
|---|---|
| `divine` | Eventos divinos, ascensões, intervenções |
| `catastrophe` | Desastres, quedas, rupturas |
| `political` | Guerras, coroações, fundações |
| `arcane` | Magia, warforged, Trama |
| *(vazio)* | Padrão, sem destaque |

---

## 5. EVENTOS DA ERA

Lista tabular de eventos históricos, separados por categoria e filtrável.

| Campo | Tipo | Opções | Descrição |
|---|---|---|---|
| `year` | texto | — | Ano. Ex: `"3ªE 1276"` |
| `cat` | texto | `div`, `pol`, `cata`, `arc` | Categoria |
| `title` | texto | — | Nome do evento |
| `desc` | texto | — | Descrição curta (uma ou duas frases) |
| `region` | texto | — | Região onde ocorreu |
| `target` | texto | — | Rota de navegação (opcional, para links) |
| `sort_order` | número | — | Ordem de exibição |

**Categorias:**
| `cat` | Exibe como |
|---|---|
| `div` | Divino |
| `pol` | Político |
| `cata` | Catástrofe |
| `arc` | Arcano |

---

## Rotas de navegação (`target`)

Use esses valores nos campos `target` de links relacionados e eventos:

| Rota | Destino |
|---|---|
| `home` | Portal principal |
| `sessions` | Diário de Sessões |
| `session:24` | Sessão específica (substitua o número) |
| `characters` | Galeria de personagens |
| `character:kathryn` | Personagem específico (substitua o ID) |
| `pantheon` | Panteão |
| `deity:esmir` | Divindade específica (substitua o ID) |
| `timeline` | Linha do Tempo |
| `events` | Eventos da Era |
| `kingdoms` | Reinos |
| `factions` | Facções |
| `map` | Mapa |
| `article` | Artigo de Ayael |
| `planes` | Planos |
| `weave` | A Trama |

---

## Convenções de estilo

- **Tom geral**: arquivístico, sóbrio, literário. Como se fosse um estudioso registrando fatos históricos com distância cuidadosa.
- **Narração de sessões**: terceira pessoa, passado, sem jargão de jogo de RPG (não use "o jogador", "a mesa rolou", "crit"). Use "o grupo", "os heróis", nomes dos personagens.
- **Infoboxes**: entradas curtas, factuais. Evite frases longas — é uma ficha, não um parágrafo.
- **Hero text**: a frase mais evocativa do personagem/divindade. Uma ou duas frases que capturam a essência.
- **Seções de artigo**: parágrafos completos, literários. Entre 2 e 5 parágrafos por seção.
- **Datas**: use o calendário do mundo (não datas reais). Convenção: `"Xº do [Mês] Mês, [ano]"` para datas completas, `"DD · MÊS · ANO"` para datas curtas.
- **Spoilers do Mestre**: use `gmnote` nas sessões para informações que não devem aparecer para jogadores. Esse campo existe mas atualmente é visível a todos os editores — trate como nota interna da campanha.

---

## Exemplo completo — Personagem

```
ID:   ven-sothiel
Nome: Mestra Ven Sothiel
Papel: Arquimaga decana · mentora e arrelíquia viva
Tag:  ALIADO

Hero:
"Ela foi a primeira a perceber que a Trama estava sangrando. Isso foi em 1264.
Passou doze anos tentando convencer o Concílio. Em 1276, ela estava certa."

Infobox:
  Classe        → Arquimaga · nv. 18
  Origem        → Lorean Treaz
  Idade         → 94 anos
  Especialidade → Trama Mágica · diagnóstico e reparo
  Posição       → Decana Emérita do Concílio
  Status        → Ativa                        (OK)
  Nota: A única pessoa viva que mapeou uma ruptura de dentro.

Seções:
  Biografia:
    Nascida em Lorean Treaz no final da Segunda Era...
  
  Conhecimento da Trama:
    Ven Sothiel dedicou sessenta anos ao estudo das rupturas...

Related:
  Facção  → "Lorean Treaz"         → factions
  Sessão  → "S23 · As Marcas..."   → session:23
  Evento  → "A Queda de Lancaster" → timeline
```

---

## Exemplo completo — Sessão

```
Número:  24
Título:  O Pastor Cego
Data:    21 do Segundo Mês, 1281
Curta:   21 · MAI · 1281
Local:   Cabana do Pastor · Margens do Charco
Detalhe: velheath profundo · território não mapeado desde a Segunda Era
Duração: 4h 30min
XP:      1.650 XP

Resumo:
O grupo encontrou o Pastor Cego e descobriu que a marca de Tannis é um Selo
de Contenção antigo — e que alguém o ativou propositalmente.

Elenco:
Käthryn
Halric
Sothia
Mavor
Tannis (NPC)
O Pastor Cego (NPC)

Lugares:
Cabana do Pastor Cego
Charco do Sussurro
Margem Norte do Pântano

Narrativa:
A cabana parecia mais crescida do que construída. O pastor não tinha nome — ou
tinha e havia esquecido, o que para ele dava no mesmo.

Ele conhecia a marca. Disse isso assim que viu o braço de Tannis, antes de
qualquer um falar. Conhecia pelo cheiro, disse. Käthryn não acreditou. Mavor sim.

[mais parágrafos...]

Pontos-chave:
A marca é um Selo de Contenção de origem pré-Lancaster
!Alguém ativou o selo deliberadamente — não foi acidente
!Tannis tem oito dias antes da corrupção se tornar permanente
O pastor mencionou "o homem de cabelo branco" sem dar mais detalhes
Halric ficou com o diário do pastor (escrito em símbolos desconhecidos)
Käthryn reconheceu o brasão no diário — é de Lancaster

Espólio:
1× diário em linguagem de símbolos (pertencia ao pastor)
Ervas suficientes para retardar a corrupção em 72 horas

Nota do Mestre:
O homem de cabelo branco = Noel Braent. Ainda não revelar. A mesa está
suspeitando de Caedric, deixar essa linha viva por mais uma sessão.
```
