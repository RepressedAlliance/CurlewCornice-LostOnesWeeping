import os as _os_lo
_LO_ROOT = (_os_lo.environ.get('LOSTONE_ROOT') or _os_lo.path.abspath(_os_lo.path.join(_os_lo.path.dirname(_os_lo.path.abspath(__file__)), '../../..'))).replace('\\', '/')
"""After render_full.sh: mux seg_02.mp4 (+ _phone), a context film (01's last 3.7 s + 02 + 03's first 1.5 s, if rendered), and the
checks (qc_sheets, red_scan, static_scan), plus a phone-size sheet of every frame. usage: python work/seg/02/post_full.py"""
import os, shutil, subprocess, sys, glob
from PIL import Image
ROOT = _LO_ROOT; os.chdir(ROOT)
D = 'work/seg/02'; F = f'{D}/frames'; py = sys.executable
run = lambda *a: subprocess.run([py, *a], check=True)
frames = sorted(f for f in os.listdir(F) if f.startswith('g_') and f.endswith('.png'))
assert len(frames) == 44, len(frames)
def mux(src_files, t0, out):
    M = f'{D}/_mux'; shutil.rmtree(M, ignore_errors=True); os.makedirs(M)
    for i, p in enumerate(src_files): os.link(p, f'{M}/f_{i:05d}.png')
    run('tools/mux_demo.py', M, f'{t0}', out, '--phone'); shutil.rmtree(M)
mux([f'{F}/{f}' for f in frames], 410 / 30, f'{D}/seg_02.mp4')
ctx = [f'work/seg/01/frames/g_{g:07d}.png' for g in range(300, 410)] + [f'{F}/{f}' for f in frames]
n03 = [p for g in range(454, 500) for p in glob.glob(f'work/seg/03/frames*/g_{g:07d}.png')[:1]]
ctx += n03
mux(ctx, 300 / 30, f'{D}/context_01_02_03.mp4')
print('03 frames in the context film:', len(n03))
run('tools/qc_sheets.py', F, f'{F}/audit.json', f'{D}/qc', '--log', f'{D}/render_full.log')
run('tools/red_scan.py', F, '--out', f'{D}/red', '--stats')
run('tools/static_scan.py', F, '--audit', f'{F}/audit.json', '--t0', f'{410 / 30}', '--out', f'{D}/static')
# phone-size sheet: every frame at 390 x 219, 8 a row
W, H = 390, 219; cols = 8; rows = (len(frames) + cols - 1) // cols
S = Image.new('RGB', (cols * W, rows * H), 'black')
for i, f in enumerate(frames): S.paste(Image.open(f'{F}/{f}').convert('RGB').resize((W, H), Image.LANCZOS), ((i % cols) * W, (i // cols) * H))
S.save(f'{D}/check/phone_all.png'); print('done')
