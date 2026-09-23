// Character detail (PC) — artigo "Vitral" (ver vitral.jsx)

const { useState: useChState } = React;

function CharacterDetail({ id, onNav }) {
  const { isEditor } = useAuth();
  const [editModal, setEditModal] = useChState(false);
  const c = Entities.characters[id];

  if (!c) {
    const isLoading = Object.keys(Entities.characters).length === 0;
    return (
      <div className="page">
        <button className="back-btn" onClick={() => onNav('characters')}>
          Voltar à galeria
        </button>
        {isLoading
          ? <p className="page-lede" style={{ marginTop: 40, textAlign: 'center', fontStyle: 'italic' }}>Carregando…</p>
          : <h1 className="page-title">Personagem não encontrado</h1>
        }
      </div>
    );
  }

  return (
    <React.Fragment>
      <VitralArticle
        c={c}
        onNav={onNav}
        backTo="characters"
        backLabel="Personagens"
        isEditor={isEditor}
        onEdit={() => setEditModal(true)}
      />
      {editModal && (
        <ArticleEditor type="character" entity={c} onClose={() => setEditModal(false)} onDelete={() => onNav('characters')} />
      )}
    </React.Fragment>
  );
}

window.CharacterDetail = CharacterDetail;
