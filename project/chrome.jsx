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

      <div className="search-wrap">
        <div className="search">
          <Sigil.Search className="search-icon" />
          <input placeholder="Buscar entre 1.247 entradas — divindades, eventos, lugares…" />
          <span className="search-kbd">⌘ K</span>
        </div>
      </div>

      <div className="topbar-right">
        <button className="icon-btn" title="Marcadores"><Sigil.Bookmark /></button>
        <button className="icon-btn" title="Configurações"><Sigil.Settings /></button>
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
