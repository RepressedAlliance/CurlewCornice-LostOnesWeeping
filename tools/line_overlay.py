"""Check that a coloured drawing keeps the master's lines: find the best small scale/offset,
report the median distance from master line pixels to the nearest line in the coloured image,
and write a red-over overlay for viewing.  usage: python line_overlay.py master.png colored.png out.png"""
import sys
import numpy as np
from PIL import Image
from scipy import ndimage

m_p, c_p, out_p = sys.argv[1:4]
M = np.asarray(Image.open(m_p).convert('L')).astype(np.float32)
C = np.asarray(Image.open(c_p).convert('RGB')).astype(np.float32)
CL = C.mean(2)
mline = M < 150                                  # pencil lines of the master
# lines in the coloured image: pixels clearly darker than their neighbourhood
loc = ndimage.uniform_filter(CL, 9)
cline = (CL < loc - 28) | (CL < 60)
dist_to_c = ndimage.distance_transform_edt(~cline)
best = None
H, W = M.shape
ys, xs = np.nonzero(mline)
for s in np.linspace(0.96, 1.04, 9):
    for dx in range(-14, 15, 2):
        for dy in range(-14, 15, 2):
            x2 = np.clip(((xs - W / 2) * s + W / 2 + dx).astype(int), 0, W - 1)
            y2 = np.clip(((ys - H / 2) * s + H / 2 + dy).astype(int), 0, H - 1)
            d = np.median(dist_to_c[y2, x2])
            if best is None or d < best[0]:
                best = (d, s, dx, dy)
d, s, dx, dy = best
x2 = np.clip(((xs - W / 2) * s + W / 2 + dx).astype(int), 0, W - 1)
y2 = np.clip(((ys - H / 2) * s + H / 2 + dy).astype(int), 0, H - 1)
dd = dist_to_c[y2, x2]
print(f'{c_p.split("/")[-1]}: scale {s:.3f} offset ({dx},{dy})  median {d:.2f}px  p90 {np.percentile(dd, 90):.1f}px  >6px {np.mean(dd > 6) * 100:.1f}%')
ov = C.copy() * 0.55 + 255 * 0.45
ov[y2, x2] = [220, 30, 40]
Image.fromarray(ov.astype(np.uint8)).save(out_p)
