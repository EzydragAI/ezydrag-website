# Ezydrag website (2026 revamp, v2)

Static multi-page site. No framework, no npm needed to run it.

## Run
    node server/server.mjs
Open http://localhost:8000. (Plain static serving still works: `python -m http.server 8000 --directory dist`, but Ask Ezydrag then has no LLM.)

## Ask Ezydrag (LLM chatbot)
- Copy `.env.example` to `.env`, paste your `ANTHROPIC_API_KEY`, restart the server. The key stays on the server, never in the browser.
- Order of answering: small talk and confident approved answers (0 tokens) → otherwise `/api/ask` retrieves the 4 best passages from `server/kb.json` (built from this site by `kb.py`) and asks a small model (Haiku, 160 max output tokens, ~800 tokens in) → anything not about Ezydrag is refused before any model call.
- No web search or tools are enabled. Caps: 15 questions per IP per 10 min, 500 model calls per day (`ASK_IP_LIMIT`, `ASK_DAILY_CAP`).
- After editing site copy, rebuild so `server/kb.json` refreshes (`python build.py`, or `python kb.py` alone). On Netlify the same logic runs as a Function (`netlify/functions/ask.mjs`, shared code in `server/ask-core.mjs`, routed from `/api/ask` in `netlify.toml`). Add `ANTHROPIC_API_KEY` under Netlify > Site configuration > Environment variables, then redeploy. Without it the chat quietly falls back to approved answers. Rate limits and the daily cap are per function instance on Netlify, so treat them as soft; set a spend limit in the Anthropic console as the hard ceiling.
- `build.py` needs Python 3.12+.

## Edit
- `src/pages/*.html` — page content. First line is a JSON comment with title, description and active nav.
- `src/assets/style.css` — design tokens (top of file) and all styles. Brand ink #2B2E3C, orange #FF9054.
- `src/assets/app.js` — all interactive modules (mega-menu, pipeline, data graph, token calculator, FAQ bot, LMS demo, etc.).
- `src/assets/faq-data.js` — approved Q&A for the FAQ page, the FAQ bot demo and Ask Ezydrag.
- `src/assets/scenarios.js` — the 15 live-pipeline scenarios (add more in the same format).
- `art.py` — logo-primitive illustrations (tile, orange plate, e, dot). `{{ART:name}}` and `{{FLOW}}` macros.
- `src/assets/motion.js` — GSAP (cdnjs) linear motion: headline → CTA → flow → cards. Falls back to static if GSAP is blocked or reduced motion is on.
- `src/assets/sim.js` — Ezydrag Academy app simulations.
- `build.py` — header, mega-menu, footer, team, testimonials, compliance badges and map. Edit TEAM / QUOTES / NAV here.

Then rebuild:  `python build.py`  → writes `dist/`. Deploy the contents of `dist/`.

## Routes
index · product (how it works + live pipeline) · data-graph · token-optimization (#faq-bot, #optimization-agents)
agents (#qbr #nurture #qa #revops #operational) · academy (Ezydrag Academy, beta) · 404 · portfolio (#reviews) · industries (#geography + vertical tabs)
compliance (#gdpr #hipaa #dpdp #gap-analysis #readiness #protect) · about (#team) · feedback · faq · contact

## Before going live
- Confirm hello@ezydrag.com.
- Figures marked "sample" / "illustrative" (pipeline record, graph answers, token calculator %, optimization audit) are demo data.
- Compliance copy says "gap analysis / HIPAA-aware", not "certified". Have a data protection lawyer review.
- Add real result numbers to portfolio cases when available.

## Accessibility
Run `python tools/axe.py index.html,...` (needs `npm i` in tools/ and Playwright). All pages pass axe WCAG 2.2 AA with 0 violations.
Set your host's 404 page to `404.html`.

## v4 (wedge rework)
See EZYDRAG_SITE_SPEC.md for positioning, sitemap, second-by-second home script and open decisions.
New pages: customers, security, pricing, demo. Retired: industries, portfolio, contact (→ demo), context (→ product).
Set the booking link in src/assets/config.js.
