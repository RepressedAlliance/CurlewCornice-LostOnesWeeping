"""Grey guide drawings for segment 11 (docs/分镜/11_前副歌2.md): where the blank cards go, so the four cards of S3b sit on one
level line and the card of S3a fills half the frame. Written to art/design/board/guide_seg11_*.png."""
from PIL import Image, ImageDraw
import os
here = os.path.dirname(os.path.abspath(__file__))
out = os.path.join(here, '..', 'board')
W, H = 1536, 1024
G, L = (150, 150, 150), (205, 205, 205)

def base():
    im = Image.new('RGB', (W, H), (255, 255, 255)); return im, ImageDraw.Draw(im)

# trio and her: 75 cm x 50 cm canvas, 20.48 px/cm; shoulder line 6 cm below the top; card tops 9 cm below the shoulders
PX = W / 75
def cm(v): return v * PX
def trio():
    im, d = base(); sy = cm(6); d.line([(0, sy), (W, sy)], fill=L, width=3)
    for cx, w in [(13.9, 14.25), (32.5, 15.0), (51.1, 14.25)]:
        h = w / 1.5; x0 = cm(cx - w / 2); y0 = cm(15); d.rectangle([x0, y0, x0 + cm(w), y0 + cm(h)], outline=G, width=6)
        d.line([(cm(cx), 0), (cm(cx), y0)], fill=L, width=3)
    im.save(os.path.join(out, 'guide_seg11_trio.png'))
def her():
    im, d = base(); sy = cm(6); d.line([(0, sy), (W, sy)], fill=L, width=3)
    cx, w = 37.5, 15.0; h = w / 1.5; x0 = cm(cx - w / 2); y0 = cm(15); d.rectangle([x0, y0, x0 + cm(w), y0 + cm(h)], outline=G, width=6)
    d.line([(cm(cx), 0), (cm(cx), y0)], fill=L, width=3)
    im.save(os.path.join(out, 'guide_seg11_row.png'))
def cb():
    # 30 cm x 20 cm canvas: card 15 x 10 cm, centred, its top 6 cm below the canvas top
    im, d = base(); p = W / 30
    d.rectangle([p * 7.5, p * 6, p * 22.5, p * 16], outline=G, width=6); d.line([(p * 15, 0), (p * 15, p * 6)], fill=L, width=4)
    im.save(os.path.join(out, 'guide_seg11_cb.png'))
trio(); her(); cb()
print('ok')
