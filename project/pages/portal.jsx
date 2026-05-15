// Portal — homepage of the wiki

function Portal({ onNav }) {
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
            <span className="v">1.247</span>
          </div>
          <div className="hero-meta-item">
            <span>Divindades</span>
            <span className="v">23</span>
          </div>
          <div className="hero-meta-item">
            <span>Personagens</span>
            <span className="v">147</span>
          </div>
          <div className="hero-meta-item">
            <span>Sessões</span>
            <span className="v">23</span>
          </div>
          <div className="hero-meta-item">
            <span>Era</span>
            <span className="v">3ª · 1281</span>
          </div>
        </div>
      </section>

      <section className="portal-grid">
        <div className="section-header">
          <h2 className="section-title">Adições Recentes</h2>
          <a className="section-link" onClick={() => onNav('recent')}>Ver todas →</a>
        </div>

        {/* Featured */}
        <div className="card card-featured" onClick={() => onNav('article')}>
          <div className="card-featured-image" />
          <div className="card-featured-body">
            <div className="card-tag">Divindade · Anjo Aprisionado</div>
            <h3 className="card-title">Ayael, o que Sangra Luz</h3>
            <p className="card-excerpt">
              Filho do Titã Lamidriel, aprisionado em sofrimento eterno no Plano
              de Energia Negativa. A dor que vaza de seu cárcere se manifesta
              como necromância nos planos materiais — toda terra podre, todo
              morto-vivo, toda corrupção que arrasa Valiran tem nele sua fonte
              última.
            </p>
            <div className="card-footer">
              <span>Atualizado por Arquivista Cael</span>
              <span>3ª Era · 1281</span>
            </div>
          </div>
        </div>

        {/* Regular cards */}
        {Data.latest.slice(1, 5).map((c, i) => (
          <div
            key={i}
            className="card"
            onClick={() => onNav(c.target || (i === 0 ? 'timeline' : null))}
          >
            <div className="card-tag">{c.tag}</div>
            <h3 className="card-title">{c.title}</h3>
            <p className="card-excerpt">{c.excerpt}</p>
            <div className="card-footer">
              <span>{c.author}</span>
              <span>{c.meta}</span>
            </div>
          </div>
        ))}
      </section>

      <section className="portal-grid" style={{borderBottom:'none'}}>
        <div className="section-header">
          <h2 className="section-title">Pelas Veias do Continente</h2>
          <a className="section-link" onClick={() => onNav('map')}>Abrir mapa →</a>
        </div>

        <div className="card" onClick={() => onNav('map')} style={{gridColumn:'span 3', padding:0, minHeight: 280, overflow:'hidden'}}>
          <div style={{
            height: 280,
            position: 'relative',
            background: 'linear-gradient(135deg, #e8dcc4 0%, #c4b48f 100%)',
          }}>
            <svg viewBox="0 0 800 320" style={{width:'100%', height:'100%', display:'block'}}>
              <defs>
                <pattern id="paper-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M40 0 L0 0 0 40" fill="none" stroke="#a89870" strokeWidth="0.3" strokeOpacity="0.4" />
                </pattern>
              </defs>
              <rect width="800" height="320" fill="url(#paper-grid)" />
              {/* simplified continent silhouette */}
              <path d="M 120 80 L 280 60 L 380 90 L 520 70 L 640 100 L 720 160 L 700 240 L 580 280 L 420 290 L 280 270 L 160 240 L 100 180 Z"
                fill="rgba(120,90,50,0.18)" stroke="#5a4a2a" strokeWidth="1.5" />
              {/* mountains */}
              {[[200,140],[260,130],[480,120],[540,140],[600,130]].map(([x,y],i) => (
                <path key={i} d={`M${x} ${y} l 10 -16 l 10 16 z`} fill="none" stroke="#5a4a2a" strokeWidth="1" />
              ))}
              {/* labels */}
              <text x="240" y="100" textAnchor="middle" style={{fontFamily:'Cinzel', fontSize:12, fill:'#2a2418', letterSpacing:'0.18em'}}>OSHAIN</text>
              <text x="500" y="180" textAnchor="middle" style={{fontFamily:'Cinzel', fontSize:11, fill:'#6b1a26', letterSpacing:'0.18em'}}>† NOVA LANCASTER</text>
              <text x="380" y="240" textAnchor="middle" style={{fontFamily:'Cinzel', fontSize:12, fill:'#2a2418', letterSpacing:'0.18em'}}>REPÚBLICA PRATEADA</text>
              <text x="640" y="200" textAnchor="middle" style={{fontFamily:'Cinzel', fontSize:11, fill:'#2a2418', letterSpacing:'0.18em'}}>LOREAN TREAZ</text>
              {/* compass */}
              <g transform="translate(720,40)">
                <circle r="20" fill="none" stroke="#5a4a2a" strokeWidth="0.8" />
                <path d="M0 -16 L4 0 L0 16 L-4 0 Z" fill="#5a4a2a" />
                <text textAnchor="middle" y="-24" style={{fontFamily:'Cinzel', fontSize:9, fill:'#5a4a2a'}}>N</text>
              </g>
            </svg>
            <div style={{
              position:'absolute', top:24, left:32,
              fontFamily:'Cinzel', fontSize:13, letterSpacing:'0.22em',
              color:'#5a4e36', textTransform:'uppercase'
            }}>Carta de Valiran · 3ª Era</div>
          </div>
        </div>
      </section>

      <section className="portal-grid">
        <div className="section-header">
          <h2 className="section-title">Os Cinco Poderes</h2>
          <a className="section-link" onClick={() => onNav('kingdoms')}>Conselho completo →</a>
        </div>

        {[
          { name: 'Oshain', sub: 'Monarquia · Annabella Whiteflame', desc: 'Expansionismo sob pretexto de proteção.', sigil: 'Crown', color: 'var(--wine)' },
          { name: 'República Prateada', sub: 'República dracônica · Conselho dos Dez', desc: 'Bastião de justiça fundado por dragões.', sigil: 'Dragon', color: '#6a8aaa' },
          { name: 'Lorean Treaz', sub: 'Magocracia · Concílio Magisterial', desc: 'Domínio absoluto da Trama e dos Warforged.', sigil: 'Tome', color: '#8a6aba' },
        ].map(p => {
          const Icon = Sigil[p.sigil];
          return (
            <div key={p.name} className="card" style={{cursor:'pointer'}}>
              <div style={{display:'flex', alignItems:'center', gap:14, marginBottom:18}}>
                <div style={{width:48, height:48, color: p.color, flexShrink:0}}>
                  <Icon style={{width:'100%', height:'100%'}}/>
                </div>
                <div>
                  <div className="card-title" style={{margin:0, fontSize:19}}>{p.name}</div>
                  <div style={{fontFamily:'JetBrains Mono', fontSize:10, letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--parchment-text-soft)', marginTop:4}}>{p.sub}</div>
                </div>
              </div>
              <p className="card-excerpt" style={{margin:0}}>{p.desc}</p>
            </div>
          );
        })}
      </section>
    </div>
  );
}

window.Portal = Portal;
