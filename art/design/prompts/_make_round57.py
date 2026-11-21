"""Round 57: the picking hand's upstroke, redrawn from the chosen downstroke (rcu_hand3_dnb), so the two make one cycle."""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import variant

UP = ("the UPSTROKE a moment later: the pick has come up through the strings and now sits just above the top string, the wrist "
      "turned slightly up so the back of the hand faces a little more towards us and the fingers are a little more open; the "
      "six strings are drawn straight again except the two thinnest, drawn as two thin parallel lines because they are still "
      "ringing. The hand stays the same size, the same slim girl's hand, in the same place over the strings; the sleeve, cuff, "
      "guitar, pickups, bridge, framing and lighting are exactly as before.")
for name in ('rcu_hand3_up', 'rcu_hand3_upb'):
    open(os.path.join(here, name + '.txt'), 'w', encoding='utf-8').write(variant(UP) + "\n")
print('2 prompts')
