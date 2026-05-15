// Wiki data — articles, deities, timeline events, regions

const Data = {
  // ===== Nav structure =====
  nav: [
    { section: "Portal", items: [
      { id: "home", label: "Início", icon: "navHome" },
      { id: "recent", label: "Adições recentes", icon: "navScroll", badge: "12" },
    ]},
    { section: "Cosmologia", items: [
      { id: "pantheon", label: "Panteão", icon: "navDeity", badge: "23" },
    ]},
    { section: "Geopolítica", items: [
      { id: "map", label: "Mapa de Valiran", icon: "navMap" },
      { id: "kingdoms", label: "Reinos & Potências", icon: "navSword", badge: "8" },
      { id: "factions", label: "Facções", icon: "navBook", badge: "5" },
    ]},
    { section: "Crônicas", items: [
      { id: "timeline", label: "Linha do Tempo", icon: "navTime" },
      { id: "events", label: "Eventos da Era", icon: "navBook", badge: "31" },
      { id: "characters", label: "Dramatis Personae", icon: "navScroll", badge: "47" },
    ]},
    { section: "Mesa", items: [
      { id: "sessions", label: "Diário de sessões", icon: "navScroll", badge: "16" },
      { id: "house-rules", label: "Regras da casa", icon: "navBook" },
    ]},
  ],

  // ===== Latest entries (portal) =====
  latest: [
    {
      tag: "Divindade · Anjo Aprisionado",
      title: "Ayael, o que Sangra Luz",
      excerpt: "Filho do Titã Lamidriel, aprisionado em sofrimento eterno no Plano de Energia Negativa. A dor que vaza de seu cárcere se manifesta como necromância nos planos materiais.",
      meta: "Atualizado · 3ª Era, 1281",
      author: "Arquivista Cael",
      target: "article",
    },
    {
      tag: "Evento · Catástrofe",
      title: "A Queda de Lancaster",
      excerpt: "Quando o selo da Tumba dos Hereges foi rompido, sombras tomaram o reino sagrado em uma única noite. O Rei Vaglies Lihleran I deu sua vida — em vão.",
      meta: "Cronologia · 1276",
      author: "Compilação coletiva",
      target: "timeline",
    },
    {
      tag: "Reino · Monarquia",
      title: "Oshain & a Rainha Branca",
      excerpt: "Annabella Whiteflame não envelhece há mais de um século. Sob seu reinado, o reino se expandiu — e a organização Blackflame foi tecida nas sombras de cada conquista.",
      meta: "Atualizado · 1281",
      author: "Mestre Volgren",
    },
    {
      tag: "Personagem · Antagonista",
      title: "Noel Braent, o Agente do Selo",
      excerpt: "Um nome falso, um rosto a mais nas multidões. Foi ele quem entrou na Tumba dos Hereges e rompeu o selo milenar que mantinha o Abismo afastado.",
      meta: "Adicionado · sessão 14",
      author: "Mestre",
    },
    {
      tag: "Tecnologia · Arcano",
      title: "Warforged: Coração de Cristal",
      excerpt: "A magocracia de Lorean Treaz domina a arte de selar consciências em corpos de aço e cristal. Suas legiões nunca dormem.",
      meta: "Atualizado · 1280",
      author: "Arquivista Cael",
    },
  ],

  // ===== Pantheon =====
  pantheon: [
    {
      tier: "Os Titãs",
      tierDesc: "As divindades primordiais que ergueram o mundo do nada. Hoje, distantes ou inalcançáveis.",
      gods: [
        { name: "Lamidriel", epithet: "A Mão que Cria", sigil: "Hand", domain: "Bondade", alignment: "Leal-Bom", aligned: true },
        { name: "Mortvuus", epithet: "O Silêncio Primeiro", sigil: "Raven", domain: "Fim", alignment: "Neutro" },
        { name: "Cerigane", epithet: "A Tecelã", sigil: "Tome", domain: "Trama Mágica", alignment: "Neutro" },
      ],
    },
    {
      tier: "Deuses do Panteão",
      tierDesc: "As nove divindades estabelecidas, veneradas em templos por todo o continente.",
      gods: [
        { name: "Bahamut", epithet: "Pai Platinado", sigil: "Dragon", domain: "Justiça", alignment: "Leal-Bom", aligned: true },
        { name: "Vofureon", epithet: "Senhor do Sol", sigil: "Sun", domain: "Luz, Verdade", alignment: "Neutro-Bom", aligned: true },
        { name: "Senhora da Rapina", epithet: "—", sigil: "Raven", domain: "Morte, Decisão", alignment: "Verdadeiro Neutro", opposed: true },
        { name: "Vargoth", epithet: "Forja-Profunda", sigil: "Crown", domain: "Pedra, Ofício", alignment: "Leal-Neutro" },
      ],
    },
    {
      tier: "Ascendidos",
      tierDesc: "Mortais que provaram-se diante dos planos e foram elevados ao manto divino.",
      gods: [
        { name: "Esmir", epithet: "A Alvorada Sacrificial", sigil: "Dawn", domain: "Sacrifício, Renovação", alignment: "Neutro-Bom", aligned: true },
        { name: "Ayael", epithet: "O que Sangra Luz", sigil: "Chain", domain: "Sofrimento, Necromância", alignment: "Aprisionado", opposed: true },
        { name: "Tessera", epithet: "A Voz das Cinzas", sigil: "Tome", domain: "Memória", alignment: "Caótico-Neutro" },
      ],
    },
  ],

  // ===== Article: Ayael =====
  article: {
    breadcrumb: ["Panteão", "Ascendidos", "Ayael"],
    title: "Ayael",
    subtitle: "O que Sangra Luz · O Anjo Aprisionado · Filho de Lamidriel",
    infobox: {
      name: "Ayael",
      sub: "O que Sangra Luz",
      sigil: "Chain",
      rows: [
        { k: "Tipo", v: "Anjo Ascendido" },
        { k: "Pai", v: "Lamidriel, o Titã" },
        { k: "Domínio", v: "Sofrimento, Necromância", danger: true },
        { k: "Alinhamento", v: "Aprisionado" },
        { k: "Plano", v: "Energia Negativa", danger: true },
        { k: "Símbolo", v: "Corrente quebrada sobre asa" },
        { k: "Adoradores", v: "Necromantes, cultos do dilúvio" },
        { k: "Antagonista de", v: "Esmir, Bahamut" },
      ],
      status: "Atualmente prisioneiro. A corrupção que vaza de seu cárcere é a principal ameaça da era — toda necromância em Valiran tem nele sua fonte última.",
    },
    toc: [
      "Origem",
      "O Aprisionamento",
      "A Corrupção como Vazamento",
      "Cultos e Hereges",
      "Implicações para os Vivos",
      "Notas do Arquivista",
    ],
    related: [
      { tag: "Plano", title: "Plano de Energia Negativa" },
      { tag: "Titã", title: "Lamidriel, a Mão que Cria" },
      { tag: "Evento", title: "A Queda de Lancaster" },
      { tag: "Organização", title: "Blackflame" },
      { tag: "Local", title: "Tumba dos Hereges" },
    ],
  },

  // ===== Timeline =====
  timeline: [
    { era: "A Forja do Mundo · Era dos Titãs" },
    {
      year: "T-???",
      label: "Mítica",
      title: "Cerigane tece a Trama",
      desc: "A Titã da magia urde a primeira teia entre todos os planos. Toda magia futura dependerá dela — toda corrupção também.",
      tag: "Divino", kind: "divine",
    },
    {
      year: "T-401",
      label: "Mítica",
      title: "Lamidriel forja os Anjos",
      desc: "Da própria carne luminosa do Titã da Bondade nascem seis anjos, incluindo Ayael, designado guardião do limiar negativo.",
      tag: "Divino", kind: "divine",
    },
    { era: "A Primeira Era · Reinos Antigos" },
    {
      year: "1ªE 112",
      label: "Civilização",
      title: "Fundação do Império de Ferro",
      desc: "Os primeiros humanos a renunciar à Trama Mágica erguem seu império no extremo norte. Seus descendentes, séculos depois, ainda nascem imunes ao arcano.",
      tag: "Política",
    },
    {
      year: "1ªE 489",
      label: "Sacrifício",
      title: "Esmir ascende ao panteão",
      desc: "Um mortal chamado Esmir se sacrifica para conter a primeira onda planar. Sua morte abre a era seguinte — e funda o reino sagrado de Lancaster.",
      tag: "Divino", kind: "divine",
    },
    { era: "A Segunda Era · As Grandes Cortes" },
    {
      year: "2ªE 023",
      label: "Fundação",
      title: "Bahamut funda a República Prateada",
      desc: "Dragões anciões metálicos pousam suas escamas no continente sul e proclamam a primeira república de Valiran. Justiça vira lei.",
      tag: "Política",
    },
    {
      year: "2ªE 314",
      label: "Arcano",
      title: "Primeiro Warforged desperta",
      desc: "Em Lorean Treaz, a arquimaga Ven Sothiel transfere a consciência de seu aprendiz moribundo para um corpo de aço e cristal. O experimento sobrevive — e ainda anda hoje.",
      tag: "Arcano",
    },
    {
      year: "2ªE 798",
      label: "Coroação",
      title: "Annabella Whiteflame assume Oshain",
      desc: "Uma rainha jovem é coroada em Oshain. Em 178 anos no trono, ela jamais envelheceu um dia sequer.",
      tag: "Política",
    },
    { era: "A Terceira Era · O Vazamento" },
    {
      year: "3ªE 1276",
      label: "Catástrofe",
      title: "A Queda de Lancaster",
      desc: "Noel Braent rompe o Selo da Tumba dos Hereges. Lancaster cai em uma noite. O Rei Vaglies Lihleran I se sacrifica para retardar a fenda. Oshain ocupa as ruínas.",
      tag: "Catástrofe", kind: "catastrophe",
    },
    {
      year: "3ªE 1278",
      label: "Conspiração",
      title: "Blackflame revelada (parcialmente)",
      desc: "Documentos vazados sugerem que Oshain orquestrou a queda de Lancaster. A Rainha nega. A República Prateada começa a se mobilizar.",
      tag: "Política", kind: "catastrophe",
    },
    {
      year: "3ªE 1281",
      label: "Hoje",
      title: "A campanha começa",
      desc: "Sete heróis improváveis se cruzam numa estalagem em Tarvane. Nenhum ainda sabe que sua aventura terminará nos pés de Ayael.",
      tag: "Atual",
    },
  ],

  // ===== Map regions =====
  regions: [
    {
      id: "oshain",
      name: "Oshain",
      type: "Monarquia",
      desc: "Reino expansionista da Rainha Branca. Suas fronteiras se ampliaram em 40% no último século, sempre sob pretexto de ‘proteção’.",
      stats: [
        { k: "Capital", v: "Halensgard" },
        { k: "Liderança", v: "Rainha Annabella Whiteflame" },
        { k: "População", v: "≈ 4.2M almas" },
        { k: "Alinhamento", v: "Tirânico (oculto)" },
      ],
      fill: "#7a2535",
      stroke: "#a83545",
      d: "M 380 120 L 540 100 L 620 180 L 600 280 L 480 320 L 380 280 Z",
      labelX: 490, labelY: 220,
    },
    {
      id: "bahamut",
      name: "República Prateada",
      type: "República dracônica",
      desc: "Bastião da justiça em Valiran. Fundada por dragões metálicos anciões, hoje refúgio de heróis e dissidentes.",
      stats: [
        { k: "Capital", v: "Aerithys" },
        { k: "Liderança", v: "Conselho dos Dez" },
        { k: "População", v: "≈ 2.8M almas" },
        { k: "Alinhamento", v: "Leal-Bom" },
      ],
      fill: "#3a5a7a",
      stroke: "#5a7a9a",
      d: "M 200 360 L 380 340 L 480 380 L 460 480 L 320 520 L 180 460 Z",
      labelX: 320, labelY: 430,
    },
    {
      id: "lorean",
      name: "Magocracia de Lorean Treaz",
      type: "Magocracia",
      desc: "Potência arcana governada por um conselho de arquimagos. Pioneira em tecnologia Warforged e em manipulação direta da Trama.",
      stats: [
        { k: "Capital", v: "A Torre Plúrima" },
        { k: "Liderança", v: "Concílio Magisterial" },
        { k: "População", v: "≈ 1.6M almas" },
        { k: "Alinhamento", v: "Neutro" },
      ],
      fill: "#5a4a8a",
      stroke: "#7a6aaa",
      d: "M 620 320 L 780 300 L 820 420 L 740 500 L 640 460 L 600 380 Z",
      labelX: 720, labelY: 400,
    },
    {
      id: "iron",
      name: "Império de Ferro",
      type: "Império militar",
      desc: "Cortaram sua conexão com a Trama Mágica séculos atrás. Imunes a manipulação arcana, vivem em isolamento marcial.",
      stats: [
        { k: "Capital", v: "Tor Klain" },
        { k: "Liderança", v: "Imperador-de-Aço Korvath VII" },
        { k: "População", v: "≈ 3.0M almas" },
        { k: "Alinhamento", v: "Leal-Neutro (xenófobo)" },
      ],
      fill: "#4a4a52",
      stroke: "#6a6a72",
      d: "M 180 80 L 380 60 L 400 180 L 280 220 L 160 200 Z",
      labelX: 280, labelY: 140,
    },
    {
      id: "lancaster",
      name: "Nova Lancaster",
      type: "Ruínas ocupadas",
      desc: "O reino sagrado caiu em 1276. Oshain ocupou as ruínas e renomeou. O selo da Tumba dos Hereges permanece rompido — a corrupção espalha pelos arredores.",
      stats: [
        { k: "Antigo nome", v: "Lancaster" },
        { k: "Caiu em", v: "3ªE 1276" },
        { k: "Ocupada por", v: "Oshain" },
        { k: "Estado", v: "Corrompida", danger: true },
      ],
      fill: "#3a1a1a",
      stroke: "#7a2020",
      d: "M 440 290 L 520 270 L 560 320 L 520 360 L 440 350 Z",
      labelX: 490, labelY: 320,
      cursed: true,
    },
  ],
};

window.Data = Data;
