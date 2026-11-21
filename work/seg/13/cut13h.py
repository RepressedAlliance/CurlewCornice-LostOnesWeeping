"""Segment 13 full cut, round h (art/design/prompts/_make_seg13h.py): prepare the new drawings for the page.

- h13h_slap: as cut13f's plain hands (dehalo, palm centroid).
- r13h_face, r13h_face_up: as cut13f's faces (dehalo, the eraser sleeve measured, the fingers over it as an overlay).
- p13h_essay: the six-year-old's pencil handwriting on the film's grid. The teal grid is found and dropped (the page draws its
  own grid), the paper white goes, the pencil's darkness becomes graphite alpha (like desk13.pencilize), and the grid area
  (7 x 12 cells) is cropped exactly. Codex drew the hung 。 after the last す as a mark at the cell's upper right (it read as
  す゜): that mark is moved, as drawn, to the lower right of the cell where a hung 。 sits.
Writes art/cut/p13h_essay_hand.png (RGBA, grid area, cell = 120 px) and adds the faces/hand to art/cut/seg13f_anchors.json.
usage: python work/seg/13/cut13h.py
"""
import json, os, sys
import numpy as np
from PIL import Image
from scipy import ndimage

sys.path.insert(0, os.path.dirname(__file__))
import cut13f  # noqa: E402

OUT, CUT, ANP = cut13f.OUT, cut13f.CUT, cut13f.ANP


def essay():
    a = np.array(Image.open(os.path.join(OUT, 'p13h_essay.png')).convert('RGB')).astype(float)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    teal = (b > r + 40) & (g > r + 30)
    cols = np.nonzero(teal.sum(0) > 700)[0]; rows = np.nonzero(teal.sum(1) > 400)[0]
    x0, x1, y0, y1 = int(cols.min()), int(cols.max()), int(rows.min()), int(rows.max())
    # the pencil only: luminance -> darkness; teal (and its anti-aliased edge) is not pencil
    lum = (0.3 * r + 0.59 * g + 0.11 * b) / 255
    sat = (np.maximum(np.maximum(r, g), b) - np.minimum(np.minimum(r, g), b)) / 255
    tealish = ndimage.binary_dilation(teal, iterations=2) & (sat > 0.08)
    dark = np.clip((0.95 - lum) * 1.35, 0, 1)
    dark[tealish] = 0
    # the grid lines cross the strokes: where a line was, take the darkness from the pixels beside it (no white gaps)
    line = ndimage.binary_dilation(teal, iterations=2)
    filled = ndimage.grey_dilation(np.where(line, 0, dark), size=(5, 5))
    dark = np.where(line, np.minimum(filled, ndimage.uniform_filter(np.where(line, 0, dark), 7) * 2.2), dark)
    # Codex's pencil is beaded (dark and light dashes along each stroke): soften it a little so it reads as one pressed stroke
    # (the beads become one stroke: a smooth stroke mask from the blurred darkness, its tone a little uneven along it)
    m = ndimage.gaussian_filter(dark, 1.8)
    t = np.clip((m - 0.10) / 0.22, 0, 1); stroke = t * t * (3 - 2 * t)
    dark = np.clip(stroke * (0.70 + 0.30 * np.clip(ndimage.gaussian_filter(dark, 3.0) * 1.6, 0, 1)), 0, 1)
    al = (dark * 255).astype(np.uint8)
    crop = al[y0:y1 + 1, x0:x1 + 1]
    H, W = crop.shape
    cs_x, cs_y = W / 7, H / 12
    # the last cell (column 7 = leftmost, row 12): move the mark at its upper right to the lower right
    cx0, cy0 = 0, int(11 * cs_y)
    cell = crop[cy0:int(12 * cs_y), cx0:int(cs_x)].copy()
    ch, cw = cell.shape
    zone = np.zeros_like(cell, bool); zone[4:int(ch * 0.42), int(cw * 0.58):cw - 4] = True
    lab, n = ndimage.label((cell > 40) & zone)
    if n:
        sizes = ndimage.sum(np.ones_like(lab), lab, range(1, n + 1)); k = 1 + int(np.argmax(sizes))
        m = ndimage.binary_dilation(lab == k, iterations=2)
        ys, xs = np.nonzero(m)
        mark = np.where(m, cell, 0)[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
        cell[m] = 0
        ty, tx = int(ch * 0.66), int(cw * 0.70)
        hh, ww = mark.shape
        cell[ty:ty + hh, tx:tx + ww] = np.maximum(cell[ty:ty + hh, tx:tx + ww], mark[:ch - ty, :cw - tx])
        crop[cy0:cy0 + ch, cx0:cx0 + cw] = cell
    rgba = np.zeros((H, W, 4), np.uint8); rgba[..., 0], rgba[..., 1], rgba[..., 2] = 40, 40, 46; rgba[..., 3] = crop
    Image.fromarray(rgba).save(os.path.join(CUT, 'p13h_essay_hand.png'))
    return {'grid': [x0, y0, x1, y1], 'cell': [cs_x, cs_y]}


if __name__ == '__main__':
    AN = json.load(open(ANP))
    AN['p13h_essay'] = essay(); print('p13h_essay', AN['p13h_essay'])
    for n in sys.argv[1:] or ['h13h_slap', 'r13h_face', 'r13h_face_up']:
        if not os.path.exists(os.path.join(OUT, n + '.png')): print('missing', n); continue
        AN[n] = cut13f.plain_hand(n) if n.startswith('h13') else cut13f.face(n)
        print(n, json.dumps(AN[n]))
    json.dump(AN, open(ANP, 'w'), indent=1)
