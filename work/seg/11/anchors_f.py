"""Segment 11 (finished): measure the drawings in art/cut (no pixel of a drawing is changed).
Adds to art/cut/seg11_anchors.json, keeping the sample's entries: each blank card's rectangle and fill mask
(art/cut/seg11_<drawing>_card<i>.png) for r11_id_a, r11_id_b, p11_trio2, r11_row3; her face box in r11_id_a (for the reading
marks of S2); the thumb pad of h11_rub (the point that rubs) and the pencil tip of h11_write."""
import json, os, sys
import numpy as np
from PIL import Image
from collections import deque
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
CUT = os.path.join(ROOT, 'art', 'cut')

def paperish(a):
    r, g, b, al = [a[..., i].astype(int) for i in range(4)]
    mx, mn = np.maximum(np.maximum(r, g), b), np.minimum(np.minimum(r, g), b)
    return (mn > 196) & (mx - mn < 26) & (al > 200)

def card(name, seed):
    a = np.array(Image.open(os.path.join(CUT, name + '.png')).convert('RGBA')); ok = paperish(a); H, W = ok.shape
    sx, sy = seed
    if not ok[sy, sx]: raise SystemExit(f'{name}: seed {seed} is not on the card paper')
    x0 = sx
    while x0 > 0 and ok[sy, x0 - 1]: x0 -= 1
    x1 = sx
    while x1 < W - 1 and ok[sy, x1 + 1]: x1 += 1
    vx = int(x0 + (x1 - x0) * 0.3)
    y0 = sy
    while y0 > 0 and ok[y0 - 1, vx]: y0 -= 1
    y1 = sy
    while y1 < H - 1 and ok[y1 + 1, vx]: y1 += 1
    m = np.zeros_like(ok); q = deque([(sx, sy)]); m[sy, sx] = True
    X0, X1, Y0, Y1 = x0 - 3, x1 + 3, y0 - 3, y1 + 3
    while q:
        x, y = q.popleft()
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if X0 <= nx <= X1 and Y0 <= ny <= Y1 and not m[ny, nx] and ok[ny, nx]: m[ny, nx] = True; q.append((nx, ny))
    g = m.copy(); g[1:] |= m[:-1]; g[:-1] |= m[1:]; g[:, 1:] |= m[:, :-1]; g[:, :-1] |= m[:, 1:]
    return {'rect': [int(x0), int(y0), int(x1 + 1), int(y1 + 1)], 'fill': float(m.sum()) / ((x1 - x0 + 1) * (y1 - y0 + 1))}, g

path = os.path.join(CUT, 'seg11_anchors.json')
out = json.load(open(path))
SEEDS = json.loads(sys.argv[1]) if len(sys.argv) > 1 else {}
for name, seeds in SEEDS.items():
    out[name] = []
    for i, s in enumerate(seeds):
        info, m = card(name, s)
        al = (m * 255).astype(np.uint8); im = np.zeros(m.shape + (4,), np.uint8); im[..., :3] = 255; im[..., 3] = al
        Image.fromarray(im).save(os.path.join(CUT, f'seg11_{name}_card{i}.png'))
        info['mask'] = f'/art/cut/seg11_{name}_card{i}.png'; out[name].append(info); print(name, i, info)

def skin(a):
    r, g, b, al = [a[..., i].astype(int) for i in range(4)]
    return (r > 225) & (g > 190) & (g < 235) & (b > 165) & (b < 215) & (r - b > 20) & (al > 200)

# her face in r11_id_a: the skin of the face (above the shirt collar), its bounding box
if os.path.exists(os.path.join(CUT, 'r11_id_a.png')) and 'r11_id_a_face' not in out:   # set by hand after the first run: [398, 372, 628, 602] (the skin box takes the ears and neck)
    a = np.array(Image.open(os.path.join(CUT, 'r11_id_a.png')).convert('RGBA')); s = skin(a)
    H = s.shape[0]; s[int(H * 0.45):] = False                          # hands are below
    ys, xs = np.where(s)
    out['r11_id_a_face'] = [int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())]; print('face', out['r11_id_a_face'])
# the thumb pad of h11_rub: the skin furthest up-left (x + y smallest)
if os.path.exists(os.path.join(CUT, 'h11_rub.png')):
    a = np.array(Image.open(os.path.join(CUT, 'h11_rub.png')).convert('RGBA')); s = skin(a)
    ys, xs = np.where(s); k = np.argmin(xs + ys)
    out['h11_rub'] = {'tip': [int(xs[k]) + 14, int(ys[k]) + 14], 'size': [a.shape[1], a.shape[0]]}; print('thumb', out['h11_rub'])
json.dump(out, open(path, 'w'), indent=1)
