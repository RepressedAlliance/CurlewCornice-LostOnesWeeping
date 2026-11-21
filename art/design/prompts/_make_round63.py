"""Round 63: the medium-shot set for the new 3D part. Five variants of the medium master (rmid_master = candidate b), one
change each, for the headbang cycle and the accents; and a medium back view (its own set-up), two candidates."""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import variant, full
V = {
 'rmid_bang':   "her head snapped DOWN in a headbang: chin on her chest, eyes shut tight, mouth open, her hair flung forward and up "
                "round her face by the motion, the bow tipped forward; her hands, guitar, body and framing stay as they are.",
 'rmid_bmid':   "her head HALFWAY down on its way into a headbang: chin lowered, eyes half shut, her hair starting to lift forward; her "
                "hands, guitar, body and framing stay as they are.",
 'rmid_up':     "her head thrown far BACK, screaming up at the sky: face tilted up, mouth wide open, eyes shut, her hair falling back "
                "from her face; her hands, guitar, body and framing stay as they are.",
 'rmid_fist':   "her RIGHT hand raised high above the strings in a fist round the pick, the arm bent up beside her head, her left hand "
                "still on the neck, her mouth open in a shout; the guitar, body and framing stay as they are.",
 'rmid_stroke': "a huge DOWNSTROKE: her right arm swept down and out past the guitar's lower body, the pick just through the strings, "
                "her shoulders leaning forward into it, mouth open; the guitar, the left hand on the neck and the framing stay as they are.",
}
for name, ch in V.items():
    open(os.path.join(here, name + '.txt'), 'w', encoding='utf-8').write(variant(ch) + "\n")
BACK = (
    "One illustration (portrait 2:3). A medium shot of her from BEHIND, from the hips up, the camera at her chest height and level: she "
    "stands facing away from us, playing her gold-top Les Paul (second attached image; only the headstock and a little of the neck show "
    "past her left shoulder), her head turned a little to her left so the edge of her cheek shows, looking out over the town. The back of "
    "her charcoal blazer, the plain black strap crossing her back from her left shoulder, her short yellow-blonde hair and the big white "
    "bow seen from behind (exactly as on the back view of the turnaround). Her hips run off the bottom edge of the picture; her whole head "
    "and bow are inside it with a little space above the bow; her elbows are inside the left and right edges.")
for name in ('rmid_back_a', 'rmid_back_b'):
    open(os.path.join(here, name + '.txt'), 'w', encoding='utf-8').write(full(BACK, hands=True) + "\n")
print(len(V) + 2, 'prompts')
