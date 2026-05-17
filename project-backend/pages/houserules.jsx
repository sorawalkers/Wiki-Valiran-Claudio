// House rules — documentation (DB-driven)

function HouseRuleModal({ rule, onClose }) {
  const isEdit = !!rule;
  const [form, setForm] = React.useState({
    id:            rule?.id || '',
    title:         rule?.title || '',
    body:          (rule?.paragraphs || []).join('\n\n'),
    callout_label: rule?.callout_label || '',
    callout_text:  rule?.callout_text  || '',
    sort_order:    rule?.sort_order ?? 0,
  });
  const [busy, setBusy]           = React.useState(false);
  const [err,  setErr]            = React.useState('');
  const [confirmDel, setConfirmDel] = React.useState(false);

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
      const paragraphs = form.body.split(/\n\n+/).map(p => p.trim()).filter(Boolean);
      await window.DB.saveHouseRule({
        id:            form.id || slugify(form.title),
        title:         form.title,
        paragraphs,
        callout_label: form.callout_label || null,
        callout_text:  form.callout_text  || null,
        sort_order:    parseInt(form.sort_order) || 0,
      });
      onClose();
    } catch (ex) {
      setErr(ex.message || 'Erro ao salvar');
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!confirmDel) { setConfirmDel(true); return; }
    setBusy(true);
    try {
      await window.DB.deleteHouseRule(rule.id);
      onClose();
    } catch (ex) {
      setErr(ex.message || 'Erro ao excluir');
      setBusy(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-eyebrow">Mesa · Regras da Casa</div>
          <h2 className="modal-title">{isEdit ? 'Editar Regra' : 'Nova Regra'}</h2>
        </div>
        <form onSubmit={handleSave}>
          <div className="modal-body">
            <div className="modal-field-row">
              <div className="modal-field">
                <label className="modal-label">Título</label>
                <input className="modal-input" value={form.title} required autoFocus
                  placeholder="Nome da regra"
                  onChange={e => {
                    set('title', e.target.value);
                    if (!isEdit && !form.id) set('id', slugify(e.target.value));
                  }} />
              </div>
              <div className="modal-field" style={{ maxWidth: 100 }}>
                <label className="modal-label">Ordem</label>
                <input className="modal-input" type="number" value={form.sort_order}
                  onChange={e => set('sort_order', e.target.value)} />
              </div>
            </div>

            {!isEdit && (
              <div className="modal-field">
                <label className="modal-label">ID (slug)</label>
                <input className="modal-input" value={form.id}
                  placeholder="gerado automaticamente"
                  onChange={e => set('id', e.target.value)} />
                <span className="modal-hint">Deixe em branco para gerar do título.</span>
              </div>
            )}

            <div className="modal-field">
              <label className="modal-label">Corpo</label>
              <textarea className="modal-textarea" value={form.body} rows={8}
                placeholder={"Escreva os parágrafos aqui.\n\nSepare cada parágrafo com uma linha em branco."}
                onChange={e => set('body', e.target.value)} />
              <span className="modal-hint">Parágrafos separados por linha em branco.</span>
            </div>

            <div className="modal-field">
              <label className="modal-label">Nota de destaque — rótulo <span style={{ opacity:.5 }}>(opcional)</span></label>
              <input className="modal-input" value={form.callout_label}
                placeholder="Ex: Lembrete · Aviso ao Mestre"
                onChange={e => set('callout_label', e.target.value)} />
            </div>

            <div className="modal-field">
              <label className="modal-label">Nota de destaque — texto <span style={{ opacity:.5 }}>(opcional)</span></label>
              <textarea className="modal-textarea" value={form.callout_text} rows={3}
                placeholder="Texto da nota de destaque"
                onChange={e => set('callout_text', e.target.value)} />
            </div>

            {err && <div className="modal-error">{err}</div>}
          </div>

          <div className="modal-foot">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            {isEdit && (
              <button type="button"
                className={`btn-delete${confirmDel ? ' confirm' : ''}`}
                onClick={handleDelete} disabled={busy}>
                {confirmDel ? 'Confirmar exclusão' : 'Excluir'}
              </button>
            )}
            <button type="submit" className="btn-save" disabled={busy}>
              {busy ? 'Salvando…' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================
// House Rules page
// ============================================================
function HouseRules({ onNav }) {
  const { isEditor } = useAuth();
  const [modal, setModal] = React.useState(null); // null | 'new' | rule object
  const [, setTick] = React.useState(0);

  React.useEffect(() => {
    const refresh = () => setTick(t => t + 1);
    window.addEventListener('db-refresh', refresh);
    return () => window.removeEventListener('db-refresh', refresh);
  }, []);

  const rules = (Data.houserules || []).slice().sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="page" data-screen-label="14 Regras da Casa">
      <header className="page-header">
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16 }}>
          <div>
            <div className="page-eyebrow">Mesa · Vol. VIII · Anexo Técnico</div>
            <h1 className="page-title">Regras da Casa</h1>
            <p className="page-lede">
              O sistema base é o mesmo. Estas são as modulações que esta
              mesa adota — algumas reforçam interpretação, outras pesam a
              geografia mágica do continente, todas existem para servir à
              história, não ao contrário.
            </p>
          </div>
          {isEditor && (
            <button className="editor-add-btn" style={{ flexShrink:0, marginTop:4 }}
              onClick={() => setModal('new')}>
              + Nova Regra
            </button>
          )}
        </div>
      </header>

      {rules.length === 0 && (
        <p style={{ fontFamily:'EB Garamond,serif', fontStyle:'italic', color:'var(--foam-dim)', textAlign:'center', marginTop:60 }}>
          Nenhuma regra cadastrada ainda.
        </p>
      )}

      {rules.length > 0 && (
        <div className="docs">
          <aside className="docs-toc">
            <h4 className="docs-toc-title">Sumário</h4>
            <ol>
              {rules.map(r => (
                <li key={r.id}>{r.title}</li>
              ))}
            </ol>
          </aside>

          <div className="docs-content">
            {rules.map((r, i) => (
              <section key={r.id} className="docs-rule">
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                  <div className="docs-rule-num">
                    {String(i + 1).padStart(2, '0')} / {String(rules.length).padStart(2, '0')}
                  </div>
                  {isEditor && (
                    <button className="btn-cancel"
                      style={{ padding:'3px 12px', fontSize:10, letterSpacing:'0.14em' }}
                      onClick={() => setModal(r)}>
                      Editar
                    </button>
                  )}
                </div>
                <h2>{r.title}</h2>
                {r.paragraphs.map((p, pi) => <p key={pi}>{p}</p>)}
                {(r.callout_label || r.callout_text) && (
                  <div className="docs-callout">
                    {r.callout_label && <strong>{r.callout_label}</strong>}
                    {r.callout_text}
                  </div>
                )}
              </section>
            ))}
          </div>
        </div>
      )}

      {modal && (
        <HouseRuleModal
          rule={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

window.HouseRules = HouseRules;
