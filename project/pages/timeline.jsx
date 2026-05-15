// Timeline page

function Timeline({ onNav }) {
  return (
    <div className="timeline-page" data-screen-label="04 Linha do Tempo">
      <header className="page-header">
        <div className="page-eyebrow">Crônicas · Volume IV · A Marcha dos Anos</div>
        <h1 className="page-title">Linha do Tempo</h1>
        <p className="page-lede">
          De Cerigane tecendo a Trama Mágica antes do tempo, até a noite em que
          sete heróis improváveis se cruzaram numa estalagem em Tarvane.
          Vinte e três mil anos de fios atados, rompidos e reatados.
        </p>
      </header>

      <div style={{
        display:'flex', gap: 12, marginBottom: 32, flexWrap:'wrap',
        fontFamily:'JetBrains Mono', fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase'
      }}>
        {['Tudo', 'Divino', 'Política', 'Catástrofe', 'Arcano'].map((f, i) => (
          <button key={f} style={{
            padding:'6px 14px',
            background: i === 0 ? 'rgba(184,153,104,0.15)' : 'transparent',
            color: i === 0 ? 'var(--gold-bright)' : 'var(--foam-dim)',
            border:'1px solid ' + (i === 0 ? 'var(--gold-dim)' : 'var(--ink-line)'),
            borderRadius:'2px',
            cursor:'pointer'
          }}>{f}</button>
        ))}
      </div>

      <div className="timeline">
        {Data.timeline.map((e, i) => {
          if (e.era) {
            return (
              <div key={i} className="era-divider">
                <div className="era-divider-text">{e.era}</div>
              </div>
            );
          }
          return (
            <div
              key={i}
              className={`timeline-event ${e.kind || ''}`}
              onClick={() => {
                if (e.title.includes('Lancaster')) onNav('article');
              }}
            >
              <div className="timeline-card">
                <div className="timeline-date">
                  <span className="year">{e.year}</span>
                  <span>· {e.label}</span>
                  <span className="tag">{e.tag}</span>
                </div>
                <h3 className="timeline-title">{e.title}</h3>
                <p className="timeline-desc">{e.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

window.Timeline = Timeline;
