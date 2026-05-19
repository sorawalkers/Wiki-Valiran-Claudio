// NPC detail page — dossier redesign (Variation A Refined)

const { useState: useNpcState, useEffect: useNpcEffect, useMemo: useNpcMemo, useRef: useNpcRef, useCallback: useNpcCallback } = React;

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

function NpcDetail({ id, onNav }) {
  const { isEditor } = useAuth();
  const [editModal, setEditModal] = useNpcState(false);

  // Interactivity state
  const [openSet, setOpenSet] = useNpcState(() => new Set([0]));
  const [query, setQuery] = useNpcState('');
  const [tagFilter, setTagFilter] = useNpcState(null);
  const [viewMode, setViewMode] = useNpcState('list');

  const reportRefs = useNpcRef({});

  const c = Entities.characters[id];

  if (!c) {
    return (
      <div className="page">
        <button className="back-btn" onClick={() => onNav('npcs')}>
          Voltar à galeria
        </button>
        <h1 className="page-title">Pessoa não encontrada</h1>
      </div>
    );
  }

  const sections = c.sections || [];
  const nq = npNorm(query);

  // All unique tags across all sections
  const allTags = useNpcMemo(() =>
    Array.from(new Set(sections.flatMap(s => s.tags || []))),
    [sections]
  );

  // Filtered sections
  const filtered = useNpcMemo(() =>
    sections.map((sec, i) => ({ sec, i, matches: npSectionMatches(sec, nq, tagFilter) })),
    [sections, nq, tagFilter]
  );
  const visibleFiltered = filtered.filter(f => f.matches);

  // Auto-expand matching sections when query changes
  useNpcEffect(() => {
    if (!nq) return;
    const matching = filtered.filter(f => f.matches).map(f => f.i);
    setOpenSet(prev => new Set([...prev, ...matching]));
  }, [nq]);

  function toggleReport(idx) {
    setOpenSet(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  }

  function expandAll() { setOpenSet(new Set(sections.map((_, i) => i))); }
  function collapseAll() { setOpenSet(new Set()); }

  function handleGridSelect(idx) {
    setViewMode('list');
    setOpenSet(prev => new Set([...prev, idx]));
    requestAnimationFrame(() => {
      const el = reportRefs.current[idx];
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        el.classList.add('pulse');
        setTimeout(() => el.classList.remove('pulse'), 700);
      }
    });
  }

  // Campaign short label (before dash/em-dash)
  const campaignShort = c.campaign
    ? c.campaign.split(/[—–-]/)[0].trim().toUpperCase()
    : '';

  return (
    <div className="article np-dossier" data-screen-label={'NPC · ' + c.name}>

      {/* ── LEFT: Parchment body ─────────────────────────────── */}
      <div className="parchment" style={{ minWidth: 0 }}>
        <div className="article-body np-body">

          {/* Top bar */}
          <div className="np-topbar">
            <button className="back-btn" style={{ marginBottom: 0 }} onClick={() => onNav('npcs')}>
              Voltar à galeria
            </button>
            {isEditor && (
              <button className="editor-add-btn" onClick={() => setEditModal(true)}>
                Editar Artigo
              </button>
            )}
          </div>

          {/* Breadcrumb */}
          <nav className="breadcrumb">
            <a onClick={() => onNav('home')}>Arquivo</a>
            <span className="sep">▸</span>
            <a onClick={() => onNav('npcs')}>Pessoas Importantes</a>
            <span className="sep">▸</span>
            <span>{c.name}</span>
          </nav>

          {/* Dossier header */}
          <div className="np-header">
            <h1 className="np-title">{c.name}</h1>
            {c.role && <p className="np-subtitle">{c.role}</p>}
          </div>

          {/* Divider */}
          <div className="article-divider">
            <Sigil.Ornament />
          </div>

          {/* Hero quote */}
          {c.hero && <p className="detail-hero">{c.hero}</p>}

          {/* Placeholder */}
          {c.placeholder && (
            <div className="placeholder-banner" style={{
              background: 'rgba(120,90,50,0.04)',
              border: '1px dashed var(--parchment-rule)',
              color: 'var(--parchment-text)',
            }}>
              <div className="placeholder-banner-eyebrow" style={{ color: 'var(--wine)' }}>
                Em compilação
              </div>
              <h3 style={{ color: 'var(--parchment-text)' }}>
                Esta entrada ainda está sendo transcrita
              </h3>
              <p style={{ color: 'var(--parchment-text-soft)' }}>
                O arquivista Cael reuniu o esqueleto desta entrada. Relatórios completos serão acrescentados nas próximas sessões.
              </p>
            </div>
          )}

          {!c.placeholder && sections.length > 0 && (
            <React.Fragment>
              {/* Sticky toolbar */}
              <div className="np-toolbar">
                <div className="np-toolbar-search">
                  <NpSearchIcon />
                  <input
                    type="text"
                    placeholder="Buscar por texto, local ou tag…"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                  />
                  {query && (
                    <button className="np-toolbar-search-clear" onClick={() => setQuery('')}>
                      Limpar
                    </button>
                  )}
                </div>

                <button className="np-toolbar-btn" title="Expandir tudo" onClick={expandAll}>
                  <NpExpandIcon />
                </button>
                <button className="np-toolbar-btn" title="Recolher tudo" onClick={collapseAll}>
                  <NpCollapseIcon />
                </button>

                <div className="np-toolbar-divider" />

                <button
                  className={'np-toolbar-btn' + (viewMode === 'list' ? ' active' : '')}
                  title="Vista lista"
                  onClick={() => setViewMode('list')}
                >
                  <NpListIcon />
                </button>
                <button
                  className={'np-toolbar-btn' + (viewMode === 'grid' ? ' active' : '')}
                  title="Vista grade"
                  onClick={() => setViewMode('grid')}
                >
                  <NpGridIcon />
                </button>
              </div>

              {/* Tag filter row */}
              {allTags.length > 0 && (
                <div className="np-tag-filter">
                  <span className="np-tag-filter-label">Filtrar:</span>
                  <button
                    className={'np-tag-pill' + (!tagFilter ? ' active' : '')}
                    onClick={() => setTagFilter(null)}
                  >
                    Tudo
                  </button>
                  {allTags.map(t => (
                    <button
                      key={t}
                      className={'np-tag-pill' + (tagFilter === t ? ' active' : '')}
                      onClick={() => setTagFilter(prev => prev === t ? null : t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}

              {/* Content: list or grid */}
              {visibleFiltered.length === 0 ? (
                <div className="np-empty">
                  <strong>Nada encontrado</strong>
                  Nenhum relatório corresponde à busca ou ao filtro ativo.
                </div>
              ) : viewMode === 'list' ? (
                <div className="np-reports">
                  {visibleFiltered.map(({ sec, i }) => (
                    <NpReport
                      key={i}
                      sec={sec}
                      idx={i}
                      isOpen={openSet.has(i)}
                      query={query}
                      onToggle={() => toggleReport(i)}
                      reportRef={el => { reportRefs.current[i] = el; }}
                    />
                  ))}
                </div>
              ) : (
                <NpGrid
                  sections={visibleFiltered.map(f => f.sec)}
                  onSelect={localIdx => {
                    // localIdx is within visibleFiltered; get the real idx
                    handleGridSelect(visibleFiltered[localIdx].i);
                  }}
                />
              )}
            </React.Fragment>
          )}

        </div>
      </div>

      {/* ── RIGHT: Infobox rail ──────────────────────────────── */}
      <aside className="infobox-rail">
        <div className="infobox">
          <div className="infobox-head">
            <div className="infobox-portrait-wrap">
              <image-slot
                id={'char-portrait-' + c.id}
                shape="rect"
                placeholder={'Retrato · ' + c.name}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
              ></image-slot>
              <span className={'infobox-portrait-tag ' + (c.tagClass || '')} style={{ zIndex: 2 }}>
                {c.tag}
              </span>
            </div>
            <h3 className="infobox-name">{c.name}</h3>
            <p className="infobox-sub">{c.role}</p>
          </div>

          {c.infobox && c.infobox.rows && c.infobox.rows.length > 0 && (
            <dl className="infobox-rows">
              {c.infobox.rows.map(r => (
                <div key={r.k} className="infobox-row">
                  <dt>{r.k}</dt>
                  <dd className={r.danger ? 'danger' : r.ok ? 'ok' : ''}>{r.v}</dd>
                </div>
              ))}
            </dl>
          )}

          {c.infobox && c.infobox.statusNote && (
            <div className="infobox-status">
              <strong>NOTA</strong><br />
              {c.infobox.statusNote}
            </div>
          )}
        </div>

        {c.related && c.related.length > 0 && (
          <div className="related">
            <h4 className="related-title">Cf. Relacionados</h4>
            {c.related.map(r => (
              <a key={r.title} className="related-link" onClick={() => onNav(r.target)}>
                <span className="related-link-tag">{r.tag}</span>
                <span className="related-link-title">{r.title}</span>
              </a>
            ))}
          </div>
        )}
      </aside>

      {/* ── Editor modal ─────────────────────────────────────── */}
      {editModal && (
        <ArticleEditor
          type="character"
          entity={c}
          onClose={() => setEditModal(false)}
          onDelete={() => onNav('npcs')}
        />
      )}
    </div>
  );
}

window.NpcDetail = NpcDetail;
