"""Segment 01, the finished cut (second round after the blind review of the samples, 2026-11-20).

- t01_p1b: p1 (Sato Kenta) redrawn from t01_p1 with one change: he must read as a man in his mid-forties, a little heavy
  (the review: "p1 显年轻，看不出四十岁、微胖"). Same pose, scale and canvas, so he still lines up with the row.
- r01_follow2: r01_side redrawn with one change, the head turned ~25 degrees further right (a clean lost profile). The first
  r01_follow turned too far and its cheek line read oddly (the review: "侧后方露出的脸形有点怪").
- r01_turn (round 2, after r01_follow2 is chosen): the in-between of r01_side and r01_follow2, drawn from both.
usage: python art/design/prompts/_make_seg01b.py [turn]   -> writes the .txt prompts and prints the make_jobs arguments
"""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import variant

P1 = variant(
    "he must clearly be a man in his mid-forties, not a young man: a fuller, heavier face with soft jowls and a slight double "
    "chin under the bowed head, tired bags under the eyes and a few fine lines at the eye corners, the short hair a little "
    "thinner and slightly receding at the temples, a few lighter strands at the sides; his body a little heavier, with a small "
    "rounded belly that pulls the buttoned jacket slightly. The second attached image is his set-pack sheet: keep his suit, tie, "
    "briefcase and drawing style as there. The same pose, the same head bow and eyes looking down at his chest, the same height "
    "and position on the canvas (head top at the same row), the same lanyard ends, the same single teal ink and screentone dots.")

FOLLOW2 = variant(
    "her HEAD turns about 25 degrees further to the viewer's right, away from the viewer, as she follows a train leaving down "
    "the platform. Now we see a clean lost profile: the soft curve of her cheek and jaw, the tip of her nose just hidden behind "
    "the cheek line, only the tips of her eyelashes, her whole ear, and more of the back of her head and of her bob. The bow, "
    "the headband and the three hairclips turn with the head (the clips stay on the bangs at the front of her head, now near "
    "the far edge of the head, and the bow keeps its two upright loops). Still expressionless, eyes far away, never toward the "
    "viewer. The body, shoulders, arms, hand, gig bag, lanyard, skirt and legs do not move at all.")

TURN = (
    "Draw the in-between of the two attached drawings of the same girl: she is turning her head from the first drawing to the "
    "second. Draw her exactly halfway: the head turned halfway between the two (about 12 degrees further right than in the first "
    "drawing), so the face is between a profile and a lost profile: the eye half hidden behind the cheek line, the nose tip at the "
    "edge of the cheek, the ear, bow, headband and hairclips each exactly halfway between their places in the two drawings. "
    "Expressionless as in both. Everything below the neck (body, shoulders, arms, hand, gig bag, lanyard, skirt, legs) is the "
    "same as in both drawings, line for line; the same canvas, framing, size and position, the same line work and colours, and "
    "the same fully TRANSPARENT background (PNG alpha).")

if __name__ == '__main__':
    if 'turn' in sys.argv[1:]:
        open(os.path.join(here, 'r01_turn.txt'), 'w', encoding='utf-8').write(TURN + "\n")
        print('"-r01_turn:../cut/r01_side.png+../cut/r01_follow2.png"')
    else:
        for n, t in (('t01_p1b', P1), ('t01_p1c', P1), ('r01_follow2', FOLLOW2), ('r01_follow2b', FOLLOW2)):
            open(os.path.join(here, n + '.txt'), 'w', encoding='utf-8').write(t + "\n")
        print('"-t01_p1b:../cut/t01_p1.png+../canon/town/p01_sato_kenta_salaryman.png" '
              '"-t01_p1c:../cut/t01_p1.png+../canon/town/p01_sato_kenta_salaryman.png" '
              '"-r01_follow2:../cut/r01_side.png+../canon/rin_turnaround.png" '
              '"-r01_follow2b:../cut/r01_side.png+../canon/rin_turnaround.png"')
