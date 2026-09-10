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
| `discord-bot/` | Active | Discord bot companion app |
| `project/` | Archived (v1) | Original Claude Design prototype — static/hardcoded data, no backend. Superseded by `project-backend/`; kept as a record of the project's evolution. |
| `docs/` | Reference | Architecture reference, article schema, map and routing notes |
| `db/seeds/*.sql` | Active | Supabase seed data (run once per environment) |
| `db/fixes/*.sql` | Active | One-off data-fix scripts, kept for record |

---

## Project evolution

This project started as **`project/`**: a single-file React prototype generated with Claude Design, with all lore data hardcoded directly in JSX (`data.jsx`, `data-entities.jsx`). It proved the UI and content model but had no persistence — any edit meant editing code.

It was then rebuilt as **`project-backend/`**: the same UI concepts, now backed by Supabase (PostgreSQL + Auth + Storage), with a real content-editing UI, role-based access control, and image uploads. That is the active application today. `project/` is kept untouched as a historical snapshot of where the design started.

---

## Documentation

- **[PROJECT_REFERENCE.md](docs/PROJECT_REFERENCE.md)** — Full technical map: file roles, DB schema, auth system, design tokens, agent guidelines.
- **[project-backend/CONTEUDO-INSTRUCOES.md](project-backend/CONTEUDO-INSTRUCOES.md)** — Content editor guide: how to add sessions, characters, deities, and other entities via the in-app UI.
- **[GUIA-ESTRUTURA-ARTIGOS.md](docs/GUIA-ESTRUTURA-ARTIGOS.md)** — Technical data structure reference: full schema, SQL INSERT/UPDATE examples, JSON field shapes, and SQL gotchas.

---

## For AI agents

Read **[PROJECT_REFERENCE.md](docs/PROJECT_REFERENCE.md)** before making any changes.
