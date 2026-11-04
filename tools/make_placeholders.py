#!/usr/bin/env python3
"""
BASH ESSENTIAL VENTURES — placeholder product art generator (Pillow).
Premium gold line-art product icons on the same dark-charcoal studio
background as the AI product photos. Rendered to the exact product image
paths so future AI photos can overwrite them with zero code changes.
"""
import os, math, subprocess
from PIL import Image, ImageDraw, ImageFont

OUT = "assets/img/products"
W = 800                 # final size
S = 4                   # supersampling scale
CW = W * S              # canvas working size
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

TINTS = ["#dcb859", "#d4af37", "#e3c25f", "#c9a235", "#d9b64a", "#e8cd76",
         "#cfa93f", "#dbb952", "#d2ac39", "#e0bd58"]

def rgb(hexs):
    hexs = hexs.lstrip("#")
    return tuple(int(hexs[i:i+2], 16) for i in (0, 2, 4))

def X(v): return int(v * S)

# ---------------- drawing helpers (scale-aware, round caps) ----------------
def rrect(d, box, r, c, w, alpha=255):
    d.rounded_rectangle([X(v) for v in box], radius=r * S, outline=c + (alpha,), width=w * S)

def line(d, pts, c, w, alpha=255):
    P = [(X(x), X(y)) for x, y in pts]
    d.line(P, fill=c + (alpha,), width=w * S, joint="curve")
    r = w * S / 2
    for (x, y) in (P[0], P[-1]):
        d.ellipse([x - r, y - r, x + r, y + r], fill=c + (alpha,))

def arc(d, box, a0, a1, c, w, alpha=255):
    bb = [X(v) for v in box]
    d.arc(bb, a0, a1, fill=c + (alpha,), width=w * S)
    cx, cy = (bb[0] + bb[2]) / 2, (bb[1] + bb[3]) / 2
    rx, ry = (bb[2] - bb[0]) / 2, (bb[3] - bb[1]) / 2
    r = w * S / 2
    for a in (a0, a1):
        x = cx + rx * math.cos(math.radians(a))
        y = cy + ry * math.sin(math.radians(a))
        d.ellipse([x - r, y - r, x + r, y + r], fill=c + (alpha,))

def circ(d, cx, cy, r, c, w, alpha=255):
    d.ellipse([X(cx - r), X(cy - r), X(cx + r), X(cy + r)], outline=c + (alpha,), width=w * S)

def dot(d, cx, cy, r, c, alpha=255):
    d.ellipse([X(cx - r), X(cy - r), X(cx + r), X(cy + r)], fill=c + (alpha,))

def poly(d, pts, c, alpha=255):
    d.polygon([(X(x), X(y)) for x, y in pts], fill=c + (alpha,))

# ---------------- icons ----------------
def icon_phone(d, c):
    rrect(d, (315, 235, 485, 565), 28, c, 13)
    rrect(d, (330, 270, 470, 525), 12, c, 7, alpha=140)
    dot(d, 400, 253, 5, c)

def icon_headphones(d, c):
    arc(d, (255, 240, 545, 530), 180, 360, c, 13)
    line(d, [(255, 385), (255, 430)], c, 13)
    line(d, [(545, 385), (545, 430)], c, 13)
    rrect(d, (222, 420, 288, 532), 26, c, 13)
    rrect(d, (512, 420, 578, 532), 26, c, 13)
    rrect(d, (240, 443, 270, 509), 14, c, 7, alpha=140)
    rrect(d, (530, 443, 560, 509), 14, c, 7, alpha=140)

def icon_earbuds(d, c):
    circ(d, 330, 330, 46, c, 13)
    circ(d, 470, 330, 46, c, 13)
    line(d, [(316, 368), (298, 460), (318, 488), (336, 494)], c, 13)
    line(d, [(484, 368), (502, 460), (482, 488), (464, 494)], c, 13)
    arc(d, (280, 500, 520, 620), 15, 165, c, 8, alpha=115)

def icon_headset(d, c):
    arc(d, (270, 270, 530, 530), 180, 360, c, 13)
    rrect(d, (242, 390, 300, 486), 24, c, 13)
    rrect(d, (500, 390, 558, 486), 24, c, 13)
    line(d, [(529, 470), (506, 538), (446, 566), (392, 566)], c, 13)
    dot(d, 382, 566, 14, c)

def icon_speaker(d, c):
    rrect(d, (325, 240, 475, 560), 62, c, 13)
    d.ellipse([X(358), X(286), X(442), X(314)], outline=c + (255,), width=13 * S)
    for y in (415, 455, 495, 535):
        line(d, [(367, y), (433, y)], c, 8, alpha=155)

def icon_gaming(d, c):
    arc(d, (255, 240, 545, 530), 180, 360, c, 13)
    line(d, [(255, 385), (255, 410)], c, 13)
    line(d, [(545, 385), (545, 410)], c, 13)
    rrect(d, (222, 400, 288, 510), 24, c, 13)
    rrect(d, (512, 400, 578, 510), 24, c, 13)
    line(d, [(545, 486), (520, 548), (452, 572), (400, 572)], c, 13)
    dot(d, 390, 572, 13, c)
    poly(d, [(256, 442), (272, 462), (244, 462)], c, alpha=205)

def icon_watch(d, c):
    line(d, [(355, 225), (355, 285)], c, 13)
    line(d, [(445, 225), (445, 285)], c, 13)
    line(d, [(355, 515), (355, 575)], c, 13)
    line(d, [(445, 515), (445, 575)], c, 13)
    rrect(d, (305, 285, 495, 515), 46, c, 13)
    circ(d, 400, 400, 62, c, 9, alpha=190)
    line(d, [(503, 360), (513, 360)], c, 14)

def icon_band(d, c):
    rrect(d, (352, 250, 448, 550), 48, c, 13)
    rrect(d, (372, 315, 428, 405), 20, c, 8, alpha=165)
    line(d, [(400, 276), (400, 292)], c, 7, alpha=155)

def icon_charger(d, c):
    rrect(d, (320, 330, 480, 510), 26, c, 13)
    line(d, [(365, 330), (365, 282)], c, 13)
    line(d, [(435, 330), (435, 282)], c, 13)
    poly(d, [(408, 368), (380, 424), (402, 424), (392, 472), (422, 414), (399, 414)], c)

def icon_cable(d, c):
    rrect(d, (290, 255, 360, 301), 12, c, 13)
    rrect(d, (440, 500, 510, 546), 12, c, 13)
    line(d, [(325, 301), (325, 385), (368, 418), (432, 418), (458, 462), (468, 500)], c, 13, alpha=230)
    line(d, [(302, 264), (348, 264)], c, 8, alpha=130)
    line(d, [(452, 537), (498, 537)], c, 8, alpha=130)

def icon_powerbank(d, c):
    rrect(d, (318, 235, 482, 565), 26, c, 13)
    poly(d, [(412, 285), (372, 360), (400, 360), (386, 425), (432, 345), (405, 345)], c)
    for i in range(4):
        dot(d, 358 + i * 30, 496, 7, c, alpha=int(115 + 140 * i / 3))

def icon_case(d, c):
    rrect(d, (312, 228, 488, 572), 30, c, 13)
    rrect(d, (336, 252, 464, 338), 18, c, 9, alpha=205)
    circ(d, 368, 284, 12, c, 8)
    circ(d, 428, 284, 12, c, 8)
    circ(d, 398, 326, 12, c, 8)

def icon_glass(d, c):
    rrect(d, (322, 222, 478, 558), 26, c, 13)
    line(d, [(360, 300), (440, 250)], c, 9, alpha=140)
    line(d, [(360, 360), (440, 310)], c, 9, alpha=90)

def icon_wireless(d, c):
    d.ellipse([X(250), X(418), X(550), X(522)], outline=c + (255,), width=13 * S)
    d.ellipse([X(312), X(440), X(488), X(500)], outline=c + (160,), width=8 * S)
    poly(d, [(414, 330), (376, 400), (402, 400), (388, 456), (434, 380), (408, 380)], c, alpha=240)
    arc(d, (240, 270, 380, 410), 190, 250, c, 9, alpha=130)
    arc(d, (420, 270, 560, 410), 290, 350, c, 9, alpha=130)

def icon_carcharger(d, c):
    rrect(d, (330, 300, 470, 420), 20, c, 13)
    rrect(d, (362, 420, 438, 466), 12, c, 10)
    line(d, [(368, 300), (368, 262)], c, 11)
    line(d, [(432, 300), (432, 262)], c, 11)
    circ(d, 400, 360, 22, c, 9, alpha=180)

def icon_mount(d, c):
    rrect(d, (330, 240, 470, 470), 22, c, 13)
    line(d, [(400, 470), (400, 522)], c, 13)
    circ(d, 400, 552, 34, c, 13)
    arc(d, (382, 534, 418, 570), 180, 300, c, 8, alpha=180)
    arc(d, (382, 534, 418, 570), 0, 120, c, 8, alpha=180)

ICONS = {
    "phone": icon_phone, "headphones": icon_headphones, "earbuds": icon_earbuds,
    "headset": icon_headset, "speaker": icon_speaker, "gaming": icon_gaming,
    "watch": icon_watch, "band": icon_band, "charger": icon_charger,
    "cable": icon_cable, "powerbank": icon_powerbank, "case": icon_case,
    "glass": icon_glass, "wireless": icon_wireless, "carcharger": icon_carcharger,
    "mount": icon_mount,
}

PRODUCTS = {
    "infinix-note-40-pro":          ("phone", -3),
    "infinix-hot-40i":              ("phone", 2),
    "infinix-smart-8":              ("phone", -2),
    "tecno-camon-30":               ("phone", 3),
    "tecno-spark-20-pro":           ("phone", -2),
    "tecno-pop-8":                  ("phone", 2),
    "redmi-note-13-pro":            ("phone", -3),
    "redmi-13c":                    ("phone", 2),
    "poco-x6-pro":                  ("phone", -2),
    "google-pixel-8a":              ("phone", 3),
    "itel-s23":                     ("phone", -2),
    "sony-wh-1000xm5":              ("headphones", -2),
    "jbl-tune-770nc":               ("headphones", 2),
    "oraimo-boompop-2":             ("headphones", -3),
    "airpods-pro-2":                ("earbuds", -2),
    "galaxy-buds2-pro":             ("earbuds", 3),
    "oraimo-freepods-4":            ("earbuds", -3),
    "anker-soundcore-p20i":         ("earbuds", 2),
    "bluetooth-single-ear-headset": ("headset", -2),
    "jbl-flip-6":                   ("speaker", 2),
    "jbl-charge-5":                 ("speaker", -3),
    "oraimo-boom-2":                ("speaker", 2),
    "rgb-gaming-headset":           ("gaming", -2),
    "apple-watch-series-9":         ("watch", -3),
    "galaxy-watch-6":               ("watch", 2),
    "smart-bluetooth-watch":        ("watch", -2),
    "kids-gps-smart-watch":         ("watch", 3),
    "xiaomi-smart-band-8":          ("band", -2),
    "oraimo-33w-charger":           ("charger", -3),
    "samsung-25w-charger":          ("charger", 2),
    "usbc-fast-cable":              ("cable", -2),
    "lightning-cable":              ("cable", 3),
    "oraimo-20000mah-power-bank":   ("powerbank", -2),
    "slim-10000mah-power-bank":     ("powerbank", 3),
    "armor-phone-case":             ("case", -2),
    "clear-case-iphone":            ("case", 2),
    "tempered-glass-protector":     ("glass", -2),
    "wireless-charging-pad":        ("wireless", 2),
    "dual-port-car-charger":        ("carcharger", -2),
    "magnetic-car-mount":           ("mount", 2),
}

# ---------------- background pieces ----------------
def radial(size, stops):
    """stops: list of (radius_frac, (r,g,b)) from center."""
    small = 100
    img = Image.new("RGB", (small, small))
    px = img.load()
    cx, cy = small * 0.5, small * 0.42
    maxr = math.hypot(small, small) * 0.62
    for y in range(small):
        for x in range(small):
            f = math.hypot(x - cx, y - cy) / maxr
            if f >= stops[-1][0]:
                col = stops[-1][1]
            else:
                for i in range(len(stops) - 1):
                    r0, c0 = stops[i]; r1, c1 = stops[i + 1]
                    if r0 <= f < r1:
                        t = (f - r0) / (r1 - r0)
                        col = tuple(int(c0[k] + (c1[k] - c0[k]) * t) for k in range(3))
                        break
            px[x, y] = col
    return img.resize((size, size), Image.BICUBIC)

def make(pid, icon_name, rot, tint_hex):
    c = rgb(tint_hex)
    # background
    base = radial(CW, [(0.0, (33, 33, 44)), (0.55, (18, 18, 24)), (1.0, (10, 10, 13))]).convert("RGB")
    d = ImageDraw.Draw(base, "RGBA")

    # soft gold glow behind icon
    glow = radial(CW, [(0.0, tuple(int(v * 0.30) for v in c)), (0.5, tuple(int(v * 0.10) for v in c)), (1.0, (0, 0, 0))])
    mask = radial(CW, [(0.0, (70, 70, 70)), (0.55, (22, 22, 22)), (1.0, (0, 0, 0))]).convert("L")
    base.paste(glow, (0, 0), mask)

    d = ImageDraw.Draw(base, "RGBA")
    # decorative rings
    d.ellipse([X(148), X(138), X(652), X(642)], outline=c + (36,), width=int(1.6 * S))
    d.ellipse([X(132), X(122), X(668), X(658)], outline=c + (18,), width=int(1.2 * S))

    # icon on its own layer, then rotate
    layer = Image.new("RGBA", (CW, CW), (0, 0, 0, 0))
    ld = ImageDraw.Draw(layer)
    ICONS[icon_name](ld, c)
    if rot:
        layer = layer.rotate(rot, resample=Image.BICUBIC, center=(X(400), X(400)))
    base.alpha = None
    base = base.convert("RGBA")
    base.alpha_composite(layer)
    base = base.convert("RGB")
    d = ImageDraw.Draw(base, "RGBA")

    # diamond mark + wordmark
    d.polygon([(X(400), X(692)), (X(414), X(706)), (X(400), X(720)), (X(386), X(706))],
              fill=c + (215,))
    font = ImageFont.truetype(FONT, int(20 * S))
    text = "BASH ESSENTIAL"
    ls = int(8 * S)
    widths = [font.getlength(ch) for ch in text]
    total = sum(widths) + ls * (len(text) - 1)
    x = (CW - total) / 2
    y = X(738)
    for ch, w in zip(text, widths):
        d.text((x, y), ch, font=font, fill=(150, 132, 66, 255))
        x += w + ls

    img = base.resize((W, W), Image.LANCZOS)
    img.save(f"{OUT}/{pid}.jpg", quality=88, optimize=True, progressive=True)

def main():
    os.makedirs(OUT, exist_ok=True)
    for i, (pid, (icon, rot)) in enumerate(PRODUCTS.items()):
        make(pid, icon, rot, TINTS[i % len(TINTS)])
        print("ok", pid)
    print("done:", len(PRODUCTS), "images")

if __name__ == "__main__":
    main()
