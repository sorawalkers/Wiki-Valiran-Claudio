// Os Planos — cosmological diagram

function Planes({ onNav }) {
  const [selected, setSelected] = React.useState('material');

  const planes = [
    { id: 'material', name: 'Plano Material', cx: 200, cy: 200, r: 56, color: '#b89968',
      eyebrow: 'Centro · onde tudo acontece',
      desc: 'O continente de Valiran e os reinos visíveis. Todos os outros planos são acessíveis a partir daqui — para quem sabe abrir a porta certa.' },
    { id: 'feerie', name: 'Plano Feérico', cx: 80, cy: 100, r: 36, color: '#9c86c4',
      eyebrow: 'Espelho · paralelo',
      desc: 'O Plano Feérico se sobrepõe ao Material como uma sombra invertida. As estações se inverteram lá em 1276 — e nunca mais voltaram ao normal.' },
    { id: 'escuro', name: 'Grande Escuro', cx: 200, cy: 50, r: 32, color: '#3a3a44',
      eyebrow: 'Abaixo · sem luz natural',
      desc: 'Vasto submundo sob o continente. Cidades inteiras nasceram no escuro, e algumas nunca souberam que havia sol.' },
    { id: 'abismo', name: 'Plano do Abismo', cx: 320, cy: 100, r: 36, color: '#6b1a26',
      eyebrow: 'Fora · hostil',
      desc: 'Lar de demônios. Suas fendas são localizadas e raras — mas crescem na proporção da corrupção de Ayael.' },
    { id: 'negativa', name: 'Energia Negativa', cx: 200, cy: 350, r: 44, color: '#4a0f18',
      eyebrow: 'Prisão · de um deus',
      desc: 'Onde Ayael, o anjo filho de Lamidriel, está aprisionado. Toda necromância em Valiran tem aqui sua origem — e seu preço.',
      danger: true },
    { id: 'celeste', name: 'Plano Celeste', cx: 80, cy: 300, r: 28, color: '#d4b87f',
      eyebrow: 'Acima · raro',
      desc: 'Morada dos anjos sobreviventes e dos Titãs distantes. Lamidriel chora aqui — e suas lágrimas curam.' },
    { id: 'tessitura', name: 'Tessitura', cx: 320, cy: 300, r: 28, color: '#7a8a4a',
      eyebrow: 'Substrato · da magia',
      desc: 'Não é exatamente um plano — é a Trama Mágica enquanto lugar. Apenas Cerigane caminha por ele inteira.' },
  ];

  const sel = planes.find(p => p.id === selected) || planes[0];

  return (
    <div className="page" data-screen-label="07 Os Planos">
      <header className="page-header">
        <div className="page-eyebrow">Cosmologia · Volume II · Fólio 03</div>
        <h1 className="page-title">Os Planos de Existência</h1>
        <p className="page-lede">
          Sete planos respiram em torno do Material. Alguns são distantes;
          outros, vergonhosamente próximos. Toda magia é, em última instância,
          uma negociação entre estas sete realidades.
        </p>
      </header>

      <div className="cosmo-stage">
        <div className="cosmo-diagram">
          <svg viewBox="0 0 400 400" className="cosmo-svg">
            <defs>
              <radialGradient id="cosmo-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(184,153,104,0.12)" />
                <stop offset="100%" stopColor="rgba(184,153,104,0)" />
              </radialGradient>
            </defs>
            <rect width="400" height="400" fill="url(#cosmo-glow)" />

            {/* Concentric reference circles */}
            {[160, 110, 60].map(r => (
              <circle key={r} cx="200" cy="200" r={r} fill="none" stroke="#3a3a44" strokeWidth="0.5" strokeOpacity="0.6" strokeDasharray="2 6" />
            ))}

            {/* Connection lines */}
            {planes.filter(p => p.id !== 'material').map(p => (
              <line key={'l'+p.id}
                x1="200" y1="200" x2={p.cx} y2={p.cy}
                stroke={selected === p.id ? p.color : '#3a3a44'}
                strokeOpacity={selected === p.id ? 0.7 : 0.3}
                strokeWidth="1"
              />
            ))}

            {/* Planes */}
            {planes.map(p => {
              const isSelected = selected === p.id;
              return (
                <g key={p.id} className="cosmo-node" onClick={() => setSelected(p.id)}>
                  <circle cx={p.cx} cy={p.cy} r={p.r + 4}
                    fill="none" stroke={p.color} strokeOpacity={isSelected ? 0.5 : 0.2} strokeWidth="1" />
                  <circle cx={p.cx} cy={p.cy} r={p.r}
                    fill={p.color} fillOpacity={isSelected ? 0.4 : 0.18}
                    stroke={p.color} strokeWidth={isSelected ? 2 : 1.2}
                  />
                  {p.id === 'material' && (
                    <g>
                      <circle cx={p.cx} cy={p.cy} r="8" fill={p.color} />
                      <path d={`M${p.cx} ${p.cy-26} L${p.cx} ${p.cy+26} M${p.cx-26} ${p.cy} L${p.cx+26} ${p.cy}`}
                        stroke={p.color} strokeWidth="0.8" opacity="0.6" />
                    </g>
                  )}
                  {p.danger && (
                    <g>
                      <path d={`M${p.cx-12} ${p.cy} L${p.cx} ${p.cy-12} L${p.cx+12} ${p.cy} L${p.cx} ${p.cy+12} Z`}
                        fill={p.color} fillOpacity="0.6" />
                      <text x={p.cx} y={p.cy + 4} textAnchor="middle" style={{fontFamily:'Cinzel', fontSize:14, fill:'var(--foam)'}}>†</text>
                    </g>
                  )}
                  <text className="cosmo-node-label" x={p.cx} y={p.cy + p.r + 14}>
                    {p.name.toUpperCase()}
                  </text>
                </g>
              );
            })}

            {/* Outer label */}
            <text x="200" y="20" textAnchor="middle"
              style={{fontFamily:'JetBrains Mono', fontSize:9, letterSpacing:'0.28em', fill:'var(--gold-dim)', textTransform:'uppercase'}}>
              ◆ Diagrama dos Sete ◆
            </text>
            <text x="200" y="390" textAnchor="middle"
              style={{fontFamily:'EB Garamond', fontStyle:'italic', fontSize:11, fill:'var(--foam-dim)'}}>
              Atribuído a Cerigane · transcrito por Cael
            </text>
          </svg>
        </div>

        <div className="cosmo-info">
          {planes.map(p => (
            <div key={p.id}
              className={`cosmo-info-card ${selected === p.id ? 'selected' : ''}`}
              onClick={() => setSelected(p.id)}
            >
              <div className="cosmo-info-eyebrow" style={{color: p.color}}>
                <span className="cosmo-info-dot" style={{background: p.color, borderColor: p.color}}/>
                {p.eyebrow}
              </div>
              <h3 className="cosmo-info-title">{p.name}</h3>
              {selected === p.id && <p className="cosmo-info-desc">{p.desc}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

window.Planes = Planes;
