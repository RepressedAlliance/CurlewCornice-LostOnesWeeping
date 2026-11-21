"""Check a pose/expression variant against its master before it is used (the ココロ checks, rebuilt here):
- outline difference: share of the master's opaque area that changed (alpha XOR / alpha area); a blink or an expression
  should stay under ~1-2 %, a head turn more, a whole new pose much more;
- head width: the width of her head (hair) row at the eye line, master vs variant (scale must not drift);
- an onion-skin image (master red, variant cyan) to see what moved: parts that should not move must overlap.
usage: python tools/swap_check.py master.png variant.png [out_onion.png]
"""
import sys
import numpy as np
from PIL import Image


def load(p):
    return np.asarray(Image.open(p).convert('RGBA')).astype(np.float32)


def head_width(a):
    """width of the hair mass (yellow) in the band where it is widest within the top 45 % of the figure"""
    al = a[..., 3] > 128
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    hair = al & (r > 150) & (g > 110) & (b < 120) & (r - b > 60)
    ys = np.nonzero(al.any(1))[0]
    top, bot = ys.min(), ys.max()
    best = 0
    for y in range(top, int(top + (bot - top) * 0.45), 4):
        xs = np.nonzero(hair[y])[0]
        if len(xs) > 10: best = max(best, xs.max() - xs.min())
    return best


m, v = load(sys.argv[1]), load(sys.argv[2])
if m.shape != v.shape:
    print('different canvas sizes', m.shape, v.shape); sys.exit(1)
am, av = m[..., 3] > 128, v[..., 3] > 128
diff = (am ^ av).sum() / max(1, am.sum())
hm, hv = head_width(m), head_width(v)
print(f'outline change {diff * 100:.2f} %   head width {hm} -> {hv} px ({(hv - hm) / max(1, hm) * 100:+.1f} %)')
if len(sys.argv) > 3:
    lm = (255 - m[..., :3].mean(2)) * am; lv = (255 - v[..., :3].mean(2)) * av
    out = np.full(m.shape[:2] + (3,), 255, np.float32)
    out[..., 0] -= lv * 0.9; out[..., 1] -= lm * 0.5; out[..., 2] -= lm * 0.9
    Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).save(sys.argv[3])
    print('onion', sys.argv[3])
