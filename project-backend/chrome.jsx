// Chrome — banner, topbar, sidebar

const { useState } = React;

function Banner() {
  return (
    <div className="banner">
      <div className="banner-left">
        <span className="banner-dot" />
        <span>Arquivo Aberto · Sessão de Consulta Pública</span>
      </div>
      <div className="banner-left">
        <span>Era Atual · 3ª Era, ano 1281 da Alvorada de Esmir</span>
      </div>
      <div className="banner-right">
        <span>Hora do Arquivo: 22:14</span>
        <span style={{opacity:0.5}}>·</span>
        <span>Lua: <span style={{color:'var(--gold-bright)'}}>Vassaela, minguante</span></span>
      </div>
    </div>
  );
}

function Topbar({ onNav }) {
  const [query, setQuery] = React.useState('');
  const [open, setOpen]   = React.useState(false);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
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

  const results = getResults(query);

  function pick(target) {
    onNav(target);
    setQuery('');
    setOpen(false);
    inputRef.current?.blur();
  }

  return (
    <div className="topbar">
      <div className="brand" onClick={() => onNav('home')} style={{cursor:'pointer'}}>
        <div className="brand-seal">
          <Sigil.Compass style={{width:'100%', height:'100%', color:'var(--gold)'}} />
        </div>
        <div className="brand-text">
          <span className="brand-title">O Arquivo</span>
          <span className="brand-sub">DE VALIRAN</span>
        </div>
      </div>

      <div className="search-wrap" style={{position:'relative'}}>
        <div className={`search${open ? ' search--open' : ''}`}>
          <Sigil.Search className="search-icon" />
          <input
            ref={inputRef}
            placeholder="Buscar divindades, personagens, sessões…"
            value={query}
            onChange={e => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
          />
          {!query && <span className="search-kbd">⌘ K</span>}
        </div>
        {open && results.length > 0 && (
          <div className="search-dropdown">
            {results.map((r, i) => (
              <div key={i} className="search-result" onMouseDown={() => pick(r.target)}>
                <span className="search-result-type">{r.type}</span>
                <span className="search-result-label">{r.label}</span>
                {r.sub && <span className="search-result-sub">{r.sub}</span>}
              </div>
            ))}
          </div>
        )}
        {open && query.trim() && results.length === 0 && (
          <div className="search-dropdown search-dropdown--empty">
            <span>Nenhum resultado para "{query}"</span>
          </div>
        )}
      </div>

      <div className="topbar-right">
        <button className="icon-btn" title="Marcadores"><Sigil.Bookmark /></button>
        <button className="icon-btn" title="Configurações"><Sigil.Settings /></button>
        <AuthButton />
      </div>
    </div>
  );
}

function Sidebar({ active, onNav }) {
  // Composite IDs like "character:kathryn" map to their root ("characters")
  const rootMap = { character: 'characters', deity: 'pantheon', session: 'sessions' };
  const [rootPart] = active.split(':');
  const activeRoot = rootMap[rootPart] || rootPart;

  return (
    <aside className="sidebar">
      {Data.nav.map(sec => (
        <div key={sec.section} className="nav-section">
          <div className="nav-section-title">{sec.section}</div>
          <ul className="nav-list">
            {sec.items.map(item => {
              const Icon = Sigil[item.icon];
              const isActive = activeRoot === item.id;
              return (
                <li
                  key={item.id}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => onNav(item.id)}
                >
                  <span className="nav-item-icon">
                    {Icon && <Icon />}
                  </span>
                  <span>{item.label}</span>
                  {item.badge && <span className="nav-badge">{item.badge}</span>}
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      <div className="sidebar-footer">
        <div className="session-callout" onClick={() => onNav('sessions')} style={{cursor:'pointer'}}>
          <div className="session-callout-eyebrow">↳ Última sessão</div>
          <div className="session-callout-title">As Marcas no Pântano</div>
          <div className="session-callout-meta">
            <span>SESSÃO 23</span>
            <span>14 · MAI</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

window.Banner = Banner;
window.Topbar = Topbar;
window.Sidebar = Sidebar;
