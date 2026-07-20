// Portal — homepage of the wiki

// ── Mini mapa real (hexes do Supabase, sem interação) ──────────────────────
function PortalMapPreview({ onNav }) {
  const realms = Data.realms || [];
  const rivers = Data.rivers || [];

  const allHexEntries = realms.flatMap(k =>
    (k.hexes || []).map(h => {
      const [x, y] = rmQrToXY(h.q, h.r);
      return { q: h.q, r: h.r, biome: h.biome || 'plain', realm: k, x, y };
    })
  ).sort((a, b) => a.y - b.y);

  return (
    <div style={{ position: 'relative', height: 280, overflow: 'hidden', cursor: 'pointer' }}
      onClick={() => onNav('map')}>
      <svg
        viewBox={`0 0 ${RM_VIEW_W} ${RM_VIEW_H}`}
        preserveAspectRatio="xMidYMid slice"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <defs>
          <radialGradient id="pm-ocean" cx="50%" cy="50%" r="100%">
            <stop offset="0%"   stopColor="#0e0c1c" />
            <stop offset="100%" stopColor="#040310" />
          </radialGradient>
          <pattern id="pm-paper" width="48" height="48" patternUnits="userSpaceOnUse">
            <circle cx="3"  cy="3"  r="0.4" fill="#2a2840" opacity="0.55" />
            <circle cx="24" cy="24" r="0.3" fill="#2a2840" opacity="0.5"  />
            <circle cx="36" cy="12" r="0.3" fill="#2a2840" opacity="0.45" />
          </pattern>
          <pattern id="pm-topo" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 0 20 Q 10 14, 20 20 T 40 20" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.6" />
          </pattern>
          <pattern id="pm-cursed" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="#3a0a0e" strokeWidth="1.4" strokeOpacity="0.65" />
          </pattern>
          <filter id="rm-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="1" dy="2" stdDeviation="1.2" floodOpacity="0.55" />
          </filter>
          <filter id="rm-shadow-strong" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="1.5" dy="2.5" stdDeviation="2" floodOpacity="0.65" />
          </filter>
        </defs>

        <rect width={RM_VIEW_W} height={RM_VIEW_H} fill="url(#pm-ocean)" />
        <rect width={RM_VIEW_W} height={RM_VIEW_H} fill="url(#pm-paper)" />

        <RMOceanDeco />

        {allHexEntries.map((e, i) => {
          const { q, r, biome, realm: k, x, y } = e;
          return (
            <g key={`pm-tile-${i}`}>
              <path d={rmSidePath(x, y)} fill="rgba(0,0,0,0.5)" />
              <path d={rmHexPath(x, y, 0.3)} fill={rmBiomeTint(biome)} />
              <path d={rmHexPath(x, y, 0.3)}
                fill={k.cursed ? k.accentDeep : k.accent}
                fillOpacity={k.cursed ? 0.92 : 0.82}
                stroke={k.accent} strokeOpacity="0.85" strokeWidth="0.4" />
              <path d={rmHexPath(x, y, 0.3)} fill="url(#pm-topo)" pointerEvents="none" />
              {k.cursed && <path d={rmHexPath(x, y, 0.3)} fill="url(#pm-cursed)" pointerEvents="none" />}
              <RMTerrainOnTile x={x} y={y} biome={biome} hkey={`${q},${r}`} cursed={k.cursed} />
            </g>
          );
        })}

        {realms.map(k => {
          const edges = rmKingdomBorderEdges(k);
          return (
            <g key={`pm-border-${k.id}`} pointerEvents="none">
              {edges.map(([x1, y1, x2, y2], i) => (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="#0a070d" strokeWidth="1.6" strokeOpacity="0.95" strokeLinecap="round" />
              ))}
            </g>
          );
        })}

        <RMRiversLayer rivers={rivers} />

        {realms.flatMap(k => {
          const cities = [
            ...(k.capitalQ != null ? [{ q: k.capitalQ, r: k.capitalR, kind: 'capital', critical: false }] : []),
            ...(k.cities || []),
          ];
          return cities.map((c, i) => (
            <RMCityPiece key={`pm-city-${k.id}-${i}`} q={c.q} r={c.r} kind={c.kind} critical={c.critical || false} dim={false} />
          ));
        })}

        {realms.map(k => (
          <RMKingdomFlag key={`pm-flag-${k.id}`} realm={k} dim={false} />
        ))}

        <RMCloudsDeco />
      </svg>

      <div style={{
        position: 'absolute', top: 16, left: 24,
        fontFamily: 'Cinzel', fontSize: 11,
        letterSpacing: '0.22em',
        color: 'rgba(212,184,127,0.75)',
        textTransform: 'uppercase',
        pointerEvents: 'none',
      }}>Carta de Valiran · 3ª Era</div>
    </div>
  );
}

// ── Portal ─────────────────────────────────────────────────────────────────
function Portal({ onNav }) {
  const deityCount   = Object.values(Entities.deities || {}).filter(d => d && d.name).length;
  const charCount    = (Data.charIds || []).length;
  const sessionCount = (Data.sessionIds || []).length;
  const eventCount   = (Data.events || []).length;
  const tlCount      = (Data.timeline || []).filter(e => e.title).length;
  const totalCount   = deityCount + charCount + sessionCount + eventCount + tlCount;

  const activeRealms = (Data.realms || []).filter(r => !r.cursed);

  return (
    <div className="portal" data-screen-label="01 Portal">
      <section className="hero" style={{'--sigil-watermark': `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200' fill='none' stroke='%23b89968' stroke-width='0.8'><circle cx='100' cy='100' r='96'/><circle cx='100' cy='100' r='56'/><path d='M100 8 L108 100 L100 192 L92 100 Z' fill='%23b89968' fill-opacity='0.4'/><path d='M34 34 L100 96 L166 34 L104 100 L166 166 L100 104 L34 166 L96 100 Z' stroke-width='0.5'/></svg>")`}}>
        <div className="hero-eyebrow">O Arquivo · Vol. III · Fólio 1281</div>
        <h1 className="hero-title">
          Tudo o que <span className="accent">se conta</span><br />
          sobre Valiran
        </h1>
        <p className="hero-lede">
          Um continente sustentado pela Trama Mágica, dilacerado por reinos em
          guerra e por uma corrupção que vaza de planos esquecidos. Aqui se
          guardam os nomes — dos deuses, dos heróis, e daqueles que romperam
          selos que jamais deveriam ter sido tocados.
        </p>

        <div className="hero-meta">
          <div className="hero-meta-item">
            <span>Entradas</span>
            <span className="v">{totalCount || '—'}</span>
          </div>
          <div className="hero-meta-item">
            <span>Divindades</span>
            <span className="v">{deityCount || '—'}</span>
          </div>
          <div className="hero-meta-item">
            <span>Personagens</span>
            <span className="v">{charCount || '—'}</span>
          </div>
          <div className="hero-meta-item">
            <span>Sessões</span>
            <span className="v">{sessionCount || '—'}</span>
          </div>
          <div className="hero-meta-item">
            <span>Era</span>
            <span className="v">3ª · 1281</span>
          </div>
        </div>
      </section>

      {/* Adições recentes */}
      <section className="portal-grid">
        <div className="section-header">
          <h2 className="section-title">Adições Recentes</h2>
          <a className="section-link" onClick={() => onNav('recent')}>Ver todas →</a>
        </div>

        {(Data.feed || []).length > 0 && (() => {
          const f = Data.feed[0];
          return (
            <div className="card card-featured" onClick={() => f.target && onNav(f.target)} style={f.target ? {cursor:'pointer'} : undefined}>
              <div className="card-featured-body">
                <div className="card-tag">{f.type_label}</div>
                <h3 className="card-title">{f.title}</h3>
                <p className="card-excerpt">{f.subtitle || '—'}</p>
                <div className="card-footer">
                  <span>{f.action}</span>
                  <span>{f.date_label}</span>
                </div>
              </div>
            </div>
          );
        })()}

        {(Data.feed || []).slice(1, 4).map((c, i) => (
          <div key={i} className="card"
            onClick={() => c.target && onNav(c.target)}
            style={c.target ? {cursor:'pointer'} : undefined}>
            <div className="card-tag">{c.type_label}</div>
            <h3 className="card-title">{c.title}</h3>
            <p className="card-excerpt">{c.subtitle || '—'}</p>
            <div className="card-footer">
              <span>{c.action}</span>
              <span>{c.date_label}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Mapa real */}
      <section className="portal-grid" style={{borderBottom:'none'}}>
        <div className="section-header">
          <h2 className="section-title">Pelas Veias do Continente</h2>
          <a className="section-link" onClick={() => onNav('map')}>Abrir mapa →</a>
        </div>

        <div className="card" style={{gridColumn:'span 3', padding:0, overflow:'hidden'}}>
          <PortalMapPreview onNav={onNav} />
        </div>
      </section>

      {/* Reinos principais do Supabase */}
      <section className="portal-grid">
        <div className="section-header">
          <h2 className="section-title">Os Cinco Poderes</h2>
          <a className="section-link" onClick={() => onNav('map')}>Conselho completo →</a>
        </div>

        {activeRealms.length > 0
          ? activeRealms.map(realm => {
              const Icon = Sigil && Sigil[realm.sigil];
              return (
                <div key={realm.id} className="card" onClick={() => onNav('map')} style={{cursor:'pointer'}}>
                  <div style={{display:'flex', alignItems:'center', gap:14, marginBottom:18}}>
                    <div style={{width:48, height:48, color: realm.accent, flexShrink:0}}>
                      {Icon && <Icon style={{width:'100%', height:'100%'}} />}
                    </div>
                    <div>
                      <div className="card-title" style={{margin:0, fontSize:19}}>{realm.name}</div>
                      <div style={{fontFamily:'JetBrains Mono', fontSize:10, letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--parchment-text-soft)', marginTop:4}}>{realm.eyebrow}</div>
                    </div>
                  </div>
                  <p className="card-excerpt" style={{margin:0}}>{realm.desc}</p>
                </div>
              );
            })
          : /* fallback enquanto DB carrega */
            [
              { name: 'Oshain', sub: 'Monarquia · Annabella Whiteflame', desc: 'Expansionismo sob pretexto de proteção.', sigil: 'Crown', color: 'var(--wine)' },
              { name: 'República Prateada', sub: 'República dracônica · Conselho dos Dez', desc: 'Bastião de justiça fundado por dragões.', sigil: 'Dragon', color: '#6a8aaa' },
              { name: 'Lorean Treaz', sub: 'Magocracia · Concílio Magisterial', desc: 'Domínio absoluto da Trama e dos Warforged.', sigil: 'Tome', color: '#8a6aba' },
            ].map(p => {
              const Icon = Sigil[p.sigil];
              return (
                <div key={p.name} className="card" style={{cursor:'pointer'}}>
                  <div style={{display:'flex', alignItems:'center', gap:14, marginBottom:18}}>
                    <div style={{width:48, height:48, color: p.color, flexShrink:0}}>
                      {Icon && <Icon style={{width:'100%', height:'100%'}} />}
                    </div>
                    <div>
                      <div className="card-title" style={{margin:0, fontSize:19}}>{p.name}</div>
                      <div style={{fontFamily:'JetBrains Mono', fontSize:10, letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--parchment-text-soft)', marginTop:4}}>{p.sub}</div>
                    </div>
                  </div>
                  <p className="card-excerpt" style={{margin:0}}>{p.desc}</p>
                </div>
              );
            })
        }
      </section>
    </div>
  );
}

window.Portal = Portal;
