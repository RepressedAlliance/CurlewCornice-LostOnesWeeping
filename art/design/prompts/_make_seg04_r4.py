"""Segment 04, rounds 4-6 (the finished segment, design A after the blind review of the samples; called from _make_seg04.py).

A NEW master r04c_zip (cold eyes, the bag's top end clearly above her head with the zip pull and an opened mouth, the hand plainly
on the bag), then r04c_half and r04c_hang from it; and the two hands of S1 (h04_push: pushing the lead out; h04_hold: holding the
lead holder to stab, from h04_push).
"""
from rules import HANDS, NEVER, variant

TURN = '../canon/rin_turnaround.png'
BAG = '../canon/gigbag_front_back_side_open.png'
GUITAR = '../canon/lespaul_goldtop_front_side_back.png'
HANDS_REF = '../ref/sheet_hands.png'
COLD_FACE = 'board/seg04_cold_face.png'
HAND_REF = '../cut/hpen3.png'
HOLDER = '../canon/leadholder_2mm.png'
HANDPEN = '../canon/rin_hand_pencil.png'

GUITAR_TXT = (
    "The guitar is exactly the Les Paul of the attached guitar sheet: gold top with cream binding, two cream P-90 pickups, cream "
    "pickguard, a bar bridge, four gold knobs, black headstock with NO logo and 3+3 tuners with cream buttons, rosewood fingerboard with "
    "cream trapezoid inlays; its back, sides and the back of the neck dark brown, nearly pencil black. Real proportions: 99 cm long, "
    "about two thirds of her height; the body 44 x 33 cm.")
COLD2 = ("Her eyes (important): COLD, not sleepy. The upper eyelid of each eye is a STRAIGHT, nearly horizontal hard line (not a "
         "curved arc, not a drooping half-closed lid), pressed down so it cuts off the top quarter of the iris; the iris below is fully "
         "drawn, teal, with a clear dark pupil and one small sharp highlight, the gaze FOCUSED on one point; the lower lid a short straight "
         "line. The eye shape of the face in the attached close-up (the flat, sharp lid line), but her brows stay LEVEL and calm, not "
         "frowning, not angry. The mouth a small closed straight line. The look reads as cold and quietly dangerous, never bored, sleepy, "
         "sad or angry.")

C_ZIP = variant(
    "(1) her eyes: " + COLD2 + " Her eyes look down and to the side toward her right shoulder (the viewer's left, downward), at the bag. "
    "(2) the bag and her right hand: the black gig bag's narrow neck end now rises HIGHER behind her right shoulder: its rounded top end "
    "is a full head-height above the top of her head, clearly above and to the viewer's left of the bow (it does not touch the bow), "
    "standing up diagonally from behind her shoulder. The zip runs along the edge of the bag's neck end; the top 15 cm of the zip are "
    "already pulled open, a dark gap with the grey inner lining visible. Her RIGHT arm (viewer's LEFT) reaches high up behind her shoulder: "
    "the elbow raised beside and above her head, the forearm going up and back, and her hand is ON THE BAG, high above her head height, "
    "well away from her hair (a clear empty gap between the hand and her head), its thumb and index finger pinching a LARGE silver zip "
    "pull with a black fabric tab at the end of the opened stretch, the other fingers gripping the bag's edge. It must read at a glance as "
    "reaching up behind her to draw something out of the bag, never as touching her hair or scratching her head. The strap across her "
    "chest, the buckle and everything else of her stay exactly as they are.")

C_HALF = variant(
    "her RIGHT arm and the bag's top only (her face, eyes, hair, bow, body, the strap across her chest, the lanyard and clip stay exactly "
    "as they are, line for line; her eyes may only turn a little to follow the neck): the zip is now pulled wide open and her right fist "
    "GRIPS the guitar's neck and has drawn the guitar FAR out of the bag over her right shoulder, like a sword drawn from a scabbard on her "
    "back: the dark neck rises from the bag's open mouth behind her right shoulder DIAGONALLY (about 40 degrees from vertical, NOT "
    "vertical) up to the viewer's left, her fist round the neck above her shoulder, the black headstock (3+3 cream tuner buttons, no logo) "
    "high above and to the LEFT of her head (viewer's left), fully inside the canvas. Out of the bag's wide open mouth, beside her shoulder "
    "on the viewer's left, the UPPER HALF of the guitar's body has come out: a LARGE solid patch of the GOLD top with its cream binding, the "
    "cutaway horn and the cream neck pickup, at least as big as her head, clearly visible outside her silhouette next to her raised arm "
    "and shoulder. This gold is the only warm colour in the picture and must read instantly even very small. " + GUITAR_TXT)

C_HANG = variant(
    "her RIGHT arm, the guitar and the bag (her face, hair, bow, body, the strap across her chest with its buckle, the lanyard and the "
    "silver clip stay exactly where they are, line for line; her eyes may only turn down to the guitar): the guitar is now completely out "
    "of the bag and she carries it low like a weapon. Her RIGHT arm (viewer's LEFT): the upper arm down along her side, the elbow a little "
    "bent and TENSE, the fist at the height of her skirt's waistband beside her hip, gripping the guitar's neck HARD right where it joins "
    "the body, knuckles towards the viewer, the fist clenched tight. The guitar hangs from that fist at a SLANT, not vertical: the neck "
    "rises from the fist diagonally up and OUT to the viewer's left (about 35 degrees from vertical), the black headstock outside her right "
    "shoulder; the GOLD body hangs below the fist slanting down across the front of her right thigh, the gold top facing the viewer, the "
    "WHOLE body fully inside the canvas (its bottom end clearly above the bottom edge of the canvas, nothing of the guitar cut off), the "
    "body as big as in reality (44 cm long, about a third of the canvas height), a big gold shape over her dark skirt. The now EMPTY gig "
    "bag hangs limp and flat behind her right shoulder, no longer rising above the shoulder line; the strap stays exactly as it was. Her "
    "head bows a very little and her eyes look down along the neck at the guitar body; " + COLD2 + " " + GUITAR_TXT)

H_DRAW = ("Drawing: exactly the same hand, sleeve and drawing as the first attached image (Rin's small young right hand, the charcoal "
          "blazer sleeve with the white shirt cuff): clean modern anime line art, crisp even dark-grey outline, flat colours with one "
          "hard-edged shadow tone, no gradients, no glow, no texture. The hand as small and slim as hers: a 14-year-old girl's hand.")
H_HOLDER = ("The lead holder is exactly the one in the second attached image: a 2 mm lead holder (clutch pencil), matte pencil-black "
            "barrel without any text, a silver knurled grip, a silver cone tip, a silver push button with a clip at the back end. Its real "
            "size: 13 cm long, as long as her hand from wrist to fingertip.")
H_ALPHA = ("Fully TRANSPARENT background (PNG alpha) everywhere outside the hand, sleeve and lead holder: no paper, no table, no shadow, "
           "no glow, no frame. Everything drawn fully opaque. No text, no logos. No red anywhere.")
H_PUSH = "\n".join([
    "A drawing of one hand seen from DIRECTLY ABOVE (a top-down view onto a desk), landscape canvas 3:2.",
    "A 2 mm lead holder lies flat and perfectly HORIZONTAL across the canvas, its silver cone TIP pointing LEFT: the tip at about 8% of "
    "the canvas width from the left edge, at 40% of the canvas height; the barrel runs straight to the right; its silver push button at "
    "the back end at about 72% of the canvas width. No lead sticks out of the tip (the tip is empty).",
    "Her RIGHT hand comes in from the lower RIGHT corner of the canvas (the sleeve and cuff cut off by the right and bottom edges of the "
    "canvas): the index finger presses DOWN on the push button at the back end, its fingertip on top of the button; the thumb and the "
    "other fingers rest loosely beside the back half of the barrel, relaxed, not gripping. The front half of the lead holder (the grip and "
    "the tip) is free, not covered by the hand.",
    H_HOLDER, H_DRAW, HANDS, NEVER, H_ALPHA])
H_HOLD = "\n".join([
    "A drawing of one hand seen from DIRECTLY ABOVE (a top-down view onto a desk), landscape canvas 3:2, the same size of hand and lead "
    "holder as the first attached image.",
    "Her RIGHT hand holds the same 2 mm lead holder in the normal writing grip (thumb, index and middle finger at the knurled grip), the "
    "hand lifted a little off the desk, ready to stab down: the lead holder points to the UPPER LEFT, about 30 degrees above horizontal, "
    "its silver cone TIP at about 22% of the canvas width and 30% of the canvas height, nothing sticking out of the tip (no lead drawn). "
    "The barrel goes back down to the right between the thumb and index finger; the back end with the button and clip shows behind the "
    "hand. The hand and wrist come in from the lower RIGHT, the sleeve and cuff cut off by the right and bottom edges of the canvas. The "
    "grip is firm and tense (the fingers pressing), not a relaxed writing pose.",
    H_HOLDER, H_DRAW, HANDS, NEVER, H_ALPHA])


H_PUSH2 = "\n".join([
    "A drawing of one hand seen from DIRECTLY ABOVE (a top-down view onto a desk), landscape canvas 3:2. The SAME hand, sleeve, cuff "
    "and lead holder as the first attached image, at the SAME size (the hand from wrist to fingertips about as long as the whole lead "
    "holder, exactly as in the first attached image); only the pose changes.",
    "The 2 mm lead holder now lies flat and perfectly HORIZONTAL on the desk, its silver cone TIP pointing LEFT, the tip at about 6% of "
    "the canvas width from the left edge and at 38% of the canvas height; the barrel runs straight to the right; no lead sticks out of the "
    "tip (the tip is empty).",
    "Her RIGHT hand rests on the desk at the BACK half of the lead holder, coming in from the lower RIGHT (the sleeve and white cuff cut "
    "off by the right and bottom edges of the canvas): the tip of her index finger presses down on the silver push button at the back end "
    "of the lead holder, the thumb and the other fingers curled loosely beside the barrel. The front half of the lead holder (the knurled "
    "grip and the tip) lies free, nothing covering it.",
    H_HOLDER.replace("second attached image", "first and second attached images"), H_DRAW, HANDS, NEVER, H_ALPHA])


def round45(rnd, write):
    out = []
    if rnd == '4':
        write('r04c_zip', C_ZIP + "\n" + HANDS + "\n" + NEVER)
        out.append(f"-r04c_zip:out/r04a_zip.png+{COLD_FACE}+{BAG}+{TURN}+{HANDS_REF}")
        write('h04_push', H_PUSH)
        out.append(f"-h04_push:{HAND_REF}+{HOLDER}+{HANDPEN}+{HANDS_REF}")
    elif rnd == '5':
        write('r04c_half', C_HALF + "\n" + HANDS + "\n" + NEVER)
        out.append(f"-r04c_half:out/r04c_zip.png+{GUITAR}+{BAG}+{TURN}+{HANDS_REF}")
        write('r04c_hang', C_HANG + "\n" + HANDS + "\n" + NEVER)
        out.append(f"-r04c_hang:out/r04c_zip.png+{GUITAR}+{COLD_FACE}+{TURN}+{HANDS_REF}")
        write('h04_hold', H_HOLD)
        out.append(f"-h04_hold:out/h04_push.png+{HOLDER}+{HANDPEN}+{HANDS_REF}")
    elif rnd == '6':
        # h04_push came out with the hand half the size of h04_hold's (and of a real hand next to a 13 cm lead holder):
        # redraw it from h04_hold so the hand keeps one size through the shot
        write('h04_push2', H_PUSH2)
        out.append(f"-h04_push2:out/h04_hold.png+{HOLDER}+{HANDPEN}+{HANDS_REF}")
    return out
