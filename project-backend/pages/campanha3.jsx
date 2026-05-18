// Campanha III — Segredos de Lamidriel

const { useState: useC3State, useEffect: useC3Effect } = React;

const CAMPANHA3_ID = 'campanha3';

const CAMPANHA3_DEFAULTS = {
  id: CAMPANHA3_ID,
  title: 'Campanha III',
  subtitle: 'Segredos de Lamidriel — O que Aconteceu até Aqui',
  sections: [
    { title: 'O Mundo que Você Está Entrando', paras: [
      'Valiran é um continente marcado por cicatrizes antigas. Reinos erguem-se e caem, deuses concedem poder a seus devotos, e criaturas de outros planos de existência às vezes encontram brechas para entrar no mundo dos vivos.',
      'O mais importante para entender o que está acontecendo agora começa com uma cidade chamada Lancaster.',
      'Lancaster era um reino fundado na fé de Esmir — um mortal que séculos atrás se sacrificou para selar um grande mal e ascendeu à divindade. Era um lugar de honra, tradição e fé genuína. Seu rei, Vaglies Lihleran I, era um paladino — um guerreiro de poder divino — e um dos homens mais respeitados de Valiran.',
      'Mas Lancaster havia sido tocada por algo muito antigo e muito perigoso: Xathyr, uma criatura abissal do submundo chamada de Falso-Deus. Xathyr não controla mentes com força — ele é mais sutil. Ele faz suas vítimas acreditarem que suas próprias ações são corretas. Durante anos, sua influência pairou sobre Lancaster sem que ninguém percebesse.',
      'O golpe final veio de dentro. Um homem chamado Noel Braent — que escondia uma natureza de morto-vivo sob aparência perfeitamente viva — invadiu a Tumba dos Hereges. Essa tumba foi construída para selar uma fenda. Uma ruptura cujo poder havia sido contido por séculos. O que vazou de lá se manifesta no mundo como corrupção: plantas morrem, animais enlouquecem, mortos se levantam.',
      'Noel quebrou o selo. A corrupção se libertou sobre a Floresta das Rosas e sobre Lancaster. Com um exército de sombras libertadas da tumba, ele marchou sobre a cidade. Vaglies se sacrificou para conter o avanço — e Lancaster caiu.',
      'O Reino de Oshain, governado pela Rainha Annabella Whiteflame — uma mulher de mais de cem anos que não envelhece há décadas — não hesitou. Aproveitando o caos, Oshain ocupou Lancaster e a transformou em uma sátrapia sob seu controle.',
      'A corrupção não foi contida. Continuou se espalhando — e começou a avançar em direção ao reino vizinho de Wolfspine.',
    ]},
    { title: 'O Chamado de Sebastian', paras: [
      'Wolfspine é um reino independente ao sul de Nova Lancaster, governado pelo Grão-Duque Sebastian Rosewood. Experiente o suficiente para ler o que está por vir, Sebastian vê múltiplos problemas se acumulando: a corrupção da floresta se expande, as criaturas do Pantano de Fallburgo estão se comportando de maneira estranha e coordenada, e Oshain observa tudo com o sorriso de quem espera o momento certo para agir.',
      'Sebastian não tem exércitos suficientes para enfrentar tudo ao mesmo tempo. O que tem é julgamento — e o julgamento o leva a buscar heróis.',
      'Três pessoas atenderam ao seu chamado.',
    ]},
    { title: 'Os Três do Começo', paras: [
      'Harabella Thundervoice era líder dos Shifters — uma raça que carrega a natureza de animais em seu sangue. Ao nascer, recebeu uma bênção incomum: Melora, deusa da natureza, a agraciou com três espíritos da tempestade. Harabella havia liderado seu povo para fora da Floresta das Rosas corrompida. Chegou a Wolfspine para pedir ajuda. Ficou para dá-la.',
      'Wander Bristoll carregava um peso que só quem já perdeu alguém importante conhece. Havia sido um prodígio militar de Lancaster — fundou a companhia mercenária Sília Arms, lutou, sobreviveu, e então se retirou por dezessete anos após a morte de sua esposa Sília. Quando encontrou Harabella, algo nele acordou. Voltou à ativa com uma promessa silenciosa: uma última jornada antes de reencontrá-la.',
      'Revna vem de uma tribo do norte, marcada desde o nascimento para ser a Oráculo dos Corvos — serva da Senhora da Rapina, deusa da morte e guardiã do ciclo entre o fim de uma vida e o que vem depois. O que a trouxe a Wolfspine foi simples e perturbador: ela começou a perceber que algo interferia no ciclo da morte. Almas que deveriam descansar não descansavam. E Revna foi descobrir por quê.',
      'Os três se encontraram nas muralhas da City of Wolfspine e concordaram em ajudar o reino. Ganharam como guia um jovem patrulheiro chamado Rian Bheini e partiram em direção a Fallburgo.',
      'Rian não sobreviveu ao segundo dia. Kobolds atacaram o acampamento à noite — e um deles carregou seu corpo para longe antes de fugir. O grupo nunca entendeu por quê.',
    ]},
    { title: 'O Pantano e o Primeiro Luto', paras: [
      'A chegada ao Pantano de Fallburgo confirmou o pior. As criaturas do pantano estavam sendo controladas por uma força externa. Um deles demonstrou uma faísca de consciência antes de se autodestruir, deixando apenas palavras gravadas na memória de Revna: "Os segredos não são seus para descobrir."',
      'O combate que se seguiu foi além do que o grupo conseguia enfrentar.',
      'Harabella e Wander morreram no pantano de Fallburgo. Seus corpos foram carregados pelas criaturas. Para onde, o grupo não sabia naquele momento.',
      'Revna escapou sozinha. Voltou a Wolfspine com ferimentos e más notícias.',
    ]},
    { title: 'Diego e Ragae', paras: [
      'Com dois heróis mortos, Sebastian recrutou dois novos.',
      'Diego Vans Loupd\'or é um paladino — guerreiro imbuído de poder divino por Lamidriel, o Titã da Bondade. Foi reconhecido e levado para treinar na República Prateada por Thale Vans Loupd\'or. Diego é o tipo de pessoa em quem se confia não porque nunca erra, mas porque quando a decisão importa de verdade, ele aparece. Carrega uma bússola moral que raramente vacila.',
      'Ragae Eger nasceu de um ovo de dragão de prata e foi criado por um dragão de cobre na floresta. Tornou-se Patrulheiro — guardião dos espaços selvagens. Sua conexão com a natureza era visceral, e a destruição da Floresta das Rosas havia sido, nas suas próprias palavras, "um tiro no peito". Estava em Wolfspine porque precisava fazer algo a respeito.',
      'Com Revna recuperada e dois novos aliados, o grupo voltou às investigações. Encontraram Feronar: o Guardião da Floresta das Rosas, um ser de natureza primal com a forma de um lobo espiritual. Ele os alertou: a corrupção avançava. O tempo era curto.',
    ]},
    { title: 'Silverhain e as Respostas Difíceis', paras: [
      'O grupo partiu para Silverhain, capital da República Prateada de Bahamut — uma nação fundada por dragões e governada segundo os preceitos de Bahamut, deus da justiça. Levavam consigo Krista, da família Balore de Lupinwood, e seu guarda pessoal Grin — um homem que escondia um segredo.',
      'Em Silverhain, foram recebidos por Dykorkis — um dragão adulto de prata, filho do fundador da República e sacerdote de Bahamut. Dyko sabia o que estava acontecendo: rasgo planar para o Plano de Energia Negativa. A fenda havia sido selada pela tumba, que Noel destruiu. A corrupção era reversível — mas fechá-la exigiria poder divino considerável.',
      'Enquanto as negociações avançavam, o ferimento de Grin piorou — corrupção nécrotica em seu corpo. O ritual para curá-lo terminou de forma inesperada. Grin era um lobisomem. Em fúria incontrolável, matou quatro templários antes de ser detido. Revna se colocou entre ele e as lâminas da república. Grin foi preso. Revna prometeu a Krista que voltariam.',
      'O grupo saiu de Silverhain com mais respostas e mais fardos.',
    ]},
    { title: 'A Batalha de Feronar e o Fim de Ragae', paras: [
      'No regresso, a corrupção havia avançado sobre as próprias terras de Feronar. Cultistas de Fyria — a Titã da Maldade — estavam usando almas de criaturas mortas como combustível para forçar a corrupção a se expandir. E trouxeram consigo uma Crucidaemon: uma criatura de Fyria que consome almas, quebrando o ciclo natural da morte.',
      'O grupo lutou ao lado de Feronar. E perdeu.',
      'Ragae morreu. A Crucidaemon consumiu sua alma — o pior tipo de morte num mundo onde o ciclo importa, porque uma alma consumida não descansa. Não vai a lugar nenhum. Simplesmente se apaga.',
      'Feronar se sacrificou para teleportar os sobreviventes para longe. Usou suas últimas forças para conter a Crucidaemon. Depois disso, não havia mais Guardião da Floresta das Rosas.',
      'A Crucidaemon sobreviveu. E desenvolveu uma ligação mágica de caça com Revna. Desde então, ela sente constantemente que está sendo seguida. Porque está.',
      'O funeral de Ragae foi realizado em Wolfspine. Três presenças dracônicas divinas — Bahamut, Tiamat e Naomi — se fizeram presentes para honrá-lo. Naquele momento, perante a pira, Dykorkis anunciou o nascimento da Cruzada Prateada.',
    ]},
    { title: 'Lawrence, Isla e John', paras: [
      'Enquanto os eventos em Wolfspine se desdobravam, três figuras chegaram ao acampamento de fronteira.',
      'Lawrence Cainhurst nasceu na Floresta das Rosas com algo diferente: uma afinidade com energia negativa. Energia positiva produz efeito contrário em seu corpo — o que deveria curar, o fere. Quando criança, um capelão tentou "corrigir" isso com um ritual que quase o matou. Foi Jorah Londor, um cavaleiro de Lamidriel, quem interrompeu o ritual. Jorah tornou-se figura paterna para Lawrence. Lawrence sobreviveu à queda de Lancaster graças à sua afinidade com energia negativa. Estava em Wolfspine para fazer algo útil com essa sobrevivência.',
      'Isla havia recebido visões da Senhora da Rapina: uma escolhida estava em perigo. A escolhida era Revna. Isla foi a Wolfspine encontrá-la.',
      'John chegou com Lawrence. Vinha do mesmo contexto — Lancaster, a queda, a sobrevivência.',
    ]},
    { title: 'O Preço de Revna', paras: [
      'Revna precisava de respostas que nenhuma fonte divina ou aliada daria. Um familiar de aparência sombria a encontrou na floresta. Seu mestre queria conversar.',
      'Os Velstrac são criaturas que servem a Fyria — mas diferente das Crucidaemons, eles corrompem mortais através de dor e contratos. Tinham informações. E um preço.',
      'Revna pagou. Perdeu o olho esquerdo. Ganhou uma marca permanente dos Velstrac — dor constante, e a certeza de que eles sempre saberão onde ela está. Em troca, soube o que precisava: a fonte da corrupção era uma criatura aprisionada no Plano de Energia Negativa — um arcanjo caído chamado Ayael, filho de Lamidriel, o Titã da Bondade. Ele sofre eternamente naquele lugar. E é esse sofrimento, vazando pela fenda para o mundo, que alimenta tudo o que o grupo havia enfrentado até então.',
      'Dyko desaprovou. O grupo ficou dividido. A resolução foi pragmática: Revna ficaria sob custódia de Galazeth e Lawrence.',
    ]},
    { title: 'A Torre de Fallburgo', paras: [
      'O comportamento das criaturas do pantano havia mudado — estavam se reunindo em barreira, bloqueando passagens, agindo com coordenação que mortos-vivos comuns não teriam. O grupo foi investigar. Encontraram algo que não estava lá antes: uma torre no meio das águas, com um cristal Ahl\'kir gigante carregado de energia nécrotica. Era dali que o controle vinha.',
      'A torre confirmou o que já se suspeitava: a Blackflame — uma organização secreta que opera sob ordens diretas da Rainha Annabella de Oshain. A prova mais brutal estava dentro da própria torre: os corpos de Harabella e Wander, levantados como mortos-vivos. Aqueles que o pantano havia carregado meses antes foram usados contra o mesmo grupo que os havia perdido. A segunda morte deles foi apagá-los uma segunda vez.',
      'O combate foi brutal. Lá dentro: abominações, esqueletos, draconatos negros. Do lado de fora: dragões negros menores. E então Cevras surgiu — um dragão negro do tamanho de Dykorkis. Revna curou Dyko através de uma janela. Cevras recuou — mas jurou vingança.',
      'Isla foi morta pela Princesa Pálida da Torre.',
      'As Princesas Pálidas são mulheres transformadas pela própria Rainha Annabella Whiteflame — uma guarda de elite corrompida que serve diretamente à coroa. A Blackflame não é independente — opera sob controle direto da Rainha.',
      'Havia sido Oshain o tempo todo.',
      'O grupo encontrou um livro codificado da Blackflame: Projeto Oceano — canalizar energia negativa em arma de destruição em massa. Projeto Fantasma — objetivo real desconhecido, listado apenas como projeto primário. A Rainha não estava apenas se aproveitando do caos. Ela estava construindo algo com ele.',
    ]},
    { title: 'A Queda de Lidhaven', paras: [
      'Lidhaven, cidade a leste de Wolfspine, foi o próximo alvo. Mortos-vivos cercaram a cidade. Magos da Blackflame foram avistados nas ruas. O capitão da guarda desapareceu.',
      'Dykorkis partiu imediatamente. Diego e Lawrence foram com ele.',
      'Joice estava infectada pela Princesa Pálida. John a escoltou para Wolfspine, onde Revna conseguiu curá-la antes que fosse tarde demais.',
      'Diego foi emboscado por agentes da Blackflame — que o chamavam de terrorista e exigiam sua rendição. Ele derrotou quatro deles, mas outros quatro fugiram. Lawrence enfrentou um lobisomem que ameaçava os refugiados — e o eliminou, num confronto do qual se arrependeu.',
      'Nas catacumbas, encontraram a Lança de Feronar — e a Princesa Pálida de Lidhaven. A Princesa invocou uma Shadow. Lawrence foi gravemente ferido. O contato deixou nele uma mácula de Ayael que sacerdotes não conseguiram remover.',
      'Diego deu o golpe final na Shadow. E então a Princesa olhou para ele: "Renda-se. E todos os outros sobrevivem."',
      'Diego olhou para Lawrence. Dois paladinos de Lamidriel — a mesma fé, o mesmo Titã. Trocaram um aperto de mão. Trocaram as espadas — um juramento sem palavras. Lawrence ficou com a espada de Diego.',
      'Diego foi levado.',
    ]},
    { title: 'O que Ficou de Pé', paras: [
      'Wolfspine se rendeu a Oshain. Sebastian foi "realocado" para Redhall — na prática, um refém. Lady Joice governa sob jugo.',
      'O grupo fugiu para Silverhain. Lawrence fundou a Brotherhood of Hope — refúgio para os sem-lar, patrulheiros dispersos, templários sobreviventes. Na noite da fundação, consumido pela culpa, clamou por Lamidriel pela primeira vez com tudo que tinha. Foi atendido. Lawrence ascendeu a Paladino naquela noite.',
      'Mas a dúvida não o largou: "É mesmo Lamidriel quem me concede esse poder?" A mácula ainda está dentro dele. A origem do poder, incerta.',
      'Revna planeja negociar com o Império de Ferro — uma nação de elfos imunes à manipulação mágica — oferecendo informações sobre a Rainha em troca do resgate de Diego.',
      'Lawrence e John partiram em direção a Nova Lancaster, em busca de um guia que os leve ao Grande Escuro — a vasta região subterrânea onde a Cruzada do Sol está há doze anos, sem comunicação com a superfície.',
      'Eles vão ao encontro de Diego. E de tudo que a Rainha ainda não mostrou que planeja.',
    ]},
    { title: 'O que Você Precisa Saber', paras: [
      'A fenda de Ayael ainda está aberta. A corrupção ainda vaza.',
      'A Blackflame opera sob ordens diretas da Rainha Annabella. Ela tem dois projetos em andamento — um para criar uma arma de destruição em massa, e outro cujo objetivo real nem seus próprios membros conhecem completamente. O que a Rainha realmente quer é o grimório de um antigo arcanista chamado Aulus Visptas — um livro cujo conteúdo pode mudar o equilíbrio de poder do mundo. Onde Aulus está, ninguém sabe.',
      'Diego está preso. Lawrence carrega sua espada.',
      'A Crucidaemon caça Revna. Cevras jurou vingança contra o grupo.',
      'O mundo não está bem. Mas o grupo ainda está de pé. E às vezes, por ora, isso precisa ser suficiente.',
    ]},
  ],
  infobox: {
    rows: [
      { k: 'Período', v: '3ª Era, Anos 1278–1281' },
      { k: 'Status', v: 'Em andamento', ok: true },
      { k: 'Teatro', v: 'Wolfspine · Lancaster · Silverhain' },
      { k: 'Antagonista', v: 'Rainha Annabella Whiteflame', danger: true },
      { k: 'Ameaça central', v: 'Corrupção de Ayael', danger: true },
      { k: 'Facção aliada', v: 'Cruzada Prateada' },
      { k: 'Facção adversária', v: 'Blackflame · Oshain', danger: true },
      { k: 'Heróis caídos', v: 'Harabella · Wander · Ragae · Isla' },
      { k: 'Capturado', v: 'Diego Vans Loupd\'or', danger: true },
    ],
    status: 'Diego está preso. A Crucidaemon caça Revna. Lawrence e John marcham para o Grande Escuro. A fenda de Ayael permanece aberta.',
  },
  related: [
    { tag: 'Elenco',    title: 'Pessoas Importantes (NPC)', target: 'npcs' },
    { tag: 'Grupo',     title: 'Personagens (PC)',          target: 'characters' },
    { tag: 'Histórico', title: 'Linha do Tempo',            target: 'timeline' },
    { tag: 'Org.',      title: 'Blackflame · Brotherhood',  target: 'factions' },
    { tag: 'Divindade', title: 'Ayael — O que Sangra Luz',  target: 'article' },
  ],
};

// ── Edit Modal ──────────────────────────────────────────────────────────────
function C3EditModal({ data, onClose, onSave }) {
  const [form, setForm] = useC3State(() => ({
    title: data.title,
    subtitle: data.subtitle || '',
    sections: (data.sections || []).map(s => ({
      title: s.title || '',
      text: (s.paras || []).join('\n\n'),
    })),
    infoRows: (data.infobox?.rows || []).map(r => ({ ...r })),
    infoStatus: data.infobox?.status || '',
  }));
  const [busy, setBusy] = useC3State(false);

  function setField(k, v) { setForm(f => ({ ...f, [k]: v })); }

  function setSection(i, k, v) {
    setForm(f => {
      const sections = [...f.sections];
      sections[i] = { ...sections[i], [k]: v };
      return { ...f, sections };
    });
  }
  function addSection() {
    setForm(f => ({ ...f, sections: [...f.sections, { title: '', text: '' }] }));
  }
  function removeSection(i) {
    setForm(f => ({ ...f, sections: f.sections.filter((_, idx) => idx !== i) }));
  }

  function setRow(i, k, v) {
    setForm(f => {
      const infoRows = [...f.infoRows];
      infoRows[i] = { ...infoRows[i], [k]: v };
      return { ...f, infoRows };
    });
  }
  function addRow() {
    setForm(f => ({ ...f, infoRows: [...f.infoRows, { k: '', v: '', danger: false, ok: false }] }));
  }
  function removeRow(i) {
    setForm(f => ({ ...f, infoRows: f.infoRows.filter((_, idx) => idx !== i) }));
  }
  function cycleRowFlag(i) {
    setForm(f => {
      const infoRows = [...f.infoRows];
      const r = infoRows[i];
      if (!r.danger && !r.ok)       infoRows[i] = { ...r, danger: true, ok: false };
      else if (r.danger)            infoRows[i] = { ...r, danger: false, ok: true };
      else                          infoRows[i] = { ...r, danger: false, ok: false };
      return { ...f, infoRows };
    });
  }

  async function handleSave(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await onSave({
        ...data,
        title: form.title,
        subtitle: form.subtitle,
        sections: form.sections.map(s => ({
          title: s.title,
          paras: s.text.split(/\n\n+/).map(p => p.trim()).filter(Boolean),
        })),
        infobox: {
          rows: form.infoRows.filter(r => r.k || r.v),
          status: form.infoStatus,
        },
      });
      onClose();
    } catch (err) {
      alert('Erro ao salvar: ' + err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: 700 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Editar Campanha III</h2>
        </div>
        <form onSubmit={handleSave}>
          <div className="modal-body">
            <label className="modal-label">Título</label>
            <input className="modal-input" value={form.title} onChange={e => setField('title', e.target.value)} required />

            <label className="modal-label" style={{ marginTop: 12 }}>Subtítulo</label>
            <input className="modal-input" value={form.subtitle} onChange={e => setField('subtitle', e.target.value)} />

            {/* ── Infobox ── */}
            <div style={{ marginTop: 20, borderTop: '1px solid var(--ink-line-soft)', paddingTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <label className="modal-label" style={{ margin: 0 }}>Infobox — Linhas</label>
                <button type="button" className="btn-save" style={{ padding: '4px 12px', fontSize: 12 }} onClick={addRow}>+ Linha</button>
              </div>
              {form.infoRows.map((r, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto auto', gap: 6, marginBottom: 6, alignItems: 'center' }}>
                  <input className="modal-input" style={{ margin: 0 }} value={r.k} onChange={e => setRow(i, 'k', e.target.value)} placeholder="Rótulo" />
                  <input className="modal-input" style={{ margin: 0 }} value={r.v} onChange={e => setRow(i, 'v', e.target.value)} placeholder="Valor" />
                  <button
                    type="button"
                    title="Cor: neutro → vermelho → verde → neutro"
                    onClick={() => cycleRowFlag(i)}
                    style={{
                      padding: '4px 8px', fontSize: 11, border: '1px solid var(--ink-line-soft)',
                      borderRadius: 3, cursor: 'pointer', background: 'transparent',
                      color: r.danger ? 'var(--wine-bright)' : r.ok ? '#6fa86f' : 'var(--foam-dim)',
                    }}
                  >
                    {r.danger ? '🔴' : r.ok ? '🟢' : '⚪'}
                  </button>
                  <button type="button" className="btn-delete" style={{ padding: '4px 8px', fontSize: 11, opacity: 1 }} onClick={() => removeRow(i)}>✕</button>
                </div>
              ))}

              <label className="modal-label" style={{ marginTop: 14 }}>Situação Atual (rodapé do infobox)</label>
              <textarea className="modal-textarea" rows={3} value={form.infoStatus} onChange={e => setField('infoStatus', e.target.value)} placeholder="Texto de status atual..." />
            </div>

            <div style={{ marginTop: 20, borderTop: '1px solid var(--ink-line-soft)', paddingTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <label className="modal-label" style={{ margin: 0 }}>Seções ({form.sections.length})</label>
                <button type="button" className="btn-save" style={{ padding: '4px 12px', fontSize: 12 }} onClick={addSection}>+ Seção</button>
              </div>

              {form.sections.map((sec, i) => (
                <div key={i} style={{ marginBottom: 16, padding: 12, border: '1px solid var(--ink-line-soft)', borderRadius: 4 }}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: 'var(--foam-dim)', fontFamily: 'monospace', minWidth: 24 }}>#{i + 1}</span>
                    <input
                      className="modal-input"
                      style={{ flex: 1, margin: 0 }}
                      value={sec.title}
                      onChange={e => setSection(i, 'title', e.target.value)}
                      placeholder="Título da seção"
                    />
                    <button type="button" className="btn-delete" style={{ padding: '4px 10px', fontSize: 11, opacity: 1 }} onClick={() => removeSection(i)}>✕</button>
                  </div>
                  <textarea
                    className="modal-textarea"
                    rows={6}
                    value={sec.text}
                    onChange={e => setSection(i, 'text', e.target.value)}
                    placeholder="Parágrafos... (separe com linha em branco)"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-save" disabled={busy}>{busy ? 'Salvando…' : 'Salvar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
function Campanha3({ onNav }) {
  const { isEditor } = useAuth();
  const [modal, setModal] = useC3State(false);
  const [, forceUpdate] = useC3State(0);

  useC3Effect(() => {
    const handler = () => forceUpdate(n => n + 1);
    window.addEventListener('db-refresh', handler);
    return () => window.removeEventListener('db-refresh', handler);
  }, []);

  const dbData = Data.campaigns?.[CAMPANHA3_ID];
  const camp = dbData || CAMPANHA3_DEFAULTS;

  async function handleSave(data) {
    await window.DB.saveCampaignArticle(data);
  }

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

          {isEditor && (
            <button className="editor-del-btn" style={{ opacity: 1, marginBottom: 12 }} onClick={() => setModal(true)}>
              Editar
            </button>
          )}

          <h1 className="article-title">{camp.title}</h1>
          <p className="article-subtitle">{camp.subtitle}</p>

          <div className="article-divider"><Sigil.Ornament /></div>

          <div className="prose">
            {camp.sections.map((sec, i) => (
              <React.Fragment key={i}>
                <h2>{sec.title}</h2>
                {(sec.paras || []).map((p, j) => (
                  <p key={j} className={i === 0 && j === 0 ? 'dropcap' : ''}>{p}</p>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <aside className="infobox-rail">
        <div className="infobox">
          <div className="infobox-head">
            <div className="infobox-sigil-wrap"><Sigil.Tome /></div>
            <h3 className="infobox-name">{camp.title}</h3>
            <p className="infobox-sub">{camp.subtitle?.split('—')[0]?.trim()}</p>
          </div>
          <dl className="infobox-rows">
            {(camp.infobox?.rows || []).map(r => (
              <div key={r.k} className="infobox-row">
                <dt>{r.k}</dt>
                <dd className={r.danger ? 'danger' : r.ok ? 'ok' : ''}>{r.v}</dd>
              </div>
            ))}
          </dl>
          {camp.infobox?.status && (
            <div className="infobox-status">
              <strong>SITUAÇÃO ATUAL</strong><br />
              {camp.infobox.status}
            </div>
          )}
        </div>

        <div className="toc">
          <h4 className="toc-title">Sumário</h4>
          <ol>
            {camp.sections.map(s => <li key={s.title}>{s.title}</li>)}
          </ol>
        </div>

        <div className="related">
          <h4 className="related-title">Cf. Relacionados</h4>
          {(camp.related || []).map(r => (
            <a key={r.title} className="related-link" onClick={() => r.target && onNav(r.target)}>
              <span className="related-link-tag">{r.tag}</span>
              <span className="related-link-title">{r.title}</span>
            </a>
          ))}
        </div>
      </aside>

      {modal && (
        <C3EditModal
          data={camp}
          onClose={() => setModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

window.Campanha3 = Campanha3;
