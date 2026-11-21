"""Segment 14 (最终副歌): 高橋 正男 redrawn for S2 frame B (third independent review, 2026-11-21).

Why: t14_p3cu (box x ±0.30 m, 0.82-1.72 m) ended at 0.82 m, inside frame B (bottom edge 0.71 m): his folded hands were cut by a
straight line and the open lane's white light and the man behind (山口, first row) showed under it; and the crop had lost his cane,
which he leans on in his 01 drawing (the wide W7 cuts to it one second later). The new box keeps the same width and px per metre
(17.1 px/cm, 1.12x in S2) and moves down: x ±0.30 m, 0.60-1.50 m: the canvas bottom is 0.11 m under frame B's bottom edge, its top
0.15 m over the highest top edge of S2 (1.35 m with the k464 sink), so in S2 no edge of the drawing is ever on screen except where a
cabinet covers it (checked by EDGE AUDIT in seg_14.js). He keeps his 01 pose: both hands folded on the crook of his cane, the cane
straight down.
usage: python art/design/prompts/_make_seg14h.py   -> writes the board and the prompts, prints the make_jobs line
"""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from _make_seg14g import board_from
from _make_seg15 import TOWN_HAND, TTAIL

TAKA_BOX2 = dict(x0=-0.30, x1=0.30, h0=0.60, h1=1.50)

UP = ("The first attached image is an ENLARGED, blurry low-resolution copy of part of a finished drawing of this person. Redraw it "
      "as a crisp, clean drawing at full resolution: EXACTLY the same framing, size and position in the canvas (do not move, shrink "
      "or enlarge him: every part of him stays where it is in the first image: the top edge cutting across his bowed head, the "
      "shoulders, the arms, the hands, the cane, the lanyard's two strands and where they stop, the cut of the bottom edge across his "
      "legs), the same pose, the same bowed head, the same clothes. The second attached image is his design sheet: keep the face, "
      "age, hair, glasses, cardigan and cane true to it. The third attached image is an earlier crisp redraw of the upper part of the "
      "same drawing: use it for the line quality and the cardigan's details only (its framing does not apply, and its hands are cut "
      "off; here the hands are whole). Every line clean, sharp and even at this size, as if drawn for this size; the screentone dots "
      "clean and round; nothing blurry, nothing soft. Nothing is added: no card, no clip, no holder on the lanyard (the film adds "
      "them).")
BODY = ("He is 高橋 正男, an old man of about 78 with white hair and round glasses, a cardigan over a shirt and slacks; his head is "
        "bowed. He leans a little on his walking cane: the cane stands straight down in front of him, between his feet, and BOTH his "
        "hands rest folded one over the other on the cane's crook at about the height of his hips, the fingers whole and clearly "
        "drawn (an old man's hands, the right length for his arms), the cane's shaft running straight down from his hands out of the "
        "bottom edge. The hands, the crook and the shaft are drawn where they are in the first image.")
P3CU2 = "\n".join([UP, BODY, TOWN_HAND, TTAIL])

if __name__ == '__main__':
    print('takahashi box 2', board_from('t01_p3.png', 512, 160, 378, out='t14_p3cu2_up.png', **TAKA_BOX2))
    for n in ('t14_p3cu2', 't14_p3cu2b'):
        open(os.path.join(here, n + '.txt'), 'w', encoding='utf-8').write(P3CU2)
    refs = '../design/board/seg14/t14_p3cu2_up.png+../canon/town/p03_takahashi_masao_elder_cane.png+../design/out/t14_p3cu.png'
    print('python tools/make_jobs.py seg14_h1 ' + ' '.join(f'"-{n}:{refs}"' for n in ('t14_p3cu2', 't14_p3cu2b')))
