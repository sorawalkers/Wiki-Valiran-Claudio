// Per-deity sigils — each registered under the deity's slug ID.
// Falls back to the generic Sigil[type] keys when no per-deity match exists.
// Style: viewBox 0 0 64 64, currentColor, faint outer ring at r=28, 1.4px stroke,
// fills at 0.85–0.9 opacity, deep-ink accents in #0e0d10.

(function () {
  const Frame = () => (
    <circle cx="32" cy="32" r="28" strokeOpacity="0.4" />
  );
  const InnerFrame = () => (
    <circle cx="32" cy="32" r="22" strokeOpacity="0.18" />
  );

  const DeitySigils = {

    // ════════════════════════════════════════════════════════════════
    // TITÃS — primordial
    // ════════════════════════════════════════════════════════════════

    // ALARA — Titã da Vida — duas mãos pousadas uma sobre a outra, folhas e raízes
    alara: ({ className, style }) => (
      <svg className={className} style={style} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4">
        <Frame />
        {/* Leaves arcing in from sides */}
        <path d="M10 26 Q14 16 22 18 Q22 24 16 26 Z" fill="currentColor" fillOpacity="0.55" />
        <path d="M54 26 Q50 16 42 18 Q42 24 48 26 Z" fill="currentColor" fillOpacity="0.55" />
        <path d="M14 22 L20 24 M50 22 L44 24" strokeWidth="0.8" strokeOpacity="0.6" />
        {/* Upper hand (palm down, narrower) */}
        <path d="M22 28 Q22 25 25 25 L39 25 Q42 25 42 28 L42 31 Q40 33 32 33 Q24 33 22 31 Z" fill="currentColor" fillOpacity="0.9" />
        {/* Lower hand (cupped, wider) */}
        <path d="M16 36 Q16 33 19 33 L45 33 Q48 33 48 36 L48 40 Q45 44 32 44 Q19 44 16 40 Z" fill="currentColor" fillOpacity="0.9" />
        {/* Finger separations on lower hand */}
        <path d="M22 33 L22 38 M28 33 L28 38 M36 33 L36 38 M42 33 L42 38" strokeWidth="0.6" stroke="#0e0d10" strokeOpacity="0.5" />
        {/* Roots descending */}
        <path d="M22 46 Q19 50 17 56 M28 46 L27 56 M36 46 L37 56 M42 46 Q45 50 47 56 M32 46 L32 55" strokeWidth="1" />
        <path d="M20 52 L18 54 M44 52 L46 54 M30 50 L31 53 M34 50 L33 53" strokeWidth="0.6" />
      </svg>
    ),

    // VOFUREON — Titã da Luz — olho central, anéis de escrita celestial dourados
    vofureon: ({ className, style }) => (
      <svg className={className} style={style} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4">
        <Frame />
        {/* Outer ring of celestial marks */}
        <circle cx="32" cy="32" r="26" strokeOpacity="0.5" strokeWidth="0.8" />
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(a => {
          const r = 26;
          const x = 32 + r * Math.cos((a - 90) * Math.PI / 180);
          const y = 32 + r * Math.sin((a - 90) * Math.PI / 180);
          return <circle key={`o${a}`} cx={x} cy={y} r="0.9" fill="currentColor" />;
        })}
        {/* Middle ring with tick marks */}
        <circle cx="32" cy="32" r="20" strokeOpacity="0.45" strokeWidth="0.8" />
        {[15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345].map(a => {
          const r1 = 19, r2 = 21;
          const x1 = 32 + r1 * Math.cos((a - 90) * Math.PI / 180);
          const y1 = 32 + r1 * Math.sin((a - 90) * Math.PI / 180);
          const x2 = 32 + r2 * Math.cos((a - 90) * Math.PI / 180);
          const y2 = 32 + r2 * Math.sin((a - 90) * Math.PI / 180);
          return <line key={`m${a}`} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="0.8" />;
        })}
        {/* Inner ring */}
        <circle cx="32" cy="32" r="14" strokeOpacity="0.7" strokeWidth="0.8" />
        {/* Eye almond shape */}
        <path d="M18 32 Q32 22 46 32 Q32 42 18 32 Z" fill="currentColor" fillOpacity="0.92" />
        {/* Pupil */}
        <circle cx="32" cy="32" r="4" fill="#0e0d10" />
        <circle cx="33" cy="31" r="1.2" fill="currentColor" />
      </svg>
    ),

    // LAMIDRIEL — Titã da Bondade — espada com gema azul no cabo, oito asas atrás
    lamidriel: ({ className, style }) => (
      <svg className={className} style={style} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4">
        <Frame />
        {/* Wing spreads behind (8 wings as feathered arcs) */}
        <g fillOpacity="0.45" fill="currentColor" strokeOpacity="0.55">
          {/* Left side wings */}
          <path d="M30 22 Q14 22 10 30 Q18 28 28 30 Z" />
          <path d="M30 28 Q12 30 8 38 Q16 36 28 38 Z" />
          <path d="M30 34 Q14 38 12 46 Q20 44 30 44 Z" />
          <path d="M30 40 Q18 46 18 52 Q24 50 30 50 Z" />
          {/* Right side wings */}
          <path d="M34 22 Q50 22 54 30 Q46 28 36 30 Z" />
          <path d="M34 28 Q52 30 56 38 Q48 36 36 38 Z" />
          <path d="M34 34 Q50 38 52 46 Q44 44 34 44 Z" />
          <path d="M34 40 Q46 46 46 52 Q40 50 34 50 Z" />
        </g>
        {/* Wing feather lines */}
        <path d="M14 28 L26 30 M12 34 L26 36 M16 42 L28 42 M22 48 L28 48 M50 28 L38 30 M52 34 L38 36 M48 42 L36 42 M42 48 L36 48" strokeWidth="0.6" strokeOpacity="0.6" />
        {/* Sword - vertical, pommel up */}
        <path d="M32 14 L32 50" strokeWidth="2.6" stroke="currentColor" />
        {/* Crossguard */}
        <path d="M24 22 L40 22" strokeWidth="2.4" stroke="currentColor" />
        {/* Blade tip */}
        <path d="M30 50 L32 54 L34 50 Z" fill="currentColor" />
        {/* Pommel + grip area */}
        <rect x="30" y="14" width="4" height="8" fill="currentColor" />
        {/* Blue gem at hilt */}
        <circle cx="32" cy="18" r="2.4" fill="#3b6db8" stroke="currentColor" strokeWidth="0.6" />
        <circle cx="31.3" cy="17.3" r="0.7" fill="#a8c4ec" />
      </svg>
    ),

    // PROTUS — Titã da Ordem — hexágono alongado índigo, pontas sup/inf
    protus: ({ className, style }) => (
      <svg className={className} style={style} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4">
        <Frame />
        {/* Elongated hexagon (taller than wide, points top & bottom) */}
        <path d="M32 8 L46 22 L46 42 L32 56 L18 42 L18 22 Z" fill="#3a3678" fillOpacity="0.92" stroke="currentColor" strokeWidth="1.6" />
        {/* Inner echo */}
        <path d="M32 16 L40 24 L40 40 L32 48 L24 40 L24 24 Z" fill="none" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.7" />
        {/* Central horizontal mark */}
        <path d="M28 32 L36 32" strokeWidth="1" />
        {/* Equilibrium dot */}
        <circle cx="32" cy="32" r="1.6" fill="currentColor" />
      </svg>
    ),

    // RAEGRAR — Titã do Caos — anel dos quatro elementos primordiais
    raegrar: ({ className, style }) => (
      <svg className={className} style={style} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4">
        <Frame />
        {/* Outer ring */}
        <circle cx="32" cy="32" r="22" strokeWidth="2.2" stroke="currentColor" />
        {/* Quadrant dividers */}
        <path d="M32 10 L32 22 M32 42 L32 54 M10 32 L22 32 M42 32 L54 32" strokeWidth="0.8" strokeOpacity="0.55" />
        {/* Element symbols around the ring */}
        {/* Top: Air — three curved lines */}
        <g>
          <path d="M26 16 Q30 14 34 16 M26 19 Q30 17 34 19" strokeWidth="1.2" />
          <path d="M28 21 L36 21" strokeWidth="1.2" />
        </g>
        {/* Right: Fire — flame */}
        <path d="M44 28 Q42 30 44 32 Q47 32 48 30 Q49 27 47 25 Q48 27 47 28 Q46 26 45 27 Q45 28 44 28 Z" fill="currentColor" fillOpacity="0.85" />
        {/* Bottom: Earth — triangle */}
        <path d="M28 44 L36 44 L32 50 Z" fill="currentColor" fillOpacity="0.85" />
        <path d="M30 46 L34 46" strokeWidth="0.6" stroke="#0e0d10" />
        {/* Left: Water — wave */}
        <path d="M16 28 Q19 26 22 28 Q19 30 16 28 Z M16 31 Q19 29 22 31 Q19 33 16 31 Z" fill="currentColor" fillOpacity="0.85" />
        {/* Cracks suggesting fragmentation */}
        <path d="M28 22 L26 24 L28 26 M40 38 L42 40 L40 42" strokeWidth="0.6" strokeOpacity="0.5" />
        {/* Center hollow */}
        <circle cx="32" cy="32" r="3" fill="none" stroke="currentColor" strokeWidth="0.8" />
      </svg>
    ),

    // FYRIA — Titã da Maldade — crânio de cavalo com chifres vermelhos curvados
    fyria: ({ className, style }) => (
      <svg className={className} style={style} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4">
        <Frame />
        {/* Curved horns (dark red), curving downward */}
        <path d="M18 18 Q10 22 12 32 Q14 38 18 40" stroke="#7a1f1f" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M46 18 Q54 22 52 32 Q50 38 46 40" stroke="#7a1f1f" strokeWidth="3" strokeLinecap="round" fill="none" />
        {/* Horn tip darkening */}
        <circle cx="18" cy="40" r="1.5" fill="#3a0d0d" />
        <circle cx="46" cy="40" r="1.5" fill="#3a0d0d" />
        {/* Skull main shape — elongated equine */}
        <path d="M24 18 Q22 24 22 30 L20 34 Q20 40 24 44 L28 52 Q32 56 36 52 L40 44 Q44 40 44 34 L42 30 Q44 24 42 18 Q38 14 32 14 Q26 14 24 18 Z" fill="currentColor" fillOpacity="0.92" />
        {/* Eye sockets — slanted, dark */}
        <path d="M25 26 Q28 24 30 27 Q28 30 25 28 Z" fill="#0e0d10" />
        <path d="M39 26 Q36 24 34 27 Q36 30 39 28 Z" fill="#0e0d10" />
        {/* Nasal cavity */}
        <path d="M30 36 Q32 32 34 36 L34 42 Q32 44 30 42 Z" fill="#0e0d10" />
        {/* Teeth line */}
        <path d="M28 50 L29 52 L31 50 L33 52 L35 50 L36 52" strokeWidth="0.8" stroke="#0e0d10" />
        {/* Jaw line */}
        <path d="M28 48 L36 48" strokeWidth="0.8" stroke="#0e0d10" strokeOpacity="0.6" />
      </svg>
    ),

    // ════════════════════════════════════════════════════════════════
    // ASCENDIDOS & ESPECIAIS
    // ════════════════════════════════════════════════════════════════

    // ESMIR — três lanças cruzadas em escudo solar
    esmir: ({ className, style }) => (
      <svg className={className} style={style} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4">
        <Frame />
        {/* Solar shield disc */}
        <circle cx="32" cy="32" r="20" fill="currentColor" fillOpacity="0.85" />
        {/* Solar rays around shield */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(a => {
          const r1 = 21, r2 = 26;
          const x1 = 32 + r1 * Math.cos((a - 90) * Math.PI / 180);
          const y1 = 32 + r1 * Math.sin((a - 90) * Math.PI / 180);
          const x2 = 32 + r2 * Math.cos((a - 90) * Math.PI / 180);
          const y2 = 32 + r2 * Math.sin((a - 90) * Math.PI / 180);
          return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="1.4" />;
        })}
        {/* Shield rim */}
        <circle cx="32" cy="32" r="20" fill="none" stroke="#0e0d10" strokeWidth="0.8" strokeOpacity="0.4" />
        {/* Three crossed spears - vertical + two diagonals */}
        <g stroke="#0e0d10" strokeWidth="1.6" strokeLinecap="round">
          <line x1="32" y1="14" x2="32" y2="50" />
          <line x1="18" y1="22" x2="46" y2="42" />
          <line x1="46" y1="22" x2="18" y2="42" />
        </g>
        {/* Spear tips */}
        <g fill="#0e0d10">
          <path d="M30 14 L32 10 L34 14 Z" />
          <path d="M18 22 L14 20 L17 25 Z" />
          <path d="M46 22 L50 20 L47 25 Z" />
        </g>
        {/* Center binding */}
        <circle cx="32" cy="32" r="2.2" fill="#0e0d10" />
      </svg>
    ),

    // NAOMI — face dracônica dual: metade dourada, metade vermelha
    naomi: ({ className, style }) => (
      <svg className={className} style={style} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4">
        <Frame />
        {/* Background split */}
        <clipPath id="naomi-l"><rect x="0" y="0" width="32" height="64" /></clipPath>
        <clipPath id="naomi-r"><rect x="32" y="0" width="32" height="64" /></clipPath>
        {/* Dragon head silhouette: snout pointing down, horns up */}
        <g clipPath="url(#naomi-l)">
          {/* Gold half */}
          <path d="M32 12 L24 14 L18 18 L16 24 L18 30 L22 36 L26 44 L30 52 L32 56 Z" fill="#c79a3d" fillOpacity="0.95" />
          {/* Horn */}
          <path d="M22 12 L14 8 L18 18 Z" fill="#c79a3d" />
          {/* Eye */}
          <circle cx="22" cy="26" r="1.8" fill="#0e0d10" />
          {/* Scale ridges */}
          <path d="M20 32 L22 33 M22 38 L24 39 M24 44 L26 45" stroke="#0e0d10" strokeWidth="0.6" />
          {/* Jaw / fang */}
          <path d="M22 46 L24 50 L26 47" stroke="#0e0d10" strokeWidth="0.8" fill="none" />
        </g>
        <g clipPath="url(#naomi-r)">
          {/* Red half (mirrored) */}
          <path d="M32 12 L40 14 L46 18 L48 24 L46 30 L42 36 L38 44 L34 52 L32 56 Z" fill="#8a2020" fillOpacity="0.95" />
          {/* Horn */}
          <path d="M42 12 L50 8 L46 18 Z" fill="#8a2020" />
          {/* Eye */}
          <circle cx="42" cy="26" r="1.8" fill="#0e0d10" />
          {/* Scale ridges */}
          <path d="M44 32 L42 33 M42 38 L40 39 M40 44 L38 45" stroke="#0e0d10" strokeWidth="0.6" />
          {/* Jaw / fang */}
          <path d="M42 46 L40 50 L38 47" stroke="#0e0d10" strokeWidth="0.8" fill="none" />
        </g>
        {/* Center dividing line / nasal ridge */}
        <line x1="32" y1="12" x2="32" y2="56" stroke="#0e0d10" strokeWidth="1" strokeOpacity="0.7" />
        {/* Subtle outline */}
        <path d="M32 12 L24 14 L18 18 L16 24 L18 30 L22 36 L26 44 L30 52 L32 56 L34 52 L38 44 L42 36 L46 30 L48 24 L46 18 L40 14 Z" fill="none" stroke="#0e0d10" strokeWidth="0.6" strokeOpacity="0.5" />
      </svg>
    ),

    // ATHYS — Julgadora de Desafios — duas espadas cruzadas + faixa de promessa
    athys: ({ className, style }) => (
      <svg className={className} style={style} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4">
        <Frame />
        {/* Crossed swords */}
        <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <line x1="14" y1="14" x2="50" y2="50" />
          <line x1="50" y1="14" x2="14" y2="50" />
        </g>
        {/* Sword tips */}
        <g fill="currentColor">
          <path d="M14 14 L10 12 L12 16 Z" />
          <path d="M50 14 L54 12 L52 16 Z" />
        </g>
        {/* Crossguards */}
        <g stroke="currentColor" strokeWidth="1.8">
          <line x1="20" y1="44" x2="28" y2="52" />
          <line x1="36" y1="52" x2="44" y2="44" />
        </g>
        {/* Oath ribbon across center */}
        <path d="M14 32 L50 32" stroke="currentColor" strokeWidth="3" />
        <path d="M14 32 L50 32" stroke="#0e0d10" strokeWidth="1" strokeDasharray="2 2" />
        {/* Seal at intersection */}
        <circle cx="32" cy="32" r="4" fill="currentColor" />
        <circle cx="32" cy="32" r="1.6" fill="#0e0d10" />
      </svg>
    ),

    // AYAEL — anjo aprisionado — corrente quebrada com pena
    ayael: ({ className, style }) => (
      <svg className={className} style={style} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4">
        <Frame />
        {/* Feather (single, drooping) */}
        <path d="M32 12 Q28 22 30 32 Q32 36 34 32 Q36 22 32 12 Z" fill="currentColor" fillOpacity="0.85" />
        <path d="M30 18 L34 18 M29 22 L35 22 M28.5 26 L35.5 26 M28.5 30 L35.5 30" stroke="#0e0d10" strokeWidth="0.5" strokeOpacity="0.6" />
        {/* Broken chain — upper segment */}
        <ellipse cx="20" cy="38" rx="4" ry="2.5" fill="none" strokeWidth="1.6" />
        <ellipse cx="20" cy="44" rx="2.5" ry="4" fill="none" strokeWidth="1.6" />
        {/* Lower segment, broken away */}
        <ellipse cx="44" cy="48" rx="4" ry="2.5" fill="none" strokeWidth="1.6" />
        <ellipse cx="44" cy="42" rx="2.5" ry="4" fill="none" strokeWidth="1.6" />
        {/* Break gap with shards */}
        <path d="M26 44 L34 46 M30 46 L32 48 M38 46 L36 44" strokeWidth="0.8" strokeOpacity="0.5" />
        {/* Tear drop falling */}
        <path d="M32 52 Q30 55 32 57 Q34 55 32 52 Z" fill="currentColor" fillOpacity="0.7" />
      </svg>
    ),

    // ════════════════════════════════════════════════════════════════
    // DEUSES DO PANTEÃO ESTABELECIDO
    // ════════════════════════════════════════════════════════════════

    // BAHAMUT — dragão platina — cabeça estilizada
    bahamut: ({ className, style }) => (
      <svg className={className} style={style} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4">
        <Frame />
        {/* Dragon head profile (facing forward, stylized) */}
        <path d="M32 10 L26 14 L22 20 L18 24 L16 30 L20 30 L24 36 L20 42 L24 44 L28 50 L32 54 L36 50 L40 44 L44 42 L40 36 L44 30 L48 30 L46 24 L42 20 L38 14 Z" fill="currentColor" fillOpacity="0.92" />
        {/* Horns */}
        <path d="M26 14 L22 8 L28 12 Z" fill="currentColor" />
        <path d="M38 14 L42 8 L36 12 Z" fill="currentColor" />
        {/* Eyes */}
        <ellipse cx="27" cy="26" rx="1.6" ry="2.4" fill="#0e0d10" />
        <ellipse cx="37" cy="26" rx="1.6" ry="2.4" fill="#0e0d10" />
        {/* Nostril */}
        <circle cx="30" cy="36" r="0.9" fill="#0e0d10" />
        <circle cx="34" cy="36" r="0.9" fill="#0e0d10" />
        {/* Mouth */}
        <path d="M28 42 Q32 46 36 42" stroke="#0e0d10" strokeWidth="1" />
        {/* Tooth */}
        <path d="M30 43 L31 46 M33 46 L34 43" stroke="#0e0d10" strokeWidth="0.7" />
        {/* Crown of scales */}
        <path d="M32 10 L30 14 L32 12 L34 14 Z" fill="#0e0d10" />
      </svg>
    ),

    // SENHORA DA RAPINA — corvo coroado
    'senhora-da-rapina': ({ className, style }) => (
      <svg className={className} style={style} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4">
        <Frame />
        <InnerFrame />
        {/* Raven body */}
        <path d="M20 30 Q24 22 32 22 Q40 22 44 30 L43 34 Q45 36 45 40 L41 42 Q39 46 32 46 Q25 46 22 42 L20 40 Q18 38 18 34 Z" fill="currentColor" fillOpacity="0.9" />
        {/* Beak */}
        <path d="M44 30 L52 26 L48 32 Z" fill="currentColor" />
        {/* Eye */}
        <circle cx="40" cy="30" r="1.3" fill="#0e0d10" />
        {/* Tail feathers */}
        <path d="M22 42 L18 50 M26 44 L24 52 M30 45 L30 52" strokeWidth="1" />
        {/* Small crown above */}
        <path d="M26 18 L28 14 L30 17 L32 13 L34 17 L36 14 L38 18 Z" fill="currentColor" fillOpacity="0.85" />
        <circle cx="32" cy="15" r="1" fill="#0e0d10" />
      </svg>
    ),

    // MELORA — Deusa Selvagem — onda enroscada com folha
    melora: ({ className, style }) => (
      <svg className={className} style={style} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4">
        <Frame />
        {/* Stylized wave (lower half) */}
        <path d="M10 44 Q18 36 26 44 Q34 52 42 44 Q50 36 54 44 L54 52 L10 52 Z" fill="currentColor" fillOpacity="0.85" />
        <path d="M14 46 Q22 40 30 46 M34 46 Q42 40 50 46" stroke="#0e0d10" strokeWidth="0.6" />
        {/* Leaf rising (upper) */}
        <path d="M32 12 Q22 18 24 30 Q28 36 32 38 Q36 36 40 30 Q42 18 32 12 Z" fill="currentColor" fillOpacity="0.92" />
        {/* Leaf vein */}
        <path d="M32 14 L32 38" stroke="#0e0d10" strokeWidth="0.7" />
        <path d="M32 20 L27 22 M32 24 L26 27 M32 28 L27 31 M32 32 L29 35 M32 20 L37 22 M32 24 L38 27 M32 28 L37 31 M32 32 L35 35" stroke="#0e0d10" strokeWidth="0.4" />
      </svg>
    ),

    // PELOR — Sol e Verão — sol radiante
    pelor: ({ className, style }) => (
      <svg className={className} style={style} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4">
        <Frame />
        <circle cx="32" cy="32" r="10" fill="currentColor" fillOpacity="0.9" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
          <g key={a} transform={`rotate(${a} 32 32)`}>
            <path d="M32 15 L34 8 L32 4 L30 8 Z" fill="currentColor" fillOpacity="0.92" />
          </g>
        ))}
        {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map(a => (
          <g key={a} transform={`rotate(${a} 32 32)`}>
            <path d="M32 17 L33 12 L32 10 L31 12 Z" fill="currentColor" fillOpacity="0.6" />
          </g>
        ))}
        {/* Hourglass etched at center */}
        <path d="M28 28 L36 28 L32 32 L36 36 L28 36 L32 32 Z" stroke="#0e0d10" strokeWidth="0.8" fill="none" />
      </svg>
    ),

    // CORELLON — Patrono dos Elfos — lua crescente abraçando estrela
    corellon: ({ className, style }) => (
      <svg className={className} style={style} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4">
        <Frame />
        {/* Crescent moon */}
        <path d="M44 16 A20 20 0 1 0 44 48 A14 14 0 1 1 44 16 Z" fill="currentColor" fillOpacity="0.9" />
        {/* 8-point star inside crescent opening */}
        <path d="M40 32 L42 28 L44 26 L42 30 L46 32 L42 34 L44 38 L42 36 L40 32 Z M40 32 L36 30 L34 28 L38 30 L40 26 L42 30 L46 30 L42 32 Z" fill="currentColor" fillOpacity="0.95" />
        <path d="M40 26 L40 38 M34 32 L46 32 M36 28 L44 36 M44 28 L36 36" stroke="currentColor" strokeWidth="1" />
        {/* Decorative leaf flourish */}
        <path d="M18 50 Q22 46 24 42 M46 14 Q48 18 50 22" strokeWidth="0.8" strokeOpacity="0.6" />
      </svg>
    ),

    // MORADIN — Patrono dos Artesãos — martelo sobre bigorna
    moradin: ({ className, style }) => (
      <svg className={className} style={style} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4">
        <Frame />
        {/* Anvil */}
        <path d="M12 44 L52 44 L48 38 L40 38 L40 34 L24 34 L24 38 L16 38 Z" fill="currentColor" fillOpacity="0.92" />
        {/* Anvil base */}
        <path d="M22 44 L22 52 L42 52 L42 44" fill="currentColor" fillOpacity="0.92" stroke="currentColor" />
        {/* Anvil horn */}
        <path d="M48 38 L56 36 L52 40 Z" fill="currentColor" fillOpacity="0.92" />
        {/* Hammer head */}
        <rect x="24" y="14" width="16" height="8" rx="1" fill="currentColor" fillOpacity="0.9" />
        {/* Hammer face accents */}
        <line x1="28" y1="14" x2="28" y2="22" stroke="#0e0d10" strokeWidth="0.6" />
        <line x1="36" y1="14" x2="36" y2="22" stroke="#0e0d10" strokeWidth="0.6" />
        {/* Hammer haft */}
        <rect x="30" y="22" width="4" height="10" fill="currentColor" />
        {/* Spark above */}
        <path d="M32 8 L33 12 L34 8 L33 6 Z" fill="currentColor" fillOpacity="0.7" />
        <path d="M28 10 L29 12 M36 10 L35 12" strokeWidth="0.6" strokeOpacity="0.6" />
      </svg>
    ),

    // IOUN — Conhecimento — olho dentro de losango com runas
    ioun: ({ className, style }) => (
      <svg className={className} style={style} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4">
        <Frame />
        {/* Diamond / rhombus */}
        <path d="M32 10 L52 32 L32 54 L12 32 Z" fill="currentColor" fillOpacity="0.92" />
        {/* Inner diamond */}
        <path d="M32 18 L46 32 L32 46 L18 32 Z" fill="none" stroke="#0e0d10" strokeWidth="0.7" strokeOpacity="0.7" />
        {/* Eye */}
        <path d="M22 32 Q32 26 42 32 Q32 38 22 32 Z" fill="#f4ecd6" />
        <circle cx="32" cy="32" r="3" fill="#0e0d10" />
        <circle cx="33" cy="31" r="0.9" fill="#f4ecd6" />
        {/* Runic ticks at corners */}
        <path d="M32 14 L32 17 M32 47 L32 50 M15 32 L18 32 M46 32 L49 32" stroke="#0e0d10" strokeWidth="0.8" />
        <path d="M22 22 L24 24 M40 22 L42 24 M22 42 L24 40 M40 42 L42 40" stroke="#0e0d10" strokeWidth="0.6" />
      </svg>
    ),

    // AVANDRA — Sorte e Viagens — estrela bússola com trilha
    avandra: ({ className, style }) => (
      <svg className={className} style={style} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4">
        <Frame />
        {/* Footpath dashed loop */}
        <path d="M14 50 Q22 46 28 42 Q34 50 42 46 Q50 42 50 32" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 3" strokeOpacity="0.55" fill="none" />
        {/* 8-point compass star */}
        <path d="M32 8 L36 28 L56 32 L36 36 L32 56 L28 36 L8 32 L28 28 Z" fill="currentColor" fillOpacity="0.92" />
        {/* Diagonal smaller rays */}
        <path d="M20 20 L31 31 L43 19 L33 31 L44 43 L33 33 L21 44 L31 33 Z" fill="currentColor" fillOpacity="0.55" />
        {/* Center */}
        <circle cx="32" cy="32" r="2.4" fill="#0e0d10" />
        {/* N marker */}
        <path d="M30 10 L30 14 L34 14 L34 10" stroke="#0e0d10" strokeWidth="0.6" fill="none" />
      </svg>
    ),

    // SEHANINE — Lua e Outono — três fases lunares
    sehanine: ({ className, style }) => (
      <svg className={className} style={style} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4">
        <Frame />
        {/* Waxing crescent (left) */}
        <path d="M18 32 A8 8 0 1 1 18 31.9 A5 8 0 1 0 18 32 Z" fill="currentColor" fillOpacity="0.85" />
        {/* Full moon (center) */}
        <circle cx="32" cy="32" r="9" fill="currentColor" fillOpacity="0.92" />
        {/* Crater details */}
        <circle cx="30" cy="30" r="1.2" fill="#0e0d10" fillOpacity="0.5" />
        <circle cx="34" cy="34" r="0.8" fill="#0e0d10" fillOpacity="0.4" />
        <circle cx="35" cy="29" r="0.6" fill="#0e0d10" fillOpacity="0.4" />
        {/* Waning crescent (right) */}
        <path d="M46 32 A8 8 0 1 0 46 31.9 A5 8 0 1 1 46 32 Z" fill="currentColor" fillOpacity="0.85" />
        {/* Connecting trail */}
        <path d="M18 32 L23 32 M41 32 L46 32" strokeWidth="0.6" strokeOpacity="0.5" strokeDasharray="1 2" />
        {/* Falling leaves */}
        <path d="M14 48 Q12 50 14 52 Q16 50 14 48 Z M50 14 Q48 16 50 18 Q52 16 50 14 Z" fill="currentColor" fillOpacity="0.65" />
      </svg>
    ),

    // KORD — Tempestades e Batalhas — raio sobre espadas cruzadas
    kord: ({ className, style }) => (
      <svg className={className} style={style} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4">
        <Frame />
        {/* Storm cloud */}
        <path d="M14 22 Q14 16 20 16 Q24 12 30 14 Q36 10 42 14 Q50 14 50 22 Q52 26 48 28 L16 28 Q12 26 14 22 Z" fill="currentColor" fillOpacity="0.55" />
        {/* Lightning bolt */}
        <path d="M30 22 L26 38 L32 38 L28 52 L40 32 L34 32 L38 22 Z" fill="currentColor" fillOpacity="0.95" stroke="#0e0d10" strokeWidth="0.6" />
        {/* Crossed swords below */}
        <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <line x1="16" y1="54" x2="28" y2="42" />
          <line x1="48" y1="54" x2="36" y2="42" />
        </g>
      </svg>
    ),

    // ERATHIS — Civilização e Lei — torre + engrenagem
    erathis: ({ className, style }) => (
      <svg className={className} style={style} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4">
        <Frame />
        {/* Gear background */}
        <g>
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(a => (
            <rect key={a} x="31" y="6" width="2" height="4"
              fill="currentColor" fillOpacity="0.7"
              transform={`rotate(${a} 32 32)`} />
          ))}
          <circle cx="32" cy="32" r="20" fill="currentColor" fillOpacity="0.55" />
          <circle cx="32" cy="32" r="14" fill="var(--ink-slate, #181719)" stroke="currentColor" strokeWidth="0.8" />
        </g>
        {/* Tower in center */}
        <rect x="26" y="22" width="12" height="20" fill="currentColor" fillOpacity="0.95" />
        {/* Crenellations */}
        <path d="M26 22 L26 18 L28 18 L28 20 L30 20 L30 18 L32 18 L32 20 L34 20 L34 18 L36 18 L36 20 L38 20 L38 18 L38 22" fill="currentColor" />
        {/* Door */}
        <path d="M30 36 L30 42 L34 42 L34 36 Z" fill="#0e0d10" />
        {/* Window */}
        <rect x="30" y="26" width="4" height="3" fill="#0e0d10" />
      </svg>
    ),

    // VECNA — Mortos-Vivos e Segredos — mão com olho na palma
    vecna: ({ className, style }) => (
      <svg className={className} style={style} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4">
        <Frame />
        {/* Hand silhouette (palm forward, fingers up) */}
        <path d="M22 56 L22 32 Q22 28 26 28 L26 18 Q26 14 28 14 L28 28 L28 12 Q28 10 30 10 L30 28 L30 12 Q30 10 32 10 L32 28 L32 14 Q32 12 34 12 L34 28 Q36 28 38 30 L42 38 Q44 42 44 48 L44 56 Z" fill="currentColor" fillOpacity="0.92" />
        {/* Eye in palm */}
        <ellipse cx="32" cy="40" rx="6" ry="3.5" fill="#0e0d10" />
        <ellipse cx="32" cy="40" rx="5" ry="2.8" fill="#f4ecd6" />
        <circle cx="32" cy="40" r="1.6" fill="#0e0d10" />
        {/* Finger lines */}
        <path d="M27 28 L27 18 M30 28 L30 13 M33 28 L33 16" stroke="#0e0d10" strokeWidth="0.5" strokeOpacity="0.5" />
      </svg>
    ),

    // ASMODEUS — Tirania — coroa cornuda com pentagrama
    asmodeus: ({ className, style }) => (
      <svg className={className} style={style} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4">
        <Frame />
        {/* Inverted pentagram */}
        <path d="M32 50 L20 18 L46 38 L18 38 L44 18 Z" fill="currentColor" fillOpacity="0.9" stroke="#0e0d10" strokeWidth="0.8" />
        {/* Horns at top corners */}
        <path d="M18 18 Q12 14 14 22 Q16 18 18 18 Z" fill="currentColor" fillOpacity="0.9" />
        <path d="M46 18 Q52 14 50 22 Q48 18 46 18 Z" fill="currentColor" fillOpacity="0.9" />
        {/* Central rod */}
        <line x1="32" y1="14" x2="32" y2="50" stroke="#0e0d10" strokeWidth="0.8" strokeOpacity="0.5" />
        {/* Center jewel */}
        <circle cx="32" cy="34" r="2.4" fill="#0e0d10" />
        <circle cx="32" cy="34" r="0.8" fill="currentColor" />
      </svg>
    ),

    // BANE — Guerra e Conquista — punho armado erguido
    bane: ({ className, style }) => (
      <svg className={className} style={style} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4">
        <Frame />
        {/* Gauntlet fist - main mass */}
        <path d="M20 24 L20 44 Q20 52 32 52 Q44 52 44 44 L44 24 Q44 18 38 18 L26 18 Q20 18 20 24 Z" fill="currentColor" fillOpacity="0.92" />
        {/* Knuckle plates */}
        <path d="M22 24 L42 24 M22 30 L42 30" stroke="#0e0d10" strokeWidth="0.8" />
        {/* Knuckle studs */}
        <circle cx="26" cy="22" r="1.4" fill="#0e0d10" />
        <circle cx="32" cy="22" r="1.4" fill="#0e0d10" />
        <circle cx="38" cy="22" r="1.4" fill="#0e0d10" />
        {/* Thumb */}
        <path d="M44 28 Q50 30 48 38 L44 38 Z" fill="currentColor" fillOpacity="0.92" />
        {/* Wrist band */}
        <rect x="18" y="46" width="28" height="4" fill="currentColor" />
        <path d="M22 48 L42 48" stroke="#0e0d10" strokeWidth="0.6" />
      </svg>
    ),

    // TIAMAT — Rainha dos Cromáticos — cinco cabeças de dragão radiando
    tiamat: ({ className, style }) => (
      <svg className={className} style={style} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4">
        <Frame />
        {/* Central body */}
        <circle cx="32" cy="34" r="6" fill="currentColor" fillOpacity="0.85" />
        {/* Five heads radiating: top, upper-left, upper-right, lower-left, lower-right */}
        {[
          { a: -90, color: '#3a3678' },  // top - blue
          { a: -150, color: '#7a1f1f' }, // upper-left - red
          { a: -30, color: '#2a5a3a' },  // upper-right - green
          { a: 150, color: '#f4ecd6' },  // lower-left - white
          { a: 30, color: '#1a1a1a' },   // lower-right - black
        ].map(({ a, color }) => {
          const r = 16;
          const rad = a * Math.PI / 180;
          const x = 32 + r * Math.cos(rad);
          const y = 34 + r * Math.sin(rad);
          return (
            <g key={a}>
              {/* Neck */}
              <line x1="32" y1="34" x2={x} y2={y} stroke="currentColor" strokeWidth="3" />
              {/* Head */}
              <circle cx={x} cy={y} r="4" fill={color} stroke="currentColor" strokeWidth="0.8" />
              {/* Eye */}
              <circle cx={x} cy={y} r="0.9" fill="#0e0d10" />
            </g>
          );
        })}
        {/* Central crown */}
        <path d="M28 28 L30 24 L32 27 L34 24 L36 28 Z" fill="currentColor" />
      </svg>
    ),

    // LOLTH — Rainha Demoníaca das Aranhas — aranha
    lolth: ({ className, style }) => (
      <svg className={className} style={style} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4">
        <Frame />
        {/* Spider abdomen */}
        <ellipse cx="32" cy="38" rx="10" ry="12" fill="currentColor" fillOpacity="0.92" />
        {/* Cephalothorax */}
        <ellipse cx="32" cy="26" rx="6" ry="5" fill="currentColor" fillOpacity="0.92" />
        {/* Eyes (8 eyes pattern) */}
        <circle cx="29" cy="24" r="0.8" fill="#0e0d10" />
        <circle cx="32" cy="23" r="0.9" fill="#0e0d10" />
        <circle cx="35" cy="24" r="0.8" fill="#0e0d10" />
        <circle cx="30" cy="27" r="0.7" fill="#0e0d10" />
        <circle cx="34" cy="27" r="0.7" fill="#0e0d10" />
        {/* 8 legs - 4 each side */}
        <g stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round">
          <path d="M26 28 L18 22 L14 26" />
          <path d="M25 32 L14 30 L10 34" />
          <path d="M25 38 L14 40 L12 46" />
          <path d="M27 44 L20 48 L18 54" />
          <path d="M38 28 L46 22 L50 26" />
          <path d="M39 32 L50 30 L54 34" />
          <path d="M39 38 L50 40 L52 46" />
          <path d="M37 44 L44 48 L46 54" />
        </g>
        {/* Hourglass mark on abdomen */}
        <path d="M30 36 L34 36 L32 39 L34 42 L30 42 L32 39 Z" fill="#0e0d10" />
      </svg>
    ),

    // GRUUMSH — Deus Caolho — olho único atravessado
    gruumsh: ({ className, style }) => (
      <svg className={className} style={style} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4">
        <Frame />
        {/* Single brutal eye */}
        <path d="M12 32 Q32 18 52 32 Q32 46 12 32 Z" fill="currentColor" fillOpacity="0.92" />
        {/* Pupil */}
        <ellipse cx="32" cy="32" rx="5" ry="6" fill="#0e0d10" />
        <ellipse cx="32" cy="32" rx="2" ry="3" fill="#7a1f1f" />
        {/* Diagonal scar gash across */}
        <path d="M14 18 L52 48" stroke="#7a1f1f" strokeWidth="3" strokeLinecap="round" />
        <path d="M14 18 L52 48" stroke="#0e0d10" strokeWidth="1" strokeLinecap="round" strokeDasharray="2 3" />
        {/* Drops of blood */}
        <circle cx="50" cy="50" r="1.2" fill="#7a1f1f" />
        <circle cx="48" cy="54" r="0.8" fill="#7a1f1f" />
      </svg>
    ),

    // ZEHIR — Veneno e Escuridão — cobra enrolada
    zehir: ({ className, style }) => (
      <svg className={className} style={style} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4">
        <Frame />
        {/* Coiled serpent body */}
        <path d="M32 12 Q14 16 14 32 Q14 48 32 48 Q48 48 48 36 Q48 26 36 26 Q26 26 26 34 Q26 40 32 40"
          stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
        {/* Snake head at end */}
        <path d="M32 38 L36 40 L36 42 L32 44 L28 42 L28 40 Z" fill="currentColor" fillOpacity="0.95" />
        {/* Eyes */}
        <circle cx="30" cy="40" r="0.7" fill="#0e0d10" />
        <circle cx="34" cy="40" r="0.7" fill="#0e0d10" />
        {/* Forked tongue */}
        <path d="M32 44 L30 50 M32 44 L34 50 M32 44 L32 52" stroke="#7a1f1f" strokeWidth="0.8" />
        {/* Scale pattern hints */}
        <path d="M18 28 L22 28 M18 34 L22 34 M20 24 L20 38" stroke="#0e0d10" strokeWidth="0.5" strokeOpacity="0.5" />
        {/* Venom drop */}
        <path d="M32 54 Q30 56 32 58 Q34 56 32 54 Z" fill="#2a5a3a" />
      </svg>
    ),

    // TOROG — Rei que se Arrasta — corrente em prisão circular
    torog: ({ className, style }) => (
      <svg className={className} style={style} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4">
        <Frame />
        {/* Cave/prison oval */}
        <ellipse cx="32" cy="34" rx="22" ry="18" fill="#0e0d10" fillOpacity="0.5" />
        {/* Chain ring of links circling */}
        <g stroke="currentColor" strokeWidth="1.4" fill="none">
          <ellipse cx="32" cy="14" rx="4" ry="2.6" />
          <ellipse cx="46" cy="22" rx="2.6" ry="4" />
          <ellipse cx="50" cy="34" rx="4" ry="2.6" />
          <ellipse cx="46" cy="46" rx="2.6" ry="4" />
          <ellipse cx="32" cy="52" rx="4" ry="2.6" />
          <ellipse cx="18" cy="46" rx="2.6" ry="4" />
          <ellipse cx="14" cy="34" rx="4" ry="2.6" />
          <ellipse cx="18" cy="22" rx="2.6" ry="4" />
        </g>
        {/* Central crown of thorns */}
        <path d="M28 32 L26 28 L30 30 L32 26 L34 30 L38 28 L36 32 L40 34 L36 36 L38 40 L34 38 L32 42 L30 38 L26 40 L28 36 L24 34 Z" fill="currentColor" fillOpacity="0.9" />
        <circle cx="32" cy="34" r="1.4" fill="#0e0d10" />
      </svg>
    ),

    // THARIZDUN — Deus Acorrentado — olho elemental envolto em correntes
    tharizdun: ({ className, style }) => (
      <svg className={className} style={style} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4">
        <Frame />
        {/* Outer cracked aura */}
        <path d="M32 6 L34 14 L32 12 L30 14 Z M58 32 L50 34 L52 32 L50 30 Z M32 58 L30 50 L32 52 L34 50 Z M6 32 L14 30 L12 32 L14 34 Z"
          fill="currentColor" fillOpacity="0.6" />
        {/* Sphere */}
        <circle cx="32" cy="32" r="14" fill="#0e0d10" />
        <circle cx="32" cy="32" r="14" fill="none" stroke="currentColor" strokeWidth="0.8" />
        {/* Eye inside */}
        <path d="M20 32 Q32 26 44 32 Q32 38 20 32 Z" fill="currentColor" fillOpacity="0.95" />
        <circle cx="32" cy="32" r="3.5" fill="#7a1f1f" />
        <circle cx="32" cy="32" r="1.4" fill="#0e0d10" />
        {/* Chains wrapping (4 chains crossing) */}
        <g stroke="currentColor" strokeWidth="1.4" fill="none">
          <ellipse cx="14" cy="20" rx="3" ry="2" />
          <ellipse cx="18" cy="14" rx="2" ry="3" />
          <ellipse cx="50" cy="20" rx="3" ry="2" />
          <ellipse cx="46" cy="14" rx="2" ry="3" />
          <ellipse cx="14" cy="44" rx="3" ry="2" />
          <ellipse cx="18" cy="50" rx="2" ry="3" />
          <ellipse cx="50" cy="44" rx="3" ry="2" />
          <ellipse cx="46" cy="50" rx="2" ry="3" />
        </g>
        {/* Connecting lines */}
        <path d="M17 22 L28 30 M47 22 L36 30 M17 42 L28 34 M47 42 L36 34" strokeWidth="0.6" strokeOpacity="0.5" />
      </svg>
    ),

    // XATHYR — Falso-Deus Aboleth — tentáculos em torno de olho central
    xathyr: ({ className, style }) => (
      <svg className={className} style={style} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4">
        <Frame />
        {/* Tentacles radiating - 6 curling outward */}
        <g stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeOpacity="0.85">
          <path d="M32 28 Q22 18 14 12 Q18 18 16 22" />
          <path d="M40 30 Q52 24 56 14 Q52 22 54 26" />
          <path d="M42 36 Q54 38 58 50 Q52 44 50 46" />
          <path d="M34 42 Q38 54 48 56 Q42 50 44 48" />
          <path d="M28 42 Q22 54 14 56 Q22 50 18 48" />
          <path d="M24 34 Q12 36 8 48 Q14 42 16 44" />
        </g>
        {/* Suckers on tentacles */}
        <g fill="#0e0d10">
          <circle cx="24" cy="22" r="0.7" />
          <circle cx="22" cy="18" r="0.7" />
          <circle cx="42" cy="22" r="0.7" />
          <circle cx="44" cy="18" r="0.7" />
          <circle cx="46" cy="40" r="0.7" />
          <circle cx="50" cy="48" r="0.7" />
          <circle cx="36" cy="46" r="0.7" />
          <circle cx="42" cy="52" r="0.7" />
          <circle cx="28" cy="46" r="0.7" />
          <circle cx="22" cy="52" r="0.7" />
          <circle cx="18" cy="40" r="0.7" />
          <circle cx="14" cy="48" r="0.7" />
        </g>
        {/* Central eye */}
        <ellipse cx="32" cy="32" rx="8" ry="6" fill="currentColor" fillOpacity="0.95" />
        <ellipse cx="32" cy="32" rx="4" ry="4" fill="#0e0d10" />
        <circle cx="33" cy="31" r="1" fill="currentColor" />
        {/* Halo of slime */}
        <ellipse cx="32" cy="32" rx="10" ry="8" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 2" strokeOpacity="0.6" />
      </svg>
    ),
  };

  // Generic fallbacks (used by deities whose `sigil` field is set but never had a custom one).
  // These match the existing SIGIL_OPTIONS list in pantheon.jsx.
  const GenericFallbacks = {

    Tree: ({ className, style }) => (
      <svg className={className} style={style} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="32" cy="32" r="28" strokeOpacity="0.4" />
        <circle cx="32" cy="24" r="14" fill="currentColor" fillOpacity="0.85" />
        <circle cx="22" cy="22" r="8" fill="currentColor" fillOpacity="0.75" />
        <circle cx="42" cy="22" r="8" fill="currentColor" fillOpacity="0.75" />
        <rect x="30" y="36" width="4" height="14" fill="currentColor" />
        <path d="M28 50 Q26 54 22 56 M36 50 Q38 54 42 56 M32 50 L32 56" strokeWidth="1" />
      </svg>
    ),

    Skull: ({ className, style }) => (
      <svg className={className} style={style} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="32" cy="32" r="28" strokeOpacity="0.4" />
        <path d="M16 30 Q16 16 32 16 Q48 16 48 30 L48 38 L42 38 L42 46 L36 46 L36 42 L28 42 L28 46 L22 46 L22 38 L16 38 Z" fill="currentColor" fillOpacity="0.92" />
        <ellipse cx="24" cy="30" rx="3" ry="4" fill="#0e0d10" />
        <ellipse cx="40" cy="30" rx="3" ry="4" fill="#0e0d10" />
        <path d="M30 36 L32 40 L34 36" stroke="#0e0d10" strokeWidth="0.8" fill="#0e0d10" />
        <path d="M26 46 L26 50 L28 50 L28 46 M30 46 L30 50 L32 50 L32 46 M34 46 L34 50 L36 50 L36 46" stroke="#0e0d10" strokeWidth="0.6" />
      </svg>
    ),

    Wave: ({ className, style }) => (
      <svg className={className} style={style} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="32" cy="32" r="28" strokeOpacity="0.4" />
        <path d="M8 36 Q16 28 24 36 Q32 44 40 36 Q48 28 56 36 L56 50 L8 50 Z" fill="currentColor" fillOpacity="0.85" />
        <path d="M12 28 Q20 20 28 28 Q36 36 44 28 Q52 20 56 28" strokeWidth="1.2" strokeOpacity="0.6" />
        <path d="M14 20 Q22 14 30 20 Q38 26 46 20" strokeWidth="0.8" strokeOpacity="0.4" />
      </svg>
    ),

    Moon: ({ className, style }) => (
      <svg className={className} style={style} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="32" cy="32" r="28" strokeOpacity="0.4" />
        <path d="M42 14 A20 20 0 1 0 42 50 A14 14 0 1 1 42 14 Z" fill="currentColor" fillOpacity="0.92" />
        <circle cx="22" cy="24" r="2" fill="#0e0d10" fillOpacity="0.4" />
        <circle cx="20" cy="36" r="1.5" fill="#0e0d10" fillOpacity="0.4" />
        <circle cx="26" cy="42" r="1.2" fill="#0e0d10" fillOpacity="0.4" />
      </svg>
    ),

    Eye: ({ className, style }) => (
      <svg className={className} style={style} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="32" cy="32" r="28" strokeOpacity="0.4" />
        <path d="M10 32 Q32 18 54 32 Q32 46 10 32 Z" fill="currentColor" fillOpacity="0.9" />
        <circle cx="32" cy="32" r="6" fill="#0e0d10" />
        <circle cx="32" cy="32" r="3" fill="currentColor" />
        <circle cx="33" cy="31" r="1" fill="#0e0d10" />
      </svg>
    ),

    Flame: ({ className, style }) => (
      <svg className={className} style={style} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="32" cy="32" r="28" strokeOpacity="0.4" />
        <path d="M32 10 Q24 20 26 30 Q22 32 22 38 Q22 50 32 54 Q42 50 42 38 Q42 32 38 30 Q40 20 32 10 Z" fill="currentColor" fillOpacity="0.92" />
        <path d="M32 22 Q28 28 30 36 Q28 40 30 44 Q32 46 34 44 Q36 40 34 36 Q36 28 32 22 Z" fill="#0e0d10" fillOpacity="0.5" />
      </svg>
    ),

    Sword: ({ className, style }) => (
      <svg className={className} style={style} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="32" cy="32" r="28" strokeOpacity="0.4" />
        <path d="M30 8 L34 8 L34 44 L30 44 Z" fill="currentColor" />
        <path d="M30 44 L32 52 L34 44 Z" fill="currentColor" />
        <path d="M22 44 L42 44 L42 48 L22 48 Z" fill="currentColor" />
        <rect x="30" y="48" width="4" height="6" fill="currentColor" />
        <circle cx="32" cy="56" r="2" fill="currentColor" />
        <path d="M30 14 L34 14 M30 24 L34 24 M30 34 L34 34" stroke="#0e0d10" strokeWidth="0.5" />
      </svg>
    ),
  };

  Object.assign(window.Sigil, DeitySigils, GenericFallbacks);
})();
