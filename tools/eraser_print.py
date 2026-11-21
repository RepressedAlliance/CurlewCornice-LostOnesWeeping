"""Set the print on the machine's big eraser sleeve (set pack round 4, 2026-11-20, second art review).

Generated dot-matrix lettering is never on a fixed grid, and it differs between the views of one sheet (review: 「機」 a cluster of
misplaced dots, the 言 of 「読」 malformed, the standing view's glyphs a separate generation). So the sheets are drawn with a BLANK
sleeve (only its thin printed border) and the print is set here, the way the film's other machine print is set (print.js):
  - 「読取機用」 in DotGothic16 at 16 x 16 cells (the reading machine's 16-dot head), every lit cell one round teal dot on a fixed
    grid; below it a row of six separate solid teal squares (timing marks), all teal #218EA3, no black;
  - the layout is in grid cells relative to the sleeve's long side (110 cells), so every view carries the identical print at its
    own scale: a lying view as is; a standing view (the lying view turned 90 degrees clockwise) gets the same layer turned 90
    degrees clockwise (the text lies on its side, read top to bottom with the glyph tops to the right, the squares a column on the
    left).
The sleeve's inner border is found by scanning outward from a seed point inside it for the first dark (border) pixel.
usage: python tools/eraser_print.py in.png out.png [--lying X,Y] ... [--standing X,Y] ...
"""
import os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
TEAL = (0x21, 0x8E, 0xA3)
TEXT = '読取機用'
CELLS_LONG = 110                      # the sleeve's inner length in grid cells
GAP = 2                               # cells between glyphs
SQ, SQ_PITCH = 3, 12                  # timing marks: 3 x 3 cells, 12 cells apart
TEXT_SQ_GAP = 4
SS = 4                                # supersampling for the round dots


def glyph_cells():
    f = ImageFont.truetype(os.path.join(ROOT, 'assets', 'fonts', 'DotGothic16-Regular.ttf'), 16)
    cols = []
    for i, ch in enumerate(TEXT):
        g = Image.new('L', (16, 16), 0)
        d = ImageDraw.Draw(g)
        d.fontmode = '1'
        d.text((0, -4), ch, fill=255, font=f)
        cols.append(np.asarray(g) > 127)
        if i < len(TEXT) - 1:
            cols.append(np.zeros((16, GAP), bool))
    return np.concatenate(cols, axis=1)            # 16 x 70


def layer(long_px, short_px):
    """the print as an RGBA layer of the sleeve's inner size, lying (long side horizontal)"""
    k = long_px / CELLS_LONG
    cells = glyph_cells()
    gh, gw = cells.shape
    block_h = gh + TEXT_SQ_GAP + SQ
    W, H = int(round(long_px * SS)), int(round(short_px * SS))
    im = Image.new('L', (W, H), 0)
    d = ImageDraw.Draw(im)
    x0 = (CELLS_LONG - gw) / 2                      # in cells, text centred
    y0 = (short_px / k - block_h) / 2
    r = 0.45 * k * SS
    for cy, cx in zip(*np.nonzero(cells)):
        px, py = (x0 + cx + 0.5) * k * SS, (y0 + cy + 0.5) * k * SS
        d.ellipse([px - r, py - r, px + r, py + r], fill=255)
    span = 5 * SQ_PITCH + SQ
    sx0 = (CELLS_LONG - span) / 2
    sy = y0 + gh + TEXT_SQ_GAP
    for i in range(6):
        sx = sx0 + i * SQ_PITCH
        d.rectangle([sx * k * SS, sy * k * SS, (sx + SQ) * k * SS - 1, (sy + SQ) * k * SS - 1], fill=255)
    a = im.resize((int(round(long_px)), int(round(short_px))), Image.LANCZOS)
    out = Image.new('RGBA', a.size, TEAL + (0,))
    out.putalpha(a)
    return out, k


def inner_rect(arr, x, y):
    lum = arr[..., :3].astype(float) @ np.array([0.2126, 0.7152, 0.0722]) / 255
    dark = (lum < 0.72) & (arr[..., 3] > 128)

    def walk(dx, dy):
        cx, cy = x, y
        while not dark[cy, cx]:
            cx += dx; cy += dy
        return cx, cy
    l, r = walk(-1, 0)[0] + 1, walk(1, 0)[0]
    t, b = walk(0, -1)[1] + 1, walk(0, 1)[1]
    return l, t, r, b


def main():
    src, dst = sys.argv[1], sys.argv[2]
    img = Image.open(src).convert('RGBA')
    arr = np.asarray(img)
    seeds = []
    args = sys.argv[3:]
    for i in range(0, len(args), 2):
        x, y = map(int, args[i + 1].split(','))
        seeds.append((args[i], x, y))
    for kind, x, y in seeds:
        l, t, r, b = inner_rect(arr, x, y)
        w, h = r - l, b - t
        if kind == '--lying':
            lay, k = layer(w, h)
        else:
            lay, k = layer(h, w)
            lay = lay.rotate(-90, expand=True)     # clockwise: the text lies on its side, the squares go to the left
        img.alpha_composite(lay, (l, t))
        print(f'{kind[2:]}: sleeve inner {l},{t}-{r},{b} ({w}x{h}), grid {k:.2f} px/cell')
    img.save(dst)


main()
