# Making Lost One's Weeping

[简体中文](全片分镜.md) · English · [日本語](guide.ja.md) · [Project home](../README.en.md)

## Story and storyboard

The opening gives the audience one rule: a machine reads the marks on each person's paper name card and takes those marks to be the person. Rin's card alone fails. Three visual threads stay readable with the sound muted: her card changes state, graphite spreads over the teal print, and the gold guitar interrupts the system. The visual grammar echoes between the opening and ending. In the opening the cards turn toward her; later people look up.

| Segment | Story and performance |
|---|---|
| 00–02 | The card fills the frame and “Cannot read” hits the name field. A row of people is scanned in time. The train clears and the cards swing on the stabs. |
| 03 | The scanner prints the first half of the title and she pencils in the second. Card taps and the gate's closure establish what she cannot pass. |
| 04–05 | Graphite first leaks into the back of her card. The gold Les Paul is uncovered. The guitar riff sends rows of ranked cards jumping and cuts a dot-matrix word through the display. |
| 06–07 | A result sheet feeds into self-introduction forms, a room full of formal approvals, and a calendar. The dream field stays empty. |
| 08a–08b | An exam page becomes a stage. An eraser sweeps across a graphite field, the abacus arrives at its result, and the rope puzzle visibly returns to its starting point. The pencil breaks. |
| 09 | The ball-stop fence carries a deep grid of cards. Rows turn to show pencilled backs, building a dark mountain before the cut finds her and the guitar. |
| 10–11 | The night train windows hold her reflection. A locker swallows the guitar bag. The pencil returns to the dream field, and the eraser reveals how other people's writing is treated. |
| 12 | Familiar test pages tear open in widening stages. She is behind the page playing the recovered guitar. Falling strips carry the late beats into the break. |
| 13 | The only negative-print passage. Under a lamp she unfolds the childhood essay. The patient reveal shows who is doing the erasing. |
| 14–16 | The reading failure is printed over the adults' cards. She frees her own and the hall fills with falling paper. Gates open, people finally turn, and the guitar strikes the scanner. The final composition echoes the opening. |

The 18 implemented segments and exact frame ranges are in [web/segments.json](../web/segments.json). The [original storyboard](全片分镜.md) is in Chinese and includes superseded ideas alongside review changes.

## Artwork, card and props

The reference pack fixes Rin's proportions, the townspeople, the scanner, guitar, lanyard and the print layout. Codex gets the relevant [reference sheets](../art/canon/) and [prompt](../art/design/prompts/) to draw one coherent pose. For a variation it gets the master and a single changed gesture, view or expression. Match the pose perspective to its camera. View the resulting sequence at actual screen size to check that palette, silhouette and prop placement hold through a swap.

Her card is 3:2 paper, always signalled by the light edge, boxes, clip hole and lanyard. “Cannot read” occupies the name band; from segment 03 the machine's dot-matrix title goes in the student number area and her pencil finishes it in the score area. The type stays clear of original field labels. The teal answer bubbles beneath the title are lightened so the graphite reads on the printed field. The back gains a graphite pattern inside its writing area, with the paper edge still visible. This matters on a phone, where a dark rectangle can read as a screen. [Card renderer](../web/lib/card.js)

Every drawn pose has its own contact coordinates for the pen, guitar strings, jack, folds or lanyard that code draws. [parts.js](../web/lib/parts.js) passes the overlays and artwork through the same placement and scale. Switch the coordinates with the drawing and inspect the two frames across the swap. This fixed the visible separation between the pen and its lead, and between the guitar and strings.

## 2D, 3D and print

- The bulk of the film is drawn in Canvas. The [gate](../web/scenes/segments/seg_03.js) uses a flat front elevation. At the [fence](../web/scenes/segments/seg_09.js), code projects turning 3D cards with thickness and lighting into Canvas. A long-lens, level view makes the grid legible and preserves the verticals. The flat character layers are placed at the corresponding scale and depth.
- Flat teal ink, graphite, screen dots and misregistration unify the worlds. Rin's full colour and the guitar's gold remain a contrast within them. No red was used in this project. Lyrics live directly on sheets and screens. [print.js](../web/lib/print.js) · [palette.js](../web/lib/palette.js)
- Test the reading order at phone width. Dot-matrix printer glyphs have to be readable when sung, and measured Japanese columns need enough room around the character. [type.js](../web/lib/type.js)

## Timing and review

The measured song grid is `0.318 + k × 0.37037` seconds, approximately 162 BPM. [score.js](../web/lib/score.js) also carries audible subdivisions. Register cuts, camera starts and stops, swaps, impacts and printing on the beat table. Add small internal responses to the image, for example a line of answer cards flipping or guitar strings ringing, to support rhythm while keeping the frame steady. Full-screen hits are limited to selected accents. The first sampled frame at a lyric onset already shows the character legibly.

Each segment was judged first as an interesting silent shot, then checked with the song against the planned beats and the rest of the film. The automatic reports cover beat positions, hold lengths and A→B→A swaps, bitmap scale, edges, stillness, colour and anchors. A finding prompts a check for the same cause elsewhere. An independent reviewer proposes required and optional fixes after the builder's own pass. The revised cut is reviewed again at phone size and in sequence. [Review workflow scripts](../work/workflows/) · [Runtime and review commands](../REPRODUCE.en.md)
