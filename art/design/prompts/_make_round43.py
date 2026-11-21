"""Round 43: the roof riff is a rock riff and the shot has to play like one. More violent poses from the same
master (rlow3_master_k, same low camera, one change each), and three close-ups for hard-cut inserts.
"""
import os
here = os.path.dirname(os.path.abspath(__file__))
KEEP = ("One full-body illustration (portrait 2:3).\nRedraw the attached image exactly: the same girl, the same face, hair, bow, hairclips, "
        "uniform, the same gold Les Paul and its black cable, the same name card on its teal lanyard, the same LOW camera from waist height "
        "looking up, the same size in the canvas, the same clean anime drawing style and colours, pure white background, no motion blur, no "
        "speed lines. Change only this: ")
STYLE_CU = ("Style exactly like the first attached image: clean modern Japanese anime illustration, crisp even dark-gray lines, flat colours "
            "with exactly one hard-edged shadow tone, no gradients, no blur, no speed lines, no text. Pure white background.")
jobs = {
 'rlow3_bang': KEEP + ("mid-headbang: her head is whipped DOWN hard toward the guitar, her short hair flung forward over her face in "
   "sharp clumps (face half hidden, gritted teeth visible), the bow tilted forward, shoulders hunched, her right hand just hitting the strings "
   "in a hard downstroke. Feet planted wide as before."),
 'rlow3_back': KEEP + ("she leans far BACK, the guitar neck raised to point up at the sky, screaming at the sky with her mouth wide open "
   "and eyes open, her back arched, one knee bent forward, hair and skirt swinging back. Both feet stay on the ground."),
 'rlow3_jump': KEEP + ("she JUMPS: both feet off the ground about 30 cm, knees bent up, the guitar swinging up with her, skirt and hair "
   "lifted by the jump, mouth open shouting, eyes open. Leave the same empty space under her shoes as the height of the jump."),
 'rlow3_stroke': KEEP + ("a huge downstroke: her right arm has swung all the way down past the strings, pick in hand, her whole body leans "
   "forward into the guitar, hair thrown forward, teeth gritted, eyes fierce on the camera. Feet planted wide as before."),
 'rlow3_stomp': KEEP + ("she STOMPS her right foot down hard (the foot just landing flat, knee bent), leaning into the guitar, her head "
   "jerked down on the beat, hair bouncing, teeth gritted. The left foot stays where it was."),
 'rcu_face': ("One illustration (landscape 3:2). An extreme close-up of the girl in the first attached image (Kagamine Rin in this film's "
   "design: short blonde bob, large white bow, white hairclips in her fringe, teal eyes #218EA3, charcoal blazer, white shirt, teal ribbon "
   "tie, the teal lanyard of her name card round her neck): seen from below at a steep angle, her face fills the frame, screaming with all "
   "her strength, mouth wide open, eyes open and fierce, brows down, her hair whipping sideways in sharp clumps, a few drops of sweat flying. "
   "The bow is partly cut by the top edge of the frame. " + STYLE_CU),
 'rcu_hand': ("One illustration (landscape 3:2). An extreme close-up from a low angle of the right hand of the girl in the first attached "
   "image, in her charcoal blazer sleeve with the white shirt cuff, striking the strings of her gold-top Les Paul (second attached image: "
   "gold top, two cream P-90 pickups, the bridge and the tune-o-matic) with a small pick, hard downstroke, wrist bent; the six strings "
   "vibrating, drawn as clean doubled lines. Only the hand, the cuff and that part of the guitar body are in the frame. " + STYLE_CU),
 'rcu_feet': ("One illustration (landscape 3:2). A close-up at floor level of the feet of the girl in the first attached image: her brown "
   "loafers and black knee socks, the right foot stomping down flat on grey concrete roof tiles, the left foot planted, a black guitar cable "
   "lying across the tiles, seen from very low, the hem of her charcoal pleated skirt at the top of the frame. " + STYLE_CU.replace(
   "Pure white background.", "Draw the concrete tiles in flat grey with thin joints.")),
}
for name, body in jobs.items():
    open(os.path.join(here, name + '.txt'), 'w', encoding='utf-8').write(body + "\n")
print(len(jobs), 'prompts')
