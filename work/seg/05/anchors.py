"""Segment 05: copy the chosen drawings into art/cut and write art/cut/seg05_anchors.json.
Measured: the alpha box of every drawing (bbox), its bottom row (feet) and the centre column of its lowest rows (cx, footX).
Set by hand after looking at the drawing (work/seg/05/anchors_manual.json): pxPerCm, scale, headX, card corners, strings, keep
boxes (head, bow, headstock regions that the glyphs must not cover).
usage: python work/seg/05/anchors.py
"""
import json, os, shutil, subprocess, sys
import numpy as np
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
NAMES = ['s05_back_full', 's05_pluck', 's05_aim', 's05_sneer', 's05_ots', 's05_tilt', 'a05_front_full', 'a05_front_waist', 'a05_shout', 'a05_toss',
         's05_strike', 's05_throw', 's05_cold']
# the S4 drawings: boxes the glyphs must keep clear of, measured from the alpha (the head and bow: everything right of x 450 above
# y 760; the headstock and the raised left hand: everything left of x 450 above y 640)
KEEP_AUTO = ('s05_ots', 's05_strike', 's05_throw')
man = json.load(open(os.path.join(os.path.dirname(__file__), 'anchors_manual.json'), encoding='utf-8'))
out = {}
for n in NAMES:
    src = os.path.join(ROOT, 'art', 'design', 'out', n + '.png')
    if not os.path.exists(src):
        continue
    dst = os.path.join(ROOT, 'art', 'cut', n + '.png')
    if not os.path.exists(dst) or os.path.getmtime(dst) < os.path.getmtime(src):
        subprocess.run([sys.executable, os.path.join(ROOT, 'tools', 'alpha_clean.py'), src, dst], check=True)
        sh = man.get(n, {}).get('shift')
        if sh:   # register a swap onto its master (measured with work/seg/05/align.py): a plain translation, no pixels changed
            im0 = Image.open(dst).convert('RGBA'); c = Image.new('RGBA', im0.size, (0, 0, 0, 0)); c.paste(im0, (sh[0], sh[1])); c.save(dst)
    im = np.array(Image.open(dst).convert('RGBA'))
    a = im[:, :, 3] > 128
    ys, xs = np.nonzero(a)
    d = {'w': im.shape[1], 'h': im.shape[0], 'bbox': [int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())]}
    d['feet'] = int(ys.max())
    low = a[max(0, ys.max() - 40):ys.max() + 1]
    lx = np.nonzero(low.any(axis=0))[0]
    d['footX'] = float(lx.mean()) if len(lx) else float(xs.mean())
    cols = np.nonzero(a[ys.min():ys.min() + int((ys.max() - ys.min()) * 0.5)].any(axis=0))[0]
    d['cx'] = float(np.median(xs))
    d['headX'] = float(xs[ys < ys.min() + 60].mean())
    if n in KEEP_AUTO:
        def box(m):
            yy, xx = np.nonzero(m); return [int(xx.min()), int(yy.min()), int(xx.max()), int(yy.max())]
        hm = np.zeros_like(a); hm[:760, 450:] = a[:760, 450:]
        sm = np.zeros_like(a); sm[:640, :450] = a[:640, :450]
        d['keep'] = {'head and bow': box(hm), 'headstock': box(sm)}
    d.update(man.get(n, {}))
    out[n] = d
    print(n, d['w'], d['h'], d['bbox'], 'opaque corners:', int(a[0, 0]), int(a[0, -1]), int(a[-1, 0]), int(a[-1, -1]))
json.dump(out, open(os.path.join(ROOT, 'art', 'cut', 'seg05_anchors.json'), 'w', encoding='utf-8'), indent=1)
