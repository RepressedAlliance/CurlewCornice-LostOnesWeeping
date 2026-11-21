"""Round 62: the 3D part changes approach (the owner: "the 3D is still bad"; the props read as grey boxes and the
full-body cut-out cannot carry the frame). She is now shown in medium shots drawn whole for that framing, set among 3D
cards that pass in front of and behind her; no feet, no floor, no props. This is the medium-shot master; three candidates."""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import full
BODY = (
    "One illustration (portrait 2:3). A medium shot of her from the hips up playing her gold-top Les Paul (second attached image: "
    "gold top, two cream P-90 pickups, tune-o-matic bridge), the camera at her chest height and looking up at her only a little. She "
    "stands square to the camera and strikes the strings hard with her right hand, her left hand on the neck; her head is thrown back a "
    "little, her mouth open in a shout, her eyes fierce; her hair and the two loops of her bow are tossed by the motion. The guitar "
    "hangs across her hips on the plain black strap over her left shoulder; the guitar's lower body and her hips run off the bottom "
    "edge of the picture, the headstock is inside the picture. The teal lanyard and her small white name card swing out from her chest. "
    "Her face is the face in the third attached image (her face master), with this expression. Her whole head, hair and bow are inside "
    "the picture with a little space above the bow.")
for name in ('rmid_master_a', 'rmid_master_b', 'rmid_master_c'):
    open(os.path.join(here, name + '.txt'), 'w', encoding='utf-8').write(full(BODY, hands=True) + "\n")
print('3 prompts')
