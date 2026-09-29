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
  // Bahamut, que ainda não tem vitral, para comparar lado a lado
  const bahamut = Entities.deities.bahamut;
  if (!d) return <div className="page"><p className="page-lede" style={{ marginTop: 40, textAlign: 'center', fontStyle: 'italic' }}>Carregando…</p></div>;
  return (
    <React.Fragment>
      <div className="vt vt-pantheon">
        <section className="vt-tier vt-tier--deus">
          <header className="vt-tier-head">
            <span className="vt-tier-num">II <small>/ III</small></span>
            <div>
              <h2 className="vt-tier-name">Deuses do Panteão</h2>
              <p className="vt-tier-desc">Teste da galeria: o vitral do Esmir em roseta e em catedral, ao lado do Bahamut, que ainda não tem vitral, no espelho oval e no circular.</p>
            </div>
          </header>
          <div className="vt-lab-row">
            <div className="vt-lab-col"><span className="vt-lab-tag">Roseta</span>
              <VitralDeityCard deity={d} tone="deus" vitral={{ file: 'deus-esmir-roseta', shape: 'roseta' }} onClick={() => onNav('deity:esmir')} /></div>
            <div className="vt-lab-col"><span className="vt-lab-tag">Catedral</span>
              <VitralDeityCard deity={d} tone="deus" vitral={{ file: 'deus-esmir-catedral', shape: 'catedral' }} onClick={() => onNav('deity:esmir')} /></div>
            {bahamut && (
              <React.Fragment>
                <div className="vt-lab-col"><span className="vt-lab-tag">Sem vitral · oval</span>
                  <VitralDeityCard deity={bahamut} tone="deus" shape="oval" onClick={() => onNav('deity:bahamut')} /></div>
                <div className="vt-lab-col"><span className="vt-lab-tag">Sem vitral · circular</span>
                  <VitralDeityCard deity={bahamut} tone="deus" shape="circular" onClick={() => onNav('deity:bahamut')} /></div>
              </React.Fragment>
            )}
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

// Teste (#/deity-altar-teste): nova estrutura do artigo de divindade com Lamidriel e a Senhora da Rapina.
function DeityAltarLab({ onNav }) {
  const ids = ['lamidriel', 'senhora-da-rapina'];
  const list = ids.map(id => Entities.deities[id]).filter(Boolean);
  if (!list.length) return <div className="page"><p className="page-lede" style={{ marginTop: 40, textAlign: 'center', fontStyle: 'italic' }}>Carregando…</p></div>;
  return (
    <React.Fragment>
      {list.map((d, i) => (
        <React.Fragment key={d.id}>
          <div className="vt-lab-banner">Protótipo {vtRoman(i + 1)} · {d.name}</div>
          <VitralDeityAltar c={d} onNav={onNav} />
        </React.Fragment>
      ))}
    </React.Fragment>
  );
}
window.DeityAltarLab = DeityAltarLab;
