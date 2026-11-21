"""Segment 10, after the independent review of the finished cut (2026-11-21). Redraws:
  - r10g_refl, r10g_reflb: her reflection (S2) with her lanyard. The card hangs at her chest from 03 to 14 (全片分镜 审查后改定
    第 15 条) and 09's last frame still shows it; r10f_refl/reflb had lost the cord. The master is redrawn with ONE change (the
    two teal cords of the lanyard from under her collar, down both sides of the ribbon tie, into the bag she hugs; the card
    itself hidden by the bag); r10g_reflb is r10g_refl with only the eyes changed (the same change as r10f_reflb).
  - r10g_doorb: S1 k307, her head drops with everyone. r10f_doorb's nape was a blur with no line and the head sank into the
    shoulders; redrawn from r10_door with only the head changed, a longer, cleanly drawn nape.
  - S3 (the coin lockers) is a new design: the canon locker bank itself (art/canon/coin_lockers_front.png, hinges on the LEFT
    of every door), her tall door 22 opens toward us on its left hinges, so she stands to the LEFT of it and pushes its
    outer face. Three key drawings, the hand always on the door's free edge (the door steps with the drawings):
      r10g_lock  (k322)    door open about 85 deg: her right hand holds its free edge close by her right side, elbow bent;
      r10g_lockm (k323.5)  door at about 45 deg: the arm half out, the hand on the free edge (drawn from lock and lockb);
      r10g_lockb (k324)    door shut: the arm out, the palm flat on the door near its free edge, the back of the hand to us.
    The hand positions in the canvas come from the shot's geometry (seg_10.js, S3): screen = canvas x 0.576; lock was redrawn
    once (the first try held the hand up at shoulder height, palm out: it read as waving), the door angles in seg_10.js are
    then solved from where the hands landed (lock 85 deg, lockm 62 deg).
  - r10g_back (S2): r10f_back with only the nape redrawn (the hairline was a saw-tooth fuzz with no line, the same fault as
    r10f_doorb); written by hand into prompts/r10g_back.txt, refs archive/seg10_before_review_fix_20261121/cut/r10f_back.png + the turnaround.
usage: python art/design/prompts/_make_seg10g.py [1|2|3]  -> writes the .txt prompts of that round, prints the make_jobs args"""
import os, sys
here = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, here)
from rules import variant
import _make_seg10f as F
OLD = '../../archive/seg10_before_review_fix_20261121/cut/'   # the r10f_* drawings these were redrawn from (moved there)

def w(n, t): open(os.path.join(here, n + '.txt'), 'w', encoding='utf-8').write(t + "\n")

LANYARD = ("add her LANYARD exactly as on the front view of the turnaround (the second attached image): a thin flat teal cord "
           "(the same teal as her ribbon tie, a clean dark outline) comes out from under her white shirt collar on BOTH sides of "
           "her neck, just outside the knot of the ribbon tie, and the two cords run straight down on either side of the ribbon "
           "tie and its tails, close to them, until they go behind the top of the gig bag and her hand (the card hangs behind "
           "the bag, out of sight). The cords are thin (about a third of the width of a ribbon tail), simple, no shine. Nothing "
           "else changes: the face, the eyes and eyelids, the hair, the bow, the hairclips, the ribbon tie, the collar, the "
           "blazer, the bag, the hand, the colours and the canvas stay exactly as they are, line for line.")
COLD = ("her eyes come UP exactly as in the third attached image: the eyeballs turn up to look straight ahead at eye level (just "
        "past the viewer's left shoulder, a little to the viewer's right), the upper eyelids still lowered a little so the look "
        "is narrow, cold and looking DOWN ON everything, the teal pupils still and fixed; not angry, not crying, not smiling. The "
        "head, the brows, the mouth, the hair, the bow, the lanyard cords, the ribbon tie, the hand and the bag do not move at all.")
DOORB = ("ONLY HER HEAD changes: it bows forward and down about 20 degrees, as if she is dozing off on her feet. Seen from behind: "
         "the back of the head tips forward, so we see a little more of the crown of the blonde hair and the big white bow tips "
         "forward with the head (its two loops lean away from us and look a little lower and shorter); below the hair, the back "
         "of her neck (the nape) now shows as a LONGER clear strip of skin between the ends of the hair and the white shirt "
         "collar, drawn with a clean dark outline on both sides like the rest of her (the hair ends are crisp separate tips over "
         "the skin, no blur, no fuzz, no soft edge). The neck stays its normal length and the shoulders stay where they are (the "
         "head does not sink into the shoulders). The bow, the hair colour and shapes, the blazer, the arms, the gig bag, the "
         "skirt, the legs and the feet do not move at all.")
# S3: the same back view as r10f_lock (her hands empty, the bag already in the locker); only the right arm and hand change.
ARM_OPEN = ("ONLY HER RIGHT ARM AND HAND change. A tall locker door (not drawn) stands wide open toward the viewer just to "
            "her right, and she is resting her hand on its vertical outer edge: her RIGHT arm hangs LOW and relaxed a little "
            "away from her side, the elbow slightly bent, the forearm angled down and out to the viewer's right, and the hand is "
            "at the height of her HIP, a hand's width out to the right of her hip, curled loosely round the door's vertical edge: "
            "we see the BACK of her right hand, the fingers going away from us round the edge (foreshortened), the thumb on our "
            "side. NOT raised, NOT at shoulder height, NOT an open palm facing the viewer (it must never read as waving). The "
            "middle of her right hand is at 61% of the canvas width and 49% of the canvas height. Her left arm, her head, her "
            "back, the skirt, the legs and the shoes stay exactly where they are. Her hands are empty: no bag anywhere.")
ARM_SHUT = ("ONLY HER RIGHT ARM AND HAND change: the arm now reaches out to the viewer's RIGHT, going DOWN a little and "
            "forward, almost straight (only a slight bend at the elbow), and the hand rests FLAT on a shut locker door (not drawn, "
            "in the picture plane, a little in front of her): we see the whole BACK of her right hand, the palm pressed on the "
            "door, the four fingers together pointing UP and a little to the right, the thumb alongside on the viewer's LEFT side "
            "of the hand. A quiet, steady pressure that keeps the door shut, not a wave. The middle of her right hand is at 84% of "
            "the canvas width and 48% of the canvas height (a little higher than her hip). Her left arm, her head, her back, the skirt, the legs and "
            "the shoes stay exactly where they are.")
INBETWEEN = ("Draw the in-between of the first two attached images: the SAME figure, canvas, scale and position as both (they "
             "differ ONLY in the right arm and hand), with her right arm in between, much nearer the second image: the arm "
             "reaching out to the viewer's right and a little down, the elbow a little more bent than in the second image, the "
             "hand pushing the free vertical edge of a locker door (not drawn) that is half shut: the palm faces the viewer's "
             "right and a little away from us, pressed on the door, the four fingers together pointing up; we see the back of "
             "her hand, a little foreshortened (narrower than in the second image). The middle of her right hand is at 75% of "
             "the canvas width and 49% of the canvas height. Everything else (head, back, left arm, skirt, legs, shoes) stays "
             "exactly as in both images, line for line; keep the fully TRANSPARENT background (PNG alpha), the same line work "
             "and colours.")

if __name__ == '__main__':
    rnd = sys.argv[1] if len(sys.argv) > 1 else '1'
    if rnd == '1':
        w('r10g_refl', variant(LANYARD))
        w('r10g_doorb', variant(DOORB))
        w('r10g_lock', variant(ARM_OPEN))
        print(f"-r10g_refl:{OLD}r10f_refl.png+{F.TURN}+{F.FACES_REF}",
              f"-r10g_doorb:{F.CUT}r10_door.png+{F.TURN}",
              f"-r10g_lock:{OLD}r10f_lock.png+{F.TURN}+{F.HANDS_REF}")
    elif rnd == '2':
        w('r10g_reflb', variant(COLD))
        w('r10g_lockb', variant(ARM_SHUT))
        print(f"-r10g_reflb:out/r10g_refl.png+{F.TURN}+{OLD}r10f_reflb.png+{F.FACES_REF}",
              f"-r10g_lockb:out/r10g_lock.png+{F.TURN}+{F.HANDS_REF}")
    else:
        w('r10g_lockm', INBETWEEN)
        print(f"-r10g_lockm:out/r10g_lock.png+out/r10g_lockb.png+{F.TURN}+{F.HANDS_REF}")
