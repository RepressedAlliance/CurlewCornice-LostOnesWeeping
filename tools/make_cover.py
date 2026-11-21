"""Compose the release cover from the film's own character art.

Usage: python tools/make_cover.py [glare|raise|scream ...]   -> docs/media/cover_candidates/
       python tools/make_cover.py export glare               -> docs/media/cover*.png
Candidates are 1920x1080. Key content stays inside the
centre 1440 px (Bilibili crops the feed card to 4:3) and the bottom strip is kept
quiet (play count / duration overlay).
"""
import random
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
CUT = ROOT / "art" / "cut"
FONTS = ROOT / "assets" / "fonts"
OUT = ROOT / "docs" / "media"

W, H = 1920, 1080
SAFE_L, SAFE_R = 240, 1680          # 4:3 centre crop
INK = (30, 32, 38)                   # chalkboard charcoal
TEAL = (33, 142, 163)                # #218EA3, same as Rin's eyes / print colour
CREAM = (240, 236, 224)


def font(name, size):
    return ImageFont.truetype(str(FONTS / name), size)


def chalkboard(seed=7):
    """Charcoal ground with fine pencil scratches, like the film's dark scenes."""
    rnd = random.Random(seed)
    base = Image.new("RGB", (W, H), INK)
    layer = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(layer)
    for _ in range(2600):
        x, y = rnd.uniform(-200, W), rnd.uniform(-200, H)
        ang = rnd.gauss(0.62, 0.12)
        length = rnd.uniform(40, 260)
        x2, y2 = x + length, y + length * ang
        d.line((x, y, x2, y2), fill=rnd.randint(14, 42), width=1)
    layer = layer.filter(ImageFilter.GaussianBlur(0.6))
    light = Image.new("RGB", (W, H), (150, 152, 160))
    base.paste(light, (0, 0), layer)
    # soft vignette so the edges (cropped on 4:3) fall away
    vig = Image.new("L", (W, H), 0)
    ImageDraw.Draw(vig).ellipse((-300, -260, W + 300, H + 260), fill=255)
    vig = vig.filter(ImageFilter.GaussianBlur(220))
    dark = Image.new("RGB", (W, H), (16, 17, 21))
    return Image.composite(base, dark, vig)


def halftone_slab(box, step=14, rmax=5.2, fade="right"):
    """Teal print block made of halftone dots, fading to one side."""
    x0, y0, x1, y1 = box
    slab = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(slab)
    for yy in range(y0, y1, step):
        for xx in range(x0, x1, step):
            t = (xx - x0) / max(1, x1 - x0)
            if fade == "left":
                t = 1 - t
            r = rmax * (1 - 0.85 * t)
            off = step / 2 if (yy // step) % 2 else 0
            cx = xx + off
            d.ellipse((cx - r, yy - r, cx + r, yy + r), fill=TEAL + (255,))
    return slab


def paste_char(canvas, name, height, center_x, bottom, crop=None, fade_top=0, fade_w=1.0):
    im = Image.open(CUT / f"{name}.png").convert("RGBA")
    if crop:
        im = im.crop(crop)
    bbox = im.getchannel("A").point(lambda a: 255 if a > 8 else 0).getbbox()
    im = im.crop(bbox)
    scale = height / im.height
    im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
    if fade_top:  # dissolve a source edge that was cut flat
        a = im.getchannel("A")
        ramp = Image.linear_gradient("L").resize((im.width, fade_top))
        mask = Image.new("L", im.size, 255)
        mask.paste(ramp, (0, 0))
        # only the left part (fade_w of the width) fades; blend over 40 px
        keep = Image.new("L", im.size, 0)
        edge = round(im.width * fade_w)
        keep.paste(255, (edge, 0, im.width, im.height))
        # never fade the hair ribbon (white with a cool tint; guitar parts are warm)
        r, g, b, _ = im.split()
        px_r, px_b = r.load(), b.load()
        ribbon = Image.new("L", im.size, 0)
        rp = ribbon.load()
        for yy in range(min(im.height, fade_top + 60)):
            for xx in range(round(im.width * 0.37), im.width):  # right of the guitar's bridge
                if px_b[xx, yy] >= px_r[xx, yy] - 8 and px_r[xx, yy] > 120:
                    rp[xx, yy] = 255
        ribbon = ribbon.filter(ImageFilter.MaxFilter(9))
        keep.paste(255, (0, 0), ribbon)
        keep = keep.filter(ImageFilter.GaussianBlur(3))
        mask = Image.composite(Image.new("L", im.size, 255), mask, keep)
        im.putalpha(Image.composite(a, Image.new("L", im.size, 0), mask))
    x = round(center_x - im.width / 2)
    y = round(bottom - im.height)
    # faint teal rim shadow, as in the film's print offset
    sh = Image.new("RGBA", im.size, TEAL + (0,))
    sh.putalpha(im.getchannel("A").point(lambda a: int(a * 0.55)))
    canvas.alpha_composite(sh, (x + 14, y + 10))
    canvas.alpha_composite(im, (x, y))
    return (x, y, x + im.width, y + im.height)


def vertical_text(canvas, text, x_center, y_top, size, fnt, fill, gap=0.06):
    d = ImageDraw.Draw(canvas)
    y = y_top
    for ch in text:
        if ch == " ":
            y += size * 0.5
            continue
        f = font(fnt, size)
        w = d.textlength(ch, font=f)
        if ch == "ー":  # long-vowel mark rotates in vertical writing
            tmp = Image.new("RGBA", (size * 2, size * 2), (0, 0, 0, 0))
            ImageDraw.Draw(tmp).text((size * 0.5, size * 0.5), ch, font=f, fill=fill)
            tmp = tmp.rotate(-90, resample=Image.BICUBIC)
            canvas.alpha_composite(tmp, (round(x_center - size), round(y - size * 0.5)))
        else:
            d.text((x_center - w / 2, y), ch, font=f, fill=fill)
        y += size * (1 + gap)
    return y


def title_block(canvas, x_center, y_top, big=140):
    """ロストワン / の号哭 as two vertical columns, film lyric typeface."""
    col1 = x_center + big * 0.62
    col2 = x_center - big * 0.62
    vertical_text(canvas, "ロストワン", col1, y_top, big, "ShipporiMincho-ExtraBold.ttf", CREAM)
    vertical_text(canvas, "の号哭", col2, y_top + big * 2.15, big, "ShipporiMincho-ExtraBold.ttf", CREAM)


def credit(canvas, x, y, anchor="la"):
    d = ImageDraw.Draw(canvas)
    d.text((x, y), "Neru feat. 鏡音リン", font=font("ZenKakuGothicNew-Bold.ttf", 40),
           fill=(150, 196, 204), anchor=anchor)


def finish(canvas, name):
    (OUT / "cover_candidates").mkdir(parents=True, exist_ok=True)
    path = OUT / "cover_candidates" / f"cover_{name}.png"
    canvas.convert("RGB").save(path)
    print(path)


def cand_glare():
    c = chalkboard().convert("RGBA")
    c.alpha_composite(halftone_slab((800, 120, 1640, 900), fade="left"))
    box = paste_char(c, "r16_glare_sh", 920, 1172, H, fade_top=150, fade_w=0.52)
    print("char box", box)
    title_block(c, 490, 120)
    credit(c, 490, 890, anchor="ma")
    finish(c, "glare")


def cand_raise():
    c = chalkboard(11).convert("RGBA")
    c.alpha_composite(halftone_slab((820, 80, 1640, 860), fade="left"))
    paste_char(c, "R16_raise", 1040, 1180, H - 10)
    title_block(c, 520, 110)
    credit(c, 520, 905, anchor="ma")
    finish(c, "raise")


def cand_scream():
    c = chalkboard(23).convert("RGBA")
    c.alpha_composite(halftone_slab((800, 140, 1660, 920), fade="left"))
    paste_char(c, "rface_scr2", 900, 1180, H - 60)
    title_block(c, 470, 110)
    credit(c, 470, 905, anchor="ma")
    finish(c, "scream")


CANDS = {"glare": cand_glare, "raise": cand_raise, "scream": cand_scream}


def export(chosen="glare"):
    """Write the platform sizes from the chosen candidate."""
    src = Image.open(OUT / "cover_candidates" / f"cover_{chosen}.png").convert("RGB")
    src.save(OUT / "cover.png")
    src.crop((SAFE_L, 0, SAFE_R, H)).save(OUT / "cover_bili_4x3.png")
    yt = src.resize((1280, 720), Image.LANCZOS)
    yt.save(OUT / "cover_youtube.png", optimize=True)
    if (OUT / "cover_youtube.png").stat().st_size >= 2_000_000:   # YouTube limit 2 MB
        yt.quantize(256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).save(
            OUT / "cover_youtube.png", optimize=True)
    src.resize((1200, 675), Image.LANCZOS).save(OUT / "cover_x.png", optimize=True)
    for n in ("cover.png", "cover_bili_4x3.png", "cover_youtube.png", "cover_x.png"):
        p = OUT / n
        print(p, Image.open(p).size, p.stat().st_size)


if __name__ == "__main__":
    args = sys.argv[1:]
    if args[:1] == ["export"]:
        export(*args[1:2])
    else:
        for n in args or CANDS:
            CANDS[n]()
