// Dramatis Personae — character gallery

function Characters({ onNav }) {
  const cast = [
    { id: 'kathryn',    tag: 'PC',    tagClass: 'pc',   name: 'Käthryn Verlaine',  role: 'Paladina dissidente · Lancaster',     faction: 'Lancaster (caído)', class: 'Paladina · nv. 7' },
    { id: 'halric',     tag: 'PC',    tagClass: 'pc',   name: 'Halric Stillvein',  role: 'Bardo conluiado · um conto por estalagem', faction: 'Independente',     class: 'Bardo · nv. 7' },
    { id: 'sothia',     tag: 'PC',    tagClass: 'pc',   name: 'Sothia das Cinzas', role: 'Maga warforged · primeira da linhagem',    faction: 'Lorean Treaz',     class: 'Feiticeira · nv. 7' },
    { id: 'mavor',      tag: 'PC',    tagClass: 'pc',   name: 'Mavor Iceblood',    role: 'Mercenário de Ferro · imune à Trama',      faction: 'Império de Ferro', class: 'Guerreiro · nv. 7' },
    { id: 'vensothiel', tag: 'ALIADO', tagClass: 'ally', name: 'Mestra Ven Sothiel', role: 'Arquimaga decana · mentora arrelíquia', faction: 'Lorean Treaz',     class: 'Arquimaga · nv. 18' },
    { id: 'vagliesII',  tag: 'ALIADO', tagClass: 'ally', name: 'Vaglies II',         role: 'Filho do rei mártir · em exílio',       faction: 'Lancaster (exilado)', class: 'Clérigo · nv. 12' },
    { id: 'annabella',  tag: 'INIMIGO', tagClass: 'foe', name: 'Annabella Whiteflame', role: 'A Rainha Branca · não envelhece',   faction: 'Oshain',           class: '???' },
    { id: 'noel',       tag: 'INIMIGO', tagClass: 'foe', name: 'Noel Braent',        role: 'O Agente do Selo · rosto na multidão', faction: 'Blackflame',       class: 'Ladina arcana · ???' },
    { id: 'caedric',    tag: 'INIMIGO', tagClass: 'foe', name: '"Irmão Caedric"',    role: 'Lacrimosi · prega libertação',         faction: 'Lacrimosi',        class: 'Necromante · nv. 14' },
  ];

  return (
    <div className="page" data-screen-label="12 Dramatis Personae">
      <header className="page-header">
        <div className="page-eyebrow">Crônicas · Volume IV · O Elenco</div>
        <h1 className="page-title">Dramatis Personae</h1>
        <p className="page-lede">
          Todos os nomes que importam no momento atual da história — heróis
          de mesa, aliados ganhos, antagonistas confirmados. Clique em
          qualquer um para abrir a entrada completa.
        </p>
      </header>

      <div className="cast-grid">
        {cast.map(c => {
          const initial = c.name.startsWith('"') ? c.name.charAt(1) : c.name.charAt(0);
          return (
            <article
              key={c.id}
              className="cast-card"
              onClick={() => onNav('character:' + c.id)}
            >
              <div className="cast-portrait">
                <image-slot
                  id={`char-portrait-${c.id}`}
                  shape="rect"
                  placeholder={`Arraste retrato · ${c.name}`}
                  style={{position:'absolute', inset:0, width:'100%', height:'100%'}}
                ></image-slot>
                <span className={`cast-portrait-tag ${c.tagClass}`} style={{zIndex:2}}>{c.tag}</span>
              </div>
              <div className="cast-body">
                <h3 className="cast-name">{c.name}</h3>
                <p className="cast-role">{c.role}</p>
                <div className="cast-meta">
                  <span className="faction">{c.faction}</span>
                  <span>{c.class}</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

window.Characters = Characters;
