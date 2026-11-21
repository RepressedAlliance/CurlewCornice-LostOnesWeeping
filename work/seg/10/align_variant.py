"""Segment 10: put a Codex variant back onto its master. Codex redraws come back a few px shifted or scaled and sometimes a
shade lighter, which shows as a jump at the swap. This finds the shift and scale that lay the variant's unchanged part (the
region given as fractions of the height, default the lower 55%: body, legs, shoes) on the master's (alpha IoU, brute force),
resamples the whole variant with it, and maps its tones onto the master's (per-channel histogram matching over the solid
pixels of that region). Only measuring, moving, scaling and a tone curve: nothing is repainted.
usage: python work/seg/10/align_variant.py master.png variant.png out.png [--y0 0.45] [--y1 1.0]"""
import sys
import numpy as np
from PIL import Image
opt = lambda k, d: float(sys.argv[sys.argv.index(k) + 1]) if k in sys.argv else d
M = Image.open(sys.argv[1]).convert('RGBA'); V = Image.open(sys.argv[2]).convert('RGBA')
y0f, y1f = opt('--y0', 0.45), opt('--y1', 1.0)
w, h = M.size
def warp(im, s, dx, dy):
    # scale about the canvas centre, then shift
    a = 1 / s; cx, cy = w / 2, h / 2
    return im.transform((w, h), Image.AFFINE, (a, 0, cx - a * (cx + dx), 0, a, cy - a * (cy + dy)), resample=Image.BICUBIC)
q = 4
Ms = np.asarray(M.resize((w // q, h // q)))[..., 3] > 128
r0, r1 = int(h // q * y0f), int(h // q * y1f)
best = (-1, 1, 0, 0)
for s in np.arange(0.95, 1.051, 0.01):
    for dx in range(-48, 49, 4):
        for dy in range(-48, 49, 4):
            Vs = np.asarray(warp(V, s, dx, dy).resize((w // q, h // q)))[..., 3] > 128
            a, b = Ms[r0:r1], Vs[r0:r1]; iou = (a & b).sum() / max(1, (a | b).sum())
            if iou > best[0]: best = (iou, s, dx, dy)
iou, s, dx, dy = best
for ddx in range(-3, 4):
    for ddy in range(-3, 4):
        for ds in (-0.004, 0, 0.004):
            Vs = np.asarray(warp(V, s + ds, dx + ddx, dy + ddy))[..., 3] > 128; Mf = np.asarray(M)[..., 3] > 128
            R0, R1 = int(h * y0f), int(h * y1f); a, b = Mf[R0:R1], Vs[R0:R1]; v = (a & b).sum() / max(1, (a | b).sum())
            if v > best[0]: best = (v, s + ds, dx + ddx, dy + ddy)
iou, s, dx, dy = best
Vw = np.asarray(warp(V, s, dx, dy)).copy(); Ma = np.asarray(M)
R0, R1 = int(h * y0f), int(h * y1f)
sm = Ma[R0:R1][..., 3] > 250; sv = Vw[R0:R1][..., 3] > 250
for c in range(3):
    src = Vw[R0:R1][..., c][sv]; ref = Ma[R0:R1][..., c][sm]
    sq = np.percentile(src, np.linspace(0, 100, 101)); rq = np.percentile(ref, np.linspace(0, 100, 101))
    sq = np.maximum.accumulate(sq + np.arange(101) * 1e-6)
    Vw[..., c] = np.clip(np.interp(Vw[..., c].astype(float), sq, rq), 0, 255).astype(np.uint8)
Image.fromarray(Vw).save(sys.argv[3])
print(f'{sys.argv[3]}: IoU {iou:.3f} scale {s:.3f} shift {dx},{dy}')
