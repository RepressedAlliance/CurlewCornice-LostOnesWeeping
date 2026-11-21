"""Segment 06 against Demo 1 v15, frame by frame: film frame g <-> v15 frame g - 1501.
usage: python work/seg/06/diff_v15.py [ref_dir=work/a2v4/v15] [frames_dir=work/seg/06/frames]
Prints a summary for the confirmed range 1510-1864 and for 1865-1876 (the tail, where v15 still has frames)."""
import sys
import numpy as np
from PIL import Image
ref = sys.argv[1] if len(sys.argv) > 1 else 'work/a2v4/v15'
src = sys.argv[2] if len(sys.argv) > 2 else 'work/seg/06/frames'
rows = []
for g in range(1510, 1877):
    a = np.asarray(Image.open(f'{ref}/f_{g-1501:05d}.png').convert('RGB'), dtype=np.int16)
    b = np.asarray(Image.open(f'{src}/g_{g:07d}.png').convert('RGB'), dtype=np.int16)
    d = np.abs(a - b); m = d.max(axis=2)
    rows.append((g, int(d.max()), float(d.mean()), int((m > 0).sum()), int((m > 2).sum()), int((m > 16).sum())))
def summary(lo, hi):
    r = [x for x in rows if lo <= x[0] <= hi]
    same = sum(1 for x in r if x[1] == 0)
    print(f'{ref} vs {src} frames {lo}-{hi}: {len(r)} frames, {same} identical, worst max {max(x[1] for x in r)}, '
          f'worst mean {max(x[2] for x in r):.4f}, most px differing {max(x[3] for x in r)} '
          f'(of which >2 levels {max(x[4] for x in r)}, >16 levels {max(x[5] for x in r)}) of {1920*1080}')
summary(1510, 1864)
summary(1865, 1876)
if '--list' in sys.argv:
    for x in rows: print(*x)
