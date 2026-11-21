import os as _os_lo
_LO_ROOT = (_os_lo.environ.get('LOSTONE_ROOT') or _os_lo.path.abspath(_os_lo.path.join(_os_lo.path.dirname(_os_lo.path.abspath(__file__)), '../../..'))).replace('\\', '/')
"""Rhythm check of one segment's film against the drums (work/rhythm_diag's measures, on the segment's own mp4).
usage: python work/seg/11/rhythm_check.py <seg.mp4> <first global frame> <k0> <k1> [out_dir]
Decodes the mp4 at 192x108 grey, runs work/rhythm_diag/video.py's per-frame measures on it, pads them into a whole-film
array at the segment's place, and prints work/rhythm_diag/align.py's per-beat table (music events against picture
response) for beats k0..k1-1, plus the per-frame table around each beat in --frames mode."""
import os, sys, shutil, subprocess, tempfile
import numpy as np

ROOT = _LO_ROOT
DIAG = ROOT + '/work/rhythm_diag'
mp4, g0, k0, k1 = os.path.abspath(sys.argv[1]), int(sys.argv[2]), int(sys.argv[3]), int(sys.argv[4])
tmp = tempfile.mkdtemp(prefix='rh11_')
for f in ['align.py', 'mstruct.py', 'drums.json']:
    shutil.copy(os.path.join(DIAG, f), tmp)
# video.py with the input and the output redirected
src = open(os.path.join(DIAG, 'video.py'), encoding='utf-8').read()
src = src.replace("ROOT + '/work/full/film.mp4'", repr(mp4.replace('\\', '/')))
src = src.replace("np.savez(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'video.npz')", "np.savez(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'seg.npz')")
open(os.path.join(tmp, 'video_seg.py'), 'w', encoding='utf-8').write(src)
subprocess.run([sys.executable, os.path.join(tmp, 'video_seg.py')], check=True, cwd=tmp, stdout=subprocess.DEVNULL)
z = np.load(os.path.join(tmp, 'seg.npz'))
n = 6400
out = {}
for k in ['mad', 'luma', 'hist', 'tx', 'ty', 'dz', 'resid']:
    a = np.zeros(n); v = z[k]; a[g0:g0 + len(v)] = v
    if k == 'hist': a[g0] = 1.0                 # the cut into the segment
    out[k] = a
np.savez(os.path.join(tmp, 'video.npz'), **out)
r = subprocess.run([sys.executable, 'align.py', 'beats', str(k0), str(k1)], cwd=tmp, capture_output=True, text=True)
print(r.stdout); print(r.stderr[-2000:])
if len(sys.argv) > 5:
    shutil.copy(os.path.join(tmp, 'video.npz'), os.path.join(sys.argv[5], 'rhythm_video.npz'))
shutil.rmtree(tmp, ignore_errors=True)
