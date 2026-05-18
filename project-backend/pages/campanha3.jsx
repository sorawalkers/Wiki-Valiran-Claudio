// Campanha III — Segredos de Lamidriel · Resumo narrativo

function Campanha3({ onNav }) {
  const toc = [
    "O Mundo que Você Está Entrando",
    "O Chamado de Sebastian",
    "Os Três do Começo",
    "O Pantano e o Primeiro Luto",
    "Diego e Ragae",
    "Silverhain e as Respostas Difíceis",
    "A Batalha de Feronar e o Fim de Ragae",
    "Lawrence, Isla e John",
    "O Preço de Revna",
    "A Torre de Fallburgo",
    "A Queda de Lidhaven",
    "O que Ficou de Pé",
    "O que Você Precisa Saber",
  ];

  return (
    <div className="article" data-screen-label="Campanha III">
      <div className="parchment article-body-wrap" style={{ minWidth: 0 }}>
        <div className="article-body">
          <nav className="breadcrumb">
            <a onClick={() => onNav('home')}>Arquivo</a>
            <span className="sep">▸</span>
            <a onClick={() => onNav('timeline')}>Crônicas</a>
            <span className="sep">▸</span>
            <span>Campanha III</span>
          </nav>

          <h1 className="article-title">Campanha III</h1>
          <p className="article-subtitle">Segredos de Lamidriel — O que Aconteceu até Aqui</p>

          <div className="article-divider"><Sigil.Ornament /></div>

          <div className="prose">

            <h2 id="mundo">O Mundo que Você Está Entrando</h2>
            <p className="dropcap">
              Valiran é um continente marcado por cicatrizes antigas. Reinos erguem-se e caem, deuses
              concedem poder a seus devotos, e criaturas de outros planos de existência às vezes encontram
              brechas para entrar no mundo dos vivos.
            </p>
            <p>
              O mais importante para entender o que está acontecendo agora começa com uma cidade
              chamada <strong>Lancaster</strong>.
            </p>
            <p>
              Lancaster era um reino fundado na fé de <strong>Esmir</strong> — um mortal que séculos atrás se sacrificou para
              selar um grande mal e ascendeu à divindade. Era um lugar de honra, tradição e fé genuína. Seu
              rei, <strong>Vaglies Lihleran I</strong>, era um paladino — um guerreiro de poder divino — e um dos homens
              mais respeitados de Valiran.
            </p>
            <p>
              Mas Lancaster havia sido tocada por algo muito antigo e muito perigoso: <strong>Xathyr</strong>, uma criatura
              abissal do submundo chamada de Falso-Deus. Xathyr não controla mentes com força — ele é
              mais sutil. Ele faz suas vítimas <em>acreditarem</em> que suas próprias ações são corretas. Durante anos,
              sua influência pairou sobre Lancaster sem que ninguém percebesse.
            </p>
            <p>
              O golpe final veio de dentro. Um homem chamado <strong>Noel Braent</strong> — que escondia uma natureza de
              morto-vivo sob aparência perfeitamente viva — invadiu a <strong>Tumba dos Hereges</strong>. Essa tumba não
              foi construída para abrigar mortos; foi construída para <em>selar uma fenda</em>. Uma ruptura cujo poder
              havia sido contido por séculos dentro daquelas paredes. O que vazou de lá se manifesta no
              mundo como corrupção: plantas morrem, animais enlouquecem, mortos se levantam.
            </p>
            <p>
              Noel quebrou o selo. A corrupção se libertou sobre a Floresta das Rosas e sobre Lancaster. Com
              um exército de sombras libertadas da tumba, ele marchou sobre a cidade. <strong>Vaglies se sacrificou</strong> para
              conter o avanço — e Lancaster caiu.
            </p>
            <p>
              O <strong>Reino de Oshain</strong>, governado pela <strong>Rainha Annabella Whiteflame</strong> — uma mulher de mais de
              cem anos que não envelhece há décadas — não hesitou. Aproveitando o caos, Oshain ocupou
              Lancaster e a transformou em uma sátrapia sob seu controle.
            </p>
            <p>
              A corrupção não foi contida. Continuou se espalhando — e começou a avançar em direção ao
              reino vizinho de <strong>Wolfspine</strong>.
            </p>

            <h2 id="sebastian">O Chamado de Sebastian</h2>
            <p>
              <strong>Wolfspine</strong> é um reino independente ao sul de Nova Lancaster, governado pelo <strong>Grão-Duque
              Sebastian Rosewood</strong>. Experiente o suficiente para ler o que está por vir, Sebastian vê múltiplos
              problemas se acumulando: a corrupção da floresta se expande, as criaturas do Pantano de
              Fallburgo estão se comportando de maneira estranha e coordenada, e Oshain observa tudo com
              o sorriso de quem espera o momento certo para agir.
            </p>
            <p>
              Sebastian não tem exércitos suficientes para enfrentar tudo ao mesmo tempo. O que tem é
              julgamento — e o julgamento o leva a buscar heróis.
            </p>
            <p>Três pessoas atenderam ao seu chamado.</p>

            <h2 id="tres">Os Três do Começo</h2>
            <p>
              <strong>Harabella Thundervoice</strong> era líder dos Shifters — uma raça que carrega a natureza de animais em
              seu sangue. Ao nascer, recebeu uma bênção incomum: Melora, deusa da natureza, a agraciou
              com três espíritos da tempestade. Harabella havia liderado seu povo para fora da Floresta das
              Rosas corrompida, vendo suas terras serem consumidas pela energia nécrotica. Chegou a
              Wolfspine para pedir ajuda. Ficou para dá-la.
            </p>
            <p>
              <strong>Wander Bristoll</strong> carregava um peso que só quem já perdeu alguém importante conhece. Havia
              sido um prodígio militar de Lancaster — fundou a companhia mercenária Sília Arms, lutou,
              sobreviveu, e então se retirou por dezessete anos após a morte de sua esposa Sília. Quando
              encontrou Harabella, algo nele acordou. Voltou à ativa com uma promessa silenciosa para Sília:
              <em>uma última jornada antes de reencontrá-la</em>.
            </p>
            <p>
              <strong>Revna</strong> vem de uma tribo do norte, marcada desde o nascimento para ser a Oráculo dos Corvos —
              serva da <strong>Senhora da Rapina</strong>, deusa da morte e guardiã do ciclo entre o fim de uma vida e o que
              vem depois. Sempre teve visões de catástrofes sem nunca entender seu papel nelas. O que a
              trouxe a Wolfspine foi simples e perturbador: ela começou a perceber que algo interferia no ciclo
              da morte. Almas que deveriam descansar não descansavam. A Senhora da Rapina estava
              inquieta. E Revna foi descobrir por quê.
            </p>
            <p>
              Os três se encontraram nas muralhas da <strong>City of Wolfspine</strong> e concordaram em ajudar o reino.
              Ganharam como guia um jovem patrulheiro chamado <strong>Rian Bheini</strong> e partiram em direção a Fallburgo.
            </p>
            <p>
              Rian não sobreviveu ao segundo dia. Kobolds atacaram o acampamento à noite — e um deles
              carregou seu corpo para longe antes de fugir. O grupo nunca entendeu por quê.
            </p>

            <h2 id="pantano">O Pantano e o Primeiro Luto</h2>
            <p>
              A chegada ao <strong>Pantano de Fallburgo</strong> confirmou o pior. As criaturas do pantano estavam sendo
              controladas por uma força externa. Um deles demonstrou uma faísca de consciência antes de se
              autodestruir, deixando apenas palavras gravadas na memória de Revna:
            </p>
            <blockquote>
              "Os segredos não são seus para descobrir."
            </blockquote>
            <p>
              O combate que se seguiu foi além do que o grupo conseguia enfrentar.
            </p>
            <p>
              <strong>Harabella e Wander morreram no pantano de Fallburgo.</strong> Seus corpos foram carregados pelas
              criaturas. Para onde, o grupo não sabia naquele momento.
            </p>
            <p>
              Revna escapou sozinha. Voltou a Wolfspine com ferimentos e más notícias.
            </p>

            <h2 id="diego">Diego e Ragae</h2>
            <p>Com dois heróis mortos, Sebastian recrutou dois novos.</p>
            <p>
              <strong>Diego Vans Loupd'or</strong> é um paladino — guerreiro imbuído de poder divino por <strong>Lamidriel</strong>, o Titã
              da Bondade. Foi reconhecido e levado para treinar na República Prateada por um aventureiro
              chamado Thale Vans Loupd'or, mas sua fé sempre foi em Lamidriel. Diego é o tipo de pessoa em
              quem se confia não porque nunca erra, mas porque quando a decisão importa de verdade, ele
              aparece. Carrega uma bússola moral que raramente vacila.
            </p>
            <p>
              <strong>Ragae Eger</strong> nasceu de um ovo de dragão de prata e foi criado por um dragão de cobre na floresta.
              Tornou-se Patrulheiro — guardião dos espaços selvagens. Sua conexão com a natureza era
              visceral, e a destruição da Floresta das Rosas havia sido, nas suas próprias palavras, <em>"um tiro no
              peito"</em>. Estava em Wolfspine porque precisava fazer algo a respeito.
            </p>
            <p>
              Com Revna recuperada e dois novos aliados, o grupo voltou às investigações. Detectaram a
              expansão da corrupção além das fronteiras de Lancaster — e numa tarde numa região fronteiriça,
              encontraram <strong>Feronar</strong>: o Guardião da Floresta das Rosas, um ser de natureza primal com a forma
              de um lobo espiritual. Ele os alertou: a corrupção avançava. O tempo era curto.
            </p>

            <h2 id="silverhain">Silverhain e as Respostas Difíceis</h2>
            <p>
              O grupo partiu para <strong>Silverhain</strong>, capital da <strong>República Prateada de Bahamut</strong> — uma nação
              fundada por dragões e governada segundo os preceitos de Bahamut, deus da justiça. Levavam
              consigo uma jovem nobre chamada <strong>Krista</strong>, da família Balore de Lupinwood, e seu guarda pessoal
              <strong>Grin</strong> — um homem que escondia um segredo.
            </p>
            <p>
              Em Silverhain, foram recebidos por <strong>Dykorkis</strong> — ou simplesmente Dyko —, um dragão adulto de
              prata, filho do fundador da República e sacerdote de Bahamut. Dyko sabia o que estava
              acontecendo. Chamou pelo nome: <strong>rasgo planar</strong> para o Plano de Energia Negativa. A fenda havia
              sido selada pela tumba, que Noel destruiu. A corrupção era reversível — mas fechá-la exigiria
              poder divino considerável.
            </p>
            <p>
              Enquanto as negociações avançavam, surgiu um problema imediato: o ferimento de Grin estava
              piorando — corrupção nécrotica em seu corpo. O ritual para curá-lo terminou de forma
              inesperada. Grin era um lobisomem. Em fúria incontrolável, matou quatro templários antes de
              ser detido. Revna se colocou entre ele e as lâminas da república — mas as consequências eram
              inevitáveis. Grin foi preso. Revna prometeu a Krista que voltariam.
            </p>
            <p>O grupo saiu de Silverhain com mais respostas e mais fardos.</p>

            <h2 id="feronar">A Batalha de Feronar e o Fim de Ragae</h2>
            <p>
              No regresso, a corrupção havia avançado sobre as próprias terras de Feronar. Cultistas de <strong>Fyria</strong> —
              a Titã da Maldade — estavam usando almas de criaturas mortas como combustível para forçar a
              corrupção a se expandir. E trouxeram consigo uma <strong>Crucidaemon</strong>: uma criatura de Fyria que
              consome almas, quebrando o ciclo natural da morte.
            </p>
            <p>O grupo lutou ao lado de Feronar. E perdeu.</p>
            <p>
              <strong>Ragae morreu.</strong> A Crucidaemon consumiu sua alma — o pior tipo de morte num mundo onde o
              ciclo importa, porque uma alma consumida não descansa. Não vai a lugar nenhum.
              Simplesmente se apaga.
            </p>
            <p>
              <strong>Feronar se sacrificou</strong> para teleportar os sobreviventes para longe. Usou suas últimas forças para
              conter a Crucidaemon. Depois disso, não havia mais Guardião da Floresta das Rosas.
            </p>
            <p>
              A Crucidaemon sobreviveu. E desenvolveu uma ligação mágica de caça com Revna. Desde então,
              ela sente constantemente que está sendo seguida. Porque está.
            </p>
            <p>
              O funeral de Ragae foi realizado em Wolfspine. Três presenças dracônicas divinas — Bahamut,
              Tiamat e Naomi — se fizeram presentes para honrá-lo. Naquele momento, perante a pira,
              <strong>Dykorkis anunciou o nascimento da Cruzada Prateada</strong>.
            </p>

            <h2 id="lawrence">Lawrence, Isla e John</h2>
            <p>
              Enquanto os eventos em Wolfspine se desdobravam, três figuras chegaram ao acampamento de
              fronteira.
            </p>
            <p>
              <strong>Lawrence Cainhurst</strong> nasceu na Floresta das Rosas com algo diferente: uma afinidade com
              energia negativa. Energia positiva produz efeito contrário em seu corpo — o que deveria curar, o
              fere. Quando criança, um capelão tentou "corrigir" isso com um ritual que quase o matou. Foi
              <strong>Jorah Londor</strong>, um cavaleiro de Lamidriel, quem interrompeu o ritual e o devolveu à mãe. Jorah
              tornou-se figura paterna para Lawrence. E então, durante os anos em que Xathyr influenciava
              Lancaster, Jorah simplesmente parou de aparecer. Lawrence sobreviveu à queda de Lancaster
              graças à sua afinidade com energia negativa — o que mataria outros, o protegia. Estava em
              Wolfspine para fazer algo útil com essa sobrevivência.
            </p>
            <p>
              <strong>Isla</strong> havia recebido visões da Senhora da Rapina: uma escolhida estava em perigo. A escolhida
              era Revna. Isla foi a Wolfspine encontrá-la.
            </p>
            <p>
              <strong>John</strong> chegou com Lawrence. Vinha do mesmo contexto — Lancaster, a queda, a sobrevivência.
            </p>
            <p>
              Os três chegaram no momento certo. A horda de mortos-vivos crescia. As pistas sobre quem a
              controlava apontavam para algo maior do que qualquer um imaginava.
            </p>

            <h2 id="revna">O Preço de Revna</h2>
            <p>
              Revna precisava de respostas que nenhuma fonte divina ou aliada daria. Um familiar de
              aparência sombria a encontrou na floresta. Seu mestre queria conversar.
            </p>
            <p>
              Os <strong>Velstrac</strong> são criaturas que servem a Fyria — mas diferente das Crucidaemons, eles
              corrompem mortais através de dor e contratos. Tinham informações. E um preço.
            </p>
            <p>Revna pagou.</p>
            <p>
              <strong>Perdeu o olho esquerdo.</strong> Ganhou uma marca permanente dos Velstrac — dor constante, e a
              certeza de que eles sempre saberão onde ela está. Em troca, soube o que precisava: a fonte da
              corrupção era uma criatura aprisionada no Plano de Energia Negativa — um arcanjo caído
              chamado <strong>Ayael</strong>, filho de Lamidriel, o Titã da Bondade. Ele sofre eternamente naquele lugar. E é
              esse sofrimento, vazando pela fenda para o mundo, que alimenta tudo o que o grupo havia
              enfrentado até então.
            </p>
            <p>
              Dyko desaprovou. O grupo ficou dividido. A resolução foi pragmática: Revna ficaria sob custódia
              de Galazeth e Lawrence.
            </p>

            <h2 id="torre">A Torre de Fallburgo</h2>
            <p>
              O comportamento das criaturas do pantano havia mudado — estavam se reunindo em barreira,
              bloqueando passagens, agindo com coordenação que mortos-vivos comuns não teriam. O grupo
              foi investigar. Sobrevoando o pantano, encontraram algo que não estava lá antes: uma torre no
              meio das águas, com um cristal Ahl'kir gigante carregado de energia nécrotica. Era dali que o
              controle vinha. Alguém estava canalizando a energia do pantano como arma — e o grupo decidiu
              acabar com isso.
            </p>
            <p>
              A torre confirmou o que já se suspeitava: os mesmos que controlavam os homens do pantano
              desde o início eram a <strong>Blackflame</strong>, uma organização secreta que opera sob ordens diretas da
              Rainha Annabella de Oshain. A prova mais brutal disso estava dentro da própria torre: <strong>os corpos
              de Harabella e Wander</strong>, levantados como mortos-vivos pela Blackflame. Aqueles que o pantano
              havia carregado meses antes foram usados contra o mesmo grupo que os havia perdido. A
              segunda morte deles foi apagá-los uma segunda vez.
            </p>
            <p>
              O combate foi brutal. Lá dentro: abominações, esqueletos, draconatos negros. Do lado de fora:
              dragões negros menores voando em círculos. E então <strong>Cevras</strong> surgiu — um dragão negro do
              tamanho de Dykorkis, levando vantagem sobre o dragão de prata já ferido. Revna curou Dyko
              através de uma janela. Cevras, vendo que a vitória escapava, recuou — mas antes de ir, <strong>jurou vingança</strong>.
            </p>
            <p>
              <strong>Isla foi morta pela Princesa Pálida da Torre</strong> — e foi nesse momento que tudo se encaixou.
            </p>
            <p>
              As Princesas Pálidas não são criaturas aleatórias. São mulheres transformadas pela própria
              <strong>Rainha Annabella Whiteflame de Oshain</strong> — uma guarda de elite corrompida que serve
              diretamente à coroa. E a Blackflame, a organização por trás da torre, dos cristais e dos
              mortos-vivos, também não é independente — opera sob controle direto da Rainha, agindo onde
              Oshain não pode agir abertamente.
            </p>
            <p>Havia sido Oshain o tempo todo.</p>
            <p>
              O grupo encontrou um livro codificado da Blackflame. Quando decifraram: <strong>Projeto Oceano</strong> —
              canalizar energia negativa em arma de destruição em massa. <strong>Projeto Fantasma</strong> — objetivo real
              desconhecido, listado apenas como projeto primário. E referências a tecnologia arcana capaz de
              direcionar a corrupção com precisão cirúrgica.
            </p>
            <p>A Rainha não estava apenas se aproveitando do caos. Ela estava construindo algo com ele.</p>

            <h2 id="lidhaven">A Queda de Lidhaven</h2>
            <p>
              <strong>Lidhaven</strong>, cidade a leste de Wolfspine, foi o próximo alvo. Depois do ataque à torre, a corrupção
              se espalhou anormalmente em torno dela — retaliação planejada pela Princesa Pálida antes de
              morrer. Mortos-vivos cercaram a cidade. Magos da Blackflame foram avistados nas ruas. O
              capitão da guarda desapareceu.
            </p>
            <p>
              Ao saber que Lidhaven estava cercada, <strong>Dykorkis partiu imediatamente</strong>. Diego e Lawrence foram
              com ele — não por ordem, mas porque não havia outra escolha quando um povo está em perigo.
            </p>
            <p>
              O grupo confirmou o que temiam: <strong>Joice estava infectada</strong>. John a escoltou imediatamente para fora
              de Lidhaven, levando-a a Wolfspine, onde Revna conseguiu curá-la antes que fosse tarde demais.
            </p>
            <p>
              Com Joice em segurança, Diego e Lawrence se separaram para resgatar os moradores ainda
              presos pela cidade. Foi durante essa busca que <strong>Diego foi emboscado por agentes da Blackflame</strong>
              — que o chamavam de terrorista e exigiam sua rendição. Ele derrotou quatro deles, mas outros
              quatro fugiram. Nas ruas, <strong>Lawrence enfrentou um lobisomem</strong> que ameaçava os refugiados que
              tentava escolar — e o eliminou, num confronto do qual se arrependeu.
            </p>
            <p>
              Então o portão de Lidhaven caiu. Nas catacumbas, encontraram a <strong>Lança de Feronar</strong> — e
              encontraram também o que estava esperando por eles: a <strong>Princesa Pálida de Lidhaven</strong> e agentes
              da Blackflame, posicionados e preparados.
            </p>
            <p>
              A Princesa invocou uma Shadow — criatura nascida da corrupção de Ayael. Lawrence foi
              gravemente ferido. O contato deixou nele uma <strong>mácula de Ayael</strong> que sacerdotes não conseguiram
              remover. Ele carrega esse peso até hoje.
            </p>
            <p>Diego deu o golpe final na Shadow. E então a Princesa olhou para ele.</p>
            <blockquote>
              "Renda-se. E todos os outros sobrevivem."
            </blockquote>
            <p>
              Diego olhou para Lawrence. Dois paladinos de Lamidriel — a mesma fé, o mesmo Titã, o mesmo
              caminho escolhido por razões diferentes. <strong>Trocaram um aperto de mão. Trocaram as espadas</strong> —
              um juramento sem palavras. Lawrence ficou com a espada de Diego. Com ela, o peso de ser talvez
              o único devoto de Lamidriel ainda de pé.
            </p>
            <p><strong>Diego foi levado.</strong></p>

            <h2 id="pe">O que Ficou de Pé</h2>
            <p>
              Wolfspine se rendeu a Oshain. Sebastian foi "realocado" para Redhall — na prática, um refém.
              Lady Joice governa sob jugo.
            </p>
            <p>
              O grupo fugiu para Silverhain. <strong>Lawrence fundou a Brotherhood of Hope</strong> — refúgio para os
              sem-lar, patrulheiros dispersos, templários sobreviventes. Na noite da fundação, consumido pela
              culpa e pela responsabilidade inesperada de liderar um povo sem lar, clamou por Lamidriel pela
              primeira vez com tudo que tinha. Foi atendido. <strong>Lawrence ascendeu a Paladino</strong> naquela noite.
            </p>
            <p>
              Mas a dúvida não o largou: <em>"É mesmo Lamidriel quem me concede esse poder?"</em> A mácula ainda
              está dentro dele. A origem do poder, incerta.
            </p>
            <p>
              <strong>Revna</strong> planeja negociar com o <strong>Império de Ferro</strong> — uma nação de elfos imunes à manipulação
              mágica — oferecendo informações sobre a Rainha em troca do resgate de Diego.
            </p>
            <p>
              <strong>Lawrence e John</strong> partiram em direção a Nova Lancaster, em busca de um guia que os leve ao
              <strong>Grande Escuro</strong> — a vasta região subterrânea onde a Cruzada do Sol está há doze anos, sem
              comunicação com a superfície.
            </p>
            <p>Eles vão ao encontro de Diego. E de tudo que a Rainha ainda não mostrou que planeja.</p>

            <h2 id="saber">O que Você Precisa Saber</h2>
            <p>A <strong>fenda de Ayael</strong> ainda está aberta. A corrupção ainda vaza.</p>
            <p>
              A <strong>Blackflame</strong> opera sob ordens diretas da Rainha Annabella. Ela tem dois projetos em
              andamento — um para criar uma arma de destruição em massa, e outro cujo objetivo real nem
              seus próprios membros conhecem completamente. O que a Rainha realmente quer é o grimório
              de um antigo arcanista chamado <strong>Aulus Visptas</strong> — um livro cujo conteúdo pode mudar o
              equilíbrio de poder do mundo. Onde Aulus está, ninguém sabe.
            </p>
            <p><strong>Diego está preso.</strong> Lawrence carrega sua espada.</p>
            <p><strong>A Crucidaemon caça Revna.</strong> Cevras jurou vingança contra o grupo.</p>
            <p>O mundo não está bem.</p>
            <p>Mas o grupo ainda está de pé.</p>
            <p style={{ fontSize: 15, color: 'var(--parchment-text-soft)', fontStyle: 'italic', marginTop: 32 }}>
              E às vezes, por ora, isso precisa ser suficiente.
            </p>

          </div>
        </div>
      </div>

      <aside className="infobox-rail">
        <div className="infobox">
          <div className="infobox-head">
            <div className="infobox-sigil-wrap"><Sigil.Tome /></div>
            <h3 className="infobox-name">Campanha III</h3>
            <p className="infobox-sub">Segredos de Lamidriel</p>
          </div>
          <dl className="infobox-rows">
            <div className="infobox-row"><dt>Período</dt><dd>3ª Era, Anos 1278–1281</dd></div>
            <div className="infobox-row"><dt>Status</dt><dd className="ok">Em andamento</dd></div>
            <div className="infobox-row"><dt>Teatro</dt><dd>Wolfspine · Lancaster · Silverhain</dd></div>
            <div className="infobox-row"><dt>Antagonista</dt><dd className="danger">Rainha Annabella Whiteflame</dd></div>
            <div className="infobox-row"><dt>Ameaça central</dt><dd className="danger">Corrupção de Ayael</dd></div>
            <div className="infobox-row"><dt>Facção aliada</dt><dd>Cruzada Prateada</dd></div>
            <div className="infobox-row"><dt>Facção adversária</dt><dd className="danger">Blackflame · Oshain</dd></div>
            <div className="infobox-row"><dt>Heróis caídos</dt><dd>Harabella · Wander · Ragae · Isla</dd></div>
            <div className="infobox-row"><dt>Capturado</dt><dd className="danger">Diego Vans Loupd'or</dd></div>
          </dl>
          <div className="infobox-status">
            <strong>SITUAÇÃO ATUAL</strong><br />
            Diego está preso. A Crucidaemon caça Revna. Lawrence e John marcham para o Grande Escuro. A fenda de Ayael permanece aberta.
          </div>
        </div>

        <div className="toc">
          <h4 className="toc-title">Sumário</h4>
          <ol>
            {toc.map((s, i) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </div>

        <div className="related">
          <h4 className="related-title">Cf. Relacionados</h4>
          <a className="related-link" onClick={() => onNav('npcs')}>
            <span className="related-link-tag">Elenco</span>
            <span className="related-link-title">Pessoas Importantes (NPC)</span>
          </a>
          <a className="related-link" onClick={() => onNav('characters')}>
            <span className="related-link-tag">Grupo</span>
            <span className="related-link-title">Personagens (PC)</span>
          </a>
          <a className="related-link" onClick={() => onNav('timeline')}>
            <span className="related-link-tag">Histórico</span>
            <span className="related-link-title">Linha do Tempo</span>
          </a>
          <a className="related-link" onClick={() => onNav('factions')}>
            <span className="related-link-tag">Org.</span>
            <span className="related-link-title">Blackflame · Brotherhood of Hope</span>
          </a>
          <a className="related-link" onClick={() => onNav('article')}>
            <span className="related-link-tag">Divindade</span>
            <span className="related-link-title">Ayael — O que Sangra Luz</span>
          </a>
        </div>
      </aside>
    </div>
  );
}

window.Campanha3 = Campanha3;
