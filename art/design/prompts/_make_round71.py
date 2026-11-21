"""Round 71: the in-between for the second shout in demo 2 (rface_scr2 -> rface_scr_o), held half a beat on screen,
so the crying shout opens into the rounder shout as a movement. Drawn from both keys; every part halfway."""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import variant
V = {'rface_scr_mid': ("the moment HALFWAY from this face towards the face in the second attached image, as one in-between drawing: "
                       "the mouth opening from this shout halfway towards the rounder, taller 'o' shout of the second image, the "
                       "eyebrows drawn up halfway between the two; the eyes and tears as they are; everything else exactly as it is.")}
for n, ch in V.items():
    for suf in ('_a', '_b'):
        open(os.path.join(here, n + suf + '.txt'), 'w', encoding='utf-8').write(variant(ch) + "\n")
print('ok')
