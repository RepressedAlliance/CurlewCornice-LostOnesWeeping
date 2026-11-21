"""Round 65: the 2D demo's last shot, again. The review: her bust pasted beside the slip "like a slide", unrelated to it; the
crack too weak. Now she holds the reader's result slip: a bust, the slip held flat across her chest with both hands, facing
the camera, its middle left blank (the 16-dot print is laid on it in code). Three candidates; daylight, the face master."""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import full
BODY = (
    "One illustration (landscape 3:2). A bust of her, from the waist up, facing the camera straight on, the camera at her eye height. "
    "She holds a long white paper slip (a receipt from a machine, about 30 cm long and 9 cm tall, plain white, NOTHING printed on it, "
    "square corners) horizontally across her chest with both hands, pinching its two short ends between thumbs and fingers, the slip "
    "held flat and square to the camera so its whole face is seen undistorted; her hands cover only the very ends of the slip. She "
    "looks down at it with a stiff smile, the corners of her mouth up, her eyes dull. Her face is the face in the second attached image "
    "(her face master) with this expression; her hands as on the turnaround (enlarged in the last attached image). Her whole head, hair "
    "and bow are inside the picture with a little space above the bow; the blazer, white collar, teal ribbon tie and the teal lanyard "
    "with her name card run off the bottom edge. Plain flat daylight from the upper left: one hard-edged shadow tone, no rim light, no "
    "glow, no pale line along the outline.")
for name in ('rslip_master_a', 'rslip_master_b', 'rslip_master_c'):
    open(os.path.join(here, name + '.txt'), 'w', encoding='utf-8').write(full(BODY, hands=True, night=False) + "\n")
print('3 prompts')
