"""Segment 11 (前副歌2, docs/分镜/11_前副歌2.md), the finished segment after the blind review of the samples (design 甲).

New drawings (the sample's r11_cb, r11_cb_grip and h11_write stay):
  - h11_rub     (H11-rub, h11_write redrawn with one change: the pencil moved between index and middle finger, the thumb
                 stretched out flat, its pad pressed on the paper) S1 k332-k335
  - r11_id_a    (R11-id-a, master) S2: her ID photo, chest up, front, eye level, holding her card (back to us) in front of her
                 chest, looking down at it; portrait canvas 50 x 75 cm, cropped in the film by the photo frame
  - r11_id_b    (R11-id-b, r11_id_a with one change: her eyes closed)
  - p11_trio2   (P11-B/A/C) the three of the town for S3b, redrawn so the frame's top edge can sit on the shoulder line (the
                 review: no chin, no mouth, no neck) and the drawing reaches below the frame's bottom edge; cards on the guide
  - r11_row2    (R11-row) her in S3b at the same scale as p11_trio2, complete on both sides (a strip of paper right of her
                 carries her pencil column), at a 14-year-old's width next to the adults
Cards are drawn blank (the film paints them). usage: python art/design/prompts/_make_seg11f.py
"""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import IDENTITY, DRAW, SHEET_RULE, HANDS, NEVER, LARGE, variant
from _make_seg11 import DAY, ALPHA, BLANK_CARD, GRIP, TOWN_HAND

TURN = '../canon/rin_turnaround.png'
FACES = '../ref/sheet_faces.png'
HANDS_REF = '../ref/sheet_hands.png'
HW = '../cut/h11_write.png'
CB = '../cut/r11_cb.png'
TRIO1 = '../cut/p11_trio.png'
ROW1 = '../cut/r11_row.png'
G_TRIO = 'board/guide_seg11f_trio.png'
G_ROW = 'board/guide_seg11f_row.png'
G_ID = 'board/guide_seg11f_id.png'
P_B = '../canon/town/p05_watanabe_sho_gakuran.png'
P_A = '../canon/town/p02_tanaka_misaki_officeworker.png'
P_C = '../canon/town/p06_yamamoto_sakura_student.png'
ID_NAME = IDENTITY.replace("a teal lanyard with her white name card in a clear holder", "a teal lanyard with her name card")

H_RUB = variant(
    "the grip. She has stopped writing and is rubbing out what she wrote with her THUMB: the short green pencil is now held loosely "
    "between the index and middle fingers (like a cigarette is held), pointing up and outward to the RIGHT, away from the paper; the "
    "THUMB is stretched out straight to the upper LEFT and its pad lies FLAT on the paper, pressing, at the place where the pencil "
    "point was; the other fingers curl loosely under the hand. The wrist, the white cuff, the charcoal sleeve, the size of the hand "
    "and its position in the canvas stay exactly as they are; the pencil keeps its length, its sharpened point and its flat green end "
    "with no eraser. Fully transparent background, no shadow, no glow or halo.")

R_ID_A = "\n".join([
    ID_NAME,
    "One illustration for a film shot: her ID photograph. Portrait canvas 2:3 showing a region 50 cm wide and 75 cm tall, from just "
    "above the top of her bow down to below her waist, exactly as the attached grey guide (the second attached image) lays it out: "
    "the dashed grey rectangle is the photo's frame (everything inside it is in the shot, so draw her complete beyond it on all sides), "
    "the light grey oval is where her face is, the light lines are the top of her bow and her chin, the solid grey rectangle is her "
    "card. She stands straight, facing the viewer squarely, centred, both shoulders level and equally wide; the camera is level with "
    "her chest and straight on, long lens: no high or low angle, no perspective.",
    "She holds her own name card on the teal lanyard in front of her chest with both hands, exactly in the grey rectangle, and looks "
    "DOWN at it: her head is tilted forward a little, her face still clearly seen from the front, her eyes lowered to the card (lids "
    "half down, looking at the card, not at the viewer), no expression, mouth closed. Calm, quiet, ordinary. " + BLANK_CARD,
    GRIP + " Both hands symmetrical and neat, the same hands as the turnaround; the elbows close to her sides.",
    "Visible: the whole bow and hair, her face, neck, the white shirt collar and teal ribbon tie, the open charcoal blazer, the teal "
    "lanyard from her neck to the clip at the middle of the card's top edge, both arms and hands, the blazer down to below the waist.",
    "The third attached image is the same pose seen much closer (her card and hands): the same grip, hands and card height.",
    DRAW, SHEET_RULE, DAY, LARGE.replace("(the last attached image)", "(the fourth attached image)"), HANDS, NEVER, ALPHA])

R_ID_B = variant(
    "her eyes are now CLOSED: both upper eyelids come down and meet the lower lids, the lashes a clean dark curved line where each eye "
    "was, calm, the eyebrows exactly where they are (not frowning, not pained, no tears): she simply shuts her eyes. Head, face shape, "
    "mouth, hair, bow, hands, card and clothes stay exactly as they are, line for line.")

TRIO_DESIGN = (
    "Builds: ordinary adults, a little slimmer than life but with real shoulders: each person's body, arms included, is about twice "
    "as wide as their card. The three bodies overlap the way people standing close in a queue do.")
P_TRIO2 = "\n".join([
    "One illustration for a film shot: three people of the town standing close together in a row, facing the viewer, seen from the "
    "front at chest height with a long lens (no high or low angle, no perspective). Landscape canvas 3:2. Lay it out EXACTLY as the "
    "attached grey guide (the fourth attached image): the solid light grey line near the top is their SHOULDER LINE (the tops of all "
    "their shoulders touch it); the dashed line just below it is the top edge of the film frame and the dashed line on the left its "
    "left edge (draw the people complete beyond both dashed lines, the film crops them); the three grey rectangles are their three cards. "
    "Above the shoulder line there is only the bottom of their necks and collars, cut by the canvas top edge (NO chin, NO mouth, NO "
    "face). The canvas bottom edge cuts across their thighs, below their hips.",
    "Who is who (match their clothes and builds to the attached full-body pictures of the same people; the fifth attached image is an "
    "earlier drawing of the same three in this pose and this printed style, follow its drawing hand): LEFT: the first attached person "
    "(Watanabe Sho, 17, a high-school boy in a black stand-up-collar gakuran with round buttons, a shoulder bag strap across his chest), "
    "half a step BEHIND, his right shoulder partly hidden behind the middle woman's left shoulder. MIDDLE, in FRONT: the second "
    "attached person (Tanaka Misaki, 24, an office worker in a light trench coat over a dark top). RIGHT: the third attached person "
    "(Yamamoto Sakura, 20, a university student in a long pale coat, headphones resting round her neck, a backpack strap), half a step "
    "BEHIND, her left shoulder partly hidden behind the middle woman's right shoulder, the right side of her body complete.",
    TRIO_DESIGN,
    "Each of the three holds their OWN name card on a teal lanyard in front of their chest with both hands and looks down at it. The "
    "three cards are EXACTLY where the grey guide draws the three grey rectangles: their top edges on ONE horizontal line. "
    + BLANK_CARD.replace("The lanyard's", "Each lanyard's"),
    GRIP + " Each person holds it a little differently: the boy on the left has his elbows out; the woman in the middle holds both "
    "lower corners neatly and symmetrically; the student on the right pinches the lower left corner with two fingertips. Hands simple "
    "and correctly drawn, adult size.",
    TOWN_HAND, ALPHA])

R_ROW2 = "\n".join([
    ID_NAME,
    "One illustration for a film shot: she stands facing the viewer, seen from the front at chest height with a long lens (no high or "
    "low angle, no perspective). Landscape canvas 3:2. Lay it out EXACTLY as the attached grey guide (the second attached image): the "
    "solid light grey line near the top is her SHOULDER LINE (the tops of both shoulders touch it); the dashed line just below it is "
    "the film frame's top edge (draw her complete above it, the film crops her); the grey rectangle is her card. Above the shoulder "
    "line only her neck, shirt collar and the ends of her blonde bob, cut by the canvas top edge (NO chin, NO mouth, NO face). The "
    "canvas bottom edge cuts across her pleated skirt below the hips. She is centred, both shoulders and both arms complete, empty "
    "transparent space on both sides.",
    "Her build: a slim 14-year-old girl, 152 cm: her body, arms included, about 1.9 times as wide as her card, narrower than an adult. "
    "The third attached image is an earlier drawing of her in this pose: the same clothes, hands and drawing hand, only the framing "
    "and her width change.",
    "She holds her own name card on the teal lanyard in front of her chest with both hands and looks down at it. The card is exactly "
    "where the grey guide draws the grey rectangle. " + BLANK_CARD,
    GRIP + " Both hands symmetrical and neat, small and slim, the same hands as on the turnaround.",
    "Visible clothes: the white shirt collar and the teal ribbon tie, the charcoal school blazer with its dark emblem on the left "
    "pocket, white shirt cuffs, the top of the charcoal pleated skirt.",
    DRAW, SHEET_RULE, DAY, HANDS, NEVER, ALPHA])

PROMPTS = {'h11_rub': H_RUB, 'r11_id_a': R_ID_A, 'r11_id_b': R_ID_B, 'p11_trio2': P_TRIO2, 'r11_row2': R_ROW2}
for n, t in PROMPTS.items():
    open(os.path.join(here, n + '.txt'), 'w', encoding='utf-8').write(t)

ROUND1 = [f'-h11_rub:{HW}+{TURN}+{HANDS_REF}', f'-r11_id_a:{TURN}+{G_ID}+{CB}+{FACES}+{HANDS_REF}',
          f'-p11_trio2:{P_B}+{P_A}+{P_C}+{G_TRIO}+{TRIO1}', f'-r11_row2:{TURN}+{G_ROW}+{ROW1}+{HANDS_REF}']
ROUND2 = ['-r11_id_b:out/r11_id_a.png+' + TURN + '+' + FACES]
print('round 1:', ' '.join(f'"{a}"' for a in ROUND1))
print('round 2:', ' '.join(f'"{a}"' for a in ROUND2))

# round 1b: r11_id_a came back looking at the viewer (irises centred under half-lowered lids); redraw it with that one change
R_ID_A2 = variant(
    "where she looks. She looks DOWN at the card she holds, not at the viewer: her head bows forward a little (the chin a little "
    "lower and the bow tipped a little towards us, the face still seen from the front), and in both eyes the irises move DOWN to "
    "the lower lids, the upper lids lowered over them so the eyes read clearly as looking down at the card. Calm, no expression, "
    "mouth closed. The card, hands, lanyard, clothes, hair, bow and the framing stay exactly as they are.")
open(os.path.join(here, 'r11_id_a2.txt'), 'w', encoding='utf-8').write(R_ID_A2)

# round 2: r11_row2 came back as wide as 2.5 cards (the adults of p11_trio2 are 1.65 cards wide): she would look half as wide
# again as the grown woman next to her. Redraw it narrower, the card the same size.
R_ROW3 = variant(
    "her WIDTH. She is a slim 14-year-old girl and must be clearly NARROWER than the grown-up woman in the middle of the second "
    "attached image (who stands next to her in the film at the same scale, her card the same size as this card): redraw her body "
    "about 25% narrower around the same card: narrower shoulders, the blazer closer round her, the upper arms close to her sides, "
    "the elbows tucked in, so her whole body, arms included, is about 1.5 times as wide as the card. The card keeps exactly its size "
    "and shape and stays in the middle; hold it a little HIGHER on her chest, its top edge just under the ends of the ribbon tie. The "
    "same clothes, colours, hands, grip, lanyard, bow tie and drawing hand; the top edge still cuts below her chin (no chin, no "
    "mouth), the bottom edge across the skirt.")
open(os.path.join(here, 'r11_row3.txt'), 'w', encoding='utf-8').write(R_ROW3)

# round 3: r11_row3 holds the card so high that, with its top edge on the line of the others' cards, her chin comes into the
# frame. Redraw it with the card and hands lower on her chest (the others hold theirs about 9 cm under the shoulder line).
R_ROW4 = variant(
    "where she holds the card: move the card and both hands DOWN by about one tenth of the canvas height, so the card's top edge is "
    "about 9 cm below her shoulder line (level with the top of the emblem on her left pocket is too high; just below the emblem is "
    "right), the lanyard a little longer down to the clip. The card keeps exactly its size and shape; the hands keep the same grip "
    "and size. Her body, width, shoulders, blazer, collar, ribbon tie, hair ends, the framing (the top edge cutting below her chin) "
    "and the drawing hand stay exactly as they are.")
open(os.path.join(here, 'r11_row4.txt'), 'w', encoding='utf-8').write(R_ROW4)

# round 4: the roster. 09 (web/scenes/segments/seg_09.js OWNERS) printed the owners of cards A, B, C on their fronts:
# A 鈴木 恵子 (h01), B 吉田 蓮 (p09), C 渡辺 翔 (p05), left to right B, A, C. p11_trio2 drew other people of the town;
# redraw it with 09's three, the same layout, card positions and printed hand.
P_H01 = '../canon/town/h01_suzuki_keiko_career.png'
P_P09 = '../canon/town/p09_yoshida_ren_hoodie.png'
P_TRIO3 = "\n".join([
    "Redraw the first attached image with the SAME layout: the same canvas framing (the top edge cutting just under the chins, the "
    "bottom edge across the thighs), the same three blank cards at exactly the same places and sizes, held the same way, the same "
    "printed drawing hand (teal line art and round teal screentone dots on paper white, no other colours). Only the three PEOPLE "
    "change, to these three people of the town (match their clothes and builds to their attached full-body pictures):",
    "LEFT, half a step behind: the second attached person (Yoshida Ren, 22, very tall and very thin, a big loose hooded sweatshirt "
    "with the hood down on his back, sleepy); he is much taller than the other two, so the canvas top edge cuts across his chest "
    "(his shoulders and neck are above the canvas), and he holds his card lower on his body, arms hanging a little, so his card stays "
    "exactly where the first image has the left card. MIDDLE, in front: the third attached person (Suzuki Keiko, 38, a career woman: "
    "short hair (only its ends may show at the top edge), a fitted dark suit jacket over a light blouse, strict and tidy), her card "
    "held neatly by both lower corners. RIGHT, half a step behind: the fourth attached person (Watanabe Sho, 17, a high-school boy "
    "in a black stand-up-collar gakuran with round buttons, a shoulder bag strap across his chest), his left shoulder partly hidden "
    "behind the woman's right shoulder, the right side of his body complete.",
    "Above the people's shoulders only the bottom of necks and collars, cut by the canvas top edge: NO chin, NO mouth, NO face. "
    "Each holds their own card on a teal lanyard and looks down at it; the backs of the cards face us and stay completely blank "
    "plain paper white with a thin grey outline. Hands simple and correct, adult size. Fully TRANSPARENT background (PNG alpha) "
    "outside the people. No text, no logos, no red anywhere."])
open(os.path.join(here, 'p11_trio3.txt'), 'w', encoding='utf-8').write(P_TRIO3)

# round 5: the in-between of the grip change (k331.5-k332): the swap from h11_write to h11_rub turns the pencil a quarter round
# in one frame. Drawn from both keys.
H_TURN = "\n".join([
    "Draw the in-between of two drawings of the same hand: the first attached image (her right hand writing with a short green "
    "pencil, seen from straight above) and the second attached image (the same hand, the pencil now held between index and middle "
    "finger pointing up to the right, the thumb stretched out to the upper left). This drawing is exactly HALFWAY between them, "
    "every part of it between the two: the pencil turned halfway, pointing straight UP the canvas, held loosely between the thumb "
    "and the index and middle fingers as it slides into the fingers; the thumb halfway out, pointing up and a little left; the "
    "other fingers halfway between their two positions. The wrist, the white cuff, the charcoal sleeve, the size of the hand and "
    "its place in the canvas stay EXACTLY as in both drawings (they are the same in both). The same drawing hand: clean dark-grey "
    "outline, flat skin colour with one hard-edged shadow tone. The pencil keeps its length, its sharpened point and its flat "
    "green end with no eraser.",
    "Her hand is a 14-year-old girl's: small and slim, the same hand as both drawings. Fully TRANSPARENT background (PNG alpha) "
    "outside the hand, sleeve and pencil: no paper, no shadow, no glow or halo. No text, no logos, no red anywhere."])
open(os.path.join(here, 'h11_turn.txt'), 'w', encoding='utf-8').write(H_TURN)

# round 6: against p11_trio3 (09's three), r11_row4 is still wider than the grown woman next to her and stops too high: with her
# card as large as the others' and on their line, the bottom of her drawing ends above the frame's bottom edge. Redraw her as
# a fourth person of that row: the second attached image is the layout.
R_ROW5 = "\n".join([
    ID_NAME,
    "Redraw the girl of the first attached image (the same clothes, hands, grip, lanyard, ribbon tie, colours and drawing hand) as a "
    "FOURTH person standing in the row of the second attached image, drawn on her own canvas with exactly that image's framing and "
    "scale: landscape canvas 3:2; her card EXACTLY the size of the middle woman's card and at EXACTLY the same height in the canvas "
    "(its top edge about one third down from the canvas top); the canvas top edge cuts just under her chin (NO chin, NO mouth, NO "
    "face: only the shirt collar and the ends of her blonde bob at the top edge); the canvas bottom edge cuts across her thighs, "
    "through her pleated skirt, so the skirt runs out of the bottom edge. She is centred in the canvas, both shoulders and arms "
    "complete, transparent space on both sides.",
    "Her build: a slim 14-year-old girl, 152 cm: her body, arms included, NARROWER than the middle woman of the second image (about "
    "1.35 times as wide as her card), her shoulders a little lower than the woman's. " + BLANK_CARD,
    GRIP + " Both hands symmetrical and neat, small and slim, the same hands as on the turnaround.",
    DRAW, SHEET_RULE, DAY, HANDS, NEVER, ALPHA])
open(os.path.join(here, 'r11_row5.txt'), 'w', encoding='utf-8').write(R_ROW5)

# round 7: r11_row5 has the right build but, set at the others' card size, its bottom edge stops ~130 px above the frame's bottom.
# The same drawing, zoomed out about its top centre so more of her shows below.
R_ROW6 = variant(
    "the framing only: zoom OUT. Redraw the same girl, same pose and same everything, uniformly SMALLER: 85% of her present size, "
    "scaled about the middle of the canvas's TOP edge, so the top edge still cuts just under her chin exactly as now and she stays "
    "centred; the space this frees at the bottom shows more of her: her charcoal pleated skirt continues down to just above her "
    "knees, cut by the bottom edge. Nothing else changes: the same card (blank paper white, held the same way), hands, lanyard, "
    "ribbon tie, blazer and drawing hand.")
open(os.path.join(here, 'r11_row6.txt'), 'w', encoding='utf-8').write(R_ROW6)

# round 8: r11_row6 came back only 94% of r11_row5's size; zoom out further
R_ROW7 = variant(
    "the framing only: zoom OUT clearly. Redraw the same girl, same pose and same everything, uniformly MUCH SMALLER: 75% of her "
    "present size (the card about three quarters as wide as now), scaled about the middle of the canvas's TOP edge, so the top "
    "edge still cuts just under her chin and she stays centred; the freed space at the bottom shows her pleated skirt down to its "
    "hem and the tops of her knees, cut by the bottom edge; more transparent space on both sides. Nothing else changes: the same "
    "card (blank paper white, held the same way), hands, lanyard, ribbon tie, blazer and drawing hand.")
open(os.path.join(here, 'r11_row7.txt'), 'w', encoding='utf-8').write(R_ROW7)
