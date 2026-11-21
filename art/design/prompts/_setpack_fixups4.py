"""Deterministic finishing steps for the round-4 set-pack fixes (2026-11-20, second art review), applied to chosen Codex sheets
in art/design/out. Nothing is repainted by hand: the steps only resample geometry or set the machine's print by code.

- eraser: sp_eraser_e is drawn on board/guide_eraser.png with a BLANK sleeve; tools/eraser_print.py sets 「読取機用」 and the six
  timing squares on the fixed 16-dot grid, lying on view (1), turned 90 degrees on view (3).  -> sp_eraser_e_print.png
- reader: sp_reader_i (sp_reader_g with a slimmer eraser and the print head beside the paper) gets the same print, turned 90
  degrees, on the standing eraser at (4).  -> sp_reader_i_print.png
- lespaul: tools/lespaul_neckfit.py on sp_lespaul_h, the binding/truss-cover redraw: its front neck came back about 9% wider, so
  the front neck is scaled 0.92 first, then the side-view neck depth and the back-view neck width are fitted.
usage: python art/design/prompts/_setpack_fixups4.py [eraser] [reader] [lespaul=<name>]
"""
import os, subprocess, sys

here = os.path.dirname(os.path.abspath(__file__))
out = os.path.join(here, '..', 'out')
root = os.path.abspath(os.path.join(here, '..', '..', '..'))
tool = lambda n: os.path.join(root, 'tools', n)
o = lambda n: os.path.join(out, n)


def run(*args):
    r = subprocess.run([sys.executable, *args], capture_output=True, text=True)
    print(r.stdout.strip() or r.stderr.strip())


steps = sys.argv[1:] or ['eraser', 'reader', 'lespaul=sp_lespaul_h']
for s in steps:
    if s == 'eraser':
        run(tool('eraser_print.py'), o('sp_eraser_e.png'), o('sp_eraser_e_print.png'), '--lying', '540,300', '--standing', '1270,512')
    elif s == 'reader':
        run(tool('eraser_print.py'), o('sp_reader_i.png'), o('sp_reader_i_print.png'), '--standing', '845,590')
    elif s.startswith('lespaul='):
        n = s.split('=', 1)[1]
        run(tool('lespaul_neckfit.py'), o(n + '.png'), o(n + '_fit.png'), '--front-scale', '0.92')
        run(tool('lespaul_measure.py'), o(n + '_fit.png'))
