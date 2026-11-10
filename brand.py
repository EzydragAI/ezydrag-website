import re
"""Ezydrag brand system: the single code source for every logo, agent avatar and loader.
Mirrors the Figma "Adaptive logo studio" masters (wide wordmark + square compact mark).

Construction (all values relative to face size F):
  face        F x F, corner radius r = F/4, ink stroke s = F/20
  plate       same shape, offset k = F/8 down-left, brand orange
  glyph       Inter 500 "e", x-height ~ 0.46F, optically centred
  dot         radius F*0.07, centre (0.79F, 0.71F); the "full stop" = the human decision
Wordmark: same plate/face/dot, face height H, text "ezydrag" Inter 500 at 0.62H.
"""
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
from pathlib import Path

INK, ORANGE, WHITE, CREAM = "#2b2e3c", "#ff9054", "#ffffff", "#f7efe8"
FONT = Path(__file__).parent / "tools/node_modules/@fontsource/inter/files/inter-latin-500-normal.woff2"
_font = None

def _glyphs(text):
    """Outline text with Inter 500. Returns (path_d, width, ascent_box) in font units, y flipped."""
    global _font
    if _font is None:
        _font = TTFont(str(FONT))
    gs, cmap, hmtx = _font.getGlyphSet(), _font.getBestCmap(), _font["hmtx"]
    x, parts, bx0, by0, bx1, by1 = 0, [], 1e9, 1e9, -1e9, -1e9
    for ch in text:
        name = cmap[ord(ch)]
        pen = SVGPathPen(gs, ntos=lambda v: f"{v:.1f}")
        from fontTools.pens.transformPen import TransformPen
        gs[name].draw(TransformPen(pen, (1, 0, 0, -1, x, 0)))
        bp = BoundsPen(gs); gs[name].draw(TransformPen(bp, (1, 0, 0, -1, x, 0)))
        if bp.bounds:
            a, b, c, d = bp.bounds; bx0, by0, bx1, by1 = min(bx0, a), min(by0, b), max(bx1, c), max(by1, d)
        parts.append(pen.getCommands())
        x += hmtx[name][0]
    return " ".join(parts), (bx0, by0, bx1, by1)

def _layers(F, x, y, plate=ORANGE, face=WHITE, stroke=INK, sw=None, r=None):
    sw = sw or F / 20; r = F / 4 if r is None else r; k = F / 8
    return (f'<rect class="b-plate" x="{x-k:.2f}" y="{y+k:.2f}" width="{F:.2f}" height="{F:.2f}" rx="{r:.2f}" fill="{plate}" stroke="{stroke}" stroke-width="{sw:.2f}"/>'
            f'<rect class="b-face" x="{x:.2f}" y="{y:.2f}" width="{F:.2f}" height="{F:.2f}" rx="{r:.2f}" fill="{face}" stroke="{stroke}" stroke-width="{sw:.2f}"/>')

def _e(F, x, y, fill=INK):
    d, (x0, y0, x1, y1) = _glyphs("e")
    s = F * 0.50 / (y1 - y0)                      # glyph height = half the face
    gw, gh = (x1 - x0) * s, (y1 - y0) * s
    tx, ty = x + F * 0.45 - gw / 2 - x0 * s, y + F * 0.5 - gh / 2 - y0 * s
    return f'<g class="b-eg"><path class="b-e" d="{d}" fill="{fill}" transform="translate({tx:.2f} {ty:.2f}) scale({s:.4f})"/></g>'

def _dot(F, x, y, fill=ORANGE, stroke=INK, sw=None):
    sw = sw or F / 20
    return f'<circle class="b-dot" cx="{x+F*0.79:.2f}" cy="{y+F*0.71:.2f}" r="{F*0.07:.2f}" fill="{fill}" stroke="{stroke}" stroke-width="{sw*0.9:.2f}"/>'

SCHEMES = {  # plate, face, stroke, glyph, dot
    "color":   (ORANGE, WHITE, INK, INK, ORANGE),
    "reverse": (ORANGE, INK, WHITE, WHITE, ORANGE),
    "mono":    (WHITE, WHITE, INK, INK, WHITE),
    "mono-reverse": (INK, INK, WHITE, WHITE, INK),
}

def mark(size=64, scheme="color", cls="b-mark", icons=None, title=None, small=False):
    """Compact mark. small=True is the 16-24px favicon cut: thicker stroke, smaller offset."""
    pl, fc, st, gl, dt = SCHEMES[scheme]
    F = 48; x, y = 12, 4; sw = 4 if small else F / 20
    body = _layers(F, x, y, pl, fc, st, sw) + _e(F, x, y, gl) + _dot(F, x, y, dt, st, sw)
    if icons:  # extra glyph layer for the loader / hover: icons that cycle inside the face
        isz = F * 0.46
        body += '<g class="b-icons" fill="none" stroke="%s" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' % gl + "".join(
            f'<g class="b-ic b-ic{i}" transform="translate({x+F*0.45-isz/2:.2f} {y+F*0.5-isz/2:.2f}) scale({isz/24:.4f})">{icons[n]}</g>' for i, n in enumerate(icons["_order"])) + "</g>"
    t = f"<title>{title}</title>" if title else ""
    aria = f'role="img" aria-label="{title}"' if title else 'aria-hidden="true" focusable="false"'
    return f'<svg class="{cls}" viewBox="0 0 66 64" width="{size}" height="{size*64/66:.0f}" {aria} xmlns="http://www.w3.org/2000/svg">{t}{body}</svg>'

def wordmark(height=56, scheme="color", cls="b-word", title="Ezydrag"):
    pl, fc, st, gl, dt = SCHEMES[scheme]
    d, (x0, y0, x1, y1) = _glyphs("ezydrag")
    H = 100; s = H * 0.62 / 1000 * 1.0  # font units per em = 2048 for Inter? normalise below
    upm = _font["head"].unitsPerEm; s = H * 0.62 / upm
    tw = (x1 - x0) * s; pad = H * 0.30; dotr = H * 0.07
    W = pad + tw + H * 0.16 + dotr * 2 + pad * 0.75
    k = H / 8 * 0.9; sw = H / 32; x, y = k + sw, sw
    asc = _font["OS/2"].sTypoAscender * s
    base = y + H * 0.5 + (_font["OS/2"].sxHeight * s) / 2  # x-height centred in face
    tx, ty = x + pad - x0 * s, base
    dcx = x + pad + tw + H * 0.16 + dotr; dcy = base - dotr
    body = (f'<rect class="b-plate" x="{x-k:.2f}" y="{y+k:.2f}" width="{W:.2f}" height="{H:.2f}" rx="{H*0.2:.2f}" fill="{pl}" stroke="{st}" stroke-width="{sw:.2f}"/>'
            f'<rect class="b-face" x="{x:.2f}" y="{y:.2f}" width="{W:.2f}" height="{H:.2f}" rx="{H*0.2:.2f}" fill="{fc}" stroke="{st}" stroke-width="{sw:.2f}"/>'
            f'<path class="b-text" d="{d}" fill="{gl}" transform="translate({tx:.2f} {ty:.2f}) scale({s:.5f})"/>'
            f'<circle class="b-dot" cx="{dcx:.2f}" cy="{dcy:.2f}" r="{dotr:.2f}" fill="{dt}" stroke="{st}" stroke-width="{sw*0.9:.2f}"/>')
    VW, VH = W + k + sw * 2, H + k + sw * 2
    return f'<svg class="{cls}" viewBox="0 0 {VW:.2f} {VH:.2f}" height="{height}" width="{height*VW/VH:.0f}" role="img" aria-label="{title}" xmlns="http://www.w3.org/2000/svg"><title>{title}</title>{body}</svg>'

# ---------------------------------------------------------------- agents: same tile, with a face
AGENTS = {  # id: (name, role icon, short role)
 "emails":  ("Email Creation", "mail", "Email"),
 "qa":      ("Email QA", "check", "QA"),
 "nurture": ("Sales Nurture", "target", "Sales"),
 "qbr":     ("QBR Generator", "report", "QBR"),
 "pta":     ("AI PTA", "cal", "PTA"),
 "ask":     ("Ask Ezydrag", "chat", "Support"),
 "voice":   ("Voice Agent", "voice", "Voice"),
 "prospect": ("Prospecting Agent", "search", "Prospecting"),
 "govern":  ("Governance Agent", "shield", "Governance"),
 "speed":   ("Speed-to-Lead Agent", "bolt", "Speed"),
 "followup": ("Deal Follow-up Agent", "loop", "Follow-up"),
 "forecast": ("Forecasting Agent", "gauge", "Forecast"),
 "cleanup": ("CRM Cleanup Agent", "refresh", "Cleanup"),
 "churn":   ("Churn and Upsell Agent", "heart", "Retention"),
 "attrib":  ("Attribution Agent", "graph", "Attribution"),
 "desk":    ("Deal Desk Agent", "doc", "Deal desk"),
}
def agent(aid, size=96, icons=None, cls="b-agent", bg=None, title=None):
    """Agent avatar: the brand tile with a visor face, two eyes, an antenna, and a role badge."""
    name, ic, _ = AGENTS[aid]
    F = 64; x, y = 22, 26; sw = 3.2; r = F / 4
    vis_y = y + F * 0.30
    out = []
    if bg: out.append(f'<rect width="112" height="112" fill="{bg}"/>')
    out.append(f'<g class="ag-antenna"><line x1="{x+F/2}" y1="{y-2}" x2="{x+F/2}" y2="{y-14}" stroke="{INK}" stroke-width="{sw}" stroke-linecap="round"/><circle class="ag-led" cx="{x+F/2}" cy="{y-17}" r="5" fill="{ORANGE}" stroke="{INK}" stroke-width="2.6"/></g>')
    out.append(_layers(F, x, y, ORANGE, WHITE, INK, sw, r))
    out.append(f'<rect class="ag-visor" x="{x+F*0.14:.1f}" y="{vis_y:.1f}" width="{F*0.72:.1f}" height="{F*0.30:.1f}" rx="{F*0.15:.1f}" fill="{INK}"/>')
    ey = vis_y + F * 0.15
    out.append(f'<g class="ag-eyes"><rect class="ag-eye" x="{x+F*0.30-5:.1f}" y="{ey-6:.1f}" width="10" height="12" rx="5" fill="{ORANGE}"/><rect class="ag-eye" x="{x+F*0.70-5:.1f}" y="{ey-6:.1f}" width="10" height="12" rx="5" fill="{ORANGE}"/></g>')
    out.append(f'<rect class="ag-mouth" x="{x+F*0.40:.1f}" y="{y+F*0.74:.1f}" width="{F*0.20:.1f}" height="3.2" rx="1.6" fill="{INK}"/>')
    # role badge: a small tile in the dot position
    bs = 34; bx, by = x + F - bs * 0.55, y + F - bs * 0.55
    out.append(f'<g class="ag-badge"><rect x="{bx-4:.1f}" y="{by+4:.1f}" width="{bs}" height="{bs}" rx="9" fill="{ORANGE}" stroke="{INK}" stroke-width="2.6"/>'
               f'<rect x="{bx:.1f}" y="{by:.1f}" width="{bs}" height="{bs}" rx="9" fill="{WHITE}" stroke="{INK}" stroke-width="2.6"/>')
    isz = 20
    if icons:
        out.append(f'<g transform="translate({bx+bs/2-isz/2:.1f} {by+bs/2-isz/2:.1f}) scale({isz/24:.3f})" fill="none" stroke="{INK}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">{icons[ic]}</g>')
    else:
        out.append(f'<use href="#i-{ic}" x="{bx+bs/2-isz/2:.1f}" y="{by+bs/2-isz/2:.1f}" width="{isz}" height="{isz}" style="fill:none;stroke:{INK};stroke-width:2;stroke-linecap:round;stroke-linejoin:round"/>')
    out.append("</g>")
    t = title or name
    return f'<svg class="{cls}" data-agent="{aid}" viewBox="0 0 112 112" width="{size}" height="{size}" role="img" aria-label="{t}, an Ezydrag agent" xmlns="http://www.w3.org/2000/svg"><title>{t}</title>{"".join(out)}</svg>'

def bot(size=64, cls="ezy-bot"):
    """The agent head on its own (no role badge): visor, two eyes, antenna. Used for loaders and the first-load curtain."""
    svg = agent("ask", size, cls=cls, title="Ezydrag")
    svg = re.sub(r'<g class="ag-badge">.*?</g>', '', svg, flags=re.S)
    return svg.replace('role="img" aria-label="Ezydrag, an Ezydrag agent"', 'aria-hidden="true" focusable="false"').replace("<title>Ezydrag</title>", "")

def loader(size=64, label="Loading", icons=None):
    """Brand loader: a little agent bot. Its eyes look left and right and blink, the antenna light pulses, it bobs."""
    return (f'<span class="ezy-loader bot-load" role="status" style="--sz:{size}px">{bot(size, "ezy-bot is-loading")}'
            f'<span class="bl-dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="sr">{label}</span></span>')

def export_files(outdir, icons):
    out = Path(outdir); out.mkdir(parents=True, exist_ok=True)
    files = {
     "ezydrag-mark.svg": mark(256, "color", title="Ezydrag"),
     "ezydrag-mark-reverse.svg": mark(256, "reverse", title="Ezydrag"),
     "ezydrag-mark-mono.svg": mark(256, "mono", title="Ezydrag"),
     "ezydrag-mark-16.svg": mark(16, "color", title="Ezydrag", small=True),
     "ezydrag-wordmark.svg": wordmark(120, "color"),
     "ezydrag-wordmark-reverse.svg": wordmark(120, "reverse"),
     "ezydrag-wordmark-mono.svg": wordmark(120, "mono"),
    }
    for aid in AGENTS:
        files[f"agent-{aid}.svg"] = agent(aid, 256, icons=icons, bg=CREAM)
    for n, svg in files.items():
        (out / n).write_text(svg.replace('class="', 'data-c="'))
    return list(files)
