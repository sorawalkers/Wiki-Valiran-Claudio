"""Gera os assets SVG do vitral (rosácea, divisor de vinhas, vidro quebrado). As molduras de janela
gótica do retrato são PNG/WebP feitos à parte (janela-viva / janela-misterio); a função janela()
abaixo gera a versão vetorial antiga, mantida só como alternativa e não exportada.

Uso: python3 gerar_vitral.py [pasta_de_saida]   (padrão: a pasta deste script)
"""
import math, random, os, sys

OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(os.path.abspath(__file__))
os.makedirs(OUT, exist_ok=True)

LEAD = '#0c0b0d'
RUBY, RUBY_D = '#9a2a24', '#3e0b0d'
COBALT, COBALT_D = '#2b5478', '#0e1e33'
AMBER, AMBER_D = '#b8872f', '#4e3412'
EMERALD, EMERALD_D = '#3a6634', '#142816'
VIOLET = '#4a3366'
GOLD = '#d8b36a'

def f(n): return f'{n:.1f}'.rstrip('0').rstrip('.')

def quad(p0, p1, p2, t):
    a = (1 - t) ** 2; b = 2 * (1 - t) * t; c = t * t
    return (a * p0[0] + b * p1[0] + c * p2[0], a * p0[1] + b * p1[1] + c * p2[1])

def glass_defs():
    """Gradientes de 'vidro' (luz atravessando) para cada cor."""
    out = []
    for name, (hi, lo) in {'ruby': (RUBY, RUBY_D), 'cobalt': (COBALT, COBALT_D), 'amber': (AMBER, AMBER_D),
                           'emerald': (EMERALD, EMERALD_D), 'violet': ('#5a3f7c', '#1e1430'),
                           # grisalha: vidros de fumaça, sépia e mel escuro (janela dos vivos)
                           'smoke': ('#3e3a35', '#110f0d'), 'umber': ('#5a4629', '#170f07'),
                           'honey': ('#7e6030', '#231808'), 'olive': ('#56673a', '#18200e')}.items():
        out.append(f'<radialGradient id="g-{name}" cx="35%" cy="28%" r="75%"><stop offset=".1" stop-color="{hi}"/>'
                   f'<stop offset="1" stop-color="{lo}"/></radialGradient>')
    out.append('<linearGradient id="sheen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/>'
               '<stop offset=".55" stop-color="#fff" stop-opacity="0"/></linearGradient>')
    return ''.join(out)

CYCLE = ['ruby', 'cobalt', 'amber', 'emerald', 'cobalt', 'violet', 'amber', 'ruby', 'emerald', 'cobalt']
# Janela: vitral sóbrio — as rosas vermelhas são o único destaque de cor.
CYCLE_J = ['smoke', 'umber', 'smoke', 'honey', 'umber', 'smoke', 'honey', 'umber']

# ── rosa (flor) e folha em vitral ──────────────────────────────────
def rose(cx, cy, r=10):
    parts = []
    for k in range(5):
        a = -math.pi / 2 + k * 2 * math.pi / 5
        px, py = cx + math.cos(a) * r * .55, cy + math.sin(a) * r * .55
        parts.append(f'<circle cx="{f(px)}" cy="{f(py)}" r="{f(r*.55)}" fill="url(#g-ruby)" stroke="{LEAD}" stroke-width="1.6"/>')
    parts.append(f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{f(r*.42)}" fill="{RUBY_D}" stroke="{LEAD}" stroke-width="1.4"/>')
    parts.append(f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{f(r*.17)}" fill="{GOLD}"/>')
    return ''.join(parts)

def leaf(x, y, ang, size=9):
    # folha amendoada, apontando no ângulo `ang`
    d = math.degrees(ang)
    return (f'<g transform="translate({f(x)} {f(y)}) rotate({f(d)})">'
            f'<path d="M0 0 Q{f(size*.55)} {f(-size*.45)} {f(size*1.3)} 0 Q{f(size*.55)} {f(size*.45)} 0 0Z" '
            f'fill="url(#g-olive)" stroke="{LEAD}" stroke-width="1.3"/>'
            f'<path d="M1 0 L{f(size*1.1)} 0" stroke="{LEAD}" stroke-width=".8"/></g>')

def vine_along(pts, seed, amp=5.5, freq=0.09, leaf_every=26, roses_at=(), thorn=True):
    """Vinha sinuosa seguindo a polilinha `pts` (lista de (x,y)), com folhas, espinhos e rosas."""
    rnd = random.Random(seed)
    # comprimento acumulado
    L = [0.0]
    for i in range(1, len(pts)):
        L.append(L[-1] + math.dist(pts[i - 1], pts[i]))
    total = L[-1]
    def at(s):
        for i in range(1, len(L)):
            if L[i] >= s:
                t = (s - L[i - 1]) / max(L[i] - L[i - 1], 1e-6)
                x = pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * t
                y = pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * t
                ang = math.atan2(pts[i][1] - pts[i - 1][1], pts[i][0] - pts[i - 1][0])
                return x, y, ang
        x, y = pts[-1]; return x, y, 0
    path = []
    s = 0.0
    step = 3.0
    while s <= total:
        x, y, ang = at(s)
        off = math.sin(s * freq) * amp
        path.append((x - math.sin(ang) * off, y + math.cos(ang) * off))
        s += step
    d = 'M' + ' L'.join(f'{f(x)} {f(y)}' for x, y in path)
    out = [f'<path d="{d}" fill="none" stroke="{LEAD}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>',
           f'<path d="{d}" fill="none" stroke="#4a5a34" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>']
    # folhas e espinhos
    s = leaf_every * .6; side = 1
    while s < total - 6:
        x, y, ang = at(s)
        off = math.sin(s * freq) * amp
        px, py = x - math.sin(ang) * off, y + math.cos(ang) * off
        la = ang + side * (math.pi / 2.6) + rnd.uniform(-.25, .25)
        out.append(leaf(px, py, la, size=rnd.uniform(10, 13)))
        if thorn:
            ta = ang - side * math.pi / 2
            tx, ty = px + math.cos(ang) * 8, py + math.sin(ang) * 8
            out.append(f'<path d="M{f(tx)} {f(ty)} l{f(math.cos(ta)*5)} {f(math.sin(ta)*5)} l{f(math.cos(ang)*3)} {f(math.sin(ang)*3)}Z" fill="{LEAD}"/>')
        side = -side
        s += leaf_every * rnd.uniform(.85, 1.15)
    for frac, rr in roses_at:
        x, y, ang = at(total * frac)
        off = math.sin(total * frac * freq) * amp
        out.append(rose(x - math.sin(ang) * off, y + math.cos(ang) * off, rr))
    return ''.join(out)

def small_rosette(cx, cy, r, petals=8):
    out = [f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{f(r)}" fill="url(#g-smoke)" stroke="{LEAD}" stroke-width="3"/>']
    for k in range(petals):
        a = k * 2 * math.pi / petals
        px, py = cx + math.cos(a) * r * .55, cy + math.sin(a) * r * .55
        col = 'ruby' if k % 2 == 0 else 'honey'
        out.append(f'<circle cx="{f(px)}" cy="{f(py)}" r="{f(r*.3)}" fill="url(#g-{col})" stroke="{LEAD}" stroke-width="1.6"/>')
    out.append(f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{f(r*.24)}" fill="{GOLD}" stroke="{LEAD}" stroke-width="1.6"/>')
    return ''.join(out)

# ════════════════════════════════════════════════════════════════
# 1) Janela gótica — moldura do retrato (340×520, furo = ogiva recuada 26px)
# ════════════════════════════════════════════════════════════════
def ogive_pts(x0, y0, w, h, shoulder=.5, curve=.147):
    h1 = min(h, w * shoulder); h2 = w * curve
    return dict(bl=(x0, y0 + h), sl=(x0, y0 + h1), cl=(x0, y0 + h2), top=(x0 + w / 2, y0),
                cr=(x0 + w, y0 + h2), sr=(x0 + w, y0 + h1), br=(x0 + w, y0 + h))

def ogive_d(o):
    return (f'M{f(o["bl"][0])} {f(o["bl"][1])} L{f(o["sl"][0])} {f(o["sl"][1])} '
            f'Q{f(o["cl"][0])} {f(o["cl"][1])} {f(o["top"][0])} {f(o["top"][1])} '
            f'Q{f(o["cr"][0])} {f(o["cr"][1])} {f(o["sr"][0])} {f(o["sr"][1])} L{f(o["br"][0])} {f(o["br"][1])}Z')

def side_samples(o, n_jamb, n_arch, left=True):
    b, s, c, t = (o['bl'], o['sl'], o['cl'], o['top']) if left else (o['br'], o['sr'], o['cr'], o['top'])
    pts = [(b[0], b[1] + (s[1] - b[1]) * i / n_jamb) for i in range(n_jamb)]
    pts += [quad(s, c, t, i / n_arch) for i in range(n_arch + 1)]
    return pts

def janela(W=340, H=520, band=28, seed=7):
    O = ogive_pts(0, 0, W, H)
    I = ogive_pts(band, band, W - 2 * band, H - 2 * band)
    NJ, NA = 10, 9
    parts = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" preserveAspectRatio="none">',
             f'<defs>{glass_defs()}<clipPath id="band"><path d="{ogive_d(O)}"/></clipPath></defs>']
    # vidros da faixa: aduelas (arco) + blocos (ombreiras), dos dois lados
    k = 0
    for left in (True, False):
        so = side_samples(O, NJ, NA, left); si = side_samples(I, NJ, NA, left)
        for i in range(len(so) - 1):
            q = [so[i], so[i + 1], si[i + 1], si[i]]
            col = CYCLE_J[(k + (0 if left else 3)) % len(CYCLE_J)]; k += 1
            d = 'M' + ' L'.join(f'{f(x)} {f(y)}' for x, y in q) + 'Z'
            parts.append(f'<path d="{d}" fill="url(#g-{col})" stroke="{LEAD}" stroke-width="3" stroke-linejoin="round"/>')
    # peitoril (entre o furo e a base)
    ny = 6; y0 = H - band
    for i in range(ny):
        x0 = band + (W - 2 * band) * i / ny; x1 = band + (W - 2 * band) * (i + 1) / ny
        col = ['umber', 'smoke', 'honey'][i % 3]
        parts.append(f'<rect x="{f(x0)}" y="{f(y0)}" width="{f(x1-x0)}" height="{band}" fill="url(#g-{col})" stroke="{LEAD}" stroke-width="3"/>')
    # brilho de cima (luz)
    parts.append(f'<path d="{ogive_d(O)} {ogive_d(I)}" fill="url(#sheen)" fill-rule="evenodd"/>')
    # chumbo externo e interno
    parts.append(f'<path d="{ogive_d(O)}" fill="none" stroke="{LEAD}" stroke-width="6"/>')
    parts.append(f'<path d="{ogive_d(I)}" fill="none" stroke="{LEAD}" stroke-width="4"/>')
    # vinhas: sobem das bases pelas ombreiras até o fecho, pela linha média da faixa
    for left, sd in ((True, seed), (False, seed + 11)):
        so = side_samples(O, 40, 40, left); si = side_samples(I, 40, 40, left)
        mid = [((a[0] + b[0]) / 2, (a[1] + b[1]) / 2) for a, b in zip(so, si)]
        mid = [(mid[0][0], H - 6)] + mid
        mid = mid[:-3]  # para antes do fecho (a rosácea fica lá)
        parts.append(vine_along(mid, sd, amp=5, freq=.075, leaf_every=30,
                                roses_at=((.12, 13), (.4, 12), (.7, 11.5))))
    # rosácea no fecho do arco
    parts.append(small_rosette(W / 2, band * .75 + 2, 21))
    parts.append('</svg>')
    return ''.join(parts)

# ════════════════════════════════════════════════════════════════
# 2) Rosácea grande (fundo do topo)
# ════════════════════════════════════════════════════════════════
def rosacea(R=100, petals=12):
    p = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{-R} {-R} {2*R} {2*R}">', f'<defs>{glass_defs()}</defs>']
    # anel externo de células
    n = petals * 2; r0, r1 = R * .8, R * .96
    for k in range(n):
        a0 = 2 * math.pi * k / n; a1 = 2 * math.pi * (k + 1) / n
        pts = [(math.cos(a0) * r0, math.sin(a0) * r0), (math.cos(a0) * r1, math.sin(a0) * r1)]
        d = (f'M{f(pts[0][0])} {f(pts[0][1])} L{f(pts[1][0])} {f(pts[1][1])} '
             f'A{f(r1)} {f(r1)} 0 0 1 {f(math.cos(a1)*r1)} {f(math.sin(a1)*r1)} '
             f'L{f(math.cos(a1)*r0)} {f(math.sin(a1)*r0)} A{f(r0)} {f(r0)} 0 0 0 {f(pts[0][0])} {f(pts[0][1])}Z')
        col = ['amber', 'ruby', 'cobalt', 'emerald'][k % 4]
        p.append(f'<path d="{d}" fill="url(#g-{col})" stroke="{LEAD}" stroke-width="2.2"/>')
    p.append(f'<circle r="{f(r0)}" fill="url(#g-violet)" stroke="{LEAD}" stroke-width="3"/>')
    # pétalas ogivais radiais
    for k in range(petals):
        a = 2 * math.pi * k / petals - math.pi / 2
        ca, sa = math.cos(a), math.sin(a)
        def P(r, w):  # ponto no raio r, deslocado w perpendicular
            return (ca * r - sa * w, sa * r + ca * w)
        hw = R * .105; rb, rs, rt = R * .3, R * .6, R * .77
        b1, b2 = P(rb, -hw * .7), P(rb, hw * .7)
        s1, s2 = P(rs, -hw), P(rs, hw)
        c1, c2 = P(rt - R * .02, -hw), P(rt - R * .02, hw)
        t = P(rt, 0)
        d = (f'M{f(b1[0])} {f(b1[1])} L{f(s1[0])} {f(s1[1])} Q{f(c1[0])} {f(c1[1])} {f(t[0])} {f(t[1])} '
             f'Q{f(c2[0])} {f(c2[1])} {f(s2[0])} {f(s2[1])} L{f(b2[0])} {f(b2[1])}Z')
        col = 'ruby' if k % 2 == 0 else 'cobalt'
        p.append(f'<path d="{d}" fill="url(#g-{col})" stroke="{LEAD}" stroke-width="3" stroke-linejoin="round"/>')
        tc = P(R * .6, 0)
        p.append(f'<circle cx="{f(tc[0])}" cy="{f(tc[1])}" r="{f(R*.05)}" fill="url(#g-amber)" stroke="{LEAD}" stroke-width="1.8"/>')
        # pequeno trevo entre pétalas
        a2 = a + math.pi / petals
        cx2, cy2 = math.cos(a2) * R * .7, math.sin(a2) * R * .7
        p.append(f'<circle cx="{f(cx2)}" cy="{f(cy2)}" r="{f(R*.045)}" fill="url(#g-emerald)" stroke="{LEAD}" stroke-width="1.6"/>')
    # centro: quadrifólio
    rc = R * .28
    p.append(f'<circle r="{f(rc)}" fill="url(#g-amber)" stroke="{LEAD}" stroke-width="3"/>')
    for k in range(4):
        a = k * math.pi / 2 + math.pi / 4
        p.append(f'<circle cx="{f(math.cos(a)*rc*.42)}" cy="{f(math.sin(a)*rc*.42)}" r="{f(rc*.42)}" fill="url(#g-ruby)" stroke="{LEAD}" stroke-width="2"/>')
    p.append(f'<circle r="{f(rc*.28)}" fill="{GOLD}" stroke="{LEAD}" stroke-width="2"/>')
    p.append(f'<circle r="{f(R*.96)}" fill="none" stroke="{LEAD}" stroke-width="5"/>')
    p.append(f'<circle r="{f(R)}" fill="url(#sheen)" opacity=".8"/>')
    p.append('</svg>')
    return ''.join(p)

# ════════════════════════════════════════════════════════════════
# 3) Divisor: rosácea pequena com vinhas e rosas para os lados
# ════════════════════════════════════════════════════════════════
def divisor(W=640, H=56):
    cx, cy = W / 2, H / 2
    p = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}">',
         f'<defs>{glass_defs()}<linearGradient id="fade" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/>'
         f'<stop offset=".22" stop-color="#fff"/><stop offset=".78" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>'
         f'<mask id="m"><rect width="{W}" height="{H}" fill="url(#fade)"/></mask></defs><g mask="url(#m)">']
    left = [(cx - 20 - i * 4, cy) for i in range(int((cx - 30) / 4))]
    right = [(cx + 20 + i * 4, cy) for i in range(int((cx - 30) / 4))]
    p.append(vine_along(left, 3, amp=8, freq=.085, leaf_every=24, roses_at=((.2, 10), (.52, 9))))
    p.append(vine_along(right, 5, amp=8, freq=.085, leaf_every=24, roses_at=((.2, 10), (.52, 9))))
    p.append('</g>')
    p.append(small_rosette(cx, cy, 19))
    p.append('</svg>')
    return ''.join(p)

# ════════════════════════════════════════════════════════════════
# 4) Vidro quebrado (sobreposição): trincas radiais + anéis + cacos faltando
# ════════════════════════════════════════════════════════════════
def quebrado(W=200, H=300, seed=13):
    rnd = random.Random(seed)
    ix, iy = W * .62, H * .3
    n = 13
    angs = [2 * math.pi * k / n + rnd.uniform(-.17, .17) for k in range(n)]
    def ray_end(a):
        # até a borda do retângulo
        ts = []
        ca, sa = math.cos(a), math.sin(a)
        if ca > 0: ts.append((W - ix) / ca)
        if ca < 0: ts.append(-ix / ca)
        if sa > 0: ts.append((H - iy) / sa)
        if sa < 0: ts.append(-iy / sa)
        return min(ts)
    rays = []
    for a in angs:
        L = ray_end(a) * 1.02
        pts = [(ix, iy)]; r = 0
        while r < L:
            r = min(L, r + rnd.uniform(14, 30))
            aa = a + rnd.uniform(-.07, .07)
            pts.append((ix + math.cos(aa) * r, iy + math.sin(aa) * r))
        rays.append(pts)
    def at_r(ray, r):
        for i in range(1, len(ray)):
            if math.dist(ray[0], ray[i]) >= r: return ray[i]
        return ray[-1]
    rings = [rnd.uniform(18, 26), rnd.uniform(52, 64), rnd.uniform(110, 130)]
    p = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" preserveAspectRatio="none">']
    # cacos faltando (buracos escuros) e cacos com reflexo, entre anéis
    for j in rnd.sample(range(n), 4):
        r0, r1 = rings[0], rings[1] if rnd.random() < .6 else rings[2]
        a, b = rays[j], rays[(j + 1) % n]
        poly = [at_r(a, r0), at_r(a, r1), at_r(b, r1), at_r(b, r0)]
        d = 'M' + ' L'.join(f'{f(x)} {f(y)}' for x, y in poly) + 'Z'
        p.append(f'<path d="{d}" fill="#030303" fill-opacity=".88"/>')
    for j in rnd.sample(range(n), 3):
        a, b = rays[j], rays[(j + 1) % n]
        poly = [at_r(a, rings[1]), at_r(a, rings[2]), at_r(b, rings[2]), at_r(b, rings[1])]
        d = 'M' + ' L'.join(f'{f(x)} {f(y)}' for x, y in poly) + 'Z'
        p.append(f'<path d="{d}" fill="#fff" fill-opacity=".06"/>')
    lines = []
    for ray in rays:
        lines.append('M' + ' L'.join(f'{f(x)} {f(y)}' for x, y in ray))
    for r in rings:
        ring = [at_r(ray, r + rnd.uniform(-4, 4)) for ray in rays] + [at_r(rays[0], r)]
        lines.append('M' + ' L'.join(f'{f(x)} {f(y)}' for x, y in ring))
    d = ' '.join(lines)
    p.append(f'<path d="{d}" fill="none" stroke="#0a090b" stroke-width="2.4" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>')
    p.append(f'<path d="{d}" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width=".8" transform="translate(.9 .6)" vector-effect="non-scaling-stroke"/>')
    p.append(f'<circle cx="{f(ix)}" cy="{f(iy)}" r="5" fill="#030303"/>')
    p.append('</svg>')
    return ''.join(p)

files = {
    'rosacea.svg': rosacea(),
    'divisor-vinhas.svg': divisor(),
    'vidro-quebrado.svg': quebrado(),
}
for name, svg in files.items():
    with open(os.path.join(OUT, name), 'w') as fh:
        fh.write(svg)
    print(name, len(svg), 'bytes')
