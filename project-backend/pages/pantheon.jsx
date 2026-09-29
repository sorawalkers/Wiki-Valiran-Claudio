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

  const allDeities = Object.values(Entities.deities).filter(d => d && d.name);

  function getRow(d, key) {
    const row = (d.infobox?.rows || []).find(r => r.k === key);
    return row ? row.v : '';
  }

  const titas = allDeities.filter(d => getRow(d,'Tipo').startsWith('Titã'));
  const ascendidos = allDeities.filter(d => {
    const t = getRow(d,'Tipo');
    return t.includes('Ascendido') || t.includes('Ascendida') || t.includes('Anjo') || t.includes('Pseudo');
  });
  const estabelecidos = allDeities.filter(d => {
    const t = getRow(d,'Tipo');
    return !t.startsWith('Titã') && !t.includes('Ascendido') && !t.includes('Ascendida') && !t.includes('Anjo') && !t.includes('Pseudo');
  });

  const tiers = [
    { tone: 'tita',      tier: 'Os Titãs',              tierDesc: 'As divindades primordiais que ergueram o mundo do nada. Hoje, distantes ou inalcançáveis.',   gods: titas },
    { tone: 'deus',      tier: 'Deuses do Panteão',      tierDesc: 'As divindades estabelecidas, veneradas em templos por todo o continente.',                    gods: estabelecidos },
    { tone: 'ascendido', tier: 'Ascendidos & Especiais', tierDesc: 'Mortais elevados, anjos caídos e entidades que não se enquadram na hierarquia convencional.', gods: ascendidos },
  ].filter(t => t.gods.length > 0);

  const total = tiers.length;

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

      {tiers.map((tier, ti) => (
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
      ))}

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
// Página de teste (#/pantheon-teste): espelho circular × oval
// ============================================================
function PantheonLab({ onNav }) {
  const all = Object.values(Entities.deities).filter(d => d && d.name);
  // arte de cada uma (reativo: o estado das imagens chega depois do primeiro render)
  const artUrl = {};
  all.forEach(d => { artUrl[d.id] = useVtSlotUrl('deity-hero-' + d.id); });
  const hasArt = d => !!artUrl[d.id];
  const withArt = all.filter(hasArt), noArt = all.filter(d => !hasArt(d));
  // as mesmas duas divindades nos dois formatos: uma com arte e uma só com o símbolo (quando houver)
  const pair = [withArt[0], noArt[0]].filter(Boolean);
  for (const d of all) { if (pair.length >= 2) break; if (!pair.includes(d)) pair.push(d); }
  const big = pair;
  // um de cada nível para os emblemas
  const trio = ['tita', 'deus', 'ascendido'].map(t => all.find(d => vtDeityTier(d) === t)).filter(Boolean);

  const Card = ({ d, shape }) => (
    <div className="vt-lab-col">
      <span className="vt-lab-tag">{shape === 'circular' ? 'Circular' : 'Oval'}</span>
      <VitralDeityCard deity={d} shape={shape} onClick={() => onNav('deity:' + d.id)} />
    </div>
  );
  const Big = ({ d, shape }) => (
    <div className="vt-lab-col">
      <span className="vt-lab-tag">{shape === 'circular' ? 'Circular' : 'Oval'} · {d.name}</span>
      <div className="vt-portrait-shadow">
        <VtDeityFrame tier={vtDeityTier(d)} shape={shape} className="vt-portrait vt-portrait--rose" sizes="460px">
          {hasArt(d)
            ? <VtFramedImage url={artUrl[d.id]} framing={vtFraming(d)} />
            : <VtSigilAltar deity={d} tier={vtDeityTier(d)} />}
        </VtDeityFrame>
      </div>
    </div>
  );

  return (
    <div className="vt vt-pantheon">
      <section className="vt-tier vt-tier--deus">
        <header className="vt-tier-head">
          <span className="vt-tier-num">I <small>/ V</small></span>
          <div>
            <h2 className="vt-tier-name">Teste · Galeria</h2>
            <p className="vt-tier-desc">As mesmas duas divindades no espelho circular e no oval, com placa e domínio.</p>
          </div>
        </header>
        <div className="vt-lab-row">
          {pair.map(d => <Card key={'c' + d.id} d={d} shape="circular" />)}
          {pair.map(d => <Card key={'o' + d.id} d={d} shape="oval" />)}
        </div>
      </section>
      {[
        ['selo', 'Selo cunhado', 'Medalhão de ouro com borda serrilhada; o esmalte do centro leva a cor do nível.'],
        ['estandarte', 'Estandarte', 'Flâmula bordada pendurada numa haste, no tecido da cor do nível.'],
        ['relevo', 'Relevo em pedra', 'Tábua de pedra em arco, com o símbolo entalhado e folheado a ouro.'],
      ].map(([variant, name, desc], i) => (
        <section key={variant} className="vt-tier vt-tier--deus">
          <header className="vt-tier-head">
            <span className="vt-tier-num">{vtRomanNum(i + 2)} <small>/ V</small></span>
            <div>
              <h2 className="vt-tier-name">Símbolo · {name}</h2>
              <p className="vt-tier-desc">{desc}</p>
            </div>
          </header>
          <div className="vt-lab-row">
            {trio.map(d => (
              <div key={d.id} className={'vt-card vt-deity-card vt-lab-col vt-deity-card--' + vtDeityTier(d)} onClick={() => onNav('deity:' + d.id)}>
                <VtSigilEmblem deity={d} tier={vtDeityTier(d)} variant={variant} />
                <div className="vt-votive">
                  <span className="vt-votive-gem" aria-hidden="true" />
                  <div className="vt-votive-name">{d.name}</div>
                  {d.epithet && <div className="vt-votive-title">{d.epithet}</div>}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
      <section className="vt-tier vt-tier--tita">
        <header className="vt-tier-head">
          <span className="vt-tier-num">V <small>/ V</small></span>
          <div>
            <h2 className="vt-tier-name">Teste · Tamanho do artigo</h2>
            <p className="vt-tier-desc">A mesma divindade nos dois espelhos, no tamanho do topo da página dela.</p>
          </div>
        </header>
        {big.map(d => (
          <div key={d.id} className="vt-lab-row">
            <Big d={d} shape="circular" />
            <Big d={d} shape="oval" />
          </div>
        ))}
      </section>
    </div>
  );
}
window.PantheonLab = PantheonLab;

// ============================================================
// Protótipo (#/pantheon-rosacea): o Panteão como uma rosácea.
// Titãs no anel de dentro, Deuses no do meio, Ascendidos nos lóbulos de fora.
// Coordenadas no viewBox 1000×1000, centro (500,500).
// ============================================================
const PR_RINGS = [
  { tier: 'tita',      rIn: 100, rOut: 205, rMed: 152, minSlots: 6,  maxD: 92 },
  { tier: 'deus',      rIn: 205, rOut: 355, rMed: 280, minSlots: 16, maxD: 104 },
  { tier: 'ascendido', rIn: 355, rOut: 468, rMed: 411, minSlots: 12, maxD: 92 },
];
const prPolar = (r, a) => [500 + r * Math.cos(a), 500 + r * Math.sin(a)];
function prSector(rIn, rOut, a0, a1) {
  const [x0, y0] = prPolar(rOut, a0), [x1, y1] = prPolar(rOut, a1);
  const [x2, y2] = prPolar(rIn, a1), [x3, y3] = prPolar(rIn, a0);
  const big = a1 - a0 > Math.PI ? 1 : 0;
  return `M${x0} ${y0} A${rOut} ${rOut} 0 ${big} 1 ${x1} ${y1} L${x2} ${y2} A${rIn} ${rIn} 0 ${big} 0 ${x3} ${y3} Z`;
}

function PantheonRose({ onNav }) {
  const all = Object.values(Entities.deities).filter(d => d && d.name);
  const [active, setActive] = React.useState(null);

  // distribui cada nível pelas casas do seu anel; casas sobrando ficam como vidro vazio
  const rings = PR_RINGS.map(ring => {
    const gods = all.filter(d => vtDeityTier(d) === ring.tier);
    const slots = Math.max(ring.minSlots, gods.length);
    const step = (Math.PI * 2) / slots;
    const start = -Math.PI / 2;                       // primeira casa no topo
    const at = new Map(gods.map((d, i) => [Math.round(i * slots / gods.length) % slots, d]));
    const d = Math.min(ring.maxD, 2 * Math.PI * ring.rMed / slots * 0.8);
    return { ...ring, gods, slots, step, start, at, d };
  });

  const cur = active || null;
  const curTier = cur ? vtDeityTier(cur) : null;
  const tierName = { tita: 'Titã', deus: 'Deus do Panteão', ascendido: 'Ascendido' };

  return (
    <div className="vt vt-pantheon">
      <section className="vt-pantheon-head">
        <div className="vt-pantheon-head-text">
          <div className="vt-label">Protótipo · Cosmologia</div>
          <h1 className="vt-h1">A Rosácea do Panteão</h1>
          <p className="vt-pantheon-lede">Protótipo: os Titãs no coração da janela, os Deuses no anel do meio, os Ascendidos nos lóbulos de fora. Passe o cursor sobre um vidro.</p>
        </div>
      </section>

      <div className="pr-wrap">
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
            {/* vidros de cada anel, alternando o tom */}
            {rings.map(ring => Array.from({ length: ring.slots }, (_, i) => {
              const a0 = ring.start + (i - .5) * ring.step, a1 = a0 + ring.step;
              return <path key={ring.tier + i} d={prSector(ring.rIn, ring.rOut, a0, a1)}
                className={'pr-pane pr-pane--' + ring.tier + (i % 2 ? ' is-alt' : '') + (curTier === ring.tier ? ' is-lit' : '')} />;
            }))}
            {/* lóbulos do anel de fora */}
            {Array.from({ length: rings[2].slots }, (_, i) => {
              const [x, y] = prPolar(rings[2].rMed, rings[2].start + i * rings[2].step);
              const R = rings[2].d / 2 + 9;
              if (rings[2].at.has(i)) return <circle key={'lobe' + i} cx={x} cy={y} r={R} className="pr-lead" />;
              // lóbulo vazio: vidro com uma quadrifólia de chumbo
              return (
                <g key={'lobe' + i}>
                  <circle cx={x} cy={y} r={R} className="pr-lobe" />
                  {[0, 1, 2, 3].map(k => {
                    const [px, py] = [x + R * .38 * Math.cos(k * Math.PI / 2), y + R * .38 * Math.sin(k * Math.PI / 2)];
                    return <circle key={k} cx={px} cy={py} r={R * .36} className="pr-lobe-petal" />;
                  })}
                  <circle cx={x} cy={y} r={R * .14} className="pr-lobe-bead" />
                  <circle cx={x} cy={y} r={R} className="pr-lead" />
                </g>
              );
            })}
            {/* chumbo: raios entre as casas */}
            {rings.map(ring => Array.from({ length: ring.slots }, (_, i) => {
              const a = ring.start + (i - .5) * ring.step;
              const [x0, y0] = prPolar(ring.rIn, a), [x1, y1] = prPolar(ring.rOut, a);
              return <line key={'s' + ring.tier + i} x1={x0} y1={y0} x2={x1} y2={y1} className="pr-lead" />;
            }))}
            {/* chumbo: anéis, com filete dourado */}
            {[100, 205, 355, 468].map(r => (
              <g key={r}>
                <circle cx="500" cy="500" r={r} className="pr-lead pr-lead--ring" />
                <circle cx="500" cy="500" r={r} className="pr-gilt" />
              </g>
            ))}
            {/* miolo: a luz */}
            <circle cx="500" cy="500" r="97" fill="url(#pr-hub)" className="pr-hub" />
            {Array.from({ length: 16 }, (_, i) => {
              const a = i * Math.PI / 8;
              const [x0, y0] = prPolar(30, a), [x1, y1] = prPolar(97, a);
              return <line key={'h' + i} x1={x0} y1={y0} x2={x1} y2={y1} className="pr-lead pr-lead--thin" />;
            })}
            <circle cx="500" cy="500" r="30" className="pr-lead pr-lead--ring" fill="#f6e3a8" />
          </svg>

          {/* medalhões (HTML por cima do SVG, para os símbolos e o clique) */}
          {rings.map(ring => [...ring.at.entries()].map(([slot, d]) => {
            const [x, y] = prPolar(ring.rMed, ring.start + slot * ring.step);
            return (
              <button key={d.id}
                className={'pr-med pr-med--' + ring.tier + (cur && cur.id === d.id ? ' is-active' : '')}
                style={{ left: (x - ring.d / 2) / 10 + '%', top: (y - ring.d / 2) / 10 + '%', width: ring.d / 10 + '%' }}
                onMouseEnter={() => setActive(d)} onFocus={() => setActive(d)}
                onClick={() => onNav('deity:' + d.id)}
                aria-label={d.name}>
                <DeitySigilImage deity={d} size="card" />
              </button>
            );
          }))}
        </div>

        {/* legenda: a placa votiva mostra o vidro sob o cursor */}
        <div className={'pr-caption vt-deity-card--' + (curTier || 'deus')}>
          <div className="vt-votive">
            <span className="vt-votive-gem" aria-hidden="true" />
            <div className="vt-votive-name">{cur ? cur.name : 'O Panteão de Valiran'}</div>
            <div className="vt-votive-title">{cur ? (cur.epithet || '') : 'Passe o cursor sobre um vitral'}</div>
          </div>
          <div className="vt-card-sub">{cur ? [tierName[curTier], vtRow(cur, /^dom[ií]nio/i)].filter(Boolean).join(' · ') : ''}</div>
        </div>

        <div className="pr-legend">
          {rings.map(r => (
            <span key={r.tier} className={'pr-legend-item pr-legend-item--' + r.tier}>
              <i />{{ tita: 'Titãs · anel interno', deus: 'Deuses · anel do meio', ascendido: 'Ascendidos · lóbulos' }[r.tier]} ({r.gods.length})
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
window.PantheonRose = PantheonRose;
