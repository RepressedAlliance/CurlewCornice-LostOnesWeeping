"""Round 54: the 2D demo's writing hand again. Its sleeve was cut by the edge of its canvas, and that cut showed in the
frame. A writer's forearm comes in from the bottom of the picture, so the hand is drawn on a tall canvas with the forearm
and sleeve running straight down and out through the bottom edge, long enough that the cut is always below the frame.
"""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import full

jobs = {
 'hpen2_m': full(
   "One illustration (portrait 2:3). Seen from straight above, looking down at a desk: her RIGHT hand holding an HB pencil to write "
   "on an answer sheet (the sheet itself is not drawn), the pencil tip touching the paper in the upper third of the picture, a little "
   "left of centre. Her forearm in the charcoal blazer sleeve with the white shirt cuff runs from the hand straight DOWN and a little "
   "to the right, and leaves the picture through the BOTTOM edge: the sleeve continues past the bottom edge and is never cut off "
   "inside the picture. The hand is small and slim, the hand of a 14-year-old girl, about as long as one quarter of the picture's "
   "height. The pencil: a plain dark-green hexagonal HB pencil, sharpened, a dark graphite tip. Daylight from the upper left, flat "
   "colours with one hard shadow shape; nothing cast on the (absent) paper.", hands=True, night=False),
}
for name, body in jobs.items():
    open(os.path.join(here, name + '.txt'), 'w', encoding='utf-8').write(body + "\n")
    open(os.path.join(here, name.replace('_m', '_mb') + '.txt'), 'w', encoding='utf-8').write(body + "\n")
print('ok')
