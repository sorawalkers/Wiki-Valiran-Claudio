// Facções secretas — dossier / classified style

function Factions({ onNav }) {
  const list = [
    {
      id: 'BF-001 / OSH',
      name: 'Blackflame',
      alias: 'A Mão Esquerda da Rainha',
      stamp: 'CONFIDENCIAL',
      rows: [
        { k: 'Origem', v: 'Reino de Oshain · ≈ 2ªE 798' },
        { k: 'Comando', v: 'Annabella Whiteflame (confirmado)' },
        { k: 'Membros', v: '≈ 240 (estimado)' },
        { k: 'Operações', v: 'Sabotagem, infiltração, ruptura planar' },
        { k: 'Patente máx.', v: 'CHAMA NEGRA' },
      ],
      summary: 'Organização que oficialmente não existe. Documentos vazados em 1278 sugerem participação direta na queda de Lancaster. A Rainha negou em discurso público; a negação durou trinta segundos.',
    },
    {
      id: 'LC-014 / VAL',
      name: 'Os Lacrimosi',
      alias: 'Os Que Choram',
      stamp: 'HERESIA · CLASSE III',
      rows: [
        { k: 'Origem', v: 'Itinerante · sem base fixa' },
        { k: 'Comando', v: '[DADO EXPURGADO]', redacted: true },
        { k: 'Membros', v: 'Desconhecido · circulação rural' },
        { k: 'Operações', v: 'Pregação, vigília, libertação angélica' },
        { k: 'Patente máx.', v: 'IRMÃO DA LÁGRIMA' },
      ],
      summary: 'Adoram Ayael — não por crueldade, mas por piedade. Querem libertá-lo. São proibidos em quase todo o continente, e em alguns lugares queimados em praça. Em outros, infelizmente, têm razão.',
    },
    {
      id: 'CM-007 / LRT',
      name: 'Concílio Magisterial',
      alias: 'Os Sete da Torre',
      stamp: 'OFICIAL · LIBERADO',
      stampClass: 'green',
      rows: [
        { k: 'Origem', v: 'Lorean Treaz · 2ªE 314' },
        { k: 'Comando', v: 'Mestra Ven Sothiel (decano)' },
        { k: 'Membros', v: '7 arquimagos eleitos' },
        { k: 'Operações', v: 'Governo, pesquisa arcana, Warforged' },
        { k: 'Patente máx.', v: 'DECANO' },
      ],
      summary: 'O conselho que governa Lorean Treaz. Únicos no continente a possuírem o direito legal de prender o próprio chefe de estado por violação ética. Já exerceram esse direito uma vez.',
    },
    {
      id: 'CV-???',
      name: '[REGISTRO SELADO]',
      alias: 'O Pacto da Casa Velhaur',
      stamp: 'SELADO · CONSELHO',
      rows: [
        { k: 'Origem', v: '[DADO EXPURGADO]', redacted: true },
        { k: 'Comando', v: '[DADO EXPURGADO]', redacted: true },
        { k: 'Membros', v: '[DADO EXPURGADO]', redacted: true },
        { k: 'Operações', v: 'Conhecidas apenas pela Mesa do Conselho' },
        { k: 'Patente máx.', v: '[DADO EXPURGADO]', redacted: true },
      ],
      summary: 'O conteúdo deste dossiê foi selado por ordem do Arquivo em 11 do segundo mês, 1281. Tentativas de acesso não autorizado serão registradas e respondidas.',
    },
  ];

  return (
    <div className="page" data-screen-label="10 Facções Secretas">
      <header className="page-header">
        <div className="page-eyebrow">Anexo do Conselho · Vol. VII · Acesso restrito</div>
        <h1 className="page-title">Facções</h1>
        <p className="page-lede">
          Nem todo poder se anuncia em bandeiras. Aqui se mantêm dossiês das
          organizações que operam nas brechas — algumas oficiais, outras
          heréticas, uma delas literalmente apagada do registro. A consulta
          é permitida; a transcrição, não.
        </p>
      </header>

      <div className="dossier-grid">
        {list.map(d => (
          <article key={d.id} className="dossier">
            <div className={`dossier-stamp ${d.stampClass || ''}`}>{d.stamp}</div>
            <div className="dossier-id">DOSSIÊ · {d.id}</div>
            <h3 className="dossier-name">{d.name}</h3>
            <p className="dossier-alias">{d.alias}</p>

            <dl className="dossier-rows">
              {d.rows.map(r => (
                <div key={r.k} className="dossier-row">
                  <dt>{r.k}</dt>
                  <dd className={r.redacted ? 'redacted' : ''}>{r.v}</dd>
                </div>
              ))}
            </dl>

            <p className="dossier-summary">{d.summary}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

window.Factions = Factions;
