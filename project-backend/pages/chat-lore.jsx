// Pergunte ao Arquivo — chat de lore com busca semântica (RAG)
// Ver docs/RAG.md para a arquitetura completa. Primeira versão
// deliberadamente simples: uma caixa de texto e a resposta abaixo.

function ChatLore() {
  const [question, setQuestion] = React.useState('');
  const [history, setHistory] = React.useState([]); // { question, answer, sources, error }[]
  const [busy, setBusy] = React.useState(false);

  async function handleAsk(e) {
    e.preventDefault();
    const q = question.trim();
    if (!q || busy) return;

    setBusy(true);
    setQuestion('');
    const entry = { question: q, answer: null, sources: [], error: null };
    setHistory(h => [...h, entry]);

    try {
      const { data, error } = await window.sb.functions.invoke('wiki-chat', {
        body: { question: q },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setHistory(h => h.map(item =>
        item === entry ? { ...item, answer: data.answer, sources: data.sources || [] } : item
      ));
    } catch (err) {
      setHistory(h => h.map(item =>
        item === entry ? { ...item, error: err.message || 'Falha ao consultar o Arquivo.' } : item
      ));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page" data-screen-label="Pergunte ao Arquivo">
      <header className="page-header">
        <div className="page-eyebrow">Arquivo · Consulta Assistida</div>
        <h1 className="page-title">Pergunte ao Arquivo</h1>
        <p className="page-lede">
          Faça uma pergunta sobre o lore de Valiran — personagens, divindades,
          reinos, facções, sessões, regras da casa. As respostas são geradas
          a partir do conteúdo público desta wiki; segredos de mestre e
          informações redigidas nunca entram na busca.
        </p>
      </header>

      <div style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 24 }}>
        {history.length === 0 && (
          <p style={{ fontFamily: 'EB Garamond, serif', fontStyle: 'italic', color: 'var(--foam-dim)' }}>
            Experimente perguntar algo como "quem é Lamidriel?" ou "o que aconteceu na queda de Lancaster?".
          </p>
        )}

        {history.map((item, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{
              alignSelf: 'flex-end', maxWidth: '85%',
              background: 'var(--ink-slate)', border: '1px solid var(--ink-line)',
              borderRadius: 2, padding: '10px 16px',
              fontFamily: 'EB Garamond, serif', color: 'var(--foam)',
            }}>
              {item.question}
            </div>

            {item.error && (
              <div className="modal-error" style={{ maxWidth: '85%' }}>{item.error}</div>
            )}

            {!item.error && item.answer && (
              <div style={{
                maxWidth: '85%',
                background: 'var(--ink-deep)', border: '1px solid var(--gold-dim)',
                borderRadius: 2, padding: '14px 18px',
                fontFamily: 'EB Garamond, serif', fontSize: 15, lineHeight: 1.6, color: 'var(--foam)',
              }}>
                {item.answer.split('\n').filter(Boolean).map((p, pi) => <p key={pi} style={{ margin: pi ? '10px 0 0' : 0 }}>{p}</p>)}

                {item.sources.length > 0 && (
                  <div style={{
                    marginTop: 14, paddingTop: 10, borderTop: '1px solid var(--ink-line-soft)',
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.08em',
                    color: 'var(--foam-dim)', textTransform: 'uppercase',
                  }}>
                    Fontes: {item.sources.map((s, si) => (
                      <span key={si}>
                        {si > 0 && ' · '}
                        {s.entity_name}{s.section_title ? ` (${s.section_title})` : ''}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {!item.error && !item.answer && (
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--foam-dim)' }}>
                consultando o Arquivo…
              </div>
            )}
          </div>
        ))}

        <form onSubmit={handleAsk} style={{ display: 'flex', gap: 10 }}>
          <input
            className="modal-input"
            style={{ flex: 1 }}
            value={question}
            disabled={busy}
            placeholder="Pergunte algo sobre o lore de Valiran…"
            onChange={e => setQuestion(e.target.value)}
          />
          <button type="submit" className="btn-save" disabled={busy || !question.trim()}>
            {busy ? 'Enviando…' : 'Perguntar'}
          </button>
        </form>
      </div>
    </div>
  );
}

window.ChatLore = ChatLore;
