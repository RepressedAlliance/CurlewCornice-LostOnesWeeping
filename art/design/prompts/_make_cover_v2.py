"""Release cover v2 (2026-11-22). The v1 cover (a cut-out figure pasted on a halftone square) was rejected: it told no story
and lost everything at feed size. Four directions, each drawn WHOLE by Codex as one picture (world + her), two tries each:

  cv2_unreadable  her card held out at us, a scribbled card the machine cannot read; she stares: "even this?"
                  (the name field is left blank: code writes 読み取れません into it)
  cv2_swing       the frame before the smash: the gold Les Paul coming down on the ticket gate; anger and tears
                  (the gate's display is left blank: code writes 読み取れません)
  cv2_onlycolor   a printed grid of one identical teal student, every cell read OK; she alone in colour breaks her cell
                  (the header band is left blank: code sets the title as the sheet's header)
  cv2_smile       after: the gate wrecked, the guitar planted in it; she walks off and looks back at us with a small smile

Rules for every one: 3:2 landscape; all key content inside the centre (14-86% of the width, 9-91% of the height) so the
16:9 and the 4:3 crops keep it; a quiet area left for the title; no letters drawn by Codex (code sets all type).
usage: python art/design/prompts/_make_cover_v2.py [name ...] -> writes the .txt prompts and prints make_jobs arguments
"""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from rules import IDENTITY, DRAW, LARGE, HANDS, NEVER

TURN = 'board/rin_A2.png'
FACES = '../ref/sheet_faces.png'
HANDS_REF = '../ref/sheet_hands.png'
LP = '../canon/lespaul_goldtop_front_side_back.png'
GATE = '../canon/ticket_gate_front_side.png'
CARD = '../canon/card_front_hers_overflow.png'
PEOPLE = 'board/students_14.png'
TOWN = 'board/print_people_test_s.png'

ID = IDENTITY.replace("Attached Image 1 is her turnaround: match it exactly.",
                      "Attached image 2 is her turnaround: match it exactly (image 1 is the same girl in this film, for pose and "
                      "drawing quality).")
HANDS2 = HANDS.replace("(enlarged in the last attached image)", "(enlarged in the attached hands sheet)")

THUMB = (
    "PURPOSE: this is the key visual for a music video thumbnail, seen first at phone size. ONE clear moment, big shapes, a strong "
    "silhouette, readable at a glance. 3:2 LANDSCAPE canvas. It will be cropped later: keep her whole face, her hands, the guitar "
    "and every story prop fully inside the central zone between 14% and 86% of the canvas width and between 9% and 91% of the "
    "height; outside that zone only background. Camera level, long lens, flat front view, verticals vertical, no tilt, no fisheye.")

PRINT = (
    "THE WORLD AROUND HER (every person and object except her and her guitar) is printed in this film's two-ink style: ONE teal ink "
    "(#218EA3) and its lighter tints on warm paper white (#f3f1ea), shaded with crisp regular halftone dots, outlined with fine "
    "charcoal pencil lines, like a two-colour risograph print. No other hue in the world. SHE is the only thing in full colour "
    "(yellow-blonde hair, skin, teal eyes, white bow, charcoal blazer and skirt, black socks) and the gold top of the guitar is the "
    "only warm colour in the whole picture. The world is calmer and lower in contrast than her, so the eye goes to her first.")

NOTEXT = ("No letters, numbers, words, signs, captions or logos are drawn anywhere in the image (all type is added later); "
          "absolutely no red, orange or pink anywhere.")

FACE_COLD = (
    "Her face (the most important thing in the picture): she looks STRAIGHT INTO THE VIEWER'S EYES, cold and steady, wide awake: "
    "the upper eyelid of each eye a straight firm line covering the top quarter of the iris, the brows level and set a little low "
    "(no frown wrinkles), the teal iris fully drawn with a dark pupil and one small sharp highlight, the mouth a small closed "
    "straight line. A quiet challenge: 'even this cannot be read?'")

UNREADABLE = "\n".join([ID, THUMB,
    "THE MOMENT: she holds her personal reading card out toward us. MEDIUM CLOSE SHOT: she faces the viewer, her body's centre "
    "line at 52% of the canvas width; the bottom edge cuts her at the waist. Her head is big: chin to top of hair about 30% of the "
    "canvas height; the top of her bow about 9% below the top edge. With both hands she holds her card up in front of her chest and "
    "pushes it toward the viewer, so the card is BIG and close: about 40% of the canvas width, level, its face flat to the camera, "
    "covering her chest from about 55% to 88% of the height, centred under her chin. Its teal lanyard still runs from the card up "
    "round her neck, pulled taut. Her small hands hold the card's two short ends, only the fingertips over its edges, nothing over "
    "the middle of the card.",
    "THE CARD is the attached card sheet (image 3): the same white card with rounded corners, teal outlines, the black corner "
    "squares and the black timing marks along the bottom edge; BUT with NO letters or numbers on it at all: the long name field "
    "across the top is an EMPTY white box with a teal outline (leave it completely blank: a word is added there later); the label "
    "tabs at the left are plain teal blocks with nothing written; the answer bubbles are small empty teal ovals with no numbers. "
    "Her answers are WRONG for a machine: heavy dark pencil scribbles overflowing the bubbles, marks outside the lines, one smeared "
    "grey eraser patch, a messy pencil scrawl spilling over the lower bubbles. The name field stays clean and empty.",
    FACE_COLD,
    "BEHIND HER: a station concourse in this town, in the teal print: a row of station ticket-gate cabinets (the attached gate "
    "sheet, image 4) across the middle ground at her hip height, and ordinary townspeople (as in the attached teal people sheet, "
    "image 5) passing through them, all teal, calm, small, each with a white card on a lanyard. Keep the area beside her head on "
    "the viewer's LEFT (from 15% to 33% of the width, from 8% to 55% of the height) a quiet plain wall of light teal tint with "
    "only faint halftone, nothing busy in it: a title goes there later.",
    PRINT, DRAW, LARGE, HANDS2, NEVER, NOTEXT])

SWING = "\n".join([ID, THUMB,
    "THE MOMENT: the frame BEFORE THE SMASH. A station ticket-gate cabinet (the attached gate sheet, image 4: narrow, paper-white "
    "front panel, teal side strips, a teal band along the top) stands at the lower LEFT, from 15% to 36% of the canvas width, its "
    "top at 52% of the height, running out of the bottom edge. On the top of its front panel is a small rectangular DISPLAY "
    "screen, dark charcoal glass in a teal frame, about 15% of the canvas width, facing the viewer, completely EMPTY (nothing on "
    "it: a word is added later). From the card slot on its top, torn paper slips and white answer cards fly up and out.",
    "SHE swings her gold-top Les Paul down onto it like an axe, two-handed: KNEE-UP SHOT, she stands to the right of the cabinet, "
    "her body's centre line at 60% of the width, the bottom edge cutting her just above the knees, her body turned toward the "
    "cabinet (the viewer's left) and leaning into the swing, her weight on her front foot. Both fists grip the guitar's neck "
    "right under the headstock, one above the other, at the height of her face in front of her, arms stretched forward and down. "
    "The guitar makes ONE thick straight diagonal from her fists at the upper right down to the lower left: the black headstock "
    "just beyond her fists, the long dark neck, and the heavy GOLD BODY at the lower end, a hand's width ABOVE the cabinet's "
    "display, about to hit it, the gold top facing the viewer (cream binding, two cream pickups, the cream pickguard and the bar "
    "bridge all visible). The guitar is big: from headstock to the end of the body about 45% of the canvas width. A few short, "
    "straight, clean speed lines along the arc only, drawn in light teal. (Attached image 5 is a black-and-white sketch of the "
    "same smash from this film: use it only for the force of the pose, never for its style.)",
    "Her face: FURY AND TEARS. Teeth clenched, the mouth open in a hard shout showing a row of teeth; the brows drawn down hard; "
    "her eyes glaring at the display she is about to hit, wet, with two clean teardrops flying back off her cheek; her bob "
    "tossed by the swing in a few clean clumps; the bow on its headband. Her face is big and clear: chin to top of hair about 22% "
    "of the canvas height. NO lanyard and NO card on her.",
    "BEHIND: a plain station wall in the teal print with big soft halftone fields, simple and calm. Keep the RIGHT part of the "
    "canvas from 76% to 87% of the width, from 8% to 75% of the height, a quiet field of halftone teal with nothing in it: a "
    "vertical title goes there later.",
    "The guitar is the gold-top Les Paul of the attached guitar sheet (image 3): gold top with cream binding, two cream P-90 "
    "pickups, a cream pickguard, one silver wraparound bar bridge, gold knobs, a rosewood fretboard with cream trapezoid inlays, "
    "the black headstock with six cream tuner buttons; the back and sides dark brown.",
    PRINT, DRAW, LARGE, HANDS2, NEVER, NOTEXT])

ONLYCOLOR = "\n".join([ID, THUMB,
    "THE PICTURE: a giant printed answer sheet that is also a crowd. The top 17% of the canvas is an EMPTY header band of plain "
    "paper white with one thin teal rule under it (leave it completely blank: a title is printed there later). Below it, the "
    "whole canvas is a perfectly regular flat grid of square cells drawn with thin charcoal lines, 8 columns by 4 rows, front on, "
    "no perspective. In EVERY cell is the SAME ordinary school student, repeated exactly like a printed stamp: a short-haired boy "
    "in the town's school uniform (the attached teal people sheet, image 4), shown from the chest up, facing forward, calm blank "
    "face, eyes half closed, printed ONLY in teal ink tints and charcoal halftone; in the top right corner of every cell one "
    "small answer bubble filled in solid charcoal, neat (read correctly).",
    "ONE cell is different: in the middle of the grid (columns 4 and 5, rows 2 and 3) she BREAKS OUT of her cell: she is drawn "
    "much bigger than the students, in FULL COLOUR, from the top of her bow down to her hips, her figure filling the height of "
    "two rows and the width of about two and a half cells, centred at 50% of the canvas width; the charcoal grid lines around "
    "her are snapped and torn where her shoulders, the guitar and her bow push through them; the cut ends of the lines curl a "
    "little. The bubble of her cell (at its top right corner) is EMPTY, with a messy pencil scribble spilling out of it.",
    "She carries the gold-top Les Paul on her right shoulder like a baseball bat or an axe, exactly as in attached image 1: her "
    "right fist (viewer's left) round the neck just under the headstock in front of her collarbone, the neck over her shoulder, "
    "the heavy gold body up behind her shoulder beside her head on the viewer's left, the gold top facing us. Her head chin to "
    "top of hair about 26% of the canvas height. She is the ONLY one looking straight at the viewer, defiant: the corners of "
    "her small closed mouth pressed down, brows level and low, upper lids straight and firm, eyes steady. She wears her teal "
    "lanyard and white name card on her chest; the card is BLANK white.",
    "The guitar is the gold-top Les Paul of the attached guitar sheet (image 3): gold top with cream binding, two cream P-90 "
    "pickups, a cream pickguard, one silver wraparound bar bridge, gold knobs, a rosewood fretboard with cream trapezoid inlays, "
    "the black headstock with six cream tuner buttons.",
    PRINT, DRAW, LARGE, NEVER, NOTEXT])

SMILE = "\n".join([ID, THUMB,
    "THE MOMENT: after. At the lower LEFT, from 14% to 40% of the canvas width, a station ticket-gate cabinet (the attached gate "
    "sheet, image 4, and the smashed one in image 3) smashed: its top crushed down into a jagged V, the sheet metal crumpled, two "
    "bold cracks down its paper-white front panel, a small square display window on the front with its glass shattered (cracks "
    "radiating from one point), torn slips hanging from the slot; it runs out of the bottom edge. The gold-top Les Paul is planted "
    "in the crushed top like a sword in a stone, nobody holding it, its gold body sunk into the cabinet, the neck rising to the "
    "upper left, the black headstock inside the canvas at about 15% from the top; a crack across the gold top, three snapped "
    "strings curling in loose loops. Two thin wisps of pale grey pencil-line smoke rise from the crushed top. Torn white answer "
    "cards lie scattered on the floor.",
    "SHE is walking away to the viewer's RIGHT and looks back at us: MEDIUM SHOT, the bottom edge cuts her at mid-thigh, her body's "
    "centre line at 63% of the width; her body seen from three-quarters behind, turned away toward the right, her head turned back "
    "over her shoulder toward the viewer so we see her face in three-quarter view; her face big and clear, chin to top of hair "
    "about 24% of the canvas height. She gives the viewer a small, calm, slightly satisfied SMILE: soft relaxed eyes, a closed "
    "mouth with its corners gently up, no teeth, no blush. Her bob a little out of place from the swing (clean clumps), the bow "
    "on its headband slightly tilted. Her arms hang relaxed, hands empty. NO lanyard and NO card on her: her card is gone.",
    "BEHIND: an empty station concourse in the teal print, a row of intact gates far behind, quiet. Keep the UPPER RIGHT, from 72% "
    "to 87% of the width and from 8% to 40% of the height, a quiet field of light teal tint, nothing in it: a title goes there "
    "later.",
    "The guitar is the gold-top Les Paul of the attached guitar sheet (image 5): gold top with cream binding, two cream P-90 "
    "pickups, a cream pickguard, a rosewood fretboard with cream trapezoid inlays, the black headstock with six cream tuner "
    "buttons.",
    PRINT, DRAW, LARGE, NEVER, NOTEXT])

## Round 2: fixes found on looking at round 1, each a redraw of the best try with only the fault changed.
#  swing_a: the right diagonal, but the cabinet reads as a guitar amp, sweat drops beside her face, no tears.
#  onlycolor_b: reads as a figure pasted ON the grid (white cut-out rim, comic shock marks), not one breaking OUT of it.
#  unreadable_a: the face is soft and neutral; the cover needs the cold, level stare.
#  smile_a: the smile is too faint to read at feed size.
from rules import variant

SWING_FIX = variant(
    "(1) The white box at the lower left becomes a STATION TICKET-GATE CABINET of this town, drawn like the cabinet in "
    "attached image 3 before it was smashed (and like the narrow gate pillar in attached image 4): a TALL NARROW upright "
    "cabinet, about as wide as her shoulders (from 17% to 37% of the canvas width), its top at 60% of the canvas height and "
    "running out of the bottom edge; a paper-white front panel with a thin teal outline, teal side strips and a teal band "
    "along its top, a card slot on its top with torn slips and white cards flying out, and on the upper part of its front "
    "panel ONE small dark charcoal display screen in a teal frame, about 13% of the canvas width, empty. Nothing that looks "
    "like a guitar amplifier, no grille, no handles, no knobs. The guitar's gold body comes down right above this cabinet's "
    "top, a hand's width above it. (2) Remove the drops flying beside her face: there are NO sweat drops and NO flying "
    "drops anywhere. Instead her eyes are WET: a thin bright line of tears welling along each lower eyelid, and one "
    "single clean tear track down her cheek on the side toward us. Her clenched teeth, glare and fury stay.", keep_bg=False)

ONLY_FIX = variant(
    "She must be clearly PART OF the printed sheet, bursting OUT of it, not pasted on top: remove the white cut-out rim "
    "around her and remove the little comic shock marks. Instead, the paper of the sheet is TORN OPEN around her: the grid "
    "cells around her are ripped, with ragged torn paper edges following close around her shoulders, the guitar and her "
    "bow, a few torn flaps of the printed cells curling forward over her blazer edge and over the gig bag, the cut grid lines "
    "ending at the torn edges; behind her, inside the tear, plain dark charcoal shadow (the inside of the sheet). The "
    "neighbouring printed students stay intact and identical. Her pose, face, guitar and size stay exactly as they are.",
    keep_bg=False)

UNREAD_FIX = variant(
    "Only her eyes and brows: make her stare COLD and challenging, looking straight into the viewer's eyes: each upper eyelid "
    "a straight firm line lowered to cover the top quarter of the iris, the brows level and set a little lower and closer to "
    "the eyes (no frown wrinkles), the mouth a small closed straight line. Not sad, not sleepy: defiant.", keep_bg=False)

SMILE_FIX = variant(
    "Only her face: her SMILE is clearer, readable even when the picture is small: the corners of her closed mouth turned "
    "clearly up in a calm, satisfied smile (no teeth), her eyes gently narrowed into a smile with the lower lids lifted a "
    "little, brows relaxed. Not a grin, no blush.", keep_bg=False)

FIXES = {
    'cv2_swing_fix':     (SWING_FIX,  ['out/cv2_swing_a.png', TURN, 'board/cover_gate_crop.png', GATE, LP, FACES]),
    'cv2_onlycolor_fix': (ONLY_FIX,   ['out/cv2_onlycolor_b.png', TURN, '../cut/s04d_shoulder.png', FACES]),
    'cv2_unreadable_fix': (UNREAD_FIX, ['out/cv2_unreadable_a.png', TURN, 'board/ref_cold_stare.png', FACES]),
    'cv2_smile_fix':     (SMILE_FIX,  ['out/cv2_smile_a.png', TURN, FACES]),
}

JOBS = {
    'cv2_unreadable': (UNREADABLE, ['../cut/R14f_see.png', TURN, CARD, GATE, TOWN, HANDS_REF, FACES]),
    'cv2_swing':      (SWING,      ['../cut/R16_raise.png', TURN, LP, GATE, '../cut/i16_impact.png', HANDS_REF, FACES]),
    'cv2_onlycolor':  (ONLYCOLOR,  ['../cut/s04d_shoulder.png', TURN, LP, PEOPLE, FACES]),
    'cv2_smile':      (SMILE,      ['../cut/R16_smile.png', TURN, '../cut/R16_final.png', GATE, LP, FACES]),
}

## Round 3: the chosen pictures are 3:2; the 16:9 cover keeps their full height, so 150 px strips are needed at each
#  side (outside the 4:3 crop). Codex outpaints them: the picture is set at 1296x864 in the middle of a 1536x1024
#  canvas with a white margin, and only the margin is used (tools/make_cover_v2.py keeps the original pixels).
WIDE_TEXT = (
    "The attached image is one finished illustration placed in the MIDDLE of a larger canvas, with a blank pure white margin "
    "all around it. Extend the illustration out into the white margin on all four sides so the result is ONE complete "
    "picture that fills the whole 3:2 canvas edge to edge: continue the background exactly as it is (the same walls, floor "
    "lines, windows, halftone dots, teal two-ink print style, line weight and colours), lining up every line that crosses "
    "the border. Inside the original illustration change NOTHING: the same girl, the same size and position, line for "
    "line. In the margin add no new people's faces, no text, no letters, no logos, nothing eye-catching: only the quiet "
    "continuation of the background. No white border may remain. No red anywhere.")
CHOSEN = ['cv2_unreadable_fix_a', 'cv2_swing_fix_a', 'cv2_onlycolor_fix_b', 'cv2_smile_fix_a']


## Round 4 (final): three viewer reviews of the feed thumbnails agreed on three directions and on what was wrong:
#  swing     : the machine read as a small bin, its screen invisible and sitting under the feed's play-count strip; no town
#              behind her, so "only she is in colour" did not hold; the face read a little comic (zigzag teeth, tiny tear).
#  grid      : (onlycolor) she stood still like a pasted stand-up; the dots in the cells meant nothing (no "read OK" mark,
#              nothing marked her as the unreadable one); one boy repeated 30 times looked like copy-paste; white rim and
#              black backing round the tear; a gig bag AND a guitar.
#  card      : (unreadable) the gold guitar was missing (only a brown neck), 読み取れません in the name field read as her
#              name, the pose was a symmetric ID photo and the card ran under the play-count strip.
#  Each is drawn again as a new composition with the chosen picture as the master for her face, drawing and style.
#  The 3:2 picture is cropped by code to 16:9 (rows 8%..92%) and to 4:3 (columns 12.5%..87.5% of that), and the feed
#  lays its play-count strip over the bottom ~11%: so every story element sits inside x 14-86%, y 10-80%.
CROP = (
    "PURPOSE: the key visual of a music video thumbnail, seen first at phone size in a feed. ONE clear moment, big shapes, "
    "strong silhouette. 3:2 LANDSCAPE canvas. Code crops it later: keep her whole head and bow, her hands, the guitar and "
    "every story prop inside the zone from 14% to 86% of the canvas width and from 10% to 80% of the height (the bottom 20% "
    "and the side margins only background or her body). Camera level, long lens, flat front view, verticals vertical, no "
    "tilt, no fisheye.")

ID1 = IDENTITY.replace("Attached Image 1 is her turnaround: match it exactly.",
                       "Attached image 2 is her turnaround: match it exactly. Attached image 1 is a finished picture of this "
                       "same cover: match its drawing of her face, hair, line work, colours and print style exactly; only "
                       "the composition changes as written below.")

LP_TEXT = ("The guitar is the gold-top Les Paul of the attached guitar sheet: gold top with cream binding, two cream P-90 "
           "pickups, a cream pickguard, one silver wraparound bar bridge, gold knobs, a rosewood fretboard with cream "
           "trapezoid inlays, the black headstock with six cream tuner buttons; back and sides dark brown. The GOLD TOP faces "
           "the viewer and is the biggest warm shape in the picture.")

TEETH = ("Her teeth, when shown, are two smooth clean white bands (upper and lower) with no zigzag, no cartoon sharp teeth.")

FINAL_SWING = "\n".join([ID1, CROP,
    "THE MOMENT: the frame BEFORE THE SMASH, in the middle of this town's station concourse.",
    "THE READING MACHINE is the second subject and it is BIG: ONE station ticket-gate cabinet of this town (the attached gate "
    "sheet, image 3, and the cabinet in image 1), close to the camera on the viewer's LEFT, from 14% to 40% of the canvas "
    "width, its top at 40% of the canvas height, running out of the bottom edge. Paper-white front panel with a thin teal "
    "outline, teal side strips and a teal band along its top; a card slot on its top from which torn paper slips and white "
    "answer cards burst up and out. On the upper part of its front, facing the viewer flat, ONE LARGE rectangular DISPLAY "
    "SCREEN: from 17% to 37% of the canvas width and from 46% to 62% of the canvas height, dark charcoal glass inside a thick "
    "teal frame, completely EMPTY and evenly dark (bright letters are added there later, so nothing on it, no reflections). "
    "Nothing about it looks like an amplifier, a bin or a box: no grille, no handles, no knobs.",
    "SHE swings her gold-top Les Paul down onto it like an axe, two-handed, with the same pose and force as image 1: KNEE-UP "
    "SHOT, she stands to the right of the machine, her body's centre line at 61% of the canvas width, the bottom edge cutting "
    "her above the knees, her body turned toward the machine and leaning into the swing. Both fists grip the neck right under "
    "the headstock, one above the other, up in front of her at the height of her face. The guitar makes ONE thick straight "
    "diagonal from her fists at the upper right down to the lower left: the heavy GOLD BODY a hand's width ABOVE the machine's "
    "top, about to hit it, between 22% and 44% of the width and between 18% and 40% of the height. Her head: the top of her bow "
    "at 10% of the canvas height, chin to top of hair 24% of the canvas height. A few short clean light-teal speed lines along "
    "the arc only.",
    "Her face: CRYING FURY, furious and hurt at once, not comic. The mouth open in a hard shout; the brows drawn down hard; her "
    "eyes glaring at the screen and BRIMMING WITH TEARS: a bright wet line along each lower lid and one clear tear stream "
    "running from the outer corner of the eye down her cheek to her jaw on the side toward us, wide enough to see when the "
    "picture is small. " + TEETH + " Her bob tossed by the swing in a few clean clumps. NO lanyard and NO card on her.",
    "BEHIND HER: the station concourse in the teal print (as in the attached teal town sheet, image 4): a long straight row of "
    "identical ticket-gate cabinets across the background, smaller and farther away, at the height of her hips; a few calm "
    "townspeople walking through them, all teal, small and pale, each with a white card on a lanyard, nobody looking at her. "
    "The background is lower in contrast and lighter than her and the machine. Keep the RIGHT part of the canvas from 77% to "
    "87% of the width and from 10% to 70% of the height a quiet plain light-teal wall with only faint halftone, no people "
    "there: a vertical title goes there later.",
    LP_TEXT, PRINT, DRAW, LARGE, HANDS2, NEVER, NOTEXT])

FINAL_GRID = "\n".join([ID1, CROP,
    "THE PICTURE: a giant printed answer sheet that is also a crowd, and she tears her way out of it toward the viewer.",
    "THE SHEET fills the WHOLE canvas: a perfectly regular flat grid of square cells drawn with thin charcoal lines, 8 columns "
    "by 5 rows, front on, no perspective, every cell the same size. In EVERY cell one ordinary student of this town from the "
    "chest up, facing forward, all in the SAME pose with the SAME calm blank face and half-closed eyes, like printed ID "
    "photos, but DIFFERENT people: boys and girls mixed, different short hairstyles, a few with glasses, all in the town's "
    "school uniform (draw them from the attached teal people sheet, image 4); printed ONLY in teal ink tints and charcoal "
    "halftone. In the top right corner of every student's cell one neat teal circle with a clean teal tick mark inside "
    "(read correctly). No letters or numbers.",
    "SHE BREAKS OUT: in the middle of the sheet (her body's centre line at 50% of the canvas width) the paper is RIPPED OPEN in "
    "a ragged hole about two and a half cells wide, and she is coming OUT through it toward the viewer, in FULL COLOUR, much "
    "bigger than the students: from the top of her bow at 17% of the canvas height down to her waist at the bottom edge; her "
    "head chin to top of hair 30% of the canvas height. Her upper body leans forward out of the hole toward the camera. Her "
    "LEFT hand (on the viewer's right) grips the torn paper edge at the side of the hole at chest height and RIPS it outward. "
    "Her RIGHT hand holds the gold-top Les Paul on her right shoulder like an axe or a bat, as in attached image 5: the fist "
    "round the neck in front of her collarbone, the neck over her shoulder, the heavy GOLD BODY up behind her shoulder beside "
    "her head on the viewer's LEFT, gold top facing us, and the guitar body BREAKS THROUGH the paper into the neighbouring "
    "cells, overlapping the torn edge and the grid lines outside the hole.",
    "THE TEAR: ragged torn paper edges where the printed cells are ripped; flaps of the printed sheet are pushed forward by her "
    "body and curl toward the viewer around her shoulders and arm, showing their plain pale grey-teal backs; inside the hole "
    "behind her only a soft deep teal shadow. NO white outline or rim around her, NO black backing, no comic shock marks, no "
    "gig bag, no backpack. She wears her teal lanyard with a blank white name card on her chest.",
    "Her face: the only face looking straight at the viewer: DEFIANT AND HURT, brows drawn down, eyes glaring, wet with a thin "
    "bright line of tears along the lower lids, teeth clenched in a hard grimace. " + TEETH,
    "Nothing of hers above 15% of the canvas height (a title band is laid over the top of the sheet later); the top rows are "
    "the same printed students.",
    LP_TEXT, PRINT, DRAW, LARGE, HANDS2, NEVER, NOTEXT])

FINAL_CARD = "\n".join([ID1, CROP,
    "THE MOMENT: at the station gates every townsperson's card is read; hers is not. She shows us her card, and she has her "
    "guitar on her shoulder.",
    "MEDIUM CLOSE SHOT: she faces the viewer, her body's centre line at 54% of the canvas width, the bottom edge cutting her "
    "at the waist; the top of her bow at 10% of the canvas height; her head chin to top of hair 30% of the canvas height. "
    "Her RIGHT hand (viewer's left) pushes her card toward the camera: the card is BIG and close, held by its left short end, "
    "turned a little toward us (its near edge slightly larger), from 30% to 70% of the canvas width and from 50% to 79% of "
    "the canvas height, its teal lanyard running from it up round her neck, pulled taut. Her LEFT hand holds the gold-top Les "
    "Paul on her left shoulder like an axe or a bat: the fist round the neck in front of her collarbone, the neck over her "
    "shoulder, the heavy GOLD BODY up behind her shoulder beside her head on the viewer's RIGHT, gold top facing us, big "
    "(about 22% of the canvas width).",
    "THE CARD is the attached card sheet (image 3): the same white card with rounded corners, teal outlines, black corner "
    "squares and black timing marks along the bottom edge, with NO letters or numbers anywhere: the name field across the "
    "top an empty white box, the label tabs plain teal blocks, the answer bubbles small empty teal ovals. Her answers are "
    "WRONG for a machine: heavy dark pencil scribbles overflowing the bubbles, marks outside the lines, one smeared grey "
    "eraser patch. The middle band of the card (across the bubbles) stays clear of her fingers: a stamp is printed there "
    "later.",
    "Her face: COLD and hard, looking straight into the viewer's eyes from under slightly lowered brows, chin a little down: "
    "each upper eyelid a straight firm line covering the top quarter of the iris, the brows set low and close to the eyes, "
    "a faint wet shine along the lower lids, the mouth a small tight straight line pressed shut. 'Even this cannot be read?'",
    "BEHIND HER: the station concourse in the teal print: a row of station ticket-gate cabinets (the attached gate sheet, "
    "image 4) across the middle ground at her hip height, each with a small round lamp lit on top; calm teal townspeople "
    "(the attached teal people sheet, image 6) passing through them, each holding up a CLEAN, neatly filled white card that "
    "the gate is reading. Keep the area on the viewer's LEFT beside her head (from 14% to 32% of the width, from 10% to 55% of "
    "the height) a quiet plain wall of light teal tint with only faint halftone: a vertical title goes there later.",
    LP_TEXT, PRINT, DRAW, LARGE, HANDS2, NEVER, NOTEXT])

FINAL = {
    'cv2f_swing': (FINAL_SWING, ['out/cv2_swing_fix_a.png', TURN, GATE, TOWN, LP, HANDS_REF, FACES]),
    'cv2f_grid':  (FINAL_GRID,  ['out/cv2_onlycolor_fix_b.png', TURN, LP, PEOPLE, '../cut/s04d_shoulder.png', HANDS_REF,
                                 FACES]),
    'cv2f_card':  (FINAL_CARD,  ['out/cv2_unreadable_fix_a.png', TURN, CARD, GATE, LP, TOWN, HANDS_REF, FACES]),
}


def write_wide(names=None):
    from PIL import Image
    board = os.path.join(here, '..', 'board')
    args = []
    for n in names or CHOSEN:
        im = Image.open(os.path.join(here, '..', 'out', n + '.png')).convert('RGB').resize((1296, 864), Image.LANCZOS)
        pad = Image.new('RGB', (1536, 1024), (255, 255, 255))
        pad.paste(im, (120, 80))
        pad.save(os.path.join(board, f'cover_pad_{n}.png'))
        open(os.path.join(here, n + '_wide.txt'), 'w', encoding='utf-8').write(WIDE_TEXT + "\n")
        args.append(f"-{n}_wide:board/cover_pad_{n}.png")
    print(' '.join(args))


if __name__ == '__main__':
    if sys.argv[1:2] == ['wide']:
        write_wide(sys.argv[2:])
        sys.exit()
    pick = sys.argv[1:] or list(JOBS)
    if pick == ['fix']:
        pick = list(FIXES)
    if pick == ['final']:
        pick = list(FINAL)
    tries = ('a', 'b')
    args = []
    for name in pick:
        text, refs = {**JOBS, **FIXES, **FINAL}[name]
        for t in tries:
            n = f'{name}_{t}'
            open(os.path.join(here, n + '.txt'), 'w', encoding='utf-8').write(text + "\n")
            args.append(f"-{n}:{'+'.join(refs)}")
    print(' '.join(args))
