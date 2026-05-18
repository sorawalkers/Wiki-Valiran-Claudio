// Campaign Article — generic component for all campaign summaries

const { useState: useCampState, useEffect: useCampEffect } = React;

// ── Defaults por campanha ────────────────────────────────────────────────────
// Cada chave é o id usado na tabela characters e no router.
// Adicione novas campanhas aqui com o mesmo formato.
const CAMPAIGN_DEFAULTS = {

  'campanha3': {
    id: 'campanha3',
    title: 'Campanha III',
    subtitle: 'Segredos de Lamidriel — O que Aconteceu até Aqui',
    sections: [
      { title: 'O Mundo que Você Está Entrando', paras: [
        'Valiran é um continente marcado por cicatrizes antigas. Reinos erguem-se e caem, deuses concedem poder a seus devotos, e criaturas de outros planos de existência às vezes encontram brechas para entrar no mundo dos vivos.',
        'O mais importante para entender o que está acontecendo agora começa com uma cidade chamada Lancaster.',
        'Lancaster era um reino fundado na fé de Esmir — um mortal que séculos atrás se sacrificou para selar um grande mal e ascendeu à divindade. Era um lugar de honra, tradição e fé genuína. Seu rei, Vaglies Lihleran I, era um paladino e um dos homens mais respeitados de Valiran.',
        'Mas Lancaster havia sido tocada por Xathyr, uma criatura abissal do submundo chamada de Falso-Deus. Xathyr não controla mentes com força — ele faz suas vítimas acreditarem que suas próprias ações são corretas. Durante anos, sua influência pairou sobre Lancaster sem que ninguém percebesse.',
        'O golpe final veio de dentro. Noel Braent invadiu a Tumba dos Hereges — construída para selar uma fenda. Quebrou o selo. A corrupção se libertou. Com um exército de sombras, marchou sobre a cidade. Vaglies se sacrificou para conter o avanço — e Lancaster caiu.',
        'O Reino de Oshain, governado pela Rainha Annabella Whiteflame — uma mulher de mais de cem anos que não envelhece há décadas — não hesitou. Ocupou Lancaster e a transformou em uma sátrapia sob seu controle.',
        'A corrupção não foi contida. Continuou se espalhando em direção ao reino vizinho de Wolfspine.',
      ]},
      { title: 'O Chamado de Sebastian', paras: [
        'Wolfspine é um reino independente ao sul de Nova Lancaster, governado pelo Grão-Duque Sebastian Rosewood. Sebastian vê múltiplos problemas se acumulando: a corrupção da floresta se expande, as criaturas do Pantano de Fallburgo agem de forma coordenada, e Oshain observa tudo com o sorriso de quem espera o momento certo.',
        'Sebastian não tem exércitos suficientes para enfrentar tudo ao mesmo tempo. O que tem é julgamento — e o julgamento o leva a buscar heróis.',
        'Três pessoas atenderam ao seu chamado.',
      ]},
      { title: 'Os Três do Começo', paras: [
        'Harabella Thundervoice era líder dos Shifters. Ao nascer, recebeu uma bênção de Melora, deusa da natureza. Havia liderado seu povo para fora da Floresta das Rosas corrompida. Chegou a Wolfspine para pedir ajuda. Ficou para dá-la.',
        'Wander Bristoll havia sido um prodígio militar de Lancaster — fundou a companhia mercenária Sília Arms, lutou, sobreviveu, e se retirou por dezessete anos após a morte de sua esposa Sília. Quando encontrou Harabella, algo nele acordou. Voltou à ativa com uma promessa silenciosa: uma última jornada antes de reencontrá-la.',
        'Revna vem de uma tribo do norte, marcada desde o nascimento para ser a Oráculo dos Corvos — serva da Senhora da Rapina, deusa da morte. O que a trouxe a Wolfspine foi perturbador: ela percebeu que algo interferia no ciclo da morte. Almas que deveriam descansar não descansavam. E Revna foi descobrir por quê.',
        'Os três se encontraram nas muralhas da City of Wolfspine. Ganharam como guia Rian Bheini e partiram para Fallburgo. Rian não sobreviveu ao segundo dia.',
      ]},
      { title: 'O Pantano e o Primeiro Luto', paras: [
        'A chegada ao Pantano de Fallburgo confirmou o pior. As criaturas do pantano eram controladas por uma força externa. Um deles se autodestruiu, deixando palavras gravadas na memória de Revna: "Os segredos não são seus para descobrir."',
        'O combate foi além do que o grupo conseguia enfrentar. Harabella e Wander morreram. Seus corpos foram carregados pelas criaturas.',
        'Revna escapou sozinha. Voltou a Wolfspine com ferimentos e más notícias.',
      ]},
      { title: 'Diego e Ragae', paras: [
        'Com dois heróis mortos, Sebastian recrutou dois novos.',
        'Diego Vans Loupd\'or é um paladino de Lamidriel, o Titã da Bondade. Diego é o tipo de pessoa em quem se confia não porque nunca erra, mas porque quando a decisão importa de verdade, ele aparece.',
        'Ragae Eger nasceu de um ovo de dragão de prata e foi criado por um dragão de cobre. Tornou-se Patrulheiro. A destruição da Floresta das Rosas havia sido, nas suas próprias palavras, "um tiro no peito".',
        'Com Revna recuperada e dois novos aliados, o grupo encontrou Feronar: o Guardião da Floresta das Rosas, um lobo espiritual. Ele os alertou: a corrupção avançava. O tempo era curto.',
      ]},
      { title: 'Silverhain e as Respostas Difíceis', paras: [
        'O grupo partiu para Silverhain, capital da República Prateada de Bahamut. Levavam consigo Krista, da família Balore de Lupinwood, e seu guarda pessoal Grin.',
        'Em Silverhain, Dykorkis — dragão adulto de prata, filho do fundador da República — deu nome ao problema: rasgo planar para o Plano de Energia Negativa. A corrupção era reversível, mas fechá-la exigiria poder divino considerável.',
        'O ritual para curar o ferimento de Grin terminou em catástrofe. Grin era um lobisomem. Em fúria incontrolável, matou quatro templários. Foi preso. Revna prometeu a Krista que voltariam.',
      ]},
      { title: 'A Batalha de Feronar e o Fim de Ragae', paras: [
        'No regresso, cultistas de Fyria — a Titã da Maldade — usavam almas de criaturas mortas para expandir a corrupção. E trouxeram uma Crucidaemon: criatura que consome almas, quebrando o ciclo natural da morte.',
        'O grupo lutou ao lado de Feronar. E perdeu. Ragae morreu — a Crucidaemon consumiu sua alma. Uma alma consumida não descansa. Simplesmente se apaga.',
        'Feronar se sacrificou para teleportar os sobreviventes. Usou suas últimas forças para conter a Crucidaemon. Depois disso, não havia mais Guardião da Floresta das Rosas.',
        'A Crucidaemon sobreviveu e desenvolveu uma ligação mágica de caça com Revna. Desde então, ela sente que está sendo seguida. Porque está.',
        'O funeral de Ragae foi realizado em Wolfspine. Três presenças dracônicas divinas — Bahamut, Tiamat e Naomi — se fizeram presentes. Dykorkis anunciou o nascimento da Cruzada Prateada.',
      ]},
      { title: 'Lawrence, Isla e John', paras: [
        'Três figuras chegaram ao acampamento de fronteira.',
        'Lawrence Cainhurst nasceu com uma afinidade com energia negativa — o que deveria curar, o fere. Quando criança, um capelão tentou "corrigir" isso com um ritual que quase o matou. Foi Jorah Londor, cavaleiro de Lamidriel, quem interrompeu o ritual. Lawrence sobreviveu à queda de Lancaster graças a essa afinidade.',
        'Isla havia recebido visões da Senhora da Rapina: uma escolhida estava em perigo. A escolhida era Revna.',
        'John chegou com Lawrence — Lancaster, a queda, a sobrevivência.',
      ]},
      { title: 'O Preço de Revna', paras: [
        'Revna precisava de respostas que nenhuma fonte divina daria. Os Velstrac — criaturas de Fyria que corrompem mortais através de dor e contratos — tinham informações. E um preço.',
        'Revna pagou. Perdeu o olho esquerdo. Ganhou uma marca permanente dos Velstrac — dor constante, e a certeza de que eles sempre saberão onde ela está.',
        'Em troca: a fonte da corrupção era Ayael, um arcanjo caído aprisionado no Plano de Energia Negativa, filho de Lamidriel. Ele sofre eternamente. E é esse sofrimento, vazando pela fenda, que alimenta tudo.',
        'Dyko desaprovou. A resolução foi pragmática: Revna ficaria sob custódia de Galazeth e Lawrence.',
      ]},
      { title: 'A Torre de Fallburgo', paras: [
        'As criaturas do pantano agiam com coordenação impossível. O grupo investigou e encontrou uma torre no meio das águas com um cristal Ahl\'kir gigante carregado de energia nécrotica.',
        'A torre revelou: a Blackflame — organização secreta sob ordens diretas da Rainha Annabella. A prova mais brutal: os corpos de Harabella e Wander, levantados como mortos-vivos. Usados contra o mesmo grupo que os havia perdido.',
        'Cevras surgiu — um dragão negro do tamanho de Dykorkis. Revna curou Dyko pela janela. Cevras recuou, mas jurou vingança.',
        'Isla foi morta pela Princesa Pálida da Torre. As Princesas Pálidas são mulheres transformadas pela própria Rainha — guarda de elite que serve diretamente à coroa.',
        'O grupo encontrou um livro codificado da Blackflame: Projeto Oceano — arma de destruição em massa. Projeto Fantasma — objetivo real desconhecido. A Rainha não estava apenas se aproveitando do caos. Ela estava construindo algo com ele.',
      ]},
      { title: 'A Queda de Lindhaven', paras: [
        'Lindhaven, a leste de Wolfspine, foi o próximo alvo. Mortos-vivos cercaram a cidade. Dykorkis partiu imediatamente. Diego e Lawrence foram com ele.',
        'Lady Joice Rosewood estava infectada pela Princesa Pálida. John a escoltou para Wolfspine, onde Revna conseguiu curá-la.',
        'Diego foi emboscado por agentes da Blackflame. Derrotou quatro, mas outros quatro fugiram. Nas catacumbas, encontraram a Princesa Pálida de Lindhaven. Ela invocou uma Shadow. Lawrence foi gravemente ferido — o contato deixou uma mácula de Ayael que sacerdotes não conseguiram remover.',
        'Diego deu o golpe final na Shadow. A Princesa olhou para ele: "Renda-se. E todos os outros sobrevivem."',
        'Diego olhou para Lawrence. Dois paladinos de Lamidriel — a mesma fé, o mesmo Titã. Trocaram um aperto de mão. Trocaram as espadas. Lawrence ficou com a espada de Diego.',
        'Diego foi levado.',
      ]},
      { title: 'O que Ficou de Pé', paras: [
        'Wolfspine se rendeu a Oshain. Sebastian foi realocado para Redhall — na prática, um refém. Lady Joice governa sob jugo.',
        'Lawrence fundou a Brotherhood of Hope — refúgio para os sem-lar, patrulheiros dispersos, templários sobreviventes. Na noite da fundação, clamou por Lamidriel com tudo que tinha. Foi atendido. Lawrence ascendeu a Paladino.',
        'Mas a dúvida não o largou: "É mesmo Lamidriel quem me concede esse poder?" A mácula ainda está dentro dele.',
        'Revna planeja negociar com o Império de Ferro em troca do resgate de Diego.',
        'Lawrence e John partiram para Nova Lancaster, em busca de um guia para o Grande Escuro — onde a Cruzada do Sol está há doze anos sem comunicação.',
      ]},
      { title: 'O que Você Precisa Saber', paras: [
        'A fenda de Ayael ainda está aberta. A corrupção ainda vaza.',
        'A Blackflame opera sob ordens diretas da Rainha Annabella. O que a Rainha realmente quer é o grimório de Aulus Visptas — um livro que pode mudar o equilíbrio de poder do mundo. Onde Aulus está, ninguém sabe.',
        'Diego está preso. Lawrence carrega sua espada.',
        'A Crucidaemon caça Revna. Cevras jurou vingança contra o grupo.',
        'O mundo não está bem. Mas o grupo ainda está de pé. E às vezes, por ora, isso precisa ser suficiente.',
      ]},
    ],
    infobox: {
      rows: [
        { k: 'Período',          v: '3ª Era, Anos 1278–1281' },
        { k: 'Status',           v: 'Em andamento',                      ok: true },
        { k: 'Teatro',           v: 'Wolfspine · Lancaster · Silverhain' },
        { k: 'Antagonista',      v: 'Rainha Annabella Whiteflame',       danger: true },
        { k: 'Ameaça central',   v: 'Corrupção de Ayael',                danger: true },
        { k: 'Facção aliada',    v: 'Cruzada Prateada' },
        { k: 'Facção adversária',v: 'Blackflame · Oshain',               danger: true },
        { k: 'Heróis caídos',    v: 'Harabella · Wander · Ragae · Isla' },
        { k: 'Capturado',        v: 'Diego Vans Loupd\'or',              danger: true },
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
  },

  // ── Adicione novas campanhas aqui ──────────────────────────────────────────
  // 'campanha1': { id: 'campanha1', title: 'Campanha I', subtitle: '...', sections: [], infobox: { rows: [], status: '' }, related: [] },
  // 'campanha2': { id: 'campanha2', title: 'Campanha II', ... },
  // 'rogue1':    { id: 'rogue1',    title: 'Rogue I', ... },

};

// ── Edit Modal ───────────────────────────────────────────────────────────────
function CampaignEditModal({ data, onClose, onSave }) {
  const [form, setForm] = useCampState(() => ({
    title:      data.title,
    subtitle:   data.subtitle || '',
    sections:   (data.sections || []).map(s => ({ title: s.title || '', text: (s.paras || []).join('\n\n') })),
    infoRows:   (data.infobox?.rows || []).map(r => ({ ...r })),
    infoStatus: data.infobox?.status || '',
  }));
  const [busy, setBusy] = useCampState(false);

  function setField(k, v) { setForm(f => ({ ...f, [k]: v })); }

  function setSection(i, k, v) {
    setForm(f => { const s = [...f.sections]; s[i] = { ...s[i], [k]: v }; return { ...f, sections: s }; });
  }
  function addSection()      { setForm(f => ({ ...f, sections: [...f.sections, { title: '', text: '' }] })); }
  function removeSection(i)  { setForm(f => ({ ...f, sections: f.sections.filter((_, x) => x !== i) })); }

  function setRow(i, k, v) {
    setForm(f => { const r = [...f.infoRows]; r[i] = { ...r[i], [k]: v }; return { ...f, infoRows: r }; });
  }
  function addRow()     { setForm(f => ({ ...f, infoRows: [...f.infoRows, { k: '', v: '' }] })); }
  function removeRow(i) { setForm(f => ({ ...f, infoRows: f.infoRows.filter((_, x) => x !== i) })); }
  function cycleFlag(i) {
    setForm(f => {
      const r = [...f.infoRows];
      const cur = r[i];
      r[i] = cur.danger ? { ...cur, danger: false, ok: true } : cur.ok ? { ...cur, ok: false } : { ...cur, danger: true };
      return { ...f, infoRows: r };
    });
  }

  async function handleSave(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await onSave({
        ...data,
        title:    form.title,
        subtitle: form.subtitle,
        sections: form.sections.map(s => ({
          title: s.title,
          paras: s.text.split(/\n\n+/).map(p => p.trim()).filter(Boolean),
        })),
        infobox: {
          rows:   form.infoRows.filter(r => r.k || r.v),
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
          <h2 className="modal-title">Editar {data.title}</h2>
        </div>
        <form onSubmit={handleSave}>
          <div className="modal-body">
            <label className="modal-label">Título</label>
            <input className="modal-input" value={form.title} onChange={e => setField('title', e.target.value)} required />

            <label className="modal-label" style={{ marginTop: 12 }}>Subtítulo</label>
            <input className="modal-input" value={form.subtitle} onChange={e => setField('subtitle', e.target.value)} />

            {/* Infobox */}
            <div style={{ marginTop: 20, borderTop: '1px solid var(--ink-line-soft)', paddingTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <label className="modal-label" style={{ margin: 0 }}>Infobox — Linhas</label>
                <button type="button" className="btn-save" style={{ padding: '4px 12px', fontSize: 12 }} onClick={addRow}>+ Linha</button>
              </div>
              {form.infoRows.map((r, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto auto', gap: 6, marginBottom: 6, alignItems: 'center' }}>
                  <input className="modal-input" style={{ margin: 0 }} value={r.k} onChange={e => setRow(i, 'k', e.target.value)} placeholder="Rótulo" />
                  <input className="modal-input" style={{ margin: 0 }} value={r.v} onChange={e => setRow(i, 'v', e.target.value)} placeholder="Valor" />
                  <button type="button" onClick={() => cycleFlag(i)} style={{ padding: '4px 8px', fontSize: 11, border: '1px solid var(--ink-line-soft)', borderRadius: 3, cursor: 'pointer', background: 'transparent', color: r.danger ? 'var(--wine-bright)' : r.ok ? '#6fa86f' : 'var(--foam-dim)' }}>
                    {r.danger ? '🔴' : r.ok ? '🟢' : '⚪'}
                  </button>
                  <button type="button" className="btn-delete" style={{ padding: '4px 8px', fontSize: 11, opacity: 1 }} onClick={() => removeRow(i)}>✕</button>
                </div>
              ))}
              <label className="modal-label" style={{ marginTop: 14 }}>Situação Atual</label>
              <textarea className="modal-textarea" rows={3} value={form.infoStatus} onChange={e => setField('infoStatus', e.target.value)} placeholder="Texto de status atual..." />
            </div>

            {/* Seções */}
            <div style={{ marginTop: 20, borderTop: '1px solid var(--ink-line-soft)', paddingTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <label className="modal-label" style={{ margin: 0 }}>Seções ({form.sections.length})</label>
                <button type="button" className="btn-save" style={{ padding: '4px 12px', fontSize: 12 }} onClick={addSection}>+ Seção</button>
              </div>
              {form.sections.map((sec, i) => (
                <div key={i} style={{ marginBottom: 16, padding: 12, border: '1px solid var(--ink-line-soft)', borderRadius: 4 }}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: 'var(--foam-dim)', fontFamily: 'monospace', minWidth: 24 }}>#{i + 1}</span>
                    <input className="modal-input" style={{ flex: 1, margin: 0 }} value={sec.title} onChange={e => setSection(i, 'title', e.target.value)} placeholder="Título da seção" />
                    <button type="button" className="btn-delete" style={{ padding: '4px 10px', fontSize: 11, opacity: 1 }} onClick={() => removeSection(i)}>✕</button>
                  </div>
                  <textarea className="modal-textarea" rows={6} value={sec.text} onChange={e => setSection(i, 'text', e.target.value)} placeholder="Parágrafos... (separe com linha em branco)" />
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

// ── Main Component ────────────────────────────────────────────────────────────
function CampaignArticle({ id, onNav }) {
  const { isEditor } = useAuth();
  const [modal, setModal]     = useCampState(false);
  const [, forceUpdate]       = useCampState(0);

  useCampEffect(() => {
    const handler = () => forceUpdate(n => n + 1);
    window.addEventListener('db-refresh', handler);
    return () => window.removeEventListener('db-refresh', handler);
  }, []);

  const defaults = CAMPAIGN_DEFAULTS[id];
  const raw  = Entities.characters?.[id];
  const camp = raw
    ? { id: raw.id, title: raw.name, subtitle: raw.role, sections: raw.sections || [], infobox: raw.infobox || { rows: [], status: '' }, related: raw.related || [] }
    : defaults;

  if (!camp) return <div style={{ padding: 40, color: 'var(--foam-dim)' }}>Campanha não encontrada.</div>;

  async function handleSave(data) {
    await window.DB.saveCampaignArticle(data);
  }

  return (
    <div className="article" data-screen-label={camp.title}>
      <div className="parchment article-body-wrap" style={{ minWidth: 0 }}>
        <div className="article-body">
          <nav className="breadcrumb">
            <a onClick={() => onNav('home')}>Arquivo</a>
            <span className="sep">▸</span>
            <a onClick={() => onNav('timeline')}>Crônicas</a>
            <span className="sep">▸</span>
            <span>{camp.title}</span>
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
            {(camp.sections || []).map((sec, i) => (
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
          <ol>{(camp.sections || []).map(s => <li key={s.title}>{s.title}</li>)}</ol>
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

      {modal && <CampaignEditModal data={camp} onClose={() => setModal(false)} onSave={handleSave} />}
    </div>
  );
}

window.CampaignArticle = CampaignArticle;
