"""Field Notes thumbnails: one crafted 1200x675 card per post, in brand colours, built around the post's idea.
Writes tools/thumbs/<slug>.html; tools/thumbs_render.js turns them into src/assets/blog/<slug>.png.
Rules: one short line (not the title), one idea drawn with our agent bots, lots of air, both eyes always visible."""
import sys, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import brand as B

OR, INK, MIST, PEACH, CREAM, OT = "#ff9054", "#2b2e3c", "#f5f5f8", "#fff1e8", "#fbf3e8", "#b8460f"
bot = lambda aid, s: B.agent(aid, s, cls="tb")

def chip(t, dark=False):
    return f'<span class="chip{" d" if dark else ""}"><i></i>{t}</span>'

# each: slug, background, text colour, kicker, line, art (html)
T = []
def t(slug, bg, fg, kicker, line, art, dark=False): T.append(dict(slug=slug, bg=bg, fg=fg, kicker=kicker, line=line, art=art, dark=dark))

# 1 n8n asks first: a bot with a question bubble, a workflow waiting behind it
t("n8n-assistant-asks-first", PEACH, INK, "n8n · agents", "Ask first.<br>Build second.",
  f'''<div class="a1">
   <div class="bubble">?</div>{bot("pta", 230)}
   <div class="flow"><span class="nd"></span><span class="ln"></span><span class="nd"></span><span class="ln"></span><span class="nd q">?</span></div></div>''')

# 2 approval is not a button
t("approval-is-not-a-button", INK, "#fff", "Design · approvals", "Approval is not<br>a button.",
  f'''<div class="a2"><div class="btnx"><span>Approve</span></div>
   <div class="ctx"><div class="row"><b>Why</b>Visited pricing twice</div><div class="row"><b>Source</b>CRM · last 7 days</div><div class="row"><b>Risk</b>Low</div><div class="go"><span>Send</span><span class="o">Edit</span></div></div>{bot("emails", 150)}</div>''', dark=True)

# 3 MCP stateless
t("mcp-goes-stateless", MIST, INK, "MCP · infra", "Sessions?<br>Deleted.",
  f'''<div class="a3"><div class="sess s1">session_01</div><div class="sess s2">session_02</div><div class="sess s3">session_03</div>{bot("ask", 210)}</div>''')

# 4 chaos engineering: break it on purpose
t("break-your-agent-on-purpose", OR, INK, "Chaos engineering", "Break it<br>on purpose.",
  f'''<div class="a4"><svg class="bolt" viewBox="0 0 80 120"><path d="M48 4L10 68h26l-8 48 42-70H44z" fill="{INK}"/></svg>{bot("qa", 250)}<div class="tag">fault injected</div></div>''')

# 5 the meter
t("your-ai-bill-gets-a-meter", CREAM, INK, "Pricing · ops", "Your agent<br>has a meter.",
  f'''<div class="a5"><svg viewBox="0 0 300 180" class="gauge"><path d="M30 160a120 120 0 0 1 240 0" fill="none" stroke="#e7e1d8" stroke-width="26" stroke-linecap="round"/>
   <path d="M30 160a120 120 0 0 1 190-97" fill="none" stroke="{OR}" stroke-width="26" stroke-linecap="round"/><line x1="150" y1="160" x2="222" y2="78" stroke="{INK}" stroke-width="9" stroke-linecap="round"/><circle cx="150" cy="160" r="15" fill="{INK}"/></svg>
   <div class="rcpt"><div>agent runs<b>1,240</b></div><div>credits<b>8,930</b></div><div class="tot">this month<b>₹ —</b></div></div></div>''')

# 6 model + harness = agent
t("agent-equals-model-plus-harness", "#ffffff", INK, "Engineering", "Model + harness<br>= agent.",
  f'''<div class="a6"><div class="frame"><span class="tl">tools</span><span class="tr">memory</span><span class="bl">guardrails</span><span class="br">evals</span>{bot("nurture", 210)}</div></div>''')

# 7 workflow or agent
t("workflow-or-agent", MIST, INK, "n8n · workflows", "Workflow<br>or agent?",
  f'''<div class="a7"><div class="wf"><span class="nd"></span><span class="ln"></span><span class="nd"></span><span class="ln"></span><span class="nd"></span></div><span class="or">or</span>{bot("qbr", 200)}</div>''')

# 8 every CRM has an SDR agent
t("every-crm-has-an-sdr-agent", INK, "#fff", "Sales · CRM", "Every CRM<br>has one.",
  f'''<div class="a8">{"".join(f'<span class="g">{bot("voice", 120)}</span>' for _ in range(4))}<span class="me">{bot("nurture", 150)}</span></div>''', dark=True)

# 9 labour illusion: show the work
t("labor-illusion-ai-agents", PEACH, INK, "Design · psychology", "Show the work.<br>Earn the trust.",
  f'''<div class="a9">{bot("ask", 190)}<ol class="steps"><li class="ok">Read the brief</li><li class="ok">Checked 3 sources</li><li class="ok">Matched your rules</li><li class="now">Drafting…</li></ol></div>''')

CSS = f"""
*{{box-sizing:border-box;margin:0;padding:0}}
html,body{{width:1200px;height:675px}}
body{{font-family:Inter,system-ui,sans-serif;-webkit-font-smoothing:antialiased;overflow:hidden}}
.c{{position:relative;width:1200px;height:675px;padding:72px;display:flex;flex-direction:column;justify-content:space-between}}
.top{{display:flex;align-items:center;gap:14px;font-size:22px;font-weight:600}}
.brand{{display:flex;align-items:center;gap:10px;opacity:.9}}
.chip{{display:inline-flex;align-items:center;gap:8px;padding:8px 14px;border-radius:99px;background:rgba(43,46,60,.08);font-size:20px;font-weight:600}}
.chip i{{width:9px;height:9px;border-radius:50%;background:{OR}}}
.chip.d{{background:rgba(255,255,255,.12)}}
h1{{font-size:92px;line-height:.98;letter-spacing:-.05em;font-weight:700;max-width:640px}}
.foot{{font-size:20px;font-weight:600;opacity:.6}}
.art{{position:absolute;right:72px;top:50%;transform:translateY(-50%);width:440px;height:440px;display:grid;place-items:center}}
.tb{{display:block;overflow:visible}}
/* 1 */
.a1{{position:relative;display:grid;place-items:center}}
.a1 .bubble{{position:absolute;top:-40px;right:-10px;width:110px;height:96px;border-radius:28px;background:#fff;border:4px solid {INK};display:grid;place-items:center;font-size:64px;font-weight:700;color:{OR};box-shadow:8px 8px 0 {OR}}}
.a1 .flow{{display:flex;align-items:center;margin-top:34px}}
.nd{{width:44px;height:44px;border-radius:12px;border:4px solid {INK};background:#fff;display:grid;place-items:center;font-weight:700;font-size:24px;color:{OR}}}
.ln{{width:48px;height:4px;background:{INK}}}
.nd.q{{border-style:dashed}}
/* 2 */
.a2{{position:relative;width:440px;height:440px}}
.btnx{{position:absolute;left:40px;top:10px;padding:18px 30px;border-radius:16px;border:3px dashed rgba(255,255,255,.4);color:rgba(255,255,255,.55);font-size:30px;font-weight:700}}
.btnx span{{text-decoration:line-through;text-decoration-color:{OR};text-decoration-thickness:5px}}
.btnx svg{{position:absolute;inset:-10px -16px;width:calc(100% + 32px);height:calc(100% + 20px)}}
.ctx{{position:absolute;left:30px;top:130px;width:330px;background:#fff;border-radius:22px;padding:22px;color:{INK};font-size:19px;display:flex;flex-direction:column;gap:12px;box-shadow:10px 10px 0 {OR}}}
.ctx .row{{display:flex;gap:14px}}.ctx .row b{{width:70px;color:#7a7d8c;font-weight:600}}
.ctx .go{{display:flex;gap:10px;margin-top:4px}}.ctx .go span{{padding:9px 18px;border-radius:12px;background:{INK};color:#fff;font-weight:700}}.ctx .go .o{{background:#fff;color:{INK};border:3px solid {INK}}}
.a2 .tb{{position:absolute;right:-6px;bottom:6px}}
/* 3 */
.a3{{position:relative;width:440px;height:440px;display:grid;place-items:center}}
.sess{{position:absolute;padding:16px 22px;border:3px dashed #b9bbc6;border-radius:16px;background:#fff;font:600 22px ui-monospace,Menlo,monospace;color:#9a9cab;text-decoration:line-through;text-decoration-color:{OR};text-decoration-thickness:3px}}
.s1{{top:18px;left:0;transform:rotate(-6deg)}}.s2{{top:70px;right:0;transform:rotate(5deg);opacity:.75}}.s3{{bottom:30px;left:10px;transform:rotate(3deg);opacity:.55}}
.a3 .tb{{position:relative;top:40px}}
/* 4 */
.a4{{position:relative;display:grid;place-items:center}}
.a4 .bolt{{position:absolute;width:110px;left:-80px;top:-40px;transform:rotate(-12deg)}}
.a4 .tag{{position:absolute;bottom:-26px;right:-30px;background:{INK};color:#fff;font:600 20px ui-monospace,Menlo,monospace;padding:10px 16px;border-radius:12px}}
/* 5 */
.a5{{display:flex;flex-direction:column;align-items:center;gap:18px}}
.gauge{{width:360px}}
.rcpt{{width:330px;background:#fff;border-radius:16px;padding:18px 22px;font-size:20px;display:flex;flex-direction:column;gap:8px;border:3px solid {INK}}}
.rcpt div{{display:flex;justify-content:space-between;color:#55596a}}.rcpt b{{color:{INK}}}
.rcpt .tot{{border-top:3px dashed #d6d8e0;padding-top:10px;font-weight:700;color:{INK}}}
/* 6 */
.frame{{position:relative;width:380px;height:380px;border:4px solid {INK};border-radius:44px;display:grid;place-items:center;background:{PEACH}}}
.frame span{{position:absolute;padding:8px 14px;background:#fff;border:3px solid {INK};border-radius:12px;font-size:20px;font-weight:700}}
.frame .tl{{top:-22px;left:24px}}.frame .tr{{top:-22px;right:24px}}.frame .bl{{bottom:-22px;left:24px}}.frame .br{{bottom:-22px;right:24px;background:{OR}}}
/* 7 */
.a7{{display:flex;flex-direction:column;align-items:center;gap:22px}}
.wf{{display:flex;align-items:center}}
.or{{font-size:34px;font-weight:700;color:{OR}}}
/* 8 */
.a8{{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;align-items:end}}
.a8 .g{{opacity:.35;filter:grayscale(1)}}
.a8 .me{{grid-column:2/4;justify-self:center}}
/* 9 */
.a9{{display:flex;flex-direction:column;align-items:center;gap:22px}}
.steps{{list-style:none;width:340px;background:#fff;border-radius:18px;padding:18px 22px;display:flex;flex-direction:column;gap:12px;font-size:21px;font-weight:600;border:3px solid {INK}}}
.steps li{{display:flex;align-items:center;gap:12px}}
.steps li::before{{content:"";width:22px;height:22px;border-radius:50%;border:3px solid {INK};flex:none}}
.steps li.ok::before{{background:{INK};box-shadow:inset 0 0 0 4px #fff}}
.steps li.now{{color:{OT}}}.steps li.now::before{{border-color:{OR};border-style:dashed}}
"""

def page(x):
    dark = x["dark"]
    mark = B.mark(40, "reverse" if dark else "color")
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head>
<body><div class="c" style="background:{x['bg']};color:{x['fg']}">
<div class="top"><span class="brand">{mark}Field Notes</span>{chip(x['kicker'], dark).replace('<i></i>', '<i style="background:#2b2e3c"></i>' if x['bg'] == OR else '<i></i>')}</div>
<h1>{x['line']}</h1>
<div class="foot">ezydrag.com</div>
<div class="art">{x['art']}</div>
</div></body></html>"""

if __name__ == "__main__":
    out = ROOT / "tools" / "thumbs"; out.mkdir(exist_ok=True)
    for x in T: (out / f"{x['slug']}.html").write_text(page(x))
    print(len(T), "thumbnails written to", out)
