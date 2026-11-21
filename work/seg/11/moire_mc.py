"""Motion-compensated version of moire_check.py for S3b's punch (k355): each frame is compared with the previous one scaled
about the frame centre by the best-fitting zoom ratio, then the low-frequency (1/8) residual is taken per region; a moire
in the drawings' halftone shows as residual well above the flat regions'.
usage: python work/seg/11/moire_mc.py <frames_dir> [f0 f1]"""
import sys, numpy as np
from PIL import Image
d = sys.argv[1]; f0 = int(sys.argv[2]) if len(sys.argv) > 2 else 3950; f1 = int(sys.argv[3]) if len(sys.argv) > 3 else 3966
def load(f): return Image.open(f'{d}/g_{f:07d}.png').convert('L')
def scaled(im, s):
    W, H = im.size
    return im.transform(im.size, Image.AFFINE, (1 / s, 0, W / 2 - W / 2 / s, 0, 1 / s, H / 2 - H / 2 / s), resample=Image.BICUBIC)
lo = lambda im: np.asarray(im.resize((240, 135), Image.BOX), dtype=np.float32)
R = {'drawing halftone': [(108, 130, 62, 110), (108, 130, 130, 170)], 'her coat (flat)': [(85, 105, 186, 205)]}
prev = load(f0); acc = {k: [] for k in R}; zs = []
for f in range(f0 + 1, f1 + 1):
    cur = load(f); c = lo(cur); best = None
    for s in np.arange(0.975, 1.0251, 0.0005):
        p = lo(scaled(prev, s)); e = np.abs(c[20:115, 20:220] - p[20:115, 20:220]).mean()
        if best is None or e < best[0]: best = (e, s, p)
    zs.append(round(float(best[1]), 4))
    for k, rs in R.items(): acc[k].append(np.mean([np.abs(c[y0:y1, x0:x1] - best[2][y0:y1, x0:x1]).mean() for y0, y1, x0, x1 in rs]))
    prev = cur
print('zoom ratios', zs)
print('; '.join(f'{k} residual mean {np.mean(v):.2f} max {np.max(v):.2f}' for k, v in acc.items()) + ' grey levels / frame (1/8 res, motion-compensated)')
