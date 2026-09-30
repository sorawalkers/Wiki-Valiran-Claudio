// NPC detail page + helpers do dossiê (Np*) compartilhados com factions.jsx

const { useState: useNpcState } = React;

// ── Icons ────────────────────────────────────────────────────────
function NpPinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

function NpScrollIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="9" y1="13" x2="15" y2="13"/>
      <line x1="9" y1="17" x2="12" y2="17"/>
    </svg>
  );
}

function NpClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}

function NpChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
}

function NpListIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
      <line x1="8" y1="18" x2="21" y2="18"/>
      <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/>
      <line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  );
}

function NpGridIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
    </svg>
  );
}

function NpExpandIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
      <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
    </svg>
  );
}

function NpCollapseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/>
      <line x1="10" y1="14" x2="3" y2="21"/><line x1="14" y1="10" x2="21" y2="3"/>
    </svg>
  );
}

function NpSearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );
}

// ── Helpers ──────────────────────────────────────────────────────

// Accent-strip + lowercase for search
function npNorm(s) {
  if (!s) return '';
  return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

// Highlight query match inside text → React nodes
function npHighlight(text, query) {
  if (!query || !text) return text;
  const nq = npNorm(query);
  const nt = npNorm(String(text));
  const out = [];
  let i = 0;
  while (i < nt.length) {
    const idx = nt.indexOf(nq, i);
    if (idx < 0) { out.push(String(text).slice(i)); break; }
    if (idx > i) out.push(String(text).slice(i, idx));
    out.push(
      <mark key={'m' + idx} className="np-highlight">
        {String(text).slice(idx, idx + query.length)}
      </mark>
    );
    i = idx + query.length;
  }
  return out.length === 1 && typeof out[0] === 'string' ? out[0] : out;
}

// Replace [REDIGIDO] tokens with redaction bar spans
function npRenderRedacted(text) {
  if (!text || !text.includes('[REDIGIDO]')) return text;
  return text.split('[REDIGIDO]').reduce((acc, part, i) => {
    if (i === 0) return [part];
    return [...acc, <span key={i} className="np-redacted" aria-label="Redigido">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>, part];
  }, []);
}

// Sigil glyph mapping (unicode)
function npSigilGlyph(sigil) {
  const map = { Crown: '♛', Sun: '☀', Flame: '🜂', Sword: '⚔', Chain: '⛓', Eye: '👁' };
  return map[sigil] || '✦';
}

// Does a section match query + tag filter?
function npSectionMatches(sec, nq, tagFilter) {
  if (tagFilter && !(sec.tags || []).includes(tagFilter)) return false;
  if (!nq) return true;
  const hay = [
    sec.title, sec.eyebrow, sec.location, sec.session, sec.date,
    ...(sec.tags || []),
    ...(sec.paras || []),
  ].filter(Boolean).map(npNorm).join(' ');
  return hay.includes(nq);
}

// ── NpReport ─────────────────────────────────────────────────────

function NpReport({ sec, idx, isOpen, query, onToggle, reportRef }) {
  return (
    <article
      className={'np-report' + (isOpen ? ' open' : '')}
      id={'np-report-' + idx}
      ref={reportRef}
    >
      <header className="np-report-head" onClick={onToggle}>
        <div className="np-report-chevron">
          <NpChevronIcon />
        </div>
        <div className="np-report-head-main">
          {sec.eyebrow && (
            <div className="np-report-eyebrow">{sec.eyebrow}</div>
          )}
          <h2 className="np-report-title">
            {npHighlight(sec.title, query)}
          </h2>
          {(sec.location || sec.session || sec.date) && (
            <div className="np-report-meta">
              {sec.location && (
                <span className="np-report-meta-item">
                  <NpPinIcon />{npHighlight(sec.location, query)}
                </span>
              )}
              {sec.session && (
                <span className="np-report-meta-item">
                  <NpScrollIcon />{sec.session}
                </span>
              )}
              {sec.date && (
                <span className="np-report-meta-item">
                  <NpClockIcon />{sec.date}
                </span>
              )}
            </div>
          )}
        </div>
        {sec.tags && sec.tags.length > 0 && (
          <div className="np-report-tags">
            {sec.tags.map(t => (
              <span key={t} className="np-tag">{t}</span>
            ))}
          </div>
        )}
      </header>

      {isOpen && (
        <div className="np-report-body">
          {(sec.paras || []).map((p, i) => (
            <p key={i}>
              {sec.redacted ? npRenderRedacted(p) : npHighlight(p, query)}
            </p>
          ))}
        </div>
      )}
    </article>
  );
}

// ── NpGrid ───────────────────────────────────────────────────────

function NpGrid({ sections, onSelect }) {
  return (
    <div className="np-grid">
      {sections.map((sec, i) => (
        <div key={i} className="np-grid-card" onClick={() => onSelect(i)}>
          <div className="np-grid-card-num">{String(i + 1).padStart(2, '0')}</div>
          <h3 className="np-grid-card-title">{sec.title}</h3>
          {sec.tags && sec.tags.length > 0 && (
            <div className="np-grid-card-tags">
              {sec.tags.map(t => (
                <span key={t} className="np-tag np-tag--sm">{t}</span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── NpcDetail ────────────────────────────────────────────────────
// Artigo "Vitral" (ver vitral.jsx). Os helpers Np* acima continuam em uso por factions.jsx.

function NpcDetail({ id, onNav }) {
  const { isEditor } = useAuth();
  const [editModal, setEditModal] = useNpcState(false);
  const c = Entities.characters[id];

  if (!c) {
    const isLoading = Object.keys(Entities.characters).length === 0;
    return (
      <div className="page">
        <button className="back-btn" onClick={() => onNav('npcs')}>
          Voltar à galeria
        </button>
        {isLoading
          ? <p className="page-lede" style={{ marginTop: 40, textAlign: 'center', fontStyle: 'italic' }}>Carregando…</p>
          : <h1 className="page-title">Pessoa não encontrada</h1>
        }
      </div>
    );
  }

  return (
    <React.Fragment>
      <VitralArticle
        c={c}
        onNav={onNav}
        backTo="npcs"
        backLabel="Pessoas importantes"
        isEditor={isEditor}
        onEdit={() => setEditModal(true)}
      />
      {editModal && (
        <ArticleEditor type="character" entity={c} onClose={() => setEditModal(false)} onDelete={() => onNav('npcs')} />
      )}
    </React.Fragment>
  );
}

window.NpcDetail = NpcDetail;

// Expose shared helpers for factions.jsx
window.npNorm            = npNorm;
window.npHighlight       = npHighlight;
window.npSectionMatches  = npSectionMatches;
window.NpReport          = NpReport;
window.NpGrid            = NpGrid;
window.NpPinIcon         = NpPinIcon;
window.NpScrollIcon      = NpScrollIcon;
window.NpClockIcon       = NpClockIcon;
window.NpChevronIcon     = NpChevronIcon;
window.NpListIcon        = NpListIcon;
window.NpGridIcon        = NpGridIcon;
window.NpExpandIcon      = NpExpandIcon;
window.NpCollapseIcon    = NpCollapseIcon;
window.NpSearchIcon      = NpSearchIcon;
