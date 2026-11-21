"""Segment 02 (急停) sample drawings: the station row as it stands at the end of 01 and through 02.
docs/分镜/02_急停.md 第 5 节: the same people and the same shot as 01 (t01_p3 ... t01_p2, r01_follow). 01's drawings did not
exist yet when the 02 samples were made, so the sample draws them under its own names (s02_*), to the 01 rules
(docs/分镜/01_前奏riff前半.md 第 5 节): head to mid-calf, straight-on eye-level camera, one fixed scale for everyone, the lanyard
drawn only down to the collarbones (the lower lanyard and the card are hung on by code, because in 02 the cards are pulled
toward her). When 01's drawings exist, 02 uses those instead.

Fixed scale for every drawing: the 2:3 canvas (1024 x 1536) shows heights from 35 cm (bottom edge, about mid-calf) to 190 cm
(top edge) above the platform, 9.91 px/cm. The page measures each drawing's head top and scales by the person's canon height.
"""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import full

FRAME = (
    "Framing and scale: one single person, alone, standing on level ground, seen from the top of the head down to the MIDDLE OF THE "
    "CALVES, where the bottom edge of the canvas cuts the legs straight across (no feet in the picture). Camera at eye level (about 1.4 m), "
    "straight on, long lens: no high or low angle, no perspective distortion. Portrait canvas 2:3 at a FIXED SCALE shared by every "
    "person of this row: the canvas shows heights from 35 cm above the floor (the bottom edge) to 190 cm above the floor (the top edge), "
    "so a person is exactly as tall on the canvas as their real height says: the head top of a 183 cm person is 4.5% below the canvas "
    "top, of a 162 cm person 18% below, of a 160 cm person 19.5% below, of a 152 cm girl 24.5% below. Empty transparent space above a "
    "shorter person is correct; do NOT enlarge or stretch the figure to fill the canvas. Natural adult proportions (about 7 heads, legs "
    "not elongated), the body centred horizontally in the canvas.")

LANYARD = (
    "Lanyard: a thin teal lanyard goes round the back of the neck and its two strands come down over the collarbones and STOP there, "
    "cut off cleanly just below the collarbones, about a hand's width apart. Draw NOTHING below that: no lanyard on the chest, no clip, "
    "no card, no badge (the rest of the lanyard and the card are added separately later). The chest, stomach and the clothes there are "
    "drawn complete and unobstructed, so a card can hang in front of them.")

TOWN_HAND = (
    "Drawing style: a printed illustration in ONE ink colour only, teal (#218EA3), on paper white (#F5F3ED), exactly the drawing hand "
    "of the person in the first attached image: clean confident teal line art (outer contour a little heavier, inner lines thin and "
    "few), shadows and darker materials as clean, regular, round teal screentone dots (halftone, one dot size for light tone, a "
    "denser one for dark tone), solid teal or very dense teal dots for black hair and very dark clothes. White areas are paper white. "
    "No other colours: no grey, no black, no brown, no gradients, no airbrush, no glow, no blur, no paper texture, no pencil "
    "sketchiness. It must look like a crisp printed page, as drawn by a professional anime character designer.")

FACE = (
    "The face is a clean modern anime face like the first attached image: simple eyes, a small mouth, the nose at most one small "
    "stroke. Pose of the head for this shot: the head bowed, the eyes looking DOWN at the middle of the own chest (where the card hangs), "
    "a quiet, absent, morning-commute expression, never a grin. The face stays recognisable: same face, hair and age as the first "
    "attached image. Hair in a few well-shaped clumps, not many thin strands. Clothes only with the folds that explain the form.")

ALPHA = ("Fully TRANSPARENT background (PNG alpha) everywhere outside the person: no floor, no shadow, no frame, no paper colour "
         "behind. Every part of the person fully opaque, including the paper-white parts.")
TAIL = "No captions, no labels, no text, no logos, no watermark. Absolutely no red, pink or orange anywhere."


def town(who):
    return "\n".join([
        "One character illustration for an animated music video: a person of the town standing in a row on a station platform, "
        "redrawn for this shot from the person's model sheet (the first attached image is this person: keep the same face, "
        "hairstyle, age, build and clothes exactly; it also decides the drawing style).",
        who, FRAME, LANYARD, TOWN_HAND, FACE, ALPHA, TAIL])


P = {
    's02_p3': town("Takahashi Masao, retired man, about 75, 160 cm, thin, slightly stooped, glasses, cardigan. Both hands rest stacked on "
                   "the handle of his walking cane in front of his body, LOW, at the height of his hips (about 85 cm above the floor), "
                   "the cane's shaft going straight down out of the bottom edge. His arms and hands stay below the middle of his stomach, "
                   "so his chest is free."),
    's02_p6': town("Yamamoto Sakura, university student, 20, 160 cm: light wavy hair, round soft face, big round slightly drooping eyes, "
                   "headphones resting round her neck, a long open coat, a backpack worn on both shoulders (both shoulder straps visible "
                   "on the front of her shoulders, the lanyard lies on top of the straps). Her hands hold the two shoulder straps at "
                   "chest height near the armpits, elbows in, leaving the middle of her chest free."),
    's02_p7': town("Kobayashi Yumi, mother, about 34, 162 cm: narrow oval face, single-lidded narrow eyes, low flat brows, strands of hair "
                   "loose at the temples, a long open coat. She holds her 3-year-old son Kobayashi Sota on her RIGHT arm (on the viewer's "
                   "LEFT side of the picture): the boy sits in the crook of her right arm against her right side, his face lower than her "
                   "chin, a big round head, chubby short arms and legs, quietly looking down too. The boy ALSO wears a thin teal lanyard "
                   "round his neck that stops at his collarbones, nothing below. Her left hand rests on the boy's legs. The middle of "
                   "HER chest, between her collarbones and her stomach, stays free and unobstructed (the boy is to the side, not in front "
                   "of her chest)."),
    's02_p8': town("Kato Daisuke, construction worker, about 38, 168 cm, stocky and strong: a twisted towel headband, a towel round the "
                   "neck tucked into the collar, a work jacket and baggy work trousers. Both arms hang relaxed at his sides, hands open "
                   "and loose."),
    's02_p9': town("Yoshida Ren, very tall thin young man, about 22, 183 cm, sleepy: messy hair, a loose oversized hoodie with the hood "
                   "down and its two drawstrings hanging (the lanyard lies on top of the drawstrings), loose trousers. Both hands pushed "
                   "into the hoodie's front pocket, shoulders a little slouched."),
    's02_p2': town("Tanaka Misaki, office worker, about 24, 158 cm: long hair, a longish oval face, narrow almond eyes, thin straight brows, "
                   "a small mole under her left eye, a trench coat. A tote bag hangs from her LEFT shoulder (on the viewer's RIGHT side), "
                   "her left hand holding its strap at the shoulder; her right arm hangs at her side. The middle of her chest is free."),
    # round 2: the first p8 came back about a third too big for the row (head about 27 cm, shoulders about 66 cm)
    's02_p8b': town("Kato Daisuke, construction worker, about 38, 168 cm, solidly built but of ORDINARY width for a 168 cm man: "
                    "shoulders about 44 cm across (no broader than the other adults in the row), a normal-sized head about one seventh of "
                    "his height (about 23 cm from chin to the top of the hair), not a bodybuilder. A twisted towel headband, a towel round "
                    "the neck tucked into the collar, a work jacket and baggy work trousers. Both arms hang relaxed at his sides, close to "
                    "the body, hands open and loose."),
}

RIN = full(
    "This shot: she stands on a station platform at the end of a row of commuters, seen from the top of her bow down to the MIDDLE OF "
    "HER CALVES, where the bottom edge of the canvas cuts the legs straight across (no feet). Eye-level camera (1.4 m), straight on, long "
    "lens, no high or low angle. Her BODY is turned about 40 degrees to the viewer's RIGHT (a three-quarter view of the body facing "
    "screen right). Her HEAD is turned further to the right, about 70 degrees from the viewer in total, looking far away to the right "
    "after a train that has just left: we see her face in a 'lost profile', her cheek line, the right ear and the back of her head more "
    "than her face, her eye seen only as a sliver at the edge of the face; she does NOT look at the viewer. Expression: blank, "
    "indifferent. She carries her black soft guitar gig bag (the second attached image) on her back by both shoulder straps; the bag is "
    "106 cm long, its top end rises above her head behind her, and its outline shows behind her on the viewer's LEFT side, past her "
    "shoulder and her back. Her right hand loosely holds the bag's shoulder strap at chest height; her left arm hangs at her side. "
    "Lanyard: her teal lanyard goes round her neck and the two strands STOP just below her collarbones; draw NOTHING below that: no "
    "card, no clip, no holder (the card is added separately later). Her blazer front is drawn complete and unobstructed. Portrait canvas "
    "2:3 at a FIXED SCALE: the canvas shows heights from 35 cm above the floor (bottom edge) to 190 cm (top edge), so her 152 cm head "
    "top (hair, under the bow) is 24.5% below the canvas top; do NOT enlarge her to fill the canvas. She is centred horizontally.",
    night=False)

for n, body in P.items():
    open(os.path.join(here, n + '.txt'), 'w', encoding='utf-8').write(body + "\n")
open(os.path.join(here, 's02_rin_follow.txt'), 'w', encoding='utf-8').write(RIN + "\n")
print('ok', len(P) + 1)

# ---- round 3 (2026-11-20 afternoon): 02 continues from the FINISHED 01 (web/scenes/segments/seg_01.js: ROW, camAt) ----
# The row in 01 is p1 p3 p6 p9 | her | p7(+child) p8. The wide shot of design 甲 needs three people on each side of her, so p2
# (Tanaka Misaki, 01 file: "p2 挪到她右边、只在 02 全景出现") stands right of p8. She was never drawn for 01; drawn here to the
# 01 rules (t01_*: canvas 2.00 m down to 0.25 m, head to mid-calf, lanyard stopping under the collarbones), with t01_p6 as the
# second reference for the drawing hand and the scale. Her tote hangs from her LEFT shoulder (viewer's right, away from her).
if __name__ == '__main__':
    from _make_seg01 import town as town01
    T2 = town01(
        "Tanaka Misaki, office worker, about 24, 158 cm, slim; long straight dark hair past the shoulders, a longish oval face, "
        "narrow almond eyes, thin straight brows, a small mole under her left eye; a belted trench coat worn open over a plain blouse, "
        "a knee-length skirt, dark tights.",
        "A large tote bag hangs from her LEFT shoulder (on the VIEWER'S RIGHT side of the picture), her left hand holding its strap at "
        "the shoulder; her right arm (viewer's left) hangs relaxed at her side. The middle of her chest stays clear (the strap runs "
        "over her left shoulder only, at the side). Tired, neutral face, mouth closed. The second attached image is another person of "
        "the same row drawn for the same film: match its drawing hand, its line weight, its dot screen and its scale exactly "
        "(both are about 160 cm tall, so her head top sits at the same height on the canvas, only 2 cm lower).")
    open(os.path.join(here, 't01_p2.txt'), 'w', encoding='utf-8').write(T2 + "\n")
    print('ok t01_p2')
