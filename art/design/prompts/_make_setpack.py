"""Set pack (设定包): the design sheets every later drawing takes as its first reference (docs/设定包.md).

Two drawing hands, never mixed:
- HER hand (full colour, the hand of her turnaround art/design/board/rin_A2.png): the Les Paul, the gig bag, the lead holder.
  She is the only full-colour thing in the film and the gold top is the only warm colour.
- The TOWN's hand (one teal ink printed on paper white, the hand of art/design/board/print_people_test_s.png): the people of the
  town, the reading machine, the machine's big eraser, the coin lockers, the ticket gate, the self-introduction card, the essay
  paper's grid. Pencil black (#2A2A2F) only where a pencil or the machine's black print would be.
No red anywhere. Every sheet is a straight-on, eye-level view; transparent background unless the item is a sheet of paper.

Prompts are written without _style.txt (jobs are listed with a leading '-'): that file asks for a white background and full colour,
which is wrong for both hands here.
usage: python art/design/prompts/_make_setpack.py  -> writes sp_*.txt and prints the make_jobs arguments.
"""
import os, sys
here = os.path.dirname(os.path.abspath(__file__))

SHEET = 'board/rin_A2.png'
PRINT_REF = 'board/print_people_test_s.png'
ADULTS_REF = 'board/adults_builds.png'
STUDENTS_REF = 'board/students_14.png'
LP_OLD = 'out/lespaul_v3.png'

ALPHA = ("Fully TRANSPARENT background (PNG alpha) everywhere outside the subject: no floor, no ground line, no cast shadow, no "
         "frame, no paper colour behind it. Every part of the subject is fully opaque, including its white and paper-white parts.")
NO_TEXT = "No captions, no labels, no title, no logos, no watermark."
NO_RED = "Absolutely no red, pink or orange anywhere."

HER_HAND = (
    "Drawing: the same hand as the attached character turnaround (her design sheet): clean modern Japanese anime model-sheet "
    "illustration, crisp even dark-grey outlines (a little heavier on the outer contour), flat colours with exactly one hard-edged "
    "shadow tone per material and at most one small hard highlight shape on metal or lacquer, simple shapes, few inner lines, "
    "no gradients, no airbrush, no glow, no blur, no texture, no photographic rendering, no 3D-render look.")

TOWN_HAND = (
    "Drawing style: a printed illustration in ONE ink colour only, teal (#218EA3), on paper white (#F5F3ED), exactly the drawing hand "
    "of the people in the first attached image: clean confident teal line art (outer contour a little heavier, inner lines thin and "
    "few), shadows and darker materials as clean, regular, round teal screentone dots (halftone, one dot size for light tone, a "
    "denser one for dark tone), solid teal or very dense teal dots for black hair and very dark clothes. White areas are paper white. "
    "No other colours: no grey, no black, no brown, no gradients, no airbrush, no glow, no blur, no paper texture, no pencil "
    "sketchiness. It must look like a crisp printed page, as drawn by a professional anime character designer.")

CARD_ON_CHEST = (
    "Name card: a teal lanyard round the neck, its two strands meeting at a small metal clip at the middle of the chest; the clip holds "
    "a small white landscape card (real size about 15 x 10 cm, wider than tall) in a thin clear holder, hanging flat and facing the "
    "viewer, not covered by hands or bags. The card is printed like a school answer sheet: a thin teal border, a teal name band along "
    "the top, and below it neat rows of tiny teal ovals; in each row ONE oval is filled solid pencil black (#2A2A2F), and one larger "
    "oval at the bottom left is filled solid pencil black. These filled ovals are the ONLY black in the whole picture.")

PERSON_FRAME = (
    "One single person, alone, FULL BODY from the top of the head to the soles of the shoes, standing on level ground and facing the "
    "viewer squarely (front view, body and face straight to the camera, both shoulders the same width from the centre line). Camera at "
    "eye level (about 1.4 m), straight on, long lens: no high or low angle, no perspective distortion, the feet seen from the front, "
    "not from above. Portrait canvas 2:3 at a FIXED SCALE shared by every person of the town: the canvas height is 2.0 metres, the "
    "soles stand 3% above the bottom edge, and the person is exactly as tall on the canvas as their real height says (a 160 cm person's "
    "head top is at 17% below the canvas top, a 180 cm person's at 7%, a 130 cm child's at 32%); empty transparent space above a short "
    "person is correct, do NOT enlarge or stretch the figure to fill the canvas. Natural proportions for the stated age, height and "
    "build, as a careful anime character designer draws them: an adult about 7 heads tall (legs NOT elongated: the crotch at about "
    "half the height), an old person about 6.5 heads, a 9-year-old about 5.5 heads, a 3-year-old about 4 heads; not chibi, not "
    "fashion-model long; simple correctly drawn hands with five fingers; a natural relaxed stance.")


def person(who, ident_ref_note=""):
    return "\n".join([
        "One character design illustration: the canonical front view of one person of the town, for a model sheet.",
        who,
        ident_ref_note,
        PERSON_FRAME,
        CARD_ON_CHEST,
        TOWN_HAND,
        "The face is a clean modern anime face like the people in the first attached image: simple eyes, a small mouth, the nose at most "
        "one small stroke; the expression is quiet and specific to this person (described above), never a cartoon grin. Hair is drawn "
        "in a few well-shaped clumps, not many thin strands. Clothes have only the folds that explain the form.",
        ALPHA, NO_TEXT, NO_RED,
    ]).replace("\n\n", "\n")


STYLE_ONLY = ("The first attached image only shows the drawing style (line, screentone, faces); do not copy any of its people.")


def from_lineup(pos, img_word):
    return (f"This person is the {pos} in the {img_word} attached image: keep the same face, hairstyle, age, build and clothes, "
            "redrawn as a single standing front view. The first attached image decides the drawing style.")


PEOPLE = {
    # --- the platform (docs/分镜/01_前奏riff前半.md 第 5 节, p1-p11) ---
    'sp_p01_sato': (person(
        "Sato Kenta, salaryman, about 42 years old, 172 cm, a solid, slightly heavy build with a small belly. Short neat dark hair with "
        "a side part, a little thin at the temples. Dark business suit (dense teal dots), white shirt, plain dark tie, black leather "
        "briefcase held in his right hand (the viewer's left) hanging by his side. Expression: tired, flat, eyes half-lidded, mouth "
        "closed. " + STYLE_ONLY), [PRINT_REF]),
    'sp_p02_tanaka': (person(
        "Tanaka Misaki, office worker, about 24 years old, 158 cm, slim. Straight dark hair to the shoulder blades, tucked behind her left "
        "ear. A light belted trench coat (paper white with light dots) over a dark knit top, knee-length skirt, plain pumps. A canvas "
        "tote bag on her right shoulder (viewer's left), her right hand holding its strap. Expression: bored and a little sleepy, "
        "looking straight ahead. " + STYLE_ONLY), [PRINT_REF]),
    'sp_p03_takahashi': (person(
        "Takahashi Masao, retired man, about 75 years old, 160 cm, thin, slightly stooped. " + from_lineup("rightmost person (the old "
        "man with glasses, cardigan and walking cane)", "first") + " Both hands rest on the cane's handle in front of him, the cane's "
        "tip on the ground between his feet, the card above his hands. Expression: mild and patient, a faint polite smile."),
        [PRINT_REF]),
    'sp_p04_ito': (person(
        "Ito Ryo, cram-school instructor, about 33 years old, 175 cm, lean. " + from_lineup("second person from the left (the young "
        "man in a V-neck sweater over a collared shirt)", "first") + " Here he holds a stack of four or five thick textbooks and "
        "printouts against his stomach with both forearms, below the card (the card stays fully visible above the stack). "
        "Expression: brisk and confident, a small professional smile."), [PRINT_REF]),
    'sp_p05_watanabe': (person(
        "Watanabe Sho, high-school boy from another school, 17 years old, 170 cm, lanky. Short spiky dark hair. A black gakuran "
        "(stand-up collar school uniform with a row of round buttons; solid teal / dense teal dots), black trousers, sneakers. A flat "
        "school bag on a strap across his body, resting at his left hip (viewer's right). Hands in his trouser pockets. Expression: "
        "sullen, eyes looking slightly down. " + STYLE_ONLY), [PRINT_REF]),
    'sp_p06_yamamoto': (person(
        "Yamamoto Sakura, university student, 20 years old, 160 cm, slim. Shoulder-length soft wavy hair, light colour (paper white "
        "with light dots), side bangs. Over-ear headphones resting round her neck, a long loose coat open over a turtleneck and wide "
        "trousers, chunky sneakers, a small backpack on both shoulders (straps visible). Expression: absent-minded, looking slightly "
        "to her right. " + STYLE_ONLY), [PRINT_REF]),
    'sp_p07_kobayashi': (person(
        "Kobayashi Yumi, a mother, about 34 years old, 162 cm, average build, carrying her son Sota (about 3 years old, a round small "
        "toddler, about 95 cm) on her RIGHT arm, so the child sits on the viewer's LEFT side of her body at her hip, his arm round her "
        "neck, facing the viewer. Her hair is gathered in a low loose bun. " + from_lineup("fourth person from the left (the woman in "
        "a long light coat with a shoulder bag)", "first") + " The child wears a small hooded jacket and also has a small name card "
        "on a short teal lanyard on his chest (half the size of hers, same printed design). Her own card hangs at the middle of her "
        "chest, not covered by the child. Expression: she is tired but gentle; the child looks around curiously, mouth slightly "
        "open. This picture shows the two of them together."), [PRINT_REF]),
    'sp_p08_kato': (person(
        "Kato Daisuke, construction worker, about 38 years old, 168 cm, stocky and broad. " + from_lineup("second person from the "
        "left (the man with a tied headband, a towel round his neck, work jacket and baggy cargo trousers with boots)", "second") +
        " Here his arms hang relaxed at his sides (not crossed), so the card on his chest is fully visible. Expression: plain and "
        "steady, mouth closed, not grinning."), [PRINT_REF, ADULTS_REF]),
    'sp_p09_yoshida': (person(
        "Yoshida Ren, tall young man, about 22 years old, 183 cm, very thin. " + from_lineup("rightmost person (the lanky young man "
        "in an oversized hoodie and very wide trousers)", "second") + " Hands in the hoodie's front pocket; the card hangs over the "
        "hoodie above the pocket. Expression: drowsy, half-closed eyes, mouth slightly open."), [PRINT_REF, ADULTS_REF]),
    'sp_p10_yamaguchi': (person(
        "Yamaguchi Shigeru, station attendant, about 55 years old, 170 cm, heavy and round. " + from_lineup("leftmost person (the "
        "portly station attendant in a uniform cap and uniform jacket)", "second") + " Hands clasped in front of him at belt "
        "height, below the card. Expression: polite, calm, a small closed-mouth smile."), [PRINT_REF, ADULTS_REF]),
    'sp_p11_nakamura': (person(
        "Nakamura Tome, very old woman, about 82 years old, 142 cm, small and bent forward at the back. " + from_lineup("third "
        "person from the left (the old woman with a hair bun, round glasses, a long cardigan and a wheeled shopping cart)",
        "second") + " She stands facing the viewer with both hands on the handle of the wheeled shopping cart, which stands in "
        "front of her at her right side (viewer's left) so her body and card stay visible. Expression: kindly, eyes narrow."),
        [PRINT_REF, ADULTS_REF]),
    # --- the hall, the bus stop, the night train (03, 07, 10, 14, 15) ---
    'sp_h01_suzuki': (person(
        "Suzuki Keiko, career woman, about 38 years old, 160 cm, slim and upright. " + from_lineup("leftmost person (the woman with a "
        "short bob in a skirt suit holding a file)", "first") + " She holds the file folder against her side with her left arm "
        "(viewer's right). Expression: stern, lips pressed, eyes level."), [PRINT_REF]),
    'sp_h02_matsumoto': (person(
        "Matsumoto Aya, convenience-store clerk, 19 years old, 155 cm, slim. " + from_lineup("sixth person from the left (the young "
        "woman with a ponytail in a striped shop uniform shirt and apron)", "first") + " Hands loosely together in front of the "
        "apron, below the card. Expression: worn-out, a polite blank face."), [PRINT_REF]),
    'sp_h03_inoue': (person(
        "Inoue Kazuko, housewife, about 56 years old, 154 cm, plump and round-shouldered. Short permed curly hair. A knitted cardigan "
        "over a blouse, a long flared skirt, flat comfortable shoes. A fabric shopping bag in her left hand (viewer's right) with a leek "
        "and a paper-wrapped bundle sticking out of the top. Expression: preoccupied, eyebrows slightly raised, mouth small. "
        + STYLE_ONLY), [PRINT_REF]),
    'sp_h04_kimura': (person(
        "Kimura Hiroshi, section chief, about 58 years old, 167 cm, a big round belly, narrow shoulders. Thinning grey hair combed "
        "back, a receding hairline, round metal glasses. A long overcoat open over a three-piece suit, a folded newspaper tucked under "
        "his left arm (viewer's right). Expression: grumpy, mouth turned down. " + STYLE_ONLY), [PRINT_REF]),
    'sp_h05_shimizu': (person(
        "Shimizu Aoi, high-school girl from another school, 16 years old, 157 cm, slim. Very long straight black hair (solid teal) with "
        "blunt bangs. A sailor-collar school uniform (sailor collar with two stripes, a neckerchief, pleated skirt), dark knee socks, "
        "loafers. A phone held in both hands at waist height, below the card. Expression: cool and guarded, eyes looking straight at "
        "the viewer. " + STYLE_ONLY), [PRINT_REF]),
    'sp_h06_saito': (person(
        "Saito Yuto, primary-school boy, 9 years old, 130 cm, skinny with knobbly knees. Short messy hair, a yellow-style school cap "
        "(drawn in the single teal ink), a hard randoseru school backpack on both shoulders (shoulder straps visible), a sweatshirt, "
        "shorts, sneakers. Hands gripping the randoseru straps at chest height, beside the card. Expression: serious and a little "
        "anxious. " + STYLE_ONLY), [PRINT_REF]),
}

LESPAUL = "\n".join([
    "One design sheet (landscape 3:2): this film's electric guitar, a gold-top Les Paul, in THREE views side by side at the same scale, "
    "each standing upright with the headstock at the top, their tops and bottoms aligned: (1) FRONT view, (2) SIDE view, (3) BACK view. "
    "Even spacing, nothing overlapping, nothing else in the picture.",
    "The attached guitar sheet shows the design to keep (its front view is right): a 1950s-style gold-top Les Paul single-cutaway with "
    "TWO P-90 'soapbar' pickups in cream covers, a cream pickguard raised above the top, a one-piece wraparound bridge/tailpiece (a "
    "single silver metal bar with two studs), four gold top-hat knobs in a diamond at the lower treble side, a three-way toggle switch "
    "with a cream tip on the upper bass bout, cream binding round the top edge, a black headstock face with NO logo or text, three tuning "
    "keys per side with cream keystone buttons, a rosewood fingerboard with cream binding and cream trapezoid inlays, six strings.",
    "Correct these so the structure is right:",
    "- FRETS: 22 metal frets. The fret spaces get steadily SHORTER toward the body (each space about 5.6 percent shorter than the one "
    "above it); fret 12 is exactly halfway between the nut and the bridge saddle line; the neck joins the body at fret 16. Trapezoid "
    "inlays at frets 3, 5, 7, 9, 12, 15, 17, 19, 21, each centred in its own fret space, so the inlays also get closer together toward the "
    "body. The strings run straight and parallel from the nut over the pickups to the bridge.",
    "- BACK and SIDES and the back of the neck and headstock: a very dark brown, almost pencil black (#3A302C), with one darker shadow "
    "tone; NOT a warm orange-brown. The gold (#C9A548 with one darker gold shadow) is only on the arched top face. On the back view: the "
    "two cream control-cavity covers (the larger one at the lower treble side, which on the back view is the viewer's LEFT; the small "
    "round one for the switch at the upper side, viewer's RIGHT), the back of the six tuners in nickel, strap buttons at the tail and on "
    "the upper horn.",
    "- SIDE view: the guitar seen exactly edge-on from its bass side, the face of the guitar toward the viewer's LEFT. It shows the body "
    "about 5.5 cm thick: a flat dark back, the dark side, the cream binding line, and the gold carved top rising in a gentle arch above "
    "the binding; the knobs, toggle, pickups, bridge and the strings stand above the top surface in profile; the neck tilted back a few "
    "degrees from the body line; the headstock angled back about 15 degrees from the neck; the three bass-side tuning keys sticking out "
    "of the headstock's edge toward the viewer, their cream buttons seen end-on, their posts coming up through the headstock face. Strap "
    "buttons at the tail end and the upper horn.",
    "Real size for proportion: total length 99 cm, body 44 cm long and 33 cm wide, neck about 4.3 cm wide at the nut.",
    HER_HAND,
    "The guitar must look like a real, playable, correctly built Les Paul, as an expert guitarist would check it, but drawn simply in "
    "this anime model-sheet style.",
    ALPHA, NO_TEXT, NO_RED.replace("orange", "orange (the only warm colour is the gold top and gold knobs)"),
])

GIGBAG = "\n".join([
    "One design sheet (landscape 3:2): her black padded gig bag (soft case) for the gold Les Paul, in FOUR views at the same scale, side by "
    "side, each upright with the neck end at the top, bottoms aligned: (1) FRONT, closed: a guitar-shaped soft case (single-cut body "
    "outline, long neck section) in matte black nylon (charcoal #2E2E33 with one darker shadow tone), a big zipped front pocket on the "
    "body part, a smaller pocket above it; a zip running all round the edge; a carry handle on the side; a plain white paper luggage tag "
    "(blank, nothing written) hanging on a short string from the carry handle; (2) BACK: two padded backpack straps with grey plastic "
    "buckles and adjusters, a short strip of plain white paper tape (blank) stuck across the left strap; (3) SIDE, edge-on: about 10 cm "
    "thick, the straps' profile; (4) OPEN and EMPTY, lying flat as if seen from straight above: the top flap unzipped and folded back, the "
    "inside lined in dark grey plush, the guitar-shaped hollow empty, the zip running along the curve of the body outline.",
    "The bag is the same design as the bag in the attached guitar sheet (rightmost item) and fits that guitar: 106 cm long, 40 cm wide at "
    "the body.",
    HER_HAND,
    ALPHA, NO_TEXT + " No brand marks on the bag.", NO_RED,
])

LEADHOLDER = "\n".join([
    "One prop design sheet (landscape 3:2): her 2 mm lead holder (a drafting mechanical pencil, 芯ホルダー), drawn large and lying "
    "horizontally, in three rows: (1) the whole pencil in side view, tip pointing RIGHT, the lead retracted (only the metal tip); (2) the "
    "same pencil, same scale, with 3.5 cm of thick 2 mm graphite lead pushed out of the tip; (3) a close-up of the front end, twice as "
    "large: the conical metal tip, its jaw clutch and the lead.",
    "Design: total length 13.5 cm, barrel 8 mm thick; a plain matte pencil-black barrel (#2A2A2F with one darker shadow tone, one thin "
    "hard highlight line), NO printing or text on it; a knurled metal grip section near the front drawn as a neat fine cross-hatch band; "
    "a polished silver metal cone tip; a pocket clip near the back end; a silver push button at the back end. The lead is dark graphite "
    "grey with a slight sheen line.",
    HER_HAND.replace("the attached character turnaround (her design sheet)", "the attached character turnaround (this film's design sheet)"),
    "Everything aligned and straight, as on a product design sheet.",
    ALPHA, NO_TEXT, NO_RED,
])

ERASER = "\n".join([
    "One prop design sheet (landscape 3:2): the reading machine's big eraser, an object of the town, in three views at the same scale: "
    "(1) the WHOLE eraser lying horizontally, front face; (2) the whole eraser seen from its narrow side (showing its thickness); (3) the "
    "eraser standing VERTICALLY, seen close and large, with only its middle part in the picture (its top and bottom ends cut off by the "
    "canvas edge), as it appears sweeping across a page.",
    "Design: a long narrow block eraser, 16 cm long, 3 cm wide, 1.5 cm thick. White rubber; both short ends are exposed and worn into "
    "soft rounded shapes (the working edge a little more rounded than the other). A paper sleeve wraps the middle two thirds, printed in "
    "the single teal ink: down its length a line of large dot-matrix katakana-kanji text 「読取機用」 (each glyph made of separate round "
    "dots, like a receipt printer), and beside it a single column of separate small solid teal squares evenly spaced like the timing "
    "marks on an answer sheet; a thin teal border round the sleeve. On view (3) the text reads vertically, top to bottom.",
    TOWN_HAND.replace("exactly the drawing hand of the people in the first attached image", "the same hand as the first attached image"),
    "The rubber is paper white with teal screentone shading on its rounded ends; the sleeve is paper white printed teal. It must read as "
    "a real, solid object with weight, not a flat sticker.",
    ALPHA, "No captions or labels other than the printed 「読取機用」 on the sleeve. No watermark.", NO_RED,
])

LOCKERS = "\n".join([
    "One environment-element design (landscape 3:2): a wall of coin lockers at a Japanese station, seen exactly straight on (front "
    "elevation, eye level, long lens, no perspective, all vertical and horizontal lines straight and parallel).",
    "Design: one block of lockers, 5 columns x 4 rows of small doors, plus at the right one EXTRA-TALL door the height of two rows (inside "
    "about 120 cm high, big enough for a standing guitar case). Each door: a white metal door with a thin teal outline and a slightly "
    "inset panel, a teal door number at the top (1 to 21), a keyhole lock unit with a key, and just above the keyhole a small empty "
    "rectangular window (blank paper white) where the 'in use' flag will show; a small coin slot beside it. A white side panel closes "
    "the block on the left (a plain empty white surface, about one column wide). A thin plinth at the bottom and a top cap. A small "
    "sign plate on the top cap reading 「コインロッカー」 in teal.",
    TOWN_HAND.replace("exactly the drawing hand of the people in the first attached image", "the same hand as the first attached image"),
    "Clean, orderly, like a printed answer-sheet grid: the doors read as a grid of boxes. Shade the recesses and the plinth with teal "
    "dots only.",
    ALPHA, "No other text than the door numbers and 「コインロッカー」. No watermark.", NO_RED,
])

GATE = "\n".join([
    "One environment-element design (landscape 3:2): the automatic ticket gates of this town's station, seen exactly straight on from "
    "the hall side (front elevation at eye level 1.4 m, long lens, no perspective: all verticals straight).",
    "Design: three gate cabinets side by side forming two passages. Each cabinet: a long low box about 1.0 m high with a sloped top "
    "deck; on the end facing us a square indicator panel (one shows a teal arrow, one a plain square), on the top deck the card reader "
    "pad: a flat plate printed like an answer sheet (a teal ring target and a small rows-of-ovals pattern), a small slanted display. "
    "In the LEFT passage the two flap doors are folded open into the cabinets; in the RIGHT passage the two flap doors are CLOSED, "
    "meeting in the middle, about 1.0 m high, white with a teal edge. The cabinets are white with teal outline and teal dot shading.",
    TOWN_HAND.replace("exactly the drawing hand of the people in the first attached image", "the same hand as the first attached image"),
    ALPHA, NO_TEXT, NO_RED,
])

READER = "\n".join([
    "One technical illustration (landscape 3:2): a CUTAWAY diagram of this town's card-reading machine, like a cross-section drawing in "
    "an old printed technical manual, seen straight from the side.",
    "The machine: a heavy desk-top office machine about 60 cm long, with a rounded steel housing. The cutaway removes the side panel "
    "and shows, from left to right along the paper path: (1) a feed tray holding a stack of answer cards; (2) rubber feed rollers; (3) the "
    "reading head: a bar with a row of small light sensors over the card path; (4) the big eraser unit: a long narrow white block eraser "
    "in a sliding carriage on a straight rail, ready to come down onto the card; (5) the print head of a dot-matrix printer over a roll of "
    "continuous paper with tractor-feed holes along both edges; (6) the output slot at the top front, from which a strip of that paper "
    "with sprocket holes along both edges is coming out and curling, a few lines of dot-matrix print on it. Gears, belts and a motor "
    "fill the rest neatly. Numbered callouts ① to ⑥ in small teal circles with thin leader lines point to these six parts.",
    TOWN_HAND.replace("exactly the drawing hand of the people in the first attached image", "the same hand as the first attached image"),
    "The cut edges of the housing are marked with neat diagonal teal hatching, as in a real section drawing. The dot-matrix print on "
    "the paper strip and the filled ovals on the cards are pencil black (#2A2A2F), the only black. Precise, orderly, beautiful as an "
    "engraving; not a sci-fi machine, no screens, no glow, no lights.",
    ALPHA, "No words: only the numbers ① to ⑥. No watermark.", NO_RED,
])

SELFINTRO = "\n".join([
    "One flat printed form (portrait, aspect ratio 1:1.414 like a B5 sheet, the sheet filling the whole canvas, seen perfectly straight "
    "on, no perspective, no shadow): a junior-high school 「自己紹介カード」 (self-introduction card), printed in ONE ink, teal "
    "(#218EA3), on paper white (#F5F3ED). Completely EMPTY: nobody has written on it.",
    "Layout, top to bottom: a solid teal header band across the top with the title 「自己紹介カード」 reversed out in paper white, set "
    "in a dot-matrix typeface (each stroke made of separate round dots, like a receipt printer). Under it, at the left a box with a dashed "
    "teal border for a photo, with tiny teal text 「写真」 in it; at its right two ruled fields: 「名前」 and 「クラス」. Then three large "
    "fields stacked, each with its label in a small teal tab at the top left set in the same dot-matrix typeface: 「長所」, 「短所」, and "
    "the biggest at the bottom 「将来の夢」; each field ruled with fine dotted teal writing lines. Thin teal frame round everything, small "
    "black registration squares in the four corners (the only black), a row of tiny teal timing marks along the bottom edge.",
    "Clean, precise, well-designed like a real printed school form with generous margins. Every Japanese character correct and "
    "legible; no other text than the labels listed.",
    NO_RED,
])

ESSAY = "\n".join([
    "One illustration (portrait 3:4, the sheet filling almost the whole canvas, seen perfectly straight on from above, flat): a sheet of "
    "Japanese genkō-yōshi manuscript paper with a six-year-old girl's composition, written years ago and kept folded ever since.",
    "The paper: paper white (#F5F3ED). The grid is printed in teal (#218EA3): 12 vertical columns of 10 large square cells each, a thin "
    "gap between columns, a teal border. The sheet has been folded into eighths and unfolded: soft creases (one vertical crease down "
    "the middle, two horizontal creases) shown as faint teal-grey crease lines with a tiny soft shading, the corners slightly softened. "
    "Clean, not dirty, not torn.",
    "The writing: in pencil (soft graphite grey #3A3A40, with a slight graphite sheen), a first-grader's careful, neat, LARGE handwriting: "
    "one character in the centre of each cell, filling about 70% of the cell, strokes a little wobbly but tidy and correct. Vertical "
    "writing, columns read from RIGHT to LEFT, each column from top to bottom, exactly one character per cell (□ = empty cell). "
    "Small kana (ょ, っ) sit small in the upper right of their cell; 、 and 。 sit in the upper right of their cell; the long-vowel mark "
    "ー is a VERTICAL stroke. Column by column, starting at the RIGHTMOST column:",
    "column 1: □ し ょ う ら い の ゆ め □",
    "column 2: □ □ □ か が み ね □ り ん",
    "column 3: □ わ た し は 、 お お き く",
    "column 4: な っ た ら 、 ギ タ ー を ひ",
    "column 5: く ひ と に な り た い で す。 (す and 。 share the last cell)",
    "column 6: □ ギ タ ー を ひ く と 、 み",
    "column 7: ん な が わ ら っ て く れ る",
    "column 8: か ら で す 。 □ □ □ □ □",
    "columns 9 to 12: empty.",
    "In the empty lower part of columns 9 to 11: the teacher's round stamp in teal ink, 「よくかけました」 inside a double circle, slightly "
    "uneven like a real rubber stamp, and next to it a teal hanamaru (a spiral circle with petals) drawn with a teal pen.",
    "Pencil and teal are the only colours. Every character must be correct; nothing else is written. It must look like a real, touching "
    "keepsake, beautiful and neat, never crayon, never messy.",
    NO_RED + " No watermark.",
])


# ---- round 2 (after looking at round 1) ----
# gate_a was a 3/4 perspective of three free-standing posts with swing doors: not a Japanese gate and not gate.js. Ask for the two
# orthographic views that the 3D model (web/lib/gate.js) and the 03 front shot actually need.
GATE2 = "\n".join([
    "One environment-element design sheet (landscape 3:2) of a Japanese automatic ticket gate (自動改札機) of this town, in TWO "
    "orthographic views, both at eye level 1.4 m, long lens, NO perspective, all verticals vertical:",
    "(1) LEFT HALF: FRONT ELEVATION, as seen from the hall looking along the passages: three gate cabinets side by side, each seen from "
    "its narrow end (about 25 cm wide, 1.0 m high, the top edge sloping), with two passages between them, each passage about 55 cm wide. "
    "On each cabinet end a square indicator panel (left cabinet: a teal arrow; others: a plain empty square). In the LEFT passage the two "
    "flap doors are folded away into the cabinet sides (the passage is open, we see through it to the paper-white beyond); in the RIGHT "
    "passage the two flap doors are CLOSED: two rounded rectangular paddles, each sticking out from a cabinet side at waist height and "
    "meeting in the middle of the passage, about 45 cm tall, their tops at about 1.0 m.",
    "(2) RIGHT HALF: SIDE ELEVATION of one cabinet along its length (about 1.8 m long, 1.0 m high): a long low box; at the entry end the "
    "top deck slopes up toward the passage with the card-reader pad on it (a flat plate printed like an answer sheet: a teal ring target "
    "and small rows of ovals), behind it a small slanted display; in the middle of the length the slot where the flap door folds out; "
    "an indicator panel on each end; a plinth at the floor.",
    "Plain clean industrial design: rounded corners, a few panel seams, no logos.",
    TOWN_HAND.replace("exactly the drawing hand of the people in the first attached image", "the same hand as the first attached image"),
    ALPHA, NO_TEXT, NO_RED,
])
# lockers_a/b left the cell above the tall door empty (reads as a missing door).
LOCKERS2 = LOCKERS.replace(
    "plus at the right one EXTRA-TALL door the height of two rows (inside about 120 cm high, big enough for a standing guitar case).",
    "plus a sixth column at the right that has one small door (number 21) in the top row and, under it, one EXTRA-TALL door (number "
    "22) filling the remaining three rows (inside about 120 cm high, big enough for a standing guitar case). Every cell of the grid is a "
    "door; no empty blank cells.").replace("(1 to 21)", "(1 to 22)")
# essay_a: the text came out right, but 12 x 10 cells on a portrait sheet made the cells tall rectangles; genkō-yōshi cells are square.
ESSAY2 = ESSAY.replace(
    "One illustration (portrait 3:4, the sheet filling almost the whole canvas,",
    "One illustration (landscape 3:2, the sheet filling almost the whole canvas,").replace(
    "12 vertical columns of 10 large square cells each, a thin gap between columns, a teal border.",
    "12 vertical columns of 10 large cells each; every cell is an exact SQUARE (as wide as it is tall); a thin gap between columns; "
    "a teal border; the grid is wider than tall.")
# lespaul_b is right in front and back; its side view gave the body a waist on the BACK edge and a dark block. Redraw only that view.
LP_SIDEFIX = "\n".join([
    "Redraw the first attached design sheet exactly: the same three views of the same gold-top Les Paul, the same layout, sizes, "
    "positions, colours, line work, the same fully TRANSPARENT background (PNG alpha). The FRONT view and the BACK view stay exactly "
    "as they are, line for line. Change only the middle SIDE view, so it is a correct edge-on profile of a Les Paul seen from its bass "
    "side (face of the guitar toward the viewer's LEFT):",
    "- the BACK of the body (the viewer's right edge of the body in this view) is one STRAIGHT vertical line from the tail to the neck "
    "heel: a Les Paul back is flat, it has no waist in profile;",
    "- the side is one even dark-brown band about 5.5 cm thick along its whole length, with no darker block or step in the middle;",
    "- along the left edge: the cream binding line, and above it the gold carved top rising in a gentle low arch, highest near the "
    "bridge; the knobs, toggle switch, the two pickups, the bridge and the strings stand up from the top in profile;",
    "- the neck leaves the body tilted back a few degrees; the headstock is angled back about 15 degrees; the three tuning keys on this "
    "edge of the headstock point toward the viewer, their cream buttons seen end-on as small ovals in a row along the headstock;",
    "- strap buttons at the tail end and at the upper horn.",
    HER_HAND, NO_TEXT, NO_RED.replace("orange", "orange (the only warm colour is the gold top and gold knobs)"),
])


# ---- round 3 (2026-11-20): fixes after the art review of the set pack ----
# Guides: art/design/prompts/_setpack_guides.py draws board/guide_lespaul.png and board/guide_gate.png (plain grey geometry at the
# sheet's layout and scale), because the review found measurable structure errors (fret 12 at 44% of the scale, gate passages 45 cm).
CANON = '../canon/'
TOWN = '../canon/town/'
GUIDE_NOTE = ("The {nth} attached image is a plain grey MEASUREMENT GUIDE at exactly this sheet's layout and scale: copy its geometry "
              "(positions, lengths, widths, heights, angles) exactly, but never its grey lines or its look.")

LP3 = "\n".join([
    "One design sheet (landscape 3:2): this film's gold-top Les Paul in THREE views at the same scale, each upright with the headstock at "
    "the top, filling the height of the canvas: (1) FRONT view at the left, (2) SIDE view in the middle, (3) BACK view at the right.",
    "The first attached image is the previous version of this sheet: keep its guitar design, colours, drawing hand, layout, sizes and "
    "positions, but correct its structure as listed below. " + GUIDE_NOTE.format(nth="second") + " The third attached image (her "
    "character turnaround) only shows the drawing hand.",
    "Corrections:",
    "- FRONT, frets: 22 frets exactly where the guide puts them. Fret 12 is EXACTLY HALFWAY between the nut and the bridge bar (the guide "
    "marks fret 12 with two long dark ticks); the fret spaces shrink steadily toward the body, so the 12 frets above fret 12 take the "
    "upper half of the string length and frets 13-22 are crowded into the next quarter; the neck meets the body at fret 16. Cream "
    "trapezoid inlays at frets 3, 5, 7, 9, 12, 15, 17, 19, 21, each centred in its own space as in the guide.",
    "- FRONT, headstock: add the small BELL-SHAPED truss-rod cover on the black headstock face just above the nut (black, with a thin "
    "cream edge line, two tiny screws, NO text), as in the guide.",
    "- SIDE view (seen from the bass side; the face of the guitar toward the viewer's LEFT), exactly the guide's profile: the back is one "
    "straight flat line; the dark rim about 4.8 cm; the thin cream binding line; above it the gold carved top rising in a gentle ARCH, "
    "highest around the bridge pickup and thinning to nothing at the two ends; the neck tilted back 4 degrees, so where the neck meets "
    "the body the fingerboard's playing surface stands clearly ABOVE the gold top; the pickups, the bridge bar on its studs, the knobs "
    "and the toggle stand up from the arched top; the strings are one straight line from the nut down to the bridge, just above the "
    "pickups; the headstock angled back 17 degrees; the three bass-side tuner keys' cream buttons seen end-on along the headstock edge, "
    "their posts coming up through the headstock face. Side and back of the neck dark brown, fingerboard edge cream binding.",
    "- BACK view: NO binding on the back. The very dark brown back (#3A302C, one darker hard shadow tone) runs right to the outline; "
    "only a thin dark outline round it, no cream or light line along its edge. The two cream cavity covers (the large one at the lower "
    "treble side, which on the back view is the viewer's LEFT; the small round one at the upper side, viewer's RIGHT), the six nickel "
    "tuner backs with cream buttons, strap buttons at the tail and the upper horn.",
    "Keep: two cream P-90 soapbar pickups, cream pickguard, one-piece silver wraparound bridge bar, four gold top-hat knobs at the lower "
    "treble side, the toggle with a cream tip on the upper bass bout, cream binding on the front top edge only, black headstock face with "
    "NO logo or text, 3+3 tuners with cream keystone buttons, rosewood fingerboard with cream binding. Gold (#C9A548 with one darker gold "
    "shadow) only on the top face.",
    HER_HAND,
    "Clean edges; nothing in the picture except the three guitars.",
    ALPHA, NO_TEXT, NO_RED.replace("orange", "orange (the only warm colour is the gold top and gold knobs)"),
])

ERASER3 = "\n".join([
    "One prop design sheet (landscape 3:2): the reading machine's big eraser, an object of the town, in three views of ONE AND THE SAME "
    "object. Left two thirds of the canvas, stacked: (1) the whole eraser lying horizontally, its front face; (2) below it, the whole "
    "eraser seen from its narrow side (its thickness), same scale. Right third, full height: (3) the same eraser simply turned 90 degrees "
    "to stand vertically, enlarged about 1.5 times, so its two rounded rubber ends are OUTSIDE the canvas (cut off by the top and bottom "
    "canvas edges) while the whole paper sleeve and a little white rubber above and below it are visible.",
    "Design: a long narrow block eraser, 16 cm long, 3 cm wide, 1.5 cm thick. White rubber; both short ends worn into soft rounded shapes. "
    "A paper sleeve wraps the middle two thirds (its joint is on the back face, so no seam or extra line is visible on the front or the "
    "side; the sleeve shows only its two edges and a thin teal border). Print on the sleeve's front face, single teal ink: the dot-matrix "
    "text 「読取機用」 written horizontally along the length, centred (each glyph made of separate round dots, like a receipt printer), "
    "and along the sleeve's lower edge a row of EXACTLY SIX small solid teal squares, evenly spaced, like answer-sheet timing marks. "
    "On the narrow side (2) the sleeve is a plain band with its border, no print.",
    "View (3) is view (1) rotated 90 degrees clockwise, nothing re-laid-out: the text 「読取機用」 LIES ON ITS SIDE (read from top to "
    "bottom, each character rotated so its top points to the RIGHT), and the six squares form a column along the sleeve's LEFT edge. "
    "The same text size relative to the sleeve, the same six squares, the same border and the same proportions as view (1).",
    "The first attached image is the previous version (keep the look of its view (1): the sleeve, the dot text, the rounded dotted rubber "
    "ends; but its view (3) is wrong). The second attached image shows the drawing hand.",
    TOWN_HAND.replace("exactly the drawing hand of the people in the first attached image", "the same hand as the second attached image"),
    "The rubber is paper white with teal screentone shading on its rounded ends; the sleeve is paper white printed teal. It must read as "
    "a real, solid object with weight, not a flat sticker.",
    ALPHA, "No captions or labels other than the printed 「読取機用」 on the sleeve. No watermark.", NO_RED,
])

READER3 = "\n".join([
    "One technical illustration (landscape 3:2): a calm, clear CUTAWAY of this town's card-reading machine, like a section drawing in an "
    "old printed office-machine manual, seen exactly from the side. A heavy desk-top machine about 70 cm long with a rounded steel "
    "housing; the near side panel is removed; the cut edges of the housing carry neat diagonal teal hatching.",
    "Inside there are TWO separate paths that never cross, divided by a horizontal inner wall:",
    "LOWER DECK, the CARD path, a straight flat guide plate running left to right at mid height: (1) at the left end, outside, a sloping "
    "feed tray holding a stack of separate answer cards (each a thin stiff card with rows of tiny ovals, a few filled pencil black); (2) a "
    "pair of rubber feed rollers above and below the guide plate; (3) the reading head: a bar with a row of small light sensors just above "
    "the plate; ONE single card is shown in transit on the plate under the reading head, a separate card with clear ends, NOT a "
    "continuous band; (4) the big eraser unit: the machine's long block eraser standing VERTICALLY in a carriage on a short vertical rail "
    "just above the plate, its working rounded end pointing down at the card; the eraser has the town's design: white rubber with rounded "
    "ends and a paper sleeve on its middle printed in teal with the dot-matrix text 「読取機用」 lying on its side and a column of six "
    "small teal squares; another pair of rollers after it; (7) at the right end, outside, a card output tray where read cards drop and "
    "stack.",
    "UPPER DECK, at the right, above the inner wall: the PRINTER: a roll of continuous paper with sprocket holes along both edges, the "
    "paper going from the roll over a sprocket wheel and a platen roller, (5) a dot-matrix print head facing the paper at the platen, "
    "and from there the paper rises straight up and out through (6) the output slot in the top of the housing, a strip of it standing "
    "out and curling over, with a few lines of dot-matrix print and the sprocket holes visible. The whole paper path from the roll to "
    "the slot is drawn continuous and visible.",
    "Only these parts and the minimum that explains them: one small motor with ONE belt to the rollers is allowed. NO decorative gears, "
    "springs, pipes, cables or piles of machinery; calm open interior areas with a light dot tone. Numbered callouts (1) to (7) as small "
    "circled numbers ①②③④⑤⑥⑦ in teal with thin straight leader lines, outside the machine.",
    TOWN_HAND.replace("exactly the drawing hand of the people in the first attached image", "the same hand as the first attached image"),
    "The second attached image (the coin lockers of the same town) shows the drawing density to match: crisp line work, light regular "
    "dots in recesses and shadows, generous paper-white areas. The dot-matrix print on the paper and the filled ovals on the cards are "
    "pencil black (#2A2A2F), the only black. Precise, orderly, beautiful as an engraving; not a sci-fi machine, no screens, no glow, no "
    "lights.",
    ALPHA, "No words except the printed 「読取機用」 on the eraser sleeve: only the numbers ① to ⑦. No watermark.", NO_RED,
])

GATE3 = "\n".join([
    "One environment-element design sheet (landscape 3:2) of this town's Japanese automatic ticket gate (自動改札機), orthographic "
    "views at ONE shared scale, no perspective, all verticals vertical, all tops horizontal where the guide has them horizontal:",
    GUIDE_NOTE.format(nth="first") + " The guide shows: (A) left half, FRONT elevation from the hall, three cabinets seen end-on (each "
    "25 cm wide, 1.0 m high, a HORIZONTAL top edge, above it the reader deck seen end-on as a thin band and a small display), two "
    "passages 55 cm wide; the left passage open (flaps folded into the cabinet sides), the right passage closed by two rounded flap "
    "doors from the cabinet sides meeting in the middle, from 0.55 m to 1.0 m high. (B) right half, top: SIDE elevation of one cabinet, "
    "1.8 m long, 1.0 m high, the entry end on the LEFT: a slightly inclined reader pad on the entry end of the top deck, a small slanted "
    "display behind it, the flap slot at mid-length, an indicator panel on each end, a plinth. (C) right half, bottom: PLAN view (from "
    "straight above) of the same cabinet, aligned under (B): the reader pad printed like an answer sheet (a teal ring target and small "
    "rows of ovals), the display, the flap slot.",
    "Design: plain clean white cabinets with rounded vertical edges and a few panel seams, the square indicator panels (left cabinet: a "
    "teal arrow; others empty squares), the flaps white with a teal edge. All three views describe the SAME machine: the same heights, "
    "the same reader deck, the same display.",
    TOWN_HAND.replace("exactly the drawing hand of the people in the first attached image", "the same hand as the third attached image"),
    "The second attached image (the coin lockers of the same town) sets the drawing density and finish to match exactly: crisp teal "
    "line work with panel seams and small details, light regular dots ONLY in recesses, shadowed side faces and the plinth; large areas "
    "stay paper white. NOT a flat icon filled with dots everywhere.",
    ALPHA, NO_TEXT, NO_RED,
])

GIGBAG3 = "\n".join([
    "Redraw the first attached design sheet (her black padded gig bag in four views) with the same layout, sizes and positions and the "
    "same fully TRANSPARENT background (PNG alpha). Views (1) FRONT, (2) BACK and (3) SIDE keep their design exactly: two zipped front "
    "pockets, the carry handle on the side with the blank white paper luggage tag on a short string, two padded backpack straps with grey "
    "plastic buckles, the blank strip of white paper tape across the left strap, about 10 cm thick. Do not add anything.",
    "Fix view (4), OPEN and EMPTY, lying flat, seen from straight above: the bag opened like a clamshell. On the left the BASE shell, the "
    "guitar-shaped hollow lined in dark grey plush; on the right the LID, folded open along the long side edge that joins them. The lid "
    "has EXACTLY the same outline and size as the base, mirrored left-right (the same single-cut guitar shape, the same width at the "
    "body, the same neck section), its inside lining dark grey; the zip runs round both edges and meets at the hinge side. Both halves "
    "are equally wide; no narrow tapered strip.",
    "Finish: crisper and more graphic than the first image: matte charcoal nylon (#2E2E33) with exactly ONE hard-edged darker shadow "
    "tone, seams and zips as clean thin lines with one small hard highlight on the zip pullers and buckles; no soft shading, no "
    "gradients, no airbrush.",
    HER_HAND,
    ALPHA, NO_TEXT + " No brand marks on the bag.", NO_RED,
])

LEADHOLDER3 = "\n".join([
    "Redraw the first attached prop design sheet (her 2 mm lead holder, 芯ホルダー, three rows) with the same layout, the same pencil "
    "design and the same fully TRANSPARENT background (PNG alpha), changing only:",
    "- Row 2: the lead sticks out 3.5 cm, which is ONE QUARTER of the pencil's 13.5 cm total length: the exposed lead is about as long "
    "as the knurled grip and the cone tip together, a long thick 2 mm graphite rod. Row 3 (the front end, twice as large) shows the "
    "same long lead running off toward the right edge.",
    "- MATTE barrel: flat pencil black (#2A2A2F) with ONE hard-edged darker shadow band along its lower side; NO highlight line, no "
    "shine, no glossy stripe.",
    "- Metal parts (cone tip, grip, clip, button, rings): flat silver grey with exactly ONE hard-edged darker band and at most one small "
    "hard white highlight shape; NO gradient, no shading ramp, no chrome reflections. The knurled grip as a neat fine cross-hatch.",
    "- The lead: flat graphite grey with one hard darker band.",
    "Barrel without any printing or text. Everything straight and aligned, like a product design sheet.",
    HER_HAND,
    ALPHA, NO_TEXT, NO_RED,
])

HAND3 = "\n".join([
    "One character design illustration (portrait 2:3): HER RIGHT HAND writing with a pencil, the hand model sheet for the close-ups of "
    "her writing. She is the girl of the first attached image (her turnaround): 14 years old, 152 cm, slim; her school blazer is the "
    "dark grey of that sheet with the white shirt cuff showing.",
    "Camera: from above and slightly in front, as if looking down at a desk: the forearm in its dark grey blazer sleeve enters from the "
    "bottom edge of the canvas (the sleeve is cut by the bottom edge), the white shirt cuff just showing, the hand in the upper middle of "
    "the canvas, the pencil tip pointing to the upper left. We see the BACK of her right hand, palm down; her thumb is on the viewer's "
    "LEFT side of the hand.",
    "Grip (a correct, neat tripod grip): the pencil rests in the WEB between the thumb and the index finger, its back end sticking out "
    "past the big knuckle of the index finger toward the lower right; the tip end is held between the pad of the thumb and the pad of the "
    "index finger, the side of the middle finger supports it from below; the ring finger and the little finger curl loosely under the "
    "hand. The pencil does NOT lie across the palm or the bent fingers.",
    "Size: a girl's small, slender hand with slim tapering fingers and small neat nails; the hand across the knuckles is NARROWER than the "
    "blazer sleeve opening (about four fifths of its width). Not a man's hand, not chunky, no visible veins or tendons.",
    "The pencil: her green hexagonal wooden pencil, the sharpened end showing pale wood and a graphite point, about 17 cm long, one hard "
    "shadow side.",
    "Drawing: exactly the hand of the first attached image: clean modern anime model-sheet illustration, crisp even dark-grey outlines, "
    "flat colours with exactly one hard-edged shadow tone per material (skin, sleeve, cuff, pencil), simple shapes, few inner lines, no "
    "gradients, no blur, no texture.",
    "{ANGLE}",
    ALPHA, NO_TEXT, NO_RED,
])
HAND3_A = HAND3.replace("{ANGLE}", "The second attached image is an older version: use it ONLY for the camera angle and the pencil; its "
                        "grip (the pencil across the palm) and its oversized hand are WRONG.")
HAND3_B = HAND3.replace("{ANGLE}\n", "")

CLASSMATES3 = "\n".join([
    "One character design lineup (landscape 3:2): six classmates of the girl in this film, 14-year-old junior-high-school second-year "
    "students, standing in one row, side by side with clear space between them (nobody overlapping), each full body from the top of the "
    "head to the soles, facing the viewer, eye-level camera (about 1.4 m), long lens, no perspective. FIXED SCALE shared with the town's "
    "people: the canvas height is 2.0 metres, all soles on one level 3% above the bottom edge, each student exactly as tall as stated "
    "(so their heads are at different heights and there is empty space above them). Natural proportions for 14-year-olds (about 6.5 "
    "heads tall, legs not elongated); faces and bodies of young teenagers, not adults.",
    "School uniform (the same school as the girl): a dark blazer (dense teal dots) with a small shield emblem on the left chest, white "
    "shirt; girls: a thin ribbon bow at the collar, a pleated skirt, dark knee socks, loafers; boys: a plain dark tie, dark trousers, "
    "loafers. Each wears the town's name card on a teal lanyard at mid chest (a small white landscape card printed like an answer sheet "
    "with a few filled pencil-black ovals, the only black).",
    "From left to right (the designs of the third attached image, redrawn):",
    "1. boy, 163 cm, slim and a little stooped, messy hair, round glasses, arms hanging, mildly surprised.",
    "2. boy, 156 cm, sturdy and short, buzz-cut round head, hands in his trouser pockets, a mean little smirk.",
    "3. girl, 158 cm, slim, long high ponytail, holding a spiral notebook against her chest with one arm, cool sideways look.",
    "4. girl, 150 cm, small, short bob with heavy bangs, a cream knitted cardigan instead of the blazer, looking down at a phone in both "
    "hands at chest height (below the card), bored.",
    "5. boy, 166 cm, the tallest but still a lanky boy of 14 (narrow shoulders, thin neck, boyish round face), wavy hair, one hand behind "
    "his head, laughing with his mouth open.",
    "6. girl, 153 cm, two low braids, covering a yawn with one hand, sleepy half-closed eyes.",
    "Drawing: EXACTLY the drawing hand of the first and second attached images (two people of the town drawn for this film's model "
    "sheets): one teal ink (#218EA3) only, clean confident teal line art with few thin inner lines, LIGHT and sparse regular round "
    "screentone dots for shadows, dense dots only for the dark blazers and dark hair, lots of paper-white; clean modern anime faces "
    "with simple eyes, the nose at most one small stroke. NOT the heavy dense manga screentone of the third image: take only the "
    "people's designs from it.",
    ALPHA, NO_TEXT, NO_RED,
])

REDRAW_TOWN = ("Redraw the first attached picture exactly: the same person, the same pose, clothes, hair, card, props, the same size and "
               "position on the same canvas, the same drawing hand (one teal ink on paper-white areas, clean line art, regular round "
               "screentone dots), the same fully TRANSPARENT background (PNG alpha). Change ONLY what follows; everything else stays "
               "line for line. ")
H04_3 = "\n".join([
    REDRAW_TOWN,
    "Changes: (1) his long open overcoat becomes a DARK wool overcoat (dense teal dots, clearly darker than now, with dark lapels and a "
    "few clean fold lines), so it reads as a section chief's winter coat, never a white lab coat; keep his three-piece suit under it a "
    "little lighter than the coat so the two separate. (2) He is BALD on top: a smooth bald crown and forehead, only a short fringe of "
    "grey hair round the sides and the back of the head, above the ears. Keep his round metal glasses, the grumpy face, the newspaper "
    "under his left arm, the card.",
    "The second attached image shows the drawing hand. " + ALPHA, NO_TEXT, NO_RED,
])
FACE_P02 = "\n".join([REDRAW_TOWN, "Change only her FACE so she no longer shares a face template with the other young women of the "
                      "town: a longer oval face with a slightly pointed chin, narrow almond-shaped eyes with a calm level gaze, thin "
                      "straight eyebrows, a small mole under her left eye, small thin-lipped mouth. Still 24, still bored and a little "
                      "sleepy. Clean anime face, the nose one small stroke.", ALPHA, NO_TEXT, NO_RED])
FACE_P06 = "\n".join([REDRAW_TOWN, "Change only her FACE so she no longer shares a face template with the other young women of the "
                      "town: a round face with soft full cheeks, large round slightly droopy eyes, thick soft eyebrows, lips slightly "
                      "parted. Still 20, still absent-minded, looking slightly to her right. Clean anime face, the nose one small "
                      "stroke.", ALPHA, NO_TEXT, NO_RED])
FACE_H02 = "\n".join([REDRAW_TOWN, "Change only her FACE so she no longer shares a face template with the other young women of the "
                      "town: small narrow eyes under heavy tired eyelids with faint shadows below, short straight eyebrows, a few light "
                      "freckles across the nose, a wide flat mouth. Still 19, worn-out and politely blank. Clean anime face, the nose "
                      "one small stroke.", ALPHA, NO_TEXT, NO_RED])
FACE_P07 = "\n".join([REDRAW_TOWN, "Change only these: (1) the mother's FACE, so she no longer shares a face template with the young "
                      "women of the town: a mature 34-year-old face, slimmer cheeks with a visible cheekbone line, smaller calm eyes "
                      "with a faint line under them, softly arched eyebrows, a gentle tired smile. (2) The child Sota is a real "
                      "3-YEAR-OLD toddler: about 95 cm, a big round head (about a quarter of his height), chubby round cheeks, a tiny "
                      "nose, short chubby arms and legs, small hands; same hooded jacket, same small card, same place on her right arm.",
                      ALPHA, NO_TEXT, NO_RED])

# round 3b: gate_e traced the guide's geometry exactly but came out as a bare line diagram; keep its geometry and bring it to
# the lockers' finish. reader_d is right except the eraser's print, which was re-laid out as upright stacked characters.
GATE3B = "\n".join([
    "Redraw the first attached design sheet keeping its geometry EXACTLY: every outline, position, width, height and the empty space "
    "stay where they are (it is a measured orthographic drawing; do not move, resize or add views). Only bring the drawing up to the "
    "finish of the second attached image (coin lockers of the same town): a finished printed industrial-design drawing, not a bare "
    "diagram.",
    "Add, within the existing outlines: rounded vertical edges drawn with a second thin line; a few clean panel seams (a horizontal "
    "seam under the top deck, a vertical seam near each end of the long side, a recessed kick band above the plinth); small screws or "
    "fixings at the panel corners; the indicator panels as recessed windows with a thin inner frame; the flap doors with a thick "
    "teal rubber edge along their meeting edges and a soft inner panel line; the small display drawn as a slanted screen in a frame "
    "(its blank screen face visible in the front view); on the plan view the reader pad printed like an answer sheet (teal ring target, "
    "rows of small ovals) inside a raised bezel; on the side view a thin slot for the flap and a small vent grille near the floor.",
    "Shading: light regular round teal dots ONLY on the shadowed side faces, in the recesses, under the top deck overhang and on the "
    "plinth; the main faces stay paper white. The same line weight and dot size as the lockers.",
    TOWN_HAND.replace("exactly the drawing hand of the people in the first attached image", "the same hand as the second attached image"),
    ALPHA, NO_TEXT, NO_RED,
])
READER3B = "\n".join([
    "Redraw the first attached technical illustration exactly: the same machine, layout, parts, callout numbers, line work, dots and "
    "the same fully TRANSPARENT background (PNG alpha). Change ONLY the print on the paper sleeve of the vertical eraser at (4): the "
    "eraser is the second attached design (the machine's big eraser) simply standing upright, so its print is the horizontal print of "
    "that design turned 90 degrees: the dot-matrix text 「読取機用」 LIES ON ITS SIDE, running from top to bottom along the sleeve with "
    "each character rotated so its top points to the RIGHT (the characters are NOT stacked upright), and a column of six small solid "
    "teal squares runs along the sleeve's LEFT edge. Keep the eraser's size, position, carriage and rail.",
    "The dot-matrix print on the paper strip and the filled ovals on the cards stay pencil black (#2A2A2F), the only black.",
    ALPHA, "No words except 「読取機用」 on the eraser sleeve; only the numbers ① to ⑦. No watermark.", NO_RED,
])

# round 3c: hand_a copied the old fist grip, hand_b laid the pencil across the back of a man-sized hand. Spell out where the
# pencil goes, show her real hand size (art/ref/sheet_hands.png: her hand is about as wide as her wrist and shirt cuff), and try
# a second camera that shows the grip unambiguously.
HAND4 = "\n".join([
    "One character design illustration (portrait 2:3): HER RIGHT HAND holding her pencil to write, the hand model sheet for every "
    "close-up of her writing. She is the girl of the first attached image: 14 years old, 152 cm, slim; dark grey school blazer, white "
    "shirt cuff. The second attached image shows her real hands in this film: SMALL slender girl's hands, about as wide as her wrist, "
    "slim tapering fingers, drawn with very few lines. Keep exactly that size and drawing.",
    "{CAMERA}",
    "The grip, a correct tripod grip that must read clearly: the pencil is pinched near its sharpened end between the PAD of the thumb "
    "and the PAD of the index finger, and rests on the side of the middle finger's tip; from there the pencil rises and passes over the "
    "WEB of skin between the thumb and the index finger, and its back end sticks out beyond the hand near the big knuckle of the index "
    "finger, pointing back toward her right shoulder. The pencil never lies along the back of the hand or across the palm. The ring "
    "finger and the little finger are curled softly under, their outer edge resting on the paper side. Thumb and index finger form a "
    "soft round opening.",
    "SIZE: across the knuckles the hand is NO wider than the blazer sleeve's opening (a little narrower); from the wrist to the tip of "
    "the index finger it is shorter than 1.3 times the sleeve's width. Slim wrist. Not a man's hand, not chunky, no veins.",
    "The pencil: her green hexagonal wooden pencil, about 17 cm long (much longer than the hand), the sharpened end showing pale wood "
    "and a graphite point.",
    "Drawing: exactly the hand of the attached images: clean modern anime model-sheet illustration, crisp even dark-grey outlines, flat "
    "colours with exactly one hard-edged shadow tone per material (skin, sleeve, cuff, pencil), simple shapes, few inner lines, no "
    "gradients, no blur, no texture.",
    ALPHA, NO_TEXT, NO_RED,
])
HAND4_TOP = HAND4.replace("{CAMERA}", (
    "Camera: looking down at her desk from above her right shoulder: the forearm in its dark grey blazer sleeve comes in from the "
    "bottom right corner of the canvas (cut by the canvas edge), the white cuff just showing, the hand in the middle of the canvas, "
    "the pencil point touching the (invisible) paper toward the upper left. We see the top of the hand and its outer (little-finger) "
    "side; the thumb tip and the index fingertip are visible at the front near the pencil point, the pencil's back end rises past the "
    "index knuckle toward the lower right."))
HAND4_SIDE = HAND4.replace("{CAMERA}", (
    "Camera: at desk height, from her right front, a three-quarter view of the hand writing on the (invisible) paper surface: the "
    "forearm in its dark grey blazer sleeve comes in from the right edge of the canvas (cut by the edge), the hand in the middle, the "
    "pencil point touching the paper level at the lower left, the pencil rising diagonally to the upper right. The thumb is on the near "
    "side, the index finger on top of the pencil, the middle finger under it, the curled ring and little fingers resting on the paper."))

# p07_v3 changed too little: the boy still reads 5-6 and the mother's face is the shared template with fine lines added.
FACE_P07B = "\n".join([REDRAW_TOWN.replace("everything else stays line for line", "her coat keeps its light dot tone; everything "
                                           "else stays line for line"),
                       "Change only these two things, clearly:",
                       "(1) The mother's FACE, a different face from the other young women of the town (who all have large round "
                       "eyes): a narrow oval face with a defined jaw, SMALL calm narrow eyes with single eyelids, low straight "
                       "eyebrows, a slightly longer nose stroke, thin lips in a tired gentle smile, a few short strands loose at her "
                       "temples; she reads as 34, a little worn.",
                       "(2) The child Sota is a 3-YEAR-OLD toddler, clearly younger and SMALLER than now: about 95 cm tall, a big "
                       "round head about a quarter of his whole height, round baby cheeks, a tiny button nose, short soft hair, short "
                       "chubby arms and legs with dimpled small hands, tiny shoes; he sits lower on her hip, his face below her chin "
                       "level; the same hooded jacket and the same small card on a short lanyard.",
                       ALPHA, NO_TEXT, NO_RED])

# hand_e/f finally read as a correct tripod grip, but the hand is still about 1.5x the cuff. Redraw that picture with only the
# hand made smaller and slimmer (the master-redraw method: same composition, change one thing).
HAND5 = "\n".join([
    "Redraw the first attached picture (her right hand writing with a green pencil, seen from her right front) with the SAME "
    "composition, camera, grip, pencil, sleeve, cuff, colours and drawing hand, the same fully TRANSPARENT background (PNG alpha). "
    "Change only this: the HAND is SMALLER and more delicate, about three quarters of its current size, so it reads as the small hand "
    "of a slim 14-year-old girl (152 cm): across the knuckles the hand is about as wide as the white shirt cuff, no wider; slimmer "
    "fingers with small rounded tips and small nails, a slim wrist that fits loosely inside the cuff. The sleeve and the cuff keep "
    "their size and position; the pencil keeps its length (now clearly much longer than the hand) and still passes through the same "
    "grip: pinched by thumb and index finger near the point, resting on the middle finger, crossing the web between thumb and index "
    "finger, its back end rising to the upper right.",
    "The second attached image shows her real hands in this film (small, about as wide as her wrist).",
    "Clean modern anime model-sheet illustration, crisp even dark-grey outlines, flat colours with one hard-edged shadow tone per "
    "material, no gradients.",
    ALPHA, NO_TEXT, NO_RED,
])

# ---------------- round 4 (2026-11-20, second art review) ----------------
# Root causes found by the review: (a) sizes given only in words drift (eraser 37% too wide, a hand sized against the cuff came
# out infant-sized next to a 17.5 cm pencil, a reader whose cards and paper path do not work); so every sheet with a size or a
# mechanism gets a measured grey guide (_setpack_guides4.py). (b) Generated dot-matrix print is never on a fixed grid and differs
# between views; so the eraser's sleeve is drawn BLANK and its print is set by tools/eraser_print.py (DotGothic16 on a fixed
# 16-dot grid, the same layer turned 90 degrees for the standing view and scaled down for the reader's eraser).
G4 = ("The {nth} attached image is a plain grey MEASUREMENT GUIDE at exactly this picture's layout and scale: copy its geometry "
      "(positions, lengths, widths, heights, angles, what runs off the canvas edge) exactly, but never its grey lines, dashes, "
      "circles or its look.")

ERASER4 = "\n".join([
    "One prop design sheet (landscape 3:2): the reading machine's big eraser, an object of the town, in three views of ONE AND THE "
    "SAME object: (1) upper left, the whole eraser lying horizontally, its front face, 16 x 3 cm; (2) below it, the whole eraser seen "
    "from its narrow side (its thickness), 16 x 1.5 cm, same scale; (3) at the right, the same eraser simply standing upright, "
    "enlarged 1.5 times, showing the whole sleeve and a little white rubber above and below it, both rounded rubber ends OUTSIDE the "
    "canvas (the rubber runs off the top and bottom canvas edges).",
    G4.format(nth="first") + " It fixes the proportions: the eraser is long and NARROW, about five times as long as it is wide; the "
    "sleeve covers exactly the middle two thirds.",
    "Design: a long narrow block eraser, white rubber, both short ends worn into soft rounded shapes, the left (working) end a little "
    "rounder. A paper sleeve wraps the middle two thirds, a hair proud of the rubber, its seam on the back face (no seam visible). "
    "The sleeve is BLANK: paper white with only a thin teal printed border line set in a little from its edges. NO letters, no text, "
    "no squares, no marks of any kind on the sleeve (its print is set separately).",
    "The second attached image is the previous version: keep its look (crisp teal outline, the rounded rubber ends shaded with "
    "regular teal dots, the paper-white sleeve with its thin border) but not its proportions (it was far too wide) and not its print.",
    TOWN_HAND.replace("exactly the drawing hand of the people in the first attached image", "the same hand as the third attached image"),
    "The rubber is paper white with regular teal screentone dots on its rounded ends and a thin band of dots along its lower edge; "
    "the sleeve is paper white. A real, solid object with weight, not a flat sticker.",
    ALPHA, NO_TEXT, NO_RED,
])

READER4 = "\n".join([
    "One technical illustration (landscape 3:2): a calm, clear CUTAWAY of this town's card-reading machine, like a section drawing in "
    "an old printed office-machine manual, a strict SIDE elevation (no perspective, nothing seen from above).",
    G4.format(nth="first") + " The guide is the complete parts list and layout: draw its parts at its positions and sizes, nothing "
    "more and nothing moved.",
    "Housing: a heavy desk-top machine 60 cm long with a rounded steel housing: a long lower box and a printer hump on its right; the "
    "near side panel removed; the cut edges of the housing walls carry neat diagonal teal hatching; the lower box's top wall is the "
    "inner wall between the two decks. Two small feet.",
    "LOWER DECK, the CARD path: one straight horizontal guide plate running through a slot in the left wall and a slot in the right "
    "wall. Every card in the picture is the same thin stiff card, exactly the guide's length (15 cm), and in this side view every card "
    "is seen EDGE-ON as a thin flat plate (no card face, no ovals visible anywhere). (1) Outside the left wall: a feed tray sloping "
    "down to the left slot, holding a neat stack of these cards. (2) A pair of rubber feed rollers above and below the plate; the lower "
    "one driven by ONE belt from a small motor below it. (3) The reading head: a bar on a bracket from the ceiling with a row of small "
    "sensors just above the plate; ONE single card lies on the plate under it, in transit. (4) The machine's big eraser standing "
    "VERTICALLY in a carriage on a short vertical rail, its rounded working end pointing down just above the plate: white rubber with "
    "rounded ends, and on its middle two thirds a paper sleeve that is BLANK (paper white with a thin teal border line only: no "
    "letters, no squares, no marks). Then a second pair of rollers. (7) Outside the right wall and LOWER than the exit slot: an "
    "output tray where finished cards drop and lie in a neat flat stack, the top of the stack clearly below the slot (a dashed arc "
    "from the slot down to the stack shows the drop).",
    "UPPER DECK, inside the hump: the PRINTER. A roll of continuous paper on a spindle; the paper leaves the bottom of the roll, runs "
    "over a small sprocket wheel, passes UNDER the platen roller and wraps round its right side, then rises STRAIGHT UP. (5) The "
    "dot-matrix print head sits to the RIGHT of the rising paper, level with the platen's centre, its face against the paper: the paper "
    "runs BETWEEN the platen (left) and the head (right); the head is never on top of the platen and the paper never passes through "
    "the head. Above the head the paper keeps rising straight to (6) the output slot in the top of the hump and comes out as a strip "
    "that curls over, with sprocket holes along both edges and a few short lines of dot-matrix print (pencil black). One continuous "
    "strip from the roll to the slot.",
    "Only these parts. No other gears, springs, pipes, cables, levers or machinery. Calm open interior with a light dot tone. "
    "Callouts: small circled numbers ① to ⑦ in teal with thin straight leader lines, outside the machine, where the guide puts them.",
    TOWN_HAND.replace("exactly the drawing hand of the people in the first attached image", "the same hand as the second attached image"),
    "The third attached image (the coin lockers of the same town) sets the drawing density: crisp line work, light regular dots only "
    "in recesses and shadows, generous paper-white areas. The fourth attached image is the previous version of this drawing: keep its "
    "look (housing shape, hatching, line weight, roll, rollers) but NOT its layout, which did not work; follow the guide. The printed "
    "dots on the paper strip are pencil black (#2A2A2F), the only black. Precise, orderly, beautiful as an engraving; not a sci-fi "
    "machine, no screens, no glow, no lights.",
    ALPHA, "No words or letters anywhere: only the circled numbers ① to ⑦. No watermark.", NO_RED,
])

HAND6 = "\n".join([
    "One character design illustration (landscape 3:2): HER RIGHT HAND writing with a new pencil, the hand model sheet for every "
    "close-up of her writing. She is the girl of the first attached image (her turnaround): 14 years old, 152 cm, slim; her dark grey "
    "school blazer sleeve and white shirt cuff, her skin colour and her drawing come from that sheet. The second attached image shows "
    "her hands as drawn in this film: slender girl's hands drawn with few lines.",
    G4.format(nth="third") + " It gives the pencil (position, angle, length, thickness), the dashed area the hand fills, two marked "
    "points (the lower circle: the index fingertip; the upper circle: the web between thumb and index finger where the pencil rests), "
    "the cuff and the sleeve.",
    "Camera: at desk height from her right side, slightly in front: the paper is a level surface at the bottom (not drawn); the "
    "forearm in its blazer sleeve comes in from the right edge (cut by the canvas edge), the white cuff, the hand in the middle; the "
    "pencil point touches the paper at the lower left and the pencil rises to the upper right.",
    "PROPORTIONS, measured, the most important point: the pencil is a NEW full-length pencil, 17.5 cm. Her hand is a real 14-year-old "
    "girl's hand: about 16 cm from the wrist to the tip of the middle finger, 7 cm across the knuckles. So the hand is NEARLY AS LONG "
    "as the pencil: from the cuff to the index fingertip it spans about three quarters of the pencil's length. It is not a tiny hand "
    "on a huge pencil. The pencil's thickness (7 mm) is about HALF the width of her index finger. Her fingers are slim (about 1.4 cm "
    "wide) and long, clearly longer than wide; the index finger about 7 cm. The hand's height from the paper to the top of the "
    "knuckles is a little less than the cuff's opening.",
    "Grip, a neat three-finger (tripod) grip: the pencil is pinched near its sharpened end between the pad of the thumb (on the near "
    "side, toward us) and the pad of the index finger (on top of the pencil), and rests on the side of the middle finger's last joint; "
    "from there it rises over the web between thumb and index finger, and its back end sticks out well beyond the hand toward the "
    "upper right. The ring and little fingers curl softly under the middle finger: four fingers and a thumb, every finger drawn "
    "separately with its own joints and a small nail where visible, none fused into a lump. The outer edge of the hand and the curled "
    "little finger rest on the paper. Thumb and index finger form a soft rounded opening.",
    "The pencil: her green hexagonal wooden pencil, the sharpened end showing pale wood and a graphite point, one hard shadow side.",
    "Drawing: exactly the hand of the first attached image: clean modern anime model-sheet illustration, crisp even dark-grey "
    "outlines, flat colours with exactly one hard-edged shadow tone per material (skin, sleeve, cuff, pencil), simple shapes, few "
    "inner lines, no gradients, no blur, no texture. Not a man's hand, no veins.",
    ALPHA, NO_TEXT, NO_RED,
])

CLASSMATES4 = "\n".join([
    "Redraw the first attached lineup exactly: the same six students in the same order, the same poses, faces, hair, uniforms, cards, "
    "sizes and positions on the same canvas, the same drawing hand (one teal ink, clean line art, regular round screentone dots), the "
    "same fully TRANSPARENT background (PNG alpha). Change ONLY these two things; everything else stays line for line:",
    "(1) The girl at the far right (two low braids, yawning): her hand COVERS her yawning mouth. Her palm and fingers lie over her "
    "mouth, so the open mouth is hidden behind the hand; only her sleepy half-closed eyes, her eyebrows and the top of her cheeks show "
    "above the fingers. The hand is on the mouth, not below the chin.",
    "(2) The boy at the far left (messy hair, round glasses, 163 cm) is a little SHORTER than the laughing boy fifth from the left "
    "(166 cm, the tallest): both stand on the same foot line, and the top of the glasses boy's hair is clearly LOWER than the top of "
    "the tall boy's hair, about level with the tall boy's hairline. Draw the glasses boy about 4% smaller overall (not squashed); his "
    "feet stay where they are.",
    ALPHA, NO_TEXT, NO_RED,
])

LP4 = "\n".join([
    "Redraw the first attached design sheet (this film's gold-top Les Paul: front view left, side view middle, back view right) "
    "EXACTLY: the same three guitars, the same layout, positions, outlines, sizes, colours, drawing hand and the same fully "
    "TRANSPARENT background (PNG alpha). Its geometry is MEASURED and must not move: every fret and every inlay stays exactly where "
    "it is, the slim side-view neck keeps its depth, the back-view neck keeps its width (the same as the front view). Change ONLY "
    "these two details on the FRONT view; everything else stays line for line:",
    "(1) FINGERBOARD BINDING: a thin CREAM binding strip runs along BOTH long edges of the dark rosewood fingerboard, from the nut "
    "down to the fingerboard's end, and across that end: the same cream as the binding round the body's top edge, a narrow even "
    "strip on each side (about a tenth of the fingerboard's width), the frets running across the board between the two strips.",
    "(2) TRUSS-ROD COVER: on the black headstock face just above the nut, a solid BLACK bell-shaped plate (narrow rounded top, "
    "flaring to a flat bottom edge just above the nut, about as wide at the bottom as half the nut and about twice as tall as it is "
    "wide), a FILLED plate, outlined by a thin cream edge line, with two tiny screws, no text. The strings pass over it on their way "
    "from the nut to the tuner posts. It replaces the thin arch outline that is there now.",
    HER_HAND,
    ALPHA, NO_TEXT, NO_RED.replace("orange", "orange (the only warm colour is the gold top and gold knobs)"),
])

# reader_g has the right layout; two things are still off: the eraser at (4) is far too fat (sleeve 2.2:1 against the big
# eraser's 3.6:1) and the print head (5) overlaps the rising paper strip, so the strip seems to go through it.
READER4B = "\n".join([
    "Redraw the first attached technical illustration exactly: the same machine, layout, parts, callout numbers, line work, dots, "
    "hatching and the same fully TRANSPARENT background (PNG alpha). Change ONLY these two things; everything else stays line for line:",
    "(1) The vertical eraser at (4) is SLIMMER, in the proportions of the second attached design (the machine's big eraser, 16 x 3 "
    "cm): about FIVE times as tall as it is wide, keeping its height, its top and bottom positions, its carriage and rail. The "
    "rounded rubber ends are each one sixth of its height, the paper sleeve the middle two thirds, BLANK paper white with a thin teal "
    "outline (no letters, no squares, no marks; the print is set separately).",
    "(2) The print head (5) sits to the RIGHT of the rising paper strip, its left face just touching the strip's right edge; the head "
    "does NOT cover or overlap the strip anywhere, so the whole width of the strip is visible from the platen up to the slot (6). The "
    "strip's left edge runs along the platen's right side. Keep the head's height and size.",
    ALPHA, "No words or letters anywhere: only the circled numbers ① to ⑦. No watermark.", NO_RED,
])

# lespaul_e got the binding; its truss-rod cover is still read as a cream arch outline (black plate on a black face). Make the plate
# read as a separate solid object.
LP5 = "\n".join([
    "Redraw the first attached design sheet EXACTLY (the same three guitars, layout, positions, outlines, sizes, frets, colours, drawing "
    "hand, the same fully TRANSPARENT background, PNG alpha). Its geometry is measured: nothing moves. Change ONLY the small bell-shaped "
    "TRUSS-ROD COVER on the front view's headstock, just above the nut, so that it clearly reads as a separate solid plate screwed onto "
    "the headstock face:",
    "- a FILLED plate in a dark charcoal (a visibly lighter and cooler black than the headstock face around it), with one small hard "
    "highlight shape near its top;",
    "- a clear cream border band all round it, about twice as thick as the thin line there now, CLOSED along its flat bottom edge too "
    "(the bottom edge sits just above the nut, parallel to it);",
    "- two tiny silver screw heads, one near the rounded top and one near the bottom;",
    "- the strings pass OVER the plate: the strings are drawn on top of the plate, continuous lines from the nut to the tuner posts.",
    "Same size and place as the present cover. No text.",
    HER_HAND,
    ALPHA, NO_TEXT, NO_RED.replace("orange", "orange (the only warm colour is the gold top and gold knobs)"),
])


def write(name, text):
    open(os.path.join(here, name + '.txt'), 'w', encoding='utf-8').write(text.strip() + "\n")


jobs = []
for name, (text, refs) in PEOPLE.items():
    write(name, text)
    jobs.append((name, refs))
for name, text, refs in [
    ('sp_lespaul_a', LESPAUL, [SHEET, LP_OLD]), ('sp_lespaul_b', LESPAUL, [SHEET, LP_OLD]),
    ('sp_gigbag_a', GIGBAG, [SHEET, LP_OLD]), ('sp_gigbag_b', GIGBAG, [SHEET, LP_OLD]),
    ('sp_leadholder_a', LEADHOLDER, [SHEET]),
    ('sp_eraser_a', ERASER, [PRINT_REF]), ('sp_eraser_b', ERASER, [PRINT_REF]),
    ('sp_lockers_a', LOCKERS, [PRINT_REF]), ('sp_lockers_b', LOCKERS, [PRINT_REF]),
    ('sp_gate_a', GATE, [PRINT_REF]),
    ('sp_reader_a', READER, [PRINT_REF]), ('sp_reader_b', READER, [PRINT_REF]),
    ('sp_selfintro_a', SELFINTRO, []), ('sp_selfintro_b', SELFINTRO, []),
    ('sp_essay_a', ESSAY, []), ('sp_essay_b', ESSAY, []),
    # round 2
    ('sp_gate_b', GATE2, [PRINT_REF]), ('sp_gate_c', GATE2, [PRINT_REF]),
    ('sp_lockers_c', LOCKERS2, [PRINT_REF]),
    ('sp_essay_c', ESSAY2, []), ('sp_essay_d', ESSAY2, []),
    ('sp_lespaul_b_side', LP_SIDEFIX, ['out/sp_lespaul_b.png', SHEET]),
    # round 3 (fixes after the art review)
    ('sp_lespaul_c', LP3, [CANON + 'lespaul_goldtop_front_side_back.png', 'board/guide_lespaul.png', SHEET]),
    ('sp_lespaul_d', LP3, [CANON + 'lespaul_goldtop_front_side_back.png', 'board/guide_lespaul.png', SHEET]),
    ('sp_eraser_c', ERASER3, [CANON + 'machine_big_eraser.png', PRINT_REF]),
    ('sp_eraser_d', ERASER3, [CANON + 'machine_big_eraser.png', PRINT_REF]),
    ('sp_reader_c', READER3, [PRINT_REF, CANON + 'coin_lockers_front.png']),
    ('sp_reader_d', READER3, [PRINT_REF, CANON + 'coin_lockers_front.png']),
    ('sp_gate_d', GATE3, ['board/guide_gate.png', CANON + 'coin_lockers_front.png', PRINT_REF]),
    ('sp_gate_e', GATE3, ['board/guide_gate.png', CANON + 'coin_lockers_front.png', PRINT_REF]),
    ('sp_gigbag_c', GIGBAG3, [CANON + 'gigbag_front_back_side_open.png', SHEET]),
    ('sp_gigbag_d', GIGBAG3, [CANON + 'gigbag_front_back_side_open.png', SHEET]),
    ('sp_leadholder_b', LEADHOLDER3, [CANON + 'leadholder_2mm.png', SHEET]),
    ('sp_leadholder_c', LEADHOLDER3, [CANON + 'leadholder_2mm.png', SHEET]),
    ('sp_hand_a', HAND3_A, [CANON + 'rin_turnaround.png', CANON + 'rin_hand_pencil_demo1.png']),
    ('sp_hand_b', HAND3_B, [CANON + 'rin_turnaround.png']),
    ('sp_classmates_a', CLASSMATES3, [TOWN + 'h05_shimizu_aoi_sailor.png', TOWN + 'p05_watanabe_sho_gakuran.png',
                                      TOWN + 'classmates_lineup_ref.png']),
    ('sp_classmates_b', CLASSMATES3, [TOWN + 'h05_shimizu_aoi_sailor.png', TOWN + 'p05_watanabe_sho_gakuran.png',
                                      TOWN + 'classmates_lineup_ref.png']),
    ('sp_h04_kimura_v3', H04_3, [TOWN + 'h04_kimura_hiroshi_chief.png', PRINT_REF]),
    ('sp_p02_tanaka_v3', FACE_P02, [TOWN + 'p02_tanaka_misaki_officeworker.png']),
    ('sp_p06_yamamoto_v3', FACE_P06, [TOWN + 'p06_yamamoto_sakura_student.png']),
    ('sp_h02_matsumoto_v3', FACE_H02, [TOWN + 'h02_matsumoto_aya_clerk.png']),
    ('sp_p07_kobayashi_v3', FACE_P07, [TOWN + 'p07_kobayashi_yumi_and_sota.png']),
    ('sp_gate_f', GATE3B, ['out/sp_gate_e.png', CANON + 'coin_lockers_front.png']),
    ('sp_gate_g', GATE3B, ['out/sp_gate_e.png', CANON + 'coin_lockers_front.png']),
    ('sp_reader_e', READER3B, ['out/sp_reader_d.png', 'out/sp_eraser_c.png']),
    ('sp_reader_f', READER3B, ['out/sp_reader_d.png', 'out/sp_eraser_c.png']),
    ('sp_hand_c', HAND4_TOP, [CANON + 'rin_turnaround.png', '../ref/sheet_hands.png']),
    ('sp_hand_d', HAND4_TOP, [CANON + 'rin_turnaround.png', '../ref/sheet_hands.png']),
    ('sp_hand_e', HAND4_SIDE, [CANON + 'rin_turnaround.png', '../ref/sheet_hands.png']),
    ('sp_hand_f', HAND4_SIDE, [CANON + 'rin_turnaround.png', '../ref/sheet_hands.png']),
    ('sp_p07_kobayashi_v4', FACE_P07B, [TOWN + 'p07_kobayashi_yumi_and_sota.png']),
    ('sp_p07_kobayashi_v5', FACE_P07B, [TOWN + 'p07_kobayashi_yumi_and_sota.png']),
    ('sp_hand_g', HAND5, ['out/sp_hand_e.png', '../ref/sheet_hands.png']),
    ('sp_hand_h', HAND5, ['out/sp_hand_e.png', '../ref/sheet_hands.png']),
    ('sp_hand_i', HAND5, ['out/sp_hand_f.png', '../ref/sheet_hands.png']),
    ('sp_hand_j', HAND5, ['out/sp_hand_f.png', '../ref/sheet_hands.png']),
    # round 4 (second art review)
    ('sp_eraser_e', ERASER4, ['board/guide_eraser.png', CANON + 'machine_big_eraser.png', PRINT_REF]),
    ('sp_eraser_f', ERASER4, ['board/guide_eraser.png', CANON + 'machine_big_eraser.png', PRINT_REF]),
    ('sp_reader_g', READER4, ['board/guide_reader.png', PRINT_REF, CANON + 'coin_lockers_front.png',
                              CANON + 'card_reader_cutaway.png']),
    ('sp_reader_h', READER4, ['board/guide_reader.png', PRINT_REF, CANON + 'coin_lockers_front.png',
                              CANON + 'card_reader_cutaway.png']),
    ('sp_hand_k', HAND6, [CANON + 'rin_turnaround.png', '../ref/sheet_hands.png', 'board/guide_hand.png']),
    ('sp_hand_l', HAND6, [CANON + 'rin_turnaround.png', '../ref/sheet_hands.png', 'board/guide_hand.png']),
    ('sp_hand_m', HAND6, [CANON + 'rin_turnaround.png', '../ref/sheet_hands.png', 'board/guide_hand.png']),
    ('sp_classmates_c', CLASSMATES4, [TOWN + 'classmates_lineup_ref.png']),
    ('sp_classmates_d', CLASSMATES4, [TOWN + 'classmates_lineup_ref.png']),
    ('sp_reader_i', READER4B, ['out/sp_reader_g.png', 'out/sp_eraser_e_print.png']),
    ('sp_reader_j', READER4B, ['out/sp_reader_g.png', 'out/sp_eraser_e_print.png']),
    ('sp_lespaul_h', LP5, ['out/sp_lespaul_e_fit.png']),
    ('sp_lespaul_i', LP5, ['out/sp_lespaul_e_fit.png']),
    ('sp_lespaul_e', LP4, ['out/sp_lespaul_e_geo.png']),
    ('sp_lespaul_f', LP4, ['out/sp_lespaul_e_geo.png']),
    ('sp_lespaul_g', LP4, ['out/sp_lespaul_e_geo.png']),
]:
    write(name, text)
    jobs.append((name, refs))

only = set(sys.argv[1:])
args = [f"-{n}" + (":" + "+".join(r) if r else "") for n, r in jobs if not only or n in only]
print(" ".join(f'"{a}"' for a in args))
