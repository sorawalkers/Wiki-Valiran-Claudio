// Rich entity content — keyed by id for detail pages

const Entities = {

  // ============================================================
  // SESSIONS — keyed by id, with rich detail
  // ============================================================
  sessions: {
    "23": {
      num: 23, date: "14 do Segundo Mês, 1281", dateShort: "14 · MAI · 1281",
      title: "As Marcas no Pântano",
      location: "Pântanos de Velheath",
      locationDetail: "três léguas a leste de Nova Lancaster · território neutro nominal",
      duration: "4h 20min", session_xp: "1.840 XP",
      summary: "O grupo seguiu rastros de cascos partidos pelos pântanos ao norte das ruínas. O guia local, Tannis, desapareceu na segunda noite — e voltou na terceira, sem memória dos últimos dois dias e com uma marca em forma de corrente queimada no antebraço.",
      cast: ["Käthryn", "Halric", "Sothia", "Mavor", "Tannis (NPC)", "Pastor Cego (NPC, fora de tela)"],
      places: ["Pântanos de Velheath", "Estalagem do Junco", "Pedra Triangular", "Charco do Sussurro"],
      narrative: [
        "Os pântanos começam três dias depois de Tarvane e nunca terminam — pelo menos é o que dizem. O grupo seguiu Tannis, um guia local de trinta anos cujo único defeito conhecido era falar demais sobre tudo, com a exceção de coisas importantes.",
        "Na primeira noite, encontraram a Pedra Triangular: um marco antigo de Lancaster, agora rachado, com runas Blackflame queimadas em todas as três faces. Sothia identificou a queima como recente — não mais de três semanas.",
        "Na segunda noite, Tannis sumiu. Acordou-se sem ele, sem rastros de luta, sem sinal de fuga. Käthryn jurou em voz alta que iam achá-lo. Mavor, que conhece pântanos, alertou que pântano não devolve quem leva.",
        "Tannis voltou na terceira manhã caminhando como se nunca tivesse partido. Cumprimentou todos pelo primeiro nome e perguntou pelo café. Não se lembrava de absolutamente nada dos dois dias ausentes. Na hora de tirar a camisa para se banhar, revelou — sem perceber — uma marca em forma de corrente queimada subindo do pulso ao cotovelo.",
        "Sothia identificou a marca como corrupção de grau II — ainda reversível, mas Tannis precisa ser levado a solo consagrado em até quinze dias. O Pastor Cego de Velheath foi mencionado por dois aldeões diferentes como alguém que 'sabe das coisas que andam nas marcas'."
      ],
      keypoints: [
        { text: "Tannis identificado como tocado pela corrupção · grau II", danger: true },
        { text: "Käthryn jurou silêncio sobre a marca até a próxima sessão" },
        { text: "Halric trocou três barganhas com um corvo (ganhou 2, perdeu 1)" },
        { text: "Mavor descobriu que sua imunidade não impede pesadelos", danger: true },
        { text: "Encontradas três runas Blackflame queimadas em árvores recentes" },
        { text: "Pista nova: o 'Pastor Cego de Velheath' pode saber algo" },
        { text: "Halric começou um conto novo — 'A Marca que Veste Bem'" },
      ],
      loot: [
        "1× anel de prata sem brasão (encontrado no acampamento abandonado de Tannis)",
        "2× frascos de óleo de pântano (Mavor reservou para uso futuro)",
        "Mapa parcial das antigas estradas de Lancaster (achado preso à Pedra)",
      ],
      gmnote: "Joguei a marca como visualmente desconfortável sem ser explícita. A mesa decidiu silenciar e isso é exatamente o que eu queria — gera tensão pra próxima.",
      next: "Próxima sessão · 21 · MAI · 1281 · 'O Pastor Cego'",
    },

    "22": {
      num: 22, date: "07 do Segundo Mês, 1281", dateShort: "07 · MAI · 1281",
      title: "A Estalagem do Olho Torto",
      location: "Estalagem do Olho Torto",
      locationDetail: "Tarvane · fronteira da República Prateada com Oshain",
      duration: "5h 10min", session_xp: "2.200 XP",
      summary: "Sessão de convergência. Os quatro heróis chegaram à mesma estalagem por motivos completamente não relacionados, e saíram juntos antes do amanhecer perseguidos por uma patrulha oshainita.",
      cast: ["Käthryn", "Halric", "Sothia", "Mavor", "Estalajadeira Bria (NPC)", "Capitão Vorus (NPC, antagonista)"],
      places: ["Estalagem do Olho Torto", "Praça de Tarvane", "Estrada de Aerithys (km 4)"],
      narrative: [
        "A estalagem do Olho Torto fica numa esquina de Tarvane que ninguém escolhe deliberadamente. Bria, a estalajadeira, conta histórias sobre o vidro embaçado das janelas e cobra um cobre a mais quando você ri.",
        "Käthryn chegou primeiro, em luto silencioso, vestindo a armadura de Lancaster por baixo de uma capa marrom. Halric apareceu na hora do jantar com três versões diferentes do próprio nome. Sothia desceu da carruagem da magocracia perguntando pelo melhor quarto disponível (não havia nenhum bom). Mavor entrou às onze da noite, pediu cerveja e a bebeu olhando a porta.",
        "Os quatro acabaram numa mesa só porque era a única com cadeiras suficientes. A conversa começou educada e ficou intensa por volta da segunda rodada — quando Halric mencionou Lancaster em voz alta sem saber quem era Käthryn.",
        "Pouco depois da meia-noite, a patrulha oshainita do Capitão Vorus chegou perguntando pela 'paladina'. Bria, sem ser perguntada, indicou os fundos. Os quatro pularam pela janela do depósito.",
      ],
      keypoints: [
        { text: "Encontro fundador estabelecido · dinâmica de grupo: tensão produtiva" },
        { text: "Käthryn revelou ser de Lancaster · ninguém comentou (ainda)" },
        { text: "Halric começou seu primeiro conto em coro com a estalajadeira Bria" },
        { text: "Patrulha oshainita identificada · perseguição iniciada" },
        { text: "Sothia gastou todos os feitiços de 1º antes do café da manhã" },
        { text: "Mavor cobrou Bria depois da fuga — ela negociou silêncio futuro", danger: true },
      ],
      loot: [
        "1× mapa rudimentar da estrada para Aerithys (deixado por Bria)",
        "12 peças de prata recuperadas da mesa antes da fuga",
        "Brasão de patrulha oshainita (Mavor recolheu de um soldado caído)",
      ],
      gmnote: "Bria virou favorita da mesa em quatro minutos. Vou reusá-la — talvez como informante de Blackflame, talvez não, ainda decidindo.",
      next: "Sessão 23 · As Marcas no Pântano",
    },

    "21": {
      num: 21, date: "30 do Primeiro Mês, 1281", dateShort: "30 · ABR · 1281",
      title: "Prólogo · As Quatro Convergências",
      location: "Quatro locais simultâneos",
      locationDetail: "Cenas de origem · pré-campanha",
      duration: "6h 00min", session_xp: "Backstory · sem XP",
      summary: "Sessão zero estendida. Cada jogador conduziu uma cena de duas horas estabelecendo o próprio personagem antes da convergência em Tarvane.",
      cast: ["Käthryn (cena solo)", "Halric (cena solo)", "Sothia (cena solo)", "Mavor (cena solo)"],
      places: ["Ruínas de Lancaster", "Vilarejo de Hardenford", "Torre Plúrima (Lorean Treaz)", "Forte de Karn (Império de Ferro)"],
      narrative: [
        "Cada jogador teve duas horas exclusivas para uma cena que estabelecesse a motivação do personagem. Os outros assistiram em silêncio (com permissão para passar bilhetes ao Mestre). Foi a sessão mais produtiva narrativamente de toda a campanha até agora.",
        "Käthryn enterrou o pai, capitão da guarda de Lancaster, em segredo, à noite, três anos depois da queda do reino. Halric escapou de uma cidade onde já tinha sido visto demais — pela quarta vez no ano. Sothia se formou primeira da turma da Torre Plúrima com a maior nota arcana em duzentos anos, e mesmo assim ninguém apertou sua mão. Mavor recusou um contrato muito bem pago de Oshain e saiu sem explicar o porquê — nem para a mesa.",
      ],
      keypoints: [
        { text: "Backstories ratificados · vínculos cruzados estabelecidos" },
        { text: "Käthryn perdeu o pai em Lancaster · vingança como motor" },
        { text: "Halric mentiu sobre a própria origem (jogador concordou)" },
        { text: "Sothia se formou primeira da classe · com má reputação" },
        { text: "Mavor recusou contrato anterior com Oshain · marca de honra" },
      ],
      loot: ["—"],
      gmnote: "Sessão zero estendida funciona quando todo mundo entra com personagem completo. Tive sorte com este grupo.",
      next: "Sessão 22 · A Estalagem do Olho Torto",
    },
  },

  // ============================================================
  // CHARACTERS — keyed by id
  // ============================================================
  characters: {
    "kathryn": {
      id: "kathryn", name: "Käthryn Verlaine",
      role: "Paladina dissidente · órfã de Lancaster",
      tag: "PC", tagClass: "pc",
      infobox: {
        rows: [
          { k: "Classe", v: "Paladina · nv. 7" },
          { k: "Origem", v: "Lancaster (caído)" },
          { k: "Idade", v: "27 anos" },
          { k: "Juramento", v: "Vingança" },
          { k: "Alinhamento", v: "Leal-Neutro" },
          { k: "Divindade", v: "Esmir (em luto)" },
          { k: "Arma principal", v: "Crisalida — lâmina paterna" },
          { k: "Status", v: "Em campanha", ok: true },
        ],
        statusNote: "Procurada por Oshain sob o nome 'a paladina de Lancaster'. Identidade civil ainda intacta no resto do continente.",
      },
      hero: "Quando Lancaster caiu, Käthryn tinha vinte e quatro anos e estava a duas léguas da cidade levando suprimentos para o forte do leste. A demora salvou sua vida. Ela nunca perdoou a si mesma por isso.",
      sections: [
        {
          title: "Biografia",
          paras: [
            "Filha única do Capitão Verlaine, comandante da guarda real de Lancaster. Crescida dentro do castelo, treinada desde os dez anos no juramento e na lâmina. Esperava-se que ela suceder o pai. Lancaster caiu antes que ela tivesse tempo de envergonhá-lo.",
            "Os três anos seguintes à queda foram passados em vilarejos da República Prateada, fingindo ser uma mercenária comum. Lutou por dinheiro. Bebeu mais do que devia. Voltou às ruínas duas vezes — uma para enterrar o pai em segredo, outra para tirar uma coisa que ela ainda não conta para ninguém o que foi.",
            "A convergência em Tarvane foi seu primeiro contato com aliados depois de Lancaster. Ela não sabe se acredita ainda, mas continua andando com eles.",
          ],
        },
        {
          title: "Personalidade",
          paras: [
            "Lacônica em ambientes públicos, intensa em ambientes íntimos. Tem um senso de humor seco que aparece quando ela está cansada demais para esconder. Não fala sobre Lancaster a menos que perguntada três vezes, e mesmo assim mente metade da resposta.",
            "Toma decisões rapidamente em combate e lentamente em política. Confia em Mavor por motivos que ela não articulou. Suspeita de Halric. Acha Sothia mais nova do que é.",
          ],
        },
        {
          title: "Eventos notáveis",
          paras: [
            "Sessão 22 — Revelou sua origem para o grupo em fuga da patrulha oshainita.",
            "Sessão 23 — Jurou silêncio sobre a marca de corrupção de Tannis. Razão desconhecida, inclusive para ela.",
          ],
        },
      ],
      related: [
        { tag: "Reino", title: "Lancaster (caído)", target: "kingdoms" },
        { tag: "Divindade", title: "Esmir, a Alvorada", target: "pantheon" },
        { tag: "Sessão", title: "S23 · As Marcas no Pântano", target: "session:23" },
      ],
    },

    "halric": {
      id: "halric", name: "Halric Stillvein",
      role: "Bardo errante · um conto por estalagem",
      tag: "PC", tagClass: "pc",
      infobox: {
        rows: [
          { k: "Classe", v: "Bardo · nv. 7" },
          { k: "Origem", v: "[contestada]" },
          { k: "Idade", v: "≈ 35" },
          { k: "Instrumento", v: "Alaúde de prata · sem brasão" },
          { k: "Alinhamento", v: "Caótico-Neutro" },
          { k: "Status", v: "Em campanha", ok: true },
        ],
        statusNote: "Reconhecido em pelo menos seis cidades sob seis nomes diferentes. Nenhum deles é Halric.",
      },
      hero: "Conta-se que Halric tem um conto para cada estalagem do continente. Conta-se também que ele já mentiu sobre o próprio nome para um dragão e o dragão deu risada. A segunda história, aliás, é dele.",
      sections: [
        {
          title: "Biografia",
          paras: [
            "Não se sabe onde nasceu. Halric afirma já ter sido neto de pescador, sobrinho de barão, primeira-pessoa de um conto popular, e fugitivo de um casamento real. Pelo menos uma dessas é verdade.",
            "O que se sabe: aparece em registros oficiais de seis cidades, sob seis nomes diferentes, todos eles em alfabeto valirano. Em pelo menos duas das cidades, ele deu palestras públicas. Nas outras quatro, fugiu.",
          ],
        },
        {
          title: "Personalidade",
          paras: [
            "Encantador por reflexo, perigoso por estratégia. Faz piadas que iluminam quem está triste e desarmam quem está armado. Tem um momento estranho de silêncio depois de cada terceira piada — ninguém ainda apontou para ele.",
          ],
        },
      ],
      related: [
        { tag: "Sessão", title: "S22 · A Estalagem do Olho Torto", target: "session:22" },
        { tag: "Personagem", title: "Estalajadeira Bria", target: "characters" },
      ],
    },

    "annabella": {
      id: "annabella", name: "Annabella Whiteflame",
      role: "Rainha de Oshain · A que Não Envelhece",
      tag: "INIMIGO", tagClass: "foe",
      infobox: {
        rows: [
          { k: "Função", v: "Rainha de Oshain" },
          { k: "Idade aparente", v: "32 anos" },
          { k: "Idade real", v: "≈ 178 anos", danger: true },
          { k: "Reina desde", v: "2ªE 798" },
          { k: "Comanda", v: "Blackflame (não-oficialmente)" },
          { k: "Alinhamento", v: "Tirânico", danger: true },
          { k: "Status", v: "Ativa · perigosa", danger: true },
        ],
        statusNote: "Nunca foi enfrentada em combate documentado. Acredita-se que tenha pacto com entidade não identificada — possivelmente planar. Aproximação direta NÃO recomendada sem autorização do Conselho Magisterial.",
      },
      hero: "Ela foi coroada jovem em 2ªE 798. Aparece em cada retrato oficial dos últimos cento e setenta anos com o mesmo rosto, o mesmo cabelo, a mesma fivela. As crianças de Oshain crescem achando que a Rainha sempre teve trinta e dois anos. Tecnicamente, sempre teve.",
      sections: [
        {
          title: "O que se sabe",
          paras: [
            "Annabella ascendeu ao trono aos vinte e seis anos depois da morte súbita de seu pai. Os primeiros vinte anos do reinado foram convencionais — expansão regular, política aceitável. A partir do trigésimo ano, dois fatos se tornaram inegáveis: ela não envelheceu, e Oshain começou a crescer rápido demais.",
            "Não há retratos dela criança. Não há registros de doenças. Não há médicos que tenham examinado seu corpo nos últimos cento e quarenta anos. As três damas de companhia que duraram tempo suficiente para perceber alguma coisa morreram de causas convenientes.",
          ],
        },
        {
          title: "Hipóteses",
          paras: [
            "A teoria oficial de Oshain é que a Rainha foi 'abençoada por divindade desconhecida'. A teoria oficial do Concílio Magisterial é que ela fez um pacto. A teoria não oficial dos Lacrimosi é que ela é o canal pelo qual Ayael ainda se mexe — e que cada ano que ela vive é um ano que ele sofre.",
            "Käthryn acredita firmemente na terceira teoria. Käthryn ainda não tem como provar.",
          ],
        },
      ],
      related: [
        { tag: "Reino", title: "Reino de Oshain", target: "kingdoms" },
        { tag: "Facção", title: "Blackflame", target: "factions" },
        { tag: "Divindade", title: "Ayael, o que Sangra Luz", target: "deity:ayael" },
      ],
    },

    // Placeholder template for characters without rich content
    _placeholder: (id, name, role, tag, tagClass) => ({
      id, name, role, tag, tagClass,
      placeholder: true,
      infobox: { rows: [], statusNote: "Esta entrada ainda está sendo transcrita pelo arquivista." },
      hero: "Entrada em compilação. Volte em breve para a biografia completa.",
      sections: [],
      related: [],
    }),
  },

  // ============================================================
  // DEITIES — Ayael lives in Data.article; here are siblings
  // ============================================================
  deities: {
    "ayael": null, // resolved from Data.article in the page renderer
    "bahamut": {
      id: "bahamut", name: "Bahamut",
      epithet: "Pai Platinado · O Dragão Justo",
      sigil: "Dragon",
      infobox: {
        rows: [
          { k: "Tipo", v: "Deus Maior · panteão estabelecido" },
          { k: "Forma", v: "Dragão metálico ancião" },
          { k: "Domínio", v: "Justiça, Honra, Lei" },
          { k: "Alinhamento", v: "Leal-Bom" },
          { k: "Plano", v: "Celeste" },
          { k: "Símbolo", v: "Crânio dracônico em prata" },
          { k: "Adoradores", v: "Paladinos, juízes, dragões metálicos" },
          { k: "Templo principal", v: "Aerithys" },
        ],
        statusNote: "Atualmente ativo no plano celeste. Suas manifestações no plano material são raras mas documentadas — a última em 3ªE 1156, durante o julgamento de Lorde Vehnis.",
      },
      hero: "Bahamut é o primeiro nome que se aprende quando se entra num tribunal valirano. Antes de qualquer juramento, antes de qualquer interrogatório, o juiz invoca o Pai Platinado para que a verdade tenha rosto. A maior parte do continente o conhece pelo trabalho.",
      sections: [
        {
          title: "Origem",
          paras: [
            "Bahamut existe desde os primeiros séculos da Primeira Era. Não foi forjado — apareceu. Conta-se que sobrevoou o mar do sul antes de existir céu, encontrou as nove ilhas do que viria a ser Valiran, e pousou. Os outros dragões metálicos vieram depois, atraídos.",
            "A fundação da República Prateada, em 2ªE 023, foi liderada por ele em forma encarnada. Por nove anos governou diretamente; depois ascendeu ao Conselho dos Dez e deixou o trabalho cotidiano com os mortais. O Conselho ainda mantém uma cadeira vazia para ele, e ela é simbólica apenas na medida em que ele ainda vai usá-la.",
          ],
        },
        {
          title: "Tenets",
          paras: [
            "Quatro mandamentos formais, conhecidos por todo paladino bahamutiano: 'A verdade dói menos do que parece.' 'A vingança é justiça impaciente.' 'Pacto é pacto.' E o quarto, mais discutido entre os teólogos: 'A lei existe para servir, não para reinar.'",
          ],
        },
      ],
      related: [
        { tag: "Reino", title: "República Prateada", target: "kingdoms" },
        { tag: "Personagem", title: "Käthryn Verlaine", target: "character:kathryn" },
      ],
    },
    "esmir": {
      id: "esmir", name: "Esmir",
      epithet: "A Alvorada Sacrificial · O Mortal que Virou Manhã",
      sigil: "Dawn",
      infobox: {
        rows: [
          { k: "Tipo", v: "Ascendido · ex-mortal" },
          { k: "Ascendeu em", v: "1ªE 489" },
          { k: "Domínio", v: "Sacrifício, Renovação, Alvorada" },
          { k: "Alinhamento", v: "Neutro-Bom" },
          { k: "Plano", v: "Celeste · borda" },
          { k: "Símbolo", v: "Cruz dourada sobre horizonte" },
          { k: "Adoradores", v: "Devotos de Lancaster (em luto)" },
          { k: "Estado", v: "Silencioso desde 1276", danger: true },
        ],
        statusNote: "Esmir não responde a preces desde a queda de Lancaster. Os teólogos discutem se ele está em luto pelo próprio reino, ou se foi de alguma forma diminuído pela queda. Käthryn ainda reza para ele todas as manhãs, sem resposta.",
      },
      hero: "Antes de ser deus, Esmir era um homem. Conta-se que foi padeiro, ou pescador, ou guerreiro — o relato varia. O que não varia é o final: em 1ªE 489, diante da primeira fenda planar registrada no continente, um mortal chamado Esmir entrou na fenda e a fechou consigo dentro.",
      sections: [
        {
          title: "A Ascensão",
          paras: [
            "Cerigane testemunhou. É o que dizem. Quando Esmir entrou na fenda e a costurou de dentro, a Trama vibrou de um jeito que nunca tinha vibrado antes. Não houve trovão — houve manhã. A primeira manhã propriamente dita do mundo, dizem alguns.",
            "Em três dias o culto começou. Em três décadas, era domínio. Em três séculos, Lancaster — o reino sagrado dedicado a ele — era a quarta potência do continente. Em 1276, esse mesmo reino caiu.",
          ],
        },
        {
          title: "O Silêncio",
          paras: [
            "Desde a queda, nenhum clérigo de Esmir recebeu uma única resposta a uma prece. Curas funcionam, milagres acontecem em proporções menores — o que sugere que Esmir não foi destruído. Apenas calou-se. A teoria mais respeitada hoje é a de Mestra Ven Sothiel: ele está em luto, e luto divino dura tempo divino.",
            "Käthryn discorda. Käthryn acredita que ele foi punido. Käthryn ainda reza.",
          ],
        },
      ],
      related: [
        { tag: "Reino", title: "Lancaster (caído)", target: "kingdoms" },
        { tag: "Evento", title: "A Queda de Lancaster", target: "timeline" },
        { tag: "Personagem", title: "Käthryn Verlaine", target: "character:kathryn" },
      ],
    },

    _placeholder: (id, god) => ({
      id, name: god.name, epithet: god.epithet, sigil: god.sigil,
      placeholder: true,
      infobox: {
        rows: [
          { k: "Domínio", v: god.domain },
          { k: "Alinhamento", v: god.alignment },
        ],
        statusNote: "Entrada em compilação.",
      },
      hero: "Entrada em compilação. O arquivista ainda está reunindo testemunhos sobre esta divindade.",
      sections: [],
      related: [],
    }),
  },
};

window.Entities = Entities;
