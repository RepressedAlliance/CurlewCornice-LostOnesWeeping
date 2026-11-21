"""Round 60: rcu_cardfly_b (the card close-up with her whole face) still has a pale line outside the outline of her hair and
shoulders; redraw it with that one change, as the faces were in round 56."""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import variant
FIX = ("remove the pale light-blue line that runs along the OUTSIDE of her hair, shoulders and blazer: the outer edge of the whole "
       "figure is the same crisp dark-grey outline as everywhere else, with nothing light outside or along it. Nothing else changes: "
       "the same face, expression, hair, bow, card, lanyard, strap, framing and line work.")
for name in ('rcu_cardfly_b2', 'rcu_cardfly_b3'):
    open(os.path.join(here, name + '.txt'), 'w', encoding='utf-8').write(variant(FIX) + "\n")
print('2 prompts')
