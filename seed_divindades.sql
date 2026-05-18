-- SEED: Divindades — O Arquivo de Valiran
-- Cole no SQL Editor do Supabase e clique em Run
-- Upsert seguro: insere novos e atualiza existentes pelo ID

INSERT INTO deities (id, name, epithet, sigil, infobox, hero, sections, related, placeholder)
VALUES

-- 1. LAMIDRIEL
('lamidriel','Lamidriel','O Arcanjo Supremo do Paraíso · Titã da Bondade','Dawn',
'{"rows":[{"k":"Tipo","v":"Titã da Bondade"},{"k":"Domínio","v":"Bondade · Celestiais"},{"k":"Alinhamento","v":"Leal Bondoso"}]}'::jsonb,
'O sofrimento de seu filho vaza pelo mundo como corrupção — e Lamidriel não tomou ação conhecida para impedi-lo. Os teólogos debatem isso há décadas. Nenhum chegou a uma resposta que satisfaça quem conhece a extensão do que Ayael suporta.',
'[{"title":"Descrição","paras":["Lamidriel é um dos Titãs primordiais, a divindade da bondade e líder da Tríade de Coros — a mais absoluta hierarquia dos anjos de todos os planos celestiais. Seus anjos são os mais antigos e reconhecidos servos do bem e da luz em Valiran.","É pai de Ayael, o anjo hoje aprisionado no Plano de Energia Negativa em sofrimento eterno. O sofrimento de Ayael vaza pelo rasgo planar aberto por Noel Braent na Tumba dos Hereges, manifestando-se no plano material como energia nécrotica e corrupção. Por que Lamidriel não agiu — ou não pode agir — para libertar o próprio filho permanece sem resposta documentada.","Lawrence e Diego são seus paladinos ativos. Thale Vans Loupd''or é fervoroso seguidor. O próprio Lawrence questiona às vezes se o poder que recebeu ao ascender a paladino vem verdadeiramente de Lamidriel — ou da mácula de Ayael que carrega dentro de si."]},{"title":"Dogmas","paras":["Não se deixe limitar por organizações e estandartes; combata o mal em nome de todas as criaturas da luz.","Forneça apoio aos seguidores de divindades bondosas; a compaixão não deve ser limitada a nós.","Combata os servos profanos das divindades malignas, mas salve aqueles que podem ser redimidos."]}]'::jsonb,
'[{"tag":"Entidade","title":"Ayael (filho aprisionado)","target":"deity:ayael"},{"tag":"Divindade","title":"Fyria (polo oposto)","target":"deity:fyria"}]'::jsonb,
false),

-- 2. VOFUREON
('vofureon','Vofureon','O Lorde dos Celestiais · Titã da Luz','Sun',
'{"rows":[{"k":"Tipo","v":"Titã da Luz"},{"k":"Domínio","v":"Luz · Prevenção do Mal"},{"k":"Alinhamento","v":"Leal Bondoso"}]}'::jsonb,
'Foi Vofureon quem olhou para Esmir morrer e decidiu que aquilo não podia ser o fim. Não age de forma direta — prefere guiar, aconselhar, prevenir. Quando confronta a escuridão, porém, não hesita.',
'[{"title":"Descrição","paras":["Vofureon é o Titã da Luz — divindade da prevenção do mal e dos celestiais. Prefere agir de forma preventiva e guiar seus seguidores do que intervir diretamente — mas quando enfrenta a escuridão, confronta seus inimigos de forma direta e honrável.","Esmir foi seu seguidor em vida, e foi Vofureon quem o ascendeu à divindade no Ano -443 após o sacrifício que selou o Arauto das Trevas. A Princesa Pálida de Lindhaven era sua devota antes de ser transformada pela Rainha Vermelha.","Asmodeus, Deus dos Nove Infernos, se comunica voluntariamente com Vofureon — anomalia notável, visto que Asmodeus evita e despreza quaisquer outras divindades, inclusive as de alinhamento similar ao seu."]},{"title":"Dogmas","paras":["Seja o estandarte das forças do bem; você é aquele que inspira seus irmãos e aliados a continuar em frente contra o mal.","Haja de forma preventiva; elimine a semente do mal antes mesmo que ela seja plantada.","Seja um combatente honrável, mesmo ao enfrentar os piores inimigos; mas não hesite em aniquilar aqueles que sejam desonestos."]}]'::jsonb,
'[{"tag":"Divindade","title":"Esmir (ascendeu por ele)","target":"deity:esmir"},{"tag":"Divindade","title":"Asmodeus (contato incomum)","target":"deity:asmodeus"}]'::jsonb,
false),

-- 3. BAHAMUT
('bahamut','Bahamut','O Dragão Platina · O Primeiro Dragão Metálico','Dragon',
'{"rows":[{"k":"Tipo","v":"Deus do Panteão"},{"k":"Domínio","v":"Justiça · Proteção · Nobreza"},{"k":"Alinhamento","v":"Leal Bondoso"}]}'::jsonb,
'Muitos monarcas já foram coroados em seu nome. As leis de múltiplas nações foram moldadas por seus ensinamentos. A República que carrega seu nome é o maior experimento político desse princípio. Ainda não falhou completamente.',
'[{"title":"Descrição","paras":["Bahamut é o arauto dos paladinos bondosos e deus da justiça, proteção, nobreza e honra. Ser de pura lealdade e bondade, a maioria das criaturas boas — inclusive os dragões metálicos — o veem como o principal exemplo a ser seguido.","A República Prateada de Bahamut foi fundada em torno de seus princípios. Diego é seu paladino ativo; Dykorkis e Vrakmash são seus sacerdotes em Silverhain. O altar de Naomi — terceira entidade dracônica — está ausente do templo principal de Silverhain, o que os teólogos leem como desaprovação velada da ascensão controversa dessa deusa."]},{"title":"Dogmas","paras":["Manter o maior ideal de honra e justiça, independente da situação.","Estar sempre atento à maldade do mundo e combatê-la em todas as frentes.","Proteja os fracos, liberte os oprimidos e defenda a ordem a todo custo."]}]'::jsonb,
'[{"tag":"Divindade","title":"Tiamat (oposta)","target":"deity:tiamat"},{"tag":"Divindade","title":"Naomi (ascendida controversa)","target":"deity:naomi"}]'::jsonb,
false),

-- 4. ESMIR
('esmir','Esmir','A Alvorada Sacrificial · O Arauto dos Elfos Solares','Dawn',
'{"rows":[{"k":"Tipo","v":"Ascendido Bondoso"},{"k":"Domínio","v":"Alvorada · Sacrifício · Disciplina"},{"k":"Alinhamento","v":"Leal Bondoso"},{"k":"Ascensão","v":"Ano -443 · via Vofureon"}]}'::jsonb,
'Ele não nasceu deus. Seguia Vofureon e Pelor, e quando chegou o momento, sacrificou-se para selar o Arauto das Trevas. Muitos já se uniram sob seu estandarte — colocando de lado todas as suas diferenças para purgar o mal da face da terra.',
'[{"title":"Descrição","paras":["Esmir é o deus ascendido da alvorada. Enquanto mortal, era seguidor dos ensinamentos de Vofureon, Titã da Luz, e de Pelor, Deus do Sol. Rei conhecido como Esmir Lihleran, chegou às terras de Audreosta no Ano -531 fugindo do avanço do Arauto das Trevas, e no Ano -443 selou a criatura ao preço de sua própria vida — ascendendo à divindade por intercessão de Vofureon.","Como divindade, manteve muitos dos ensinamentos que carregava em vida, além de impor disciplina militar a seus seguidores. É inimigo declarado de Xathyr, o Falso-Deus, e de Zehir, Deus da Escuridão — sendo sob seu estandarte que a Cruzada do Sol foi fundada para interromper a crescente ascensão de Xathyr.","Foi a divindade de Lancaster e de seu último rei, Vaglies Lihleran I. Noel Braent fingia pertencer ao seu clero. Lawrence Cainhurst foi cavaleiro de sua fé antes de ascender a paladino de Lamidriel. Os Seguidores da Alvorada, remanescentes da fé em Nova Lancaster, continuam sua missão sob liderança de Douglas Knaller."]},{"title":"Dogmas","paras":["Não permita que as criaturas do bem sejam corrompidas; se necessário, realize um último sacrifício.","Devote seu tempo a uma causa nobre e honre sua palavra.","Afronte tirania onde a encontrar; lute pelo que acredita que é certo."]}]'::jsonb,
'[{"tag":"Divindade","title":"Vofureon (seu criador)","target":"deity:vofureon"},{"tag":"Divindade","title":"Xathyr (inimigo declarado)","target":"deity:xathyr"},{"tag":"Divindade","title":"Zehir (inimigo)","target":"deity:zehir"}]'::jsonb,
false),

-- 5. ALARA
('alara','Alara','A Regente do Plano Feérico · Titã da Vida','Tree',
'{"rows":[{"k":"Tipo","v":"Titã da Vida"},{"k":"Domínio","v":"Vida · Nascimento · Plano Feérico"},{"k":"Alinhamento","v":"Neutro Bondoso"}]}'::jsonb,
'Alara e a Senhora da Rapina não são inimigas. São o mesmo ciclo, visto de extremidades opostas. Alara abre a porta; a outra a fecha. Entre as duas, passa tudo o que existe — e até divindades malignas reconhecem o valor disso.',
'[{"title":"Descrição","paras":["Alara é a Titã da Vida e Regente do Plano Feérico, responsável pelo início do ciclo da vida — o nascimento. Fecha o ciclo em conjunto com a Senhora da Rapina, moldando juntas o fluxo da existência. É patrona das criaturas azatianas e uma das divindades favoritas dos povos conectados com a natureza.","Junto com Corellon e Melora, ergueu as florestas ancestrais que marcam os continentes. É vista com olhos benevolentes pela maioria das divindades — inclusive aquelas de alinhamentos opostos — devido ao papel fundamental que ocupa no cosmos."]},{"title":"Dogmas","paras":["Proteja a integridade das criaturas vivas e do nascimento; não existe nada mais sagrado e frágil do que a vida.","Apoie aqueles que zelam ou protegem sua comunidade; aqueles que levantam as armas por ti arriscam suas vidas pela sua.","Exerça misericórdia e evite genocídios; conflitos podem ser vencidos até mesmo sem o encerramento de vidas."]}]'::jsonb,
'[{"tag":"Divindade","title":"V''hun (Titã da Morte — par)","target":"deity:vhun"},{"tag":"Divindade","title":"Senhora da Rapina (fecha o ciclo)","target":"deity:senhora-da-rapina"}]'::jsonb,
false),

-- 6. SENHORA DA RAPINA
('senhora-da-rapina','Senhora da Rapina','A Rainha dos Corvos · Deusa da Morte e do Destino','Skull',
'{"rows":[{"k":"Tipo","v":"Deusa do Panteão"},{"k":"Domínio","v":"Morte · Destino · Inverno"},{"k":"Alinhamento","v":"Leal Neutro"}]}'::jsonb,
'Seu nome foi esquecido. O título permaneceu. É injustamente acusada de ser maligna por religiões que confundem o portador com a mensagem — ela apenas cuida do que já foi decidido que chegaria ao fim.',
'[{"title":"Descrição","paras":["A Senhora da Rapina é a deusa da morte, controladora do destino e patrona do inverno. Seu nome verdadeiro foi esquecido; apenas o título permanece. Caiu em esquecimento após acusações de outras religiões de que seria uma entidade maligna — acusações que seus devotos consideram profundamente injustas.","É divindade de Revna e de Isla. O Oráculo dos Corvos — seu ritual de conexão — troca um pedaço da alma do suplicante por um fragmento de poder divino: foi esse ritual que Revna realizou, perdendo parte de si para receber visões e poder. A Senhora da Rapina enviou Isla ao plano material para proteger Revna.","Ayael interfere no ciclo natural da morte que ela mantém. Fyria agrava o quadro: suas Crucidaemons consomem almas literalmente, quebrando o ciclo — o que torna Fyria sua inimiga natural."]},{"title":"Dogmas","paras":["Não tenha piedade daqueles que sofrem e morrem; a morte é o fim natural da vida.","Derrube os orgulhosos que tentam tirar as correntes do destino sobre si; como instrumento da Raven Queen, puna a arrogância sempre que a encontrar.","Esteja vigilante perante o Culto de Orcus e os esmague sempre que os encontrar; o Príncipe Demoníaco dos Mortos-Vivos almeja seu trono."]}]'::jsonb,
'[{"tag":"Divindade","title":"Alara (início do ciclo)","target":"deity:alara"},{"tag":"Divindade","title":"Fyria (inimiga natural)","target":"deity:fyria"},{"tag":"Entidade","title":"Ayael (interfere no ciclo)","target":"deity:ayael"}]'::jsonb,
false),

-- 7. MELORA
('melora','Melora','A Deusa Selvagem da Natureza','Wave',
'{"rows":[{"k":"Tipo","v":"Deusa do Panteão"},{"k":"Domínio","v":"Natureza · Oceano · Selvageria"},{"k":"Alinhamento","v":"Neutro Bondoso"}]}'::jsonb,
'Melora é tanto a besta selvagem quanto a floresta pacífica, o oceano violento quanto o deserto tranquilo. Harabella a recebeu em seu batismo — três espíritos da tempestade selados numa vida.',
'[{"title":"Descrição","paras":["Melora exerce sua influência sobre a natureza e o oceano em todas as suas formas. Patrulheiros, caçadores, alguns elfos e marinheiros fazem oferendas a ela antes de iniciar viagens por terras selvagens.","Junto com Corellon e Alara, ergueu as florestas ancestrais do mundo. É rival divina de Erathis, cuja missão de expandir a civilização se opõe diretamente à preservação da natureza selvagem que Melora protege.","Harabella Thundervoice era sua devota, recebendo a bênção de Melora ao nascer, com três espíritos da tempestade selados no batismo. Harabella morreu na Torre de Fallburgo."]},{"title":"Dogmas","paras":["Proteja a natureza do mundo de destruição e abuso; oponha-se ao crescimento descontrolado de cidades e impérios.","Caçe e extermine monstros aberrantes e outras abominações da natureza.","Não tenha medo ou condene a selvageria da natureza; viva em harmonia com o selvagem."]}]'::jsonb,
'[{"tag":"Divindade","title":"Erathis (rival)","target":"deity:erathis"},{"tag":"Divindade","title":"Corellon (aliado)","target":"deity:corellon"}]'::jsonb,
false),

-- 8. PELOR
('pelor','Pelor','O Guardião do Tempo · Deus do Sol e do Verão','Sun',
'{"rows":[{"k":"Tipo","v":"Deus do Panteão"},{"k":"Domínio","v":"Sol · Verão · Tempo · Agricultura"},{"k":"Alinhamento","v":"Neutro Bondoso"}]}'::jsonb,
'A divindade mais comumente venerada por humanos comuns. Seus sacerdotes são sempre bem-vindos onde chegam. Esmir foi seu seguidor em vida — antes de se tornar algo maior do que qualquer seguidor poderia ser.',
'[{"title":"Descrição","paras":["Pelor é o deus do sol e do verão, e também o Guardião do Tempo. Apoia aqueles em necessidade e combate tudo aquilo que seja maligno. Como lorde da agricultura, é a divindade mais comumente venerada por humanos comuns, fazendo de seus sacerdotes entidades sempre reconhecidas e bem-vindas. Paladinos e patrulheiros são frequentemente encontrados entre seus seguidores.","Esmir foi seu seguidor em vida, antes de ascender à divindade por Vofureon no Ano -443. Essa ligação é frequentemente evocada pelos cultos de Pelor e Esmir para reforçar laços institucionais entre as duas fés."]},{"title":"Dogmas","paras":["Alivie a dor daqueles que sofrem, seja lá onde você os encontre.","Traga a luz de Pelor a lugares de escuridão; mostre compaixão e misericórdia.","Esteja sempre vigilante; o mal está sempre à espreita."]}]'::jsonb,
'[{"tag":"Divindade","title":"Esmir (seguidor que ascendeu)","target":"deity:esmir"}]'::jsonb,
false),

-- 9. CORELLON
('corellon','Corellon','O Patrono dos Elfos · Deus da Primavera e da Beleza','Moon',
'{"rows":[{"k":"Tipo","v":"Deus do Panteão"},{"k":"Domínio","v":"Primavera · Beleza · Artes · Elfos"},{"k":"Alinhamento","v":"Caótico Bondoso"}]}'::jsonb,
'Músicos e artistas o adoram. Conjuradores que veem a magia como arte criativa o veneram. E aqueles que corromperam sua criação — os elfos das trevas — são seu alvo mais persistente.',
'[{"title":"Descrição","paras":["Corellon é o deus da primavera, beleza e artes, e o patrono dos elfos. Junto com Alara e Melora, ergueu as florestas ancestrais que marcam os continentes. Altares dedicados a ele podem ser encontrados por todo o Plano Feérico, florestas mágicas e povoados élficos.","Detesta Lolth por ter levado os elfos drow ao caminho da escuridão. É inimigo de Zehir pelo mesmo motivo: foi Zehir quem corrompeu a terra natal dos elfos solares, transformando-os nos Elfos das Trevas. Apesar de ambos terem corrompido criaturas de Corellon, Lolth e Zehir não são aliados entre si."]},{"title":"Dogmas","paras":["Cultive a beleza em tudo que fizer, seja conjurar uma magia, compor uma saga, tocar uma flauta ou praticar as artes da guerra.","Busque por itens mágicos perdidos, rituais esquecidos e obras de arte ancestrais.","Anule os planos dos seguidores de Lolth toda vez que tiver a oportunidade."]}]'::jsonb,
'[{"tag":"Divindade","title":"Lolth (inimiga)","target":"deity:lolth"},{"tag":"Divindade","title":"Zehir (inimigo)","target":"deity:zehir"}]'::jsonb,
false),

-- 10. MORADIN
('moradin','Moradin','O Patrono dos Artesões · Deus da Criação',NULL,
'{"rows":[{"k":"Tipo","v":"Deus do Panteão"},{"k":"Domínio","v":"Criação · Família · Mineração"},{"k":"Alinhamento","v":"Leal Bondoso"}]}'::jsonb,
'Foi ele quem carvou as montanhas do mundo usando a terra primordial. Os anões o seguem fielmente — ele é o guardião divino do coração e da família, e isso, para um anão, é tudo.',
'[{"title":"Descrição","paras":["Moradin é o deus da criação e patrono dos artesões — especialmente mineradores e ferreiros. Foi ele quem carvou as montanhas do mundo usando a terra primordial, e é o guardião divino do coração e da família.","Os anões de todos os tipos o seguem fielmente, fazendo dele o deus oficial dos anões de Valiran. É aliado de Erathis e Ioun."]},{"title":"Dogmas","paras":["Enfrente adversidade com tenacidade; seja resistente ao se juntar a um conflito.","Demonstre lealdade à sua família, ao seu clã, seus líderes e ao seu povo.","Almeje deixar seu marco no mundo, um legado; fazer algo que dure é uma das maiores conquistas."]}]'::jsonb,
'[{"tag":"Divindade","title":"Erathis (aliada)","target":"deity:erathis"},{"tag":"Divindade","title":"Ioun (aliada)","target":"deity:ioun"}]'::jsonb,
false),

-- 11. IOUN
('ioun','Ioun','Deusa do Conhecimento e das Profecias','Eye',
'{"rows":[{"k":"Tipo","v":"Deusa do Panteão"},{"k":"Domínio","v":"Conhecimento · Profecias · Arcanismo"},{"k":"Alinhamento","v":"Leal Neutro"}]}'::jsonb,
'Sábios, videntes e táticos a veneram. Bibliotecas e academias de magos são construídas em seu nome. E seus seguidores têm uma inimiga específica em mente: Vecna, que busca o oposto — controlar o conhecimento e manter segredos.',
'[{"title":"Descrição","paras":["Ioun é a deusa do conhecimento e das profecias. O estudo sobre o Arcanismo é um de seus focos primários. Bibliotecas e academias de magos são construídas em seu nome em todo Valiran. É aliada de Erathis e Moradin.","Sua inimiga direta é Vecna — onde Ioun dissemina o saber, Vecna o acumula e oculta. Seus seguidores são orientados a se opor ativamente ao culto de Vecna e a desmascarar seus segredos."]},{"title":"Dogmas","paras":["Busque a perfeição das suas capacidades mentais através do equilíbrio entre razão, percepção e emoção.","Acumule, preserve e distribua conhecimento em todas as suas formas; almeje educação, construa bibliotecas e vá atrás de conhecimentos ancestrais ou perdidos.","Esteja sempre vigilante perante seguidores de Vecna; oponha-se contra eles, desmascare seus segredos e os confronte com a luz da razão e da lógica."]}]'::jsonb,
'[{"tag":"Divindade","title":"Vecna (inimiga direta)","target":"deity:vecna"},{"tag":"Divindade","title":"Moradin (aliado)","target":"deity:moradin"}]'::jsonb,
false),

-- 12. AVANDRA
('avandra','Avandra','A Dama da Sorte · Deusa da Liberdade e das Viagens',NULL,
'{"rows":[{"k":"Tipo","v":"Deusa do Panteão"},{"k":"Domínio","v":"Liberdade · Viagens · Sorte"},{"k":"Alinhamento","v":"Caótico Bondoso"}]}'::jsonb,
'Seus templos são raros nas terras civilizadas. Seus altares ao pé das estradas podem ser encontrados pelo mundo todo. A distinção diz tudo sobre quem ela realmente serve.',
'[{"title":"Descrição","paras":["Avandra florece em liberdade, comércio, viagens e novas fronteiras não exploradas. Halflings, mercadores e todos os tipos de aventureiros são atraídos a seus cleros. Muitas pessoas erguem copos em seu nome, vendo-a como a manipuladora da sorte.","Seus templos são poucos nas terras civilizadas, mas seus altares ao pé das estradas podem ser encontrados pelo mundo todo — reflexo de quem são seus devotos: aqueles em movimento, não aqueles estabelecidos."]},{"title":"Dogmas","paras":["A sorte favorece os audaciosos; tome seu destino em suas próprias mãos e a Dama da Sorte irá lhe favorecer.","Revide contra aqueles que tomariam sua liberdade e incentive outros a lutar pela sua própria liberdade.","Mudança é inevitável, mas é necessário o investimento dos devotos para assegurar que ela será para o melhor."]}]'::jsonb,
'[]'::jsonb,
false),

-- 13. SEHANINE
('sehanine','Sehanine','Deusa da Lua e do Outono','Moon',
'{"rows":[{"k":"Tipo","v":"Deusa do Panteão"},{"k":"Domínio","v":"Lua · Outono · Amor · Ilusões"},{"k":"Alinhamento","v":"Caótico Neutro"}]}'::jsonb,
'É também a deusa do amor, que envia sombras para proteger os encontros de pares ao redor do mundo. Alguns patrulheiros e ladrões pedem sua bênção enquanto trabalham. Ela não vê contradição nisso.',
'[{"title":"Descrição","paras":["Sehanine é a deusa da lua, do outono, das ilusões e do amor. É aliada de Corellon e Melora, fazendo dela uma divindade favorita entre elfos e halflings.","Também é padroeira do amor, enviando sombras para proteger os encontros de pares ao redor do mundo. Seus ensinamentos valorizam a autonomia individual e a busca do próprio caminho — sem se fixar ao bem absoluto nem à escuridão total."]},{"title":"Dogmas","paras":["Siga seus objetivos e procure seu próprio destino.","Se mantenha nas sombras; evite a luz cegante do bem e a escuridão total do mal.","Busque por novos horizontes e novas experiências; não permita que nada lhe prenda a um lugar."]}]'::jsonb,
'[{"tag":"Divindade","title":"Corellon (aliado)","target":"deity:corellon"},{"tag":"Divindade","title":"Melora (aliada)","target":"deity:melora"}]'::jsonb,
false),

-- 14. KORD
('kord','Kord','Deus das Tempestades e Lorde das Batalhas','Flame',
'{"rows":[{"k":"Tipo","v":"Deus do Panteão"},{"k":"Domínio","v":"Tempestades · Batalhas · Força"},{"k":"Alinhamento","v":"Caótico Neutro"}]}'::jsonb,
'Uma divindade desenfreada que segue sua vontade como bem desejar, invocando tempestades sobre o oceano. Aqueles que desejam tempo pacífico frequentemente fazem oferendas a ele antes de partir — por precaução.',
'[{"title":"Descrição","paras":["Kord é o deus das tempestades e lorde das batalhas. Tem influência sobre força, capacidade de combate e trovões. Guerreiros e atletas o adoram, visto que incorpora todos os elementos relevantes para eles. É uma divindade desenfreada que segue sua própria vontade.","Seus ensinamentos não pregam destruição por destruição, mas a busca constante por força, coragem e glória no campo de batalha."]},{"title":"Dogmas","paras":["Seja forte; mas não use sua força para destruição sem propósito.","Seja corajoso; despreze covardia em todos os seus aspectos.","Seja aquele a ganhar glória e renome no campo de batalha."]}]'::jsonb,
'[]'::jsonb,
false),

-- 15. ERATHIS
('erathis','Erathis','Deusa da Civilização, das Invenções e da Lei','Crown',
'{"rows":[{"k":"Tipo","v":"Deusa do Panteão"},{"k":"Domínio","v":"Civilização · Invenção · Lei"},{"k":"Alinhamento","v":"Leal Neutro"}]}'::jsonb,
'Governadores, juízes, pioneiros e cidadãos dedicados são seus devotos. É aliada inesperada de Asmodeus — uma compatibilidade que seus sacerdotes mais idealistas preferem não discutir em público.',
'[{"title":"Descrição","paras":["Erathis é a deusa da civilização, invenção e lei. Segundo textos religiosos, acredita-se que esteja em relacionamento com Pelor, e que seja aliada de Moradin e Ioun. É uma das poucas divindades em termos amigáveis com Asmodeus — compatibilidade explicada pela sobreposição de domínios: lei e hierarquia, ainda que por razões completamente distintas.","Melora é vista como seu oposto e rival divina — a natureza selvagem que a civilização sempre precisou domar."]},{"title":"Dogmas","paras":["Trabalhe em conjunto com outros para alcançar seus objetivos; comunidade e ordem são sempre mais fortes do que esforços desunidos.","Dome as terras selvagens para que a civilização seja capaz de expandir e avançar; proteja a luz da sociedade contra a escuridão.","Busque por novas ideias, novas tecnologias e novas terras. Construa máquinas, construa cidades, construa impérios."]}]'::jsonb,
'[{"tag":"Divindade","title":"Melora (rival)","target":"deity:melora"},{"tag":"Divindade","title":"Asmodeus (aliança incomum)","target":"deity:asmodeus"}]'::jsonb,
false),

-- 16. ATHYS
('athys','Athys','Julgadora de Desafios · Protetora de Promessas','Sword',
'{"rows":[{"k":"Tipo","v":"Ascendida"},{"k":"Domínio","v":"Duelos · Promessas · Justiça"},{"k":"Alinhamento","v":"Leal Bondoso"},{"k":"Origem","v":"Elfa imperial duelista · ascendida"}]}'::jsonb,
'Em vida era elfa imperial duelista, conhecida por sempre honrar suas promessas. As circunstâncias de sua ascensão são fortemente protegidas pelo Império de Ferro — todos os arquivos relacionados foram expurgados. Sua aparência angelical levanta questões que ninguém ainda respondeu.',
'[{"title":"Descrição","paras":["Athys é uma das mais recentes divindades a adentrarem o panteão de Valiran através de ascensão divina. Enquanto mortal, era elfa imperial duelista que competira em múltiplos campeonatos, conhecida por sempre honrar suas promessas — especialmente durante duelos. As circunstâncias ao redor de sua ascensão são fortemente protegidas pelo Império de Ferro, com todos os arquivos relacionados expurgados da existência.","Como divindade, é extremamente presente e pode ser facilmente invocada com as palavras sagradas corretas para supervisionar duelos justos, fazendo cumprir os termos aceitos por ambas as partes. Sua aparência angelical faz muitos historiadores acreditarem em possível ligação com Lamidriel — sem confirmação."]},{"title":"Dogmas","paras":["Sempre cumpra suas promessas; seu valor é ditado pelo valor da sua palavra.","Procure aqueles mais fortes que você e os desafie em duelos em nome de Athys.","Enfrente seus adversários com todo seu potencial, mas sempre de forma justa."]}]'::jsonb,
'[{"tag":"Divindade","title":"Lamidriel (possível ligação)","target":"deity:lamidriel"}]'::jsonb,
false),

-- 17. NAOMI
('naomi','Naomi','A Vingadora de Amyst · A Rainha do Fogo Dourado · A Dragonesa Simétrica','Flame',
'{"rows":[{"k":"Tipo","v":"Ascendida"},{"k":"Domínio","v":"Retribuição · Vingança · Fogo"},{"k":"Alinhamento","v":"Neutro Bondoso"},{"k":"Origem","v":"Sul de Valiran · reino transformado em cinzas"}]}'::jsonb,
'Sua fé está localizada principalmente no Sul de Valiran, onde ascendeu. Teve sua origem num reino que hoje não passa de cinzas. O altar de Naomi está ausente do templo de Bahamut em Silverhain — e todos sabem o que isso significa.',
'[{"title":"Descrição","paras":["Naomi é a deusa ascendida da retribuição e da vingança. Pouco conhecida, sua fé está localizada principalmente no Sul de Valiran, onde ascendeu. Teve sua origem num reino que hoje não passa de cinzas — e seus ensinamentos contam sobre a importância de proteger aquilo que se ama e, na inevitável perda, não permitir que outros sofram a mesma dor.","É a terceira entidade dracônica no panteão, com ligação direta a Bahamut e Tiamat, incorporando aspectos de ambos — daí o título de Dragonesa Simétrica. Sua ascensão é controversa na visão dracônica; o altar de Naomi está ausente do templo principal de Bahamut em Silverhain."]},{"title":"Dogmas","paras":["Puna seus inimigos com o fogo da retribuição ou a fúria da vingança; sempre exerça punição sobre os atos errados que afetem terceiros.","Vingue aqueles que não possam se vingar; proteja-os tanto enquanto estiverem vivos quanto mortos, mas ainda parte de sua memória.","Como a própria Rainha do Fogo Dourado, almeje encontrar equilíbrio entre sua benevolência e raiva; encontre aquilo que lhe complementa."]}]'::jsonb,
'[{"tag":"Divindade","title":"Bahamut (entidade dracônica)","target":"deity:bahamut"},{"tag":"Divindade","title":"Tiamat (entidade dracônica)","target":"deity:tiamat"}]'::jsonb,
false),

-- 18. V'HUN
('vhun','V''hun','Titã da Morte · O Guardião do Fim Previsto','Skull',
'{"rows":[{"k":"Tipo","v":"Titã da Morte"},{"k":"Domínio","v":"Morte · Destino · Trama"},{"k":"Alinhamento","v":"Neutro"}]}'::jsonb,
'V''hun tem a obrigação de garantir o fim previsto pelo Destino a cada linha da Trama. Por isso, prefere não se envolver na Guerra Eterna entre a luz e a escuridão. Não é indiferença — é que o equilíbrio da Trama importa mais do que qualquer lado do conflito.',
'[{"title":"Descrição","paras":["V''hun é o Titã da Morte. Em conjunto com Alara, a Titã da Vida, é responsável por moldar a Trama manipulada pelo Destino: enquanto Alara exerce papel fundamental no início de cada linha de existência, V''hun tem a obrigação de garantir o fim previsto a ela.","Devido a isso, V''hun prefere não se envolver na Guerra Eterna pelo Equilíbrio entre a Luz e a Escuridão — priorizando a manutenção da integridade da Trama e do próprio Destino. Neutro no conflito bem/mal."]},{"title":"Dogmas","paras":["Não existem ensinamentos ou ordens concretas de V''hun. Devido às múltiplas possíveis facetas de seu clero, existem várias interpretações possíveis — o que gera muito conflito entre seus poucos seguidores."]}]'::jsonb,
'[{"tag":"Divindade","title":"Alara (Titã da Vida — par)","target":"deity:alara"}]'::jsonb,
false),

-- 19. PROTUS
('protus','Protus','O Julgador Silencioso · Titã da Ordem','Chain',
'{"rows":[{"k":"Tipo","v":"Titã da Ordem"},{"k":"Domínio","v":"Equilíbrio · Construtos · Ordem"},{"k":"Alinhamento","v":"Leal Neutro"}]}'::jsonb,
'Fragmentou Raegrar para sustentar os planos de existência. Costuma assumir posição de observador, intervindo apenas quando o equilíbrio é realmente ameaçado. Isso faz dele uma divindade com poucos aliados reais — visto como policiador e possível adversário por todas as partes.',
'[{"title":"Descrição","paras":["Protus é o Titã do Equilíbrio e dos construtos. Fragmentou Raegrar, o Titã do Caos, para sustentar a existência dos planos de existência. Costuma assumir posição de observador perante os acontecimentos do cosmos, intervindo apenas quando o equilíbrio entre o bem e o mal é realmente ameaçado.","Isso faz dele uma divindade com poucos aliados reais — é visto como policiador e possível adversário dependendo da ocasião. Muitos de seus seguidores são construtos inteligentes, como a própria divindade."]},{"title":"Dogmas","paras":["Nunca se afilie a um lado; se mantenha sempre no lado do equilíbrio.","Ensine a outros a importância do equilíbrio; seja a voz de Protus.","Almeje trazer a neutralidade ao mundo."]}]'::jsonb,
'[{"tag":"Divindade","title":"Raegrar (fragmentou)","target":"deity:raegrar"}]'::jsonb,
false),

-- 20. FYRIA
('fyria','Fyria','A Imperatriz de Abaddon · Titã da Maldade','Flame',
'{"rows":[{"k":"Tipo","v":"Titã da Maldade"},{"k":"Domínio","v":"Maldade · Daemons · Apocalipse"},{"k":"Alinhamento","v":"Caótico Maligno"}]}'::jsonb,
'Criou os daemons — os mais infames sendo os quatro cavaleiros do apocalipse. Apesar de ter poucos cultistas mortais, aqueles dispostos a se dedicar a ela são poupados parcialmente da maldade inata dos daemons. Parcialmente.',
'[{"title":"Descrição","paras":["Fyria é a Titã da Maldade, a criadora das profanas criaturas conhecidas como daemons. É inimiga natural de Lamidriel, a Titã da Bondade — os dois polos morais primordiais do cosmos.","Possui poucos cultistas mortais, mas aqueles dispostos a se dedicar a ela são poupados parcialmente da maldade inata dos daemons e da própria deusa. Suas Crucidaemons — daemons que consomem almas literalmente — são sua arma mais devastadora contra o ciclo natural da morte: uma Crucidaemon caça Revna ativamente; outra matou Ragae e consumiu sua alma, sendo contida apenas pelo sacrifício de Feronar."]},{"title":"Dogmas","paras":["Caçe e consuma aqueles mais fracos que você; apenas os fiéis de Fyria estão no topo da cadeia alimentar.","Encontre caminhos para liberar os filhos de Fyria sobre o mundo, os Daemons.","Espalhe guerra, fome, morte e peste pelo mundo; avance a chegada do apocalipse em nome da Imperatriz de Abaddon."]}]'::jsonb,
'[{"tag":"Divindade","title":"Lamidriel (polo oposto)","target":"deity:lamidriel"},{"tag":"Divindade","title":"Senhora da Rapina (inimiga)","target":"deity:senhora-da-rapina"}]'::jsonb,
false),

-- 21. VECNA
('vecna','Vecna','Deus dos Mortos-Vivos e dos Segredos Proibidos','Skull',
'{"rows":[{"k":"Tipo","v":"Deus do Panteão"},{"k":"Domínio","v":"Mortos-Vivos · Necromancia · Segredos"},{"k":"Alinhamento","v":"Neutro Maligno"}]}'::jsonb,
'Ele reina sobre aquilo que não deve ser conhecido e sobre aquilo que as pessoas desejam manter em segredo. Conjuradores malignos e conspiradores lhe prestam homenagem. Há indícios não confirmados de conexão entre seu culto e a Blackflame.',
'[{"title":"Descrição","paras":["Vecna é o deus dos mortos-vivos, da necromancia e dos segredos. Reina sobre aquilo que não deve ser conhecido. É o oposto direto de Ioun: onde ela dissemina o saber, Vecna o acumula e oculta. Seus seguidores são ensinados a nunca revelar tudo que sabem e a buscar domínio sobre todas as outras divindades — inclusive as malignas.","Há indícios não confirmados de conexão entre seu culto e a Blackflame."]},{"title":"Dogmas","paras":["Nunca revele tudo que sabe.","Encontre a semente da maldade em seu coração e a alimente; encontre a mesma em outros e a use para sua vantagem.","Oponha seguidores de todas as outras divindades, inclusive malignas, para que Vecna sozinho reine sobre o mundo."]}]'::jsonb,
'[{"tag":"Divindade","title":"Ioun (oposta direta)","target":"deity:ioun"}]'::jsonb,
false),

-- 22. ASMODEUS
('asmodeus','Asmodeus','O Lorde dos Nove Infernos · Deus da Tirania','Chain',
'{"rows":[{"k":"Tipo","v":"Deus do Panteão"},{"k":"Domínio","v":"Tirania · Infernos · Dominação"},{"k":"Alinhamento","v":"Leal Maligno"}]}'::jsonb,
'Reina sobre os nove Infernos com punho de ferro e língua afiada. Evita e despreza quaisquer outras divindades — com duas exceções notáveis: Erathis e Vofureon. Ninguém ainda explicou satisfatoriamente o porquê.',
'[{"title":"Descrição","paras":["Asmodeus é o deus da tirania e da dominação, Lorde dos Nove Infernos. Além de diabos, criaturas como rakhasas o cultuam, e aqueles de coração maligno são atraídos aos seus cultos sombrios.","Evita e despreza quaisquer outras divindades — com duas exceções: Erathis, Deusa da Civilização, e Vofureon, Titã da Luz. Com Erathis, a compatibilidade vem da sobreposição de domínios: lei e hierarquia. Com Vofureon, nenhuma explicação satisfatória foi documentada."]},{"title":"Dogmas","paras":["Almeje poder sobre os outros; que você possa reinar como o Lorde do Inferno o faz.","Retribua maldade com maldade. Se outros forem gentis com você, explore a fraqueza deles para os seus próprios objetivos.","Não mostre piedade àqueles que são esmagados enquanto você faz seu caminho para o poder; os fracos não merecem compaixão."]}]'::jsonb,
'[{"tag":"Divindade","title":"Erathis (aliança incomum)","target":"deity:erathis"},{"tag":"Divindade","title":"Vofureon (contato incomum)","target":"deity:vofureon"}]'::jsonb,
false),

-- 23. BANE
('bane','Bane','O Conquistador · Deus da Guerra e da Dominação','Sword',
'{"rows":[{"k":"Tipo","v":"Deus do Panteão"},{"k":"Domínio","v":"Guerra · Conquista · Dominação"},{"k":"Alinhamento","v":"Leal Maligno"}]}'::jsonb,
'A maioria das nações militaristas o tem como patrono principal. Sua fé serve como combustível para a continuação de suas guerras. Não glorifica a batalha pelo prazer dela — glorifica a conquista.',
'[{"title":"Descrição","paras":["Bane é a divindade dos domínios da guerra, conquista e dominação. A maioria das nações militaristas, principalmente humanos e goblins, o tem como patrono principal. Diferente de Kord, que prega força e glória individual, Bane prega a dominação sistemática: hierarquia, disciplina, e o terror como ferramenta de controle."]},{"title":"Dogmas","paras":["Nunca permita que o medo obtenha o controle sobre você; você é aquele que deve imbuir o coração de outros com terror.","Insubordinação e desordem devem ser punidas; hierarquia é essencial para a dominação total.","Aperfeiçoe suas capacidades de combate; você é o reflexo de sua maestria em combate."]}]'::jsonb,
'[]'::jsonb,
false),

-- 24. TIAMAT
('tiamat','Tiamat','Rainha dos Dragões Cromáticos · Deusa da Ganância','Dragon',
'{"rows":[{"k":"Tipo","v":"Deusa do Panteão"},{"k":"Domínio","v":"Ganância · Riqueza · Dragões Cromáticos"},{"k":"Alinhamento","v":"Leal Maligno"}]}'::jsonb,
'É a patrona de todos os dragões cromáticos e criaturas derivadas. Cevras e os draconatos negros carregam essa ligação divina. A riqueza, para seus seguidores, já é sua própria recompensa.',
'[{"title":"Descrição","paras":["Tiamat é a deusa da ganância, riqueza e inveja, de origem maligna. Patrona de todos os dragões cromáticos e criaturas derivadas. Cevras e os draconatos negros têm essa ligação divina.","Como terceira entidade dracônica junto a Bahamut e Naomi, ocupa espaço de tensão permanente no panteão dracônico — em oposição direta a Bahamut e seus dragões metálicos."]},{"title":"Dogmas","paras":["Acumule riqueza, adquirindo muito e gastando pouco. A riqueza em si já é sua própria recompensa.","Não perdoe nem os menores dos erros e retalie qualquer mal feito a você.","Tome aquilo que você deseja dos outros. Aqueles incapazes de defender o que possuem não merecem suas posses."]}]'::jsonb,
'[{"tag":"Divindade","title":"Bahamut (oposto)","target":"deity:bahamut"},{"tag":"Divindade","title":"Naomi (terceira entidade dracônica)","target":"deity:naomi"}]'::jsonb,
false),

-- 25. LOLTH
('lolth','Lolth','Rainha Demoníaca das Aranhas · Deusa das Sombras','Eye',
'{"rows":[{"k":"Tipo","v":"Deusa do Panteão"},{"k":"Domínio","v":"Sombras · Mentiras · Aranhas"},{"k":"Alinhamento","v":"Caótico Maligno"}]}'::jsonb,
'Não é um demônio — apesar do título. Seus seguidores são uma constante força de disrupção na sociedade dos elfos drow. Corellon a detesta por ter levado sua criação ao caminho da escuridão.',
'[{"title":"Descrição","paras":["Lolth é a deusa das sombras, das mentiras e das criaturas aracnídias. Apesar de não ser um demônio, é chamada de Rainha Demoníaca das Aranhas. Seus seguidores são uma constante força de disrupção na sociedade drow, repleta de intriga e traição.","Corellon a detesta por ter levado os elfos drow ao caminho da escuridão. Apesar de ter similaridades com Zehir — inclusive ambos tendo corrompido criaturas de Corellon — os dois não são aliados."]},{"title":"Dogmas","paras":["Façam tudo que seja necessário para ganhar e manter poder.","Aposte na furtividade e mentira; não procure o conflito direto.","Busque a morte de elfos e eladrin a toda oportunidade; eles são seus inimigos e devem ser exterminados."]}]'::jsonb,
'[{"tag":"Divindade","title":"Corellon (inimigo)","target":"deity:corellon"},{"tag":"Divindade","title":"Zehir (sem aliança)","target":"deity:zehir"}]'::jsonb,
false),

-- 26. GRUUMSH
('gruumsh','Gruumsh','O Deus Caolho · Lorde das Hordas Bárbaras','Sword',
'{"rows":[{"k":"Tipo","v":"Deus do Panteão"},{"k":"Domínio","v":"Destruição · Orcs · Conquista Brutal"},{"k":"Alinhamento","v":"Caótico Maligno"}]}'::jsonb,
'Corellon arrancou um de seus olhos durante um confronto de escala divina. Os orcs carregam esse ódio especial contra os elfos como herança divina. As ordens de Gruumsh são simples — o que não as torna menos absolutas.',
'[{"title":"Descrição","paras":["Gruumsh é o deus da destruição. Enquanto Bane comanda e conquista, Gruumsh extermina e pilha. Orcs são seus seguidores mais fervorosos — e possuem um ódio especial contra elfos, herança do confronto em que Corellon arrancou um dos olhos de Gruumsh durante um embate de escala divina."]},{"title":"Dogmas","paras":["Conquiste e destrua.","Deixe que sua força esmague os fracos.","Faça a sua vontade e não deixe que ninguém lhe pare."]}]'::jsonb,
'[{"tag":"Divindade","title":"Corellon (inimigo — olho perdido)","target":"deity:corellon"}]'::jsonb,
false),

-- 27. ZEHIR
('zehir','Zehir','Deus da Escuridão, do Veneno e dos Assassinos','Skull',
'{"rows":[{"k":"Tipo","v":"Deus do Panteão"},{"k":"Domínio","v":"Escuridão · Veneno · Assassinos"},{"k":"Alinhamento","v":"Neutro Maligno"}]}'::jsonb,
'Seu feito mais infame: corrompeu a terra natal dos elfos solares — seguidores de Pelor e Esmir — transformando-os no que hoje é conhecido como Elfos das Trevas. Cobras são sua criação favorita.',
'[{"title":"Descrição","paras":["Zehir é o deus da escuridão, do veneno e dos assassinos. Cobras são sua criação favorita; yuan-ti o veneram acima de todos os outros deuses. Seu feito mais infame é o corrompimento da terra natal dos elfos solares — transformando-os nos Elfos das Trevas.","Apesar de ter similaridades com Lolth — inclusive ambos tendo corrompido criaturas de Corellon — eles não são aliados. É inimigo declarado de Esmir, sendo um dos alvos centrais da Cruzada do Sol."]},{"title":"Dogmas","paras":["Se esconda na escuridão da noite; que seus feitos permaneçam um segredo.","Mate em nome de Zehir e ofereça cada morte como um sacrifício.","Tenha prazer em usar veneno e possua criaturas que sejam criações de Zehir."]}]'::jsonb,
'[{"tag":"Divindade","title":"Esmir (inimigo)","target":"deity:esmir"},{"tag":"Divindade","title":"Corellon (elfos corrompidos)","target":"deity:corellon"}]'::jsonb,
false),

-- 28. TOROG
('torog','Torog','O Rei que se Arrasta · Deus do Grande Escuro','Chain',
'{"rows":[{"k":"Tipo","v":"Deus do Panteão"},{"k":"Domínio","v":"Grande Escuro · Tortura · Aprisionamento"},{"k":"Alinhamento","v":"Caótico Maligno"}]}'::jsonb,
'Superstição comum diz que pronunciar seu nome faz o Rei que se Arrasta puxar a pessoa para o Grande Escuro, onde sofrerá de eterna tortura e aprisionamento. Muitas criaturas do subterrâneo o veneram como patrono.',
'[{"title":"Descrição","paras":["Torog é o Deus do Grande Escuro, patrono de carcereiros e torturadores. Sua fé não é amplamente espalhada na superfície, mas muitas criaturas do Grande Escuro o veem como seu patrono e o veneram.","Opera no mesmo espaço geográfico que Xathyr — o Grande Escuro — gerando tensão territorial entre as duas entidades."]},{"title":"Dogmas","paras":["Procure e venere os lugares profundos do subsolo.","Tenha prazer em infligir dor; considere qualquer dor que você sofra uma homenagem a Torog.","Prenda firmemente aquilo sobre o que você tem controle; restrinja aqueles que são livres."]}]'::jsonb,
'[{"tag":"Divindade","title":"Xathyr (tensão territorial)","target":"deity:xathyr"}]'::jsonb,
false),

-- 29. THARIZDUN
('tharizdun','Tharizdun','O Deus Acorrentado · O Olho Elemental',NULL,
'{"rows":[{"k":"Tipo","v":"Deus do Panteão"},{"k":"Domínio","v":"Abismo · Destruição Total"},{"k":"Alinhamento","v":"Caótico Maligno"},{"k":"Estado","v":"Acorrentado","danger":true}]}'::jsonb,
'Menos de cinco por cento da população sabe de sua existência. Não fala com seus seguidores — mas ainda assim lhes concede poderes divinos. Criou o Plano do Abismo. Seus cultistas ensinam o que acreditam ser sua vontade.',
'[{"title":"Descrição","paras":["Tharizdun é a entidade divina que criou o Plano do Abismo, lar infinito dos demônios. Os fatos de sua existência são pouco conhecidos — menos de cinco por cento da população sabe de sua existência.","Alguns cultos o veneram como o Deus Acorrentado ou o Olho Elemental. Tharizdun não fala com seus seguidores apesar de lhes conceder poderes divinos — seus mandamentos são desconhecidos, mas seus cultistas ensinam o que acreditam ser sua vontade: a obliteração completa do mundo como antecipação de sua liberação."]},{"title":"Dogmas","paras":["Canalize seu poder para o Deus Acorrentado; nosso Senhor deve reganhar suas forças para quebrar suas correntes.","Recupere relíquias antigas e reencontre templos do Deus Acorrentado.","Almeje a obliteração completa do mundo na antecipação da liberação do Deus Acorrentado."]}]'::jsonb,
'[]'::jsonb,
false),

-- 30. RAEGRAR
('raegrar','Raegrar','O Primordial Fragmentado · Titã do Caos',NULL,
'{"rows":[{"k":"Tipo","v":"Titã do Caos"},{"k":"Domínio","v":"Caos · Planos Elementais · Primordial"},{"k":"Alinhamento","v":"Caótico Maligno"},{"k":"Estado","v":"Fragmentado","danger":true}]}'::jsonb,
'Foi partido em múltiplos planos por Protus para sustentar a existência dos outros planos. Sua fúria perante todo o cosmos é infinita — ao ponto de não se importar com os eternos conflitos do bem e do mal.',
'[{"title":"Descrição","paras":["Raegrar é a essência dos planos primordiais, partido há muito tempo em múltiplos planos por Protus, Titã da Ordem, para sustentar a existência dos outros planos. Os elementos primordiais — fogo, água, terra, ar — são, segundo essa leitura teológica, os fragmentos de Raegrar servindo como alicerces involuntários do cosmos.","Sua fúria perante todo o cosmos e o panteão divino é infinita — ao ponto de não se importar com os eternos conflitos do bem e do mal. Seus seguidores buscam reunir os elementos e restaurar seu corpo fragmentado."]},{"title":"Dogmas","paras":["Extermine o clero de Protus; ele é o culpado pela fragmentação do Senhor dos Elementos e deve ser punido.","Almeje reencontrar as entradas naturais para os Planos Elementais; quebre os selos para que o Plano Primordial se una novamente com o Plano Material.","Procure a união dos elementos e elementais; restaure o corpo de Raegrar ao encerrar o conflito natural dos elementos."]}]'::jsonb,
'[{"tag":"Divindade","title":"Protus (o fragmentou)","target":"deity:protus"}]'::jsonb,
false),

-- 31. XATHYR
('xathyr','Xathyr','O Falso-Deus · O Pastor e suas Ovelhas','Eye',
'{"rows":[{"k":"Tipo","v":"Pseudo-divindade"},{"k":"Domínio","v":"Controle Mental · Grande Escuro"},{"k":"Alinhamento","v":"Neutro Maligno"},{"k":"Natureza","v":"Aboleth colossal — semi-divino"}]}'::jsonb,
'Não é um deus — é um aboleth colossal cuja posição semi-divina foi adquirida pelo vasto número de seguidores fiéis ao longo de eras. É conhecido por tomar controle da mente de criaturas de forma tão grave que elas se tornam dependentes dele mesmo após o controle desaparecer.',
'[{"title":"Descrição","paras":["Xathyr não é uma criatura que ascendeu à divindade — é um aboleth colossal cujo vasto número de seguidores fiéis ao longo de eras lhe concedeu posição semi-divina. Opera no Grande Escuro.","Seu método é único: não controla mentes diretamente. Faz o alvo acreditar genuinamente que suas ações são corretas — a influência permanece invisível até momentos decisivos. Seguidores tornam-se dependentes dele voluntariamente mesmo após o controle desaparecer.","É odiado por múltiplas divindades, especialmente Esmir — sob cujo estandarte a Cruzada do Sol foi fundada para interromper sua crescente ascensão. Lawrence foi afetado por ele no passado. A Cruzada do Sol está no Grande Escuro há doze anos combatendo sua influência."]},{"title":"Dogmas","paras":["Haja em interesse do seu mestre; coloque as suas necessidades em segundo lugar.","Acumule o máximo de poder possível em nome de Xathyr; adquira seguidores para que ele se torne ainda mais poderoso.","Desafie os deuses e seus seguidores; combata a Cruzada do Sol e aniquile a vontade deles."]}]'::jsonb,
'[{"tag":"Divindade","title":"Esmir (inimigo principal)","target":"deity:esmir"},{"tag":"Divindade","title":"Torog (tensão territorial)","target":"deity:torog"}]'::jsonb,
false),

-- 32. AYAEL
('ayael','Ayael','O Anjo Aprisionado · Filho de Lamidriel no Sofrimento Eterno','Chain',
'{"rows":[{"k":"Tipo","v":"Anjo · Filho de Lamidriel"},{"k":"Domínio","v":"N/A — não é divindade"},{"k":"Alinhamento","v":"Bondoso"},{"k":"Estado","v":"Aprisionado — Plano de Energia Negativa","danger":true}]}'::jsonb,
'Não é uma divindade — é um anjo. Filho de Lamidriel, preso no Plano de Energia Negativa. Seu sofrimento vaza pelo rasgo planar de Lancaster e se manifesta no mundo como corrupção. Como foi aprisionado permanece sem resposta.',
'[{"title":"Descrição","paras":["Ayael é o anjo filho de Lamidriel, aprisionado no Plano de Energia Negativa em sofrimento eterno. Não é objeto de culto — é a causa involuntária da maior crise planar em andamento em Valiran.","O rasgo planar aberto por Noel Braent na Tumba dos Hereges em Lancaster no Ano 105 faz o sofrimento de Ayael vazar continuamente para o plano material, manifestando-se como energia nécrotica e corrupção. Ayael interfere no ciclo natural da morte, puxando ou corrompendo espíritos dos mortos. A Senhora da Rapina reage a essa interferência.","Alguém — possivelmente a Rainha Annabella, via a Blackflame — manipula ativamente essa energia. O nome de Ayael foi descoberto por Revna através de negociação com os Velstrac, ao custo de seu olho esquerdo. Como foi aprisionado, e por quem, permanece sem resposta documentada."]},{"title":"Nota","paras":["Ayael não é uma divindade e não possui culto ou seguidores. Sua inclusão neste registro é de natureza investigativa — a crise que seu sofrimento provoca é central para os eventos atuais de Valiran."]}]'::jsonb,
'[{"tag":"Divindade","title":"Lamidriel (pai)","target":"deity:lamidriel"},{"tag":"Divindade","title":"Senhora da Rapina (ciclo interferido)","target":"deity:senhora-da-rapina"}]'::jsonb,
false)

ON CONFLICT (id) DO UPDATE SET
  name        = EXCLUDED.name,
  epithet     = EXCLUDED.epithet,
  sigil       = EXCLUDED.sigil,
  infobox     = EXCLUDED.infobox,
  hero        = EXCLUDED.hero,
  sections    = EXCLUDED.sections,
  related     = EXCLUDED.related,
  placeholder = EXCLUDED.placeholder;
