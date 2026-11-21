"""Split a printed (one-ink, screentoned) character cut-out into its line plate and its tone density, so the
scene can re-print the tone with the scene's own halftone screen (same dot size and angle as every 3D shadow).

Codex draws the townspeople as teal line art with fine screentone dots; the 3D scenes print shadows with a
coarser 5.5 px / 15 degree screen. Side by side they look like two different printings. This tool writes
<name>_tone.png next to the input:
  R = line coverage (the drawn lines and solid fills, kept as they are)
  G = tone density 0..1 (how much of the area the drawing's dots covered, smoothed over a few dot pitches)
  B = 0, A = the cut-out's alpha
The pinned name card (paper-white with its own print) is passed through unchanged in a separate file
<name>_keep.png (RGBA, only the card), so the card keeps its fine print.
usage: python tools/rescreen.py art/cut/name.png [dot_max_area=40] [sigma=3.0]
"""
import sys, os
import numpy as np
from PIL import Image
from scipy import ndimage

src = sys.argv[1]
dot_max = int(sys.argv[2]) if len(sys.argv) > 2 else 40
sigma = float(sys.argv[3]) if len(sys.argv) > 3 else 3.0
A = np.asarray(Image.open(src).convert('RGBA')).astype(np.float32) / 255.0
rgb, al = A[..., :3], A[..., 3]
lum = rgb @ np.array([0.2126, 0.7152, 0.0722], np.float32)
ink = (1.0 - lum)                                   # 0 paper .. 1 solid ink
dark = (ink > 0.42) & (al > 0.5)
# dots: small dark components (4-connected so a dense checker of dots stays separate dots)
lab, n = ndimage.label(dark, structure=[[0, 1, 0], [1, 1, 1], [0, 1, 0]])
sizes = ndimage.sum(dark, lab, range(1, n + 1))
objs = ndimage.find_objects(lab)
is_dot = np.zeros(n + 1, bool)
for i, (s, sl) in enumerate(zip(sizes, objs)):
    if s <= dot_max:
        h = sl[0].stop - sl[0].start; w = sl[1].stop - sl[1].start
        if max(h, w) <= 2.2 * np.sqrt(dot_max): is_dot[i + 1] = True
dots = is_dot[lab]
lines = dark & ~dots
# line coverage keeps the drawing's anti-aliasing: ink value where a line is, grown by one pixel
line_zone = ndimage.binary_dilation(lines, iterations=1)
line_cov = np.where(line_zone, np.clip((ink - 0.15) / 0.6, 0, 1), 0)
# tone density: the share of area the dots covered, smoothed, inside the figure only
dot_ink = np.where(dots, ink, 0)
inside = (al > 0.5).astype(np.float32)
num = ndimage.gaussian_filter(dot_ink, sigma); den = ndimage.gaussian_filter(inside, sigma)
tone = np.where(den > 1e-3, num / np.maximum(den, 1e-3), 0) * inside
# normalise: the densest screen Codex uses (~50% cover) reads as a full shadow tone
tone = np.clip(tone / max(np.percentile(tone[inside > 0], 99.5), 1e-3), 0, 1)
out = np.dstack([line_cov, tone, np.zeros_like(tone), al])
base = os.path.splitext(src)[0]
Image.fromarray((out * 255 + 0.5).astype(np.uint8), 'RGBA').save(base + '_tone.png')
print('wrote', base + '_tone.png', 'dots', int(dots.sum()), 'line px', int(lines.sum()))
