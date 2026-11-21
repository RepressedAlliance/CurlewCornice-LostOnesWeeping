import os as _os_lo
_LO_ROOT = (_os_lo.environ.get('LOSTONE_ROOT') or _os_lo.path.abspath(_os_lo.path.join(_os_lo.path.dirname(_os_lo.path.abspath(__file__)), '../../..'))).replace('\\', '/')
"""After render_sample.sh rendered frames_<v>: assemble the sample (01's frames 300-409 + 02's 410-469), mux with the song,
and make the check sheets. Done in one Python process (the shell's cp loop fails to fork when the machine is short of memory).
usage: python work/seg/02/post_sample.py a|b"""
import os, sys, shutil, subprocess
V = sys.argv[1]
ROOT = _LO_ROOT
os.chdir(ROOT)
D = 'work/seg/02'; F = f'{D}/frames_{V}'; C = f'{D}/sample_frames_{V}'; M = f'{D}/mux_{V}'; S0 = 300
for d in (C, M):
    shutil.rmtree(d, ignore_errors=True); os.makedirs(d)
for g in range(S0, 410):
    shutil.copy2(f'work/seg/01/frames/g_{g:07d}.png', C)
for f in sorted(os.listdir(F)):
    if f.startswith('g_') and f.endswith('.png'): shutil.copy2(f'{F}/{f}', C)
for i, f in enumerate(sorted(x for x in os.listdir(C) if x.startswith('g_'))):
    os.link(f'{C}/{f}', f'{M}/f_{i:05d}.png')
run = lambda *a: subprocess.run([sys.executable, *a], check=True)
run('tools/mux_demo.py', M, f'{S0 / 30}', f'{D}/sample_{V}.mp4', '--phone')
shutil.rmtree(M)
run('tools/qc_sheets.py', F, f'{F}/audit.json', f'{D}/qc_{V}', '--log', f'{D}/render_{V}.log')
run('tools/review_sheets.py', C, f'{D}/review_{V}', f'{S0 / 30}', '154')
run(f'{D}/sheet_05s.py', C, f'{D}/review_{V}/contact_0.5s.png', '15')
run(f'{D}/sheet_05s.py', F, f'{D}/review_{V}/contact_02_every2.png', '2')
print('done', V)
