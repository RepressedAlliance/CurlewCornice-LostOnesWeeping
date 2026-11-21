"""Segment 00 (the opening, k0-k8): the three close-up drawings of her (docs/分镜/00_开头音型.md 第 5 节).
All three share one framing, generated landscape 3:2 for the close-up (改定 11): from the top of her head to just below the
collarbones, shoulders whole inside the picture, the camera at her eye height. The card is drawn blank white in her hands; the
film's own card (web/lib/card.js) is laid over its face by the page, so its print is exact.

  python art/design/prompts/_make_seg00.py hold     -> r00_hold_a/_b      (the master, LARGE)
  python art/design/prompts/_make_seg00.py cover    -> r00_cover_a/_b     (variant of the chosen master, HANDS)
  python art/design/prompts/_make_seg00.py mid      -> r00_mid_a/_b       (in-between of cover and hold)
"""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import full, variant

FRAMING = (
    "One illustration, LANDSCAPE 3:2 (wider than tall), an extreme close-up made for a film's opening shot. She faces the camera "
    "straight on and the camera is exactly at her eye height: no looking up, no looking down, her head upright and level, not tilted. "
    "The TOP edge of the picture cuts across the top of her head a little above her bangs, so the white ribbon bow is cut off by the top "
    "edge (only the base of the bow's knot and the white headband show at the top edge). The BOTTOM edge of the picture is a little below "
    "her collarbones: the shirt collar, the teal ribbon tie and the top of the blazer lapels are in the picture, the rest of her runs off "
    "the bottom edge. Her eyes are about one third of the way down from the top edge. Her face from hairline to chin is about half the "
    "picture height. Both shoulders are COMPLETELY inside the picture, with empty transparent space beside each shoulder (about one "
    "tenth of the picture width on each side); her hair and shoulders never touch the left or right edge. She is centred.")
HOLD = (
    FRAMING + " Her whole face is visible. No expression at all: a blank, cold, still face, the small mouth closed in a short flat line, "
    "the eyebrows level and relaxed, the eyes fully open (not narrowed, not wide) and looking DIRECTLY into the camera, at the viewer. "
    "The teal lanyard: two teal cords come from behind her neck on both sides, lie over the shirt collar and run down the front of her "
    "shirt inside the blazer lapels, and both run off the bottom edge of the picture (her name card hangs below the picture, not seen). "
    "Her hands are not in the picture. Plain flat daylight from the upper left: one hard-edged shadow tone, no rim light, no glow, no "
    "pale line along the outline. The line art one step bolder than usual, because this picture is shown full screen.")

COVER = (
    "both her hands now come up from below and hold her name card up in front of her face. The card is held level and perfectly FLAT, "
    "square to the camera (no perspective, no tilt, four right-angled corners, slightly rounded): a landscape card 15 x 10 cm (width : "
    "height = 3 : 2), a little wider than her face. Its top edge is exactly at the bridge of her nose: the card hides her nose, mouth and "
    "chin; above it her eyes, eyebrows, bangs, hairclips and hair are exactly as they are, the same eyes still staring straight into the "
    "camera. The card's front is PLAIN BLANK WHITE with a thin dark-grey outline and NOTHING printed or drawn on it, except a small "
    "rounded slot hole at the top centre, where the lanyard clip goes. She pinches the card's two BOTTOM corners, each between her thumb "
    "(in front, the thumb tip on the card's corner) and her bent fingers (behind the card); her elbows are tucked in and her forearms "
    "go almost straight down from the card and run off the bottom edge; her blazer sleeves with a thin white shirt cuff. Between her "
    "two forearms, below the card, her neck, the shirt collar and the teal ribbon tie show, and the two teal lanyard cords rise from "
    "her collar and go up behind the card to its clip. Her small slim young hands exactly as in the hands reference.")
MID = (
    "the moment HALFWAY from this picture towards the second attached picture, as one in-between drawing: she is lowering the card. "
    "The card is still held flat and square to the camera by its two bottom corners, the same size, but it has come down so that its "
    "top edge is just below her chin: her nose and her closed mouth are now visible, the same blank face, the same eyes staring straight "
    "into the camera; her hands and forearms come down with the card (the card's lower part and her hands may run off the bottom "
    "edge); the lanyard cords follow the card. Hair, head, eyes and shoulders exactly as they are in both pictures.")

which = sys.argv[1] if len(sys.argv) > 1 else 'hold'
if which == 'hold':
    for n in ('r00_hold_a', 'r00_hold_b'):
        open(os.path.join(here, n + '.txt'), 'w', encoding='utf-8').write(full(HOLD, large=True, night=False) + "\n")
elif which == 'cover':
    for n in ('r00_cover_a', 'r00_cover_b'):
        open(os.path.join(here, n + '.txt'), 'w', encoding='utf-8').write(variant(COVER) + "\n")
elif which == 'mid':
    for n in ('r00_mid_a', 'r00_mid_b'):
        open(os.path.join(here, n + '.txt'), 'w', encoding='utf-8').write(variant(MID) + "\n")
print('ok', which)

# round 2 of the master: both first candidates drew the closed mouth as two separate dashes; redraw with one change
MOUTHFIX = ("her closed mouth only: draw it as ONE short, continuous, unbroken dark-grey line, slightly thicker in the middle and "
            "tapering at both ends, exactly like the small closed mouths on the sheet faces; no gap in the middle, no second line.")
if which == 'mouthfix':
    for n in ('r00_hold_c', 'r00_hold_d'):
        open(os.path.join(here, n + '.txt'), 'w', encoding='utf-8').write(variant(MOUTHFIX) + "\n")
    print('ok mouthfix')

# round 3: the first two covers drew the card about 1.75 : 1 and a little small; this time a placement guide (the master with
# a grey 3:2 rectangle, art/design/board/guide_r00_card.png) gives the card's exact place, size and shape
GUIDED = COVER + (" The SECOND attached image is a placement guide: the grey rectangle in it shows exactly where the card is, its "
          "exact size and its exact shape (width : height = 3 : 2, slightly rounded corners). Draw the card exactly there, that size "
          "and shape, but white, not grey. Her hands hold its two bottom corners, small and slim: the fingers drawn simply, without "
          "knuckle lines.")
if which == 'cover2':
    for n in ('r00_cover_c', 'r00_cover_d'):
        open(os.path.join(here, n + '.txt'), 'w', encoding='utf-8').write(variant(GUIDED) + "\n")
    print('ok cover2')

# the in-between, with a placement guide for the card (the same card, the same size as in the cover, lowered to under her chin)
MID_GUIDED = MID + (" The THIRD attached image is a placement guide: the grey rectangle in it shows exactly where the card is now and its "
              "exact size and shape (the same card as in the first picture, the same size, only lower; its bottom runs off the bottom "
              "edge). Draw the card exactly there, white, not grey, blank, with the same small slot at its top centre. Her hands still "
              "pinch its bottom corners, below the bottom edge of the picture, so only her wrists and sleeves may show at the edge.")
if which == 'mid2':
    for n in ('r00_mid_c', 'r00_mid_d'):
        open(os.path.join(here, n + '.txt'), 'w', encoding='utf-8').write(variant(MID_GUIDED) + "\n")
    print('ok mid2')

# ======== 成片 round (2026-11-20, after the two reviews of the samples) ========
# Reviews: the top edge cut off her big white bow (her most recognisable outline); the staring face was flat and cute, not cold;
# the lanyard was lost against the ribbon tie; the card's slot hole showed as a pink pill. So the master is drawn again with a
# taller framing: the WHOLE bow inside the picture (the page's frame cuts only the tips of its loops), a colder face with one
# hard-edged shadow tone, and two clearly separate lanyard cords.
FRAMING2 = (
    "One illustration, LANDSCAPE 3:2 (wider than tall), a close-up made for a film's opening shot. She faces the camera straight on "
    "and the camera is exactly at her eye height: no looking up, no looking down, her head upright and level, not tilted. The TOP edge "
    "of the picture is just above the tips of her big white ribbon bow: the WHOLE bow, both upright loops and the knot on the white "
    "headband, is inside the picture, with only a thin empty margin above the loop tips. The BOTTOM edge of the picture is a little "
    "below her collarbones: the shirt collar, the teal ribbon tie and the top of the blazer lapels are in the picture, the rest of her "
    "runs off the bottom edge. Both shoulders are COMPLETELY inside the picture, with empty transparent space beside each shoulder; "
    "her hair, bow and shoulders never touch the left or right edge. She is centred.")
LANYARD2 = (
    "The teal lanyard, drawn clearly: two separate flat teal cords come from behind her neck, one on each side, lie over the shirt "
    "collar OUTSIDE the ribbon tie and run straight down the front of her white shirt, spaced apart, each one clearly visible from "
    "the collar to the bottom edge of the picture and never merging with the ribbon tie or the lapels (her name card hangs below the "
    "picture, not seen), exactly like the two cords in the third attached image.")
COLD2 = (
    "No expression, and COLD: a still, unsettling stare straight into the camera, at the viewer. Her upper eyelids are lowered a "
    "little, so the top edge of each iris is hidden under the lid line; the lower lids are straight and slightly tense; the irises "
    "teal (#218EA3) with a dark pupil and ONE small catchlight each (smaller than usual); the eyebrows level and still; the small "
    "mouth closed in one short flat line. Like the first face on the second attached image (the expression sheet), but colder and "
    "more still, looking straight at the viewer.")
LIGHT2 = (
    "Light from the upper left. Exactly one hard-edged darker shadow tone per material, as in the third attached image: a hard "
    "shadow band under her bangs across the top of her forehead, the shadow of her chin on her neck, a hard shadow along the right "
    "side of her face and hair, shadows under the bow's loops. No gradients, no rim light, no glow, no pale line along the outline. "
    "The line art one step bolder than usual, because this picture is shown full screen.")
HOLD2 = FRAMING2 + " Her whole face is visible. " + COLD2 + " " + LANYARD2 + " Her hands are not in the picture. " + LIGHT2

if which == 'hold2':
    for n in ('r00_hold_e', 'r00_hold_f'):
        open(os.path.join(here, n + '.txt'), 'w', encoding='utf-8').write(full(HOLD2, large=True, night=False) + "\n")
    print('ok hold2')

# the cover and the in-between from the new master (r00_hold_f), each with a placement guide made from the master
# (art/design/board/guide_r00_card2.png, guide_r00_card2_mid.png). The card has NO slot hole: the lanyard clip grips its top edge.
COVER3 = (
    "both her hands now come up from below and hold her name card up in front of her face. The card is held level and perfectly FLAT, "
    "square to the camera (no perspective, no tilt, four right-angled corners, slightly rounded): a landscape card, width : height = "
    "3 : 2, a little wider than her face. Its top edge is exactly at the bridge of her nose, just under her lower eyelids: the card "
    "hides her nose, mouth and chin; above it her eyes, eyebrows, bangs, hairclips, headband, bow and hair are exactly as they are, the "
    "same cold half-lidded eyes still staring straight into the camera. The card's front is PLAIN BLANK WHITE with a thin dark-grey "
    "outline and NOTHING printed or drawn on it, and NO hole in it. A small teal plastic lanyard clip grips the middle of the card's "
    "TOP edge. She pinches the card's two BOTTOM corners, each between her thumb (in front, the thumb tip on the card's corner) and "
    "her bent fingers (behind the card); her elbows are tucked in and her forearms go almost straight down from the card and run off "
    "the bottom edge; her blazer sleeves with a thin white shirt cuff. Between her two forearms, below the card, her neck in shadow, "
    "the shirt collar and the teal ribbon tie show, and the two teal lanyard cords, clearly separate from the ribbon tie, rise from "
    "both sides of her collar in two slack curves and go up behind the card. Her small slim young hands exactly as in the hands "
    "reference. The SECOND attached image is a placement guide: the grey rectangle in it shows exactly where the card is, its exact "
    "size and its exact shape. Draw the card exactly there, that size and shape, but white, not grey. The fingers drawn simply, "
    "without knuckle lines.")
MID3 = (
    "the moment HALFWAY from this picture towards the second attached picture, as one in-between drawing: she is lowering the card. "
    "The card is still held flat and square to the camera by its two bottom corners, the same size, blank white with the same small "
    "teal clip on its top edge and no hole, but it has come down so that its top edge is just below her chin: her nose and her closed "
    "mouth are now visible, the same cold blank face, the same half-lidded eyes staring straight into the camera; her hands come down "
    "with the card, below the bottom edge of the picture, so only her wrists and sleeves may show at the edge; the two lanyard cords "
    "run from her collar down to the clip. Hair, bow, head, eyes and shoulders exactly as they are in both pictures. The THIRD attached "
    "image is a placement guide: the grey rectangle shows exactly where the card is now and its size and shape (its bottom runs off "
    "the bottom edge). Draw the card exactly there, white, not grey.")
if which == 'cover3':
    for n in ('r00_cover_e', 'r00_cover_f'):
        open(os.path.join(here, n + '.txt'), 'w', encoding='utf-8').write(variant(COVER3) + "\n")
    print('ok cover3')
if which == 'mid3':
    for n in ('r00_mid_e', 'r00_mid_f'):
        open(os.path.join(here, n + '.txt'), 'w', encoding='utf-8').write(variant(MID3) + "\n")
    print('ok mid3')

# cover round 2: in r00_cover_e the teal clip stood on the card's top edge right between her eyes and pulled the eye off them.
# Here the clip is on the back of the card, hidden; the front is plain white to its edges.
COVER4 = COVER3.replace(
    "and NO hole in it. A small teal plastic lanyard clip grips the middle of the card's TOP edge.",
    "and NO hole in it and NO clip on its front: the lanyard clip is on the BACK of the card, completely hidden behind it, so nothing "
    "sticks up above the card's top edge and nothing is between her eyes.")
assert COVER4 != COVER3
if which == 'cover4':
    for n in ('r00_cover_g', 'r00_cover_h'):
        open(os.path.join(here, n + '.txt'), 'w', encoding='utf-8').write(variant(COVER4) + "\n")
    print('ok cover4')

# cover round 3: e and h both lost the lanyard below the card (only a teal edge along the collar). The cords are long: with the card
# raised to her nose, their slack hangs below the card as two loose U-shaped loops in front of her shirt, one each side of the tie.
# The guide (board/guide_r00_card3.png) paints both loops in teal where they hang.
COVER5 = COVER4.replace(
    "and the two teal lanyard cords, clearly separate from the ribbon tie, rise from both sides of her collar in two slack curves and "
    "go up behind the card.",
    "and the slack of the two teal lanyard cords hangs below the card as two loose U-shaped loops in front of her white shirt, one on "
    "each side of the ribbon tie, both ends of each loop going up behind the card's bottom edge: draw them exactly where the two teal "
    "U-shaped lines are in the placement guide, as flat teal cords with a thin dark outline, clearly separate from the ribbon tie.")
assert COVER5 != COVER4
COVER5 = COVER5.replace("the grey rectangle in it shows exactly where the card is, its exact size and its exact shape.",
    "the grey rectangle in it shows exactly where the card is, its exact size and its exact shape, and the two teal U-shaped lines show where the lanyard loops hang.")
if which == 'cover5':
    for n in ('r00_cover_i', 'r00_cover_j'):
        open(os.path.join(here, n + '.txt'), 'w', encoding='utf-8').write(variant(COVER5) + "\n")
    print('ok cover5')

# ======== round 4 (2026-11-20, independent review of the finished segment) ========
# Review: r00_hold_v2 reads sleepy / bored (half-lowered lids, brows slightly raised), r00_cover_v2 reads shy; the cold look of the
# canon expression sheet (art/canon/rin_expressions.png, top row, second face: brows pressed down, flat hard upper lids) is missing.
# The master is drawn again with THAT face, looking straight at the viewer; art/design/board/ref_cold_stare.png is that face cropped
# from the canon sheet. Two fresh masters (_g, _h) and two as the old master redrawn with only the face changed (_i, _j).
COLD4 = (
    "Her face: COLD and hostile, the face of the second attached image (cropped from her official expression sheet), but looking "
    "straight into the camera, at the viewer: the eyebrows pressed DOWN and angled down towards the middle, their inner ends low and "
    "close to the eyes, with one short crease line between them; the upper eyelids are thick, FLAT and hard, a straight line across "
    "the top of each eye that cuts off the top of the iris (not drooping, not sleepy, not sad); the lower lids straight and raised a "
    "little, so the eyes are narrowed; the teal irises (#218EA3) look straight at the viewer, both irises exactly centred towards the "
    "camera, a dark pupil and ONE small hard catchlight each; the small mouth closed in one short flat line, the corners turned down "
    "very slightly. She looks at the viewer as if from above: contempt, distrust, a hard stare that does not blink. Not angry "
    "shouting, not pouting, not shy, not tired, not sad.")
HOLD4 = FRAMING2 + " Her whole face is visible. " + COLD4 + " " + LANYARD2.replace("the third attached image", "the third attached image") + \
    " Her hands are not in the picture. " + LIGHT2
HOLD4_VAR = (
    "her FACE only: " + COLD4.replace("Her face: ", "") + " Hair, bow, headband, hairclips, head shape and size, collar, lanyard, "
    "blazer and the framing exactly as they are.")
if which == 'hold4':
    for n in ('r00_hold_g', 'r00_hold_h'):
        open(os.path.join(here, n + '.txt'), 'w', encoding='utf-8').write(full(HOLD4, large=True, night=False) + "\n")
    for n in ('r00_hold_i', 'r00_hold_j'):
        open(os.path.join(here, n + '.txt'), 'w', encoding='utf-8').write(variant(HOLD4_VAR) + "\n")
    print('ok hold4')

# round 4, the cover from the new master r00_hold_h. The review also found the lanyard unclear: in r00_cover_v2 the two cords ran
# straight down the shirt and off the picture although the card was raised. Here the card is raised, so the cords run from the
# collar UP behind the card; nothing hangs down the shirt but the ribbon tie. She holds the card by its two SIDE edges, so in the
# in-between (card lowered to under her chin) her hands are still in the picture. Guide: art/design/board/guide_r00_card4.png.
COVER6 = (
    "both her hands now come up from below and hold her name card up in front of her face. The card is held level and perfectly FLAT, "
    "square to the camera (no perspective, no tilt, four right-angled corners, slightly rounded): a landscape card, width : height = "
    "3 : 2, a little wider than her face. Its top edge is exactly at the bridge of her nose, just under her lower eyelids: the card "
    "hides her nose, mouth and chin; above it her eyes, eyebrows (with the short crease between them), bangs, hairclips, headband, bow "
    "and hair are exactly as they are: the same cold, narrowed, hard eyes still staring straight into the camera. The card's front is "
    "PLAIN BLANK WHITE with a thin dark-grey outline, NOTHING printed or drawn on it, no hole in it and no clip on its front. She holds "
    "the card by its LEFT and RIGHT edges, a little below the middle of each edge: on each side her fingers curl round the card's edge "
    "from behind and only the thumb tip shows in front, on the card, right at the edge; her wrists and the white shirt cuffs and "
    "blazer sleeves go down from the card's sides, elbows tucked in, forearms running off the bottom edge of the picture. Her small "
    "slim young hands exactly as in the hands reference, the fingers drawn simply, without knuckle lines. The teal lanyard: the card "
    "is raised, so the two teal cords no longer hang down her shirt: they run from both sides of her collar straight UP behind the "
    "card to the clip on its back; below the card's bottom edge only a short piece of each cord shows on the collar, rising into the "
    "card. Nothing teal hangs down the front of her shirt except the ribbon tie. The SECOND attached image is a placement guide: the "
    "grey rectangle in it shows exactly where the card is, its exact size and its exact shape. Draw the card exactly there, that size "
    "and shape, but white, not grey.")
if which == 'cover6':
    for n in ('r00_cover_k', 'r00_cover_l'):
        open(os.path.join(here, n + '.txt'), 'w', encoding='utf-8').write(variant(COVER6) + "\n")
    print('ok cover6')

# round 4, the in-between of r00_cover_k (chosen) and r00_hold_h: the card halfway down, her hands still on its side edges.
MID6 = (
    "the moment HALFWAY from this picture towards the second attached picture, as one in-between drawing: she is lowering the card. "
    "The card is the same card, the same size, still held flat and square to the camera, blank white, no hole, no clip on its front, "
    "but it has come down so that its top edge is just below her chin: her nose and her small closed mouth are now visible, the same "
    "cold, narrowed, hard eyes staring straight into the camera, the same pressed-down eyebrows. Her hands still hold the card by its "
    "LEFT and RIGHT edges exactly as in this picture, only lower, so both hands, the shirt cuffs and the sleeves are still in the "
    "picture at the card's sides, near the bottom edge; the card's lower part may run off the bottom edge. The lanyard cords run from "
    "her collar up behind the card, hidden by it. Hair, bow, headband, hairclips, head and shoulders exactly as they are in both "
    "pictures. The THIRD attached image is a placement guide: the grey rectangle shows exactly where the card is now and its size and "
    "shape (its bottom runs off the bottom edge). Draw the card exactly there, white, not grey.")
if which == 'mid6':
    for n in ('r00_mid_g', 'r00_mid_h'):
        open(os.path.join(here, n + '.txt'), 'w', encoding='utf-8').write(variant(MID6) + "\n")
    print('ok mid6')
