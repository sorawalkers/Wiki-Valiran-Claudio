// Character detail — dossier layout (reuses NpDetail infrastructure)

const { useState: useChState, useEffect: useChEffect, useMemo: useChMemo, useRef: useChRef } = React;

function CharacterDetail({ id, onNav }) {
  const { isEditor } = useAuth();
  const [editModal, setEditModal]   = useChState(false);
  const [openSet, setOpenSet]       = useChState(() => new Set([0]));
  const [query, setQuery]           = useChState('');
  const [tagFilter, setTagFilter]   = useChState(null);
  const [viewMode, setViewMode]     = useChState('list');

  const reportRefs = useChRef({});

  const c = Entities.characters[id];

  // All hooks must run before any early return (Rules of Hooks)
  const sections = c ? (c.sections || []) : [];
  const nq = npNorm(query);

  const allTags = useChMemo(() =>
    Array.from(new Set(sections.flatMap(s => s.tags || []))),
    [sections]
  );

  const filtered = useChMemo(() =>
    sections.map((sec, i) => ({ sec, i, matches: npSectionMatches(sec, nq, tagFilter) })),
    [sections, nq, tagFilter]
  );
  const visibleFiltered = filtered.filter(f => f.matches);

  useChEffect(() => {
    if (!nq) return;
    const matching = filtered.filter(f => f.matches).map(f => f.i);
    setOpenSet(prev => new Set([...prev, ...matching]));
  }, [nq]);

  if (!c) {
    const isLoading = Object.keys(Entities.characters).length === 0;
    return (
      <div className="page">
        <button className="back-btn" onClick={() => onNav('characters')}>
          Voltar à galeria
        </button>
        {isLoading
          ? <p className="page-lede" style={{ marginTop: 40, textAlign: 'center', fontStyle: 'italic' }}>Carregando…</p>
          : <h1 className="page-title">Personagem não encontrado</h1>
        }
      </div>
    );
  }

  function toggleReport(idx) {
    setOpenSet(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  }

  function expandAll()  { setOpenSet(new Set(sections.map((_, i) => i))); }
  function collapseAll(){ setOpenSet(new Set()); }

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

  const campaignShort = c.campaign
    ? c.campaign.split(/[—–-]/)[0].trim().toUpperCase()
    : '';

  return (
    <div className="article np-dossier" data-screen-label={'PC · ' + c.name}>

      {/* ── LEFT: Parchment body ─────────────────────────────── */}
      <div className="parchment" style={{ minWidth: 0 }}>
        <div className="article-body np-body">

          <div className="np-topbar">
            <button className="back-btn" style={{ marginBottom: 0 }} onClick={() => onNav('characters')}>
              Voltar à galeria
            </button>
            {isEditor && (
              <button className="editor-add-btn" onClick={() => setEditModal(true)}>
                Editar Artigo
              </button>
            )}
          </div>

          <nav className="breadcrumb">
            <a onClick={() => onNav('home')}>Arquivo</a>
            <span className="sep">▸</span>
            <a onClick={() => onNav('characters')}>Dramatis Personae</a>
            <span className="sep">▸</span>
            <span>{c.name}</span>
          </nav>

          <div className="np-header">
            <h1 className="np-title">{c.name}</h1>
            {c.role && <p className="np-subtitle">{c.role}</p>}
          </div>

          <div className="article-divider"><Sigil.Ornament /></div>

          {c.hero && <p className="detail-hero">{c.hero}</p>}

          {c.placeholder && (
            <div className="placeholder-banner" style={{
              background: 'rgba(120,90,50,0.04)',
              border: '1px dashed var(--parchment-rule)',
              color: 'var(--parchment-text)',
            }}>
              <div className="placeholder-banner-eyebrow" style={{ color: 'var(--wine)' }}>Em compilação</div>
              <h3 style={{ color: 'var(--parchment-text)' }}>Esta entrada ainda está sendo transcrita</h3>
              <p style={{ color: 'var(--parchment-text-soft)' }}>O arquivista Cael reuniu o esqueleto desta entrada. Biografia detalhada, personalidade e eventos serão acrescentados nas próximas sessões.</p>
            </div>
          )}

          {!c.placeholder && sections.length > 0 && (
            <React.Fragment>
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
                    <button className="np-toolbar-search-clear" onClick={() => setQuery('')}>Limpar</button>
                  )}
                </div>
                <button className="np-toolbar-btn" title="Expandir tudo" onClick={expandAll}><NpExpandIcon /></button>
                <button className="np-toolbar-btn" title="Recolher tudo" onClick={collapseAll}><NpCollapseIcon /></button>
                <div className="np-toolbar-divider" />
                <button className={'np-toolbar-btn' + (viewMode === 'list' ? ' active' : '')} title="Vista lista" onClick={() => setViewMode('list')}><NpListIcon /></button>
                <button className={'np-toolbar-btn' + (viewMode === 'grid' ? ' active' : '')} title="Vista grade" onClick={() => setViewMode('grid')}><NpGridIcon /></button>
              </div>

              {allTags.length > 0 && (
                <div className="np-tag-filter">
                  <span className="np-tag-filter-label">Filtrar:</span>
                  <button className={'np-tag-pill' + (!tagFilter ? ' active' : '')} onClick={() => setTagFilter(null)}>Tudo</button>
                  {allTags.map(t => (
                    <button key={t} className={'np-tag-pill' + (tagFilter === t ? ' active' : '')} onClick={() => setTagFilter(prev => prev === t ? null : t)}>{t}</button>
                  ))}
                </div>
              )}

              {visibleFiltered.length === 0 ? (
                <div className="np-empty"><strong>Nada encontrado</strong>Nenhum relatório corresponde à busca ou ao filtro ativo.</div>
              ) : viewMode === 'list' ? (
                <div className="np-reports">
                  {visibleFiltered.map(({ sec, i }) => (
                    <NpReport key={i} sec={sec} idx={i} isOpen={openSet.has(i)} query={query} onToggle={() => toggleReport(i)} reportRef={el => { reportRefs.current[i] = el; }} />
                  ))}
                </div>
              ) : (
                <NpGrid sections={visibleFiltered.map(f => f.sec)} onSelect={localIdx => handleGridSelect(visibleFiltered[localIdx].i)} />
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
              <span className={'infobox-portrait-tag ' + (c.tagClass || '')} style={{ zIndex: 2 }}>{c.tag}</span>
            </div>
            <h3 className="infobox-name">{c.name}</h3>
            <p className="infobox-sub">{c.role}</p>
          </div>
          {c.infobox && c.infobox.rows && c.infobox.rows.length > 0 && (
            <dl className="infobox-rows">
              {c.infobox.rows.map(r => (
                <div key={r.k} className="infobox-row">
                  <dt>{r.k}</dt>
                  <dd className={r.danger ? 'danger' : r.ok ? 'ok' : ''}>
                    {r.link
                      ? <span className="infobox-link" onClick={() => onNav(r.link)}>{r.v}</span>
                      : r.v}
                  </dd>
                </div>
              ))}
            </dl>
          )}
          {c.infobox && c.infobox.statusNote && (
            <div className="infobox-status">
              <strong>NOTA</strong><br />{c.infobox.statusNote}
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

      {editModal && (
        <ArticleEditor type="character" entity={c} onClose={() => setEditModal(false)} onDelete={() => onNav('characters')} />
      )}
    </div>
  );
}

window.CharacterDetail = CharacterDetail;
