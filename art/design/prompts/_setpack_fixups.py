"""Deterministic finishing steps for the set-pack fixes of round 3 (2026-11-20), applied to chosen Codex sheets in art/design/out.
Each step only measures, crops, scales or extends what Codex drew; nothing is repainted by hand.

- eraser: sp_eraser_c's view (3) shows the rounded rubber ends at the canvas edges; the design says they are outside the frame (the
  08a vertical-strip framing). Crop the whole sheet to the straight part of view (3) (views 1 and 2 are untouched).
- leadholder: sp_leadholder_c draws the lead 2.2 cm long; the design says 3.5 cm (a quarter of the 13.5 cm pencil). Extend the row-2
  lead (a plain uniform rod, so repeating one column is exact), then scale rows 1-2 down together so the longer pencil fits;
  in row 3 (the front end enlarged) the lead is carried on to the right edge, since 3.5 cm at that size is longer than the canvas.
- lespaul: tools/lespaul_refit.py on sp_lespaul_c (real fret geometry; see that file).
usage: python art/design/prompts/_setpack_fixups.py   -> writes sp_eraser_c_crop.png, sp_leadholder_c_fix.png, sp_lespaul_c_refit.png
"""
import os, subprocess, sys
import numpy as np
from PIL import Image

here = os.path.dirname(os.path.abspath(__file__))
out = os.path.join(here, '..', 'out')
root = os.path.join(here, '..', '..', '..')


def eraser():
    im = Image.open(os.path.join(out, 'sp_eraser_c.png')).convert('RGBA')
    a = np.asarray(im)[..., 3]
    w = np.array([(a[y, 1100:] > 128).sum() for y in range(im.height)])
    sleeve = np.nonzero(w >= 0.97 * w.max())[0]              # the sleeve is a little wider than the rubber
    s0, s1 = sleeve.min(), sleeve.max()
    rub = np.median(w[s0 - 40:s0 - 5])                        # straight rubber width just above the sleeve
    top = s0 - 1
    while w[top - 1] >= rub - 3:                               # straight rubber, before the end starts to round off
        top -= 1
    bot = s1 + 1
    while w[bot + 1] >= rub - 3:
        bot += 1
    margin = min(s0 - top, bot - s1)                           # same amount of straight rubber above and below
    box = (0, s0 - margin, im.width, s1 + margin)
    im.crop(box).save(os.path.join(out, 'sp_eraser_c_crop.png'))
    print('eraser: crop rows', box[1], box[3], 'of', im.height)


def leadholder():
    im = np.asarray(Image.open(os.path.join(out, 'sp_leadholder_c.png')).convert('RGBA')).copy()
    a = im[..., 3]
    rows = np.nonzero((a > 128).any(1))[0]
    bands, s, p = [], rows[0], rows[0]
    for y in rows[1:]:
        if y - p > 5:
            bands.append((s, p)); s = y
        p = y
    bands.append((s, p))
    (r1a, r1b), (r2a, r2b) = bands[0], bands[1]
    x1 = np.nonzero((a[r1a:r1b + 1] > 128).any(0))[0]
    x2 = np.nonzero((a[r2a:r2b + 1] > 128).any(0))[0]
    pencil = x1.max() - x1.min()                               # row 1: the whole pencil, lead retracted (13.5 cm)
    px_cm = pencil / 13.5
    lead_now = x2.max() - x1.max()
    add = int(round(3.5 * px_cm - lead_now))
    cut = x1.max() + (x2.max() - x1.max()) // 2                 # a column in the middle of the exposed lead
    band = im[r2a - 4:r2b + 5]
    band = np.concatenate([band[:, :cut], np.repeat(band[:, cut:cut + 1], add, axis=1), band[:, cut:]], axis=1)
    wide = np.zeros((im.shape[0], im.shape[1] + add, 4), np.uint8)
    wide[:, :im.shape[1]] = im
    wide[r2a - 4:r2b + 5] = 0
    wide[r2a - 4:r2b + 5, :band.shape[1]] = band
    # scale rows 1-2 together about the pencils' left end so the longer one fits with the old right margin
    y0, y1 = r1a - 20, r2b + 20
    f = (im.shape[1] - (im.shape[1] - x2.max()) - x1.min()) / (x2.max() + add - x1.min())
    seg = Image.fromarray(wide[y0:y1])
    seg = seg.resize((round(seg.width * f), round(seg.height * f)), Image.LANCZOS)
    res = im.copy()
    res[y0:y1] = 0
    cy = (y0 + y1) / 2
    ny0 = int(round(cy - seg.height / 2))
    ox = int(round(x1.min() - x1.min() * f))
    # row 3 (the front end, ~2.2x): at that size 3.5 cm of lead is longer than the canvas, so the lead must run off the right
    # edge; Codex ended it inside the frame. Repeat a middle lead column out to the edge (removes the drawn end cap).
    r3a, r3b = bands[2]
    x3 = np.nonzero((a[r3a:r3b + 1] > 128).any(0))[0]
    lead_rows = [y for y in range(r3a, r3b + 1) if a[y, x3.max() - 60] > 128]
    la, lb = min(lead_rows) - 2, max(lead_rows) + 3
    mid = x3.max() - 150
    res[la:lb, mid:] = np.repeat(im[la:lb, mid:mid + 1], im.shape[1] - mid, axis=1)
    canvas = Image.fromarray(res)
    canvas.alpha_composite(seg, (ox, ny0))
    canvas.save(os.path.join(out, 'sp_leadholder_c_fix.png'))
    print(f'leadholder: pencil {pencil}px = 13.5 cm, lead {lead_now}px -> {lead_now + add}px (3.5 cm), rows 1-2 scaled {f:.3f}')


def lespaul():
    r = subprocess.run([sys.executable, os.path.join(root, 'tools', 'lespaul_refit.py'), os.path.join(out, 'sp_lespaul_c.png'),
                        os.path.join(out, 'sp_lespaul_c_refit.png'), '--nut', '197', '--board-end', '599'],
                       capture_output=True, text=True)
    print(r.stdout.strip() or r.stderr.strip())


eraser()
leadholder()
lespaul()
