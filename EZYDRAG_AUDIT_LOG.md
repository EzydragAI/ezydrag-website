# Ezydrag Website — Audit and Change Log

Companion to `EZYDRAG_SITE_SPEC.md`. This file records every audit finding and every change, in order, so reviewers can see what changed and why.

- **Build:** v5 (handcraft and transparency pass)
- **Date:** 6 Nov 2026
- **Status:** review build (`reviewMode: true`; see §9)

---

## 0. Summary

| Area | Before (v4) | After (v5) |
|---|---|---|
| SEO lint issues (16 pages) | 82 | 2 (short titles on 404 and Book a demo, both intentional) |
| Accessibility (axe WCAG 2.2 AA) | 0 violations | 0 violations, 16 pages including the new Report |
| Sitemap, robots, manifest, share image | missing | all present |
| Structured data | none | Organization, WebSite, BreadcrumbList, FAQPage, Article |
| Top nav | 7 items, Academy listed twice | 8 items, every destination listed once |
| Team portraits | rendered on black (a transparency bug) | warm duotone on cream, film grain, logo-tile frame, alphabetical |
| Transparency | controls only | agent principles, limits, data use, plain-language promises, dated footnotes |
| Lead capture | demo form only | plus the Field Notes newsletter and an ungated 2026 Report |
| Curtain | 1.8s logo fade | 3.1s brand moment plus a matching page-to-page wipe |

---

## 1. Benchmark: 10 Silicon Valley product sites

Fetched 6 Nov 2026: Linear, OpenAI, Anthropic, SentinelOne, Vercel, Stripe, Ramp, Figma, Notion, Glean. Sources are in §11.

### Patterns adopted

| Pattern seen | Who does it | What we did |
|---|---|---|
| Plain first-person commitments | OpenAI ("We do not train on your business data") | "Our promises" block on home; "What our agents can't do" on the Trust center |
| Saying what you're not | Stripe ("Stripe is not a bank") | Statement band: "Ezydrag doesn't replace Marketo or Salesforce." |
| Live agent states | Linear, Ramp, Glean | Hero live feed, plus a "◆ HUMAN waiting for approval" step in the terminal |
| Control language paired with every agent claim | Glean, Notion, Vercel | Trust line under the CTA; new "Agents and people" handoff section |
| Dated numbers with footnotes | Figma, Stripe | "As of November 2026" footnotes on proof counters |
| A dedicated trust surface | Vercel, Linear, Anthropic | Security page became the **Trust center** |
| Flagship report, not gated | SentinelOne, Glean | **The 2026 Report**, free to read |
| Inline email capture, no pop-up | Ramp, Stripe | **Field Notes** inline form on home and the report |
| Few people photos on the home page | Linear, Ramp, Anthropic | Team photos moved to About; home shows a small face stack only |

### Copy voice rules (from Anthropic, OpenAI, Linear)

1. Name the risk before the benefit.
2. Write commitments as "We + verb + scope." No hedging.
3. Use short declarative sentences, with one human aside per section.
4. Speak to the reader plainly. No "unlock", "revolutionise" or "seamless".
5. Point to evidence (sources, logs, dates) instead of adjectives.

---

## 2. SEO audit

### Findings (v4)

- No canonical URLs, Open Graph or Twitter cards on any page.
- Titles too short on 13 of 15 pages (7–28 characters; target 30–60).
- Meta descriptions outside 110–160 characters on 9 pages.
- No `sitemap.xml`, `robots.txt`, web manifest, PNG icons or share image.
- No structured data.
- 404 page was indexable.

### Changes

- Central SEO registry in `build.py` (`SEO = {...}`): one title, description and sitemap priority per page.
- Every page now has a canonical URL, Open Graph (1200×630 `og.png`), Twitter large card, `robots` meta and a web manifest.
- JSON-LD:
  - Organization (three Indian offices, email) on all pages
  - WebSite on home
  - BreadcrumbList on inner pages
  - FAQPage on `faq.html`, generated from `faq-data.js`
  - Article on `report.html`
- `sitemap.xml` (15 URLs, 404 excluded) and `robots.txt` generated on every build.
- 404 page set to `noindex,follow`.
- Share image and icons rendered from the logo parts (`tools/og.py`).

### Still to do (needs you)

- [ ] Confirm the production domain. Currently `SITE_URL = "https://ezydrag.com"`.
- [ ] Submit the sitemap in Google Search Console and Bing Webmaster Tools.
- [ ] Choose analytics. Recommendation: a cookieless tool (Plausible or Fathom), which keeps the "no tracking pixels" promise true. Not added yet.
- [ ] Keyword plan for the next three articles. Candidates: "Marketo email QA checklist", "Salesforce list hygiene", "DPDP compliance for marketing teams".

---

## 3. Marketing audit

| Finding | Risk | Change |
|---|---|---|
| Only one conversion path (demo) | Visitors not ready to book leave with nothing | Added the ungated Report and the Field Notes newsletter |
| Proof counters had no date | Read as marketing numbers | Added dated footnotes and a "metrics pending client sign-off" note |
| Pricing gave no scope | Feels evasive | Pricing now lists what a pilot includes and doesn't |
| Trust content was a feature list | Doesn't answer "what can go wrong?" | Trust center adds principles, limits, data use and how to report a problem |
| No people-and-agents story | "AI replaces us" anxiety | Handoff section: what the agent does, what a person decides, for 6 tasks |
| Terminal showed only machine work | Felt fully autonomous | Each run names the agent, its read/write scope and a human approval gate |
| Home page repeated team, pricing and security strips | Long scroll, diluted story | Home now flows: story → proof → promises → report → newsletter → CTA |

### Newsletter: Field Notes

- **Promise:** "One honest email a month. No hype, no tracking pixels, unsubscribe in one click."
- **Consent line:** "We only use your email to send Field Notes. Never sold, never shared."
- **Wiring:** set `newsletterUrl` in `src/assets/config.js` to a form endpoint (Buttondown, ConvertKit or HubSpot). Until then, submit opens an email draft. No silent failure.
- **Placement:** home page, end of the Report, footer link. No pop-ups.

### The 2026 Report

- `report.html`, Edition 01: six chapters, about 9 minutes.
- Reading layout: sticky contents, progress bar, pull quote, "How we wrote this" method note.
- **Honesty rule:** no survey data and no third-party statistics. It is written from delivery work; dates and rules are public facts. Measured results come in later editions once clients approve.

---

## 4. Information architecture

### Top nav

| v4 | v5 | Why |
|---|---|---|
| Product ▾ (feature slot: Academy) | Product ▾ (feature slot: **2026 Report**) | Academy appeared twice |
| Agents ▾ | Agents ▾ | unchanged |
| Customers | Customers | unchanged |
| Security | **Pricing** | Pricing moved before Trust to match buyer order; benchmark sites put it in the nav |
| Pricing | **Trust** (Trust center) | "Trust" covers security, AI principles and data use |
| Company ▾ (About, Academy, Feedback, Compliance) | **Resources ▾** (Report, Academy, Field Notes, Compliance guide) | Groups content by intent |
| FAQ | **Company** (direct link to About) | Feedback is now a section on About, so no dropdown is needed |
| — | **FAQ** | Kept top-level, as you asked earlier |

**Judgment call:** 8 items is two more than Linear. If you'd rather have 7, move FAQ into Resources.

### Repetitions removed

| Repeated item | Where it was | Decision |
|---|---|---|
| Academy link | Product feature and Company menu | Kept in Resources only |
| Client reviews | About and Customers | Kept on Customers; removed from About |
| Team photos | Home and About | About only; home shows a small face stack linking to the team |
| Pricing and security strips | Home | Replaced by the "Our promises" block, plus pricing link in the final CTA |
| Feedback | Separate menu item | Section on About, plus link to the full page |

### Repetitions kept, on purpose

- **Live terminal on home and Product:** home uses it as the proof moment; Product is where the nav link points.
- **Customer logo strip on home and Customers:** a standard trust cue on both.

---

## 5. Storytelling and motion

### Home page order (each scroll answers the next question)

1. **What is it?** Hero headline, then CTA, then trust line, then the flow diagram, then the live feed.
2. **Who's it from?** Logo strip.
3. **What it's not:** statement band.
4. **How does it work?** Pinned 7-beat campaign story.
5. **Who's in charge?** Agents and people handoff.
6. **Does it work?** RightWave proof, with dates.
7. **Show me:** live terminal with human approval gates.
8. **Can I trust you?** Plain promises.
9. **Not ready yet?** The 2026 Report and Field Notes.
10. **Ready:** "See it on your stack."

### Motion added

- **Curtain (3.1s):**
  - Orange plate slides in, white face appears, "e" appears, dot pops.
  - Three status lines: "Connecting Marketo", "Building the context graph", "Waking the agents".
  - A 0→100% counter runs underneath; ink and orange panels then lift away.
- **Page-to-page wipe (0.4s):** orange and ink panels cover the page on exit and lift on arrival. Same pattern on every page.
- **Handoff:** an orange dot travels from the agent column to the person column as each row enters view.
- **Terminal:** "◆ HUMAN waiting for approval · Campaign manager", then "approved · logged to audit trail".

All motion is linear (GSAP `ease:"none"`) and is skipped when the visitor turns off animations. View Transitions were removed so they don't double up with the wipe.

---

## 6. Art direction

- **Portraits:**
  - **Bug fixed:** the uploads are transparent cutouts, and the previous conversion filled the transparency with black.
  - Each portrait is now on a cream ground with a soft orange glow, in a three-tone ink → warm → cream duotone, with film grain baked in.
  - Each is framed like the logo tile: ink border plus an offset orange plate that grows on hover.
- **Agents:** the same frame, with a white plate instead of orange to tell them apart.
- **Grain:** a subtle film-grain texture on heroes, CTAs, the curtain and the newsletter, at low opacity so text contrast isn't affected.
- **Team order:** alphabetical by first name (Anirban, Eshwar, Piyush, Santanu, Shuvam, Supravo, Swarnava), then agents (Ask Ezydrag, Nurture, QA, QBR).

---

## 7. Interaction and friction review

| Issue | Fix |
|---|---|
| "Ask Ezydrag" pill covered content on phones | Collapses to an icon button under 640px; label stays for screen readers |
| Booking button hidden when no link is set | Kept hidden; the brief builder is the fallback (set `bookingUrl`) |
| Newsletter with no backend | Opens an email draft and says so; never fakes success |
| Curtain could block scroll | `overflow:hidden` only while it plays; removed after 3.3s even if a script fails |
| Wipe on hash links or new-tab clicks | Skipped for same-page anchors, external links, modifier keys and `target` |

---

## 8. Typography and semantics

- **Type:** golden-ratio scale kept. Paragraphs use `text-wrap:pretty`; headings use `balance`. The report uses a 66-character measure with 1.75 line height.
- **Semantics:**
  - Team lists are `<ul>` with headed groups (People 7, AI agents 4).
  - The report uses `<article>`, `<nav aria-label="Contents">`, `<time datetime>` and `<blockquote>`.
  - The newsletter is a labelled `<section>`; form results use `role="status"`.
- **Story contrast:** inactive story beats use a muted colour instead of opacity, which keeps them at AA contrast.

---

## 9. Review mode (turn off before launch)

`src/assets/config.js` → `reviewMode: true` does two things:

- Shows the curtain on **every** page load, not once per visit.
- Shows section loaders on purpose for 0.9s: live pipeline, campaign story, context graph, Academy simulation.

Set `reviewMode: false` for launch. Add `?review=1` to any URL to force the curtain once.

---

## 10. Needs confirmation (copy written as plain promises)

Please confirm or edit each of these. They are stated as commitments on the site.

- [ ] "We never send without your approval." (from your materials: human approval before every send and sync)
- [ ] "We only read the systems you connect."
- [ ] "We show the source behind every answer."
- [ ] "We tell you what an agent can't do."
- [ ] "We delete your data when you ask." (from your materials: deletion on request or at project end)
- [ ] "We price every pilot before it starts."
- [ ] Trust center: "Low-confidence results go to a review queue."
- [ ] Trust center: "We name the model providers for your project during scoping."
- [ ] Field Notes: "no tracking pixels" (true only if the email tool has open-tracking switched off)
- [ ] Report chapter 2 says our early agents had poor results; confirm you're comfortable publishing that.

---

## 11. Sources (benchmark)

https://linear.app · https://linear.app/security · https://www.anthropic.com · https://www.anthropic.com/company · https://openai.com · https://openai.com/enterprise-privacy/ · https://www.sentinelone.com · https://vercel.com · https://stripe.com · https://ramp.com · https://ramp.com/security · https://www.figma.com · https://www.notion.com · https://www.glean.com

---

## 12. Change log

| # | Change | Files |
|---|---|---|
| 1 | SEO registry, meta, Open Graph and Twitter tags, JSON-LD, sitemap, robots, manifest | `build.py` |
| 2 | Share image and PNG icons from logo parts | `tools/og.py`, `src/assets/og.png`, `icon-*.png` |
| 3 | Curtain v2 and page wipe; review mode | `build.py`, `style.css`, `app.js`, `config.js` |
| 4 | Nav restructure; Trust and Resources; footer links | `build.py` |
| 5 | Home story rework: statement, handoff, promises, report teaser, newsletter | `pages/index.html`, `build.py` |
| 6 | New page: The 2026 Report | `pages/report.html` |
| 7 | Trust center: principles, limits, data use, security FAQ | `pages/security.html` |
| 8 | About: team note, alphabetical team, how we listen; reviews removed | `pages/about.html` |
| 9 | Pricing: included / not included | `pages/pricing.html` |
| 10 | Dated proof footnotes | `pages/index.html`, `pages/customers.html` |
| 11 | Terminal: agent identity line and human approval gates (11 scenarios) | `app.js`, `scenarios.js` |
| 12 | Portrait fix: transparency → duotone and grain on cream; logo-tile frames | `src/assets/team/*.jpg`, `style.css` |
| 13 | Field Notes newsletter component | `build.py`, `app.js`, `style.css` |
| 14 | Compact Ask Ezydrag button on phones | `build.py`, `style.css` |
| 15 | Static SEO lint tool | `tools/seo_audit.py` |

---

## 13. v6: Brand system pass (8 Nov 2026)

**Source of truth:** Figma "Adaptive logo studio". Read once on 8 Nov: two masters (wide wordmark, square compact mark), clear-space rules, minimum sizes to 16px, application templates. Further Figma reads and writes are blocked by the Starter-plan MCP limit, so the expanded system was rebuilt in code (`brand.py`) from the matching master artwork in the codebase.

| # | Change | Files |
|---|---|---|
| 16 | `brand.py`: one geometry for the compact mark, wordmark, reverse, mono, favicon cut, 7 agent avatars and the loader; outlined Inter "e" and wordmark; corner radius F/4 | `brand.py`, `src/assets/brand/*.svg` (exported on build) |
| 17 | Every surface uses the master: nav, curtain, hero diagram, loaders, footer, favicon, app icons, share image | `build.py`, `art.py`, `tools/og.py` |
| 18 | Agents redesigned to look like agents (visor, eyes, antenna, role badge); used in hero, team, handoff rows, live feed, Ask Ezydrag | `brand.py`, `build.py`, `story.js` |
| 19 | Illustration kit aligned to the master proportions; hero flow has desktop and phone layouts | `art.py`, `style.css` |
| 20 | Micro-interactions: nav logo hover cycles agent icons; agents blink, pulse and scan; client cards flip | `style.css` |
| 21 | One loader everywhere (template rendered from `brand.py`) | `build.py`, `app.js`, `sim.js` |
| 22 | Wayfinding: chapter rail plus a "Next" pill on the home page, pointing to the next stop at every section | `app.js`, `pages/index.html`, `style.css` |
| 23 | Client wall: interactive, drops in real logo files from `assets/clients/` | `build.py`, `src/assets/clients/README.txt` |
| 24 | New page: Brand playbook (`brand.html`), plus `BRAND_PLAYBOOK.md` | `pages/brand.html` |
| 25 | Copy: brand line "We do the work underneath. You make the call."; curtain lines tell the plate / face / dot story | `pages/index.html`, `build.py` |
| 26 | Bug fix: the CSS transform-origin on animated logo parts moved the "e" glyph off the face | `style.css` |

**Still needed from you**
- [ ] Real client logo files and written permission (RightWave, Cerkle, Eternup, Nutaan AI).
- [ ] Check the clear-space and minimum-size values against Figma; the code uses F/8 clear space and a 28px minimum, with a 16–24px favicon cut.
- [ ] To push the expanded system back into Figma, raise the Figma MCP limit (upgrade from Starter), or import `assets/brand/*.svg` by hand.

---

## 14. v7: Calmer brand motion, lab positioning, human trust (8 Nov 2026)

| # | Change | Files |
|---|---|---|
| 27 | Nav logo hover: only the "e" nudges left and right. Plate, icon cycle and dot motion removed. | `style.css`, `build.py` |
| 28 | Loader rebuilt as the original logo assembling itself (plate slides out, "e" nudges, dot lands). No icon swapping. Used in the curtain, section loaders, Academy and the page transition. | `brand.py`, `style.css` |
| 29 | Page transition: orange plate panel, then a white face panel carrying the loader | `build.py`, `style.css`, `app.js` |
| 30 | Positioning: an AI lab that designs, builds, runs and improves agents. Nav "Product" → "How we work", "Pricing" → "Engagements", "Book a demo" → "Book a call" everywhere | all pages, `build.py` |
| 31 | How we work page: Discover → Build → Run → Improve loop | `pages/product.html` |
| 32 | Engagements: Pilot · Build and run · Lab partnership | `pages/pricing.html` |
| 33 | Trust, rewritten around people: "You stay in charge." Three scenes (You say yes, You see everything, You can take it back) plus "real people answer" with team faces. Used on Home and the Trust center. | `build.py` (`charge()`), `index.html`, `security.html` |
| 34 | FAQ: "Who is Ezydrag?" rewritten; new "Is Ezydrag software we buy?" | `faq-data.js` |
| 35 | Figma: created "Ezydrag — Brand Playbook" (n7PyHWSjjEQrWrMLbw7wbc). The import was blocked by the Starter-plan MCP limit; a manual import kit is provided. | `ezydrag-figma-kit.zip` |

**Needs confirmation**
- [ ] "You can take it back: ask, and we delete your data" (from your materials: deletion on request).
- [ ] "Every engagement is priced up front" (FAQ and Engagements page).

**Figma sync workflow:** every website update regenerates `assets/brand/*.svg` and the playbook. Re-import into the Figma file each time, or let me do it once the plan allows more MCP calls.

---

## 15 · v8: CEO refocus on the Sales Nurture journey (2026-11-09)

**Feedback (Suprabo, CEO):** remove the List agent; put most of the focus on the Sales Nurture Agent and the whole sales journey, from capturing a lead to scoring it to closing the deal; the new design feels scattered, so a first-time visitor struggles to understand what we do.

**Diagnosis.** The home page carried 9+ ideas: lifecycle flow, live feed, terminal, statement band, report teaser, newsletter, chapter rail, proof stats and trust. It presented a catalogue, not one story. The fix is one product, one journey and one sentence.

### What changed
| Area | Before | After |
|---|---|---|
| Positioning line | "Your RevOps, minus the busywork." | "Every lead, followed up until it closes." |
| Hero visual | Sources → graph → 3 agents flow + live feed | **Journey strip:** Capture → Enrich → Score → Nurture → Meeting → Won. The agent walks along, and approval ticks appear on Nurture and Meeting. Plays once, with Replay. On phones it turns vertical. |
| Home sections | 9 (rail, terminal, feed, report, newsletter…) | 6: hero, clients, 6-beat pinned journey with sample data, who does what, trust, how we work, CTA |
| List Automation agent | In the nav, catalogue, flows, feed, scenarios and demo form | **Removed everywhere** (avatar SVG deleted from the build and the artifact) |
| Agents page | 9-card catalogue with filters | Flagship Sales Nurture Agent page: 6 journey steps, each with "You decide", what it works with, and "Also from our lab" (6 supporting agents) |
| Who does what | Mixed agents | Sales Nurture rows: Capture, Score, Nurture, Hand-off, Close |
| SEO | Generic RevOps titles | Home and agents titles/descriptions now about the Sales Nurture Agent |
| Proof | Invented-looking counters (100%, 4 systems) | Removed. RightWave is linked as a case without numbers |
| Copy | "six-agent suite" claims | Neutral "Ezydrag agents" wording (customers, pricing, report, FAQ) |

### Checks
- axe-core: 0 violations on all pages. The new step labels use `--o-text` for contrast.
- SEO lint: 2 issues, both intentional (short 404 and demo titles).
- No console errors at desktop (1440) or mobile (390).

### Open
- Confirm the scoring and hand-off wording with sales (who sets the rules, who takes the call).
- Get real journey metrics from RightWave when they sign off.
- Sync the journey strip and the Sales Nurture agent into the Figma brand playbook once Figma calls are available.

---

## 16 · v9: Apple-grade clarity, built around the CEO's message (2026-11-09)

**Brief.** Everything on the site should serve one message from the CEO: the Sales Nurture Agent takes every lead from capture to closed deal. A first-time visitor should know what we do within 2–3 seconds.

The brief also asked for:
- writing and SEO in Apple's style;
- motion that feels as calm as Notion's;
- no loader;
- brand-native micro-interactions, with a new beat every 5–6 seconds on desktop and mobile;
- easy lead capture, plus a follow-up prompt for people who want one;
- one consistent logo, line weight and corner radius.

### The 3-second test
| Second | What the visitor reads |
|---|---|
| 0–1 | **"Turn more leads into customers."** The product name sits above it: *Ezydrag Sales Nurture Agent*. |
| 1–2 | One sentence: the agent captures, scores and follows up every lead in Marketo and Salesforce, hands warm buyers to sales, and you approve every email. |
| 2–3 | "Book a call", then the six-step journey starts moving with a real-looking lead. |

All hero text is readable in about 0.7 seconds. There is no curtain, loader or delay.

### Writing rules (the Apple pattern, applied)
1. Say the product name first, then the benefit, then how it works.
2. One idea per section, one sentence per idea.
3. Use plain words a business owner would say: "lead", "follow up", "approve", "closed deal". Words like "RevOps", "context pipeline" and "busywork" are gone from the main path.
4. Talk to "you" and "your team". Ezydrag is "we", and the agent is "it".
5. No number we can't prove. Counters were removed. RightWave results will be published only after they sign off.
6. Page titles follow `Page - Topic - Ezydrag`. Descriptions are 140–160 characters and mention the Sales Nurture Agent. The home and agent pages carry `Service` schema.

### Structure
- **Top menu:** went from 8 items with mega-menus to 7 flat links: Sales Nurture Agent · How it works · Customers · Pricing · Trust · About · FAQ. This applies Hick's law and Jakob's law.
- **Secondary pages:** Context graph, Token efficiency, Consent and compliance, Academy, Report, Feedback and Brand playbook moved to the footer, under "Under the hood", "Learn" and "Company". Each one now opens by saying how it helps the nurture agent.
- **Next-page path:** Home → Agent → How it works → Customers → Trust → Pricing → About → FAQ → Book a call.
- **Home sections:**
  1. hero with the journey
  2. clients
  3. the six-beat scroll story
  4. who does what
  5. trust
  6. how it starts
  7. closing CTA with an email form
- **Agents page:** the Sales Nurture Agent's own page. It has six steps that unfold to show "You decide", then who does what, the tools it works with, and three helper agents. The voice agent, AI PTA and Ask agent are no longer listed there.
- **Terminal on How it works:** now shows only journey runs (capture, enrich, score, nurture, email QA, reporting).

### Motion: a beat every second, a new lead every ~8 seconds
- **Hero journey:** every 1.1 seconds the next step lights up and the caption says what just happened ("Scored 82. Strong fit, visited pricing."). It cycles through three sample leads. It has a Pause button (WCAG 2.2.2), stops when off-screen and shows the final state for reduced motion. On phones a six-tile stepper replaces the wide strip, so the whole message fits above the fold at 390px.
- **Brand gestures, and only these three:**
  1. the "e" nudge: the nav logo on hover, step icons on hover, the active phone step;
  2. the line that fills: the journey track, and the top rule of an unfold card;
  3. the orange plate under buttons: it lifts on hover and presses on click, like the logo tile.
- **Unfold cards:** hover or focus reveals one more line. On touch screens they open one by one as they scroll into view, and a tap toggles them.
- **On load:** the logo's dot drops into place once. Nothing else waits.

### Lead capture (ethical by design)
- **Quick-drop bar:** appears after the hero and hides near the closing CTA and footer. It has two choices: "Email me" or "Book a call". Closing it hides it for the visit.
- **One polite follow-up:** after 60 seconds of visible reading time: "Want a quick follow-up? We ask once. Just like our agent." Visitors choose a 2-minute walkthrough or a call this week.
  - Dismissing it leaves a small "Quick follow-up" pill.
  - Submitting stops all prompts on future visits.
  - It never steals focus and closes with Esc.
- **Closing CTA:** an inline email form next to "Book a call".
- **Backend:** set `leadUrl` in `config.js` (HubSpot, Marketo form handler, Formspree). Without one, a ready-to-send email to hello@ezydrag.com opens. Tested: email validation, the POST body, and that prompts stay off after a submission.

### One baseline
- **Corner radius:** every value in style.css now uses one scale: `--r1` 6px (tags), `--r2` 12px (buttons, inputs, icon tiles), `--r3` 20px (cards, panels), `--r4` 28px (CTA blocks), plus pills and circles. That replaced 17 different radius values. 12px is the logo's own corner on a 48px tile (¼ of the face).
- **Lines:** `--hair` is 1px in the line colour, for dividers. `--stroke` is 2px ink: the logo's own stroke, used on brand surfaces such as the quick-drop bar, the follow-up prompt and the phone stepper.
- **Logo:** the logo in the nav, footer, favicons, OG image and agent avatars all comes from brand.py, so it has the same geometry everywhere.

### Removed
- Curtain and loader.
- Review-mode section loaders.
- Mega-menus.
- The List agent (v8).
- The terminal and live feed on the home page.
- Old copy: "RevOps, minus the busywork", "Tell us where work drags", "dragged off".

### Laws of UX used
- **Hick's law:** a 7-item flat menu and one primary action per view.
- **Jakob's law:** the familiar SaaS hero → logos → how it works → trust → CTA order.
- **Fitts's law:** large primary buttons, and a sticky "Book a call" on phones.
- **Miller's law:** six steps, never more.
- **Von Restorff effect:** orange is reserved for the one primary action and the highlighted words.
- **Doherty threshold:** content shows in under 400ms, with no loader.
- **Goal-gradient effect:** the journey progress line.
- **Serial-position effect:** the value prop first, the call to action last.
- **Peak-end rule:** a warm closing CTA, with a person named as the replier.
- **Aesthetic-usability effect:** one grid, one radius scale, one stroke.

### Checks
- axe-core: 0 violations on 17 pages.
- SEO lint: 1 intentional issue (the 404 title).
- No page errors at 1440 and 390.
- Lead-capture flow tested end to end.

### Before launch
- Set `bookingUrl` and `leadUrl`.
- Confirm sample names (Priya, Daniel, Aiko, Maya, Tom, Sara) are fine for marketing.
- Publish RightWave results once they sign off.
- Sync the new stepper, unfold card, quick-drop bar and radius scale into the Figma playbook when Figma is available.

---

## 17 · v10: AI agent studio, structured like n8n (2026-11-09)

**Brief.** Rewrite the site the way n8n.io presents itself. Ezydrag is a service company, an AI agent studio, that builds agents for the market. Show the portfolio we've built: Sales Nurture (flagship), Email Creation/mailing, Email QA, QBR, AI PTA, Voice and support. Focus only on AI, and show the agent trends companies need right now. Leave out the company's origin.

**Positioning.** "AI agents for your revenue team. Built and run by us." The Sales Nurture Agent stays the flagship (the CEO's focus). The portfolio and the custom-build service sit around it.

### n8n pattern → Ezydrag
| n8n.io | Ezydrag v10 |
|---|---|
| Hero: "Build the agent. Understand its workflow." plus a tabbed live workflow | Hero plus a **tabbed agent demo**: Sales Nurture · Email QA · QBR · Ask. Each tab shows a *Brief* (like n8n's prompt) and six steps that run in turn. One highlighted step always waits for a person. It auto-advances, can be paused, takes arrow keys, and stops auto-play once you pick a tab. |
| Logo strip | Client strip (unchanged) |
| Use-case story cards | **Portfolio grid**: 7 agents plus "Your next agent". Each card shows *Runs in* and *You approve*. The flagship card is double size and shows its six steps. |
| Integrations "USB-C for your AI stack" | Flagship journey strip (Sales Nurture, six steps, live caption) |
| Governance: "See + understand + trust" | **"See it. Understand it. Approve it."** (trust scenes) |
| Enterprise / speed | **How we work**: Map → Build → Run → Grow (unfold cards) |
| Case studies + quote carousel | Testimonials carousel, linking to the RightWave story |
| Closing CTA | "Tell us the agent you need." plus an inline email form |
| (n/a) | **Agents in demand**: 4 sourced trend cards, each linked to the agent we build for it |

### New and changed pages
- **Top menu:** Agents · How we work · Customers · **Agent trends** · Pricing · Trust · About. FAQ moved to the footer.
- **Footer:** Agents (all 7) · Studio · Under the hood · Company.
- **agents.html:** portfolio grid; Sales Nurture flagship with 6 unfold steps and who does what; one detail row per agent (how it works, you approve, runs in, status).
- **trends.html (new):** 4 trends plus a risk callout, "what the numbers mean", "how we avoid failure" and "how we track trends".
- **product.html:** "A service, not software to learn." Four steps and the portfolio.
- **Pricing:** Pilot (one agent, one task) · Agents, run by us · Studio partnership (custom agents).
- **Other copy:** about, customers, demo form (which agent / something new), trust, compliance, context graph, academy, feedback and 404 now speak about "our agents" and the studio.
- **FAQ and Ask Ezydrag:** 19 approved answers, including custom agents, the portfolio, "software or service?" and how we track trends.
- **SEO:** new titles and descriptions for every page. `Service` schema now carries an `OfferCatalog` of all 7 agents. The OG image is updated.
- **Single-source data:** `PORTFOLIO`, `AGENT_TABS` and `TRENDS` (with `TRENDS_DATE`) live in build.py. Change them there and every page updates.

### Trend sources (checked 9 Nov 2026)
| Trend | Figure | Source |
|---|---|---|
| Lead follow-up and prospecting | 55% of sales pros use AI for prospecting (+38% plan to) | [Salesforce State of Sales, Feb 2026 (vendor survey, 4,050 respondents)](https://www.salesforce.com/news/stories/state-of-sales-report-announcement-2026/top-ai-agent-use-cases/) |
| Customer service agents | 80% of common issues solved by agentic AI by 2029 (prediction) | [Gartner, 5 Mar 2025, via CMSWire](https://www.cmswire.com/the-wire/gartner-predicts-agentic-ai-will-autonomously-resolve-80-of-common-customer-service-issues-without-human-intervention-by-2029) |
| Research and reporting agents | 56% plan to build them in the next 12 months | [Anthropic, 2026 State of AI Agents (vendor survey, 500+ technical leaders)](https://claude.com/resources/guides/the-2026-state-of-ai-agents-report/research-insights-part-ii-going-deeper) |
| Email and content drafting | Sellers expect 36% less time on email drafting | Salesforce State of Sales, Feb 2026 |
| Risk | 40%+ of agentic AI projects will be cancelled by end of 2027 (prediction) | [Gartner, via YourStory](https://yourstory.com/ai-story/gartner-agentic-ai-projects-cancelled-2027) |

Review these every quarter and update `TRENDS_DATE`.

### Checks
- axe: 0 violations on 18 pages.
- SEO lint: 1 intentional issue (the 404 title).
- No page errors.
- The single-file build (`ezydrag-site.html`) was rebuilt with 18 pages, and its navigation was tested.

### Confirm before launch
- The status labels on the portfolio cards ("In production", "With Nutaan AI", "Live on this site"). Make sure each is accurate.
- "In production at RightWave" on the Email Creation and Email QA rows.
- Voice Agent: confirm Nutaan AI is happy to be named as the build partner.

---

## 18 · v11: Field Notes blog, July–October 2026 (2026-11-09)

**Brief.** A fortnightly blog from July to October 2026, written from today looking back. It should be researched from real sources and spun off real news (n8n, Atlassian, harness engineering, chaos engineering, MCP, Dreamforce). Bylines:
- CTO alone;
- CTO with the COO;
- the Director of Design for design topics.

Other requirements:
- simple H1 and H2 headings;
- one diagram per post;
- useful to founders and good for SEO;
- a laid-back voice;
- it should build trust in how Ezydrag works.

**Honesty rule (kept on every post).** The series was written on 9 Nov 2026 and says so at the top of each post. The main story cites only what was public on the fortnight's date. Anything later sits in a boxed "What happened next" section. The JSON-LD `datePublished` is the real date, 2026-11-09, so nothing is backdated to look like a prediction.

### The 8 notes
| Fortnight | Title | Byline | Main sources |
|---|---|---|---|
| 14 Jul | The n8n AI Assistant asks before it acts. That's the news. | CTO | n8n Community, 9 Jul |
| 28 Jul | Approval isn't a button. It's a moment you design. | Director of Design | Digital Thought Disruption, 12 Jul |
| 11 Aug | MCP went stateless. Your agents just got easier to run. | CTO | MCP 2026-07-28 spec; The Register, 23 Jul |
| 25 Aug | Break your agent on purpose. Before a customer does. | CTO + COO | AgentChaos (arXiv, 7 Aug); Huo et al. (17 Aug) |
| 8 Sep | Your AI bill is getting a meter. Price the outcome, not the call. | COO + CTO | Atlassian via TechRepublic, 3 Sep; n8n, 9 Jul |
| 22 Sep | Agent = model + harness. Most teams only buy the model. | CTO | Osmani / O'Reilly, 15 May; Lilian Weng, 4 Jul |
| 6 Oct | Workflow or agent? A two-minute test. | CTO + COO | n8n blog, 25 Sep; Atlassian Rovo, 17 Sep |
| 20 Oct | Every CRM now has an SDR agent. Here's what still wins. | CTO + COO | Salesforce Dreamforce recap, 28 Sep; State of Sales, Feb |

The "What happened next" boxes use later items: the n8n Agents launch, Mitchell et al. (24 Aug), Marmelab's harness study (24 Sep), Dreamforce agent monitoring, and the Netics write-up (26 Oct).

### Build
- `blog.py` holds every post as data: metadata, body, diagram spec, hindsight and sources.
- `build.py` calls `BLOG.write_pages()`, which generates `src/pages/blog.html` and `blog-*.html`.
- SEO: every post has a title and description, a `BlogPosting` (authors with job titles, citations) and a `Blog` index. All posts are in the sitemap.
- Diagrams are inline SVGs in the brand style: flow, compare, stack and tree. Each has a title for screen readers. On phones they scroll sideways.
- The home page has a new "Field Notes" section with the 3 latest posts, and the footer links to "Field Notes (blog)".
- axe: 0 violations. SEO lint: 1 intentional issue (the 404 title). The single-file build now has 27 pages.

### Confirm before publishing
- "How we work on this at Ezydrag" paragraphs describe practices: approvals, failure-list testing, per-outcome cost reporting. Check that each one matches what the team actually does.
- Ask Shuvam, Anirban and Santanu to read and approve the posts under their names.
- The 20 Oct note says Salesforce listed Hunter and long-horizon agents for November GA. Update it once they ship.

---

## 19 · v12: High-demand RevOps agents, from "RevOps_AI_Agents_2026" (2026-11-09)

**Brief.** Add the content of the internal PDF *High-Demand AI Agents for B2B RevOps* to the site wherever it fits. Update the shared link; no zip this round.

### Where the PDF went
- **Agent trends:** a new section, `#revops`: "Agents that do the work. Ranked by revenue impact." It has:
  - the "Why now" paragraph;
  - two checked statistics;
  - 9 agent cards, each with revenue impact, profit lever, "We measure" and a status label.

  "What the numbers mean" gained "Pipeline proof is rare".
- **Home:** the "Agents in demand" section adds a compact ranked list of all 9 agents, linking to the full ranking.
- **Agents page:** a new "Built to order" section with the same ranked list.
- **Pricing:**
  - CRM cleanup is now the suggested first pilot project.
  - New FAQ, "How do you measure success?", listing response time, meetings booked, forecast accuracy, churn saved and discount leakage.
- **How we work:** step 01 now names those five measures.
- **Trust:**
  - "Set prices or negotiate with your customers" added to what agents can't do.
  - A 6% stat callout, plus the governance layer paired with GDPR/DPDPA.
- **Compliance:** a governance-layer line.
- **FAQ / Ask Ezydrag:** new answers on in-demand RevOps agents, measuring success, and whether agents negotiate.
- **Data:** `REVOPS` and `REVOPS_STATS` live in build.py. The macros are `{{REVOPS}}`, `{{REVOPSLIST}}` and `{{REVOPSSTATS}}`.

### Status labels (kept honest)
- **Partly covered today:** Churn and Upsell (#6, from the PDF's Customer Success agent) and Attribution (#7, from Nurture Optimization).
- **Built into how we work:** Governance.
- **Good first project:** CRM Cleanup.
- **Built to order:** the rest.

The PDF's internal "biggest gaps" note was not published.

### Statistics checked against the original sources
- **"Fewer than 10% have seen AI contribute directly to pipeline", and 71% rate their AI knowledge 7/10 or higher:** Default, H1 2026 State of AI in RevOps, cited in [Default's article](https://www.default.com/post/ai-agents-and-revops).
- **6% will let AI agents negotiate in the next 12 months (75% no, 15% evaluating, n=102, fielded Aug–Sep 2026):** [RevOps Co-op and DealHub, Q4 2026 benchmark](https://dealhub.io/resource-center/reports/revops-ai-authority-benchmark/).

### Not used
- The PDF's "results within 30 to 60 days" line. It's a promise we can't back with data yet.
- The PDF's domain, www.ezydrag.com. The site still uses ezydrag.com. Confirm which domain is correct.

---

## 20 · v13: Field Notes rewritten in dev.to x Fireship voice (2026-11-09)

**Brief.**
- Drop "Fortnight of …" and the "Written in November 2026, looking back…" note.
- Make the posts feel like dev.to and Fireship: Gen Z memes, fun context, state-of-the-art topics.

**What changed**
- **Titles:** Fireship-style hooks with a trailing "…". Examples: "Researchers broke every AI agent on purpose. All of them got worse…" and "Your agent isn't dumb. Your harness is mid…".
- **dev.to anatomy:**
  - `#tags`, author avatars and a read time (from the word count);
  - a TL;DR card;
  - one diagram;
  - one text-only meme card. The formats are "Nobody: / POV" style lines, or a 🙅 / 👉 no-vs-yes panel. No borrowed meme images.
  - simple H2s, sources, a CTA, and previous/next links.
- **No dates:** the "What happened next" boxes were removed. Later facts are now told in the story, with their event dates inside the sentences ("Fast forward to 25 September…").
- **No backdating:** posts show no publish date. JSON-LD `datePublished` stays the real date, 2026-11-09. The blog index says "a new one every two weeks" going forward.
- **Sources:** every quote and number is still linked; extra sources were added where facts moved into the body.
- **Checks:** axe 0 on the blog pages. The meme card's contrast was fixed.

---

## 21 · v14: Client logo wall, greyed out and scaled (2026-11-09)

**Brief.** Use the supplied logos (RightWave, Cerkle, Eternup, Nutaan, Amazon, IBM, Figma, Angel One). Show them greyed out, at a consistent scale, in line with the brand, and leave room for more.

**Treatment (also written into the brand playbook, section "Client logos")**
- Each logo is turned into a single-colour silhouette:
  - background removed (composited on white, then alpha taken from the distance to white);
  - Cerkle's white letters lifted off its purple field;
  - Figma's colour shapes knocked out of its tile.
- Recoloured to ink grey #4D5163, trimmed, saved as transparent PNGs at 96px tall (2x) in `src/assets/clients/`.
- **Optical scaling:** height ≈ 48.5 / √(aspect ratio) × (0.3 / ink density)^¼, with width capped at 150px. Wide wordmarks sit shorter, dense marks smaller.
- **Cells:** equal, 180 × 64, with a 1px hairline and the 12px radius. Logos sit at 70% opacity and go to 100% on hover or focus. The flip-back card shows what we run for that client.
- **Layout:** 4 per row on desktop, 2 per row on phones. The label now reads "Trusted by teams at". The wall appears on Home and Customers, and the playbook shows a sample.
- **Adding a logo:** drop the PNG into `src/assets/clients/` and add one row to `CLIENTS` in build.py.
- **Build fix:** client PNGs are now copied into dist.

**Confirm:**
- Written permission to show Amazon, IBM, Figma and Angel One logos.
- What we run for each of them. Their flip cards currently say only "Client".

---

## 22 · v15: Field Notes, nine looks and voices; team hover removed (2026-11-09)

**Brief.** Every post gets a different style. Add a fun design post that stands out, with illustrations and well-crafted sections. Add meme images like Fireship, strong hooks while reading, and motion diagrams. Keep the voice nonchalant and back every claim with a source. Voices:
- Gilfoyle-style deadpan for the CTO;
- Richard Hendricks-style earnest, anxious and over-explained for CTO with COO;
- Saptarshi-style friendly UX teaching for design.

Also: remove the hover on team cards.

### Nine posts, nine layouts
| # | Post | Look | Voice | Meme (original drawing) |
|---|---|---|---|---|
| 1 | n8n asks first | Terminal header that types itself; `$` before each H2 | CTO, deadpan | Expectation vs reality |
| 2 | Approval isn't a button | Teardown with highlighted headings and a numbered anatomy | Design, teacher | Two buttons: "Approve" / "Also approve" |
| 3 | MCP stateless | "Breaking" ticker plus a Code Report tag; animated request routing | CTO, deadpan | Panik / kalm / panik |
| 4 | Break your agent | Incident-report header table; postmortem-style H2s | CTO + COO, anxious | Nope / yep |
| 5 | AI bill meter | Torn receipt of the Atlassian metering terms | COO + CTO, earnest | Galaxy brain (4 levels) |
| 6 | Harness is mid | Sticky "In 100 seconds" stopwatch that fills as you read; timestamped H2s | CTO, deadpan | "Bad harness starter pack" |
| 7 | Workflow or agent | Interactive 4-question quiz with a score | CTO + COO, anxious | Two buttons: workflow / autonomous agent |
| 8 | SDR agent edge | S / A / B / C tier list | CTO + COO, earnest | Expectation vs reality |
| 9 | **NEW: Labor illusion (design standout)** | Magazine layout: illustrated hero, outlined chapter numbers 01–07, drop cap, three illustrated motion figures (pizza-style tracker, kitchen window, time scale), "Psychology corner", and a live "instant vs show the work" demo | Design, teacher | Expectation vs reality |

### Shared building blocks
- **`blogkit.py`:**
  - motion diagrams (flow, compare, stack, tree, requests, timescale, tracker, kitchen, two_searches);
  - a meme kit built from our agent avatar with moods (sweat, shades, shock, dead, chill, glow, galaxy) in classic formats (two buttons, galaxy brain, panik/kalm, starter pack, expectation/reality, nope/yep);
  - no third-party meme images.
- **Hooks:** big-type lines, dark "Plot twist" cards, giant stats that count up, and dashed side notes.
- **Motion:**
  - starts only when a figure is in view;
  - each figure has a Pause / Play button (WCAG 2.2.2);
  - figures stay static until in view, and fully static with reduced motion;
  - SVG animations pause through `pauseAnimations()`.
- **Blog index:** the design post is featured large; the other cards show their meme.

### Sources for the new design post
- [Buell and Norton, *The Labor Illusion*, Management Science (2011)](https://pubsonline.informs.org/doi/abs/10.1287/mnsc.1110.1436). Quote: "providing information to your customer will improve perceptions, even if total service time is higher."
- [The Hustle, *How the Domino's pizza tracker conquered the business world* (Aug 2025)](https://thehustle.co/originals/how-the-dominos-pizza-tracker-conquered-the-business-world). Covers the 2008 launch, "essentially a progress bar", and the cafeteria study.
- [Jakob Nielsen, *Response Times: The 3 Important Limits*, NN/g (1993)](https://www.nngroup.com/articles/response-times-3-important-limits/). Covers the 0.1 s, 1 s and 10 s limits.

The demo is labelled as sample data, and the post states that a real product should only show steps that actually ran.

### Other changes
- **Team cards (About):** the hover zoom, orange bar and shadow shift are removed. Keyboard focus stays.
- **Checks:** axe found 0 violations on all blog pages and the home page. No console errors on desktop or mobile.

---

## 23 · v16: Correction: no hover on client logos; team hover restored (2026-11-09)

The user meant the client logo wall ("Trusted by teams at…"), not the team cards.

- **Client logos:** the hover flip-to-back card and the opacity change are removed. Logos are static, grey, at 70% opacity, in equal cells. The back-of-card markup is gone and the cells are no longer focusable.
- **Brand playbook rule:** now reads "Always 70% opacity. No hover, no flip, no motion."
- **Team cards (About):** the original hover (photo zoom, orange bar, plate shift) is restored. The v15 override was removed.
- **Checks:** axe found 0 violations on home, customers, brand and about.

---

## 24 · v17: Bot eyes fixed; meme buttons and numbered circles restyled (2026-11-09)

- **Bug (introduced in v15):** the blog's terminal cursor defined `@keyframes blink`. That overrode the agent avatar's eye-blink animation, so the eyes faded out half the time, one after the other. It looked like every bot was missing an eye. The cursor and incident dot now use `cur-blink`, and the avatar blink is untouched again across the whole site.
- **Two-buttons meme:** the red and orange ellipse buttons are replaced by brand panels, the same style as the expectation/reality meme. "OPTION A" / "OPTION B" sit in white and tint tiles with an ink stroke, and the agent sweats in a mist panel below. This applies to the approval post, the workflow post and the blog cards.
- **Approval post anatomy:** the numbers are now ink rounded squares (12px radius) instead of white circles with an orange plate. The orange highlighter behind H2s is removed, so headings match the other posts.

---

## 25 · v18: Journey steps no longer see-through (2026-11-09)

- **Problem:** upcoming steps (Nurture, Meeting, Won) were faded with opacity 0.32, which made the tiles see-through, so the grey track line showed through them.
- **Fix:** steps are now fully solid. Upcoming steps get a filter instead: greyscale and lightened. Their white faces stay solid, the stroke and plate go light grey, and they snap to full colour when reached.
- **Phone stepper:** same fix, as it had the same issue.

---

## 26 · v19: Eyes, wider stack, sourced answers, curtain raise (2026-11-09)

**1. Bots that looked blind.** The meme "proud" mood drew dark sunglasses over the visor and hid both eyes. It now keeps both eyes visible and adds orange sparkles. Applies to the expectation and "yep" panels across all memes, posts and blog cards.

**2. More than Marketo and Salesforce.**
- **New `STACK` section, "We build where your team already works"** on home, agents and how-we-work. The groups:
  - CRM: Salesforce, HubSpot, Attio
  - Marketing and outreach: Marketo, HubSpot, Instantly
  - Data: Clay, Apollo
  - Workflows: n8n, MCP servers, webhooks and APIs
  - Team chat and docs: Slack, Microsoft 365, Google Workspace
  - Data platforms: Snowflake, BigQuery, Databricks, Apache Iceberg

  The section is honest about scope: "If it has an API or an MCP server, we can usually connect it. We confirm the exact list during scoping." It is backed by [ColdIQ's July 2026 survey of 62 GTM leaders](https://coldiq.com/blog/the-2026-gtm-tool-report-what-62-revenue-leaders-run): Clay 71%, n8n 48%, HubSpot 39%, Apollo 35%, Attio 32%.
- **Copy:** hero, agent rows, portfolio "Runs in", pricing, trust and the demo form no longer assume Marketo and Salesforce only.

**3. Ask Ezydrag: research-backed approved answers.**
- **Size:** 32 answers, up from 19.
- **New categories:** Data and metadata, Reliability, and For CTOs and investors.
- **Sources:** every market claim carries a source, shown under the answer on the FAQ page and in the chat bubble. Sources used:
  - Gartner on AI-ready data: 60% of AI projects abandoned; 63% unsure about their practices.
  - Gartner's 2025 Metadata MQ, via Atlan: metadata is "the indispensable foundation for modern and agentic AI systems".
  - Ryft/TrendCandy Iceberg study: 58% / 95% / 79%, n=252, labelled as vendor-commissioned.
  - MCP 2026-07-28 spec.
  - AgentChaos.
  - Osmani on harnesses.
  - Gartner on agentic AI cancellations (40%+).
  - Huo et al. on trajectories.
  - Default (<10% pipeline).
  - DealHub (6% negotiate).
  - Atlassian metering.
  - Salesforce (55%).
  - Anthropic (56%).
  - ColdIQ.
- **Launcher suggestions:** "What do you build?", "Is our data ready for AI?" and "How do you test agents?".
- **Build fix:** JSON-LD FAQ extraction now handles escaped quotes.

**4. Curtain raise (first page of each visit):**
- **Sequence:**
  1. Ink screen.
  2. The reverse mark assembles: face scales in, plate slides out, the "e" nudges, the dot drops.
  3. An orange line draws, and "AI agents, built and run by us" fades in.
  4. The curtain splits top and bottom to reveal the page.
- **Timing:** about 1.7s. The hero sequence waits for it.
- **Controls:** a click or any key skips it. It shows once per visit (sessionStorage) and never with reduced motion.

**Checks:** axe 0 on all 27 pages. SEO lint: 1 intentional issue. No console errors. A second load in the same visit skips the curtain.

## 27 · Client logos trimmed (2026-11-09)

Removed Figma and Angel One from the client logo strip (home, customers, brand). Remaining: RightWave, Amazon, IBM, Cerkle, Eternup, Nutaan AI.

## 28 · FAQ page, Salesforce-style type and grid, cleaner chat (2026-11-09)

**FAQ page.** FAQ is now in the main nav (it was only in the footer). The page is rendered at build time, so all 32 answers are in the HTML for search engines (FAQPage JSON-LD unchanged). Layout follows a help centre: search in the hero; a sticky topic list (3 of 12 columns) with counts that highlights the current topic; answers grouped by topic (9 of 12). On mobile, topics become a scrolling chip row. Search filters live and opens matching answers. Sources still show under each answer here.

**Chat window.** Ask Ezydrag no longer shows source links in the chat bubble; answers stay short. Sources remain on the FAQ page.

**Type and grid, modelled on salesforce.com.** Salesforce uses ITC Avant Garde (headings, regular weight) and Salesforce Sans (body); both are licensed, so we use open equivalents:
- Display: Questrial, regular weight only, no faux bold. Body: Inter.
- The wordmark keeps Bricolage Grotesque 800, so the logo does not change.
- Type scale (px): 60/48/40/32/24/20 display, 18/16/14/12 text, on a 4px line-height rhythm.
- Space: 4px base, 8px module (8, 12, 20, 32, 48, 64, 96).
- Grid: 12 columns, 1280px max width, 24px gaps, 40px side gutters on desktop (20px on mobile). New `.g12` / `.c3`–`.c12` helpers.
- Radius scale unchanged (brand).
Brand page specimen updated. axe: 0 violations.

## 29 · Chat that thinks, Notion-style type (2026-11-09)

**Ask Ezydrag, more alive (no LLM, still approved answers only).**
- Questions show a live "Thinking" trace of the real steps the matcher runs: reading the question (key words shown), searching the 32 approved answers, the best match with its score, and "Approved by our team". It collapses to "Thought for 1.2s" (click to reopen); the answer then types out word by word.
- After an answer, two related questions from the same topic appear as tappable chips.
- Anything that isn't a question about us gets a reply with personality: greetings, thanks, goodbyes, "are you a bot?", jokes (three agent jokes), off-topic asks (weather, cricket…) politely redirected, rudeness answered calmly, "help" lists what it knows.
- No match: it says so honestly, offers up to 3 near questions as chips and a "Send it to a person" link that pre-fills an email with the question.
- Reduced motion: no animation, instant text.

**Type, modelled on notion.com.** Inter for everything (optical sizes 14–32 loaded). Headlines Inter 700 with tight tracking (h1 −4.5%, line-height 1.02; h2 −3.5%); h3 600; body 400. Replaces Questrial from §28. Grid, spacing and wordmark (Bricolage 800) unchanged. Brand page specimen updated.

## 30 · Designer pass: short hero, pastel chips, Linear-style type motion, surprises (2026-11-09)

**Hero (readable in under 4 seconds).** Headline: "AI agents for your revenue team. [● Built] and run by us." with a Notion-style pastel chip on "Built" (soft pulsing dot). Sub cut to one line: "Lead follow-up, email checks and reports, inside your CRM and inbox. Your team approves every step." One primary CTA. Whole hero settles in about 0.8s.

**Pastel neutral chips, one chip language.** Seven tones (lavender, mint, butter, sky, peach, rose, sand), pastel fill with dark text of the same hue, all AA. Used for: agent status (Flagship peach, In production mint, With Nutaan AI lavender, Live on this site sky, Custom sand), RevOps impact (High mint, Medium-high sky, Medium butter, Enabler lavender, Differentiator rose), stack groups (one hue per group), blog tags.

**Components and art direction.**
- Flagship card now carries a "Sample run · today" board (four leads with status chips) instead of empty space.
- Client logos: a clean row of six, no boxes.
- Reading widths widened (lead 48ch, hero sub 44–46ch) to stop two-word orphans.
- Cards share one radius and one hover; header hairline appears only after scrolling; buttons press on click; `kbd` style.
- **Mobile bug fixed:** a later CSS rule kept two-column "split" sections and art heroes side by side on phones, so 11 pages scrolled sideways at 375px. Now single column; 0 pages overflow.

**Type motion, Linear-style (GSAP).** Headline words rise out of a soft blur (expo-out, 35ms stagger); the hero chip pops; every section h2 does the same once as it scrolls in. Off with reduced motion.

**Surprises (all skippable, all off or static with reduced motion):**
- Hover any agent bot: it says its line ("I clicked every link. Twice.").
- Reach the end of a page: a bot peeks up bottom-left with a page-specific line (once per page per visit; closes itself).
- Click the logo five times: bot party, all seven agents burst up.
- Type "ezydrag" anywhere: "Agent mode: on. A person still approves."
- Konami code: every bot on the page spins.
- Leave the tab: title becomes "Your leads are waiting 👀".
- Open dev tools: a hello in the console.
- FAQ: searching "meaning of life", "joke", "chai", "skynet" gets a special empty state.

Checks: axe 0 on all 28 pages; no horizontal scroll at 375px; SEO lint 1 intentional.

## 31 · De-slop, AI-search SEO, copy-friendly email, socials (2026-11-10)

**AI-template elements removed.** Hero glow blobs and grid backgrounds (all heroes and blog posts); "• label" pills above hero headlines (they repeated the breadcrumb); mono ALL-CAPS eyebrows with an orange dash (now sentence-case Inter 600); emoji in toasts and the away-tab title; footer headings now sentence case. Copy scan for filler words (seamless, unlock, leverage, elevate, game-changer, cutting-edge, delve…) found none in visible marketing copy. Hero headline chip now ink on peach, smaller dot.

**SEO for Google and AI assistants.**
- `robots` meta: `index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1` (full snippets allowed).
- `robots.txt` explicitly allows GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended, Bingbot, Googlebot; 404 disallowed; sitemap linked.
- `llms.txt` (llmstxt.org format): one-paragraph summary, key facts, every page and post with its description. `llms-full.txt`: all 32 approved answers with sources. Linked from every page head (`rel="alternate" type="text/markdown"`).
- Organization JSON-LD: `sameAs` (LinkedIn), `contactPoint` (sales, email), `knowsAbout`.
- No page can be guaranteed a #1 ranking; this covers what's in our control on the page.

**Email, copy-friendly.** One mail chip everywhere (footer, book-a-call, FAQ): peach address you can click to write or select in one tap, plus a Copy button that turns mint and says "Copied". Falls back to selecting the address if the clipboard is blocked.

**Socials.** Footer has LinkedIn (placeholder `linkedin.com/company/ezydrag` until confirmed). WhatsApp is built in and appears as soon as a number is set in `SOCIAL["whatsapp"]` in build.py.

Checks: axe 0 on all 28 pages; SEO lint 1 intentional (404 title).

## 32 · Semantics, brand-only colour, rotating hero word, zip (2026-11-10)

**Semantic HTML.** Every `<section>` now has an accessible name (`aria-labelledby` its first heading, ids generated at build; four heading-less sections get `aria-label`). Footer contact is an `<address>`. Blog posts and cards show `<time datetime>`. Academy's simulation list is no longer an `<aside>` nested inside `<main>`. Member dialog image has a valid placeholder `src` and size. One `<h1>` per page, no heading skips, `aria-current` on nav, all images have `alt`, width and height.

**SEO head, every page.** title 30–60 chars (404 retitled), description 110–160, canonical, `hreflang="en"` + `x-default`, Open Graph (type, site_name, title, description, url, image + size + alt, locale), Twitter card + image alt, `author`, `theme-color`, icons, manifest, JSON-LD, `llms.txt` link. Robots, sitemap, llms.txt and llms-full.txt unchanged from §31.

**Brand colours only.** Every off-brand hue (greens, blues, violets, reds, yellows) remapped to orange, ink or warm neutrals, including success/warning/error, terminal themes in blog posts, chip tones, the LinkedIn and WhatsApp icons and the "Copied" state. Status is carried by words and icons, not hue. Automated scan of compiled CSS/HTML/JS: no saturated colour outside the orange family.

**Hero.** "AI agents for your revenue team. [● Built] by us." The chip word rotates Built → Run → Tested → Improved every 2.2s: the old word lifts out with a blur, the new one rises in, and the chip width eases to fit. Pauses on hover, when off-screen or tab hidden; off with reduced motion. Screen readers get one static line: "Built, run, tested and improved by us."

Checks: axe 0 on all 28 pages; SEO lint 0 issues; semantic audit clean.

## 33 · Hero rotating line (2026-11-10)

The rotating "[● Built] by us." line now always sits on its own line under "revenue team." at every width. The chip is measured whole (dot, gap, padding) for each word, so Built / Run / Tested / Improved all get the same padding; it re-measures on resize. Website and zip updated.

## 34 · Loader is the bot (2026-11-10)

The e-mark loader is gone. Loaders (Academy, demo states, everywhere `ezyLoader` is used) are now the agent bot head with no badge: eyes look left and right and blink, the antenna light pulses, it bobs gently, three orange dots keep time. The first-load curtain uses the same bot: it drops in, looks around, blinks, the orange line draws, then the curtain splits (still ~1.7s, skippable, once per visit, off with reduced motion). Fixed a class clash that made the bottom curtain panel shrink. Brand page captions updated. Website and zip updated.

## 35 · One card style (2026-11-10)

The "Agents in demand" trend cards (and every `.card` across the site) had only a top border; the shared corner radius bent that line into an arc that read as a floating upper layer. All of them are now the same card as the agent and stack cards: white, 1px hairline all round, 20px corners, same padding. Trend labels are sentence case like other labels; "We build" is the card footer (mist strip, peach on hover) instead of a box inside a box; the risk callout drops its orange offset shadow. Website and zip updated.

## 36 · CEO first, legal name (2026-11-10)

Team grid (About and home preview): the CEO now comes first, then everyone in alphabetical order; About copy says so. Footer reads "© 2026 Ezydrag Private Limited" on every page; Organization JSON-LD has `legalName: Ezydrag Private Limited`; llms.txt states the legal name. Website and zip updated.

## 37 · Two new agents, Privacy notice page (2026-11-10)

**New agents (from the RevOps list, #1 and #9).** Prospecting Agent (watches buying signals, finds contacts, drafts personal first emails; runs in Clay, Apollo, your CRM; you approve every first message) and Governance Agent (logs every agent action and data access, enforces approvals; pairs with GDPR and DPDPA work). Both carry an honest "In demand" chip, not "In production". Added to: home and How-we-work portfolio grid (custom card now spans the full row), Agents page (new rows, "Nine agents"), footer, FAQ answer, llms.txt, SEO description, RevOps ranking status ("Now in our portfolio"), bot quips and the logo bot party.

**Privacy notice page (`privacy.html`).** Text from "EzyDrag_Privacy_Policy.pdf" (last updated 5 November 2026), unchanged except the name: "Privacy policy" → "Privacy notice", and "this policy" → "this notice" where it refers to the document itself. Layout: help-centre grid with a sticky section list that follows your reading, accessible tables (row and column headers, captions), definition lists for entity and Grievance Officer details, `<address>` for the registered address. Linked from the footer (Company column and bottom bar), in the sitemap. Home-page title says "Privacy notice"; noindex not applied (it should be findable).

**Earlier today:** CEO first on the team grid; footer "© 2026 Ezydrag Private Limited".

Open points for the team: the notice says the site uses no cookies or browser storage for the brief (true) and no analytics (true), but the site does use the browser's session/local storage for small conveniences (first-load animation shown once, quick-drop dismissed) and loads fonts from Google Fonts and GSAP from cdnjs. Worth a line in §13 if legal agrees.

## 38 · Component pass, blog thumbnails, scroll, footer badges (2026-11-11)

- **How we work cards:** no hidden hover reveal (it left uneven empty space and a +/× icon). Each card shows step, title, line and "You get…" as a footer under a hairline; equal heights. Step labels "01 · Map" in Inter, not mono caps (all `.n` step labels site-wide).
- **CTA band:** "Tell us the agent you need." on one line on desktop; space under "No newsletter…" note.
- **Book a call:** phone icon on every Book a call button (header, CTAs, posts).
- **Stack:** 8 groups (added Calls and meetings, AI models) with larger icon tiles; every tool chip has a small lettermark; more tools (Zoho CRM, Pipedrive, Outreach, ZoomInfo, Zapier, Make, Microsoft Teams, WhatsApp Business, Zoom, Google Meet, Gong, Fathom, Postgres, Claude, GPT, Gemini). Footnote: names are trademarks of their owners and show tools we connect to, not partnerships.
- **Field Notes thumbnails:** nine crafted 1200×675 PNGs (`tools/thumbs.py` + `tools/thumbs_render.js` → `src/assets/blog/`), each one line plus one idea drawn with our bots, brand colours only. Used on cards and as each post's og:image and JSON-LD image.
- **Field Notes cards:** Coursera/Google pattern: thumbnail, topics, title, two-line summary, author photo(s) + name, role, date, read time. Featured post is a wide card.
- **Field Notes copy:** "AI agents, explained fast. No hype. Some memes." → "Notes from the people who run the agents." Home: "What running agents teaches us." SEO description no longer says "unhinged".
- **Scroll:** every page opens at the top unless the link targets a section; switching a tab brings its section back into view; a "Top" button appears after scrolling (above Ask Ezydrag).
- **Footer:** GDPR (EU), HIPAA (US health), DPDPA (India 2023) badges linking to Consent and compliance.
- **Team order:** CEO, COO, CTO, Director of Design, then everyone else A–Z.
- **Not done:** invented testimonials attributed to IBM or Amazon (see chat).

## 39 · Hero line (2026-11-11)

Hero is now "You name the task. We [● build] the agent." The chip cycles build → test → run → improve (same motion, pauses on hover/off-screen, off with reduced motion). It says "you ideate, we create" without saying it. Sub: "AI agents for your revenue team, inside your CRM and inbox. Your team approves every step." About 24 visible words, CTA above the fold at 1440×900 and 390×844, so the whole offer reads in about 4–6 seconds. Screen readers hear: "You name the task. We build, test, run and improve the agent." Headline scales on phones so the rotating line never wraps.

## 40 · Scroll to top everywhere, brand playbook offline (2026-11-11)

- **Scroll:** opening any page (footer links included, e.g. Privacy notice → About / FAQ / Field Notes / Feedback) now always lands at the top. Fixed for the hosted preview too, where the outer panel holds its own scroll: the page resets its own scroll and asks the host to bring the top into view, on click, on load and on back/forward. Links to a section (#…) still jump to that section. Smooth scrolling is switched off for the reset so it is instant.
- **Brand playbook:** route disabled. `brand.html` removed from the site, footer, sitemap and llms.txt, and deleted from the published preview. The source is kept in `src/drafts/brand.html` (not built) for when it should go public again: move it back to `src/pages/` and re-add its SEO line.

## 41 · Agent trends merged into Agents (2026-11-11)

- **Agent trends route removed.** Nav, footer, sitemap and llms.txt no longer list it. `trends.html` is now a no-index stub that forwards to `agents.html#to-order`, so old links still land somewhere useful (same for `brand.html` → home). Source kept in `src/drafts/trends.html`.
- **Agents page = full portfolio of 16.** "Sixteen agents. One way of working." Nine we run today (unchanged) plus a "Built to order" section: Speed-to-Lead, Churn and Upsell, Deal Follow-up, CRM Cleanup (good first project), Forecasting, Deal Desk, Attribution. Same card language as the portfolio: bot avatar (new avatars for each), impact chip, one line, "You get" / "We measure", and a footer action "Talk to us about this agent" that opens Book a call with the agent pre-filled in the brief. No sources or articles in this zone. Section header carries a Book a call button.
- **Home:** the "What companies need now" trends grid (with sources) and the RevOps ranking list are gone. In their place: "The agents teams ask us for next." with the top three built-to-order agents and "All 16 agents →".
- **FAQ:** the trends answer now points to Field Notes and the Agents page.
- **Stack:** two-letter monograms removed from tool chips.
- The sourced 6% negotiation stat stays on the Trust page (it supports a policy, not a sale).

## 42 · Project brief: pick many, or bring your own (2026-11-11)

Step 1 of the brief (Book a call) is now a multi-select: "Which agents are you thinking of? Pick as many as you like." Options: All of them (ticks everything; shows a part-ticked state), Lead nurture, Prospecting, Speed-to-lead, Emails and QA, Reports and forecasts, Voice or support, CRM cleanup, Churn and upsell, Governance, and "I've got one for you", which opens "Go on, we're listening." with a one-line box ("One line is enough. We'll tell you honestly if an agent should do it."). At least one is required; picking your own needs a line. The brief that gets emailed lists every agent picked plus their idea. Links from agent cards pre-tick the matching agent, or put the agent name in "I've got one for you" if it has no tile.

## 43 · Titles spelled out, walkthrough form removed (2026-11-11)

- Every job title is spelled out: Chief Executive Officer, Chief Operating Officer, Chief Technology Officer (team grid, blog authors and bylines, post JSON-LD `jobTitle`, testimonial names, copy such as "Written by our Chief Technology Officer, Chief Operating Officer and Director of Design"). Team order unchanged. Post descriptions shortened where the longer titles pushed them past 160 characters.
- Home CTA: "Send me the walkthrough" email form and its note removed. The band is now the headline, "A 30-minute call with the people who would build it." and Book a call.
- Blog byline: author photos no longer squeeze when there are two authors.

## 44 · Field Notes in the top navigation (2026-11-11)

Top bar: Agents · How we work · Customers · Pricing · Trust · Field Notes · About · FAQ. Field Notes is highlighted on the blog index and every post; it also appears in the mobile menu. Fits on one line at 1440px; below the menu breakpoint everything sits in the drawer as before.

## 45 · Customers: case studies on request, review arrows (2026-11-11)

- RightWave is described correctly as a **marketing automation company** (not a marketing agency) on Customers, in its SEO description and in the Pricing FAQ ("Do you work with marketing automation companies?").
- The open before/after table is gone. New "Case studies: The full story, on request." section: RightWave marked Ready with a "Request the case study" email box (opens a pre-filled email to hello@ezydrag.com, or posts to leadUrl when set); Cerkle, Eternup and Nutaan AI shown as "In progress: we're writing this one now", each with one honest line.
- "What leaders say": play/pause removed; previous and next arrows either side of the dots, arrow keys work, no autoplay.
- Nutaan AI title spelled out: Chief Product Officer.
- Not added: testimonials attributed to Amazon or IBM (needs a real, approved quote).

## 46 · Team trimmed, "About us" (2026-11-11)

- Removed Eshwar Naidu, Piyush Yadav and Swarnava Bose from the team grid, the "Real people run it" face row (now built from the team list, so it can't drift again) and the site files; their photos are deleted from the assets. About copy: "The four people who lead every build."
- Menu, footer, breadcrumb and Next/Previous links now say "About us".

## 47 · Live footprint map, calmer team photos, footer (2026-11-11)

- Footer bottom line is now just "© 2026 Ezydrag Private Limited" (cities removed).
- About us: "Where we are / Three cities. Clients worldwide." replaced by "Our footprint: Built in India. Running worldwide." with the live world map: pulsing office pins (Kolkata, Bangalore, Durgapur), dashed arcs with travelling dots from Kolkata to client markets (US, UK, EU), clickable pins with a detail card, and a live "It's 12:59 am in Kolkata right now" clock. Animation pauses off-screen and is off with reduced motion. Cities chosen by the team: offices plus countries.
- Team photos: hover zoom removed (it made faces jump). Hover now only lifts the orange plate slightly; no image scaling.

## 48 · Footprint: brand voice, blinks only (2026-11-11)

"Our footprint: Built with ❤️ in India. Running worldwide." Line: "Somewhere right now, one of our agents is awake: following up a lead in the US, checking consent in the UK, mapping data in the EU. The people who made it are in Kolkata, Bangalore and Durgapur." No mention of offices. Pin cards: "Where agents are made" (Kolkata, Bangalore, Durgapur) and "Where agents work" (US, UK, EU), each with one line in the same voice. Motion removed (no arcs, no travelling dots, no pings); the pins only blink now and then, like the agents' eyes, staggered. Live Kolkata time kept (static, no animation).

## 49 · Orange heart, team cards, visiting agents (2026-11-11)

- Footprint headline uses the orange heart: "Built with 🧡 in India. Running worldwide."
- About us team tiles now match the portfolio cards ("Agents we run today…"): white card, hairline, 20px corners, same hover (border + soft shadow). No zoom, no orange offset plate, no underline sweep. People keep a square photo inside the card; agents show the bot at portfolio size (64px) instead of a big square. Agents fit one row of five on desktop.
- Visiting agents: every 10–12 seconds one of our own agents drifts across the screen with its cursor and a name tag saying what it is doing (e.g. "Ask Ezydrag · answering a question", "Governance Agent · logging an action"), in orange or ink. Inspired by NextDoor.Company's visitor cursors, but it never pretends to be a real visitor. Decorative only: hidden from screen readers, no pointer events, desktop only, off with reduced motion, paused when the tab is hidden.

## 50 · Cursor removed, semantics check, optimisation (2026-11-11)

- Visiting-agent cursors removed (script and styles).
- Semantics re-audited on every page: one h1, no heading skips, every section named, landmarks (header, nav, main, footer, address), dates in `<time>`, images with alt and size, `aria-current` in nav (404 has none by design). axe: 0. SEO lint: 0.
- **Optimisation:**
  - All external scripts load with `defer` (same order, no render blocking).
  - New `tools/optimize.py` runs after the build and minifies CSS and JS in dist with esbuild (sources stay readable).
  - Team photos re-encoded (progressive JPEG, q76) and blog thumbnails quantised (128-colour PNG): images 974 KB → 486 KB.
  - Site folder 3.5 MB → 3.0 MB. The zip no longer includes tools/node_modules (developer dependencies; `npm install` in tools/ restores them): about 19 MB → about 3 MB.
