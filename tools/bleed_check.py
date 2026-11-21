"""No cut edge of a drawing may show in the frame: wherever the figure (or a sleeve, a floor, a cable) touches the border
of its drawing, that border must lie outside the frame after placement, by a margin.
Checks one placement: image file, centre (cx, cy) on screen, scale, rotation (degrees).
usage: python tools/bleed_check.py image.png cx cy scale [rot_deg] [frame_w frame_h] [margin]
Exit code 1 if a cut edge lands inside the frame.
"""
import sys, math
import numpy as np
from PIL import Image

a = np.asarray(Image.open(sys.argv[1]).convert('RGBA'))[..., 3]
cx, cy, sc = float(sys.argv[2]), float(sys.argv[3]), float(sys.argv[4])
rot = math.radians(float(sys.argv[5])) if len(sys.argv) > 5 else 0.0
FW, FH = (int(sys.argv[6]), int(sys.argv[7])) if len(sys.argv) > 7 else (1920, 1080)
M = int(sys.argv[8]) if len(sys.argv) > 8 else 6
h, w = a.shape
touch = {'top': a[0] > 128, 'bottom': a[-1] > 128, 'left': a[:, 0] > 128, 'right': a[:, -1] > 128}


def screen(px, py):
    dx, dy = (px - w / 2) * sc, (py - h / 2) * sc
    return cx + dx * math.cos(rot) - dy * math.sin(rot), cy + dx * math.sin(rot) + dy * math.cos(rot)


bad = []
for side, mask in touch.items():
    idx = np.nonzero(mask)[0]
    if not len(idx): continue
    for i in (idx.min(), idx.max(), int(idx.mean())):
        px, py = {'top': (i, 0), 'bottom': (i, h - 1), 'left': (0, i), 'right': (w - 1, i)}[side]
        x, y = screen(px, py)
        if -M < x < FW + M and -M < y < FH + M:
            bad.append(f'{side} edge cut at ({x:.0f},{y:.0f}) is inside the frame')
            break
print(sys.argv[1].split('/')[-1], 'touches:', [s for s, m in touch.items() if m.any()] or 'none', '->', 'OK' if not bad else 'CUT EDGE IN FRAME: ' + '; '.join(bad))
sys.exit(1 if bad else 0)
