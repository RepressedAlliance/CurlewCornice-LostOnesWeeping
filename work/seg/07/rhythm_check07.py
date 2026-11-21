import os as _os_lo
_LO_ROOT = (_os_lo.environ.get('LOSTONE_ROOT') or _os_lo.path.abspath(_os_lo.path.join(_os_lo.path.dirname(_os_lo.path.abspath(__file__)), '../../..'))).replace('\\', '/')
"""Segment 07: picture force against the drums, before (v6) and after (v7), the same measures as work/rhythm_diag.
usage: python work/seg/07/rhythm_check07.py [old.mp4] [new.mp4]
Per beat (and the half beats that carry an event) of k171-k198: the drums (kick, snare, crash dB), and for each film the
response in the window [beat frame - 1, beat frame + 2] (cut, content jump, camera acceleration, flash) as rhythm_diag
align.py counts it, plus the frame where the camera's acceleration peaks relative to the beat frame (lead < 0 = early)."""
import json, os, subprocess, sys
import numpy as np
from scipy import ndimage as nd

ROOT = _LO_ROOT
G0, G1 = 1910, 2221
W, H = 192, 108
B = 60 / 162; BV0 = 0.318
fr = lambda k: int(np.ceil((BV0 + k * B) * 30 - 1e-6))   # the beat frame: the first frame at or after the beat


def feats(mp4):
    p = subprocess.run(['ffmpeg', '-v', 'error', '-i', mp4, '-vf', f'scale={W}:{H}:flags=area', '-pix_fmt', 'gray', '-f', 'rawvideo', '-'],
                       capture_output=True, check=True)
    F = np.frombuffer(p.stdout, np.uint8).reshape(-1, H, W).astype(np.float32)
    n = len(F); luma = F.mean((1, 2)); hist = np.zeros(n); tx = np.zeros(n); ty = np.zeros(n); dz = np.zeros(n); resid = np.zeros(n)
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
    from scipy.ndimage import median_filter
    cut = (hist > 0.22) | (resid > 25)
    content = np.where(cut, 0, np.maximum(0, resid - median_filter(resid, 31)))
    vel = np.stack([tx * 10, ty * 10, dz * 1000], 1)
    acc = np.r_[0, np.linalg.norm(np.diff(vel, axis=0), axis=1)]; acc[cut] = 0; acc[np.r_[False, cut[:-1]]] = 0
    flash = np.abs(luma - median_filter(luma, 9)); flash[cut] = 0
    return dict(cut=cut, content=content, acc=acc, flash=flash, n=n)


def resp(V, g):
    i = g - G0; w = slice(max(0, i - 1), min(V['n'], i + 3))
    r = dict(cut=bool(V['cut'][w].any()), content=float(V['content'][w].max()), acc=float(V['acc'][w].max()), flash=float(V['flash'][w].max()))
    r['strong'] = r['cut'] or r['content'] > 4 or r['acc'] > 6 or r['flash'] > 12
    return r


old = sys.argv[1] if len(sys.argv) > 1 else ROOT + '/work/seg/07/seg_07_v6.mp4'
new = sys.argv[2] if len(sys.argv) > 2 else ROOT + '/work/seg/07/seg_07.mp4'
D = json.load(open(ROOT + '/work/rhythm_diag/drums.json'))['beats']
VO, VN = feats(old), feats(new)
ks = [k for k in range(171, 199)] + [188.5, 190.5, 198.5]
ks.sort()
ho = hn = 0; out = []
print(f"{'beat':>6} {'g':>5}  drums                  | v6: hit  cont   acc  fl      | v7: hit  cont   acc  fl   acc-peak")
for k in ks:
    g = fr(k)
    if k == int(k):
        x = D[int(k)]; dr = f"kick{x['kick']:.2f} sn{x['snare']:.2f} cr{x['crash_db']:5.1f}"
    else:
        x = D[int(k)]; dr = f"(half) sn16 {x['subs'][2]:.2f}        "
    ro, rn = resp(VO, g), resp(VN, g)
    i = g - G0; w = VN['acc'][max(0, i - 3):i + 4]; pk = int(np.argmax(w)) + max(0, i - 3) - i if len(w) else 0
    ho += ro['strong'] and k == int(k); hn += rn['strong'] and k == int(k)
    f = lambda r: f"{'*' if r['strong'] else ' '}{'C' if r['cut'] else ' '} {r['content']:5.1f} {r['acc']:5.1f} {r['flash']:4.1f}"
    print(f"k{k:<5} {g:5d}  {dr} | {f(ro)}   | {f(rn)}   {pk:+d}")
nb = len([k for k in ks if k == int(k)])
print(f"beats with a picture response: v6 {ho}/{nb} ({ho / nb:.0%}), v7 {hn}/{nb} ({hn / nb:.0%})")
