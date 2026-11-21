"""Contact sheets for a reviewer, so a review reads a handful of images instead of hundreds of frames.
usage: python tools/review_sheets.py <frames_dir> <out_dir> <fps_start_song_time> [cut_frames comma list]
Writes: flow.png (every 4th frame), cuts_N.png (the frame before and after each cut), crops_N.png (full-size crops
of the parts a viewer looks at: the figure's head, hands, feet, and the frame's edges).
"""
import os, sys
from PIL import Image, ImageDraw

src, out, t0 = sys.argv[1], sys.argv[2], float(sys.argv[3])
cuts = [int(c) for c in sys.argv[4].split(',')] if len(sys.argv) > 4 and sys.argv[4] else []
os.makedirs(out, exist_ok=True)
frames = sorted(f for f in os.listdir(src) if f.endswith('.png'))
n = len(frames)
load = lambda i: Image.open(os.path.join(src, frames[i])).convert('RGB')


def label(im, text):
    d = ImageDraw.Draw(im); d.rectangle((0, 0, 92, 16), fill='black'); d.text((3, 2), text, fill='white'); return im


# 1. the flow: every 4th frame, numbered with frame index and song time
tw, th, cols = 288, 162, 8
idx = list(range(0, n, 4))
for part in range(0, len(idx), 48):
    chunk = idx[part:part + 48]
    rows = (len(chunk) + cols - 1) // cols
    sh = Image.new('RGB', (cols * (tw + 4), rows * (th + 4)), 'white')
    for k, i in enumerate(chunk):
        sh.paste(label(load(i).resize((tw, th)), f'{i} {t0 + i / 30:.2f}s'), ((k % cols) * (tw + 4), (k // cols) * (th + 4)))
    sh.save(os.path.join(out, f'flow_{part // 48 + 1}.png'))
# 2. each cut: the last frame before it and the first two after it, larger
tw2, th2 = 480, 270
for part in range(0, len(cuts), 6):
    chunk = cuts[part:part + 6]
    sh = Image.new('RGB', (3 * (tw2 + 4), len(chunk) * (th2 + 4)), 'white')
    for r, c in enumerate(chunk):
        for k, i in enumerate((c - 1, c, c + 1)):
            if 0 <= i < n: sh.paste(label(load(i).resize((tw2, th2)), f'{i}'), (k * (tw2 + 4), r * (th2 + 4)))
    sh.save(os.path.join(out, f'cuts_{part // 6 + 1}.png'))
print('sheets in', out, 'frames', n)
