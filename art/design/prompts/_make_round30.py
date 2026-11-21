import os
here = os.path.dirname(os.path.abspath(__file__))
PRINT = ("Drawing style: exactly like the people in the first attached image: a printed illustration in ONE ink colour only, teal (#218EA3) line art on pure white paper, "
         "with clean regular teal screentone dots for shadows and darker clothing, solid teal or dense teal dots for black hair and dark suits. No other colours, no grey, no black. "
         "One single figure (or the one pair described) on a pure white background, full body, feet visible, nothing else in the picture: no floor, no gate, no shadow on the ground.")
def ANGLE(deg, dist):
    return (f"Camera: seen from ABOVE, exactly like the girl in the second attached image: the viewer's eye is about 2.3 m above the floor and about {dist} m away, looking down at "
            f"about {deg} degrees. This high angle must be obvious: we see the top of the head and the upper side of the shoulders, the face is seen a little from above, the body narrows "
            "slightly toward the feet, and we see the TOPS of the shoes (not a side view of the shoes). Not an eye-level view.")
CARD = "If the person wears a name card, it is a small plain white landscape card (about 12 cm wide, only a thin teal border, nothing printed on it) on a grey lanyard at the middle of the chest."
jobs = {
 # ---- 01: the gate hall, people tapping through and walking on ----
 'g1_instructor': ("The young cram-school instructor in the V-neck sweater from the first attached lineup (same face, hair and clothes), walking through a ticket gate toward the viewer's left: "
   "mid-stride, his right forearm reaching forward at waist height, his right hand holding his name card flat by its edge on an invisible horizontal card reader about 1 m from the floor (not drawn); "
   "his lanyard runs from his neck to the card; he looks at the reader with a relaxed face. Body in three-quarter view turned about 35 degrees toward the viewer's LEFT.", 22, 4.5),
 'g1_elder': ("The elderly man with grey hair, glasses, the cardigan and the wooden cane from the first attached lineup (same face and clothes), standing in a queue, waiting his turn: "
   "his left hand on the cane, his right hand holding his name card up ready in front of his chest, looking ahead patiently. Three-quarter view turned about 35 degrees toward the viewer's LEFT.", 20, 5.5),
 'g1_salaryman': ("The salaryman in the dark suit and loosened tie from the first attached lineup (same face, hair and clothes), just through the gate and walking toward the viewer (slightly to the viewer's left), "
   "mid-stride, looking down at the phone in his right hand, his left hand in his pocket, his name card swinging on its lanyard. Front three-quarter view.", 22, 4.0),
 'g1_officewoman': ("The office woman in the skirt suit holding the binder from the first attached lineup (same face, bob hair and clothes), walking through a ticket gate toward the viewer's left: "
   "mid-stride, her right hand pressing her name card flat by its edge on an invisible horizontal card reader at waist height (not drawn), the binder under her left arm, brisk and expressionless. "
   "Three-quarter view turned about 35 degrees toward the viewer's LEFT.", 20, 6.0),
 'g1_mother': ("The mother in the long coat with the tote bag, holding the hand of her small boy in the hooded jacket, from the first attached lineup (same faces and clothes), walking AWAY from the viewer "
   "toward the back right, seen in three-quarter BACK view; the boy turns his head back toward the viewer. This pair is one figure.", 16, 8.0),
 'g1_students': ("Two 14-year-old classmates from the third attached lineup walking side by side toward the viewer's left, chatting: the boy with glasses and the girl with the bob in the cardigan "
   "(same faces, hair and uniforms, small 14-year-old builds). This pair is one figure, close together but not overlapping. Three-quarter view.", 15, 9.0),
 # ---- 05: the hall at the end, everyone's card has just fallen off, empty clips ----
 'g5_salaryman': ("The salaryman in the dark suit and loosened tie from the first attached lineup, standing still, holding up the empty clip of his lanyard in his right hand and staring at it, stunned. "
   "His name card has fallen off: the lanyard ends in an EMPTY clip. Three-quarter view turned about 35 degrees toward the viewer's LEFT.", 18, 5.0),
 'g5_officewoman': ("The office woman in the skirt suit with the binder from the first attached lineup, standing still, looking up into the air, lips slightly parted, the binder against her chest. "
   "Her name card has fallen off: her lanyard ends in an EMPTY clip. Three-quarter view turned about 35 degrees toward the viewer's LEFT.", 18, 6.0),
 'g5_mother': ("The mother in the long coat holding her small boy's hand from the first attached lineup: the boy looks up in wonder, the mother looks down at him. Both lanyards end in EMPTY clips "
   "(their cards have fallen off). This pair is one figure. Three-quarter view turned about 35 degrees toward the viewer's LEFT.", 16, 8.0),
 'g5_elder': ("The elderly man with the cane from the first attached lineup, standing still, looking up calmly with the faintest smile of relief, both hands resting on the cane. His lanyard ends in an "
   "EMPTY clip. Three-quarter view turned about 35 degrees toward the viewer's LEFT.", 16, 8.0),
 'g5_girl': ("The 14-year-old girl with the long black ponytail from the third attached lineup (same face, hair, uniform with blazer and ribbon tie, small slim 14-year-old build, about 150 cm), standing still, "
   "touching the EMPTY clip of her lanyard on her chest with her fingertips and looking down at it. Three-quarter view turned about 35 degrees toward the viewer's LEFT.", 15, 9.0),
 'g5_clerk': ("The convenience-store clerk with the low ponytail, striped short-sleeved shirt and apron from the first attached lineup, standing frozen, both hands still at her chest where her card was; "
   "her lanyard ends in an EMPTY clip; she stares at the air in front of her. Three-quarter view turned about 35 degrees toward the viewer's LEFT.", 22, 4.5),
}
for name, (body, deg, dist) in jobs.items():
    open(os.path.join(here, name + '.txt'), 'w', encoding='utf-8').write(
        "One illustration (portrait 2:3).\n" + body + "\n" + ANGLE(deg, dist) + "\n" + CARD + "\n" + PRINT + "\n")
print(len(jobs), 'prompts')
