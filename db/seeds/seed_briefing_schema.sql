-- SCHEMA: "O que você precisa saber" — resumo, panorama e mistérios para os jogadores
-- Cole no SQL Editor do Supabase e clique em Run.
-- Idempotente — pode rodar várias vezes sem perder dados (o seed não sobrescreve itens já editados).
--
-- Cada linha é um bloco da página:
--   kind = 'recap'   → "Em resumo": texto do mestre sobre onde a campanha está agora
--   kind = 'front'   → "Panorama": uma frente/ameaça em curso. status: critico | ativo | latente
--   kind = 'mystery' → "Mistérios e perguntas em aberto". status: aberto | pistas | resolvido
-- body: parágrafos separados por linha em branco.
-- links: [{ "label": "Ayael", "target": "deity:ayael" }] (mesmos alvos de navegação da wiki).
-- hidden = true: rascunho, só editores veem.

CREATE TABLE IF NOT EXISTS briefing_items (
  id           TEXT PRIMARY KEY,
  kind         TEXT NOT NULL CHECK (kind IN ('recap', 'front', 'mystery')),
  title        TEXT,
  body         TEXT,
  status       TEXT,
  links        JSONB DEFAULT '[]'::jsonb,
  session_num  INTEGER,
  hidden       BOOLEAN DEFAULT FALSE,
  sort_order   INTEGER DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS briefing_items_kind_sort_idx ON briefing_items (kind, sort_order);

ALTER TABLE briefing_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Leitura pública" ON briefing_items;
DROP POLICY IF EXISTS "Editores escrevem briefing_items" ON briefing_items;

CREATE POLICY "Leitura pública" ON briefing_items FOR SELECT USING (true);
CREATE POLICY "Editores escrevem briefing_items" ON briefing_items FOR ALL
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('editor', 'admin')));

-- ============================================================
-- SEED: ponto de partida, tirado do artigo da Campanha III
-- (seção "O que Você Precisa Saber"). Revise pelo painel.
-- ============================================================
INSERT INTO briefing_items (id, kind, title, body, status, links, sort_order) VALUES

('resumo', 'recap', NULL,
 E'Wolfspine se rendeu a Oshain. Sebastian Rosewood foi realocado para Redhall — na prática, um refém — e Lady Joice governa sob jugo. Diego se entregou à Princesa Pálida de Lindhaven em troca da vida dos outros e foi levado.\n\nLawrence fundou a Brotherhood of Hope e ascendeu a Paladino. Revna planeja negociar com o Império de Ferro pelo resgate de Diego. Lawrence e John partiram para Nova Lancaster, em busca de um guia para o Grande Escuro.',
 NULL, '[]', 10),

('fenda-ayael', 'front', 'A fenda de Ayael',
 E'A fenda para o Plano de Energia Negativa continua aberta. O sofrimento de Ayael — arcanjo caído, filho de Lamidriel — vaza por ela e alimenta a corrupção que se espalha a partir de Lancaster.\n\nSegundo Dykorkis, a corrupção é reversível, mas fechar a fenda exigiria poder divino considerável.',
 'critico', '[{"label":"Ayael","target":"deity:ayael"}]', 10),

('oshain-blackflame', 'front', 'Oshain e a Blackflame',
 E'A Blackflame opera sob ordens diretas da Rainha Annabella Whiteflame. Oshain ocupa Lancaster e agora também Wolfspine. O livro codificado encontrado na Torre de Fallburgo mostra que a Rainha não está só se aproveitando do caos: está construindo algo com ele.',
 'critico', '[{"label":"Facções","target":"factions"}]', 20),

('diego-preso', 'front', 'Diego está preso',
 E'Diego se rendeu em Lindhaven para que os outros sobrevivessem. Lawrence carrega a espada dele. Revna quer negociar com o Império de Ferro em troca do resgate.',
 'ativo', '[]', 30),

('cacadores', 'front', 'Quem caça o grupo',
 E'A Crucidaemon que consumiu a alma de Ragae mantém uma ligação de caça com Revna. A marca dos Velstrac faz com que eles sempre saibam onde ela está. Cevras, o dragão negro, jurou vingança contra o grupo.',
 'ativo', '[]', 40),

('grande-escuro', 'front', 'Rumo ao Grande Escuro',
 E'Lawrence e John partiram para Nova Lancaster atrás de um guia para o Grande Escuro, onde a Cruzada do Sol está há doze anos sem comunicação.',
 'ativo', '[]', 50),

('projeto-fantasma', 'mystery', 'Qual é o objetivo real do Projeto Fantasma?',
 E'O livro codificado da Blackflame cita dois projetos. O Projeto Oceano é uma arma de destruição em massa. Do Projeto Fantasma, só se sabe o nome.',
 'aberto', '[]', 10),

('aulus-visptas', 'mystery', 'Onde está Aulus Visptas?',
 E'O que a Rainha realmente quer é o grimório de Aulus Visptas — um livro que pode mudar o equilíbrio de poder do mundo. Onde Aulus está, ninguém sabe.',
 'aberto', '[]', 20),

('poder-lawrence', 'mystery', 'É mesmo Lamidriel quem concede o poder de Lawrence?',
 E'Lawrence ascendeu a Paladino na noite da fundação da Brotherhood of Hope, clamando por Lamidriel. Mas a mácula de Ayael, deixada pela Shadow em Lindhaven, ainda está dentro dele — e nenhum sacerdote conseguiu removê-la.',
 'aberto', '[]', 30),

('cruzada-sol', 'mystery', 'O que aconteceu com a Cruzada do Sol?',
 E'A Cruzada do Sol entrou no Grande Escuro há doze anos e não mandou notícias desde então.',
 'aberto', '[]', 40)

ON CONFLICT (id) DO NOTHING;
