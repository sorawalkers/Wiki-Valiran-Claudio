// Recent additions — chronological feed of edits

function Recent({ onNav }) {
  const days = [
    {
      date: "14 do Segundo Mês, 1281",
      relative: "Hoje",
      entries: [
        { type: 'new',    typeLabel: 'NOVO',    time: '22:14', title: 'Ayael, o que Sangra Luz', desc: 'Entrada criada · 8 seções, 14 referências cruzadas', author: 'Cael', target: 'article' },
        { type: 'edit',   typeLabel: 'EDIÇÃO',  time: '19:48', title: 'A Queda de Lancaster', desc: 'Adicionados testemunhos da Casa Velhaur · §3 e §5 reescritos', author: 'Volgren', target: 'timeline' },
        { type: 'danger', typeLabel: 'AVISO',   time: '17:02', title: 'Tumba dos Hereges', desc: 'Reportado novo vazamento planar — região rebaixada a "Corrompida"', author: 'Patrulha Prateada', target: 'map' },
        { type: 'minor',  typeLabel: 'MENOR',   time: '14:30', title: 'Bahamut, Pai Platinado', desc: 'Correção tipográfica · epíteto restaurado', author: 'Cael' },
      ],
    },
    {
      date: "13 do Segundo Mês",
      relative: "Ontem",
      entries: [
        { type: 'new',    typeLabel: 'NOVO',    time: '23:11', title: 'Noel Braent, o Agente do Selo', desc: 'Dossiê classificado · acesso restrito à Mesa', author: 'Mestre' },
        { type: 'edit',   typeLabel: 'EDIÇÃO',  time: '20:55', title: 'Annabella Whiteflame', desc: 'Anexada cronologia comparativa de aparições públicas (séc. XI–XIII)', author: 'Volgren' },
        { type: 'edit',   typeLabel: 'EDIÇÃO',  time: '16:40', title: 'Warforged · Coração de Cristal', desc: 'Diagramas técnicos atualizados — Ven Sothiel revisou pessoalmente', author: 'Aprendiz Iren' },
      ],
    },
    {
      date: "12 do Segundo Mês",
      relative: "Há 2 dias",
      entries: [
        { type: 'new',    typeLabel: 'NOVO',    time: '21:30', title: 'Os Lacrimosi', desc: 'Facção herética catalogada · 8 membros conhecidos', author: 'Cael' },
        { type: 'minor',  typeLabel: 'MENOR',   time: '15:12', title: 'A Trama Mágica', desc: 'Adicionado glossário', author: 'Aprendiz Iren' },
        { type: 'danger', typeLabel: 'PURGA',   time: '11:00', title: 'Tratado da Compaixão Excessiva', desc: 'Entrada selada por ordem do Conselho · acesso revogado', author: 'Conselho' },
      ],
    },
    {
      date: "11 do Segundo Mês",
      relative: "Há 3 dias",
      entries: [
        { type: 'edit',   typeLabel: 'EDIÇÃO',  time: '22:00', title: 'Sessão 23 · As Marcas no Pântano', desc: 'Diário transcrito por Volgren · 14 páginas', author: 'Volgren', target: 'sessions' },
        { type: 'edit',   typeLabel: 'EDIÇÃO',  time: '18:22', title: 'República Prateada de Bahamut', desc: 'Atualizado mapa político — anexação de Vellis pela coroa de Aerithys', author: 'Cael' },
      ],
    },
  ];

  return (
    <div className="page" data-screen-label="06 Adições Recentes">
      <header className="page-header">
        <div className="page-eyebrow">Sumário do Escriba · Vol. III · Fólio 47</div>
        <h1 className="page-title">Adições Recentes</h1>
        <p className="page-lede">
          Cada folha do Arquivo carrega um testemunho. Aqui estão as últimas
          escritas — novas entradas, revisões e os raros documentos selados
          pelo Conselho. Cleo o mais recente primeiro.
        </p>
      </header>

      <div className="feed">
        {days.map(d => (
          <div key={d.date} className="feed-day">
            <div className="feed-day-header">
              <div className="feed-day-date">{d.date}</div>
              <div className="feed-day-relative">· {d.relative}</div>
              <div className="feed-day-count">{d.entries.length} entradas</div>
            </div>
            {d.entries.map((e, i) => (
              <div key={i} className="feed-entry" onClick={() => e.target && onNav(e.target)}>
                <div className={`feed-type ${e.type}`}>{e.typeLabel}</div>
                <div className="feed-time">{e.time}</div>
                <div>
                  <h4 className="feed-title">{e.title}</h4>
                  <p className="feed-desc">{e.desc}</p>
                </div>
                <div className="feed-author">por {e.author}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

window.Recent = Recent;
