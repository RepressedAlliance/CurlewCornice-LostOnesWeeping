"""Segment 04, round 8: S2 rebuilt after the independent review of the finished segment (2026-11-21: "S2 掉档，要重新设计").

The old S2 was one still, centred, symmetrical knee-up figure on a sheet of ruled paper (face 14% of the frame), with a pasted card
and an offset drop shadow. The new design (docs/分镜/04_A1.md 第 4 稿) has two shots:
  S2 k92-k100  a close medium shot (waist up, face about 27% of the frame), her on the right of the frame, the black flooding the
               paper behind her; her words left white in the black.
      s04a_zip   (master)  reaching up behind her right shoulder to the bag's zip, eyes down and to the side, cold
      s04a_half  (s04a_zip, one change: the guitar drawn far out over the shoulder like a sword, the gold top out of the bag)
  S3 k100-k104 a cut on the action to a knee-up shot: the guitar hangs from her right fist like a weapon, her eyes on it.
      s04c_hang  (master of S3)
The card on her chest is DRAWN, blank white (the page prints its face on it with multiply, following the drawn card's corners):
no pasted card, no drop shadow.
Written without _style.txt (jobs listed with a leading '-'): that file asks for a white background.
usage: python art/design/prompts/_make_seg04_r8.py [a|b]   -> writes the .txt prompts and prints the make_jobs arguments
"""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import IDENTITY, DRAW, SHEET_RULE, LARGE, HANDS, NEVER

TURN = '../canon/rin_turnaround.png'
BAG = '../canon/gigbag_front_back_side_open.png'
GUITAR = '../canon/lespaul_goldtop_front_side_back.png'
HANDS_REF = '../ref/sheet_hands.png'
FACES_REF = '../ref/sheet_faces.png'
COLD_FACE = 'board/seg04_cold_face.png'
OLD_ZIP = '../cut/r04c_zip.png'
OLD_HALF = '../cut/r04c_half.png'

LIGHT = "Lighting: plain even daylight, the flat colours of the turnaround, one hard-edged shadow tone per material."
ALPHA = ("Fully TRANSPARENT background (PNG alpha) everywhere outside her, the bag and the guitar: no floor, no shadow, no frame, "
         "no scenery, no paper, no outline glow. Every part of her, the bag and the guitar fully opaque. No text, no logos. No red anywhere.")
CARD = ("Her name card: a thin teal lanyard round her neck, its two strands meet at one small silver clip in the middle of her chest; "
        "from the clip hangs her name card in a clear plastic holder: a HORIZONTAL card (3:2, about 9 cm wide), hanging straight and "
        "flat, its face turned to the viewer, upright, not tilted. The card's face is COMPLETELY BLANK plain white: no text, no grid, no "
        "lines, no circles, no marks of any kind (the film prints on it later). Nothing covers any part of the card: not the bag's strap, "
        "not her arms, not her hair.")
COLD2 = ("Her eyes (important): COLD, not sleepy. The upper eyelid of each eye is a STRAIGHT, nearly horizontal hard line (not a "
         "curved arc, not a drooping half-closed lid), pressed down so it cuts off the top quarter of the iris; the iris below is fully "
         "drawn, teal, with a clear dark pupil and one small sharp highlight, the gaze FOCUSED on one point; the lower lid a short straight "
         "line. The eye shape of the face in the attached close-up (the flat, sharp lid line), but her brows stay LEVEL and calm, not "
         "frowning, not angry. The mouth a small closed straight line. The look reads as cold and quietly dangerous, never bored, sleepy, "
         "sad, sulky or angry.")
GUITAR_TXT = (
    "The guitar is exactly the Les Paul of the attached guitar sheet: gold top with cream binding, two cream P-90 pickups, cream "
    "pickguard, a bar bridge, four gold knobs, black headstock with NO logo and 3+3 tuners with cream buttons, rosewood fingerboard with "
    "cream trapezoid inlays; its back, sides and the back of the neck dark brown, nearly pencil black. REAL proportions (important): "
    "99 cm long, about two thirds of her height; the body 44 cm long and 33 cm wide; the neck from the body to the headstock about 40 cm, "
    "nearly as long as the body (a full-size guitar, never a short toy neck).")
ID = IDENTITY.replace("a teal lanyard with her white name card in a clear holder", "a thin teal lanyard with her name card (see below)")

ZIP = "\n".join([
    ID,
    "Framing (important): SQUARE canvas, a CLOSE MEDIUM SHOT: from the top of her bow down to her hips; the bottom edge of the canvas "
    "cuts straight across her at the hips, just below the hem of the blazer (her body reaches the bottom edge). She is BIG: her head "
    "from chin to the top of the hair is about 27% of the canvas height; the top of the bow about 3% below the top edge. Her body is "
    "on the RIGHT of the canvas: the centre line of her body at about 63% of the canvas width from the left edge; the left part of the "
    "canvas holds her raised right arm and the bag. Camera exactly at her eye height, straight on, long lens: no high or low angle, the "
    "shoulders level, her body facing the viewer. The second attached image shows this same action from further away: take the pose, "
    "the bag and the clothes from it, but frame her much closer, as described here.",
    "The black soft guitar gig bag of the attached bag sheet hangs on her back from her RIGHT shoulder (her right is the viewer's LEFT) by "
    "one shoulder strap: the strap runs over her right shoulder and down across her chest on the viewer's left side, clear of the card. "
    "The bag's narrow neck end rises diagonally up from behind her right shoulder to the viewer's left; its rounded top end is above the "
    "height of the top of her head, clearly to the viewer's left of the bow (it does not touch the bow), fully inside the canvas. The "
    "zip runs along the edge of the bag's neck end; the top 15 cm are already pulled open, a dark gap with the grey lining.",
    "Her RIGHT arm (viewer's LEFT) reaches high up behind her shoulder: the elbow raised beside her head, the forearm going up and back, "
    "her hand ON THE BAG near its top end, above her head height and well away from her hair (a clear gap), thumb and index finger "
    "pinching a LARGE silver zip pull with a black fabric tab, the other fingers gripping the bag's edge. It reads at a glance as "
    "reaching behind her to draw something out of the bag, never as touching her hair. Her left arm hangs down relaxed, cut by the "
    "bottom edge.",
    "Her head upright, turned very slightly toward the viewer's left. Her eyes look down and to the viewer's left, past the viewer, NOT "
    "at the viewer and not at her hand: she does it without looking. " + COLD2,
    CARD, DRAW, SHEET_RULE, LIGHT, LARGE, HANDS, NEVER, ALPHA])

KEEP = ("Redraw the first attached image exactly: the same figure, face, hair, bow, clothes, the strap across her chest with its "
        "buckle, the teal lanyard, the clip and the blank white card, the same framing, size and position in the canvas, the same line "
        "work, colours and lighting, keep the fully TRANSPARENT background (PNG alpha). ")
END = (" Everything else stays exactly as in the first attached image, line for line; the card stays blank white and nothing covers it.")

HALF = KEEP + (
    "Change only her RIGHT arm (viewer's LEFT), the bag's top and the guitar: the zip is now pulled wide open and her right fist GRIPS "
    "the guitar's neck and has drawn the guitar FAR out of the bag over her right shoulder, like a sword drawn from a scabbard on her "
    "back: the dark neck rises from the bag's open mouth behind her right shoulder DIAGONALLY up to the viewer's left (about 35 degrees "
    "from vertical), her fist round the neck above her shoulder; the black headstock (3+3 cream tuner buttons, no logo) goes out of the "
    "picture through the TOP edge of the canvas (it may be cut off ONLY by the top edge; nothing is cut off by the left edge). Out of "
    "the bag's wide open mouth, beside her shoulder and her face on the viewer's left, the UPPER HALF of the guitar's body has come "
    "out: a LARGE solid patch of the GOLD top with its cream binding, the cutaway horn and the cream neck pickup, about as big as her "
    "head, clearly visible outside her silhouette next to her raised arm. This gold is the only warm colour in the picture and must "
    "read instantly even very small. Her face and eyes stay exactly as in the first attached image. " + GUITAR_TXT + END)

HANG = "\n".join([
    ID,
    "Framing (important): PORTRAIT canvas 2:3: from the top of her bow down to just below her knees; the bottom edge of the canvas cuts "
    "straight across her shins just below the knees (no feet). She fills the height: the top of the bow about 3% below the top edge. Her "
    "body's centre line at about 58% of the canvas width from the left (room on the viewer's left for the guitar). Camera exactly at her "
    "eye height, straight on, long lens: no high or low angle, shoulders level, her body facing the viewer. Her face, hair and clothes "
    "exactly as in the second attached image (the same girl a moment before; take nothing else from it: the card is as described below).",
    "The guitar is completely out of the bag. The now EMPTY black gig bag hangs limp and flat behind her right shoulder (viewer's left), "
    "no higher than her shoulder line, its strap across her chest on the viewer's left side, clear of the card.",
    "She holds the guitar LIKE A WEAPON: her RIGHT arm (viewer's LEFT) hangs down along her side, straight and TENSE, the shoulder "
    "pulled down by the weight; the fist clenched HARD round the guitar's neck right where it joins the body, knuckles toward the "
    "viewer, beside her hip. The guitar hangs heavily from that fist at a SLANT: the GOLD body hangs below the fist across the front of "
    "her right thigh, its gold top facing the viewer, the whole body inside the canvas (its bottom end clearly above the bottom edge); "
    "the neck rises from the fist diagonally up and OUT to the viewer's left (about 30 degrees from vertical), the black headstock out "
    "beside and a little above her right shoulder, fully inside the canvas. Her left arm hangs relaxed at her side.",
    "Her head bows a very little; her eyes look DOWN along the neck at the guitar's gold body in her hand (not at the viewer): she "
    "regards it calmly, as a weapon. " + COLD2,
    GUITAR_TXT, CARD, DRAW, SHEET_RULE, LIGHT, HANDS, NEVER, ALPHA])


def main(which):
    out = []
    def write(name, text):
        open(os.path.join(here, f'{name}.txt'), 'w', encoding='utf-8').write(text)
    if which == 'a':
        for n in ('s04a_zip', 's04a_zip2'):
            write(n, ZIP); out.append(f"-{n}:{TURN}+{OLD_ZIP}+{BAG}+{COLD_FACE}+{FACES_REF}+{HANDS_REF}")
        for n in ('s04c_hang', 's04c_hang2'):
            write(n, HANG); out.append(f"-{n}:{TURN}+{OLD_HALF}+{GUITAR}+{BAG}+{COLD_FACE}+{HANDS_REF}")
    else:   # b: the variant of the chosen master (argv[2] = the master's file under out/)
        master = sys.argv[2] if len(sys.argv) > 2 else 'out/s04a_zip.png'
        for n in ('s04a_half', 's04a_half2'):
            write(n, HALF + "\n" + HANDS + "\n" + NEVER); out.append(f"-{n}:{master}+{GUITAR}+{BAG}+{HANDS_REF}")
    print(' '.join(f'"{a}"' for a in out))


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'a')
