"""Segment 15 (尾奏 riff) drawings for the FINISHED segment (after the blind review of the k508-k528 sample, design 甲):
docs/分镜/15_尾奏riff.md, plus the reviewers' must-fix list (work/seg/15/fin/plan.md).

Her (full colour, the R15_play_d* canvas: 2:3, top edge 1.80 m, bottom edge 0.55 m, 12.3 px/cm; R15_play_d1 is the master):
  - R15_play_a / _b / _c   d1 / d2 / d3 with one change: EYES OPEN, looking down at the strings (S2, the doors' countdown)
  - R15_look               R15_play_c with one change: head turned down to the viewer's left, looking at the open lane at her feet
  - R15_play_e3            d4 with one change: eyes open, looking a little ABOVE the camera and a little to the viewer's left
                           (out through the gates), NOT at the viewer (改定 5: the look into the lens belongs to segment 16)
  - R15_strum_1 (master, = d1 with eyes open and her own head angle) .. R15_strum_8: the S7 strumming keys, the head rising
The town (teal print):
  - t15_p8h, t15_p2h, t15_p9h, t15_p1h: the lane people re-drawn CLOSER for the pan (canvas top edge 2.00 m, bottom edge 0.72 m,
    12.0 px/cm), the same pose as their full-length drawings (t15_p8, t15_p2, t01_p9, t01_p1c)
  - t15_p9h_turn / t15_p1h_turn: the head turned to her, the eyes DOWN on her face (she is 25 cm shorter, 0.9 m to the side)
  - t15_n3_turn2: t15_n3 with the head turned to her (round 2's turn came out 20 years younger)
  - f15_sota_a / _b, f15_p6: the two reaction close-ups (portrait 2:3, the figure from the head to below the frame's bottom edge)
usage: python art/design/prompts/_make_seg15f.py <round>   -> writes the .txt prompts, prints the make_jobs arguments
"""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import variant, LARGE
from _make_seg15 import TOWN_HAND, TLANYARD, TTAIL, KEEP_BODY, TURN, LP, FACES_REF

CUT = '../cut/'
KEEP_GUITAR = (" The guitar stays exactly the same guitar in the same place and angle (its body, neck and headstock do not move), her LEFT "
               "hand stays on the neck as it is, her legs and skirt do not move, the canvas size and her size and position in it do "
               "not change.")
OPEN_DOWN = ("her EYES are now OPEN: her teal eyes (#218EA3) are open, the upper lids a little lowered, and she looks DOWN at the strings "
             "under her right hand (the irises low in the eyes); a calm, absorbed, unsmiling face, the mouth closed. The head, hair, bow, "
             "hands, guitar and body do not move at all, line for line.")

HER = {
    # name: (first reference, the change)
    'R15_play_a': ('../cut/R15_play_d1.png', OPEN_DOWN),
    'R15_play_b': ('../cut/R15_play_d2.png', OPEN_DOWN),
    'R15_play_c': ('../cut/R15_play_d3.png', OPEN_DOWN),
    'R15_play_e3': ('../cut/R15_play_d4.png',
                    "only her EYES: she OPENS her eyes: her teal eyes (#218EA3) open and look out over the viewer's head: the irises are pushed UP against the upper lids so a clear band of eye-white shows UNDER each iris, and both irises are shifted toward the viewer's LEFT corner of the eyes (the same direction in both eyes); the "
                    "sit HIGH in the eyes and a little to the viewer's LEFT, so she looks past the camera, above it and slightly to one "
                    "side, far away (towards the open gates behind the viewer). She must NOT look into the camera / at the viewer's eyes. "
                    "Steady and calm: the eyebrows level, the mouth closed, not smiling, not crying. The head, hair, bow, hands, guitar "
                    "and body do not move at all, line for line."),
}
LOOK = ("her HEAD turns DOWN and to the viewer's LEFT (about 30 degrees), as if she glances down at the open gate lane in front of her "
        "feet on the viewer's left: the eyes OPEN, the irises low and to the viewer's left, the face calm, the mouth closed; the bangs "
        "and the bow follow the head. Her right hand stops resting on the strings." + KEEP_GUITAR)

STRUM1 = ("her EYES are now OPEN, looking down at the strings (the irises low in the eyes, the upper lids a little lowered), the head bowed "
          "towards the strings; her right hand has just struck a DOWN-strum and stopped just below the strings over the bridge "
          "pickup; a calm, absorbed, unsmiling face, the mouth closed." + KEEP_GUITAR)
STRUM = {
    'R15_strum_2': "an UP-strum: her right hand has swung back UP and is just ABOVE the strings near the neck pickup, the wrist turned; her "
                   "head comes up a little from the bowed position (eyes still OPEN and still looking down at the strings); the bangs "
                   "swing to her right (the viewer's LEFT) with the movement.",
    'R15_strum_3': "a HEAVY DOWN-strum: her shoulders drop and her upper body leans forward over the guitar, the head bowed as LOW as it "
                   "goes (eyes open, looking at the strings), the bangs thrown forward; her right hand has struck down hard through the "
                   "strings and is below them over the bridge, the elbow higher.",
    'R15_strum_4': "the rebound after a heavy strum: her shoulders come back UP, the head still bowed low (eyes on the strings), her right "
                   "hand swung up and held about a hand's width ABOVE the strings over the pickups.",
    'R15_strum_5': "a DOWN-strum: the right hand just below the strings over the bridge; the head a little higher than in a bowed pose (a "
                   "quarter of the way up), nodding with the beat, the eyelids HALF lowered, still looking down at the strings.",
    'R15_strum_6': "an UP-strum: the right hand just above the strings near the neck pickup; the head comes up until the chin is level "
                   "(the face almost straight ahead), but the eyes still look DOWN at the strings (the irises low).",
    'R15_strum_7': "a DOWN-strum: the right hand just below the strings over the bridge; the head level and upright, the face straight to "
                   "the viewer, the eyes still LOWERED (lids half down, looking low), the mouth pressed shut.",
    'R15_strum_8': "her right hand raised and held still above the strings, about to strike; the head UPRIGHT and level, the face straight "
                   "to the viewer, the eyelids still LOW but the irises starting to come up, as if she is about to lift her eyes.",
}

# ---- the town, re-framed closer for the pan ----
TCLOSE = ("Framing and scale (the film lines these people up side by side at one scale): portrait canvas 2:3 showing a FIXED 1.28 m of "
          "height: the canvas top edge is 2.00 m above the floor and its bottom edge 0.72 m above the floor (12 px per cm), so the bottom "
          "edge cuts straight across the figure at the hips / upper thighs. {where} Camera at eye level (1.4 m), straight on, long lens: "
          "no high or low angle. The figure does NOT touch the left, right or top edges of the canvas: transparent space all round "
          "except at the bottom edge.")
REFRAME = ("Redraw the first attached image as the SAME person in the SAME pose with the SAME clothes, face, hair and expression, drawn "
           "in exactly the same teal print style, but framed CLOSER (a larger drawing of the upper body). The second attached image is "
           "this person's design sheet: keep the face, age and hair true to it. {pose}")
TOWN_CLOSE = {
    # name: (first reference, design sheet, the pose as it is in the first image, where the head top is)
    't15_p8h': ('t15_p8.png', 'p08_kato_daisuke_worker.png',
                "His head is bowed, his eyes look down at the EMPTY clear card clip that his right hand (the viewer's LEFT) pinches "
                "between thumb and forefinger at the end of his teal lanyard (nothing in the clip, no card); brows drawn together, "
                "mouth pressed shut; his left arm hangs relaxed.",
                "His bowed head top is 27% of the canvas height below the top edge; the body centred."),
    't15_p2h': ('t15_p2.png', 'p02_tanaka_misaki_officeworker.png',
                "Her head is bowed, eyes down; her right hand (the viewer's LEFT) lies flat on the middle of her chest just below the "
                "collarbones where her card used to hang; the inner ends of her eyebrows lifted a little: lost, puzzled; the tote bag "
                "on her other shoulder as in the first image.",
                "Her bowed head top is 29% of the canvas height below the top edge; the body centred."),
    't15_p9h': ('t01_p9.png', 'p09_yoshida_ren_hoodie.png',
                "His head is bowed, drowsy eyes looking down, mouth a little open; both hands in the hoodie's front pocket. " + TLANYARD,
                "He is tall: his bowed head top is 13% of the canvas height below the top edge; the body centred."),
    't15_p1h': ('t01_p1c.png', 'p01_sato_kenta_salaryman.png',
                "His head is bowed, tired eyes looking down; his right arm hangs, his left hand holds a briefcase whose top shows at the "
                "bottom edge (the briefcase may be cut by the bottom edge); the tie loosened a little. " + TLANYARD,
                "His bowed head top is 22% of the canvas height below the top edge; the body centred."),
}
TURN_DOWN = {
    't15_p9h_turn': ('t15_p9h', 'p09_yoshida_ren_hoodie.png',
                     "only his HEAD and NECK: he lifts his head and turns it about 60 degrees to the viewer's RIGHT (towards a girl "
                     "standing 90 cm to his left, a little in front of him, her face about 25 cm LOWER than his) and looks DOWN at her "
                     "with open, now-awake eyes: the irises to the right and LOW in the eyes, the gaze clearly going down and to the "
                     "viewer's right, not level and not upward; the eyebrows raised slightly, the mouth closed. The spiky dark hair turns "
                     "with the head. He is the same tall young man of about 20 with spiky, messy straight dark hair (not curly)."),
    't15_p1h2_turn': ('t15_p1h2', 'p01_sato_kenta_salaryman.png',
                     "only his HEAD and NECK: he lifts his head and turns it about 60 degrees to the viewer's LEFT (towards a girl standing "
                     "90 cm to his right, a little in front of him, her face about 30 cm LOWER than his) and looks DOWN at her with open "
                     "eyes: the irises to the left and LOW in the eyes, the gaze clearly going down and to the viewer's left, not level "
                     "and not upward; the tired look gone, the eyebrows raised slightly, the mouth a little open. He is the same tired "
                     "salaryman of about 50: broad face, soft jowls, lines under the eyes, receding hairline with grey temples."),
}
N3_TURN = ("only her HEAD and NECK: she lifts her head and turns it about 45 degrees to the viewer's LEFT, looking forward-left with open "
           "eyes at someone standing a little in front of her, frowning slightly (the brows drawn together), the mouth closed. She is "
           "the SAME woman of about 50 as in the first image: the same round, slightly plump middle-aged face with the soft cheeks and "
           "the lines at the eyes and mouth, the same short permed curly dark hair with grey streaks; keep her age exactly (not younger, "
           "not a girl's face)." + KEEP_BODY)

# ---- the two reaction close-ups ----
CU_SCALE = ("Framing: portrait canvas 2:3. {size} The figure is centred left-right and does NOT touch the left, right or top edges "
            "(transparent space there); only the bottom edge cuts the body. Camera at the person's eye height, straight on, long lens: "
            "no high or low angle.")
CU_TAIL = ("Drawn LARGE, the drawing stays exactly as simple as the town's set-pack sheet: the same clean teal line art and round "
           "screentone dots, a simple anime face (a tiny nose stroke at most, no nostrils), no extra lines, no texture, no realism. " + TTAIL)
SOTA = ("One character illustration, a CLOSE-UP of the small boy of the first attached image (Kobayashi Sota, about 5 years old, the son "
        "in the mother-and-son drawing; the second image is their design sheet): the same round face, the same hair and the same clothes "
        "as there. He is held up on his mother's arm (she is out of the picture, her arm below the bottom edge), so we see him from the "
        "top of his head down to below his chest. A thin teal lanyard round his neck comes down to his chest and STOPS about 4 cm below "
        "the collarbones, cut off cleanly (the film adds a small empty clip later); the middle of his chest stays clear. {act}")
SOTA_A = ("He has just turned to look at someone a little to the viewer's RIGHT and slightly ABOVE his eye level: head turned about 20 "
          "degrees to the viewer's right, the eyes looking right and a little up, eyes at their ordinary size, mouth closed, a quiet, "
          "attentive face; his small left hand (the viewer's right) rests loosely at his collar.")
P6 = ("One character illustration, a CLOSE-UP of the young woman of the first attached image (Yamamoto Sakura, a university student, "
      "about 20; the second image is her design sheet): the same face, hair and long coat with backpack straps. We see her from the top "
      "of her head down to the middle of her chest. She looks to the viewer's RIGHT (head turned about 40 degrees right) and a little "
      "DOWN, at someone shorter standing in front of her, the lips slightly parted, listening, stunned and quiet (not smiling, not "
      "crying). Her LEFT hand (the viewer's RIGHT) has just pulled the earbud out of her left ear and stops just below that ear, the "
      "fingers loosely together, holding nothing visible (the film adds the earbud and its wire). Her right ear still has a small "
      "white earbud in it. A thin teal lanyard round her neck comes down and STOPS about 4 cm below the collarbones, cut off cleanly.")

# ---- two more people of the town for the right side of the seven-lane wide (S2 only): full length, the 01 scale ----
from _make_seg15 import TSCALE
def town_canon(who, pose):
    return "\n".join(["One character illustration for a film shot: the person of the attached design sheet (keep the face, age, hair, "
                      "build and clothes true to it), drawn in exactly the style of that sheet.", who,
                      "Pose: standing still in a station hall, body and face toward the viewer (front view), the HEAD BOWED forward and "
                      "the EYES LOOKING DOWN, eyelids lowered, a quiet empty face. Shoulders level and relaxed. " + pose,
                      TLANYARD, TSCALE, TOWN_HAND, TTAIL])
EXTRA = {
    't15_p4': ('p04_ito_ryo_cramschool.png', town_canon("Ito Ryo, a cram-school student of the design sheet.",
               "Both arms hang relaxed; a rucksack on his back (only the straps show at the shoulders).")),
    't15_p5': ('p05_watanabe_sho_gakuran.png', town_canon("Watanabe Sho, a high-school boy in a black gakuran of the design sheet.",
               "His right hand holds the strap of a school bag hanging at his side; his left arm hangs relaxed.")),
}

# round 1's t15_p1h came out 15 years younger (no jowls, no grey): the same reframe with who he is spelled out
P1_AGE = (" He is a tired salaryman of about 50 (the first image): a broad, slightly heavy face with soft jowls and sagging cheeks, "
          "bags and lines under the eyes and at the mouth, short dark hair combed to the side with a receding hairline and GREY at the "
          "temples (light screentone grey streaks), a slightly heavy middle-aged build. Not younger: keep every sign of his age.")

# round 1's f15_p6 had no headphones (her design wears big over-ear headphones, not earbuds) and touched the canvas sides:
# landscape, the over-ear headphones, one cup just pulled off her ear
P6B = ("One character illustration, a CLOSE-UP of the young woman of the first attached image (Yamamoto Sakura, a university student, "
       "about 20; the second image is her design sheet): the same face, the same wavy light hair, the same long light coat over a dark "
       "turtleneck, the same backpack straps, and the same big over-ear HEADPHONES as in the first image. We see her from the top of her "
       "head down to the middle of her chest. She looks to the viewer's RIGHT (head turned about 35 degrees right) and a little DOWN, at "
       "someone shorter standing in front of her, the lips slightly parted, listening, stunned and quiet (not smiling, not crying). With "
       "her LEFT hand (the viewer's RIGHT) she has just pulled the LEFT cup of the headphones off her ear: the hand holds that cup a few "
       "centimetres away from and below the ear, the headband still over her head, the other cup still on her right ear. A thin teal "
       "lanyard round her neck comes down and STOPS about 4 cm below the collarbones, cut off cleanly.")
CU_LAND = ("Framing: LANDSCAPE canvas 3:2 (wider than tall). The canvas shows 43 cm of height (24 px per cm): the top of her head is 10% "
           "of the canvas height below the top edge; the figure is centred left-right, her shoulders and arms well INSIDE the left and "
           "right edges with clear transparent space on both sides (the shoulders take at most two thirds of the canvas width); only "
           "the bottom edge cuts the body. Camera at her eye height, straight on, long lens: no high or low angle.")


def write(name, text):
    open(os.path.join(here, name + '.txt'), 'w', encoding='utf-8').write(text + "\n")


if __name__ == '__main__':
    rnd = sys.argv[1] if len(sys.argv) > 1 else '1'
    out = []
    if rnd == '1':                       # everything without a dependency
        for n, (ref, ch) in HER.items():
            text = variant(ch) + ("\n" + LARGE if n == 'R15_play_e3' else '')
            write(n, text); out.append(f"-{n}:{ref}+{TURN}" + (f"+{FACES_REF}" if n == 'R15_play_e3' else ''))
        write('R15_strum_1', variant(STRUM1)); out.append(f"-R15_strum_1:../cut/R15_play_d1.png+{TURN}+{LP}")
        for n, (src, canon, pose, where) in TOWN_CLOSE.items():
            write(n, "\n".join([REFRAME.format(pose=pose), TCLOSE.format(where=where), TOWN_HAND, TTAIL]))
            out.append(f"-{n}:{CUT}{src}+../canon/town/{canon}")
        write('t15_n3_turn2', variant(N3_TURN)); out.append(f"-t15_n3_turn2:{CUT}t15_n3.png")
        write('f15_sota_a', "\n".join([SOTA.format(act=SOTA_A), CU_SCALE.format(size="The canvas shows 51 cm of height (30 px per cm): the top of his head is 10% of the canvas height below the top edge."), TOWN_HAND, CU_TAIL]))
        out.append(f"-f15_sota_a:{CUT}t15_p7_turn.png+../canon/town/p07_kobayashi_yumi_and_sota.png")
        write('f15_p6', "\n".join([P6, CU_SCALE.format(size="The canvas shows 64 cm of height (24 px per cm): the top of her head is 12% of the canvas height below the top edge."), TOWN_HAND, CU_TAIL]))
        out.append(f"-f15_p6:{CUT}t01_p6.png+../canon/town/p06_yamamoto_sakura_student.png")
    elif rnd == '1b':
        for n, (canon, text) in EXTRA.items():
            write(n, text); out.append(f"-{n}:../canon/town/{canon}")
    elif rnd == '1c':
        src, canon, pose, where = TOWN_CLOSE['t15_p1h']
        write('t15_p1h2', "\n".join([REFRAME.format(pose=pose + P1_AGE), TCLOSE.format(where=where), TOWN_HAND, TTAIL]))
        out.append(f"-t15_p1h2:{CUT}{src}+../canon/town/{canon}")
        src, canon, ch = TURN_DOWN['t15_p9h_turn']
        write('t15_p9h_turn', variant(ch + KEEP_BODY)); out.append(f"-t15_p9h_turn:out/{src}.png+../canon/town/{canon}")
    elif rnd == '2b':
        write('f15_p6b', chr(10).join([P6B, CU_LAND, TOWN_HAND, CU_TAIL]))
        out.append(f"-f15_p6b:{CUT}t01_p6.png+../canon/town/p06_yamamoto_sakura_student.png")
        n, (src, canon, ch) = 't15_p1h2_turn', TURN_DOWN['t15_p1h2_turn']
        write(n, variant(ch + KEEP_BODY)); out.append(f"-{n}:out/{src}.png+../canon/town/{canon}")
        write('f15_sota_b', variant("only his face and hands: his eyes open WIDE and round, his mouth opens into a small round 'o', and "
                                    "his small hand grips the drawstring of his hood tightly. The head direction, hair, clothes and everything else stay."))
        out.append("-f15_sota_b:out/f15_sota_a.png")
    elif rnd == '2':                     # the variants of round 1's masters
        write('R15_look', variant(LOOK)); out.append(f"-R15_look:out/R15_play_c.png+{TURN}")
        for n, ch in STRUM.items():
            write(n, variant(ch + KEEP_GUITAR)); out.append(f"-{n}:out/R15_strum_1.png+{TURN}+{LP}")
        for n, (src, canon, ch) in TURN_DOWN.items():
            if n == 't15_p9h_turn': continue       # made in round 1c
            write(n, variant(ch + KEEP_BODY)); out.append(f"-{n}:out/{src}.png+../canon/town/{canon}")
        write('f15_sota_b', variant("only his face and hands: his eyes open WIDE and round, his mouth opens into a small round 'o', and "
                                    "his small hand grips his collar tightly. The head direction, hair, clothes and everything else stay."))
        out.append(f"-f15_sota_b:out/f15_sota_a.png")
    print(' '.join(f'"{a}"' for a in out))
