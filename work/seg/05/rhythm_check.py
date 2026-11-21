import os as _os_lo
_LO_ROOT = (_os_lo.environ.get('LOSTONE_ROOT') or _os_lo.path.abspath(_os_lo.path.join(_os_lo.path.dirname(_os_lo.path.abspath(__file__)), '../../..'))).replace('\\', '/')
"""Segment 05 picture events against the music (2026-11-21 rhythm pass). Same measures as work/rhythm_diag/video.py and
align.py (192x108 gray: frame difference, histogram cut score, global translation + zoom fit, residual content jumps, luma
flashes), run on one segment mp4, then per beat k104-k134: the drums at that beat (drums.json) and the picture's response in
the frames [beat-1, beat+2]. Also lists every strong picture event and how far it is from the nearest beat frame (the first
frame showing the beat, ceil) or sung onset frame (floor): positive = the picture is late, negative = early.
usage: python work/seg/05/rhythm_check.py <seg.mp4> <global first frame> [label]"""
import json, subprocess, sys, math
import numpy as np
from scipy import ndimage as nd
from scipy.ndimage import median_filter

ROOT = _LO_ROOT
mp4, G0 = sys.argv[1], int(sys.argv[2]); label = sys.argv[3] if len(sys.argv) > 3 else mp4
W, H = 192, 108
p = subprocess.run(['ffmpeg', '-v', 'error', '-i', mp4, '-vf', f'scale={W}:{H}:flags=area', '-pix_fmt', 'gray', '-f', 'rawvideo', '-'],
                   capture_output=True, check=True)
F = np.frombuffer(p.stdout, np.uint8).reshape(-1, H, W).astype(np.float32)
n = len(F)
luma = F.mean((1, 2)); hist = np.zeros(n); tx = np.zeros(n); ty = np.zeros(n); dz = np.zeros(n); resid = np.zeros(n)
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32); xc = xx - W / 2; yc = yy - H / 2
prevh = prevb = None
for i in range(n):
    f = F[i]; b = nd.gaussian_filter(f, 1.2)
    h = np.histogram(f, 32, (0, 256))[0].astype(float); h /= h.sum()
    if i > 0:
        hist[i] = 0.5 * np.abs(h - prevh).sum()
        a = c = s = 0.0
        for _ in range(3):
            u = a + s * xc; v = c + s * yc
            wb = nd.map_coordinates(b, [yy + v, xx + u], order=1, mode='nearest')
            gy, gx = np.gradient(wb); It = wb - prevb
            m = np.ones_like(It, bool); m[:4] = m[-4:] = False; m[:, :4] = m[:, -4:] = False
            J = np.stack([gx[m], gy[m], gx[m] * xc[m] + gy[m] * yc[m]], 1)
            d, *_ = np.linalg.lstsq(J, -It[m], rcond=None); a += d[0]; c += d[1]; s += d[2]
        tx[i], ty[i], dz[i] = a, c, s
        u = a + s * xc; v = c + s * yc
        wb = nd.map_coordinates(b, [yy + v, xx + u], order=1, mode='nearest')
        resid[i] = np.abs(wb - prevb)[6:-6, 6:-6].mean()
    prevh = h; prevb = b
cut = (hist > 0.22) | ((resid > 25) & (hist > 0.08)); cut[0] = True   # resid alone fires on S5's halftone under a push                 # the segment's first frame is the cut in from 04
base = median_filter(resid, 31); content = np.where(cut, 0, np.maximum(0, resid - base))
vel = np.stack([tx * 10, ty * 10, dz * 1000], 1)
acc = np.r_[0, np.linalg.norm(np.diff(vel, axis=0), axis=1)]; acc[cut] = 0; acc[np.r_[False, cut[:-1]]] = 0
flash = np.abs(luma - median_filter(luma, 9)); flash[cut] = 0
spd = np.minimum(np.hypot(tx, ty) * 10, 60); zr = np.minimum(np.abs(dz), 0.05)
motion = (np.minimum(resid, 60) + spd + zr * 400)

D = json.load(open(ROOT + '/work/rhythm_diag/drums.json')); bt = D['beats']
B = 60 / 162; BV0 = 0.318
beatF = lambda k: math.ceil((BV0 + k * B) * 30 - 1e-6)                # first frame showing beat k (the page's rule)
strong = lambda r: r['cut'] or r['content'] > 4 or r['acc'] > 6 or r['flash'] > 12
def vresp(f):
    i = f - G0; w = slice(max(0, i - 1), min(n, i + 3))
    return dict(cut=bool(cut[w].any()), content=float(content[w].max()), acc=float(acc[w].max()), flash=float(flash[w].max()))
ks = [k for k in range(104, 135) if 0 <= beatF(k) - G0 < n]
hits = 0
print(f'== {label}: {n} frames from g{G0}; mean motion {motion.mean():.1f}, frames with motion < 1: {np.mean(motion < 1) * 100:.0f} %')
for k in ks:
    x = bt[k]; r = vresp(beatF(k)); hits += strong(r)
    mus = ('C' if (x['crash_db'] or -99) > 6 else ' ') + ('K' if x['kick'] > 0.9 else 'k' if x['kick'] > 0.6 else '.') + ('S' if x['snare'] > 1.1 else 's' if x['snare'] > 0.75 else '.')
    print(f"k{k:3d} g{beatF(k)} {'|' if k % 4 == 0 else ' '} {mus} {'*' if strong(r) else ' '} {'CUT' if r['cut'] else '   '} cont{r['content']:5.1f} acc{r['acc']:5.1f} fl{r['flash']:5.1f}")
print(f'beats with a response: {hits}/{len(ks)} ({hits / len(ks) * 100:.0f} %)')
# every strong frame: offset to the nearest beat frame / sung onset frame
lyr = json.load(open(ROOT + '/work/audio/lyrics_timed.json', encoding='utf-8'))[5]
onF = [math.floor(c['t'] * 30 + 1e-6) for c in lyr['chars']]
targets = sorted(set([beatF(k) for k in range(103, 136)] + [math.ceil((BV0 + 134.5 * B) * 30 - 1e-6)] + onF))
offs = []
for i in range(n):
    if cut[i] or content[i] > 4 or acc[i] > 6 or flash[i] > 12:
        g = G0 + i; t = min(targets, key=lambda q: abs(q - g)); offs.append(g - t)
        print(f"  event g{g} {'CUT ' if cut[i] else ''}cont{content[i]:.1f} acc{acc[i]:.1f} fl{flash[i]:.1f} -> nearest beat/onset g{t} ({g - t:+d} f)")
o = np.array(offs)
print(f'strong frames {len(o)}: on the beat/onset frame {np.sum(o == 0)}, +1 (the frame after, e.g. the 2nd frame of a step) {np.sum(o == 1)}, '
      f'+2 {np.sum(o == 2)}, early (<0) {np.sum(o < 0)}, later than +2 {np.sum(o > 2)}')
