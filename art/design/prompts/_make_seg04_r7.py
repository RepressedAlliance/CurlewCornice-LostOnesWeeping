"""Segment 04, round 7 (after the independent mute review of the finished segment, work/seg/04/review_final/review.md):
  - r04d_pull   the in-between of r04c_zip -> r04c_half (the draw itself was skipped between two drawings: "the bag opens and the
                guitar is in her hand at once"): the zip ripped open, her fist on the neck just under the headstock, the headstock
                and the top of the neck coming up out of the bag's mouth; drawn from both key drawings (first: r04c_zip, second:
                r04c_half).
  - r04d_rest   a NEW P4c replacing r04c_hang (read as "carrying a guitar", not a weapon, by every review): the guitar rested on
                her right shoulder like a baseball bat or an axe, her fist low on the neck near the headstock, the gold body up
                on/behind her shoulder beside her head; from the master r04c_zip with r04c_half for the guitar.
  - r04d_swing  (round 7b, after the second mute review: "37.2 -> 37.4 the guitar flips in one frame") the in-between of
                r04c_half -> r04d_rest: the guitar half way round, lying across the top of her shoulder, the neck out to the left;
                drawn from both key drawings (first: r04c_half, second: r04d_rest).
usage: python art/design/prompts/_make_seg04_r7.py [b]   -> writes the .txt prompts and prints the make_jobs arguments
"""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import HANDS, NEVER
from _make_seg04_r4 import TURN, BAG, GUITAR, HANDS_REF, COLD_FACE, GUITAR_TXT, COLD2

KEEP = ("Redraw the first attached image exactly: the same figure, face, hair, bow, clothes, the strap across her chest with its "
        "buckle, the teal lanyard and its silver clip, the same framing, size and position in the canvas, the same line work, colours and "
        "lighting, keep the fully TRANSPARENT background (PNG alpha). ")
END = " Everything else stays exactly as in the first attached image, line for line. Nothing covers the middle of her chest below the clip."

PULL = KEEP + (
    "Change only her RIGHT arm (viewer's LEFT), the bag's top and the guitar: this is the moment BETWEEN the first attached image (her "
    "hand pinching the zip pull at the top of the bag) and the second attached image (the guitar drawn far out over her shoulder). The "
    "zip has just been ripped open along the bag's neck end, the bag's mouth gaping open, grey lining visible. Her right fist now GRIPS "
    "the guitar's dark neck just below the black headstock and is pulling it straight up out of the bag's open top end: the black "
    "headstock (3+3 cream tuner buttons, no logo) and about 20 cm of the neck have come up out of the bag, above and to the viewer's left "
    "of her head (not touching the bow), her fist round the neck at about the height of the top of the bow, the elbow raised beside her "
    "head, the forearm going up. The guitar body is still inside the bag (no gold visible yet). Her arm halfway between the two attached "
    "poses. Her face exactly as in the first attached image; her eyes look up-left toward the fist a little. " + GUITAR_TXT + END)

REST = KEEP + (
    "Change only her RIGHT arm (viewer's LEFT), the guitar and the bag: the guitar is now completely out of the bag and she RESTS IT ON "
    "HER RIGHT SHOULDER LIKE A BASEBALL BAT OR AN AXE, a threatening delinquent pose. Her right fist is clenched hard round the neck "
    "close to the black headstock, held at the height of her right collarbone, on the viewer's LEFT side of her chest, near the armpit "
    "(well clear of the middle of her chest and of the lanyard clip); the black headstock sticks out below and in front of the fist. From "
    "the fist the neck runs diagonally UP and back over her right shoulder, and the whole GOLD body rests on top of her right shoulder, "
    "behind and beside her head on the viewer's LEFT, tilted, its GOLD TOP facing the viewer with the cream binding, the two cream P-90 "
    "pickups, the bridge and the gold knobs clearly visible: a big solid gold shape about as large as her head and shoulders together, "
    "fully inside the canvas (nothing of the guitar cut off by the canvas edges). The weight of the guitar presses on her shoulder. The "
    "now EMPTY black gig bag hangs limp and flat behind her right shoulder under the guitar; the strap across her chest stays exactly as "
    "it was. Her head stays upright; her eyes look sideways and down toward the viewer's left, past the guitar; " + COLD2 + " " +
    GUITAR_TXT + END)


SWING = KEEP + (
    "Change only her RIGHT arm (viewer's LEFT), the guitar and the bag: this is the moment BETWEEN the first attached image (the guitar "
    "held high, drawn out over her shoulder, headstock up) and the second attached image (the guitar rested upside down on her shoulder "
    "like a bat, headstock down by her collarbone). She is swinging it down over her shoulder: the guitar now lies roughly HORIZONTAL "
    "across the top of her right shoulder, the GOLD body behind and beside her neck on the shoulder (its gold top tilted toward the "
    "viewer, the cream binding and pickups visible), the dark neck pointing straight out to the viewer's LEFT at the height of her ear, "
    "her right fist round the neck close to the black headstock at the far left end, the arm bent, the elbow down beside her ribs. The bag "
    "is now empty and hangs limp behind her right shoulder as in the second attached image. Her face exactly as in the first attached "
    "image. Every part of the guitar fully inside the canvas. " + GUITAR_TXT + END)


def main_b():
    out = []
    def write(name, text):
        open(os.path.join(here, f'{name}.txt'), 'w', encoding='utf-8').write(text)
    for n in ('r04d_swing', 'r04d_swing2'):
        write(n, SWING + "\n" + HANDS + "\n" + NEVER)
        out.append(f"-{n}:out/r04c_half.png+out/r04d_rest.png+{GUITAR}+{BAG}+{HANDS_REF}")
    print(' '.join(f'"{a}"' for a in out))


def main():
    out = []
    def write(name, text):
        open(os.path.join(here, f'{name}.txt'), 'w', encoding='utf-8').write(text)
    write('r04d_pull', PULL + "\n" + HANDS + "\n" + NEVER)
    out.append(f"-r04d_pull:out/r04c_zip.png+out/r04c_half.png+{BAG}+{GUITAR}+{HANDS_REF}")
    write('r04d_pull2', PULL + "\n" + HANDS + "\n" + NEVER)
    out.append(f"-r04d_pull2:out/r04c_zip.png+out/r04c_half.png+{BAG}+{GUITAR}+{HANDS_REF}")
    write('r04d_rest', REST + "\n" + HANDS + "\n" + NEVER)
    out.append(f"-r04d_rest:out/r04c_zip.png+out/r04c_half.png+{GUITAR}+{COLD_FACE}+{HANDS_REF}")
    write('r04d_rest2', REST + "\n" + HANDS + "\n" + NEVER)
    out.append(f"-r04d_rest2:out/r04c_zip.png+out/r04c_half.png+{GUITAR}+{COLD_FACE}+{HANDS_REF}")
    print(' '.join(f'"{a}"' for a in out))


if __name__ == '__main__':
    main_b() if sys.argv[1:] == ['b'] else main()
