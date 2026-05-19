-- ============================================================
-- Reinos & Potências — Seed inicial (5 reinos canônicos)
-- Execute APÓS schema-realm-map.sql
-- Dados extraídos de design/hex-data.jsx e design/diorama-data.jsx
-- ============================================================

DO $$
DECLARE
  oshain_id    uuid;
  iron_id      uuid;
  bahamut_id   uuid;
  lorean_id    uuid;
  lancaster_id uuid;
BEGIN

-- ── OSHAIN ───────────────────────────────────────────────────
INSERT INTO realms (slug, name, short, eyebrow, sigil, motto, "desc", accent, accent_deep, cursed, capital_q, capital_r, capital_name, stats6, resources, sort_order)
VALUES (
  'oshain',
  'Reino de Oshain',
  'OSHAIN',
  'Monarquia · expansionista',
  'Crown',
  '"Sob a chama, todo o mundo é casa."',
  'Sob a Rainha Branca Annabella Whiteflame, Oshain triplicou seu território. A Blackflame, oficialmente inexistente, parece sempre presente em cada anexação.',
  '#a83545', '#5a1820', false,
  2, -2, 'Halensgard',
  '{"economia": {"v": 4, "note": "rica em minério; impostos pesados"}, "exercito": {"v": 5, "note": "maior exército do continente · Legiões Brancas"}, "faith": {"v": 3, "note": "Culto da Chama Ressurgida · imposto oficial"}, "trade": {"v": 3, "note": "rotas terrestres dominantes"}, "magia": {"v": 1, "note": "suprimida fora da corte · purgas frequentes"}, "influence": {"v": 5, "note": "corte domina a diplomacia continental"}}',
  '[{"type": "mine", "name": "Minas de Halen", "detail": "ferro · cobre"}, {"type": "farm", "name": "Vales do Norte", "detail": "trigo · gado"}, {"type": "port", "name": "Porto Cinzas", "detail": "frota de invasão"}]',
  1
) RETURNING id INTO oshain_id;

INSERT INTO realm_hexes (realm_id, q, r, biome) VALUES
  (oshain_id,  2, -3, 'plateau'),
  (oshain_id,  3, -3, 'mountain'),
  (oshain_id,  4, -3, 'mountain'),
  (oshain_id,  1, -2, 'plain'),
  (oshain_id,  2, -2, 'plain'),
  (oshain_id,  3, -2, 'plain'),
  (oshain_id,  4, -2, 'plain'),
  (oshain_id,  2, -1, 'plain'),
  (oshain_id,  3, -1, 'forest'),
  (oshain_id,  2,  0, 'forest');

INSERT INTO realm_cities (realm_id, q, r, kind, name, critical) VALUES
  (oshain_id,  3, -3, 'fort', 'Vellis',       false),
  (oshain_id,  4, -2, 'port', 'Porto Cinzas', false);


-- ── IMPÉRIO DE FERRO ─────────────────────────────────────────
INSERT INTO realms (slug, name, short, eyebrow, sigil, motto, "desc", accent, accent_deep, cursed, capital_q, capital_r, capital_name, stats6, resources, sort_order)
VALUES (
  'iron',
  'Império de Ferro',
  'FERRO',
  'Império militar · isolacionista',
  'Sword',
  '"O ferro não se curva, e não é curvado."',
  'Cortaram a própria conexão com a Trama Mágica três gerações atrás. Imunes a magia — e a bênçãos, e a cura. Vivem em isolamento marcial sob Korvath VII.',
  '#9a9aa6', '#2a2a32', false,
  -3, -2, 'Tor Klain',
  '{"economia": {"v": 3, "note": "auto-suficiente · sem comércio externo"}, "exercito": {"v": 5, "note": "Legiões de Aço · disciplina total"}, "faith": {"v": 2, "note": "culto austero do Imperador-de-Aço"}, "trade": {"v": 1, "note": "fronteiras fechadas · embargo recíproco"}, "magia": {"v": 0, "note": "Trama cortada — imunes mas cegos"}, "influence": {"v": 2, "note": "respeitados mas isolados"}}',
  '[{"type": "mine", "name": "Minério de Korvath", "detail": "ferro puro · carvão"}, {"type": "forge", "name": "Forjas do Norte", "detail": "aço inquebrável"}]',
  2
) RETURNING id INTO iron_id;

INSERT INTO realm_hexes (realm_id, q, r, biome) VALUES
  (iron_id, -4, -3, 'tundra'),
  (iron_id, -3, -3, 'mountain'),
  (iron_id, -2, -3, 'mountain'),
  (iron_id, -1, -3, 'mountain'),
  (iron_id, -4, -2, 'tundra'),
  (iron_id, -3, -2, 'plain'),
  (iron_id, -2, -2, 'mountain'),
  (iron_id, -1, -2, 'plateau'),
  (iron_id, -3, -1, 'plateau'),
  (iron_id, -2, -1, 'mountain');

INSERT INTO realm_cities (realm_id, q, r, kind, name, critical) VALUES
  (iron_id, -1, -3, 'fort', 'Vala Coruja', false),
  (iron_id, -4, -2, 'port', 'P. Korvath',  false);


-- ── REPÚBLICA PRATEADA ───────────────────────────────────────
INSERT INTO realms (slug, name, short, eyebrow, sigil, motto, "desc", accent, accent_deep, cursed, capital_q, capital_r, capital_name, stats6, resources, sort_order)
VALUES (
  'bahamut',
  'República Prateada',
  'BAHAMUT',
  'República dracônica · bastião',
  'Dragon',
  '"A justiça não tem escamas — mas conhece quem as tem."',
  'Fundada por dragões metálicos anciões. O Conselho dos Dez governa a partir de Aerithys — refúgio último de heróis e fugitivos da expansão oshainita.',
  '#7aa6c4', '#1d3850', false,
  -4, 3, 'Aerithys',
  '{"economia": {"v": 3, "note": "comércio marítimo abundante"}, "exercito": {"v": 3, "note": "Cavaleiros Prateados · qualidade > quantidade"}, "faith": {"v": 4, "note": "devoção ao Pai Platinado"}, "trade": {"v": 5, "note": "maior porto livre · hub comercial"}, "magia": {"v": 4, "note": "magia dracônica antiga · proteções platinadas"}, "influence": {"v": 3, "note": "respeito moral mas peso militar limitado"}}',
  '[{"type": "port", "name": "Vela Branca", "detail": "porto livre · refugiados"}, {"type": "farm", "name": "Pastos Prateados", "detail": "cavalos · ovelhas finas"}, {"type": "lib", "name": "Biblioteca Antiga", "detail": "arquivo dracônico"}]',
  3
) RETURNING id INTO bahamut_id;

INSERT INTO realm_hexes (realm_id, q, r, biome) VALUES
  (bahamut_id, -5,  2, 'forest'),
  (bahamut_id, -4,  2, 'plain'),
  (bahamut_id, -3,  2, 'plain'),
  (bahamut_id, -2,  2, 'plateau'),
  (bahamut_id, -1,  2, 'mountain'),
  (bahamut_id, -5,  3, 'forest'),
  (bahamut_id, -4,  3, 'plain'),
  (bahamut_id, -3,  3, 'plain'),
  (bahamut_id, -2,  3, 'forest'),
  (bahamut_id, -4,  4, 'plain'),
  (bahamut_id, -3,  4, 'mountain');

INSERT INTO realm_cities (realm_id, q, r, kind, name, critical) VALUES
  (bahamut_id, -1,  2, 'fort',   'Forte Platina', false),
  (bahamut_id, -5,  2, 'port',   'Vela Branca',   false),
  (bahamut_id, -3,  4, 'arcane', 'Ninho Antigo',  false);


-- ── MAGOCRACIA DE LOREAN TREAZ ───────────────────────────────
INSERT INTO realms (slug, name, short, eyebrow, sigil, motto, "desc", accent, accent_deep, cursed, capital_q, capital_r, capital_name, stats6, resources, sort_order)
VALUES (
  'lorean',
  'Magocracia de Lorean Treaz',
  'LOREAN',
  'Magocracia · vanguarda arcana',
  'Tome',
  '"O fio que se conhece é o fio que se domina."',
  'Governada pelo Concílio Magisterial, sete arquimagos. Pioneira em tecnologia Warforged e manipulação direta da Trama. Únicas leis arcanas que prendem o próprio rei.',
  '#9c86c4', '#2c1f4a', false,
  4, 2, 'Torre Plúrima',
  '{"economia": {"v": 3, "note": "cara mas exclusiva · artefatos arcanos"}, "exercito": {"v": 2, "note": "Legião Warforged pequena mas implacável"}, "faith": {"v": 1, "note": "magia substitui religião"}, "trade": {"v": 3, "note": "exporta encantamentos a Bahamut"}, "magia": {"v": 5, "note": "manipulação direta da Trama · sem rivais"}, "influence": {"v": 4, "note": "arquimagos cortejados por todas as cortes"}}',
  '[{"type": "arcane", "name": "Vão da Trama", "detail": "falha planar controlada"}, {"type": "forge", "name": "Forja Warforged", "detail": "corações de cristal"}, {"type": "lib", "name": "Biblioteca-Mãe", "detail": "todo conhecimento arcano"}]',
  4
) RETURNING id INTO lorean_id;

INSERT INTO realm_hexes (realm_id, q, r, biome) VALUES
  (lorean_id,  3,  1, 'desert'),
  (lorean_id,  4,  1, 'plateau'),
  (lorean_id,  5,  1, 'mountain'),
  (lorean_id,  3,  2, 'desert'),
  (lorean_id,  4,  2, 'plateau'),
  (lorean_id,  5,  2, 'plateau'),
  (lorean_id,  2,  3, 'plateau'),
  (lorean_id,  3,  3, 'desert'),
  (lorean_id,  4,  3, 'plain'),
  (lorean_id,  5,  3, 'plain'),
  (lorean_id,  3,  4, 'plain'),
  (lorean_id,  4,  4, 'forest');

INSERT INTO realm_cities (realm_id, q, r, kind, name, critical) VALUES
  (lorean_id,  5,  1, 'arcane', 'Vão da Trama',    false),
  (lorean_id,  3,  4, 'fort',   'F. Warforged',     false),
  (lorean_id,  2,  3, 'arcane', 'Biblioteca-Mãe',  false);


-- ── NOVA LANCASTER (cursed) ───────────────────────────────────
INSERT INTO realms (slug, name, short, eyebrow, sigil, motto, "desc", accent, accent_deep, cursed, capital_q, capital_r, capital_name, stats6, resources, sort_order)
VALUES (
  'lancaster',
  '† Nova Lancaster',
  'LANCASTER',
  'Ruínas ocupadas · corrompida',
  'Chain',
  '"Onde Esmir dormia, agora apenas se chora."',
  'O antigo reino sagrado caiu em 3ªE 1276 quando o Selo da Tumba dos Hereges foi rompido. Oshain anexou as ruínas e as renomeou.',
  '#c95560', '#2a0a0e', true,
  0, 0, '† Lancaster',
  '{"economia": {"v": 0, "note": "colapso total · cinzas e sal"}, "exercito": {"v": 1, "note": "guarnição oshainita reduzida"}, "faith": {"v": 0, "note": "templos profanados"}, "trade": {"v": 0, "note": "costa inavegável · névoa permanente"}, "magia": {"v": 3, "note": "necromancia espontânea da fenda"}, "influence": {"v": 0, "note": "apagada do registro"}}',
  '[{"type": "arcane", "name": "Tumba dos Hereges", "detail": "selo rompido · fonte da corrupção", "critical": true}]',
  5
) RETURNING id INTO lancaster_id;

INSERT INTO realm_hexes (realm_id, q, r, biome) VALUES
  (lancaster_id,  0, -1, 'swamp'),
  (lancaster_id,  1, -1, 'swamp'),
  (lancaster_id,  0,  0, 'swamp'),
  (lancaster_id,  1,  0, 'swamp'),
  (lancaster_id,  0,  1, 'swamp');

INSERT INTO realm_cities (realm_id, q, r, kind, name, critical) VALUES
  (lancaster_id,  1, -1, 'arcane', 'Tumba Hereges', true),
  (lancaster_id,  1,  0, 'fort',   'Forte Cinza',   false);


-- ── RIOS ─────────────────────────────────────────────────────
INSERT INTO realm_rivers (name, width, points, delta) VALUES
  (
    'Rio Verme', 4,
    '[[2,-3],[2,-2],[2,-1],[2,0],[1,0],[0,0]]'::jsonb,
    '[[0,0],[0,1],[-1,1]]'::jsonb
  ),
  (
    'Veio Prateado', 3,
    '[[-3,4],[-3,3],[-2,3],[-1,2],[0,1]]'::jsonb,
    '[[0,1],[1,1]]'::jsonb
  ),
  (
    'Rio Trama', 3,
    '[[5,1],[4,2],[3,3],[3,4],[2,3]]'::jsonb,
    '[[2,3],[1,3]]'::jsonb
  );

END $$;
