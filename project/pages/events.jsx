// Events — filterable list

function Events({ onNav }) {
  const [filter, setFilter] = React.useState('todos');

  const events = [
    { year: 'T-???',   cat: 'div',  catLabel: 'Divino',     title: 'Cerigane tece a Trama', desc: 'O primeiro ato consciente do mundo.', region: 'Pré-Valiran' },
    { year: '1ªE 489', cat: 'div',  catLabel: 'Divino',     title: 'Esmir ascende', desc: 'Um mortal compra com sua morte a era seguinte.', region: 'Lancaster' },
    { year: '2ªE 023', cat: 'pol',  catLabel: 'Político',   title: 'República Prateada é fundada', desc: 'Dragões metálicos pousam sobre o continente sul.', region: 'Aerithys' },
    { year: '2ªE 314', cat: 'arc',  catLabel: 'Arcano',     title: 'Primeiro Warforged desperta', desc: 'Ven Sothiel transfere uma consciência para o aço.', region: 'Lorean Treaz' },
    { year: '2ªE 798', cat: 'pol',  catLabel: 'Político',   title: 'Annabella é coroada', desc: 'Uma rainha jovem que jamais envelheceu um dia.', region: 'Oshain' },
    { year: '3ªE 1276', cat: 'cata', catLabel: 'Catástrofe', title: 'A Queda de Lancaster', desc: 'O selo é rompido. O reino sagrado cai em uma noite.', region: 'Lancaster', target: 'article' },
    { year: '3ªE 1276', cat: 'div',  catLabel: 'Divino',     title: 'Vaglies Lihleran I se sacrifica', desc: 'O Rei oferece a própria vida para retardar a fenda.', region: 'Lancaster' },
    { year: '3ªE 1278', cat: 'pol',  catLabel: 'Político',   title: 'Blackflame parcialmente revelada', desc: 'Documentos vazam, e Oshain mente sobre vinte coisas em vez de uma.', region: 'Halensgard' },
    { year: '3ªE 1279', cat: 'cata', catLabel: 'Catástrofe', title: 'Mortvuus se mexe', desc: 'Pela primeira vez em milênios, o Silêncio Primeiro fala. Ninguém entendeu o que disse.', region: 'Indeterminado' },
    { year: '3ªE 1280', cat: 'arc',  catLabel: 'Arcano',     title: 'A décima primeira ruptura', desc: 'O Concílio mapeia mais uma cicatriz na Trama. A perícia magisterial chora discretamente.', region: 'Lorean Treaz' },
    { year: '3ªE 1281', cat: 'pol',  catLabel: 'Político',   title: 'A campanha começa', desc: 'Sete heróis improváveis se cruzam numa estalagem.', region: 'Tarvane', target: 'sessions' },
  ];

  const filters = [
    { id: 'todos', label: 'Tudo' },
    { id: 'div',   label: 'Divino' },
    { id: 'pol',   label: 'Político' },
    { id: 'cata',  label: 'Catástrofe' },
    { id: 'arc',   label: 'Arcano' },
  ];

  const filtered = events.filter(e => filter === 'todos' || e.cat === filter);

  return (
    <div className="page" data-screen-label="11 Eventos da Era">
      <header className="page-header">
        <div className="page-eyebrow">Crônicas · Volume IV · Eventos catalogados</div>
        <h1 className="page-title">Eventos da Era</h1>
        <p className="page-lede">
          A linha do tempo é um rio; os eventos são as pedras. Aqui se
          listam, por categoria e por data, os momentos que marcaram cada
          uma das três eras. Para narrativa contínua, ver Linha do Tempo.
        </p>
      </header>

      <div className="events-controls">
        <span style={{
          fontFamily:'JetBrains Mono, monospace', fontSize:10, letterSpacing:'0.22em',
          textTransform:'uppercase', color:'var(--gold-dim)', marginRight: 8,
        }}>Filtrar por categoria:</span>
        {filters.map(f => (
          <button
            key={f.id}
            className={`chip ${filter === f.id ? 'active' : ''}`}
            onClick={() => setFilter(f.id)}
          >{f.label}</button>
        ))}
        <span style={{
          marginLeft:'auto',
          fontFamily:'JetBrains Mono, monospace', fontSize:10, letterSpacing:'0.18em',
          color:'var(--foam-dim)',
        }}>{filtered.length} de {events.length} eventos</span>
      </div>

      <div className="events-table">
        <div className="events-row header">
          <span>Ano</span>
          <span>Categoria</span>
          <span>Evento</span>
          <span style={{textAlign:'right'}}>Região</span>
        </div>
        {filtered.map((e, i) => (
          <div key={i} className="events-row" onClick={() => e.target && onNav(e.target)}>
            <span className="events-year">{e.year}</span>
            <span className={`events-cat ${e.cat}`}>{e.catLabel}</span>
            <div>
              <h4 className="events-title">{e.title}</h4>
              <p className="events-desc">{e.desc}</p>
            </div>
            <span className="events-region">{e.region.toUpperCase()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

window.Events = Events;
