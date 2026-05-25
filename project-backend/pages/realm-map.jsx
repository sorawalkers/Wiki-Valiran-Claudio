// ============================================================
// Reinos & Potências — Mapa Interativo Hexagonal
// Porte do design handoff para o projeto com dados do Supabase.
// ============================================================

// ── Constants ──────────────────────────────────────────────
const RM_HEX_SIZE   = 36;
const RM_VIEW_W     = 1100;
const RM_VIEW_H     = 720;
const RM_ORIGIN_X   = 560;
const RM_ORIGIN_Y   = 340;
const RM_EXPAND_Q   = [-14, 14];
const RM_EXPAND_R   = [-9, 9];

const RM_STAT_KEYS = ['economia', 'exercito', 'faith', 'trade', 'magia', 'influence'];
const RM_STAT_META = {
  economia:  { label: 'Economia',   glyph: '⚒', short: 'ECO' },
  exercito:  { label: 'Exército',   glyph: '⚔', short: 'MIL' },
  faith:     { label: 'Fé',         glyph: '✝', short: 'FÉ'  },
  trade:     { label: 'Comércio',   glyph: '⚖', short: 'COM' },
  magia:     { label: 'Magia',      glyph: '✦', short: 'MAG' },
  influence: { label: 'Influência', glyph: '◈', short: 'INF' },
};
const RM_RESOURCE_GLYPHS = {
  mine: '⚒', farm: '☘', port: '⚓', forge: '⚙', lib: '☼', arcane: '✦',
};
const RM_CITY_KIND_LABELS = {
  capital: 'CAPITAL', fort: 'FORTE', port: 'PORTO', arcane: 'ARCANO', ruin: 'RUÍNA',
};
const RM_BIOME_LABEL = {
  plain: 'Planície', forest: 'Floresta', mountain: 'Montanha',
  desert: 'Deserto', swamp: 'Pântano', plateau: 'Planalto', tundra: 'Tundra',
};
const RM_DENSE_FORESTS = new Set(['1,-1','3,-1','2,0','-5,2','-5,3','-2,3','4,4']);

const RM_TOOLS = [
  { id: 'select',     icon: '◇', label: 'Selecionar',   hint: 'Clique em um reino para o dossiê.' },
  { id: 'paint',      icon: '⬢', label: 'Pintar hex',   hint: 'Atribuir um hex existente a outro reino.' },
  { id: 'addhex',     icon: '＋', label: 'Adicionar hex', hint: 'Estender o território do reino ativo.' },
  { id: 'removehex',  icon: '－', label: 'Remover hex',  hint: 'Tirar o hex do tabuleiro.' },
  { id: 'biome',      icon: '⌗', label: 'Bioma',         hint: 'Mudar o terreno de um hex.' },
  { id: 'city',       icon: '♔', label: 'Cidades',       hint: 'Mover ou criar capitais e cidades.' },
  { id: 'edit',       icon: '✎', label: 'Editar reino', hint: 'Nome, lema, descrição, stats.' },
  { id: 'newkingdom', icon: '✚', label: 'Novo reino',   hint: 'Criar uma nova potência.' },
];
const RM_BIOMES = [
  { id: 'plain',    label: 'Planície', glyph: '⌇' },
  { id: 'forest',   label: 'Floresta', glyph: '♣' },
  { id: 'mountain', label: 'Montanha', glyph: '⛰' },
  { id: 'desert',   label: 'Deserto',  glyph: '☄' },
  { id: 'swamp',    label: 'Pântano',  glyph: '~'  },
  { id: 'plateau',  label: 'Planalto', glyph: '═'  },
  { id: 'tundra',   label: 'Tundra',   glyph: '*'  },
];
const RM_CITY_KINDS = [
  { id: 'capital', label: 'Capital', glyph: '♔' },
  { id: 'fort',    label: 'Forte',   glyph: '⛫' },
  { id: 'port',    label: 'Porto',   glyph: '⚓' },
  { id: 'arcane',  label: 'Arcano',  glyph: '✦' },
];

// ── Hex math ────────────────────────────────────────────────
function rmQrToXY(q, r) {
  const w = Math.sqrt(3) * RM_HEX_SIZE;
  return [RM_ORIGIN_X + w * (q + r / 2), RM_ORIGIN_Y + 1.5 * RM_HEX_SIZE * r];
}

function rmHexPath(cx, cy, shrink = 0) {
  const r = RM_HEX_SIZE - shrink;
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 6;
    pts.push([(cx + r * Math.cos(a)).toFixed(2), (cy + r * Math.sin(a)).toFixed(2)]);
  }
  return `M ${pts.map(p => p.join(',')).join(' L ')} Z`;
}

function rmBiomeTint(biome) {
  switch (biome) {
    case 'mountain': return '#3a342a';
    case 'forest':   return '#1f2c1f';
    case 'desert':   return '#3a2e1c';
    case 'swamp':    return '#1f2820';
    case 'plateau':  return '#2c2418';
    case 'tundra':   return '#1e242a';
    default:         return '#2a2620';
  }
}

function rmSidePath(cx, cy) {
  const verts = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    verts.push([cx + RM_HEX_SIZE * Math.cos(a), cy + RM_HEX_SIZE * Math.sin(a)]);
  }
  const [se, s, sw] = [verts[2], verts[3], verts[4]];
  return `M ${se[0]} ${se[1]} L ${se[0]} ${se[1]+1} L ${s[0]} ${s[1]+1} L ${sw[0]} ${sw[1]+1} L ${sw[0]} ${sw[1]} L ${s[0]} ${s[1]} Z`;
}

function rmKingdomBorderEdges(realm) {
  const own = new Set(realm.hexes.map(h => `${h.q},${h.r}`));
  const neighbors = [[+1,-1],[+1,0],[0,+1],[-1,+1],[-1,0],[0,-1]];
  const edges = [];
  realm.hexes.forEach(h => {
    const [cx, cy] = rmQrToXY(h.q, h.r);
    for (let i = 0; i < 6; i++) {
      const [dq, dr] = neighbors[i];
      if (own.has(`${h.q+dq},${h.r+dr}`)) continue;
      const a1 = (Math.PI / 3) * i - Math.PI / 2;
      const a2 = (Math.PI / 3) * ((i + 1) % 6) - Math.PI / 2;
      edges.push([
        cx + RM_HEX_SIZE * Math.cos(a1), cy + RM_HEX_SIZE * Math.sin(a1),
        cx + RM_HEX_SIZE * Math.cos(a2), cy + RM_HEX_SIZE * Math.sin(a2),
      ]);
    }
  });
  return edges;
}

function rmDarkenHex(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const p = n => Math.max(0, Math.round(n)).toString(16).padStart(2, '0');
  return `#${p(r * 0.45)}${p(g * 0.45)}${p(b * 0.45)}`;
}

function rmDeepCopy(source) {
  return (source || []).map(r => ({
    ...r, hexes: [...(r.hexes || [])], cities: [...(r.cities || [])],
  }));
}

// ── ZoomPan wrapper ─────────────────────────────────────────
function RMZoomPan({ children }) {
  const { useState, useRef, useEffect } = React;
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const cx = (mx - pan.x) / zoom;
      const cy = (my - pan.y) / zoom;
      const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
      const nz = Math.min(3, Math.max(0.5, zoom * factor));
      setPan({ x: mx - cx * nz, y: my - cy * nz });
      setZoom(nz);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [zoom, pan]);

  function onMouseDown(e) {
    if (e.button !== 0 && e.button !== 1) return;
    if (e.target.closest('[data-hex-clickable]')) return;
    setDragging(true);
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  }
  function onMouseMove(e) {
    if (!dragging || !dragStart.current) return;
    setPan({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
  }
  function onMouseUp() { setDragging(false); dragStart.current = null; }

  return (
    <div ref={wrapRef} className="hx-zoompan"
      onMouseDown={onMouseDown} onMouseMove={onMouseMove}
      onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
      style={{ position: 'absolute', inset: 0, cursor: dragging ? 'grabbing' : 'grab',
        userSelect: 'none', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, top: 0,
        width: RM_VIEW_W, height: RM_VIEW_H, transformOrigin: '0 0',
        transform: `translate(${pan.x}px,${pan.y}px) scale(${zoom})`,
        transition: dragging ? 'none' : 'transform 0.05s linear' }}>
        {children}
      </div>
      <div className="hx-zoom-controls">
        <button className="hx-zoom-btn" onClick={() => setZoom(z => Math.min(3, z * 1.25))} title="Aproximar">＋</button>
        <button className="hx-zoom-btn" onClick={() => setZoom(z => Math.max(0.5, z / 1.25))} title="Afastar">−</button>
        <button className="hx-zoom-btn" onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} title="Centro">⊙</button>
        <div className="hx-zoom-readout">{Math.round(zoom * 100)}%</div>
      </div>
    </div>
  );
}

// ── Terrain silhouettes ─────────────────────────────────────
function RMTerrainOnTile({ x, y, biome, hkey, cursed }) {
  const mc = cursed ? '#3a0a0e' : 'rgba(14,16,28,0.78)';
  const tc = cursed ? '#3a0a0e' : 'rgba(8,18,16,0.85)';
  const tc2 = cursed ? '#5a1820' : 'rgba(20,40,30,0.85)';

  if (biome === 'mountain') {
    const peaks = [[-10, 9, 12], [-1, -9, 13], [10, 8, 11]];
    return (
      <g pointerEvents="none">
        {peaks.map(([dx, peakH, w], i) => (
          <path key={i}
            d={`M ${x+dx-w/2} ${y+9} L ${x+dx} ${y+peakH} L ${x+dx+w/2} ${y+9} Z`}
            fill={mc} />
        ))}
      </g>
    );
  }
  if (biome === 'forest') {
    const isDense = RM_DENSE_FORESTS.has(hkey);
    const trees = isDense
      ? [[-11,2],[-7,7],[-3,-3],[-2,9],[2,2],[3,-6],[5,8],[8,4],[9,-3],[11,7],[-6,-7],[0,-9]]
      : [[-9,3],[-3,7],[3,1],[9,5],[-5,-3],[4,-4],[0,9]];
    return (
      <g pointerEvents="none">
        {trees.map(([dx, dy], j) => {
          const tx = x + dx, ty = y + dy, c = j % 2 === 0 ? tc : tc2;
          return (
            <path key={j}
              d={`M ${tx} ${ty-5} L ${tx-3.2} ${ty+1} L ${tx-1.6} ${ty+1} L ${tx-3} ${ty+4} L ${tx+3} ${ty+4} L ${tx+1.6} ${ty+1} L ${tx+3.2} ${ty+1} Z`}
              fill={c} />
          );
        })}
      </g>
    );
  }
  if (biome === 'swamp') {
    return (
      <g pointerEvents="none" opacity="0.85">
        <ellipse cx={x-5} cy={y+3} rx="6" ry="1.8" fill="rgba(8,18,16,0.7)" />
        <ellipse cx={x+5} cy={y+6} rx="7" ry="2"   fill="rgba(8,18,16,0.7)" />
        <ellipse cx={x}   cy={y-3} rx="4" ry="1.4" fill="rgba(8,18,16,0.55)" />
        <ellipse cx={x+1} cy={y-2} rx="9" ry="1.4" fill="#aa8aaa" opacity="0.16" />
      </g>
    );
  }
  if (biome === 'desert') {
    return (
      <g pointerEvents="none" opacity="0.55">
        <path d={`M ${x-12} ${y+5} Q ${x-6} ${y-1} ${x+1} ${y+5}`}
          fill="none" stroke="rgba(0,0,0,0.45)" strokeWidth="0.8" />
        <path d={`M ${x-1} ${y+8} Q ${x+5} ${y+3} ${x+13} ${y+8}`}
          fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="0.7" />
      </g>
    );
  }
  if (biome === 'plateau') {
    return (
      <g pointerEvents="none" opacity="0.55">
        <path d={`M ${x-12} ${y+3} L ${x+12} ${y+3} L ${x+9} ${y-3} L ${x-9} ${y-3} Z`}
          fill="rgba(0,0,0,0.45)" />
      </g>
    );
  }
  if (biome === 'tundra') {
    return (
      <g pointerEvents="none" opacity="0.85">
        {[-7,1,8,-3,5,-10,11].map((dx, j) => (
          <circle key={j} cx={x+dx} cy={y+((j%2)?5:-3)} r="0.9" fill="rgba(220,220,228,0.85)" />
        ))}
      </g>
    );
  }
  return null;
}

// ── Ocean decorations ───────────────────────────────────────
function RMOceanDeco() {
  const ships = [
    { x: 110, y: 180, accent: '#9c86c4' },
    { x: 240, y: 540, accent: '#7aa6c4' },
    { x: 980, y: 580, accent: '#a83545' },
    { x: 940, y: 120, accent: '#7aa6c4' },
    { x: 80,  y: 480, accent: '#d4b87f' },
  ];
  const waves = [];
  for (let i = 0; i < 24; i++) {
    waves.push([60 + (i * 73) % (RM_VIEW_W - 120), 50 + ((i * 47) % (RM_VIEW_H - 100))]);
  }
  return (
    <g pointerEvents="none">
      {waves.map(([wx, wy], i) => (
        <path key={i} d={`M ${wx} ${wy} q 4 -3 8 0 q 4 3 8 0`}
          fill="none" stroke="#2a2840" strokeWidth="0.85" opacity="0.55" />
      ))}
      {ships.map((s, i) => (
        <g key={i} transform={`translate(${s.x} ${s.y})`} opacity="0.95">
          <path d="M -16 8 q 4 -2 8 0 q 4 2 8 0 q 4 -2 8 0"
            fill="none" stroke="#3a3858" strokeWidth="0.8" opacity="0.7" />
          <path d="M -10 2 Q 0 8 10 2 L 8 5 L -8 5 Z"
            fill="#1a1828" stroke="#3a3858" strokeWidth="0.5" />
          <line x1="0" y1="2" x2="0" y2="-12" stroke="#3a3858" strokeWidth="0.9" />
          <path d="M 0 -12 L 9 -2 L 0 0 Z" fill={s.accent} opacity="0.85" />
        </g>
      ))}
    </g>
  );
}

// ── Clouds ──────────────────────────────────────────────────
function RMCloudsDeco() {
  const clouds = [
    { x: 140, y: 290, w: 1.2 }, { x: 600, y: 60, w: 0.9 },
    { x: 920, y: 360, w: 1.0 }, { x: 380, y: 660, w: 1.1 }, { x: 820, y: 660, w: 0.85 },
  ];
  return (
    <g pointerEvents="none" opacity="0.55">
      {clouds.map((c, i) => (
        <g key={i} transform={`translate(${c.x} ${c.y}) scale(${c.w})`}>
          <ellipse cx="0"   cy="0"  rx="20" ry="6" fill="#8a8aa6" />
          <ellipse cx="-12" cy="-2" rx="9"  ry="5" fill="#8a8aa6" />
          <ellipse cx="14"  cy="-3" rx="11" ry="5" fill="#8a8aa6" />
          <ellipse cx="4"   cy="-5" rx="13" ry="4" fill="#a8a8c0" />
        </g>
      ))}
    </g>
  );
}

// ── City piece silhouettes ──────────────────────────────────
function RMCityPiece({ q, r, kind, critical, dim }) {
  const [x, y] = rmQrToXY(q, r);
  const sil = critical ? '#3a0a0e' : 'rgba(8,8,14,0.92)';
  const op  = dim ? 0.55 : 1;

  if (kind === 'capital') {
    return (
      <g pointerEvents="none" filter="url(#rm-shadow-strong)" style={{ opacity: op }}>
        <ellipse cx={x} cy={y+11} rx="14" ry="2.5" fill="#000" opacity="0.5" />
        <rect x={x-12} y={y+0} width="24" height="11" fill={sil} />
        <path d={`M ${x-12} ${y} L ${x-12} ${y-3} L ${x-9} ${y-3} L ${x-9} ${y} L ${x-6} ${y} L ${x-6} ${y-3} L ${x-3} ${y-3} L ${x-3} ${y} L ${x+3} ${y} L ${x+3} ${y-3} L ${x+6} ${y-3} L ${x+6} ${y} L ${x+9} ${y} L ${x+9} ${y-3} L ${x+12} ${y-3} L ${x+12} ${y} Z`} fill={sil} />
        <rect x={x-11} y={y-12} width="6" height="14" fill={sil} />
        <path d={`M ${x-11} ${y-12} L ${x-11} ${y-16} L ${x-9} ${y-16} L ${x-9} ${y-13} L ${x-7} ${y-13} L ${x-7} ${y-16} L ${x-5} ${y-16} L ${x-5} ${y-12} Z`} fill={sil} />
        <rect x={x+5} y={y-16} width="6" height="18" fill={sil} />
        <path d={`M ${x+5} ${y-16} L ${x+5} ${y-20} L ${x+7} ${y-20} L ${x+7} ${y-17} L ${x+9} ${y-17} L ${x+9} ${y-20} L ${x+11} ${y-20} L ${x+11} ${y-16} Z`} fill={sil} />
        <path d={`M ${x-2} ${y+11} L ${x-2} ${y+5} Q ${x} ${y+3} ${x+2} ${y+5} L ${x+2} ${y+11} Z`} fill="rgba(40,30,20,0.95)" />
      </g>
    );
  }
  if (kind === 'fort') {
    return (
      <g pointerEvents="none" filter="url(#rm-shadow)" style={{ opacity: op }}>
        <ellipse cx={x} cy={y+9} rx="11" ry="2.2" fill="#000" opacity="0.45" />
        <rect x={x-3} y={y-9} width="6" height="13" fill={sil} />
        <path d={`M ${x-3} ${y-9} L ${x-3} ${y-13} L ${x-1} ${y-13} L ${x-1} ${y-10} L ${x+1} ${y-10} L ${x+1} ${y-13} L ${x+3} ${y-13} L ${x+3} ${y-9} Z`} fill={sil} />
        <path d={`M ${x-10} ${y+4} L ${x-7} ${y} L ${x-4} ${y+4} Z`} fill={sil} />
        <rect x={x-10} y={y+4} width="6" height="3" fill={sil} />
        <path d={`M ${x+4} ${y+4} L ${x+7} ${y+1} L ${x+10} ${y+4} Z`} fill={sil} />
        <rect x={x+4} y={y+4} width="6" height="3" fill={sil} />
      </g>
    );
  }
  if (kind === 'port') {
    return (
      <g pointerEvents="none" filter="url(#rm-shadow)" style={{ opacity: op }}>
        <ellipse cx={x} cy={y+9} rx="12" ry="2.2" fill="#000" opacity="0.45" />
        <path d={`M ${x-10} ${y+2} Q ${x} ${y+9} ${x+10} ${y+2} L ${x+8} ${y+5} L ${x-8} ${y+5} Z`} fill={sil} />
        <line x1={x} y1={y+2} x2={x} y2={y-12} stroke={sil} strokeWidth="1.2" />
        <path d={`M ${x} ${y-12} L ${x+10} ${y-3} L ${x} ${y-1} Z`} fill={sil} />
        <rect x={x-4} y={y-2} width="8" height="4" fill={sil} />
      </g>
    );
  }
  if (kind === 'arcane') {
    const glow = critical ? '#c95560' : '#9c86c4';
    return (
      <g pointerEvents="none" filter="url(#rm-shadow)" style={{ opacity: op }}>
        <ellipse cx={x} cy={y+9} rx="9" ry="2" fill="#000" opacity="0.45" />
        <path d={`M ${x} ${y-14} L ${x+5} ${y+6} L ${x-5} ${y+6} Z`} fill={sil} />
        <circle cx={x} cy={y-2} r="2.4" fill={glow} opacity="0.9" />
        <circle cx={x} cy={y-2} r="4.5" fill="none" stroke={glow} strokeWidth="0.6" opacity="0.55" />
      </g>
    );
  }
  return null;
}

// ── Kingdom flag ────────────────────────────────────────────
function RMKingdomFlag({ realm, dim }) {
  if (realm.capitalQ == null || realm.capitalR == null) return null;
  const [capX, capY] = rmQrToXY(realm.capitalQ, realm.capitalR);
  const x = capX + 28;
  const y = capY - 28;
  const flagH = 22;
  const flagW = Math.max(82, realm.short.length * 7 + 36);
  const Icon = Sigil && Sigil[realm.sigil];
  return (
    <g pointerEvents="none" style={{ opacity: dim ? 0.55 : 1 }} filter="url(#rm-shadow-strong)">
      <line x1={x-flagW+12} y1={y-flagH/2-2} x2={x-flagW+12} y2={y+flagH/2+8}
        stroke="#1a160e" strokeWidth="1.2" />
      <path d={`M ${x-flagW} ${y-flagH/2} L ${x-flagW+7} ${y-flagH/2-4} L ${x-8} ${y-flagH/2-4} L ${x} ${y-flagH/2+4} L ${x-8} ${y+flagH/2-4} L ${x-flagW+7} ${y+flagH/2-4} L ${x-flagW} ${y+flagH/2} Z`}
        fill={realm.cursed ? '#3a0a0e' : realm.accent}
        stroke="#0a070d" strokeWidth="1.3" />
      <circle cx={x-flagW+22} cy={y-2} r="9"
        fill="rgba(14,13,16,0.55)" stroke="rgba(255,255,255,0.45)" strokeWidth="0.6" />
      <g style={{ color: '#f2eed8' }}>
        <foreignObject x={x-flagW+13} y={y-11} width="18" height="18">
          <div xmlns="http://www.w3.org/1999/xhtml"
            style={{ width:'18px', height:'18px', display:'grid', placeItems:'center', color:'inherit' }}>
            {Icon && <Icon style={{ width:'15px', height:'15px' }} />}
          </div>
        </foreignObject>
      </g>
      <text x={x-flagW+36} y={y+3}
        style={{ fontFamily:'Cinzel', fontSize:11, letterSpacing:'0.22em',
          fill:'#f2eed8', textTransform:'uppercase', fontWeight:600 }}>
        {realm.short}
      </text>
    </g>
  );
}

// ── Hover tooltip ───────────────────────────────────────────
function RMHoverTooltip({ hx, hy, biome, realm, editLabel }) {
  const w = 200;
  const h = realm ? 58 : 30;
  let tx = hx + 30;
  let ty = hy - 50;
  if (tx + w > RM_VIEW_W - 8) tx = hx - 30 - w;
  if (ty < 8) ty = hy + 30;
  return (
    <g pointerEvents="none">
      <line x1={hx} y1={hy} x2={tx + (tx > hx ? 0 : w)} y2={ty + h / 2}
        stroke="rgba(184,153,104,0.55)" strokeWidth="0.6" strokeDasharray="2 2" />
      <rect x={tx} y={ty} width={w} height={h}
        fill="rgba(14,13,16,0.97)" stroke={realm ? realm.accent : 'var(--gold-dim)'} strokeWidth="1.1" />
      <rect x={tx} y={ty} width="3" height={h} fill={realm ? realm.accent : 'var(--gold-dim)'} />
      {realm ? (
        <>
          <text x={tx+12} y={ty+17}
            style={{ fontFamily:'JetBrains Mono', fontSize:9, letterSpacing:'0.22em',
              fill: realm.accent, textTransform:'uppercase' }}>
            {realm.short}
          </text>
          <text x={tx+12} y={ty+33}
            style={{ fontFamily:'Cinzel', fontSize:12, letterSpacing:'0.05em', fill:'var(--foam)' }}>
            {realm.name.replace('Reino de ','').replace('Magocracia de ','').replace('República ','Rep. ').replace('† ','')}
          </text>
          <text x={tx+12} y={ty+49}
            style={{ fontFamily:'EB Garamond', fontStyle:'italic', fontSize:11, fill:'var(--foam-dim)' }}>
            {RM_BIOME_LABEL[biome] || biome}
          </text>
        </>
      ) : (
        <text x={tx+12} y={ty+20}
          style={{ fontFamily:'JetBrains Mono', fontSize:9.5, letterSpacing:'0.18em',
            fill:'var(--wine-bright)', textTransform:'uppercase' }}>
          {editLabel || 'Hex vazio'}
        </text>
      )}
    </g>
  );
}

// ── Rivers layer ────────────────────────────────────────────
function RMRiversLayer({ rivers }) {
  if (!rivers || rivers.length === 0) return null;
  return (
    <g pointerEvents="none">
      {rivers.map((rv, i) => {
        const pts = (rv.points || []).map(([q, r]) => rmQrToXY(q, r));
        if (pts.length < 2) return null;
        let d = `M ${pts[0][0]} ${pts[0][1]}`;
        for (let j = 1; j < pts.length; j++) {
          const [px, py] = pts[j - 1], [cx, cy] = pts[j];
          const mx = (px + cx) / 2, my = (py + cy) / 2;
          d += ` Q ${px} ${py}, ${mx} ${my}`;
        }
        d += ` T ${pts[pts.length-1][0]} ${pts[pts.length-1][1]}`;
        const bw = rv.width || 3;
        return (
          <g key={i}>
            <path d={d} fill="none" stroke="#0a0d14" strokeWidth={bw+1.4} strokeLinecap="round" opacity="0.95" />
            <path d={d} fill="none" stroke="#1a2a44" strokeWidth={bw} strokeLinecap="round" />
            <path d={d} fill="none" stroke="#5a8aa8" strokeWidth={Math.max(1, bw * 0.45)} strokeLinecap="round" opacity="0.85" />
            {(rv.delta || []).map(([dq, dr], k) => {
              const [dx, dy] = rmQrToXY(dq, dr);
              return (
                <g key={k} opacity="0.75">
                  <ellipse cx={dx} cy={dy} rx={RM_HEX_SIZE-10} ry={RM_HEX_SIZE-18} fill="#1a2a44" />
                  <ellipse cx={dx} cy={dy} rx={RM_HEX_SIZE-16} ry={RM_HEX_SIZE-24} fill="#5a8aa8" opacity="0.7" />
                </g>
              );
            })}
          </g>
        );
      })}
    </g>
  );
}

// ── Main SVG map renderer ───────────────────────────────────
function RealmMap({ realms, rivers, selected, onSelect, editMode, editState, onHexClick }) {
  const { useState, useMemo } = React;
  const [hover, setHover] = useState(null);

  const hexOwners = useMemo(() => {
    const map = {};
    realms.forEach(k => k.hexes.forEach(h => { map[`${h.q},${h.r}`] = k.id; }));
    return map;
  }, [realms]);

  const allHexEntries = useMemo(() => {
    const entries = [];
    realms.forEach(k => {
      k.hexes.forEach(h => {
        const [x, y] = rmQrToXY(h.q, h.r);
        entries.push({ q: h.q, r: h.r, biome: h.biome, realm: k, x, y });
      });
    });
    entries.sort((a, b) => a.y - b.y);
    return entries;
  }, [realms]);

  function handleHover(q, r, biome, realmId) {
    const [x, y] = rmQrToXY(q, r);
    setHover({ q, r, biome, realmId, x, y });
  }
  function clearHover() { setHover(null); }

  const totalTiles = realms.reduce((n, k) => n + k.hexes.length, 0);
  const hoverRealm = hover && hover.realmId ? realms.find(k => k.id === hover.realmId) : null;

  return (
    <RMZoomPan>
      <svg viewBox={`0 0 ${RM_VIEW_W} ${RM_VIEW_H}`}
        style={{ width: RM_VIEW_W, height: RM_VIEW_H, display: 'block' }}>
        <defs>
          <radialGradient id="rm-ocean" cx="50%" cy="50%" r="100%">
            <stop offset="0%"   stopColor="#0e0c1c" />
            <stop offset="100%" stopColor="#040310" />
          </radialGradient>
          <pattern id="rm-paper" width="48" height="48" patternUnits="userSpaceOnUse">
            <circle cx="3"  cy="3"  r="0.4" fill="#2a2840" opacity="0.55" />
            <circle cx="24" cy="24" r="0.3" fill="#2a2840" opacity="0.5"  />
            <circle cx="36" cy="12" r="0.3" fill="#2a2840" opacity="0.45" />
          </pattern>
          <pattern id="rm-cursed" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="#3a0a0e" strokeWidth="1.4" strokeOpacity="0.65" />
          </pattern>
          <pattern id="rm-topo" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 0 20 Q 10 14, 20 20 T 40 20" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.6" />
            <path d="M 0 36 Q 10 30, 20 36 T 40 36" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.6" />
          </pattern>
          <filter id="rm-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="1" dy="2" stdDeviation="1.2" floodOpacity="0.55" />
          </filter>
          <filter id="rm-shadow-strong" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="1.5" dy="2.5" stdDeviation="2" floodOpacity="0.65" />
          </filter>
        </defs>

        <rect width={RM_VIEW_W} height={RM_VIEW_H} fill="url(#rm-ocean)" />
        <rect width={RM_VIEW_W} height={RM_VIEW_H} fill="url(#rm-paper)" />

        <RMOceanDeco />

        {/* Empty hex placeholders in edit mode */}
        {editMode && (() => {
          const tiles = [];
          for (let q = RM_EXPAND_Q[0]; q <= RM_EXPAND_Q[1]; q++) {
            for (let r = RM_EXPAND_R[0]; r <= RM_EXPAND_R[1]; r++) {
              if (hexOwners[`${q},${r}`]) continue;
              const [ex, ey] = rmQrToXY(q, r);
              tiles.push(
                <g key={`${q},${r}`}>
                  <path data-hex-clickable
                    d={rmHexPath(ex, ey, 1.5)}
                    fill="rgba(168,53,69,0.05)"
                    stroke="rgba(168,53,69,0.45)" strokeWidth="0.7" strokeDasharray="2 3"
                    className="hx-tile edit-target"
                    onClick={() => onHexClick(q, r)}
                    onMouseEnter={() => handleHover(q, r, 'empty', null)}
                    onMouseLeave={clearHover}
                    style={{ cursor: 'crosshair' }} />
                  {editState && editState.tool === 'addhex' && (
                    <text x={ex} y={ey+3} textAnchor="middle"
                      style={{ fontSize:10, fill:'rgba(168,53,69,0.6)', pointerEvents:'none' }}>＋</text>
                  )}
                </g>
              );
            }
          }
          return tiles;
        })()}

        {/* Hex tiles */}
        {allHexEntries.map((e, i) => {
          const { q, r, biome, realm: k, x, y } = e;
          const isSelected = !editMode && k.id === selected;
          const isOther    = !editMode && selected && !isSelected;
          return (
            <g key={`${k.id}-tile-${i}`}
              style={{ opacity: isOther ? 0.6 : 1, filter: isOther ? 'saturate(0.35) brightness(0.92)' : 'none' }}>
              <path d={rmSidePath(x, y)} fill="rgba(0,0,0,0.5)" />
              <path d={rmHexPath(x, y, 0.3)} fill={rmBiomeTint(biome)} />
              <path data-hex-clickable
                d={rmHexPath(x, y, 0.3)}
                fill={k.cursed ? k.accentDeep : k.accent}
                fillOpacity={k.cursed ? 0.92 : 0.82}
                stroke={k.accent} strokeOpacity="0.85" strokeWidth="0.4"
                className={`hx-tile${editMode ? ' edit-target' : ''}`}
                onClick={() => { if (!editMode) onSelect(k.id); else onHexClick(q, r); }}
                onMouseEnter={() => handleHover(q, r, biome, k.id)}
                onMouseLeave={clearHover} />
              <path d={rmHexPath(x, y, 0.3)} fill="url(#rm-topo)" pointerEvents="none" />
              {k.cursed && (
                <path d={rmHexPath(x, y, 0.3)} fill="url(#rm-cursed)" pointerEvents="none" />
              )}
              <RMTerrainOnTile x={x} y={y} biome={biome} hkey={`${q},${r}`} cursed={k.cursed} />
            </g>
          );
        })}

        {/* Kingdom borders */}
        {realms.map(k => {
          const isSelected = !editMode && k.id === selected;
          const isOther    = !editMode && selected && !isSelected;
          const edges = rmKingdomBorderEdges(k);
          return (
            <g key={`border-${k.id}`} pointerEvents="none" style={{ opacity: isOther ? 0.55 : 1 }}>
              {edges.map(([x1, y1, x2, y2], i) => (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="#0a070d" strokeWidth={isSelected ? 2.2 : 1.6}
                  strokeOpacity="0.95" strokeLinecap="round" />
              ))}
              {isSelected && edges.map(([x1, y1, x2, y2], i) => (
                <line key={'g'+i} x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={k.accent} strokeWidth="6" strokeOpacity="0.32"
                  strokeLinecap="round" className="dio-selected-pulse" />
              ))}
            </g>
          );
        })}

        <RMRiversLayer rivers={rivers} />

        {/* City silhouettes */}
        {realms.map(k => {
          const isOther = !editMode && selected && k.id !== selected;
          const allCities = [
            ...(k.capitalQ != null ? [{ q: k.capitalQ, r: k.capitalR, kind: 'capital', name: k.capitalName, critical: false }] : []),
            ...(k.cities || []),
          ];
          return allCities.map((c, i) => (
            <RMCityPiece key={`${k.id}-c${i}`} q={c.q} r={c.r} kind={c.kind} critical={c.critical} dim={isOther} />
          ));
        })}

        {/* Kingdom flags */}
        {realms.map(k => {
          const isOther = !editMode && selected && selected !== k.id;
          return <RMKingdomFlag key={'flag-'+k.id} realm={k} dim={isOther} />;
        })}

        <RMCloudsDeco />

        {/* Hover tooltip */}
        {hover && hover.biome !== 'empty' && (
          <RMHoverTooltip hx={hover.x} hy={hover.y} biome={hover.biome} realm={hoverRealm} />
        )}
        {hover && hover.biome === 'empty' && editMode && (
          <RMHoverTooltip hx={hover.x} hy={hover.y} biome="empty" realm={null}
            editLabel={`Hex vazio · ${hover.q},${hover.r} · clique para adicionar`} />
        )}
      </svg>

      {/* Map corner labels */}
      <div className="hx-corner tl">Mapa político · 3ªE 1281</div>
      <div className="hx-corner tr">Top-down · {totalTiles} tiles</div>

      {/* Legend */}
      <div className="hx-legend">
        <div className="hx-legend-title">Peças</div>
        <div className="hx-legend-row"><span className="glyph">♔</span> Capital</div>
        <div className="hx-legend-row"><span className="glyph">⛫</span> Forte</div>
        <div className="hx-legend-row"><span className="glyph">⚓</span> Porto</div>
        <div className="hx-legend-row"><span className="glyph">✦</span> Arcano</div>
        <div className="hx-legend-row"><span className="glyph">▲</span> Montanha</div>
        <div className="hx-legend-row"><span className="glyph">♣</span> Floresta</div>
      </div>
    </RMZoomPan>
  );
}

// ── Stat bars ───────────────────────────────────────────────
function RMStatBars6({ stats, accent, layout }) {
  if (!stats) return null;
  if (layout === 'compact-grid') {
    return (
      <div className="hx-stat-grid">
        {RM_STAT_KEYS.map(key => {
          const s = stats[key] || { v: 0 };
          const meta = RM_STAT_META[key];
          return (
            <div key={key} className="hx-stat-mini">
              <div className="hx-stat-mini-head">
                <span className="hx-stat-mini-glyph" style={{ color: accent }}>{meta.glyph}</span>
                <span className="hx-stat-mini-label">{meta.short}</span>
                <span className="hx-stat-mini-v">{s.v}</span>
              </div>
              <div className="hx-stat-pips">
                {[1,2,3,4,5].map(n => (
                  <div key={n} className={`hx-pip${n <= s.v ? ' on' : ''}`}
                    style={n <= s.v ? { background: accent, borderColor: accent } : {}} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
  return (
    <div className="hx-stats">
      {RM_STAT_KEYS.map(key => {
        const s = stats[key] || { v: 0, note: '' };
        const meta = RM_STAT_META[key];
        return (
          <div key={key} className="hx-stat-row">
            <span className="hx-stat-glyph" style={{ color: accent }}>{meta.glyph}</span>
            <span className="hx-stat-label">{meta.label}</span>
            <div className="hx-stat-pips">
              {[1,2,3,4,5].map(n => (
                <div key={n} className={`hx-pip${n <= s.v ? ' on' : ''}`}
                  style={n <= s.v ? { background: accent, borderColor: accent } : {}} />
              ))}
            </div>
            <span className="hx-stat-v">{s.v}<span className="hx-stat-vmax">/5</span></span>
            {s.note && <div className="hx-stat-note">{s.note}</div>}
          </div>
        );
      })}
    </div>
  );
}

// ── Resources list ──────────────────────────────────────────
function RMResourcesList({ resources, accent }) {
  if (!resources || resources.length === 0) return <div style={{ color:'var(--foam-dim)', fontStyle:'italic', fontSize:12 }}>Nenhum recurso registrado.</div>;
  return (
    <div className="hx-resources">
      {resources.map((r, i) => (
        <div key={i} className={`hx-resource${r.critical ? ' critical' : ''}`}>
          <span className="hx-resource-glyph" style={{ color: r.critical ? 'var(--wine-bright)' : accent }}>
            {RM_RESOURCE_GLYPHS[r.type] || '◆'}
          </span>
          <div className="hx-resource-info">
            <div className="hx-resource-name">{r.name}</div>
            <div className="hx-resource-detail">{r.detail}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── City list ───────────────────────────────────────────────
function RMCityList({ realm, accent }) {
  const items = [
    ...(realm.capitalName ? [{ kind: 'capital', name: realm.capitalName, critical: false }] : []),
    ...(realm.cities || []).map(c => ({ kind: c.kind, name: c.name, critical: c.critical })),
  ];
  if (items.length === 0) return <div style={{ color:'var(--foam-dim)', fontStyle:'italic', fontSize:12 }}>Nenhuma cidade registrada.</div>;
  return (
    <div className="hx-cities">
      {items.map((c, i) => (
        <div key={i} className={`hx-city${c.critical ? ' critical' : ''}`}>
          <span className="hx-city-glyph" style={{ color: c.critical ? 'var(--wine-bright)' : accent }}>
            {c.kind === 'capital' ? '♔' : c.kind === 'port' ? '⚓' : c.kind === 'arcane' ? '✦' : c.kind === 'ruin' ? '✝' : '⛫'}
          </span>
          <div className="hx-city-info">
            <div className="hx-city-name">{c.name}</div>
            <div className="hx-city-kind">{RM_CITY_KIND_LABELS[c.kind] || c.kind.toUpperCase()}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Side panel ──────────────────────────────────────────────
function LeanRealmPanel({ realm }) {
  if (!realm) return (
    <aside className="hx-panel" style={{ display:'grid', placeItems:'center', color:'var(--foam-dim)', fontStyle:'italic', fontSize:13 }}>
      Selecione um reino
    </aside>
  );
  const Icon = Sigil && Sigil[realm.sigil];
  return (
    <aside className="hx-panel">
      <div className="hx-panel-accent" style={{
        background: `linear-gradient(90deg,${realm.accentDeep},${realm.accent},${realm.accentDeep})`
      }} />
      <header className="hx-panel-head">
        <div className="hx-panel-crest" style={{ color: realm.accent, borderColor: realm.accent }}>
          {Icon && <Icon />}
        </div>
        <div>
          <div className="hx-panel-eyebrow" style={{ color: realm.accent }}>{realm.eyebrow}</div>
          <h2 className="hx-panel-name">{realm.name}</h2>
          <p className="hx-panel-motto">{realm.motto}</p>
        </div>
      </header>
      <div className="hx-panel-body">
        {realm.desc && <p className="hx-panel-desc">{realm.desc}</p>}
        {realm.cursed && (
          <div className="hx-cursed">
            <div className="hx-cursed-head">⚠ Aviso arquivístico</div>
            <div className="hx-cursed-body">Fenda planar ativa. Ingresso desaconselhado sem proteção arcana de nível V ou superior.</div>
          </div>
        )}
        <section>
          <div className="hx-section-label">Estatísticas · 0–5</div>
          <RMStatBars6 stats={realm.stats6} accent={realm.accent} />
        </section>
        <section>
          <div className="hx-section-label">Recursos econômicos</div>
          <RMResourcesList resources={realm.resources} accent={realm.accent} />
        </section>
        <section>
          <div className="hx-section-label">Cidades</div>
          <RMCityList realm={realm} accent={realm.accent} />
        </section>
      </div>
    </aside>
  );
}

// ── Gallery card ────────────────────────────────────────────
function RealmGalleryCard({ realm, active, onClick }) {
  const Icon = Sigil && Sigil[realm.sigil];
  return (
    <article
      className={`hx-gcard${active ? ' active' : ''}${realm.cursed ? ' cursed' : ''}`}
      style={{ '--card-accent': realm.accent }}
      onClick={onClick}>
      <div className="hx-gcard-strip" style={{ background: realm.accent }} />
      <div className="hx-gcard-body">
        <div className="hx-gcard-head">
          <div className="hx-gcard-crest" style={{ color: realm.accent }}>
            {Icon && <Icon />}
          </div>
          <div className="hx-gcard-id">
            <div className="hx-gcard-eyebrow" style={{ color: realm.accent }}>{realm.short}</div>
            <h3 className="hx-gcard-name">{realm.name}</h3>
          </div>
        </div>
        <RMStatBars6 stats={realm.stats6} accent={realm.accent} layout="compact-grid" />
      </div>
    </article>
  );
}

// ── Edit toolbar ────────────────────────────────────────────
function RMEditToolbar({ editState, setEditState, realms, onExit, onEditRealm, onNewRealm }) {
  const setTool = id => setEditState(s => ({ ...s, tool: id }));
  return (
    <div className="hx-edit-toolbar">
      <header className="hx-edit-toolbar-head">
        <div>
          <div className="hx-edit-toolbar-eyebrow">Modo administrador</div>
          <div className="hx-edit-toolbar-title">Editor cartográfico</div>
        </div>
        <button className="hx-edit-exit" onClick={onExit}>✕ sair</button>
      </header>

      <div className="hx-edit-tools">
        {RM_TOOLS.map(t => (
          <button key={t.id}
            className={`hx-tool${editState.tool === t.id ? ' active' : ''}`}
            onClick={() => {
              if (t.id === 'edit')       { onEditRealm(editState.activeKingdom); return; }
              if (t.id === 'newkingdom') { onNewRealm(); return; }
              setTool(t.id);
            }}>
            <span className="hx-tool-icon">{t.icon}</span>
            <span className="hx-tool-label">{t.label}</span>
          </button>
        ))}
      </div>

      <div className="hx-edit-hint">
        {(RM_TOOLS.find(t => t.id === editState.tool) || {}).hint}
      </div>

      {['paint','addhex','removehex','city'].includes(editState.tool) && (
        <div className="hx-edit-section">
          <div className="hx-edit-section-label">Reino ativo</div>
          <div className="hx-edit-swatches">
            {realms.map(k => (
              <button key={k.id}
                className={`hx-swatch${editState.activeKingdom === k.id ? ' active' : ''}`}
                style={{ '--swatch-color': k.accent, '--swatch-bg': k.accentDeep }}
                onClick={() => setEditState(s => ({ ...s, activeKingdom: k.id }))}
                title={k.name}>
                <span className="hx-swatch-chip" style={{ background: k.accent, borderColor: k.accent }} />
                <span className="hx-swatch-label">{k.short}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {editState.tool === 'biome' && (
        <div className="hx-edit-section">
          <div className="hx-edit-section-label">Bioma</div>
          <div className="hx-edit-biomes">
            {RM_BIOMES.map(b => (
              <button key={b.id}
                className={`hx-biome-btn${editState.activeBiome === b.id ? ' active' : ''}`}
                onClick={() => setEditState(s => ({ ...s, activeBiome: b.id }))}>
                <span className="hx-biome-glyph">{b.glyph}</span>
                {b.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {editState.tool === 'city' && (
        <div className="hx-edit-section">
          <div className="hx-edit-section-label">Tipo</div>
          <div className="hx-edit-biomes">
            {RM_CITY_KINDS.map(c => (
              <button key={c.id}
                className={`hx-biome-btn${editState.activeCityKind === c.id ? ' active' : ''}`}
                onClick={() => setEditState(s => ({ ...s, activeCityKind: c.id }))}>
                <span className="hx-biome-glyph">{c.glyph}</span>
                {c.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="hx-edit-footer">
        <div className="hx-edit-footer-label">Atalhos</div>
        <div className="hx-shortcut"><kbd>1</kbd>–<kbd>8</kbd> trocar ferramenta</div>
        <div className="hx-shortcut"><kbd>Esc</kbd> sair do modo</div>
      </div>
    </div>
  );
}

// ── Edit kingdom modal ──────────────────────────────────────
function RMEditKingdomModal({ realm, onSave, onDelete, onClose }) {
  const { useState } = React;
  const [form, setForm] = useState({
    name:    realm ? realm.name    : '',
    short:   realm ? realm.short   : '',
    eyebrow: realm ? realm.eyebrow : '',
    motto:   realm ? realm.motto   : '',
    desc:    realm ? realm.desc    : '',
    accent:  realm ? realm.accent  : '#a83545',
  });
  const initStats = () => {
    const s = realm && realm.stats6 ? realm.stats6 : {};
    const result = {};
    RM_STAT_KEYS.forEach(k => { result[k] = { v: s[k] ? s[k].v : 0, note: s[k] ? (s[k].note || '') : '' }; });
    return result;
  };
  const [stats, setStats] = useState(initStats);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setStat = (k, v) => setStats(s => ({ ...s, [k]: { ...s[k], v: Number(v) } }));
  const setStatNote = (k, v) => setStats(s => ({ ...s, [k]: { ...s[k], note: v } }));

  return (
    <div className="hx-modal-overlay" onClick={onClose}>
      <div className="hx-modal" onClick={e => e.stopPropagation()}>
        <div className="hx-modal-head">
          <div>
            <div className="hx-modal-eyebrow">Editor · Geopolítica</div>
            <h2 className="hx-modal-title">{realm ? 'Editar Reino' : 'Novo Reino'}</h2>
          </div>
          <button className="hx-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="hx-modal-body">
          <div className="hx-modal-grid">
            <div className="hx-mf">
              <label>Nome</label>
              <input value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div className="hx-mf">
              <label>Sigla</label>
              <input value={form.short} onChange={e => set('short', e.target.value)} maxLength="10" />
            </div>
            <div className="hx-mf">
              <label>Eyebrow</label>
              <input value={form.eyebrow} onChange={e => set('eyebrow', e.target.value)} />
            </div>
            <div className="hx-mf">
              <label>Cor</label>
              <div className="hx-mcolor">
                <input type="color" value={form.accent} onChange={e => set('accent', e.target.value)} />
                <code>{form.accent}</code>
              </div>
            </div>
          </div>
          <div className="hx-mf">
            <label>Lema</label>
            <input value={form.motto} onChange={e => set('motto', e.target.value)} />
          </div>
          <div className="hx-mf">
            <label>Descrição</label>
            <textarea value={form.desc} rows="3" onChange={e => set('desc', e.target.value)} />
          </div>
          <div className="hx-modal-section-label">Estatísticas · arraste 0–5</div>
          <div className="hx-stat-sliders">
            {RM_STAT_KEYS.map(key => {
              const meta = RM_STAT_META[key];
              const s = stats[key] || { v: 0, note: '' };
              return (
                <div key={key} className="hx-stat-slider-row">
                  <span className="hx-stat-slider-glyph" style={{ color: form.accent }}>{meta.glyph}</span>
                  <span className="hx-stat-slider-label">{meta.label}</span>
                  <input type="range" min="0" max="5" step="1" value={s.v}
                    onChange={e => setStat(key, e.target.value)}
                    style={{ accentColor: form.accent }} />
                  <span className="hx-stat-slider-v">{s.v}/5</span>
                  <input className="hx-stat-slider-note" placeholder="anotação..."
                    value={s.note} onChange={e => setStatNote(key, e.target.value)} />
                </div>
              );
            })}
          </div>
        </div>
        <div className="hx-modal-foot">
          {realm && onDelete && (
            <button className="hx-btn-delete" onClick={() => onDelete(realm.id)}>Apagar reino</button>
          )}
          <div style={{ flex: 1 }} />
          <button className="hx-btn-cancel" onClick={onClose}>Cancelar</button>
          <button className="hx-btn-save" onClick={() => onSave({ ...form, stats6: stats })}
            style={{ background: form.accent, borderColor: form.accent }}>
            Salvar alterações
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Root page component ─────────────────────────────────────
function RealmMapPage({ onNav }) {
  const { useState, useEffect } = React;
  const { isEditor, isAdmin } = useAuth();
  const canEdit = isEditor || isAdmin;

  const [realms, setRealms] = useState(() => rmDeepCopy(Data.realms));
  const [rivers, setRivers] = useState(() => [...(Data.rivers || [])]);
  const [selected, setSelected] = useState(() => (Data.realms && Data.realms[0]) ? Data.realms[0].id : null);
  const [editMode, setEditMode] = useState(false);
  const [editState, setEditState] = useState({
    tool: 'select',
    activeKingdom: (Data.realms && Data.realms[0]) ? Data.realms[0].id : null,
    activeBiome: 'mountain',
    activeCityKind: 'fort',
  });
  const [modal, setModal] = useState(undefined);

  // Sync from DB on refresh event
  useEffect(() => {
    function onRefresh() {
      const copy = rmDeepCopy(Data.realms);
      setRealms(copy);
      setRivers([...(Data.rivers || [])]);
      setSelected(prev => prev || (copy.length > 0 ? copy[0].id : null));
      setEditState(s => ({
        ...s,
        activeKingdom: s.activeKingdom || (copy.length > 0 ? copy[0].id : null),
      }));
    }
    window.addEventListener('db-refresh', onRefresh);
    return () => window.removeEventListener('db-refresh', onRefresh);
  }, []);

  // Keyboard: Esc exits edit mode, 1–8 sets tool
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') { setEditMode(false); setModal(undefined); return; }
      if (!editMode) return;
      const idx = parseInt(e.key, 10) - 1;
      if (idx >= 0 && idx < RM_TOOLS.length) {
        const tool = RM_TOOLS[idx];
        if (tool.id === 'edit') {
          const r = realms.find(k => k.id === editState.activeKingdom);
          if (r) setModal(r);
        } else if (tool.id === 'newkingdom') {
          setModal(null);
        } else {
          setEditState(s => ({ ...s, tool: tool.id }));
        }
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [editMode, editState, realms]);

  function onHexClick(q, r) {
    if (!editMode || editState.tool === 'select') return;
    const key = `${q},${r}`;
    const ownerRealm = realms.find(k => k.hexes.some(h => h.q === q && h.r === r));
    const realmId = ownerRealm ? ownerRealm.id : null;

    if (editState.tool === 'paint' && realmId) {
      const hex = ownerRealm.hexes.find(h => h.q === q && h.r === r);
      const biome = hex ? hex.biome : 'plain';
      setRealms(prev => prev.map(k => {
        if (k.id === realmId) return { ...k, hexes: k.hexes.filter(h => `${h.q},${h.r}` !== key) };
        if (k.id === editState.activeKingdom) return { ...k, hexes: [...k.hexes, { id: null, q, r, biome }] };
        return k;
      }));
      DB.saveHex(editState.activeKingdom, q, r, biome).catch(console.error);

    } else if (editState.tool === 'addhex' && !realmId) {
      setRealms(prev => prev.map(k =>
        k.id === editState.activeKingdom ? { ...k, hexes: [...k.hexes, { id: null, q, r, biome: 'plain' }] } : k
      ));
      DB.saveHex(editState.activeKingdom, q, r, 'plain').catch(console.error);

    } else if (editState.tool === 'removehex' && realmId) {
      setRealms(prev => prev.map(k =>
        k.id === realmId ? { ...k, hexes: k.hexes.filter(h => `${h.q},${h.r}` !== key) } : k
      ));
      DB.removeHex(q, r).catch(console.error);

    } else if (editState.tool === 'biome' && realmId) {
      setRealms(prev => prev.map(k => {
        if (k.id !== realmId) return k;
        return { ...k, hexes: k.hexes.map(h => `${h.q},${h.r}` === key ? { ...h, biome: editState.activeBiome } : h) };
      }));
      DB.saveHex(realmId, q, r, editState.activeBiome).catch(console.error);

    } else if (editState.tool === 'city' && realmId) {
      const targetRealm = realms.find(k => k.id === realmId);
      if (!targetRealm) return;
      if (editState.activeCityKind === 'capital') {
        setRealms(prev => prev.map(k => k.id === realmId ? { ...k, capitalQ: q, capitalR: r } : k));
        DB.saveRealm({ ...targetRealm, capitalQ: q, capitalR: r }).catch(console.error);
      } else {
        const existing = targetRealm.cities.find(c => c.q === q && c.r === r && c.kind === editState.activeCityKind);
        if (existing) {
          setRealms(prev => prev.map(k =>
            k.id === realmId ? { ...k, cities: k.cities.filter(c => c !== existing) } : k
          ));
          if (existing.id) DB.removeCity(existing.id).catch(console.error);
        } else {
          const nc = { id: null, q, r, kind: editState.activeCityKind, name: 'Nova ' + editState.activeCityKind, critical: false };
          setRealms(prev => prev.map(k =>
            k.id === realmId ? { ...k, cities: [...k.cities, nc] } : k
          ));
          DB.saveCity({ ...nc, realmId }).catch(console.error);
        }
      }
    }
  }

  async function handleSaveRealm(formData) {
    const isNew = !modal || !modal.id;
    const slug = isNew
      ? (formData.short || 'novo').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now()
      : modal.slug;
    const data = {
      id:          isNew ? undefined : modal.id,
      slug,
      name:        formData.name,
      short:       formData.short,
      eyebrow:     formData.eyebrow,
      motto:       formData.motto,
      desc:        formData.desc,
      accent:      formData.accent,
      accentDeep:  isNew ? rmDarkenHex(formData.accent) : modal.accentDeep,
      cursed:      modal ? (modal.cursed || false) : false,
      capitalQ:    modal ? modal.capitalQ : null,
      capitalR:    modal ? modal.capitalR : null,
      capitalName: modal ? modal.capitalName : null,
      sigil:       modal ? (modal.sigil || 'Tome') : 'Tome',
      resources:   modal ? (modal.resources || []) : [],
      sort_order:  isNew ? realms.length : (modal.sort_order || 0),
      stats6:      formData.stats6,
    };
    try {
      await DB.saveRealm(data);
      setModal(undefined);
    } catch (err) {
      console.error('Erro ao salvar reino:', err);
    }
  }

  async function handleDeleteRealm(id) {
    try {
      await DB.deleteRealm(id);
      setModal(undefined);
      if (selected === id) setSelected(realms.find(k => k.id !== id)?.id || null);
    } catch (err) {
      console.error('Erro ao apagar reino:', err);
    }
  }

  const selectedRealm = realms.find(k => k.id === selected) || realms[0] || null;

  return (
    <>
      <div className="hx-page">
        {/* Header */}
        <header className="hx-header">
          <div className="hx-header-l">
            <div className="hx-eyebrow">Geopolítica · Reinos &amp; Potências</div>
            <h1 className="hx-title">Reinos &amp; Potências</h1>
            <p className="hx-lede">
              Mapa político do continente de Valiran · Terceira Era, ano 1281
            </p>
          </div>
          <div className="hx-header-r">
            <span className="hx-volume-tag">Vol. V</span>
            {canEdit && (
              <button
                className={`hx-edit-toggle${editMode ? ' active' : ''}`}
                onClick={() => setEditMode(m => !m)}>
                <span className="glyph">{editMode ? '◉' : '✎'}</span>
                {editMode ? 'Sair da edição' : 'Editar mapa'}
                <span className="hx-admin-pill">ADMIN</span>
              </button>
            )}
          </div>
        </header>

        {/* Main: map + panel */}
        <div className="hx-main">
          <div className="hx-map-wrap">
            <RealmMap
              realms={realms}
              rivers={rivers}
              selected={selected}
              onSelect={setSelected}
              editMode={editMode}
              editState={editState}
              onHexClick={onHexClick} />

            {editMode && <div className="hx-edit-overlay-bg" />}
            {editMode && <div className="hx-edit-banner">Modo de edição · administrador</div>}
            {editMode && (
              <RMEditToolbar
                editState={editState}
                setEditState={setEditState}
                realms={realms}
                onExit={() => setEditMode(false)}
                onEditRealm={id => { const r = realms.find(k => k.id === id); if (r) setModal(r); }}
                onNewRealm={() => setModal(null)} />
            )}
          </div>
          <LeanRealmPanel realm={selectedRealm} />
        </div>

        {/* Gallery */}
        <div className="hx-gallery">
          {realms.map(k => (
            <RealmGalleryCard
              key={k.id}
              realm={k}
              active={k.id === selected}
              onClick={() => setSelected(k.id)} />
          ))}
          {realms.length === 0 && (
            <div style={{ gridColumn:'1/-1', textAlign:'center', color:'var(--foam-dim)',
              fontStyle:'italic', fontSize:14, padding:'24px 0' }}>
              A carregar reinos… Execute o schema e seed no Supabase para popular o mapa.
            </div>
          )}
        </div>
      </div>

      {/* Edit modal (rendered outside hx-page to avoid stacking context issues) */}
      {modal !== undefined && (
        <RMEditKingdomModal
          realm={modal}
          onSave={handleSaveRealm}
          onDelete={modal ? handleDeleteRealm : undefined}
          onClose={() => setModal(undefined)} />
      )}
    </>
  );
}
