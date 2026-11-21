"""Round 59: the writing hand for the 2D demo, again. hpen2 read as a fist holding a stick, with a sharpened back end on the
pencil and a broad palm (review of the 2D demo). Seen from straight above like the desk; daylight, no night rim; three
candidates for a new master."""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import full

BODY = (
    "One illustration (portrait 2:3). Seen from straight above, looking down at a desk: her RIGHT hand writing with a Japanese school "
    "pencil (a dark green painted hexagonal body, a sharpened natural-wood cone and a black graphite point). The thumb and index finger "
    "pinch the pencil a little above the wood cone, the middle finger supports it from below, the ring and little fingers curl lightly "
    "under the hand; the graphite point touches the paper at the upper left of the hand. The pencil's other end is a FLAT painted end, "
    "not sharpened, sticking out a little past the knuckles toward the lower right. The hand is small and slim, a 14-year-old girl's "
    "hand with a narrow palm and thin fingers, drawn as simply as the hands on the turnaround (enlarged in the last attached image). The "
    "wrist comes out of a white shirt cuff and the charcoal blazer sleeve, and the forearm in its sleeve runs straight down and leaves "
    "the picture through the bottom edge. The hand fills the upper half of the picture. Plain daylight from the upper left: one hard-edged "
    "shadow tone, no rim light, no glow.")
for name in ('hpen3_a', 'hpen3_b', 'hpen3_c'):
    open(os.path.join(here, name + '.txt'), 'w', encoding='utf-8').write(full(BODY, hands=True, night=False) + "\n")
print('3 prompts')
