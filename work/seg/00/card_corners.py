"""Measure the flat card in a drawing: the near-white card face region's extents (inner edge of the outline).
usage: python card_corners.py <png> <x0> <y0> <x1> <y1>   (a rough box around the card)"""
import sys, numpy as np
from PIL import Image
im = np.asarray(Image.open(sys.argv[1]).convert('RGBA')).astype(float) / 255
x0, y0, x1, y1 = map(int, sys.argv[2:6])
r, g, b, a = im[..., 0], im[..., 1], im[..., 2], im[..., 3]
mx = np.maximum(np.maximum(r, g), b); mn = np.minimum(np.minimum(r, g), b); sat = (mx - mn) / np.maximum(mx, 1e-4)
face = (a > 0.9) & (mx > 0.85) & (sat < 0.08)
sub = face[y0:y1, x0:x1]
cols = sub.mean(0); rows = sub.mean(1)
cx = np.where(cols > 0.5)[0]; ry = np.where(rows > 0.5)[0]
L, R = x0 + cx.min(), x0 + cx.max(); T, B = y0 + ry.min(), y0 + ry.max()
print(f'face extents x {L}..{R}  y {T}..{B}  (w {R-L+1}, h {B-T+1}, ratio {(R-L+1)/(B-T+1):.3f})')
# outline centre: one or two px outside the face
print(f'CARD_Q: [[{L-1.5}, {T-1.5}], [{R+1.5}, {T-1.5}], [{L-1.5}, {B+1.5}]]')
