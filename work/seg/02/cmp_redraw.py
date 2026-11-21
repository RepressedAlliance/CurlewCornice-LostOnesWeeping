import os as _os_lo
_LO_ROOT = (_os_lo.environ.get('LOSTONE_ROOT') or _os_lo.path.abspath(_os_lo.path.join(_os_lo.path.dirname(_os_lo.path.abspath(__file__)), '../../..'))).replace('\\', '/')
"""Compare a lanyard-free redraw with its 01 master: master | redraw | overlay (master teal, redraw dark) for the whole figure and
the chest. usage: python work/seg/02/cmp_redraw.py <out.png> <name> [<name> ...]   (name like p3 or p3x; master t01_p3)"""
import sys
from PIL import Image, ImageChops, ImageOps
ROOT = _LO_ROOT
out, names = sys.argv[1], sys.argv[2:]
rows = []
for n in names:
    m = Image.open(f'{ROOT}/art/cut/t01_{n.rstrip("x")}.png').convert('RGBA')
    r = Image.open(f'{ROOT}/art/design/out/s02b_{n}.png').convert('RGBA')
    if r.size != m.size: print(n, 'SIZE', r.size); r = r.resize(m.size)
    def flat(im):
        bg = Image.new('RGBA', im.size, (255, 255, 255, 255)); bg.alpha_composite(im); return bg.convert('L')
    a, b = flat(m), flat(r)
    ov = Image.merge('RGB', (b, a, a))     # red-ish where only the master has ink, cyan where only the redraw has
    d = ImageChops.difference(a, b); bb = (d.point(lambda v: 255 if v > 60 else 0)).getbbox()
    al = [im.split()[3].getbbox() for im in (m, r)]
    print(n, 'alpha bbox master', al[0], 'redraw', al[1], 'diff bbox', bb)
    row = Image.new('RGB', (3 * 512, 768 + 400), 'white')
    for i, im in enumerate((a.convert('RGB'), b.convert('RGB'), ov)):
        row.paste(im.resize((512, 768)), (i * 512, 0))
        row.paste(im.crop((300, 430, 724, 830)).resize((424, 400)), (i * 512 + 44, 768))
    rows.append(row)
W = Image.new('RGB', (1536, sum(r.height for r in rows)), 'white')
y = 0
for r in rows: W.paste(r, (0, y)); y += r.height
W.save(out)
