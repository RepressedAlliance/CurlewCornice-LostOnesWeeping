"""Segment 11, third round (2026-11-21, 根因清单「笔芯和笔不对了……」): every part the page draws on a drawing, measured on THAT
drawing's own pixels, written to art/cut/seg11_parts.json (web/lib/parts.js format: drawing -> part).

  h11_write  tip   the drawn pencil point (the written stroke starts here); cuff  the white shirt cuff's centroid
  h11_turn   cuff  (the in-between is placed by its cuff on h11_write's cuff: the three hand drawings share the wrist)
  h11_rub    pad   the thumb point that rubs;                                   cuff
  r11_id_a, r11_id_b, r11_cb, r11_cb_grip, p11_trio3, r11_row6
             cards [{rect, mask}] each blank card's rectangle and fill mask, as measured on this drawing (anchors_f.py)

Hand-read points are kept only if they sit on the drawing's own pixels (pencil point: dark; thumb: skin); the cuff is measured.
No drawing pixel is changed."""
import json, os
import numpy as np
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
CUT = os.path.join(ROOT, 'art', 'cut')
AN = json.load(open(os.path.join(CUT, 'seg11_anchors.json')))

def rgba(n): return np.array(Image.open(os.path.join(CUT, n + '.png')).convert('RGBA')).astype(int)

def cuff(a):
    wh = (a[..., 3] > 200) & (a[..., :3].min(-1) > 215) & ((a[..., :3].max(-1) - a[..., :3].min(-1)) < 30)
    ys, xs = np.nonzero(wh[780:960]); ys = ys + 780
    return [round(float(xs.mean()), 1), round(float(ys.mean()), 1)]

def near(a, x, y, cls, r=2):
    for dy in range(-r, r + 1):
        for dx in range(-r, r + 1):
            p = a[y + dy, x + dx]
            if cls(p): return True
    return False

dark = lambda p: p[3] > 200 and max(p[:3]) < 80
skin = lambda p: p[3] > 200 and p[0] > 225 and 28 <= p[0] - p[1] <= 50 and 8 <= p[1] - p[2] <= 27

out = {}
w, t, r = rgba('h11_write'), rgba('h11_turn'), rgba('h11_rub')
tip = AN['h11_write']['tip']; assert near(w, tip[0], tip[1], dark), 'h11_write tip is not on the pencil point'
pad = AN['h11_rub']['tip']; assert near(r, pad[0], pad[1], skin, 3), 'h11_rub pad is not on the thumb'
out['h11_write'] = {'tip': {'point': tip}, 'cuff': {'point': cuff(w)}}
out['h11_turn'] = {'cuff': {'point': cuff(t)}}
out['h11_rub'] = {'pad': {'point': pad}, 'cuff': {'point': cuff(r)}}
for n in ['r11_id_a', 'r11_id_b', 'r11_cb', 'r11_cb_grip', 'p11_trio3', 'r11_row6']:
    out[n] = {'cards': [{'rect': c['rect'], 'mask': c['mask']} for c in AN[n]]}
json.dump(out, open(os.path.join(CUT, 'seg11_parts.json'), 'w'), indent=1)
print(json.dumps({k: {p: (v[p].get('point') if 'point' in v[p] else len(v[p]) if isinstance(v[p], list) else v[p]) for p in v} for k, v in out.items()}))
