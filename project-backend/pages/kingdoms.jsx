// Kingdoms — DB-driven encyclopedia cards

const SIGIL_OPTIONS = ['Crown', 'Dragon', 'Tome', 'Chain', 'Sword', 'Skull', 'Moon', 'Eye', 'Flame', 'Wave', 'Tree', 'Dawn'];

// ============================================================
// Kingdom modal (create / edit)
// ============================================================
function KingdomModal({ kingdom, onClose }) {
  const isEdit = !!kingdom;

  const [form, setForm] = React.useState({
    _id:        kingdom?._id        ?? '',
    name:       kingdom?.name       ?? '',
    eyebrow:    kingdom?.eyebrow    ?? '',
    sigil:      kingdom?.sigil      ?? '',
    motto:      kingdom?.motto      ?? '',
    desc:       kingdom?.desc       ?? '',
    target:     kingdom?.target     ?? '',
    sort_order: kingdom?.sort_order ?? 0,
  });
  const [stats, setStats] = React.useState(
    (kingdom?.stats || []).map(s => ({ ...s }))
  );
  const [busy, setBusy]           = React.useState(false);
  const [err, setErr]             = React.useState('');
  const [confirmDel, setConfirmDel] = React.useState(false);

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  function addStat() { setStats(s => [...s, { k: '', v: '', danger: false }]); }
  function removeStat(i) { setStats(s => s.filter((_, j) => j !== i)); }
  function updateStat(i, key, val) {
    setStats(s => s.map((row, j) => j === i ? { ...row, [key]: val } : row));
  }

  async function handleSave(e) {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      const payload = {
        ...form,
        sort_order: Number(form.sort_order) || 0,
        stats: stats.filter(s => s.k || s.v).map(s => {
          const out = { k: s.k, v: s.v };
          if (s.danger) out.danger = true;
          return out;
        }),
      };
      if (!payload._id) delete payload._id;
      await window.DB.saveKingdom(payload);
      onClose();
    } catch (e) {
      setErr(e.message || 'Erro ao salvar');
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!confirmDel) {
      setConfirmDel(true);
      setTimeout(() => setConfirmDel(false), 3000);
      return;
    }
    setBusy(true);
    try {
      await window.DB.deleteKingdom(kingdom._id);
      onClose();
    } catch (e) {
      setErr(e.message || 'Erro ao apagar');
      setBusy(false);
    }
  }

  const btnRemove = {
    background: 'transparent', border: '1px solid var(--wine)',
    color: 'var(--wine-bright)', borderRadius: 2, padding: '5px 9px',
    cursor: 'pointer', fontSize: 11, fontFamily: 'JetBrains Mono, monospace',
    letterSpacing: '0.1em', flexShrink: 0,
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: 620 }} onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-eyebrow">Geopolítica · Vol. V</div>
          <h2 className="modal-title">{isEdit ? 'Editar Reino' : 'Novo Reino'}</h2>
        </div>
        <form onSubmit={handleSave}>
          <div className="modal-body">

            <div className="modal-field">
              <label className="modal-label">Nome</label>
              <input
                className="modal-input" value={form.name} required autoFocus
                placeholder="Reino de Oshain"
                onChange={e => set('name', e.target.value)}
              />
            </div>

            <div className="modal-field">
              <label className="modal-label">Eyebrow</label>
              <input
                className="modal-input" value={form.eyebrow}
                placeholder="Ex: Monarquia · expansionista"
                onChange={e => set('eyebrow', e.target.value)}
              />
            </div>

            <div className="modal-field-row">
              <div className="modal-field">
                <label className="modal-label">Sigilo</label>
                <select className="modal-select" value={form.sigil} onChange={e => set('sigil', e.target.value)}>
                  <option value="">— nenhum —</option>
                  {SIGIL_OPTIONS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="modal-field">
                <label className="modal-label">Ordem</label>
                <input
                  className="modal-input" type="number" value={form.sort_order}
                  placeholder="0"
                  onChange={e => set('sort_order', e.target.value)}
                />
              </div>
            </div>

            <div className="modal-field">
              <label className="modal-label">Lema</label>
              <input
                className="modal-input" value={form.motto}
                placeholder='"Sob a chama, todo o mundo é casa."'
                onChange={e => set('motto', e.target.value)}
              />
            </div>

            <div className="modal-field">
              <label className="modal-label">Descrição</label>
              <textarea
                className="modal-textarea" rows={4} value={form.desc}
                placeholder="Descrição do reino..."
                onChange={e => set('desc', e.target.value)}
              />
            </div>

            <div className="modal-field">
              <label className="modal-label">Link para artigo</label>
              <input
                className="modal-input" value={form.target}
                placeholder="Ex: deity:oshain · character:annabella · kingdoms"
                onChange={e => set('target', e.target.value)}
              />
              <span className="modal-hint">Rota de navegação ao clicar no card. Use deity:id, character:id, session:num…</span>
            </div>

            <div style={{ borderTop: '1px solid var(--ink-line)', paddingTop: 16, marginTop: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span className="modal-label">Estatísticas</span>
                <button type="button" className="editor-add-btn" style={{ padding: '5px 14px', fontSize: 10 }} onClick={addStat}>
                  + Adicionar linha
                </button>
              </div>
              {stats.map((row, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto auto', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                  <input
                    className="modal-input" value={row.k}
                    placeholder="Chave"
                    onChange={e => updateStat(i, 'k', e.target.value)}
                  />
                  <input
                    className="modal-input" value={row.v}
                    placeholder="Valor"
                    onChange={e => updateStat(i, 'v', e.target.value)}
                  />
                  <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--foam-dim)', whiteSpace: 'nowrap', cursor: 'pointer' }}>
                    <input type="checkbox" checked={!!row.danger} onChange={e => updateStat(i, 'danger', e.target.checked)} />
                    Perigo
                  </label>
                  <button type="button" style={btnRemove} onClick={() => removeStat(i)}>✕</button>
                </div>
              ))}
            </div>

            {err && <div className="modal-error">{err}</div>}
          </div>

          <div className="modal-foot">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-save" disabled={busy}>{busy ? 'Salvando…' : 'Salvar'}</button>
            {isEdit && (
              <button type="button" className={`btn-delete${confirmDel ? ' confirm' : ''}`} disabled={busy} onClick={handleDelete}>
                {confirmDel ? 'Confirmar exclusão' : 'Apagar'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================
// Kingdoms page
// ============================================================
function Kingdoms({ onNav }) {
  const { isEditor } = useAuth();
  const [modal, setModal] = React.useState(null); // null | 'new' | kingdom object
  const [, setTick] = React.useState(0);

  React.useEffect(() => {
    const refresh = () => setTick(t => t + 1);
    window.addEventListener('db-refresh', refresh);
    return () => window.removeEventListener('db-refresh', refresh);
  }, []);

  const list = (Data.kingdoms || []).slice().sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="page" data-screen-label="09 Reinos & Potências">
      <header className="page-header">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <div className="page-eyebrow">Geopolítica · Volume V · Fólio 01</div>
            <h1 className="page-title">Reinos & Potências</h1>
            <p className="page-lede">
              As potências que dividem o continente de Valiran — seus brasões,
              seus números e o que se sabe de suas verdadeiras intenções.
            </p>
          </div>
          {isEditor && (
            <button className="editor-add-btn" style={{ flexShrink: 0, marginTop: 4 }} onClick={() => setModal('new')}>
              + Novo Reino
            </button>
          )}
        </div>
      </header>

      {list.length === 0 && (
        <p style={{ fontFamily: 'EB Garamond, serif', fontStyle: 'italic', color: 'var(--foam-dim)', textAlign: 'center', marginTop: 60 }}>
          Nenhum reino registrado ainda.
        </p>
      )}

      <div className="kingdom-list">
        {list.map(k => {
          const Icon = Sigil[k.sigil];
          return (
            <article
              key={k._id}
              className="kingdom-card"
              style={{ position: 'relative', cursor: k.target ? 'pointer' : 'default' }}
              onClick={() => k.target && onNav(k.target)}
            >
              {isEditor && (
                <button
                  className="btn-cancel"
                  style={{ position: 'absolute', top: 10, right: 10, padding: '3px 10px', fontSize: 10, zIndex: 2 }}
                  onClick={e => { e.stopPropagation(); setModal(k); }}
                >
                  Editar
                </button>
              )}
              <div className="kingdom-crest">
                {Icon && <Icon />}
              </div>
              <div className="kingdom-body">
                <div className="kingdom-eyebrow">{k.eyebrow}</div>
                <h3 className="kingdom-name">{k.name}</h3>
                {k.motto && <p className="kingdom-motto">{k.motto}</p>}
                {k.desc  && <p className="kingdom-desc">{k.desc}</p>}
              </div>
              {k.stats && k.stats.length > 0 && (
                <div className="kingdom-stats">
                  {k.stats.map((s, i) => (
                    <div key={i} className="kingdom-stat">
                      <span className="kingdom-stat-k">{s.k}</span>
                      <span className={`kingdom-stat-v${s.danger ? ' danger' : ''}`}>{s.v}</span>
                    </div>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>

      {modal && (
        <KingdomModal
          kingdom={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

window.Kingdoms = Kingdoms;
