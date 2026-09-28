"""Prepara a moldura ornamental da ficha ("registro preservado do arquivo").

Entrada: PNG 3:2 (ex.: 2304x1536) com a moldura e o miolo transparentes.
1. Limpa a sujeira do recorte: mantém só a moldura (a maior peça conectada)
   e descarta pontinhos e halos soltos no miolo.
2. Fatia em peças para montar em qualquer tamanho sem deformar:
   cantos e ornamentos centrais (topo/base) ficam fixos; trilhos lisos repetem.
Saída: assets/vitral/ficha/<peça>.webp

Uso: python3 processar_ficha.py origem.png
As medidas abaixo são do PNG original 2304x1536; se a arte mudar, ajuste-as
(o CSS em styles-vitral.css usa as mesmas proporções: 540 / 604 / 520 / 480).
"""
import os
import sys

import numpy as np
from PIL import Image
from scipy import ndimage

W, H = 2304, 1536
CW = 540            # largura dos cantos
TH, BH = 520, 480   # altura da faixa de cima / de baixo
CX0, CX1 = 850, 1454  # ornamento central (topo e base)
RAIL_X = (600, 700)   # trecho liso do trilho de cima/baixo
RAIL_Y = (540, 600)   # trecho liso dos trilhos laterais
SCALE = 0.6           # resolução das peças (0.6 cobre telas 2x com a moldura a ~0.3)

PIECES = {
    'tl': (0, 0, CW, TH), 'tr': (W - CW, 0, W, TH),
    'bl': (0, H - BH, CW, H), 'br': (W - CW, H - BH, W, H),
    'top': (CX0, 0, CX1, TH), 'bottom': (CX0, H - BH, CX1, H),
    'rail-top': (RAIL_X[0], 0, RAIL_X[1], TH), 'rail-bottom': (RAIL_X[0], H - BH, RAIL_X[1], H),
    'rail-left': (0, RAIL_Y[0], CW, RAIL_Y[1]), 'rail-right': (W - CW, RAIL_Y[0], W, RAIL_Y[1]),
}


def clean(im):
    A = np.array(im.convert('RGBA'))
    solid = A[..., 3] > 40
    lab, n = ndimage.label(solid)
    sizes = ndimage.sum(solid, lab, range(1, n + 1))
    keep = np.isin(lab, [i + 1 for i, s in enumerate(sizes) if s > 20000])
    keep = ndimage.binary_dilation(keep, iterations=3)
    A[..., 3] = np.where(keep, A[..., 3], 0)
    return Image.fromarray(A)


def main():
    src = Image.open(sys.argv[1])
    if src.size != (W, H):
        src = src.resize((W, H), Image.LANCZOS)
    im = clean(src)
    out = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'ficha')
    os.makedirs(out, exist_ok=True)
    for name, box in PIECES.items():
        p = im.crop(box)
        p = p.resize((max(1, round(p.size[0] * SCALE)), max(1, round(p.size[1] * SCALE))), Image.LANCZOS)
        p.save(os.path.join(out, name + '.webp'), 'WEBP', quality=86, method=6)
    total = sum(os.path.getsize(os.path.join(out, f)) for f in os.listdir(out)) // 1024
    print(f'{len(PIECES)} peças em {out} ({total} KB)')


if __name__ == '__main__':
    main()
