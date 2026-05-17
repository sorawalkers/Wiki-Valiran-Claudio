// Pantheon page — tiered grid of deities (DB-driven)

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
    { tier: 'Os Titãs',               tierDesc: 'As divindades primordiais que ergueram o mundo do nada. Hoje, distantes ou inalcançáveis.',          gods: titas },
    { tier: 'Deuses do Panteão',       tierDesc: 'As divindades estabelecidas, veneradas em templos por todo o continente.',                           gods: estabelecidos },
    { tier: 'Ascendidos & Especiais',  tierDesc: 'Mortais elevados, anjos caídos e entidades que não se enquadram na hierarquia convencional.',        gods: ascendidos },
  ].filter(t => t.gods.length > 0);

  const total = tiers.length;

  return (
    <div className="pantheon" data-screen-label="02 Panteão">
      <header className="page-header">
        <div style={{display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16}}>
          <div>
            <div className="page-eyebrow">Cosmologia · Volume II · Os Deuses</div>
            <h1 className="page-title">O Panteão de Valiran</h1>
            <p className="page-lede">
              Em Valiran, os deuses não são metáforas. Caminham, sangram, e às vezes
              são presos. Aqui se catalogam os nomes que recebem oração — os Titãs
              que ergueram o mundo, os Deuses do panteão estabelecido, e os Ascendidos:
              mortais que provaram-se grandes demais para a morte.
            </p>
          </div>
          {isEditor && (
            <button className="editor-add-btn" style={{flexShrink:0, marginTop:4}} onClick={() => setModal(true)}>
              + Nova Divindade
            </button>
          )}
        </div>
      </header>

      {allDeities.length === 0 && (
        <p style={{ fontFamily:'EB Garamond,serif', fontStyle:'italic', color:'var(--foam-dim)', textAlign:'center', marginTop:60 }}>
          Nenhuma divindade registrada ainda.
        </p>
      )}

      {tiers.map((tier, ti) => (
        <section key={tier.tier} className="pantheon-tier">
          <div className="tier-header">
            <span className="tier-num">{String(ti + 1).padStart(2,'0')} / {String(total).padStart(2,'0')}</span>
            <h2 className="tier-name">{tier.tier}</h2>
            <p className="tier-desc">{tier.tierDesc}</p>
          </div>

          <div className="deity-grid">
            {tier.gods.map(g => {
              const Icon = Sigil[g.sigil];
              return (
                <article key={g.id} className="deity" onClick={() => onNav('deity:' + g.id)}>
                  <div className="deity-sigil">
                    {Icon && <Icon style={{width:'100%', height:'100%'}} />}
                  </div>
                  <h3 className="deity-name">{g.name}</h3>
                  <p className="deity-epithet">{g.epithet}</p>
                  <div className="deity-meta">
                    <span>{getRow(g,'Domínio')}</span>
                    <span>{getRow(g,'Alinhamento')}</span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}

      <div style={{
        marginTop: 80, padding: '32px 0',
        borderTop: '1px solid var(--ink-line-soft)',
        textAlign: 'center', fontFamily: 'EB Garamond, serif',
        fontStyle: 'italic', color: 'var(--foam-dim)', fontSize: 15,
      }}>
        "Conta-se que existem outros. Aqueles cujos nomes foram apagados
        pelos próprios crentes — para que nenhum culto pudesse jamais ressurgir."
        <div style={{marginTop:8, fontSize:11, fontStyle:'normal', letterSpacing:'0.22em', fontFamily:'JetBrains Mono'}}>
          — ARQUIVISTA CAEL, NOTA DE RODAPÉ DESCONHECIDA
        </div>
      </div>

      {modal && <DeityModal onClose={() => setModal(false)} />}
    </div>
  );
}

window.Pantheon = Pantheon;
