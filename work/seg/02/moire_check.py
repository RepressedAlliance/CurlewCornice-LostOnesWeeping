"""Moire check for 02 (the method of work/seg/03/moire_check.py: low-frequency frame differences at 1/8 resolution).
Compares two renders of frames 410-453 (before and after the prefiltered screens):
  crawl   frame-to-frame low-frequency change, mean over the frame, per frame pair (a moving camera changes everything, so
          what matters is the difference between the two renders: aliasing adds flicker the clean screen does not have)
  weave   the low-frequency difference between the two renders of the same frame (how much blotchy low-frequency pattern the
          old screens laid over the picture)
  stillN  frames where the camera is still (k37-k38.5 wide and the rests between the stabs): frame-to-frame change must be 0
usage: python moire_check.py <old_frames_dir> <new_frames_dir>"""
import sys, numpy as np
from PIL import Image
A, B = sys.argv[1], sys.argv[2]
def lo(d, f): return np.asarray(Image.open(f'{d}/g_{f:07d}.png').convert('L').resize((240, 135), Image.BOX), dtype=np.float32)
fr = range(410, 454)
la = {f: lo(A, f) for f in fr}; lb = {f: lo(B, f) for f in fr}
crawl_a = [np.abs(la[f] - la[f - 1]).mean() for f in fr if f > 410]
crawl_b = [np.abs(lb[f] - lb[f - 1]).mean() for f in fr if f > 410]
print('pull-out k36-k37 (411-424) crawl, grey levels/frame:  old mean %.2f  new mean %.2f' % (np.mean(crawl_a[:14]), np.mean(crawl_b[:14])))
for f, a, b in zip(range(411, 454), crawl_a, crawl_b):
    if f <= 424: print(f'  {f}: old {a:.2f}  new {b:.2f}')
still = [f for f in range(425, 437)] + [446, 447, 450, 451, 452, 453]
print('still frames, frame-to-frame:  old max %.3f  new max %.3f' % (max(np.abs(la[f] - la[f - 1]).mean() for f in still), max(np.abs(lb[f] - lb[f - 1]).mean() for f in still)))
# weave: high-pass of the 1/8 image (minus its own 3x3 blur) inside the people band, old vs new: aliasing shows as extra energy
def hp(x):
    p = np.pad(x, 1, mode='edge'); bl = sum(p[i:i + x.shape[0], j:j + x.shape[1]] for i in range(3) for j in range(3)) / 9
    return np.abs(x - bl)[40:120, :].mean()
wa = [hp(la[f]) for f in fr]; wb = [hp(lb[f]) for f in fr]
print('low-frequency weave (1/8-res high-pass, people band):  old mean %.2f  new mean %.2f; wide 433: old %.2f new %.2f' % (np.mean(wa), np.mean(wb), wa[23], wb[23]))
