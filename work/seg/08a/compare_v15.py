import os as _os_lo
_LO_ROOT = (_os_lo.environ.get('LOSTONE_ROOT') or _os_lo.path.abspath(_os_lo.path.join(_os_lo.path.dirname(_os_lo.path.abspath(__file__)), '../../..'))).replace('\\', '/')
"""Compare two frame sets of [2221, 2587) frame by frame and print runs of identical / differing frames (max, mean, bounding box).
python work/seg/08a/compare_v15.py [ref] [new]   ref/new: v15 (work/c1a/v15, f_ = global - 2220), ref (work/seg/08a/ref_c1a: page=c1a
rendered by render_film.mjs on the global frames), ref_t0 (the same on version 15's time grid 74.0 + i/30), seg (work/seg/08a/frames), seq (seg_08a by render_seq.mjs on version 15's grid, work/seg/08a/seq_v15grid). Default: ref seg."""
import sys
import os, numpy as np
from PIL import Image
from concurrent.futures import ThreadPoolExecutor
R = _LO_ROOT
A = sys.argv[1] if len(sys.argv) > 1 else 'ref'; B = sys.argv[2] if len(sys.argv) > 2 else 'seg'
def path(k, g):
    return {'v15': f'{R}work/c1a/v15/f_{g-2220:05d}.png', 'ref': f'{R}work/seg/08a/ref_c1a/g_{g:07d}.png', 'ref_t0': f'{R}work/seg/08a/ref_c1a_t0/g_{g:07d}.png', 'seg': f'{R}work/seg/08a/frames/g_{g:07d}.png', 'seq': f'{R}work/seg/08a/seq_v15grid/f_{g-2220:05d}.png'}[k]
def one(g):
    a = np.asarray(Image.open(path(A, g)).convert('RGB'), dtype=np.int16)
    b = np.asarray(Image.open(path(B, g)).convert('RGB'), dtype=np.int16)
    d = np.abs(a - b).max(2); mx = int(d.max())
    if mx == 0: return g, 0, 0.0, 0, None
    ys, xs = np.where(d > 0); return g, mx, float(np.abs(a - b).mean()), len(xs), (int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max()))
with ThreadPoolExecutor(4) as ex: res = list(ex.map(one, range(2221, 2587)))
same = sum(1 for r in res if r[1] == 0); print(f'{A} vs {B}: {len(res)} frames, {same} identical, {len(res)-same} differ')
runs, cur = [], None
for g, mx, mean, n, bb in res:
    k = mx == 0
    if cur and cur[0] == k: cur[2] = g; cur[3].append((g, mx, mean, n, bb))
    else: cur = [k, g, g, [(g, mx, mean, n, bb)]]; runs.append(cur)
for k, a, b, items in runs:
    if k: print(f'  {a}-{b}: identical ({b-a+1})')
    else:
        mx = max(i[1] for i in items); mean = max(i[2] for i in items); bbs = [i[4] for i in items]
        bb = (min(x[0] for x in bbs), min(x[1] for x in bbs), max(x[2] for x in bbs), max(x[3] for x in bbs))
        print(f'  {a}-{b}: differ ({b-a+1}), max {mx}, worst mean {mean:.3f}, box {bb}')
