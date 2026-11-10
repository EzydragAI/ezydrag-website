"""Blog illustration kit: motion diagrams and original meme images.

Memes are our own drawings: the Ezydrag agent avatar in classic meme *formats*
(two buttons, galaxy brain, panik/kalm, starter pack, expectation vs reality, nope/yep).
No borrowed meme photos or characters. Everything is inline SVG, brand stroke, brand radius.
Motion: elements carry mv-* classes; CSS animates them only while the figure is in view
(figure.play) and never under prefers-reduced-motion. Every animated figure gets a pause button.
"""
from html import escape
import brand as B
from art import nest

INK, OR, MUTED, TINT, LINE, MIST = "#2b2e3c", "#ff9054", "#5b5f71", "#fff1e8", "#d9dbe3", "#f5f5f8"
FONT = "Figtree, system-ui, sans-serif"
DISPLAY = "'Bricolage Grotesque', Figtree, system-ui, sans-serif"

def T(x, y, s, size=15, w=600, fill=INK, anchor="middle", font=FONT, cls=""):
    c = f' class="{cls}"' if cls else ""
    return f'<text{c} x="{x}" y="{y}" font-family="{font}" font-size="{size}" font-weight="{w}" fill="{fill}" text-anchor="{anchor}">{escape(s)}</text>'

def wrap(x, y, s, size=15, w=600, fill=INK, anchor="middle", width=30, lh=1.3, font=FONT):
    words, lines, cur = s.split(), [], ""
    for wd in words:
        if len(cur) + len(wd) + 1 > width: lines.append(cur); cur = wd
        else: cur = (cur + " " + wd).strip()
    lines.append(cur)
    y0 = y - (len(lines) - 1) * size * lh / 2
    return "".join(T(x, y0 + i * size * lh, l, size, w, fill, anchor, font) for i, l in enumerate(lines))

def tile(x, y, w, h, hot=False, cls="", i=None, r=14, fill=None):
    st = f' style="--i:{i}"' if i is not None else ""
    c = f' class="{cls}"' if cls else ""
    f = fill or (INK if hot else "#fff")
    return (f'<g{c}{st}><rect x="{x+6}" y="{y+6}" width="{w}" height="{h}" rx="{r}" fill="{OR}"/>'
            f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{f}" stroke="{INK}" stroke-width="2"/></g>')

def arrow(x1, y, x2, i=0):
    return (f'<g class="mv-wire" style="--i:{i}"><line x1="{x1}" y1="{y}" x2="{x2-8}" y2="{y}" stroke="{INK}" stroke-width="2" stroke-dasharray="6 5"/>'
            f'<path d="M{x2-10} {y-6} L{x2} {y} L{x2-10} {y+6}" fill="none" stroke="{INK}" stroke-width="2"/></g>')

def svg(label, inner, h=360, w=960, cls="post-fig", bg="#fafafc"):
    return (f'<svg class="{cls}" viewBox="0 0 {w} {h}" role="img" aria-label="{escape(label)}" xmlns="http://www.w3.org/2000/svg">'
            f'<title>{escape(label)}</title><rect width="{w}" height="{h}" rx="20" fill="{bg}"/>{inner}</svg>')

# ------------------------------------------------------------------ motion diagrams
def flow(label, steps, hot=None, caption=None):
    n = len(steps); gap = 26; w = (960 - 80 - gap * (n - 1)) / n; y = 120; h = 120; g = []
    hots = hot if isinstance(hot, (list, tuple)) else ([] if hot is None else [hot])
    for i, (a, b) in enumerate(steps):
        x = 40 + i * (w + gap); on = i in hots
        g.append(f'<g class="mv-step" style="--i:{i}">' + tile(x, y, w, h, on)
                 + T(x + w / 2, y + 52, a, 17, 700, "#fff" if on else INK) + T(x + w / 2, y + 78, b, 13, 500, "#e6e7ee" if on else MUTED) + "</g>")
        if i < n - 1: g.append(arrow(x + w + 4, y + h / 2, x + w + gap + 2, i))
    g.append(f'<circle class="mv-packet" cx="40" cy="{y-18}" r="7" fill="{OR}" stroke="{INK}" stroke-width="2" style="--n:{n}"/>')
    if caption: g.append(T(480, 318, caption, 14, 500, MUTED))
    g.append(T(40, 64, label, 18, 700, INK, "start"))
    return svg(label, "".join(g))

def compare(label, left, right):
    g = [T(40, 56, label, 18, 700, INK, "start")]
    for col, (title, items, hot) in enumerate([left, right]):
        x = 40 + col * 450
        g.append(f'<g class="mv-panel" style="--i:{col}">' + tile(x, 84, 420, 240, hot) + T(x + 24, 122, title, 17, 700, "#fff" if hot else INK, "start") + "</g>")
        for i, it in enumerate(items):
            g.append(f'<g class="mv-item" style="--i:{col*4+i}"><circle cx="{x+30}" cy="{157+i*38}" r="4" fill="{OR}"/>'
                     + T(x + 44, 162 + i * 38, it, 14, 500, "#e6e7ee" if hot else MUTED, "start") + "</g>")
    return svg(label, "".join(g))

def stack(label, layers, hot=0):
    g = [T(40, 56, label, 18, 700, INK, "start")]; n = len(layers); h = 52; top = 84
    for i, (a, b) in enumerate(layers):
        y = top + i * (h + 12); on = i == hot
        g.append(f'<g class="mv-layer" style="--i:{n-1-i}">' + tile(40, y, 880, h, on)
                 + T(64, y + 32, a, 16, 700, "#fff" if on else INK, "start") + T(896, y + 32, b, 13, 500, "#e6e7ee" if on else MUTED, "end") + "</g>")
    return svg(label, "".join(g), top + n * (h + 12) + 30)

def tree(label, q, yes, no):
    g = [T(40, 56, label, 18, 700, INK, "start"), tile(300, 80, 360, 70, True), T(480, 121, q, 16, 700, "#fff")]
    for col, (tag, title, sub) in enumerate([yes, no]):
        x = 80 + col * 440
        g.append(f'<path class="mv-path" style="--i:{col}" pathLength="100" d="M480 156 L480 176 L{x+180} 176 L{x+180} 210" fill="none" stroke="{INK}" stroke-width="2"/>')
        g.append(T(x + 190, 200, tag, 13, 700, OR, "start"))
        g.append(f'<g class="mv-panel" style="--i:{col+1}">' + tile(x, 214, 360, 100) + T(x + 180, 254, title, 17, 700) + T(x + 180, 282, sub, 13, 500, MUTED) + "</g>")
    return svg(label, "".join(g))

def requests(label):
    """MCP: stateful (one pinned server) vs stateless (any server). Packets animate."""
    g = [T(40, 56, label, 18, 700, INK, "start")]
    for col, (title, stateless) in enumerate([("Before: one session, one server", False), ("After: any request, any server", True)]):
        ox = 40 + col * 450
        g.append(tile(ox, 84, 420, 250, stateless) if False else f'<rect x="{ox}" y="84" width="420" height="250" rx="16" fill="{"#fff" if not stateless else TINT}" stroke="{INK}" stroke-width="2"/>')
        g.append(T(ox + 20, 114, title, 15, 700, INK, "start"))
        g.append(tile(ox + 24, 180, 96, 60, True) + T(ox + 72, 215, "Agent", 14, 700, "#fff"))
        for k in range(3):
            sy = 140 + k * 62
            dim = (not stateless and k != 1)
            g.append(tile(ox + 290, sy, 104, 46, False) + T(ox + 342, sy + 28, f"Server {k+1}", 13, 600, LINE if dim else INK))
            g.append(f'<line x1="{ox+124}" y1="210" x2="{ox+288}" y2="{sy+23}" stroke="{LINE if dim else INK}" stroke-width="2" stroke-dasharray="5 5"/>')
            if not dim:
                g.append(f'<circle class="mv-req" r="6" fill="{OR}" stroke="{INK}" stroke-width="2" style="--i:{k}"><animateMotion dur="{2.4 if stateless else 2.4}s" begin="{k*0.8 if stateless else 0}s" repeatCount="indefinite" path="M{ox+124} 210 L{ox+288} {sy+23}"/></circle>')
        g.append(T(ox + 210, 318, "Session pinned. Restart = broken." if not stateless else "Every request stands alone.", 13, 600, MUTED))
    return svg(label, "".join(g))

def timescale(label):
    """Design post: Nielsen's three limits, plus agent-length waits."""
    pts = [(90, "0.1 s", "Feels instant", "Just show the result"), (330, "1 s", "Flow stays intact", "A small sign you heard them"),
           (570, "10 s", "Attention limit", "Show progress and when it ends"), (830, "Agents: minutes", "Way past the limit", "Show the work, step by step")]
    g = [T(40, 56, label, 18, 700, INK, "start"), f'<line x1="60" y1="170" x2="900" y2="170" stroke="{INK}" stroke-width="2"/>',
         f'<line class="mv-fillline" x1="60" y1="170" x2="900" y2="170" stroke="{OR}" stroke-width="6" stroke-linecap="round" pathLength="100"/>']
    for i, (x, t, a, b) in enumerate(pts):
        hot = i == 3
        g.append(f'<g class="mv-step" style="--i:{i}"><circle cx="{x}" cy="170" r="14" fill="{INK if hot else "#fff"}" stroke="{INK}" stroke-width="2"/>'
                 + T(x, 128, t, 20, 800, OR if hot else INK, font=DISPLAY) + T(x, 214, a, 14, 700) + wrap(x, 252, b, 13, 500, MUTED, width=22) + "</g>")
    g.append(T(480, 330, "First three limits: Jakob Nielsen (1993). The fourth is our advice for agents.", 12, 500, MUTED))
    return svg(label, "".join(g))

def two_searches(label):
    """Labor illusion: instant blank result vs visible work."""
    g = [T(40, 56, label, 18, 700, INK, "start")]
    for col, (title, show) in enumerate([("Version A: instant", False), ("Version B: shows the work", True)]):
        ox = 40 + col * 450
        g.append(tile(ox, 84, 420, 270, False))
        g.append(T(ox + 24, 120, title, 16, 700, INK, "start"))
        g.append(f'<rect x="{ox+24}" y="138" width="372" height="34" rx="10" fill="{MIST}" stroke="{LINE}"/>' + T(ox + 40, 160, "Flights · Delhi to Goa · Friday", 13, 500, MUTED, "start"))
        if show:
            for k, s in enumerate(["Checking 4 airlines", "Comparing 212 fares", "Removing the junk", "Best 3 found"]):
                g.append(f'<g class="mv-item" style="--i:{k}"><circle cx="{ox+40}" cy="{198+k*30}" r="7" fill="{OR}" stroke="{INK}" stroke-width="2"/>' + T(ox + 56, 203 + k * 30, s, 13, 600, INK, "start") + "</g>")
        else:
            for k in range(3):
                g.append(f'<g class="mv-item" style="--i:0"><rect x="{ox+24}" y="{190+k*40}" width="372" height="30" rx="8" fill="#fff" stroke="{LINE}"/>' + T(ox + 40, 210 + k * 40, f"Result {k+1}", 12, 600, MUTED, "start") + "</g>")
        g.append(T(ox + 210, 336, "Same results. Very different feeling." if show else "Fast. Weirdly unconvincing.", 13, 700, OR if show else MUTED))
    return svg(label, "".join(g), 380)

def tracker(label, stages=("Order placed", "Prep", "Bake", "Quality check", "Out the door")):
    n = len(stages); g = [T(40, 56, label, 18, 700, INK, "start")]
    g.append(f'<rect x="80" y="150" width="800" height="14" rx="7" fill="{MIST}" stroke="{INK}" stroke-width="2"/>')
    g.append(f'<rect class="mv-bar" x="80" y="150" width="800" height="14" rx="7" fill="{OR}"/>')
    for i, s in enumerate(stages):
        x = 80 + i * 800 / (n - 1)
        g.append(f'<g class="mv-step" style="--i:{i}"><circle cx="{x}" cy="157" r="16" fill="#fff" stroke="{INK}" stroke-width="2"/>' + T(x, 162, str(i + 1), 13, 800) + T(x, 205, s, 14, 700) + "</g>")
    g.append(T(480, 262, "A progress bar for pizza. People loved it. The pizza was the same pizza.", 14, 600, MUTED))
    return svg(label, "".join(g), 300)

def kitchen(label):
    """Operational transparency: open the kitchen window (original illustration)."""
    g = [T(40, 56, label, 18, 700, INK, "start")]
    g.append(f'<rect x="60" y="90" width="840" height="230" rx="18" fill="#fff" stroke="{INK}" stroke-width="2"/>')
    g.append(f'<rect class="mv-window" x="330" y="120" width="300" height="140" rx="14" fill="{TINT}" stroke="{INK}" stroke-width="2"/>')
    g.append(nest(B.agent("qa", 96), 420, 192, 92) + nest(B.agent("emails", 96), 540, 192, 92))
    g.append(T(480, 290, "The kitchen (your agents)", 13, 700))
    for k, x in enumerate((150, 810)):
        g.append(f'<g class="mv-item" style="--i:{k}"><circle cx="{x}" cy="170" r="28" fill="{MIST}" stroke="{INK}" stroke-width="2"/><rect x="{x-34}" y="204" width="68" height="60" rx="18" fill="{MIST}" stroke="{INK}" stroke-width="2"/></g>')
    g.append(T(150, 300, "Customers", 13, 700) + T(810, 300, "Your team", 13, 700))
    return svg(label, "".join(g), 350)

# ------------------------------------------------------------------ meme kit (original)
def bot(cx, cy, size, aid="nurture", mood=None):
    s = size / 112; ox, oy = cx - size / 2, cy - size / 2
    pre, post = "", ""
    if mood == "galaxy" or mood == "glow":
        rays = "".join(f'<line x1="56" y1="56" x2="{56+70*__import__("math").cos(a/8*6.283):.1f}" y2="{56+70*__import__("math").sin(a/8*6.283):.1f}" stroke="{OR}" stroke-width="6" stroke-linecap="round" opacity=".5"/>' for a in range(8))
        pre = f'<g transform="translate({ox:.1f} {oy:.1f}) scale({s:.3f})" class="mm-rays"><circle cx="56" cy="56" r="58" fill="{OR}" opacity=".18"/>{rays if mood=="galaxy" else ""}</g>'
    if mood == "sweat":
        post = (f'<path d="M92 26 q6 10 0 14 q-6 -4 0 -14z" fill="#ffd2b4" stroke="{INK}" stroke-width="2"/>'
                f'<path d="M100 44 q5 8 0 11 q-5 -3 0 -11z" fill="#ffd2b4" stroke="{INK}" stroke-width="2"/>')
    elif mood == "shades":  # "proud": both eyes stay visible, sparkles around the head
        star = lambda x, y, r: f'<path d="M{x} {y-r} L{x+r*.3} {y-r*.3} L{x+r} {y} L{x+r*.3} {y+r*.3} L{x} {y+r} L{x-r*.3} {y+r*.3} L{x-r} {y} L{x-r*.3} {y-r*.3}Z" fill="{OR}" stroke="{INK}" stroke-width="1.6" stroke-linejoin="round"/>'
        post = star(10, 30, 7) + star(102, 22, 6) + star(98, 50, 4)
    elif mood == "shock":
        post = f'<circle cx="41" cy="54.8" r="8" fill="#fff" stroke="{INK}" stroke-width="2"/><circle cx="67" cy="54.8" r="8" fill="#fff" stroke="{INK}" stroke-width="2"/><circle cx="41" cy="55" r="3" fill="{INK}"/><circle cx="67" cy="55" r="3" fill="{INK}"/><ellipse cx="54" cy="76" rx="5" ry="4" fill="{INK}"/>'
    elif mood == "dead":
        post = (f'<rect x="30" y="45" width="48" height="19" rx="9" fill="{INK}"/>'
                + "".join(f'<path d="M{x-5} 50 l10 10 M{x+5} 50 l-10 10" stroke="{OR}" stroke-width="3" stroke-linecap="round"/>' for x in (41, 67)))
    elif mood == "chill":
        post = (f'<rect x="30" y="45" width="48" height="19" rx="9" fill="{INK}"/>'
                + "".join(f'<path d="M{x-6} 55 q6 5 12 0" stroke="{OR}" stroke-width="3" fill="none" stroke-linecap="round"/>' for x in (41, 67)))
    over = f'<g transform="translate({ox:.1f} {oy:.1f}) scale({s:.3f})">{post}</g>' if post else ""
    return pre + nest(B.agent(aid, 112), cx, cy, size) + over

def _frame(label, inner, h):
    return (f'<svg class="meme-img" viewBox="0 0 960 {h}" role="img" aria-label="Meme: {escape(label)}" xmlns="http://www.w3.org/2000/svg"><title>{escape(label)}</title>'
            f'<rect x="3" y="3" width="954" height="{h-6}" rx="22" fill="#fff" stroke="{INK}" stroke-width="3"/>{inner}'
            f'{T(940, h-16, "ezydrag field notes", 11, 700, LINE, "end")}</svg>')

def meme_buttons(a, b, caption, aid="nurture"):
    """Two choices, drawn as brand tiles (same panels as expectation/reality), agent sweating below."""
    g = []
    for k, (txt, x, fill) in enumerate([(a, 20, "#fff"), (b, 490, TINT)]):
        g.append(f'<g class="mm-btn" style="--i:{k}"><rect x="{x}" y="20" width="450" height="170" rx="16" fill="{fill}" stroke="{INK}" stroke-width="2"/>'
                 + T(x + 225, 60, "OPTION " + "AB"[k], 15, 800, OR if k == 0 else "#b8460f", font=DISPLAY)
                 + wrap(x + 225, 118, txt, 26, 800, INK, width=24, font=DISPLAY) + "</g>")
    g.append(f'<rect x="20" y="210" width="920" height="270" rx="16" fill="{MIST}" stroke="{INK}" stroke-width="2"/>')
    g.append(f'<g class="mm-shake">{bot(480, 312, 140, aid, "sweat")}</g>')
    g.append(wrap(480, 440, caption, 22, 800, INK, width=60, font=DISPLAY))
    return _frame(f"Two choices: {a} or {b}. {caption}", "".join(g), 520)

def meme_brain(rows, aid="qbr"):
    g = []; n = len(rows); h = 120
    for i, txt in enumerate(rows):
        y = 20 + i * h
        g.append(f'<g class="mm-row" style="--i:{i}"><rect x="20" y="{y}" width="600" height="{h-10}" rx="14" fill="#fff" stroke="{INK}" stroke-width="2"/>'
                 + wrap(320, y + h / 2 - 2, txt, 22, 700, INK, width=38, font=DISPLAY)
                 + f'<rect x="640" y="{y}" width="300" height="{h-10}" rx="14" fill="{INK if i==n-1 else (MIST if i==0 else TINT)}" stroke="{INK}" stroke-width="2"/>'
                 + bot(790, y + h / 2 - 5, 86 + i * 6, aid, [None, "glow", "glow", "galaxy"][min(i, 3)] if i else None) + "</g>")
    return _frame("Galaxy brain: " + " / ".join(rows), "".join(g), 20 + n * h + 20)

def meme_panik(lines, aid="nurture"):
    moods = ["shock", "chill", "dead"]; tags = ["PANIK", "KALM", "PANIK"]; g = []
    for i, txt in enumerate(lines):
        y = 20 + i * 150
        g.append(f'<g class="mm-row" style="--i:{i}"><rect x="20" y="{y}" width="560" height="140" rx="14" fill="#fff" stroke="{INK}" stroke-width="2"/>'
                 + wrap(300, y + 70, txt, 22, 700, INK, width=34, font=DISPLAY)
                 + f'<rect x="600" y="{y}" width="340" height="140" rx="14" fill="{TINT if i==1 else MIST}" stroke="{INK}" stroke-width="2"/>'
                 + bot(700, y + 70, 110, aid, moods[i]) + T(850, y + 80, tags[i], 30, 800, INK if i == 1 else "#b8460f", font=DISPLAY) + "</g>")
    return _frame("Panik, kalm, panik: " + " / ".join(lines), "".join(g), 20 + 3 * 150 + 20)

def meme_starter(title, items):
    g = [T(480, 62, title, 32, 800, INK, font=DISPLAY)]
    for i, it in enumerate(items):
        x = 30 + (i % 3) * 305; y = 90 + (i // 3) * 170
        g.append(f'<g class="mm-row" style="--i:{i}"><rect x="{x}" y="{y}" width="290" height="155" rx="14" fill="{MIST if i%2 else "#fff"}" stroke="{INK}" stroke-width="2"/>'
                 + wrap(x + 145, y + 78, it, 19, 700, INK, width=22, font=DISPLAY) + "</g>")
    rows = (len(items) + 2) // 3
    return _frame(title + ": " + ", ".join(items), "".join(g), 90 + rows * 170 + 30)

def meme_expect(exp, real, aid="nurture"):
    g = []
    for k, (tag, txt, mood, fill) in enumerate([("EXPECTATION", exp, "shades", "#fff"), ("REALITY", real, "sweat", TINT)]):
        x = 20 + k * 470
        g.append(f'<g class="mm-row" style="--i:{k}"><rect x="{x}" y="20" width="450" height="380" rx="16" fill="{fill}" stroke="{INK}" stroke-width="2"/>'
                 + T(x + 225, 64, tag, 22, 800, OR if k == 0 else "#b8460f", font=DISPLAY) + bot(x + 225, 175, 150, aid, mood)
                 + wrap(x + 225, 330, txt, 21, 700, INK, width=30, font=DISPLAY) + "</g>")
    return _frame(f"Expectation: {exp}. Reality: {real}", "".join(g), 440)

def meme_nope(no, yes, aid="nurture"):
    g = []
    for k, (txt, mood, fill) in enumerate([(no, "dead", MIST), (yes, "shades", TINT)]):
        y = 20 + k * 190
        g.append(f'<g class="mm-row" style="--i:{k}"><rect x="20" y="{y}" width="300" height="175" rx="16" fill="{fill}" stroke="{INK}" stroke-width="2"/>'
                 + bot(170, y + 88, 130, aid, mood)
                 + f'<rect x="340" y="{y}" width="600" height="175" rx="16" fill="#fff" stroke="{INK}" stroke-width="2"/>'
                 + T(370, y + 44, "NOPE" if k == 0 else "YEP", 18, 800, "#b8460f" if k == 0 else OR, "start", font=DISPLAY)
                 + wrap(640, y + 102, txt, 23, 700, INK, width=40, font=DISPLAY) + "</g>")
    return _frame(f"Nope: {no}. Yep: {yes}", "".join(g), 420)
