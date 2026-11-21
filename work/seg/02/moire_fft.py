"""Moire in the people's print tone (02 wide and pull-out): amplitude of a 64x64 patch inside a flat tone area, split into the
dot frequency band (period < 6 px: the screen itself) and the beat band (period 6-40 px: what an aliased screen adds as a
coarse weave). Compares two renders.  usage: python moire_fft.py <old_frames> <new_frames> [g ...]"""
import sys, numpy as np
from PIL import Image
A, B = sys.argv[1], sys.argv[2]; fr = [int(x) for x in sys.argv[3:]] or [418, 421, 433]
P = {'p9 hoodie': (585, 585), 'p3 coat': (250, 760), 'mother coat': (1230, 800)}
def amp(p, x, y, n=64):
    a = np.asarray(Image.open(p).convert('L'), dtype=float)[y:y + n, x:x + n]; a = a - a.mean()
    F = np.abs(np.fft.fft2(a * np.outer(np.hanning(n), np.hanning(n)))) ** 2
    r = np.hypot(np.fft.fftfreq(n)[:, None], np.fft.fftfreq(n)[None, :])
    return np.sqrt(F[(r >= 1 / 40) & (r <= 1 / 6)].sum()) / n, np.sqrt(F[r > 1 / 6].sum()) / n
for f in fr:
    for k, (x, y) in P.items():
        o = amp(f'{A}/g_{f:07d}.png', x, y); nw = amp(f'{B}/g_{f:07d}.png', x, y)
        print(f'g{f} {k:12s} beat band old {o[0]:6.1f} new {nw[0]:6.1f}   dot band old {o[1]:6.1f} new {nw[1]:6.1f}')
