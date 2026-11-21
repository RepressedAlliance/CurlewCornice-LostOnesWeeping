"""Segment 03 sample, second pass (variant A hall redesign): two more drawings from the r03 master chain.
  - r03_peer  (r03_down with one change: she brings the card up closer to her face and peers at it; k58, between the cut and the doors)
  - r03_up2   (r03_drop with one change: head up, looking at us, empty and hurt, the hurt a little more legible than r03_up)
usage: python art/design/prompts/_make_seg03b.py  -> writes the prompts and prints the make_jobs arguments
"""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import LARGE, variant

TURN = '../canon/rin_turnaround.png'
FACES_REF = '../ref/sheet_faces.png'
HANDS_REF = '../ref/sheet_hands.png'
CARD_BACK = '../canon/card_back_rules.png'

V = {
    'r03_peer': ('r03_down', "her RIGHT hand (on the viewer's LEFT) brings the card UP closer to her face: the card now held about 8 cm higher "
                 "than before, just under her chin level but still clearly below her mouth, a little nearer the middle of her chest, tilted "
                 "towards herself as before so we still see the plain white BACK of the card; the lanyard from her neck to the card's clip "
                 "slackens accordingly. Her head bows a little MORE towards the card and her eyes, looking down at it, open a fraction "
                 "wider: she peers at it, as if trying to read why it fails. The left arm, the body, the bag, the skirt and legs do not "
                 "move at all.", [TURN, CARD_BACK, HANDS_REF]),
    'r03_up2': ('r03_drop', "she lifts her HEAD level and looks straight at the viewer: her teal eyes open and look directly into the camera. "
                "The expression is empty and hurt: the eyes a little too still, the upper lids slightly heavy, the gaze not quite focused, as "
                "if she has just been told something and has not reacted yet; the inner ends of the eyebrows lifted and drawn together "
                "slightly (a small, clear worry in the brows), the mouth closed and small with its corners turned a little down. Not cold, "
                "not angry, not crying, no tears, no blush. The bow and bangs follow the head. The body, both arms, the lanyard ends, the "
                "gig bag, the skirt and legs do not move at all.", [TURN, FACES_REF]),
}
out = []
for n, (src, ch, refs) in V.items():
    body = variant(ch) + ("\n" + LARGE if n == 'r03_up2' else '')
    open(os.path.join(here, n + '.txt'), 'w', encoding='utf-8').write(body)
    out.append(f"-{n}:out/{src}.png+" + '+'.join(refs))
print(' '.join(f'"{a}"' for a in out))
