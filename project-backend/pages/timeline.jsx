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
// Linha do tempo no tema vitral: fio de chumbo central, painéis de vidro
// alternando dos dois lados, cor pelo tipo; divisores de era como faixas.
// ============================================================
const VT_KIND = {
  divine:      { label: 'Divino',     pane: '#b8873a' },
  political:   { label: 'Política',   pane: '#3f6a86' },
  catastrophe: { label: 'Catástrofe', pane: '#9a2a24' },
  arcane:      { label: 'Arcano',     pane: '#7a5aa8' },
};
// tipo pelo campo kind, ou pelo rótulo quando o kind está vazio ("Religioso" → divino)
function vtKindOf(e) {
  if (VT_KIND[e.kind]) return e.kind;
  const l = String(e.label || '').toLowerCase();
  if (/divin|relig/.test(l)) return 'divine';
  if (/cat[aá]str/.test(l)) return 'catastrophe';
  if (/arcan/.test(l)) return 'arcane';
  if (/pol[ií]t/.test(l)) return 'political';
  return '';
}

function Timeline({ onNav }) {
  const { isEditor } = useAuth();
  const [modal, setModal] = React.useState(null);
  const [filter, setFilter] = React.useState('');
  // A antiga página "Eventos da era" repetia esta lista com descrição e região: quando o item da
  // linha do tempo não tem descrição, usa a do evento de mesmo título.
  const norm = t => String(t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  const byTitle = {};
  (Data.events || []).forEach(ev => { if (ev.title) byTitle[norm(ev.title)] = ev; });
  const events = (Data.timeline || []).map(e => {
    if (e.era) return e;
    const ev = byTitle[norm(e.title)];
    return ev ? { ...e, desc: e.desc || ev.desc, region: ev.region, target: e.target || ev.target } : e;
  });

  // agrupa por era (os divisores abrem um grupo novo)
  const groups = [];
  events.forEach(e => {
    if (e.era) groups.push({ era: e, items: [] });
    else {
      if (!groups.length) groups.push({ era: null, items: [] });
      groups[groups.length - 1].items.push(e);
    }
  });
  const counts = {};
  events.forEach(e => { if (!e.era) { const k = vtKindOf(e); counts[k] = (counts[k] || 0) + 1; } });
  let side = 0;

  return (
    <div className="vt vt-pantheon vtl" data-screen-label="04 Linha do Tempo">
      <section className="vt-pantheon-head">
        <img className="vt-hero-rose" src={vtAsset('rosacea.svg')} alt="" aria-hidden="true" draggable="false" />
        <div className="vt-pantheon-head-text">
          <div className="vt-label">Crônicas · A marcha dos anos</div>
          <h1 className="vt-h1">Linha do Tempo</h1>
          <div className="vt-epithet">Fios atados, rompidos e reatados</div>
          <p className="vt-pantheon-lede">
            Da fundação do Império Vranócio ao ano corrente: as eras de Valiran em ordem,
            cada acontecimento num vidro da cor do que o moveu, com onde aconteceu e o que mudou.
          </p>
        </div>
        {isEditor && (
          <div className="vt-pantheon-add">
            <button className="vt-btn vt-btn--gold" onClick={() => setModal('new')}>+ Novo evento</button>
          </div>
        )}
      </section>

      <div className="vtl-filters" role="tablist">
        <button className={'vtl-filter' + (!filter ? ' active' : '')} onClick={() => setFilter('')}>Tudo</button>
        {Object.entries(VT_KIND).map(([k, v]) => (
          <button key={k} className={'vtl-filter' + (filter === k ? ' active' : '')} style={{ '--pane': v.pane }}
            onClick={() => setFilter(f => f === k ? '' : k)}>
            <i />{v.label}<em>{counts[k] || 0}</em>
          </button>
        ))}
      </div>

      {events.length === 0 && <p className="vt-pantheon-empty">Nenhum evento na linha do tempo ainda.</p>}

      <div className="vtl-track">
        {groups.map((g, gi) => {
          const items = g.items.filter(e => !filter || vtKindOf(e) === filter);
          return (
            <React.Fragment key={gi}>
              {g.era && (
                <div className="vtl-era">
                  <span className="vtl-era-num">{vtRoman(gi + 1)}</span>
                  <h2 className="vtl-era-name">{g.era.era}</h2>
                  {isEditor && <button className="vt-btn vtl-edit" onClick={() => setModal(g.era)}>Editar</button>}
                </div>
              )}
              {items.map((e, i) => {
                const k = vtKindOf(e);
                const pane = (VT_KIND[k] || {}).pane || '#8a8070';
                const present = /presente|corrente/i.test((e.label || '') + ' ' + (e.title || ''));
                const cls = 'vtl-event vtl-event--' + ((side++ % 2) ? 'right' : 'left') + (present ? ' vtl-event--now' : '');
                return (
                  <div key={e._id || i} className={cls} style={{ '--pane': pane }}>
                    <span className="vtl-node" aria-hidden="true" />
                    <article className="vtl-card">
                      <div className="vtl-meta">
                        <span className="vtl-year">{e.year}</span>
                        {e.label && <span className="vtl-label">{e.label}</span>}
                        {(e.region && e.region !== '—' ? e.region : e.tag) && <span className="vtl-tag">{e.region && e.region !== '—' ? e.region : e.tag}</span>}
                        {isEditor && <button className="vt-btn vtl-edit" onClick={() => setModal(e)}>Editar</button>}
                      </div>
                      <h3 className="vtl-title">{e.title}</h3>
                      {e.desc && <p className="vtl-desc">{e.desc}</p>}
                    </article>
                  </div>
                );
              })}
            </React.Fragment>
          );
        })}
      </div>

      <footer className="vt-pantheon-foot">
        “A história não se repete. Ela rima — e quase sempre em Lancaster.”
        <div className="vt-quote-src">— Arquivista Cael</div>
      </footer>

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
window.vtKindOf = vtKindOf;
window.VT_KIND = VT_KIND;
