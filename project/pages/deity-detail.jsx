// Deity detail — full article for a deity

function DeityDetail({ id, onNav }) {
  // Resolve deity; Ayael uses Data.article shape; others use Entities.deities
  if (id === 'ayael') {
    return <Article onNav={onNav} />;
  }

  let d = Entities.deities[id];

  if (!d) {
    // Try resolving from pantheon list
    let found = null;
    for (const tier of Data.pantheon) {
      const g = tier.gods.find(g => g.name.toLowerCase() === id.toLowerCase());
      if (g) { found = g; break; }
    }
    if (found) d = Entities.deities._placeholder(id, found);
  }

  if (!d) {
    return (
      <div className="page">
        <button className="back-btn" onClick={() => onNav('pantheon')}>Voltar ao panteão</button>
        <h1 className="page-title">Divindade não encontrada</h1>
      </div>
    );
  }

  const SigilIcon = Sigil[d.sigil];

  return (
    <div className="article" data-screen-label={"Divindade · " + d.name}>
      <div className="parchment" style={{minWidth: 0}}>
        <div className="article-body">
          <button className="back-btn" onClick={() => onNav('pantheon')}>
            Voltar ao panteão
          </button>

          <nav className="breadcrumb">
            <a onClick={() => onNav('home')}>Arquivo</a>
            <span className="sep">▸</span>
            <a onClick={() => onNav('pantheon')}>Panteão</a>
            <span className="sep">▸</span>
            <span>{d.name}</span>
          </nav>

          <h1 className="article-title">{d.name}</h1>
          <p className="article-subtitle">{d.epithet}</p>

          <div className="article-divider">
            <Sigil.Ornament />
          </div>

          <div className="deity-hero-image">
            <image-slot
              id={`deity-hero-${d.id}`}
              shape="rect"
              placeholder={`Arraste arte de ${d.name}`}
            ></image-slot>
          </div>

          {d.placeholder ? (
            <React.Fragment>
              <p className="detail-hero">{d.hero}</p>
              <div style={{
                marginTop: 32,
                padding: '28px 32px',
                background: 'rgba(120,90,50,0.04)',
                border: '1px dashed var(--parchment-rule)',
                borderRadius: 2,
                textAlign: 'center',
              }}>
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize:10,
                  letterSpacing:'0.22em', textTransform:'uppercase',
                  color: 'var(--wine)', marginBottom: 10,
                }}>Em compilação</div>
                <h3 style={{
                  fontFamily:'Cinzel, serif', fontSize: 22, letterSpacing:'0.04em',
                  color:'var(--parchment-text)', margin:'0 0 8px',
                }}>O arquivista ainda reúne os testemunhos</h3>
                <p style={{
                  fontFamily:'EB Garamond, serif', fontStyle:'italic',
                  fontSize: 15, color:'var(--parchment-text-soft)', margin: 0,
                }}>
                  Esta divindade aparece no panteão oficial, mas ainda não recebeu
                  artigo completo. Volte em breve para origem, dogmas, manifestações e culto.
                </p>
              </div>
            </React.Fragment>
          ) : (
            <div className="prose">
              <p className="detail-hero">{d.hero}</p>

              {d.sections.map(sec => (
                <React.Fragment key={sec.title}>
                  <h2>{sec.title}</h2>
                  {sec.paras.map((p, i) => (
                    <p key={i} className={sec === d.sections[0] && i === 0 ? 'dropcap' : ''}>{p}</p>
                  ))}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>

      <aside className="infobox-rail">
        <div className="infobox">
          <div className="infobox-head">
            <div className="infobox-sigil-wrap">
              {SigilIcon && <SigilIcon />}
            </div>
            <h3 className="infobox-name">{d.name}</h3>
            <p className="infobox-sub">{d.epithet}</p>
          </div>
          {d.infobox.rows.length > 0 && (
            <dl className="infobox-rows">
              {d.infobox.rows.map(r => (
                <div key={r.k} className="infobox-row">
                  <dt>{r.k}</dt>
                  <dd className={r.danger ? 'danger' : r.ok ? 'ok' : ''}>{r.v}</dd>
                </div>
              ))}
            </dl>
          )}
          {d.infobox.statusNote && (
            <div className="infobox-status">
              <strong>STATUS DIVINO</strong><br />
              {d.infobox.statusNote}
            </div>
          )}
        </div>

        {d.related && d.related.length > 0 && (
          <div className="related">
            <h4 className="related-title">Cf. Relacionados</h4>
            {d.related.map(r => (
              <a key={r.title} className="related-link" onClick={() => onNav(r.target)}>
                <span className="related-link-tag">{r.tag}</span>
                <span className="related-link-title">{r.title}</span>
              </a>
            ))}
          </div>
        )}
      </aside>
    </div>
  );
}

window.DeityDetail = DeityDetail;
