// Sistema — atualizações de mecânicas, regras, novas funcionalidades
// Layout: índice lateral fixo + feed cronológico

// ============================================================
// Helpers
// ============================================================
function parseSystemBody(body) {
  if (!body) return [];
  const blocks = body.split(/\n\n+/).map(b => b.trim()).filter(Boolean);
  let imgCount = 0;
  return blocks.map(b => {
    const imgMatch = b.match(/^\[img(?::\s*(.+))?\]$/i);
    if (imgMatch) {
      const caption = (imgMatch[1] || '').trim();
      return { kind: 'img', index: imgCount++, caption };
    }
    return { kind: 'para', text: b };
  });
}

function sysSlugify(s) {
  return (s || '').toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    .slice(0, 80) || ('sys-' + Date.now());
}

// ============================================================
// SystemEntryModal — create / edit
// ============================================================
function SystemEntryModal({ entry, onClose }) {
  const isEdit = !!entry?._id;
  const [form, setForm] = React.useState({
    id:         entry?.id         ?? '',
    title:      entry?.title      ?? '',
    date_long:  entry?.date_long  ?? '',
    date_short: entry?.date_short ?? '',
    compact:    entry?.compact    ?? false,
    line:       entry?.line       ?? '',
    body:       entry?.body       ?? '',
    sort_order: entry?.sort_order ?? 0,
    _id:        entry?._id,
  });
  const [busy, setBusy] = React.useState(false);
  const [err,  setErr]  = React.useState('');
  const [confirmDel, setConfirmDel] = React.useState(false);

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function handleSave(e) {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      await window.DB.saveSystemEntry({
        ...form,
        id: form.id || sysSlugify(form.title),
        sort_order: parseInt(form.sort_order) || 0,
      });
      onClose();
    } catch (ex) {
      setErr(ex.message || 'Erro ao salvar');
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!confirmDel) { setConfirmDel(true); setTimeout(() => setConfirmDel(false), 3000); return; }
    setBusy(true);
    try {
      await window.DB.deleteSystemEntry(form._id);
      onClose();
    } catch (ex) {
      setErr(ex.message || 'Erro ao apagar');
      setBusy(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: 640 }} onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-eyebrow">Mesa · Sistema</div>
          <h2 className="modal-title">{isEdit ? 'Editar entrada' : 'Nova entrada'}</h2>
        </div>
        <form onSubmit={handleSave}>
          <div className="modal-body">
            <div className="modal-field">
              <label className="modal-label">Título</label>
              <input className="modal-input" value={form.title} required autoFocus
                placeholder={form.compact ? 'Ex: Errata · Eldritch Blast' : 'Ex: Marca da Ascendência'}
                onChange={e => {
                  set('title', e.target.value);
                  if (!isEdit && !form.id) set('id', sysSlugify(e.target.value));
                }} />
            </div>

            <div className="modal-field-row">
              <div className="modal-field">
                <label className="modal-label">Data (longa)</label>
                <input className="modal-input" value={form.date_long}
                  placeholder="30 do Quarto Mês, 1281"
                  onChange={e => set('date_long', e.target.value)} />
              </div>
              <div className="modal-field" style={{ maxWidth: 180 }}>
                <label className="modal-label">Data (curta)</label>
                <input className="modal-input" value={form.date_short}
                  placeholder="30 · IV · 1281"
                  onChange={e => set('date_short', e.target.value)} />
                <span className="modal-hint">Aparece no índice.</span>
              </div>
            </div>

            <div className="modal-field" style={{ display:'flex', alignItems:'center', gap:10 }}>
              <input id="sys-compact" type="checkbox" checked={form.compact}
                style={{ width:16, height:16, accentColor:'var(--gold)' }}
                onChange={e => set('compact', e.target.checked)} />
              <label htmlFor="sys-compact" className="modal-label" style={{ margin:0, cursor:'pointer' }}>
                Compacta — uma linha, sem imagens
              </label>
            </div>

            {form.compact ? (
              <div className="modal-field">
                <label className="modal-label">Texto da nota</label>
                <textarea className="modal-textarea" rows={2} value={form.line}
                  placeholder="Uma linha. Sem parágrafos."
                  onChange={e => set('line', e.target.value)} />
                <span className="modal-hint">
                  O título aparece como rótulo pequeno (ex: "Errata · Eldritch Blast") e este texto como a nota em si.
                </span>
              </div>
            ) : (
              <div className="modal-field">
                <label className="modal-label">Corpo</label>
                <textarea className="modal-textarea" rows={12} value={form.body}
                  placeholder={"Primeiro parágrafo.\n\n[img]\n\nSegundo parágrafo.\n\n[img: Legenda da imagem]\n\nTerceiro parágrafo."}
                  onChange={e => set('body', e.target.value)} />
                <span className="modal-hint">
                  Parágrafos separados por linha em branco. Para imagens use <code>[img]</code> em linha sozinha — você arrasta a imagem depois.
                  Para legenda: <code>[img: legenda]</code>.
                </span>
              </div>
            )}

            <div className="modal-field" style={{ maxWidth: 140 }}>
              <label className="modal-label">Ordem</label>
              <input className="modal-input" type="number" value={form.sort_order}
                onChange={e => set('sort_order', e.target.value)} />
              <span className="modal-hint">Maior = mais recente.</span>
            </div>

            {!isEdit && (
              <div className="modal-field">
                <label className="modal-label">ID (slug)</label>
                <input className="modal-input" value={form.id}
                  placeholder="gerado automaticamente"
                  onChange={e => set('id', e.target.value)} />
              </div>
            )}

            {err && <div className="modal-error">{err}</div>}
          </div>

          <div className="modal-foot">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            {isEdit && (
              <button type="button" className={`btn-delete ${confirmDel ? 'confirm' : ''}`}
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
// Inline figure — mostra imagem em tamanho natural via URL do slot store
// ============================================================
function SystemFigure({ entryId, idx, caption }) {
  const slotId = `sys-img-${entryId}-${idx}`;
  const [src, setSrc] = React.useState(() => {
    const slot = window._imageSlotGet && window._imageSlotGet(slotId);
    return slot ? slot.u : null;
  });

  React.useEffect(() => {
    if (src) return;
    // loadSlots() é async — poll até a URL aparecer (máx 5s)
    let attempts = 0;
    const interval = setInterval(() => {
      const slot = window._imageSlotGet && window._imageSlotGet(slotId);
      if (slot && slot.u) { setSrc(slot.u); clearInterval(interval); return; }
      if (++attempts > 25) clearInterval(interval);
    }, 200);
    return () => clearInterval(interval);
  }, [slotId]);

  return (
    <figure className="sys-fig">
      {src
        ? <img src={src} alt={caption || ''} className="sys-fig-img" />
        : <image-slot id={slotId} shape="rect" fit="contain" placeholder="Arraste imagem"></image-slot>
      }
      {caption && <figcaption className="sys-fig-caption">{caption}</figcaption>}
    </figure>
  );
}

// ============================================================
// SystemEntry — compact OR long
// ============================================================
function SystemEntry({ entry, isEditor, onEdit }) {
  if (entry.compact) {
    return (
      <article id={`sys-${entry.id}`} className="sys-entry compact">
        <div className="sys-entry-head">
          <span className="sys-date">{entry.date_short || entry.date_long || '—'}</span>
          <h2 className="sys-title">{entry.title}</h2>
          {isEditor && (
            <button className="sys-edit-btn" onClick={onEdit}>Editar</button>
          )}
        </div>
        <div className="sys-line">{entry.line}</div>
      </article>
    );
  }
  const blocks = parseSystemBody(entry.body);
  return (
    <article id={`sys-${entry.id}`} className="sys-entry">
      <div className="sys-entry-head">
        <span className="sys-date">{entry.date_short || entry.date_long || '—'}</span>
        <h2 className="sys-title">{entry.title}</h2>
        {isEditor && (
          <button className="sys-edit-btn" onClick={onEdit}>Editar</button>
        )}
      </div>
      <div className="sys-body">
        {blocks.map((b, i) => b.kind === 'img'
          ? <SystemFigure key={i} entryId={entry.id} idx={b.index} caption={b.caption} />
          : <p key={i}>{b.text}</p>
        )}
      </div>
    </article>
  );
}

// ============================================================
// Sistema — main page
// ============================================================
function Sistema({ onNav }) {
  const { isEditor } = useAuth();
  const [modal,  setModal]  = React.useState(null);
  const [active, setActive] = React.useState(null);
  const [, setTick] = React.useState(0);

  React.useEffect(() => {
    const refresh = () => setTick(t => t + 1);
    window.addEventListener('db-refresh', refresh);
    return () => window.removeEventListener('db-refresh', refresh);
  }, []);

  const entries = (Data.systemEntries || []).slice()
    .sort((a, b) => (b.sort_order || 0) - (a.sort_order || 0));

  React.useEffect(() => {
    const scroller = document.querySelector('.main');
    if (!scroller || entries.length === 0) return;

    function onScroll() {
      const scrollerTop = scroller.getBoundingClientRect().top;
      let current = entries[0].id;
      for (const e of entries) {
        const el = document.getElementById(`sys-${e.id}`);
        if (!el) continue;
        const top = el.getBoundingClientRect().top - scrollerTop;
        if (top <= 80) current = e.id;
      }
      setActive(current);
    }
    scroller.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => scroller.removeEventListener('scroll', onScroll);
  }, [entries.length]);

  function scrollTo(id) {
    const el = document.getElementById(`sys-${id}`);
    const scroller = document.querySelector('.main');
    if (!el || !scroller) return;
    const scrollerTop = scroller.getBoundingClientRect().top;
    const elTop = el.getBoundingClientRect().top;
    scroller.scrollTo({
      top: scroller.scrollTop + (elTop - scrollerTop) - 24,
      behavior: 'smooth',
    });
  }

  return (
    <div className="page" data-screen-label="15 Sistema">
      <header className="page-header">
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16 }}>
          <div>
            <div className="page-eyebrow">Mesa · Vol. VIII · Sistema</div>
            <h1 className="page-title">Atualizações de Sistema</h1>
            <p className="page-lede">
              Mecânicas novas, ajustes de regra, erratas e novas funcionalidades
              da Wiki — registradas em ordem cronológica como entradas do
              caderno do mestre.
            </p>
          </div>
          {isEditor && (
            <button className="editor-add-btn" style={{ flexShrink:0, marginTop:4 }}
              onClick={() => setModal('new')}>
              + Nova entrada
            </button>
          )}
        </div>
      </header>

      {entries.length === 0 && (
        <p style={{ fontFamily:'EB Garamond,serif', fontStyle:'italic', color:'var(--foam-dim)', textAlign:'center', marginTop:60 }}>
          Nenhuma entrada cadastrada ainda.
        </p>
      )}

      {entries.length > 0 && (
        <div className="sys-shell">
          <aside className="sys-toc">
            <h4 className="sys-toc-title">Sumário</h4>
            <ol>
              {entries.map(e => (
                <li
                  key={e.id}
                  className={active === e.id ? 'active' : ''}
                  onClick={() => scrollTo(e.id)}
                >
                  <span className="sys-toc-date">{e.date_short || e.date_long || '—'}</span>
                  <span className="sys-toc-title-text">{e.title}</span>
                </li>
              ))}
            </ol>
          </aside>
          <div className="sys-feed">
            {entries.map(e => (
              <SystemEntry
                key={e.id}
                entry={e}
                isEditor={isEditor}
                onEdit={() => setModal(e)}
              />
            ))}
          </div>
        </div>
      )}

      {modal && (
        <SystemEntryModal
          entry={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

window.Sistema = Sistema;
