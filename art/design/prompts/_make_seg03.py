"""Segment 03 (片名・検票口, docs/分镜/03_片名检票口.md) sample drawings for the two designs of the key shot (k48-k71).

Design A (甲): the two card readers side by side seen from above (paper layout: five hands of the town, one a beat, then her
hand three times), then the front elevation of the exit hall: she stands behind the gates facing us, the doors close, she
lets the card fall, she looks up at us.
  - r03_down  (master)  front, eye level, head bowed, holding her card up at her chest (card back towards us), gig bag on
  - r03_drop  (r03_down with one change: right arm down, no card, lanyard drawn only to the collarbones; code hangs the card)
  - r03_up    (r03_drop with one change: head up, looking straight at us, empty and hurt)
  - h03_tap_rin           her right hand pressing her card on the reader, seen from straight above
  - h03_tap_p1/p3/p6/p7/p8 the five people of 01, their hands pressing their own read-black cards (teal print)
Design B (乙): one shot from behind her at the gates: the queue in lane 3 taps through, she taps three times, the doors close
in front of her, she looks back over her shoulder.
  - rb03_down (master)  back view, eye level, arms down, head a little bowed, gig bag on her back
  - rb03_tap  (rb03_down with one change: the right arm reaches forward-right and presses her card on the reader)
  - rb03_turn (rb03_tap with one change: the head turned back over her LEFT shoulder, looking at us; the hand stays on the reader)
  - t03b_p1/p3/p6/p7/p8   the same five people from behind, each pressing a card on the reader to their right (teal print)

Scales (fixed, so the page places every drawing by numbers):
  her standing drawings: 2:3 canvas showing heights 0.40 m (bottom edge, at the knees) to 1.85 m (top edge), 10.59 px/cm;
  the town from behind: 2:3 canvas showing 0.25 m to 2.00 m (as in 01), 8.78 px/cm;
  the hands: 2:3 canvas, the card (15 cm) 60% of the canvas width, 41 px/cm.
Written without _style.txt (jobs listed with a leading '-'): that file asks for a white background.
usage: python art/design/prompts/_make_seg03.py [round]   -> writes the .txt prompts and prints the make_jobs arguments
"""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import IDENTITY, DRAW, SHEET_RULE, HANDS, LARGE, NEVER, variant

TURN = '../canon/rin_turnaround.png'
BAG = '../canon/gigbag_front_back_side_open.png'
HANDS_REF = '../ref/sheet_hands.png'
FACES_REF = '../ref/sheet_faces.png'
CARD_BACK = '../canon/card_back_rules.png'
CARD_HERS = '../canon/card_front_hers_blank.png'
CARD_TOWN = '../canon/card_front_town_filled.png'

LIGHT = "Lighting: plain even indoor daylight of a station hall, the flat colours of the turnaround, one hard-edged shadow tone per material."
HER_ALPHA = ("Fully TRANSPARENT background (PNG alpha) everywhere outside her and the bag: no floor, no shadow, no frame, no gate, no "
             "scenery. Every part of her and the bag fully opaque. No text, no logos. No red anywhere.")
STAND_SCALE = (
    "Framing and scale (important: the film places this drawing by measurement): portrait canvas 2:3 showing a FIXED 1.45 m of "
    "height: the top edge is 1.85 m above the floor and the bottom edge 0.40 m above the floor, so the bottom edge of the canvas cuts "
    "straight across her legs just above the knees (no knees, calves or feet in the picture; the legs must reach the bottom edge). She "
    "is 152 cm tall: the top of her head (not the bow) is 23% of the canvas height below the top edge; the bow rises higher. Do NOT "
    "enlarge her to fill the canvas. Her body centred horizontally. Camera exactly at her eye height (about 1.4 m), straight on, long "
    "lens: no high or low angle, no perspective distortion, the shoulders level.")
BAG_FRONT = (
    "She carries the black soft guitar gig bag of the second attached image on her back by both shoulder straps (the two straps visible "
    "over the front of her shoulders, on top of the blazer). The bag is behind her body; only its narrow neck end shows, rising behind "
    "her head on the viewer's LEFT side (behind her right shoulder), tilted very slightly, its rounded top a little above the height of "
    "her bow, the bag's body hidden behind her. The bow stays fully visible in front of it.")
BAG_BACK = (
    "Seen from BEHIND: she carries the black soft guitar gig bag of the second attached image on her back by both shoulder straps (its "
    "back view with the two straps is in the second image; seen from behind we look at the bag's FRONT face with its two zip pockets). "
    "The bag covers the middle of her back from her shoulder blades down to the back of her thighs; its narrow neck end rises behind her "
    "head on the viewer's RIGHT side (behind her right shoulder), tilted very slightly, its rounded top a little above the height of her "
    "bow; the bow's two loops and the back of her blonde bob show beside and in front of it. Her arms are outside the bag on both sides.")

CARD_HELD = (
    "Her name card: a white landscape card 15 x 10 cm in a thin clear plastic holder, hanging on the teal lanyard that goes round her "
    "neck. She holds it up in front of her chest with her RIGHT hand (on the viewer's LEFT) by its bottom edge, tilted towards herself "
    "so she can read it: so we see the BACK of the card, which is the card back of the third attached image (white, a few lines of "
    "small teal print and a dashed box, nothing dark). The lanyard runs from her neck down to the clip in the middle of the card's top "
    "edge. Her left arm hangs relaxed at her side.")

HER_FRONT = "\n".join([
    IDENTITY.replace("a teal lanyard with her white name card in a clear holder", "a thin teal lanyard round her neck"),
    "This drawing: she stands still in a lane of the station's automatic ticket gates, facing the viewer (front view), feet together.",
    BAG_FRONT, CARD_HELD,
    "Her HEAD is bowed and her eyes look DOWN at the card in her hand, eyelids lowered; a quiet, lost face, mouth closed. No tears.",
    STAND_SCALE, DRAW, SHEET_RULE, LIGHT, HANDS, NEVER, HER_ALPHA])

HER_BACK = "\n".join([
    IDENTITY.replace("a teal lanyard with her white name card in a clear holder", "a thin teal lanyard round her neck (her card hangs "
                     "in front of her chest, out of sight)"),
    "This drawing: she stands still at the entrance of a lane of the station's automatic ticket gates, seen exactly from BEHIND (a "
    "back view, as the back view on the turnaround), the viewer standing behind her. Feet together, both arms hanging relaxed at her "
    "sides, her head bowed a little forward (we see a little more of the back of her neck under the bob). Her face is not visible.",
    BAG_BACK, STAND_SCALE, DRAW, SHEET_RULE, LIGHT, HANDS, NEVER, HER_ALPHA])

# ---- the hands, seen from straight above (A: the reader close-up) ----
HAND_FRAME = (
    "Camera straight above, looking DOWN onto a flat horizontal surface (top-down view, like looking down at a desk): no perspective. "
    "Portrait canvas 2:3. The forearm comes in from the BOTTOM edge of the canvas (the sleeve is cut by the bottom edge), pointing "
    "straight up the canvas. The hand holds the card FLAT, face UP towards the viewer, square to the canvas (its edges parallel to the "
    "canvas edges, not rotated): the card is 60% of the canvas width, centred horizontally, its top edge 14% of the canvas height below "
    "the top edge. The hand holds the card by its BOTTOM edge: the thumb on top rests only on the bottom strip of the card (the lowest "
    "tenth of the card, under the printed grid), the fingers are under the card and do not show above it; the rest of the card face is "
    "completely free and visible. The card lies pressed flat on the surface, as if tapping it on a card reader.")


def hand_lanyard(side='LEFT'):
    return (f"A thin teal lanyard leaves the clip hole in the middle of the card's top edge, curves round the card's {side} side and "
            "runs down out of the bottom edge of the canvas beside the forearm (it never crosses the card face).")


H_RIN = "\n".join([
    "One drawing for a film shot: the right hand and forearm of the girl on the attached turnaround (Kagamine Rin in this film's "
    "design, 14 years old, 152 cm), nothing else of her.",
    HAND_FRAME,
    "Her hand is a 14-year-old girl's: small and slim (the palm about 7 cm wide, so the card is about twice the width of her hand). "
    "Sleeve: the charcoal-grey blazer cuff of the turnaround with a thin white shirt cuff showing.",
    "The card is the card of the second attached image: a white landscape card with its teal printed grid of empty oval bubbles, "
    "corner marks and timing marks, nothing filled in, nothing written.",
    hand_lanyard('RIGHT'),
    DRAW, SHEET_RULE, LIGHT, HANDS, NEVER,
    "Fully TRANSPARENT background (PNG alpha) everywhere outside the hand, sleeve, card and lanyard: no table, no reader, no shadow. No "
    "text, no logos, no red anywhere."])

TOWN_HAND = (
    "Drawing style: a printed illustration in ONE ink colour only, teal (#218EA3), on paper white (#F5F3ED), exactly the drawing hand "
    "of the first attached image: clean confident teal line art (outer contour a little heavier, inner lines thin and few), shadows and "
    "darker materials as clean, regular, round teal screentone dots (one dot size for light tone, a denser one for dark tone), solid "
    "teal or very dense teal dots for very dark sleeves. White areas are paper white. No other colours: no grey, no brown, no "
    "gradients, no airbrush, no glow, no blur, no paper texture, no pencil sketchiness. The only exception is the card: its filled "
    "bubbles are solid pencil black (#2A2A2F), exactly as on the second attached image. A crisp printed page, drawn by a professional "
    "anime character designer.")
TOWN_HAND_TAIL = ("Fully TRANSPARENT background (PNG alpha) everywhere outside the hand, sleeve, card and lanyard: no table, no reader, "
                  "no shadow. No captions, no text beyond the card's own print, no logos, no watermark. No red, pink or orange anywhere.")


def town_hand(who, hand, card_note="The card is the card of the second attached image: a white landscape card with a teal printed grid "
              "of oval bubbles; some bubbles filled solid pencil black, the こころ oval filled, a handwritten name in the name box."):
    return "\n".join([
        "One drawing for a film shot: the RIGHT hand and forearm of this person of the town (the first attached image is this person; "
        "keep the sleeve and the drawing style exactly), nothing else of the person.", who, HAND_FRAME, hand, card_note,
        hand_lanyard('LEFT'), TOWN_HAND, TOWN_HAND_TAIL])


H_TOWN = {
    'h03_tap_p1': (town_hand("Sato Kenta, salaryman, about 42, solid build.",
                             "An adult man's hand, broad and a little fleshy. Sleeve: the cuff of a dark business-suit jacket (dense teal "
                             "dots) with a white shirt cuff, a simple wristwatch on the wrist."), 'p01_sato_kenta_salaryman.png'),
    'h03_tap_p3': (town_hand("Takahashi Masao, retired man, about 75, thin.",
                             "An old man's thin hand: slender bony fingers, a few simple lines of wrinkles on the back of the hand (only a "
                             "few clean lines). Sleeve: the ribbed cuff of a knitted cardigan."), 'p03_takahashi_masao_elder_cane.png'),
    'h03_tap_p6': (town_hand("Yamamoto Sakura, university student, 20, slim.",
                             "A young woman's slim hand. Sleeve: the wide cuff of a long loose coat, and a thin headphone cable hanging "
                             "down past her wrist beside the forearm."), 'p06_yamamoto_sakura_student.png'),
    'h03_tap_p7': (town_hand("Kobayashi Yumi, a mother about 34, with her 3-year-old son Sota.",
                             "TWO hands. The card is held by the small hand of a 3-year-old child: a tiny chubby hand (short round fingers, "
                             "about half the size of an adult hand) with a THIN short forearm in the narrow cuff of a toddler's hooded jacket "
                             "(the child's sleeve is clearly narrower than the mother's). His mother's adult hand (the cuff of a long light "
                             "coat) comes from below and gently holds the child's hand from underneath, her fingers curled round his little "
                             "fist and wrist, guiding it. Both forearms come in from the bottom edge side by side, the child's on the right.",
                             "The card is a child's small card, the same design as the second attached image but smaller (45% of the canvas "
                             "width instead of 60%, still centred, its top edge still 14% below the canvas top): some bubbles filled solid "
                             "pencil black, the こころ oval filled, a handwritten name."), 'p07_kobayashi_yumi_and_sota.png'),
    'h03_tap_p8': (town_hand("Kato Daisuke, construction worker, about 38, stocky and strong.",
                             "A big strong worker's hand with thick fingers. Sleeve: the cuff of a work jacket, rolled once."),
                   'p08_kato_daisuke_worker.png'),
}

# ---- the town from behind (B: the queue in lane 3) ----
BACK_SCALE = (
    "Framing and scale (the people stand in a row in the film at one scale): portrait canvas 2:3 showing a FIXED 1.75 m of height: its "
    "top edge is 2.00 m above the floor and its bottom edge 0.25 m above the floor, so the bottom edge cuts the legs at mid-calf (no "
    "feet). The person is exactly as tall on the canvas as their real height says: a 172 cm person's head top is 16% of the canvas "
    "height below the top edge, a 168 cm person's 18%, a 162 cm person's 22%, a 160 cm person's 23%. Empty transparent space above is "
    "correct; do NOT enlarge the figure. Camera at eye level (1.4 m), straight on, long lens: no high or low angle. Natural adult "
    "proportions, about 7 heads tall.")
BACK_POSE = (
    "Seen exactly from BEHIND (a back view: the back of the head, no face), the person stands at the entrance of a station ticket-gate "
    "lane, walking away from the viewer. The RIGHT arm (on the viewer's RIGHT) reaches out forward and to the right and the right hand "
    "presses a card flat down onto a waist-high surface just to the right of the body (the top of the card reader, 1.0 m above the "
    "floor): the hand, seen from behind and above, is at the right edge of the body at the height of the hip, about 30 cm to the right "
    "of the body's centre line; the card under it is seen almost edge-on. A thin teal lanyard runs from the back of the neck over the "
    "right shoulder down to the card in the hand.")
BACK_TAIL = ("Keep this person's hairstyle, age, build and clothes exactly as on the attached set-pack sheet, seen from behind; only the "
             "pose, view and framing change. One single person (with the child where stated), alone. Fully TRANSPARENT background "
             "(PNG alpha) everywhere outside the figure: no floor, no gate, no shadow. Every part of the figure fully opaque, including "
             "its paper-white parts. No text, no logos, no watermark. Absolutely no red, pink or orange anywhere.")


def town_back(who, extra):
    return "\n".join(["One character illustration for a film shot: a person of the town, redrawn from the attached set-pack sheet.",
                      who, BACK_POSE, extra, BACK_SCALE, TOWN_HAND.replace(" The only exception is the card: its filled bubbles are "
                      "solid pencil black (#2A2A2F), exactly as on the second attached image.", ""), BACK_TAIL])


T_BACK = {
    't03b_p1': (town_back("Sato Kenta, salaryman, about 42, 172 cm, solid and slightly heavy; dark business suit, short neat dark hair.",
                          "His left hand holds his black briefcase hanging at his left side."), 'p01_sato_kenta_salaryman.png'),
    't03b_p3': (town_back("Takahashi Masao, retired man, about 75, 160 cm, thin, slightly stooped; white hair, cardigan, glasses (only the "
                          "temple arms show from behind).",
                          "His left hand holds his walking cane, its tip on the ground out of the bottom edge."),
                'p03_takahashi_masao_elder_cane.png'),
    't03b_p6': (town_back("Yamamoto Sakura, university student, 20, 160 cm, slim; soft light wavy shoulder-length hair, over-ear headphones "
                          "on her head (the band over the top of the head), a long loose open coat, a small backpack on both shoulders.",
                          "Her left hand holds the left backpack strap."), 'p06_yamamoto_sakura_student.png'),
    't03b_p7': (town_back("Kobayashi Yumi, a mother, about 34, 162 cm, hair in a low loose bun, long light coat, carrying her son Sota (3 "
                          "years old, round small toddler, hooded jacket) on her LEFT arm, at her hip on the viewer's LEFT side.",
                          "The boy, carried facing his mother, looks back at the viewer over her shoulder: his round face turned to us, "
                          "curious, mouth a little open; his little hand on her shoulder."), 'p07_kobayashi_yumi_and_sota.png'),
    't03b_p8': (town_back("Kato Daisuke, construction worker, about 38, 168 cm, stocky and broad; tied headband (its knot at the back of the "
                          "head), a towel round his neck, work jacket, baggy cargo trousers.",
                          "His left arm hangs relaxed."), 'p08_kato_daisuke_worker.png'),
}

# ---- variants (round 2 and 3) ----
V2 = {
    'r03_drop': ("r03_down", "her RIGHT arm (on the viewer's LEFT) now hangs relaxed straight down at her side, exactly like her left arm "
                 "(mirror image), the hand open and loose by her thigh. She no longer holds the card: remove the card and the clip from "
                 "the picture completely, and the teal lanyard's two strands now come down over her collarbones and STOP there, cut off "
                 "cleanly about 4 cm below the collarbones (nothing hangs from them; the blazer and shirt on her chest are drawn complete "
                 "where the card was). Her head stays bowed and her eyes stay looking down exactly as they are."),
    'rb03_tap': ("rb03_down", "her RIGHT arm (on the viewer's RIGHT) reaches a little forward and down to her right, the elbow slightly bent "
                 "and close to her side, and her right hand presses her name card flat down onto a surface that is NOT drawn: the hand is "
                 "only about 15-20 cm to the right of her hip, at the height of her hip (about 0.95 m above the floor, about 62% of the "
                 "canvas height from the top), seen from behind and a little above: the back of her small hand on top, palm down, the "
                 "white card under her palm seen almost edge-on as a thin white sliver. Draw NOTHING under the card: no box, no block, no "
                 "reader, no shadow; the transparent background continues right under the card. The teal lanyard runs from her neck under "
                 "her right arm to the card. Her head is still bowed a little, looking down at her hand."),
}
V3 = {
    'rb03_turn': ("rb03_tap", "she turns her HEAD back over her LEFT shoulder (on the viewer's LEFT) and looks straight at the viewer: we now "
                  "see her face in a three-quarter view from behind over her left shoulder (her left cheek, both eyes, the small mouth), "
                  "her teal eyes looking straight at the viewer; the expression is empty and hurt: the eyes open but strangely empty, "
                  "the inner ends of the eyebrows raised very slightly, the mouth closed with its corners a little down. Not cold, not "
                  "crying, no tears. The bow turns with her head. Her shoulders, both arms (her right hand stays pressed on the card on the reader), the gig bag, the skirt and legs do not move."),
    'r03_up': ("r03_drop", "she lifts her HEAD level and looks straight at the viewer: her teal eyes open and look directly into the camera; "
               "the expression is empty and hurt: the eyes strangely empty, as if not quite focused, the inner ends of the eyebrows raised "
               "very slightly, the mouth closed with its corners turned a little down. Not cold, not angry, not crying, no tears. The bow "
               "and bangs follow the head. The body, both arms, the lanyard ends, the gig bag, the skirt and legs do not move at all."),
}


def write(name, text):
    open(os.path.join(here, name + '.txt'), 'w', encoding='utf-8').write(text + "\n")


if __name__ == '__main__':
    rnd = sys.argv[1] if len(sys.argv) > 1 else '1'
    out = []
    if rnd == '1':
        write('r03_down', HER_FRONT); out.append(f"-r03_down:{TURN}+{BAG}+{CARD_BACK}+{HANDS_REF}")
        write('rb03_down', HER_BACK); out.append(f"-rb03_down:{TURN}+{BAG}+{HANDS_REF}")
        write('h03_tap_rin', H_RIN); out.append(f"-h03_tap_rin:{TURN}+{CARD_HERS}+{HANDS_REF}")
    elif rnd == 'town':
        for n, (t, r) in H_TOWN.items(): write(n, t); out.append(f"-{n}:../canon/town/{r}+{CARD_TOWN}")
        for n, (t, r) in T_BACK.items(): write(n, t); out.append(f"-{n}:../canon/town/{r}")
    elif rnd == '2':
        for n, (src, ch) in V2.items():
            write(n, variant(ch)); out.append(f"-{n}:out/{src}.png" + '')
    elif rnd == '3':
        for n, (src, ch) in V3.items():
            write(n, variant(ch) + "\n" + LARGE); out.append(f"-{n}:out/{src}.png+{TURN}+{FACES_REF}")
    print(' '.join(f'"{a}"' for a in out))
