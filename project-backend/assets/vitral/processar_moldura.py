"""Prepara uma moldura de janela gótica para a wiki.

Entrada: PNG 2:3 (ex.: 1536x2304) com o vão central e o fundo transparentes.
Saída (nesta pasta):
  <nome>.webp      960px de largura (artigo)
  <nome>-sm.webp   480px de largura (cards da galeria, miniaturas)
  <nome>-vao.png   máscara do vão (alfa = onde o retrato aparece)

A máscara é o preenchimento da área transparente a partir do centro, depois de
"fechar" as frestas da moldura; por isso funciona com bordas irregulares
(vitrais quebrados). Use --fechar maior se o vão escapar por buracos da moldura.

Uso:
  python3 processar_moldura.py origem.png janela-nome [--fechar 7]
Depois, registre a moldura em VT_FRAMES (vitral.jsx).
"""
import argparse
import os

from PIL import Image, ImageDraw, ImageFilter

MW, MH = 480, 720


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
    args = ap.parse_args()
    out = os.path.dirname(os.path.abspath(__file__))
    im = Image.open(args.origem).convert('RGBA')
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
