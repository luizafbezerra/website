---
goal: Refine the Mandala dos signos wheel — sector highlighting, rotation, and details panel — within illuminated-manuscript constraints
version: 1.1
date_created: 2026-05-18
last_updated: 2026-05-18
owner: jvsvogler (developer); Luiza Bezerra (content/approval)
status: "Locked"
tags: [feature, design, interaction, accessibility, wheel, zodiac, symbols, locked]
---

# Introduction

![Status: Locked](https://img.shields.io/badge/status-Locked-green)

Originally a brainstorming plan; **now consolidates the locked decisions (see § Locked Decisions, below the Recommendation) alongside the explored option matrix that produced them, kept for historical context.** The plan enumerates options across three coupled threads of the `#simbolos` wheel — (1) on-wheel highlighting of the active sector, (2) rotating the wheel to bring the active sign to a reading position, (3) where and how the per-sign details surface — and proposes two-to-three cohesive end-states that combine one option from each thread. The Symbols section sits in normal-rules territory (the impeccable carve-out applies only to `src/ui/home/Cosmos*`); every option below is therefore measured against the global manuscript brief — painterly not generated, earth pigments, no parametric ornament, trust not urgency. **Locked end-state: Combination Alpha** (A1 desaturate-complement highlight + B5 no rotation + C1+C6 companion card with click-to-pin).

## 1. Requirements & Constraints

- **REQ-001**: The active sector must be visually distinguished on the painted wheel itself, not only via the caption beneath it.
- **REQ-002**: The interaction must work on hover (mouse), focus (keyboard), and tap (touch). All three paths must reach the same end-state.
- **REQ-003**: Per-sign details must include at minimum: Portuguese sign name, date range, element, modality, ruling body, body part (corpo), and one short Jungian-inflected paragraph (1–3 sentences). Placeholder copy is acceptable until Luiza writes the real text, but the placeholders must mark themselves as such (TODO in source, never `lorem ipsum` rendered in the UI).
- **REQ-004**: The wheel must remain navigable with keyboard alone — Tab into the sector group, arrow keys or Tab to step between sectors, Enter/Space to pin/expand, Escape to clear.
- **REQ-005**: The details surface must be semantic HTML (real text in real elements), not images or canvas, so screen readers and AI agents can consume it.
- **REQ-006**: The current `aria-live="polite"` caption pattern is correct and must be preserved or upgraded (e.g. moved into the detail panel).
- **REQ-007**: A NoJS / pre-hydration fallback must be acceptable — at minimum, the painted wheel and a visible list of all 12 signs (with dates) must render without JS. The interactive overlay is progressive enhancement.
- **SEC-001**: No new third-party scripts, no remote font, no analytics ping on hover. Stay within the existing stack (Next.js, React, Tailwind v4, `next/image`, `next/font`).
- **SEC-002**: User-supplied content is bounded to Luiza's curated zodiac text — there is no free-form input, so XSS surface is unchanged.
- **CON-001**: The painted JPG `public/art/wheel.jpg` (640×640, ~300 KB) is the canonical asset; no re-encode, no resprite, no re-bake. The painting itself is immutable in this plan.
- **CON-002**: Architecture boundaries enforced by `scripts/arch-check.sh`: `src/core/` is pure TS (no React/Next imports, no imports from `ui/` or `app/`); `src/lib/` may import React but not `ui/`/`app/`; `src/ui/` consumes core via lib; `src/app/` composes everything. Per-sign content data lives in `core/`; React rendering lives in `ui/`.
- **CON-003**: `prefers-reduced-motion: reduce` must disable rotation, scale, and any non-essential transition. A `motion-reduce:` Tailwind branch already covers transitions; rotation must be JS-gated against the same media query.
- **CON-004**: Performance budget: zero new render-blocking assets. The painted JPG already loads via `next/image`. Any added illustration (e.g. an alchemical Bayer plate per sign) must be lazy-loaded only after the user activates that sign, must be AVIF/WebP, and must fit under 30 KB per asset.
- **CON-005**: The wheel image's radial-oriented painted text (Nakshatra labels outer ring, sign-name glyphs inner ring) is non-rotation-safe — the text is baked into the painting at angles that read correctly only at the painting's current 0° rotation. Rotating the image therefore degrades the inner/outer rings' readability. Any rotation option must either (a) keep the painted image static and rotate something else, or (b) accept the degradation and mitigate it.
- **CON-006**: Impeccable absolute bans that apply to this section: no `border-left`/`border-right > 1px` accent stripes, no gradient text, no glassmorphism elsewhere on the page, no auto-rotating decoration, no parametric mandalas, no AI-generated flourishes, no neon/pastel, no icon row.
- **CON-007**: The brief's "painterly, not generated" pillar applies in full to Symbols (no carve-out). Distinguishing the active sector therefore cannot use CSS-drawn rings, parametric strokes, or gradients painted _onto_ the wheel. The activation cue must feel like it belongs to the painting, not like UI chrome layered on top.
- **CON-008**: WhatsApp-CTA links and external navigation are out of scope for this section — the wheel is a contemplative atlas, not a conversion surface.
- **GUD-001**: Echo the Cosmos popover/marginalia pattern (`src/ui/home/CosmosMarginalia.tsx`) where it transfers cleanly — same `aria-live="polite"`, same hold-displayed-while-fading idiom, same `display-italic`/`tracked-ink`/`marginalia` typography classes. Do not invent a new visual idiom unless the cosmos one fails the test.
- **GUD-002**: 60-30-10 weight rule: 60% parchment + ink for the wheel surround; 30% muted/secondary for the body-italic explainer; 10% accent (terracotta-deep for active state, gilt only if the painting itself uses gilt at that sector).
- **GUD-003**: Front-load semantics. The detail panel's heading should be the sign name (`<h3>`), date range as a `<p class="marginalia">` directly under, fields as a `<dl>` so AI agents can lift them cleanly.
- **GUD-004**: Honor the carve-out boundary: nothing in this plan may export shared utilities to `src/ui/home/Cosmos*` and nothing in this plan may import the cosmos carve-out's licenses (parametric animation, twinkle, projection overlays). Symbols stays on the standard rule set.
- **PAT-001**: Pattern reuse — `aria-live="polite"` caption that holds previous content during exit fade, identical to `CosmosMarginalia` (`displayed` vs `activeSigilId` state).
- **PAT-002**: Pattern reuse — invisible SVG `<path>` sectors as the interactive target, layered above the painting; the painting itself is never an `aria-` target. Currently in place; preserve.
- **PAT-003**: Pattern reuse — `data-active` attribute on the wrapper drives the visual state, not class names. Allows pure-CSS modulation without re-rendering children.
- **PAT-004**: Pattern reuse — single React state holding either a `WheelSign | null` (current) or a `{ sign, pinned: boolean }` object (post-refinement, see below).

## 2. Implementation Steps

### Implementation Phase 1 — Discovery & Option Sketches

- GOAL-001: Produce a deterministic option matrix for each of the three threads (highlighting, rotation, details), with implementation sketches, pros/cons, and a compliance rating against the impeccable rules and a11y/motion constraints.

| Task     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Completed | Date |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-001 | Document Thread A (sector highlighting) options A1–A5 in section "Thread A" below, including SVG-mask-based "desaturate complement" sketch, per-sector clip-path scale lift, painted gilt drop-shadow, vignette-only-rest, and "do nothing on-wheel, rely on caption" baseline. Each option must include: file impact (`src/ui/home/Symbols.tsx` always; possibly `src/core/wheel.ts` for sector path math; `src/app/globals.css` for new tokens), state shape, mouse/focus/touch parity notes, reduced-motion behavior, and one-line impeccable verdict.                               |           |      |
| TASK-002 | Document Thread B (rotation) options B1–B5 in section "Thread B" below, including: rotate the entire wheel image, rotate only the invisible SVG overlay (no visible motion), rotate a gilt pointer/marker around a static wheel, partial counter-rotation (image rotates, inner ring back-rotates via second clipped image layer), no rotation. Each option must specify: how `prefers-reduced-motion` is honored, what happens to the radial text (Nakshatra outer ring + inner glyph names), keyboard pan-key behavior, focus-disorientation risk, and one-line impeccable verdict.   |           |      |
| TASK-003 | Document Thread C (details surface) options C1–C6 in section "Thread C" below, including: right-side companion card (replaces the body-italic paragraph on lg:), below-wheel expanding panel on sm:, modal on click, marginalia-style floating panel adjacent to the wheel, hover-tooltip near cursor (rejected), and progressive disclosure (hover = caption; click = pinned panel). Each option must specify: keyboard pin/unpin pattern, Escape handling, focus-trap requirements, screen-reader announcement strategy, and one-line impeccable verdict.                             |           |      |
| TASK-004 | Decide where per-sign content lives. Three candidates: (i) extend `WheelSign` in `src/core/wheel.ts` with `element`, `modality`, `ruler`, `bodyPart`, `archetype`, `paragraph` fields; (ii) split into a new `src/core/zodiacContent.ts` keyed by `id` so `wheel.ts` stays focused on geometry; (iii) move to Payload as a `Zodiac` collection so Luiza can edit without a deploy. Recommend (ii) for Phase 1 (now) with a clean migration path to (iii) in Phase 2 (when Payload `Zodiac` collection is justified). Rationale captured in "Data location decision" below.              |           |      |
| TASK-005 | Identify the placeholder strategy for per-sign copy. Spec: in `src/core/zodiacContent.ts` each entry has a `paragraph: string` and an `_isPlaceholder: true` boolean. UI does not render the placeholder marker visually but exposes it via a `data-placeholder="true"` attribute on the detail panel so a follow-up content audit can highlight pending signs. Render real Portuguese placeholder copy that is plausibly correct (e.g. Áries → Marte → fogo → cardinal → cabeça) — no `lorem ipsum`, no English.                                                                       |           |      |
| TASK-006 | Identify symbols-as-content vs symbols-as-decoration concern. The painted wheel already carries the sign figure. Adding a small inline Unicode glyph (`♈`) inside the detail panel risks duplicating the figure and reads as chrome. Recommend: do not echo a Unicode glyph in the detail panel; let the painted figure on the wheel be the only image. The detail panel is pure type. Capture in "Symbol echo decision" below.                                                                                                                                                        |           |      |
| TASK-007 | Identify the activation/pinning model. Today: hover/focus sets active; leave/blur clears it. Refinement candidates: (i) leave-to-clear stays (hover-driven only); (ii) hover sets active, click/Enter pins (sticky until Escape, click outside, or click a different sector); (iii) click-only (no hover state). Recommend (ii) — pinning lets the user read the detail without holding the cursor still, matches Luiza's request for "better ways for showing the details", and preserves the current hover-glance affordance. Spec the state transitions in "Activation model" below. |           |      |

### Implementation Phase 2 — Cohesive End-State Combinations

- GOAL-002: Propose 2–3 internally coherent end-states that combine one option from each thread, score each against the impeccable rules + the user's stated dissatisfaction, and recommend one for execution in `wheel-refinement-2.md` (a follow-up implementation plan, not this brainstorming document).

| Task     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Completed | Date |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-008 | Document Combination Alpha — "Static painting, desaturated complement + companion card" — in section "Combination Alpha" below: A1 (SVG mask desaturates the wheel everywhere _except_ the active sector) + B5 (no rotation) + C1 (right-side companion card replaces the body-italic paragraph on lg:, slides below the wheel on sm:). Include pseudo-code sketch of the SVG `<mask>` + filtered `<image>` layering, and the responsive grid layout adjustment to `Symbols.tsx`.                                                                                                                                                                           |           |      |
| TASK-009 | Document Combination Beta — "Rotating overlay marker + pinned marginalia" — in section "Combination Beta" below: A3 (subtle painted gilt drop-shadow on the active sector via SVG `<filter>` clipped to the sector path) + B3 (a gilt pointer/marker rotates around a static painting, landing at the active sector's outer-ring radius) + C4 (marginalia-style floating panel anchored to the sector outer edge, fades in on activation, fades through on swap). Include sketch of the pointer geometry (`<path>` triangle in `OUTER_RADIUS + 14`px ring) and the popover anchor math.                                                                     |           |      |
| TASK-010 | Document Combination Gamma — "Painting rotates, complement dims, modal on pin" — in section "Combination Gamma" below: A2 (vignette-only-rest: a circular mask darkens everything _outside_ the active wedge's polar bounds) + B1 (rotate the entire painted image so the active sector reaches the 12 o'clock reading position) + C3 (modal opens on click/Enter with the full per-sign detail). Capture the cost: B1 violates CON-005 (radial text becomes unreadable mid-rotation), and the modal pattern reintroduces a focus-trap and Escape-to-close — both serviceable, but heavier UX than the current page's reading rhythm. Score Gamma honestly. |           |      |
| TASK-011 | Score each combination against six axes (1=poor, 5=excellent): (i) impeccable compliance, (ii) keyboard a11y, (iii) reduced-motion behavior, (iv) screen-reader clarity, (v) Luiza-content-readability, (vi) implementation cost. Recommend the highest-scoring combination explicitly in section "Recommendation" below. Capture dissenting notes.                                                                                                                                                                                                                                                                                                         |           |      |
| TASK-012 | Document the recommended combination's hand-off contract: which file changes (exact paths, exact section anchors), what data shape lands in `src/core/zodiacContent.ts`, what new Tailwind utility classes (if any) land in `src/app/globals.css`, and what an integration test should cover. Capture in "Hand-off contract" below. The actual implementation belongs to `wheel-refinement-2.md`, written after Luiza answers the open questions in Section 5.                                                                                                                                                                                              |           |      |

### Implementation Phase 3 — Decision Capture

- GOAL-003: Lock open questions and surface them to Luiza in a single message so the implementation plan can be written immediately on her reply, with no further round trips.

| Task     | Description                                                                                                                                                                                                                                                                                                                                                    | Completed | Date |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-013 | Compile the open-questions list (Section 5 of this plan) into a single message for Luiza in pt-BR, framed as binary or 3-way choices rather than open prompts (e.g. "Você prefere A ou B?", not "Como você imagina o detalhe?"). Includes: rotate-the-painting acceptable Y/N; modal vs companion card vs marginalia; per-sign archetype paragraph commission. |           |      |
| TASK-014 | Compile the verification matrix (Section 6 of this plan) into a single browser-test checklist runnable in `chrome-devtools-mcp:chrome-devtools` once `wheel-refinement-2.md` ships, covering: keyboard navigation, screen-reader output, reduced-motion mode, lg vs sm breakpoints, lighthouse a11y score regression check.                                    |           |      |
| TASK-015 | Confirm the boundary with `scripts/arch-check.sh`: per-sign content in `src/core/zodiacContent.ts` (pure TS, no React, no Next), consumed by `src/ui/home/Symbols.tsx` via `import { ZODIAC_CONTENT } from "@/core/zodiacContent"`. Run `bash scripts/arch-check.sh` mentally and confirm it would pass.                                                       |           |      |

---

## Thread A — Sector highlighting on the painted wheel itself

The user's complaint: today, hover only desaturates the _whole_ image and updates the caption. The active wedge does not visually distinguish itself on the wheel. CON-007 bans CSS-drawn rings/strokes/gradients painted onto the wheel; CON-005 reminds us the painting has radial text that breaks under transforms. Options below are ordered roughly from "feels most native to the painting" to "feels most like UI chrome."

### Option A1 — "Desaturate the complement" via SVG mask

**Description.** Invert today's effect. Today the whole image desaturates when _anything_ is active; instead, when a sector is active, the desaturate filter applies to everything _except_ the active sector's annular polygon. Mouse-out → no filter on anything (default state). Mouse-in/focus → active wedge stays full-saturation, rest of the wheel sits at `saturate(0.65) brightness(0.95)` (the current global value).

**Implementation sketch.**

- File: `src/ui/home/Symbols.tsx`. No change to `src/core/wheel.ts` (existing `sectorPath()` already produces the annulus we need).
- Render two stacked SVG `<image>` layers inside the existing `<svg>`:
  - Bottom layer: full image, with `filter="url(#wheel-desat)"` always applied when `active` is non-null.
  - Top layer: same image, no filter, clipped to a `<clipPath>` whose `<path>` is the active sector's annular polygon. When `active` is null, the clip path is empty (the layer renders nothing).
- An SVG `<filter id="wheel-desat">` definition holds the existing `saturate(0.65) brightness(0.95)` as `<feColorMatrix>` + `<feComponentTransfer>`. (`feColorMatrix type="saturate"` for the desat; `feComponentTransfer` for the brightness.)
- The `<clipPath>` id is per-sector (`wheel-clip-{id}`) — twelve clip paths defined once, the active one referenced by the top image.
- The current `cursor` sectors stay as the top-most invisible event surface, unchanged.

**Pros.** Inverts existing behavior with no new visual language — the page still uses saturation + brightness for the only-active vs everything-else contrast, the same axes already in flight. No stroke, no ring, no gradient. The painting itself becomes the activation cue: the active wedge stays _brighter and warmer_ than its neighbors, exactly the "illuminated" half of the manuscript metaphor.

**Cons.** Mask edges along the polygon may show a faint discontinuity at the boundary if the painted brushstrokes cross the sector line (which they will — the painter did not work to a 30° grid). Mitigation: feather the clip-path edge with a small radial `<feGaussianBlur>` on the mask alpha, ~1.5px. Cost: one extra `<feGaussianBlur>` in the filter, negligible perf.

**Impeccable verdict.** Strongest match. The cue is _of_ the painting, not laid on top of it. Earth pigments stay earth pigments; the desat is the only existing motion in the section and we keep using it. Score: 5/5.

**A11y.** Identical to today — the SVG sector buttons retain `role="button" tabIndex={0} aria-label="{label}, {dateRange}"`. Screen readers do not see the visual change; they hear the caption update via `aria-live="polite"` (preserved).

**Reduced-motion.** The mask/filter swap is instantaneous on activation; the _transition_ between desat and full-color is what carries motion. Wrap the `filter` CSS in `motion-reduce:transition-none` to disable the cross-fade, but the filter still applies. Visual instant-snap on reduced-motion is acceptable — it's not gratuitous motion, it's a state indicator.

### Option A2 — "Vignette the rest" (radial darken outside the wedge polar bounds)

**Description.** Don't desaturate the rest; gently _darken_ it via a partial radial mask. Active wedge stays at full luminance; the rest of the wheel drops 15–20% via a black overlay clipped to the _inverse_ of the active sector. This is closer to the candle-lit-page metaphor: a real reading lamp would lift the visible sector without altering its color.

**Implementation sketch.**

- File: `src/ui/home/Symbols.tsx`. Same dual-layer SVG approach as A1, but the top layer is a `<rect width="640" height="640" fill="rgba(0,0,0,0.18)"/>` clipped to the _inverse_ of the active sector (using `clip-rule="evenodd"` with a viewBox-rect outer path plus the sector path as a hole).
- No `<feColorMatrix>` filter needed — pure alpha overlay.

**Pros.** Lower CSS surface than A1. The "lamp" metaphor is a clean alignment with the manuscript brief.

**Cons.** A flat alpha overlay on the rest of the painting reads slightly more "UI-chromey" than A1 because it adds a tone the painter did not — A1 stays within the painting's own color space. A2 also makes the wheel _darker overall_ when something is active, which fights the parchment-brightness rhythm of the page.

**Impeccable verdict.** Acceptable but slightly weaker than A1. Score: 4/5.

**A11y / reduced-motion.** Same as A1.

### Option A3 — "Painted gilt drop-shadow" via SVG `<filter>` clipped to the active sector

**Description.** Apply a soft warm drop-shadow to _the active sector only_, rendered as a SVG filter that combines `<feGaussianBlur>` + `<feFlood>` (with gilt color `oklch(0.75 0.13 80)`) + `<feComposite>`. The wedge appears to glow faintly, as if a gilt leaf catches lamp-light. The rest of the painting is untouched.

**Implementation sketch.**

- Top layer is a `<use href="#wheel-image-full"/>` clipped to the active sector and filtered with `url(#wheel-gilt-glow)`.
- The glow is offset 0, radius 8–12, opacity 0.35 — small enough to read as a halo, not a CSS button glow.

**Pros.** The cue is small and warm — close to a painter's choice. Pairs well with rotation options that bring the sector to top-center (the glow becomes the "spotlight" metaphor).

**Cons.** Halo bleed outside the wedge boundary will overlap neighboring sectors' painted figures, possibly making them look softly shadowed when they shouldn't be. Hard to tune without seeing the painting at runtime. Risk: reads as "neon", which we banned (CON-006).

**Impeccable verdict.** Borderline. Score: 3/5. Only acceptable if the radius is small enough that no human reading reads "glow"; the threshold is delicate and requires hand-tuning per the painting's existing palette.

**A11y / reduced-motion.** Identical to A1; the glow appears via `filter` swap, transition wrapped in `motion-reduce:transition-none`.

### Option A4 — "Lift the sector" via subtle scale/translate on the active sector

**Description.** Re-render the active sector's region as a clipped `<image>` and animate it with a small `transform: scale(1.015) translate(0, -2px)` — the painting fragment lifts ~1.5%, like a torn paper edge raised an inch from the table.

**Implementation sketch.**

- Top layer is the wheel image, clipped to the active sector path, with `style.transform` driven by `data-active` on the wrapper.
- The CSS transition is `transform 200ms cubic-bezier(0.2,0.8,0.2,1)`.

**Pros.** Tactile. Hints at "this is the one you're holding" without any colour change. Pairs nicely with C2 (panel expands below).

**Cons.** Inevitably exposes the painting _beneath_ the lifted fragment along the wedge boundary — there is no painting beneath, so the page parchment / wheel image's lower layer shows through, creating a faint visible gap that reads as a glitch. To hide it we'd have to render the _full_ wheel image twice (one below, one clipped on top), accepting the bandwidth doubling (the JPG is ~300 KB and reused, so cache-friendly). Also: motion in this section is a deeper question than just `prefers-reduced-motion` — the brief is "slow first impression, trust not urgency". A subtle scale on every hover may cumulatively read as fidgety.

**Impeccable verdict.** Risky. Score: 3/5. The transform is small enough to be subtle but the cumulative effect across hover-jumps is the failure mode.

**A11y.** Identical to A1. **Reduced-motion.** Snap to the lifted position instantly (no `transform` transition); the lift is still visible. Or, on reduced-motion, fall back to A1 (no lift). Recommend the latter — reduced-motion users get the simpler visual.

### Option A5 — "Baseline: no on-wheel highlight, caption only" (the current state, kept for honesty)

**Description.** Do nothing different on the wheel. The caption beneath identifies the active sign; the wheel itself never indicates which sector is being read.

**Pros.** Zero implementation. No risk of breaking the painterly aesthetic.

**Cons.** Exactly what the user complained about. This is not a real candidate; it's listed so the option matrix is complete.

**Impeccable verdict.** Compliant but rejected by the user. Score: 1/5 (compliance) — but it fails REQ-001. Drop.

### Thread A recommendation

**A1 (desaturate the complement)** is the strongest match against impeccable + a11y + the user's stated dissatisfaction. **A3 (gilt glow)** is a possible secondary cue paired _with_ A1 — a small additional warmth on the active wedge atop A1's contrast — if Luiza wants a brighter focus moment, but it is not required and may push toward "glow / neon." Default plan: A1 alone; A3 as a tunable add-on flag.

---

## Thread B — Rotating the wheel to bring the active sign to a reading position

The fundamental constraint: **CON-005** — the painted text on the wheel (Nakshatra labels on the outer ring, sign-name glyphs on the inner ring) is oriented radially, baked into the JPG at fixed angles. Any rotation of the image rotates that text out of its design orientation, making the _Nakshatras_ in particular legible only at the wheel's resting rotation. This is the central tradeoff every B option negotiates.

### Option B1 — Rotate the whole painted image to bring the active sector to 12 o'clock

**Description.** When a sector activates, rotate the entire `<Image>` (and the SVG overlay in lock-step) so the active sector's center-angle lands at the top of the canvas. Caption + detail panel sit below the wheel; the active sign is now centered above the panel as if framed by the page's eye-line.

**Implementation sketch.**

- `transform: rotate({rotationDeg}deg)` on both the `<Image>` wrapper and the SVG `<svg>` element. `rotationDeg = -90 - signSvgAngle(active)` (or equivalent — the math lands the center-angle at SVG-coordinate −90°, which is 12 o'clock).
- Transition: `transform 600ms cubic-bezier(0.3, 0.0, 0.2, 1)`. 600ms is longer than the existing 300ms filter transition so the rotation feels deliberate, not snappy.
- Sector event handlers stay the same — they fire from the rotated SVG path's hit-box, which is co-rotated.

**Pros.** Directly addresses the user's "spin the wheel so I can see the part I'm interested in". Reading a horoscope is a near-universal expectation of "this thing rotates"; the canonical reading position is implicit in the user's request.

**Cons.** Violates CON-005 head-on: the Nakshatra labels (which the user explicitly noted are "tiny but content") read upside-down or sideways at most sector positions. Mitigation candidates: (i) accept the degradation — the Nakshatras are non-interactive anyway; (ii) fade the outer Nakshatra ring out during rotation and back in only when no sector is active; (iii) introduce a counter-rotating SVG label overlay that re-types the Nakshatras at the correct readable orientation (significant work and reintroduces "parametric ornament" — CON-006).

**Impeccable verdict.** Direct violation of the brief's "painterly, not generated" principle if the painted text becomes unreadable, _and_ introduces sustained programmatic motion (300ms+ rotation on every hover) that fights "trust not urgency". Score: 2/5.

**A11y.** Keyboard navigation produces 12 consecutive 30° rotations during a Tab-through, which can disorient. Screen-reader users get no visual rotation but the focus order is unchanged; not a screen-reader concern, but a vestibular one. **Reduced-motion.** Must be fully disabled — snap to the same orientation on every focus is jarring; the better reduced-motion fallback is to suppress rotation entirely and fall back to A1 + C1.

**Recommendation.** Reject unless Luiza explicitly says yes to "the Nakshatras can be unreadable mid-rotation."

### Option B2 — Rotate only the invisible SVG overlay; painting stays still

**Description.** The painting does not move. The invisible interactive `<path>` sectors stay aligned with the painting (no visible rotation), so this option _adds nothing visible_ and is therefore equivalent to B5 (no rotation). Listed only because the brief asked for an "overlay-only rotation" candidate — on examination it collapses to no-op.

**Verdict.** Drop. Not a real option.

### Option B3 — A gilt pointer/marker rotates around a static painting

**Description.** A small painted-style gilt triangle (or hand-drawn arrow asset) sits just outside the painting's outer edge. When a sector activates, the pointer animates along the outer-ring radius from its previous position to point at the active sector's center-angle. The painting itself never rotates; the pointer is the indication of "which one are we reading."

**Implementation sketch.**

- A second `<svg>` layer sits in the same wrapper, at the same viewBox. Inside it, a single `<path>` or `<image href="/art/wheel-pointer.png">` is placed at `polar(OUTER_RADIUS + 24, signSvgAngle(active))`, rotated to point inward.
- Transition: `transform 480ms cubic-bezier(0.3,0,0.2,1)`. Length is shorter than B1 because the pointer is small — its motion is forgivable where rotating the entire wheel is not.
- Resting state (no active sector): pointer fades out via opacity.

**Pros.** The painting stays painterly; the "what am I looking at" cue is unmistakable; the pointer can be a tiny commissioned hand-painted asset (one PNG) so it stays painterly itself. Reduced-motion fallback is trivial — snap to the active sector with no transition.

**Cons.** Requires one more painted asset commissioned by Luiza (a small gilt-style pointer). If the asset isn't ready, a parametric SVG `<path>` triangle is the only fallback — and that re-introduces "parametric ornament" (CON-006). Mitigation: make the parametric fallback a temporary `painted-fallback` flag that ships only when the painted asset is ready; if not, do not ship the pointer (fall back to A1 alone). Edge case: when no sector is active the pointer should disappear, not park at the last position — confirms the "the pointer is following you" framing.

**Impeccable verdict.** Strong, _conditional on_ a commissioned painted pointer asset. Without it, it slips to 2/5. Score: 4/5 with the painted asset.

**A11y / reduced-motion.** Pointer position snap on reduced-motion. Pointer is purely decorative for screen-reader users (the caption + detail panel still carry the semantics).

### Option B4 — Hybrid: image stays, only inner-ring back-rotation

**Description.** Render the painting twice: (i) a static base image; (ii) an inner-ring-only crop (radius 0 → INNER_RADIUS) rendered as a separate `<image>` element. When rotation engages, the _outer_ base stays static, the _inner_ crop rotates so the central glyph names + Earth orient differently. This is the painterly equivalent of an armillary's two coaxial rings.

**Impeccable verdict.** Reject. The painting was conceived as one piece by the artist; splitting it into co-rotating layers contradicts the painterly principle just as severely as B1, and the dev cost (separate inner-disc PNG cutout, mask alignment math, transition synchronization) is higher than every other option. Score: 1/5.

### Option B5 — No rotation; reading position is the panel, not the wheel orientation

**Description.** The wheel never moves. The "canonical reading position" the user wants is established by the _companion detail panel_ (Thread C, C1 or C4), not by rotating the painting. The user sees the active sector highlighted on the wheel (Thread A) and reads about it in a fixed panel to the right (lg:) or below (sm:).

**Pros.** Fully painterly-compliant; no motion budget consumed; no CON-005 cost; trivial reduced-motion handling. The user's stated need — "see the sign/part they're more interested on" — is answered by _highlighting_ (Thread A) and _details_ (Thread C), not by physically rotating.

**Cons.** Defies the user's literal request ("we're also not spinning the wheel"). Mitigation: the brainstorming prompt explicitly asked us to re-evaluate whether spinning is the right answer, so this option is the principled push-back. We owe the user a clear case.

**Impeccable verdict.** Strongest match against the brief. Score: 5/5.

### Thread B recommendation

**B5 (no rotation)** is the impeccable-aligned answer; **B3 (gilt pointer)** is the acceptable compromise if Luiza wants visible "which one are we on" motion. **B1 (rotate the whole wheel)** is rejected for CON-005 + the trust-not-urgency principle unless Luiza explicitly accepts the Nakshatra readability cost. Default: B5; B3 as the upgrade if Luiza wants spin.

---

## Thread C — Where and how the details surface

The current caption (`{sign} · {dateRange}`) is too thin. The user wants substantive per-sign content. Options below differ in _position_, _trigger_, and _persistence_.

### Option C1 — Right-side companion card on lg:, below on sm: (replaces body-italic explainer)

**Description.** Today the lg: layout is a `grid-cols-[auto_1fr]` with the wheel on the left and a body-italic paragraph on the right explaining the section. After refinement, the right column becomes a _companion card_ that:

- When no sector is active: shows the existing intro paragraph (unchanged framing).
- When a sector is active: cross-fades to the per-sign detail (heading = sign name `<h3>`, marginalia line = date range, `<dl>` of element/modality/ruler/body part, italic paragraph). When the user moves to another sector, the card swaps content (with a 160ms held-displayed fade — pattern from `CosmosMarginalia.tsx`).
- When the user clicks/Enter-presses a sector: same content, but pinned (sticky against mouse-out) until Escape or another click.

On sm:, the companion card slides _below_ the wheel rather than next to it. The card's vertical position is `mt-8` below the wheel; the caption sits above the card (between the wheel and the card).

**Implementation sketch.**

- File: `src/ui/home/Symbols.tsx`. Extract a `WheelDetail` subcomponent (still in the same file unless it grows; the rest of `Symbols.tsx` is ~130 lines and one component split is fine).
- State shape: `{ sign: WheelSign | null, pinned: boolean }`. Hover/focus sets `{ sign, pinned: false }` if `pinned === false`. Click/Enter sets `{ sign, pinned: true }`. Escape sets `{ sign: null, pinned: false }`.
- Imports `ZODIAC_CONTENT` from `@/core/zodiacContent`. Looks up `ZODIAC_CONTENT[sign.id]` for the per-sign body.
- The cross-fade idiom mirrors `CosmosMarginalia` — `displayed` (held) vs `active` (live), 160ms swap on change.
- Typography: `display` for the `<h3>`; `marginalia` for the date range; `tracked-ink` (small-caps display) for the `<dt>` labels; `body-italic` for the paragraph; all existing classes from `globals.css`, nothing new.

**Pros.** Single coherent layout, no overlay, no modal, no z-index. Both columns are equal landscape citizens. Reading rhythm of the page is unbroken — the user's eye already moves left-to-right at the section level. Trivially keyboard-accessible (no focus trap, no Escape requirement _except_ to unpin). Strong AI-agent semantics — `<h3>` + `<dl>` reads as a clean record.

**Cons.** The companion card replaces the body-italic intro paragraph, which is itself nice writing. Mitigation: keep the intro paragraph as the _default_ state of the right column (i.e. when no sector is active, the intro shows; activating a sector swaps to detail). This is what the spec above already does.

**Impeccable verdict.** Strongest match. Score: 5/5.

**A11y.** Focus order: section heading → marginalia tagline → wheel sector buttons (12, tab-able) → companion card (announces via `aria-live="polite"` and `aria-atomic="true"` on swap). Enter/Space pins, Escape unpins. Screen-reader users hear the new content read on every swap.

**Reduced-motion.** Cross-fade disabled; instant content swap.

### Option C2 — Expanding panel below the wheel (sm: default, lg: optional)

**Description.** Below the wheel, an accordion-style panel expands when a sector is activated, then contracts when deactivated. On lg: the body-italic intro stays to the right; the detail goes below the wheel.

**Pros.** Lets the intro paragraph stay in its current right-column place permanently.

**Cons.** The expand/contract animation is exactly the kind of programmatic motion the brief discourages ("editorial pacing"). On sm: the layout becomes wheel-then-detail-then-intro-paragraph which is fine; on lg: the detail-below-wheel split forces eye motion in a Z pattern. Two layouts, two reading models — more code, more drift.

**Impeccable verdict.** Acceptable but redundant with C1. Score: 3/5.

### Option C3 — Modal on click

**Description.** Hover/focus updates the caption (today's behavior preserved); clicking opens a modal overlay with the full detail. Escape closes.

**Pros.** Lets the detail surface be larger (the full Bayer plate from `references/`, a longer paragraph). Click affordance is universal.

**Cons.** Modals are the heaviest UX in our toolbox. They demand a focus trap, an Escape handler, a backdrop close, and they fragment the page into "page" + "panel" — the manuscript brief is the opposite: a single, slow, continuous read. A modal also breaks the "front-load the page" principle for AI agents — the per-sign content lives behind an interaction state that crawlers do not exercise. Mitigation: render the modal content as a `<dialog>` element with a static fallback for SSR so the per-sign content is in the DOM regardless of interaction, but the _visual chrome_ is modal. This works but is more engineering than C1 for no clearer reading model.

**Impeccable verdict.** Acceptable for content that won't fit elsewhere; here C1 fits all the content we plan to ship. Score: 3/5.

### Option C4 — Marginalia-style floating panel anchored to the wheel

**Description.** Echo the Cosmos popover pattern (`cosmos-sigil-popover` in `globals.css`). A small parchment-toned card floats adjacent to the active sector — anchored just outside the wheel's outer radius at the sector's angle, so it reads as marginalia annotating the page.

**Pros.** Most beautiful option visually — directly evokes "marginalia in a book." Mirrors a pattern already in the codebase.

**Cons.** Twelve possible anchor positions × responsive widths makes the popover-doesn't-clip-the-viewport problem hard: at sector angles near 6/12 o'clock the popover wants to sit above/below the wheel; at 3/9 o'clock the popover wants to sit beside it. Cosmos solves this with rAF projection because its sigils are on a 3D scene; the wheel is flat 2D and the geometry is simpler but still requires position-per-sector logic. Also, the popover is _non-interactive_ in Cosmos (`pointer-events: none`) — for our case the panel must be readable, so pointer events must reactivate, which means swap edge cases (mouse moves from sector → onto panel → back to sector or out).

**Impeccable verdict.** Beautiful but logistically more expensive than C1 for marginal aesthetic gain. Score: 4/5.

### Option C5 — Hover-only tooltip near the cursor

**Description.** A small tooltip follows the cursor.

**Verdict.** Rejected per the brief — hover-near-cursor tooltips are a generic UI pattern, never a manuscript pattern. Also fails keyboard parity (a tooltip following the cursor is meaningless without a cursor). Drop. Score: 1/5.

### Option C6 — Progressive disclosure: hover shows light caption, click pins/expands a full panel

**Description.** Two-tier. Tier 1 (hover/focus): the existing `aria-live` caption updates. Tier 2 (click/Enter): a detail panel slides into place (could be C1's companion card or C3's modal) and stays until Escape.

**Pros.** Matches Luiza's literal request ("better ways for showing the details") with a clean separation — a glance for browsing, a click for committing. The tier-1 caption preserves the current low-friction discovery; the tier-2 panel adds depth without forcing it on every hover.

**Cons.** Two activation patterns to teach the user. Mitigation: the marginalia line below the wheel ("Passe o cursor — ou navegue com o teclado — por uma das doze figuras") can extend to "Toque ou clique para fixar os detalhes" — three actions, one sentence.

**Impeccable verdict.** Excellent. Score: 5/5. This is C1 + a tier-1 caption preserved; functionally these compose.

### Thread C recommendation

**C1 + C6 combined** — the companion card swaps on hover/focus (tier 1), pins on click/Enter (tier 2). The intro paragraph is the _default_ state of the right column. This combination is what the rest of this plan assumes unless an open question changes it.

---

## Combination Alpha — "Static painting, desaturated complement + companion card"

A1 (SVG mask desaturates the complement) + B5 (no rotation) + C1+C6 (companion card with hover-update / click-pin).

**Sketch.**

```
[wheel]                     [companion card]
- painted JPG (static)      default state: body-italic intro paragraph
- SVG overlay with 12       active state: <h3>{sign name} <p class="marginalia">{date range}
  invisible <path> targets    <dl>{element, modality, ruler, body}</dl>
- SVG mask: full image        <p class="body-italic">{paragraph}</p>
  desaturated, top image      pinned indicator (subtle): faint warm tinted background
  clipped to active sector    on data-pinned="true", no separate "pin/unpin" button
                              (Escape unpins; clicking same sector unpins; clicking
                              another sector swaps + stays pinned).
[caption]
- aria-live="polite"
- "{sign} · {dateRange}"
```

**State.** `{ sign: WheelSign | null, pinned: boolean }` in `Symbols.tsx`. Handlers below.

| Event                            | Current state                        | Next state                                   |
| -------------------------------- | ------------------------------------ | -------------------------------------------- |
| onMouseEnter(sector)             | `{ null, false }`                    | `{ sector, false }`                          |
| onMouseEnter(sector)             | `{ s, false }` (s ≠ sector)          | `{ sector, false }`                          |
| onMouseEnter(sector)             | `{ s, true }` (pinned, any s)        | no change (pinned wins)                      |
| onMouseLeave(sector)             | `{ sector, false }`                  | `{ null, false }`                            |
| onMouseLeave(sector)             | `{ sector, true }`                   | no change (pinned wins)                      |
| onFocus(sector)                  | any                                  | `{ sector, false }` if not pinned else no-op |
| onClick / Enter / Space (sector) | `{ null, _ }` or `{ s ≠ sector, _ }` | `{ sector, true }`                           |
| onClick / Enter / Space (sector) | `{ sector, true }`                   | `{ sector, false }` (toggle off)             |
| Escape (anywhere)                | any                                  | `{ null, false }`                            |

**Impeccable verdict.** Composite score: 5+5+5/15 = 15/15 (per the recommendations above). The cleanest combination.

## Combination Beta — "Rotating overlay marker + pinned marginalia"

A3 (gilt drop-shadow on active sector) + B3 (gilt pointer rotates around static wheel) + C4 (marginalia popover anchored to outer edge).

**Sketch.** Painting stays put. A small painted-style gilt pointer (or its temporary parametric `<path>` fallback) glides along the outer-ring radius to point at the active sector. The active sector itself catches a faint warm glow. A small parchment card with the detail floats just outside the wheel, anchored to the sector's outer angle, repositioning across the 12 possible angles.

**Trade-offs vs Alpha.** Visually more romantic — the pointer + glow + marginalia card is an illustrated-manuscript trio. Engineering cost is higher (pointer transition, popover repositioning) and dependent on a commissioned pointer asset. Without the painted pointer, Beta degrades to "parametric SVG triangle" which violates the painterly principle.

**Impeccable verdict.** Composite score: 3+4+4/15 = 11/15 with painted pointer; 2+2+4/15 = 8/15 without it.

## Combination Gamma — "Painting rotates, complement dims, modal on pin"

A2 (vignette the rest) + B1 (rotate the wheel) + C3 (modal on pin/click).

**Sketch.** On hover, the painting rotates to bring the active sector to 12 o'clock; the rest of the wheel dims slightly; the caption updates. On click, a modal opens with the full detail.

**Trade-offs vs Alpha.** Most directly answers the user's literal request ("spin the wheel"), but accepts the radial-text readability cost (Nakshatras unreadable mid-rotation, CON-005) and the modal-introduces-focus-trap cost. Heaviest of the three.

**Impeccable verdict.** Composite score: 4+2+3/15 = 9/15. The rotation cost is the dominant penalty.

## Recommendation

**Combination Alpha** is the recommended end-state. It directly addresses the three threads of the user's complaint:

1. _Highlight_: Alpha's A1 makes the active sector unmistakable on the wheel without any CSS-drawn ornament.
2. _Rotate_: Alpha's B5 does not rotate the wheel, on the principled grounds that rotating breaks the painted radial text (CON-005) and the canonical reading position can be established by the companion panel rather than by physical rotation of the painting. **This is a re-evaluation of the user's stated wish**, and we owe Luiza an explicit explanation (see open questions, Section 5, Q1).
3. _Details_: Alpha's C1+C6 puts the full detail in the right column on lg: / below on sm:, with hover-glance + click-pin progressive disclosure.

If Luiza overrides the rotation re-evaluation and confirms she wants visible "the wheel spins toward the sign," **fall back to Combination Beta with the painted pointer** (B3) — the painting still doesn't rotate, but a pointer-style indicator carries the same affordance. **Reject Gamma** unless Luiza also confirms the Nakshatra-readability cost is acceptable.

## ✅ Locked decisions (2026-05-18)

Confirmed in-session via AskUserQuestion:

- **Rotation (Q1)** → **B5, no physical spin.** Highlight + companion panel do the reading-position work. Painted radial text (Nakshatras + inner glyphs) stays readable at all times. Pointer-asset compromise (Beta) explicitly declined.
- **Details surface (Q2)** → **C1+C6, right-side companion card on `lg:` / below on `sm:`.** Replaces the body-italic intro paragraph when a sector is active. No modal. No floating marginalia popover. Hover/focus updates the panel for a glance; click/Enter pins it.
- **Pinning (Q3)** → **Yes.** Click/Enter pins; second click on the same sector unpins; Escape clears. Hover/focus while pinned does not change the active sign (pin wins).
- **Per-sign content fields (Q4)** → **Ship with plausible Portuguese placeholders** for all 12 signs, every entry marked `_isPlaceholder: true`. Canonical Western correspondences (element, modality, ruler, body part, archetype) populate as facts; the `paragraph` field carries placeholder copy until Luiza writes the real text. No `lorem ipsum`, no English.
- **Nakshatras (Q5)** → Decorative for now. No new interactivity on the outer ring. Revisited in a later plan if the content surfaces.

These answers commit the plan to **Combination Alpha**. The Hand-off contract below is now the executable spec; § 3–7 still apply as written. § 8 ("Open questions for Luiza") is superseded by the answers here and is preserved only for traceability — see § 8 footer.

## Hand-off contract — executable implementation spec

### Files to modify

- **`src/ui/home/Symbols.tsx`** — main rewrite. Specifically:
  - Swap state from `useState<WheelSign | null>` to `useState<{ sign: WheelSign | null; pinned: boolean }>`.
  - Replace the single `<Image>` + CSS-`filter` approach with **two SVG `<image>` layers** inside the existing `<svg>`:
    - Base layer (`<image href="/art/wheel.jpg">`), `filter="url(#wheel-desat)"` applied when `active.sign !== null`.
    - Top layer (`<image href="/art/wheel.jpg">`), no filter, `clip-path="url(#wheel-clip-{active.sign.id})"` when `active.sign !== null`.
  - Add a `<defs>` block: one `<filter id="wheel-desat">` (feColorMatrix saturate=0.65 + feComponentTransfer slope=0.95, optional 1.5px alpha blur to feather sector seams) plus twelve `<clipPath id="wheel-clip-{id}">` built from `WHEEL_SECTOR_PATHS` (see `wheel.ts` change below).
  - Keep the 12 invisible interactive `<path>` sectors on top as the event surface.
  - Add `onClick` + `onKeyDown` (Enter/Space toggle pin, Escape clear) to each sector path. Escape should also fire from a section-level handler so it works whenever any descendant has focus.
  - Extract a `WheelDetail` subcomponent (same file) that renders the companion card. State of right column:
    - `active.sign === null` → existing body-italic intro paragraph + extended marginalia hint line (`"Passe o cursor — ou navegue com o teclado — por uma das doze figuras. Toque para fixar os detalhes."`).
    - `active.sign !== null` → `<h3 className="display">{sign.label}</h3>` + `<p className="marginalia">{sign.dateRange}</p>` + `<dl>` rows (`tracked-ink` `<dt>` + `display-italic` `<dd>`) for _elemento_, _modalidade_, _regente_, _corpo_, _arquétipo_ + `<p className="body-italic">{paragraph}</p>`.
  - Cross-fade idiom mirrors `src/ui/home/CosmosMarginalia.tsx` (`displayed` vs `active`, 160ms swap timer). `aria-live="polite" aria-atomic="true"` on the card wrapper announces swaps.
  - The existing `<output aria-live="polite">` strip below the wheel stays — sources its content from `displayed` so it doesn't blank during the fade.

- **`src/core/wheel.ts`** — add geometry helpers (do not change existing exports):
  - Lift `polar()`, `sectorPath()`, `signSvgAngle()` from the current `Symbols.tsx` into this file (they're pure TS and belong in `core/`).
  - Export a memoized `WHEEL_SECTOR_PATHS: Record<WheelSign["id"], string>` derived once from `WHEEL_ZODIAC`. The component imports this directly instead of recomputing on every render.

- **`src/core/zodiacContent.ts`** — **NEW**. Pure TS, no React/Next, no `ui/`/`app/` imports.

  ```ts
  import type { WheelSign } from "./wheel";

  export type Element = "fogo" | "terra" | "ar" | "água";
  export type Modality = "cardinal" | "fixo" | "mutável";

  export type ZodiacContent = {
    element: Element;
    modality: Modality;
    ruler: string; // pt-BR planet name
    bodyPart: string;
    archetype: string; // 1–3 words
    paragraph: string; // 1–3 sentences
    _isPlaceholder: boolean;
  };

  export const ZODIAC_CONTENT: Record<WheelSign["id"], ZodiacContent> = {
    aries: {
      element: "fogo",
      modality: "cardinal",
      ruler: "Marte",
      bodyPart: "cabeça",
      archetype: "O iniciador",
      paragraph:
        "Áries marca o impulso que rompe a inércia — a coragem de começar antes de ter certeza. Na escuta analítica, costuma aparecer quando algo na vida pede um ato, não mais uma reflexão.",
      _isPlaceholder: true,
    },
    // 11 more entries with canonical Western correspondences + plausible pt-BR paragraph placeholders.
  };
  ```

  All 12 entries ship with `_isPlaceholder: true`; canonical fields (element/modality/ruler/bodyPart/archetype) are facts and stay; `paragraph` field is the swap target when Luiza writes the real copy.

- **`src/core/index.ts`** — add one re-export line: `export { ZODIAC_CONTENT, type ZodiacContent, type Element, type Modality } from "./zodiacContent";`. Keeps the barrel convention.

### Files NOT modified

- `public/art/wheel.jpg` — unchanged. No re-encode.
- `src/app/globals.css` — unchanged. All required tokens already exist (`display`, `display-italic`, `marginalia`, `tracked-ink`, `body-italic`, `text-terracotta-deep`, `focus-visible:ring-terracotta`).
- `src/ui/home/CosmosMarginalia.tsx`, `src/ui/home/Cosmos*.tsx` — read for the cross-fade idiom only; never imported from `Symbols.tsx` (carve-out boundary).
- `scripts/arch-check.sh` — unchanged. New module passes existing rules.
- Payload schema — unchanged. Migration to a `Zodiac` collection is a deferred Phase 3 refactor.

### Reused utilities & tokens

- Cross-fade pattern: `src/ui/home/CosmosMarginalia.tsx:14-73` — copy the pattern (do not import).
- Typography classes: all in `src/app/globals.css` — `display`, `display-italic`, `marginalia`, `tracked-ink`, `body-italic`.
- Geometry constants: `WHEEL_START_ANGLE_DEG`, `WHEEL_SECTOR_DEG`, `WHEEL_ZODIAC`, `WheelSign` from `src/core/wheel.ts`.
- Focus-visible styling on sector paths: existing `focus-visible:stroke-terracotta-deep focus-visible:[stroke-width:3]`.
- Layout: existing `lg:grid-cols-[auto_1fr] lg:gap-16` from current `Symbols.tsx`.

### Verification (consolidated from § 6 below)

1. `pnpm typecheck && pnpm exec oxlint src/ui/home/Symbols.tsx src/core/wheel.ts src/core/zodiacContent.ts src/core/index.ts` — 0 errors.
2. `bash scripts/arch-check.sh` — pass (`zodiacContent.ts` is pure TS, no framework imports).
3. Chrome DevTools MCP visual sweep at `http://localhost:3000/#simbolos`:
   - No sector active → wheel full color, right column shows intro paragraph, `<output>` strip reserved with `&nbsp;`.
   - Hover Leão → lion sector stays saturated, other 11 desaturate to `saturate(0.65) brightness(0.95)`, right column cross-fades to the Leão detail card, `<output>` reads _Leão · 23 jul – 22 ago_.
   - Cursor to Touro → 160ms cross-fade, no layout shift, no flicker.
   - Cursor off the wheel → right column reverts to intro paragraph, `<output>` clears.
   - Click Áries → pin. Cursor away. Card stays on Áries.
   - Click Áries again → unpin. (Since cursor not on sector, card reverts to intro.)
   - Click Áries → Click Touro → card swaps and stays pinned.
   - Pinned + Escape → card reverts.
4. Keyboard: Tab order section heading → marginalia → 12 sectors → right column → next section. Enter/Space pins, second Enter unpins, Escape clears.
5. Screen reader smoke: `aria-live="polite"` on `<output>` and on `WheelDetail` wrapper; sector labels read `"{sign}, {date range}, botão"`; pinning announces the full card content.
6. Reduced motion: DevTools → emulate `prefers-reduced-motion: reduce` → desaturate-complement snaps instantly, content swap instant, no transition.
7. Responsive: `lg:` keeps `grid-cols-[auto_1fr]`, card column has a stable min-width to prevent jump on swap; `sm:` stacks card below wheel; 320px stress test holds.
8. SSR/AEO: `view-source` includes all 12 sign labels + date ranges (aria-labels) + the rendered detail content for whichever default state — verify the per-sign content lands in the static HTML.
9. Console: `list_console_messages` after each interaction sequence — expect 0 errors, 0 warnings.
10. Lighthouse: no regression on a11y (≥95) or LCP (<2.5s).

## 3. Alternatives

- **ALT-001**: Replace the painting with twelve separate sector cut-outs (one PNG per sign), composed in code. _Rationale for rejection_: doubles asset size, breaks the painter's continuous brushwork at sector seams, and re-introduces parametric ornament concerns. The painting was conceived as one piece.
- **ALT-002**: Use Three.js / `@react-three/fiber` like the Cosmos section to render a 3D-tilted wheel. _Rationale for rejection_: violates the carve-out boundary (Cosmos is the only 3D scene; Symbols is regular-rules territory) and adds a heavy dependency to a section that needs none of its capabilities.
- **ALT-003**: Move per-sign content to Payload as a `Zodiac` collection in Phase 1 (now) rather than in Phase 2. _Rationale for rejection_: Phase 1's content is small (twelve records, no media), and Luiza has not yet written the paragraphs. Hard-coding now in `src/core/zodiacContent.ts` ships faster; migrating to Payload later is a 30-minute rewrite of one import path.
- **ALT-004**: Replace hover/focus interaction with a single dropdown / `<select>` for the active sign, no wheel interactivity. _Rationale for rejection_: the painted wheel _is_ the section's identity; demoting it to decoration with a separate control would gut the design.
- **ALT-005**: Auto-rotate the wheel on a timer to draw attention. _Rationale for rejection_: explicit ban on auto-rotating (CON-006 echoes the brief's "no auto-spinning"). The user did not ask for this; only that the user can rotate it on demand.

## 4. Dependencies

- **DEP-001**: `next/image` — already in use. No version change. Continues to serve `public/art/wheel.jpg` with `sizes="(min-width: 1024px) 28rem, 80vw"`.
- **DEP-002**: `react@^19` — for `useState`, `useEffect`, `useId`, `useRef`. All hooks already used in the codebase.
- **DEP-003**: Tailwind v4 + `@tailwindcss/typography` — for `display`, `display-italic`, `marginalia`, `tracked-ink`, `body-italic` utility classes already declared in `src/app/globals.css`. No new globals.
- **DEP-004**: `cn` from `@/lib` — class-name composition utility, already in use (`CosmosMarginalia.tsx`).
- **DEP-005**: `@/core/wheel` — `WHEEL_ZODIAC`, `WHEEL_SECTOR_DEG`, `WHEEL_START_ANGLE_DEG`, `WheelSign`. No changes.
- **DEP-006**: `@/core/zodiacContent` — _new_ module. Pure TS, no framework imports. Exports `ZODIAC_CONTENT` and a `ZodiacContent` type.
- **DEP-007** (conditional, for Combination Beta only): `public/art/wheel-pointer.webp` — commissioned painted gilt pointer asset, ~6 KB, transparent background. Not yet ordered. If Combination Beta is selected, this is a Luiza ask.

## 5. Files

- **FILE-001**: `src/ui/home/Symbols.tsx` — extends with companion-card subcomponent, swaps state shape from `WheelSign | null` to `{ sign, pinned }`, adds Enter/Space/Escape keyboard handlers, adds the SVG `<defs>` block with the desaturation filter and twelve clip-paths.
- **FILE-002**: `src/core/wheel.ts` — unchanged. (Geometry is already correct; per-sign content does not belong here.)
- **FILE-003**: `src/core/zodiacContent.ts` — NEW. Pure TS, defines `ZodiacContent` type and `ZODIAC_CONTENT` record keyed by `WheelSign["id"]`. Twelve entries with placeholder copy marked `_isPlaceholder: true` until Luiza writes the final text.
- **FILE-004**: `src/app/globals.css` — unchanged. (All required typography utilities already exist.)
- **FILE-005**: `public/art/wheel.jpg` — unchanged.
- **FILE-006**: `public/art/wheel-pointer.webp` — NEW _only_ if Combination Beta is selected by Luiza in Q1 below.
- **FILE-007**: `references/wheel.jpg` — already exists as the source plate; remains as reference, not deployed.
- **FILE-008**: `src/ui/home/index.ts` — unchanged. `Symbols` already exported.
- **FILE-009**: `src/core/index.ts` — likely needs one new re-export line for `ZodiacContent` and `ZODIAC_CONTENT` if the file currently re-exports `wheel.ts` items. Verify in implementation plan.

## 6. Testing

- **TEST-001**: Keyboard navigation. Tab through `Symbols` section. Expected order: section heading → marginalia tagline → wheel sector buttons (twelve, in zodiac order: Áries → Touro → … → Peixes) → companion card content (read by AT) → next section. Verified by manual Tab + recording focus ring positions.
- **TEST-002**: Keyboard activation. With focus on a sector button, press Enter — companion card swaps to that sign and remains (pinned state). Press Enter again — card reverts to default (unpinned). Press Escape — card reverts to default regardless of pinned state. All from keyboard only.
- **TEST-003**: Screen reader (NVDA / VoiceOver). On Tab-focus into a sector, screen reader announces `"{sign name}, {date range}, botão"` (current behavior, preserved). On pin, the companion card content reads via `aria-live="polite"` — the announcement should include the heading + element/modality/ruler/body part + paragraph. Verified by manual NVDA recording in Chrome.
- **TEST-004**: Reduced-motion. With `prefers-reduced-motion: reduce` emulated in Chrome DevTools, hover over a sector — the desaturate-complement effect appears _instantly_ (no 300ms transition), the companion card _swaps content instantly_ (no 160ms cross-fade). No rotation occurs (Combination Alpha; rotation is not enabled). Verified by manual hover + screen recording.
- **TEST-005**: Hover-discoverability. On lg: viewport, hover the wheel — the desaturated-complement state is visible; the companion card updates. Move the cursor between sectors rapidly — the card cross-fades cleanly; no flicker, no content tear. Verified by manual recording.
- **TEST-006**: Pin persistence. Click a sector. Move the cursor far from the wheel. The companion card stays on that sign (pinned). Click again the same sector — card reverts to default. Click another sector — card swaps to the new sign (still pinned). Press Escape — card reverts.
- **TEST-007**: Responsive layout. On sm: viewport (< 1024px), the companion card sits below the wheel (`mt-8`). The intro paragraph and the detail content both occupy the same vertical slot — only one renders at a time depending on `active`. The wheel does not shrink below 80vw width. The card is centered (`mx-auto`). On lg: the companion card sits to the right of the wheel (`grid-cols-[auto_1fr] gap-16`). The intro paragraph and the detail content occupy the same column; the column does not jump width on swap.
- **TEST-008**: AI-agent SSR readability. `curl https://luizapsi.localhost/#simbolos` (or equivalent build-time HTML inspection) — the response HTML contains all twelve sign labels, all twelve date ranges, all twelve element/modality/ruler/body-part lines, all twelve paragraphs. The interaction is progressive enhancement; the content is not. Verified by reading the rendered HTML for the page and grepping for all twelve sign IDs.
- **TEST-009**: NoJS fallback. Disable JS in Chrome devtools. Reload. The painted wheel renders (via `next/image`, server-rendered). All twelve sign labels and date ranges are visible (either by the SSR HTML containing the detail content unconditionally as a `<details>` list, or by a `<noscript>` fallback list). The user cannot interact, but the content is there. Verified by manual reload + visual check.
- **TEST-010**: Lighthouse a11y score. Run Lighthouse on the page. The a11y score is ≥ 95 (current baseline). No new violations of color contrast, ARIA-name absence, or focus-order — all addressed by existing patterns.
- **TEST-011**: Architecture rule check. Run `bash scripts/arch-check.sh`. No errors. Specifically: `src/core/zodiacContent.ts` contains no `from 'react'` or `from 'next'` imports; `src/core/zodiacContent.ts` does not import from `@/ui/` or `@/app/`.
- **TEST-012**: Performance. Run Chrome DevTools `mcp__plugin_chrome-devtools-mcp_chrome-devtools__performance_start_trace` over a wheel-hover-pin-unpin sequence. Verify: no layout shift on swap (the companion card's column width does not jump), no long task > 50ms, no INP regression on the wheel sector hover. Verified by trace inspection.

## 7. Risks & Assumptions

- **RISK-001**: SVG mask edges at sector boundaries may show a hard seam against the painted brushwork that crosses those boundaries. _Mitigation_: feather the clip-path alpha with a small Gaussian blur (~1.5px) on the mask. If still visible, fall back from A1 (mask-clipped complement-desat) to A2 (uniform alpha overlay on the complement). Tested at implementation time, not at brainstorming time.
- **RISK-002**: Per-sign placeholder copy may stay on the live site if Luiza does not write the real text in time. _Mitigation_: `_isPlaceholder: true` in the data + a CI-time check (a small `pnpm verify-zodiac-content` script reporting how many entries still carry placeholder flags) prevents accidental forever-shipping of placeholder text. Add the script in the implementation plan.
- **RISK-003**: The "pinned" state may confuse first-time visitors who don't realize their click stuck the content. _Mitigation_: the marginalia hint below the wheel ("Passe o cursor — ou navegue com o teclado — por uma das doze figuras para conhecê-la") extends to a second sentence: "Toque ou clique para fixar os detalhes." Plain, single-line; matches the page's editorial tone.
- **RISK-004**: On very narrow mobile (<360px), the wheel + companion card may stack to a height that pushes the section's `py-28` padding past the visible viewport. _Mitigation_: verify with Chrome DevTools mobile emulation at 320px width; tune `mt-8` between wheel and card if needed.
- **RISK-005**: AI-agents fetching the page in headless mode may not execute JS and therefore never see the per-sign content. _Mitigation_: render the detail content unconditionally in SSR HTML as a hidden-by-default `<dl>` list (one `<dl>` per sign), wrapped in `<div hidden data-wheel-detail="{id}">`. The interactive companion card reads from these `<div>`s on activation. SEO/AEO wins: the full content is in the DOM at first paint.
- **ASSUMPTION-001**: Luiza will write the per-sign paragraphs at some point but the timing is uncertain. The plan ships with placeholders; Phase 2 swaps in real copy.
- **ASSUMPTION-002**: The painted JPG `public/art/wheel.jpg` will not be re-encoded or recropped during this refinement. (The plan reads from the current image; if a new version ships, the sector geometry in `src/core/wheel.ts` may need re-calibration.)
- **ASSUMPTION-003**: The user (jvsvogler) is the one implementing; Luiza is the content/aesthetic approver. Decisions in the open-questions list go to Luiza; implementation choices belong to jvsvogler.
- **ASSUMPTION-004**: The implementation plan (`wheel-refinement-2.md`) is a separate document, written after Luiza answers Q1–Q4 in Section 5. This brainstorming plan does not pre-commit to a specific implementation path until those answers come in.
- **ASSUMPTION-005**: The Cosmos popover pattern (`CosmosMarginalia.tsx`, `.cosmos-sigil-popover` CSS) was reviewed and is the right reference idiom for the cross-fade behavior. Confirmed by reading both files during plan discovery.

## 8. Locked decisions (confirmed 2026-05-18)

The original open-questions for Luiza have been resolved in-session. Recorded here for traceability; the executable spec is in § Hand-off contract above.

- **Q1 — Rotation.** Resolved: **A (Combinação Alfa, sem giro).** The wheel does not rotate. Highlight (A1 desaturate-complement) + companion panel do the reading-position work. Painted radial text (Nakshatras + inner glyphs) stays readable at all times. The Beta painted-pointer compromise and the Gamma full-rotation path are both rejected.
- **Q2 — Panel format.** Resolved: **A (C1+C6 companion card).** Right-side on `lg:`, below on `sm:`. Replaces the body-italic intro paragraph when a sector is active. Cross-fade pattern from `CosmosMarginalia.tsx`. Modal (C3) and floating-marginalia (C4) options rejected.
- **Q3 — Pinning.** Resolved: **Yes.** Click/Enter/Space pins; second activation on the same sector unpins; Escape clears regardless. Hover/focus while pinned does not steal — pin wins.
- **Q4 — Per-sign content.** Resolved: **all six fields, with plausible Portuguese placeholders** for all 12 signs marked `_isPlaceholder: true`. Element, modality, ruler, body part, archetype, paragraph. The first five are canonical Western correspondences and ship as fact; the paragraph is the placeholder swap target when Luiza writes the real text. No `lorem ipsum`, no English placeholder strings.
- **Q5 — Nakshatras.** Resolved: **decorative for now.** No new interactivity on the outer ring in this plan. Revisit in a later phase if content for the 27 lunar mansions surfaces.

(For the original pt-BR question text — preserved one revision back; available via git history of this file at `plan/wheel-refinement-1.md`.)

## 9. Related Specifications / Further Reading

- `/.impeccable.md` — Design context, anti-references, carve-outs (note the Cosmos carve-out does _not_ apply here)
- `/CLAUDE.md` — Project guide, architecture boundaries, two-audiences principle, palette
- `/src/ui/home/Symbols.tsx` — Current implementation of the wheel section
- `/src/core/wheel.ts` — Current geometry data
- `/src/ui/home/CosmosMarginalia.tsx` — Reference pattern for hold-displayed-during-fade and `aria-live="polite"` idiom
- `/src/app/globals.css` — Design tokens, `.display`, `.display-italic`, `.marginalia`, `.tracked-ink`, `.body-italic`, `.cosmos-sigil-popover` (the marginalia popover reference)
- `/scripts/arch-check.sh` — Architecture boundary check (core/ pure TS, no React/Next)
- `https://www.w3.org/WAI/ARIA/apg/patterns/button/` — ARIA Authoring Practices for the `role="button"` pattern on `<path>` elements (already implemented; preserved)
- `https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/` — ARIA Authoring Practices for modal (relevant if Combination Gamma is selected)
- `https://developer.mozilla.org/en-US/docs/Web/SVG/Element/filter` — SVG `<filter>` reference for the desaturate-complement implementation in Option A1
- `https://developer.mozilla.org/en-US/docs/Web/SVG/Element/clipPath` — SVG `<clipPath>` reference for sector clipping
