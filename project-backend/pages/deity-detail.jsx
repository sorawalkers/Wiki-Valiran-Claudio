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
      <VitralDeityAltar
        c={d}
        onNav={onNav}
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
