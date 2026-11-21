"""Segment 15 (尾奏 riff), round i (2026-11-22, the third independent review's MUSTs):
  R15_grip2   R15_grip redrawn, only her eyes: R15_grip was asked to look at the viewer's LEFT (the reader she will smash, the
              one segment 16 S10 shows on the viewer's left) and came back looking RIGHT; the shoulder key then looked left, so
              "which reader" switched sides in one cut.
  R15_bat     the guitar on her right shoulder like a bat, drawn FROM R15_grip on a padded canvas (board/seg15_grip_pad.png: R15_grip
              at 0.78 with headroom and room on the viewer's left for the gold body), so she, her legs, skirt and the guitar keep
              R15_grip's size (R16_shoulder had shrunk the guitar to ~60% and drawn it in strong perspective). Shown in the same
              WU shot as the strum keys and R15_grip (no cut): the action happens in the shot.
  R15_heave   the half-beat in-between from R15_grip2 to R15_bat (made in round i2 from the chosen R15_bat).
  f15_p6_a / f15_p6_c   さくら pulling the headphone cup off on the three heaviest kicks k537-k539: a (cup still on the ear, the
              hand lifting it), f15_p6c (the existing drawing, cup just off), c (cup pulled right off, head turned to the music,
              eyes wide); f15_p6_c came back with a teal glow round the figure: redrawn as f15_p6_c2 (round i2);
              f15_p6_cb (c with the eyes shut, a blink) in round i3.
usage: python art/design/prompts/_make_seg15i.py [i2 <bat> | i3 <p6c>]   -> writes the .txt prompts, prints the make_jobs arguments
"""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import variant, IDENTITY, DRAW, SHEET_RULE, LARGE, HANDS, NEVER
from _make_seg04_r9 import THREAT
from _make_seg04_r8 import GUITAR_TXT

TURN = '../canon/rin_turnaround.png'
LP = '../canon/lespaul_goldtop_front_side_back.png'
COLD_FACE = 'board/seg04_cold_face.png'
PAD = 'board/seg15_grip_pad.png'
PAD2 = 'board/seg15_grip2_pad.png'
CUT = '../cut/'

EYES_LEFT = ("her eyes look to the viewer's LEFT and DOWN: in BOTH eyes the iris and pupil sit at the viewer's-LEFT end of the eye "
             "opening (toward the viewer's left), looking at a ticket gate's reader low beside her on the viewer's left, past the "
             "viewer, NOT at the viewer. ")

GRIP2 = variant(
    "only her EYES. Now " + EYES_LEFT + "Today the irises sit at the viewer's RIGHT end of each eye: move them to the viewer's LEFT "
    "end. The eyelids, brows (the cold, hard set), mouth, head, hair, hands, guitar, strap, clothes and legs stay exactly as they are.")

BAT = "\n".join([
    "Redraw the first attached image: the SAME girl at the SAME size and position in the canvas (her feet/legs, skirt, hips and "
    "blazer exactly where they are, the top of her bow at the same height), the same line work, colours and flat lighting, the fully "
    "TRANSPARENT background (PNG alpha). The canvas has empty space above her and on the viewer's left on purpose: it is for the "
    "guitar. Change only her arms, the guitar and her eyes, as follows.",
    "She now CARRIES THE GUITAR ON HER RIGHT SHOULDER LIKE A BASEBALL BAT, exactly the arrangement of the second attached image (a "
    "close-up of this pose): her RIGHT hand (on the viewer's LEFT) is a hard fist round the neck right UNDER THE HEADSTOCK, the fist "
    "in front of her right collarbone; the black headstock sticks out BELOW the fist, pointing down. From the fist the neck runs UP "
    "and BACK over her right shoulder (leaning about 25 degrees from vertical toward the viewer's left) and the heavy GOLD BODY rests "
    "behind her right shoulder, high beside her head on the viewer's LEFT, its gold top facing the viewer, the cream binding and two "
    "cream pickups visible, its upper end well ABOVE her bow, fully inside the canvas, clear of her face and hair. Her right "
    "shoulder pressed down a little by the weight. Her LEFT arm (viewer's right) hangs at her side, the hand a loose fist by her thigh.",
    "SIZE (important): it is the SAME guitar at the SAME SIZE as in the first attached image: the gold body exactly as wide and as "
    "long as it is now in the first image (about 0.9 times the width of her shoulders), the neck as long, the frets as far apart, the "
    "headstock as big. Drawn FLAT, straight on, long lens, no perspective: the headstock is NOT larger and the body NOT smaller than "
    "in the first image. Camera at her eye height, no high or low angle, shoulders level.",
    "The guitar's black strap: its end has come OFF the strap button at the bottom of the body; the strap now hangs from the button "
    "at the NECK HEEL in a short slack loop down beside her right arm. It no longer crosses her chest.",
    "Her head upright, chin a little down; " + EYES_LEFT + THREAT,
    GUITAR_TXT, DRAW, SHEET_RULE, LARGE, HANDS, NEVER,
    "No lanyard, no name card, no bag. Fully TRANSPARENT background everywhere outside her and the guitar: no floor, no shadow, no "
    "frame, no scenery. Every part of her and the guitar fully opaque. No text, no logos. Absolutely no red, pink or orange anywhere."])

HEAVE = "\n".join([
    "An in-between drawing (an animation breakdown) exactly halfway from the FIRST attached image to the SECOND attached image: the "
    "same girl at the same size and position in the canvas (legs, skirt, hips, blazer where they are in both), the same line work, "
    "colours and flat lighting, the fully TRANSPARENT background (PNG alpha). In the first image she grips the guitar at the neck "
    "joint in playing position; in the second it rests on her right shoulder like a bat. Draw the moment she HEAVES it up: her RIGHT "
    "hand (viewer's LEFT) has slid up to the neck just under the headstock and is swinging the guitar up and back across her right "
    "side; the guitar is in mid-air, tilted about 60 degrees, its gold body swinging UP past her right shoulder, level with her face on "
    "the viewer's LEFT; the headstock low in her fist at her chest; her left hand has just let go of the neck and is dropping to her "
    "side. Her right shoulder rises with the lift, the skirt hem and the ends of her hair swing a little toward the viewer's left with "
    "the motion. The guitar keeps EXACTLY the size it has in both attached images (same body, neck, headstock), drawn flat, no "
    "perspective. The strap end comes off the bottom strap button and flies loose. " + EYES_LEFT + THREAT,
    GUITAR_TXT, DRAW, SHEET_RULE, HANDS, NEVER,
    "No lanyard, no name card. Fully TRANSPARENT background, every part fully opaque, no text, no red, pink or orange anywhere."])

KEEP_P6 = (" Redraw the first attached image exactly (the same young woman, the same wavy hair, the headphones, white coat, dotted "
           "turtleneck, backpack straps, the teal lanyard, the same framing, size and position in the canvas, the same teal one-colour "
           "screen-tone manga line work and the same transparent surroundings). ")
P6_A = (KEEP_P6 + "Change only this: the headphone cup on the viewer's right is still ON her ear: her hand has just taken hold of it and "
        "is starting to lift it (the cup's back edge tilted a finger's width away from the ear, still covering it). Her head a little "
        "lower, her eyes lowered, looking DOWN (half-lidded, listening to her own music), her mouth closed. Everything else exactly as "
        "it is, line for line.")
P6_C = (KEEP_P6 + "Change only this: she has pulled that headphone cup right OFF and down: her hand holds it low beside her jaw, well "
        "away from her ear, the ear now fully uncovered. Her head turned further toward the viewer's RIGHT and lifted (toward the music), "
        "her eyes WIDE open (the whole iris showing, small highlights), looking to the viewer's right, lips parted a little in surprise. "
        "Everything else exactly as it is, line for line.")
NO_GLOW = (" No glow, no outer halo, no soft coloured fringe round the figure: the outline is the drawing's own crisp teal line and "
           "everything outside it is fully transparent, exactly like the first attached image.")
P6_CB = (" Redraw the first attached image exactly (the same young woman, pose, hand, headphones, clothes, framing, size and position, the "
         "same teal screen-tone line work, transparent surroundings). Change only this: her EYES are SHUT in a blink: each eye a single "
         "soft downward-curved line of the closed upper lid with the lashes, the brows unchanged. Everything else exactly as it is, line "
         "for line.")


def write(name, text):
    open(os.path.join(here, name + '.txt'), 'w', encoding='utf-8').write(text + "\n")


if __name__ == '__main__':
    out = []
    if len(sys.argv) > 1 and sys.argv[1] == 'i2':
        bat = sys.argv[2] if len(sys.argv) > 2 else 'R15_bat'
        p6c = sys.argv[3] if len(sys.argv) > 3 else 'f15_p6_c'
        for n in ('R15_heave_a', 'R15_heave_b'):
            write(n, HEAVE); out.append(f"-{n}:{PAD2}+{CUT}{bat}.png+{LP}+{TURN}")
        write('f15_p6_c2', P6_C + NO_GLOW); out.append(f"-f15_p6_c2:{CUT}f15_p6c.png+{CUT}f15_p6_a.png")
    elif len(sys.argv) > 1 and sys.argv[1] == 'i3':
        p6c = sys.argv[2] if len(sys.argv) > 2 else 'f15_p6_c2'
        write('f15_p6_cb', P6_CB + NO_GLOW); out.append(f"-f15_p6_cb:{CUT}{p6c}.png")
    else:
        for n in ('R15_grip2_a', 'R15_grip2_b'):
            write(n, GRIP2); out.append(f"-{n}:{CUT}R15_grip.png+{COLD_FACE}")
        for n in ('R15_bat_a', 'R15_bat_b'):
            write(n, BAT); out.append(f"-{n}:{PAD}+{CUT}r16_glare_sh.png+{LP}+{TURN}+{COLD_FACE}")
        write('f15_p6_a', P6_A); out.append(f"-f15_p6_a:{CUT}f15_p6c.png")
        write('f15_p6_c', P6_C); out.append(f"-f15_p6_c:{CUT}f15_p6c.png")
    print(' '.join(f'"{a}"' for a in out))
