"""Segment 10, finished cut, round 3 (2026-11-21). Adds to _make_seg10f.py:
  - p10g_rowLb, p10g_rowRb: the k307 sink of the two rows redrawn again. Round 2 (p10f_rowLb/Rb) came back zoomed in about 15%
    and moved (rowLb) and with a teal glow round every figure (rowRb), so they cannot be laid on their masters; the brief now
    pins the canvas, every body's outline and the tones, and says what must NOT happen.
  - r10f_back: her close back view now takes r10f_doorb (round 1, head bowed deeply) as the pose reference.
The other round-1 drawings (p10f_opp, h10f_tip, g10f_bag) and h10f_press keep their briefs from _make_seg10f.py.
usage: python art/design/prompts/_make_seg10f3.py  -> writes the .txt prompts, prints the make_jobs arguments"""
import os, sys
here = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, here)
from rules import variant
import _make_seg10f as F

PIN = (" THE CANVAS DOES NOT CHANGE: no zoom, no crop, no shift; every person stays at exactly the same place and size, so that "
       "laid over the first image every body, arm, hand, card, knee, shin and shoe below the neck covers its old outline line for "
       "line. The paper-white background stays fully transparent right up to each outline: no glow, no halo, no coloured fringe, "
       "no soft edge around the figures. The same teal ink, the same screentone dot size and density, the same paper white: not "
       "lighter, not darker, not finer.")
SINK = ("ONLY THE FIVE HEADS (and the necks under them) move, all at the same instant and by the same LARGE amount: each head drops "
        "forward and down about 20 degrees more, the chin almost on the chest, the face tipped toward the lap so we see more of the "
        "top of the head and less of the face; every upper eyelid drops to HALF closed, drowsy and unfocused. Hair, hats, glasses "
        "and headphones go down with their heads.")
def w(n, t): open(os.path.join(here, n + '.txt'), 'w', encoding='utf-8').write(t + "\n")
if __name__ == '__main__':
    r = []
    for s in 'LR':
        w(f'p10g_row{s}b', variant(SINK + PIN)); r.append(f"-p10g_row{s}b:out/p10f_row{s}.png")
    w('r10f_back', F.R_BACK); r.append(f"-r10f_back:{F.TURN}+out/r10f_doorb.png+{F.BAG}+{F.FACES_REF}")
    for n, t, ref in [('p10f_opp', F.P_OPP, f"{F.LINEUP}+{F.CUT}p10_4.png"), ('h10f_tip', F.H_TIP, f"{F.TURN}+{F.CUT}hpen3.png+{F.HANDS_REF}"),
                      ('g10f_bag', F.G_BAG, F.BAG)]:
        w(n, t); r.append(f"-{n}:{ref}")
    print(' '.join(r))

# ---- round 6 (2026-11-21): S3 shows her whole figure, not a hand from the bottom edge. At the framing of the locker wall
# (about 3 m wide, 1.6 mm per px) a hand coming up from the bottom edge to door height is physically impossible (the arm would
# end in mid-air or be 3x too big; the first render had a hand as long as a locker door). So she stands at the wall, back to
# us, and pushes the tall door shut with her right hand (r10f_lock, k323), then rests her palm flat on it (r10f_lockb, k324).
R_LOCK = "\n".join([F.HER_ID.replace("(the card hangs at her chest, hidden behind the gig bag she hugs)", "(the card hangs at her chest, hidden by her body)"),
    "This drawing: the SAME back view, full figure, as the first attached image (same scale, same clothes, hair, bow, shoes, socks), "
    "standing on a station floor facing a wall of coin lockers (not drawn), her back to the viewer, level camera at her chest "
    "height, long lens. Her hands are now EMPTY (she has just put her gig bag into a locker; no bag anywhere). Her head is bowed "
    "forward a little, tired. Her LEFT arm hangs down at her side. Her RIGHT arm reaches out to the viewer's RIGHT at chest height, "
    "the elbow a little bent, and the side of her right hand with the fingertips presses against a vertical door edge (not "
    "drawn) at the point marked below, shoving the door shut: the hand seen from the back and the thumb side, four fingers "
    "together and straight, held vertical.",
    "Framing: portrait canvas 2:3. Her body (spine) on the vertical line at 35% of the canvas width; the soles of her shoes at "
    "98% of the canvas height; the top of her bow about 6% below the top edge; her right hand's fingertips at 82% of the canvas "
    "width and 40% of the canvas height. The whole figure inside the canvas, nothing cut.",
    F.DRAW, F.SHEET_RULE, F.HANDS, F.TRAIN_LIGHT, F.NEVER,
    "Fully TRANSPARENT background (PNG alpha) everywhere outside her: no lockers, no floor, no shadow. Every part of her fully opaque. No text. No red."])
LOCK_PRESS = ("the door is now shut, and her RIGHT hand rests FLAT on it with the palm pressed on the door surface: the arm a little "
              "more bent, the hand a little nearer to her, its fingertips at 65% of the canvas width and the same height (40% of "
              "the canvas height), the four fingers together pointing straight up; we see the back of her right hand, so its "
              "thumb is on the viewer's LEFT side of the hand. Her head bows a little lower. Only the right arm, the right hand and "
              "the head change; her back, the left arm, the skirt, the legs and the shoes stay exactly where they are.")
if __name__ == '__main__' and 'lock' in sys.argv:
    w('r10f_lock', R_LOCK); w('r10f_lockb', variant(LOCK_PRESS))
    print(f"-r10f_lock:{F.CUT}r10_door.png+{F.TURN}+{F.HANDS_REF}", "then", "-r10f_lockb:out/r10f_lock.png+../ref/sheet_hands.png")
