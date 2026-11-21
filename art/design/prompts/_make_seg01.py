"""Segment 01 (前奏 riff 前半, docs/分镜/01_前奏riff前半.md): the drawings for the platform long scroll.

- t01_p1 .. t01_p9: the people of the town on the platform, each redrawn from their set-pack sheet (art/canon/town/, first
  reference) in the shot's pose: facing the camera, head bowed, looking down at their own card. The card and the lower half of
  the lanyard are hung by code (web/lib/card.js), so the lanyard stops just under the collarbones.
- r01_side: her, body turned ~40 degrees to the viewer's right, profile, looking down the platform, the black gig bag on her back.
- r01_follow: r01_side redrawn with one change (the head turned further right, following the train).
All at ONE fixed scale (the canvas spans 2.00 m down to 0.25 m above the floor), head to mid-calf, eye level, transparent.
Written without _style.txt (jobs listed with a leading '-'): that file asks for a white background.
usage: python art/design/prompts/_make_seg01.py   -> writes the .txt prompts
"""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import IDENTITY, DRAW, SHEET_RULE, HANDS, NEVER, variant

TOWN_HAND = (
    "Drawing style: exactly the drawing hand of the attached set-pack sheet: a printed illustration in ONE ink colour only, teal "
    "(#218EA3), on paper white: clean confident teal line art (outer contour a little heavier, inner lines thin and few), shadows "
    "and darker materials as clean, regular, round teal screentone dots (one dot size for light tone, a denser one for dark tone), "
    "solid teal or very dense teal dots for black hair and very dark clothes. White areas are paper white. No other colours: no grey, "
    "no black, no brown, no gradients, no airbrush, no glow, no blur, no paper texture, no pencil sketchiness. A crisp printed page, "
    "as drawn by a professional anime character designer.")

SCALE = (
    "Framing and scale (this is important, the people are lined up side by side in the film at one scale): portrait canvas 2:3. "
    "The canvas shows a FIXED 1.75 m of height: its top edge is 2.00 m above the floor and its bottom edge is 0.25 m above the floor, "
    "so the figure is cut by the bottom edge of the canvas at mid-calf (no feet in the picture). The person is exactly as tall on the "
    "canvas as their real height says: a 160 cm person's head top is 23% of the canvas height below the top edge, a 172 cm person's "
    "16%, a 183 cm person's 10%, a 152 cm girl's 27%. Empty transparent space above a short person is correct; do NOT enlarge the "
    "figure to fill the canvas. Camera at eye level (1.4 m), straight on, long lens: no high or low angle, no perspective "
    "distortion. Natural adult proportions, about 7 heads tall, legs not elongated.")

LANYARD = (
    "Lanyard: a thin teal lanyard goes round the back of the neck; its two strands come forward over the collarbones and STOP about "
    "5 cm below the collarbones, cut off cleanly there. Nothing hangs from it in this drawing: NO card, NO clip, NO holder (the film "
    "adds the lower lanyard and the card later). The middle of the chest, from the collarbones down to the waist, must be clear and "
    "visible: no hand, arm, bag strap or child in front of it.")

POSE_TOWN = (
    "Pose: standing still at a station platform edge in the morning, body and face toward the viewer (front view), the HEAD BOWED "
    "forward and the EYES LOOKING DOWN at the middle of their own chest (where their name card will hang), eyelids lowered, a quiet "
    "absorbed face. Shoulders level and relaxed.")

TOWN_TAIL = (
    "Keep this person's face, hairstyle, age, build and clothes exactly as on the attached set-pack sheet; only the pose and framing "
    "change. One single person (with the child where stated), alone. Fully TRANSPARENT background (PNG alpha) everywhere outside the "
    "figure: no floor, no cast shadow, no frame, no paper colour behind it; every part of the figure fully opaque, including its "
    "paper-white parts. No text, no labels, no logos, no watermark. Absolutely no red, pink or orange anywhere.")


def town(who, pose_extra):
    return "\n".join(["One character illustration for a film shot: a person of the town, redrawn from the attached set-pack sheet.",
                      who, POSE_TOWN, pose_extra, LANYARD, SCALE, TOWN_HAND, TOWN_TAIL])


TOWN = {
    't01_p1': (town("Sato Kenta, salaryman, about 42, 172 cm, solid and slightly heavy with a small belly; dark business suit, white "
                    "shirt, plain dark tie, short neat dark hair with a side part.",
                    "His right hand (the viewer's left) holds his black briefcase hanging at his side by its handle; his left arm "
                    "hangs relaxed. Tired, flat expression."), '../canon/town/p01_sato_kenta_salaryman.png'),
    't01_p3': (town("Takahashi Masao, retired man, about 75, 160 cm, thin, slightly stooped; glasses, cardigan, walking cane.",
                    "Both hands rest on the handle of his cane in front of him at hip height, the cane going down out of the "
                    "bottom of the canvas. Mild, patient face, a faint polite smile as he looks down."),
               '../canon/town/p03_takahashi_masao_elder_cane.png'),
    't01_p6': (town("Yamamoto Sakura, university student, 20, 160 cm, slim; soft light wavy shoulder-length hair, over-ear "
                    "headphones ON her ears, long loose open coat over a turtleneck, wide trousers, a small backpack on both "
                    "shoulders (straps visible); round face, soft cheeks, large slightly drooping round eyes.",
                    "Her hands hold the two backpack straps at the height of her lower ribs, at the SIDES of her chest (the "
                    "middle of the chest stays clear). Absent-minded face."), '../canon/town/p06_yamamoto_sakura_student.png'),
    't01_p7': (town("Kobayashi Yumi, a mother, about 34, 162 cm, average build, hair in a low loose bun, long light coat, carrying "
                    "her son Sota (3 years old, round small toddler, hooded jacket) on her RIGHT arm: the child sits at her hip on the "
                    "VIEWER'S LEFT side of her body, his face below her chin, facing the viewer. The child also has a thin teal "
                    "lanyard round his neck that stops just under his collarbones (his small card is added later too); his chest "
                    "must be clear (not covered by his arm or her hand).",
                    "Her left hand (the viewer's right) hangs relaxed. She looks down at her own chest with a tired, gentle face; "
                    "the child looks down at his own chest too, curious, mouth slightly open."),
               '../canon/town/p07_kobayashi_yumi_and_sota.png'),
    't01_p8': (town("Kato Daisuke, construction worker, about 38, 168 cm, stocky and broad; tied headband, towel round his neck, "
                    "work jacket, baggy cargo trousers.",
                    "His arms hang relaxed at his sides. Plain, steady face, mouth closed."), '../canon/town/p08_kato_daisuke_worker.png'),
    't01_p9': (town("Yoshida Ren, tall young man, about 22, 183 cm, very thin; oversized hoodie, very wide trousers, messy hair.",
                    "Both hands in the hoodie's front pocket (below the middle of the chest). Drowsy, half-closed eyes, mouth "
                    "slightly open."), '../canon/town/p09_yoshida_ren_hoodie.png'),
}

HER_ID = IDENTITY.replace("a teal lanyard with her white name card in a clear holder", "a thin teal lanyard round her neck")
HER_SUBJECT = (
    "This drawing: she stands on a station platform in the morning, seen at eye level (1.4 m) with a long lens, straight on, no high "
    "or low angle. Her BODY is turned about 40 degrees to the viewer's RIGHT (a three-quarter view of her body facing right) and her "
    "HEAD further, so her FACE is in clean PROFILE facing the viewer's right: she looks far away down the platform, calm and "
    "expressionless, eyes level, NOT looking at the viewer. She carries the black soft guitar gig bag of the second attached image on "
    "her back by both shoulder straps: the bag stands upright behind her, its top rising above her head (it is 106 cm long), its "
    "outline showing behind her on the viewer's LEFT side. Her right hand holds the front shoulder strap near her shoulder, at the "
    "height of her collarbone; her left arm hangs relaxed. The teal lanyard goes round her neck and its two strands STOP about 4 cm "
    "below her collarbones: NO card, NO clip, NO holder in this drawing (the film adds the card later), and the middle of her chest is "
    "clear. Framing and scale: portrait canvas 2:3 showing a FIXED 1.75 m of height, the top edge 2.00 m above the floor and the "
    "bottom edge 0.25 m above the floor, so the canvas bottom cuts her at mid-calf (her black knee socks; no feet). She is 152 cm: her "
    "head top is 27% of the canvas height below the top edge (the bow and the bag rise higher). Do not enlarge her to fill the canvas.")
HER_LIGHT = "Lighting: plain even morning daylight, the flat colours of the turnaround, one hard-edged shadow tone per material."
HER_ALPHA = ("Fully TRANSPARENT background (PNG alpha) everywhere outside her and the bag: no floor, no shadow, no frame. Every part "
             "of her and the bag fully opaque. No text, no logos. No red anywhere.")

R01 = {
    'r01_side': ("\n".join([HER_ID, HER_SUBJECT, DRAW, SHEET_RULE, HER_LIGHT, HANDS, NEVER, HER_ALPHA]),
                 ['../canon/rin_turnaround.png', '../canon/gigbag_front_back_side_open.png', '../ref/sheet_hands.png']),
}
FOLLOW = ("her HEAD turns about 30 degrees further to the viewer's right, away from the viewer, following a train that is leaving: "
          "we now see her face as a lost profile (the cheek line and the tip of the eyelashes, her ear and more of the back of her "
          "head and bob), still expressionless, eyes far away, never toward the viewer. The bow turns with the head. The body, "
          "shoulders, arms, hand, gig bag, lanyard, skirt and legs do not move at all.")

if __name__ == '__main__':
    for n, (txt, ref) in TOWN.items():
        open(os.path.join(here, n + '.txt'), 'w', encoding='utf-8').write(txt + "\n")
    for n, (txt, ref) in R01.items():
        open(os.path.join(here, n + '.txt'), 'w', encoding='utf-8').write(txt + "\n")
    open(os.path.join(here, 'r01_follow.txt'), 'w', encoding='utf-8').write(variant(FOLLOW) + "\n")
    args = [f"-{n}:{r}" for n, (t, r) in TOWN.items()] + [f"-{n}:{'+'.join(r)}" for n, (t, r) in R01.items()]
    print(' '.join(f'"{a}"' for a in args))
