// Sigils & ornamental SVGs — heraldic seals for deities, factions, etc.

const Sigil = {
  // Raven (Senhora da Rapina)
  Raven: ({ className, style }) => (
    <svg className={className} style={style} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="32" cy="32" r="28" strokeOpacity="0.4" />
      <circle cx="32" cy="32" r="22" strokeOpacity="0.2" />
      <path d="M20 28 Q24 22 32 22 Q40 22 44 28 L42 32 Q44 34 44 38 L40 40 Q38 44 32 44 Q26 44 22 40 L20 38 Q18 36 18 32 Z" fill="currentColor" fillOpacity="0.85" />
      <path d="M44 28 L52 24 L48 30 Z" fill="currentColor" />
      <circle cx="40" cy="30" r="1.2" fill="#0e0d10" />
      <path d="M22 40 L18 48 M26 44 L24 50 M30 45 L30 51" strokeWidth="1" />
    </svg>
  ),

  // Dragon (Bahamut)
  Dragon: ({ className, style }) => (
    <svg className={className} style={style} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="32" cy="32" r="28" strokeOpacity="0.4" />
      <path d="M32 12 L36 18 L42 16 L40 22 L46 22 L42 28 L38 32 L42 36 L46 42 L40 42 L42 48 L36 46 L32 52 L28 46 L22 48 L24 42 L18 42 L22 36 L26 32 L22 28 L18 22 L24 22 L22 16 L28 18 Z" fill="currentColor" fillOpacity="0.9" />
      <circle cx="28" cy="30" r="1.4" fill="#0e0d10" />
      <circle cx="36" cy="30" r="1.4" fill="#0e0d10" />
    </svg>
  ),

  // Sun (Vofureon)
  Sun: ({ className, style }) => (
    <svg className={className} style={style} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="32" cy="32" r="28" strokeOpacity="0.4" />
      <circle cx="32" cy="32" r="11" fill="currentColor" fillOpacity="0.85" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
        <g key={a} transform={`rotate(${a} 32 32)`}>
          <path d="M32 14 L34 8 L32 4 L30 8 Z" fill="currentColor" fillOpacity="0.9" />
        </g>
      ))}
      {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map(a => (
        <g key={a} transform={`rotate(${a} 32 32)`}>
          <path d="M32 18 L33 12 L32 10 L31 12 Z" fill="currentColor" fillOpacity="0.6" />
        </g>
      ))}
    </svg>
  ),

  // Hand (Lamidriel - Bondade)
  Hand: ({ className, style }) => (
    <svg className={className} style={style} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="32" cy="32" r="28" strokeOpacity="0.4" />
      <path d="M22 38 L22 28 Q22 26 24 26 L24 22 Q24 20 26 20 L26 26 L26 18 Q26 16 28 16 L28 26 L28 16 Q28 14 30 14 L30 26 L30 18 Q30 16 32 16 L32 28 Q34 26 36 26 Q40 26 40 30 L40 38 Q40 44 36 46 L28 46 Q24 46 22 42 Z" fill="currentColor" fillOpacity="0.9" />
      <circle cx="31" cy="34" r="3" fill="none" stroke="#0e0d10" strokeWidth="0.8" />
      <path d="M16 50 L48 50" strokeOpacity="0.5" />
    </svg>
  ),

  // Sacrifice cross / dawn (Esmir)
  Dawn: ({ className, style }) => (
    <svg className={className} style={style} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="32" cy="32" r="28" strokeOpacity="0.4" />
      <path d="M4 44 Q32 24 60 44" stroke="currentColor" strokeWidth="1" />
      <path d="M32 12 L32 44 M22 26 L42 26" strokeWidth="2.4" fill="none" />
      <path d="M30 12 L32 8 L34 12" fill="currentColor" />
      {[8, 14, 50, 56].map(x => (
        <path key={x} d={`M${x} 44 L${x} 40`} strokeWidth="1" />
      ))}
    </svg>
  ),

  // Broken chain (Ayael, imprisoned angel)
  Chain: ({ className, style }) => (
    <svg className={className} style={style} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="32" cy="32" r="28" strokeOpacity="0.4" />
      <path d="M32 4 L36 12 L42 10 L40 18 L48 20 L42 24 L46 32 L38 30 L40 38 L32 34 L24 38 L26 30 L18 32 L22 24 L16 20 L24 18 L22 10 L28 12 Z" fill="currentColor" fillOpacity="0.85" />
      <path d="M28 42 L36 42 L34 50 L38 50 L34 58 L36 50 L30 50 L26 58 L30 50 L26 42" strokeWidth="1.2" />
      <circle cx="32" cy="22" r="2.5" fill="#0e0d10" />
    </svg>
  ),

  // Tome (generic deity / archive)
  Tome: ({ className, style }) => (
    <svg className={className} style={style} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="32" cy="32" r="28" strokeOpacity="0.4" />
      <rect x="14" y="16" width="36" height="32" fill="currentColor" fillOpacity="0.85" />
      <path d="M32 16 L32 48" stroke="#0e0d10" strokeWidth="1" />
      <path d="M18 22 L28 22 M18 26 L28 26 M36 22 L46 22 M36 26 L46 26 M18 34 L28 34 M36 34 L46 34" stroke="#0e0d10" strokeWidth="0.6" />
      <circle cx="32" cy="40" r="2.5" fill="#0e0d10" />
    </svg>
  ),

  // Crown (royal, Oshain)
  Crown: ({ className, style }) => (
    <svg className={className} style={style} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="32" cy="32" r="28" strokeOpacity="0.4" />
      <path d="M14 44 L14 28 L22 36 L26 22 L32 32 L38 22 L42 36 L50 28 L50 44 Z" fill="currentColor" fillOpacity="0.9" />
      <circle cx="14" cy="28" r="2" fill="currentColor" />
      <circle cx="32" cy="22" r="2.5" fill="currentColor" />
      <circle cx="50" cy="28" r="2" fill="currentColor" />
      <path d="M14 44 L50 44" stroke="#0e0d10" strokeWidth="1.5" />
    </svg>
  ),

  // Compass rose (used as watermark)
  Compass: ({ className, style }) => (
    <svg className={className} style={style} viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="0.8">
      <circle cx="100" cy="100" r="96" />
      <circle cx="100" cy="100" r="76" />
      <circle cx="100" cy="100" r="56" />
      <circle cx="100" cy="100" r="36" />
      <circle cx="100" cy="100" r="6" fill="currentColor" />
      <path d="M100 8 L108 100 L100 192 L92 100 Z" fill="currentColor" fillOpacity="0.4" />
      <path d="M8 100 L100 92 L192 100 L100 108 Z" fill="currentColor" fillOpacity="0.3" />
      <path d="M34 34 L100 96 L166 34 L104 100 L166 166 L100 104 L34 166 L96 100 Z" strokeWidth="0.5" />
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(a => (
        <line key={a}
          x1={100 + 92 * Math.cos((a - 90) * Math.PI / 180)}
          y1={100 + 92 * Math.sin((a - 90) * Math.PI / 180)}
          x2={100 + 96 * Math.cos((a - 90) * Math.PI / 180)}
          y2={100 + 96 * Math.sin((a - 90) * Math.PI / 180)}
          strokeWidth="1.5"
        />
      ))}
    </svg>
  ),

  // Tiny iconic nav glyphs
  navHome: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M2 8 L8 2 L14 8 L14 14 L10 14 L10 10 L6 10 L6 14 L2 14 Z" />
    </svg>
  ),
  navBook: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M3 2 L13 2 L13 14 L3 14 Z M3 12 L13 12 M6 5 L10 5 M6 8 L10 8" />
    </svg>
  ),
  navDeity: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="8" cy="8" r="5" />
      <path d="M8 1 L8 3 M8 13 L8 15 M1 8 L3 8 M13 8 L15 8 M3 3 L4 4 M12 12 L13 13 M3 13 L4 12 M12 4 L13 3" />
    </svg>
  ),
  navTime: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="8" cy="8" r="6" />
      <path d="M8 4 L8 8 L11 10" />
    </svg>
  ),
  navMap: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M2 4 L6 2 L10 4 L14 2 L14 12 L10 14 L6 12 L2 14 Z" />
      <path d="M6 2 L6 12 M10 4 L10 14" />
    </svg>
  ),
  navScroll: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M3 3 L11 3 L13 4 L13 13 L5 13 L3 12 Z" />
      <path d="M3 3 L3 12 L5 13 M6 6 L11 6 M6 9 L11 9" />
    </svg>
  ),
  navSword: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M2 14 L8 8 L13 3 L13 5 L8 10 L4 14 Z" />
      <path d="M6 8 L8 10 M9 5 L11 7" />
    </svg>
  ),
  navStar: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M8 1 L10 6 L15 6 L11 9 L13 14 L8 11 L3 14 L5 9 L1 6 L6 6 Z" />
    </svg>
  ),

  // Ornament (used in article divider)
  Ornament: ({ className, style }) => (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2 L13 10 L21 11 L13 12 L12 22 L11 12 L3 11 L11 10 Z" />
      <circle cx="12" cy="11" r="1.5" fill="none" stroke="currentColor" strokeWidth="0.6" />
    </svg>
  ),

  // Search icon
  Search: ({ className }) => (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="7" cy="7" r="5" />
      <path d="M11 11 L14 14" />
    </svg>
  ),

  // Theme / bookmark / settings
  Bookmark: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M4 2 L12 2 L12 14 L8 11 L4 14 Z" />
    </svg>
  ),
  Settings: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="8" cy="8" r="2.5" />
      <path d="M8 1 L8 3 M8 13 L8 15 M1 8 L3 8 M13 8 L15 8 M3 3 L4.5 4.5 M11.5 11.5 L13 13 M3 13 L4.5 11.5 M11.5 4.5 L13 3" />
    </svg>
  ),
};

window.Sigil = Sigil;
