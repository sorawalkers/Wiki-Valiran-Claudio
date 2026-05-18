# PROJECT_REFERENCE — O Arquivo de Valiran

> Reference document for AI agents and collaborators.  
> If you are about to touch this repo, read this first.

---

## 1. What This Project Is

**O Arquivo de Valiran** (The Valiran Archive) is a campaign wiki for a tabletop RPG set in a dark-fantasy world called Valiran. It is a single-page web application that lets players and the GM read session recaps, explore lore (deities, kingdoms, factions, NPCs), consult house rules, and follow an in-world timeline. Editors and admins can also create and update content directly from the browser.

- **Language**: Portuguese (Brazilian) — all content, UI labels, and entity names
- **Audience**: Players and GM of the Valiran campaign (Daggerheart system)
- **Hosting**: Served as a static HTML file; backend is fully managed by Supabase

---

## 2. Repo Layout

```
Wiki-Valiran-Claudio/
├── project-backend/        ← ACTIVE APPLICATION — work here
├── project/                ← DEPRECATED prototype (no DB, hardcoded data)
├── chats/                  ← Historical design conversation transcripts
├── seed_*.sql              ← Supabase seed data (run once per environment)
├── ESTRUTURA-ARTIGOS.md    ← Technical schema + SQL INSERT examples per entity
└── README.md               ← Original handoff instructions (Claude Design export)
```

**`project/` is read-only history.** It is the original HTML/JSX prototype that predates Supabase integration. Never modify it; consult it only for historical reference.

**All active development happens in `project-backend/`.**

---

## 3. Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | React 18 | JSX loaded via `<script type="text/babel">` — no build step |
| Transpilation | Babel (browser) | JSX compiled at runtime; no webpack/vite/esbuild |
| Backend / DB | Supabase | PostgreSQL + Auth + Storage; hosted at `ytphxqybjxokokbnnbrz.supabase.co` |
| DB Client | Supabase JS SDK | Accessed as `window.sb` after `supabase-client.js` loads |
| Auth | Supabase Auth | JWT-based, role-based access control |
| Image Storage | Supabase Storage | `media` bucket, drag-drop upload via `image-upload.js` |
| Routing | Manual | No React Router; page IDs dispatched in `app.jsx` |
| State | Window namespace | `window.Data`, `window.Entities`, `window.DB` |
| Styling | CSS | Custom design system in `styles.css` + `styles-extra.css` |

**There is no build step.** Editing a `.jsx` file takes effect on the next browser reload. There is no `npm install`, no `package.json`, no compilation pipeline.

---

## 4. project-backend/ File Map

### Entry Point & Infrastructure

| File | Role |
|------|------|
| `index.html` | Entry point. Loads React, Babel, Supabase SDK, then all JS/JSX files in dependency order. |
| `supabase-client.js` | Initialises `window.sb` using the public anon key. Safe to commit (anon key, not service key). |
| `db.js` | `window.DB` — CRUD wrapper for all entities: `loadAll()`, `saveX()`, `deleteX()`. Fires a `db-refresh` event after writes to trigger UI updates. |
| `image-slot.js` | Tracks image slot state (URL mapping, versioning). |
| `image-upload.js` | Uploads files to Supabase Storage (`media` bucket); returns versioned public URLs. |

### Core React Modules

| File | Role |
|------|------|
| `app.jsx` | Root component. Manual router (dispatches page by ID). Palette/density theme management. Listens for `db-refresh`. |
| `auth.jsx` | `AuthContext` + `useAuth()` hook. Login modal, session check, role fetch from `profiles` table. |
| `chrome.jsx` | Header, sidebar, breadcrumbs, search bar — the persistent UI shell. |
| `data.jsx` | Global `Data` object (static nav structure) and shared state. |
| `data-entities.jsx` | Entity type definitions and field schemas used across the app. |
| `article-editor.jsx` | In-app WYSIWYG editor for campaign articles, deity/character detail pages. |
| `tweaks-panel.jsx` | Settings panel: palette selector (wine/planar/necro), density (compact/normal/spacious), ornaments toggle. |
| `deity-sigil.jsx` | Renders a deity sigil SVG by ID. |
| `sigils.jsx` / `sigils-deities.jsx` | Heraldic sigil definitions and rendering for kingdoms, factions, deities. |

### Pages (`pages/`)

Each file is one wiki section, loaded by the router in `app.jsx`.

| File | Page | Description |
|------|------|-------------|
| `portal.jsx` | Home / Dashboard | Recent activity feed |
| `pantheon.jsx` | Pantheon | Deity directory (3-tier hierarchy) |
| `deity-detail.jsx` | Deity article | Full deity profile with infobox and sections |
| `characters.jsx` | Characters | PC + NPC directory, filterable by campaign/tag |
| `npcs.jsx` | NPCs | NPC-only directory |
| `character-detail.jsx` | Character article | Full character profile with infobox and sections |
| `sessions.jsx` | Session Diary | Campaign session list + individual session view |
| `timeline.jsx` | Timeline | Chronological event line with era markers |
| `events.jsx` | Recent Events | Categorical event feed (divine / political / catastrophe / arcane) |
| `factions.jsx` | Factions | Secret organization dossiers with redacted fields |
| `kingdoms.jsx` | Kingdoms | Political powers with stats and sigils |
| `houserules.jsx` | House Rules | Mechanical house rule compendium |
| `map.jsx` | Map | Interactive SVG regional map |
| `planes.jsx` | Planes | Cosmological planes (Feywild, Underdark, Abyss, etc.) |
| `weave.jsx` | The Weave | Magical system primer |
| `article.jsx` | Ayael | Static lore article |
| `campaign-article.jsx` | Campaign Articles | Campanha 1/2/3 and Rogue1 articles |

---

## 5. Database Schema

Tables live in Supabase (PostgreSQL). The canonical schema is at [`project-backend/schema.sql`](project-backend/schema.sql).

| Table | Purpose | Key JSONB fields |
|-------|---------|-----------------|
| `profiles` | User accounts and roles | — |
| `characters` | PCs and NPCs (shared table) | `infobox`, `sections`, `related` |
| `deities` | Pantheon entities (gods, titans) | `infobox`, `sections`, `related` |
| `sessions` | Campaign session diary entries | `cast`, `narrative`, `keypoints`, `loot`, `places` |
| `timeline_events` | Historical chronological events | — |
| `events` | Recent-events feed | — |
| `factions` | Organizations with redacted fields | `rows` |
| `kingdoms` | Political powers with sigils | `stats` |
| `houserules` | Mechanical house rules | `paragraphs` |
| `planes` | Cosmological planes | — |
| `image_slots` | Persistent image URL mapping | — |
| `regions` | SVG map region data (path, fill, stroke) | — |
| `latest_entries` | Recent activity view (read-only) | — |

**Characters vs NPCs**: both live in `characters`. They are differentiated by the `role` field (`pc` / `npc`) and the `tag` field (campaign name or faction tag).

**JSONB pattern**: infoboxes are `{ "rows": [{ "k": "Label", "v": "Value" }] }`. Sections are arrays of `{ "title", "body" }` objects.

**ID convention (slugify)**:
```
name → lowercase → strip accents (NFD) → replace non-alphanumeric with "-" → trim hyphens
Example: "Annabella Whiteflame" → "annabella-whiteflame"
```

---

## 6. Authentication & Roles

| Role | Default? | Can do |
|------|----------|--------|
| `viewer` | Yes (on signup) | Read all public content |
| `editor` | No | Create and edit all wiki content |
| `admin` | No | Full access |

- Auth is handled by Supabase Auth (email + password).
- Role is stored in the `profiles` table, fetched on login.
- Row-Level Security (RLS) is enforced at the DB level — writes are rejected unless the user's `profiles.role` is `editor` or `admin`.
- Promoting a user requires a direct SQL update:
  ```sql
  UPDATE profiles SET role = 'admin' WHERE email = 'user@example.com';
  ```
- The `+` create buttons and "Edit" actions in the UI are hidden from `viewer` accounts.

---

## 7. Design System

- **Color scheme**: Dark theme — `ardósia` (#16161b) background, `pergamino` (#e8dcc4) text, `dourado` (#b89968) accents, `vinho` (#6b1a26) highlights.
- **Palettes**: Three switchable palettes — `wine` (default), `planar`, `necro`. Controlled by `tweaks-panel.jsx` and persisted in `localStorage`.
- **Typography**: Cinzel (display headings), EB Garamond (body), JetBrains Mono (metadata/code labels).
- **Density modes**: `compact`, `normal`, `spacious` — toggle from the tweaks panel.
- **Ornaments**: Toggle decorative flourishes on/off.

All design tokens are CSS custom properties defined in `styles.css`.

---

## 8. Navigation Routes

The `target` field in DB records uses these string formats to link between pages:

| Format | Destination |
|--------|-------------|
| `deity:slug` | Deity article |
| `character:slug` | Character/NPC article |
| `session:num` | Specific session |
| `pantheon` | Pantheon page |
| `kingdoms` | Kingdoms page |
| `factions` | Factions page |
| `timeline` | Timeline page |
| `sessions` | Session diary |
| `house-rules` | House rules |
| `article` | Static Ayael article |

---

## 9. Internal Documentation

These files provide deeper guidance for specific tasks:

| File | What it covers |
|------|---------------|
| [`project-backend/CONTEUDO-INSTRUCOES.md`](project-backend/CONTEUDO-INSTRUCOES.md) | Content editor guide — how to populate each entity type through the in-app UI |
| [`project-backend/RETRATOS_GUIA.md`](project-backend/RETRATOS_GUIA.md) | Portrait and sigil image guidance |
| [`ESTRUTURA-ARTIGOS.md`](ESTRUTURA-ARTIGOS.md) | Technical schema reference with full SQL INSERT examples for every entity type |
| [`project-backend/schema.sql`](project-backend/schema.sql) | Canonical PostgreSQL schema (tables, RLS policies, triggers) |
| `seed_*.sql` (root) | Seed data for each entity type — run once per new Supabase environment |

---

## 10. Guidelines for AI Agents

- **Work in `project-backend/` only.** The `project/` folder is frozen history.
- **No build step.** Edit `.jsx` or `.js` files directly; changes are live on browser reload.
- **Adding a new entity type** requires: a new table in `schema.sql`, new methods in `db.js`, a new page in `pages/`, a route entry in `app.jsx`, and a nav entry in `data.jsx`.
- **Never add a service-role key to frontend code.** `supabase-client.js` uses the anon key only. The anon key is public and safe to commit.
- **Content language is PT-BR.** All UI strings, field labels, entity names, and user-facing text must be in Portuguese.
- **JSONB field shapes are load-bearing.** `db.js` and the page components expect exact key names (`rows`, `k`, `v`, `sections`, `title`, `body`, etc.). Changing the shape of a JSONB field breaks both read and write paths.
- **Do not refactor the global state pattern** (`window.DB`, `window.Data`, `window.Entities`) without updating every file that references it — there is no module system, so namespace changes break silently.
- **Script load order matters.** `index.html` loads files in a specific order. If you add a new file, verify it is inserted after its dependencies and before its consumers.
- **Routing is manual.** To add a new page: add a component to `pages/`, import it in `app.jsx`, add it to the page registry in `app.jsx`, and add a nav link in `chrome.jsx` and/or `data.jsx`.
