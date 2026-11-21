"""Seg 11: the four corners of each drawn card (its fill mask), fitted as four straight edges (rows / columns in the middle
60% of each side, half-intensity crossing), against the axis-aligned rectangle the page sets the card on. If the fitted
corners sit within ~1 px (in the drawing) of the rectangle's, the rectangle IS the card's quad and a homography would map
the same. usage: python work/seg/11/card_corners.py"""
import json, numpy as np
from PIL import Image
AN = json.load(open('art/cut/seg11_anchors.json'))
def edge(vals): return np.polyfit(*vals, 1)
for name in ['r11_id_a', 'r11_id_b', 'r11_cb', 'r11_cb_grip', 'p11_trio3', 'r11_row6']:
    for i, c in enumerate(AN[name]):
        x0, y0, x1, y1 = c['rect']; w, h = x1 - x0, y1 - y0
        m = np.asarray(Image.open('art/cut/' + c['mask'].split('/')[-1]).convert('RGBA'))[..., 3].astype(float) / 255
        def first(a):            # sub-pixel index of the first crossing of 0.5 along a 1-D profile
            k = int(np.argmax(a >= 0.5)); return k - 1 + (0.5 - a[k - 1]) / max(1e-6, a[k] - a[k - 1]) if k > 0 else 0.0
        ys = np.arange(int(y0 + 0.2 * h), int(y0 + 0.8 * h)); xs = np.arange(int(x0 + 0.2 * w), int(x0 + 0.8 * w))
        # rows hidden by fingers are skipped: keep rows whose crossing is near the median
        L = np.array([x0 - 3 + first(m[y, x0 - 3:x0 + w // 3]) for y in ys]); R = np.array([x1 + 3 - first(m[y, x1 + 3:x1 - w // 3:-1]) for y in ys])
        T = np.array([y0 - 3 + first(m[y0 - 3:y0 + h // 3, x]) for x in xs]); B = np.array([y1 + 3 - first(m[y1 + 3:y1 - h // 3:-1, x]) for x in xs])
        ok = lambda v: np.abs(v - np.median(v)) < 2
        # the top edge has the slot in the middle: fit on the outer parts only
        tmask = ok(T) & ((xs < x0 + 0.38 * w) | (xs > x0 + 0.62 * w))
        fL = np.polyfit(ys[ok(L)], L[ok(L)], 1); fR = np.polyfit(ys[ok(R)], R[ok(R)], 1)
        fT = np.polyfit(xs[tmask], T[tmask], 1); fB = np.polyfit(xs[ok(B)], B[ok(B)], 1)
        def X(fv, fh):          # intersect x = fv(y) and y = fh(x)
            y = fh[1]; x = 0
            for _ in range(20): x = np.polyval(fv, y); y = np.polyval(fh, x)
            return x, y
        Q = [X(fL, fT), X(fR, fT), X(fR, fB), X(fL, fB)]
        Rq = [(x0, y0), (x1, y0), (x1, y1), (x0, y1)]
        dev = max(np.hypot(a - c2, b - d) for (a, b), (c2, d) in zip(Q, Rq))
        print(f'{name} card {i}: rect {c["rect"]}  fitted quad {[(round(a, 1), round(b, 1)) for a, b in Q]}  '
              f'edge slopes L {fL[0]:+.4f} R {fR[0]:+.4f} T {fT[0]:+.4f} B {fB[0]:+.4f}  max corner offset {dev:.1f} px (drawing)')
