// The film's colours: the ONLY place colour values are written (docs/制作约定.md 第四节). Pages and libraries import from here.
// Three plates: paper white, teal print (碧青, also her eye colour #218EA3), pencil black. She is the only full-colour thing in the
// frame; the gold Les Paul is the only warm colour. No red anywhere in the film (the original PV's colour): judgements,
// corrections, errors and stamps are pencil black or teal.
//
// Every value used by the two confirmed demos (第 15 版: web/scenes/a2v4_page.js, web/scenes/c1a_page.js) is kept here exactly as
// it was, so the confirmed frames do not change. Where one purpose has two different values, both are kept as named constants
// and marked 待统一 (to be unified when a page is next redesigned; changing them now would change confirmed frames).

// ---- paper ----
export const PAPER = '#f7f5ef';            // answer sheets, question pages, label grounds (both demos)
export const PAPER_RGB = [247, 245, 239];
export const PAPER_SLIP = '#f9f8f3';       // the reading machine's result slip (a2v4); a whiter, thinner paper on purpose
export const PAPER_CARD = '#f5f3ed';       // 待统一: the same paper white as card.js PAPER and sheet.js PAPERW (old pages, cards);
                                           //   differs from PAPER by 2 levels
export const FIBRE_RGB = [150, 140, 120];  // paper fibres (alpha varies per fibre): rgba(FIBRE_RGB, a)

// ---- teal print (碧青) ----
export const TEAL = '#218ea3';             // printed ink: rules, bands, bubbles, labels, sheet text (both demos; = card.js INK #218EA3)
export const TEAL_RGB = [33, 142, 163];    // tints of TEAL: rgba(TEAL_RGB, 0.06) row stripes, 0.12 header band
export const EYE = '#218EA3';              // her eye colour (官方基础设定); the same value as TEAL
export const FIELD = '#1f8ea3';            // 待统一: the teal field behind the sheets in a2v4; 2 levels from TEAL (same plate)
export const FIELD_SHADOW = '#15626f';     // 待统一: a sheet's drop shadow on the teal field (a2v4 sheets)
export const FIELD_SHADOW_SLIP = 'rgba(10,50,58,0.35)';   // 待统一: the slip's drop shadow on the same field (a2v4); same purpose as FIELD_SHADOW
export const HAND_SHADOW = 'rgba(18,58,66,0.28)';         // the hand's shadow on the paper (hand.js)
export const CARD_SHADOW = 'rgba(20,60,70,0.22)';         // a card's shadow on the paper (c1a)

// ---- pencil black ----
export const GRAPHITE = '#2a2a2f';         // ink black of the machine print, leader lines, the field behind c1a, the default pen
export const INK_RGB = [42, 42, 47];       // the same black as an [r,g,b] (16-dot print, hatching strokes rgba(INK_RGB, a))
export const PENCIL = 'rgba(46,46,52,0.92)';        // 待统一: her pencil handwriting (a2v4 pencil words)
export const PENCIL_LETTER = 'rgba(46,46,52,0.9)';  // 待统一: pencil-toned letters (print.js whiteLetter tone 'pencil'); same purpose as PENCIL
export const PENCIL_FILL = 'rgba(44,44,50,0.95)';   // 待统一: a bubble filled in pencil (a2v4 marks); third value for pencil black
export const PENCIL_ERASED = 'rgba(96,96,104,0.14)'; // an erased mark's ghost (a2v4)
export const GRAPHITE_FIELD = '#1c1c20';   // a page under many layers of pencil (c1a black page)
export const GRAPHITE_LIGHT_RGB = [58, 58, 66];     // lighter graphite strokes in that field
export const GRAPHITE_DARK_RGB = [14, 14, 18];      // darker graphite strokes in that field
export const REHATCH_DARK_RGB = [18, 18, 22];       // 待统一: fresh pencil over the graphite (c1a); near GRAPHITE_DARK_RGB
export const REHATCH_LIGHT_RGB = [96, 96, 106];     // 待统一: the sheen of fresh pencil (c1a); near PENCIL_ERASED's rgb
export const RUBBED_WHITE = '#f2f0ea';     // letters rubbed out of the graphite with an eraser (c1a)
export const ERASER_STREAK = '#d8d6ce';    // the eraser's streak over the graphite (c1a)

// ---- helpers ----
// rgba(rgb, a) gives exactly the string the demos wrote by hand, e.g. rgba(FIBRE_RGB, 0.03) -> 'rgba(150,140,120,0.03)'
export const rgba = (rgb, a) => `rgba(${rgb.join(',')},${a})`;
export const rgb = c => `rgb(${c.join(',')})`;

// The no-red rule as a check: true if a colour reads as red/orange-red (hue within 25 degrees of red, saturated, not dark).
// Accepts '#rrggbb', 'rgb(...)', 'rgba(...)' or [r,g,b].
export function isRed(c) {
  let r, g, b;
  if (Array.isArray(c)) [r, g, b] = c;
  else if (/^#[0-9a-f]{6}$/i.test(c)) [r, g, b] = [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
  else { const m = String(c).match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/); if (!m) return false; [r, g, b] = m.slice(1, 4).map(Number); }
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b); if (mx < 80 || mx - mn < 60) return false;
  let h; if (mx === r) h = ((g - b) / (mx - mn)) * 60; else if (mx === g) h = (2 + (b - r) / (mx - mn)) * 60; else h = (4 + (r - g) / (mx - mn)) * 60;
  h = (h + 360) % 360; return h <= 25 || h >= 335;
}
