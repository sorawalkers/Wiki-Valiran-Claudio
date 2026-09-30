// Events — filterable list

const CAT_LABELS = { div: 'Divino', pol: 'Político', cata: 'Catástrofe', arc: 'Arcano' };
const CAT_OPTIONS = [
  { id: 'div',  label: 'Divino' },
  { id: 'pol',  label: 'Político' },
  { id: 'cata', label: 'Catástrofe' },
  { id: 'arc',  label: 'Arcano' },
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
// cat do evento → tipo das cores da linha do tempo
const EV_KIND = { div: 'divine', pol: 'political', cata: 'catastrophe', arc: 'arcane' };

function Events({ onNav }) {
  const { isEditor } = useAuth();
  const [filter, setFilter] = React.useState('todos');
  const [q, setQ] = React.useState('');
  const [modal, setModal] = React.useState(null);

  const events = Data.events || [];
  const nq = q.trim().toLowerCase();
  const filtered = events.filter(e => (filter === 'todos' || e.cat === filter) &&
    (!nq || [e.title, e.desc, e.region, e.year].some(x => String(x || '').toLowerCase().includes(nq))));
  const counts = {};
  events.forEach(e => { counts[e.cat] = (counts[e.cat] || 0) + 1; });

  // separa as eras pelo ano: negativo = antes do marco, "AQV" = após a queda de Vranócia
  const eraOf = e => /aqv/i.test(String(e.year)) ? 'Era Atual · Após a Queda de Vranócia' : 'Era Pré-Vranócia';
  const groups = [];
  filtered.forEach(e => {
    const era = eraOf(e);
    if (!groups.length || groups[groups.length - 1].era !== era) groups.push({ era, items: [] });
    groups[groups.length - 1].items.push(e);
  });

  return (
    <div className="vt vt-pantheon vev" data-screen-label="11 Eventos da Era">
      <section className="vt-pantheon-head">
        <img className="vt-hero-rose" src={vtAsset('rosacea.svg')} alt="" aria-hidden="true" draggable="false" />
        <div className="vt-pantheon-head-text">
          <div className="vt-label">Crônicas · Eventos catalogados</div>
          <h1 className="vt-h1">Eventos da Era</h1>
          <div className="vt-epithet">A linha do tempo é um rio; os eventos são as pedras</div>
          <p className="vt-pantheon-lede">
            Os momentos que marcaram cada era, por categoria, data e região.
            Para a narrativa contínua, <a onClick={() => onNav('timeline')}>veja a Linha do Tempo</a>.
          </p>
        </div>
        {isEditor && (
          <div className="vt-pantheon-add">
            <button className="vt-btn vt-btn--gold" onClick={() => setModal('new')}>+ Novo evento</button>
          </div>
        )}
      </section>

      <div className="vtl-filters">
        <button className={'vtl-filter' + (filter === 'todos' ? ' active' : '')} onClick={() => setFilter('todos')}>Tudo<em>{events.length}</em></button>
        {CAT_OPTIONS.map(f => (
          <button key={f.id} className={'vtl-filter' + (filter === f.id ? ' active' : '')}
            style={{ '--pane': VT_KIND[EV_KIND[f.id]].pane }} onClick={() => setFilter(x => x === f.id ? 'todos' : f.id)}>
            <i />{f.label}<em>{counts[f.id] || 0}</em>
          </button>
        ))}
        <input className="vev-search" type="search" placeholder="Buscar evento, ano ou região…" value={q} onChange={e => setQ(e.target.value)} />
      </div>

      {events.length === 0 && <p className="vt-pantheon-empty">Nenhum evento catalogado ainda.</p>}
      {events.length > 0 && filtered.length === 0 && <p className="vt-pantheon-empty">Nenhum evento corresponde ao filtro.</p>}

      {groups.map(g => (
        <section key={g.era} className="vh-section vev-group">
          <header className="vh-head">
            <span className="vh-head-num">✠</span>
            <h2 className="vh-head-title">{g.era}</h2>
            <span className="vev-count">{g.items.length} {g.items.length === 1 ? 'evento' : 'eventos'}</span>
          </header>
          <div className="vt-ficha vh-ledger vev-ledger">
            <VtArchiveFrame />
            <ol className="vh-ledger-list">
              {g.items.map((e, i) => (
                <li key={e._id || i} className={'vev-row' + (e.target ? ' is-link' : '')}
                  style={{ '--pane': VT_KIND[EV_KIND[e.cat]] ? VT_KIND[EV_KIND[e.cat]].pane : '#8a8070' }}
                  onClick={() => e.target && onNav(e.target)}>
                  <span className="vev-year">{e.year}</span>
                  <span className="vh-ledger-type vev-cat">{e.catLabel || CAT_LABELS[e.cat]}</span>
                  <div className="vev-body">
                    <h3 className="vev-title">{e.title}</h3>
                    {e.desc && <p className="vev-desc">{e.desc}</p>}
                  </div>
                  <span className="vev-region">{e.region}</span>
                  {isEditor && <button className="vt-btn vtl-edit" onClick={ev => { ev.stopPropagation(); setModal(e); }}>Editar</button>}
                </li>
              ))}
            </ol>
          </div>
        </section>
      ))}

      <footer className="vt-pantheon-foot">
        “Cada pedra no rio muda o curso da água um pouco. Algumas mudam tudo.”
        <div className="vt-quote-src">— Arquivista Cael</div>
      </footer>

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
