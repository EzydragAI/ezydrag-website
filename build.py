import html
#!/usr/bin/env python3
"""Builds the Ezydrag static site.
src/pages/*.html -> dist/*.html with shared header, footer, icons and snippets.
Each page starts with:  <!--{"title":"...","desc":"...","nav":"platform","crumbs":[["Platform",""],["Context",""]]}-->
Macros: {{i:name}} icon · {{BADGES}} {{TEAM}} {{TEAM4}} {{QUOTES}} {{WORLDMAP}} {{LIVE}} {{NEXT}}
"""
import json, math, re, shutil
from pathlib import Path
import art as ART
import blog as BLOG
import brand as B

ROOT = Path(__file__).parent
SITE_URL = "https://ezydrag.in"   # confirm production domain before launch
SITE_NAME = "Ezydrag"
EMAIL = "hello@ezydrag.in"
# Social links. LinkedIn is a placeholder slug until the real company page is confirmed.
# WhatsApp: set the number in international format, digits only (e.g. "919800000000"); the icon stays hidden while empty.
SOCIAL = {"linkedin": "https://www.linkedin.com/company/ezydrag", "whatsapp": ""}
LI_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>'
WA_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88a9.83 9.83 0 0 1 9.88 9.89c0 5.45-4.44 9.88-9.89 9.88zm8.41-18.3A11.81 11.81 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.17-3.48-8.41z"/></svg>'
def mailchip(big=False):
    return (f'<div class="mailchip{" big" if big else ""}"><a class="mc-addr" href="mailto:{EMAIL}">{EMAIL}</a>'
            f'<button class="mc-copy" type="button" data-copy="{EMAIL}" aria-label="Copy email address {EMAIL}"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" fill="none" stroke="currentColor" stroke-width="2"/></svg><span data-copy-label>Copy</span></button></div>')
def socials():
    a = [f'<a class="soc" href="{SOCIAL["linkedin"]}" target="_blank" rel="noopener me" aria-label="Ezydrag on LinkedIn">{LI_SVG}<span>LinkedIn</span></a>']
    if SOCIAL.get("whatsapp"):
        a.append(f'<a class="soc" href="https://wa.me/{SOCIAL["whatsapp"]}?text=Hi%20Ezydrag" target="_blank" rel="noopener" aria-label="Message Ezydrag on WhatsApp">{WA_SVG}<span>WhatsApp</span></a>')
    return '<div class="socials">' + "".join(a) + '</div>'
# file -> (title <=60ch, description 110-160ch, sitemap priority)
SEO = {
 "index.html": ("Ezydrag - AI agent studio for revenue teams", "Ezydrag designs, builds and runs AI agents for sales and marketing teams, starting with lead nurture, email QA and reporting. A person approves every key step.", "1.0"),
 "agents.html": ("AI agents we build - Sales Nurture, Email QA, QBR - Ezydrag", "Sixteen AI agents for revenue teams: nine we run today, from Sales Nurture to Email QA, and seven built to order, like Speed-to-Lead and Churn.", "0.9"),
 "product.html": ("How we work - AI agents as a service - Ezydrag", "Ezydrag is a service, not software to learn. We map the task, build the agent in your tools, run it every day and improve it. You approve what matters.", "0.9"),
 "customers.html": ("Customers - AI agents in production - Ezydrag", "See how RightWave, a US marketing automation company, runs lead nurture and email agents built by Ezydrag, and what Cerkle, Eternup and Nutaan AI say.", "0.8"),
 "pricing.html": ("Pricing - Pilot, run and studio plans - Ezydrag", "Start with one agent on one task, let us run your agents, or keep our studio on call for new ones. Every engagement is scoped and priced up front, in writing.", "0.8"),
 "security.html": ("Trust - How Ezydrag agents stay safe - Ezydrag", "Our agents ask before important actions, show their reasons, log every step and only reach the systems you connect. How we protect your data, in plain words.", "0.8"),
 "about.html": ("About Ezydrag - The AI agent studio", "Ezydrag is a small AI agent studio in Kolkata, Bangalore and Durgapur. We build and run AI agents for revenue teams. Meet the people and the agents.", "0.6"),
 "faq.html": ("FAQ - AI agents built and run by Ezydrag", "Plain answers about Ezydrag: what we build, custom agents, approvals, which tools we connect to, data safety, pricing and how to get started.", "0.6"),
 "demo.html": ("Book a call - Tell us the agent you need - Ezydrag", "A 30-minute call with the people who would build your agent. Bring one task your team repeats every week. We'll tell you honestly if an agent should do it.", "0.9"),
 "data-graph.html": ("Context graph - How our agents know your business - Ezydrag", "The context graph links Salesforce, Marketo, analytics and meeting notes, so every Ezydrag agent works with the full story. Try asking it about a lead.", "0.6"),
 "token-optimization.html": ("Token efficiency - Lower AI running costs - Ezydrag", "How Ezydrag keeps AI agents affordable at scale: lean context, answers without a model call, and agents that audit token use. Estimate your bill.", "0.5"),
 "privacy.html": ("Privacy notice - How Ezydrag handles personal data", "How Ezydrag Private Limited collects, uses, protects and deletes personal data, and your rights under India's DPDPA 2023 and the EU and UK GDPR.", "0.3"),
 "compliance.html": ("Consent and compliance - GDPR, DPDPA, HIPAA - Ezydrag", "Agents should only contact people who said yes. Ezydrag maps where personal data lives, checks consent against GDPR, India's DPDP Act and HIPAA, and fixes gaps.", "0.5"),
 "academy.html": ("Ezydrag Academy (beta) - Train your team by doing", "Short, hands-on lessons in simulated apps that prepare your team to work with AI agents, handle consent and review AI output with confidence.", "0.4"),
 "feedback.html": ("Feedback - How your input shapes our agents - Ezydrag", "How Ezydrag listens: check-ins after each milestone, a quarterly review and a backlog where every comment becomes a fix, a new rule or an approved answer.", "0.4"),
 "report.html": ("The Ezydrag Report 2026 - Field notes on AI agents", "What we learned running AI agents in production sales and marketing: context beats prompts, approval is a feature, token bills, and privacy deadlines.", "0.6"),
 "404.html": ("Page not found (404) | Ezydrag AI agent studio", "This page has moved or no longer exists. Go back to the Ezydrag home page to see the AI agents we build and run for revenue teams.", None),
}
SEO.update(BLOG.seo())
SRC, DIST = ROOT / "src", ROOT / "dist"

# ------------------------------------------------------------------ icons (24px stroke set)
ICONS = {
 "phone": '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
 "graph": '<circle cx="5" cy="6" r="2.5"/><circle cx="19" cy="6" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path d="M7 7l3.6 9M17 7l-3.6 9M7.5 6h9"/>',
 "pipe": '<path d="M3 7h5l3 5-3 5H3M21 7h-5l-3 5 3 5h5"/>',
 "layers": '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
 "token": '<ellipse cx="12" cy="7" rx="7" ry="3"/><path d="M5 7v5c0 1.7 3.1 3 7 3s7-1.3 7-3V7M5 12v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5"/>',
 "chat": '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 10h8M8 13h5"/>',
 "help": '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5V14M12 17h.01"/>',
 "gauge": '<path d="M4 17a8 8 0 1 1 16 0"/><path d="M12 17l4-6"/>',
 "report": '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 16v-3M12 16V9M16 16v-5"/>',
 "target": '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/>',
 "check": '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M8 12l3 3 5-6"/>',
 "tick": '<path d="M5 12l4 4 10-10"/>',
 "shield": '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
 "lock": '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
 "cap": '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>',
 "voice": '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
 "cal": '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
 "mail": '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
 "list": '<path d="M9 6h12M9 12h12M9 18h12"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',
 "loop": '<path d="M20 12a8 8 0 1 1-3-6.2"/><path d="M20 4v5h-5"/>',
 "arrow": '<path d="M5 12h14M13 6l6 6-6 6"/>',
 "arrowl": '<path d="M19 12H5M11 6l-6 6 6 6"/>',
 "chev": '<path d="M6 9l6 6 6-6"/>',
 "plus": '<path d="M12 5v14M5 12h14"/>',
 "x": '<path d="M6 6l12 12M18 6L6 18"/>',
 "menu": '<path d="M4 7h16M4 12h16M4 17h16"/>',
 "play": '<path d="M7 5l12 7-12 7z"/>',
 "pause": '<path d="M8 5v14M16 5v14"/>',
 "refresh": '<path d="M20 11a8 8 0 0 0-14.6-4.5L4 8M4 4v4h4M4 13a8 8 0 0 0 14.6 4.5L20 16M20 20v-4h-4"/>',
 "skip": '<path d="M5 5l10 7-10 7zM19 5v14"/>',
 "globe": '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
 "pin": '<path d="M12 21s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>',
 "users": '<circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-3.5 3-6 7-6s7 2.5 7 6"/><circle cx="17" cy="9" r="2.5"/><path d="M17 14c3 0 5 2 5 5"/>',
 "star": '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
 "bolt": '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
 "spark": '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18"/>',
 "doc": '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
 "alert": '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18h.01"/>',
 "search": '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
 "home": '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
 "copy": '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
 "wifi": '<path d="M2 8.5a15 15 0 0 1 20 0M5 12a10 10 0 0 1 14 0M8.5 15.5a5 5 0 0 1 7 0M12 19h.01"/><path d="M3 3l18 18"/>',
 "briefcase": '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>',
 "terminal": '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9l3 3-3 3M13 15h4"/>',
 "heart": '<path d="M12 20s-8-4.6-8-10.2A4.8 4.8 0 0 1 12 7a4.8 4.8 0 0 1 8 2.8C20 15.4 12 20 12 20z"/>',
}
def _ic(): d = dict(ICONS); d["_order"] = ["list", "mail", "check", "target", "report"]; return d
SPRITE = '<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>' + "".join(
    f'<symbol id="i-{k}" viewBox="0 0 24 24">{v}</symbol>' for k, v in ICONS.items()) + "</defs></svg>"
def icon(name, cls="i"):
    return f'<svg class="{cls}" aria-hidden="true" focusable="false"><use href="#i-{name}"/></svg>'

# ------------------------------------------------------------------ snippets
def star_ring():
    return "".join(f'<circle cx="{24+math.cos(-math.pi/2+i*math.pi/6)*17:.1f}" cy="{24+math.sin(-math.pi/2+i*math.pi/6)*17:.1f}" r="1.9" fill="#ff9054"/>' for i in range(12))
BADGE_SVG = {
 "gdpr": f'<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><circle cx="24" cy="24" r="23" fill="#2b2e3c"/>{star_ring()}<rect x="18" y="22" width="12" height="9" rx="2" fill="#fff"/><path d="M20.5 22v-2.5a3.5 3.5 0 0 1 7 0V22" fill="none" stroke="#fff" stroke-width="2"/></svg>',
 "hipaa": '<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><path d="M24 2 43 9v13c0 12-8 20-19 24C13 42 5 34 5 22V9z" fill="#2b2e3c"/><path d="M24 7 38 12v10c0 9-6 15-14 18-8-3-14-9-14-18V12z" fill="none" stroke="#ff9054" stroke-width="1.5"/><path d="M21 15h6v6h6v6h-6v6h-6v-6h-6v-6h6z" fill="#fff"/></svg>',
 "dpdp": '<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><rect x="1" y="1" width="46" height="46" rx="12" fill="#2b2e3c"/><g fill="none" stroke="#ff9054" stroke-width="1.8" stroke-linecap="round"><path d="M15 30c0-8 4-13 9-13s9 5 9 13"/><path d="M19 32c0-7 2-10 5-10s5 3 5 10"/><path d="M24 26v8"/><path d="M11 25c1-9 6-15 13-15s12 6 13 15"/></g><text x="24" y="44" text-anchor="middle" font-family="monospace" font-size="6.5" font-weight="700" fill="#fff">DPDP</text></svg>',
}
BADGE_TXT = {"gdpr": ("GDPR", "EU"), "hipaa": ("HIPAA", "US health"), "dpdp": ("DPDPA", "India 2023")}
def badges():
    return '<div class="badges">' + "".join(f'<a class="badge" href="compliance.html#{k}">{BADGE_SVG[k]}<span><b>{BADGE_TXT[k][0]}</b><small>{BADGE_TXT[k][1]}</small></span></a>' for k in ("gdpr", "hipaa", "dpdp")) + "</div>"

TEAM = [
 ("Supravo Bhandari", "Chief Executive Officer", "supravo-bhandari", "Leads strategy and client partnerships."),
 ("Anirban Dasgupta", "Chief Operating Officer", "anirban-dasgupta", "Runs delivery across every project."),
 ("Shuvam Santra", "Chief Technology Officer", "shuvam-santra", "Owns the context pipeline and agent architecture."),
 ("Santanu Mondal", "Director of Design", "santanu-mondal", "Shapes how people see and steer our agents."),
]
AGENT_TEAM = [
 ("QBR Generator", "AI agent · Reporting", "qbr", "Turns quarterly workbooks into review decks. Works every quarter close."),
 ("Sales Nurture", "AI agent · Sales", "nurture", "Takes every lead from first touch to closed deal. Asks before every send."),
 ("Voice Agent", "AI agent · Voice", "voice", "Calls and WhatsApp follow-ups, built with Nutaan AI."),
 ("Email QA", "AI agent · Quality", "qa", "Checks every Marketo send and alerts the owner."),
 ("Ask Ezydrag", "AI agent · Support", "ask", "Answers from approved Q&A. Zero tokens for known questions."),
]
# ---------------------------------------------------------------------------
# The portfolio: one source for every agent we have built (home, agents page, footer, FAQ)
PORTFOLIO = [
 # id, name, one-liner, runs in, a person decides, status
 ("nurture", "Sales Nurture Agent", "Takes every lead from first touch to closed deal: capture, score, nurture and hand-off.", "Salesforce · HubSpot · Marketo", "Every email before it sends", "Flagship"),
 ("emails", "Email Creation Agent", "Builds campaign and nurture emails from your approved content.", "Marketo · HubSpot", "Every draft before it goes live", "In production"),
 ("qa", "Email QA Agent", "Checks every email for broken links, wrong tokens and typos before it sends.", "Marketo · HubSpot", "Anything it flags", "In production"),
 ("qbr", "QBR Generator", "Turns the quarter's pipeline and campaign numbers into a review deck.", "Salesforce · Sheets", "The final deck", "In production"),
 ("pta", "AI PTA", "Turns meeting notes into owners, dates and follow-ups that get tracked.", "Calendar · Slack · email", "Who owns each task", "In production"),
 ("voice", "Voice Agent", "Calls, WhatsApp and SMS follow-ups, built with our partner Nutaan AI.", "Phone · WhatsApp", "Scripts and who gets called", "With Nutaan AI"),
 ("ask", "Ask Ezydrag", "Answers customer and team questions from approved answers. Hands off to a person when unsure.", "Website · chat", "The approved answers", "Live on this site"),
 ("prospect", "Prospecting Agent", "Watches buying signals, finds the right people and drafts personal first emails. More meetings, less rep research.", "Clay · Apollo · your CRM", "Every first message", "In demand"),
 ("govern", "Governance Agent", "Logs what every other agent does and which data it touches, and enforces approvals. Pairs with GDPR and DPDPA work.", "Across every agent we run", "Who can approve what", "In demand"),
]
PF_STEPS = '<ol class="pf-steps" aria-label="Six steps">' + "".join(f'<li><span class="at-ico">{icon(ic)}</span>{l}</li>' for ic, l in [("users","Capture"),("search","Enrich"),("gauge","Score"),("mail","Nurture"),("cal","Meeting"),("star","Won")]) + '</ol>'
PF_BOARD = ('<div class="pf-board" aria-label="Sample run"><span class="pf-bh">Sample run · today</span><ul role="list">'
 '<li><span class="pb-av">PA</span><span><b>Priya, Acme</b><small>Webinar form</small></span><span class="pchip tone-mint"><i></i>Scored 82</span></li>'
 '<li><span class="pb-av">TG</span><span><b>Tom, Globex</b><small>Pricing page, twice</small></span><span class="pchip tone-butter"><i></i>Waiting for you</span></li>'
 '<li><span class="pb-av">MI</span><span><b>Mei, Initech</b><small>Demo request</small></span><span class="pchip tone-sky"><i></i>Meeting booked</span></li>'
 '<li><span class="pb-av">RS</span><span><b>Ravi, Stark</b><small>Event list import</small></span><span class="pchip tone-lav"><i></i>Enriching</span></li>'
 '</ul></div>')
def portfolio(compact=False):
    cards = []
    for aid, name, one, runs, decides, status in PORTFOLIO:
        flag = aid == "nurture"
        cards.append(f'''<li class="pf-card{' pf-flag' if flag else ''} rv"><a class="pf-link" href="agents.html#{aid}">
  <span class="pf-top"><span class="pf-av">{B.agent(aid, 56 if flag else 48)}</span><span class="pf-status tone-{ {'Flagship':'peach','In production':'mint','With Nutaan AI':'lav','Live on this site':'sky','In demand':'rose'}.get(status,'sand') }"><i aria-hidden="true"></i>{status}</span></span>
  <h3 class="h4">{name}</h3><p>{one}</p>{PF_STEPS + PF_BOARD if flag else ''}
  <dl class="pf-meta"><div><dt>Runs in</dt><dd>{runs}</dd></div><div><dt>You approve</dt><dd>{decides}</dd></div></dl>
  <span class="pf-more">See how it works {icon("arrow")}</span></a></li>''')
    cards.append(f'''<li class="pf-card pf-new rv"><a class="pf-link" href="demo.html#brief"><span class="pf-top"><span class="pf-plus" aria-hidden="true">{icon("plus") if "plus" in ICONS else "+"}</span><span class="pf-status tone-sand"><i aria-hidden="true"></i>Custom</span></span>
  <h3 class="h4">Your next agent</h3><p>Have a task your team repeats every week? Tell us. We'll tell you honestly if an agent should do it.</p><span class="pf-more">Describe the task {icon("arrow")}</span></a></li>''')
    return '<ul class="pf-grid" role="list">' + "".join(cards) + "</ul>"

# n8n-style live demo: pick an agent, read its brief, watch the steps run (one step needs a person)
AGENT_TABS = [
 ("nurture", "Sales Nurture", "When a new lead comes in, find out who they are, score them and write the next email. Ask me before anything sends.",
  [("users","Capture","Priya, Acme Corp, webinar form"),("search","Enrich","1,200 people, no open deal"),("gauge","Score","82 / 100, visited pricing"),("mail","Draft email","Case study, for Tuesday"),("check","You approve","Maya approved it",1),("cal","Hand-off","Meeting booked with Tom")]),
 ("qa", "Email QA", "Before any campaign email sends, check links, tokens and spelling. Flag anything odd to the owner.",
  [("mail","New send","Q4 launch, 13,813 people"),("search","Check links","1 broken link found"),("doc","Check tokens","First name token OK"),("alert","Flag","Sent to the owner"),("check","You approve","Fixed and approved",1),("tick","Send","Sent through Marketo")]),
 ("qbr", "QBR Generator", "At quarter close, pull pipeline and campaign numbers and draft our review deck with the story.",
  [("graph","Pull data","Salesforce + sheets"),("gauge","Find changes","Pipeline up, 2 risks"),("doc","Write story","8 slides, plain words"),("report","Build deck","Brand template"),("check","You approve","Edited and approved",1),("star","Present","Ready for Friday")]),
 ("ask", "Ask Ezydrag", "Answer questions on our site from approved answers only. If unsure, hand over to a person.",
  [("chat","Question","Do we approve emails?"),("search","Match","Approved answer found"),("tick","Answer","Instant, no AI call"),("alert","Unsure?","New question detected"),("check","Person replies","Our team answers",1),("doc","Learn","Added to approved answers")]),
]
def agent_tabs():
    tabs, panels = [], []
    for n, (aid, label, brief, steps) in enumerate(AGENT_TABS):
        sel = n == 0
        tabs.append(f'<button class="at-tab" role="tab" id="at-t{n}" aria-controls="at-p{n}" aria-selected="{str(sel).lower()}" tabindex="{0 if sel else -1}"><span class="at-av">{B.agent(aid, 28)}</span>{label}</button>')
        lis = "".join(f'<li class="at-step{" human" if len(st) > 3 else ""}"><span class="at-ico">{icon(st[0])}</span><b>{st[1]}</b><small>{st[2]}</small></li>' for st in steps)
        panels.append(f'''<div class="at-panel" role="tabpanel" id="at-p{n}" aria-labelledby="at-t{n}"{'' if sel else ' hidden'}>
  <p class="at-brief"><span class="at-k">Brief</span>{brief}</p>
  <ol class="at-steps">{lis}</ol></div>''')
    return f'''<div class="at" data-tabs>
 <div class="at-bar"><div class="at-tabs" role="tablist" aria-label="Example agents">{"".join(tabs)}</div><button class="at-ctl" type="button" data-at-toggle aria-pressed="false" aria-label="Pause the demo">{icon("pause")}</button></div>
 {"".join(panels)}
 <p class="at-note">Sample run. The highlighted step always waits for a person.</p>
</div>'''

# The stacks we build on. Text chips, no third-party logos. Keep in sync with FAQ "Which tools...".
STACK = [
 ("users", "CRM", ["Salesforce", "HubSpot", "Zoho CRM", "Pipedrive", "Attio"]),
 ("mail", "Marketing and outreach", ["Marketo", "HubSpot", "Instantly", "Outreach"]),
 ("search", "Data and enrichment", ["Clay", "Apollo", "ZoomInfo"]),
 ("loop", "Workflows", ["n8n", "Zapier", "Make", "MCP servers", "Webhooks and APIs"]),
 ("chat", "Where your team talks", ["Slack", "Microsoft Teams", "Google Workspace", "WhatsApp Business"]),
 ("cal", "Calls and meetings", ["Zoom", "Google Meet", "Gong", "Fathom"]),
 ("graph", "Data platforms", ["Snowflake", "BigQuery", "Databricks", "Postgres"]),
 ("spark", "AI models", ["Claude", "GPT", "Gemini", "Open-weight models"]),
]
def initials(x):
    w = [p for p in re.split(r"[\s-]+", x) if p and p[0].isalnum()]
    return (w[0][:2] if len(w) == 1 else w[0][0] + w[1][0]).capitalize() if w else "·"
TONES=["sky","peach","mint","lav","butter","sand"]
def tone_imp(i):
    i=i.lower()
    return "mint" if i=="high" else "sky" if i.startswith("medium-high") else "lav" if "enabler" in i else "rose" if "differ" in i else "butter"
def stack():
    rows = "".join(f'<li class="stk rv"><span class="stk-h"><span class="ico">{icon(ic)}</span>{t}</span><span class="stk-c">' + "".join(f'<span class="chip">{x}</span>' for x in xs) + "</span></li>" for ic, t, xs in STACK)
    return (f'<ul class="stk-grid" role="list">{rows}</ul>'
            '<p class="footnote">Names are trademarks of their owners and show tools we connect to, not partnerships. If it has an API or an MCP server, we can usually connect it. We confirm the exact list during scoping. '
            'In a July 2026 survey of 62 GTM leaders, Clay (71%), n8n (48%) and HubSpot (39%) were the most used tools '
            '(<a href="https://coldiq.com/blog/the-2026-gtm-tool-report-what-62-revenue-leaders-run" target="_blank" rel="noopener">ColdIQ</a>).</p>')

# High-demand agents for B2B RevOps, ranked by direct revenue impact (Ezydrag research, Nov 2026)
# status: (label, link or None). Only claim coverage we actually have.
REVOPS = [
 ("Prospecting Agent", "High", "Watches buying signals (funding, hiring, job changes, site visits), finds the right contacts and writes personal outreach.", "More meetings, less rep research", "Meetings booked", ("Now in our portfolio", "agents.html#prospect")),
 ("Speed-to-Lead Agent", "High", "Replies to every inbound lead in seconds by email, chat or WhatsApp, asks qualifying questions, books the meeting and picks the right rep.", "Higher inbound conversion, no cold leads", "Lead response time", ("Built to order", None)),
 ("Deal Follow-up Agent", "Medium-high", "Listens to sales calls, updates the CRM, drafts the follow-up and flags deals that go quiet.", "Faster cycles, fewer stalled deals", "Stalled deals", ("Built to order", None)),
 ("Forecasting Agent", "Medium", "Reviews every open deal weekly, scores its risk and writes the forecast summary for leadership.", "Better forecasts, earlier warnings", "Forecast accuracy", ("Built to order", None)),
 ("CRM Cleanup Agent", "Medium · enabler", "Finds duplicates, fills missing fields and fixes bad data, around the clock.", "Clean data for every other agent", "Duplicates and gaps fixed", ("Good first project", None)),
 ("Churn and Upsell Agent", "High", "Tracks usage and support tickets, warns when a customer might leave and spots upsell chances.", "Protected renewals, higher NRR", "Churn saved", ("Partly covered today", None)),
 ("Attribution Agent", "Medium", "Links campaigns to closed deals and tells the team where to spend more or less.", "Better return on marketing spend", "Spend per won deal", ("Partly covered today", "agents.html#nurture")),
 ("Deal Desk Agent", "Medium", "Checks discounts against policy, builds quotes and routes approvals. A person always decides.", "Less discount leakage, faster quotes", "Discount leakage", ("Built to order", None)),
 ("Governance Agent", "Differentiator", "Logs what every other agent does and which data it touches, and enforces approvals.", "Safe AI adoption, GDPR and DPDPA ready", "Actions logged and approved", ("Now in our portfolio", "agents.html#govern")),
]
REVOPS_STATS = [
 ("<10%", "of RevOps leaders have seen AI contribute directly to pipeline, though 71% rate their AI knowledge 7/10 or higher.", "Default, State of AI in RevOps, H1 2026", "https://www.default.com/post/ai-agents-and-revops"),
 ("6%", "of RevOps practitioners will let AI agents negotiate with customers in the next 12 months. 75% said no.", "RevOps Co-op and DealHub, Q4 2026 (n=102)", "https://dealhub.io/resource-center/reports/revops-ai-authority-benchmark/"),
]
# Built to order: the agents teams ask for most, in the same card language as the portfolio. No sources here: this is a sales zone.
TO_ORDER = [
 ("speed", "Speed-to-Lead Agent", "Replies to every inbound lead in seconds by email, chat or WhatsApp, qualifies, books the meeting and picks the rep.", "No lead goes cold", "Lead response time", "High"),
 ("churn", "Churn and Upsell Agent", "Reads usage and support tickets, warns before a customer leaves and spots upsell chances.", "Renewals protected", "Churn saved", "High"),
 ("followup", "Deal Follow-up Agent", "Listens to sales calls, updates the CRM, drafts the follow-up and flags deals that go quiet.", "Fewer stalled deals", "Stalled deals", "Medium-high"),
 ("cleanup", "CRM Cleanup Agent", "Finds duplicates, fills missing fields and fixes bad data, around the clock. The best first project.", "Clean data for every agent", "Duplicates and gaps fixed", "Good first project"),
 ("forecast", "Forecasting Agent", "Reviews every open deal weekly, scores the risk and writes the forecast summary for leadership.", "Earlier warnings", "Forecast accuracy", "Medium"),
 ("desk", "Deal Desk Agent", "Checks discounts against policy, builds quotes and routes approvals. Pricing always stays with a person.", "Less discount leakage", "Discount leakage", "Medium"),
 ("attrib", "Attribution Agent", "Links campaigns to closed deals and shows where to spend more, or less.", "Better marketing return", "Spend per won deal", "Medium"),
]
def to_order(limit=None):
    rows = TO_ORDER[:limit] if limit else TO_ORDER
    cards = "".join(f'''<li class="to-card rv" id="{aid}"><div class="to-head"><span class="pf-av">{B.agent(aid, 48)}</span><span class="pf-status tone-{"mint" if imp == "High" else "rose" if imp == "Good first project" else "butter" if imp.startswith("Medium-") else "sand"}"><i aria-hidden="true"></i>{imp if imp == "Good first project" else imp + " impact"}</span></div>
  <h3 class="h4">{name}</h3><p>{what}</p>
  <dl class="pf-meta"><div><dt>You get</dt><dd>{gain}</dd></div><div><dt>We measure</dt><dd>{measure}</dd></div></dl>
  <a class="to-cta" href="demo.html?agent={name.replace(" ", "+")}">{icon("phone")}Talk to us about this agent{icon("arrow")}</a></li>''' for aid, name, what, gain, measure, imp in rows)
    return f'<ul class="to-grid" role="list">{cards}</ul>'

def revops(compact=False):
    rows = []
    for n, (name, impact, what, lever, measure, (st, link)) in enumerate(REVOPS, 1):
        hot = impact.startswith("High")
        stl = f'<a class="ro-st" href="{link}">{st}</a>' if link else f'<span class="ro-st{" go" if st == "Good first project" else ""}">{st}</span>'
        if compact:
            rows.append(f'<li class="ro-row rv"><span class="ro-n tnum">{n:02d}</span><b>{name}</b><span class="ro-imp tone-{tone_imp(impact)}">{impact}</span><span class="ro-lever">{lever}</span></li>')
        else:
            rows.append(f'''<li class="ro-card rv"><div class="ro-top"><span class="ro-n tnum">{n:02d}</span><span class="ro-imp tone-{tone_imp(impact)}">Revenue impact: {impact}</span></div>
  <h3 class="h4">{name}</h3><p>{what}</p>
  <dl class="pf-meta"><div><dt>Profit lever</dt><dd>{lever}</dd></div><div><dt>We measure</dt><dd>{measure}</dd></div></dl>{stl}</li>''')
    cls = "ro-list" if compact else "ro-grid"
    return f'<ol class="{cls}" role="list">' + "".join(rows) + "</ol>"
def revops_stats():
    return '<ul class="tr-grid tr-2" role="list">' + "".join(f'''<li class="tr-card rv"><span class="tr-n tnum">{n}</span><p>{line}</p><p class="tr-src"><a href="{u}" rel="noopener" target="_blank">{src}</a></p></li>''' for n, line, src, u in REVOPS_STATS) + "</ul>"

# Agents in demand: sourced, dated. Update TRENDS_DATE when the list changes.
TRENDS_DATE = "9 November 2026"
TRENDS = [
 ("Lead follow-up and prospecting", "55%", "of sales professionals already use AI for prospecting. Another 38% plan to.", "Salesforce State of Sales, Feb 2026 (vendor survey)", "https://www.salesforce.com/news/stories/state-of-sales-report-announcement-2026/top-ai-agent-use-cases/", "nurture", "Sales Nurture Agent"),
 ("Customer service agents", "80%", "of common customer service issues will be solved by agentic AI without a person by 2029, Gartner predicts.", "Gartner, March 2025", "https://www.cmswire.com/the-wire/gartner-predicts-agentic-ai-will-autonomously-resolve-80-of-common-customer-service-issues-without-human-intervention-by-2029", "ask", "Ask Ezydrag · Voice Agent"),
 ("Research and reporting agents", "56%", "of organisations plan to build research and reporting agents in the next 12 months, the top choice.", "Anthropic State of AI Agents, 2026 (vendor survey)", "https://claude.com/resources/guides/the-2026-state-of-ai-agents-report/research-insights-part-ii-going-deeper", "qbr", "QBR Generator"),
 ("Email and content drafting", "36%", "less time on email drafting is what sellers expect once AI agents are fully in place.", "Salesforce State of Sales, Feb 2026 (vendor survey)", "https://www.salesforce.com/news/stories/state-of-sales-report-announcement-2026/top-ai-agent-use-cases/", "emails", "Email Creation · Email QA"),
]
TRENDS_RISK = ("40%+", "of agentic AI projects will be cancelled by the end of 2027, Gartner predicts, because of cost, unclear value or weak risk controls.", "Gartner, June 2025", "https://yourstory.com/ai-story/gartner-agentic-ai-projects-cancelled-2027")
def trends(full=False):
    items = "".join(f'''<li class="tr-card rv"><span class="tr-k">{t}</span><span class="tr-n tnum">{n}</span><p>{line}</p>
  <p class="tr-src"><a href="{url}" rel="noopener" target="_blank">{src}</a></p>
  <a class="tr-we" href="agents.html#{aid}"><span class="tr-av">{B.agent(aid, 28)}</span><span>We build: <b>{we}</b></span></a></li>''' for t, n, line, src, url, aid, we in TRENDS)
    n, line, src, url = TRENDS_RISK
    risk = f'''<div class="tr-risk rv"><span class="tr-n tnum">{n}</span><div><p><b>{line}</b></p><p class="tr-src"><a href="{url}" rel="noopener" target="_blank">{src}</a></p></div>
  <p class="tr-why">That's why we start small, put a person on every important step, and stay to run what we build.</p></div>'''
    return f'<ul class="tr-grid" role="list">{items}</ul>' + (risk if full else "") + f'<p class="footnote">Updated {TRENDS_DATE}. Figures are from the published sources linked; vendor research is labelled as such.</p>'

def team(limit=None, join=True):
    lead = ["Chief Executive Officer", "Chief Operating Officer", "Chief Technology Officer", "Director of Design"]  # leadership first, in this order, then everyone else A to Z
    people = sorted(TEAM, key=lambda t: (lead.index(t[1]) if t[1] in lead else len(lead), t[0]))
    items = people[:limit] if limit else people
    li = lambda inner: f'<li>{inner}</li>'
    ppl = "".join(li(f'<button class="member" data-name="{n}" data-role="{r}" data-img="assets/team/{f}.jpg" data-focus="{fo}" aria-haspopup="dialog"><span class="frame"><span class="ph"><img src="assets/team/{f}.jpg" alt="Portrait of {n}" width="560" height="560" decoding="async"></span></span><b>{n}</b><small>{r}</small></button>') for n, r, f, fo in items)
    ag = sorted(AGENT_TEAM, key=lambda t: t[0])[: (2 if limit else None)]
    ags = "".join(li(f'<button class="member is-agent" data-name="{n}" data-role="{r}" data-img="assets/brand/agent-{ic}.svg" data-focus="{fo}" aria-haspopup="dialog"><span class="frame"><span class="ph"><img src="assets/brand/agent-{ic}.svg" alt="{n}, an Ezydrag AI agent" width="200" height="200" loading="lazy"></span></span><b>{n}</b><small>{r}</small></button>') for n, r, ic, fo in ag)
    return (f'<h3 class="team-h"><span class="sw"></span>People <small class="tnum">{len(items)}</small></h3><ul class="team" role="list">{ppl}</ul>'
            f'<h3 class="team-h"><span class="sw a"></span>AI agents on the team <small class="tnum">{len(ag)}</small></h3><ul class="team" role="list">{ags}</ul>')
DIALOG = f'''<dialog id="member-dialog" aria-labelledby="dlg-name"><button class="x" aria-label="Close">{icon("x")}</button><div class="dlg"><img src="data:," alt="" width="160" height="160"><div class="in"><span class="eyebrow">Ezydrag team</span><h2 id="dlg-name" data-d-name style="font-size:1.8rem"></h2><p class="muted" data-d-role></p><p data-d-focus></p><a class="btn btn-primary btn-sm" href="demo.html" style="align-self:flex-start">Book a call {icon("arrow")}</a></div></div></dialog>'''

QUOTES = [
 ("Ezydrag turned a real pain point into a working agent, fast. Our team now spends its time on growth.", "Muqtadir Rahaman", "Chief Executive Officer, Eternup", "M"),
 ("They listen first and build second. It was live before we expected.", "Rahul Chatterjee", "Chief Executive Officer, Cerkle", "R"),
 ("Their agents give our voice platform real business context. The partnership is seamless.", "Sourav Basu", "Chief Product Officer, Nutaan AI", "S"),
]
def quotes():
    q = "".join(f'<figure class="quote"><blockquote>{t}</blockquote><figcaption><span class="av" aria-hidden="true">{i}</span><span><b>{n}</b><span>{r}</span></span></figcaption></figure>' for t, n, r, i in QUOTES)
    return f'<div class="quotes" data-quotes aria-roledescription="carousel" aria-label="Client reviews">{q}<div class="qnav"><button class="qarrow" type="button" data-qprev aria-label="Previous review">{icon("arrowl")}</button><span class="qdots"></span><button class="qarrow" type="button" data-qnext aria-label="Next review">{icon("arrow")}</button></div></div>'

def newsletter(compact=False):
    return f'''<section class="nl grain" id="subscribe" aria-labelledby="nl-h"><div class="nl-in">
 <div><span class="eyebrow">Field Notes</span><h2 id="nl-h">One honest email a month.</h2><p class="muted">What we learned running agents in production. No hype, no tracking pixels, unsubscribe in one click.</p></div>
 <form class="nl-form" data-newsletter novalidate><label class="sr" for="nl-email">Work email</label><input id="nl-email" name="email" type="email" required autocomplete="email" placeholder="you@company.com">
 <button class="btn btn-primary" type="submit">Subscribe {icon("arrow")}</button>
 <p class="note" data-nl-out role="status">We only use your email to send Field Notes. Never sold, never shared.</p></form></div></section>'''

HANDOFF_AGENT = {"Capture": "nurture", "Score": "nurture", "Nurture": "nurture", "Hand-off": "nurture", "Close": "nurture"}
HANDOFF_ROWS = [
 ("users", "Capture", "Pulls in every new lead from forms, events and Marketo", "Marketing ops chooses the sources"),
 ("gauge", "Score", "Scores each lead on fit and intent", "Sales lead agrees the scoring rules"),
 ("mail", "Nurture", "Drafts the right next email for each lead", "Campaign manager approves every send"),
 ("cal", "Hand-off", "Flags sales-ready leads, with the full story", "The account executive takes the call"),
 ("star", "Close", "Logs every touch in Salesforce", "Sales lead owns the deal"),
]
def handoff():
    rows = "".join(f'<li class="ho-row rv"><span class="ho-task"><span class="ico">{icon(ic)}</span>{t}</span><span class="ho-agent"><span class="ho-av">{B.agent(HANDOFF_AGENT[t], 44)}</span><span><span class="who a">Agent</span>{ag}</span></span><span class="ho-line" aria-hidden="true"><i></i></span><span class="ho-human"><span class="who">Person</span>{hu}</span></li>' for ic, t, ag, hu in HANDOFF_ROWS)
    return f'<ol class="handoff" data-handoff aria-label="Who does what">{rows}</ol>'

# Client and partner logos. One treatment everywhere: single ink grey (#4d5163), transparent, trimmed,
# then optically scaled (height ~ 1/sqrt(aspect ratio), nudged by ink density) so no logo shouts.
# Files: src/assets/clients/<slug>.png (96px tall, 2x). Sizes below are CSS px. Add a row to add a logo.
CLIENTS = [  # slug, name, back-of-card line, kind, (w, h)
 ("rightwave", "RightWave", "Sales nurture and campaign agents", "Client · USA", (75, 31)),
 ("amazon", "Amazon", "", "Client", (79, 26)),
 ("ibm", "IBM", "", "Client", (77, 28)),
 ("cerkle", "Cerkle", "Custom agent build", "Client · India", (86, 24)),
 ("eternup", "Eternup", "Workflow agent", "Client · India", (110, 23)),
 ("nutaan", "Nutaan AI", "Voice and messaging partner", "Partner · India", (99, 26)),
]
def clients(label="Trusted by teams at"):
    cards = []
    for slug, name, what, kind, (w, h) in CLIENTS:
        f = SRC / "assets/clients" / f"{slug}.png"
        logo = f'<img src="assets/clients/{slug}.png" alt="{name}" width="{w}" height="{h}" loading="lazy" decoding="async">' if f.exists() else f'<span class="cl-word">{name}</span>'
        back = f'<b>{what or name}</b><small>{kind}</small>'
        cards.append(f'<li class="cl"><span class="cl-front">{logo}</span></li>')
    return f'<section class="clients" aria-label="Customers and partners"><div class="wrap row"><span class="note">{label}</span><ul class="cl-wall" role="list">{"".join(cards)}</ul></div></section>'

def brand_page():
    ic = _ic()
    fam = [("Compact mark", "Nav, favicon, avatars, app icon", B.mark(150), "ezydrag-mark.svg", ""),
           ("Wordmark", "Hero, footer, documents, slides", B.wordmark(84), "ezydrag-wordmark.svg", ""),
           ("Reverse", "On ink or photos", B.mark(150, "reverse"), "ezydrag-mark-reverse.svg", "ink"),
           ("Mono", "One-colour print, embossing", B.mark(150, "mono"), "ezydrag-mark-mono.svg", ""),
           ("Favicon cut", "16 to 24px only", B.mark(48, small=True) + B.mark(24, small=True) + B.mark(16, small=True), "ezydrag-mark-16.svg", ""),
           ("Wordmark reverse", "Dark surfaces", B.wordmark(64, "reverse"), "ezydrag-wordmark-reverse.svg", "ink")]
    family = "".join(f'<figure class="bp-card {bg}"><div class="bp-stage">{svg}</div><figcaption><b>{t}</b><small>{u}</small><a class="link" href="assets/brand/{f}" download>SVG {icon("arrow")}</a></figcaption></figure>' for t, u, svg, f, bg in fam)
    agents = "".join(f'<figure class="bp-agent">{B.agent(aid, 120)}<figcaption><b>{n}</b><small>{role}</small></figcaption></figure>' for aid, (n, _, role) in B.AGENTS.items())
    icons = "".join(f'<li title="{k}">{icon(k)}<small>{k}</small></li>' for k in ICONS)
    return {"family": family, "agents": agents, "icons": icons, "loader": B.loader(96, "Loading demo", ICONS), "hover": B.mark(140, cls="b-mark nav-mark big-hover"),
            "construction": B.mark(300, cls="b-mark bp-con"), "word": B.wordmark(90),
            "m90": B.mark(90), "m40": B.mark(40), "m28": B.mark(28), "m24s": B.mark(24, small=True), "w44": B.wordmark(44), "w40r": B.wordmark(40, "reverse"), "w28": B.wordmark(28),
            "app": B.mark(110), "a_qa": B.agent("qa", 110), "a_nur": B.agent("nurture", 110), "a_ask": B.agent("ask", 64), "sat": ART.art("agents", 300), "flow": ART.flow()}

def charge():
    """You stay in charge: three human moments from the nurture journey."""
    faces = "".join(f'<img src="assets/team/{f}.jpg" alt="" width="36" height="36">' for f in [t[2] for t in TEAM])
    return f'''<div class="scenes">
 <figure class="scene rv"><div class="sc-ui"><div class="sc-row"><span class="sc-av">{B.agent("nurture", 36)}</span><div><b>Email for Priya is ready</b><small>Score 82 · drafted by the agent</small></div></div><div class="sc-btns"><span class="sc-yes">{icon("tick")}Approve</span><span class="sc-no">Not yet</span></div></div>
  <figcaption><span class="eyebrow">You approve</span><h3>No email reaches a lead until someone on your team says yes.</h3></figcaption></figure>
 <figure class="scene rv"><div class="sc-ui sc-log"><p><time>10:41</time><span class="sc-dot a"></span>Agent scored Priya 82</p><p><time>10:42</time><span class="sc-dot h"></span><b>Maya</b> approved the email</p><p><time>10:43</time><span class="sc-dot a"></span>Sent through Marketo</p></div>
  <figcaption><span class="eyebrow">You see why</span><h3>Every score has a reason. Every action has a name next to it.</h3></figcaption></figure>
 <figure class="scene rv"><div class="sc-ui"><div class="sc-row"><span class="ico">{icon("refresh")}</span><div><b>Delete our lead data</b><small>Marketo · Salesforce · analytics</small></div></div><div class="sc-done">{icon("tick")}Deleted from 3 systems</div></div>
  <figcaption><span class="eyebrow">You own it</span><h3>Your leads stay yours. Ask, and we delete everything.</h3></figcaption></figure>
</div>
<div class="humans rv"><span class="faces" aria-hidden="true">{faces}</span><p><b>Real people run it.</b> Write to <code>hello@ezydrag.in</code>. Someone on our team reads every message.</p></div>'''

def worldmap():
    meta = json.loads((ROOT / "tools/map-meta.json").read_text())
    W, H, m = meta["W"], meta["H"], meta["m"]
    dots = (SRC / "assets/worlddots.svgfrag").read_text()
    pins = [("kolkata","Kolkata","Where agents are made","Agents get designed, built and looked after here.","office",-14,-14),
            ("bangalore","Bangalore","Where agents are made","Integrations get wired, tested and shipped here.","office",-14,22),
            ("durgapur","Durgapur","Where agents are made","Every run gets watched, every day, from here.","office",14,-2),
            ("usa","United States","Where agents work","Following up leads for RightWave, around the clock.","market",0,-16),
            ("uk","United Kingdom","Where agents work","Keeping consent and GDPR in check.","market",-10,-14),
            ("eu","European Union","Where agents work","Mapping personal data against GDPR.","market",12,4)]
    out = [f'<div class="map" data-map><svg viewBox="0 0 {W} {H}" role="group" aria-label="Map: agents made in Kolkata, Bangalore and Durgapur, working in the US, UK and EU"><g class="dots" aria-hidden="true">{dots}</g>']
    for pid, name, kind, info, cls, lx, ly in pins:
        x, y = m[pid]
        label = "" if pid == "durgapur" else f'<text x="{x+lx}" y="{y+ly}" text-anchor="{"end" if lx < 0 else "start"}" aria-hidden="true">{name}</text>'
        out.append(f'<g class="pin {cls}" data-id="{pid}" data-name="{name}" data-kind="{kind}" data-info="{info}" tabindex="0" role="button" aria-label="{name}: {kind}"><circle class="ring" cx="{x}" cy="{y}" r="7"/><circle class="core" cx="{x}" cy="{y}" r="6"/>{label}</g>')
    out.append('</svg><div class="map-card" aria-live="polite"></div></div>')
    return "".join(out)

def live():
    st = [("Collect","Sources","globe"),("Structure","Clean","list"),("Connect","Graph","graph"),("Activate","Agents","bolt")]
    li = "".join(f'<li data-st="{i}"><span class="ib">{icon(ic)}</span><span>{t}<small>{s}</small></span></li>' for i,(t,s,ic) in enumerate(st))
    return f'''<div class="live" data-live>
<ol class="stages" aria-label="Pipeline stages">{li}</ol>
<div class="term" data-term><div class="term-bar"><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="t" data-term-title>ezydrag — zsh</span><span class="win" aria-hidden="true"><span>–</span><span>□</span><span>×</span></span></div><div class="tabs" aria-hidden="true"><span>PROBLEMS</span><span>OUTPUT</span><span>DEBUG CONSOLE</span><b>TERMINAL</b></div><div class="term-body" data-term-body role="log" aria-live="off" aria-label="Pipeline output"></div></div>
<div class="side">
 <div class="scn"><span class="status-pill run" data-status>BOOTING</span><b data-scn-title>Loading scenario…</b><small class="muted" data-scn-meta></small></div>
 <div class="stat-grid">
  <div class="stat"><span>Elapsed</span><b data-s="elapsed">0.0s</b></div>
  <div class="stat"><span>Records</span><b data-s="records">0</b></div>
  <div class="stat"><span>Rate /s</span><b data-s="rate">0</b></div>
  <div class="stat"><span>Latency p50</span><b data-s="lat">–</b></div>
  <div class="stat"><span>Tokens in</span><b data-s="tin">0</b></div>
  <div class="stat"><span>Tokens out</span><b data-s="tout">0</b></div>
  <div class="stat"><span>Est. cost</span><b data-s="cost">$0.000</b></div>
  <div class="stat"><span>Warnings</span><b data-s="warn">0</b></div>
 </div>
 <div class="ctrls"><button class="btn btn-ghost btn-sm" data-live-pause aria-pressed="false">{icon("pause")}<span>Pause</span></button><button class="btn btn-ghost btn-sm" data-live-next>{icon("skip")}<span>Next run</span></button></div>
 <p class="note" data-live-count>Simulated runs with sample data. Refresh for a new one.</p>
</div></div>'''

# ------------------------------------------------------------------ navigation
NAV = [
 ("agents", "Agents", None, "agents.html"),
 ("product", "How we work", None, "product.html"),
 ("customers", "Customers", None, "customers.html"),
 ("pricing", "Pricing", None, "pricing.html"),
 ("security", "Trust", None, "security.html"),
 ("blog", "Field Notes", None, "blog.html"),
 ("company", "About us", None, "about.html"),
 ("faq", "FAQ", None, "faq.html"),
]
ORDER = [("index.html","Home"),("agents.html","Agents"),("product.html","How we work"),("customers.html","Customers"),
         ("pricing.html","Pricing"),("security.html","Trust"),("about.html","About us"),("faq.html","FAQ"),("demo.html","Book a call")]

def header(active, page):
    lis, drawer = [], []
    for key, label, cols, body, *feat in NAV:
        cls = " active" if key == active else ""
        cur = ' aria-current="page"' if isinstance(body, str) and body == page else ""
        if isinstance(body, str):
            lis.append(f'<li><a class="menu-btn{cls}" href="{body}"{cur}>{label}</a></li>')
            drawer.append(f'<a class="solo" href="{body}">{label}</a>')
            continue
        items = "".join(f'<a class="item" href="{h}"><span class="ib">{icon(ic)}</span><span><b>{t}</b><small>{d}</small></span></a>' for h, t, d, ic in body)
        f = feat[0] if feat and feat[0] else None
        feature = f'<a class="feature" href="{f[0]}">{ART.art("graph",96)}<span class="eyebrow">New · beta</span><b style="font-family:var(--f-display);font-size:1.1rem">{f[1]}</b><small class="muted">{f[2]}</small></a>' if f else ""
        lis.append(f'<li><button class="menu-btn{cls}" aria-expanded="false" aria-controls="mega-{key}">{label}{icon("chev","i chev")}</button><div class="mega {cols}" id="mega-{key}">{items}{feature}</div></li>')
        drawer.append(f'<details><summary>{label}{icon("plus")}</summary>' + "".join(f'<a href="{h}">{icon(ic)}{t}</a>' for h, t, d, ic in body) + "</details>")
    return f'''<a class="skip" href="#main">Skip to content</a>
<header class="site-header"><div class="wrap nav"><a class="logo" href="index.html" aria-label="Ezydrag home">{B.mark(44, cls="b-mark nav-mark")}</a>
<nav aria-label="Main"><ul class="menu">{"".join(lis)}</ul></nav>
<div class="nav-cta"><a class="btn btn-primary btn-sm" href="demo.html">Book a call</a><button class="burger" aria-label="Menu" aria-expanded="false" aria-controls="drawer">{icon("menu")}</button></div></div></header>
<nav class="drawer" id="drawer" aria-label="Mobile">{"".join(drawer)}<a class="btn btn-primary" href="demo.html">Book a call</a></nav>'''

def crumbs(c):
    if not c: return ""
    items = '<li><a href="index.html">Home</a></li>' + "".join(f'<li><a href="{h}">{t}</a></li>' if h else f'<li aria-current="page">{t}</li>' for t, h in c)
    return f'<nav aria-label="Breadcrumb"><ol class="crumbs">{items}</ol></nav>'

def next_links(page):
    names = [p for p, _ in ORDER]
    if page not in names: return ""
    i = names.index(page); prev = ORDER[i-1] if i > 0 else None; nxt = ORDER[i+1] if i < len(ORDER)-1 else None
    a = f'<a href="{prev[0]}"><small>Previous</small><b>{icon("arrowl")}{prev[1]}</b></a>' if prev else ""
    b = f'<a class="nx" href="{nxt[0]}"><small>Next</small><b>{nxt[1]}{icon("arrow")}</b></a>' if nxt else ""
    return f'<nav class="wrap next-page" aria-label="Page navigation">{a}{b}</nav>'

FOOTER = f'''<footer class="footer"><div class="wrap"><div class="fgrid">
<div class="fbrand"><a href="index.html" class="f-word" aria-label="Ezydrag home">{B.wordmark(52)}</a><p>AI agents for revenue teams. Built and run by Ezydrag.</p><address class="f-addr">{mailchip()}{socials()}</address><div class="f-badges" aria-label="Privacy laws we map">{badges()}</div></div>
<div><h2>Agents</h2><a href="agents.html#nurture">Sales Nurture Agent</a><a href="agents.html#emails">Email Creation</a><a href="agents.html#qa">Email QA</a><a href="agents.html#qbr">QBR Generator</a><a href="agents.html#pta">AI PTA</a><a href="agents.html#voice">Voice Agent</a><a href="agents.html#ask">Ask Ezydrag</a><a href="agents.html#prospect">Prospecting Agent</a><a href="agents.html#govern">Governance Agent</a></div>
<div><h2>Studio</h2><a href="product.html">How we work</a><a href="customers.html">Customers</a><a href="pricing.html">Pricing</a><a href="demo.html">Book a call</a></div>
<div><h2>Under the hood</h2><a href="data-graph.html">Context graph</a><a href="product.html#pipeline">Watch a run</a><a href="token-optimization.html">Token efficiency</a><a href="security.html">Trust</a><a href="compliance.html">Consent and compliance</a></div>
<div><h2>Company</h2><a href="about.html">About us</a><a href="faq.html">FAQ</a><a href="blog.html">Field Notes (blog)</a><a href="report.html">The 2026 Report</a><a href="academy.html">Academy <span class="beta">BETA</span></a><a href="feedback.html">Feedback</a><a href="privacy.html">Privacy notice</a></div>
</div><div class="fbottom"><span>© <span data-year>2026</span> Ezydrag Private Limited</span><span class="fb-links"><a href="privacy.html">Privacy notice</a><a href="#main">Back to top ↑</a></span></div></div></footer>
<button class="to-top" type="button" id="to-top" aria-label="Go to top" hidden><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Top</span></button><button class="biz-launch" id="biz-launch" aria-expanded="false" aria-controls="biz"><span class="bl-av">{B.agent("ask", 38, title="Ask Ezydrag")}</span><span class="bl-t">Ask Ezydrag</span></button>
<section class="biz" id="biz" hidden aria-label="Ask Ezydrag"><header><span class="bl-av">{B.agent("ask", 40, title="Ask Ezydrag")}</span><div><b>Ask Ezydrag</b><small>Answers about Ezydrag only</small></div><button data-biz-close aria-label="Close">{icon("x")}</button></header>
<div class="log" aria-live="polite"><div class="bubble a">Hi. Ask me what we build, or what an agent could do for you.</div></div>
<div class="sugg"><button type="button">What do you build?</button><button type="button">Is our data ready for AI?</button><button type="button">How do you test agents?</button></div>
<form><label class="sr" for="biz-q">Your question</label><input id="biz-q" placeholder="Ask a question" autocomplete="off"><button class="btn btn-primary btn-sm" type="submit" aria-label="Send">{icon("arrow")}</button></form></section>'''

# Curtain raise: first page of a visit only. The mark assembles, an orange line draws, the curtain splits.
# ~1.7s, click or any key skips, never shown with reduced motion. Content is fully rendered underneath.
CURTAIN = (f'''<div class="raise" id="raise" aria-hidden="true"><div class="r-pan r-top"></div><div class="r-pan r-bot"></div>
<div class="r-stage">{B.bot(120, "ezy-bot r-robot")}<span class="r-line"></span><span class="r-tag">AI agents, built and run by us</span></div></div>'''
 + """<script>(function(){var r=document.getElementById('raise');if(!r)return;var ms=1700,seen=false;
try{seen=!!sessionStorage.getItem('ezy-raised');sessionStorage.setItem('ezy-raised','1')}catch(e){}
if(seen||matchMedia('(prefers-reduced-motion: reduce)').matches){r.parentNode.removeChild(r);window.EZY_CURTAIN_MS=0;return}
window.EZY_CURTAIN_MS=ms;var h=document.documentElement;h.classList.add('raising');
var done=function(){h.classList.remove('raising');if(r.parentNode)r.parentNode.removeChild(r)};
setTimeout(done,ms+200);r.addEventListener('click',done);addEventListener('keydown',done,{once:true})})()</script>""")

QUICKDROP = f'''<aside class="qd" id="qd" aria-label="Quick follow-up" hidden>
 <span class="qd-av" aria-hidden="true">{B.agent("nurture", 36)}</span>
 <p class="qd-t"><b>See the agent on your funnel.</b><span> 30 minutes, with the people who build it.</span></p>
 <button class="btn btn-ghost btn-sm qd-em" type="button" data-open-nudge>{icon("mail")}Email me</button>
 <a class="btn btn-primary btn-sm qd-cta" href="demo.html">Book a call</a>
 <button class="qd-x" type="button" data-qd-close aria-label="Hide for this visit">{icon("x")}</button>
 <p class="qd-out" role="status" data-lead-out></p>
</aside>
<section class="nudge" id="nudge" role="dialog" aria-modal="false" aria-labelledby="nudge-h" hidden>
 <button class="qd-x" type="button" data-nudge-close aria-label="Not now">{icon("x")}</button>
 <div class="nudge-h"><span class="qd-av" aria-hidden="true">{B.agent("nurture", 40)}</span><div><b id="nudge-h">Want a quick follow-up?</b><small>We ask once. Just like our agent.</small></div></div>
 <form data-lead="nudge" novalidate><label class="sr" for="nudge-e">Work email</label><input id="nudge-e" name="email" type="email" required autocomplete="email" placeholder="you@company.com">
 <fieldset class="nudge-o"><legend class="sr">What would help?</legend><label><input type="radio" name="want" value="2-minute walkthrough" checked><span>2-minute walkthrough</span></label><label><input type="radio" name="want" value="A call this week"><span>A call this week</span></label></fieldset>
 <button class="btn btn-primary" type="submit">Send</button></form>
 <p class="qd-out" role="status" data-lead-out>No newsletter. Your email is only used to reply.</p>
</section>
<button class="nudge-pill" id="nudge-pill" type="button" hidden>{icon("mail")}Quick follow-up</button>'''

HEAD = '''<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="claude:viewport-fit-sides" content="cover">
<title>{title}</title><meta name="description" content="{desc}"><meta name="robots" content="{robots}"><link rel="canonical" href="{url}"><link rel="alternate" hreflang="en" href="{url}"><link rel="alternate" hreflang="x-default" href="{url}"><link rel="alternate" type="text/markdown" title="Ezydrag for AI assistants" href="llms.txt">
<meta property="og:type" content="{ogtype}"><meta property="og:site_name" content="Ezydrag"><meta property="og:title" content="{title}"><meta property="og:description" content="{desc}"><meta property="og:url" content="{url}"><meta property="og:image" content="{base}/{ogimg}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Ezydrag: AI agents for revenue teams, built and run by us"><meta property="og:locale" content="en_US">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{title}"><meta name="twitter:description" content="{desc}"><meta name="twitter:image" content="{base}/{ogimg}"><meta name="twitter:image:alt" content="Ezydrag: AI agents for revenue teams, built and run by us"><meta name="author" content="Ezydrag"><meta name="format-detection" content="telephone=no">
<meta name="theme-color" content="#ffffff"><link rel="icon" href="assets/brand.svg" type="image/svg+xml"><link rel="icon" href="assets/icon-192.png" type="image/png" sizes="192x192"><link rel="apple-touch-icon" href="assets/apple-touch-icon.png"><link rel="manifest" href="site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,800&family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&family=JetBrains+Mono:wght@400;500;700&display=swap">
<link rel="stylesheet" href="assets/style.css"><script defer src="assets/config.js"></script>{ld}'''

def faq_data():
    import subprocess, json as _j
    js = "global.window={};require(process.argv[1]);process.stdout.write(JSON.stringify(window.EZY_FAQ))"
    return _j.loads(subprocess.run(["node", "-e", js, str((SRC / "assets/faq-data.js").resolve())], capture_output=True, text=True, check=True).stdout)

def faq_full():
    """Static, crawlable FAQ: category index (3 of 12 cols) + grouped answers (9 of 12)."""
    data = faq_data(); cats = list(dict.fromkeys(d["c"] for d in data))
    slug = lambda c: "faq-" + re.sub(r"[^a-z0-9]+", "-", c.lower()).strip("-")
    idx = "".join(f'<li><a href="#{slug(c)}" data-faq-jump>{html.escape(c)}<span class="tnum">{sum(d["c"]==c for d in data)}</span></a></li>' for c in cats)
    secs = []
    for c in cats:
        items = []
        for d in (x for x in data if x["c"] == c):
            src = f'<p class="src">Source: <a href="{html.escape(d["s"][1])}" target="_blank" rel="noopener">{html.escape(d["s"][0])}</a></p>' if d.get("s") else ""
            items.append(f'<details data-k="{html.escape((d["q"]+" "+d["a"]+" "+d.get("k","")).lower())}"><summary>{d["q"]}</summary><div class="ans"><p>{d["a"]}</p>{src}</div></details>')
        secs.append(f'<section class="fq-sec" id="{slug(c)}" aria-labelledby="{slug(c)}-h"><h2 class="fq-h" id="{slug(c)}-h">{html.escape(c)}</h2><div class="acc">{"".join(items)}</div></section>')
    return (f'<div class="fq"><nav class="fq-nav" aria-label="FAQ topics"><p class="eyebrow">Topics</p><ul role="list">{idx}</ul>'
            f'<a class="btn btn-ghost btn-sm" href="demo.html">Talk to a person</a></nav><div class="fq-body">{"".join(secs)}'
            f'<div class="state" data-faq-empty hidden><h3>No answers match that.</h3><p class="muted">Try another word, or ask the bot below.</p></div></div></div>')

def faq_items():
    txt = (SRC / "assets/faq-data.js").read_text()
    un = lambda x: x.replace('\\"', '"')
    return [dict(q=un(q), a=un(a)) for q, a in re.findall(r'q:"((?:[^"\\]|\\.)*)",k:"[^"]*",a:"((?:[^"\\]|\\.)*)"', txt)]

def polish(h):
    h = re.sub(r'(<a class="btn[^"]*"[^>]*>)Book a call(</a>)', lambda m: m.group(1) + icon("phone") + "Book a call" + m.group(2), h)
    h = re.sub(r'(<span class="n">(?:<svg.*?</svg>\s*)?)([0-9]{2} · )?([A-Z][A-Z ]+)(</span>)', lambda m: m.group(1) + (m.group(2) or "") + m.group(3).capitalize() + m.group(4), h)
    return h

def label_sections(h):
    """Give each <section> an accessible name from its first h1-h3 (adds a heading id where needed)."""
    used = set(re.findall(r'\sid="([^"]+)"', h)); edits = []
    for m in re.finditer(r'<section\b([^>]*)>', h):
        if "aria-label" in m.group(1): continue
        nxt = re.search(r'<section\b|</section>', h[m.end():]); end = m.end() + (nxt.start() if nxt else len(h) - m.end())
        hm = re.search(r'<(h[1-3])\b([^>]*)>(.*?)</\1>', h[m.end():end], re.S)
        if not hm: continue
        idm = re.search(r'\sid="([^"]+)"', hm.group(2))
        if idm: hid = idm.group(1)
        else:
            base = "h-" + (re.sub(r"[^a-z0-9]+", "-", re.sub(r"<[^>]+>", "", hm.group(3)).lower()).strip("-")[:40] or "s"); hid = base; k = 2
            while hid in used: hid = f"{base}-{k}"; k += 1
            used.add(hid); edits.append((m.end() + hm.start() + 1 + len(hm.group(1)), f' id="{hid}"'))
        edits.append((m.end() - 1, f' aria-labelledby="{hid}"'))
    for pos, txt in sorted(edits, reverse=True): h = h[:pos] + txt + h[pos:]
    return h

def write_llms():
    """llms.txt (llmstxt.org): a short, factual, link-rich summary for AI assistants; llms-full.txt adds every approved answer."""
    data = faq_data()
    pages = [(p, SEO[p][0].split(" | ")[0], SEO[p][1]) for p in SEO if p.endswith(".html") and p not in ("404.html",) and not p.startswith("blog-")]
    posts = [(p, SEO[p][0].split(" | ")[0], SEO[p][1]) for p in SEO if p.startswith("blog-")]
    head = (f"# Ezydrag\n\n> Ezydrag is an AI agent studio in India. We design, build and run AI agents for revenue teams (sales, marketing and RevOps), "
            f"inside the tools they already use: CRM (Salesforce, HubSpot, Attio), marketing automation (Marketo, HubSpot), data (Snowflake, BigQuery, Databricks), "
            f"workflows (n8n, MCP servers, APIs) and Slack, Microsoft 365 or Google Workspace. A person on the client's team approves every important step.\n\n"
            f"Key facts:\n- Model: a service, not software. We build, run and improve the agents.\n- Flagship: Sales Nurture Agent (capture, enrich, score, nurture, meeting, won).\n"
            f"- Portfolio: Email Creation Agent, Email QA Agent, QBR Generator, AI PTA, Voice Agent (with Nutaan AI), Ask Ezydrag, Prospecting Agent, Governance Agent.\n"
            f"- Built to order: Speed-to-Lead, Churn and Upsell, Deal Follow-up, CRM Cleanup, Forecasting, Deal Desk, Attribution agents.\n"
            f"- Agents never negotiate prices and never send important messages without approval.\n- Legal name: Ezydrag Private Limited. Offices: Kolkata, Bangalore, Durgapur. Contact: {EMAIL}\n\n")
    sec = lambda t, rows: f"## {t}\n\n" + "".join(f"- [{n}]({SITE_URL}/{p}): {d}\n" for p, n, d in rows) + "\n"
    txt = head + sec("Pages", pages) + sec("Field Notes (blog)", posts) + f"## Optional\n\n- [All approved answers]({SITE_URL}/llms-full.txt): {len(data)} questions and answers, with sources\n"
    (DIST / "llms.txt").write_text(txt)
    full = head + "## Approved answers\n\n" + "".join(f"### {d['q']}\n\n{re.sub('<[^>]+>', '', d['a'])}\n" + (f"\nSource: {d['s'][0]} ({d['s'][1]})\n" if d.get('s') else "") + "\n" for d in data)
    (DIST / "llms-full.txt").write_text(full)

def jsonld(page, meta):
    url = SITE_URL + "/" + ("" if page == "index.html" else page)
    org = {"@type": "Organization", "@id": SITE_URL + "/#org", "name": SITE_NAME, "legalName": "Ezydrag Private Limited", "url": SITE_URL + "/", "logo": SITE_URL + "/assets/icon-512.png",
           "email": EMAIL, "sameAs": [v if k == "linkedin" else "https://wa.me/" + v for k, v in SOCIAL.items() if v],
           "contactPoint": [{"@type": "ContactPoint", "contactType": "sales", "email": EMAIL, "availableLanguage": ["en", "hi"]}],
           "knowsAbout": ["AI agents", "Revenue operations", "Sales automation", "Marketing automation", "Lead nurturing", "Email QA", "Model Context Protocol", "n8n"], "address": [{"@type": "PostalAddress", "addressLocality": c, "addressCountry": "IN"} for c in ("Kolkata", "Bangalore", "Durgapur")]}
    g = [org]
    if page == "index.html":
        g.append({"@type": "WebSite", "@id": SITE_URL + "/#site", "url": SITE_URL + "/", "name": SITE_NAME, "publisher": {"@id": SITE_URL + "/#org"}})
    else:
        crumbs = [{"@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL + "/"},
                  {"@type": "ListItem", "position": 2, "name": SEO[page][0].split(" | ")[0], "item": url}]
        g.append({"@type": "BreadcrumbList", "itemListElement": crumbs})
    if page in ("index.html", "agents.html", "product.html"):
        g.append({"@type": "Service", "@id": SITE_URL + "/#sales-nurture-agent", "name": "AI agents built and run by Ezydrag", "serviceType": "AI agent development and operations",
                  "provider": {"@id": SITE_URL + "/#org"}, "areaServed": "Worldwide", "url": SITE_URL + "/agents.html",
                  "description": "Ezydrag designs, builds and runs AI agents for revenue teams: Sales Nurture, Email Creation, Email QA, QBR Generator, AI PTA, Voice and support agents. A person approves every key step.",
                  "hasOfferCatalog": {"@type": "OfferCatalog", "name": "Ezydrag agents", "itemListElement": [{"@type": "Offer", "itemOffered": {"@type": "Service", "name": n, "description": d}} for _, n, d, *_ in PORTFOLIO]}})
    bl = BLOG.jsonld(page, SITE_URL)
    if bl: g.append(bl)
    if page == "faq.html":
        g.append({"@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": f["q"], "acceptedAnswer": {"@type": "Answer", "text": f["a"]}} for f in faq_items()]})
    if page == "report.html":
        g.append({"@type": "Article", "headline": "The Ezydrag Report 2026: agents in RevOps", "datePublished": "2026-11-06", "author": {"@id": SITE_URL + "/#org"}, "publisher": {"@id": SITE_URL + "/#org"}, "image": SITE_URL + "/assets/og.png", "mainEntityOfPage": url})
    return '<script type="application/ld+json">' + json.dumps({"@context": "https://schema.org", "@graph": g}, ensure_ascii=False) + "</script>"

def render(path):
    raw = path.read_text()
    m = re.match(r"\s*<!--(\{.*?\})-->", raw, re.S)
    meta = json.loads(m.group(1)); body = raw[m.end():]
    page = path.name
    macros = {"{{BADGES}}": badges, "{{TEAM}}": team, "{{TEAM4}}": lambda: team(4), "{{QUOTES}}": quotes, "{{WORLDMAP}}": worldmap,
              "{{LIVE}}": live, "{{JOURNEY}}": ART.journey, "{{PORTFOLIO}}": portfolio, "{{AGENTTABS}}": agent_tabs, "{{TRENDS}}": trends, "{{STACK}}": stack, "{{REVOPS}}": revops, "{{REVOPSLIST}}": lambda: revops(True), "{{REVOPSSTATS}}": revops_stats, "{{TRENDSFULL}}": lambda: trends(True), "{{CHARGE}}": charge, "{{BLOGLATEST}}": BLOG.latest, "{{TOORDER}}": to_order, "{{TOORDER3}}": lambda: to_order(3), "{{MAIL}}": lambda: mailchip(True), "{{FAQFULL}}": faq_full, "{{CLIENTS}}": clients, "{{CLIENTCELLS}}": lambda: clients().split('role="list">')[1].split("</ul>")[0], "{{NEWSLETTER}}": newsletter, "{{HANDOFF}}": handoff, "{{FLOW}}": ART.flow, "{{NEXT}}": lambda: next_links(page), "{{CRUMBS}}": lambda: crumbs(meta.get("crumbs"))}
    for k, fn in macros.items():
        if k in body: body = body.replace(k, fn())
    for k in ("gdpr","hipaa","dpdp"): body = body.replace("BADGE_"+k.upper(), f'<span style="width:52px;height:52px;display:block;flex:none">{BADGE_SVG[k]}</span>')
    body = body.replace('<section class="hero-band">','<section class="hero-band grain">').replace('<div class="cta rv">','<div class="cta grain rv">')
    if "{{BP:" in body:
        bp = brand_page(); body = re.sub(r"\{\{BP:(\w+)\}\}", lambda mm: bp[mm.group(1)], body)
    body = re.sub(r"\{\{ART:(\w+)\}\}", lambda mm: ART.art(mm.group(1)), body)
    body = re.sub(r"\{\{AV:(\w+)\}\}", lambda mm: B.agent(mm.group(1), 64), body)
    body = re.sub(r"\{\{i:(\w+)\}\}", lambda mm: icon(mm.group(1)), body)
    title, desc, _ = SEO.get(page, (meta["title"], meta["desc"], None))
    url = SITE_URL + "/" + ("" if page == "index.html" else page)
    head = HEAD.format(title=title, desc=desc, url=url, base=SITE_URL, ogtype="article" if page == "report.html" or page.startswith("blog-") else "website", ogimg=(f"assets/blog/{page[5:-5]}.png" if page.startswith("blog-") else "assets/og.png"),
                       robots="noindex,follow" if page == "404.html" else "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1", ld=jsonld(page, meta))
    dlg = DIALOG if 'class="member"' in body else ""
    nxt = "" if "{{NONEXT}}" in raw or page in ("404.html",) else next_links(page)
    body = body.replace("{{NONEXT}}", "")
    loader = B.loader(56, label='Loading', icons=ICONS)
    inner = f'{SPRITE}{CURTAIN}{header(meta.get("nav",""), page)}<main id="main" tabindex="-1">{body}</main>{nxt}{FOOTER}{'' if page in ('demo.html','404.html') else QUICKDROP}{dlg}<script defer src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script><script defer src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script><template id="tpl-loader">{loader}</template><script defer src="assets/faq-data.js"></script><script defer src="assets/scenarios.js"></script><script defer src="assets/app.js"></script><script defer src="assets/motion.js"></script><script defer src="assets/sim.js"></script><script defer src="assets/story.js"></script>'
    return f'<!doctype html><html lang="en"><head>{head}</head><body data-page="{page[:-5]}">{inner}</body></html>', f'{head}{inner}'

def main():
    BLOG.write_pages(SRC / "pages")
    if DIST.exists(): shutil.rmtree(DIST)
    shutil.copytree(SRC / "assets", DIST / "assets", ignore=shutil.ignore_patterns("*.svgfrag", "*.png") )
    (DIST / "assets/agents").mkdir(parents=True, exist_ok=True)
    B.export_files(DIST / "assets/brand", ICONS)
    for f in ("brand.svg", "ezydrag-nav.svg"):
        (DIST / "assets" / f).write_text(B.mark(64, title="Ezydrag").replace('class="', 'data-c="'))
    for keep in ("ezydrag-full.png", "og.png", "icon-192.png", "icon-512.png", "apple-touch-icon.png"):
        shutil.copy(SRC / "assets" / keep, DIST / "assets" / keep)
    for png in (SRC / "assets/clients").glob("*.png"):
        shutil.copy(png, DIST / "assets/clients" / png.name)
    # retired routes: keep old links working, send them to where the content lives now
    for old, new in {"trends.html": "agents.html#to-order", "brand.html": "index.html"}.items():
        (DIST / old).write_text(f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><link rel="canonical" href="{SITE_URL}/{new.split("#")[0]}">'
                                f'<meta http-equiv="refresh" content="0; url={new}"><title>Moved</title></head><body><a href="{new}">This page moved.</a></body></html>')
    (DIST / "assets/blog").mkdir(parents=True, exist_ok=True)
    for png in (SRC / "assets/blog").glob("*.png"):  # Field Notes thumbnails (tools/thumbs.py)
        shutil.copy(png, DIST / "assets/blog" / png.name)
    preview = ROOT / "preview"; preview.mkdir(exist_ok=True)
    urls = "".join(f"<url><loc>{SITE_URL}/{'' if n == 'index.html' else n}</loc><lastmod>2026-11-06</lastmod><priority>{pr}</priority></url>" for n, (_, _, pr) in SEO.items() if pr)
    (DIST / "sitemap.xml").write_text(f'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{urls}</urlset>')
    bots = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "Bingbot", "Googlebot"]
    (DIST / "robots.txt").write_text("# Search engines and AI assistants are welcome. A plain summary for LLMs is at /llms.txt\n"
        + "".join(f"User-agent: {b}\nAllow: /\n\n" for b in bots) + "User-agent: *\nAllow: /\nDisallow: /404.html\n\n" + f"Sitemap: {SITE_URL}/sitemap.xml\n")
    write_llms()
    (DIST / "site.webmanifest").write_text(json.dumps({"name": "Ezydrag", "short_name": "Ezydrag", "start_url": "/", "display": "standalone", "background_color": "#ffffff", "theme_color": "#ffffff",
        "icons": [{"src": "assets/icon-192.png", "sizes": "192x192", "type": "image/png"}, {"src": "assets/icon-512.png", "sizes": "512x512", "type": "image/png"}]}))
    for p in sorted((SRC / "pages").glob("*.html")):
        full, frag = render(p); full, frag = polish(label_sections(full)), polish(label_sections(frag))
        (DIST / p.name).write_text(full)
        if p.name == "index.html": (preview / "index.html").write_text(frag)
        print("built", p.name, len(full))
    import kb as _kb; _kb.main()  # knowledge base for the Ask Ezydrag LLM (server/kb.json)

if __name__ == "__main__":
    main()
    import importlib.util as _u
    _s = _u.spec_from_file_location("optimize", ROOT / "tools/optimize.py"); _m = _u.module_from_spec(_s); _s.loader.exec_module(_m); _m.run()
