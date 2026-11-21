"""Contact sheet at one cell per 0.5 s (same look as tools/review_sheets.py flow sheets, which are one cell per 4 frames).
usage: python work/seg/02/sheet_05s.py <frames_dir> <out.png> [step_frames=15]
Frames are g_<global frame>.png (render_film.mjs); each cell is labelled with the global frame and song time."""
import os, sys
from PIL import Image, ImageDraw
src, out = sys.argv[1], sys.argv[2]
step = int(sys.argv[3]) if len(sys.argv) > 3 else 15
frames = sorted(f for f in os.listdir(src) if f.startswith('g_') and f.endswith('.png'))
pick = frames[::step]
if frames and frames[-1] not in pick: pick.append(frames[-1])
tw, th, cols = 480, 270, 4
rows = (len(pick) + cols - 1) // cols
sh = Image.new('RGB', (cols * (tw + 4), rows * (th + 4)), 'white')
for k, f in enumerate(pick):
    g = int(f[2:-4]); im = Image.open(os.path.join(src, f)).convert('RGB').resize((tw, th), Image.LANCZOS)
    d = ImageDraw.Draw(im); d.rectangle((0, 0, 132, 16), fill='black'); d.text((3, 2), f'g{g} {g / 30:.2f}s', fill='white')
    sh.paste(im, ((k % cols) * (tw + 4), (k // cols) * (th + 4)))
sh.save(out); print(out, len(pick), 'cells')
