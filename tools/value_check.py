"""Value (light/dark) check for a frame: grayscale posterised to 5 steps beside the original, so
it is obvious whether the subject carries the strongest contrast in the picture.
usage: python value_check.py frame.png out.png"""
import sys
import numpy as np
from PIL import Image

src, dst = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGB')
g = np.asarray(im.convert('L')).astype(np.float32)
steps = np.array([20, 75, 128, 180, 235], np.float32)
idx = np.clip(np.round(g / 255 * 4), 0, 4).astype(int)
post = steps[idx].astype(np.uint8)
w, h = im.size
s = 960 / w
a = im.resize((960, int(h * s)))
b = Image.fromarray(post).convert('RGB').resize((960, int(h * s)), Image.NEAREST)
out = Image.new('RGB', (1920, int(h * s)))
out.paste(a, (0, 0)); out.paste(b, (960, 0))
out.save(dst)
