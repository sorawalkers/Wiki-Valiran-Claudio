// Recent additions — DB-driven feed of latest entries

// ============================================================
// FeedEntryModal (create / edit)
// ============================================================
function FeedEntryModal({ entry, onClose }) {
  const isEdit = !!entry?._id;

  const TYPE_OPTIONS = [
    { value: 'new',    label: 'NOVO' },
    { value: 'edit',   label: 'EDIÇÃO' },
    { value: 'danger', label: 'AVISO' },
    { value: 'minor',  label: 'MENOR' },
    { value: 'purga',  label: 'PURGA' },
  ];

  const [form, setForm] = React.useState({
    entry_type:  entry?.entry_type  ?? 'new',
    type_label:  entry?.type_label  ?? 'NOVO',
    date_label:  entry?.date_label  ?? '',
    time_label:  entry?.time_label  ?? '',
    title:       entry?.title       ?? '',
    excerpt:     entry?.excerpt     ?? '',
    author:      entry?.author      ?? '',
    target:      entry?.target      ?? '',
    tag:         entry?.tag         ?? '',
    meta:        entry?.meta        ?? '',
    sort_order:  entry?.sort_order  ?? 0,
    _id:         entry?._id,
  });
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState('');
  const [confirmDel, setConfirmDel] = React.useState(false);

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  function handleTypeChange(value) {
    const opt = TYPE_OPTIONS.find(o => o.value === value);
    setForm(f => ({ ...f, entry_type: value, type_label: opt ? opt.label : f.type_label }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      await window.DB.saveLatestEntry({
        ...form,
        target:     form.target     || null,
        tag:        form.tag        || null,
        meta:       form.meta       || null,
        sort_order: parseInt(form.sort_order) || 0,
      });
      onClose();
    } catch (e) {
      setErr(e.message || 'Erro ao salvar');
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!confirmDel) { setConfirmDel(true); setTimeout(() => setConfirmDel(false), 3000); return; }
    setBusy(true);
    try {
      await window.DB.deleteLatestEntry(form._id);
      onClose();
    } catch (e) {
      setErr(e.message || 'Erro ao apagar');
      setBusy(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-eyebrow">Sumário do Escriba · Adições Recentes</div>
          <h2 className="modal-title">{isEdit ? 'Editar Entrada' : 'Nova Entrada'}</h2>
        </div>
        <form onSubmit={handleSave}>
          <div className="modal-body">
            <div className="modal-field-row">
              <div className="modal-field">
                <label className="modal-label">Tipo</label>
                <select className="modal-select" value={form.entry_type} onChange={e => handleTypeChange(e.target.value)}>
                  {TYPE_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div className="modal-field">
                <label className="modal-label">Rótulo do tipo</label>
                <input className="modal-input" value={form.type_label} onChange={e => set('type_label', e.target.value)} placeholder="NOVO" />
              </div>
            </div>
            <div className="modal-field-row">
              <div className="modal-field">
                <label className="modal-label">Data in-universe</label>
                <input className="modal-input" value={form.date_label} onChange={e => set('date_label', e.target.value)} placeholder="14 do Segundo Mês, 1281" />
              </div>
              <div className="modal-field">
                <label className="modal-label">Hora</label>
                <input className="modal-input" value={form.time_label} onChange={e => set('time_label', e.target.value)} placeholder="22:14" />
              </div>
            </div>
            <div className="modal-field">
              <label className="modal-label">Título</label>
              <input className="modal-input" value={form.title} onChange={e => set('title', e.target.value)} required placeholder="Título da entrada" autoFocus />
            </div>
            <div className="modal-field">
              <label className="modal-label">Excerto / Descrição</label>
              <textarea className="modal-textarea" rows={3} value={form.excerpt} onChange={e => set('excerpt', e.target.value)} placeholder="Breve descrição da alteração..." />
            </div>
            <div className="modal-field-row">
              <div className="modal-field">
                <label className="modal-label">Autor</label>
                <input className="modal-input" value={form.author} onChange={e => set('author', e.target.value)} placeholder="Arquivista Cael" />
              </div>
              <div className="modal-field">
                <label className="modal-label">Link (rota)</label>
                <input className="modal-input" value={form.target} onChange={e => set('target', e.target.value)} placeholder="article" />
              </div>
            </div>
            <div className="modal-field">
              <label className="modal-label">Ordem de exibição</label>
              <input className="modal-input" type="number" value={form.sort_order} onChange={e => set('sort_order', e.target.value)} placeholder="0" />
            </div>
            <div className="modal-field-row">
              <div className="modal-field">
                <label className="modal-label">Tag (portal)</label>
                <input className="modal-input" value={form.tag} onChange={e => set('tag', e.target.value)} placeholder="Opcional" />
              </div>
              <div className="modal-field">
                <label className="modal-label">Meta (portal)</label>
                <input className="modal-input" value={form.meta} onChange={e => set('meta', e.target.value)} placeholder="Opcional" />
              </div>
            </div>
            {err && <div className="modal-error">{err}</div>}
          </div>
          <div className="modal-foot">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            {isEdit && (
              <button type="button" className={`btn-delete ${confirmDel ? 'confirm' : ''}`} onClick={handleDelete} disabled={busy}>
                {confirmDel ? 'Confirmar exclusão' : 'Apagar'}
              </button>
            )}
            <button type="submit" className="btn-save" disabled={busy}>{busy ? 'Salvando…' : 'Salvar Entrada'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================
// Recent — DB-driven feed
// ============================================================
function Recent({ onNav }) {
  const { isEditor } = useAuth();
  const [modal, setModal] = React.useState(null); // null | 'new' | entry object
  const [, setTick] = React.useState(0);

  React.useEffect(() => {
    const refresh = () => setTick(t => t + 1);
    window.addEventListener('db-refresh', refresh);
    return () => window.removeEventListener('db-refresh', refresh);
  }, []);

  const entries = (Data.latest || []).slice().sort((a, b) => a.sort_order - b.sort_order);

  // Group by date_label while preserving order
  const days = [];
  const seen = new Map();
  entries.forEach(e => {
    const key = e.date_label || '';
    if (!seen.has(key)) {
      const group = { date: key, entries: [] };
      seen.set(key, group);
      days.push(group);
    }
    seen.get(key).entries.push(e);
  });

  return (
    <div className="page" data-screen-label="06 Adições Recentes">
      <header className="page-header">
        <div className="page-header-row">
          <div>
            <div className="page-eyebrow">Sumário do Escriba · Vol. III · Fólio 47</div>
            <h1 className="page-title">Adições Recentes</h1>
          </div>
          {isEditor && (
            <button className="editor-add-btn" onClick={() => setModal('new')}>
              + Nova Entrada
            </button>
          )}
        </div>
        <p className="page-lede">
          Cada folha do Arquivo carrega um testemunho. Aqui estão as últimas
          escritas — novas entradas, revisões e os raros documentos selados
          pelo Conselho. Leia o mais recente primeiro.
        </p>
      </header>

      {entries.length === 0 && (
        <div style={{ padding:'60px 0', textAlign:'center', color:'var(--foam-dim)', fontFamily:'EB Garamond, serif', fontStyle:'italic', fontSize:16 }}>
          Nenhuma entrada registrada ainda. Use o botão acima para adicionar.
        </div>
      )}

      <div className="feed">
        {days.map(d => (
          <div key={d.date} className="feed-day">
            <div className="feed-day-header">
              <div className="feed-day-date">{d.date}</div>
              <div className="feed-day-relative">· —</div>
              <div className="feed-day-count">{d.entries.length} {d.entries.length === 1 ? 'entrada' : 'entradas'}</div>
            </div>
            {d.entries.map(e => (
              <div
                key={e._id}
                className="feed-entry"
                onClick={() => e.target && onNav(e.target)}
                style={e.target ? { cursor: 'pointer' } : undefined}
              >
                <div className={`feed-type ${e.entry_type}`}>{e.type_label}</div>
                <div className="feed-time">{e.time_label}</div>
                <div>
                  <h4 className="feed-title">{e.title}</h4>
                  <p className="feed-desc">{e.excerpt}</p>
                </div>
                <div className="feed-author">por {e.author}</div>
                {isEditor && (
                  <button
                    className="editor-del-btn"
                    onClick={ev => { ev.stopPropagation(); setModal(e); }}
                  >
                    Editar
                  </button>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {modal && (
        <FeedEntryModal
          entry={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

window.Recent = Recent;
