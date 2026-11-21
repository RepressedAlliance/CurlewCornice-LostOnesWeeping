"""Segment 13: measure the eraser in the Codex drawings and cut it out of the desk-hand drawings.

- h13_erase / h13_hover (her hand from above holding the big eraser): the eraser Codex drew is found from its teal sleeve
  border (principal axis of the teal pixels), its pixels are removed (everything inside the eraser's capsule that is not skin
  or a finger outline), and the hand alone is written to art/cut/<name>.png. The page draws the canon eraser in its place,
  so the eraser is the same object as in the close-up.
- h13_open: copied as is.
- r13_face / r13_face_up / r13_face_tear: the eraser stays in the drawing; only its blank sleeve is measured, so the page can
  print 読取機用 and the timing squares on it.
Writes art/cut/seg13_anchors.json: per drawing { sleeve: {c:[x,y], u:[ux,uy] (unit, towards the held end), len, wid},
end: [x,y] (the held end's tip) }.
usage: python work/seg/13/cut.py [names...]
"""
import json, os, sys
import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
OUT = os.path.join(ROOT, 'art', 'design', 'out')
CUT = os.path.join(ROOT, 'art', 'cut')
ANP = os.path.join(CUT, 'seg13_anchors.json')


def sleeve(im, box=None):
    a = im[..., 3].astype(int); r, g, b = (im[..., i].astype(int) for i in range(3))
    teal = (a > 200) & (b > r + 40) & (g > r + 30)
    if box:
        m = np.zeros_like(teal); x0, y0, x1, y1 = box; m[y0:y1, x0:x1] = True; teal &= m
    ys, xs = np.nonzero(teal)
    P = np.stack([xs, ys], 1).astype(float); c = P.mean(0)
    w, V = np.linalg.eigh(np.cov((P - c).T)); u = V[:, 1]
    if u[1] < 0: u = -u                                   # pointing down the picture: towards the held (lower) end
    v = np.array([-u[1], u[0]])
    s = (P - c) @ u; t = (P - c) @ v
    s0, s1 = np.percentile(s, 0.5), np.percentile(s, 99.5); t0, t1 = np.percentile(t, 0.5), np.percentile(t, 99.5)
    cc = c + u * (s0 + s1) / 2 + v * (t0 + t1) / 2
    return {'c': cc.tolist(), 'u': u.tolist(), 'len': float(s1 - s0), 'wid': float(t1 - t0)}


def cut_hand(name):
    im = np.array(Image.open(os.path.join(OUT, name + '.png')).convert('RGBA'))
    S = sleeve(im)
    c, u = np.array(S['c']), np.array(S['u']); v = np.array([-u[1], u[0]])
    L = S['len'] * 1.5                                    # the sleeve is the middle two thirds of the eraser
    hw = S['wid'] / 2 + 4
    H, W = im.shape[:2]; yy, xx = np.mgrid[0:H, 0:W]
    s = (xx - c[0]) * u[0] + (yy - c[1]) * u[1]; t = (xx - c[0]) * v[0] + (yy - c[1]) * v[1]
    half = L / 2 - hw
    sc = np.clip(s, -half, half)
    cap = (s - sc) ** 2 + t ** 2 <= (hw + 2) ** 2             # a capsule round the whole eraser
    r, g, b, a = (im[..., i].astype(int) for i in range(4))
    skin = (a > 100) & (r > 150) & (r > g + 8) & (g > b + 4) & (r - b > 28)
    near = ndimage.binary_dilation(skin, iterations=5)
    dark = (a > 100) & (np.maximum(np.maximum(r, g), b) < 110) & (np.abs(r - b) < 25)
    keep = skin | (dark & near)
    # fingers shade: a slightly darker skin tone counts as skin too
    remove = cap & ~keep
    out = im.copy(); out[remove, 3] = 0
    # anything left over that is a small island (bits of the eraser's outline) goes too
    lab, n = ndimage.label(out[..., 3] > 0)
    if n > 1:
        sizes = ndimage.sum(np.ones_like(lab), lab, range(1, n + 1)); big = 1 + int(np.argmax(sizes))
        out[(lab != big) & (lab > 0), 3] = 0
    Image.fromarray(out).save(os.path.join(CUT, name + '.png'))
    end = (c + u * L / 2).tolist()
    return {'sleeve': S, 'end': end, 'eraserLen': L}


def face(name):
    im = np.array(Image.open(os.path.join(OUT, name + '.png')).convert('RGBA'))
    S = sleeve(im, box=(420, 460, 600, 820))
    Image.fromarray(im).save(os.path.join(CUT, name + '.png'))
    return {'sleeve': S}


if __name__ == '__main__':
    names = sys.argv[1:] or ['h13_open', 'h13_erase', 'h13_hover', 'r13_face', 'r13_face_up', 'r13_face_tear']
    AN = json.load(open(ANP)) if os.path.exists(ANP) else {}
    for n in names:
        if not os.path.exists(os.path.join(OUT, n + '.png')): print('missing', n); continue
        if n == 'h13_open':
            Image.open(os.path.join(OUT, n + '.png')).save(os.path.join(CUT, n + '.png')); AN[n] = {}
        elif n.startswith('h13'): AN[n] = cut_hand(n)
        else: AN[n] = face(n)
        print(n, json.dumps(AN[n]))
    json.dump(AN, open(ANP, 'w'), indent=1)
