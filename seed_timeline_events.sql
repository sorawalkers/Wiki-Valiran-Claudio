-- SEED: Linha do Tempo + Eventos da Era — O Arquivo de Valiran
-- Cole no SQL Editor do Supabase e clique em Run
-- ATENÇÃO: apaga os dados existentes antes de inserir

-- ============================================================
-- SEÇÃO 4 — LINHA DO TEMPO (timeline_events)
-- ============================================================

TRUNCATE TABLE timeline_events;

INSERT INTO timeline_events (era, year, label, title, "desc", tag, kind, sort_order) VALUES

-- ── Divisor de Era ───────────────────────────────────────────
('Era Pré-Vranócia · O Mundo Antes do Marco', NULL, NULL, NULL, NULL, NULL, NULL, 1),

-- ── Era Pré-Vranócia ─────────────────────────────────────────
(NULL, '-806',          'Político',    'Fundação do Império Vranócio',          'Almirante Kaethys unifica os reinos e funda o Império Vranócio — considerado o pai fundador da humanidade em Valiran.',                                                                                  'Vranócia',          'political',   2),
(NULL, '-637',          'Político',    'Fundação do Reino de Amyst',            'Fundação especulada do Reino de Amyst, uma das mais antigas nações de Valiran.',                                                                                                                           'Amyst',             'political',   3),
(NULL, '-531',          'Divino',      'Esmir Lihleran Chega a Audreosta',      'O Rei Esmir Lihleran foge do Arauto das Trevas e encontra refúgio nas terras de Audreosta.',                                                                                                               'Esmir',             'divine',      4),
(NULL, '-443',          'Divino',      'Sacrifício e Ascensão de Esmir',        'Esmir se sacrifica para selar o Arauto das Trevas e ascende à divindade por concessão de Vofureon.',                                                                                                       'Esmir',             'divine',      5),
(NULL, '-443 a -431',   'Religioso',   'Movimento Yelun',                       'Elfos solares desiludidos questionam a fé na Luz após a invasão umbral. Surgem os Yelunians.',                                                                                                             'Yelun',             NULL,          6),
(NULL, '-431 a -430',   'Político',    'Êxodo de Yelun',                        'A profetisa Yelun lidera seus seguidores ao norte, fundando a nação de Yeleluna.',                                                                                                                         'Yeleluna',          'political',   7),
(NULL, '-386',          'Político',    'Fundação de Silverhain',                'Dragões anciões chegam ao norte de Valiran após separação do reino tirano Draekhor e fundam Silverhain.',                                                                                                  'Silverhain',        'political',   8),
(NULL, '-369',          'Divino',      'Ascensão de Naomi',                     'Durante a invasão de Draekhor ao Reino de Amyst, Naomi ascende à divindade no Cerco de Nafar.',                                                                                                            'Naomi',             'divine',      9),
(NULL, '-259',          'Arcano',      'Lago Koldvir Congelado',                'Primeiro registro do Lago Koldvir permanentemente congelado. A origem do fenômeno permanece desconhecida.',                                                                                                'Koldvir',           'arcane',      10),
(NULL, '-247',          'Político',    'Surgimento do Movimento de Ferro',      'O Movimento de Ferro emerge em Yeleluna na esteira de conflitos prolongados com as tribos Koldvir.',                                                                                                       'Yeleluna',          'political',   11),
(NULL, '-237',          'Arcano',      'Descoberta da Tecnologia Warforged',    'Corações arcanos são desenvolvidos como núcleo de máquinas de guerra, inaugurando a era Warforged.',                                                                                                       'Warforged',         'arcane',      12),
(NULL, '-237 a -231',   'Catástrofe',  'Guerra de Extermínio Koldvir',          'As tribos Koldvir são forçadas a fugir para além do Lago Koldvir após uma guerra de extermínio sistemático.',                                                                                             'Koldvir',           'catastrophe', 13),
(NULL, '-231',          'Político',    'Cisma do Ferro',                        'Os enclaves do Movimento de Ferro se separam formalmente de Yeleluna, fragmentando a nação.',                                                                                                              'Yeleluna',          'political',   14),
(NULL, '-208',          'Arcano',      'Iron Severance',                        'Alquimistas cortam sua conexão com a Trama Mágica permanentemente. Eles e seus descendentes tornam-se imunes à manipulação mágica.',                                                                       'Movimento de Ferro','arcane',      15),
(NULL, '-59',           'Político',    'Independência de Oshain',               'O Reino de Oshain declara independência do Império Vranócio em decadência.',                                                                                                                              'Oshain',            'political',   16),

-- ── Divisor de Era ───────────────────────────────────────────
('Era Atual · AQV — Após a Queda de Vranócia', NULL, NULL, NULL, NULL, NULL, NULL, 17),

-- ── Era Atual — AQV ──────────────────────────────────────────
(NULL, '0 AQV',          'Catástrofe', 'Queda do Império Vranócio',              'O Império Vranócio colapsa. Este evento marca o Marco Zero da era atual em Valiran.',                                                                                                                     'Vranócia',  'catastrophe', 18),
(NULL, '24 AQV',         'Arcano',     'Descoberta da Tecnologia Fullforged',    'Colaboração entre o Império de Ferro, os Aurforges e o Ducado Vox de Oshain resulta na tecnologia Fullforged.',                                                                                           'Warforged', 'arcane',      19),
(NULL, '48 AQV',         'Político',   'Coroação de Annabella Whiteflame I',     'Annabella Whiteflame I inicia seu reinado como rainha de Oshain, apoiada pelos duques ocidentais.',                                                                                                       'Oshain',    'political',   20),
(NULL, '67 AQV',         'Divino',     'Annabella, a Eterna',                    'Annabella recebe o epíteto ''a Eterna'' — sua aparência cessa de envelhecer. Conspiradores que questionam o fato são perseguidos.',                                                                       'Oshain',    'divine',      21),
(NULL, '77 AQV',         'Catástrofe', 'O Isolamento de Lancaster',              'Lancaster se isola misteriosamente. Fugitivos que escapam revelam a presença de Xathyr dentro do reino.',                                                                                                 'Lancaster', 'catastrophe', 22),
(NULL, '78 a 80 AQV',    'Divino',     '1ª Cruzada do Sol',                     'Vaglies Lihleran lidera a libertação de Lancaster das garras de Xathyr.',                                                                                                                                 'Lancaster', 'divine',      23),
(NULL, '84 AQV',         'Catástrofe', 'Guerra Civil de Lancaster',              'A ressurgência de Xathyr deflagra uma guerra civil em Lancaster. Wolfspine é vassalizada ao fim do conflito.',                                                                                            'Lancaster', 'catastrophe', 24),
(NULL, '85 a 91 AQV',    'Divino',     '2ª Cruzada do Sol',                     'Vaglies lidera uma descida ao Grande Escuro. Um reino de anões âmbar é libertado e uma base é estabelecida no abismo.',                                                                                   'Lancaster', 'divine',      25),
(NULL, '96 AQV',         'Divino',     '3ª Cruzada do Sol',                     'Nova cruzada iniciada com o objetivo de matar Xathyr e trazer seu corpo físico a Audreosta. O grupo está no Grande Escuro há doze anos.',                                                                 'Lancaster', 'divine',      26),
(NULL, '104 AQV',        'Político',   'Campanha I — O Herege de Lancaster',    'Eventos envolvendo Noel Braent: o grupo o resgata sem conhecer sua verdadeira natureza.',                                                                                                                  'Lancaster', 'political',   27),
(NULL, '105 AQV',        'Catástrofe', 'A Queda de Lancaster',                  'Noel Braent abre a fenda planar na Tumba dos Hereges e marcha sobre Lancaster com um exército de Shadows. Vaglies se sacrifica. Lancaster cai.',                                                           'Lancaster', 'catastrophe', 28),
(NULL, '105 AQV · Mês 2','Político',   'Nova Lancaster — Sátrapia de Oshain',   'Lancaster é incorporada a Oshain como Sátrapia de Nova Lancaster. Wolfspine declara independência. Casa Lanbarth une-se a Isliria.',                                                                      'Lancaster', 'political',   29),
(NULL, '106 AQV',        'Político',   'Rogue-I — O Pôr do Sol de Lancaster',   'Seguidores da Alvorada são formados. Aragrett desaparece na 6ª incursão ao Grande Escuro. Um Oddling servo de Xathyr é descoberto e derrotado.',                                                          'Lancaster', 'political',   30),
(NULL, '107 AQV',        'Catástrofe', 'Campanha III — Segredos de Lamidriel',  'Eventos em Wolfspine, Silverhain e Lidhaven. Mortes de Feronar, Ragae, Harabella, Wander e Rian. Lidhaven cai; Wolfspine é vassalizada. Brotherhood of Hope fundada.',                                    NULL,        'catastrophe', 31),
(NULL, '107 a 108 AQV',  'Arcano',     'Campanha III.5 — O Grimório de Arngast','A Brotherhood chega a Silverhain. O grimório de Arngast é descoberto e pesquisas sobre o Visionário avançam. Lawrence e John partem para Nova Lancaster.',                                                NULL,        'arcane',      32),
(NULL, '108 AQV',        'Presente',   'Ano Corrente',                          'Ano atual em Valiran.',                                                                                                                                                                                    NULL,        NULL,          33);


-- ============================================================
-- SEÇÃO 5 — EVENTOS DA ERA (events)
-- ============================================================

TRUNCATE TABLE events;

INSERT INTO events (year, cat, "catLabel", title, "desc", region, target, sort_order) VALUES

-- ── Era Pré-Vranócia ─────────────────────────────────────────
('-806',         'pol',  'Político',   'Fundação do Império Vranócio',         'Almirante Kaethys unifica os reinos e funda o Império Vranócio.',                                                   'Valiran (continental)',          NULL,       1),
('-637',         'pol',  'Político',   'Fundação do Reino de Amyst',           'Fundação especulada do Reino de Amyst.',                                                                             'Audreosta',                      NULL,       2),
('-531',         'div',  'Divino',     'Esmir Lihleran Chega a Audreosta',     'O Rei Esmir foge do Arauto das Trevas e busca refúgio em Audreosta.',                                                'Audreosta',                      NULL,       3),
('-443',         'div',  'Divino',     'Sacrifício e Ascensão de Esmir',       'Esmir sela o Arauto das Trevas e ascende à divindade por concessão de Vofureon.',                                    'Audreosta',                      NULL,       4),
('-443 a -431',  'div',  'Divino',     'Movimento Yelun',                      'Elfos solares questionam a fé na Luz após invasão umbral. Surgem os Yelunians.',                                    'Yeleluna',                       NULL,       5),
('-431 a -430',  'pol',  'Político',   'Êxodo de Yelun',                       'A profetisa Yelun funda Yeleluna ao norte de Valiran.',                                                              'Norte de Valiran',               NULL,       6),
('-386',         'pol',  'Político',   'Fundação de Silverhain',               'Dragões anciões separados de Draekhor fundam Silverhain.',                                                           'Norte de Valiran',               NULL,       7),
('-369',         'div',  'Divino',     'Ascensão de Naomi',                    'Naomi ascende à divindade durante o Cerco de Nafar, na invasão de Draekhor.',                                       'Amyst',                          NULL,       8),
('-259',         'arc',  'Arcano',     'Lago Koldvir Congelado',               'Primeiro registro do Lago Koldvir permanentemente congelado.',                                                       'Norte de Valiran',               NULL,       9),
('-247',         'pol',  'Político',   'Surgimento do Movimento de Ferro',     'O Movimento de Ferro emerge em Yeleluna após conflitos com tribos Koldvir.',                                         'Yeleluna',                       NULL,       10),
('-237',         'arc',  'Arcano',     'Descoberta da Tecnologia Warforged',   'Corações arcanos desenvolvidos como núcleo de máquinas de guerra.',                                                  'Yeleluna',                       NULL,       11),
('-237 a -231',  'cata', 'Catástrofe', 'Guerra de Extermínio Koldvir',         'Tribos Koldvir forçadas para além do Lago Koldvir em guerra de extermínio.',                                        'Norte de Valiran',               NULL,       12),
('-231',         'pol',  'Político',   'Cisma do Ferro',                       'Enclaves do Movimento de Ferro se separam de Yeleluna.',                                                             'Yeleluna',                       NULL,       13),
('-208',         'arc',  'Arcano',     'Iron Severance',                       'Alquimistas cortam conexão com a Trama Mágica; descendentes tornam-se imunes à magia.',                             'Yeleluna',                       NULL,       14),
('-59',          'pol',  'Político',   'Independência de Oshain',              'Oshain declara independência do Império Vranócio em declínio.',                                                      'Oshain',                         NULL,       15),

-- ── Era Atual — AQV ──────────────────────────────────────────
('0 AQV',          'cata', 'Catástrofe', 'Queda do Império Vranócio',              'O Império Vranócio colapsa. Marco Zero da era atual.',                                                           'Valiran (continental)',          'timeline', 16),
('24 AQV',         'arc',  'Arcano',     'Descoberta da Tecnologia Fullforged',    'Colaboração entre Império de Ferro, Aurforges e Ducado Vox de Oshain.',                                         'Oshain',                         NULL,       17),
('48 AQV',         'pol',  'Político',   'Coroação de Annabella Whiteflame I',     'Annabella inicia reinado em Oshain com apoio dos duques ocidentais.',                                            'Oshain',                         NULL,       18),
('67 AQV',         'div',  'Divino',     'Annabella, a Eterna',                    'Aparência de Annabella cessa de envelhecer. Questionadores são perseguidos.',                                    'Oshain',                         NULL,       19),
('77 AQV',         'cata', 'Catástrofe', 'O Isolamento de Lancaster',              'Lancaster se isola; fugitivos revelam presença de Xathyr.',                                                      'Lancaster',                      NULL,       20),
('78–80 AQV',      'div',  'Divino',     '1ª Cruzada do Sol',                     'Vaglies Lihleran liberta Lancaster de Xathyr.',                                                                  'Lancaster',                      NULL,       21),
('84 AQV',         'cata', 'Catástrofe', 'Guerra Civil de Lancaster',              'Ressurgência de Xathyr. Wolfspine é vassalizada.',                                                               'Lancaster',                      NULL,       22),
('85–91 AQV',      'div',  'Divino',     '2ª Cruzada do Sol',                     'Descida ao Grande Escuro; libertação de um reino de anões âmbar.',                                              'Grande Escuro',                  NULL,       23),
('96 AQV',         'div',  'Divino',     '3ª Cruzada do Sol',                     'Cruzada com objetivo de matar Xathyr e trazer seu corpo a Audreosta.',                                          'Grande Escuro',                  NULL,       24),
('104 AQV',        'pol',  'Político',   'Campanha I — O Herege de Lancaster',    'Eventos de Noel Braent; grupo o resgata sem conhecer sua natureza.',                                             'Lancaster',                      NULL,       25),
('105 AQV',        'cata', 'Catástrofe', 'A Queda de Lancaster',                  'Noel abre fenda planar; exército de Shadows marcha sobre Lancaster. Vaglies se sacrifica.',                     'Lancaster',                      'timeline', 26),
('105 AQV · Mês 2','pol',  'Político',   'Nova Lancaster — Sátrapia de Oshain',   'Lancaster incorporada a Oshain. Wolfspine independente. Casa Lanbarth une-se a Isliria.',                       'Lancaster / Oshain',             NULL,       27),
('106 AQV',        'pol',  'Político',   'Rogue-I — O Pôr do Sol de Lancaster',   'Seguidores da Alvorada formados. Aragrett desaparece no Grande Escuro.',                                        'Lancaster / Grande Escuro',      NULL,       28),
('107 AQV',        'cata', 'Catástrofe', 'Campanha III — Segredos de Lamidriel',  'Lidhaven cai; Wolfspine vassalizada; Brotherhood of Hope fundada.',                                             'Wolfspine / Silverhain / Lidhaven', NULL,     29),
('107–108 AQV',    'arc',  'Arcano',     'Campanha III.5 — O Grimório de Arngast','Brotherhood em Silverhain; grimório de Arngast descoberto; pesquisas sobre o Visionário.',                      'Silverhain',                     NULL,       30),
('108 AQV',        'pol',  'Político',   'Ano Presente',                          'Ano atual em Valiran.',                                                                                          '—',                              NULL,       31);
