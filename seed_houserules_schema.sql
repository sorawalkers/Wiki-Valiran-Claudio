-- SCHEMA: Tabela de regras da casa — O Arquivo de Valiran
-- Cole no SQL Editor do Supabase e clique em Run

CREATE TABLE IF NOT EXISTS houserules (
  id            TEXT PRIMARY KEY,
  title         TEXT NOT NULL,
  paragraphs    JSONB DEFAULT '[]'::jsonb,
  callout_label TEXT,
  callout_text  TEXT,
  sort_order    INTEGER DEFAULT 0,
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE houserules ADD COLUMN IF NOT EXISTS paragraphs    JSONB DEFAULT '[]'::jsonb;
ALTER TABLE houserules ADD COLUMN IF NOT EXISTS callout_label TEXT;
ALTER TABLE houserules ADD COLUMN IF NOT EXISTS callout_text  TEXT;
ALTER TABLE houserules ADD COLUMN IF NOT EXISTS sort_order    INTEGER DEFAULT 0;
ALTER TABLE houserules ADD COLUMN IF NOT EXISTS updated_at    TIMESTAMPTZ DEFAULT NOW();

-- RLS
ALTER TABLE houserules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read houserules" ON houserules;
DROP POLICY IF EXISTS "Auth write houserules"  ON houserules;

CREATE POLICY "Public read houserules"
  ON houserules FOR SELECT USING (true);

CREATE POLICY "Auth write houserules"
  ON houserules FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- SEED: 5 regras iniciais
-- ============================================================
INSERT INTO houserules (id, title, paragraphs, callout_label, callout_text, sort_order)
VALUES

('inspiracao-destino', 'Inspiração & Pontos do Destino',
'["Cada jogador começa a sessão com 1 ponto de Inspiração. Pode ser gasto a qualquer momento para rolar com vantagem em um teste, OU dado a outro jogador como reconhecimento de boa interpretação.",
  "O Mestre concede Inspiração extra quando: (a) você descreve a sua ação em vez de citar a mecânica, (b) você toma uma decisão difícil em vez de uma fácil, (c) você faz a mesa rir sem quebrar o tom."]'::jsonb,
'Lembrete',
'Inspiração não acumula entre sessões. Use ou perca. O Mestre registra ao final de cada sessão se você terminou com saldo.',
10),

('critico-falha', 'Crítico & Falha Crítica',
'["Ataques críticos (rolagem natural de 20): dobre todos os dados de dano, não os modificadores. Em alvos vulneráveis, o crítico ignora resistências do mesmo tipo.",
  "Falhas críticas (rolagem natural de 1) em combate: o personagem perde a ação de movimento no próximo turno. Em testes fora de combate, o Mestre narra uma complicação proporcional ao risco da tarefa."]'::jsonb,
NULL, NULL, 20),

('magia-corrompida', 'Magia em Terra Corrompida',
'["Toda magia conjurada em regiões marcadas como Corrompidas no mapa exige um teste de Concentração (CD 10 + nível do feitiço) mesmo sem dano sofrido. Falha: o feitiço é conjurado, mas algo mais escapa da Trama junto.",
  "Necromância em terra corrompida é amplificada — e literalmente puxa material direto do cárcere de Ayael. Os efeitos secundários são reais, narrativos, e raramente bonitos."]'::jsonb,
'Aviso ao Mestre',
'Não use esta regra como punição arbitrária. Use-a quando a mesa esquecer onde está pisando. O peso da geografia mágica é parte da experiência.',
30),

('descanso-cura', 'Tempo de Descanso & Cura',
'["Descanso curto: 1 hora, recupera dados de vida usando dados de classe + Constituição (normal).",
  "Descanso longo: 8 horas, mas exige local seguro e preparado. Pernoitar em estrada conta como descanso curto. Quem for ferido por necromância na sessão precisa de 24 horas em local consagrado para recuperar vida máxima."]'::jsonb,
NULL, NULL, 40),

('etiqueta-mesa', 'Etiqueta de Mesa',
'["Celulares ficam virados para baixo durante interpretação. Pode usar entre as cenas. Combate: foco total — quem chega depois da rolagem de iniciativa só age no próximo round.",
  "Vetos sem julgamento: qualquer jogador pode levantar a mão e pedir para mudar o rumo de uma cena. O Mestre acata sem perguntar o porquê. Conversamos depois, se for útil."]'::jsonb,
'Princípio fundador',
'A mesa existe para gerar memórias compartilhadas. Tudo o mais é estrutura para sustentar isso.',
50)

ON CONFLICT (id) DO UPDATE SET
  title         = EXCLUDED.title,
  paragraphs    = EXCLUDED.paragraphs,
  callout_label = EXCLUDED.callout_label,
  callout_text  = EXCLUDED.callout_text,
  sort_order    = EXCLUDED.sort_order;
