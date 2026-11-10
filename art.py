import re as _re
import brand as B
"""Logo-primitive art: the Ezydrag tile (white face, ink stroke), its orange offset plate,
the ink "e" and the orange dot. Every illustration on the site is built from these four parts."""
import math

INK, ORANGE = "#2b2e3c", "#ff9054"
PHI = 1.6180339887
GOLDEN_ANGLE = math.radians(137.507764)
EPATH = "M88.5625 129.03C88.5625 116.443 90.8102 105.504 95.3056 96.2136C99.8011 86.7732 106.095 79.5056 114.186 74.4108C122.428 69.316 132.018 66.7686 142.957 66.7686C152.248 66.7686 160.639 68.8664 168.132 73.0622C175.774 77.2579 181.917 83.8512 186.563 92.842C191.358 101.833 194.055 113.071 194.655 126.558L194.879 134.874H108.118C109.017 147.162 112.463 156.752 118.457 163.645C124.601 170.388 132.768 173.76 142.957 173.76C149.55 173.76 155.544 171.961 160.939 168.365C166.333 164.769 170.379 159.824 173.076 153.53L192.856 154.879C189.41 165.968 183.116 174.809 173.976 181.402C164.835 187.995 154.495 191.292 142.957 191.292C132.018 191.292 122.428 188.744 114.186 183.65C106.095 178.555 99.8011 171.362 95.3056 162.072C90.8102 152.631 88.5625 141.617 88.5625 129.03ZM174.65 118.466C173.002 106.628 169.33 98.0118 163.636 92.6172C157.942 87.0729 151.049 84.3007 142.957 84.3007C133.367 84.3007 125.65 87.2977 119.806 93.2916C113.962 99.1356 110.215 107.527 108.567 118.466H174.65Z"

def tile(cx, cy, s, icon=None, e=False, dot=True, cls="tile", label=None, icons=None, sw=2):
    """A tile centred on (cx,cy) with side s. icon: sprite id (use) or inline paths via icons dict."""
    x, y, r, off = cx - s/2, cy - s/2, s*0.25, s*0.125
    out = [f'<g class="{cls}" data-x="{cx:.1f}" data-y="{cy:.1f}">',
           f'<rect class="plate" x="{x-off:.1f}" y="{y+off:.1f}" width="{s:.1f}" height="{s:.1f}" rx="{r:.1f}" fill="{ORANGE}" stroke="{INK}" stroke-width="{sw}"/>',
           f'<rect class="face" x="{x:.1f}" y="{y:.1f}" width="{s:.1f}" height="{s:.1f}" rx="{r:.1f}" fill="#fff" stroke="{INK}" stroke-width="{sw}"/>']
    if e:
        k = s / 256
        out.append(f'<path d="{EPATH}" fill="{INK}" transform="translate({x - 24*k:.1f},{y - 2*k:.1f}) scale({k:.4f})"/>')
    elif icon:
        isz = s * 0.46
        if icons:  # inline (standalone SVG files)
            out.append(f'<g transform="translate({cx-isz/2:.1f},{cy-isz/2:.1f}) scale({isz/24:.4f})" fill="none" stroke="{INK}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">{icons[icon]}</g>')
        else:
            out.append(f'<use href="#i-{icon}" x="{cx-isz/2:.1f}" y="{cy-isz/2:.1f}" width="{isz:.1f}" height="{isz:.1f}" style="fill:none;stroke:{INK};stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round"/>')
    if dot:
        out.append(f'<circle class="dot" cx="{x+s*0.79:.1f}" cy="{y+s*0.71:.1f}" r="{s*0.065:.1f}" fill="{ORANGE}" stroke="{INK}" stroke-width="{sw*0.8:.1f}"/>')
    if label:
        out.append(f'<text x="{cx:.1f}" y="{cy+s/2+s*0.09+22:.1f}" text-anchor="middle" class="tl">{label}</text>')
    out.append("</g>")
    return "".join(out)

ARTS = {  # center icon (None = brand e), satellites
 "mark": (None, ["a:emails", "graph", "a:qa"]),
 "layers": ("layers", ["globe", "list", "graph"]),
 "graph": ("graph", ["users", "mail", "report"]),
 "tokens": ("token", ["chat", "gauge", "bolt"]),
 "shield": ("shield", ["lock", "doc", "check"]),
 "academy": ("cap", ["play", "check", "copy"]),
 "team": (None, ["users", "a:ask", "a:qbr"]),
 "agents": (None, ["a:nurture", "a:qa", "a:emails"]),
 "approval": ("shield", ["a:emails", "users", "check"]),
 "404": ("alert", ["home", "search", "help"]),
}

def nest(svg, cx, cy, size):
    """Place a standalone brand svg (mark/agent) centred at cx,cy inside another svg."""
    svg = _re.sub(r'<title>.*?</title>', '', svg)
    svg = _re.sub(r'^<svg ', f'<svg x="{cx-size/2:.1f}" y="{cy-size/2:.1f}" ', svg)
    svg = _re.sub(r' width="[\d.]+" height="[\d.]+"', f' width="{size:.1f}" height="{size:.1f}"', svg, count=1)
    return svg.replace('role="img"', 'aria-hidden="true"')

def art(name, size=360, icons=None):
    """Main tile plus three satellites on the golden angle, joined by connectors."""
    center, sats = ARTS[name]
    W = H = 300; c = W/2; S = 118; s = S/PHI/PHI*1.35
    parts, lines = [], []
    for i, ic in enumerate(sats):
        a = -math.pi/2 + 0.6 + i * GOLDEN_ANGLE
        rad = 104 + (i % 2) * 12
        sx, sy = c + math.cos(a)*rad, c + math.sin(a)*rad
        lines.append(f'<line class="conn" x1="{c:.1f}" y1="{c:.1f}" x2="{sx:.1f}" y2="{sy:.1f}" stroke="{INK}" stroke-width="1.5" stroke-dasharray="3 5"/>')
        if ic.startswith("a:"):
            parts.append(f'<g class="tile sat">{nest(B.agent(ic[2:], icons=icons), sx, sy, s*1.45)}</g>')
        else:
            parts.append(tile(sx, sy, s, icon=ic, cls="tile sat", icons=icons))
    main = (f'<g class="tile main">{nest(B.mark(100), c, c, S*1.25)}</g>' if center is None
            else tile(c, c, S, icon=center, cls="tile main", sw=2.5, icons=icons))
    return (f'<svg class="art" data-art viewBox="-10 -10 {W+20} {H+20}" width="{size}" height="{size}" aria-hidden="true" focusable="false">'
            + "".join(lines) + "".join(parts) + main + "</svg>")

FLOW_SRC = [("Marketo", "mail"), ("Salesforce", "users"), ("Analytics", "report")]
FLOW_OUT = [("Nurture agent", "nurture"), ("QA agent", "qa"), ("QBR agent", "qbr")]

def flow(icons=None):
    """Home hero: your tools -> Ezydrag context graph -> agents. Desktop (horizontal) + phone (vertical)."""
    def build(W, H, src_pos, out_pos, C, wire, label_dy, cls):
        g = []
        for i in range(3):
            g.append(f'<path class="wire in" d="{wire(src_pos[i], C, "in")}" fill="none" stroke="{INK}" stroke-width="1.5" stroke-opacity=".35"/>')
            g.append(f'<path class="wire out" d="{wire(C, out_pos[i], "out")}" fill="none" stroke="{INK}" stroke-width="1.5" stroke-opacity=".35"/>')
        for (lab, ic), (x, y) in zip(FLOW_SRC, src_pos): g.append(tile(x, y, 64, icon=ic, cls="tile src", label=lab))
        for (lab, aid), (x, y) in zip(FLOW_OUT, out_pos):
            g.append(f'<g class="tile agt">{nest(B.agent(aid), x, y, 96)}<text x="{x}" y="{y+70}" text-anchor="middle" class="tl">{lab}</text></g>')
        g.append(f'<g class="tile main">{nest(B.mark(100), C[0], C[1], 170)}</g>')
        if label_dy: g.append(f'<text x="{C[0]}" y="{C[1]+label_dy}" text-anchor="middle" class="tl strong">Context graph</text>')
        for i in range(3):
            g.append(f'<circle class="pkt pin" r="6" fill="{ORANGE}" stroke="{INK}" stroke-width="1.5" opacity="0"/><circle class="pkt pout" r="6" fill="{ORANGE}" stroke="{INK}" stroke-width="1.5" opacity="0"/>')
        return (f'<svg class="flow-svg {cls}" data-flow viewBox="0 -20 {W} {H}" role="img" aria-label="Marketo, Salesforce and Analytics feed the Ezydrag context graph. Agents act on it, and a person approves.">'
                + "".join(g) + "</svg>")
    hw = lambda a, b, d: (f"M{a[0]+40},{a[1]} C{a[0]+200},{a[1]} {b[0]-200},{b[1]} {b[0]-92},{b[1]}" if d == "in"
                          else f"M{a[0]+92},{a[1]} C{a[0]+200},{a[1]} {b[0]-200},{b[1]} {b[0]-56},{b[1]}")
    vw = lambda a, b, d: (f"M{a[0]},{a[1]+40} C{a[0]},{a[1]+110} {b[0]},{b[1]-160} {b[0]},{b[1]-92}" if d == "in"
                          else f"M{a[0]},{a[1]+92} C{a[0]},{a[1]+170} {b[0]},{b[1]-120} {b[0]},{b[1]-62}")
    desk = build(1000, 440, [(110, 70), (110, 200), (110, 330)], [(880, 70), (880, 200), (880, 330)], (500, 200), hw, 112, "flow-h")
    mob = build(420, 760, [(70, 40), (210, 40), (350, 40)], [(70, 600), (210, 600), (350, 600)], (210, 320), vw, None, "flow-v")
    return desk + mob

def agent_svg(icon, icons):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f7efe8"/>'
            + tile(104, 96, 104, icon=icon, icons=icons, sw=3) + "</svg>")


JOURNEY = [("Capture", "users", "New lead in"), ("Enrich", "search", "Who they are"), ("Score", "gauge", "How ready"),
           ("Nurture", "mail", "The right next email"), ("Meeting", "cal", "Handed to sales"), ("Won", "star", "Closed in Salesforce")]
def journey():
    """Home hero: one lead travels the whole sales journey, with the Sales Nurture agent alongside.
    Two layouts: horizontal (desktop) and vertical (phone)."""
    def build(W, H, pts, cls, vertical):
        g = []
        d = "M" + " L".join(f"{x},{y}" for x, y in pts)
        g.append(f'<path class="j-track" d="{d}" fill="none" stroke="#d9dae2" stroke-width="4" stroke-linecap="round"/>')
        g.append(f'<path class="j-fill" d="{d}" fill="none" stroke="{ORANGE}" stroke-width="4" stroke-linecap="round" pathLength="100"/>')
        for i, ((lab, ic, sub), (x, y)) in enumerate(zip(JOURNEY, pts)):
            appr = i in (3, 4)
            lx, ly, anc = (x + 52, y - 6, "start") if vertical else (x, y + 62, "middle")
            g.append(f'<g class="j-stage" style="--i:{i}">{tile(x, y, 60, icon=ic, cls="tile j-tile")}'
                     f'<text x="{lx}" y="{ly}" text-anchor="{anc}" class="j-lab">{lab}</text>'
                     f'<text x="{lx}" y="{ly + 18}" text-anchor="{anc}" class="j-sub">{sub}</text>'
                     + (f'<g class="j-appr"><circle cx="{x + 30}" cy="{y - 30}" r="11" fill="#fff" stroke="{INK}" stroke-width="2"/><path d="M{x + 25},{y - 30} l3.5,3.5 l6,-7" fill="none" stroke="{INK}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></g>' if appr else "")
                     + "</g>")
        g.append(f'<g class="j-agent">{nest(B.agent("nurture"), pts[0][0], pts[0][1] - (0 if vertical else 92), 76) if not vertical else nest(B.agent("nurture"), pts[0][0] - 92, pts[0][1], 70)}</g>')
        return (f'<svg class="journey {cls}" data-journey viewBox="0 0 {W} {H}" role="img" aria-label="One lead, start to finish: capture, enrich, score, nurture, meeting, won. The Sales Nurture agent does the work; your team approves the nurture emails and the hand-off to sales.">'
                + "".join(g) + "</svg>")
    desk = build(1000, 300, [(70 + i * 172, 170) for i in range(6)], "j-h", False)
    mob = build(400, 720, [(150, 50 + i * 124) for i in range(6)], "j-v", True)
    return desk + mob
