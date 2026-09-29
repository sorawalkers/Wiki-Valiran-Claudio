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
  // um deus sem vitral, para comparar lado a lado
  const others = Object.values(Entities.deities).filter(x => x && x.name && x.id !== 'esmir' && vtDeityTier(x) === 'deus').slice(0, 1);
  if (!d) return <div className="page"><p className="page-lede" style={{ marginTop: 40, textAlign: 'center', fontStyle: 'italic' }}>Carregando…</p></div>;
  return (
    <React.Fragment>
      <div className="vt vt-pantheon">
        <section className="vt-tier vt-tier--deus">
          <header className="vt-tier-head">
            <span className="vt-tier-num">II <small>/ III</small></span>
            <div>
              <h2 className="vt-tier-name">Deuses do Panteão</h2>
              <p className="vt-tier-desc">Teste da galeria: o vitral do Esmir em roseta e em catedral, ao lado de um deus que ainda não tem vitral.</p>
            </div>
          </header>
          <div className="vt-lab-row">
            <div className="vt-lab-col"><span className="vt-lab-tag">Roseta</span>
              <VitralDeityCard deity={d} tone="deus" vitral={{ file: 'deus-esmir-roseta', shape: 'roseta' }} onClick={() => onNav('deity:esmir')} /></div>
            <div className="vt-lab-col"><span className="vt-lab-tag">Catedral</span>
              <VitralDeityCard deity={d} tone="deus" vitral={{ file: 'deus-esmir-catedral', shape: 'catedral' }} onClick={() => onNav('deity:esmir')} /></div>
            {others.map(o => (
              <div key={o.id} className="vt-lab-col"><span className="vt-lab-tag">Sem vitral</span>
                <VitralDeityCard deity={o} tone="deus" onClick={() => onNav('deity:' + o.id)} /></div>
            ))}
          </div>
        </section>
      </div>
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
