"""Round 49: the face close-ups again, under the fixed rules (rules.py): one face master made with her turnaround as
Image 1 and her sheet faces enlarged, the LARGE and NEVER rules; every expression is that master redrawn with one change.
Plus two wind phases of the back view, so a hold of more than half a second is not a frozen picture (the ココロ rule).
"""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import full, variant

jobs = {
 'rface_m': full(
   "One illustration (landscape 3:2). A close-up of her face and shoulders, seen a little from below (the camera at her chest height, "
   "close), as in the second attached image which shows her at this moment on the school roof at night: the whole head with the big bow "
   "in the picture, the top of the bow near the top edge, the collar, ribbon tie and the top of the lanyard at the bottom edge. She looks "
   "straight ahead past the camera, mouth closed, brows a little drawn together, holding back tears that have not fallen yet. Her hair "
   "hangs naturally.", large=True),
 'rback_w1': variant("a gust of wind from the viewer's right: the ends of her hair and the bow loops lift a little toward the viewer's "
   "left, and the hem of her skirt sways a little to the left. Nothing else moves."),
 'rback_w2': variant("a gust of wind from the viewer's left: the ends of her hair and the bow loops lift a little toward the viewer's "
   "right, and the hem of her skirt sways a little to the right. Nothing else moves."),
}
for name, body in jobs.items():
    open(os.path.join(here, name + '.txt'), 'w', encoding='utf-8').write(body + "\n")
print(len(jobs), 'prompts')
