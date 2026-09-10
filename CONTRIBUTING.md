# Contributing

This is a personal project — a campaign wiki built and maintained for a single tabletop RPG group. It's public on GitHub as a portfolio piece, not as an open-source project accepting outside contributions. See [LICENSE](LICENSE): the code and content are all-rights-reserved, and pull requests from outside the project aren't being solicited or reviewed.

That said, if you're a collaborator on the campaign (or otherwise have write access), here's how this repo is worked on.

---

## Where to work

- **`project-backend/`** is the only active codebase. Read [`docs/PROJECT_REFERENCE.md`](docs/PROJECT_REFERENCE.md) first — it's the map of the whole system (file roles, DB schema, auth, design tokens).
- **`project/`** is frozen v1 history. Never edit it.
- **`discord-bot/`** is a separate Node app; see its own files for setup.

## Conventions

- **No build step.** `project-backend/` is plain React + Babel-in-browser — edit a `.jsx` file, reload the page. No `npm install`, no bundler.
- **Content language is PT-BR.** All UI strings, field labels, and in-world content are Portuguese.
- **JSONB field shapes are load-bearing.** Changing the shape of a `sections`, `infobox`, `related`, etc. field breaks read and write paths across pages — see [`docs/GUIA-ESTRUTURA-ARTIGOS.md`](docs/GUIA-ESTRUTURA-ARTIGOS.md) for the exact shapes and known gotchas before touching them.
- **Never commit real secrets.** The Supabase anon key in `supabase-client.js` is meant to be public — everything else (service-role keys, bot tokens) goes in an untracked `.env`, following the pattern in `discord-bot/.env.example`.
- **Adding a new content type** (a new entity, not just new rows) touches several files together: a table in `schema.sql`, methods in `db.js`, a page in `pages/`, a route in `app.jsx`, a nav entry in `data.jsx`. See PROJECT_REFERENCE.md §10 for the full checklist.

## Content edits

Most day-to-day content (sessions, characters, deities, etc.) doesn't need a code change at all — it's added through the in-app editor. See [`project-backend/CONTEUDO-INSTRUCOES.md`](project-backend/CONTEUDO-INSTRUCOES.md).

## Commits

Small, focused commits with a clear message are preferred over large mixed ones — it keeps the history usable as a record of how the project evolved.
