"""Segment 05 (riff「ノーフィクション」, docs/分镜/05_riff_ノーフィクション.md) drawings for the two designs of the samples.

Shared by both designs:
  - s05_pluck  (P5d)  close-up of her right hand strumming over the gold top, front, eye level with the guitar
  - s05_aim    (P5f)  waist-up, body to the viewer, the neck held level to the viewer's RIGHT like a rifle barrel, her head turned
                      to her left (viewer's right) in profile, looking down the neck at the board (which stands at the right edge)
                      NOTE: the storyboard asks for "facing left, neck pointing left, camera on her right"; a right-handed player
                      cannot point the neck the way she faces, so the physically right version is body to us, head turned along the
                      neck. The board goes to the right edge.
  - s05_sneer  (P5e)  head and shoulders, front, looks into the camera, one corner of the mouth up (the only direct look)
Design 乙 (she faces the wall):
  - s05_back_full (P5a) back view, full figure, playing; the empty gig bag lies open on the floor beside her feet
  - s05_ots       (P5b) the back of her head, bow and shoulders, closer (s05_back_full as the first reference: same clothes, guitar)
  - s05_tilt      (P5c) s05_ots with one change: the head thrown back, the neck raised about 15 degrees
Design 甲 (she faces us):
  - a05_front_full  front view, full figure, playing, eyes down on the neck
  - a05_front_waist front view, waist-up (the punch-through shot), head bowed a little, eyes down, mouth closed
  - a05_shout       a05_front_waist with one change: head up, shouting, eyes above the camera (not into it)
  - a05_toss        a05_front_waist with one change: the head thrown back and to her left, hair swinging out

Scales: the full figures on a 2:3 canvas showing a fixed 1.90 m (top edge 1.87 m above the floor, bottom edge 3 cm below it); the
page measures every drawing's alpha box anyway and places it by her real height (152 cm to the top of the head).
Written without _style.txt (jobs listed with a leading '-'): that file asks for a white background.
usage: python art/design/prompts/_make_seg05.py [round]   -> writes the .txt prompts and prints the make_jobs arguments
"""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import IDENTITY, DRAW, SHEET_RULE, HANDS, LARGE, NEVER, variant

TURN = '../canon/rin_turnaround.png'
LP = '../canon/lespaul_goldtop_front_side_back.png'
BAG = '../canon/gigbag_front_back_side_open.png'
EXPR = '../canon/rin_expressions.png'
HANDS_REF = '../ref/sheet_hands.png'
FACES_REF = '../ref/sheet_faces.png'
PLAYING = '../cut/rmid_bang2.png'          # Demo 2: how she holds and strums this guitar (pose only)

LIGHT = ("Lighting: plain even morning daylight inside a school entrance hall, the flat colours of the turnaround, one hard-edged "
         "shadow tone per material.")
ALPHA = ("Fully TRANSPARENT background (PNG alpha) everywhere outside her and the guitar: no floor, no wall, no shadow, no frame, no "
         "scenery. Every part of her and the guitar fully opaque. No text, no logos. No red anywhere.")
GUITAR = (
    "The guitar is the gold-top Les Paul of the second attached image; match it exactly: gold top, cream binding, two cream P-90 "
    "pickups, cream pickguard, one silver bar bridge, four gold knobs, black headstock with NO logo or text, 3+3 tuners with cream "
    "buttons, rosewood fretboard with cream trapezoid inlays; the back and sides are dark brown. True size for a 152 cm girl: from the "
    "end of the body to the tip of the headstock the guitar is about two thirds of her height. A plain black strap. She plays it "
    "right-handed: her LEFT hand on the neck, her RIGHT hand strumming with a small cream pick. The third attached image shows how she "
    "holds and strums this guitar (use it for the hold only, not for the drawing style, background or face).")
CARD_BLANK = (
    "Her name card hangs on the teal lanyard in front of her chest, ABOVE the guitar body, fully visible and facing the viewer: a white "
    "landscape card 15 x 10 cm in a thin clear holder, its face left completely plain white (nothing printed on it: the film prints on "
    "it later), not covered by her arm, the strap or the guitar.")
FULL_SCALE = (
    "Framing and scale (important: the film places this drawing by measurement): portrait canvas 2:3 showing a FIXED 1.90 m of height: "
    "the top edge is 1.87 m above the floor and the bottom edge 3 cm below the floor, so the soles of her loafers stand just above the "
    "bottom edge. She is 152 cm tall: the top of her head (not the bow) is 18% of the canvas height below the top edge; the bow rises "
    "higher. Do NOT enlarge her to fill the canvas. Camera exactly at her eye height (about 1.4 m), straight on, long lens: no high or "
    "low angle, no perspective distortion, shoulders level. The whole guitar, including the headstock, inside the canvas with a margin.")
WAIST = (
    "Framing: landscape canvas 3:2, waist-up: the top of the bow about 6% below the top edge, the bottom edge cutting straight across "
    "her hips and the guitar body (the lower part of the guitar body is cut by the bottom edge). Camera exactly at her eye height, "
    "straight on, long lens: no high or low angle, shoulders level.")


def her(subject, extra=(), ident=IDENTITY, large=False, hands=True, alpha=ALPHA):
    parts = [ident, subject, *extra, DRAW, SHEET_RULE, LIGHT]
    if large: parts.append(LARGE)
    if hands: parts.append(HANDS)
    parts += [NEVER, alpha]
    return "\n".join(parts)


ID_BACK = IDENTITY.replace("a teal lanyard with her white name card in a clear holder",
                           "a thin teal lanyard round her neck (her card hangs in front of her chest, out of sight from behind)")
ID_SIDE = IDENTITY.replace("a teal lanyard with her white name card in a clear holder",
                           "a thin teal lanyard round her neck with her white name card in a clear holder (the card turned edge-on, "
                           "its face not visible)")

BACK_FULL = her(
    "This drawing: she stands on a flat floor seen exactly from BEHIND (as the back view on the turnaround), the viewer standing "
    "behind her at her eye height; she faces away from us and plays the guitar. Full figure, from the top of the bow to the soles of "
    "her loafers, feet a little apart, standing firmly, weight even. Both arms are in front of her body. Her LEFT arm reaches out to "
    "the viewer's LEFT along the guitar neck: the neck and headstock stick out beyond her left side, pointing to the viewer's LEFT and "
    "a little up (about 20 degrees above horizontal), the headstock clearly outside her silhouette at about the height of her "
    "shoulders; from behind we see the BACK of the neck and headstock (dark brown wood, the six small metal tuner backs, the cream "
    "tuner buttons), no frets or fretboard. Her RIGHT elbow is bent and sticks out a little to the viewer's RIGHT, the forearm going "
    "forward to the strings out of sight in front of her; the dark brown edge of the guitar body shows a little beside her right hip. "
    "The black strap runs diagonally across her back from her LEFT shoulder (viewer's LEFT) down to her RIGHT hip. The teal lanyard "
    "shows only as a thin teal line round the back of her neck under the hair. The bow, the back of her blonde bob, the back of the "
    "charcoal blazer, the pleated skirt, black knee socks and brown loafers exactly as the turnaround's back view.\n"
    "Beside her feet on the viewer's RIGHT lies the empty black gig bag of the fourth attached image, unzipped and opened flat on the "
    "floor, empty, its open side up, seen from her eye height so it is a long low flat shape on the floor (about 110 cm long, lying "
    "parallel to the bottom edge, its near end a little in front of her right foot); it never covers her feet.",
    [GUITAR, FULL_SCALE,
     "Her body centred at about 55% of the canvas width from the left, so the headstock fits inside the canvas."],
    ident=ID_BACK, alpha=ALPHA.replace("her and the guitar", "her, the guitar and the gig bag").replace("no floor, ", "no floor line, "))

PLUCK = "\n".join([
    "One drawing for a film shot: a CLOSE-UP of the girl on the attached turnaround (Kagamine Rin in this film's design, 14 years old, "
    "152 cm) strumming her guitar: only her right hand and forearm, the guitar body, and behind it a little of her charcoal blazer's "
    "hem and pleated skirt.",
    "Seen from the FRONT, the camera straight on to the guitar top at the height of the guitar (no angle). Landscape canvas 3:2. The "
    "guitar's gold top fills most of the canvas: the bridge P-90 pickup, the neck P-90 pickup, the silver bar bridge, the edge of the "
    "cream pickguard and the four gold knobs are all in the picture; the six strings run across the canvas from the bridge at the "
    "lower LEFT up towards the neck at the upper RIGHT, rising about 15 degrees, and leave the canvas at the right edge (the neck "
    "itself is cut by the right edge). The body's rounded lower bout and cream binding are cut by the left and bottom edges.",
    "Her RIGHT hand (a 14-year-old girl's: small and slim) holds a small cream pick between the thumb and the side of the bent index "
    "finger and is caught in the middle of a strong DOWNSTROKE across all six strings between the two pickups, the other fingers "
    "loosely curled; her forearm in the charcoal blazer sleeve with a white shirt cuff comes in from the upper LEFT, resting on the top "
    "edge of the guitar body. Behind the guitar, at the top of the canvas, the hem of her charcoal blazer and her charcoal pleated skirt.",
    GUITAR.split(" The third attached image")[0].replace("True size for a 152 cm girl: from the end of the body to the tip of the "
    "headstock the guitar is about two thirds of her height. A plain black strap. She plays it right-handed: her LEFT hand on the neck, "
    "her RIGHT hand strumming with a small cream pick.", "True proportions: her whole hand is about as long as the bridge pickup is "
    "from the neck pickup's far edge, i.e. the hand is small against the guitar body."),
    "The pickups, bridge, strings and knobs drawn exactly and cleanly (six strings, evenly spaced; the bar bridge one silver bar).",
    DRAW, SHEET_RULE, LIGHT, HANDS, NEVER,
    "Fully TRANSPARENT background (PNG alpha) everywhere outside her, her clothes and the guitar (if any corner of the canvas shows past "
    "them). No text, no logos. No red anywhere."])

AIM = her(
    "This drawing: she stands and holds the guitar like a rifle. Her BODY faces the viewer (front view, turned at most 10 degrees to the "
    "viewer's right), her shoulders level. The guitar is lifted across her body and its NECK points straight out to the viewer's RIGHT, "
    "perfectly HORIZONTAL (level, like a rifle barrel aimed at something off the right edge); the guitar body sits against her right "
    "hip and belly on the viewer's LEFT side, its gold top facing the viewer; the headstock ends about 7% of the canvas width from the "
    "right edge. Her LEFT hand (on the viewer's RIGHT) grips the neck about halfway along it, her left arm stretched out along the neck. "
    "Her RIGHT hand (on the viewer's LEFT) rests on the strings over the bridge, just after a downstroke, holding a small cream pick. "
    "Her HEAD is turned sharply to her left (towards the viewer's RIGHT), so we see her face in PROFILE facing right (exactly as the side "
    "view on the turnaround: the three white hairclips, the side of the bow, the small nose as a single tiny point of the profile line); "
    "her teal eye looks along the neck towards the headstock and beyond it, the upper eyelid lowered, cold and calm, mouth closed. The "
    "teal lanyard hangs from her neck, the card turned edge-on (its face not visible).",
    [GUITAR,
     "Framing: landscape canvas 3:2, waist-up: the top of the bow about 6% below the top edge, the bottom edge cutting straight across "
     "her upper thighs and the lower part of the guitar body. Her body centred at about 34% of the canvas width from the left, so the "
     "whole neck and headstock fit inside the canvas on the right. Camera exactly at her eye height, straight on, long lens: no high or "
     "low angle, no perspective distortion."],
    ident=ID_SIDE)

SNEER = her(
    "This drawing: a close portrait, head and shoulders, front view, the camera exactly at her eye height, straight on. She looks "
    "straight into the camera with her eyes raised to it, the upper eyelids a little lowered; ONE corner of her mouth (the corner on "
    "the viewer's LEFT) is pulled up in a small cold smirk, the other corner straight: the cold smile of the third face on the second "
    "attached image (row 1, third from the left), but sharper and colder. Her head is level. Her hair is still swinging from a toss of "
    "the head: the tips of the bob on both sides are swung out a little towards the viewer's right, two or three locks of the bangs "
    "lifted and settling, drawn as the same few clean clumps as the turnaround (not broken into strands). The teal lanyard goes round "
    "her neck and down out of the bottom edge (the card is below the frame); a plain black guitar strap goes over her LEFT shoulder (on "
    "the viewer's right) and down out of the bottom edge.",
    ["Framing: landscape canvas 3:2: the top of the bow about 4% below the top edge, the bottom edge cutting across her chest just below "
     "the knot of her teal ribbon tie (no card in the picture); her face centred horizontally."],
    large=True, hands=False)

FRONT_FULL = her(
    "This drawing: she stands on a flat floor facing the viewer (front view) and plays the guitar. Full figure, from the top of the bow "
    "to the soles of her loafers, feet a little apart, standing firmly. The guitar hangs on its strap across her body: the body at her "
    "right hip (viewer's LEFT), the neck rising to the viewer's RIGHT at about 25 degrees, the headstock at about the height of her "
    "shoulder, outside her silhouette. Her RIGHT hand strums over the strings near the bridge pickup with a pick, her LEFT hand frets a "
    "chord on the neck. Her head is bowed a little and her eyes look DOWN at her fretting hand, eyelids lowered, cold and calm, mouth "
    "closed. The strap goes over her LEFT shoulder (viewer's right).",
    [CARD_BLANK, GUITAR, FULL_SCALE, "Her body centred at about 45% of the canvas width from the left, so the headstock fits inside the canvas."])

FRONT_WAIST = her(
    "This drawing: she stands facing the viewer (front view) and plays the guitar hard. The guitar hangs on its strap across her body: "
    "the body at her right hip (viewer's LEFT), the neck rising to the viewer's RIGHT at about 25 degrees, the headstock at about the "
    "height of her shoulder and outside her silhouette. Her RIGHT hand strums down across the strings near the bridge pickup with a "
    "pick, her LEFT hand frets a chord on the neck. Her head is bowed a little and her eyes look DOWN at the strings, eyelids lowered, "
    "mouth closed: gathering herself before she shouts. The strap goes over her LEFT shoulder (viewer's right).",
    [CARD_BLANK, GUITAR, WAIST, "Her body centred at about 44% of the canvas width from the left, so the whole headstock fits inside the canvas."])

V2 = {
    'a05_shout': ('a05_front_waist', "she lifts her HEAD level and SHOUTS: her mouth wide open in a shout (the shouting mouth of the "
                  "fourth face on the third attached image), her eyes wide open looking forward and a little UP, over the top of the "
                  "camera (NOT into the camera), her eyebrows drawn down hard, fierce. The bow and bangs follow the head. Her body, both "
                  "arms and hands, the guitar, the strap, the lanyard and the card do not move at all."),
    'a05_toss': ('a05_front_waist', "she throws her HEAD back and to her left (towards the viewer's RIGHT) in a hard head toss: the chin "
                 "up, the face tilted up and turned a little to the viewer's right, eyes squeezed shut, mouth open in a shout; the bob "
                 "swings out to the viewer's RIGHT, the bow tilts with the head. Her body, both arms and hands, the guitar, the strap, "
                 "the lanyard and the card do not move at all."),
}

OTS = her(
    "This drawing: the same girl as the first attached image (same clothes, same guitar, same black strap, the same back view and pose), "
    "seen much CLOSER from directly behind her, the camera level at the height of her head: the back of her head with the big white "
    "bow, the back of her blonde bob, her shoulders and her upper back; the bottom edge of the canvas cuts straight across her back at "
    "about the height of her elbows. She plays the guitar: her LEFT arm reaches out to the viewer's LEFT along the guitar neck, and the "
    "neck rises from the lower left past her left side towards the upper LEFT at about 25 degrees above horizontal, the BACK of the "
    "neck and headstock showing (dark brown wood, the six small metal tuner backs, cream tuner buttons), the headstock tip about 12% of "
    "the canvas width from the left edge and at about the height of her ear; her RIGHT elbow sticks out a little to the viewer's RIGHT "
    "at the lower right. The black strap runs diagonally across her back from her LEFT shoulder down to the lower right. A thin teal "
    "lanyard line round the back of her neck under the hair. Drawn for this size: the bow's two loops and knot, the headband and the "
    "hair as the same few clean shapes as the turnaround's back view, a little more care in their edges, nothing added.",
    ["Framing: landscape canvas 3:2; her head centred horizontally; the top of the bow about 7% below the top edge.",
     GUITAR.replace("The third attached image shows how she holds and strums this guitar (use it for the hold only, not for the drawing "
                    "style, background or face).", "The second attached image is the guitar; the third is her turnaround.")],
    ident=ID_BACK, hands=False)

V3 = {
    's05_tilt': ('s05_ots', "she throws her HEAD BACK: the chin goes up, so the back of her head tips back towards the viewer and down "
                 "towards her shoulders (we see a little more of the top of the head and the bow tilted back, its loops leaning towards "
                 "the viewer), the bob falls back against her collar; AND the guitar neck is lifted about 15 degrees higher (now about "
                 "40 degrees above horizontal), the headstock higher and a little further left, her left arm following it. Her shoulders, "
                 "back, right arm and the strap stay where they are."),
}


# Round 4 (the finished segment, design 乙 after the blind review): the back view must ACT in the punch-through shot, readable
# from behind at phone size; the smirk must be cold and one-sided. Two tries of each (_1, _2), the better one goes to art/cut.
V4 = {
    's05_strike': ('s05_ots', "she leans into a shout with all her strength and hits the strings in a huge downstroke: her shoulders hunch "
                   "UP and FORWARD, her upper back rounds and leans forward towards the wall in front of her, her head pushes forward "
                   "and a little down (as when screaming at the wall), so the back of her neck shows a little more under the hair; the "
                   "tips of her blonde bob flick OUTWARDS to both sides with the jolt; her RIGHT elbow is flung high and wide out to the "
                   "viewer's RIGHT, the right upper arm in the charcoal sleeve clearly visible out to the right at the height of her "
                   "shoulder blade, angled down to the forearm going forward to the strings out of sight. The guitar neck, the headstock "
                   "and her left hand stay where they are."),
    's05_throw': ('s05_ots', "she throws her head and the guitar UP: her head is thrown far back (chin high, face to the ceiling), so her "
                  "blonde bob swings back and FLARES OUT wide to both sides in a few big clean clumps, and the big white bow tips back "
                  "towards the viewer, its two loops flung up and apart; her back arches a little; the guitar NECK swings up STEEPLY to "
                  "about 60 degrees above horizontal like a rifle raised to fire at the sky, the headstock now high up at the height of "
                  "her bow and further left, her left arm raised high along it; her RIGHT elbow is flung out wide to the viewer's RIGHT "
                  "after the strum, the right upper arm in the charcoal sleeve clearly visible out to the right. The headstock still "
                  "ends at least 8% of the canvas width inside the left edge and below the top of the bow."),
    's05_cold': ('s05_sneer', "ONLY her mouth, eyes and eyebrows change, into a cold, contemptuous smirk: the mouth closed, its corner on the "
                 "viewer's LEFT pulled clearly UP into the cheek (a small curved crease beside it), the other corner flat and a touch "
                 "DOWN, so the mouth is a lopsided slanting line, plainly one-sided; the upper eyelids lowered to cover the top third of "
                 "the irises and the lower lids raised a little, so the eyes are narrowed, half-lidded and cold, still looking straight "
                 "into the camera from under the lids; the inner ends of the eyebrows drawn lower and flatter, the eyebrow on the "
                 "viewer's right raised a touch higher than the other. Not friendly, not pleased: cold, looking down on someone. The "
                 "face shape, nose, bow, hair, hairclips, clothes, strap and framing do not change at all."),
}


def write(name, text):
    open(os.path.join(here, name + '.txt'), 'w', encoding='utf-8').write(text + "\n")


if __name__ == '__main__':
    rnd = sys.argv[1] if len(sys.argv) > 1 else '1'
    out = []
    if rnd == '1':
        write('s05_back_full', BACK_FULL); out.append(f"-s05_back_full:{TURN}+{LP}+{PLAYING}+{BAG}+{HANDS_REF}")
        write('a05_front_waist', FRONT_WAIST); out.append(f"-a05_front_waist:{TURN}+{LP}+{PLAYING}+{HANDS_REF}")
        write('s05_aim', AIM); out.append(f"-s05_aim:{TURN}+{LP}+{PLAYING}+{HANDS_REF}")
        write('s05_pluck', PLUCK); out.append(f"-s05_pluck:{TURN}+{LP}+{PLAYING}+{HANDS_REF}")
        write('s05_sneer', SNEER); out.append(f"-s05_sneer:{TURN}+{EXPR}+{FACES_REF}")
        write('a05_front_full', FRONT_FULL); out.append(f"-a05_front_full:{TURN}+{LP}+{PLAYING}+{HANDS_REF}")
    elif rnd == '2':
        write('s05_ots', OTS); out.append(f"-s05_ots:out/s05_back_full.png+{LP}+{TURN}")
        for n, (src, ch) in V2.items():
            write(n, variant(ch) + "\n" + LARGE); out.append(f"-{n}:out/{src}.png+{TURN}+{EXPR}+{FACES_REF}")
    elif rnd == '3':
        for n, (src, ch) in V3.items():
            write(n, variant(ch)); out.append(f"-{n}:out/{src}.png+{TURN}")
    elif rnd == '4':
        for n, (src, ch) in V4.items():
            extra = f"+{EXPR}+{FACES_REF}" if n == 's05_cold' else f"+{LP}"
            text = variant(ch) + ("\n" + LARGE if n == 's05_cold' else "")
            for k in (1, 2):
                write(f"{n}_{k}", text); out.append(f"-{n}_{k}:cut/{src}.png+{TURN}{extra}")
    elif rnd == '5':
        # round 4 pointed its first reference at art/design/cut (it does not exist); the throws and the smirks are redone with the
        # master at art/cut, plus a third strike that keeps the body its size (the round-4 strikes swell the back into a hump)
        for n in ('s05_throw', 's05_cold'):
            src, ch = V4[n]
            extra = f"+{EXPR}+{FACES_REF}" if n == 's05_cold' else f"+{LP}"
            text = variant(ch) + ("\n" + LARGE if n == 's05_cold' else "")
            for k in (1, 2):
                write(f"{n}_{k}", text); out.append(f"-{n}_{k}:../cut/{src}.png+{TURN}{extra}")
        write('s05_strike_3', variant(V4['s05_strike'][1].replace(
            "her shoulders hunch UP and FORWARD, her upper back rounds and leans forward towards the wall in front of her,",
            "her shoulders lift UP a little and her upper body leans forward towards the wall in front of her (the back and shoulders "
            "keep exactly their size and width: no hump, the back is not enlarged),")))
        out.append(f"-s05_strike_3:../cut/s05_ots.png+{TURN}+{LP}")
    elif rnd == '6':
        # the round-5 throws read well (hair flared, neck raised) but show a nose poking up between the bow loops and drop the whole
        # figure lower in the canvas; redone with the face hidden and the figure kept in place
        ch = ("she throws her head BACK and swings the guitar UP: the chin lifts and the back of her head tips back about 30 degrees "
              "(NOT further: her face, nose and chin stay completely hidden behind her head, no skin shows above the hair), so the "
              "big white bow tilts back towards the viewer with its two loops flung up and apart, and her blonde bob swings back and "
              "FLARES OUT wide to both sides in a few big clean clumps; the guitar NECK swings up steeply to about 55 degrees above "
              "horizontal, the headstock higher and a little further left, her left arm raised along it; her RIGHT elbow is flung out "
              "wide to the viewer's RIGHT after the strum, the right upper arm in the charcoal sleeve clearly visible out to the right. "
              "Keep the figure exactly the same SIZE and at the same PLACE in the canvas as the first image: her shoulders and the "
              "strap at the same height, the head the same size. The headstock ends at least 8% of the canvas width inside the left "
              "edge and below the top of the bow.")
        for k in (3, 4):
            write(f"s05_throw_{k}", variant(ch)); out.append(f"-s05_throw_{k}:../cut/s05_ots.png+{TURN}+{LP}")
    print(' '.join(f'"{a}"' for a in out))
