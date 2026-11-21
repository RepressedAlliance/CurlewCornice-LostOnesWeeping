"""Segment 13 (C), round h: the independent review of the full cut (2026-11-21) asked for
  MUST 2  the face lit from the side the lamp is on. The desk shot has the lamp at the upper left of HER desk (her left), so
          across the desk it stands on the viewer's RIGHT; r13f_face came back lit from the viewer's LEFT (the f prompt asked for
          the right). r13h_face: r13f_face redrawn, only the light turned round (it also takes the straight light/shadow seam
          down the middle of the face away: the shadow follows the face's form). r13h_face_up: r13h_face, only the eyes
          (r13f_face_up shows the eyes).
  MUST 3  the hand pressing the folded essay must look like it presses (it read as a relaxed flat hand). h13h_slap:
          h13g_slap redrawn, only the pressure.
  MUST 4  the essay must be a six-year-old's pencil handwriting (it was a textbook font). p13h_essay: the handwriting on the
          film's own square grid (the guide fixes which character goes in which cell); the page strips the teal grid and keeps
          the graphite.
usage: python art/design/prompts/_make_seg13h.py   -> writes prompts and the guide, prints make_jobs arguments per round
"""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import variant
from _make_seg13 import TURN, HANDS_REF

ROOT = os.path.abspath(os.path.join(here, '..', '..', '..'))
G_ESSAY = 'board/guide_p13h_essay.png'

# the essay in the film's grid: columns from the right, (row0, text); '。' after す is hung in す's cell (ぶら下げ)
# canon text (art/canon/essay_shourai_no_yume.png, docs/設定包): two paragraphs, each indented one cell
COLS = [(3, 'しょうらいのゆめ'), (5, 'かがみね　りん'), (1, '　わたしは、おおきくなっ'), (1, 'たら、ギターをひくひとに'),
        (1, 'なりたいです。'), (1, '　ギターをひくと、みんな'), (1, 'がわらってくれるからです。')]
NCOL, NROW, CS, GX0, GY0 = 7, 12, 120, 92, 48
SMALL = 'ゃゅょっャュョッぁぃぅぇぉ'


def guide_essay():
    from PIL import Image, ImageDraw, ImageFont
    teal, grey = (33, 142, 163), (165, 165, 165)
    b = Image.new('RGB', (1024, 1536), (255, 255, 255)); d = ImageDraw.Draw(b)
    for i in range(NCOL + 1): d.line([(GX0 + i * CS, GY0), (GX0 + i * CS, GY0 + NROW * CS)], fill=teal, width=3)
    for j in range(NROW + 1): d.line([(GX0, GY0 + j * CS), (GX0 + NCOL * CS, GY0 + j * CS)], fill=teal, width=3)
    F = ImageFont.truetype(os.path.join(ROOT, 'assets', 'fonts', 'kleeone_KleeOne-SemiBold.ttf'), 92)
    Fs = ImageFont.truetype(os.path.join(ROOT, 'assets', 'fonts', 'kleeone_KleeOne-SemiBold.ttf'), 68)
    for c, (row0, text) in enumerate(COLS, 1):
        cx = GX0 + NCOL * CS - (c - 0.5) * CS
        row = row0
        for ch in text:
            cy = GY0 + (row - 0.5) * CS
            if ch == '。' and text.endswith('す。') and row > NROW:      # hung in the last cell with す
                d.text((cx + 44, GY0 + (NROW - 0.5) * CS + 22), ch, font=Fs, fill=grey, anchor='mm'); continue
            if ch == '　': row += 1; continue
            if ch == 'ー':
                t = Image.new('L', (130, 130), 0); ImageDraw.Draw(t).text((65, 65), ch, font=F, fill=255, anchor='mm')
                t = t.rotate(90); b.paste(Image.new('RGB', t.size, grey), (int(cx - 65), int(cy - 65)), t)
            elif ch in '、。':
                d.text((cx + 44, cy - 44), ch, font=F, fill=grey, anchor='mm')
            elif ch in SMALL:
                d.text((cx + 14, cy - 8), ch, font=Fs, fill=grey, anchor='mm')
            else:
                d.text((cx, cy), ch, font=F, fill=grey, anchor='mm')
            row += 1
    b.save(os.path.join(here, '..', G_ESSAY))


R_FACE = variant(
    "only the LIGHT DIRECTION. The desk lamp is on the viewer's RIGHT (out of the picture, at the height of her chest), so the "
    "viewer's-RIGHT side of her face, hair, neck, blazer and hand is the LIT side (her normal colours in plain neutral white "
    "light) and the viewer's-LEFT side is in the one hard-edged shadow tone: the light and shadow are the other way round from "
    "the first attached image. The shadow shape follows the form of the face like a professional anime cel shadow (under the "
    "fringe, along the far cheek and jaw, under the chin): NOT a straight vertical line down the middle of the face and nose. "
    "The bow and the hairclips keep their places (the three hairclips stay on the bangs on the viewer's LEFT, the image is NOT "
    "mirrored). Her pose, face, eyes looking down, wet lower lids, mouth, hair shapes, clothes, the hand and the eraser on the "
    "desk stay exactly as they are, line for line; only which side is lit changes. No glow or halo round her.")
R_FACE_UP = variant(
    "only the eyes and brows, as in the second attached image (the same girl with her eyes already raised: copy her eyes, not "
    "her light): she raises her eyes and looks straight INTO THE CAMERA. The upper eyelids lift to their normal open position, "
    "the teal irises move to the centre of the eyes, fully visible; the brows relax a tiny bit more (not raised, not frowning). "
    "The eyes stay exactly as wet (the thin glossy line along the lower lids), no tear falls. The look is calm and steady, not "
    "cold, not angry, not crying. The light stays exactly as in the first attached image (lit from the viewer's right); the "
    "head, mouth, hand, eraser, hair, clothes stay exactly the same, line for line. No glow or halo round her.")
H_SLAP = variant(
    "only the PRESSURE of the hand: it has just slapped a small folded square of paper flat onto the desk and now presses it "
    "down HARD and holds it, tense: the fingers spread a little apart and press flat, the fingertips bent slightly at the last "
    "joint and pushing into the paper (their tips a little paler from the pressure), the base of the palm pressed down, the "
    "wrist lowered and stiff, the thumb pressed along the side. Still exactly her small slim girl's hand (no knuckle lines, no "
    "veins, no tendons). The forearm, the cuff with its two buttons, the white shirt cuff, the hand's SIZE and position stay "
    "exactly as they are. Keep the background fully transparent with a hard clean edge round the hand: no glow, no halo.")
P_ESSAY = "\n".join([
    "The first attached image is a LAYOUT GUIDE: a Japanese genkou-youshi sheet with a teal square grid of 7 columns by 12 rows "
    "and, in light grey, the exact character that goes in each cell (vertical writing, columns read top to bottom, right to "
    "left). Redraw this sheet with the SAME teal grid, exactly where it is and the same size (do not move, add or remove any "
    "grid line), and write every grey guide character again, in exactly the same cell, by hand: this is an essay written by "
    "a SIX-YEAR-OLD Japanese first-grader in HB PENCIL. Replace the grey guide characters completely with the pencil writing; "
    "leave the empty cells empty.",
    "The handwriting: a real six-year-old's careful, LARGE, upright hiragana and katakana, one character per cell, each filling "
    "about 70-80% of its cell, small kana (ょ っ) small at the upper right of their cell, the punctuation 、 。 at the upper "
    "right of their cell, the long vowel mark ー written VERTICALLY. Dark graphite, pressed hard: strokes of slightly uneven "
    "thickness and darkness, slightly wobbly lines, characters a little different in size and very slightly tilted, some "
    "stroke ends a bit too long, the way a child who is trying very hard writes - neat and easy to read, but clearly a child's "
    "hand, NOT a font, NOT calligraphy, NOT an adult's writing, NOT messy. The second attached image is the finished essay "
    "(the same text) for reference of how the page reads; its writing is too even - make it a real child's hand.",
    "Plain pure WHITE paper (#ffffff), flat, seen straight on: no fold lines, no stamps, no drawings, no shadow, no paper "
    "texture, no frame, no title, nothing but the teal grid and the grey pencil writing. Portrait canvas 2:3 exactly like the "
    "guide. No red anywhere."])

PROMPTS = {'r13h_face': R_FACE, 'r13h_face_up': R_FACE_UP, 'h13h_slap': H_SLAP, 'p13h_essay': P_ESSAY}

if __name__ == '__main__':
    guide_essay()
    for n, t in PROMPTS.items():
        open(os.path.join(here, n + '.txt'), 'w', encoding='utf-8').write(t)
    R1 = ['-r13h_face:out/r13f_face.png', f'-p13h_essay:{G_ESSAY}+../canon/essay_shourai_no_yume.png',
          f'-h13h_slap:out/h13g_slap.png+{HANDS_REF}']
    R2 = ['-r13h_face_up:out/r13h_face.png+out/r13f_face_up.png']
    for i, R in enumerate((R1, R2), 1):
        print(f'round {i}:', ' '.join(f'"{a}"' for a in R))
