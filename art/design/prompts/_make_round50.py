"""Round 50 (demos): the expressions from the face master rface_mb (one change each), the upstroke of the picking hand,
and the 2D demo's hand master (a slender girl's hand holding an HB pencil, under the HANDS rule with the sheet's hands).
"""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import full, variant, NEVER

NOFACE = (" Keep her face exactly the face of the attached image: the same eyes, the same tiny nose (one small stroke, never nostrils), "
          "the same line weight. No sweat drops, no blush.")
jobs = {
 'rface_in': variant("her expression only: she is holding back tears: her mouth pressed shut in a tight line, brows drawn together and "
   "up, her eyes wet with tears welling along the lower lids (clean tear shapes with a small highlight), not yet falling." + NOFACE),
 'rface_scr': variant("her expression only: she screams with all her strength, mouth wide open, brows pulled up in anguish, tears "
   "streaming from both eyes down her cheeks (clean shapes with a small highlight); her hair lifts a little at the ends." + NOFACE),
 'rface_cl': variant("her expression only: teeth clenched and bared in anger, lips pulled back, brows hard down, eyes fierce and wet." + NOFACE),
 'rface_up': variant("her expression only: she shouts upward, eyes turned up to the sky above the camera, mouth open, brows up." + NOFACE),
 'rcu_hand2_up': variant("the picking hand has come back UP after the downstroke: the pick is just above the strings, the wrist "
   "lifted a little; the strings are still vibrating (the struck ones drawn as two thin parallel lines). Nothing else changes."),
 'hpen_m': full(
   "One illustration (landscape 3:2). Seen from straight above: her RIGHT hand holding an HB pencil to write on an answer sheet (the "
   "sheet itself is not drawn), the pencil tip touching the paper at the centre of the picture, the hand resting on its side; the "
   "charcoal blazer sleeve with the white shirt cuff enters from the right edge. The pencil: a plain dark-green hexagonal HB pencil, "
   "sharpened, its point a dark graphite tip. Daylight from the upper left, flat colours with one hard shadow shape; no shadow cast "
   "on the (absent) paper.", hands=True, night=False),
}
for name, body in jobs.items():
    open(os.path.join(here, name + '.txt'), 'w', encoding='utf-8').write(body + "\n")
print(len(jobs), 'prompts')
