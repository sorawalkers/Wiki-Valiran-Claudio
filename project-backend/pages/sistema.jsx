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
// ============================================================
// Atualizações do sistema no tema vitral: grimório de cartas
// "New Domain Card - Frost Cone, Level 2 (Arcana)" → { status, kind, name, level, domain }
// ============================================================
const SYS_DOMAIN_PANE = {
  arcana: '#7a5aa8', blade: '#9a2a24', bone: '#8a8070', codex: '#3f6a86', grace: '#b0507a',
  midnight: '#2c3a66', sage: '#56673a', splendor: '#b8873a', valor: '#c0662a',
};
function sysParseTitle(t) {
  const m = /^(new|updated|nova|nov[oa]|atualizad[ao])\s+(.+?)\s*[-–—]\s*(.+)$/i.exec(t || '');
  if (!m) return { status: null, kind: 'Entrada', name: t || '', level: null, domain: null };
  const status = /upd|atual/i.test(m[1]) ? 'Atualizada' : 'Nova';
  const kindRaw = m[2].trim();
  const kind = /domain card/i.test(kindRaw) ? 'Carta de domínio' : /subclass/i.test(kindRaw) ? 'Subclasse' : kindRaw;
  let rest = m[3].trim(), domain = null, level = null;
  const dm = /\(([^)]+)\)\s*$/.exec(rest);
  if (dm) { domain = dm[1].trim(); rest = rest.slice(0, dm.index).trim(); }
  const lm = /,?\s*level\s*(\d+)\s*$/i.exec(rest);
  if (lm) { level = +lm[1]; rest = rest.slice(0, lm.index).trim(); }
  return { status, kind, name: rest.replace(/,\s*$/, ''), level, domain };
}
const sysPane = d => SYS_DOMAIN_PANE[String(d || '').toLowerCase()] || '#8a8070';

function useSysImage(entryId, idx = 0) {
  return useVtSlotUrl(`sys-img-${entryId}-${idx}`);
}

function SysCard({ e, onOpen, isEditor, onEdit }) {
  const p = sysParseTitle(e.title);
  const img = useSysImage(e.id);
  return (
    <article className="sys-card" style={{ '--pane': sysPane(p.domain) }} onClick={() => onOpen(e)}>
      <div className="sys-card-art">
        {img ? <img src={img} alt={e.title} loading="lazy" draggable="false" />
             : <div className="sys-card-noart"><span>{(p.name || '?').charAt(0)}</span></div>}
        {p.status && <span className={'sys-card-status' + (p.status === 'Atualizada' ? ' is-upd' : '')}>{p.status}</span>}
      </div>
      <div className="sys-card-plate">
        <div className="sys-card-name">{p.name}</div>
        <div className="sys-card-meta">
          {p.domain && <span className="sys-card-domain"><i />{p.domain}</span>}
          {p.level != null && <span className="sys-card-level">Nível {p.level}</span>}
        </div>
      </div>
      {isEditor && <button className="vt-btn sys-card-edit" onClick={ev => { ev.stopPropagation(); onEdit(e); }}>Editar</button>}
    </article>
  );
}

function SysLightbox({ e, onClose }) {
  const p = sysParseTitle(e.title);
  const img = useSysImage(e.id);
  const blocks = parseSystemBody(e.body);
  React.useEffect(() => {
    const k = ev => { if (ev.key === 'Escape') onClose(); };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, []);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box sys-lightbox" style={{ '--pane': sysPane(p.domain) }} onClick={ev => ev.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-eyebrow">{[p.status, p.kind, e.date_long || e.date_short].filter(Boolean).join(' · ')}</div>
          <h2 className="modal-title">{p.name}</h2>
          <div className="sys-card-meta sys-lightbox-meta">
            {p.domain && <span className="sys-card-domain"><i />{p.domain}</span>}
            {p.level != null && <span className="sys-card-level">Nível {p.level}</span>}
          </div>
        </div>
        <div className="modal-body sys-lightbox-body">
          {img && <img className="sys-lightbox-img" src={img} alt={e.title} />}
          {blocks.filter(b => b.kind === 'para').map((b, i) => <p key={i}>{b.text}</p>)}
          {blocks.filter(b => b.kind === 'img' && b.index > 0).map(b => (
            <SystemFigure key={b.index} entryId={e.id} idx={b.index} caption={b.caption} />
          ))}
          {e.compact && e.line && <p>{e.line}</p>}
        </div>
        <div className="modal-foot"><button className="btn-cancel" onClick={onClose}>Fechar</button></div>
      </div>
    </div>
  );
}

function Sistema({ onNav }) {
  const { isEditor } = useAuth();
  const [modal, setModal] = React.useState(null);
  const [open, setOpen] = React.useState(null);
  const [kind, setKind] = React.useState('todos');
  const [domain, setDomain] = React.useState('todos');
  const [q, setQ] = React.useState('');
  const [, setTick] = React.useState(0);

  React.useEffect(() => {
    const refresh = () => setTick(t => t + 1);
    window.addEventListener('db-refresh', refresh);
    return () => window.removeEventListener('db-refresh', refresh);
  }, []);

  const entries = (Data.systemEntries || []).slice()
    .sort((a, b) => (b.sort_order || 0) - (a.sort_order || 0))
    .map(e => ({ e, p: sysParseTitle(e.title) }));

  const count = (key, fn) => entries.filter(fn).length;
  const kinds = Array.from(new Set(entries.map(x => x.p.kind)));
  const domains = Array.from(new Set(entries.map(x => x.p.domain).filter(Boolean))).sort();
  const nq = q.trim().toLowerCase();
  const shown = entries.filter(({ e, p }) =>
    (kind === 'todos' || p.kind === kind) &&
    (domain === 'todos' || p.domain === domain) &&
    (!nq || [e.title, e.body, e.line].some(t => String(t || '').toLowerCase().includes(nq))));

  // agrupa por data (as entradas já vêm da mais nova para a mais antiga)
  const groups = [];
  shown.forEach(x => {
    const key = x.e.date_long || x.e.date_short || 'Sem data';
    if (!groups.length || groups[groups.length - 1].key !== key) groups.push({ key, items: [] });
    groups[groups.length - 1].items.push(x);
  });

  const filtersActive = kind !== 'todos' || domain !== 'todos';

  return (
    <div className="vt vt-pantheon sys-vt" data-screen-label="15 Sistema">
      <section className="vt-pantheon-head">
        <img className="vt-hero-rose" src={vtAsset('rosacea.svg')} alt="" aria-hidden="true" draggable="false" />
        <div className="vt-pantheon-head-text">
          <div className="vt-label">Mesa · Caderno do mestre</div>
          <h1 className="vt-h1">Atualizações do Sistema</h1>
          <div className="vt-epithet">O grimório da mesa</div>
          <p className="vt-pantheon-lede">
            Cartas de domínio, subclasses, ajustes de regra e erratas, na ordem em que entraram no jogo.
            Abra uma carta para vê-la inteira.
          </p>
        </div>
        {isEditor && (
          <div className="vt-pantheon-add">
            <button className="vt-btn vt-btn--gold" onClick={() => setModal('new')}>+ Nova entrada</button>
          </div>
        )}
      </section>

      {entries.length > 0 && (
        <VtFilterBar
          groups={[
            { label: 'Tipo', value: kind, onChange: setKind, options: [
              { value: 'todos', label: 'Todos', count: entries.length },
              ...kinds.map(k => ({ value: k, label: k, count: count(k, x => x.p.kind === k) })),
            ] },
            ...(domains.length ? [{ label: 'Domínio · classe', value: domain, onChange: setDomain, options: [
              { value: 'todos', label: 'Todos', count: entries.length },
              ...domains.map(d => ({ value: d, label: d, count: count(d, x => x.p.domain === d), pane: sysPane(d) })),
            ] }] : []),
          ]}
          active={filtersActive}
          onReset={() => { setKind('todos'); setDomain('todos'); }}>
          <div className="vt-filter-tools">
            <input className="vt-filter-search" type="search" placeholder="Buscar carta ou regra…" value={q} onChange={e => setQ(e.target.value)} />
            <span className="vt-filter-count">{shown.length}{shown.length !== entries.length ? ' / ' + entries.length : ''}</span>
          </div>
        </VtFilterBar>
      )}

      {entries.length === 0 && <p className="vt-pantheon-empty">Nenhuma entrada cadastrada ainda.</p>}
      {entries.length > 0 && shown.length === 0 && <p className="vt-pantheon-empty">Nenhuma entrada corresponde aos filtros.</p>}

      {groups.map(g => (
        <section key={g.key} className="vh-section sys-group">
          <header className="vh-head">
            <span className="vh-head-num">✠</span>
            <h2 className="vh-head-title">{g.key}</h2>
            <span className="vev-count">{g.items.length} {g.items.length === 1 ? 'entrada' : 'entradas'}</span>
          </header>
          <div className="sys-grid">
            {g.items.map(({ e }) => (
              <SysCard key={e.id} e={e} onOpen={setOpen} isEditor={isEditor} onEdit={setModal} />
            ))}
          </div>
        </section>
      ))}

      <footer className="vt-pantheon-foot">
        “Toda regra nasce de uma discussão à mesa. As boas sobrevivem à segunda.”
        <div className="vt-quote-src">— Anotação do mestre</div>
      </footer>

      {open && <SysLightbox e={open} onClose={() => setOpen(null)} />}
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
