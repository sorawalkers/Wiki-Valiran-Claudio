// Pantheon page — tiered grid of deities

function Pantheon({ onNav }) {
  return (
    <div className="pantheon" data-screen-label="02 Panteão">
      <header className="page-header">
        <div className="page-eyebrow">Cosmologia · Volume II · Os Deuses</div>
        <h1 className="page-title">O Panteão de Valiran</h1>
        <p className="page-lede">
          Em Valiran, os deuses não são metáforas. Caminham, sangram, e às vezes
          são presos. Aqui se catalogam os vinte e três nomes que recebem
          oração — os Titãs que ergueram o mundo, os Deuses do panteão
          estabelecido, e os Ascendidos: mortais que provaram-se grandes
          demais para a morte.
        </p>
      </header>

      {Data.pantheon.map((tier, ti) => (
        <section key={tier.tier} className="pantheon-tier">
          <div className="tier-header">
            <span className="tier-num">{String(ti + 1).padStart(2,'0')} / 03</span>
            <h2 className="tier-name">{tier.tier}</h2>
            <p className="tier-desc">{tier.tierDesc}</p>
          </div>

          <div className="deity-grid">
            {tier.gods.map(g => {
              const Icon = Sigil[g.sigil];
              const slug = g.name.toLowerCase()
                .replace(/[áàâã]/g,'a').replace(/[éê]/g,'e').replace(/[íî]/g,'i')
                .replace(/[óô]/g,'o').replace(/[úû]/g,'u').replace(/ç/g,'c')
                .replace(/[^a-z0-9]/g,'');
              return (
                <article
                  key={g.name}
                  className="deity"
                  onClick={() => onNav('deity:' + slug)}
                >
                  <div className="deity-sigil">
                    {Icon && <Icon style={{width:'100%', height:'100%'}} />}
                  </div>
                  <h3 className="deity-name">{g.name}</h3>
                  <p className="deity-epithet">{g.epithet}</p>
                  <div className="deity-meta">
                    <span className={g.aligned ? 'aligned' : g.opposed ? 'opposed' : ''}>
                      {g.domain}
                    </span>
                    <span>{g.alignment}</span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}

      <div style={{
        marginTop: 80,
        padding: '32px 0',
        borderTop: '1px solid var(--ink-line-soft)',
        textAlign: 'center',
        fontFamily: 'EB Garamond, serif',
        fontStyle: 'italic',
        color: 'var(--foam-dim)',
        fontSize: 15
      }}>
        “Conta-se que existem outros. Aqueles cujos nomes foram apagados
        pelos próprios crentes — para que nenhum culto pudesse jamais
        ressurgir.”
        <div style={{marginTop:8, fontSize:11, fontStyle:'normal', letterSpacing:'0.22em', fontFamily:'JetBrains Mono'}}>
          — ARQUIVISTA CAEL, NOTA DE RODAPÉ DESCONHECIDA
        </div>
      </div>
    </div>
  );
}

window.Pantheon = Pantheon;
