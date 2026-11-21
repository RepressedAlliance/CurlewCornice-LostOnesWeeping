"""Low-frequency frame difference of the halftone screens in segment 07 against the plain paper wall, over the slow camera
moves (the method of work/seg/03/moire_check.py: frames box-filtered to 1/8, mean absolute difference frame to frame).
The regions are found on the window's middle frame instead of hand-placed: 'screen' = halftone (fine periodic texture:
high variance in 6x6 blocks, but no long edge), 'paper' = flat paper (low variance), both eroded so edges stay out.
usage: python moire_check07.py <frames_dir> [f0 f1 ...]   (pairs of global frames; default: the three slow moves)"""
import sys, numpy as np
from PIL import Image
from scipy import ndimage as ndi

d = sys.argv[1]
nums = [int(a) for a in sys.argv[2:]]
wins = list(zip(nums[0::2], nums[1::2])) if nums else [(1999, 2043), (2054, 2121), (2188, 2220)]
names = {(1999, 2043): 'k179-k183 push A->B', (2054, 2121): 'k184-k190 drift on the calendar', (2188, 2220): 'k196-k199 push to her'}

def full(f): return np.asarray(Image.open(f'{d}/g_{f:07d}.png').convert('L'), dtype=np.float32)
def lo(f): return np.asarray(Image.open(f'{d}/g_{f:07d}.png').convert('L').resize((240, 135), Image.BOX), dtype=np.float32)

for f0, f1 in wins:
    ref = full((f0 + f1) // 2)
    # local statistics in 8x8 blocks (one low-res cell each)
    b = ref[:1080, :1920].reshape(135, 8, 240, 8)
    var = b.var(axis=(1, 3)); mean = b.mean(axis=(1, 3))
    # long edges: strong gradient energy along a line (sobel magnitude max in the block) vs halftone's many small dots
    gx = ndi.sobel(ref, 1); gy = ndi.sobel(ref, 0); gm = np.hypot(gx, gy)[:1080, :1920].reshape(135, 8, 240, 8).max(axis=(1, 3))
    screen = (var > 40) & (var < 2500) & (mean > 150) & (mean < 235)
    paper = (var < 6) & (mean > 225)
    screen = ndi.binary_erosion(screen, iterations=1); paper = ndi.binary_erosion(paper, iterations=2)
    prev = None; acc = {'screen': [], 'paper': []}
    for f in range(f0, f1 + 1):
        a = lo(f)
        if prev is not None:
            dd = np.abs(a - prev)
            acc['screen'].append(dd[screen].mean() if screen.any() else np.nan)
            acc['paper'].append(dd[paper].mean() if paper.any() else np.nan)
        prev = a
    print(f'{names.get((f0, f1), f"{f0}-{f1}")} (frames {f0}-{f1}; cells: screen {int(screen.sum())}, paper {int(paper.sum())})')
    for k, v in acc.items():
        v = np.array(v); print(f'  {k:6s}: mean {np.nanmean(v):.2f}  max {np.nanmax(v):.2f} grey levels / frame (1/8 res)')
