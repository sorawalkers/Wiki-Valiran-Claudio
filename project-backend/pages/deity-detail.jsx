// Deity detail — artigo "Vitral" (mesmo layout dos personagens, perfil `deity`; ver vitral.jsx)

function DeityDetail({ id, onNav }) {
  const { isEditor } = useAuth();
  const [editModal, setEditModal] = React.useState(false);

  const d = Entities.deities[id];

  if (!d) {
    const isLoading = Object.keys(Entities.deities).filter(k => Entities.deities[k]).length === 0;
    return (
      <div className="page">
        <button className="back-btn" onClick={() => onNav('pantheon')}>Voltar ao panteão</button>
        {isLoading
          ? <p className="page-lede" style={{ marginTop: 40, textAlign: 'center', fontStyle: 'italic' }}>Carregando…</p>
          : <h1 className="page-title">Divindade não encontrada</h1>}
      </div>
    );
  }

  return (
    <React.Fragment>
      <VitralArticle
        c={d}
        kind="deity"
        onNav={onNav}
        backTo="pantheon"
        backLabel="Panteão"
        isEditor={isEditor}
        onEdit={() => setEditModal(true)}
      />
      {editModal && (
        <ArticleEditor type="deity" entity={d} onClose={() => setEditModal(false)} onDelete={() => onNav('pantheon')} />
      )}
    </React.Fragment>
  );
}

window.DeityDetail = DeityDetail;

// Teste (#/deity-vitral-teste): artigo do Esmir com os dois vitrais completos
// (catedral oval e roseta circular) no lugar do espelho.
function DeityVitralLab({ onNav }) {
  const d = Entities.deities.esmir;
  if (!d) return <div className="page"><p className="page-lede" style={{ marginTop: 40, textAlign: 'center', fontStyle: 'italic' }}>Carregando…</p></div>;
  return (
    <React.Fragment>
      <div className="vt-lab-banner">Versão I · Vitral de catedral (oval)</div>
      <VitralArticle c={d} kind="deity" onNav={onNav} backTo="pantheon" backLabel="Panteão"
        heroVitral={{ file: 'deus-esmir-catedral', shape: 'catedral' }} />
      <div className="vt-lab-banner">Versão II · Roseta circular</div>
      <VitralArticle c={d} kind="deity" onNav={onNav} backTo="pantheon" backLabel="Panteão"
        heroVitral={{ file: 'deus-esmir-roseta', shape: 'roseta' }} />
    </React.Fragment>
  );
}
window.DeityVitralLab = DeityVitralLab;
