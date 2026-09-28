"""Prepara uma moldura de janela gótica para a wiki.

Entrada: PNG 2:3 (ex.: 1536x2304) com o vão central e o fundo transparentes.
Saída (nesta pasta):
  <nome>.webp      960px de largura (artigo)
  <nome>-sm.webp   480px de largura (cards da galeria, miniaturas)
  <nome>-vao.png   máscara do vão (alfa = onde o retrato aparece)

Antes, a janela é normalizada: recortada pelo contorno e colocada na mesma
altura e na mesma base de todas as outras, para que fiquem proporcionais lado a
lado. Se o desenho vier mais estreito que os demais, --alargar-vao estica só o
vidro entre as colunas e o ornamento central.

A máscara é o preenchimento da área transparente a partir do centro, depois de
"fechar" as frestas da moldura; por isso funciona com bordas irregulares
(vitrais quebrados). Use --fechar maior se o vão escapar por buracos da moldura.

Uso:
  python3 processar_moldura.py origem.png janela-nome [--fechar 7] [--alargar-vao 1.3]
Depois, registre a moldura em VT_FRAMES (vitral.jsx).
"""
import argparse
import os

from PIL import Image, ImageDraw, ImageFilter

MW, MH = 480, 720
W, H = 1536, 2304
TARGET_H = 2250   # altura da janela normalizada (sem o brilho)
BOTTOM = 2280     # base de todas as janelas na mesma linha


def frame_bbox(im):
    """Contorno da janela (ignora o brilho suave em volta)."""
    return im.getchannel('A').point(lambda v: 255 if v > 90 else 0).getbbox()


def widen(im, factor, center_keep=0.14, zone=(0.30, 0.70)):
    """Alarga o vão esticando só as faixas entre as colunas e o ornamento central,
    sem deformar colunas, rosas das laterais nem o fecho do arco."""
    w, h = im.size
    c0, c1 = int(w * (.5 - center_keep / 2)), int(w * (.5 + center_keep / 2))
    a0, a1 = int(w * zone[0]), int(w * zone[1])
    stretch = ((c0 - a0) + (a1 - c1) + (a1 - a0) * (factor - 1)) / ((c0 - a0) + (a1 - c1))
    pieces = [(0, a0, False), (a0, c0, True), (c0, c1, False), (c1, a1, True), (a1, w, False)]
    out = Image.new('RGBA', (int(round(w + (a1 - a0) * (factor - 1))) + 2, h), (0, 0, 0, 0))
    x = 0
    for x0, x1, s in pieces:
        p = im.crop((x0, 0, x1, h))
        if s:
            p = p.resize((int(round((x1 - x0) * stretch)), h), Image.LANCZOS)
        out.paste(p, (x, 0))
        x += p.size[0]
    return out.crop((0, 0, x, h))


def normalize(im, widen_factor=None):
    """Recorta a janela, põe todas na mesma altura e na mesma base, centralizada."""
    fr = im.crop(frame_bbox(im))
    if widen_factor and widen_factor != 1:
        fr = widen(fr, widen_factor)
    s = TARGET_H / fr.size[1]
    fr = fr.resize((int(fr.size[0] * s), TARGET_H), Image.LANCZOS)
    out = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    out.paste(fr, ((W - fr.size[0]) // 2, BOTTOM - TARGET_H), fr)
    return out


def hole_mask(im, close):
    a = im.getchannel('A').resize((MW, MH), Image.LANCZOS)
    barrier = a.point(lambda v: 255 if v > 60 else 0)
    for _ in range(close // 2):
        barrier = barrier.filter(ImageFilter.MaxFilter(3))
    # preenche o vão a partir de um ponto um pouco abaixo do centro (o arco fica em cima)
    fill = Image.new('L', (MW + 2, MH + 2), 0)
    fill.paste(barrier, (1, 1))
    ImageDraw.floodfill(fill, (MW // 2 + 1, int(MH * .55) + 1), 128, thresh=0)
    region = fill.crop((1, 1, MW + 1, MH + 1)).point(lambda v: 255 if v == 128 else 0)
    # cresce o vão de volta por baixo do metal, para não sobrar fresta entre retrato e moldura
    for _ in range(close // 2 + 2):
        region = region.filter(ImageFilter.MaxFilter(3))
    region = region.filter(ImageFilter.GaussianBlur(.8))
    bbox = region.getbbox()
    leaks = bool(bbox) and (bbox[0] <= 1 or bbox[1] <= 1 or bbox[2] >= MW - 1 or bbox[3] >= MH - 1)
    return region, bbox, leaks


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('origem')
    ap.add_argument('nome')
    ap.add_argument('--fechar', type=int, default=7, help='px (na escala 480x720) para fechar frestas')
    ap.add_argument('--alargar-vao', type=float, default=1.0,
                    help='alarga o vão (ex.: 1.3) para molduras desenhadas mais estreitas que as outras')
    ap.add_argument('--sem-normalizar', action='store_true',
                    help='usa a imagem como veio, sem igualar altura e base às outras molduras')
    args = ap.parse_args()
    out = os.path.dirname(os.path.abspath(__file__))
    im = Image.open(args.origem).convert('RGBA')
    if not args.sem_normalizar:
        im = normalize(im, args.alargar_vao)
    for w, suf in ((960, ''), (480, '-sm')):
        im.resize((w, w * 3 // 2), Image.LANCZOS).save(os.path.join(out, args.nome + suf + '.webp'),
                                                       'WEBP', quality=84, method=6)
    region, bbox, leaks = hole_mask(im, args.fechar)
    white = Image.new('L', (MW, MH), 255)
    Image.merge('LA', (white, region)).save(os.path.join(out, args.nome + '-vao.png'), optimize=True)
    l, t, r, b = bbox
    box = [round(l / MW * 100, 1), round(t / MH * 100, 1), round(100 - r / MW * 100, 1), round(100 - b / MH * 100, 1)]
    print(f"{args.nome}: box: {box}   (use em VT_FRAMES)"
          + ('  ATENÇÃO: o vão encosta na borda — aumente --fechar' if leaks else ''))


if __name__ == '__main__':
    main()
