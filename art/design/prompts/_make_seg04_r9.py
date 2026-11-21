"""Segment 04, round 9: S3 (k100-k104) rebuilt after the second independent review (2026-11-21).

The review: a blind look at s04c_hang reads "a girl standing, holding her guitar, looking at it", not a weapon. Causes:
(1) the grip was at the neck joint, neck up past the shoulder: an everyday way to carry or stand a guitar, no weight, no threat;
(2) heavy lids + flat mouth with that grip read as tired or lonely; (3) S3 fell back to a knee-up shot (face 12%) after S2's
close shot (face 27%) and stood still 1.48 s, on the line that should be the segment's peak.
Two truly different designs, both made to read WEAPON from the silhouette alone (the grip at the HEADSTOCK end, the heavy body
far from the fist, the way a club or a bat is held), compared blind on thumbnails:
  A  s04d_shoulder  close medium shot (hips up, face about 24%), the guitar carried on her right shoulder like a bat: fist at
                    the headstock end in front of her collarbone, the neck over the shoulder, the gold body up beside her head.
  B  s04d_drag      full figure, the guitar hanging from her fist by the headstock end, the body down by her shin, swung out a
                    little: a weapon dragged along, about to be swung.
usage: python art/design/prompts/_make_seg04_r9.py   -> writes the .txt prompts and prints the make_jobs arguments
"""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import IDENTITY, DRAW, SHEET_RULE, LARGE, HANDS, NEVER
from _make_seg04_r8 import ALPHA, CARD, GUITAR_TXT, LIGHT, ID

TURN = '../canon/rin_turnaround.png'
BAG = '../canon/gigbag_front_back_side_open.png'
GUITAR = '../canon/lespaul_goldtop_front_side_back.png'
HANDS_REF = '../ref/sheet_hands.png'
COLD_FACE = 'board/seg04_cold_face.png'
HALF = '../cut/s04a_half.png'          # the shot before (S2, P4b): her face, hair, clothes, bag, the same guitar

THREAT = ("Her face (important): COLD AND THREATENING, wide awake, never tired, sleepy, sad or lonely. The upper eyelid of each eye "
          "is a STRAIGHT hard line, pressed down to cut off the top third of the iris; the brows LEVEL and drawn a little LOWER and "
          "closer toward the eyes (a slight hard set, not an angry frown, no wrinkles); the iris fully drawn below the lid, teal, a "
          "clear dark pupil and one small sharp highlight, the gaze FOCUSED and steady; the mouth a small closed straight line, the "
          "jaw set. The eye shape of the attached close-up. She looks like someone who has decided to break something.")

SHOULDER = "\n".join([
    ID,
    "Framing (important): SQUARE canvas, a CLOSE MEDIUM SHOT from the top of her bow down to her hips; the bottom edge of the canvas "
    "cuts straight across her at the hips (her body reaches the bottom edge). She is BIG: her head from chin to the top of the hair "
    "about 24% of the canvas height; the top of the bow about 4% below the top edge. Her body's centre line at about 60% of the "
    "canvas width from the left (the guitar on the viewer's left). Camera exactly at her eye height, long lens, no high or low "
    "angle, the shoulders level; her body turned a little (about 20 degrees) toward the viewer's LEFT, her face toward the viewer. "
    "Her face, hair and clothes exactly as in the second attached image (the same girl a moment before).",
    "She CARRIES THE GUITAR ON HER SHOULDER LIKE A BASEBALL BAT OR AN AXE (important, it must read as a weapon at a glance): her "
    "RIGHT hand (viewer's LEFT) is a hard fist round the guitar's neck right UNDER THE HEADSTOCK (the thin end, where you would hold "
    "a bat's handle), the fist in front of her right collarbone, a little out from her chest; the black headstock sticks out "
    "BELOW and in front of the fist, pointing down. From the fist the long dark neck runs UP and BACK over her right shoulder, and "
    "the heavy GOLD BODY of the guitar rests up there behind her right shoulder, high beside her head on the viewer's left: the "
    "gold top facing the viewer, its cream binding and the two cream pickups clearly visible, the body's upper end above the "
    "height of her bow, fully inside the canvas, clear of her face and hair (a small gap), never hidden behind her head. The "
    "guitar's weight sits on her shoulder: the right shoulder pressed down a little. Her LEFT arm (viewer's right) hangs down "
    "relaxed, cut by the bottom edge.",
    "The now EMPTY black gig bag hangs limp and flat behind her right shoulder (viewer's left), under the guitar, no higher than "
    "her shoulder line; its strap runs across her chest on the viewer's left side, clear of the card.",
    "Her head upright, chin a little down; her eyes look DOWN and to the viewer's LEFT, along the guitar's neck toward her own fist, "
    "past the viewer (NOT at the viewer). " + THREAT,
    GUITAR_TXT, CARD, DRAW, SHEET_RULE, LIGHT, LARGE, HANDS, NEVER, ALPHA])

DRAG = "\n".join([
    ID,
    "Framing (important): PORTRAIT canvas 2:3, her WHOLE figure from the top of her bow to the soles of her loafers; the top of the "
    "bow about 3% below the top edge, the soles about 3% above the bottom edge. Her body's centre line at about 60% of the canvas "
    "width from the left (the guitar on the viewer's left). Camera at her chest height, long lens, no high or low angle, shoulders "
    "level, her body facing the viewer, feet apart, weight on both feet. Her face, hair and clothes exactly as in the second "
    "attached image (the same girl a moment before).",
    "She holds the guitar LIKE A CLUB SHE IS DRAGGING ALONG (important, it must read as a weapon at a glance): her RIGHT arm "
    "(viewer's LEFT) hangs down straight and a little out from her side, TENSE, the shoulder pulled down by the weight; her fist "
    "grips the guitar's neck right UNDER THE HEADSTOCK (the thin end, where you would hold a bat's handle), the black headstock "
    "sticking out of the TOP of her fist, beside her hip. The whole guitar hangs from that fist upside down: the long dark neck runs "
    "DOWN at a slant out to the viewer's left, and the heavy GOLD BODY hangs LOW, beside her right shin, swung a little out to the "
    "viewer's left, its lower end just above the floor beside her right foot, the gold top facing the viewer (cream binding and "
    "the two cream pickups clearly visible), fully inside the canvas. Her left arm hangs relaxed at her side.",
    "The now EMPTY black gig bag hangs limp and flat behind her right shoulder (viewer's left), no higher than her shoulder line; "
    "its strap across her chest on the viewer's left side, clear of the card.",
    "Her head bowed a little; her eyes look DOWN along the neck at the guitar's gold body by her foot (NOT at the viewer). " + THREAT,
    GUITAR_TXT, CARD, DRAW, SHEET_RULE, LIGHT, HANDS, NEVER, ALPHA])


def main():
    out = []
    def write(name, text):
        open(os.path.join(here, f'{name}.txt'), 'w', encoding='utf-8').write(text)
    for n in ('s04d_shoulder', 's04d_shoulder2'):
        write(n, SHOULDER); out.append(f"-{n}:{TURN}+{HALF}+{GUITAR}+{BAG}+{COLD_FACE}+{HANDS_REF}")
    for n in ('s04d_drag', 's04d_drag2'):
        write(n, DRAG); out.append(f"-{n}:{TURN}+{HALF}+{GUITAR}+{BAG}+{COLD_FACE}+{HANDS_REF}")
    print(' '.join(f'"{a}"' for a in out))


if __name__ == '__main__':
    main()
