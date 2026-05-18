# Multipage Routing — Opções de Implementação

Branch de trabalho: `feature/multipage-routing`

---

## Contexto

O Arquivo de Valiran é atualmente uma SPA com roteamento baseado em estado React (`active` state em `app.jsx`). Não há URLs por página — clicar em "Voltar" no browser não funciona e não é possível compartilhar o link de um artigo específico.

Este documento descreve as duas opções para adicionar URLs reais à aplicação.

---

## Opção A — Hash Routing ✅ Recomendada

### Como ficam as URLs

```
https://arquivo-valiran.vercel.app/#/home
https://arquivo-valiran.vercel.app/#/characters
https://arquivo-valiran.vercel.app/#/character:kathryn
https://arquivo-valiran.vercel.app/#/session:23
https://arquivo-valiran.vercel.app/#/pantheon
https://arquivo-valiran.vercel.app/#/deity:bahamut
```

### Como funciona

O browser ignora tudo após o `#` ao fazer requisições ao servidor — a página `index.html` sempre é servida. O JavaScript lê `window.location.hash` e renderiza a rota correta.

### Mudanças necessárias

Apenas `app.jsx`:

1. Inicializar `active` a partir de `window.location.hash` em vez de `'home'`
2. Substituir `setActive` por uma função que atualiza o hash E o estado
3. Adicionar listener `hashchange` para sincronizar estado com navegação do browser

Nenhum arquivo de configuração, nenhuma mudança no Vercel.

### Prós
- Funciona hoje sem nenhuma configuração adicional no Vercel
- Botões Voltar/Avançar do browser passam a funcionar
- Links compartilháveis imediatamente
- Implementação simples (~20 linhas em `app.jsx`)
- Zero risco de 404 ao recarregar a página

### Contras
- O `#` na URL é menos limpo visualmente

---

## Opção B — History API (URLs limpas)

### Como ficam as URLs

```
https://arquivo-valiran.vercel.app/
https://arquivo-valiran.vercel.app/characters
https://arquivo-valiran.vercel.app/character/kathryn
https://arquivo-valiran.vercel.app/session/23
https://arquivo-valiran.vercel.app/pantheon
https://arquivo-valiran.vercel.app/deity/bahamut
```

### Como funciona

Usa `window.history.pushState()` para atualizar a URL sem recarregar a página. O servidor precisa redirecionar todas as rotas para `index.html` — no Vercel isso é feito via `vercel.json`.

### Mudanças necessárias

**`vercel.json`** (novo arquivo):
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/project-backend/index.html" }]
}
```

**`app.jsx`**:
1. Inicializar `active` a partir de `window.location.pathname`
2. Usar `history.pushState()` ao navegar
3. Adicionar listener `popstate` para o botão Voltar
4. Mapear formato de URL (`/character/kathryn`) ↔ route ID (`character:kathryn`)

### Prós
- URLs limpas e profissionais
- Melhor para SEO (se relevante no futuro)

### Contras
- Requer configuração do `vercel.json`
- Se o rewrite não estiver correto, recarregar qualquer página retorna 404
- Implementação ligeiramente mais complexa

---

## Mapa de rotas atual

| Route ID (interno) | URL — Opção A       | URL — Opção B          |
|--------------------|---------------------|------------------------|
| `home`             | `/#/home`           | `/`                    |
| `recent`           | `/#/recent`         | `/recent`              |
| `pantheon`         | `/#/pantheon`       | `/pantheon`            |
| `characters`       | `/#/characters`     | `/characters`          |
| `npcs`             | `/#/npcs`           | `/npcs`                |
| `character:slug`   | `/#/character:slug` | `/character/slug`      |
| `deity:slug`       | `/#/deity:slug`     | `/deity/slug`          |
| `sessions`         | `/#/sessions`       | `/sessions`            |
| `session:id`       | `/#/session:id`     | `/session/id`          |
| `timeline`         | `/#/timeline`       | `/timeline`            |
| `events`           | `/#/events`         | `/events`              |
| `kingdoms`         | `/#/kingdoms`       | `/kingdoms`            |
| `factions`         | `/#/factions`       | `/factions`            |
| `map`              | `/#/map`            | `/map`                 |
| `house-rules`      | `/#/house-rules`    | `/house-rules`         |
| `campanha1`        | `/#/campanha1`      | `/campanha1`           |
| `campanha2`        | `/#/campanha2`      | `/campanha2`           |
| `campanha3`        | `/#/campanha3`      | `/campanha3`           |
| `rogue1`           | `/#/rogue1`         | `/rogue1`              |
| `article`          | `/#/article`        | `/article`             |

---

## Decisão

- **Opção A** para implementar agora — sem risco, sem config, funciona imediatamente.
- Migração para **Opção B** depois é pequena se as URLs limpas forem desejadas no futuro.
