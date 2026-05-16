// House rules — documentation

function HouseRules({ onNav }) {
  const rules = [
    {
      title: 'Inspiração & Pontos do Destino',
      body: (
        <React.Fragment>
          <p>
            Cada jogador começa a sessão com <code>1 ponto de Inspiração</code>.
            Pode ser gasto a qualquer momento para rolar com vantagem em um
            teste, OU dado a outro jogador como reconhecimento de boa
            interpretação.
          </p>
          <p>
            O Mestre concede Inspiração extra quando: (a) você descreve a sua
            ação em vez de citar a mecânica, (b) você toma uma decisão difícil
            em vez de uma fácil, (c) você faz a mesa rir sem quebrar o tom.
          </p>
          <div className="docs-callout">
            <strong>Lembrete</strong>
            Inspiração não acumula entre sessões. Use ou perca. O Mestre
            registra ao final de cada sessão se você terminou com saldo.
          </div>
        </React.Fragment>
      ),
    },
    {
      title: 'Crítico & Falha Crítica',
      body: (
        <React.Fragment>
          <p>
            Ataques críticos (rolagem natural de <code>20</code>): dobre todos
            os dados de dano, não os modificadores. Em alvos vulneráveis,
            o crítico ignora resistências do mesmo tipo.
          </p>
          <p>
            Falhas críticas (rolagem natural de <code>1</code>) em combate:
            o personagem perde a ação de movimento no próximo turno. Em
            testes fora de combate, o Mestre narra uma complicação
            proporcional ao risco da tarefa.
          </p>
        </React.Fragment>
      ),
    },
    {
      title: 'Magia em Terra Corrompida',
      body: (
        <React.Fragment>
          <p>
            Toda magia conjurada em regiões marcadas como <code>Corrompida</code> no
            mapa exige um teste de Concentração (CD 10 + nível do feitiço)
            mesmo sem dano sofrido. Falha: o feitiço é conjurado, mas algo
            mais escapa da Trama junto.
          </p>
          <p>
            Necromância em terra corrompida é amplificada — e literalmente
            puxa material direto do <a onClick={() => onNav('article')}>cárcere de Ayael</a>. Os
            efeitos secundários são reais, narrativos, e raramente bonitos.
          </p>
          <div className="docs-callout">
            <strong>Aviso ao Mestre</strong>
            Não use esta regra como punição arbitrária. Use-a quando a
            mesa esquecer onde está pisando. O peso da geografia
            mágica é parte da experiência.
          </div>
        </React.Fragment>
      ),
    },
    {
      title: 'Tempo de Descanso & Cura',
      body: (
        <React.Fragment>
          <p>
            Descanso curto: <code>1 hora</code>, recupera dados de vida
            usando dados de classe + Constituição (normal).
          </p>
          <p>
            Descanso longo: <code>8 horas</code>, mas exige local seguro e
            preparado. Pernoitar em estrada conta como descanso curto. Quem
            for ferido por necromância na sessão precisa de <code>24 horas</code> em
            local consagrado para recuperar vida máxima.
          </p>
        </React.Fragment>
      ),
    },
    {
      title: 'Etiqueta de Mesa',
      body: (
        <React.Fragment>
          <p>
            Celulares ficam virados para baixo durante interpretação. Pode
            usar entre as cenas. Combate: foco total — quem chega depois da
            rolagem de iniciativa só age no próximo round.
          </p>
          <p>
            Vetos sem julgamento: qualquer jogador pode levantar a mão e
            pedir para mudar o rumo de uma cena. O Mestre acata sem
            perguntar o porquê. Conversamos depois, se for útil.
          </p>
          <div className="docs-callout">
            <strong>Princípio fundador</strong>
            A mesa existe para gerar memórias compartilhadas. Tudo o mais
            é estrutura para sustentar isso.
          </div>
        </React.Fragment>
      ),
    },
  ];

  return (
    <div className="page" data-screen-label="14 Regras da Casa">
      <header className="page-header">
        <div className="page-eyebrow">Mesa · Vol. VIII · Anexo Técnico</div>
        <h1 className="page-title">Regras da Casa</h1>
        <p className="page-lede">
          O sistema base é o mesmo. Estas são as cinco modulações que esta
          mesa adota — algumas reforçam interpretação, outras pesam a
          geografia mágica do continente, todas existem para servir à
          história, não ao contrário.
        </p>
      </header>

      <div className="docs">
        <aside className="docs-toc">
          <h4 className="docs-toc-title">Sumário</h4>
          <ol>
            {rules.map((r, i) => (
              <li key={r.title} className={i === 0 ? 'active' : ''}>{r.title}</li>
            ))}
          </ol>
        </aside>

        <div className="docs-content">
          {rules.map((r, i) => (
            <section key={r.title} className="docs-rule">
              <div className="docs-rule-num">{String(i+1).padStart(2,'0')} / {String(rules.length).padStart(2,'0')}</div>
              <h2>{r.title}</h2>
              {r.body}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

window.HouseRules = HouseRules;
