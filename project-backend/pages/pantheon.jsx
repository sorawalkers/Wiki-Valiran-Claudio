// Pantheon page — tiered grid of deities (DB-driven)

function Pantheon({ onNav }) {
  const allDeities = Object.values(Entities.deities).filter(d => d && d.name);

  function getRow(d, key) {
    const row = (d.infobox?.rows || []).find(r => r.k === key);
    return row ? row.v : '';
  }

  const titas       = allDeities.filter(d => getRow(d,'Tipo').startsWith('Titã'));
  const ascendidos  = allDeities.filter(d => {
    const t = getRow(d,'Tipo');
    return t.includes('Ascendido') || t.includes('Ascendida') || t.includes('Anjo') || t.includes('Pseudo');
  });
  const estabelecidos = allDeities.filter(d => {
    const t = getRow(d,'Tipo');
    return !t.startsWith('Titã') && !t.includes('Ascendido') && !t.includes('Ascendida') && !t.includes('Anjo') && !t.includes('Pseudo');
  });

  const tiers = [
    { tier: 'Os Titãs',           tierDesc: 'As divindades primordiais que ergueram o mundo do nada. Hoje, distantes ou inalcançáveis.',                gods: titas },
    { tier: 'Deuses do Panteão',  tierDesc: 'As divindades estabelecidas, veneradas em templos por todo o continente.',                                  gods: estabelecidos },
    { tier: 'Ascendidos & Especiais', tierDesc: 'Mortais elevados, anjos caídos e entidades que não se enquadram na hierarquia convencional.',           gods: ascendidos },
  ].filter(t => t.gods.length > 0);

  const total = tiers.length;

  return (
    <div className="pantheon" data-screen-label="02 Panteão">
      <header className="page-header">
        <div className="page-eyebrow">Cosmologia · Volume II · Os Deuses</div>
        <h1 className="page-title">O Panteão de Valiran</h1>
        <p className="page-lede">
          Em Valiran, os deuses não são metáforas. Caminham, sangram, e às vezes
          são presos. Aqui se catalogam os nomes que recebem oração — os Titãs
          que ergueram o mundo, os Deuses do panteão estabelecido, e os Ascendidos:
          mortais que provaram-se grandes demais para a morte.
        </p>
      </header>

      {allDeities.length === 0 && (
        <p style={{ fontFamily:'EB Garamond,serif', fontStyle:'italic', color:'var(--foam-dim)', textAlign:'center', marginTop:60 }}>
          Nenhuma divindade registrada ainda.
        </p>
      )}

      {tiers.map((tier, ti) => (
        <section key={tier.tier} className="pantheon-tier">
          <div className="tier-header">
            <span className="tier-num">{String(ti + 1).padStart(2,'0')} / {String(total).padStart(2,'0')}</span>
            <h2 className="tier-name">{tier.tier}</h2>
            <p className="tier-desc">{tier.tierDesc}</p>
          </div>

          <div className="deity-grid">
            {tier.gods.map(g => {
              const Icon = Sigil[g.sigil];
              return (
                <article key={g.id} className="deity" onClick={() => onNav('deity:' + g.id)}>
                  <div className="deity-sigil">
                    {Icon && <Icon style={{width:'100%', height:'100%'}} />}
                  </div>
                  <h3 className="deity-name">{g.name}</h3>
                  <p className="deity-epithet">{g.epithet}</p>
                  <div className="deity-meta">
                    <span>{getRow(g,'Domínio')}</span>
                    <span>{getRow(g,'Alinhamento')}</span>
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
