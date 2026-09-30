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
// Quando sobra espaço numa linha, ele vai para a célula de texto mais longo daquela
// linha (não para a última), para não deixar um valor curto numa célula larga ao lado
// de um valor longo espremido.
function vtPackCells(cells, cols = 3) {
  const out = cells.map(c => ({ ...c, span: Math.min(c.span || 1, cols) }));
  const len = c => String(c.note || (c.row && c.row.v) || '').length;
  let row = [];
  let fill = 0;
  const closeRow = () => {
    if (row.length && fill < cols) row.reduce((a, b) => (len(b) > len(a) ? b : a)).span += cols - fill;
    row = [];
    fill = 0;
  };
  for (const c of out) {
    if (fill + c.span > cols) closeRow();
    row.push(c);
    fill += c.span;
    if (fill === cols) closeRow();
  }
  closeRow();
  return out;
}

// Largura inicial de cada campo pelo tamanho do valor: textos longos já nascem com 2 colunas.
function vtCellSpan(r) {
  const n = String(r.v || '').length;
  return r.danger || n > 26 ? 2 : 1;
}

// ── Assets de vitral (SVG em assets/vitral/, gerados por script) ──
const VT_ASSETS = 'assets/vitral/';
// Suba este número sempre que regerar/substituir um asset com o mesmo nome:
// o `?v=` força o navegador a baixar a versão nova em vez de usar o cache.
const VT_ASSETS_VERSION = 5;
const vtAsset = name => VT_ASSETS + name + '?v=' + VT_ASSETS_VERSION;

// Catálogo de molduras de janela gótica. Cada `file` tem, em assets/vitral/:
//   <file>.webp (960px) e <file>-sm.webp (480px): a moldura 2:3 com vão e fundo transparentes;
//   <file>-vao.png: máscara do vão (alfa = onde o retrato aparece), gerada por
//   processar_moldura.py — funciona também com bordas irregulares (vitrais quebrados).
// `box`: retângulo do vão em % da caixa [esquerda, topo, direita, base] (o script imprime);
//   o retrato é enquadrado nele e a máscara recorta o contorno exato.
// `quebrada`: a moldura já é um vitral estilhaçado (dispensa o efeito extra de morto).
// `scale`: compensa o peso visual — molduras com folhagem saindo das colunas parecem
//   maiores; a escala é √(largura da silhueta da viva-fina ÷ largura desta), com a base fixa.
const VT_FRAMES = [
  { id: 'viva-fina',            label: 'Viva · fina',                file: 'janela-viva-fina',            box: [23.1, 18.1, 23.1, 6.1] },
  { id: 'misterio-finas',       label: 'Mistério · rosas finas',     file: 'janela-misterio-finas',       box: [22.7, 18.2, 22.9, 6.1], scale: 0.965 },
  { id: 'misterio-murchas',     label: 'Mistério · rosas murchas',   file: 'janela-misterio-murchas',     box: [22.7, 18.3, 23.3, 6.7], scale: 0.971 },
  { id: 'quebrada-estilhacada', label: 'Quebrada · estilhaçada',     file: 'janela-quebrada-estilhacada', box: [22.3, 20.0, 22.3, 7.2], scale: 0.969, quebrada: true },
  { id: 'quebrada-musgo',       label: 'Quebrada · musgo e heras',   file: 'janela-quebrada-musgo',       box: [22.9, 20.0, 22.1, 8.1], scale: 0.947, quebrada: true },
  { id: 'quebrada-morta',       label: 'Quebrada · vegetação morta', file: 'janela-quebrada-morta',       box: [23.5, 19.9, 21.9, 7.9], scale: 0.937, quebrada: true },
];
const VT_FRAME_BY_ID = Object.fromEntries(VT_FRAMES.map(f => [f.id, f]));
// Molduras antigas (grossas, removidas) → equivalente fina, para escolhas já salvas.
const VT_FRAME_ALIAS = { viva: 'viva-fina', misterio: 'misterio-finas' };

// Moldura automática por status, usada quando o personagem não tem `infobox.vitral`.
const VT_AUTO_FRAME = { viva: 'viva-fina', misterio: 'misterio-finas', morto: 'viva-fina' };

function vtStatusKind(c) {
  const st = vtRow(c, /^status$/i).trim();
  if (/^(MORT|FALEC)/i.test(st)) return 'morto';
  if (/DESAPAREC|CATIV|PRISIONEIR|REF[EÉ]M|FUGA|FORAGID|DESCONHEC|INCERT|\?/i.test(st)) return 'misterio';
  return 'viva';
}

// `override` permite pré-visualizar outra moldura sem salvar.
function vtFrameFor(c, override) {
  const kind = vtStatusKind(c);
  const chosen = override !== undefined ? override : c.infobox?.vitral;
  const frame = VT_FRAME_BY_ID[VT_FRAME_ALIAS[chosen] || chosen] || VT_FRAME_BY_ID[VT_AUTO_FRAME[kind]] || VT_FRAMES[0];
  return { frame, dead: kind === 'morto' };
}

// Retrato no vão da janela + moldura por cima. `sizes` escolhe entre as duas resoluções.
// Morto: retrato em cinza; se a moldura não for "quebrada", ela também apaga e o vão racha.
function VtGothicWindow({ frame = VT_FRAMES[0], dead = false, className = '', sizes = '400px', children }) {
  const greyFrame = dead && !frame.quebrada;
  const mask = `url('${vtAsset(frame.file + '-vao.png')}')`;
  const [l, t, r, b] = frame.box;
  return (
    <div
      className={'vt-window' + (dead ? ' vt-window--dead' : '') + (greyFrame ? ' vt-window--morto' : '') + ' ' + className}
      style={frame.scale ? { transform: 'scale(' + frame.scale + ')' } : undefined}
    >
      <div className="vt-window-hole" style={{ WebkitMaskImage: mask, maskImage: mask }}>
        <div className="vt-window-pane" style={{ left: l + '%', top: t + '%', right: r + '%', bottom: b + '%' }}>
          {children}
          {greyFrame && <img className="vt-cracks" src={vtAsset('vidro-quebrado.svg')} alt="" draggable="false" />}
        </div>
      </div>
      <img
        className="vt-window-frame"
        src={vtAsset(frame.file + '.webp')}
        srcSet={vtAsset(frame.file + '-sm.webp') + ' 480w, ' + vtAsset(frame.file + '.webp') + ' 960w'}
        sizes={sizes}
        alt=""
        aria-hidden="true"
        draggable="false"
      />
    </div>
  );
}

// Rosáceas-relicário (divindades), uma por nível. `r` = raio do vão circular em %
// da caixa (medido no PNG 1920²); o vão fica por baixo do metal, que cobre a borda.
const VT_ROSES = {
  tita:      { file: 'rosacea-titas',      r: 28.0 },
  deus:      { file: 'rosacea-deuses',     r: 27.2 },
  ascendido: { file: 'rosacea-ascendidos', r: 26.9 },
};

// Nível da divindade pelo "Tipo" da ficha (mesma regra da página do Panteão).
function vtDeityTier(d) {
  const t = vtRow(d, /^tipo$/i);
  if (/^tit[ãa]/i.test(t)) return 'tita';
  if (/ascend|anjo|pseudo/i.test(t)) return 'ascendido';
  return 'deus';
}

// Espelho oval (teste): moldura alternativa para as divindades, no lugar das rosáceas.
// VT_DEITY_SHAPE = 'rosa' volta para as rosáceas por nível.
const VT_DEITY_SHAPE = 'oval';
const VT_DEITY_MIRRORS = {
  oval:     { id: 'espelho-oval',     file: 'espelho-oval',     box: [21.0, 18.2, 20.8, 18.6] },
  circular: { id: 'espelho-circular', file: 'espelho-circular', box: [20.0, 21.0, 20.2, 22.1] },   // teste
};

function VtDeityFrame({ tier, shape = VT_DEITY_SHAPE, className = '', sizes, children }) {
  const mirror = VT_DEITY_MIRRORS[shape];
  if (mirror) {
    return (
      <VtGothicWindow frame={mirror} className={'vt-mirror vt-mirror--' + shape + ' vt-mirror--' + tier + ' ' + className} sizes={sizes}>
        {children}
      </VtGothicWindow>
    );
  }
  return <VtRoseWindow tier={tier} className={className} sizes={sizes}>{children}</VtRoseWindow>;
}

// Altar de vidro: fundo para o símbolo quando a divindade não tem arte.
// Vitral em leque (raios de chumbo saindo do centro) na cor do nível, com o
// símbolo num medalhão dourado no meio; preenche o espelho oval inteiro.
// viewBox 200×326 = proporção do vão do espelho.
const VT_ALTAR_RAYS = 20;
function VtSigilAltar({ deity, tier }) {
  const cx = 100, cy = 163, R = 400;
  const rays = [];
  for (let i = 0; i < VT_ALTAR_RAYS; i++) {
    const a0 = (i / VT_ALTAR_RAYS) * Math.PI * 2 - Math.PI / 2;
    const a1 = ((i + 1) / VT_ALTAR_RAYS) * Math.PI * 2 - Math.PI / 2;
    rays.push({
      d: `M${cx} ${cy} L${cx + R * Math.cos(a0)} ${cy + R * Math.sin(a0)} L${cx + R * Math.cos(a1)} ${cy + R * Math.sin(a1)} Z`,
      x: cx + R * Math.cos(a0), y: cy + R * Math.sin(a0),
      alt: i % 2,
    });
  }
  return (
    <div className={'vt-altar vt-altar--' + tier}>
      <svg className="vt-altar-glass" viewBox="0 0 200 326" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <radialGradient id="vt-altar-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#f3dca0" stopOpacity=".55" />
            <stop offset=".35" stopColor="#c9a55a" stopOpacity=".18" />
            <stop offset="1" stopColor="#000" stopOpacity="0" />
          </radialGradient>
        </defs>
        {rays.map((r, i) => <path key={i} d={r.d} className={'vt-altar-pane' + (r.alt ? ' is-alt' : '')} />)}
        {/* anel externo mais escuro: divide cada raio em dois vidros */}
        <path className="vt-altar-outer" fillRule="evenodd"
          d={`M-50 -50 H250 V376 H-50 Z M${cx} ${cy - 118} a78 118 0 1 0 0.01 0 Z`} />
        <circle cx={cx} cy={cy} r="120" fill="url(#vt-altar-glow)" />
        {/* chumbo */}
        {rays.map((r, i) => <line key={i} x1={cx} y1={cy} x2={r.x} y2={r.y} className="vt-altar-lead" />)}
        <ellipse cx={cx} cy={cy} rx="78" ry="118" className="vt-altar-lead" />
        <circle cx={cx} cy={cy} r="58" className="vt-altar-lead vt-altar-lead--gold" />
      </svg>
      <div className="vt-altar-medal">
        <DeitySigilImage deity={deity} size="card" />
      </div>
    </div>
  );
}

// Emblema do símbolo sem vitral (teste): 'selo' (medalhão cunhado), 'estandarte'
// (flâmula bordada pendurada) ou 'relevo' (tábua de pedra entalhada).
function VtSigilEmblem({ deity, tier, variant = 'selo' }) {
  return (
    <div className={'vt-emblem vt-emblem--' + variant + ' vt-altar--' + tier}>
      {variant === 'estandarte' && <span className="vt-emblem-rod" aria-hidden="true" />}
      <div className="vt-emblem-body">
        <div className="vt-emblem-sigil"><DeitySigilImage deity={deity} size="card" /></div>
      </div>
      {variant === 'relevo' && <span className="vt-emblem-gem" aria-hidden="true" />}
    </div>
  );
}

function VtRoseWindow({ tier = 'deus', className = '', sizes = '400px', children }) {
  const rose = VT_ROSES[tier] || VT_ROSES.deus;
  const d = rose.r * 2;
  return (
    <div className={'vt-rose vt-rose--' + tier + ' ' + className}>
      <div className="vt-rose-hole" style={{ left: (50 - rose.r) + '%', top: (50 - rose.r) + '%', width: d + '%', height: d + '%' }}>{children}</div>
      <img
        className="vt-window-frame"
        src={vtAsset(rose.file + '.webp')}
        srcSet={vtAsset(rose.file + '-sm.webp') + ' 480w, ' + vtAsset(rose.file + '.webp') + ' 960w'}
        sizes={sizes}
        alt=""
        aria-hidden="true"
        draggable="false"
      />
    </div>
  );
}

// Seletor de moldura: "Automático" + miniaturas do catálogo com o retrato dentro.
function VitralFramePicker({ value = '', onChange, portraitUrl, framing, compact = false }) {
  const options = [{ id: '', label: 'Automático (pelo status)' }, ...VT_FRAMES];
  return (
    <div className={'vt-picker' + (compact ? ' vt-picker--compact' : '')} role="radiogroup" aria-label="Moldura de vitral">
      {options.map(o => (
        <button
          key={o.id || 'auto'}
          type="button"
          role="radio"
          aria-checked={value === o.id}
          className={'vt-picker-opt' + (value === o.id ? ' active' : '')}
          onClick={() => onChange(o.id)}
          title={o.label}
        >
          {o.id ? (
            <VtGothicWindow frame={o} className="vt-picker-thumb" sizes="120px">
              {portraitUrl && <VtFramedImage url={portraitUrl} framing={framing} />}
            </VtGothicWindow>
          ) : (
            <span className="vt-picker-thumb vt-picker-auto">Auto</span>
          )}
          <span className="vt-picker-label">{o.label}</span>
        </button>
      ))}
    </div>
  );
}

// ── Retrato dentro do vitral, com enquadramento por personagem ─────
// Guardado em `infobox.retrato` (sem campo novo no Supabase):
//   x, y: ponto de foco em % da imagem (0–100); z: zoom (1–3);
//   fit: 'preencher' (cobre o vão, cortando as sobras) | 'inteira' (imagem toda,
//        com a própria imagem desfocada preenchendo o fundo).
// Padrão: preencher, foco no terço de cima (onde costumam estar os rostos).
const VT_FRAMING_DEFAULT = { x: 50, y: 22, z: 1, fit: 'preencher' };

function vtFraming(c, override) {
  return { ...VT_FRAMING_DEFAULT, ...(c.infobox?.retrato || {}), ...(override || {}) };
}

// URL do retrato no store de image-slots, atualizando quando o Supabase termina de carregar.
function useVtSlotUrl(slotId) {
  const read = () => (window._imageSlotGet && window._imageSlotGet(slotId)?.u) || null;
  const [url, setUrl] = useVtState(read);
  useVtEffect(() => {
    setUrl(read());
    if (!window._imageSlotSubscribe) return;
    return window._imageSlotSubscribe(() => setUrl(read()));
  }, [slotId]);
  return url;
}

function VtFramedImage({ url, framing, placeholder, onPan }) {
  const f = { ...VT_FRAMING_DEFAULT, ...(framing || {}) };
  const drag = useVtRef(null);
  if (!url) return <div className="vt-portrait-empty">{placeholder}</div>;
  const pos = f.x + '% ' + f.y + '%';
  const imgStyle = {
    objectFit: f.fit === 'inteira' ? 'contain' : 'cover',
    objectPosition: pos,
    transform: 'scale(' + f.z + ')',
    transformOrigin: pos,
  };

  // Arrastar move o foco (só quando o ajuste está aberto): arrastar para a direita
  // mostra mais da esquerda da imagem, como mover uma foto atrás de um vidro.
  const onPointerDown = onPan ? e => {
    if (e.button !== 0) return;
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    drag.current = { px: e.clientX, py: e.clientY, x: f.x, y: f.y, w: rect.width, h: rect.height };
    e.currentTarget.setPointerCapture(e.pointerId);
  } : undefined;
  const onPointerMove = onPan ? e => {
    const d = drag.current;
    if (!d) return;
    const k = 100 / Math.max(f.z, 1);
    const clamp = v => Math.max(0, Math.min(100, Math.round(v)));
    onPan({ x: clamp(d.x - (e.clientX - d.px) / d.w * k), y: clamp(d.y - (e.clientY - d.py) / d.h * k) });
  } : undefined;
  const onPointerUp = onPan ? () => { drag.current = null; } : undefined;

  return (
    <div
      className={'vt-framed' + (onPan ? ' vt-framed--pan' : '')}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {f.fit === 'inteira' && <img className="vt-framed-backdrop" src={url} alt="" draggable="false" />}
      <img className="vt-framed-img" src={url} alt="" draggable="false" style={imgStyle} />
    </div>
  );
}

function VtPortrait({ c, slotId, frameOverride, framing, onPan, fallback, rose = false, className = '' }) {
  const { frame, dead } = vtFrameFor(c, frameOverride);
  const url = useVtSlotUrl(slotId || 'char-portrait-' + c.id);
  if (rose) {
    return (
      <div className={'vt-portrait-shadow ' + className}>
        <VtDeityFrame tier={vtDeityTier(c)} className="vt-portrait vt-portrait--rose" sizes="(max-width: 900px) 320px, 460px">
          {!url && fallback
            ? fallback
            : <VtFramedImage url={url} framing={framing || vtFraming(c)} placeholder={'Sem arte · ' + c.name} onPan={onPan} />}
        </VtDeityFrame>
      </div>
    );
  }
  return (
    <div className={'vt-portrait-shadow ' + className}>
      <VtGothicWindow frame={frame} dead={dead} className="vt-portrait" sizes="(max-width: 900px) 280px, 400px">
        {!url && fallback
          ? fallback
          : <VtFramedImage url={url} framing={framing || vtFraming(c)} placeholder={'Sem retrato · ' + c.name} onPan={onPan} />}
        <div className="vt-portrait-vignette" />
      </VtGothicWindow>
    </div>
  );
}

// Controles de enquadramento (zoom, preencher/inteira, recentralizar).
function VtFramingControls({ value, onChange }) {
  const f = { ...VT_FRAMING_DEFAULT, ...value };
  const set = patch => onChange({ ...f, ...patch });
  return (
    <div className="vt-framing">
      <div className="vt-framing-row">
        <span className="vt-framing-label">Ajuste</span>
        <div className="vt-seg">
          {[['preencher', 'Preencher'], ['inteira', 'Imagem inteira']].map(([id, label]) => (
            <button key={id} type="button" className={f.fit === id ? 'active' : ''}
              onClick={() => f.fit !== id && set(id === 'inteira' ? { fit: id, x: 50, y: 50, z: 1 } : { ...VT_FRAMING_DEFAULT })}>{label}</button>
          ))}
        </div>
      </div>
      <label className="vt-framing-row">
        <span className="vt-framing-label">Zoom</span>
        <input type="range" min="1" max="3" step="0.05" value={f.z} onChange={e => set({ z: Number(e.target.value) })} />
      </label>
      <div className="vt-framing-row vt-framing-hint">
        {f.fit === 'preencher' ? 'Arraste o retrato para escolher o foco.' : 'Arraste para mover a imagem dentro do vitral.'}
        <button type="button" className="vt-link-btn" onClick={() => onChange({ ...VT_FRAMING_DEFAULT })}>Recentralizar</button>
      </div>
    </div>
  );
}

function VtDivider() {
  return (
    <div className="vt-divider" aria-hidden="true">
      <img src={vtAsset('divisor-vinhas.svg')} alt="" draggable="false" />
    </div>
  );
}

// Badge da divindade pelo "Tipo" da ficha: Titã (violeta), Ascendido/Anjo (cobalto), Deus (dourado).
function VtDeityBadge({ d }) {
  const tipo = vtRow(d, /^tipo$/i) || 'Divindade';
  const cls = /tit[ãa]/i.test(tipo) ? 'tita' : /ascend|anjo|pseudo/i.test(tipo) ? 'ascendido' : 'deus';
  return <span className={'vt-badge vt-badge--' + cls}>{tipo}</span>;
}

function VtBadge({ c, isPC }) {
  if (isPC) return <span className="vt-badge vt-badge--pc">Personagem de jogador</span>;
  const cls = { foe: 'foe', ally: 'ally', pc: 'pc' }[c.tagClass] || 'npc';
  return <span className={'vt-badge vt-badge--' + cls}>{c.tag || 'NPC'}</span>;
}

// ── Ficha (infobox) ──────────────────────────────────────────────

// Moldura ornamental da ficha, montada em peças (assets/vitral/ficha/, geradas por
// processar_ficha.py): cantos e ornamentos centrais fixos, trilhos lisos repetindo —
// assim ela acompanha qualquer quantidade de campos sem deformar.
const VT_FICHA_PIECES = [
  'tl', 'rail-top', 'top', 'rail-top', 'tr',
  'rail-left', null, null, null, 'rail-right',
  'bl', 'rail-bottom', 'bottom', 'rail-bottom', 'br',
];

function VtArchiveFrame() {
  return (
    <div className="vt-archive-frame" aria-hidden="true">
      {VT_FICHA_PIECES.map((p, i) => p
        ? <i key={i} className={'vt-af vt-af--' + p} style={{ backgroundImage: `url('${vtAsset('ficha/' + p + '.webp')}')` }} />
        : <i key={i} />)}
    </div>
  );
}

function VtFicha({ c, onNav }) {
  const [open, setOpen] = useVtState(false);
  const rows = (c.infobox?.rows || []).filter(r => r && r.k && (r.v || r.v === 0));

  // Sempre visíveis no mobile: filiação/afiliação e os campos de perigo.
  let pinned = rows.map(r => r.danger || /filia|fac[cç]/i.test(r.k));
  if (!pinned.some(Boolean)) pinned = rows.map((_, i) => i < 2);

  const cells = rows.map((r, i) => ({ row: r, span: vtCellSpan(r), pinned: pinned[i] }));
  if (c.infobox?.statusNote) cells.push({ note: c.infobox.statusNote, span: 3, pinned: false });
  if (cells.length === 0) return null;
  const packed = vtPackCells(cells);

  return (
    <div className={'vt-ficha' + (open ? ' is-open' : '')}>
      <VtArchiveFrame />
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
      {/* só no celular, e só se houver campos recolhidos */}
      {packed.some(cell => !cell.pinned) && (
        <button type="button" className="vt-ficha-toggle" aria-expanded={open} onClick={() => setOpen(o => !o)}>
          {open ? '− Recolher' : '+ Ver tudo'}
        </button>
      )}
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

// Cor do vidro de cada ligação em "Ligados a…", pelo tipo (tag) ou pelo destino.
function vtRelatedColor(r) {
  const t = String(r.tag || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const target = String(r.target || '');
  if (/fac|casa|ordem|guilda/.test(t) || target.startsWith('faction')) return '#9a2a24';   // rubi
  if (/local|reino|cidade|regiao|atlas/.test(t) || target === 'map') return '#3f6a86';     // cobalto
  if (/divin|deus|deusa|panteao/.test(t) || target.startsWith('deity')) return '#7a5aa8';   // violeta
  if (/evento|sessao|cronica/.test(t) || target.startsWith('session') || target === 'timeline') return '#56673a'; // verde
  if (/misterio|segredo/.test(t)) return '#5a4a7a';
  return '#b8873a';                                                                        // âmbar: personagens e o resto
}

function VtIndex({ c, isPC, label, sections, active, onPick }) {
  const firstName = (c.name || '').split(' ')[0];
  const groups = isPC ? vtGroupByPhase(sections) : [{ label: null, items: sections.map((sec, i) => ({ sec, i })) }];
  const seals = !isPC && sections.some(s => VT_SEALS[s.confiabilidade]);
  return (
    <nav className="vt-index">
      <div className="vt-index-list">
        <div className="vt-label">{isPC ? 'A história de ' + firstName : (label || 'História')}</div>
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
          {corrupt && <img className="vt-cracks vt-cracks--chapter" src={vtAsset('vidro-quebrado.svg')} alt="" aria-hidden="true" draggable="false" />}
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

// Perfis do artigo: o mesmo layout serve personagens e divindades.
const VT_KINDS = {
  character: {
    slot: c => 'char-portrait-' + c.id,
    save: e => window.DB.saveCharacter(e),
    subtitle: c => c.role,
    context: c => c.campaign,
    indexLabel: () => 'História',
    empty: 'Esta entrada ainda está sendo transcrita. Os capítulos serão acrescentados nas próximas sessões.',
  },
  deity: {
    slot: d => 'deity-hero-' + d.id,
    save: e => window.DB.saveDeity(e),
    subtitle: d => d.epithet,
    context: d => vtRow(d, /^dom[ií]nio/i),
    indexLabel: () => 'Escrituras',
    empty: 'O arquivista ainda reúne os testemunhos. Origem, dogmas, manifestações e culto serão acrescentados em breve.',
  },
  // facção (dossiê): imagem em 'faction-portrait-<id>', carimbo como selo
  faction: {
    slot: f => 'faction-portrait-' + f.id,
    save: null,
    subtitle: f => f.alias,
    context: () => null,
    indexLabel: () => 'Dossiê',
    empty: 'O arquivista Cael reuniu o esqueleto desta entrada. Inteligência detalhada será acrescentada nas próximas sessões.',
  },
  // resumo de campanha (Campanha III etc.): sem retrato — no lugar da janela, o selo com o numeral
  campaign: {
    slot: c => 'campaign-art-' + c.id,
    save: e => window.DB.saveCampaignArticle(e),
    subtitle: c => c.subtitle,
    context: c => vtRow(c, /^per[ií]odo/i),
    indexLabel: () => 'Capítulos',
    empty: 'O escriba ainda transcreve esta campanha.',
  },
};

function VitralArticle({ c, kind = 'character', onNav, backTo, backLabel, isEditor, onEdit, heroVitral }) {
  const K = VT_KINDS[kind] || VT_KINDS.character;
  const isDeity = kind === 'deity';
  const isCampaign = kind === 'campaign';
  const isFaction = kind === 'faction';
  const isPC = !isDeity && !isCampaign && !isFaction && c.tag === 'PC';
  const sections = c.placeholder ? [] : (c.sections || []);
  const refs = useVtRef({});
  const [active, setActive] = useVtActiveChapter(sections.length, refs);
  const campaignShort = isDeity || isCampaign || isFaction ? '' : vtShortCampaign(c);
  const firstName = (c.name || '').split(' ')[0];
  const slotId = K.slot(c);
  const context = K.context(c);
  const subtitle = K.subtitle(c);

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

  // Ajuste do vitral (só editores): moldura (infobox.vitral) e enquadramento do retrato
  // (infobox.retrato). Tudo é pré-visualizado ao vivo e só grava em "Salvar".
  const savedFrame = c.infobox?.vitral || '';
  const savedFraming = vtFraming(c);
  const [framePreview, setFramePreview] = useVtState(undefined);
  const [framingPreview, setFramingPreview] = useVtState(undefined);
  const [frameSaving, setFrameSaving] = useVtState(false);
  const [frameTestOpen, setFrameTestOpen] = useVtState(false);
  const framing = framingPreview || savedFraming;
  const frameDirty = (framePreview !== undefined && framePreview !== savedFrame)
    || (framingPreview !== undefined && JSON.stringify(framingPreview) !== JSON.stringify(savedFraming));
  const portraitUrl = useVtSlotUrl(slotId);
  const deityVitralUrl = useVtSlotUrl(VT_DEITY_VITRAL_SLOT + c.id);
  function discardFrame() { setFramePreview(undefined); setFramingPreview(undefined); }
  async function saveFrame() {
    setFrameSaving(true);
    try {
      const infobox = { ...(c.infobox || {}) };
      if (framePreview !== undefined) infobox.vitral = framePreview || undefined;
      if (framingPreview !== undefined) infobox.retrato = framingPreview;
      await K.save({ ...c, infobox });
      discardFrame();
    } catch (e) {
      alert('Não foi possível salvar o vitral: ' + (e.message || e));
    } finally {
      setFrameSaving(false);
    }
  }

  const hero = (
    <div className="vt-hero-text">
      <div className="vt-hero-titles">
        {isDeity && (
          <div className="vt-sigil-medallion">
            <DeitySigilImage deity={c} size="infobox" interactive />
          </div>
        )}
        <div className="vt-badge-row">
          {isDeity ? <VtDeityBadge d={c} /> : isCampaign ? <span className="vt-badge vt-badge--campaign">Crônica</span>
            : isFaction ? <span className={'vt-badge vt-badge--stamp vt-badge--stamp-' + (c.stampClass || 'red')}>{c.stamp || 'Facção'}</span>
            : <VtBadge c={c} isPC={isPC} />}
          {context && <span className="vt-badge-campaign">{context}</span>}
        </div>
        <h1 className="vt-h1">{c.name}</h1>
        {subtitle && <div className="vt-epithet">{subtitle}</div>}
      </div>
      <VtDivider />
      {c.hero && (
        <blockquote className={'vt-hero-quote' + (isPC ? ' vt-hero-quote--pc' : '')}>“{c.hero}”</blockquote>
      )}
      <VtFicha c={c} onNav={onNav} />
    </div>
  );

  // Divindade com vitral (o mesmo da galeria, slot 'deity-vitral-<id>'): entra inteiro no lugar
  // do espelho. heroVitral {file, shape} força um vitral local (páginas de teste).
  const vitralSrc = heroVitral ? vtAsset(heroVitral.file + '.webp') : (isDeity ? deityVitralUrl : null);
  const campaignNum = isCampaign ? ((/\b([IVXL]+)\b\s*$/.exec(c.name || '') || [])[1] || '✠') : null;
  const portrait = isCampaign ? (
    <div className="vt-hero-portrait vt-hero-portrait--seal">
      <div className="vs-seal vs-seal--campaign">
        <span className="vs-seal-n">{campaignNum}</span>
        <span className="vs-seal-k">{/^rogue/i.test(c.name || '') ? 'Rogue' : 'Campanha'}</span>
      </div>
    </div>
  ) : vitralSrc ? (
    <div className="vt-hero-portrait">
      <img className={'vt-deity-vitral vt-deity-vitral--' + (heroVitral ? heroVitral.shape : 'catedral')}
        src={vitralSrc}
        {...(heroVitral ? {
          srcSet: vtAsset(heroVitral.file + '-sm.webp') + ' 480w, ' + vtAsset(heroVitral.file + '.webp') + ' 960w',
          sizes: '(max-width: 900px) 320px, 480px',
        } : {})}
        alt={'Vitral de ' + c.name} draggable="false" />
    </div>
  ) : (
    <div className="vt-hero-portrait">
      <VtPortrait
        c={c}
        slotId={slotId}
        rose={isDeity}
        fallback={isDeity ? <VtSigilAltar deity={c} tier={vtDeityTier(c)} />
          : isFaction ? <div className="vf-crest"><span>{(c.name || '?').charAt(0)}</span></div> : null}
        frameOverride={framePreview}
        framing={framing}
        onPan={frameTestOpen && portraitUrl ? p => setFramingPreview({ ...framing, ...p }) : undefined}
      />
    </div>
  );

  // Painel de ajuste (editores) fica numa linha própria sob a janela, fora do bloco
  // alinhado, para não empurrar a janela para cima quando aberto.
  const tools = isEditor && !vitralSrc && !isCampaign && !isFaction && (
        <div className="vt-frame-test">
          <button type="button" className="vt-link-btn" onClick={() => setFrameTestOpen(o => !o)}>
            {frameTestOpen ? '− Fechar ajuste' : (isDeity ? '✠ Ajustar arte na rosácea' : '✠ Ajustar vitral e retrato')}
          </button>
          {frameTestOpen && (
            <React.Fragment>
              {portraitUrl && <VtFramingControls value={framing} onChange={setFramingPreview} />}
              {!isDeity && <VitralFramePicker
                compact
                value={framePreview !== undefined ? framePreview : savedFrame}
                onChange={setFramePreview}
                portraitUrl={portraitUrl}
                framing={framing}
              />}
              {frameDirty && (
                <div className="vt-frame-test-actions">
                  <button type="button" className="vt-btn" onClick={discardFrame}>Descartar</button>
                  <button type="button" className="vt-btn vt-btn--gold" disabled={frameSaving} onClick={saveFrame}>
                    {frameSaving ? 'Salvando…' : 'Salvar'}
                  </button>
                </div>
              )}
            </React.Fragment>
          )}
        </div>
  );

  return (
    <div className={'vt vt-article' + (isPC ? ' vt-article--pc' : '') + (isDeity ? ' vt-article--deity' : '') + (vtStatusKind(c) === 'morto' ? ' vt-article--morto' : '')} data-screen-label={(isDeity ? 'Divindade · ' : isPC ? 'PC · ' : 'NPC · ') + c.name}>
      <div className="vt-topbar">
        <nav className="vt-breadcrumb">
          <a onClick={() => onNav(backTo)}>{backLabel}</a>
          {campaignShort && <><span className="vt-bc-sep" aria-hidden="true" /><span>{campaignShort}</span></>}
          <span className="vt-bc-sep" aria-hidden="true" />
          <span className="vt-breadcrumb-current">{c.name}</span>
        </nav>
        <div className="vt-topbar-actions">
          {isEditor && <button className="vt-btn" onClick={onEdit}>Editar artigo</button>}
        </div>
      </div>

      <section className={'vt-hero' + (isPC ? ' vt-hero--pc' : '') + (isDeity ? ' vt-hero--deity' : '')}>
        <img className="vt-hero-rose" src={vtAsset('rosacea.svg')} alt="" aria-hidden="true" draggable="false" />
        {isPC ? <>{hero}{portrait}</> : <>{portrait}{hero}</>}
        {tools}
      </section>

      {c.placeholder && (
        <section className="vt-passages vt-passages--empty">
          <div className="vt-label">Em compilação</div>
          <p>{K.empty}</p>
        </section>
      )}

      {sections.length > 0 && (
        <section className="vt-passages">
          <VtIndex c={c} isPC={isPC} label={K.indexLabel(c)} sections={sections} active={active} onPick={pick} />

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
          <div className="vt-label">{isCampaign ? 'Ver também' : 'Ligados a ' + firstName}</div>
          <div className="vt-related-grid">
            {c.related.map((r, i) => (
              <a key={i} className="vt-related-cell" style={{ '--pane': vtRelatedColor(r) }} onClick={() => r.target && onNav(r.target)}>
                <span className="vt-related-tag">{r.tag}</span>
                {(() => {
                  // "Thale Vans Loupd'or (mentor)" → nome + papel em itálico embaixo
                  const m = /^(.*?)\s*\(([^)]+)\)\s*$/.exec(r.title || '');
                  return m
                    ? <><span className="vt-related-title">{m[1]}</span><span className="vt-related-note">{m[2]}</span></>
                    : <span className="vt-related-title">{r.title}</span>;
                })()}
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ── Card da galeria (vivo / Morto) ───────────────────────────────


// ── Estandartes das facções ─────────────────────────────────────
// Três modelos de bandeira (assets/vitral/estandarte-<k>): o brasão da facção é pintado no
// campo liso, recortado pela máscara '<k>-campo.png'. `box` = onde o brasão fica (em % do estandarte).
// Nos campos claros o brasão entra em "multiplicar", como tinta sobre o tecido.
const VT_BANNERS = {
  a: { label: 'Estandarte de guerra', box: [34, 27, 34, 40], paint: 'normal' },
  b: { label: 'Estandarte de vitral', box: [34, 24, 34, 49], paint: 'multiply' },
  c: { label: 'Flâmula',              box: [37, 20, 37, 42], paint: 'multiply' },
};

function VtBanner({ variant = 'a', url, name, className = '', sizes = '280px' }) {
  const b = VT_BANNERS[variant] || VT_BANNERS.a;
  const mask = `url('${vtAsset('estandarte-' + variant + '-campo.png')}')`;
  const [l, t, r, bt] = b.box;
  return (
    <div className={'vb vb--' + variant + ' ' + className}>
      <img className="vb-cloth" src={vtAsset('estandarte-' + variant + '.webp')}
        srcSet={vtAsset('estandarte-' + variant + '-sm.webp') + ' 480w, ' + vtAsset('estandarte-' + variant + '.webp') + ' 960w'}
        sizes={sizes} alt="" aria-hidden="true" draggable="false" />
      <div className="vb-field" style={{ WebkitMaskImage: mask, maskImage: mask, mixBlendMode: b.paint }}>
        <div className="vb-emblem" style={{ left: l + '%', top: t + '%', right: r + '%', bottom: bt + '%' }}>
          {url
            ? <img src={url} alt={name ? 'Brasão de ' + name : ''} draggable="false" />
            : <span className="vb-initial">{(name || '?').trim().charAt(0)}</span>}
        </div>
      </div>
    </div>
  );
}

// Brasões de facção: preenchem a janela centralizados (o editor pode reenquadrar pelo infobox.retrato)
const VT_FACTION_FRAMING = { x: 50, y: 45, z: 1, fit: 'preencher' };

// Card de facção (galeria de Casas): janela com a imagem da facção, carimbo e placa
function VitralFactionCard({ f, onClick, onEdit, isEditor }) {
  const url = useVtSlotUrl('faction-portrait-' + f.id);
  return (
    <article className="vt-card vf-card" onClick={onClick}>
      <VtGothicWindow frame={VT_FRAMES[0]} className="vt-card-arch" sizes="240px">
        {url
          ? <VtFramedImage url={url} framing={VT_FACTION_FRAMING} />
          : <div className="vf-crest"><span>{(f.name || '?').trim().charAt(0)}</span></div>}
      </VtGothicWindow>
      {f.stamp && <span className={'vt-badge vt-badge--stamp vt-badge--stamp-' + (f.stampClass || 'red') + ' vf-stamp'}>{f.stamp}</span>}
      <div className="vt-votive vf-votive">
        <span className="vt-votive-gem" aria-hidden="true" />
        <div className="vt-votive-name">{(f.name || '').trim()}</div>
        {f.alias && <div className="vt-votive-title">{f.alias}</div>}
      </div>
      {f.summary && <p className="vf-summary">{f.summary}</p>}
      {isEditor && <button className="vt-btn vt-card-edit" onClick={e => { e.stopPropagation(); onEdit(); }}>Editar</button>}
    </article>
  );
}

function VitralCard({ char, onClick, onEdit, isEditor }) {
  const dead = vtIsDead(char);
  const campaignShort = vtShortCampaign(char);
  const morte = vtRow(char, /^morte$/i);
  const sub = dead
    ? 'In memoriam' + (morte ? ' · † ' + morte : '')
    : [char.tag, campaignShort].filter(Boolean).join(' · ');

  const url = useVtSlotUrl('char-portrait-' + char.id);

  return (
    <article className={'vt-card' + (dead ? ' vt-card--dead' : '')} onClick={onClick}>
      <VtGothicWindow {...vtFrameFor(char)} className="vt-card-arch" sizes="240px">
        <VtFramedImage url={url} framing={vtFraming(char)} placeholder="Sem retrato" />
      </VtGothicWindow>
      <div className="vt-card-plaque">{char.name}</div>
      {sub && <div className="vt-card-sub">{sub}</div>}
      {isEditor && (
        <button className="vt-btn vt-card-edit" onClick={e => { e.stopPropagation(); onEdit(); }}>Editar</button>
      )}
    </article>
  );
}

// ── Card do panteão ──────────────────────────────────────────────
// A divindade na rosácea: a arte de destaque enquadrada; sem arte, o sigilo
// dela aceso no centro do vão, sobre vidro escuro. Moldura: a rosácea-relicário.
// Slot do vitral da divindade na galeria: 'deity-vitral-<id>' (image_slots / Storage media/slots).
const VT_DEITY_VITRAL_SLOT = 'deity-vitral-';

// Arquivo "vitral_<nome>_oval.png" → id da divindade. Nomes que não batem com o id vão aqui.
const VT_VITRAL_ALIASES = { 'raven-queen': 'senhora-da-rapina', 'rainha-dos-corvos': 'senhora-da-rapina' };
function vtVitralFileToId(fileName, ids) {
  const base = fileName.replace(/\.[^.]+$/, '').toLowerCase()
    .replace(/^vitral[_-]/, '').replace(/[_-](oval|catedral|roseta|circular)(?:[_-]\d+)?$/, '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const id = VT_VITRAL_ALIASES[base] || base;
  if (ids.includes(id)) return id;
  const loose = ids.find(x => x.replace(/-/g, '') === id.replace(/-/g, ''));
  return loose || null;
}

// Reduz para WebP (largura máx. 960) antes de enviar; os PNGs originais são pesados.
async function vtToWebp(file, maxW = 960) {
  const bmp = await createImageBitmap(file);
  const s = Math.min(1, maxW / bmp.width);
  const cv = document.createElement('canvas');
  cv.width = Math.round(bmp.width * s); cv.height = Math.round(bmp.height * s);
  cv.getContext('2d').drawImage(bmp, 0, 0, cv.width, cv.height);
  const blob = await new Promise(r => cv.toBlob(r, 'image/webp', 0.88));
  return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.webp', { type: 'image/webp' });
}

// Envio em lote dos vitrais (editores): escolhe vários arquivos, casa cada um com a divindade
// pelo nome e grava no slot 'deity-vitral-<id>' — a arte original do artigo não é tocada.
function VtVitralUploader({ deities, onClose }) {
  const ids = deities.map(d => d.id);
  const [rows, setRows] = React.useState([]);
  const [busy, setBusy] = React.useState(false);

  function pick(e) {
    const files = [...(e.target.files || [])];
    e.target.value = '';
    setRows(files.map(f => ({ file: f, id: vtVitralFileToId(f.name, ids), status: 'pronto' })));
  }
  async function send() {
    if (!window.ImageUpload) return;
    setBusy(true);
    const next = rows.slice();
    for (let i = 0; i < next.length; i++) {
      const r = next[i];
      if (!r.id || r.status === 'enviado') continue;
      next[i] = { ...r, status: 'enviando…' }; setRows(next.slice());
      try {
        const webp = await vtToWebp(r.file);
        const slot = VT_DEITY_VITRAL_SLOT + r.id;
        const u = await window.ImageUpload.uploadImage(webp, slot);
        window._imageSlotSet(slot, { u, s: 1, x: 0, y: 0 });
        next[i] = { ...r, status: 'enviado' };
      } catch (ex) {
        next[i] = { ...r, status: 'erro: ' + (ex.message || ex) };
      }
      setRows(next.slice());
    }
    setBusy(false);
  }
  const name = id => (deities.find(d => d.id === id) || {}).name;
  const matched = rows.filter(r => r.id).length;
  const missing = deities.filter(d => !rows.some(r => r.id === d.id));

  return (
    <div className="vt-uploader">
      <div className="vt-uploader-head">
        <strong>Vitrais da galeria</strong>
        <span>Arquivos no formato <code>vitral_nome_oval.png</code>. Ficam num campo próprio; a arte do artigo continua a mesma.</span>
      </div>
      <label className="vt-btn vt-btn--gold">
        Escolher arquivos
        <input type="file" accept="image/*" multiple hidden onChange={pick} disabled={busy} />
      </label>
      {rows.length > 0 && (
        <React.Fragment>
          <ul className="vt-uploader-list">
            {rows.map((r, i) => (
              <li key={i} className={r.id ? '' : 'is-miss'}>
                <span>{r.file.name}</span>
                <span>→ {r.id ? name(r.id) : 'sem divindade com esse nome'}</span>
                <em>{r.id ? r.status : ''}</em>
              </li>
            ))}
          </ul>
          {missing.length > 0 && <p className="vt-uploader-note">Sem arquivo: {missing.map(d => d.name).join(', ')}</p>}
          <div className="vt-uploader-actions">
            <button className="vt-btn vt-btn--gold" onClick={send} disabled={busy || !matched}>
              {busy ? 'Enviando…' : 'Enviar ' + matched + ' vitrais'}
            </button>
            <button className="vt-btn" onClick={onClose} disabled={busy}>Fechar</button>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

function VitralDeityCard({ deity, tone, shape, vitral, onClick }) {
  const url = useVtSlotUrl('deity-hero-' + deity.id);
  // vitral completo da divindade (slot próprio, separado da arte do artigo):
  // a moldura já faz parte da imagem, então entra sem espelho por cima.
  const vitralUrl = useVtSlotUrl(VT_DEITY_VITRAL_SLOT + deity.id);
  const vitralSrc = vitral ? vtAsset(vitral.file + '-sm.webp') : vitralUrl;
  const dominio = vtRow(deity, /^dom[ií]nio/i);
  const tier = tone || vtDeityTier(deity);
  return (
    <article className={'vt-card vt-deity-card vt-deity-card--' + tier} onClick={onClick}>
      {vitralSrc
        ? (
          <img className={'vt-deity-vitral vt-deity-vitral--card vt-deity-vitral--' + (vitral ? vitral.shape : 'catedral')}
            src={vitralSrc} alt={'Vitral de ' + deity.name} loading="lazy" draggable="false" />
        )
        : (<VtDeityFrame tier={tier} shape={shape} className="vt-rose-card" sizes="280px">
        {url
          ? <VtFramedImage url={url} framing={vtFraming(deity)} />
          : (
            <VtSigilAltar deity={deity} tier={tier} />
          )}
      </VtDeityFrame>)}
      {/* placa votiva: metal escuro com filete dourado, pontas em flecha e um vidro na cor do nível */}
      <div className="vt-votive">
        <span className="vt-votive-gem" aria-hidden="true" />
        <div className="vt-votive-name">{deity.name}</div>
        {deity.epithet && <div className="vt-votive-title">{deity.epithet}</div>}
      </div>
      {dominio && <div className="vt-card-sub">{dominio}</div>}
    </article>
  );
}


// ════════════════════════════════════════════════════════════════
// Artigo de divindade como altar (protótipo, #/deity-altar-teste)
// Topo: vitral + nome/título/frase + ficha em faixa. Corpo: texto corrido
// com capitular, Dogmas como tábua de mandamentos, relações divinas por
// tipo e os fiéis (personagens que citam a divindade).
// ════════════════════════════════════════════════════════════════
const VA_TIER_NAME = { tita: 'Titã', deus: 'Divindade', ascendido: 'Ascendido' };

// "Xathyr (inimigo declarado)" → grupo pela palavra entre parênteses
function vaRelGroup(r) {
  const note = ((/\(([^)]+)\)\s*$/.exec(r.title || '') || [])[1] || '').toLowerCase();
  if (/inimig|opost|rival|advers|contr[aá]/.test(note)) return 'Adversários';
  if (/criador|criadora|pai|m[ãa]e|origem|mestre|senhor/.test(note)) return 'Origem';
  if (/filh|cria[çc]|ascend|herdeir|servo|serva|seguidor/.test(note)) return 'Descendência';
  return 'Laços';
}
const VA_REL_ORDER = ['Origem', 'Laços', 'Descendência', 'Adversários'];

function VaRelated({ r, onNav }) {
  const m = /^(.*?)\s*\(([^)]+)\)\s*$/.exec(r.title || '');
  const name = m ? m[1] : r.title, note = m ? m[2] : '';
  const deityId = /^deity:(.+)$/.exec(r.target || '')?.[1];
  const d = deityId && Entities.deities[deityId];
  const vitral = useVtSlotUrl(VT_DEITY_VITRAL_SLOT + (deityId || '_'));
  return (
    <button className={'va-rel' + (d ? ' va-rel--deity' : '')} onClick={() => r.target && onNav(r.target)}>
      <span className="va-rel-art">
        {d && vitral ? <img src={vitral} alt="" draggable="false" />
          : d ? <span className="va-rel-sigil"><DeitySigilImage deity={d} size="card" /></span>
          : <span className="va-rel-tag">{r.tag}</span>}
      </span>
      <span className="va-rel-name">{name}</span>
      {note && <span className="va-rel-note">{note}</span>}
    </button>
  );
}

function VaFaithful({ c, onNav }) {
  const url = useVtSlotUrl('char-portrait-' + c.id);
  return (
    <button className="vh-soul va-faithful" onClick={() => onNav((c.tag === 'PC' ? 'character:' : 'npc:') + c.id)} title={c.name}>
      <VtGothicWindow frame={VT_FRAMES[0]} className="vh-soul-window" sizes="80px">
        <VtFramedImage url={url} framing={vtFraming(c)} placeholder="" />
      </VtGothicWindow>
      <span className="vh-soul-name">{c.name.split(' ')[0]}</span>
      <span className="va-faithful-role">{c.role || c.tag}</span>
    </button>
  );
}

function VitralDeityAltar({ c, onNav, isEditor, onEdit }) {
  const tier = vtDeityTier(c);
  const vitral = useVtSlotUrl(VT_DEITY_VITRAL_SLOT + c.id);
  const rows = (c.infobox?.rows || []).filter(r => r && r.k && (r.v || r.v === 0));
  const sections = c.placeholder ? [] : (c.sections || []);
  const dogmas = sections.filter(s => /dogma|mandamento|preceito/i.test(s.title || ''));
  const prose = sections.filter(s => !dogmas.includes(s));

  const groups = {};
  (c.related || []).forEach(r => { (groups[vaRelGroup(r)] = groups[vaRelGroup(r)] || []).push(r); });

  // fiéis: personagens que citam a divindade no papel ou na ficha
  const re = new RegExp('\\b' + (c.name || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
  const faithful = Object.values(Entities.characters || {}).filter(p => p && p.name &&
    (re.test(p.role || '') || (p.infobox?.rows || []).some(r => re.test(String(r.v || '')))));

  const epigraph = c.hero;

  return (
    <div className={'vt vt-article va va--' + tier}>
      <div className="vt-topbar">
        <nav className="vt-breadcrumb">
          <a onClick={() => onNav('pantheon')}>Panteão</a>
          <span className="vt-bc-sep" aria-hidden="true" />
          <span>{VA_TIER_NAME[tier]}</span>
          <span className="vt-bc-sep" aria-hidden="true" />
          <span className="vt-breadcrumb-current">{c.name}</span>
        </nav>
        <div className="vt-topbar-actions">
          {isEditor && <button className="vt-btn" onClick={onEdit}>Editar artigo</button>}
        </div>
      </div>

      <section className="va-hero">
        <div className="va-window">
          {vitral
            ? <img className="vt-deity-vitral va-vitral" src={vitral} alt={'Vitral de ' + c.name} draggable="false" />
            : <VtPortrait c={c} slotId={'deity-hero-' + c.id} rose fallback={<VtSigilAltar deity={c} tier={tier} />} />}
        </div>
        <div className="va-head">
          <div className="vt-label">{VA_TIER_NAME[tier]} · Panteão de Valiran</div>
          <h1 className="vt-h1">{c.name}</h1>
          {c.epithet && <div className="vt-epithet">{c.epithet}</div>}
          <VtDivider />
          {epigraph && <blockquote className="va-epigraph">“{epigraph}”</blockquote>}
          {rows.length > 0 && (
            <dl className="va-attrs">
              {rows.map((r, i) => (
                <div key={i} className={'va-attr' + (r.danger ? ' is-danger' : '')}>
                  <dt>{r.k}</dt>
                  <dd>{r.v}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </section>

      {prose.length > 0 && (
        <section className="va-body">
          {prose.map((s, i) => (
            <article key={i} className="va-prose">
              {(prose.length > 1 || !/descri/i.test(s.title || '')) && <h2 className="va-h2">{s.title}</h2>}
              {(s.paras || []).map((p, j) => <p key={j} className={i === 0 && j === 0 ? 'va-first' : ''}>{p}</p>)}
            </article>
          ))}
        </section>
      )}

      {dogmas.map((s, i) => (
        <section key={i} className="va-dogmas">
          <div className="va-tablet">
            <div className="vt-label va-tablet-label">{s.title}</div>
            <ol>
              {(s.paras || []).map((p, j) => (
                <li key={j}><span className="va-roman">{vtRoman(j + 1)}</span><span className="va-law">{p}</span></li>
              ))}
            </ol>
          </div>
        </section>
      ))}

      {Object.keys(groups).length > 0 && (
        <section className="va-section">
          <h2 className="va-h2 va-h2--center">Relações divinas</h2>
          <div className="va-rel-groups">
            {VA_REL_ORDER.filter(g => groups[g]).map(g => (
              <div key={g} className={'va-rel-group va-rel-group--' + g.toLowerCase()}>
                <div className="vt-label">{g}</div>
                <div className="va-rel-row">{groups[g].map((r, i) => <VaRelated key={i} r={r} onNav={onNav} />)}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {faithful.length > 0 && (
        <section className="va-section">
          <h2 className="va-h2 va-h2--center">Fiéis e ecos</h2>
          <p className="va-sub">Almas do Arquivo que carregam o nome de {c.name}.</p>
          <div className="va-faithful-row">{faithful.slice(0, 8).map(p => <VaFaithful key={p.id} c={p} onNav={onNav} />)}</div>
        </section>
      )}

      <footer className="vt-pantheon-foot va-foot">
        ✠ {VA_TIER_NAME[tier]} · Panteão de Valiran ✠
        <div className="vt-quote-src"><a onClick={() => onNav('pantheon')}>Voltar ao Panteão</a></div>
      </footer>
    </div>
  );
}

window.ogivePath     = ogivePath;
window.VitralArticle = VitralArticle;
window.VitralCard    = VitralCard;
window.VitralFactionCard = VitralFactionCard;
window.VitralDeityCard = VitralDeityCard;
window.VitralFramePicker = VitralFramePicker;
window.VT_FRAMES     = VT_FRAMES;
Object.assign(window, { VtBanner, VT_BANNERS, VT_FACTION_FRAMING, vtRoman, VtPortrait, VitralDeityAltar, VtVitralUploader, vtVitralFileToId, VtRoseWindow, VtGothicWindow, VtDivider, VtArchiveFrame, vtShortCampaign, vtRow, VtSigilEmblem, useVtSlotUrl, VtDeityFrame, VtSigilAltar, VtFramedImage, vtDeityTier, vtFraming });
