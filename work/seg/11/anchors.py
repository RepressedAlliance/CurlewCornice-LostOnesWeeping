"""Segment 11 sample: measure the generated drawings (no pixel of a drawing is changed).
Writes art/cut/seg11_anchors.json: each blank card's rectangle (flood fill of the paper white from its centre, bounded by its
outline) and its fill mask art/cut/seg11_<drawing>_card<i>.png (white = card paper the film paints on, transparent elsewhere:
fingers, clip, outline stay the drawing's); the pencil tip of h11_write; the reader's slots and tray."""
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
    # the rectangle: walk out from the seed along its row and column to the outline
    x0 = sx; 
    while x0 > 0 and ok[sy, x0 - 1]: x0 -= 1
    x1 = sx
    while x1 < W - 1 and ok[sy, x1 + 1]: x1 += 1
    vx = int(x0 + (x1 - x0) * 0.3)          # off the centre line: the clip and its slot sit on it
    y0 = sy
    while y0 > 0 and ok[y0 - 1, vx]: y0 -= 1
    y1 = sy
    while y1 < H - 1 and ok[y1 + 1, vx]: y1 += 1
    # flood fill inside that rectangle (+3 px)
    m = np.zeros_like(ok); q = deque([(sx, sy)]); m[sy, sx] = True
    X0, X1, Y0, Y1 = x0 - 3, x1 + 3, y0 - 3, y1 + 3
    while q:
        x, y = q.popleft()
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if X0 <= nx <= X1 and Y0 <= ny <= Y1 and not m[ny, nx] and ok[ny, nx]: m[ny, nx] = True; q.append((nx, ny))
    # grow the mask by one pixel into the anti-aliased edge so no white rim is left between paint and outline
    g = m.copy(); g[1:] |= m[:-1]; g[:-1] |= m[1:]; g[:, 1:] |= m[:, :-1]; g[:, :-1] |= m[:, 1:]
    return {'rect': [int(x0), int(y0), int(x1 + 1), int(y1 + 1)], 'fill': float(m.sum()) / ((x1 - x0 + 1) * (y1 - y0 + 1))}, g

out = {}
for name, seeds in [('r11_cb', [(768, 520)]), ('r11_cb_grip', [(768, 520)]), ('p11_trio', [(293, 420), (745, 420), (1175, 420)]), ('r11_row', [(768, 440)])]:
    if not os.path.exists(os.path.join(CUT, name + '.png')): print('missing', name); continue
    out[name] = []
    for i, s in enumerate(seeds):
        info, m = card(name, s)
        al = (m * 255).astype(np.uint8); im = np.zeros(m.shape + (4,), np.uint8); im[..., :3] = 255; im[..., 3] = al
        Image.fromarray(im).save(os.path.join(CUT, f'seg11_{name}_card{i}.png'))
        info['mask'] = f'/art/cut/seg11_{name}_card{i}.png'; out[name].append(info); print(name, i, info)
# the pencil tip of h11_write: the opaque pixel furthest up-left (x + y smallest)
a = np.array(Image.open(os.path.join(CUT, 'h11_write.png')).convert('RGBA'))[..., 3]
ys, xs = np.where(a > 128); k = np.argmin(xs + ys); out['h11_write'] = {'tip': [int(xs[k]), int(ys[k])], 'size': [a.shape[1], a.shape[0]]}
print('tip', out['h11_write'])
# the reader: tray floor by flood fill, the slots by their teal fill
a = np.array(Image.open(os.path.join(CUT, 'm11_reader_top.png')).convert('RGBA')); info, m = card('m11_reader_top', (560, 680))
out['m11_reader_top'] = {'tray': info['rect']}; print('tray', info)
json.dump(out, open(os.path.join(CUT, 'seg11_anchors.json'), 'w'), indent=1)
