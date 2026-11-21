"""Segment 11 (前副歌2, docs/分镜/11_前副歌2.md) drawings for the samples of the two designs of the key shots (k343-k359).

Design A (甲, her card back asks, a row of card backs answers):
  - r11_cb       (R11-cb, master) the close-up of her card back: only her ribbon tie's lower end, blazer front, the teal lanyard,
                 the blank card (the film paints its back) and the fingertips of both hands on its lower corners
  - r11_cb_grip  (R11-cb-grip, r11_cb with one change: the fingertips press hard into the card's edge)
  - p11_trio     (P11-B, P11-A, P11-C in one drawing so their shoulders overlap naturally) three people of the town, teal print,
                 chest to hips, each holding their own blank card in front of the chest, back to us
  - r11_row      (R11-row, master) her in the same framing and scale as p11_trio, full colour, holding her blank card the same way
Design B (乙, the reading machine's exit):
  - h11_write    (H11-write, master) her right hand from straight above with the back half of the pencil snapped in 08b, sharpened
                 again at the broken end (also the S1 drawing of the full segment)
  - m11_reader_top  the exit end of the reading machine from straight above: housing, card exit slot, empty output tray (teal print)

The cards are drawn blank (plain paper white): card.js-style code paints every card's back in the film (docs/设定包.md: 画进人物图的
卡只当占位). Cards are placed by the grey guides of _seg11_guides.py. Written without _style.txt (it asks for a white background).
usage: python art/design/prompts/_make_seg11.py   -> writes the .txt prompts and prints the make_jobs arguments
"""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import IDENTITY, DRAW, SHEET_RULE, HANDS, NEVER, variant

TURN = '../canon/rin_turnaround.png'
HANDS_REF = '../ref/sheet_hands.png'
HPEN = '../cut/hpen3.png'
SNAP = '../cut/h08b_snap.png'
G_CB = 'board/guide_seg11_cb.png'
G_TRIO = 'board/guide_seg11_trio.png'
G_ROW = 'board/guide_seg11_row.png'
P_B = '../canon/town/p05_watanabe_sho_gakuran.png'
P_A = '../canon/town/p02_tanaka_misaki_officeworker.png'
P_C = '../canon/town/p06_yamamoto_sakura_student.png'
READER = '../canon/card_reader_cutaway.png'
ERASER = '../canon/machine_big_eraser.png'
PRINT_REF = 'board/print_people_test_s.png'

DAY = ("Lighting: plain even daylight, the flat colours of the turnaround, exactly one hard-edged shadow tone per material; no rim "
       "light, no glow, no light band along the outline, no cast shadow on the card.")
ALPHA = ("Fully TRANSPARENT background (PNG alpha) everywhere outside the figure: no wall, no floor, no scenery, no frame. Every part "
         "of the figure and the card fully opaque. No text, no logos, no red anywhere.")
BLANK_CARD = ("The card is a plain landscape answer-sheet card, 15 x 10 cm (exactly 1.5 times as wide as tall), held FLAT, LEVEL and "
              "PARALLEL to the picture plane (no tilt, no turn, no perspective, its top edge exactly horizontal), its BACK facing the "
              "viewer. The side we see is completely BLANK: flat plain paper white (#F5F3ED) with only a thin crisp grey outline and "
              "small rounded corners: nothing printed, no text, no lines, no shading, no reflections, no clear plastic holder (the "
              "film paints the card's back later, so it must be one clean flat white area). The lanyard's metal clip holds the card "
              "through a small slot at the middle of its top edge.")
GRIP = ("How the card is held (a person looking down at the front of their own card): the THUMBS are on the far side of the card "
        "(the front, facing the person) and are NOT visible. On the near side (facing us) we see only the tips of the index, middle and "
        "ring fingers of each hand, the backs of the fingers towards us (fingernails visible), lying on the card at its two LOWER "
        "corners and along its lower edge, pointing up and slightly inward, covering no more than the lowest fifth of the card's "
        "height. The rest of each hand is below the card's lower edge.")

R_CB = "\n".join([
    IDENTITY.replace("a teal lanyard with her white name card in a clear holder", "a teal lanyard with her name card"),
    "One illustration for a film close-up, landscape canvas 3:2, showing only a region 30 cm wide and 20 cm tall in front of her "
    "chest (her face, neck and shoulders are ABOVE the canvas, out of the picture). She stands facing the viewer and holds her name "
    "card in front of her chest with both hands, looking down at it (we do not see her face). Camera exactly at the height of her "
    "chest, straight on, long lens: no high or low angle.",
    "Framing, exactly as the attached grey guide (the third attached image) shows: the card is the grey rectangle: centred, half the "
    "canvas width, its top edge 30% down from the canvas top, its bottom edge 80% down. Above the card: the lower end of her teal "
    "ribbon tie in one top corner area, the white shirt between the open charcoal blazer fronts; the teal lanyard comes down from the "
    "top edge of the canvas to the clip in the middle of the card's top edge. Behind and around the card: her charcoal blazer fills "
    "the rest of the canvas to both side edges. Below the card: her two small hands in white shirt cuffs and charcoal blazer sleeves, "
    "the sleeves leaving through the bottom edge.",
    BLANK_CARD, GRIP,
    "Her fingers are a 14-year-old girl's: small, slim, simple rounded fingertips, each finger drawn separately, at the true size for "
    "a card 15 cm wide (a fingertip is about 1.3 cm wide, a little less than one tenth of the card's width), the same hand as the "
    "second attached image.",
    DRAW, SHEET_RULE, DAY, HANDS, NEVER, ALPHA])

R_CB_GRIP = variant(
    "her fingertips now press HARD into the card: the six visible fingertips grip the card's two lower corners and lower edge more "
    "tightly, the fingers a little more bent so one knuckle line of each shows, the fingertips a little paler with the pressure, and "
    "the card's two lower corners bend slightly AWAY from the viewer under the pressure (shown only by a narrow hard-edged light grey "
    "shadow band along each bent corner; the card stays one clean blank paper-white area elsewhere). The lanyard, ribbon tie, shirt, "
    "blazer, sleeves and the card's position stay exactly as they are, line for line.")

TOWN_HAND = (
    "Drawing style: a printed illustration in ONE ink colour only, teal (#218EA3), on paper white (#F5F3ED), exactly the drawing hand "
    "of the three attached people: clean confident teal line art (outer contour a little heavier, inner lines thin and few), shadows "
    "and darker materials as clean, regular, round teal screentone dots (halftone, one dot size for light tone, a denser one for dark "
    "tone), solid teal or very dense teal dots for very dark clothes. White areas are paper white. No other colours: no grey, no "
    "black, no brown, no gradients, no airbrush, no glow, no blur, no paper texture, no pencil sketchiness. A crisp printed page, as "
    "drawn by a professional anime character designer.")

P_TRIO = "\n".join([
    "One illustration for a film shot: three people of the town standing close together in a row, facing the viewer, seen from the "
    "front at chest height with a long lens (no high or low angle, no perspective). Landscape canvas 3:2 showing a region 75 cm wide "
    "and 50 cm tall: the TOP edge of the canvas cuts across their necks just below the chin (NO chin, NO mouth, NO face, no hair "
    "except the very ends of long hair on the shoulders), the bottom edge at their hips. Their shoulder lines are level with each "
    "other, about 6 cm below the top edge.",
    "Who is who (match their clothes and builds exactly to the attached full-body pictures of the same people): LEFT: the first "
    "attached person (Watanabe Sho, 17, a high-school boy in a black stand-up-collar gakuran with round buttons, a shoulder bag strap "
    "across his chest); he stands half a step BEHIND, his right shoulder partly hidden behind the middle woman's left shoulder, his "
    "outer (viewer's left) shoulder reaching the left edge of the canvas. MIDDLE, in FRONT: the second attached person (Tanaka "
    "Misaki, 24, an office worker in a light trench coat over a dark top, a tote bag strap on her shoulder). RIGHT: the third attached "
    "person (Yamamoto Sakura, 20, a university student in a long pale coat, headphones resting round her neck, a backpack strap); she "
    "stands half a step BEHIND, her left shoulder partly hidden behind the middle woman's right shoulder, the right side of her body "
    "complete and free (another person will stand in front of her right shoulder later).",
    "Each of the three holds their OWN name card on a teal lanyard in front of their chest with both hands and looks down at it. "
    "The three cards are EXACTLY where the attached grey guide (the fourth attached image) draws the three grey rectangles: their top "
    "edges on ONE horizontal line, the middle card slightly larger (she is half a step nearer), the gaps between neighbouring cards "
    "narrow and equal. " + BLANK_CARD.replace("The lanyard's", "Each lanyard's"),
    GRIP + " Each person holds it a little differently: the boy on the left has his elbows out, his left fingertips under the card's "
    "lower edge near the left corner and his right fingertips on the lower right corner; the woman in the middle holds both lower "
    "corners neatly and symmetrically; the student on the right presses her right fingertips on the lower right corner and pinches "
    "the lower left corner with only two fingertips of her left hand. Hands simple and correctly drawn, adult size.",
    TOWN_HAND, ALPHA])

R_ROW = "\n".join([
    IDENTITY.replace("a teal lanyard with her white name card in a clear holder", "a teal lanyard with her name card"),
    "One illustration for a film shot: she stands facing the viewer, seen from the front at chest height with a long lens (no high or "
    "low angle, no perspective). Landscape canvas 3:2 showing a region 75 cm wide and 50 cm tall: the TOP edge of the canvas cuts "
    "across her neck just below the chin (NO chin, NO mouth, NO face; only the ends of her blonde bob may touch the top edge beside "
    "the neck), the bottom edge at her hips (the top of her charcoal pleated skirt). Her shoulder line is about 6 cm below the top "
    "edge. She is centred in the canvas, both shoulders and arms drawn complete, empty transparent space on both sides.",
    "She holds her own name card on the teal lanyard in front of her chest with both hands and looks down at it. The card is exactly "
    "where the attached grey guide (the second attached image) draws the grey rectangle. " + BLANK_CARD,
    GRIP + " Both hands symmetrical and neat. Her hands are a 14-year-old girl's: small and slim, simple rounded fingertips, the same "
    "hands as on the turnaround.",
    "Visible clothes: the lower part of the white shirt collar and the teal ribbon tie, the charcoal school blazer with its dark "
    "emblem on the left pocket, white shirt cuffs.",
    DRAW, SHEET_RULE, DAY, HANDS, NEVER, ALPHA])

H_WRITE = "\n".join([
    "One illustration for a film close-up: the RIGHT hand and forearm of the girl of the turnaround (Kagamine Rin in this film's "
    "design, 14 years old), nothing else of her. The first attached image is the SAME hand holding the SAME kind of pencil from the "
    "same camera: keep its hand, sleeve, size, position, writing grip and drawing style exactly.",
    "Portrait canvas 2:3. Seen from straight above, looking down at a desk: her right hand calmly WRITING with a SHORT Japanese school "
    "pencil: it is the back HALF of the dark green hexagonal pencil that snapped in the second attached image, about half as long as "
    "the pencil in the first attached image. Its front end, where it broke, has been SHARPENED again: a neat cone of natural wood and "
    "a black graphite point (a few faint knife facets on the wood); its back end is the original FLAT painted green end with NO eraser. "
    "The graphite point touches the paper at the upper left of the hand, at the same place as in the first attached image. Because "
    "the pencil is short, its flat back end sticks out only a little past the knuckle of the index finger. The wrist comes out of a "
    "white shirt cuff and the charcoal blazer sleeve; the forearm runs straight down and leaves the picture through the bottom edge.",
    "Her hand is a 14-year-old girl's: small and slim, a narrow palm and wrist, thin fingers, drawn as simply as the hands on the "
    "turnaround (enlarged in the last attached image).",
    DRAW, SHEET_RULE, "Lighting: plain daylight from the upper left, one hard-edged shadow tone, no rim light, no glow, no halo.", HANDS,
    NEVER, "Fully TRANSPARENT background (PNG alpha) everywhere outside the hand, sleeve and pencil: no desk, no paper, no shadow, no "
    "glow or halo round the hand. No text, no logos, no red anywhere."])

M_READER = "\n".join([
    "One illustration of a machine part for a film shot: the OUTPUT end of the film's card-reading machine (the first attached image "
    "is its official cutaway design sheet: the same machine, the same parts, the same printed drawing style), now seen from DIRECTLY "
    "ABOVE: a plan view, orthographic, no perspective at all, every edge horizontal or vertical.",
    "Landscape canvas 3:2, the canvas 45 cm wide. Across the TOP 30% of the canvas, the full width: the machine's flat lid seen from "
    "above (a long rectangle running out of both side edges of the canvas): a few panel seams, four small screws, a short row of six "
    "separate small solid teal squares (timing marks) near its right end, a small grille of slots. Along the lid's LOWER edge, on the "
    "left two thirds: the card EXIT SLOT, a long narrow horizontal slit (about 17 cm long) with two thin lips, dark teal inside. On "
    "the right third: a narrower PAPER SLOT for the printer (about 9 cm long), empty.",
    "Directly below the card exit slot: the output TRAY in plan view, attached to the machine: a shallow open tray, a rectangle with a "
    "low rim (the rim drawn as a narrow band with one tone of teal dots on its inner side), its inner floor plain paper white, about "
    "17 cm wide and 12 cm deep (sized for landscape cards of 15 x 10 cm), EMPTY: no cards in it. Below and beside the tray: nothing "
    "(fully transparent).",
    "Drawing style: a printed technical illustration in ONE ink colour only, teal (#218EA3), on paper white (#F5F3ED), exactly the hand "
    "of the first attached image: clean teal line art, shading as clean regular round teal screentone dots, no grey, no black, no "
    "gradients, no glow, no texture. No text, no numbers, no labels, no logos. No red anywhere.",
    "Fully TRANSPARENT background (PNG alpha) everywhere outside the machine lid and the tray."])

PROMPTS = {'r11_cb': R_CB, 'r11_cb_grip': R_CB_GRIP, 'p11_trio': P_TRIO, 'r11_row': R_ROW, 'h11_write': H_WRITE,
           'm11_reader_top': M_READER}
for n, t in PROMPTS.items():
    open(os.path.join(here, n + '.txt'), 'w', encoding='utf-8').write(t)

ROUND1 = [f'-r11_cb:{TURN}+{HPEN}+{G_CB}+{HANDS_REF}', f'-p11_trio:{P_B}+{P_A}+{P_C}+{G_TRIO}',
          f'-r11_row:{TURN}+{G_ROW}+{HANDS_REF}', f'-h11_write:{HPEN}+{SNAP}+{TURN}+{HANDS_REF}',
          f'-m11_reader_top:{READER}+{ERASER}']
ROUND2 = ['-r11_cb_grip:out/r11_cb.png']
print('round 1:', ' '.join(f'"{a}"' for a in ROUND1))
print('round 2:', ' '.join(f'"{a}"' for a in ROUND2))
