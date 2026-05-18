// NPC detail page — dossier redesign
// Milestone 1: routing scaffold only

function NpcDetail({ id, onNav }) {
  const c = Entities.characters[id];

  if (!c) {
    return (
      <div className="page">
        <button className="back-btn" onClick={() => onNav('npcs')}>
          Voltar à galeria
        </button>
        <h1 className="page-title">Pessoa não encontrada</h1>
      </div>
    );
  }

  return (
    <div className="page" data-screen-label={"NPC · " + c.name}>
      <button className="back-btn" onClick={() => onNav('npcs')}>
        Voltar à galeria
      </button>
      <h1 className="page-title">{c.name}</h1>
      <p className="page-lede">{c.role}</p>
    </div>
  );
}

window.NpcDetail = NpcDetail;
