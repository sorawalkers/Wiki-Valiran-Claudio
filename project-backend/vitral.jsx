// Visual "Vitral sob Holofote" — artigo de personagem (PC/NPC) + card da galeria
//
// Lê `Entities.characters` sem nenhum campo novo obrigatório no Supabase.
//
// Campos opcionais de seção (JSONB, ignorados se ausentes):
//   confiabilidade: 'confirmado' | 'relato' | 'suspeita'  → selo nas passagens NPC
//   fase:           string                               → agrupa o índice do PC
//   corrompida:     boolean                              → vidro rachado (também deriva da tag "Corrupção")
//   quote:          string | { text, by }                → citação entre filetes

const { useState: useVtState, useEffect: useVtEffect, useRef: useVtRef } = React;

// ── Helpers ──────────────────────────────────────────────────────

// Arco ogival como path para clip-path. `shoulder` é a altura do ombro e
// `curve` a altura do ponto de controle, ambos como fração da largura.
// clip-path: path() não escala, então o path é gerado a partir do tamanho medido.
function ogivePath(w, h, shoulder = 0.5, curve = 0.147) {
  const h1 = Math.min(h, w * shoulder);
  const h2 = w * curve;
  const r = n => Math.round(n * 10) / 10;
  return `M0 ${r(h)} L0 ${r(h1)} Q0 ${r(h2)} ${r(w / 2)} 0 Q${r(w)} ${r(h2)} ${r(w)} ${r(h1)} L${r(w)} ${r(h)} Z`;
}

function vtRoman(n) {
  const map = [[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];
  let out = '';
  for (const [v, s] of map) while (n >= v) { out += s; n -= v; }
  return out;
}

function vtRow(c, re) {
  const r = (c.infobox?.rows || []).find(r => re.test(r.k || ''));
  return r ? String(r.v || '') : '';
}

function vtShortCampaign(c) {
  return (c.campaign || '').split(/[—–]/)[0].trim();
}

function vtIsCorrupt(sec) {
  return sec.corrompida === true || (sec.tags || []).some(t => /corrup/i.test(t));
}

function vtIsDead(c) {
  return /^(MORT|FALEC)/i.test(vtRow(c, /^status$/i).trim());
}

function vtRedact(text) {
  if (!text || !text.includes('[REDIGIDO]')) return text;
  return text.split('[REDIGIDO]').reduce((acc, part, i) => {
    if (i === 0) return [part];
    return [...acc, <span key={i} className="vt-redacted" aria-label="Redigido">{' '.repeat(14)}</span>, part];
  }, []);
}

// Link de sessão: "Sessão 12" → LER SESSÃO 12 →; "Sessões 2 e 4" → FONTES: …
function vtSessionFoot(sec, onNav) {
  const s = (sec.session || '').trim();
  if (!s) return null;
  const nums = s.match(/\d+/g) || [];
  if (nums.length === 1 && Entities.sessions && Entities.sessions[nums[0]]) {
    return <a className="vt-session-link" onClick={() => onNav('session:' + nums[0])}>Ler sessão {nums[0]} →</a>;
  }
  return <span className="vt-session-src">{nums.length > 1 ? 'Fontes: ' + s : s}</span>;
}

const VT_SEALS = {
  confirmado: { label: 'Confirmado',  legend: 'Confirmado em jogo' },
  relato:     { label: 'Relato de NPC', legend: 'Relato de NPC' },
  suspeita:   { label: 'Suspeita',    legend: 'Suspeita do grupo' },
};

function VtSeal({ kind, withLabel = true }) {
  const s = VT_SEALS[kind];
  if (!s) return null;
  return (
    <span className={'vt-seal vt-seal--' + kind}>
      <span className="vt-seal-gem" />
      {withLabel && s.label}
    </span>
  );
}

// Empacota as células da ficha num grid de 3 colunas sem buracos:
// perigo ocupa 2, nota ocupa 3, as demais 1; a última célula de cada linha estica.
function vtPackCells(cells, cols = 3) {
  const out = cells.map(c => ({ ...c, span: Math.min(c.span || 1, cols) }));
  let fill = 0;
  for (let i = 0; i < out.length; i++) {
    if (fill + out[i].span > cols) {
      out[i - 1].span += cols - fill;
      fill = 0;
    }
    fill = (fill + out[i].span) % cols;
  }
  if (fill > 0 && out.length) out[out.length - 1].span += cols - fill;
  return out;
}

// ── Assets de vitral (SVG em assets/vitral/, gerados por script) ──
const VT_ASSETS = 'assets/vitral/';

// clipPath do "furo" da janela gótica, em unidades relativas à caixa: o retrato
// fica recortado na mesma ogiva que a moldura SVG deixa aberta, em qualquer tamanho.
(function vtInjectDefs() {
  if (document.getElementById('vt-svg-defs')) return;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.id = 'vt-svg-defs';
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.setAttribute('aria-hidden', 'true');
  svg.style.position = 'absolute';
  svg.innerHTML = '<defs><clipPath id="vt-window-hole" clipPathUnits="objectBoundingBox">'
    + '<path d="M0.0824 0.9462 L0.0824 0.3269 Q0.0824 0.1341 0.5 0.0538 Q0.9176 0.1341 0.9176 0.3269 L0.9176 0.9462 Z"/>'
    + '</clipPath></defs>';
  document.body.appendChild(svg);
})();

// Janela gótica: moldura de vitral (aduelas, vinhas com rosas, rosácea no fecho)
// sobre o conteúdo recortado na ogiva interna. Proporção da moldura: 340×520.
function VtGothicWindow({ className = '', children }) {
  return (
    <div className={'vt-window ' + className}>
      <div className="vt-window-hole">{children}</div>
      <img className="vt-window-frame" src={VT_ASSETS + 'janela-gotica.svg'} alt="" aria-hidden="true" draggable="false" />
    </div>
  );
}

function VtPortrait({ c, className = '' }) {
  return (
    <div className={'vt-portrait-shadow ' + className}>
      <VtGothicWindow className="vt-portrait">
        <image-slot
          id={'char-portrait-' + c.id}
          shape="rect"
          placeholder={'retrato 3:4 · ' + c.name}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        ></image-slot>
        <div className="vt-portrait-vignette" />
      </VtGothicWindow>
    </div>
  );
}

function VtDivider() {
  return (
    <div className="vt-divider" aria-hidden="true">
      <img src={VT_ASSETS + 'divisor-vinhas.svg'} alt="" draggable="false" />
    </div>
  );
}

function VtBadge({ c, isPC }) {
  if (isPC) return <span className="vt-badge vt-badge--pc">Personagem de jogador</span>;
  const cls = { foe: 'foe', ally: 'ally', pc: 'pc' }[c.tagClass] || 'npc';
  return <span className={'vt-badge vt-badge--' + cls}>{c.tag || 'NPC'}</span>;
}

// ── Ficha (infobox) ──────────────────────────────────────────────

function VtFicha({ c, onNav }) {
  const [open, setOpen] = useVtState(false);
  const rows = (c.infobox?.rows || []).filter(r => r && r.k && (r.v || r.v === 0));

  // Sempre visíveis no mobile: filiação/afiliação e os campos de perigo.
  let pinned = rows.map(r => r.danger || /filia|fac[cç]/i.test(r.k));
  if (!pinned.some(Boolean)) pinned = rows.map((_, i) => i < 2);

  const cells = rows.map((r, i) => ({ row: r, span: r.danger ? 2 : 1, pinned: pinned[i] }));
  if (c.infobox?.statusNote) cells.push({ note: c.infobox.statusNote, span: 3, pinned: false });
  if (cells.length === 0) return null;
  const packed = vtPackCells(cells);

  return (
    <div className={'vt-ficha' + (open ? ' is-open' : '')}>
      <div className="vt-ficha-head">
        <VtLancet lit />
        <span className="vt-ficha-title">Ficha</span>
        <button type="button" className="vt-ficha-toggle" aria-expanded={open} onClick={() => setOpen(o => !o)}>
          {open ? '− Recolher' : '+ Ver tudo'}
        </button>
      </div>
      <dl className="vt-ficha-grid">
        {packed.map((cell, i) => {
          const r = cell.row;
          const cls = 'vt-cell'
            + (r && r.danger ? ' vt-cell--danger' : '')
            + (cell.note ? ' vt-cell--note' : '')
            + (cell.pinned ? '' : ' vt-cell--extra');
          return (
            <div key={i} className={cls} style={{ gridColumn: 'span ' + cell.span }}>
              <dt>{cell.note ? 'Nota' : r.k}</dt>
              <dd className={r && r.ok ? 'ok' : ''}>
                {cell.note
                  ? <em>{cell.note}</em>
                  : r.redacted
                    ? <span className="vt-redacted">{' '.repeat(14)}</span>
                    : r.link
                      ? <a onClick={() => onNav(r.link)}>{r.v}</a>
                      : r.v}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}

// ── Índice sticky com destaque do capítulo visível ───────────────

function useVtActiveChapter(count, refs) {
  const [active, setActive] = useVtState(0);
  useVtEffect(() => {
    if (!count || typeof IntersectionObserver === 'undefined') return;
    const root = document.querySelector('.main');
    const visible = new Map();
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        const idx = Number(e.target.dataset.idx);
        if (e.isIntersecting) visible.set(idx, e.boundingClientRect.top); else visible.delete(idx);
      });
      if (visible.size) setActive(Math.min(...visible.keys()));
    }, { root, rootMargin: '-10% 0px -55% 0px' });
    for (let i = 0; i < count; i++) if (refs.current[i]) io.observe(refs.current[i]);
    return () => io.disconnect();
  }, [count]);
  return [active, setActive];
}

function vtScrollTo(el) {
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Agrupa capítulos do PC por `fase` (consecutivos). Sem fase → um grupo só.
function vtGroupByPhase(sections) {
  if (!sections.some(s => s.fase)) return [{ label: null, items: sections.map((sec, i) => ({ sec, i })) }];
  const groups = [];
  sections.forEach((sec, i) => {
    const label = sec.fase || '';
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.items.push({ sec, i });
    else groups.push({ label, items: [{ sec, i }] });
  });
  return groups;
}

function VtIndex({ c, isPC, sections, active, onPick }) {
  const firstName = (c.name || '').split(' ')[0];
  const groups = isPC ? vtGroupByPhase(sections) : [{ label: null, items: sections.map((sec, i) => ({ sec, i })) }];
  const seals = !isPC && sections.some(s => VT_SEALS[s.confiabilidade]);
  return (
    <nav className="vt-index">
      <div className="vt-index-list">
        <div className="vt-label">{isPC ? 'A história de ' + firstName : 'História'}</div>
        {groups.map((g, gi) => (
          <React.Fragment key={gi}>
            {g.label && <div className="vt-index-phase">{g.label}</div>}
            {g.items.map(({ sec, i }) => (
              <a
                key={i}
                className={'vt-index-item' + (active === i ? ' active' : '') + (vtIsCorrupt(sec) ? ' corrupt' : '')}
                onClick={() => onPick(i)}
              >
                {!isPC && <span className="vt-index-num">{vtRoman(i + 1)}</span>}
                <span>
                  <span className="vt-index-title">{sec.title}</span>
                  {(sec.session || sec.date) && <span className="vt-index-sub">{sec.session || sec.date}</span>}
                </span>
              </a>
            ))}
          </React.Fragment>
        ))}
      </div>
      {seals && (
        <div className="vt-legend">
          <div className="vt-label">Legenda</div>
          {Object.keys(VT_SEALS).map(k => (
            <div key={k} className="vt-legend-row"><VtSeal kind={k} withLabel={false} />{VT_SEALS[k].legend}</div>
          ))}
        </div>
      )}
    </nav>
  );
}

// ── Capítulo / passagem ──────────────────────────────────────────

function VtQuote({ quote }) {
  if (!quote) return null;
  const q = typeof quote === 'string' ? { text: quote } : quote;
  if (!q.text) return null;
  return (
    <blockquote className="vt-inline-quote">
      “{q.text}”
      {q.by && <div className="vt-quote-src">{q.by}</div>}
    </blockquote>
  );
}

// Janelinha em arco com 4 vidros: acende quando o capítulo está aberto.
const VT_LANCET_CLIP = `path('${ogivePath(34, 48, 0.5, 0.15)}')`;

function VtLancet({ lit = false }) {
  return (
    <span className={'vt-lancet' + (lit ? ' vt-lancet--lit' : '')} aria-hidden="true">
      <span className="vt-lancet-glass" style={{ clipPath: VT_LANCET_CLIP }}><i /><i /><i /><i /></span>
    </span>
  );
}

function VtChapter({ sec, idx, isPC, isOpen, onToggle, onNav, refFn }) {
  const corrupt = vtIsCorrupt(sec);
  const meta = [sec.location, sec.date].filter(Boolean);
  const paras = sec.paras || [];
  const half = Math.ceil(paras.length / 2);
  const bodyId = 'vt-ch-body-' + idx;
  const renderP = (p, i) => (
    <p key={i}>{sec.redacted ? vtRedact(p) : p}</p>
  );

  return (
    <article
      ref={refFn}
      data-idx={idx}
      id={'vt-ch-' + idx}
      className={'vt-chapter' + (isPC ? ' vt-chapter--pc' : '') + (corrupt ? ' vt-chapter--corrupt' : '') + (isOpen ? ' is-open' : '')}
    >
      <h2 className="vt-chapter-h">
        <button type="button" className="vt-chapter-head" aria-expanded={isOpen} aria-controls={bodyId} onClick={onToggle}>
          {corrupt && <img className="vt-cracks vt-cracks--chapter" src={VT_ASSETS + 'vidro-quebrado.svg'} alt="" aria-hidden="true" draggable="false" />}
          <VtLancet />
          <span className="vt-chapter-titles">
            <span className="vt-eyebrow">
              {!isPC && <span className="vt-chapter-numeral">{vtRoman(idx + 1)}</span>}
              {isPC && sec.eyebrow
                ? <><span className="vt-eyebrow-lead">{sec.eyebrow}</span>{meta.length > 0 && <span>{meta.join(' · ')}</span>}</>
                : <span>{[sec.eyebrow, ...meta].filter(Boolean).join(' · ')}</span>}
              {!isPC && <VtSeal kind={sec.confiabilidade} />}
            </span>
            <span className="vt-chapter-title">{sec.title}</span>
          </span>
          <span className="vt-chapter-toggle" aria-hidden="true">{isOpen ? '−' : '+'}</span>
        </button>
      </h2>

      {isOpen && (
        <div className="vt-chapter-content" id={bodyId}>
          <div className="vt-chapter-body">
            {sec.quote ? paras.slice(0, half).map(renderP) : paras.map(renderP)}
            <VtQuote quote={sec.quote} />
            {sec.quote && paras.slice(half).map((p, i) => renderP(p, half + i))}
          </div>

          {((sec.tags && sec.tags.length) || sec.session) && (
            <footer className="vt-chapter-foot">
              <div className="vt-tags">
                {(sec.tags || []).map(t => (
                  <span key={t} className={'vt-tag' + (/corrup/i.test(t) ? ' vt-tag--red' : '')}>{t}</span>
                ))}
              </div>
              {vtSessionFoot(sec, onNav)}
            </footer>
          )}
        </div>
      )}
    </article>
  );
}

// ── Artigo ───────────────────────────────────────────────────────

function VitralArticle({ c, onNav, backTo, backLabel, isEditor, onEdit }) {
  const isPC = c.tag === 'PC';
  const sections = c.placeholder ? [] : (c.sections || []);
  const refs = useVtRef({});
  const [active, setActive] = useVtActiveChapter(sections.length, refs);
  const campaignShort = vtShortCampaign(c);
  const origin = vtRow(c, /^origem$/i) || vtRow(c, /filia|fac[cç]/i);
  const plaqueSub = [origin.split(/[—–(]/)[0].trim(), campaignShort].filter(Boolean).join(' · ');
  const firstName = (c.name || '').split(' ')[0];

  const [openSet, setOpenSet] = useVtState(() => new Set([0]));
  const toggle = i => setOpenSet(prev => {
    const next = new Set(prev);
    if (next.has(i)) next.delete(i); else next.add(i);
    return next;
  });
  const pick = i => {
    setActive(i);
    setOpenSet(prev => new Set(prev).add(i));
    requestAnimationFrame(() => vtScrollTo(refs.current[i]));
  };
  const allOpen = sections.length > 0 && openSet.size === sections.length;

  const hero = (
    <div className="vt-hero-text">
      <div className="vt-hero-titles">
        <div className="vt-badge-row">
          <VtBadge c={c} isPC={isPC} />
          {c.campaign && <span className="vt-badge-campaign">{c.campaign}</span>}
        </div>
        <h1 className="vt-h1">{c.name}</h1>
        {c.role && <div className="vt-epithet">{c.role}</div>}
      </div>
      <VtDivider />
      {c.hero && (
        <blockquote className={'vt-hero-quote' + (isPC ? ' vt-hero-quote--pc' : '')}>“{c.hero}”</blockquote>
      )}
      <VtFicha c={c} onNav={onNav} />
    </div>
  );

  const portrait = (
    <div className="vt-hero-portrait">
      <VtPortrait c={c} />
      {!isPC && (
        <div className="vt-plaque">
          <div className="vt-plaque-name">{c.name}</div>
          {plaqueSub && <div className="vt-plaque-sub">{plaqueSub}</div>}
        </div>
      )}
    </div>
  );

  return (
    <div className={'vt vt-article' + (isPC ? ' vt-article--pc' : '')} data-screen-label={(isPC ? 'PC · ' : 'NPC · ') + c.name}>
      <div className="vt-topbar">
        <nav className="vt-breadcrumb">
          <a onClick={() => onNav(backTo)}>{backLabel}</a>
          {campaignShort && <><span>/</span><span>{campaignShort}</span></>}
          <span>/</span>
          <span className="vt-breadcrumb-current">{c.name}</span>
        </nav>
        <div className="vt-topbar-actions">
          {isEditor && <button className="vt-btn" onClick={onEdit}>Editar artigo</button>}
        </div>
      </div>

      <section className={'vt-hero' + (isPC ? ' vt-hero--pc' : '')}>
        <img className="vt-hero-rose" src={VT_ASSETS + 'rosacea.svg'} alt="" aria-hidden="true" draggable="false" />
        {isPC ? <>{hero}{portrait}</> : <>{portrait}{hero}</>}
      </section>

      {c.placeholder && (
        <section className="vt-passages vt-passages--empty">
          <div className="vt-label">Em compilação</div>
          <p>Esta entrada ainda está sendo transcrita. Os capítulos serão acrescentados nas próximas sessões.</p>
        </section>
      )}

      {sections.length > 0 && (
        <section className="vt-passages">
          <VtIndex c={c} isPC={isPC} sections={sections} active={active} onPick={pick} />

          <div className="vt-chips" role="tablist">
            {sections.map((sec, i) => (
              <button
                key={i}
                type="button"
                className={'vt-chip' + (active === i ? ' active' : '') + (vtIsCorrupt(sec) ? ' corrupt' : '')}
                onClick={() => pick(i)}
              >
                {vtRoman(i + 1)} · {sec.title}
              </button>
            ))}
          </div>

          <div className="vt-chapters">
            {sections.length > 1 && (
              <div className="vt-chapters-tools">
                <button
                  type="button"
                  className="vt-link-btn"
                  onClick={() => setOpenSet(allOpen ? new Set() : new Set(sections.map((_, i) => i)))}
                >
                  {allOpen ? '− Fechar todos' : '+ Abrir todos'}
                </button>
              </div>
            )}
            {sections.map((sec, i) => (
              <VtChapter
                key={i}
                sec={sec}
                idx={i}
                isPC={isPC}
                isOpen={openSet.has(i)}
                onToggle={() => toggle(i)}
                onNav={onNav}
                refFn={el => { refs.current[i] = el; }}
              />
            ))}
          </div>
        </section>
      )}

      {c.related && c.related.length > 0 && (
        <section className="vt-related">
          <div className="vt-label">Ligados a {firstName}</div>
          <div className="vt-related-grid">
            {c.related.map((r, i) => (
              <a key={i} className="vt-related-cell" onClick={() => r.target && onNav(r.target)}>
                <span className="vt-related-tag">{r.tag}</span>
                <span className="vt-related-title">{r.title}</span>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ── Card da galeria (vivo / Morto) ───────────────────────────────

function VitralCard({ char, onClick, onEdit, isEditor }) {
  const dead = vtIsDead(char);
  const campaignShort = vtShortCampaign(char);
  const morte = vtRow(char, /^morte$/i);
  const sub = dead
    ? 'In memoriam' + (morte ? ' · † ' + morte : '')
    : [char.tag, campaignShort].filter(Boolean).join(' · ');

  return (
    <article className={'vt-card' + (dead ? ' vt-card--dead' : '')} onClick={onClick}>
      <VtGothicWindow className="vt-card-arch">
        <image-slot
          id={'char-portrait-' + char.id}
          shape="rect"
          placeholder={'retrato 3:4 · ' + char.name}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        ></image-slot>
        {dead && <img className="vt-cracks" src={VT_ASSETS + 'vidro-quebrado.svg'} alt="" draggable="false" />}
      </VtGothicWindow>
      <div className="vt-card-plaque">{char.name}</div>
      {sub && <div className="vt-card-sub">{sub}</div>}
      {isEditor && (
        <button className="vt-btn vt-card-edit" onClick={e => { e.stopPropagation(); onEdit(); }}>Editar</button>
      )}
    </article>
  );
}

window.ogivePath     = ogivePath;
window.VitralArticle = VitralArticle;
window.VitralCard    = VitralCard;
