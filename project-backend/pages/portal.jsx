// Portal — homepage of the wiki

// ── Mini mapa real (hexes do Supabase, sem interação) ──────────────────────
function PortalMapPreview({ onNav }) {
  const realms = Data.realms || [];
  const rivers = Data.rivers || [];

  const allHexEntries = realms.flatMap(k =>
    (k.hexes || []).map(h => {
      const [x, y] = rmQrToXY(h.q, h.r);
      return { q: h.q, r: h.r, biome: h.biome || 'plain', realm: k, x, y };
    })
  ).sort((a, b) => a.y - b.y);

  return (
    <div style={{ position: 'relative', height: 280, overflow: 'hidden', cursor: 'pointer' }}
      onClick={() => onNav('map')}>
      <svg
        viewBox={`0 0 ${RM_VIEW_W} ${RM_VIEW_H}`}
        preserveAspectRatio="xMidYMid slice"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <defs>
          <radialGradient id="pm-ocean" cx="50%" cy="50%" r="100%">
            <stop offset="0%"   stopColor="#0e0c1c" />
            <stop offset="100%" stopColor="#040310" />
          </radialGradient>
          <pattern id="pm-paper" width="48" height="48" patternUnits="userSpaceOnUse">
            <circle cx="3"  cy="3"  r="0.4" fill="#2a2840" opacity="0.55" />
            <circle cx="24" cy="24" r="0.3" fill="#2a2840" opacity="0.5"  />
            <circle cx="36" cy="12" r="0.3" fill="#2a2840" opacity="0.45" />
          </pattern>
          <pattern id="pm-topo" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 0 20 Q 10 14, 20 20 T 40 20" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.6" />
          </pattern>
          <pattern id="pm-cursed" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="#3a0a0e" strokeWidth="1.4" strokeOpacity="0.65" />
          </pattern>
          <filter id="rm-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="1" dy="2" stdDeviation="1.2" floodOpacity="0.55" />
          </filter>
          <filter id="rm-shadow-strong" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="1.5" dy="2.5" stdDeviation="2" floodOpacity="0.65" />
          </filter>
        </defs>

        <rect width={RM_VIEW_W} height={RM_VIEW_H} fill="url(#pm-ocean)" />
        <rect width={RM_VIEW_W} height={RM_VIEW_H} fill="url(#pm-paper)" />

        <RMOceanDeco />

        {allHexEntries.map((e, i) => {
          const { q, r, biome, realm: k, x, y } = e;
          return (
            <g key={`pm-tile-${i}`}>
              <path d={rmSidePath(x, y)} fill="rgba(0,0,0,0.5)" />
              <path d={rmHexPath(x, y, 0.3)} fill={rmBiomeTint(biome)} />
              <path d={rmHexPath(x, y, 0.3)}
                fill={k.cursed ? k.accentDeep : k.accent}
                fillOpacity={k.cursed ? 0.92 : 0.82}
                stroke={k.accent} strokeOpacity="0.85" strokeWidth="0.4" />
              <path d={rmHexPath(x, y, 0.3)} fill="url(#pm-topo)" pointerEvents="none" />
              {k.cursed && <path d={rmHexPath(x, y, 0.3)} fill="url(#pm-cursed)" pointerEvents="none" />}
              <RMTerrainOnTile x={x} y={y} biome={biome} hkey={`${q},${r}`} cursed={k.cursed} />
            </g>
          );
        })}

        {realms.map(k => {
          const edges = rmKingdomBorderEdges(k);
          return (
            <g key={`pm-border-${k.id}`} pointerEvents="none">
              {edges.map(([x1, y1, x2, y2], i) => (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="#0a070d" strokeWidth="1.6" strokeOpacity="0.95" strokeLinecap="round" />
              ))}
            </g>
          );
        })}

        <RMRiversLayer rivers={rivers} />

        {realms.flatMap(k => {
          const cities = [
            ...(k.capitalQ != null ? [{ q: k.capitalQ, r: k.capitalR, kind: 'capital', critical: false }] : []),
            ...(k.cities || []),
          ];
          return cities.map((c, i) => (
            <RMCityPiece key={`pm-city-${k.id}-${i}`} q={c.q} r={c.r} kind={c.kind} critical={c.critical || false} dim={false} />
          ));
        })}

        {realms.map(k => (
          <RMKingdomFlag key={`pm-flag-${k.id}`} realm={k} dim={false} />
        ))}

        <RMCloudsDeco />
      </svg>

      <div style={{
        position: 'absolute', top: 16, left: 24,
        fontFamily: 'Cinzel', fontSize: 11,
        letterSpacing: '0.22em',
        color: 'rgba(212,184,127,0.75)',
        textTransform: 'uppercase',
        pointerEvents: 'none',
      }}>Carta de Valiran · 3ª Era</div>
    </div>
  );
}

// ── Portal ─────────────────────────────────────────────────────────────────



// ============================================================
// Home no tema vitral: a nave da catedral, da entrada ao altar.
// ============================================================
const VH_GATES = [
  { id: 'pantheon',   label: 'Panteão',  sub: 'Os nomes que recebem oração', icon: 'Sun',     pane: '#7a5aa8' },
  { id: 'factions',   label: 'Casas',    sub: 'Facções, ordens e coroas',     icon: 'Crown',   pane: '#9a2a24' },
  { id: 'characters', label: 'Almas',    sub: 'Heróis e pessoas de nota',     icon: 'Hand',    pane: '#b8873a' },
  { id: 'sessions',   label: 'Crônicas', sub: 'O diário das sessões',         icon: 'Tome',    pane: '#56673a' },
  { id: 'map',        label: 'Atlas',    sub: 'Reinos e caminhos',            icon: 'Compass', pane: '#3f6a86' },
];

// número da campanha no texto ("Campanha 3 - ..." → 3)
const VH_ROMAN = { I: 1, V: 5, X: 10, L: 50 };
const vhCampaignNum = c => {
  const m = /campanha\s*(\d+|[ivxl]+)\b/i.exec(c && c.campaign || '');
  if (!m) return 0;
  if (/^\d+$/.test(m[1])) return +m[1];
  const r = m[1].toUpperCase().split('').map(ch => VH_ROMAN[ch] || 0);
  return r.reduce((t, v, i) => t + (v < (r[i + 1] || 0) ? -v : v), 0);
};

// personagem citado no elenco de uma sessão ("Diego (PC)", "Kathrine Vans" …)
function vhFindChar(name) {
  const n = String(name).replace(/\s*\(.*\)\s*/, '').trim().toLowerCase();
  if (!n) return null;
  return Object.values(Entities.characters || {}).find(c => c && c.name &&
    (c.name.toLowerCase() === n || c.name.toLowerCase().split(/\s+/)[0] === n.split(/\s+/)[0])) || null;
}

function VhGate({ g, count, onNav }) {
  const Icon = Sigil[g.icon];
  const d = ogivePath(100, 250, 0.62, 0.16);
  const cid = 'vh-gate-' + g.id;
  return (
    <button className="vh-gate" style={{ '--pane': g.pane }} onClick={() => onNav(g.id)}>
      <svg className="vh-gate-glass" viewBox="0 0 100 250" preserveAspectRatio="none" aria-hidden="true">
        <defs><clipPath id={cid}><path d={d} /></clipPath></defs>
        <g clipPath={'url(#' + cid + ')'}>
          <rect width="100" height="250" className="vh-gate-fill" />
          {/* losangos de chumbo (quarrels) */}
          {Array.from({ length: 14 }, (_, i) => (
            <g key={i}>
              <line x1={-60 + i * 22} y1="250" x2={60 + i * 22} y2="0" className="vh-gate-quarry" />
              <line x1={160 - i * 22} y1="250" x2={40 - i * 22} y2="0" className="vh-gate-quarry" />
            </g>
          ))}
          <circle cx="50" cy="78" r="30" className="vh-gate-roundel" />
          <rect x="0" y="170" width="100" height="80" className="vh-gate-base" />
        </g>
        <path d={d} className="vh-gate-lead" />
        <circle cx="50" cy="78" r="30" className="vh-gate-lead vh-gate-lead--gold" />
        <line x1="0" y1="170" x2="100" y2="170" className="vh-gate-lead" />
      </svg>
      <span className="vh-gate-icon">{Icon && <Icon style={{ width: '100%', height: '100%' }} />}</span>
      <span className="vh-gate-text">
        <span className="vh-gate-label">{g.label}</span>
        <span className="vh-gate-count">{count}</span>
      </span>
      <span className="vh-gate-sub">{g.sub}</span>
    </button>
  );
}

function VhSoul({ c, onNav }) {
  const url = useVtSlotUrl('char-portrait-' + c.id);
  const { frame } = { frame: VT_FRAMES[0] };
  return (
    <button className="vh-soul" onClick={() => onNav('character:' + c.id)} title={c.name}>
      <VtGothicWindow frame={frame} className="vh-soul-window" sizes="80px">
        <VtFramedImage url={url} framing={vtFraming(c)} placeholder="" />
      </VtGothicWindow>
      <span className="vh-soul-name">{c.name.split(' ')[0]}</span>
    </button>
  );
}

function VhHead({ num, title, link, onLink }) {
  return (
    <header className="vh-head">
      <span className="vh-head-num">{num}</span>
      <h2 className="vh-head-title">{title}</h2>
      {link && <button className="vh-head-link" onClick={onLink}>{link} →</button>}
    </header>
  );
}

function Portal({ onNav }) {
  const deities  = Object.values(Entities.deities || {}).filter(d => d && d.name);
  const chars    = (Data.charIds || []).map(id => Entities.characters[id]).filter(Boolean);
  const sessions = (Data.sessionIds || []).map(id => Entities.sessions[id]).filter(Boolean);
  const factions = Object.values(Entities.factions || {}).filter(Boolean);
  const realms   = (Data.realms || []).filter(r => !r.cursed);
  const feed     = (Data.feed || []).slice().sort((a, b) => String(b.updated_at).localeCompare(String(a.updated_at))).slice(0, 6);
  const total    = deities.length + chars.length + sessions.length + (Data.timeline || []).filter(e => e.title).length;

  // última sessão (a lista vem do banco da mais nova para a mais antiga)
  const last = sessions.slice().sort((a, b) => (b.num || 0) - (a.num || 0))[0] || null;
  const cast = last ? (last.cast || []).map(vhFindChar).filter((c, i, a) => c && a.indexOf(c) === i) : [];

  // campanha atual = a dos PCs que jogaram a última sessão (senão, a de maior número); destaques = PCs dela
  const isPC = c => String(c.tag || '').toUpperCase() === 'PC' || c.tagClass === 'pc';
  const pcs = chars.filter(isPC);
  const castCamps = cast.filter(isPC).map(vhCampaignNum).filter(Boolean);
  const curCamp = castCamps.length ? Math.max(...castCamps) : Math.max(0, ...pcs.map(vhCampaignNum));
  const featured = (curCamp ? pcs.filter(c => vhCampaignNum(c) === curCamp) : pcs).slice(0, 5);
  const campName = featured[0] ? (featured[0].campaign || '') : '';

  // "O que você precisa saber": por enquanto, o resumo da Campanha III (tabela characters, id 'campanha3',
  // ou o texto padrão de CAMPAIGN_DEFAULTS enquanto o banco não carrega)
  const briefId = 'campanha3';
  const briefRaw = Entities.characters?.[briefId];
  const brief = briefRaw
    ? { id: briefId, title: briefRaw.name, subtitle: briefRaw.role, sections: briefRaw.sections || [] }
    : (window.CAMPAIGN_DEFAULTS || {})[briefId] || null;
  const briefLede = brief ? ((brief.sections || [])[0]?.paras || []).slice(0, 2).join(' ') : '';
  const briefChapters = brief ? (brief.sections || []).map(x => x.title).filter(Boolean) : [];

  const counts = {
    pantheon: deities.length + ' divindades', factions: factions.length + ' casas', characters: chars.length + ' almas',
    sessions: sessions.length + ' sessões', map: realms.length + ' reinos',
  };
  const stats = [
    ['Entradas', total], ['Divindades', deities.length], ['Almas', chars.length], ['Sessões', sessions.length], ['Era', '3ª · 1281'],
  ];
  const statPane = ['#8a8070', '#7a5aa8', '#b8873a', '#56673a', '#3f6a86'];

  return (
    <div className="vt vt-home" data-screen-label="01 Portal">
      {/* I · Entrada */}
      <section className="vh-hero">
        <div className="vh-hero-text">
          <div className="vt-label">O Arquivo · Vol. III · Fólio 1281</div>
          <h1 className="vt-h1 vh-title">Tudo o que se conta<br />sobre Valiran</h1>
          <p className="vh-lede">
            Um continente sustentado pela Trama Mágica, dilacerado por reinos em guerra e por uma
            corrupção que vaza de planos esquecidos. Aqui se guardam os nomes: dos deuses, dos heróis,
            e daqueles que romperam selos que jamais deveriam ter sido tocados.
          </p>
          <VtDivider />
          <div className="vh-stats">
            {stats.map(([k, v], i) => (
              <div key={k} className="vh-stat" style={{ '--pane': statPane[i] }}>
                <span className="vh-stat-v">{v || '—'}</span>
                <span className="vh-stat-k">{k}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="vh-hero-wheel">
          <PantheonRose onNav={onNav} />
          <button className="vh-rose-cap" onClick={() => onNav('pantheon')}>Entrar no Panteão →</button>
        </div>
      </section>

      {/* II · Onde paramos */}
      {last && (
        <section className="vh-section">
          <VhHead num="I" title="Onde paramos" link="Todas as crônicas" onLink={() => onNav('sessions')} />
          <article className="vh-last" onClick={() => onNav('session:' + last.num)}>
            <div className="vh-last-num">
              <span className="vh-last-n">{String(last.num).padStart(2, '0')}</span>
              <span className="vh-last-k">Sessão</span>
            </div>
            <div className="vh-last-body">
              <div className="vh-last-meta">{[last.dateShort, last.location].filter(Boolean).join(' · ')}</div>
              <h3 className="vh-last-title">{last.title}</h3>
              {last.summary && <p className="vh-last-summary">{last.summary}</p>}
              <span className="vh-last-go">Continuar a crônica →</span>
            </div>
            {cast.length > 0 && (
              <div className="vh-last-cast" onClick={e => e.stopPropagation()}>
                <div className="vh-mini-label">Estavam lá</div>
                <div className="vh-souls">{cast.slice(0, 6).map(c => <VhSoul key={c.id} c={c} onNav={onNav} />)}</div>
              </div>
            )}
          </article>
        </section>
      )}

      {/* III · O que você precisa saber (resumo da campanha atual) */}
      {brief && (
        <section className="vh-section">
          <VhHead num="II" title="O que você precisa saber" link="Ler o resumo completo" onLink={() => onNav(brief.id)} />
          <article className="vh-brief" onClick={() => onNav(brief.id)}>
            <div className="vh-brief-seal">
              <span className="vh-brief-n">{(/\b([IVX]+)\b/.exec(brief.title || '') || [])[1] || '✠'}</span>
              <span className="vh-brief-k">Campanha</span>
            </div>
            <div className="vh-brief-body">
              <div className="vh-last-meta">{brief.title}</div>
              <h3 className="vh-last-title">{(brief.subtitle || '').split(/\s+[—-]\s+/)[0]}</h3>
              {briefLede && <p className="vh-brief-lede">{briefLede}</p>}
              {briefChapters.length > 0 && (
                <ol className="vh-brief-chapters">
                  {briefChapters.map((t, i) => (
                    <li key={i}><span className="vh-brief-roman">{vtRoman(i + 1)}</span>{t}</li>
                  ))}
                </ol>
              )}
              <span className="vh-last-go">Ler o resumo completo →</span>
            </div>
          </article>
        </section>
      )}

      {/* IV · Almas em destaque */}
      {featured.length > 0 && (
        <section className="vh-section">
          <VhHead num="III" title="Almas da campanha atual" link="Todas as almas" onLink={() => onNav('characters')} />
          {campName && <p className="vh-sub">{campName}</p>}
          <div className="vt-gallery vh-featured">
            {featured.map(c => <VitralCard key={c.id} char={c} onClick={() => onNav('character:' + c.id)} />)}
          </div>
        </section>
      )}

      {/* IV · O Continente */}
      <section className="vh-section">
        <VhHead num="IV" title="Pelas veias do continente" link="Abrir o Atlas" onLink={() => onNav('map')} />
        <div className="vh-map"><PortalMapPreview onNav={onNav} /></div>
        {realms.length > 0 && (
          <div className="vh-realms">
            {realms.map(r => {
              const Icon = r.sigil && Sigil[r.sigil];
              return (
                <button key={r.id} className="vh-realm" style={{ '--pane': r.accent || '#8a8070' }} onClick={() => onNav('map')}>
                  <span className="vh-realm-icon">{Icon && <Icon style={{ width: '100%', height: '100%' }} />}</span>
                  <span className="vh-realm-name">{r.name}</span>
                  {r.eyebrow && <span className="vh-realm-sub">{r.eyebrow}</span>}
                  {r.desc && <span className="vh-realm-desc">{r.desc}</span>}
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* V · Os Portões do Arquivo */}
      <section className="vh-section">
        <VhHead num="V" title="Os Portões do Arquivo" />
        <nav className="vh-gates">
          {VH_GATES.map(g => <VhGate key={g.id} g={g} count={counts[g.id]} onNav={onNav} />)}
        </nav>
      </section>

      {/* VI · Registro do Arquivo (por último) */}
      <section className="vh-section">
        <VhHead num="VI" title="Registro do Arquivo" link="Ver todas" onLink={() => onNav('recent')} />
        <div className="vt-ficha vh-ledger">
          <VtArchiveFrame />
          {feed.length === 0
            ? <p className="vh-ledger-empty">“Nenhuma linha nova no livro desde a última vela.” <span>— o Arquivista</span></p>
            : (
              <ol className="vh-ledger-list">
                {feed.map((f, i) => (
                  <li key={i} className={'vh-ledger-row vh-ledger-row--' + f.entity_type} onClick={() => f.target && onNav(f.target)}>
                    <span className="vh-ledger-type">{f.type_label}</span>
                    <span className="vh-ledger-title">{f.title}{f.subtitle && <em> · {f.subtitle}</em>}</span>
                    <span className="vh-ledger-when">{f.action === 'NOVO' ? 'Novo' : 'Editado'} · {f.date_label}</span>
                  </li>
                ))}
              </ol>
            )}
        </div>
      </section>

      <footer className="vt-pantheon-foot">
        “Tudo o que se esquece continua acontecendo. Por isso escrevemos.”
        <div className="vt-quote-src">— Arquivista Cael, prefácio do Volume III</div>
      </footer>
    </div>
  );
}
window.Portal = Portal;
