// Sessions — card grid + detail page

function Sessions({ onNav }) {
  const sessionIds = ['23', '22', '21'];

  return (
    <div className="page" data-screen-label="13 Diário de Sessões">
      <header className="page-header">
        <div className="page-eyebrow">Mesa · Vol. VIII · Diário ativo</div>
        <h1 className="page-title">Diário de Sessões</h1>
        <p className="page-lede">
          Cada sessão se torna um fólio. Os cards abaixo mostram o resumo
          rápido — pessoas, lugares, o que aconteceu em uma respiração. Clique
          em qualquer um para abrir o diário completo da sessão, transcrito
          pelo escriba da mesa logo após o jogo.
        </p>
      </header>

      <div className="session-card-grid">
        {sessionIds.map((id, i) => {
          const s = Entities.sessions[id];
          if (!s) return null;
          const peopleChips = s.cast.slice(0, 5);
          const placeChips = s.places.slice(0, 4);
          return (
            <article
              key={id}
              className={`session-card ${i === 0 ? 'latest' : ''}`}
              onClick={() => onNav('session:' + id)}
            >
              <div className="session-card-head">
                <div>
                  <div className="session-card-num">{String(s.num).padStart(2,'0')}</div>
                  <div className="session-card-num-label">Sessão</div>
                </div>
                <div>
                  <div className="session-card-date">{s.dateShort}</div>
                  {i === 0 && <div className="session-card-tag">Mais recente</div>}
                </div>
              </div>

              <h3 className="session-card-title">{s.title}</h3>
              <p className="session-card-location">↳ {s.location}</p>

              <p className="session-card-summary">{s.summary}</p>

              <div className="session-card-meta">
                <div className="session-card-meta-row">
                  <span className="session-card-meta-label">Pessoas</span>
                  <span className="session-card-meta-value">
                    {peopleChips.map(p => (
                      <span key={p} className={`chip-mini ${p.includes('(NPC') ? 'npc' : ''}`}>{p.replace(/ \(NPC.*\)/, '')}</span>
                    ))}
                  </span>
                </div>
                <div className="session-card-meta-row">
                  <span className="session-card-meta-label">Lugares</span>
                  <span className="session-card-meta-value">
                    {placeChips.map(p => (
                      <span key={p} className="chip-mini place">{p}</span>
                    ))}
                  </span>
                </div>
              </div>

              <div className="session-card-cta">Abrir diário completo →</div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// Session detail (full journal page)
// ============================================================
function SessionDetail({ id, onNav }) {
  const s = Entities.sessions[id];
  if (!s) {
    return (
      <div className="page" data-screen-label={"Sessão " + id}>
        <button className="back-btn" onClick={() => onNav('sessions')}>Voltar ao diário</button>
        <h1 className="page-title">Sessão não encontrada</h1>
      </div>
    );
  }

  return (
    <div className="session-detail" data-screen-label={"Sessão " + s.num}>
      <button className="back-btn" onClick={() => onNav('sessions')}>
        Voltar ao diário
      </button>

      <header className="session-detail-head">
        <div className="session-detail-num">{String(s.num).padStart(2,'0')}</div>
        <div className="session-detail-num-label">Sessão · {s.dateShort}</div>
        <h1 className="session-detail-title">{s.title}</h1>
        <p className="session-detail-location">↳ {s.location}</p>
        <p className="session-detail-location-sub">{s.locationDetail}</p>

        <div className="session-meta-strip">
          <div>
            <span className="label">Data</span>
            <span className="value">{s.date}</span>
          </div>
          <div>
            <span className="label">Duração</span>
            <span className="value">{s.duration}</span>
          </div>
          <div>
            <span className="label">Experiência</span>
            <span className="value">{s.session_xp}</span>
          </div>
          <div>
            <span className="label">Próxima</span>
            <span className="value" style={{fontSize: 12, letterSpacing:'0.04em'}}>{s.next}</span>
          </div>
        </div>
      </header>

      <section className="session-detail-block">
        <h2>Resumo</h2>
        <p style={{fontStyle:'italic', color:'var(--foam)', fontSize:18}}>{s.summary}</p>
      </section>

      <section className="session-detail-block">
        <h2>Elenco da Sessão</h2>
        <div className="session-detail-chips">
          {s.cast.map(c => {
            const isNpc = c.includes('NPC');
            const name = c.replace(/ \((NPC[^)]*)\)/, '');
            return (
              <span key={c} className={`chip-mini ${isNpc ? 'npc' : ''}`} style={{fontSize:11, padding:'5px 10px'}}>
                {isNpc && <span style={{opacity:0.6, marginRight:4}}>NPC ·</span>}
                {name}
              </span>
            );
          })}
        </div>
      </section>

      <section className="session-detail-block">
        <h2>Lugares Visitados</h2>
        <div className="session-detail-chips">
          {s.places.map(p => (
            <span key={p} className="chip-mini place" style={{fontSize:11, padding:'5px 10px'}}>{p}</span>
          ))}
        </div>
      </section>

      <section className="session-detail-block">
        <h2>Narrativa</h2>
        {s.narrative.map((p, i) => <p key={i}>{p}</p>)}
      </section>

      <section className="session-detail-block">
        <h2>Pontos-Chave</h2>
        <ul className="session-keylist">
          {s.keypoints.map((k, i) => (
            <li key={i} className={k.danger ? 'danger' : ''}>{k.text}</li>
          ))}
        </ul>
      </section>

      {s.loot && s.loot.length > 0 && s.loot[0] !== "—" && (
        <section className="session-detail-block">
          <h2>Espólio & Descobertas</h2>
          <ul className="session-loot">
            {s.loot.map((l, i) => <li key={i}>{l}</li>)}
          </ul>
        </section>
      )}

      {s.gmnote && (
        <section className="session-detail-block">
          <div className="gm-note">{s.gmnote}</div>
        </section>
      )}
    </div>
  );
}

window.Sessions = Sessions;
window.SessionDetail = SessionDetail;
