"""Segment 09 (间奏 riff, docs/分镜/09_间奏riff.md) drawings for the samples of the two designs.

Both designs end on the same picture (k288-k295): she stands under the black wall of cards, plays, lit from the viewer's
right by an unseen outdoor lamp. So both share one drawing:
  - r09_play (R09-play): full figure, front, eye level, playing; leaning forward a little, the right hand driving DOWN through
    the strings, head bowed, bangs and hair ends flung to the viewer's right, eyes lowered. Light from the viewer's right, her
    left half (viewer's left) one tone darker. Transparent background.
  - r09_play_t2: the same prompt, a second take to choose from.
Scale: the 2:3 canvas showing a fixed 1.90 m, as segment 05 (the page measures the alpha box and places her by height anyway).
Written without _style.txt (jobs listed with a leading '-'): that file asks for a white background.
usage: python art/design/prompts/_make_seg09.py [round]  -> writes the .txt prompts and prints the make_jobs arguments
"""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import IDENTITY, DRAW, SHEET_RULE, HANDS, NEVER, variant

TURN = '../canon/rin_turnaround.png'
LP = '../canon/lespaul_goldtop_front_side_back.png'
HANDS_REF = '../ref/sheet_hands.png'
PLAYING = '../cut/rmid_bang2.png'          # Demo 2: how she holds and strums this guitar (pose only)

LIGHT = ("Lighting: night, one hard light from the viewer's RIGHT (an outdoor lamp out of the picture, at about head height): the side "
         "of her facing the viewer's right is lit in her normal flat colours; the other side of every form (her right side, the viewer's "
         "LEFT half of her face, hair, blazer, skirt and the guitar body) is in exactly ONE hard-edged shadow tone, a clean flat shape "
         "with a crisp edge, no gradient, no glow, no rim light. Her colours stay full and clean (yellow-blonde hair, teal eyes, white "
         "bow and shirt stay white on the lit side), not greyed by the night.")
ALPHA = ("Fully TRANSPARENT background (PNG alpha) everywhere outside her and the guitar: no floor, no wall, no cast shadow, no frame, "
         "no scenery. Every part of her and the guitar fully opaque. No text, no logos. No red anywhere.")
GUITAR = (
    "The guitar is the gold-top Les Paul of the second attached image; match it exactly: gold top, cream binding, two cream P-90 "
    "pickups, cream pickguard, one silver bar bridge, four gold knobs, black headstock with NO logo or text, 3+3 tuners with cream "
    "buttons, rosewood fretboard with cream trapezoid inlays; the back and sides are dark brown, almost pencil black. True size for a "
    "152 cm girl: from the end of the body to the tip of the headstock the guitar is about two thirds of her height. A plain black strap "
    "over her LEFT shoulder (viewer's right) and diagonally across her body. She plays it right-handed: her LEFT hand frets on the "
    "middle of the neck, her RIGHT hand strums with a small cream pick. The third attached image shows how she holds and strums this "
    "guitar (use it for the hold only, not for the drawing style, background or face).")
CARD = (
    "Her name card hangs on the teal lanyard in front of her chest, ABOVE the guitar body, turned so we see only its plain white back "
    "in a thin clear holder (nothing printed on it), not covered by her arm, the strap or the guitar.")
FULL_SCALE = (
    "Framing and scale (important: the film places this drawing by measurement): portrait canvas 2:3 showing a FIXED 1.90 m of height: "
    "the top edge is 1.87 m above the floor and the bottom edge 3 cm below the floor, so the soles of her loafers stand just above the "
    "bottom edge. She is 152 cm tall: the top of her head (not the bow) is 18% of the canvas height below the top edge; the bow rises "
    "higher. Do NOT enlarge her to fill the canvas. Camera at the height of her chest, straight on, long lens: a LEVEL view, no high or "
    "low angle, no perspective distortion, shoulders level, both feet fully drawn. The whole guitar, including the headstock, inside "
    "the canvas with a margin; her body centred at about 46% of the canvas width from the left so the headstock fits.")

PLAY = "\n".join([
    IDENTITY,
    "This drawing: she stands on a flat floor facing the viewer (front view) and plays the guitar HARD, in the middle of a big "
    "downstroke. Full figure, from the top of the bow to the soles of her brown loafers, feet apart about shoulder width, knees very "
    "slightly bent, standing firmly. Her upper body leans FORWARD a little over the guitar (about 8 degrees, towards the viewer, drawn "
    "from the front so it shows only as the head and shoulders a little lower and closer, not as a high angle). The guitar hangs on its "
    "strap across her body: the body at her right hip (viewer's LEFT), the neck rising to the viewer's RIGHT at about 20 degrees, the "
    "headstock at about the height of her shoulder and outside her silhouette. Her RIGHT arm has just swung DOWN: the right hand with "
    "the pick has driven down through all six strings and is just below them, the wrist bent with the motion, the elbow out. Her LEFT "
    "hand grips a chord on the middle of the neck. Her head is bowed, her eyes lowered to the strings under heavy lids, cold and "
    "intent, mouth closed in a firm line. With the motion her bangs and the ends of her bob are flung out to the viewer's RIGHT in a "
    "few clean large shapes, the big white bow tilted a little with the head; the hair never rises above the top of the bow.",
    CARD, GUITAR, FULL_SCALE, DRAW, SHEET_RULE, LIGHT, HANDS, NEVER, ALPHA])


# Round 2 (finishing the segment after the blind review of the samples): r09_play came back flat-lit (no lamp side at all) and
# with a soft glow halo in its alpha. R09-play is redrawn from it (the master as the first reference, "redraw exactly, change only
# the light"), twice, to choose from.
MASTER = '../cut/r09_play.png'
RELIGHT = variant(
    "the LIGHTING only. It is night; the only light is one hard outdoor lamp out of the picture on the viewer's RIGHT, at about her "
    "head height. Every form keeps its lit side (the side facing the viewer's right) in her normal clean flat colours, and its other "
    "side in exactly ONE clearly darker hard-edged shadow tone (a cool, slightly teal-grey darkening of each colour), a crisp flat "
    "shape, no gradient: the viewer's LEFT half of her face and neck, the left side of the hair mass and of the bow loops, the "
    "viewer's left half of the blazer, skirt, socks and loafers, the left arm and hand, and the left part of the guitar body all in "
    "that shadow tone; the shadow side takes about 45 percent of each form, so she clearly reads as lit from the right. Under the bow "
    "and the bangs, under the guitar body on the skirt, and under the chin, small hard cast-shadow shapes in the same tone. The lit "
    "side stays bright and clean: yellow-blonde hair, teal eyes, the bow and shirt stay white, the gold top stays gold. "
    "ALSO remove the soft glow around her completely: the background must be fully transparent right up to her outline, with a crisp "
    "edge, no halo, no glow, no haze, no rim light, no light band along the outline, no cast shadow on the ground.")


def round2():
    out = []
    for n in ('r09_play_lit', 'r09_play_lit_t2'):
        write(n, chr(10).join([RELIGHT, DRAW, NEVER, ALPHA])); out.append(f"-{n}:{MASTER}+{TURN}+{LP}")
    return out


# Round 3 (independent review of the cut: k292 she stood frozen for 2.96 s, so nobody could see that HER strum sends the light up the
# wall). One variant of the lit master for k292: the big strum's follow-through, the head thrown up. Only the head and the right
# arm change; drawn level (a raised chin seen straight on, not a low angle).
STRIKE = variant(
    "only her HEAD and her RIGHT ARM (the strumming arm, on the viewer's LEFT). (1) Her right arm has just finished a huge windmill "
    "strum: it is flung UP and out to the viewer's left, the elbow almost straight, the hand with the small cream pick high above her "
    "shoulder at about the height of the top of the bow, palm towards the viewer, fingers relaxed; the sleeve of the blazer slides "
    "back a little at the wrist. (2) Her head is thrown up: the chin lifted, she looks UP towards the sky above the viewer, eyes open "
    "(teal), mouth open a little with the effort, the bangs and the ends of the bob lifted off the face by the motion, the bow tilted "
    "back with the head. Drawn from the same LEVEL camera (a lifted chin seen straight on: the jaw line shorter, the underside of the "
    "chin just visible), not a low angle. The guitar, the left hand on the neck, the body, legs, feet, the card and the strap stay "
    "exactly where they are, line for line. Keep the same night lighting from the viewer's right (one hard-edged shadow tone on the "
    "viewer's left side of every form).")


def round3():
    out = []
    for n in ('r09_strike', 'r09_strike_t2'):
        write(n, chr(10).join([STRIKE, HANDS, DRAW, NEVER, ALPHA])); out.append(f"-{n}:../cut/r09_play_lit.png+{TURN}+{HANDS_REF}")
    return out


def write(name, text):
    open(os.path.join(here, name + '.txt'), 'w', encoding='utf-8').write(text + "\n")


if __name__ == '__main__':
    rnd = sys.argv[1] if len(sys.argv) > 1 else '1'
    out = []
    if rnd == '1':
        for n in ('r09_play', 'r09_play_t2'):
            write(n, PLAY); out.append(f"-{n}:{TURN}+{LP}+{PLAYING}+{HANDS_REF}")
    if rnd == '2':
        out = round2()
    if rnd == '3':
        out = round3()
    print(' '.join(f'"{a}"' for a in out))
