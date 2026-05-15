// Map page

function MapPage({ onNav }) {
  const [selected, setSelected] = React.useState('lancaster');
  const region = Data.regions.find(r => r.id === selected) || Data.regions[0];

  return (
    <div className="map-page" data-screen-label="05 Mapa">
      <div className="map-canvas">
        <div className="map-overlay-top">
          <div className="page-eyebrow">Cartografia · Carta de Valiran</div>
          <h1>Continente de Valiran</h1>
        </div>

        <svg viewBox="0 0 900 600" className="map-svg" preserveAspectRatio="xMidYMid meet">
          <defs>
            <pattern id="paper" width="60" height="60" patternUnits="userSpaceOnUse">
              <rect width="60" height="60" fill="#1d1d23" />
              <circle cx="0" cy="0" r="0.5" fill="#3a3a44" />
              <circle cx="30" cy="30" r="0.5" fill="#3a3a44" />
            </pattern>
            <pattern id="hatch-cursed" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="8" stroke="#6b1a26" strokeWidth="1.5" strokeOpacity="0.6" />
            </pattern>
            <radialGradient id="sea-glow" cx="50%" cy="50%" r="80%">
              <stop offset="0%" stopColor="#26262d" />
              <stop offset="100%" stopColor="#0e0d10" />
            </radialGradient>
          </defs>

          {/* Sea background */}
          <rect width="900" height="600" fill="url(#sea-glow)" />

          {/* Faint coordinate lines */}
          {[100,200,300,400,500].map(y => (
            <line key={'h'+y} x1="0" y1={y} x2="900" y2={y} stroke="#3a3a44" strokeOpacity="0.2" strokeWidth="0.5" strokeDasharray="2 6" />
          ))}
          {[150,300,450,600,750].map(x => (
            <line key={'v'+x} x1={x} y1="0" x2={x} y2="600" stroke="#3a3a44" strokeOpacity="0.2" strokeWidth="0.5" strokeDasharray="2 6" />
          ))}

          {/* Continent body outline */}
          <path d="M 140 60 L 400 50 L 560 90 L 700 70 L 820 140 L 850 250 L 820 380 L 780 480 L 660 540 L 480 555 L 320 540 L 200 500 L 130 420 L 100 280 L 110 160 Z"
            fill="#16161b" stroke="#3a3a44" strokeWidth="1.5" />

          {/* Regions */}
          {Data.regions.map(r => (
            <g key={r.id}>
              <path
                d={r.d}
                fill={r.fill}
                stroke={r.stroke}
                strokeWidth="1.5"
                fillOpacity="0.5"
                className={`region ${selected === r.id ? 'selected' : ''}`}
                onClick={() => setSelected(r.id)}
              />
              {r.cursed && (
                <path d={r.d} fill="url(#hatch-cursed)" pointerEvents="none" />
              )}
            </g>
          ))}

          {/* Cities (marker dots) */}
          {[
            {x:490, y:200, name:'HALENSGARD', sub:'Capital · Oshain'},
            {x:320, y:430, name:'AERITHYS', sub:'Capital · República Prateada'},
            {x:720, y:400, name:'TORRE PLÚRIMA', sub:'Capital · Lorean Treaz'},
            {x:280, y:140, name:'TOR KLAIN', sub:'Capital · Império de Ferro'},
            {x:490, y:320, name:'† NOVA LANCASTER', sub:'Ruínas · ocupada'},
          ].map(c => (
            <g key={c.name}>
              <circle cx={c.x} cy={c.y} r="4" fill="var(--gold-bright)" stroke="#0e0d10" strokeWidth="1.5" />
              <text x={c.x} y={c.y - 10} className="map-label" style={{fontSize: 10}}>{c.name}</text>
              <text x={c.x} y={c.y + 18} className="map-label small">{c.sub}</text>
            </g>
          ))}

          {/* Region name labels */}
          {Data.regions.map(r => (
            <text key={'l'+r.id} x={r.labelX} y={r.labelY}
              className="map-label"
              style={{fontSize: 14, fill: r.cursed ? 'var(--wine-bright)' : 'var(--foam)', letterSpacing: '0.22em'}}
            >
              {r.name.toUpperCase()}
            </text>
          ))}

          {/* Compass rose */}
          <g transform="translate(820, 80)">
            <circle r="36" fill="none" stroke="var(--gold-dim)" strokeWidth="0.8" />
            <circle r="28" fill="none" stroke="var(--gold-dim)" strokeWidth="0.4" />
            <path d="M0 -28 L4 0 L0 28 L-4 0 Z" fill="var(--gold)" />
            <path d="M-28 0 L0 -4 L28 0 L0 4 Z" fill="var(--gold-dim)" />
            <text textAnchor="middle" y="-40" style={{fontFamily:'Cinzel', fontSize:11, fill:'var(--gold-bright)', letterSpacing:'0.18em'}}>N</text>
            <text textAnchor="middle" y="46" style={{fontFamily:'Cinzel', fontSize:9, fill:'var(--gold-dim)', letterSpacing:'0.18em'}}>S</text>
            <text textAnchor="end" x="-38" y="4" style={{fontFamily:'Cinzel', fontSize:9, fill:'var(--gold-dim)', letterSpacing:'0.18em'}}>O</text>
            <text x="42" y="4" style={{fontFamily:'Cinzel', fontSize:9, fill:'var(--gold-dim)', letterSpacing:'0.18em'}}>L</text>
          </g>

          {/* Scale */}
          <g transform="translate(40, 540)">
            <line x1="0" y1="0" x2="120" y2="0" stroke="var(--foam-dim)" strokeWidth="1" />
            <line x1="0" y1="-4" x2="0" y2="4" stroke="var(--foam-dim)" strokeWidth="1" />
            <line x1="60" y1="-3" x2="60" y2="3" stroke="var(--foam-dim)" strokeWidth="1" />
            <line x1="120" y1="-4" x2="120" y2="4" stroke="var(--foam-dim)" strokeWidth="1" />
            <text x="60" y="20" textAnchor="middle" style={{fontFamily:'JetBrains Mono', fontSize:9, fill:'var(--foam-dim)', letterSpacing:'0.16em'}}>500 LÉGUAS</text>
          </g>
        </svg>

        <div className="map-controls">
          <button className="map-ctrl" title="Aproximar">+</button>
          <button className="map-ctrl" title="Afastar">−</button>
          <button className="map-ctrl" title="Recentralizar" style={{fontSize:14}}>⊙</button>
        </div>

        <div className="map-legend">
          <div className="legend-title">Legenda</div>
          <div className="legend-row"><span className="legend-swatch" style={{background:'#7a2535'}}/>Monarquia de Oshain</div>
          <div className="legend-row"><span className="legend-swatch" style={{background:'#3a5a7a'}}/>República Prateada</div>
          <div className="legend-row"><span className="legend-swatch" style={{background:'#5a4a8a'}}/>Magocracia Lorean Treaz</div>
          <div className="legend-row"><span className="legend-swatch" style={{background:'#4a4a52'}}/>Império de Ferro</div>
          <div className="legend-row"><span className="legend-swatch" style={{background:'#3a1a1a', border:'1px solid var(--wine)'}}/>Terra Corrompida</div>
        </div>
      </div>

      <aside className="map-info">
        <div className="map-info-eyebrow">Região selecionada</div>
        <h2>{region.name}</h2>
        <div style={{
          fontFamily:'JetBrains Mono', fontSize:10, letterSpacing:'0.22em', textTransform:'uppercase',
          color: region.cursed ? 'var(--wine-bright)' : 'var(--foam-dim)', marginBottom: 24
        }}>{region.type}</div>

        <p>{region.desc}</p>

        <dl className="map-stats">
          {region.stats.map(s => (
            <div key={s.k} className="map-stat-row">
              <dt>{s.k}</dt>
              <dd className={s.danger ? 'danger' : ''} style={s.danger ? {color:'var(--wine-bright)'} : {}}>{s.v}</dd>
            </div>
          ))}
        </dl>

        {region.cursed && (
          <div style={{
            padding:'14px 18px',
            background:'rgba(107,26,38,0.12)',
            border:'1px solid var(--wine)',
            borderRadius:'2px',
            fontFamily:'EB Garamond, serif',
            fontStyle:'italic',
            fontSize:14,
            lineHeight:1.55,
            color:'var(--foam)',
            marginBottom:20,
          }}>
            <div style={{
              fontFamily:'JetBrains Mono', fontSize:10, letterSpacing:'0.22em',
              textTransform:'uppercase', color:'var(--wine-bright)', marginBottom:8, fontStyle:'normal'
            }}>⚠ AVISO ARQUIVÍSTICO</div>
            Esta região contém uma fenda planar ativa. Não é recomendado
            ingresso sem proteção arcana de nível V ou superior.
          </div>
        )}

        <button onClick={() => onNav('article')} style={{
          width:'100%',
          padding:'12px 16px',
          background:'transparent',
          color:'var(--gold-bright)',
          border:'1px solid var(--gold-dim)',
          fontFamily:'Cinzel, serif',
          fontSize:12,
          letterSpacing:'0.22em',
          textTransform:'uppercase',
          cursor:'pointer',
          borderRadius:'2px'
        }}>
          Abrir artigo completo →
        </button>
      </aside>
    </div>
  );
}

window.MapPage = MapPage;
