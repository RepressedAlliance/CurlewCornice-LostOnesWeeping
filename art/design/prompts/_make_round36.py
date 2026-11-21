"""Round 36: the other playing drawings for the roof shot (03 and its clip), each redrawn from rlow3_master with one change,
so the swaps on the beat change only the head or one arm (same camera, same size, same feet, same guitar, same card)."""
import os
here = os.path.dirname(os.path.abspath(__file__))
KEEP = ("Redraw the attached image exactly: the same girl, the same face, hair, bow, hairclips, uniform, the same gold Les Paul and its black cable, "
        "the same name card on its teal lanyard, the same LOW camera from waist height looking up, the same size and position in the canvas, the "
        "same wide stance and the same feet positions, the same clean anime drawing style and colours, pure white background, no motion blur. ")
jobs = {
 'rlow3_down': KEEP + "Change only this: her head is bowed over the guitar, eyes OPEN looking down at her strumming hand, teeth gritted, her hair falling forward a little.",
 'rlow3_up': KEEP + "Change only this: she throws her head back and shouts up at the sky, chin up, eyes OPEN looking up, mouth wide open; her hands stay on the guitar.",
 'rlow3_fist': KEEP + "Change only this: her right hand has left the strings and is raised high in a fist with the pick in it, after a big downstroke, and she shouts at the camera with her eyes OPEN.",
}
for name, body in jobs.items():
    open(os.path.join(here, name + '.txt'), 'w', encoding='utf-8').write("One full-body illustration (portrait 2:3).\n" + body + "\n")
print(len(jobs), 'prompts')
