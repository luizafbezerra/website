---
goal: Build Orientação profissional e de carreira (`/orientacao-profissional`) — the seven CONCEPT §6 sections in both locales, CMS-backed, with the honest comparison as the page's centre and a crossroads plate as its only art moment
version: 1.0
date_created: 2026-08-05
last_updated: 2026-08-05
owner: João Vogler (dev); content sign-off — Luiza Fernandes Bezerra
status: "Completed"
tags: [feature, page, design, i18n, cms, seo]
---

# Introduction

![Status: Completed](https://img.shields.io/badge/status-Completed-brightgreen)

This plan executes **TASK-038** of [`plan/architecture-site-restructure-1.md`](./architecture-site-restructure-1.md)
under its per-page ritual (PAT-001): the second door of CONCEPT §4, built from the
`page-orientacao-profissional` global that Phase 4 created and the primitives Phase 5 built,
following the precedent in [`plan/feature-page-primeira-conversa-1.md`](./feature-page-primeira-conversa-1.md).

The page's job, in CONCEPT's words: **decide whether this bounded program answers my career
question — versus a coach, versus a loose vocational test.**

Its position in the map understates what it carries. CONCEPT §10 names it **the site's strongest
non-brand search asset**: "orientação profissional online" is a real commercial vertical almost
no Jungian occupies, and with no blog the site's only organic reach is brand queries plus
commercial-intent pages. PRODUCT calls the same programme the easier first purchase and a natural
gateway into análise. Its reader is therefore not PRODUCT's anxious searcher at 2 a.m. — it is
somebody younger, comparison-shopping, reading fast with three other tabs open, who wants to know
**what they get and how long it takes** before they will grant the page a symbolic sentence.

So the page inverts the site's usual order of persuasion. Everywhere else the world recruits and
then the person converts; here the _product_ recruits — a programme with a beginning, a middle and
an end — and the tradition arrives once, late, as the reason the reading goes deeper than a test
result. Exactly one Jungian sentence appears on the page, in the section where the decision is
made.

**One constraint was settled before this plan and is treated as a fixed input:** CONCEPT §6's note
and CON-006 forbid **zodiac imagery anywhere on this page** — a wheel beside psychological tests
would read as predictive assessment, which is the one misreading that would cost her professional
standing rather than a conversion. The consequence is recorded in §0: this page ships **no wow
set-piece at all.**

## 0. Shape brief

The direction contract is settled by PRODUCT.md and DESIGN.md, and CONCEPT §6 fixes the seven
sections and their order, so the shape work resolved only what was materially open. Mode:
**Persuade**, with a colder reader than any other page's — the win is that a comparison ends here.

- **Sequence: answer, recognise, promise, distinguish, release, price, ask.** Abertura (what it
  is · who conducts it · how many meetings · format · languages · reach · what you leave with) →
  credencial strip → **para quem** (four situations) → **o percurso** (four numbered movements +
  the deliverable) → **nem coaching, nem teste solto** (the argument + the Jungian anchor + the
  plate) → **quando a pergunta é mais funda** (→ /analise) → **prático** → **começar**. The
  concrete promise is fully delivered before the page says anything symbolic.
- **Focal moment: there isn't a set-piece, and that is the design.** PAT-002 asks for _at most_
  one wow per page, and the only symbol this page's own vocabulary suggests — a wheel — is the
  one CON-006 forbids. Inventing a different set-piece to fill the slot would be decoration
  looking for a reason. Its art moment is the **plate**, and the compensation is typographic:
  two tonal events and two pull-quote-scale sentences carry the page instead.
- **Where the page is decided: `nem coaching, nem teste solto`.** It gets the page's first tonal
  event (`parchment-deep`) and the whole of its craft. It is **not** a feature-comparison table:
  no competitor column, no checkmarks, no card grid — DESIGN bans the SaaS grid outright and
  PRODUCT lists feature-comparison layouts among the anti-references. Each distinction is a
  paragraph of body prose opening on a **rubricated phrase** (Cardo italic, terracotta-deep), the
  one place on this page where the accent appears in running text. And it disparages nobody: the
  section names three kinds of help, says all three can serve at different moments, and then
  describes only the third.
- **The one Jungian anchor, and the one painting, land together.** Vocation as a door of
  individuação closes the argument as a single sentence at Title scale in her italic voice, and
  the plate — CONCEPT §12's painted crossroads or labyrinth, and the labyrinth is fair Jungian
  vocabulary per §9.10 — closes the section beneath it. The image sits beside the idea it
  amplifies, which is what amplificação means; anywhere earlier it would delay the answer the
  reader came for.
- **The deliverable is set apart from the steps.** It is the thing the buyer is buying, so it
  must not read as a fifth step: a hairline-bounded band (`border-y`, no fill, no radius, no
  shadow) at Title scale in Cardo italic — the credential strip's grammar applied to the one
  sentence the whole page promises.
- **Tonal rhythm.** Parchment throughout, with exactly two breaks — `nem coaching` and the ask.
  DESIGN allows two; spending one on the decisive section is what replaces the missing wow.
- **Anti-goals.** No zodiac, wheel, sigil or predictive language of any kind (CON-006, absolute).
  No second price beside the fee (`fees="careerGuidance"`). No Jung passage from the rotating
  pool — the page's one contemplative moment is the anchor, and a second would blunt it. No
  `Ornament` separators anywhere: a page whose job is a decision needs fewer dividers, not more.
  No tracked-caps eyebrow per section. No jump link to the ask. No sticky anything. No mention of
  a coach by name or as a class.

## 1. Requirements & Constraints

- **REQ-001**: All seven CONCEPT §6 sections ship in the map's order — Abertura · Para quem ·
  O percurso · Nem coaching, nem teste solto · Quando a pergunta é mais funda · Prático · Começar
  — with the credencial strip under the opening.
- **REQ-002**: Every visitor-facing string reads from `page-orientacao-profissional` or from
  A Clínica — never hardcoded (master plan GUD-002). Only scaffolding a visitor cannot
  meaningfully edit lives in `messages/{pt,en}.json`: the plate's placeholder caption and note,
  and the fee row label already owned by the `pratico` namespace.
- **REQ-003**: Both locales render; untranslated fields fall back to Portuguese through Payload's
  `fallback: true` (master plan RISK-001).
- **REQ-004**: AEO front-load (master plan REQ-012). This page's front-load carries more weight
  than any other's, because it is the site's strongest non-brand search asset (CONCEPT §10): the
  abertura states what · who conducts it · how many meetings · format · languages · reach · what
  you leave with, as semantic HTML with exactly one `h1`, and the metadata description carries the
  phrase the reader actually types.
- **REQ-005**: The fee reaches the page from `clinica.fees` scoped to `careerGuidance`, never
  from a page field, and renders "a combinar" when unset (master plan REQ-006). This page never
  quotes the analysis fee beside it.
- **REQ-006**: The percurso is stated concretely and without invention: **up to twelve weekly
  online meetings**, psychological tests + conversations + proposed activities, and the
  deliverable — clarity about "a profissão que faz mais sentido no momento atual da sua vida".
  **No test instrument is named** anywhere, and **no price** is drafted anywhere.
- **REQ-007**: The bridge to `/analise` reads as permission, never as an upsell, and ends on a
  `SectionLink` (CONCEPT §4's boundary: _sentido do trabalho → análise · qual profissão →
  orientação_).
- **REQ-008**: Every time on the page is anchored to horário de Brasília, and the pt page quotes
  BRL or "a combinar" — never an automatic conversion (CONCEPT §8.9).
- **SEC-001**: The page reads nothing about the visitor. No cookie, no storage, no per-visitor
  branching, no rotation of any kind.
- **CON-001**: Online-only. No section, prático row, plate caption or placeholder label may imply
  a room a patient walks into (master plan CON-001).
- **CON-002**: **No zodiac imagery anywhere on this page** (CONCEPT §6 note, CON-006 of the
  master plan) — the page's one hard visual prohibition, and the reason it carries no set-piece.
- **CON-003**: Layered architecture (master plan CON-003): `infrastructure/payload/` accessor →
  `domain/orientacaoProfissional/` type + mapper + action → route fetches and passes props →
  `view/orientacaoProfissional/` renders. No component sees a raw Payload shape; nothing in
  `src/domain/` imports React, Next, or next-intl.
- **CON-004**: Every component on the page is a **server component**. Nothing here needs an
  interaction, so nothing here has a client boundary — which is also why the page ships no
  animation and therefore needs no `prefers-reduced-motion` alternative.
- **GUD-001**: DESIGN.md governs every visual call — all-serif, the plate the only saturation,
  terracotta the one recurring accent, flat on parchment, near-sharp edges, one drop cap for the
  page, the two-voices rule on every text element, no card grids, at most two `deep` sections.
- **GUD-002**: `.roman-numeral` only where a sequence genuinely is ordered. The percurso qualifies
  and uses it; `para quem` deliberately does not (see §2's notes).
- **GUD-003**: Body text ≥ 4.5:1 on the warm parchment. This binds the rubricated distinction
  lead-ins specifically, and it is why they use `terracotta-deep` rather than `terracotta`.
- **PAT-001**: Placeholder policy (master plan REQ-005): the plate slot renders `MediaPlaceholder`
  with a label saying what belongs there until her painting is chosen and its provenance verified.
- **PAT-002**: Compose the Phase 5 primitives and the page grammar rather than re-implementing
  them: `PageSection`, `SectionHeading`, `SectionLink`, `Credencial`, `Plate`, `MediaPlaceholder`,
  `RichTextProse`, `PraticoSection`, `Comecar`.
- **PAT-003**: One concept per file, named exports, no barrels.

## 2. Implementation Steps

### Implementation Phase 1

- GOAL-001: The data slice — the page's copy reaches a React component as normalized domain
  types, with a code fallback for every field.

| Task     | Description                                                                                                                                                                                                                                                                                                                                                                                                       | Completed | Date       |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-001 | Convert `nemCoaching.plate` in `src/payload/globals/pages/orientacaoProfissional.ts` from a bare `mediaSlot` upload to a plate **group** (`image` + `painter` + localized `workTitle` + `year`), matching `primeiraConversa.permissoes.plate` so `pagePlateFrom` normalizes it. Add `nemCoaching.anchor` for the page's one Jungian sentence. Sharpen the admin descriptions that now describe rendered behavior. | ✅        | 2026-08-05 |
| TASK-002 | Create `src/domain/orientacaoProfissional/OrientacaoProfissional.ts`: the type — one member per section — plus `ORIENTACAO_PROFISSIONAL_DEFAULTS`. Every field is a draft from CONCEPT §4/§6, marked as such in the file comment, with a price and any named test instrument deliberately absent.                                                                                                                 | ✅        | 2026-08-05 |
| TASK-003 | Create `src/infrastructure/payload/getPageOrientacaoProfissionalGlobal.ts` — locale-aware accessor with request-scoped `cache()`, `depth: 1` for the plate upload, mirroring `getPagePrimeiraConversaGlobal.ts`; colocate its raw `PayloadPageOrientacaoProfissional` response type.                                                                                                                              | ✅        | 2026-08-05 |
| TASK-004 | Create `orientacaoProfissionalFromPayload.ts` (raw → type, every field falling back, the plate through `pagePlateFrom`) and `getOrientacaoProfissional.ts` (the action the route calls). Colocate `orientacaoProfissionalFromPayload.test.ts` covering the empty global, the four array normalizations, and the empty-array rule each array chose.                                                                | ✅        | 2026-08-05 |

### Implementation Phase 2

- GOAL-002: The seven sections, composed from the shared page grammar.

| Task     | Description                                                                                                                                                                                                                                                                                         | Completed | Date       |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-005 | `view/orientacaoProfissional/Abertura.tsx` — the page's one `h1` at Headline scale, her lead in body prose opening with the page's single `.dropcap`, carrying the whole front-load (REQ-004). No portrait, no jump link to the ask.                                                                | ✅        | 2026-08-05 |
| TASK-006 | `ParaQuem.tsx` — the four situations as a `<ul>` of `h3` + body prose, unnumbered and unadorned, with no intro paragraph in front of them: recognition is faster without one.                                                                                                                       | ✅        | 2026-08-05 |
| TASK-007 | `OPercurso.tsx` — her lead, then an `<ol>` of four movements in a `[numeral, content]` grid using `.roman-numeral`, then the **deliverable** as a hairline-bounded band at Title scale in Cardo italic, set apart from the steps.                                                                   | ✅        | 2026-08-05 |
| TASK-008 | `NemCoaching.tsx` — `tone="deep"`, her framing paragraph, the three distinctions as rubricated prose (no table, no cards, no competitor column), the Jungian anchor at Title scale, and the plate closing the section via `<Plate>` with `MediaPlaceholder` until her painting is chosen (PAT-001). | ✅        | 2026-08-05 |
| TASK-009 | `PerguntaMaisFunda.tsx` — the bridge: one heading, one short paragraph, one `SectionLink` to `/analise`. Nothing else, on purpose. And `Pratico.tsx` — `PraticoSection` with `fees="careerGuidance"`.                                                                                               | ✅        | 2026-08-05 |
| TASK-010 | Write the page's scaffolding strings for `messages/{pt,en}.json` (the plate placeholder caption and note) plus `meta.orientacaoProfissional.{title,description}` — `pageMetadata` throws without the latter, and the description carries the words the searching reader actually types.             | ✅        | 2026-08-05 |

### Implementation Phase 3

- GOAL-003: Compose the route, hand off the integration, and verify what can be verified without
  a database, a build or a browser.

| Task     | Description                                                                                                                                                                                                                                                                                                                                    | Completed | Date       |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-011 | Create `src/app/(frontend)/[locale]/(pages)/orientacao-profissional/page.tsx` as a thin route: `getOrientacaoProfissional(locale)` + `getClinica(locale)` in parallel, `pageMetadata("orientacaoProfissional", locale)`, `BreadcrumbJsonLd`, then the seven sections, closing on `Comecar` with `opener="careerGuidance"`. **No `FaqJsonLd`.** | ✅        | 2026-08-05 |
| TASK-012 | Write the integrator handoff — the `messages` fragments, the `seed/pages.ts` snippet sourced from `ORIENTACAO_PROFISSIONAL_DEFAULTS`, the registry flip and its two pinned test assertions, the exact schema diff for the migration audit, and the runtime checks the browser pass must run.                                                   | ✅        | 2026-08-05 |
| TASK-013 | Run the checks available in this pass: `tsgo --noEmit`, targeted `vitest`, `oxlint`, `oxfmt`, impeccable's mechanical detector — and **mutation-check the mapper**, both sides of every two-sided condition.                                                                                                                                   | ✅        | 2026-08-05 |

**Execution notes (2026-08-05)**

- **As built.** `src/domain/orientacaoProfissional/{OrientacaoProfissional,orientacaoProfissionalFromPayload,orientacaoProfissionalFromPayload.test,getOrientacaoProfissional}.ts` ·
  `src/infrastructure/payload/getPageOrientacaoProfissionalGlobal.ts` ·
  `src/view/orientacaoProfissional/{Abertura,ParaQuem,OPercurso,NemCoaching,PerguntaMaisFunda,Pratico}.tsx` ·
  `src/app/(frontend)/[locale]/(pages)/orientacao-profissional/page.tsx` · two schema changes to
  `src/payload/globals/pages/orientacaoProfissional.ts`. **No new CSS**, no new `view/general/`
  component, and no client component: the page ships zero JavaScript of its own.
- **This global needed no `abertura` tab.** TASK-036's finding was that the page globals have no
  field for a page's own opening, and that "every one of the remaining six pages needs the same
  tab". This page is the exception, and it is worth recording so the next four builders check
  before adding one: CONCEPT §6's _first section here is the abertura_ ("what it is; PUC-SP
  specialization; the promise in her words"), so `abertura.heading` is already the `h1` and
  `abertura.body` is already the front-loaded lead. The field is named `body` rather than
  primeira-conversa's `lead`; renaming it would buy naming consistency and cost a migration on a
  live column, so it stayed. Flagged in the handoff rather than decided for the remaining pages.
- **Seven decisions the task text left open.**
  1. **The plate stays in `nemCoaching`, closing the section.** The task allowed moving it. Three
     placements were tried on paper. `paraQuem` would put a full editorial painting between "is
     this me?" and "what do I get?" — precisely the answer this page's fast reader came for, and
     the same objection that moved primeira-conversa's plate out of its abertura (ALT-006 there).
     `perguntaMaisFunda` would inflate a deliberately four-line bridge into a destination. The
     abertura would delay the front-load. `nemCoaching` wins on more than elimination: the
     crossroads and the labyrinth are Jungian vocabulary (CONCEPT §9.10 says so of the labyrinth
     explicitly), and this is the section that holds the page's one Jungian sentence — so the
     image sits beside the idea it amplifies, which is the whole definition of amplificação. It
     sits on `parchment-deep`, which reads as a gallery wall rather than as a card: no frame, no
     rounding, no shadow, generous parchment around it.
  2. **The percurso is numbered.** DESIGN reserves `.roman-numeral` for sequences that genuinely
     are ordered, and this one is: the entire product claim is a programme with a beginning, a
     middle and an end, against a coach's open-ended engagement and a test's single transaction.
     The order _is_ the offer, so four manuscript numerals say in a glance what a paragraph would
     have to argue — and on the page most at risk of drifting into a product page, the numerals
     are also what keep it inside the site's world. Two guards keep them honest: the section's
     own lead says the four are _movements_, not twelve numbered sessions, and the movements are
     drafted as broad arcs rather than as a session-by-session protocol, which would be inventing
     her method. Rejected: unnumbered phases (they would read as a feature list on the one page
     that must not, and would waste the page's strongest typographic signal).
  3. **`Nem coaching, nem teste solto` is rubricated prose, not a table and not a second list of
     titled blocks.** A competitor column with checkmarks was never on the table — DESIGN bans
     the SaaS grid, PRODUCT lists feature comparison among the anti-references, and scoring a
     coach would put words in their mouth. What was actually open was the _editorial_ form. A
     `<dl>` of title/text pairs was rejected because `para quem`, two sections earlier, already
     uses titled blocks, and repeating that shape would turn an argument into a third list. A
     two-column spread was rejected as the comparison table minus its grid lines. So each
     distinction is a paragraph of body prose opening on a rubricated phrase — real manuscript
     practice, DESIGN names rubrication as a terracotta use, and running prose with no rules
     between the items says these three are one case rather than three rows. It also reads
     cleanly to an assistant quoting the page, which a fragmented `<dl>` does not.
  4. **`terracotta-deep`, not `terracotta`, for the rubrication.** At body size on
     `parchment-deep` the recurring accent computes to roughly 4.1:1 — under PRODUCT's 4.5:1
     floor — while the deep shade lands near 7:1. A differentiator nobody can read differentiates
     nothing. The One-Voice rule is unaffected: it is the same pigment family, and it is the only
     accent on the page.
  5. **The deliverable is a hairline-bounded band, not a filled panel.** It has to be visually
     distinct from the four movements without becoming a card (DESIGN bans those) or acquiring a
     resting shadow (DESIGN bans those too). `border-y` on parchment is the grammar the credential
     strip already uses for a line that must read as a statement rather than as an item, and
     Title-scale Cardo italic is her voice. It shares that treatment with the Jungian anchor:
     the page's two most important sentences deliberately look like each other, which is the
     figure that replaces the missing set-piece.
  6. **`para quem` has no intro paragraph and no numerals**, and that is the counter-example to
     decision 2 sitting on the same page. The four situations are alternatives, only one of which
     is the reader's, so an `<ul>` says the true thing and an `<ol>` would say they are stages.
     A framing paragraph was drafted and cut: recognition is what this section sells, and a
     reader scanning for themselves should meet a title, not a lead-in.
  7. **The prático list carries five rows, not the four the task named.** Duration · format ·
     languages · reach, plus **horários** — CONCEPT §8.9 anchors every time on the site to horário
     de Brasília, and this is the only page where weekly meetings are scheduled without a
     time-zone sentence anywhere else in reach. The fifth row is where a Brazilian in Lisbon looks
     for it.
- **Three findings worth recording.**
  1. **Three mutants survived the first test pass, all of the same shape.** Dropping the
     _title_ half of the row filter in `casesFrom`, `stepsFrom` and `praticoFrom` left the whole
     suite green: the "half-typed rows" test only covered rows with a title and no text, never the
     mirror. `distinctionsFrom` happened to be covered. This is exactly the defect class TASK-036
     recorded, one page later and in triplicate — the lesson generalizes to _every_ row filter, not
     just to `feeQuoteFrom`. The test now exercises both sides on all four arrays, and a 16-mutant
     sweep of the mapper (both sides of each row filter, both sides of the rich-text guard,
     `filled`'s whitespace branch, the numeral fallback, all four empty-array collapses, and the
     `deliverable` / `anchor` fallbacks) kills every one.
  2. **This page is the first consumer of `view/general/Comecar.tsx`.** Phase 5 built it and no
     page had mounted it; its props are exactly the shape this global's `comecar` tab holds, so no
     wrapper component was written. Worth knowing for whoever builds `/analise` and
     `/internacional`: the section is already done, and `opener` is the only thing that differs.
  3. **The steps' numeral comes from the stored index, not from the surviving position** — so a
     global saved with a half-typed row above a complete one can print `III` as the first
     movement. Kept deliberately, because it is `primeiraConversaFromPayload`'s rule and because
     numbering the survivors instead would make a numeral shift while she is filling in the row
     above it. Tested and commented rather than silently inherited.
- **Copy that needs her sign-off.** All of it. This page has never existed — not on the Google
  Sites page, not in the pre-CONCEPT site — so unlike Início there was nothing of hers to carry
  across, and unlike primeira-conversa not even a bilhete written in the visitor's voice. Every
  field states only facts CONCEPT §4/§6 and PRODUCT already fix. Two drafts are claims rather than
  descriptions and need her confirmation specifically: **"testes psicológicos só podem ser
  aplicados e interpretados por psicólogos"** (true of Brazilian practice, but a regulatory claim
  in her name) and **the word for her PUC-SP training** — CONCEPT §4 says "specialization",
  PRODUCT's evidence list records an _aprimoramento_, and the draft uses the narrower,
  better-documented term. Every field is a CMS field and TASK-052 owns the review.
- **Deliberately not done.**
  - **No wow set-piece.** PAT-002 asks for at most one, CON-006 forbids the only symbol this
    page's own vocabulary suggests, and a substitute invented to fill the slot would be
    decoration looking for a reason. If the finished page reads flat, the fix is her painting
    arriving in the plate slot — which happens through the CMS with no deploy.
  - **No Jung passage from the rotating pool.** CONCEPT §6 does not ask for one here, her pool is
    empty so it would render nothing anyway, and a second contemplative moment would blunt the
    one sentence the page spends on the tradition.
  - **The plate is a labeled frame.** PAT-002 is satisfied structurally; a vector crossroads would
    invert the idea into the generated ornament DESIGN bans.
  - **No `FAQPage` JSON-LD** — the type stays on `/perguntas` (TASK-032). No `Service` payload
    either: the shared `(pages)` layout already emits both services on every page, and a second
    `Service` node describing the same offer is a worse signal than one.
  - **No `Ornament` anywhere on the page.** A page whose job is a decision needs fewer separators,
    not more; its one visual break is the plate.
- **What this pass could not verify at all:** no migration was generated, nothing was seeded, no
  build ran, and the page was never opened in a browser. The handoff states this plainly and lists
  the runtime checks the integrator's pass must run, including the CON-006 sweep.

**Verified 2026-08-05 (what this pass could actually run):** `tsgo --noEmit` reports **zero errors
in any file this task owns** (the only errors in the tree are in `src/view/mandala/Symbols.tsx`, a
sibling's in-flight work) · `oxlint --threads=1` over all 13 owned files: **0 errors, 0 warnings** ·
`oxfmt --write` clean · `vitest run src/domain/orientacaoProfissional` **10 tests green**, and
**16 of 16 deliberate mutations of the mapper each kill at least one test** · impeccable's
mechanical detector returns nothing over all six components and the route.

| Check                         | Result                                                                                                                                |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Sections, in CONCEPT §6 order | 7 + the credencial band, ids `abertura` · `para-quem` · `o-percurso` · `nem-coaching` · `pergunta-mais-funda` · `pratico` · `comecar` |
| Headings                      | exactly one `h1` (the abertura), seven `h2` via `SectionHeading`, `h3` only inside `para quem` (4) and `o percurso` (4)               |
| Drop cap                      | one, on the abertura's first paragraph                                                                                                |
| Tonal events                  | two `bg-parchment-deep` sections — `nem-coaching`, `comecar`                                                                          |
| `.roman-numeral`              | only in `o percurso`, I–IV                                                                                                            |
| Fee scope                     | `fees="careerGuidance"` — one row, this service alone                                                                                 |
| Client boundaries             | none; the page ships no JavaScript of its own and therefore no animation to give a reduced-motion alternative                         |
| CON-006                       | no wheel, sigil, zodiac word or predictive language in any owned file (grep clean)                                                    |
| CON-001                       | no `guarulhos` · `presencial` · `consultório` · `in-person` in any owned file                                                         |
| Hardcoded copy                | none — every visitor-facing string comes from the global or A Clínica; `messages` holds only the plate's placeholder caption and note |
| Provenance                    | nothing about the plate is defaulted; an untouched global leaves all four fields null                                                 |

## 3. Alternatives

- **ALT-001**: Put the plate in `para quem`, after the four situations. Rejected: a full editorial
  painting between "is this me?" and "what do I get?" delays exactly the answer this page's reader
  came for, and the crossroads amplifies the _tradition's_ reading of vocation, which lives four
  sections later.
- **ALT-002**: Put the plate in `quando a pergunta é mais funda`. Rejected: that section's whole
  craft is being short enough to read as permission rather than as an upsell, and a plate would
  turn a bridge into a destination.
- **ALT-003**: Build the comparison as a two-column spread (her practice · what else is on offer),
  the `DoisCaminhos` grammar. Rejected: with only one subject actually described it is the feature
  table minus its grid lines, and the second column can only be filled by characterising a coach
  — which the task forbids and which would be the page's one unprofessional moment.
- **ALT-004**: Invent a non-zodiacal set-piece for this page — a painted labyrinth the reader
  traces, or an animated crossroads. Rejected: PAT-002 says _at most_ one wow, CON-006 forecloses
  the vocabulary that would justify one here, and a set-piece built to fill a slot is decoration
  by definition. The plate is the art moment; the typographic figures carry the rest.
- **ALT-005**: Leave the percurso's phases unnumbered. Rejected: the programme's boundedness is
  the product claim, so the order is meaning rather than presentation — and DESIGN's own examples
  of a genuinely ordered sequence (the passo a passo, the pillars) are no more ordered than this.
- **ALT-006**: Fold the Jungian anchor into `nemCoaching.body`'s rich text rather than adding a
  field. Rejected: it would render as one more body paragraph and lose the Title-scale italic
  treatment that makes it the page's single sentence about the tradition. One localized textarea
  is a cheap migration for the page's most load-bearing line.
- **ALT-007**: Add a `paraQuem.intro` field for a framing paragraph. Rejected: the heading plus
  four named situations is already a complete frame, and a paragraph in front of them slows the
  one thing that section sells.
- **ALT-008**: Rename `abertura.body` to `abertura.lead` for consistency with
  `page-primeira-conversa`. Rejected for now: it buys naming symmetry and costs a rename
  migration on a live column, and this page's abertura is a CONCEPT §6 section rather than an
  added opening. Recorded in the handoff so the remaining four pages can settle it together.
- **ALT-009**: Quote both fees here, as `/primeira-conversa` does. Rejected: `/primeira-conversa`
  serves both doors and this page serves one, and on the page where the visitor is already
  comparing against a coach and a vocational test, a second price is one more axis of comparison
  for no gain (REQ-005).
- **ALT-010**: Emit a `Service` JSON-LD node for the programme. Rejected: the shared `(pages)`
  layout already declares both services on every page, and a duplicate node describing the same
  offer is a worse signal to a crawler than one.

## 4. Dependencies

- **DEP-001**: Phases 1–5 of `plan/architecture-site-restructure-1.md` plus TASK-035 and
  TASK-036 — the layered architecture, the i18n routing, the `page-orientacao-profissional`
  global, the Phase 5 primitives, and the page grammar promoted out of `view/inicio/`.
- **DEP-002**: `src/domain/clinica/getClinica.ts` for the fee, the availability state, the
  credential strip, the WhatsApp number and `notes.careerGuidance`.
- **DEP-003**: `next-intl` for the two scaffolding strings and the typed `Link` hrefs to
  `/analise` and `/primeira-conversa`.
- **DEP-004**: **TASK-037** (`/analise`). The bridge section links there, so the link 404s until
  that page ships. Not blocking, and not a defect of this page — the registry has carried the
  address since Phase 3.
- **DEP-005**: The integrator's pass — migration, `payload generate:types`, seed, registry flip,
  message merge, build and browser verification. All of it is listed in the handoff.
- **DEP-006**: Content from Luiza (master plan DEP-005) — never blocking: her own wording for
  every field, the fee value, and the crossroads plate all arrive through the CMS with no deploy.

## 5. Files

- **FILE-001**: `src/domain/orientacaoProfissional/{OrientacaoProfissional,orientacaoProfissionalFromPayload,orientacaoProfissionalFromPayload.test,getOrientacaoProfissional}.ts` — new.
- **FILE-002**: `src/infrastructure/payload/getPageOrientacaoProfissionalGlobal.ts` — new.
- **FILE-003**: `src/view/orientacaoProfissional/{Abertura,ParaQuem,OPercurso,NemCoaching,PerguntaMaisFunda,Pratico}.tsx` — new.
- **FILE-004**: `src/app/(frontend)/[locale]/(pages)/orientacao-profissional/page.tsx` — new.
- **FILE-005**: `src/payload/globals/pages/orientacaoProfissional.ts` — the plate group and the
  `anchor` field, plus a new migration under `src/migrations/` (integrator).
- **FILE-006**: `messages/{pt,en}.json` — an `orientacaoProfissional` namespace +
  `meta.orientacaoProfissional` (integrator; fragments supplied).
- **FILE-007**: `src/payload/seed/pages.ts` — the page's pt defaults (integrator; snippet supplied).
- **FILE-008**: `src/domain/site/{pages,pages.test}.ts` — `orientacaoProfissional` flipped to
  `built` (integrator; exact assertions supplied).
- **FILE-009**: `plan/architecture-site-restructure-1.md` — TASK-038 marked complete with
  execution notes (integrator).

## 6. Testing

- **TEST-001**: `orientacaoProfissionalFromPayload.test.ts` — an empty global maps to the
  defaults; a populated one maps every section; blank strings and empty Lexical states fall back;
  the plate resolves to `null` rather than to a broken image and is never defaulted; the four
  arrays survive order, treat `[]` as un-edited, drop rows unreadable **from either side**, and
  number a movement she left blank from its stored position.
- **TEST-002**: Mutation coverage — 16 deliberate mutations of the mapper, each killing at least
  one test: both sides of all four row filters, both sides of the rich-text guard, `filled`'s
  whitespace branch, the numeral fallback, all four empty-array collapses, and the `deliverable`
  and `anchor` fallbacks.
- **TEST-003**: `tsgo --noEmit` clean for every owned file; `oxlint` 0 errors and 0 warnings;
  `oxfmt` clean; impeccable's mechanical detector empty.
- **TEST-004** _(integrator)_: `/orientacao-profissional` and `/en/career-guidance` return 200
  with exactly one `h1` and the seven sections in order; `/en/orientacao-profissional` 307s to
  the English slug.
- **TEST-005** _(integrator)_: CON-006 sweep on both rendered locales — no zodiac imagery, no
  wheel, no sigil, no astrological or predictive language.
- **TEST-006** _(integrator)_: CON-001 sweep on both locales.
- **TEST-007** _(integrator)_: with both fees unset the prático list shows exactly one "a
  combinar" row; with **both** stated it still shows exactly one — this page never quotes the
  analysis fee.
- **TEST-008** _(integrator)_: the ask carries one `wa.me` anchor with the
  `notes.careerGuidance` opener, present in the **server-rendered** HTML.
- **TEST-009** _(integrator)_: the plate slot renders a labeled `MediaPlaceholder` at `3 / 2`,
  and no slot on the page is silently blank.
- **TEST-010** _(integrator)_: `pnpm build` exit 0 with `/[locale]/orientacao-profissional`
  `● (SSG)` prerendered per locale, the sitemap at 10 `<url>`, and both share cards 200
  `image/png`.

## 7. Risks & Assumptions

- **RISK-001**: **The whole page is drafted copy in her professional voice, about her own
  method.** It is the largest volume of un-signed-off prose the site carries, and two lines are
  claims rather than descriptions (the testing regulation, the PUC-SP wording). Mitigation: every
  field is a CMS field, the file comment names both claims, the handoff repeats them, and
  TASK-052 owns the review. Nothing in the drafts names a test instrument or a price.
- **RISK-002**: **The comparison section could still read as competitive.** The layout removes the
  table and the copy names no competitor, but "nem coaching" is CONCEPT's own heading and it is a
  negation. Mitigation: the framing paragraph says all three kinds of help can serve at different
  moments before describing only hers, and the three distinctions are affirmative. Worth her eye
  specifically — she is the one whose professional standing the section trades on.
- **RISK-003**: **`nem_coaching_plate_id` → `nem_coaching_plate_image_id` is a rename-shaped
  change.** `payload migrate:create` will likely offer it as a RENAME. Mitigation: the handoff
  says to prefer create + drop with `IF EXISTS`, and records that the column has never held data.
- **RISK-004**: **The page 500s in both locales until the message fragments are merged.**
  `pageMetadata` throws on a missing `meta.<key>`, and `useTranslations("orientacaoProfissional.plate")`
  throws at render. Mitigation: it is the first item in the handoff, marked blocking.
- **RISK-005**: **This page and `/analise` both describe pillar III.** CONCEPT §4 calls the
  overlap the bridge, not a bug, but the two bridge sections can still end up disagreeing about
  which question goes where. Mitigation: flagged for a side-by-side read once TASK-037 lands, the
  same way the mini-FAQ / `/perguntas` drift is flagged for TASK-040.
- **ASSUMPTION-001**: `page-orientacao-profissional` holds no production data — it was seeded
  empty in Phase 4 and prod has not been edited — so changing the plate field's type loses
  nothing.
- **ASSUMPTION-002**: English copy falls back to Portuguese wherever she has not translated
  (master plan RISK-001) — accepted, not a defect of this page.
- **ASSUMPTION-003**: Every string in `ORIENTACAO_PROFISSIONAL_DEFAULTS` is a draft written from
  CONCEPT §4/§6 and PRODUCT, not her words, and is labeled as such wherever it appears.

## 8. Related Specifications / Further Reading

- [plan/architecture-site-restructure-1.md](./architecture-site-restructure-1.md) — the master
  plan; this file executes its TASK-038
- [plan/feature-page-primeira-conversa-1.md](./feature-page-primeira-conversa-1.md) — the
  precedent this plan follows
- [plan/feature-page-inicio-1.md](./feature-page-inicio-1.md) — the first precedent
- [CONCEPT.md](../CONCEPT.md) §4 (the two doors and the boundary sentence), §6 (the map,
  /orientacao-profissional, and the no-zodiac note), §8.9 (currency and time zones), §10 (why
  this page is the strongest non-brand asset), §11 (policies), §12 (the crossroads plate as a
  could-have)
- [DESIGN.md](../DESIGN.md) — the two voices, manuscript numerals, rubrication, the plate grammar,
  §6 Do's and Don'ts (card grids, the zodiac ban on this page specifically)
- [PRODUCT.md](../PRODUCT.md) — the offer's second door; the anti-references this page is closest
  to drifting into
- `frontend:layered-frontend-architecture` skill — the architecture contract
