"""Round 67, after the third reviews. The headbang pair lost her bow (seen from above it read as a headband) and looked like
someone else; the crying face and the cracking smile froze; the smile cracked with no in-between."""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import variant
BOW = ("Her big white bow stays exactly her bow: two upright loops and a small knot on the white headband, clearly readable as the "
       "bow even with her head lowered (the loops stand up from the top of her head and tip forward a little; never flattened into a band).")
V = {
 'rmid_bang2': ("her head snapped DOWN in a headbang: chin towards her chest, eyes shut tight, mouth open, her hair flung forward round "
                "her face; " + BOW + " Her hands, guitar, body and framing stay as they are."),
 'rmid_bmid2': ("her head HALFWAY down on its way into a headbang: chin lowered, eyes half shut, hair starting to lift forward; " + BOW +
                " Her hands, guitar, body and framing stay as they are."),
 'rface_scr_blink': "her eyes SQUEEZED shut while she keeps shouting, tears pressed out along the lashes; everything else exactly as it is.",
 'rface_scr_o': "her mouth in a different shout, rounder and taller (an 'o'), the eyebrows drawn up harder; everything else exactly as it is.",
 'rface_ochi_half': ("HALFWAY between the stiff smile and crying: the eyebrows starting to lift in the middle, the eyes a little wider and just "
                     "glistening, the smile slipping at one corner; everything else exactly as it is."),
 'rface_ochi_crackblink': ("her eyes CLOSED tight in a blink, a tear running from each eye, the mouth still in its trembling wavy line, the "
                           "eyebrows lifted in the middle; everything else exactly as it is."),
}
for n, ch in V.items():
    open(os.path.join(here, n + '.txt'), 'w', encoding='utf-8').write(variant(ch) + "\n")
print(len(V), 'prompts')
