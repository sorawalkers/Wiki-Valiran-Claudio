// Recent additions — auto-generated changelog from DB timestamps

function Recent({ onNav }) {
  const [, setTick] = React.useState(0);

  React.useEffect(() => {
    const refresh = () => setTick(t => t + 1);
    window.addEventListener('db-refresh', refresh);
    return () => window.removeEventListener('db-refresh', refresh);
  }, []);

  const entries = Data.feed || [];

  const days = [];
  const seen = new Map();
  entries.forEach(e => {
    const key = e.date_label || '—';
    if (!seen.has(key)) {
      const group = { date: key, entries: [] };
      seen.set(key, group);
      days.push(group);
    }
    seen.get(key).entries.push(e);
  });

  return (
    <div className="page" data-screen-label="06 Adições Recentes">
      <header className="page-header">
        <div className="page-header-row">
          <div>
            <div className="page-eyebrow">Sumário do Escriba · Vol. III · Fólio 47</div>
            <h1 className="page-title">Adições Recentes</h1>
          </div>
        </div>
        <p className="page-lede">
          Cada folha do Arquivo carrega um testemunho. Aqui estão as últimas
          escritas — novas entradas e revisões, registradas automaticamente
          conforme o Arquivo é atualizado.
        </p>
      </header>

      {entries.length === 0 && (
        <div style={{ padding:'60px 0', textAlign:'center', color:'var(--foam-dim)', fontFamily:'EB Garamond, serif', fontStyle:'italic', fontSize:16 }}>
          Nenhuma entrada registrada no Arquivo ainda.
        </div>
      )}

      <div className="feed">
        {days.map(d => (
          <div key={d.date} className="feed-day">
            <div className="feed-day-header">
              <div className="feed-day-date">{d.date}</div>
              <div className="feed-day-count">{d.entries.length} {d.entries.length === 1 ? 'entrada' : 'entradas'}</div>
            </div>
            {d.entries.map((e, i) => (
              <div
                key={i}
                className="feed-entry"
                onClick={() => e.target && onNav(e.target)}
                style={e.target ? { cursor: 'pointer' } : undefined}
              >
                <div className={`feed-type ${e.entry_type}`}>{e.action}</div>
                <div className="feed-time">{e.time_label}</div>
                <div>
                  <h4 className="feed-title">{e.title}</h4>
                  {e.subtitle && <p className="feed-desc">{e.subtitle}</p>}
                </div>
                <div className="feed-author">{e.type_label}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

window.Recent = Recent;
