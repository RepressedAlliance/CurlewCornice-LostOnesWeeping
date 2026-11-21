"""Segment 02 (急停), the finished cut (after the blind review of the samples, 2026-11-20).

The review's first must-fix: the drawn lanyard. 01's row drawings (t01_p3, t01_p6, t01_p7, t01_p8, t01_p2) have the two
lanyard strands drawn down the chest to the card's clip. In 02 the cards are yanked toward her, so the strands must leave the
chest with the card: from the two points at the collarbones straight to the clip. A drawn strand left lying on the chest reads
as a second lanyard (the review: "双颈绳穿帮").

So each of those five is redrawn from its own 01 drawing with exactly one change: the strands below the collarbones are gone
(they stop just below the collarbones, where the code's taut strands take over); the clothes there drawn complete. The page
swaps to these on the first stab (k38.5), the frame the camera jumps a step and every card is yanked, so the swap hides in
the jump; before it the 01 drawings are on screen, so 02's first frame is 01's last. p9's lanyard is not drawn (it comes out
from under the hood), he keeps t01_p9.

usage: python art/design/prompts/_make_seg02b.py   -> writes the .txt prompts and prints the make_jobs arguments
"""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import variant

CUT = os.path.abspath(os.path.join(here, '..', '..', 'cut')).replace('\\', '/')

STOP = ("the thin teal lanyard: its two strands now STOP just below the collarbones, cut off cleanly there (a short stub on each "
        "side, about two finger widths long below the collar line), and NOTHING of the lanyard is drawn further down: no strands on "
        "the chest, no clip, no card. Where the strands used to lie, the clothes are drawn complete and unobstructed, with the same "
        "lines, folds and screentone dots as around them. ")
SAME = ("The face, the bowed head and eyes looking down, hair, hands, pose, the size and position on the canvas (the head top at the "
        "same row, the body centred the same), the single teal ink on paper white and the screentone dots do not change at all.")

P = {
    's02b_p3': variant(STOP + "(Takahashi Masao, the old man with the cane: his cardigan and shirt front complete.) " + SAME),
    's02b_p6': variant(STOP + "(Yamamoto Sakura, the student with headphones and a backpack: her dark knit top complete, the backpack "
                       "straps and her hands on them exactly as they are.) " + SAME),
    's02b_p7': variant(STOP + "This applies to BOTH lanyards: the mother's and the little boy's on her arm (his strands also stop just "
                       "below his collarbones, his hoodie front drawn complete). The boy's pose, face and place on her arm stay "
                       "exactly the same. " + SAME),
    's02b_p8': variant(STOP + "(Kato Daisuke, the worker: the strands stop just below the towel round his neck; his work jacket, its "
                       "pockets and buttons complete.) " + SAME),
    's02b_p2': variant(STOP + "(Tanaka Misaki, the office worker with the tote bag on her shoulder: her white top complete; the bag and "
                       "its strap exactly as they are.) " + SAME),
}

if __name__ == '__main__':
    args = []
    for k, v in P.items():
        open(os.path.join(here, k + '.txt'), 'w', encoding='utf-8').write(v)
        args.append(f'-{k}:{CUT}/t01_{k.split("_")[1]}.png')
    print(' '.join(args))
