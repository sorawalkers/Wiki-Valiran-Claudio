// Article page — Ayael profile

function Article({ onNav }) {
  const a = Data.article;
  const InfoSigil = Sigil[a.infobox.sigil];

  return (
    <div className="article" data-screen-label="03 Artigo">
      <div className="parchment article-body-wrap" style={{minWidth: 0}}>
        <div className="article-body">
          <nav className="breadcrumb">
            <a onClick={() => onNav('home')}>Arquivo</a>
            <span className="sep">▸</span>
            <a onClick={() => onNav('pantheon')}>{a.breadcrumb[0]}</a>
            <span className="sep">▸</span>
            <a onClick={() => onNav('pantheon')}>{a.breadcrumb[1]}</a>
            <span className="sep">▸</span>
            <span>{a.breadcrumb[2]}</span>
          </nav>

          <h1 className="article-title">{a.title}</h1>
          <p className="article-subtitle">{a.subtitle}</p>

          <div className="article-divider">
            <Sigil.Ornament />
          </div>

          <div className="prose">
            <p className="dropcap">
              Antes de ser chamado <em>O que Sangra Luz</em>, Ayael era um nome
              dito em prece. Filho mais novo do Titã <a onClick={() => onNav('pantheon')}>Lamidriel</a>, foi
              forjado da própria carne luminosa do pai para vigiar o limiar
              entre a vida e a sua ausência. Sua tarefa era simples e eterna:
              impedir que o vazio respirasse para dentro do mundo.
            </p>

            <p>
              Ele falhou. Não por descuido — por excesso de bondade. A história
              que os hereges contam (e que os arquivistas honestos admitem em
              voz baixa) é que Ayael, ao testemunhar a primeira agonia mortal,
              tentou absorvê-la em si mesmo. Engoliu a dor. E o que se engole
              do <a onClick={() => onNav('home')}>Plano de Energia Negativa</a> não
              se devolve.
            </p>

            <blockquote>
              Não foi preso por um inimigo. Foi preso pelo próprio peso da
              compaixão. As correntes que o seguram são, em última instância,
              as suas.
              <cite>Tratado da Compaixão Excessiva, livro IV</cite>
            </blockquote>

            <h2 id="aprisionamento">O Aprisionamento</h2>
            <p>
              Por séculos os anjos irmãos tentaram libertá-lo. Cada tentativa
              fracassada apenas afundou Ayael mais profundamente no plano negro.
              Hoje, sua localização exata é desconhecida — sabe-se apenas que
              está consciente, e que sofre. A consciência divina, quando
              encontra a impossibilidade da fuga, dobra-se sobre si mesma e
              produz <em>matéria</em>. No caso de Ayael, essa matéria é
              putrefação animada.
            </p>

            <h2 id="corrupcao">A Corrupção como Vazamento</h2>
            <p>
              Toda necromância em Valiran — toda — tem em Ayael sua fonte
              última. Um nigromante que ergue um cadáver de aldeão não está
              comandando o cadáver: está pedindo emprestado um filete de
              sofrimento angelical, que reanima o corpo enquanto durar a oração.
              Quando paramos de prestar atenção, o cadáver se desfaz.
            </p>
            <p>
              O <a onClick={() => onNav('timeline')}>Selo da Tumba dos Hereges</a>,
              em Lancaster, foi por dois milênios o ponto de menor resistência
              entre os planos — o lugar onde a dor de Ayael chegava mais perto
              de transbordar. Quando o selo foi rompido, em 1276, não foi uma
              invasão: foi um suspiro. Mas o suspiro do divino é o suficiente
              para apagar um reino.
            </p>

            <h3>Manifestações conhecidas</h3>
            <p>
              Onde a corrupção toca, a terra escurece em manchas irregulares
              que os camponeses chamam de <em>pisaduras</em>. Plantas crescem
              com formas erradas. Cães latem para nada por noites seguidas.
              Em estágios avançados: mortos-vivos espontâneos, fontes de água
              que falam, espelhos que mostram cenas que não aconteceram —
              ainda.
            </p>

            <h2 id="cultos">Cultos e Hereges</h2>
            <p>
              Existem aqueles que adoram Ayael — não por crueldade, mas por
              piedade. Querem libertá-lo. Os chamam de <em>Lacrimosi</em>, ou
              "os que choram". Eles são heréticos, são procurados pela
              República Prateada, e em alguns casos têm razão.
            </p>

            <h2 id="vivos">Implicações para os Vivos</h2>
            <p>
              Para os heróis da era atual, há três perguntas que não podem ser
              evitadas: Ayael <em>pode</em> ser libertado? Se for libertado,
              ele cessará de sangrar — ou apenas sangrará em outro lugar? E,
              talvez a mais difícil: existe uma versão dele em que a libertação
              significa o fim da própria magia em Valiran?
            </p>

            <blockquote>
              Toda magia que pratico, eu pratico em cima de uma ferida aberta.
              Isso não me impede. Mas me obriga a saber.
              <cite>Mestra Ven Sothiel, primeira arquimaga warforged</cite>
            </blockquote>

            <h2 id="notas">Notas do Arquivista</h2>
            <p>
              Esta entrada foi compilada a partir de quatro fontes em conflito.
              Onde elas divergem, optei pela versão menos confortável — o
              arquivo não existe para nos consolar. Atualizada em 14 do segundo
              mês, 1281, por Cael, sob juramento do nome verdadeiro.
            </p>
            <p style={{fontSize:14, color:'var(--parchment-text-soft)', fontStyle:'italic', marginTop:32}}>
              Cf. também: <a onClick={() => onNav('timeline')}>A Queda de Lancaster</a>, <a onClick={() => onNav('map')}>Tumba dos Hereges</a>,
              Tratado da Compaixão Excessiva (acesso restrito).
            </p>
          </div>
        </div>
      </div>

      <aside className="infobox-rail">
        <div className="infobox">
          <div className="infobox-head">
            <div className="infobox-sigil-wrap">
              {InfoSigil && <InfoSigil />}
            </div>
            <h3 className="infobox-name">{a.infobox.name}</h3>
            <p className="infobox-sub">{a.infobox.sub}</p>
          </div>
          <dl className="infobox-rows">
            {a.infobox.rows.map(r => (
              <div key={r.k} className="infobox-row">
                <dt>{r.k}</dt>
                <dd className={r.danger ? 'danger' : ''}>{r.v}</dd>
              </div>
            ))}
          </dl>
          <div className="infobox-status">
            <strong>STATUS ATUAL</strong><br />
            {a.infobox.status}
          </div>
        </div>

        <div className="toc">
          <h4 className="toc-title">Sumário</h4>
          <ol>
            {a.toc.map((s, i) => (
              <li key={s} className={i === 1 ? 'active' : ''}>{s}</li>
            ))}
          </ol>
        </div>

        <div className="related">
          <h4 className="related-title">Cf. Relacionados</h4>
          {a.related.map(r => (
            <a key={r.title} className="related-link" onClick={() => {
              if (r.title.includes('Lancaster')) onNav('timeline');
              else if (r.title.includes('Tumba')) onNav('map');
            }}>
              <span className="related-link-tag">{r.tag}</span>
              <span className="related-link-title">{r.title}</span>
            </a>
          ))}
        </div>
      </aside>
    </div>
  );
}

window.Article = Article;
