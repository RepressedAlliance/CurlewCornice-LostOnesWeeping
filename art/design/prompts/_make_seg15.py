"""Segment 15 (尾奏 riff, docs/分镜/15_尾奏riff.md) drawings for the two-design SAMPLE of the key shot (k508-k528):
the pan past the people of the lanes, her playing with her eyes closed, the stop, everyone turning to her, her eyes opening.

Her (full colour, 2:3, ONE fixed scale: the canvas spans 1.80 m (top edge) down to 0.55 m (bottom edge) above the floor, 12.3 px/cm):
  - R15_play_d1 (master)  front, eye level, in her lane, eyes closed, strumming DOWN on the gold Les Paul; no lanyard, no card
  - R15_play_d2  d1 with one change: up-strum, chin lifted a little
  - R15_play_d3  d1 with one change: hard down-strum, body pressed onto the guitar, head down
  - R15_play_d4  d1 with one change: eyes closed, chin up, right hand held above the strings about to strike
  - R15_play_e   d4 with one change: eyes open, looking ahead past the camera (a little above it), face calm
The town (teal print, 2:3, the 01 scale: 2.00 m down to 0.25 m, 8.78 px/cm):
  - t15_p8  t01_p8 with one change: his right hand pinches the EMPTY card clip at the end of his lanyard
  - t15_p2  t01_p2 with one change: her right hand flat on her chest where her card used to hang
  - t15_p9_turn / t15_p1_turn  t01_p9 / t01_p1c with one change: the head turned towards her
  - t15_p7_turn  t01_p7 with one change: mother and child turn their heads to her
  - t15_n3 / t15_n5 / t15_n6 new people (first and second row), head bowed; *_turn: the head turned to her
usage: python art/design/prompts/_make_seg15.py <round>   (1, 2, 3) -> writes the .txt prompts, prints the make_jobs arguments
"""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import IDENTITY, DRAW, SHEET_RULE, HANDS, NEVER, LARGE, variant

TURN = '../canon/rin_turnaround.png'
LP = '../canon/lespaul_goldtop_front_side_back.png'
HOLD = '../cut/rmid_bang2.png'
HANDS_REF = '../ref/sheet_hands.png'
FACES_REF = '../ref/sheet_faces.png'
CUT = '../cut/'

HER_ID = IDENTITY.replace(", a teal lanyard with her white name card in a clear holder", "")
LIGHT = "Lighting: plain even indoor light, the flat colours of the turnaround, one hard-edged shadow tone per material."
PLAY = (
    "This drawing: she stands still in a lane of the station's automatic ticket gates, facing the viewer (front view), feet a little "
    "apart, and plays the guitar. NO lanyard and NO card: her neck and chest show only the shirt collar, the teal ribbon tie and the "
    "blazer (the lanyard was torn off earlier). The guitar hangs on a plain black strap that goes over her LEFT shoulder (the viewer's RIGHT) and diagonally across her chest and back to the strap button. The "
    "guitar body sits at her right hip (the viewer's LEFT), the neck rising to the viewer's RIGHT at about 30 degrees, the headstock at "
    "about the height of her shoulder, outside her silhouette. Her LEFT hand frets a chord on the neck, her RIGHT hand strums with a "
    "small cream pick.\n"
    "The guitar is the gold-top Les Paul of the second attached image; match it exactly: gold top, cream binding, two cream P-90 "
    "pickups, cream pickguard, one silver bar bridge, four gold knobs, black headstock with NO logo or text, 3+3 tuners with cream "
    "buttons, rosewood fretboard with cream trapezoid inlays; the back and sides are very dark brown, almost pencil black. True size for a "
    "152 cm girl: from the end of the body to the tip of the headstock the guitar is about two thirds of her height. The third "
    "attached image shows how she holds and strums this guitar (use it for the hold only, not for the drawing style or face).")
POSE_D1 = (
    "The moment: she has just struck a hard DOWN-strum: her right hand has swept down across the strings and stopped just below them, "
    "over the bridge pickup. Her EYES are CLOSED (two calm curved lines, the lashes down), her head bowed a little towards the strings, "
    "her mouth closed. She is completely inside the music, not aware of anyone. Not smiling, not crying.")
SCALE = (
    "Framing and scale (important: the film places this drawing by measurement): portrait canvas 2:3 showing a FIXED 1.25 m of height: "
    "the top edge is 1.80 m above the floor and the bottom edge 0.55 m above the floor, so the bottom edge of the canvas cuts straight "
    "across her thighs a little below the hem of her skirt (no knees, socks or feet in the picture; the legs must reach the bottom edge). "
    "She is 152 cm tall: the top of her head (not the bow) is 22% of the canvas height below the top edge; the bow rises higher, its top "
    "about 14% below the top edge. Do NOT enlarge her to fill the canvas. Her body centred at 45% of the canvas width from the left so "
    "the whole guitar, including the headstock and its tuners, is inside the canvas with a clear margin on both sides. Camera exactly "
    "at her eye height (about 1.4 m), straight on, long lens: no high or low angle, no perspective distortion, the shoulders level.")
HER_ALPHA = ("Fully TRANSPARENT background (PNG alpha) everywhere outside her and the guitar: no floor, no shadow, no frame, no gate, no "
             "scenery. Every part of her and the guitar fully opaque. No text, no logos. No red anywhere.")
R15_D1 = "\n".join([HER_ID, PLAY, POSE_D1, SCALE, DRAW, SHEET_RULE, LIGHT, HANDS, NEVER, HER_ALPHA])

KEEP_GUITAR = (" The guitar stays exactly the same guitar in the same place and angle (its body, neck and headstock do not move), her LEFT "
               "hand stays on the neck as it is, her legs and skirt do not move, the canvas size and her size and position in it do "
               "not change.")
V_D = {
    'R15_play_d2': "her RIGHT hand has swung back UP across the strings in an up-strum: the hand is now just ABOVE the strings near the "
                   "neck pickup, the wrist turned, the pick pointing down; her chin lifts a little (the head comes up slightly from the "
                   "bowed position, eyes still CLOSED); the bangs swing a little to her right with the movement." + KEEP_GUITAR,
    'R15_play_d3': "a heavier DOWN-strum: her shoulders drop and her upper body leans forward over the guitar a little, the head bowed "
                   "LOWER than before (eyes still CLOSED), the bangs falling forward; her right hand has struck down through the strings "
                   "and is just below them over the bridge, the elbow a little higher." + KEEP_GUITAR,
    'R15_play_d4': "her chin is raised (the head comes up level and a little more, the face lifted, eyes still CLOSED, a calm, absorbed "
                   "face, mouth closed); her RIGHT hand is held ABOVE the strings, raised about a hand's width over the pickups, poised "
                   "to strike the next chord, the pick ready." + KEEP_GUITAR,
}
V_E = ("only her EYES: she OPENS her eyes: her teal eyes (#218EA3) open and look straight ahead, a little ABOVE the viewer (past the "
       "camera, towards the far side of the gates), steady and calm, not at the viewer's eyes. The eyebrows level, the mouth closed, "
       "the face otherwise exactly the same: not smiling, not crying. The head, hair, bow, hands, guitar and body do not move at all, "
       "line for line.")

# ---- the town ----
TOWN_HAND = (
    "Drawing style: exactly the drawing hand of the attached set-pack sheet: a printed illustration in ONE ink colour only, teal "
    "(#218EA3), on paper white: clean confident teal line art (outer contour a little heavier, inner lines thin and few), shadows "
    "and darker materials as clean, regular, round teal screentone dots (one dot size for light tone, a denser one for dark tone), "
    "solid teal or very dense teal dots for black hair and very dark clothes. White areas are paper white. No other colours: no grey, "
    "no black, no brown, no gradients, no airbrush, no glow, no blur, no paper texture, no pencil sketchiness. A crisp printed page, "
    "as drawn by a professional anime character designer.")
TSCALE = (
    "Framing and scale (the people are lined up side by side in the film at one scale): portrait canvas 2:3. The canvas shows a FIXED "
    "1.75 m of height: its top edge is 2.00 m above the floor and its bottom edge 0.25 m above the floor, so the figure is cut by the "
    "bottom edge at mid-calf (no feet in the picture). The person is exactly as tall on the canvas as their real height says: a 160 cm "
    "person's head top is 23% of the canvas height below the top edge, a 165 cm person's 20%, a 172 cm person's 16%, a 178 cm person's "
    "13%. Empty transparent space above is correct; do NOT enlarge the figure. Camera at eye level (1.4 m), straight on, long lens: no "
    "high or low angle. Natural adult proportions, about 7 heads tall.")
TLANYARD = (
    "Lanyard: a thin teal lanyard goes round the back of the neck; its two strands come forward over the collarbones and STOP about "
    "5 cm below the collarbones, cut off cleanly there (the film adds the lower lanyard and an empty clip later). The middle of the "
    "chest, from the collarbones down to the waist, must be clear and visible: no hand, arm or bag strap in front of it.")
TTAIL = ("One single person, alone. Fully TRANSPARENT background (PNG alpha) everywhere outside the figure: no floor, no cast shadow, no "
         "frame, no paper colour behind it; every part of the figure fully opaque, including its paper-white parts. No text, no labels, "
         "no logos, no watermark. Absolutely no red, pink or orange anywhere.")
TOWN_STYLE_REF = '../canon/town/p02_tanaka_misaki_officeworker.png'


def town_new(who, pose):
    return "\n".join(["One character illustration for a film shot: a NEW person of the same town, drawn in exactly the style of the "
                      "attached set-pack sheet (the sheet shows a different person: use it only for the drawing style, the line and the "
                      "screentone; this is someone else).", who,
                      "Pose: standing still in a station hall, body and face toward the viewer (front view), the HEAD BOWED forward and "
                      "the EYES LOOKING DOWN, eyelids lowered, a quiet empty face. Shoulders level and relaxed. " + pose,
                      TLANYARD, TSCALE, TOWN_HAND, TTAIL])


N = {
    't15_n3': town_new("A woman of about 50, 158 cm, a little plump, short permed dark hair with a few grey streaks, a knitted vest over "
                       "a blouse with a round collar, a long pleated skirt, a cloth shopping bag on her left shoulder.",
                       "Her right hand holds the strap of the shopping bag at her shoulder (at the side, the chest stays clear); her "
                       "left arm hangs relaxed."),
    't15_n5': town_new("A man of about 30, 175 cm, slim, short neat hair, round thin-rimmed glasses, a padded winter jacket zipped half "
                       "way over a hoodie, a small sling bag at his hip.",
                       "Both arms hang relaxed at his sides."),
    't15_n6': town_new("A woman of about 26, 163 cm, slim, long straight dark hair tied in a low ponytail falling over her right "
                       "shoulder, a belted trench coat, a small shoulder bag.",
                       "Her left hand holds the strap of her shoulder bag at her side; her right arm hangs relaxed."),
}

KEEP_BODY = " The body, shoulders, arms, hands, clothes and everything below the neck do not move at all, line for line."
V_TOWN1 = {
    't15_p8': ('t01_p8.png', "his RIGHT hand (the viewer's LEFT) comes up to his chest and pinches, between thumb and forefinger, an EMPTY "
               "card clip: the teal lanyard's two strands now continue down from his collarbones to the middle of his chest and end in a "
               "small plain clear-plastic card clip with NOTHING in it (no card); he holds that empty clip a little away from his chest. "
               "His head stays bowed and his eyes look down at the empty clip in his fingers, the brows drawn together, mouth pressed "
               "shut. His left arm still hangs relaxed. Everything else stays."),
    't15_p2': ('t01_p2.png', "her RIGHT hand (the viewer's LEFT) is now pressed flat on the middle of her chest, just below the collarbones, "
               "where her card used to hang (the palm on her chest, fingers together, slim adult hand); the inner ends of her eyebrows "
               "lift a little: a lost, puzzled face, head still bowed, eyes looking down. Her left side, the tote bag and everything else "
               "stay as they are."),
    't15_p9_turn': ('t01_p9.png', "only his HEAD and NECK: he turns his head about 70 degrees to the viewer's RIGHT, almost into profile "
                    "facing right, and looks with open eyes to the right, at someone standing a little in front of him: his eyes now "
                    "awake and open (no longer drowsy), the eyebrows raised slightly, the mouth closed. The messy hair turns with the head."
                    + KEEP_BODY),
    't15_p1_turn': ('t01_p1c.png', "only his HEAD and NECK: he turns his head about 70 degrees to the viewer's LEFT, almost into profile "
                    "facing left, and looks with open eyes to the left, at someone standing a little in front of him: the tired look gone, "
                    "the eyes open, the eyebrows raised slightly, the mouth a little open." + KEEP_BODY),
    't15_p7_turn': ('t01_p7.png', "only the two HEADS: the mother lifts her head and turns it about 40 degrees to the viewer's RIGHT, "
                    "looking forward and to the right with open eyes at someone standing in front of her (stunned, quiet: the eyes open, "
                    "the eyebrows raised a little, the mouth closed); her son on her arm also lifts his head and turns it the same way, his "
                    "round eyes wide open looking at the same person, mouth closed. Both faces stay clearly visible (three-quarter views). "
                    "Their bodies, her arm holding him, his hands and legs, the coat and everything below the necks do not move at all, "
                    "line for line."),
}
V_TOWN2 = {
    't15_n3_turn': ('t15_n3', "only her HEAD and NECK: she lifts her head and turns it about 45 degrees to the viewer's LEFT, looking "
                    "forward-left with open eyes at someone standing a little in front of her, frowning slightly (the brows drawn "
                    "together), the mouth closed." + KEEP_BODY),
    't15_n5_turn': ('t15_n5', "only his HEAD and NECK: he lifts his head and turns it about 45 degrees to the viewer's RIGHT, looking "
                    "forward-right with open eyes at someone standing in front of him, stunned: the eyes wide behind the glasses, the "
                    "eyebrows up, the mouth closed." + KEEP_BODY),
    't15_n6_turn': ('t15_n6', "only her HEAD and NECK: she lifts her head and turns it about 45 degrees to the viewer's LEFT, looking "
                    "forward-left with open eyes at someone standing in front of her, the lips slightly parted as if about to say "
                    "something, the eyebrows raised a little. The ponytail follows the head." + KEEP_BODY),
}


def write(name, text):
    open(os.path.join(here, name + '.txt'), 'w', encoding='utf-8').write(text + "\n")


if __name__ == '__main__':
    rnd = sys.argv[1] if len(sys.argv) > 1 else '1'
    out = []
    if rnd == '1':
        write('R15_play_d1', R15_D1); out.append(f"-R15_play_d1:{TURN}+{LP}+{HOLD}+{HANDS_REF}")
        for n, (src, ch) in V_TOWN1.items():
            write(n, variant(ch)); out.append(f"-{n}:{CUT}{src}")
        for n, t in N.items():
            write(n, t); out.append(f"-{n}:{TOWN_STYLE_REF}")
    elif rnd == '2':
        for n, ch in V_D.items():
            write(n, variant(ch)); out.append(f"-{n}:out/R15_play_d1.png+{TURN}+{LP}")
        for n, (src, ch) in V_TOWN2.items():
            write(n, variant(ch)); out.append(f"-{n}:out/{src}.png")
    elif rnd == '4':
        # round 2's turns drifted (Sato came out 20 years younger with a slimmer body, Yoshida with curly hair and a narrower
        # hoodie): the same change, with who he is spelled out and the canon sheet attached second for the face only
        SAME = (" He is the SAME man as in the first image: {who}. Keep his age, face shape, hairline and hair exactly; only the "
                "direction of the head changes. The outline of the body, the shoulder width and every fold of the clothes stay "
                "pixel for pixel where they are in the first image, so the two images overlay exactly below the chin.")
        R4 = {
            't15_p1_turn2': ('t01_p1c.png', 'p01_sato_kenta_salaryman.png', V_TOWN1['t15_p1_turn'][1] + SAME.format(
                who="a tired salaryman of about 50, a broad face with soft jowls, bags and lines under the eyes, short dark hair "
                    "combed to the side with a receding hairline and grey at the temples, a slightly heavy build")),
            't15_p9_turn2': ('t01_p9.png', 'p09_yoshida_ren_hoodie.png', V_TOWN1['t15_p9_turn'][1] + SAME.format(
                who="a tall young man of about 20 with spiky, messy straight dark hair falling over his forehead in pointed locks "
                    "(not curly, not wavy), a long face, an oversized hoodie")),
        }
        for n, (src, canon, ch) in R4.items():
            write(n, variant(ch)); out.append(f"-{n}:{CUT}{src}+../canon/town/{canon}")
    elif rnd == '3':
        write('R15_play_e', variant(V_E) + "\n" + LARGE); out.append(f"-R15_play_e:out/R15_play_d4.png+{TURN}+{FACES_REF}")
    print(' '.join(f'"{a}"' for a in out))
