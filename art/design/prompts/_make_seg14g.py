"""Segment 14 (最终副歌) drawings for the fixes after the independent review of 2026-11-21 (docs/分镜/14_最终副歌.md 第 10 节).

  - R14f_throw2 / R14f_throw2b  the throw redrawn with a real follow-through (must 2): shoulder and torso driven after the arm,
                                the wrist snapped through, hair, bow loops and blazer swinging with the motion, a face at least as
                                strong as R14f_yank's. Two versions of the arm (chin height / chest height); the better one is used.
  - R14f_askL3                  (master R14f_down2, one change) her right hand reaches out at chest height and takes hold of the
                                sleeve of 吉田 蓮 standing in the next lane (must 3): the fingertips at the point measured on the
                                medium shot (x -0.60 m, 1.15 m high), above the gate cabinet's reader.
  - t14_p1cu / t14_p3cu         佐藤 健太 and 高橋 正男 redrawn crisp at about 13.5 and 17 px/cm from ENLARGED crops of their 01
                                drawings (exactly the same pose, size and place), for the new close two-shot S2 (must 1: the
                                stamp readable on a phone), shown at 0.96x and 0.76x.
usage: python art/design/prompts/_make_seg14g.py   -> writes the boards and the prompts, prints the make_jobs line
"""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import variant
import _make_seg14f as F
from _make_seg15 import TOWN_HAND, TTAIL

BOARD = os.path.join(here, '..', 'board', 'seg14')
CUT = os.path.join(here, '..', '..', 'cut')


def board_from(src, cx, H, top, x0, x1, h0, h1, out):
    """Crop the world box [x0, x1] x [h0, h1] (metres, x about the body's centre column cx) out of a town drawing and enlarge it
    to a 1024 x 1536 canvas: the 'enlarged blurry copy' Codex redraws crisp in the same place."""
    from PIL import Image
    im = Image.open(os.path.join(CUT, src)).convert('RGBA')
    mpp = (H - 25) / (1536 - top) / 100
    box = (cx + x0 / mpp, 1536 - (h1 - 0.25) / mpp, cx + x1 / mpp, 1536 - (h0 - 0.25) / mpp)
    big = im.transform((1024, 1536), Image.Transform.EXTENT, box, Image.Resampling.BICUBIC)
    big.save(os.path.join(BOARD, out))
    return box


# 佐藤: x ±0.38 m about his centre, 0.70-1.84 m (13.5 px/cm); 高橋: x ±0.30 m, 0.82-1.72 m (17.1 px/cm)
SATO_BOX = dict(x0=-0.38, x1=0.38, h0=0.70, h1=1.84)
TAKA_BOX = dict(x0=-0.30, x1=0.30, h0=0.82, h1=1.72)

UP_TOWN = ("The first attached image is an ENLARGED, blurry low-resolution copy of a finished drawing of this person. Redraw it as a "
           "crisp, clean drawing at full resolution: EXACTLY the same framing, size and position in the canvas (do not move, shrink or "
           "enlarge him: every part of him stays where it is in the first image: the top of the head, the shoulders, the arms, the "
           "lanyard's two strands and where they stop, the cut of the bottom edge), the same pose, the same bowed head and the same "
           "face and expression, the same clothes. The second attached image is his design sheet: keep the face, age and hair true to "
           "it. Every line clean, sharp and even at this size, as if drawn for this size; the screentone dots clean and round; nothing "
           "blurry, nothing soft. Nothing is added: no card, no clip, no holder on the lanyard (the film adds them).")
P1CU = "\n".join([UP_TOWN,
                  "He is 佐藤 健太, a tired salaryman of about 50: a broad, slightly heavy face with soft jowls, lines under the eyes, "
                  "short dark hair combed to the side with a receding hairline and grey temples; dark suit and tie. His head is bowed, "
                  "his tired eyes look down at the middle of his own chest. The third attached image is a larger drawing of the same "
                  "man for the face's detail only (its framing and its briefcase do not apply).",
                  TOWN_HAND, TTAIL])
P3CU = "\n".join([UP_TOWN,
                  "He is 高橋 正男, an old man of about 78 with white hair and round glasses, a cardigan over a shirt; his head is "
                  "bowed, his eyes look down at the middle of his own chest, his hands folded in front of him.",
                  TOWN_HAND, TTAIL])

# the throw (must 2): a variant of the master in the throw's wider canvas (R14f_down_wide), with R14f_yank for the face's force
THROW_BODY = (
    "she has just FLUNG her name card at the viewer with all her strength: this is the instant just AFTER it left her hand, the "
    "follow-through of a hard throw. {arm} The whole body follows the arm: her right shoulder is driven forward and towards the "
    "viewer's left, her upper body twisted and leaning that way into the throw (the left shoulder pulled back), the head going with "
    "it. The motion shows everywhere: her short hair swings and flies out towards the viewer's left, the two loops of the big bow "
    "bend with the swing, the open front and hem of her blazer swing out to the viewer's left, the guitar on her back swings a "
    "little. Her LEFT arm swings back and down behind her hip for balance. Her face is furious and fierce, at least as strong as the "
    "clenched-teeth anger of the second attached image: eyebrows slammed down and together, eyes wide and blazing, mouth wide open in "
    "a shout with the upper teeth showing; she looks after the card, towards the viewer's left and a little forward, just past the "
    "viewer (NOT into the camera). The card and the lanyard are GONE from her: nothing round her neck except her collar and tie. "
    "The hand is EMPTY (the card is not in the picture). " + F.ARM + " The arm, the hand and every part of her stay inside the canvas "
    "with a clear margin.")
ARM_A = ("Her RIGHT arm (on the viewer's LEFT) has whipped out to the viewer's LEFT and a little forward and is fully extended, rising "
         "a little from the shoulder so the hand is about level with her chin; the wrist has snapped through: the open hand is bent "
         "forward and down at the wrist, palm facing down and towards the viewer, fingers spread and trailing.")
ARM_B = ("Her RIGHT arm (on the viewer's LEFT) has swung forward and out to the viewer's LEFT at chest height and is fully extended; "
         "the wrist has snapped through: the open hand is bent forward at the wrist, palm towards the viewer, fingers spread wide, "
         "as if it just let go.")
THROW_A = variant(THROW_BODY.format(arm=ARM_A))
THROW_B = variant(THROW_BODY.format(arm=ARM_B))

ASKL3 = variant(
    "she turns her head about 45 degrees to the viewer's LEFT (her right), towards the tall young man in a hoodie standing in the next "
    "lane, eyebrows raised, lips parted as if about to ask him something; her eyes look to the viewer's left at her own eye level (NOT "
    "at the viewer). Her RIGHT arm (on the viewer's LEFT) reaches out sideways to the viewer's left at the height of her CHEST, the "
    "elbow only slightly bent, and her hand takes hold of his sleeve: the hand is at the far left of the canvas, the FINGERTIPS at about "
    "15% of the canvas width from the LEFT edge and 70% of the canvas height from the TOP edge, the fingers curled lightly as if "
    "pinching a fold of cloth, palm towards the viewer's left, the back of the hand towards the viewer (the sleeve itself is not "
    "drawn: he is added by the film). Her left arm, the card, the lanyard and the guitar do not move. " + F.ARM)

PROMPTS = {'R14f_throw2': THROW_A, 'R14f_throw2b': THROW_B, 'R14f_askL3': ASKL3, 't14_p1cu': P1CU, 't14_p3cu': P3CU}

if __name__ == '__main__':
    os.makedirs(BOARD, exist_ok=True)
    print('sato box', board_from('t01_p1c.png', 510, 172, 243, out='t14_p1cu_up.png', **SATO_BOX))
    print('takahashi box', board_from('t01_p3.png', 512, 160, 378, out='t14_p3cu_up.png', **TAKA_BOX))
    for k, v in PROMPTS.items():
        open(os.path.join(here, k + '.txt'), 'w', encoding='utf-8').write(v)
    YANK = '../cut/R14f_yank.png'
    args = [f'-R14f_throw2:{F.WIDE}+{YANK}+{F.TURN}+{F.HANDS_REF}', f'-R14f_throw2b:{F.WIDE}+{YANK}+{F.TURN}+{F.HANDS_REF}',
            f'-R14f_askL3:{F.o("R14f_down2")}+{F.TURN}+{F.HANDS_REF}',
            '-t14_p1cu:../design/board/seg14/t14_p1cu_up.png+../canon/town/p01_sato_kenta_salaryman.png+../cut/t15_p1h2.png',
            '-t14_p3cu:../design/board/seg14/t14_p3cu_up.png+../canon/town/p03_takahashi_masao_elder_cane.png']
    print('python tools/make_jobs.py seg14_g1 ' + ' '.join(f'"{a}"' for a in args))
