// Character detail — full article for a character

function CharacterDetail({ id, onNav }) {
  // Resolve character; create placeholder for unknown ids
  let c = Entities.characters[id];
  if (!c || typeof c === 'function') {
    // Try resolving by simple id from Characters page list
    const fallbackMap = {
      sothia: ['Sothia das Cinzas', 'Maga warforged · primeira da linhagem', 'PC', 'pc'],
      mavor:  ['Mavor Iceblood', 'Mercenário de Ferro · imune à Trama', 'PC', 'pc'],
      vensothiel: ['Mestra Ven Sothiel', 'Arquimaga decana · mentora arrelíquia', 'ALIADO', 'ally'],
      vagliesII: ['Vaglies II', 'Filho do rei mártir · em exílio', 'ALIADO', 'ally'],
      noel:   ['Noel Braent', 'O Agente do Selo · rosto na multidão', 'INIMIGO', 'foe'],
      caedric:['"Irmão Caedric"', 'Lacrimosi · prega libertação', 'INIMIGO', 'foe'],
    };
    const f = fallbackMap[id];
    if (f) c = Entities.characters._placeholder(id, f[0], f[1], f[2], f[3]);
  }

  if (!c) {
    return (
      <div className="page">
        <button className="back-btn" onClick={() => onNav('characters')}>Voltar à galeria</button>
        <h1 className="page-title">Personagem não encontrado</h1>
      </div>
    );
  }

  return (
    <div className="article" data-screen-label={"Personagem · " + c.name}>
      <div className="parchment" style={{minWidth: 0}}>
        <div className="article-body">
          <button className="back-btn" onClick={() => onNav('characters')}>
            Voltar à galeria
          </button>

          <nav className="breadcrumb">
            <a onClick={() => onNav('home')}>Arquivo</a>
            <span className="sep">▸</span>
            <a onClick={() => onNav('characters')}>Dramatis Personae</a>
            <span className="sep">▸</span>
            <span>{c.name}</span>
          </nav>

          <h1 className="article-title">{c.name}</h1>
          <p className="article-subtitle">{c.role}</p>

          <div className="article-divider">
            <Sigil.Ornament />
          </div>

          {c.placeholder ? (
            <React.Fragment>
              <p className="detail-hero">{c.hero}</p>
              <div className="placeholder-banner" style={{background: 'rgba(120,90,50,0.04)', border:'1px dashed var(--parchment-rule)', color: 'var(--parchment-text)'}}>
                <div className="placeholder-banner-eyebrow" style={{color:'var(--wine)'}}>Em compilação</div>
                <h3 style={{color:'var(--parchment-text)'}}>Esta entrada ainda está sendo transcrita</h3>
                <p style={{color:'var(--parchment-text-soft)'}}>O arquivista Cael reuniu o esqueleto desta entrada. Biografia detalhada, personalidade e eventos serão acrescentados nas próximas sessões.</p>
              </div>
            </React.Fragment>
          ) : (
            <div className="prose">
              <p className="detail-hero">{c.hero}</p>

              {c.sections.map(sec => (
                <React.Fragment key={sec.title}>
                  <h2>{sec.title}</h2>
                  {sec.paras.map((p, i) => (
                    <p key={i} className={sec === c.sections[0] && i === 0 ? 'dropcap' : ''}>{p}</p>
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
            <div className="infobox-portrait-wrap">
              <image-slot
                id={`char-portrait-${c.id}`}
                shape="rect"
                placeholder={`Retrato · ${c.name}`}
                style={{position:'absolute', inset:0, width:'100%', height:'100%'}}
              ></image-slot>
              <span className={`infobox-portrait-tag ${c.tagClass}`} style={{zIndex:2}}>{c.tag}</span>
            </div>
            <h3 className="infobox-name">{c.name}</h3>
            <p className="infobox-sub">{c.role}</p>
          </div>
          {c.infobox.rows.length > 0 && (
            <dl className="infobox-rows">
              {c.infobox.rows.map(r => (
                <div key={r.k} className="infobox-row">
                  <dt>{r.k}</dt>
                  <dd className={r.danger ? 'danger' : r.ok ? 'ok' : ''}>{r.v}</dd>
                </div>
              ))}
            </dl>
          )}
          {c.infobox.statusNote && (
            <div className="infobox-status">
              <strong>{c.tag === 'INIMIGO' ? 'AVISO ARQUIVÍSTICO' : 'NOTA'}</strong><br />
              {c.infobox.statusNote}
            </div>
          )}
        </div>

        {c.related && c.related.length > 0 && (
          <div className="related">
            <h4 className="related-title">Cf. Relacionados</h4>
            {c.related.map(r => (
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

window.CharacterDetail = CharacterDetail;
