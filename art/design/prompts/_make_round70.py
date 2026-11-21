"""Round 70: one in-between for the end of demo 1 (A2), where the stiff smile cracks on beat 166.
The existing rface_ochi_half overshot: its mouth is flat, so between two smiles (rface_ochi, rface_ochi_crack) the mouth
goes smile -> flat -> smile in two frames and twitches. This one is drawn from the two keys themselves, every part on its
way from the first to the second: the eyes opening, the brows starting to lift, the SAME smile only starting to tremble.
Two candidates; the one whose eyes, brows and mouth all sit between the two keys is used for two frames before the beat.
"""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import variant
V = {
 'rface_ochi_mid': ("the moment one third of the way from this face towards the cracked face in the second attached image, as a single "
                    "in-between drawing: the upper eyelids lifted a little (the eyes rounder than now, but not yet as wide as in the "
                    "second image), the eyebrows just beginning to rise and draw together in the middle, the mouth STILL in this same "
                    "small upward smile, only its corners beginning to tremble (the line very slightly wavy, still curving up); no tears "
                    "yet, only a faint wet shine along the lower lids; everything else exactly as it is."),
}
for n, ch in V.items():
    for suf in ('_a', '_b'):
        open(os.path.join(here, n + suf + '.txt'), 'w', encoding='utf-8').write(variant(ch) + "\n")
print(len(V) * 2, 'prompts')
