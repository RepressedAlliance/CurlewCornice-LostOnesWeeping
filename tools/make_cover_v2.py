"""Release cover v2: set the type on the four Codex key visuals (art/design/prompts/_make_cover_v2.py).

Usage: python tools/make_cover_v2.py [name ...]     -> docs/media/cover_v2/<name>.png and <name>_4x3.png
       python tools/make_cover_v2.py feed           -> docs/media/cover_v2/compare_feed.png
Each key visual (3:2) is cropped to 16:9 and scaled to 1920x1080. Everything that matters stays inside the centre
1440 px (the 4:3 feed crop on Bilibili). Type is printed INTO the picture (multiplied like ink, no outline, no glow):
the only words are the ones that belong to the world (読み取れません on the card or the gate display, the title as the
answer sheet's header) plus the song title, small and clear.
"""
import sys
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
ART = ROOT / "art" / "design" / "out"
FONTS = ROOT / "assets" / "fonts"
OUT = ROOT / "docs" / "media" / "cover_v2"

W, H = 1920, 1080
SAFE_L, SAFE_R = 240, 1680
INK = (34, 36, 42)          # pencil charcoal
TEAL = (33, 142, 163)       # #218EA3
DEEP = (18, 92, 108)        # teal ink, overprinted
PAPER = (243, 241, 234)     # #f3f1ea

MINCHO = "ShipporiMincho-ExtraBold.ttf"
MINCHO_B = "ShipporiMincho-Bold.ttf"
GOTHIC = "ZenKakuGothicNew-Bold.ttf"
GOTHIC_M = "ZenKakuGothicNew-Medium.ttf"
DOT = "DotGothic16-Regular.ttf"


def font(name, size):
    return ImageFont.truetype(str(FONTS / name), size)


def base(name, top=None, zoom=1.0, cx=0.5, cy=0.5):
    """Crop the 3:2 key visual to 16:9 (optionally zoomed in around cx, cy) and scale to 1920x1080."""
    im = Image.open(ART / f"{name}.png").convert("RGB")
    w, h = im.size
    cw = w / zoom
    ch = cw * 9 / 16
    if ch > h:
        ch = h
        cw = ch * 16 / 9
    x0 = min(max(cx * w - cw / 2, 0), w - cw)
    y0 = min(max(cy * h - ch / 2, 0), h - ch) if top is None else top
    return im.crop((round(x0), round(y0), round(x0 + cw), round(y0 + ch))).resize((W, H), Image.LANCZOS)


def text_mask(size, draw_fn):
    m = Image.new("L", size, 0)
    draw_fn(ImageDraw.Draw(m))
    return m


def ink(canvas, mask, colour, multiply=True, opacity=1.0):
    """Print a mask onto the canvas like ink: multiplied, so the paper and halftone underneath show through."""
    if opacity < 1:
        mask = mask.point(lambda a: int(a * opacity))
    layer = Image.new("RGB", canvas.size, colour)
    if multiply:
        layer = ImageChops.multiply(canvas, layer)
    canvas.paste(layer, (0, 0), mask)


def vtext(d, text, x_center, y_top, size, fnt, gap=0.04):
    """Vertical Japanese: one glyph per line, the long-vowel mark turned."""
    f = font(fnt, size)
    y = y_top
    for ch in text:
        if ch == " ":
            y += size * 0.4
            continue
        if ch in "ー―":
            d.line((x_center, y + size * 0.12, x_center, y + size * 0.88), fill=255, width=max(2, size // 11))
        else:
            d.text((x_center, y + size / 2), ch, font=f, fill=255, anchor="mm")
        y += size * (1 + gap)
    return y


S = 1080 / 1024            # source (1536x1024) -> cover scale when the full height is kept
OX = (W - 1536 * S) / 2    # source x=0 lands here (150 px); the 4:3 crop is source x 85..1451


def P(x, y):
    """Source pixel -> cover pixel."""
    return OX + x * S, y * S


def wide(name, period=None):
    """The key visual at full height on the 1920x1080 cover. The 150 px side strips (outside the 4:3 crop) come from
    <name>_wide.png (the same picture outpainted by Codex to 16:9) when it exists; the original pixels always win
    in the middle, blended over a short feather."""
    src = Image.open(ART / f"{name}.png").convert("RGB")
    mid = src.resize((round(1536 * S), H), Image.LANCZOS)
    wpath = ART / f"{name}_wide.png"
    if period:  # a regular grid: continue it by copying whole cells of the picture itself (no seam, no new drawing)
        n = round(OX / S) + 2
        ext = Image.new("RGB", (1536 + 2 * n, 1024))
        ext.paste(src.crop((period - n, 0, period, 1024)), (0, 0))
        ext.paste(src, (n, 0))
        ext.paste(src.crop((1536 - period, 0, 1536 - period + n, 1024)), (n + 1536, 0))
        full = ext.resize((round(ext.width * S), H), Image.LANCZOS)
        off = round(n * S - OX)
        return full.crop((off, 0, off + W, H))
    if wpath.exists():
        wim = Image.open(wpath).convert("RGB")
        # the outpaint canvas is 1536x1024 with the picture at 1296x864 in its middle: crop that 16:9 band
        band = wim.crop((0, 80, 1536, 944)).resize((W, H), Image.LANCZOS)
        canvas = band
    else:
        a = Image.new("RGB", (W, H))
        left = mid.crop((0, 0, 4, H)).resize((round(OX) + 2, H))
        right = mid.crop((mid.width - 4, 0, mid.width, H)).resize((round(OX) + 2, H))
        a.paste(left, (0, 0)); a.paste(right, (W - round(OX) - 2, 0))
        canvas = a
    mask = Image.new("L", mid.size, 255)
    feather = 24
    ImageDraw.Draw(mask)
    grad = Image.linear_gradient("L").rotate(90, expand=True).resize((feather, H))  # 0 at left -> 255 at right
    mask.paste(grad, (0, 0))
    mask.paste(grad.transpose(Image.FLIP_LEFT_RIGHT), (mid.width - feather, 0))
    canvas.paste(mid, (round(OX), 0), mask)
    return canvas


def save(canvas, name):
    OUT.mkdir(parents=True, exist_ok=True)
    canvas.save(OUT / f"{name}.png")
    canvas.crop((SAFE_L, 0, SAFE_R, H)).save(OUT / f"{name}_4x3.png")
    print(OUT / f"{name}.png")


def title_columns(canvas, x_right, y_top, size, colour=INK, gap_cols=1.08, drop=2.2, fnt=MINCHO):
    """ロストワン / の号哭 as two vertical columns (right column first), as in the film's lyric type."""
    m = text_mask(canvas.size, lambda d: (vtext(d, "ロストワン", x_right, y_top, size, fnt),
                                          vtext(d, "の号哭", x_right - size * gap_cols, y_top + size * drop, size, fnt)))
    ink(canvas, m, colour)


def field_text(canvas, text, box, fnt, colour, fill_h=0.86, multiply=True, track=0.0):
    """Set text centred in a source-pixel box (a card field, a display), as big as the box allows."""
    x0, y0 = P(box[0], box[1]); x1, y1 = P(box[2], box[3])
    size = int((y1 - y0) * fill_h)
    f = font(fnt, size)
    while True:
        w = sum(f.getlength(c) for c in text) + track * size * (len(text) - 1)
        if w <= (x1 - x0) * 0.92:
            break
        size -= 2
        f = font(fnt, size)

    def draw(d):
        x = (x0 + x1) / 2 - w / 2
        for c in text:
            d.text((x, (y0 + y1) / 2), c, font=f, fill=255, anchor="lm")
            x += f.getlength(c) + track * size
    m = text_mask(canvas.size, draw)
    ink(canvas, m, colour, multiply=multiply)
    return size


LAYOUT = {
    # source image, and every position in SOURCE pixels (1536x1024), read off the chosen picture
    "unreadable": dict(src="cv2_unreadable_fix_a", field=(597, 731, 988, 777), title=(400, 70), size=92),
    "swing": dict(src="cv2_swing_fix_a", screen=(297, 858, 427, 919), title=(1378, 60), size=96),
    "onlycolor": dict(src="cv2_onlycolor_fix_b", band=(0, 0, 1536, 205), size=110),
    "smile": dict(src="cv2_smile_fix_a", title=(1365, 60), size=96),
}


def cover_unreadable():
    L = LAYOUT["unreadable"]
    c = wide(L["src"])
    field_text(c, "読み取れません", L["field"], GOTHIC, INK, fill_h=0.84)
    x, y = P(*L["title"])
    title_columns(c, x, y, L["size"], colour=INK)
    save(c, "unreadable")


def cover_swing():
    L = LAYOUT["swing"]
    c = wide(L["src"])
    x0, y0, x1, y1 = L["screen"]
    ym = (y0 + y1) / 2
    for line, box in (("読み取れ", (x0, y0 + 3, x1, ym)), ("ません", (x0, ym, x1, y1 - 3))):
        field_text(c, line, box, DOT, (190, 232, 236), fill_h=0.92, multiply=False, track=0.06)
    x, y = P(*L["title"])
    title_columns(c, x, y, L["size"], colour=INK)
    save(c, "swing")


def cover_onlycolor():
    L = LAYOUT["onlycolor"]
    c = wide(L["src"], period=192)
    x0, y0 = P(L["band"][0], L["band"][1]); x1, y1 = P(L["band"][2], L["band"][3])
    size = L["size"]
    cy = (y0 + y1) / 2 + 4
    f = font(MINCHO, size)
    title = "ロストワンの号哭"
    tw = f.getlength(title)
    lab = font(GOTHIC, 26); nm = font(MINCHO_B, 40)
    lw = 96
    nw = nm.getlength("鏡音リン") + 40
    group = tw + 50 + lw + nw
    tx = W / 2 - group / 2
    m = text_mask(c.size, lambda d: d.text((tx, cy), title, font=f, fill=255, anchor="lm"))
    ink(c, m, INK)
    # the answer sheet's own name box at the right of the header: なまえ | 鏡音リン
    bx0, by0 = tx + tw + 50, cy - 34
    d = ImageDraw.Draw(c)
    d.rectangle((bx0, by0, bx0 + lw, by0 + 68), fill=TEAL)
    d.rectangle((bx0, by0, bx0 + lw + nw, by0 + 68), outline=TEAL, width=3)
    d.text((bx0 + lw / 2, by0 + 34), "なまえ", font=lab, fill=PAPER, anchor="mm")
    m = text_mask(c.size, lambda dd: dd.text((bx0 + lw + 20, by0 + 36), "鏡音リン", font=nm, fill=255, anchor="lm"))
    ink(c, m, INK)
    save(c, "onlycolor")


def cover_smile():
    L = LAYOUT["smile"]
    c = wide(L["src"])
    x, y = P(*L["title"])
    title_columns(c, x, y, L["size"], colour=INK)
    save(c, "smile")


COVERS = {"unreadable": cover_unreadable, "swing": cover_swing, "onlycolor": cover_onlycolor, "smile": cover_smile}

def main():
    if sys.argv[1:] == ["feed"]:
        return feed()
    if sys.argv[1:2] == ["final"]:
        for n in sys.argv[2:] or FINAL:
            FINAL[n]()
        return
    if sys.argv[1:] == ["final_compare"]:
        return final_compare()
    for n in sys.argv[1:] or COVERS:
        COVERS[n]()


# ---- final covers (round 4, after the three viewer reviews) ----
# The Codex picture (1536x1024, 3:2) is cropped to 16:9 by cutting 80 px top and bottom, then scaled x1.25 to 1920x1080.
# The only words in the picture: the song title, and 読み取れません as the machine's own message (the gate screen) or as
# an error label printed on her card / her torn cell: a solid charcoal bar with paper-white type, like a reader's
# rejection slip, the same in every cover so the hook reads the same everywhere.
FS = 1.25


def Q(x, y):
    """Final source pixel (1536x1024) -> cover pixel."""
    return x * FS, (y - 80) * FS


def final_base(src):
    im = Image.open(ART / f"{src}.png").convert("RGB")
    if im.size != (1536, 1024):
        im = im.resize((1536, 1024), Image.LANCZOS)
    return im.crop((0, 80, 1536, 944)).resize((W, H), Image.LANCZOS)


def dark_box(src, region, thresh=70, frac=0.55):
    """Bounding box (source px) of the dark screen inside region: rows and columns that are mostly dark."""
    import numpy as np
    im = Image.open(ART / f"{src}.png").convert("L")
    if im.size != (1536, 1024):
        im = im.resize((1536, 1024), Image.LANCZOS)
    x0, y0, x1, y1 = region
    a = np.asarray(im.crop(region)) < thresh
    rows = np.where(a.mean(axis=1) > frac * a.mean(axis=1).max())[0]
    cols = np.where(a.mean(axis=0) > frac * a.mean(axis=0).max())[0]
    return (x0 + cols.min(), y0 + rows.min(), x0 + cols.max(), y0 + rows.max())


def error_label(canvas, text, center, size, angle=-5, pad=(0.55, 0.32), fnt=GOTHIC):
    """読み取れません as a rejection label: a solid charcoal bar, paper-white type, slightly rotated, a thin paper
    rule inside the edge. Drawn on its own layer and rotated, then printed (multiplied) onto the picture."""
    f = font(fnt, size)
    tw = f.getlength(text)
    bw, bh = int(tw + size * pad[0] * 2), int(size * (1 + pad[1] * 2))
    lab = Image.new("RGBA", (bw + 8, bh + 8), (0, 0, 0, 0))
    d = ImageDraw.Draw(lab)
    d.rectangle((4, 4, bw + 4, bh + 4), fill=INK + (245,))
    inset = max(4, size // 9)
    d.rectangle((4 + inset, 4 + inset, bw + 4 - inset, bh + 4 - inset), outline=PAPER + (255,), width=max(2, size // 26))
    d.text(((bw + 8) / 2, (bh + 8) / 2 + size * 0.04), text, font=f, fill=PAPER + (255,), anchor="mm")
    lab = lab.rotate(angle, resample=Image.BICUBIC, expand=True)
    x, y = round(center[0] - lab.width / 2), round(center[1] - lab.height / 2)
    canvas.paste(lab.convert("RGB"), (x, y), lab)


def save_final(canvas, name):
    OUT.mkdir(parents=True, exist_ok=True)
    canvas.save(OUT / f"final_{name}.png")
    canvas.crop((SAFE_L, 0, SAFE_R, H)).save(OUT / f"final_{name}_4x3.png")
    yt = canvas.resize((1280, 720), Image.LANCZOS)
    p = OUT / f"final_{name}_youtube.png"
    yt.save(p, optimize=True)
    if p.stat().st_size >= 2_000_000:   # halftone compresses badly as PNG: fall back to a high-quality JPEG
        p.unlink()
        p = OUT / f"final_{name}_youtube.jpg"
        yt.save(p, quality=93, subsampling=0)
    canvas.resize((1200, 675), Image.LANCZOS).save(OUT / f"final_{name}_x.png", optimize=True)
    print(OUT / f"final_{name}.png", p.name, f"{p.stat().st_size / 1e6:.2f} MB")


FLAYOUT = {
    # positions in SOURCE pixels (1536x1024) of the chosen picture, read off it after drawing.
    # swing and card reach the top edge, so they keep the full height (wide(): 3:2 at full height, 150 px Codex-extended
    # strips at the sides, mapped with P); grid is cropped to 16:9 (final_base(), mapped with Q).
    "swing": dict(src="cv2f_swing_b", screen=(303, 654, 564, 796), title=(1392, 70), size=92),
    "grid": dict(src="cv2f_grid_a", band=120, size=96, label=(1128, 300), label_size=58, label_angle=-6),
    "card": dict(src="cv2f_card_a", label=(752, 838), label_size=66, label_angle=-6, title=(304, 57), size=88),
}


def final_swing():
    L = FLAYOUT["swing"]
    c = wide(L["src"])
    x0, y0, x1, y1 = L.get("screen") or dark_box(L["src"], L["screen_region"])
    inset = (x1 - x0) * 0.08
    x0, x1 = x0 + inset, x1 - inset
    y0, y1 = y0 + (y1 - y0) * 0.1, y1 - (y1 - y0) * 0.1
    ym = (y0 + y1) / 2
    for line, box in (("読み取れ", (x0, y0, x1, ym)), ("ません", (x0, ym, x1, y1))):
        bx0, by0 = P(box[0], box[1]); bx1, by1 = P(box[2], box[3])
        size = int((by1 - by0) * 0.92)
        f = font(DOT, size)
        while f.getlength("読み取れ") > (bx1 - bx0):
            size -= 2; f = font(DOT, size)
        m = text_mask(c.size, lambda d: d.text(((bx0 + bx1) / 2, (by0 + by1) / 2), line, font=f, fill=255, anchor="mm"))
        glow = m.filter(ImageFilter.GaussianBlur(size * 0.12))
        ink(c, glow, (120, 200, 210), multiply=False, opacity=0.55)
        ink(c, m, (214, 244, 246), multiply=False)
    x, y = P(*L["title"])
    title_columns(c, x, y, L["size"], colour=INK)
    save_final(c, "swing")


def final_grid():
    L = FLAYOUT["grid"]
    c = final_base(L["src"])
    # the answer sheet's header, printed on a paper band laid over the top row
    bh = L["band"]
    d = ImageDraw.Draw(c)
    d.rectangle((0, 0, W, bh), fill=PAPER)
    d.rectangle((0, bh, W, bh + 5), fill=TEAL)
    f = font(MINCHO, L["size"])
    title = "ロストワンの号哭"
    tw = f.getlength(title)
    lab = font(GOTHIC, 24); nm = font(MINCHO_B, 38)
    lw = 90
    nw = nm.getlength("鏡音リン") + 36
    group = tw + 44 + lw + nw
    tx = W / 2 - group / 2
    cy = bh / 2 + 3
    m = text_mask(c.size, lambda dd: dd.text((tx, cy), title, font=f, fill=255, anchor="lm"))
    ink(c, m, INK)
    bx0, by0 = tx + tw + 44, cy - 31
    d.rectangle((bx0, by0, bx0 + lw, by0 + 62), fill=TEAL)
    d.rectangle((bx0, by0, bx0 + lw + nw, by0 + 62), outline=TEAL, width=3)
    d.text((bx0 + lw / 2, by0 + 31), "なまえ", font=lab, fill=PAPER, anchor="mm")
    m = text_mask(c.size, lambda dd: dd.text((bx0 + lw + 18, by0 + 33), "鏡音リン", font=nm, fill=255, anchor="lm"))
    ink(c, m, INK)
    error_label(c, "読み取れません", Q(*L["label"]), L["label_size"], angle=L["label_angle"])
    save_final(c, "grid")


def final_card():
    L = FLAYOUT["card"]
    c = wide(L["src"])
    error_label(c, "読み取れません", P(*L["label"]), L["label_size"], angle=L["label_angle"])
    x, y = P(*L["title"])
    title_columns(c, x, y, L["size"], colour=INK)
    save_final(c, "card")


FINAL = {"swing": final_swing, "grid": final_grid, "card": final_card}
FINAL_NAMES = {"swing": "A　砸下去的前一帧", "grid": "B　撕开答题卡冲出来", "card": "C　读不出来的卡"}
FINAL_TITLES = {  # the B站 title each cover is paired with (the full lists are in docs/发布规划.md)
    "swing": "全城的答题卡都能读，只有她的读不出来【镜音铃/Lost One的号哭】",
    "grid": "全城只有她的卡读不出来，于是她抄起了吉他【镜音铃/Lost One的号哭】",
    "card": "全城只有她的卡读不出来，于是她抄起了吉他【镜音铃/Lost One的号哭】",
}


def final_compare(names=None):
    """The final covers side by side for choosing: each at 16:9 640 wide, and at feed size (16:9 360, B站 4:3 360) with
    the play-count strip, plus its paired B站 title."""
    names = names or [n for n in FINAL if (OUT / f"final_{n}.png").exists()]
    sc = font("NotoSansSC-VF.ttf", 20); sc_s = font("NotoSansSC-VF.ttf", 15); hd = font("NotoSansSC-VF.ttf", 28)
    for f_ in (sc, sc_s, hd):
        try:
            f_.set_variation_by_name("Medium")
        except Exception:
            pass
    BG, TXT, SUB = (241, 242, 243), (24, 25, 28), (120, 125, 132)
    PADX, GAP = 36, 28
    cols = [("16:9", 640, False), ("16:9 · 宽 360", 360, False), ("B站 4:3 · 宽 360", 360, True)]
    row_h = 360 + 92
    Wc = PADX * 2 + sum(c_[1] for c_ in cols) + GAP * 2
    Hc = 100 + row_h * len(names) + 20
    im = Image.new("RGB", (Wc, Hc), BG)
    d = ImageDraw.Draw(im)
    d.text((PADX, 32), "最终封面候选（左：原图缩小；中、右：手机信息流大小，底边是平台叠加的播放量条）", font=hd, fill=TXT)
    y = 100
    for name in names:
        src = Image.open(OUT / f"final_{name}.png").convert("RGB")
        x = PADX
        for label, w, crop in cols:
            pic = src.crop((SAFE_L, 0, SAFE_R, H)) if crop else src
            h = round(w * pic.height / pic.width)
            thumb = pic.resize((w, h), Image.LANCZOS)
            mask = Image.new("L", thumb.size, 0)
            ImageDraw.Draw(mask).rounded_rectangle((0, 0, w - 1, h - 1), radius=8, fill=255)
            im.paste(thumb, (x, y), mask)
            if w <= 360:
                strip = Image.new("RGBA", (w, 30), (0, 0, 0, 0))
                sd = ImageDraw.Draw(strip)
                for i in range(30):
                    sd.line((0, i, w, i), fill=(0, 0, 0, int(140 * i / 30)))
                sd.text((8, 8), "▶ 12.3万   弹幕 856", font=sc_s, fill=(255, 255, 255))
                sd.text((w - 8, 8), "03:32", font=sc_s, fill=(255, 255, 255), anchor="ra")
                im.paste(strip.convert("RGB"), (x, y + h - 30), strip)
            d.text((x, y + 366), label, font=sc_s, fill=SUB)
            x += w + GAP
        d.text((PADX, y + 392), FINAL_NAMES[name], font=sc, fill=TXT)
        d.text((PADX + 290, y + 392), FINAL_TITLES[name], font=sc, fill=TXT)
        y += row_h
    im.save(OUT / "final_compare.png")
    print(OUT / "final_compare.png", im.size)


# ---- feed comparison: each cover at phone-feed sizes, beside the research references ----
FEED_TITLES = {
    "unreadable": "在一座只认标准答案的城里，她是唯一的彩色【ロストワンの号哭/镜音铃】",
    "swing": "全城的答题卡都能读，只有她的读不出来｜ロストワンの号哭【镜音铃】",
    "onlycolor": "机器说她「読み取れません」，于是她扛来了吉他【镜音铃/ロストワンの号哭】",
    "smile": "ロストワンの号哭 ─ 読み取れません / Neru feat. 鏡音リン【Fan PV】",
}
NAMES = {"unreadable": "方向一 读不出来", "swing": "方向二 砸下去的前一帧",
         "onlycolor": "方向三 全城只有她是彩色的", "smile": "方向四 回头一笑"}
REFS = [  # research samples (docs/封面标题调研.md, section 6): described, not copied
    ("ECHO（Y5，1.3 亿）", "黑白高对比，单人居中；\n脸换成一台电视机，\n字嵌在电视屏里。\n怪点：电视头。"),
    ("モニタリング（Y4，1.4 亿）", "脸部特写，从猫眼往里窥视，\n视线直连镜头；圆形遮挡\n把注意力压到中心。\n怪点：被偷看。"),
    ("強風オールバック（Y8，1.2 亿）", "明黄纯色底，单人小全身，\n背书包吹竖笛，被风吹着走。\n怪点：书包＋竖笛＋大风。"),
    ("Neru 本家（Y11，8158 万）", "浅米灰教室，空桌椅，\n独坐学生白纸遮脸，占幅小。\n讲的是隔离感，靠氛围不靠动作。"),
]


def feed():
    from PIL import ImageOps
    sc = font("NotoSansSC-VF.ttf", 18); sc_s = font("NotoSansSC-VF.ttf", 15); hd = font("NotoSansSC-VF.ttf", 26)
    for f_ in (sc, sc_s, hd):
        try:
            f_.set_variation_by_name("Medium")
        except Exception:
            pass
    BG, CARD, TXT, SUB = (241, 242, 243), (255, 255, 255), (24, 25, 28), (148, 153, 160)
    PADX, GAP = 32, 26
    cols = [("16:9 · 宽 480", 480, False), ("16:9 · 宽 360", 360, False), ("B站 4:3 · 宽 360", 360, True)]
    row_h = 270 + 78
    Wc = PADX * 2 + sum(c[1] for c in cols) + GAP * 2
    Hc = 96 + row_h * 4 + 70 + 300
    im = Image.new("RGB", (Wc, Hc), BG)
    d = ImageDraw.Draw(im)
    d.text((PADX, 30), "封面 v2：手机信息流大小对比（左两列 YouTube/X 横版，右列 B站 4:3 卡片）", font=hd, fill=TXT)
    y = 96
    for name in ("unreadable", "onlycolor", "swing", "smile"):
        src = Image.open(OUT / f"{name}.png").convert("RGB")
        x = PADX
        for label, w, crop in cols:
            pic = src.crop((SAFE_L, 0, SAFE_R, H)) if crop else src
            h = round(w * pic.height / pic.width)
            thumb = pic.resize((w, h), Image.LANCZOS)
            mask = Image.new("L", thumb.size, 0)
            ImageDraw.Draw(mask).rounded_rectangle((0, 0, w - 1, h - 1), radius=8, fill=255)
            im.paste(thumb, (x, y), mask)
            # the play-count / duration strip the feed lays over the bottom
            strip = Image.new("RGBA", (w, 30), (0, 0, 0, 0))
            sd = ImageDraw.Draw(strip)
            for i in range(30):
                sd.line((0, i, w, i), fill=(0, 0, 0, int(140 * i / 30)))
            sd.text((8, 8), "▶ 12.3万   弹幕 856", font=sc_s, fill=(255, 255, 255))
            sd.text((w - 8, 8), "03:32", font=sc_s, fill=(255, 255, 255), anchor="ra")
            im.paste(strip.convert("RGB"), (x, y + h - 30), strip)
            x += w + GAP
        d.text((PADX, y + 278), NAMES[name], font=sc, fill=TXT)
        d.text((PADX + 230, y + 278), FEED_TITLES[name], font=sc, fill=TXT)
        d.text((PADX + 230, y + 304), "（配对标题示意）", font=sc_s, fill=SUB)
        y += row_h
    d.text((PADX, y + 22), "调研里同类头部封面（文字描述；未下载对方图片，数据见 docs/封面标题调研.md 第六节）", font=sc, fill=TXT)
    y += 64
    tw = (Wc - PADX * 2 - GAP * 3) // 4
    for i, (t, desc) in enumerate(REFS):
        x = PADX + i * (tw + GAP)
        d.rounded_rectangle((x, y, x + tw, y + round(tw * 9 / 16)), radius=8, fill=(222, 225, 229))
        d.multiline_text((x + 14, y + 14), desc, font=sc_s, fill=(70, 74, 80), spacing=6)
        d.text((x, y + round(tw * 9 / 16) + 10), t, font=sc, fill=TXT)
    im.save(OUT / "compare_feed.png")
    print(OUT / "compare_feed.png", im.size)


if __name__ == "__main__":
    main()
