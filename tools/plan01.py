"""Plan screen boxes of 01 figures for a given camera. usage: python tools/plan01.py pan fov [name,H,x,z ...]"""
import sys
import numpy as np
from PIL import Image
pan, fov = float(sys.argv[1]), float(sys.argv[2])
yaw, tilt, ch, d, tx, tz = 38, 17, 2.3, 3.2, 0.2, 0.8
Y = np.radians(yaw); C = np.array([tx - d*np.sin(Y), ch, tz - d*np.cos(Y)])
h = np.radians(yaw + pan); t = np.radians(tilt)
f = np.array([np.sin(h)*np.cos(t), -np.sin(t), np.cos(h)*np.cos(t)])
r = np.array([-f[2], 0, f[0]]); r /= np.linalg.norm(r); u = np.cross(r, f)
F = 540 / np.tan(np.radians(fov/2))
def scr(p):
    v = np.array(p, float) - C; z = v @ f
    return np.array([960 + (v @ r) / z * F, 540 - (v @ u) / z * F])
right = -np.array([np.cos(Y), 0, -np.sin(Y)])
for spec in sys.argv[3:]:
    n, H, x, z = spec.split(','); H, x, z = float(H), float(x), float(z)
    im = Image.open(f'art/cut/{n}.png'); w = H * im.width / im.height
    pts = np.array([scr(np.array([x, 0, z]) + right * s * w / 2 + np.array([0, hh, 0])) for s in (-1, 1) for hh in (0, H)])
    print(f'{n:20s} ({x:+.2f},{z:+.2f}) x {pts[:,0].min():.0f}-{pts[:,0].max():.0f}  y {pts[:,1].min():.0f}-{pts[:,1].max():.0f}')
for name, p in [('cab2 pad', (-0.42, 1.004, 0.594)), ('cab3 pad', (0.42, 1.004, 0.594)), ('cab4 pad', (1.26, 1.004, 0.594)), ('cab5 pad', (2.1, 1.004, 0.594)), ('cab1 pad', (-1.26, 1.004, 0.594))]:
    print(name, scr(p).round())
