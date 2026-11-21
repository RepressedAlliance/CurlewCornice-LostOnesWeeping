"""Find and remove background holes enclosed inside a cut-out figure.

cutout.py removes only the white background that touches the sheet border, so white background enclosed
by the figure (between an arm and the body, between a hand and a guitar) stays opaque and shows as a white
patch in the scene. Garment whites cannot be told from it by colour alone (a name card is the same paper
white), so this tool lists the candidates and draws a numbered preview; the holes to remove are chosen by
looking at the preview.

usage:
  python tools/fill_holes.py art/cut/name.png                 list candidates, write art/cut/_holes/name.png
  python tools/fill_holes.py art/cut/name.png --remove 1,3    make candidates 1 and 3 transparent (in place,
                                                              the original is kept as art/cut/_holes/name.orig.png)
"""
import sys, os, shutil
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy import ndimage

src = sys.argv[1]
remove = None
if '--remove' in sys.argv:
    remove = [int(k) for k in sys.argv[sys.argv.index('--remove') + 1].split(',')]
min_area = int(sys.argv[sys.argv.index('--min') + 1]) if '--min' in sys.argv else 150

im = np.asarray(Image.open(src).convert('RGBA')).astype(np.float32) / 255.0
rgb, a = im[..., :3], im[..., 3]
mn, mx = rgb.min(2), rgb.max(2)
white = (mn >= 248 / 255) & (mx - mn <= 7 / 255) & (a > 0.8)
lab, n = ndimage.label(white)
areas = ndimage.sum(white, lab, range(1, n + 1))
cands = sorted([(int(s), i + 1) for i, s in enumerate(areas) if s >= min_area], reverse=True)

outdir = os.path.join(os.path.dirname(src), '_holes')
os.makedirs(outdir, exist_ok=True)
name = os.path.splitext(os.path.basename(src))[0]

if remove is None:
    # preview: the figure over a mid grey, candidates in magenta with their number
    h, w = a.shape
    bg = np.full((h, w, 3), 0.55, np.float32)
    comp = rgb * a[..., None] + bg * (1 - a[..., None])
    for k, (s, l) in enumerate(cands):
        comp[lab == l] = [1.0, 0.0, 1.0]
    pim = Image.fromarray((comp * 255).astype(np.uint8))
    d = ImageDraw.Draw(pim)
    try:
        font = ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf', max(18, w // 30))
    except OSError:
        font = None
    for k, (s, l) in enumerate(cands):
        ys, xs = np.nonzero(lab == l)
        cx, cy = int(xs.mean()), int(ys.mean())
        d.text((cx + 6, cy - 10), str(k + 1), fill=(255, 255, 0), font=font, stroke_width=3, stroke_fill=(0, 0, 0))
        print(f'{k + 1}: area {s} centre ({cx},{cy}) bbox x {xs.min()}-{xs.max()} y {ys.min()}-{ys.max()}')
    out = os.path.join(outdir, name + '.png')
    pim.save(out)
    print('preview', out)
else:
    keep = os.path.join(outdir, name + '.orig.png')
    if not os.path.exists(keep):
        shutil.copy2(src, keep)
    hole = np.zeros_like(white)
    for k in remove:
        hole |= lab == cands[k - 1][1]
    # the anti-aliased rim of each hole: un-mix from white, as cutout.py does on the outer edge
    rim = ndimage.binary_dilation(hole, iterations=2) & ~hole & (a > 0)
    dark = 1.0 - mn
    a2 = a.copy()
    a2[hole] = 0.0
    a2[rim] = np.minimum(a[rim], np.clip(dark[rim] / 0.35, 0, 1))
    out_rgb = rgb.copy()
    m = rim & (a2 > 0.02) & (a2 < 1)
    out_rgb[m] = np.clip((rgb[m] - (1 - a2[m, None])) / a2[m, None], 0, 1)
    # defringe the rim: semi-transparent pixels take the colour of the nearest solid pixel
    solid = a2 >= 0.98
    if solid.any():
        _, (iy, ix) = ndimage.distance_transform_edt(~solid, return_indices=True)
        e = rim & (a2 > 0) & (a2 < 0.98)
        out_rgb[e] = out_rgb[iy[e], ix[e]]
    res = np.dstack([out_rgb, a2])
    Image.fromarray((res * 255 + 0.5).astype(np.uint8), 'RGBA').save(src)
    print('removed', remove, 'from', src, '(original kept as', keep + ')')
