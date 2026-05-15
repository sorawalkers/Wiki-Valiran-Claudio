// A Trama Mágica — long-form article with diagram

function Weave({ onNav }) {
  return (
    <div className="article" data-screen-label="08 A Trama Mágica">
      <div className="parchment" style={{minWidth: 0}}>
        <div className="article-body">
          <nav className="breadcrumb">
            <a onClick={() => onNav('home')}>Arquivo</a>
            <span className="sep">▸</span>
            <a>Cosmologia</a>
            <span className="sep">▸</span>
            <span>A Trama Mágica</span>
          </nav>

          <h1 className="article-title">A Trama Mágica</h1>
          <p className="article-subtitle">A Tessitura · O Substrato · Aquilo Que Cerigane Tece</p>

          <div className="article-divider">
            <Sigil.Ornament />
          </div>

          <div className="prose">
            <p className="dropcap">
              Nenhum mago em Valiran cria magia. Eles pedem emprestado. A
              Trama Mágica é a teia invisível que une todos os planos — e
              cada feitiço, do mais simples truque de salão à mais terrível
              evocação, é apenas uma tração momentânea em um de seus fios.
              Cerigane, a Titã da Magia, é quem a tece. E quem, em última
              instância, decide o que ela pode carregar.
            </p>

            <h2>A Estrutura</h2>
            <p>
              Para quem sabe enxergar (e poucos sabem), a Trama parece uma
              malha de fios concêntricos que atravessa toda matéria. Cada
              fio vibra numa frequência diferente — a magia evocativa puxa
              os fios mais grossos, a magia divinatória apenas os roça. A
              necromância, por sua vez, <em>fere</em> a Trama: é por isso
              que ela é proibida em quase todos os reinos honestos.
            </p>

            <div style={{
              margin: '36px -16px',
              padding: '40px 32px',
              background: 'rgba(60, 40, 20, 0.08)',
              border: '1px solid var(--parchment-rule)',
              borderRadius: '2px',
            }}>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 10,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--wine)',
                marginBottom: 18,
                textAlign: 'center',
              }}>FIG. I · DIAGRAMA DOS FIOS</div>
              <svg viewBox="0 0 600 300" style={{width:'100%', height:'auto', display:'block'}}>
                <defs>
                  <radialGradient id="weave-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(107,26,38,0.18)" />
                    <stop offset="100%" stopColor="rgba(107,26,38,0)" />
                  </radialGradient>
                </defs>
                <rect width="600" height="300" fill="url(#weave-glow)" />
                {/* horizontal threads */}
                {Array.from({length: 12}).map((_, i) => {
                  const y = 30 + i * 22;
                  return (
                    <path key={i} d={`M 30 ${y} Q ${300} ${y + Math.sin(i)*8} ${570} ${y}`}
                      fill="none" stroke="#6b1a26" strokeWidth={i === 6 ? 1.6 : 0.6} strokeOpacity={0.4 + (i%3)*0.15} />
                  );
                })}
                {/* vertical fine threads */}
                {Array.from({length: 24}).map((_, i) => (
                  <line key={i} x1={30 + i*22.5} y1="20" x2={30 + i*22.5} y2="280"
                    stroke="#6b1a26" strokeOpacity="0.15" strokeWidth="0.4" />
                ))}
                {/* nodes */}
                {[[150,80],[300,150],[450,90],[200,200],[400,220],[500,170]].map(([x,y],i) => (
                  <g key={i}>
                    <circle cx={x} cy={y} r="6" fill="#b89968" />
                    <circle cx={x} cy={y} r="12" fill="none" stroke="#b89968" strokeOpacity="0.5" />
                  </g>
                ))}
                {/* wound */}
                <g transform="translate(300, 150)">
                  <path d="M -20 -8 L 20 12 M -16 8 L 16 -10" stroke="#4a0f18" strokeWidth="3" />
                  <text x="0" y="36" textAnchor="middle" style={{fontFamily:'EB Garamond', fontStyle:'italic', fontSize:11, fill:'#4a0f18'}}>
                    ferida necromântica
                  </text>
                </g>
                {/* labels */}
                <text x="60" y="20" style={{fontFamily:'Cinzel', fontSize:9, letterSpacing:'0.18em', fill:'var(--parchment-text-soft)'}}>FIO MAIOR · EVOCAÇÃO</text>
                <text x="60" y="295" style={{fontFamily:'Cinzel', fontSize:9, letterSpacing:'0.18em', fill:'var(--parchment-text-soft)'}}>FIOS MENORES · DIVINAÇÃO</text>
              </svg>
            </div>

            <h2>Os Que Cortaram a Trama</h2>
            <p>
              Há séculos, o <a onClick={() => onNav('kingdoms')}>Império de Ferro</a> realizou
              aquilo que os arquimagos consideravam impossível: cortou
              cirurgicamente seu povo da Trama. O processo foi brutal, levou
              três gerações, e seus descendentes nascem hoje como ilhas
              vazias — invulneráveis a feitiços, mas também a cura mágica,
              a benções, e ao próprio toque do divino.
            </p>

            <blockquote>
              Eles dizem que conquistaram a liberdade. Eu digo que cortaram
              fora algo que não sabiam ser belo. Conheci um soldado de Tor
              Klain que chorou quando viu uma criança lançar uma luz mágica
              pela primeira vez. Ele não sabia o que era. Ele chorou.
              <cite>Ven Sothiel, arquimaga</cite>
            </blockquote>

            <h2>A Corrupção da Trama</h2>
            <p>
              Desde o aprisionamento de <a onClick={() => onNav('article')}>Ayael</a>, a
              Trama tem cicatrizes. Sentimo-las quando a magia falha sem
              motivo, quando uma evocação trivial puxa algo que não devia
              vir. O Concílio Magisterial de Lorean Treaz mapeou onze
              ‘rupturas’ ativas no continente. Existem, certamente, mais.
            </p>

            <h3>O que isso significa para o praticante</h3>
            <p>
              Toda magia em Valiran é mais barata e mais perigosa do que era
              há duzentos anos. Pague o preço com atenção, ou ele será cobrado
              em outra moeda. Continue a leitura em <a onClick={() => onNav('article')}>Ayael, o que Sangra Luz</a>.
            </p>

            <p style={{fontSize:14, color:'var(--parchment-text-soft)', fontStyle:'italic', marginTop:32}}>
              Cf. também: <a onClick={() => onNav('planes')}>Os Planos</a>, <a onClick={() => onNav('pantheon')}>Cerigane, a Tecelã</a>,
              Concílio Magisterial de Lorean Treaz.
            </p>
          </div>
        </div>
      </div>

      <aside className="infobox-rail">
        <div className="infobox">
          <div className="infobox-head">
            <div className="infobox-sigil-wrap">
              <Sigil.Tome />
            </div>
            <h3 className="infobox-name">A Trama Mágica</h3>
            <p className="infobox-sub">A Tessitura</p>
          </div>
          <dl className="infobox-rows">
            <div className="infobox-row"><dt>Natureza</dt><dd>Substrato cosmológico</dd></div>
            <div className="infobox-row"><dt>Tece</dt><dd>Cerigane, a Tecelã</dd></div>
            <div className="infobox-row"><dt>Frequências</dt><dd>9 conhecidas, 2 teorizadas</dd></div>
            <div className="infobox-row"><dt>Rupturas ativas</dt><dd className="danger">11 mapeadas</dd></div>
            <div className="infobox-row"><dt>Imunes</dt><dd>Império de Ferro</dd></div>
            <div className="infobox-row"><dt>Estado</dt><dd className="danger">Em decadência lenta</dd></div>
          </dl>
          <div className="infobox-status">
            <strong>NOTA CRÍTICA</strong><br />
            A intensidade da magia em Valiran caiu ≈ 18% nos últimos 150
            anos. Nenhum mago vivo presenciou o ápice da Trama.
          </div>
        </div>

        <div className="related">
          <h4 className="related-title">Cf. Relacionados</h4>
          <a className="related-link" onClick={() => onNav('article')}>
            <span className="related-link-tag">Divindade</span>
            <span className="related-link-title">Ayael, o que Sangra Luz</span>
          </a>
          <a className="related-link" onClick={() => onNav('planes')}>
            <span className="related-link-tag">Cosmologia</span>
            <span className="related-link-title">Os Planos</span>
          </a>
          <a className="related-link" onClick={() => onNav('kingdoms')}>
            <span className="related-link-tag">Reino</span>
            <span className="related-link-title">Império de Ferro</span>
          </a>
        </div>
      </aside>
    </div>
  );
}

window.Weave = Weave;
