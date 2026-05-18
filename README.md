# O Arquivo de Valiran

Campaign wiki for the **Valiran** dark-fantasy tabletop RPG campaign.

---

## What it is

A single-page web application where players and the GM can read session recaps, explore world lore (deities, kingdoms, factions, NPCs), consult house rules, and follow an in-world timeline. Editors and admins can create and update content directly from the browser.

Built with React and Supabase. No build step — open the HTML file and it runs.

---

## How to run

Open `project-backend/index.html` in a browser, or serve it via a local HTTP server:

```bash
# Python
python -m http.server 8080 --directory project-backend

# Node (npx)
npx serve project-backend
```

The app connects to a hosted Supabase instance. No local database setup is needed for read-only access.

---

## Repo structure

| Path | Status | Description |
|------|--------|-------------|
| `project-backend/` | Active | The live application — work here |
| `project/` | Deprecated | Original HTML prototype, no database |
| `seed_*.sql` | Active | Supabase seed data (run once per environment) |
| `ESTRUTURA-ARTIGOS.md` | Reference | SQL schema + INSERT examples per entity type |
| `PROJECT_REFERENCE.md` | Reference | Full technical documentation for this repo |

---

## Documentation

- **[PROJECT_REFERENCE.md](PROJECT_REFERENCE.md)** — Full technical map: file roles, DB schema, auth system, design tokens, agent guidelines.
- **[project-backend/CONTEUDO-INSTRUCOES.md](project-backend/CONTEUDO-INSTRUCOES.md)** — Content editor guide: how to add sessions, characters, deities, and other entities via the in-app UI.
- **[ESTRUTURA-ARTIGOS.md](ESTRUTURA-ARTIGOS.md)** — Technical data structure reference with SQL INSERT examples.

---

## For AI agents

Read **[PROJECT_REFERENCE.md](PROJECT_REFERENCE.md)** before making any changes.
