"""Round 56, after the 3D demo review: the face close-ups had a bright outline round hair and bow (the night rim light,
drawn as a white border, read as a sticker) and a grey-violet bow (the sheet's bow is white); the picking hand read as a
fat pink fist. The faces are each redrawn with that one change (they stay one set); the hand is drawn again under the
HANDS rule with the sheet's own hands attached.
"""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import variant, full

FIX = ("remove the bright pale outline that runs round the outside of her hair, bow and shoulders: the outer edge of the figure is "
       "the same crisp dark-grey line as everywhere else, with no light band outside or along it; any night rim light is at most a "
       "thin highlight INSIDE the hair, never along the outline. Her bow is WHITE, as on her turnaround (in the night light a clean, "
       "very slightly cool white, never grey or violet), with exactly two upright loops and the same size as before. Nothing else "
       "changes: the same face, expression, hair, framing and line work.")
jobs = {n + '2': variant(FIX) for n in ['rface_mb', 'rface_in', 'rface_scr', 'rface_cl', 'rface_up']}
jobs['rcu_hand3_dn'] = full(
   "One illustration (landscape 3:2). An extreme close-up from a low angle of her RIGHT hand playing her gold-top Les Paul (second "
   "attached image: gold top, two cream P-90 pickups, tune-o-matic bridge): a small pick held between thumb and the side of the index "
   "finger strikes DOWN across the six strings between the pickups. The hand is small and slim, the hand of a 14-year-old girl, drawn "
   "as simply as the hands on the turnaround (enlarged in the last attached image); the charcoal blazer sleeve with the white shirt "
   "cuff comes in from the top-left corner and leaves the picture through it. The strings straight and taut, the struck ones drawn as "
   "two thin parallel lines. The guitar fills the lower part of the picture and runs off its bottom and right edges.", hands=True)
for name, body in jobs.items():
    open(os.path.join(here, name + '.txt'), 'w', encoding='utf-8').write(body + "\n")
print(len(jobs), 'prompts')
