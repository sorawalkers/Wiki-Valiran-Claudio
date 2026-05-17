// Timeline page

// ============================================================
// Timeline event modal (create / edit)
// ============================================================
function TimelineEventModal({ event, onClose }) {
  const isEdit = !!event?._id;
  const [form, setForm] = React.useState({
    era: event?.era ?? '',
    year: event?.year ?? '',
    label: event?.label ?? '',
    title: event?.title ?? '',
    desc: event?.desc ?? '',
    tag: event?.tag ?? '',
    kind: event?.kind ?? '',
    sort_order: event?.sort_order ?? 0,
    _id: event?._id,
  });
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState('');
  const [confirmDel, setConfirmDel] = React.useState(false);
  const [isDivider, setIsDivider] = React.useState(!!event?.era && !event?.title);

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function handleSave(e) {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      await window.DB.saveTimelineEvent({
        ...form,
        era: isDivider ? form.era : null,
        title: isDivider ? null : form.title,
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
      await window.DB.deleteTimelineEvent(form._id);
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
          <div className="modal-eyebrow">Crônicas · Linha do Tempo</div>
          <h2 className="modal-title">{isEdit ? 'Editar Evento' : 'Novo Evento'}</h2>
        </div>
        <form onSubmit={handleSave}>
          <div className="modal-body">
            <div className="modal-field">
              <label className="modal-label" style={{ display:'flex', alignItems:'center', gap:10 }}>
                <input type="checkbox" checked={isDivider} onChange={e => setIsDivider(e.target.checked)} style={{ width:14, height:14 }} />
                Divisor de era (sem evento)
              </label>
            </div>
            {isDivider ? (
              <div className="modal-field">
                <label className="modal-label">Nome da era</label>
                <input className="modal-input" value={form.era} onChange={e => set('era', e.target.value)} required placeholder="A Terceira Era · O Vazamento" autoFocus />
              </div>
            ) : (
              <React.Fragment>
                <div className="modal-field">
                  <label className="modal-label">Título</label>
                  <input className="modal-input" value={form.title} onChange={e => set('title', e.target.value)} required placeholder="A Queda de Lancaster" autoFocus />
                </div>
                <div className="modal-field-row">
                  <div className="modal-field">
                    <label className="modal-label">Ano</label>
                    <input className="modal-input" value={form.year} onChange={e => set('year', e.target.value)} placeholder="3ªE 1276" />
                  </div>
                  <div className="modal-field">
                    <label className="modal-label">Rótulo</label>
                    <input className="modal-input" value={form.label} onChange={e => set('label', e.target.value)} placeholder="Catástrofe" />
                  </div>
                </div>
                <div className="modal-field">
                  <label className="modal-label">Descrição</label>
                  <textarea className="modal-textarea" rows={3} value={form.desc} onChange={e => set('desc', e.target.value)} placeholder="O que aconteceu..." />
                </div>
                <div className="modal-field-row">
                  <div className="modal-field">
                    <label className="modal-label">Tag</label>
                    <input className="modal-input" value={form.tag} onChange={e => set('tag', e.target.value)} placeholder="Divino" />
                  </div>
                  <div className="modal-field">
                    <label className="modal-label">Tipo (kind)</label>
                    <select className="modal-select" value={form.kind} onChange={e => set('kind', e.target.value)}>
                      <option value="">— padrão —</option>
                      <option value="divine">Divino</option>
                      <option value="catastrophe">Catástrofe</option>
                      <option value="political">Político</option>
                      <option value="arcane">Arcano</option>
                    </select>
                  </div>
                </div>
                <div className="modal-field">
                  <label className="modal-label">Ordem de exibição</label>
                  <input className="modal-input" type="number" value={form.sort_order} onChange={e => set('sort_order', e.target.value)} placeholder="0" />
                </div>
              </React.Fragment>
            )}
            {err && <div className="modal-error">{err}</div>}
          </div>
          <div className="modal-foot">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-save" disabled={busy}>{busy ? 'Salvando…' : 'Salvar'}</button>
            {isEdit && (
              <button type="button" className={`btn-delete ${confirmDel ? 'confirm' : ''}`} onClick={handleDelete} disabled={busy}>
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
// Timeline page
// ============================================================
function Timeline({ onNav }) {
  const { isEditor } = useAuth();
  const [modal, setModal] = React.useState(null);

  const events = Data.timeline || [];

  return (
    <div className="timeline-page" data-screen-label="04 Linha do Tempo">
      <header className="page-header">
        <div className="page-header-row">
          <div>
            <div className="page-eyebrow">Crônicas · Volume IV · A Marcha dos Anos</div>
            <h1 className="page-title">Linha do Tempo</h1>
          </div>
          {isEditor && (
            <button className="editor-add-btn" onClick={() => setModal('new')}>
              Novo Evento
            </button>
          )}
        </div>
        <p className="page-lede">
          De Cerigane tecendo a Trama Mágica antes do tempo, até a noite em que
          sete heróis improváveis se cruzaram numa estalagem em Tarvane.
          Vinte e três mil anos de fios atados, rompidos e reatados.
        </p>
      </header>

      <div style={{
        display:'flex', gap: 12, marginBottom: 32, flexWrap:'wrap',
        fontFamily:'JetBrains Mono', fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase'
      }}>
        {['Tudo', 'Divino', 'Política', 'Catástrofe', 'Arcano'].map((f, i) => (
          <button key={f} style={{
            padding:'6px 14px',
            background: i === 0 ? 'rgba(184,153,104,0.15)' : 'transparent',
            color: i === 0 ? 'var(--gold-bright)' : 'var(--foam-dim)',
            border:'1px solid ' + (i === 0 ? 'var(--gold-dim)' : 'var(--ink-line)'),
            borderRadius:'2px',
            cursor:'pointer'
          }}>{f}</button>
        ))}
      </div>

      {events.length === 0 && (
        <div style={{ padding:'60px 0', textAlign:'center', color:'var(--foam-dim)', fontFamily:'EB Garamond, serif', fontStyle:'italic', fontSize:16 }}>
          Nenhum evento na linha do tempo ainda. Use o botão acima para adicionar.
        </div>
      )}

      <div className="timeline">
        {events.map((e, i) => {
          if (e.era) {
            return (
              <div key={i} className="era-divider" style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div className="era-divider-text">{e.era}</div>
                {isEditor && (
                  <button
                    className="editor-del-btn"
                    style={{ opacity:1, marginLeft:8 }}
                    onClick={() => setModal(e)}
                  >
                    Editar
                  </button>
                )}
              </div>
            );
          }
          return (
            <div
              key={i}
              className={`timeline-event ${e.kind || ''}`}
              onClick={() => {
                if (e.title && e.title.includes('Lancaster')) onNav('article');
              }}
              style={{ position:'relative' }}
            >
              <div className="timeline-card">
                <div className="timeline-date">
                  <span className="year">{e.year}</span>
                  <span>· {e.label}</span>
                  <span className="tag">{e.tag}</span>
                  {isEditor && (
                    <button
                      className="editor-del-btn"
                      style={{ marginLeft:'auto' }}
                      onClick={ev => { ev.stopPropagation(); setModal(e); }}
                    >
                      Editar
                    </button>
                  )}
                </div>
                <h3 className="timeline-title">{e.title}</h3>
                <p className="timeline-desc">{e.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {modal && (
        <TimelineEventModal
          event={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

window.Timeline = Timeline;
