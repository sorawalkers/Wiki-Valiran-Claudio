-- SCHEMA: Tabela de facções — O Arquivo de Valiran
-- Cole no SQL Editor do Supabase e clique em Run
-- Execute ANTES de usar a aba de Facções

CREATE TABLE IF NOT EXISTS factions (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  alias       TEXT,
  stamp       TEXT,
  stamp_class TEXT,
  rows        JSONB DEFAULT '[]'::jsonb,
  summary     TEXT,
  sort_order  INTEGER DEFAULT 0,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE factions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read factions"
  ON factions FOR SELECT USING (true);

CREATE POLICY "Auth write factions"
  ON factions FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- SEED: 4 facções iniciais
-- ============================================================
INSERT INTO factions (id, name, alias, stamp, stamp_class, rows, summary, sort_order)
VALUES

('blackflame','Blackflame','A Mão Esquerda da Rainha','CONFIDENCIAL',NULL,
'[{"k":"Origem","v":"Reino de Oshain · ≈ 2ªE 798"},{"k":"Comando","v":"Annabella Whiteflame (confirmado)"},{"k":"Membros","v":"≈ 240 (estimado)"},{"k":"Operações","v":"Sabotagem, infiltração, ruptura planar"},{"k":"Patente máx.","v":"CHAMA NEGRA"}]'::jsonb,
'Organização que oficialmente não existe. Documentos vazados em 1278 sugerem participação direta na queda de Lancaster. A Rainha negou em discurso público; a negação durou trinta segundos.',
10),

('lacrimosi','Os Lacrimosi','Os Que Choram','HERESIA · CLASSE III',NULL,
'[{"k":"Origem","v":"Itinerante · sem base fixa"},{"k":"Comando","v":"[DADO EXPURGADO]","redacted":true},{"k":"Membros","v":"Desconhecido · circulação rural"},{"k":"Operações","v":"Pregação, vigília, libertação angélica"},{"k":"Patente máx.","v":"IRMÃO DA LÁGRIMA"}]'::jsonb,
'Adoram Ayael — não por crueldade, mas por piedade. Querem libertá-lo. São proibidos em quase todo o continente, e em alguns lugares queimados em praça. Em outros, infelizmente, têm razão.',
20),

('concilio-magisterial','Concílio Magisterial','Os Sete da Torre','OFICIAL · LIBERADO','green',
'[{"k":"Origem","v":"Lorean Treaz · 2ªE 314"},{"k":"Comando","v":"Mestra Ven Sothiel (decano)"},{"k":"Membros","v":"7 arquimagos eleitos"},{"k":"Operações","v":"Governo, pesquisa arcana, Warforged"},{"k":"Patente máx.","v":"DECANO"}]'::jsonb,
'O conselho que governa Lorean Treaz. Únicos no continente a possuírem o direito legal de prender o próprio chefe de estado por violação ética. Já exerceram esse direito uma vez.',
30),

('pacto-velhaur','[REGISTRO SELADO]','O Pacto da Casa Velhaur','SELADO · CONSELHO',NULL,
'[{"k":"Origem","v":"[DADO EXPURGADO]","redacted":true},{"k":"Comando","v":"[DADO EXPURGADO]","redacted":true},{"k":"Membros","v":"[DADO EXPURGADO]","redacted":true},{"k":"Operações","v":"Conhecidas apenas pela Mesa do Conselho"},{"k":"Patente máx.","v":"[DADO EXPURGADO]","redacted":true}]'::jsonb,
'O conteúdo deste dossiê foi selado por ordem do Arquivo em 11 do segundo mês, 1281. Tentativas de acesso não autorizado serão registradas e respondidas.',
40)

ON CONFLICT (id) DO UPDATE SET
  name        = EXCLUDED.name,
  alias       = EXCLUDED.alias,
  stamp       = EXCLUDED.stamp,
  stamp_class = EXCLUDED.stamp_class,
  rows        = EXCLUDED.rows,
  summary     = EXCLUDED.summary,
  sort_order  = EXCLUDED.sort_order;
