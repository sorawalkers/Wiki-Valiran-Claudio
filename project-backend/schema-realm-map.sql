-- ============================================================
-- Reinos & Potências — Mapa Hexagonal (schema extension)
-- Execute no SQL Editor do painel Supabase ANTES do seed
-- ============================================================

-- Tabela principal de reinos (substitui uso do 'kingdoms' para o mapa)
CREATE TABLE IF NOT EXISTS realms (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         text UNIQUE NOT NULL,
  name         text NOT NULL,
  short        text NOT NULL,
  eyebrow      text,
  sigil        text,
  motto        text,
  "desc"       text,
  accent       text NOT NULL DEFAULT '#888888',
  accent_deep  text NOT NULL DEFAULT '#222222',
  cursed       boolean DEFAULT false,
  capital_q    integer,
  capital_r    integer,
  capital_name text,
  stats6       jsonb DEFAULT '{}',
  resources    jsonb DEFAULT '[]',
  sort_order   integer DEFAULT 0,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

-- Hexes do tabuleiro: cada hex pertence a um reino
-- UNIQUE(q,r) garante que dois reinos não ocupem o mesmo hex
CREATE TABLE IF NOT EXISTS realm_hexes (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  realm_id  uuid REFERENCES realms(id) ON DELETE CASCADE,
  q         integer NOT NULL,
  r         integer NOT NULL,
  biome     text DEFAULT 'plain',
  UNIQUE (q, r)
);
CREATE INDEX IF NOT EXISTS realm_hexes_realm_idx ON realm_hexes (realm_id);

-- Cidades por reino (capital fica em realms.capital_q/r/name)
CREATE TABLE IF NOT EXISTS realm_cities (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  realm_id  uuid REFERENCES realms(id) ON DELETE CASCADE,
  q         integer NOT NULL,
  r         integer NOT NULL,
  kind      text NOT NULL,
  name      text NOT NULL,
  critical  boolean DEFAULT false
);

-- Rios (features geográficas independentes de reino)
CREATE TABLE IF NOT EXISTS realm_rivers (
  id     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name   text NOT NULL,
  width  integer DEFAULT 3,
  points jsonb NOT NULL,
  delta  jsonb DEFAULT '[]'
);

-- ── Row Level Security ──────────────────────────────────────

ALTER TABLE realms       ENABLE ROW LEVEL SECURITY;
ALTER TABLE realm_hexes  ENABLE ROW LEVEL SECURITY;
ALTER TABLE realm_cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE realm_rivers ENABLE ROW LEVEL SECURITY;

-- Leitura pública
CREATE POLICY "Leitura pública" ON realms       FOR SELECT USING (true);
CREATE POLICY "Leitura pública" ON realm_hexes  FOR SELECT USING (true);
CREATE POLICY "Leitura pública" ON realm_cities FOR SELECT USING (true);
CREATE POLICY "Leitura pública" ON realm_rivers FOR SELECT USING (true);

-- Escrita apenas para editores/admins (mesmo padrão do schema principal)
CREATE POLICY "Editores escrevem realms" ON realms FOR ALL
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('editor', 'admin')));
CREATE POLICY "Editores escrevem realm_hexes" ON realm_hexes FOR ALL
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('editor', 'admin')));
CREATE POLICY "Editores escrevem realm_cities" ON realm_cities FOR ALL
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('editor', 'admin')));
CREATE POLICY "Editores escrevem realm_rivers" ON realm_rivers FOR ALL
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('editor', 'admin')));
