// Pantheon page — tiers de divindades em vitral (DB-driven)

function vtRomanNum(n) { return ['','I','II','III','IV','V','VI','VII','VIII','IX','X'][n] || String(n); }

const SIGIL_OPTIONS = ['Dragon','Dawn','Chain','Sun','Moon','Skull','Eye','Flame','Wave','Tree','Crown','Sword'];

// ============================================================
// Deity modal (create only — edit is via ArticleEditor)
// ============================================================
function DeityModal({ onClose }) {
  const [form, setForm] = React.useState({ id:'', name:'', epithet:'', sigil:'', placeholder:true });
  const [busy, setBusy] = React.useState(false);
  const [err,  setErr]  = React.useState('');

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  function slugify(name) {
    return name.toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  async function handleSave(e) {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      const id = form.id || slugify(form.name);
      await window.DB.saveDeity({
        id,
        name:        form.name,
        epithet:     form.epithet || null,
        sigil:       form.sigil   || null,
        placeholder: form.placeholder,
        infobox:     { rows: [] },
        hero:        null,
        sections:    [],
        related:     [],
      });
      onClose();
    } catch(e) {
      setErr(e.message || 'Erro ao salvar');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-eyebrow">Cosmologia · Panteão de Valiran</div>
          <h2 className="modal-title">Nova Divindade</h2>
        </div>
        <form onSubmit={handleSave}>
          <div className="modal-body">
            <div className="modal-field">
              <label className="modal-label">Nome</label>
              <input className="modal-input" value={form.name} required autoFocus
                placeholder="Nome da divindade"
                onChange={e => { set('name', e.target.value); if (!form.id) set('id', slugify(e.target.value)); }} />
            </div>
            <div className="modal-field-row">
              <div className="modal-field">
                <label className="modal-label">ID (slug)</label>
                <input className="modal-input" value={form.id}
                  placeholder="gerado automaticamente"
                  onChange={e => set('id', e.target.value)} />
                <span className="modal-hint">Deixe em branco para gerar do nome.</span>
              </div>
              <div className="modal-field">
                <label className="modal-label">Sigilo</label>
                <select className="modal-select" value={form.sigil} onChange={e => set('sigil', e.target.value)}>
                  <option value="">— nenhum —</option>
                  {SIGIL_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="modal-field">
              <label className="modal-label">Epíteto</label>
              <input className="modal-input" value={form.epithet}
                placeholder="Ex: A Alvorada Sacrificial · O Mortal que Virou Manhã"
                onChange={e => set('epithet', e.target.value)} />
            </div>
            <div className="modal-field">
              <label className="modal-label" style={{ display:'flex', alignItems:'center', gap:10 }}>
                <input type="checkbox" checked={form.placeholder}
                  onChange={e => set('placeholder', e.target.checked)}
                  style={{ width:14, height:14 }} />
                Entrada em compilação (sem artigo completo)
              </label>
            </div>
            {err && <div className="modal-error">{err}</div>}
          </div>
          <div className="modal-foot">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-save" disabled={busy}>
              {busy ? 'Salvando…' : 'Salvar Divindade'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================
// Pantheon page
// ============================================================
function Pantheon({ onNav }) {
  const { isEditor } = useAuth();
  const [modal, setModal] = React.useState(false);
  const [uploader, setUploader] = React.useState(false);
  const [tierFilter, setTierFilter] = React.useState(() => { try { return localStorage.getItem('pan-tier') || 'todos'; } catch (e) { return 'todos'; } });
  React.useEffect(() => { try { localStorage.setItem('pan-tier', tierFilter); } catch (e) {} }, [tierFilter]);

  const allDeities = Object.values(Entities.deities).filter(d => d && d.name);

  const byTier = t => allDeities.filter(d => vtDeityTier(d) === t);

  const tiers = [
    { tone: 'aspecto',   tier: 'Os Aspectos da Realidade', tierDesc: 'A origem de tudo. Os Titãs são fragmentos deles e reivindicam domínios ligados aos seus Aspectos patronos.', gods: byTier('aspecto') },
    { tone: 'tita',      tier: 'Os Titãs',              tierDesc: 'As divindades primordiais que ergueram o mundo do nada. Hoje, distantes ou inalcançáveis.',   gods: byTier('tita') },
    { tone: 'deus',      tier: 'Deuses do Panteão',      tierDesc: 'As divindades estabelecidas, veneradas em templos por todo o continente.',                    gods: byTier('deus') },
    { tone: 'ascendido', tier: 'Ascendidos & Especiais', tierDesc: 'Mortais elevados, anjos caídos e entidades que não se enquadram na hierarquia convencional.', gods: byTier('ascendido') },
  ].filter(t => t.gods.length > 0);

  const total = tiers.length;
  const shownTiers = tierFilter === 'todos' ? tiers : tiers.filter(t => t.tone === tierFilter);
  const TIER_PANE = { aspecto: '#d4922a', tita: '#7a5aa8', deus: '#b8873a', ascendido: '#3f6a86' };
  const tierOptions = [
    { value: 'todos', label: 'Todos', count: allDeities.length },
    ...tiers.map(t => ({ value: t.tone, label: t.tier.replace(/^Os /, ''), count: t.gods.length, pane: TIER_PANE[t.tone] })),
  ];

  return (
    <div className="vt vt-pantheon" data-screen-label="02 Panteão">
      <section className="vt-pantheon-head">
        <img className="vt-hero-rose" src="assets/vitral/rosacea.svg?v=3" alt="" aria-hidden="true" draggable="false" />
        <div className="vt-pantheon-head-text">
          <div className="vt-label">Cosmologia · Volume II · Os Deuses</div>
          <h1 className="vt-h1">O Panteão de Valiran</h1>
          <div className="vt-epithet">Os nomes que recebem oração</div>
          <p className="vt-pantheon-lede">
            Em Valiran, os deuses não são metáforas. Caminham, sangram, e às vezes
            são presos. Aqui se catalogam os Titãs que ergueram o mundo, os Deuses do
            panteão estabelecido, e os Ascendidos: mortais que provaram-se grandes
            demais para a morte.
          </p>
        </div>
        {isEditor && (
          <div className="vt-pantheon-add">
            <button className="vt-btn vt-btn--gold" onClick={() => setModal(true)}>+ Nova divindade</button>
            <button className="vt-btn" onClick={() => setUploader(u => !u)}>✠ Vitrais da galeria</button>
          </div>
        )}
      </section>
      {isEditor && uploader && <VtVitralUploader deities={allDeities} onClose={() => setUploader(false)} />}

      {allDeities.length === 0 && (
        <p className="vt-pantheon-empty">Nenhuma divindade registrada ainda.</p>
      )}

      {allDeities.length > 0 && (
        <VtFilterBar
          groups={[{ label: 'Hierarquia', value: tierFilter, onChange: setTierFilter, options: tierOptions }]}
          active={tierFilter !== 'todos'} onReset={() => setTierFilter('todos')} />
      )}

      {shownTiers.map(tier => { const ti = tiers.indexOf(tier); return (
        <section key={tier.tier} className={'vt-tier vt-tier--' + tier.tone}>
          <header className="vt-tier-head">
            <span className="vt-tier-num">{vtRomanNum(ti + 1)} <small>/ {vtRomanNum(total)}</small></span>
            <div>
              <h2 className="vt-tier-name">{tier.tier}</h2>
              <p className="vt-tier-desc">{tier.tierDesc}</p>
            </div>
            <span className="vt-tier-count">{tier.gods.length} {tier.gods.length === 1 ? 'nome' : 'nomes'}</span>
          </header>
          <div className="vt-gallery vt-deity-gallery">
            {tier.gods.map(g => (
              <VitralDeityCard key={g.id} deity={g} tone={tier.tone} onClick={() => onNav('deity:' + g.id)} />
            ))}
          </div>
        </section>
      ); })}

      <footer className="vt-pantheon-foot">
        “Conta-se que existem outros. Aqueles cujos nomes foram apagados
        pelos próprios crentes — para que nenhum culto pudesse jamais ressurgir.”
        <div className="vt-quote-src">— Arquivista Cael, nota de rodapé desconhecida</div>
      </footer>

      {modal && <DeityModal onClose={() => setModal(false)} />}
    </div>
  );
}

window.Pantheon = Pantheon;

// ============================================================
// O Panteão como uma rosácea (roda da entrada da home), posicionada por alinhamento.
// Bem em cima, Mal embaixo, Lei à esquerda, Caos à direita.
// Miolo: o núcleo neutro (N não tem direção). Zona 0: os 4 Aspectos nos pontos
// cardeais. Zonas 1–3: Titãs, Deuses e Ascendidos no setor do seu alinhamento.
// Coordenadas no viewBox 1000×1000, centro (500,500); ângulos em graus,
// medidos do topo em sentido horário.
// ============================================================
const PR_CORE = 80;                                   // raio do núcleo neutro
const PR_RINGS = [
  { tier: 'aspecto',   rIn: 80,  rOut: 165, rMed: 122, maxD: 76, sectors: 4 },
  { tier: 'tita',      rIn: 165, rOut: 270, rMed: 218, maxD: 88, sectors: 8 },
  { tier: 'deus',      rIn: 270, rOut: 375, rMed: 322, maxD: 92, sectors: 8 },
  { tier: 'ascendido', rIn: 375, rOut: 468, rMed: 418, maxD: 72, sectors: 8 },
];
// setores de alinhamento (Zonas 1–3) e eixos dos Aspectos (Zona 0)
const PR_SECTOR = { NG: 0, CG: 45, CN: 90, CE: 135, NE: 180, LE: 225, LN: 270, LG: 315 };
const PR_AXIS = { Bem: 0, Caos: 90, Mal: 180, Lei: 270 };

const prPolar = (r, deg) => {
  const a = deg * Math.PI / 180;
  return [500 + r * Math.sin(a), 500 - r * Math.cos(a)];
};
function prSector(rIn, rOut, a0, a1) {
  const [x0, y0] = prPolar(rOut, a0), [x1, y1] = prPolar(rOut, a1);
  const [x2, y2] = prPolar(rIn, a1), [x3, y3] = prPolar(rIn, a0);
  const big = a1 - a0 > 180 ? 1 : 0;
  return `M${x0} ${y0} A${rOut} ${rOut} 0 ${big} 1 ${x1} ${y1} L${x2} ${y2} A${rIn} ${rIn} 0 ${big} 0 ${x3} ${y3} Z`;
}

// Alinhamento da ficha → sigla ('LG' … 'CE', 'N'). Aceita a sigla ("LG (Leal e Bom)")
// ou o texto por extenso ("Caótico Bondoso", "Neutra Maligna", "Neutro").
function prAlignment(d) {
  const v = vtRow(d, /^alinhamento$/i).trim();
  const sig = /^(LG|NG|CG|LN|N|CN|LE|NE|CE)\b/.exec(v);
  if (sig) return sig[1];
  const w = v.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').split(/[\s,/·-]+/).filter(Boolean);
  if (!w.length) return null;
  const law = /^lea|^lei/.test(w[0]) ? 'L' : /^caot/.test(w[0]) ? 'C' : /^neutr/.test(w[0]) ? 'N' : null;
  if (!law) return null;
  const rest = w.slice(1).join(' ');
  const ethic = /bondos|\bbo[ma]\b/.test(rest) ? 'G' : /malign|\bma[lu]\b/.test(rest) ? 'E'
    : (!rest || /neutr|verdadeir/.test(rest)) ? 'N' : null;
  if (!ethic) return null;
  return law === 'N' && ethic === 'N' ? 'N' : law + ethic;
}
// Eixo de um Aspecto → ângulo ("Bem", "Caos", "Mal", "Lei"/"Ordem").
function prAxis(d) {
  const v = vtRow(d, /^alinhamento$/i).trim().toLowerCase();
  if (/^bem|^luz/.test(v)) return PR_AXIS.Bem;
  if (/^caos|^destino/.test(v)) return PR_AXIS.Caos;
  if (/^mal\b|^escurid/.test(v)) return PR_AXIS.Mal;
  if (/^lei|^ordem|^tempo/.test(v)) return PR_AXIS.Lei;
  return null;
}

// Núcleo neutro: o neutro de nível mais alto no centro, os demais ao redor.
// Isolado aqui para trocar a solução (ex.: uma nona fatia) sem mexer no resto.
function prNeutralSlots(neutrals) {
  const order = ['aspecto', 'tita', 'deus', 'ascendido'];
  const list = [...neutrals].sort((a, b) =>
    order.indexOf(a.tier) - order.indexOf(b.tier) || a.d.name.localeCompare(b.d.name, 'pt'));
  if (!list.length) return [];
  const [head, ...rest] = list;
  const out = [{ ...head, x: 500, y: 500, size: rest.length ? 64 : 92, core: true }];
  rest.forEach((g, i) => {
    const [x, y] = prPolar(56, 90 + i * 360 / rest.length);
    out.push({ ...g, x, y, size: 36, core: true });
  });
  return out;
}

// Posição de cada divindade na roda; quem não tem alinhamento válido fica de fora.
function prLayout(all) {
  const placed = [], neutrals = [];
  const buckets = new Map();                          // 'tier|ângulo' → divindades
  all.forEach(d => {
    const tier = vtDeityTier(d);
    const ring = PR_RINGS.find(r => r.tier === tier);
    const angle = tier === 'aspecto' ? prAxis(d) : PR_SECTOR[prAlignment(d)];
    if (tier !== 'aspecto' && prAlignment(d) === 'N') { neutrals.push({ d, tier }); return; }
    if (!ring || angle == null) {
      console.warn('[PantheonRose] alinhamento inválido, fora da roda:', d.id, vtRow(d, /^alinhamento$/i));
      return;
    }
    const key = tier + '|' + angle;
    if (!buckets.has(key)) buckets.set(key, { ring, angle, gods: [] });
    buckets.get(key).gods.push(d);
  });
  buckets.forEach(({ ring, angle, gods }) => {
    gods.sort((a, b) => a.name.localeCompare(b.name, 'pt'));
    const slice = 360 / ring.sectors, n = gods.length;
    const step = slice / n;                           // 2 no setor → centro ± 11,25°
    const fit = 2 * ring.rMed * Math.sin(step / 2 * Math.PI / 180) * .82;
    const size = Math.min(ring.maxD, fit);
    gods.forEach((d, k) => {
      const [x, y] = prPolar(ring.rMed, angle + (k - (n - 1) / 2) * step);
      placed.push({ d, tier: ring.tier, x, y, size });
    });
  });
  const occupied = new Set(buckets.keys());
  return { placed: placed.concat(prNeutralSlots(neutrals)), occupied };
}

const PR_TIER_NAME = { aspecto: 'Aspecto da Realidade', tita: 'Titã', deus: 'Deus do Panteão', ascendido: 'Ascendido' };

// vidro vazio: quadrifólia de chumbo
function PrEmptyGlass({ x, y, R }) {
  return (
    <g>
      <circle cx={x} cy={y} r={R} className="pr-lobe" />
      {[0, 90, 180, 270].map(k => {
        const a = k * Math.PI / 180;
        return <circle key={k} cx={x + R * .38 * Math.cos(a)} cy={y + R * .38 * Math.sin(a)} r={R * .36} className="pr-lobe-petal" />;
      })}
      <circle cx={x} cy={y} r={R * .14} className="pr-lobe-bead" />
      <circle cx={x} cy={y} r={R} className="pr-lead" />
    </g>
  );
}

function PantheonRose({ onNav }) {
  const all = Object.values(Entities.deities).filter(d => d && d.name);
  const [active, setActive] = React.useState(null);
  const { placed, occupied } = prLayout(all);

  const cur = active || null;
  const curTier = cur ? vtDeityTier(cur) : null;
  const sectorsOf = ring => Array.from({ length: ring.sectors }, (_, i) => i * 360 / ring.sectors);

  const wheel = (
      <div className="pr-wrap pr-wrap--embed">
        <div className="pr-rose">
          <svg className="pr-glass" viewBox="0 0 1000 1000" aria-hidden="true">
            <defs>
              <radialGradient id="pr-hub" cx="50%" cy="50%" r="50%">
                <stop offset="0" stopColor="#fff3cf" />
                <stop offset=".35" stopColor="#e2bd6a" />
                <stop offset="1" stopColor="#5a4217" />
              </radialGradient>
            </defs>
            {/* aro de pedra */}
            <circle cx="500" cy="500" r="496" className="pr-stone" />
            {/* vidros: um por setor de cada anel, alternando o tom */}
            {PR_RINGS.map(ring => sectorsOf(ring).map((a, i) => {
              const half = 180 / ring.sectors;
              return <path key={ring.tier + i} d={prSector(ring.rIn, ring.rOut, a - half, a + half)}
                className={'pr-pane pr-pane--' + ring.tier + (i % 2 ? ' is-alt' : '') + (curTier === ring.tier ? ' is-lit' : '')} />;
            }))}
            {/* setores vazios: vidro com quadrifólia */}
            {PR_RINGS.map(ring => sectorsOf(ring).map(a => {
              if (occupied.has(ring.tier + '|' + a)) return null;
              const [x, y] = prPolar(ring.rMed, a);
              return <PrEmptyGlass key={'e' + ring.tier + a} x={x} y={y} R={ring.maxD / 2 * .8} />;
            }))}
            {/* lóbulos do anel de fora, sob cada Ascendido */}
            {placed.filter(p => p.tier === 'ascendido' && !p.core).map(p => (
              <circle key={'lobe' + p.d.id} cx={p.x} cy={p.y} r={p.size / 2 + 9} className="pr-lead" />
            ))}
            {/* chumbo: raios entre os setores (fixos, não dependem de quantas divindades há) */}
            {PR_RINGS.map(ring => sectorsOf(ring).map(a => {
              const b = a + 180 / ring.sectors;
              const [x0, y0] = prPolar(ring.rIn, b), [x1, y1] = prPolar(ring.rOut, b);
              return <line key={'s' + ring.tier + a} x1={x0} y1={y0} x2={x1} y2={y1} className="pr-lead" />;
            }))}
            {/* chumbo: anéis, com filete dourado */}
            {[PR_CORE, ...PR_RINGS.map(r => r.rOut)].map(r => (
              <g key={r}>
                <circle cx="500" cy="500" r={r} className="pr-lead pr-lead--ring" />
                <circle cx="500" cy="500" r={r} className="pr-gilt" />
              </g>
            ))}
            {/* núcleo neutro: a luz no centro dos eixos */}
            <circle cx="500" cy="500" r={PR_CORE - 3} fill="url(#pr-hub)" className="pr-hub" />
            {/* siglas dos setores, gravadas no aro */}
            {Object.entries(PR_SECTOR).map(([sig, a]) => {
              const [x, y] = prPolar(482, a);
              return <text key={sig} x={x} y={y} className="pr-sigla">{sig}</text>;
            })}
          </svg>

          {/* medalhões (HTML por cima do SVG, para os símbolos e o clique) */}
          {placed.map(({ d, tier, x, y, size }) => (
            <button key={d.id}
              className={'pr-med pr-med--' + tier + (cur && cur.id === d.id ? ' is-active' : '')}
              style={{ left: (x - size / 2) / 10 + '%', top: (y - size / 2) / 10 + '%', width: size / 10 + '%' }}
              onMouseEnter={() => setActive(d)} onFocus={() => setActive(d)}
              onClick={() => onNav('deity:' + d.id)}
              aria-label={d.name}>
              <DeitySigilImage deity={d} size="card" />
            </button>
          ))}
        </div>

        {/* legenda: a placa votiva mostra o vidro sob o cursor */}
        <div className={'pr-caption vt-deity-card--' + (curTier || 'deus')}>
          <div className="vt-votive">
            <span className="vt-votive-gem" aria-hidden="true" />
            <div className="vt-votive-name">{cur ? cur.name : 'O Panteão de Valiran'}</div>
            <div className="vt-votive-title">{cur ? (cur.epithet || '') : 'Passe o cursor sobre um símbolo'}</div>
          </div>
          <div className="vt-card-sub">{cur ? [PR_TIER_NAME[curTier], vtRow(cur, /^alinhamento$/i), vtRow(cur, /^dom[ií]nio/i)].filter(Boolean).join(' · ') : ''}</div>
        </div>

      </div>
  );
  return wheel;
}
window.PantheonRose = PantheonRose;
