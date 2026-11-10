# Ezydrag — Positioning and Website Spec (v4)

Status: working draft · Owner: Ezydrag · Last updated: 5 Nov 2026

This spec turns the "does it qualify for Silicon Valley?" review into a plan. It covers positioning, the sitemap, page copy, a second-by-second home page script, the motion system, and the proof and decisions still needed before launch.

---

## 1. The problem with v3

| Gap | Effect on a US buyer or investor | Fix in v4 |
|---|---|---|
| Product or agency? | Read as a dev shop | One wedge, sold as a product with a fixed-scope pilot |
| No proof | No reason to believe | Customers page built around RightWave; metric slots ready to fill |
| India-first compliance | Misses the US baseline (SOC 2) | Security page leads; GDPR, HIPAA and DPDPA move to a sub-page |
| Too many offers | "Still looking for a wedge" | Home sells one thing; Academy, token tools and compliance become supporting pages |
| No real product shown | Feels like slides | Product-state mockups and a live run feed in the hero |
| Atlan-like wording | Derivative | "Context" stays the mechanism; the headline sells the outcome |
| Email-draft forms | No pipeline | "Book a demo" with a configurable booking link plus a brief builder |

---

## 2. Positioning

**Category:** AI agents for revenue operations.

**Wedge (first market):** B2B marketing and RevOps teams running **Marketo and Salesforce**, including marketing-automation agencies (MaaS) that run them for clients.

**One-liner:** Ezydrag runs the repetitive half of RevOps (lists, email builds, QA, nurture and QBRs) across Marketo and Salesforce, and nothing goes out without your approval.

**Why we win (the mechanism):** every agent reads from one **context graph** of your accounts, contacts, campaigns, deals and meeting notes. So agents act with the full picture, cite their sources, and need far smaller prompts.

**What we are not:** a data catalog, an enterprise search tool or a chatbot. Those *find* context. Ezydrag *acts* on it inside the tools RevOps already uses.

**Proof anchor:** RightWave (Marketing Automation as a Service, USA) runs a six-agent RevOps suite on Ezydrag.

### Messaging hierarchy

1. **Outcome (headline):** Your RevOps, minus the busywork.
2. **How (sub):** Agents that clean lists, build and QA emails, nurture leads and write the QBR, across Marketo and Salesforce.
3. **Trust (always next to the CTA):** Every send waits for your approval.
4. **Mechanism (for evaluators):** One context graph behind every agent.
5. **Efficiency (for finance):** Fewer tokens per task; known questions cost zero.
6. **Compliance (for security reviews):** Audit trail, role-based access, GDPR, HIPAA and DPDPA readiness.

### Primary and secondary calls to action

- Primary everywhere: **Book a demo**
- Secondary on the home page: **Watch a run** (scrolls to the live terminal)
- Tertiary: **Start with a pilot** (pricing page)

---

## 3. Sitemap

| Nav item | Page | Job |
|---|---|---|
| Logo | `index.html` | Sell the wedge in 10 seconds |
| Product ▾ | `product.html` (was `context.html`) | How the context graph and pipeline work; live terminal |
| | `data-graph.html` | Interactive graph |
| | `token-optimization.html` | Calculator, FAQ bot, optimization agents |
| Agents ▾ | `agents.html` | The six RevOps agents plus voice and assistant |
| Customers | `customers.html` (replaces Portfolio) | RightWave case, reviews, logo wall |
| Security | `security.html` (new) | Practices, controls, frameworks, security pack |
| Pricing | `pricing.html` (new) | Pilot → Suite → Platform |
| Company ▾ | `about.html`, `academy.html`, `feedback.html` | Team (people and agents), Academy beta, feedback loop |
| FAQ | `faq.html` | Searchable answers |
| Book a demo (button) | `demo.html` (replaces Contact) | Booking link and brief |

Retired: `industries.html` (unfocused), `portfolio.html` and `contact.html` (renamed). `compliance.html` stays, linked from Security.

---

## 4. Home page: second-by-second script

Every beat shows a product fact, not decoration. The timeline uses linear easing and pauses when the tab is hidden. It is skipped for visitors who turn off motion, and a Pause button covers anything that moves for more than 5 seconds (WCAG 2.2.2).

| Time | What moves | What the visitor learns |
|---|---|---|
| 0.0s | Curtain lifts (first visit only) | Brand |
| 0.4s | Pill: "RevOps agents for Marketo + Salesforce" | Who it's for |
| 0.8–1.8s | Headline types in word by word | The outcome |
| 2.0s | Sub-line fades up | What the agents do |
| 2.4s | Orange guide line drops to the CTA, ring pulses once | Where to click |
| 3.0s | Trust line ticks in: "✓ Every send waits for your approval" | It's safe |
| 3.4s | Marketo, Salesforce and Analytics tiles slide in | Works with my stack |
| 4.2s | Wires draw into the Ezydrag tile | One context graph |
| 5.0s | Packets travel to the agent tiles | Agents act on it |
| 6.0s+ | Live run feed: a new agent event every ~1.4s (list cleaned, broken link caught, path awaiting approval, deck drafted…) | It's working right now |
| scroll 1 | Logo strip | Real customers |
| scroll 2 | **Pinned story: "One campaign, start to finish"**. Seven beats, each changing the app mock on the left | The full workflow |
| scroll 3 | Proof counters count up | Scale |
| scroll 4 | Live terminal (15 scenarios, 6 terminal styles) | Depth for evaluators |
| scroll 5 | Pricing teaser → Security strip → CTA | Next step |

### Pinned story beats

1. **A list lands.** 9,640 rows from a webinar. Mixed titles, missing countries.
2. **Cleaned in seconds.** Normalised, deduped against Salesforce, 37 held for missing consent.
3. **Email built.** Draft assembled from approved Marketo blocks; UTMs applied.
4. **QA catches it.** A broken link and an empty token, flagged before anyone sees them.
5. **You approve.** One click. Nothing sends without it.
6. **Nurture adapts.** Each lead gets its own next step; new paths ask first.
7. **The QBR writes itself.** Results flow into next quarter's review deck.

---

## 5. Page copy

### Home
- **Pill:** RevOps agents for Marketo + Salesforce
- **H1:** Your RevOps, minus the busywork.
- **Sub:** Agents that clean lists, build and QA emails, nurture leads and write the QBR.
- **Trust:** Every send waits for your approval.
- **CTAs:** Book a demo · Watch a run
- **Story H2:** One campaign. Start to finish.
- **Proof H2:** In production at RightWave.
- **Pricing teaser H2:** Start with one agent.
- **Final CTA H2:** See it on your stack.

### Product
- **H1:** One context graph. Every agent.
- **Sub:** Your data, rules and history, connected once.

### Agents
- **H1:** Six agents. One RevOps lifecycle.

### Customers
- **H1:** In production, not in a deck.

### Security
- **H1:** Built to pass your security review.

### Pricing
- **H1:** Start with one agent. Grow from there.

### Demo
- **H1:** See it on your stack.

---

## 6. Motion system

- **Library:** GSAP 3.12.5 + ScrollTrigger from cdnjs. `ease: "none"` (linear) everywhere.
- **Rule:** motion only shows sequence, flow or state change. No floating, idle loops or parallax.
- **Durations:** 0.3s small, 0.4s headings, 0.6–0.9s paths and packets. Stagger 0.05–0.12s.
- **Live loops:** hero feed and terminal. Both have Pause; both stop when the tab is hidden.
- **Scroll story:** CSS `position: sticky` plus IntersectionObserver; works without GSAP.
- **Fallback:** with reduced motion or GSAP blocked, every element renders in its final state.

---

## 7. Proof to collect before launch

- [ ] RightWave: written permission to name them and use their logo
- [ ] RightWave: 2–3 numbers (hours saved per week, errors caught before send, list sync time before/after, QBR prep time before/after)
- [ ] One quote from a RightWave stakeholder (name, title)
- [ ] Logo files and permission for Cerkle, Eternup and Nutaan AI
- [ ] Two or three real product screenshots (approval queue, QA report, graph view)
- [ ] A short screen recording of one real agent run (30–60 s)

Until these arrive, the site uses only facts already stated in your materials, and every demo is labelled as sample data.

---

## 8. Decisions needed

1. **Product or custom builds?** v4 assumes product-led with a fixed-scope pilot. If you mainly do custom builds, change the Pricing page and the "Platform" tier.
2. **Pricing:** publish numbers, a "from" price, or "on request"? v4 shows tiers with "Get a quote".
3. **SOC 2:** current status and target date. v4 says "status on request" and offers a security pack.
4. **Booking link:** add a Calendly or HubSpot URL to `src/assets/config.js` (`bookingUrl`).
5. **Email:** confirm `hello@ezydrag.com`.
6. **Lead capture:** connect the demo form to a CRM or form backend (currently opens an email draft).

---

## 9. Build notes

- Static site; `python build.py` writes `dist/`.
- Shared header, footer, icons and art come from `build.py` and `art.py`.
- Motion: `src/assets/motion.js`. Story and feed: `src/assets/story.js`. Academy: `src/assets/sim.js`.
- Accessibility target: axe WCAG 2.2 AA, 0 violations (`python tools/axe.py <pages>`).
