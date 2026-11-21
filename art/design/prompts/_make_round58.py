"""Round 58: the card close-up again. rcu_card_an showed the card raised in front of her and below it only her collar and
bow tie: no neck, no head, no hair round the card, a body without a head (the owner caught it). Now her whole face is above
the flung card, drawn from her face master; three candidates."""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import full

BODY = (
    "One illustration (landscape 3:2). A chest-up close-up, the camera at her chest height and straight on, at the instant her head "
    "snaps down in a headbang while she plays: eyes squeezed shut, mouth wide open in a shout, her hair flung upward and outward by the "
    "motion, the bow's two loops tossed up. Her ID card on its teal lanyard has been flung up out of her blazer by the same motion and "
    "is in the air in front of her chest, tilted, just below her chin: it is the card in the third attached image, copy its printed "
    "design exactly (個人読取カード, the name field left blank, rows of numbered bubbles), as big as a real ID card next to her. Her "
    "WHOLE face is visible above the card; the card never covers her face. Her whole head, hair and bow are inside the picture with "
    "a little space above the bow. Her neck, white collar and teal ribbon tie, her shoulders in the charcoal blazer, and the plain black "
    "guitar strap over her left shoulder (on the viewer's right) are at the bottom, and the blazer runs off the bottom edge and both side "
    "edges of the picture. Her face is the face in the second attached image (her face master): the same eyes, mouth and nose, here "
    "with the eyes shut and the mouth open.")
for name in ('rcu_cardfly_a', 'rcu_cardfly_b', 'rcu_cardfly_c'):
    open(os.path.join(here, name + '.txt'), 'w', encoding='utf-8').write(full(BODY, large=True) + "\n")
print('3 prompts')
