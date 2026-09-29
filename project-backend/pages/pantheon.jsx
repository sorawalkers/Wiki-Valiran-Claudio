// Pantheon page — tiers de divindades em vitral (DB-driven)

function vtRomanNum(n) { return ['','I','II','III','IV','V','VI','VII','VIII','IX','X'][n] || String(n); }

const SIGIL_OPTIONS = ['Dragon','Dawn','Chain','Sun','Moon','Skull','Eye','Flame','Wave','Tree','Crown','Sword'];

// ============================================================
// Deity modal (create only — edit is via ArticleEditor)
// ============================================================
function DeityModal({ onClose }) {
  const [form, setForm] = React.useState({ id:'', name:'', epithet:'', sigil:'', placeholder:true });
  const [busy, setBusy] = React.useState(false);
  const [err,  setErr]  = React.useState('');

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  function slugify(name) {
    return name.toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  async function handleSave(e) {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      const id = form.id || slugify(form.name);
      await window.DB.saveDeity({
        id,
        name:        form.name,
        epithet:     form.epithet || null,
        sigil:       form.sigil   || null,
        placeholder: form.placeholder,
        infobox:     { rows: [] },
        hero:        null,
        sections:    [],
        related:     [],
      });
      onClose();
    } catch(e) {
      setErr(e.message || 'Erro ao salvar');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-eyebrow">Cosmologia · Panteão de Valiran</div>
          <h2 className="modal-title">Nova Divindade</h2>
        </div>
        <form onSubmit={handleSave}>
          <div className="modal-body">
            <div className="modal-field">
              <label className="modal-label">Nome</label>
              <input className="modal-input" value={form.name} required autoFocus
                placeholder="Nome da divindade"
                onChange={e => { set('name', e.target.value); if (!form.id) set('id', slugify(e.target.value)); }} />
            </div>
            <div className="modal-field-row">
              <div className="modal-field">
                <label className="modal-label">ID (slug)</label>
                <input className="modal-input" value={form.id}
                  placeholder="gerado automaticamente"
                  onChange={e => set('id', e.target.value)} />
                <span className="modal-hint">Deixe em branco para gerar do nome.</span>
              </div>
              <div className="modal-field">
                <label className="modal-label">Sigilo</label>
                <select className="modal-select" value={form.sigil} onChange={e => set('sigil', e.target.value)}>
                  <option value="">— nenhum —</option>
                  {SIGIL_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="modal-field">
              <label className="modal-label">Epíteto</label>
              <input className="modal-input" value={form.epithet}
                placeholder="Ex: A Alvorada Sacrificial · O Mortal que Virou Manhã"
                onChange={e => set('epithet', e.target.value)} />
            </div>
            <div className="modal-field">
              <label className="modal-label" style={{ display:'flex', alignItems:'center', gap:10 }}>
                <input type="checkbox" checked={form.placeholder}
                  onChange={e => set('placeholder', e.target.checked)}
                  style={{ width:14, height:14 }} />
                Entrada em compilação (sem artigo completo)
              </label>
            </div>
            {err && <div className="modal-error">{err}</div>}
          </div>
          <div className="modal-foot">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-save" disabled={busy}>
              {busy ? 'Salvando…' : 'Salvar Divindade'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================
// Pantheon page
// ============================================================
function Pantheon({ onNav }) {
  const { isEditor } = useAuth();
  const [modal, setModal] = React.useState(false);

  const allDeities = Object.values(Entities.deities).filter(d => d && d.name);

  function getRow(d, key) {
    const row = (d.infobox?.rows || []).find(r => r.k === key);
    return row ? row.v : '';
  }

  const titas = allDeities.filter(d => getRow(d,'Tipo').startsWith('Titã'));
  const ascendidos = allDeities.filter(d => {
    const t = getRow(d,'Tipo');
    return t.includes('Ascendido') || t.includes('Ascendida') || t.includes('Anjo') || t.includes('Pseudo');
  });
  const estabelecidos = allDeities.filter(d => {
    const t = getRow(d,'Tipo');
    return !t.startsWith('Titã') && !t.includes('Ascendido') && !t.includes('Ascendida') && !t.includes('Anjo') && !t.includes('Pseudo');
  });

  const tiers = [
    { tone: 'tita',      tier: 'Os Titãs',              tierDesc: 'As divindades primordiais que ergueram o mundo do nada. Hoje, distantes ou inalcançáveis.',   gods: titas },
    { tone: 'deus',      tier: 'Deuses do Panteão',      tierDesc: 'As divindades estabelecidas, veneradas em templos por todo o continente.',                    gods: estabelecidos },
    { tone: 'ascendido', tier: 'Ascendidos & Especiais', tierDesc: 'Mortais elevados, anjos caídos e entidades que não se enquadram na hierarquia convencional.', gods: ascendidos },
  ].filter(t => t.gods.length > 0);

  const total = tiers.length;

  return (
    <div className="vt vt-pantheon" data-screen-label="02 Panteão">
      <section className="vt-pantheon-head">
        <img className="vt-hero-rose" src="assets/vitral/rosacea.svg?v=3" alt="" aria-hidden="true" draggable="false" />
        <div className="vt-pantheon-head-text">
          <div className="vt-label">Cosmologia · Volume II · Os Deuses</div>
          <h1 className="vt-h1">O Panteão de Valiran</h1>
          <div className="vt-epithet">Os nomes que recebem oração</div>
          <p className="vt-pantheon-lede">
            Em Valiran, os deuses não são metáforas. Caminham, sangram, e às vezes
            são presos. Aqui se catalogam os Titãs que ergueram o mundo, os Deuses do
            panteão estabelecido, e os Ascendidos: mortais que provaram-se grandes
            demais para a morte.
          </p>
        </div>
        {isEditor && (
          <button className="vt-btn vt-btn--gold vt-pantheon-add" onClick={() => setModal(true)}>+ Nova divindade</button>
        )}
      </section>

      {allDeities.length === 0 && (
        <p className="vt-pantheon-empty">Nenhuma divindade registrada ainda.</p>
      )}

      {tiers.map((tier, ti) => (
        <section key={tier.tier} className={'vt-tier vt-tier--' + tier.tone}>
          <header className="vt-tier-head">
            <span className="vt-tier-num">{vtRomanNum(ti + 1)} <small>/ {vtRomanNum(total)}</small></span>
            <div>
              <h2 className="vt-tier-name">{tier.tier}</h2>
              <p className="vt-tier-desc">{tier.tierDesc}</p>
            </div>
            <span className="vt-tier-count">{tier.gods.length} {tier.gods.length === 1 ? 'nome' : 'nomes'}</span>
          </header>
          <div className="vt-gallery vt-deity-gallery">
            {tier.gods.map(g => (
              <VitralDeityCard key={g.id} deity={g} tone={tier.tone} onClick={() => onNav('deity:' + g.id)} />
            ))}
          </div>
        </section>
      ))}

      <footer className="vt-pantheon-foot">
        “Conta-se que existem outros. Aqueles cujos nomes foram apagados
        pelos próprios crentes — para que nenhum culto pudesse jamais ressurgir.”
        <div className="vt-quote-src">— Arquivista Cael, nota de rodapé desconhecida</div>
      </footer>

      {modal && <DeityModal onClose={() => setModal(false)} />}
    </div>
  );
}

window.Pantheon = Pantheon;

// ============================================================
// Página de teste (#/pantheon-teste): espelho circular × oval
// ============================================================
function PantheonLab({ onNav }) {
  const all = Object.values(Entities.deities).filter(d => d && d.name);
  // arte de cada uma (reativo: o estado das imagens chega depois do primeiro render)
  const artUrl = {};
  all.forEach(d => { artUrl[d.id] = useVtSlotUrl('deity-hero-' + d.id); });
  const hasArt = d => !!artUrl[d.id];
  const withArt = all.filter(hasArt), noArt = all.filter(d => !hasArt(d));
  // as mesmas duas divindades nos dois formatos: uma com arte e uma só com o símbolo (quando houver)
  const pair = [withArt[0], noArt[0]].filter(Boolean);
  for (const d of all) { if (pair.length >= 2) break; if (!pair.includes(d)) pair.push(d); }
  const big = pair;

  const Card = ({ d, shape }) => (
    <div className="vt-lab-col">
      <span className="vt-lab-tag">{shape === 'circular' ? 'Circular' : 'Oval'}</span>
      <VitralDeityCard deity={d} shape={shape} onClick={() => onNav('deity:' + d.id)} />
    </div>
  );
  const Big = ({ d, shape }) => (
    <div className="vt-lab-col">
      <span className="vt-lab-tag">{shape === 'circular' ? 'Circular' : 'Oval'} · {d.name}</span>
      <div className="vt-portrait-shadow">
        <VtDeityFrame tier={vtDeityTier(d)} shape={shape} className="vt-portrait vt-portrait--rose" sizes="460px">
          {hasArt(d)
            ? <VtFramedImage url={artUrl[d.id]} framing={vtFraming(d)} />
            : <VtSigilAltar deity={d} tier={vtDeityTier(d)} />}
        </VtDeityFrame>
      </div>
    </div>
  );

  return (
    <div className="vt vt-pantheon">
      <section className="vt-tier vt-tier--deus">
        <header className="vt-tier-head">
          <span className="vt-tier-num">I <small>/ II</small></span>
          <div>
            <h2 className="vt-tier-name">Teste · Galeria</h2>
            <p className="vt-tier-desc">As mesmas duas divindades no espelho circular e no oval, com placa e domínio.</p>
          </div>
        </header>
        <div className="vt-lab-row">
          {pair.map(d => <Card key={'c' + d.id} d={d} shape="circular" />)}
          {pair.map(d => <Card key={'o' + d.id} d={d} shape="oval" />)}
        </div>
      </section>
      <section className="vt-tier vt-tier--tita">
        <header className="vt-tier-head">
          <span className="vt-tier-num">II <small>/ II</small></span>
          <div>
            <h2 className="vt-tier-name">Teste · Tamanho do artigo</h2>
            <p className="vt-tier-desc">A mesma divindade nos dois espelhos, no tamanho do topo da página dela.</p>
          </div>
        </header>
        {big.map(d => (
          <div key={d.id} className="vt-lab-row">
            <Big d={d} shape="circular" />
            <Big d={d} shape="oval" />
          </div>
        ))}
      </section>
    </div>
  );
}
window.PantheonLab = PantheonLab;
