"""Segment 15 (尾奏 riff), round h: the ending rebuilt toward the guitar smash (2026-11-21, user after the second cut:
「lost one的号哭 很多都是做砸吉他 我们要不要也做 但是不能简单的做……要用你的优势 做出来要高质量」; design: the smash storyboard,
15 S7 k540-k556 + 16 k556-k572). Segment 15 only needs two new drawings:
  R15_grip      (S7a k550, WU waist shot) R15_strum_1 redrawn: she stops playing, her right hand lets the pick go and grips the
                guitar where the neck meets the body, her left hand slides down the neck; head up, eyes to her right-front-down
                (the viewer's LEFT, low) at the reader beside her lane; mouth pressed shut. Guitar, legs, skirt, strap do not move.
  R16_shoulder  (S7b k552-k556, the BAT frame, and the master of segment 16's raise / swing / after) the guitar on her right
                shoulder like a bat, as in 04's s04d_shoulder (the film's set-up: 04 carried it and did not swing): fist under the
                headstock, the neck over her right shoulder, the gold body up beside her head on the viewer's left. No lanyard, no
                card (gone since 14), no gig bag. The strap's one end has come off the end pin and hangs from the neck-heel button.
                Square canvas 1254 px showing 1.35 m (0.70-2.05 m): mid-thigh to above the guitar's top, her centre at 62%.
usage: python art/design/prompts/_make_seg15h.py   -> writes the .txt prompts, prints the make_jobs arguments
"""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import variant, IDENTITY, DRAW, SHEET_RULE, LARGE, HANDS, NEVER
from _make_seg04_r9 import THREAT
from _make_seg04_r8 import GUITAR_TXT

TURN = '../canon/rin_turnaround.png'
LP = '../canon/lespaul_goldtop_front_side_back.png'
HANDS_REF = '../ref/sheet_hands.png'
COLD_FACE = 'board/seg04_cold_face.png'
CUT = '../cut/'
KEEP_GUITAR = (" The guitar stays exactly the same guitar in the same place and angle (its body, neck and headstock do not move), her "
               "legs and skirt do not move, the black strap over her shoulder stays, the canvas size and her size and position in it do "
               "not change.")
LIGHT = "Lighting: plain even indoor light, the flat colours of the turnaround, one hard-edged shadow tone per material."
ID = IDENTITY.replace(", a teal lanyard with her white name card in a clear holder", "")

GRIP = variant(
    "she STOPS playing. Her RIGHT hand (the viewer's LEFT hand, the strumming hand) has let the pick go and now GRIPS the guitar hard, "
    "a tight fist round the place where the NECK JOINS THE BODY (the upper horn of the gold body, just past the last fret), the "
    "knuckles toward the viewer. Her LEFT hand (on the viewer's right) has slid DOWN the neck toward the body and holds the neck "
    "loosely a hand's width above her right fist. Her HEAD comes UP (upright, chin level, no longer bowed) and turns a little to the "
    "viewer's LEFT; her eyes look to the viewer's LEFT and DOWN, at something low beside her (a ticket gate's reader at her hip "
    "height), past the viewer, NOT at the viewer. Her mouth is pressed shut in a small straight line, the jaw set. " + THREAT +
    KEEP_GUITAR + " The face's eye shape and expression like the third attached image; her hands like the turnaround's (small, "
    "slim, simple).")

SHOULDER = "\n".join([
    ID + " No lanyard, no name card, no card holder, no bag: none of them anywhere.",
    "Framing (important): SQUARE canvas. The canvas shows her from MID-THIGH up: the bottom edge cuts straight across her thighs a "
    "little below the hem of her skirt (her legs reach the bottom edge). The top of her bow is about 30% of the canvas height below "
    "the top edge; her head from chin to the top of her hair about 15% of the canvas height. Her body's centre line at about 62% of "
    "the canvas width from the left. Everything on the viewer's LEFT of her is for the guitar: the left quarter of the canvas stays "
    "empty (transparent). Camera exactly at her eye height, long lens, no high or low angle, the shoulders level; her body faces the "
    "viewer, turned only a little (about 15 degrees) toward the viewer's LEFT.",
    "She CARRIES THE GUITAR ON HER SHOULDER LIKE A BASEBALL BAT (important, it must read as a weapon at a glance, exactly the way of "
    "the second attached image): her RIGHT hand (viewer's LEFT) is a hard fist round the guitar's neck right UNDER THE HEADSTOCK "
    "(the thin end, where you hold a bat's handle), the fist in front of her right collarbone, a little out from her chest; the "
    "black headstock sticks out BELOW and in front of the fist, pointing down. From the fist the long dark neck runs UP and BACK "
    "over her right shoulder, and the heavy GOLD BODY of the guitar rests up there behind her right shoulder, high beside her head "
    "on the viewer's LEFT: the gold top facing the viewer, its cream binding and the two cream pickups clearly visible; the body's "
    "upper end well above her bow, about 8% of the canvas height below the top edge, fully inside the canvas, clear of her face "
    "and hair (a small gap), never hidden behind her head. The guitar's weight sits on her shoulder: the right shoulder pressed "
    "down a little. Her LEFT arm (viewer's right) hangs down at her side, the hand a loose fist by her thigh.",
    "The guitar's black strap: one end has come OFF the strap button at the bottom of the body and hangs loose; the strap now hangs "
    "down from the button at the NECK HEEL in a short slack loop beside her arm, its free end dangling. It does not cross her chest.",
    "Her head upright, chin a little down; her eyes look sideways and DOWN to the viewer's LEFT (at a ticket gate's reader below "
    "her right hand, outside the picture), past the viewer, NOT at the viewer. " + THREAT,
    GUITAR_TXT, DRAW, SHEET_RULE, LIGHT, LARGE, HANDS, NEVER,
    "Fully TRANSPARENT background (PNG alpha) everywhere outside her and the guitar: no floor, no shadow, no frame, no scenery, no "
    "gate, no paper, no outline glow. Every part of her and the guitar fully opaque. No text, no logos. Absolutely no red, pink or "
    "orange anywhere."])


def write(name, text):
    open(os.path.join(here, name + '.txt'), 'w', encoding='utf-8').write(text + "\n")


if __name__ == '__main__':
    out = []
    for n in ('R15_grip_a', 'R15_grip_b'):
        write(n, GRIP); out.append(f"-{n}:{CUT}R15_strum_1.png+{TURN}+{COLD_FACE}+{LP}")
    for n in ('R16_shoulder_a', 'R16_shoulder_b'):
        write(n, SHOULDER); out.append(f"-{n}:{TURN}+{CUT}s04d_shoulder.png+{CUT}R15_strum_1.png+{LP}+{COLD_FACE}+{HANDS_REF}")
    print(' '.join(f'"{a}"' for a in out))
