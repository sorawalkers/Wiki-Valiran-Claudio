-- SCHEMA: Tabela de Sistema — atualizações de mecânicas e novas funcionalidades
-- Cole no SQL Editor do Supabase e clique em Run.
-- Idempotente — pode rodar várias vezes sem perder dados.

CREATE TABLE IF NOT EXISTS system_entries (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  date_long   TEXT,
  date_short  TEXT,
  compact     BOOLEAN DEFAULT FALSE,
  line        TEXT,
  body        TEXT,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE system_entries ADD COLUMN IF NOT EXISTS date_long   TEXT;
ALTER TABLE system_entries ADD COLUMN IF NOT EXISTS date_short  TEXT;
ALTER TABLE system_entries ADD COLUMN IF NOT EXISTS compact     BOOLEAN DEFAULT FALSE;
ALTER TABLE system_entries ADD COLUMN IF NOT EXISTS line        TEXT;
ALTER TABLE system_entries ADD COLUMN IF NOT EXISTS body        TEXT;
ALTER TABLE system_entries ADD COLUMN IF NOT EXISTS sort_order  INTEGER DEFAULT 0;
ALTER TABLE system_entries ADD COLUMN IF NOT EXISTS created_at  TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE system_entries ADD COLUMN IF NOT EXISTS updated_at  TIMESTAMPTZ DEFAULT NOW();

CREATE INDEX IF NOT EXISTS system_entries_sort_idx ON system_entries (sort_order DESC);

ALTER TABLE system_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read system_entries" ON system_entries;
DROP POLICY IF EXISTS "Auth write system_entries"  ON system_entries;

CREATE POLICY "Public read system_entries"
  ON system_entries FOR SELECT USING (true);

CREATE POLICY "Auth write system_entries"
  ON system_entries FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- SEED: 4 entradas iniciais
-- ============================================================
INSERT INTO system_entries (id, title, date_long, date_short, compact, line, body, sort_order)
VALUES

('marca-ascendencia',
 'Marca da Ascendência',
 '30 do Quarto Mês, 1281',
 '30 · IV · 1281',
 FALSE, NULL,
 E'Quando um personagem testemunha um milagre divino direto — uma manifestação inequívoca de uma das divindades do panteão valirano — recebe a Marca da Ascendência. A marca não é metáfora: aparece fisicamente, em local determinado pelo Mestre, e dura até a próxima sessão completa em descanso pleno.\n\n[img: Sigilo da divindade testemunhada — a marca aparece como impressão fluorescente sobre a pele.]\n\nMecanicamente: enquanto a marca estiver ativa, o personagem rola com vantagem em testes de Sabedoria (Religião) relacionados à divindade testemunhada, e desvantagem em testes de furtividade — a marca brilha fracamente no escuro. Não acumula com outras marcas; a mais recente substitui a anterior.',
 400),

('errata-eldritch-blast',
 'Errata · Eldritch Blast',
 '28 do Quarto Mês, 1281',
 '28 · IV · 1281',
 TRUE,
 'Dano da invocação ocular é 1d8, não 1d10. Ajustar nas fichas de Cassandra e Lawrence.',
 NULL,
 300),

('wiki-mortes-cativos',
 'Wiki · Lápides e nota de paradeiro',
 '24 do Quarto Mês, 1281',
 '24 · IV · 1281',
 FALSE, NULL,
 E'A galeria de Personagens (PC) agora trata mortos como lápides — moldura arredondada, retrato em sépia, nome gravado em Cinzel — e cativos / desaparecidos como retrato com nota rasgada de "última vista".\n\n[img: Lápide aplicada na Harabella e nota aplicada no Diego — comparação antes / depois.]\n\nUse os campos novos do infobox (Morte, Última Vista, Visto Por) na ficha pra preencher. Sem os campos, a card cai graciosamente pro estado padrão.',
 200),

('religiao-valirana-dc',
 'Aviso · DCs de Religião valirana',
 '5 do Quarto Mês, 1281',
 '05 · IV · 1281',
 TRUE,
 'Testes de Religião sobre divindades valiranas (Panteão dos Doze, Senhora da Rapina, Crucidaemon) usam DC base 10, não 15.',
 NULL,
 100)

ON CONFLICT (id) DO UPDATE SET
  title      = EXCLUDED.title,
  date_long  = EXCLUDED.date_long,
  date_short = EXCLUDED.date_short,
  compact    = EXCLUDED.compact,
  line       = EXCLUDED.line,
  body       = EXCLUDED.body,
  sort_order = EXCLUDED.sort_order;
