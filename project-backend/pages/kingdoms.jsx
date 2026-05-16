// Kingdoms — encyclopedia cards

function Kingdoms({ onNav }) {
  const list = [
    {
      sigil: 'Crown',
      eyebrow: 'Monarquia · expansionista',
      name: 'Reino de Oshain',
      motto: '"Sob a chama, todo o mundo é casa."',
      desc: 'Liderado há mais de um século pela Rainha Annabella Whiteflame, Oshain triplicou seu território no último século. A organização Blackflame, oficialmente inexistente, parece sempre presente em cada anexação.',
      stats: [
        { k: 'Capital', v: 'Halensgard' },
        { k: 'Liderança', v: 'Rainha Annabella' },
        { k: 'População', v: '≈ 4.2M' },
        { k: 'Alinhamento', v: 'Tirânico', danger: true },
      ],
      target: 'map',
    },
    {
      sigil: 'Dragon',
      eyebrow: 'República dracônica · bastião',
      name: 'República Prateada de Bahamut',
      motto: '"A justiça não tem escamas — mas conhece quem as tem."',
      desc: 'Fundada por dragões metálicos anciões há mil anos. Hoje, o Conselho dos Dez governa a partir da cidade de Aerithys. Refúgio último de heróis, dissidentes e fugitivos da expansão oshainita.',
      stats: [
        { k: 'Capital', v: 'Aerithys' },
        { k: 'Liderança', v: 'Conselho dos Dez' },
        { k: 'População', v: '≈ 2.8M' },
        { k: 'Alinhamento', v: 'Leal-Bom' },
      ],
      target: 'map',
    },
    {
      sigil: 'Tome',
      eyebrow: 'Magocracia · vanguarda arcana',
      name: 'Magocracia de Lorean Treaz',
      motto: '"O fio que se conhece é o fio que se domina."',
      desc: 'Governada pelo Concílio Magisterial, sete arquimagos eleitos pelos pares. Pioneira em tecnologia Warforged, em manipulação direta da Trama, e nas únicas leis arcanas do continente que prendem o próprio rei.',
      stats: [
        { k: 'Capital', v: 'Torre Plúrima' },
        { k: 'Liderança', v: 'Concílio (7)' },
        { k: 'População', v: '≈ 1.6M' },
        { k: 'Alinhamento', v: 'Neutro' },
      ],
      target: 'weave',
    },
    {
      sigil: 'Crown',
      eyebrow: 'Império militar · isolacionista',
      name: 'Império de Ferro',
      motto: '"O ferro não se curva, e não é curvado."',
      desc: 'Cortaram sua própria conexão com a Trama Mágica três gerações atrás. Imunes a manipulação arcana — e a benções, e a cura. Vivem em isolamento marcial sob o Imperador-de-Aço Korvath VII.',
      stats: [
        { k: 'Capital', v: 'Tor Klain' },
        { k: 'Liderança', v: 'Korvath VII' },
        { k: 'População', v: '≈ 3.0M' },
        { k: 'Alinhamento', v: 'Leal-Neutro' },
      ],
      target: 'weave',
    },
    {
      sigil: 'Chain',
      eyebrow: 'Ruínas ocupadas · corrompida',
      name: '† Nova Lancaster',
      motto: '"Onde Esmir dormia, agora apenas se chora."',
      desc: 'O antigo reino sagrado de Lancaster caiu em 1276 quando o Selo da Tumba dos Hereges foi rompido. Oshain anexou as ruínas e as renomeou. A corrupção continua a vazar do solo até hoje.',
      stats: [
        { k: 'Antigo nome', v: 'Lancaster' },
        { k: 'Caiu em', v: '3ªE 1276' },
        { k: 'Ocupada por', v: 'Oshain' },
        { k: 'Estado', v: 'Corrompida', danger: true },
      ],
      target: 'timeline',
    },
  ];

  return (
    <div className="page" data-screen-label="09 Reinos & Potências">
      <header className="page-header">
        <div className="page-eyebrow">Geopolítica · Volume V · Fólio 01</div>
        <h1 className="page-title">Reinos & Potências</h1>
        <p className="page-lede">
          Cinco potências dividem hoje o continente de Valiran. Quatro delas
          se chamam de civilização. A quinta foi cidade-santa, agora é cova
          aberta. Aqui constam seus brasões, seus números e o que se sabe
          de suas verdadeiras intenções.
        </p>
      </header>

      <div className="kingdom-list">
        {list.map(k => {
          const Icon = Sigil[k.sigil];
          return (
            <article key={k.name} className="kingdom-card" onClick={() => k.target && onNav(k.target)}>
              <div className="kingdom-crest">
                <Icon />
              </div>
              <div className="kingdom-body">
                <div className="kingdom-eyebrow">{k.eyebrow}</div>
                <h3 className="kingdom-name">{k.name}</h3>
                <p className="kingdom-motto">{k.motto}</p>
                <p className="kingdom-desc">{k.desc}</p>
              </div>
              <div className="kingdom-stats">
                {k.stats.map(s => (
                  <div key={s.k} className="kingdom-stat">
                    <span className="kingdom-stat-k">{s.k}</span>
                    <span className={`kingdom-stat-v ${s.danger ? 'danger' : ''}`}>{s.v}</span>
                  </div>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

window.Kingdoms = Kingdoms;
