-- SCHEMA + SEED: Reinos & Adições Recentes — O Arquivo de Valiran
-- Cole no SQL Editor do Supabase e clique em Run

-- ============================================================
-- latest_entries — novas colunas para o feed de adições
-- ============================================================
ALTER TABLE latest_entries ADD COLUMN IF NOT EXISTS entry_type  TEXT    DEFAULT 'edit';
ALTER TABLE latest_entries ADD COLUMN IF NOT EXISTS type_label  TEXT    DEFAULT 'EDIÇÃO';
ALTER TABLE latest_entries ADD COLUMN IF NOT EXISTS date_label  TEXT;
ALTER TABLE latest_entries ADD COLUMN IF NOT EXISTS time_label  TEXT;
ALTER TABLE latest_entries ADD COLUMN IF NOT EXISTS sort_order  INTEGER DEFAULT 0;

-- RLS write policy (pode já existir — DROP IF EXISTS antes de recriar)
DROP POLICY IF EXISTS "Editores escrevem latest_entries" ON latest_entries;
CREATE POLICY "Editores escrevem latest_entries"
  ON latest_entries FOR ALL
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('editor','admin')));

-- ============================================================
-- kingdoms — RLS write policy
-- ============================================================
DROP POLICY IF EXISTS "Editores escrevem kingdoms" ON kingdoms;
CREATE POLICY "Editores escrevem kingdoms"
  ON kingdoms FOR ALL
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('editor','admin')));

-- ============================================================
-- SEED: 5 reinos iniciais (kingdoms)
-- ============================================================
TRUNCATE TABLE kingdoms;

INSERT INTO kingdoms (sigil, eyebrow, name, motto, "desc", stats, target, sort_order)
VALUES

('Crown',
 'Monarquia · expansionista',
 'Reino de Oshain',
 '"Sob a chama, todo o mundo é casa."',
 'Liderado há mais de um século pela Rainha Annabella Whiteflame, Oshain triplicou seu território no último século. A organização Blackflame, oficialmente inexistente, parece sempre presente em cada anexação.',
 '[{"k":"Capital","v":"Halensgard"},{"k":"Liderança","v":"Rainha Annabella"},{"k":"População","v":"≈ 4.2M"},{"k":"Alinhamento","v":"Tirânico","danger":true}]'::jsonb,
 'map', 10),

('Dragon',
 'República dracônica · bastião',
 'República Prateada de Bahamut',
 '"A justiça não tem escamas — mas conhece quem as tem."',
 'Fundada por dragões metálicos anciões há mil anos. Hoje, o Conselho dos Dez governa a partir da cidade de Aerithys. Refúgio último de heróis, dissidentes e fugitivos da expansão oshainita.',
 '[{"k":"Capital","v":"Aerithys"},{"k":"Liderança","v":"Conselho dos Dez"},{"k":"População","v":"≈ 2.8M"},{"k":"Alinhamento","v":"Leal-Bom"}]'::jsonb,
 'map', 20),

('Tome',
 'Magocracia · vanguarda arcana',
 'Magocracia de Lorean Treaz',
 '"O fio que se conhece é o fio que se domina."',
 'Governada pelo Concílio Magisterial, sete arquimagos eleitos pelos pares. Pioneira em tecnologia Warforged, em manipulação direta da Trama, e nas únicas leis arcanas do continente que prendem o próprio rei.',
 '[{"k":"Capital","v":"Torre Plúrima"},{"k":"Liderança","v":"Concílio (7)"},{"k":"População","v":"≈ 1.6M"},{"k":"Alinhamento","v":"Neutro"}]'::jsonb,
 'weave', 30),

('Crown',
 'Império militar · isolacionista',
 'Império de Ferro',
 '"O ferro não se curva, e não é curvado."',
 'Cortaram sua própria conexão com a Trama Mágica três gerações atrás. Imunes a manipulação arcana — e a benções, e a cura. Vivem em isolamento marcial sob o Imperador-de-Aço Korvath VII.',
 '[{"k":"Capital","v":"Tor Klain"},{"k":"Liderança","v":"Korvath VII"},{"k":"População","v":"≈ 3.0M"},{"k":"Alinhamento","v":"Leal-Neutro"}]'::jsonb,
 'weave', 40),

('Chain',
 'Ruínas ocupadas · corrompida',
 '† Nova Lancaster',
 '"Onde Esmir dormia, agora apenas se chora."',
 'O antigo reino sagrado de Lancaster caiu em 1276 quando o Selo da Tumba dos Hereges foi rompido. Oshain anexou as ruínas e as renomeou. A corrupção continua a vazar do solo até hoje.',
 '[{"k":"Antigo nome","v":"Lancaster"},{"k":"Caiu em","v":"3ªE 1276"},{"k":"Ocupada por","v":"Oshain"},{"k":"Estado","v":"Corrompida","danger":true}]'::jsonb,
 'timeline', 50);

-- ============================================================
-- SEED: adições recentes iniciais (latest_entries)
-- ============================================================
TRUNCATE TABLE latest_entries;

INSERT INTO latest_entries (entry_type, type_label, date_label, time_label, title, excerpt, author, target, tag, meta, sort_order)
VALUES

('new',    'NOVO',   '14 do Segundo Mês, 1281', '22:14', 'Ayael, o que Sangra Luz',         'Entrada criada · 8 seções, 14 referências cruzadas',                          'Cael',              'article',  'Divindade · Anjo Aprisionado', 'Atualizado · 3ª Era, 1281', 10),
('edit',   'EDIÇÃO', '14 do Segundo Mês, 1281', '19:48', 'A Queda de Lancaster',             'Adicionados testemunhos da Casa Velhaur · §3 e §5 reescritos',                'Volgren',           'timeline', 'Evento · Catástrofe',          'Cronologia · 1276',         20),
('danger', 'AVISO',  '14 do Segundo Mês, 1281', '17:02', 'Tumba dos Hereges',                'Reportado novo vazamento planar — região rebaixada a "Corrompida"',           'Patrulha Prateada', 'map',      NULL,                           NULL,                        30),
('minor',  'MENOR',  '14 do Segundo Mês, 1281', '14:30', 'Bahamut, Pai Platinado',           'Correção tipográfica · epíteto restaurado',                                   'Cael',              NULL,       NULL,                           NULL,                        40),

('new',    'NOVO',   '13 do Segundo Mês, 1281', '23:11', 'Noel Braent, o Agente do Selo',   'Dossiê classificado · acesso restrito à Mesa',                                'Mestre',            NULL,       'Personagem · Antagonista',     'Adicionado · sessão 14',    50),
('edit',   'EDIÇÃO', '13 do Segundo Mês, 1281', '20:55', 'Annabella Whiteflame',             'Anexada cronologia comparativa de aparições públicas (séc. XI–XIII)',         'Volgren',           NULL,       'Reino · Monarquia',            'Atualizado · 1281',         60),
('edit',   'EDIÇÃO', '13 do Segundo Mês, 1281', '16:40', 'Warforged · Coração de Cristal',  'Diagramas técnicos atualizados — Ven Sothiel revisou pessoalmente',           'Aprendiz Iren',     NULL,       'Tecnologia · Arcano',          'Atualizado · 1280',         70),

('new',    'NOVO',   '12 do Segundo Mês, 1281', '21:30', 'Os Lacrimosi',                    'Facção herética catalogada · 8 membros conhecidos',                           'Cael',              NULL,       NULL,                           NULL,                        80),
('minor',  'MENOR',  '12 do Segundo Mês, 1281', '15:12', 'A Trama Mágica',                  'Adicionado glossário',                                                        'Aprendiz Iren',     NULL,       NULL,                           NULL,                        90),
('danger', 'PURGA',  '12 do Segundo Mês, 1281', '11:00', 'Tratado da Compaixão Excessiva',  'Entrada selada por ordem do Conselho · acesso revogado',                      'Conselho',          NULL,       NULL,                           NULL,                        100),

('edit',   'EDIÇÃO', '11 do Segundo Mês, 1281', '22:00', 'Sessão 23 · As Marcas no Pântano','Diário transcrito por Volgren · 14 páginas',                                  'Volgren',           'sessions', NULL,                           NULL,                        110),
('edit',   'EDIÇÃO', '11 do Segundo Mês, 1281', '18:22', 'República Prateada de Bahamut',   'Atualizado mapa político — anexação de Vellis pela coroa de Aerithys',        'Cael',              NULL,       NULL,                           NULL,                        120);
