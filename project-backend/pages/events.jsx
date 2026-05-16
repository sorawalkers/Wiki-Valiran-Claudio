// Events — filterable list

const CAT_LABELS = { div: 'Divino', pol: 'Político', cata: 'Catástrofe', arc: 'Arcano' };
const CAT_OPTIONS = [
  { id: 'div',  label: 'Divino' },
  { id: 'pol',  label: 'Político' },
  { id: 'cata', label: 'Catástrofe' },
  { id: 'arc',  label: 'Arcano' },
];

const STATIC_EVENTS = [
  { year: 'T-???',    cat: 'div',  catLabel: 'Divino',     title: 'Cerigane tece a Trama', desc: 'O primeiro ato consciente do mundo.', region: 'Pré-Valiran' },
  { year: '1ªE 489',  cat: 'div',  catLabel: 'Divino',     title: 'Esmir ascende', desc: 'Um mortal compra com sua morte a era seguinte.', region: 'Lancaster' },
  { year: '2ªE 023',  cat: 'pol',  catLabel: 'Político',   title: 'República Prateada é fundada', desc: 'Dragões metálicos pousam sobre o continente sul.', region: 'Aerithys' },
  { year: '2ªE 314',  cat: 'arc',  catLabel: 'Arcano',     title: 'Primeiro Warforged desperta', desc: 'Ven Sothiel transfere uma consciência para o aço.', region: 'Lorean Treaz' },
  { year: '2ªE 798',  cat: 'pol',  catLabel: 'Político',   title: 'Annabella é coroada', desc: 'Uma rainha jovem que jamais envelheceu um dia.', region: 'Oshain' },
  { year: '3ªE 1276', cat: 'cata', catLabel: 'Catástrofe', title: 'A Queda de Lancaster', desc: 'O selo é rompido. O reino sagrado cai em uma noite.', region: 'Lancaster', target: 'article' },
  { year: '3ªE 1276', cat: 'div',  catLabel: 'Divino',     title: 'Vaglies Lihleran I se sacrifica', desc: 'O Rei oferece a própria vida para retardar a fenda.', region: 'Lancaster' },
  { year: '3ªE 1278', cat: 'pol',  catLabel: 'Político',   title: 'Blackflame parcialmente revelada', desc: 'Documentos vazam, e Oshain mente sobre vinte coisas em vez de uma.', region: 'Halensgard' },
  { year: '3ªE 1279', cat: 'cata', catLabel: 'Catástrofe', title: 'Mortvuus se mexe', desc: 'Pela primeira vez em milênios, o Silêncio Primeiro fala.', region: 'Indeterminado' },
  { year: '3ªE 1280', cat: 'arc',  catLabel: 'Arcano',     title: 'A décima primeira ruptura', desc: 'O Concílio mapeia mais uma cicatriz na Trama.', region: 'Lorean Treaz' },
  { year: '3ªE 1281', cat: 'pol',  catLabel: 'Político',   title: 'A campanha começa', desc: 'Sete heróis improváveis se cruzam numa estalagem.', region: 'Tarvane', target: 'sessions' },
];

// ============================================================
// Event modal (create / edit)
// ============================================================
function EventModal({ event, onClose }) {
  const isEdit = !!event?._id;
  const [form, setForm] = React.useState({
    year: event?.year ?? '',
    cat: event?.cat ?? 'pol',
    catLabel: event?.catLabel ?? '',
    title: event?.title ?? '',
    desc: event?.desc ?? '',
    region: event?.region ?? '',
    target: event?.target ?? '',
    sort_order: event?.sort_order ?? 0,
    _id: event?._id,
  });
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState('');
  const [confirmDel, setConfirmDel] = React.useState(false);

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function handleSave(e) {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      await window.DB.saveEvent({
        ...form,
        catLabel: form.catLabel || CAT_LABELS[form.cat] || form.cat,
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
      await window.DB.deleteEvent(form._id);
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
          <div className="modal-eyebrow">Crônicas · Eventos da Era</div>
          <h2 className="modal-title">{isEdit ? 'Editar Evento' : 'Novo Evento'}</h2>
        </div>
        <form onSubmit={handleSave}>
          <div className="modal-body">
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
                <label className="modal-label">Categoria</label>
                <select className="modal-select" value={form.cat} onChange={e => set('cat', e.target.value)}>
                  {CAT_OPTIONS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
            </div>
            <div className="modal-field">
              <label className="modal-label">Descrição</label>
              <textarea className="modal-textarea" rows={3} value={form.desc} onChange={e => set('desc', e.target.value)} placeholder="Breve descrição do evento..." />
            </div>
            <div className="modal-field-row">
              <div className="modal-field">
                <label className="modal-label">Região</label>
                <input className="modal-input" value={form.region} onChange={e => set('region', e.target.value)} placeholder="Lancaster" />
              </div>
              <div className="modal-field">
                <label className="modal-label">Link (rota)</label>
                <input className="modal-input" value={form.target} onChange={e => set('target', e.target.value)} placeholder="article" />
                <span className="modal-hint">ex: article, sessions, timeline</span>
              </div>
            </div>
            <div className="modal-field">
              <label className="modal-label">Ordem de exibição</label>
              <input className="modal-input" type="number" value={form.sort_order} onChange={e => set('sort_order', e.target.value)} placeholder="0" />
            </div>
            {err && <div className="modal-error">{err}</div>}
          </div>
          <div className="modal-foot">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-save" disabled={busy}>{busy ? 'Salvando…' : 'Salvar Evento'}</button>
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
// Events page
// ============================================================
function Events({ onNav }) {
  const { isEditor } = useAuth();
  const [filter, setFilter] = React.useState('todos');
  const [modal, setModal] = React.useState(null);

  const events = Data.events || STATIC_EVENTS;

  const filters = [
    { id: 'todos', label: 'Tudo' },
    ...CAT_OPTIONS,
  ];

  const filtered = events.filter(e => filter === 'todos' || e.cat === filter);

  return (
    <div className="page" data-screen-label="11 Eventos da Era">
      <header className="page-header">
        <div className="page-header-row">
          <div>
            <div className="page-eyebrow">Crônicas · Volume IV · Eventos catalogados</div>
            <h1 className="page-title">Eventos da Era</h1>
          </div>
          {isEditor && (
            <button className="editor-add-btn" onClick={() => setModal('new')}>
              Novo Evento
            </button>
          )}
        </div>
        <p className="page-lede">
          A linha do tempo é um rio; os eventos são as pedras. Aqui se
          listam, por categoria e por data, os momentos que marcaram cada
          uma das três eras. Para narrativa contínua, ver Linha do Tempo.
        </p>
      </header>

      <div className="events-controls">
        <span style={{
          fontFamily:'JetBrains Mono, monospace', fontSize:10, letterSpacing:'0.22em',
          textTransform:'uppercase', color:'var(--gold-dim)', marginRight: 8,
        }}>Filtrar por categoria:</span>
        {filters.map(f => (
          <button
            key={f.id}
            className={`chip ${filter === f.id ? 'active' : ''}`}
            onClick={() => setFilter(f.id)}
          >{f.label}</button>
        ))}
        <span style={{
          marginLeft:'auto',
          fontFamily:'JetBrains Mono, monospace', fontSize:10, letterSpacing:'0.18em',
          color:'var(--foam-dim)',
        }}>{filtered.length} de {events.length} eventos</span>
      </div>

      <div className="events-table">
        <div className="events-row header">
          <span>Ano</span>
          <span>Categoria</span>
          <span>Evento</span>
          <span style={{textAlign:'right'}}>Região</span>
        </div>
        {filtered.map((e, i) => (
          <div key={e._id || i} className="events-row" onClick={() => e.target && onNav(e.target)}>
            <span className="events-year">{e.year}</span>
            <span className={`events-cat ${e.cat}`}>{e.catLabel}</span>
            <div>
              <h4 className="events-title">{e.title}</h4>
              <p className="events-desc">{e.desc}</p>
            </div>
            <div style={{ textAlign:'right', display:'flex', flexDirection:'column', alignItems:'flex-end', gap:6 }}>
              <span className="events-region">{e.region && e.region.toUpperCase()}</span>
              {isEditor && (
                <button
                  className="editor-del-btn"
                  style={{ opacity:1 }}
                  onClick={ev => { ev.stopPropagation(); setModal(e); }}
                >
                  Editar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <EventModal
          event={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

window.Events = Events;
