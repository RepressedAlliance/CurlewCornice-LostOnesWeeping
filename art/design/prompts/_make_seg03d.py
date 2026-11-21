import os as _os_lo
_LO_ROOT = (_os_lo.environ.get('LOSTONE_ROOT') or _os_lo.path.abspath(_os_lo.path.join(_os_lo.path.dirname(_os_lo.path.abspath(__file__)), '../../..'))).replace('\\', '/')
"""Segment 03 (片名・検票口), the hall rebuilt after the independent review (2026-11-20: the hall half was judged a drop below the
demo; her too small and static, the push to her chest too shallow). Two drawings:

  r03_flinch  r03_down3 redrawn with one change: k60, the instant the row of flaps slams shut at her waist, she startles: her
              eyes leave the card and go to the shut flap just in front of her (down and forward), a little wider; the card stays
              in her hand. Gives the swap at k60 its reason (the review: a swap 0.74 s after the cut with almost no change read as
              a jump) and gives the hall three acts: looks at the card (k56) -> the doors (k60) -> lets go (k64) -> looks at us (k68).
  r03_upC     r03_up2 at close-up resolution: the three steps in (k68-k70) now end on the storyboard's chest-up (the frame from
              0.90 m to 1.68 m), where r03_up2 would be shown at 1.31x. The first attached image is the chest-up crop of r03_up2
              (230,180)-(795,1027) enlarged 1.813x onto the 2:3 canvas (work/seg/03/art/r03_up2_crop.png); Codex redraws it crisp,
              line for line, same framing (so it lands on r03_up2 after a scale of 1.813 and the crop offset). About 1920 px/m;
              shown at 0.49x-0.72x.

usage: python art/design/prompts/_make_seg03d.py  -> writes the .txt prompts and prints the make_jobs arguments
"""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import LARGE, NEVER, variant

TURN = '../canon/rin_turnaround.png'
FACES = '../ref/sheet_faces.png'
CROP = (_LO_ROOT + '/work/seg/03/art/r03_up2_crop.png')

FLINCH = ("the instant a gate's flap slams shut right in front of her waist, she startles a little: her teal eyes leave the card "
          "and look DOWN and FORWARD at a point just in front of her belt (the shut flap in front of her, below the viewer's eye "
          "line), the eyes opened a little wider than now, the inner ends of the eyebrows lifted a little more, the mouth closed and "
          "small; her head comes up only very slightly (a few degrees) and her shoulders rise a little. Her right hand keeps holding "
          "the card exactly where it is, at exactly the same size and angle; the left arm, the lanyard, the gig bag, the skirt and "
          "legs do not move. Not afraid, not crying, no tears, no blush, no sweat, no motion lines.")

UPC = "\n".join([
    "Redraw the first attached image exactly, at full resolution. It is an enlarged crop of a finished drawing (a chest-up of the "
    "girl), so it looks soft and blurry: redraw it as a crisp, clean, sharp drawing of the very same picture: the same figure, pose, "
    "head angle, face, expression, eyes and gaze straight at the viewer, hair, bow, hairclips, blazer, shirt, tie, lanyard, gig bag, "
    "the same framing, size and position of everything in the canvas (her outline must lie exactly on the outline in the first "
    "image), the same colours and the same single hard-edged shadow tone per material. Fully TRANSPARENT background (PNG alpha), "
    "and where the first image is cut by the canvas edge the drawing is cut there too. Change nothing: no new details, no new "
    "folds, no new strands of hair; only make every line crisp and even, at the line weight of the turnaround (second image).",
    LARGE, NEVER])


def write(name, text):
    open(os.path.join(here, name + '.txt'), 'w', encoding='utf-8').write(text + "\n")


if __name__ == '__main__':
    write('r03_flinch', variant(FLINCH)); write('r03_upC', UPC)
    print(f'"-r03_flinch:out/r03_down3.png+{TURN}+{FACES}" "-r03_upC:{CROP}+{TURN}+{FACES}"')
