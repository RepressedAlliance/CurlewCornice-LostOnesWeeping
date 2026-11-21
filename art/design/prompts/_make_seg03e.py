import os as _os_lo
_LO_ROOT = (_os_lo.environ.get('LOSTONE_ROOT') or _os_lo.path.abspath(_os_lo.path.join(_os_lo.path.dirname(_os_lo.path.abspath(__file__)), '../../..'))).replace('\\', '/')
"""Segment 03 (片名・検票口), the hall redesigned after the independent review of 2026-11-20 (the hall half judged a drop below the
demo: her small and mostly still, the wall empty, the flaps' slam not the loudest thing, the push to her chest too shallow).
Two drawings:

  r03_flinch  r03_peer3 redrawn with one change: k60, the instant the row of dark flaps slams shut at her waist, she startles:
              her eyes leave the card and go to the shut flap just in front of her (down and forward), a little wider, the
              shoulders rise a little; the card stays in her hand. The swap at k60 now has its reason (the review: the k58 swap
              peer3 after down3 was almost no change and read as a jump), and the hall has its acts: she peers at the card (k56)
              -> the slam startles her (k60) -> she lets the card go (k64) -> she looks at us (k68).
  r03_upC     r03_up2 at close-up resolution, so the three steps in (k68-k70) can end on a real chest-up (0.90 m to 1.68 m, about
              1385 px/m) without enlarging the drawing: the first attached image is r03_up2's chest-up crop (229,179)-(795,1028)
              enlarged 1.80919x onto the 2:3 canvas (work/seg/03/art/r03_up2_crop.png); Codex redraws it crisp, line for line,
              in the same framing, so it lands on r03_up2 after that scale and the crop offset (about 1916 px/m; shown 0.42-0.72x).

usage: python art/design/prompts/_make_seg03e.py  -> writes the .txt prompts and prints the make_jobs arguments
"""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import LARGE, NEVER, variant

TURN = '../canon/rin_turnaround.png'
FACES = '../ref/sheet_faces.png'
PEER = (_LO_ROOT + '/art/cut/r03_peer3.png')
CROP = (_LO_ROOT + '/work/seg/03/art/r03_up2_crop.png')

FLINCH = ("the instant a heavy gate flap slams shut right in front of her waist, she startles: her teal eyes leave the card and "
          "look DOWN and FORWARD at a point just in front of her belt (the shut flap in front of her, below the card), the eyes "
          "opened clearly wider than now (round, the pupils a little smaller), the inner ends of the eyebrows lifted a little "
          "more, the mouth closed and small; her head comes up only very slightly (a few degrees) and her shoulders rise a little, "
          "tense. Her right hand keeps holding the card exactly where it is, at exactly the same size and angle, the card's plain "
          "white back towards us; the left arm, the lanyard, the gig bag, the skirt and legs do not move. Not afraid, not crying, "
          "no tears, no blush, no sweat, no motion lines, no effect marks.")

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


# round 2 (r03_flinch2): round 1 came back as a comic shock face (eyes blown wide, tiny irises in white rings); the startle is
# quieter: the same eyes as the turnaround, only a little more open, looking down at the flap
FLINCH2 = ("the instant a heavy gate flap slams shut right in front of her waist, she gives a small, quiet start: her teal eyes "
           "leave the card and look DOWN and FORWARD at a point just in front of her belt (the shut flap, below the card), opened "
           "only a little more than now. The eyes keep exactly the eye shape, iris size and line weight of the turnaround: the irises "
           "stay large and normal (NOT shrunk, no small pupils, no white ring around the iris, no shock lines). The inner ends of the "
           "eyebrows lift a little more (a hurt, uncertain look), the mouth stays closed and small; her head comes up only very "
           "slightly (a few degrees) and her shoulders rise a little, tense. A quiet moment, not shocked, not comic, not afraid. Her "
           "right hand keeps holding the card exactly where it is, at exactly the same size and angle, the card's plain white back "
           "towards us; the left arm, the lanyard, the gig bag, the skirt and legs do not move. No tears, no blush, no sweat, no "
           "motion lines, no effect marks.")

if __name__ == '__main__':
    write('r03_flinch2', variant(FLINCH2)); write('r03_flinch2B', variant(FLINCH2))
    write('r03_flinch', variant(FLINCH)); write('r03_upC', UPC)
    print(f'"-r03_flinch:{PEER}+{TURN}+{FACES}" "-r03_upC:{CROP}+{TURN}+{FACES}"')
