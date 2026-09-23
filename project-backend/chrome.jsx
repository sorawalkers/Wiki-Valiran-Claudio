// Chrome — header "Vitral" (navegação em 5 seções), busca, menu inferior mobile

const { useState } = React;

// Rota → seção do header. Rotas compostas ("character:x") usam a parte antes do ":".
const NAV_SECTION_OF = {
  pantheon: 'panteao', deity: 'panteao', article: 'panteao',
  factions: 'casas', faction: 'casas',
  characters: 'almas', character: 'almas', npcs: 'almas', npc: 'almas',
  sessions: 'cronicas', session: 'cronicas', timeline: 'cronicas', events: 'cronicas',
  recent: 'cronicas', campanha1: 'cronicas', campanha2: 'cronicas', campanha3: 'cronicas', rogue1: 'cronicas',
  map: 'atlas', kingdoms: 'atlas',
  'house-rules': 'mais', sistema: 'mais',
};

function navSectionOf(active) {
  return NAV_SECTION_OF[(active || '').split(':')[0]] || null;
}

function navVisibleItems(items, isAdmin) {
  return items.filter(it => !it.adminOnly || isAdmin);
}

function lastSession() {
  const id = Data.sessionIds && Data.sessionIds[0];
  return id ? Entities.sessions[id] : null;
}

// ── Busca ────────────────────────────────────────────────────────
function useArchiveSearch(onNav) {
  const [query, setQuery] = React.useState('');
  const [open, setOpen]   = React.useState(false);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
        requestAnimationFrame(() => inputRef.current?.focus());
      }
      if (e.key === 'Escape') { setOpen(false); setQuery(''); inputRef.current?.blur(); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  function getResults(q) {
    if (!q.trim()) return [];
    const lower = q.toLowerCase();
    const results = [];

    (Data.charIds || []).forEach(id => {
      const c = Entities.characters[id];
      if (!c) return;
      if (c.name?.toLowerCase().includes(lower) || c.role?.toLowerCase().includes(lower)) {
        results.push({ type: 'Personagem', label: c.name, sub: c.role, target: 'character:' + c.id });
      }
    });

    Object.values(Entities.deities).forEach(d => {
      if (!d?.name) return;
      if (d.name.toLowerCase().includes(lower) || d.epithet?.toLowerCase().includes(lower)) {
        results.push({ type: 'Divindade', label: d.name, sub: d.epithet, target: 'deity:' + d.id });
      }
    });

    (Data.sessionIds || []).forEach(id => {
      const s = Entities.sessions[id];
      if (!s) return;
      if (s.title?.toLowerCase().includes(lower) || s.summary?.toLowerCase().includes(lower)) {
        results.push({ type: 'Sessão', label: `S${s.num} · ${s.title}`, sub: s.summary, target: 'session:' + s.num });
      }
    });

    return results.slice(0, 8);
  }

  function pick(target) {
    onNav(target);
    setQuery('');
    setOpen(false);
    inputRef.current?.blur();
  }

  return { query, setQuery, open, setOpen, inputRef, results: getResults(query), pick };
}

function SearchBox({ search, autoFocus }) {
  const { query, setQuery, open, setOpen, inputRef, results, pick } = search;
  return (
    <div className="mast-search-wrap">
      <div className={'mast-search' + (open ? ' is-open' : '')}>
        <input
          ref={inputRef}
          autoFocus={autoFocus}
          placeholder="Buscar no arquivo"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
        />
        {!query && <span className="mast-search-kbd">Ctrl K</span>}
      </div>
      {open && results.length > 0 && (
        <div className="mast-search-results">
          {results.map((r, i) => (
            <div key={i} className="mast-search-result" onMouseDown={() => pick(r.target)}>
              <span className="mast-search-result-type">{r.type}</span>
              <span className="mast-search-result-label">{r.label}</span>
              {r.sub && <span className="mast-search-result-sub">{r.sub}</span>}
            </div>
          ))}
        </div>
      )}
      {open && query.trim() && results.length === 0 && (
        <div className="mast-search-results mast-search-results--empty">Nenhum resultado para "{query}"</div>
      )}
    </div>
  );
}

// ── Header (desktop) + barra compacta (mobile) ──────────────────
function Topbar({ onNav, active }) {
  const { isAdmin } = useAuth();
  const search = useArchiveSearch(onNav);
  const [mobileSearch, setMobileSearch] = React.useState(false);
  const current = navSectionOf(active);
  const s = lastSession();

  const go = id => { onNav(id); if (document.activeElement) document.activeElement.blur(); };

  return (
    <header className="mast">
      <nav className="mast-nav">
        {[...Data.topnav, Data.moreNav].map(sec => {
          const items = navVisibleItems(sec.items, isAdmin);
          return (
            <div key={sec.id} className={'mast-nav-item' + (current === sec.id ? ' active' : '')}>
              <button type="button" className="mast-nav-link" onClick={() => go(sec.home)}>{sec.label}</button>
              {items.length > 1 && (
                <div className="mast-nav-menu">
                  {items.map(it => (
                    <a key={it.id} className={active === it.id ? 'active' : ''} onClick={() => go(it.id)}>{it.label}</a>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <button type="button" className="mast-back" onClick={() => window.history.back()} aria-label="Voltar">←</button>

      <a className="mast-logo" onClick={() => onNav('home')}>
        <span aria-hidden="true">✠</span> Valiran <span className="mast-logo-tail" aria-hidden="true">✠</span>
      </a>

      <div className="mast-right">
        <SearchBox search={search} />
        {s && (
          <a className="mast-session" title={'Última sessão · ' + (s.title || '')} onClick={() => onNav('session:' + s.num)}>
            S{s.num}
          </a>
        )}
        <button className="mast-icon" title="Exportar página para PDF" onClick={() => window.PdfExport.export(active)}><Sigil.PdfExport /></button>
        <AuthButton />
      </div>

      <button type="button" className="mast-search-toggle" onClick={() => setMobileSearch(v => !v)}>
        {mobileSearch ? 'Fechar' : 'Buscar'}
      </button>
      {mobileSearch && (
        <div className="mast-mobile-search">
          <SearchBox search={{ ...search, pick: t => { search.pick(t); setMobileSearch(false); } }} autoFocus />
        </div>
      )}
    </header>
  );
}

// ── Menu inferior (mobile) + folha "Mais" ───────────────────────
function BottomNav({ onNav, active }) {
  const { isAdmin } = useAuth();
  const [sheet, setSheet] = React.useState(false);
  const current = navSectionOf(active);
  const [page] = (active || '').split(':');
  const byId = Object.fromEntries(Data.topnav.map(s => [s.id, s]));
  const go = id => { setSheet(false); onNav(id); };
  const tabs = [
    { id: 'inicio', label: 'Início', home: 'home', on: page === 'home' },
    { id: 'almas', label: 'Almas', home: byId.almas.home, on: current === 'almas' },
    { id: 'cronicas', label: 'Crônicas', home: byId.cronicas.home, on: current === 'cronicas' },
    { id: 'atlas', label: 'Atlas', home: byId.atlas.home, on: current === 'atlas' },
  ];
  const moreOn = sheet || current === 'panteao' || current === 'casas' || current === 'mais';

  return (
    <React.Fragment>
      {sheet && (
        <div className="bnav-sheet" onClick={() => setSheet(false)}>
          <div className="bnav-sheet-panel" onClick={e => e.stopPropagation()}>
            {[...Data.topnav, Data.moreNav].map(sec => (
              <div key={sec.id} className="bnav-sheet-sec">
                <div className="bnav-sheet-label">{sec.label}</div>
                {navVisibleItems(sec.items, isAdmin).map(it => (
                  <a key={it.id} className={active === it.id ? 'active' : ''} onClick={() => go(it.id)}>{it.label}</a>
                ))}
              </div>
            ))}
            <div className="bnav-sheet-foot">
              <button className="mast-icon" title="Exportar página para PDF" onClick={() => { setSheet(false); window.PdfExport.export(active); }}><Sigil.PdfExport /></button>
              <AuthButton />
            </div>
          </div>
        </div>
      )}
      <nav className="bnav">
        {tabs.map(t => (
          <a key={t.id} className={t.on && !sheet ? 'active' : ''} onClick={() => go(t.home)}>{t.label}</a>
        ))}
        <a className={moreOn ? 'active' : ''} onClick={() => setSheet(v => !v)}>Mais</a>
      </nav>
    </React.Fragment>
  );
}

window.Topbar = Topbar;
window.BottomNav = BottomNav;
