"""Descreen a printed (one-ink, screentoned) character cut-out, so the scene can re-print its tones with the
scene's own halftone screen (the same dot size and angle as every 3D shadow).

Codex prints the townspeople with a fine dot lattice (about 3 px pitch). The lattice shows as sharp peaks in
the image's 2D spectrum; notching those peaks out removes the dots and leaves a continuous-tone drawing (the
classic descreening of scanned print). From that, two maps are written to <name>_ds.png:
  R = tone (0 paper .. 1 solid) of the descreened drawing, lines included
  G = line mask: the drawn lines and solid fills (dark after descreening), grown by a pixel, soft-edged
  B = protect mask: pixels to keep exactly as drawn (the pinned name card), 1 = keep
  A = the cut-out's alpha
usage: python tools/descreen.py art/cut/name.png [card boxes x0,y0,x1,y1;... to protect]
"""
import sys, os
import numpy as np
from PIL import Image
from scipy import ndimage

src = sys.argv[1]
protect_boxes = []
if len(sys.argv) > 2 and sys.argv[2]:
    for b in sys.argv[2].split(';'):
        protect_boxes.append([int(v) for v in b.split(',')])
A = np.asarray(Image.open(src).convert('RGBA')).astype(np.float32) / 255.0
rgb, al = A[..., :3], A[..., 3]
lum = rgb @ np.array([0.2126, 0.7152, 0.0722], np.float32)
ink = np.where(al > 0.02, 1.0 - lum, 0.0)
h, w = ink.shape
# pad to a smooth window to limit edge ringing
F = np.fft.fftshift(np.fft.fft2(ink - ink.mean()))
mag = np.abs(F)
cy, cx = h // 2, w // 2
yy, xx = np.mgrid[0:h, 0:w]
fy = (yy - cy) / h; fx = (xx - cx) / w            # cycles per pixel
fr = np.hypot(fx, fy)
# the lattice lives above ~0.18 cycles/px (pitch < ~5.5 px); find its peaks there
logm = np.log1p(mag)
bg = ndimage.median_filter(logm, size=15)
peaks = (logm - bg > 2.2) & (fr > 0.16) & (logm == ndimage.maximum_filter(logm, size=9))
ys, xs = np.nonzero(peaks)
notch = np.ones_like(mag)
for y, x in zip(ys, xs):
    notch *= 1 - np.exp(-(((yy - y) / (h * 0.012)) ** 2 + ((xx - x) / (w * 0.012)) ** 2))
# also take out everything above the lattice frequency band (its harmonics), softly
notch *= 1 - 1 / (1 + np.exp(-(fr - 0.30) / 0.02))
ds = np.real(np.fft.ifft2(np.fft.ifftshift(F * notch))) + ink.mean()
ds = np.clip(ds, 0, 1) * (al > 0.02)
# line mask: dark after descreening (lines and solid fills), soft edge
line = np.clip((ds - 0.5) / 0.18, 0, 1)
line = np.maximum(line, ndimage.grey_dilation(line, size=(2, 2)) * 0.85)
prot = np.zeros_like(ds)
for x0, y0, x1, y1 in protect_boxes: prot[y0:y1, x0:x1] = 1
out = np.dstack([ds, line, prot, al])
base = os.path.splitext(src)[0]
Image.fromarray((np.clip(out, 0, 1) * 255 + 0.5).astype(np.uint8), 'RGBA').save(base + '_ds.png')
print('wrote', base + '_ds.png', 'lattice peaks', len(xs))
