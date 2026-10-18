# Fabrique « FinanceData Sans » à partir d'Outfit (OFL 1.1, sans nom réservé) :
# tous les points (i, j, ponctuation, trémas) deviennent des carrés, et le % est redessiné (deux carrés + barre).
# Usage : python3 fabriquer-police.py
from fontTools.ttLib import TTFont
from fontTools.pens.ttGlyphPen import TTGlyphPen

DOTS = ["i", "j", "period", "colon", "semicolon", "exclam", "question", "exclamdown", "questiondown", "ellipsis",
        "periodcentered", "dieresis", "dieresiscomb", "dotaccent", "dotaccentcomb", "uni0307", "uni0308", "bullet"]

def square(pen, x0, y0, x1, y1):
    pen.moveTo((x0, y0)); pen.lineTo((x0, y1)); pen.lineTo((x1, y1)); pen.lineTo((x1, y0)); pen.closePath()

def contours(glyf, name):
    gl = glyf[name]; coords, ends, flags = gl.getCoordinates(glyf); out, s = [], 0
    for e in ends:
        out.append((list(coords[s:e + 1]), list(flags[s:e + 1]))); s = e + 1
    return out

def redraw(font, name, fn):
    glyf = font["glyf"]
    if name not in glyf or glyf[name].isComposite() or glyf[name].numberOfContours <= 0: return
    pen = TTGlyphPen(None)
    for pts, fl in contours(glyf, name):
        xs, ys = [p[0] for p in pts], [p[1] for p in pts]
        bb = (min(xs), min(ys), max(xs), max(ys))
        if not fn(pen, pts, fl, bb):
            # recopie le contour d'origine tel quel (points on/off-curve TrueType)
            pen.moveTo(pts[0]) if fl[0] & 1 else None
            seg = []
            first_on = next(i for i, f in enumerate(fl) if f & 1)
            order = pts[first_on:] + pts[:first_on]; ford = fl[first_on:] + fl[:first_on]
            pen = pen  # noqa
            pen_pts = []
            pen.moveTo(order[0]) if not (fl[0] & 1) else None
            off = []
            for p, f in zip(order[1:] + [order[0]], ford[1:] + [ford[0]]):
                if f & 1:
                    if off: pen.qCurveTo(*off, p); off = []
                    else: pen.lineTo(p)
                else: off.append(p)
            if off: pen.qCurveTo(*off, order[0])
            pen.closePath()
    glyf[name] = pen.glyph()

def is_dot(bb):
    w, h = bb[2] - bb[0], bb[3] - bb[1]
    return 100 < w < 260 and 100 < h < 260 and abs(w - h) < 50

def dot_to_square(pen, pts, fl, bb):
    if not is_dot(bb): return False
    cx, cy, side = (bb[0] + bb[2]) / 2, (bb[1] + bb[3]) / 2, (bb[2] - bb[0]) * 0.9
    square(pen, round(cx - side / 2), round(cy - side / 2), round(cx + side / 2), round(cy + side / 2)); return True

def build(src, dst, style):
    f = TTFont(src); glyf = f["glyf"]; cmap = f.getBestCmap()
    names = set(DOTS) | {cmap.get(ord(c)) for c in "ij.:;!?¡¿…·" if cmap.get(ord(c))}
    for n in names:
        if n in glyf: redraw(f, n, dot_to_square)
    # virgule : un carré + une queue droite inclinée
    c = cmap[ord(",")]; gl = glyf[c]; x0, x1 = gl.xMin, gl.xMax; side = round((x1 - x0) * 0.9); top = gl.yMax
    pen = TTGlyphPen(None); sx0 = round((x0 + x1) / 2 - side / 2)
    square(pen, sx0, top - side, sx0 + side, top)
    pen.moveTo((sx0 + side - 60, top - side)); pen.lineTo((sx0 + side, top - side)); pen.lineTo((sx0 + 30, top - side - 150)); pen.lineTo((sx0 - 30, top - side - 150)); pen.closePath()
    glyf[c] = pen.glyph()
    # pourcent : deux carrés pleins aux coins opposés et une barre oblique entre eux
    p = cmap[ord("%")]; gl = glyf[p]; X0, Y0, X1, Y1 = gl.xMin + 40, gl.yMin, gl.xMax - 40, gl.yMax
    s = 170; bar = 60; bx0, bx1 = X0 + 60, X1 - 60 - bar
    pen = TTGlyphPen(None)
    square(pen, X0, Y1 - s, X0 + s, Y1)
    square(pen, X1 - s, Y0, X1, Y0 + s)
    pen.moveTo((bx0, Y0)); pen.lineTo((bx1, Y1)); pen.lineTo((bx1 + bar, Y1)); pen.lineTo((bx0 + bar, Y0)); pen.closePath()
    glyf[p] = pen.glyph()
    for rec in f["name"].names:
        if rec.nameID in (1, 16): rec.string = "FinanceData Sans"
        elif rec.nameID == 4: rec.string = "FinanceData Sans " + style
        elif rec.nameID == 6: rec.string = "FinanceDataSans-" + style
        elif rec.nameID == 3: rec.string = "FinanceDataSans-" + style + ";2026"
    f.save(dst)

build("Outfit-Bold.ttf", "FinanceDataSans-Bold.ttf", "Bold")
build("Outfit-Regular.ttf", "FinanceDataSans-Regular.ttf", "Regular")
print("ok")
