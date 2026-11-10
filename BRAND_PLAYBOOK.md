# Ezydrag Brand Playbook · v1

**Source of truth:** Figma, "Adaptive logo studio" (file `dBnzNwk8hEzLHSyn1qtsR6`).
**Code mirror:** `brand.py` generates every logo, agent avatar and loader on the site from the same geometry. The live version is `brand.html`.

> If Figma and this file ever disagree, Figma wins. Update `brand.py` to match, then rebuild.

---

## 1. The idea

| Layer | Meaning | Rule |
|---|---|---|
| **Plate** (orange, offset) | The work underneath: what agents do out of sight | Always behind, always down-left |
| **Face** (white, ink stroke) | The tools you know: Marketo, Salesforce, your inbox | Always on top, always rounded |
| **Dot** (orange) | The full stop: a person's decision | Never removed, never recoloured |

**Brand line:** *We do the work underneath. You make the call.*

---

## 2. Logo family

| Version | Use for | File |
|---|---|---|
| Compact mark | Nav, favicon (24px and up), avatars, app icon, slides | `assets/brand/ezydrag-mark.svg` |
| Wordmark | Hero, footer, documents, social, business card | `ezydrag-wordmark.svg` |
| Reverse mark / wordmark | Ink or dark photo backgrounds | `*-reverse.svg` |
| Mono | One-colour print, embossing, fax-grade | `ezydrag-mark-mono.svg` |
| Favicon cut | 16–24px only (thicker stroke, tighter plate) | `ezydrag-mark-16.svg` |

The same mark appears in the nav, curtain, hero diagram, loader, favicon, share image and footer. No other logo artwork is allowed on the site.

---

## 3. Construction (relative to face size F)

- **Face:** F × F, corner radius **F/4**
- **Plate:** same shape, offset **F/8** down-left
- **Stroke:** **F/20**, always ink (white on the reverse version)
- **Glyph:** Inter 500 "e", half the face tall, optically centred, outlined (never typed)
- **Dot:** radius **0.07F**, centre at **(0.79F, 0.71F)**
- **Wordmark:** face height H, "ezydrag" in Inter 500 at 0.62H, dot after the "g", corner radius 0.2H, plate offset ≈ H/9

## 4. Clear space and minimum sizes

- **Clear space:** one plate offset (F/8) on every side.
- **Minimum sizes:**
  - compact mark 28px (nav 40–44px)
  - favicon cut 16–24px
  - wordmark 28px tall

*Confirm against the Figma clear-space and size rules. The file lists minimums down to 16px.*

---

## 5. Colour

| Token | Hex | Use | Contrast on white |
|---|---|---|---|
| Ink | `#2B2E3C` | Text, strokes | 13.6:1 |
| Orange | `#FF9054` | Plates, dots, buttons (fill only) | not for text |
| Orange text | `#B8460F` | Orange words | 5.4:1 |
| White | `#FFFFFF` | Face, main ground | — |
| Mist | `#F5F5F8` | Alternate sections | — |
| Cream | `#F7EFE8` | Portraits, agent grounds | — |

## 6. Type

- **Display:** Bricolage Grotesque 700–800, tight tracking.
- **Body:** Figtree 400–700.
- **Data and terminal:** JetBrains Mono.
- **Logo:** Inter 500, used only as outlined artwork, never typed.

---

## 7. Agents

Agents are the brand tile given a face:

- visor and two orange eyes
- antenna with a status light
- a role badge (a small tile) in the dot's position

| Agent | Badge | File |
|---|---|---|
| List Automation | list | `agent-lists.svg` |
| Email Creation | mail | `agent-emails.svg` |
| Email QA | check | `agent-qa.svg` |
| Lead Nurture | target | `agent-nurture.svg` |
| QBR Generator | report | `agent-qbr.svg` |
| AI PTA | calendar | `agent-pta.svg` |
| Ask Ezydrag | chat | `agent-ask.svg` |

**Rules**
- Never draw agents as people.
- Never give agents human names.
- When an agent appears next to a task, the person who approves it appears too (see the home page's "Agents and people" section).

**Motion**
- Eyes blink about every 5s.
- The antenna light pulses while working.
- On hover, the eyes scan and the badge tilts.

---

## 8. Illustration kit

| Element | Meaning |
|---|---|
| Plain tile with an icon | A system (Marketo, Salesforce, Analytics) |
| The mark | Ezydrag, the context graph |
| Agent avatar | An agent |
| Dashed wire | A connection |
| Orange packet moving along a wire | Data in motion |
| Cluster (main tile + 3 satellites at the golden angle) | Page-hero art |

The hero flow has two layouts: horizontal on desktop, vertical on phones.

## 9. Icons

24px grid, 1.8 stroke, round caps and joins. Ink on white; orange only inside a tile. The full set is shown on `brand.html`.

---

## 10. Motion

| Moment | What happens | Timing |
|---|---|---|
| Curtain | The mark cycles the agents' icons inside the face, with three brand lines ("Connecting your tools", "Doing the work underneath", "Waiting for your decision") and a 0–100% counter. Orange then ink panels lift. | 3.1s, first visit only (every load in review mode) |
| Page wipe | Orange then ink, on exit and arrival | 0.4s |
| Loader | Same mark: face cycles 5 agent icons, plate breathes, dot keeps time | 3s loop |
| Nav logo hover | Plate slides out, face cycles icons once, dot lands | 1.5s |
| Hero | New beat about every second, then a live agent feed every 1.4s | 0–6s, then loop with Pause |
| Chapter rail and "Next" pill | Shows where you are and the next stop, every section | On scroll |
| Client cards | Flip to show what each client runs | 0.35s |

**Rules**
- Linear easing for product motion.
- Only the curtain and wipe use one decelerating curve.
- Anything over 5s can be paused.
- Everything respects reduced-motion settings.

---

## 11. Photography

- Transparent cutouts on cream with a soft orange glow.
- Three-tone ink → warm → cream duotone, with grain baked in.
- Framed with the logo plate (ink border + orange offset).
- People sorted alphabetically.
- Agents use the same frame with a white plate.

## 12. Voice

- Risk before benefit.
- "We + verb + scope" for promises.
- Short sentences, with one human aside per section.
- Evidence over adjectives.

| Write | Not |
|---|---|
| Every send waits for your approval. | Unlock seamless, AI-powered autonomy. |
| In production at RightWave. As of November 2026. | Trusted by leading enterprises worldwide. |
| What our agents can't do. | Our AI never makes mistakes. |

---

## 13. Applications

Social post, slide, document, email signature, app icon and assistant, business card. All are shown on `brand.html`.

## 14. Don'ts

Don't stretch, recolour the plate, rotate, add shadows or effects, retype the wordmark, or place the mark on a busy photo without the reverse version.

## 15. Client logos

Drop real logo files at `src/assets/clients/<slug>.svg` (slugs: `rightwave`, `cerkle`, `eternup`, `nutaan`) and rebuild. The wall switches from typeset names to the real logos automatically.

- Only clients and partners belong on the wall, with written permission.
- Former employers (IBM, Amazon, Verint, HCL) stay under team experience, never under "In production at".
