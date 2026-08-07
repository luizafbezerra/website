---
goal: Rebuild Perguntas (`/perguntas`) — the four category sections of CONCEPT §6 rendered from the Faq collection, with the page's own opening, its one plate, and the site's only FAQPage entity
version: 1.0
date_created: 2026-08-05
last_updated: 2026-08-05
owner: João Vogler (dev); content sign-off — Luiza Fernandes Bezerra
status: "Completed"
tags: [feature, page, design, i18n, cms, aeo]
---

# Introduction

![Status: Completed](https://img.shields.io/badge/status-Completed-brightgreen)

This plan executes **TASK-040** of [`plan/architecture-site-restructure-1.md`](./architecture-site-restructure-1.md) under its per-page ritual (PAT-001), following the precedent of [`plan/feature-page-primeira-conversa-1.md`](./feature-page-primeira-conversa-1.md).

The page's job, in CONCEPT's words: **resolve the one specific doubt stopping me from writing.** It is the only page on the site whose visitor arrives already holding a question, and the only page whose success is measured by how fast they stop reading it. Everything else on the site argues; this page answers.

It is also the page the machine audience reads most literally. CONCEPT §10 asks for the FAQ "structured as discrete Q&A blocks (análise · orientação · prático · internacional) — the exact questions assistants get asked", and the master plan reserves the `FAQPage` entity here alone: `/primeira-conversa`'s mini-FAQ deliberately emits none, because two overlapping FAQPage entities is a worse signal to a crawler than one complete page.

**Unlike the other Phase 6 pages, this one already existed** — and that is the substance of the task. The route rendered `src/view/faq/Faq.tsx`, a flat numbered list of six questions under a hardcoded Portuguese `h2`. Four defects, all structural:

1. **No `h1`.** The document's outline started at `h2`, so the page failed REQ-012's one-`h1` rule and had no front-load at all.
2. **`/en/questions` was in Portuguese.** The heading and the tracked-caps eyebrow above it were hardcoded strings, not CMS fields — GUD-002, and the one place on the site where the English mirror printed Portuguese chrome.
3. **One section instead of four.** CONCEPT's four categories existed in the schema (`FAQ_CATEGORIES`, the collection's required `category` field, four heading groups in the `page-perguntas` global) and were rendered by nothing.
4. **Two of the four sections had no questions.** Phase 4 left `orientacao` and `internacional` deliberately empty to avoid inventing her answers — correct then, but it means CONCEPT's four-section page would have shipped as a two-section page.

**One decision was taken before writing this plan** and is treated as a settled input:

- **Nine drafted answers ship, marked as drafts** — resolving defect 4 the way the primeira-conversa build resolved its own copy gap. `orientacao` and `internacional` get four each and `pratico` gets one (confidentiality, which CONCEPT §6 names and her supplied copy never answered). Each states only facts CONCEPT/PRODUCT already fix; none invents a price, a platform brand, or a payment mechanism. Rejected: shipping two of four sections (CONCEPT's map is law, and a page missing half its structure is not reviewable), and labeled placeholder sections (an "answers coming soon" frame on the page whose job is answering is worse than a missing section).

## 0. Shape brief

The direction contract is settled — DESIGN.md fixes the visual system, CONCEPT §6 fixes the four sections and their order, CONCEPT §10 fixes the presentation as discrete Q&A blocks — so the shape work resolved only what was materially open on this page.

- **Sequence: orient, then answer, then hand off.** Abertura (`h1` + one paragraph + the page's single drop cap) → credencial strip → **Sobre a análise** → **Sobre a orientação profissional** → _the plate_ → **Prático** → **Internacional** → the close. The four sections are CONCEPT's order and it is an argument, not an accident: what the two works _are_, then how the work _runs_, then how it runs _from abroad_.
- **Focal moment: none, deliberately.** This is the one page in Phase 6 with no set-piece and no wow. DESIGN allows at most one per page, not at least one, and a page whose visitor is scanning for a single paragraph has nothing to gain from a moment that asks to be watched. The plate is the page's only image, and it is a breath rather than an event.
- **The plate sits at the hinge, after the second section.** With all four present that is exactly where the page turns from _what these two works are_ to _how they run_ — a full editorial painting reads as the turn. Not in the opening (it would delay the front-load); not at the close (the hand-off is the quietest moment on the page and a plate above it would be the loudest).
- **Tonal rhythm: parchment throughout, with exactly one break** — `parchment-deep` under the close. A long uniform scroll of four structurally identical sections needs one signal that the answers have ended; a deeper parchment says it without raising the page's voice. Spending a second tonal event on one of the four sections would be striping, which is what DESIGN §4 names as the failure mode.
- **The close is marginalia, not a CTA.** CONCEPT §6 gives this page four sections and no "Começar". The terminal terracotta block belongs to the service and reach pages and to `/primeira-conversa`, where the whole page is the ask; a filled block after sixteen answers would turn a reference page into a sales page at the exact moment the visitor is being careful. Two quiet affordances: a `wa.me` link in the marginalia voice and a `SectionLink` to `/primeira-conversa`.
- **Anti-goals.** No accordions (a collapsed answer is one a crawler has to be given twice and an anxious reader has to work for; hiding the text spends the page's whole purpose to save scroll). No card grid — DESIGN bans it and a question is a paragraph, not a tile. No numbering, per section or continuous (see the Execution notes). No tracked-caps eyebrow, at the top or above any section. No Jung passage: the page's register is plain answers, and a contemplative moment between "quanto custa" and "como pago de fora" would read as evasion. No availability line — the footer already carries it on every page.

## 1. Requirements & Constraints

- **REQ-001**: All four CONCEPT §6 sections ship in the map's order — Sobre a análise · Sobre a orientação profissional · Prático · Internacional — preceded by the page's own opening and credencial strip, and followed by the close.
- **REQ-002**: A section with **zero questions does not render**. An `h2` over nothing reads as a page that broke rather than as a page with nothing to say there yet.
- **REQ-003**: Every visitor-facing string reads from `page-perguntas` or the `faq` collection — never hardcoded (master plan GUD-002). Only scaffolding a visitor cannot meaningfully edit lives in `messages/{pt,en}.json`: the plate's placeholder caption and its note.
- **REQ-004**: AEO front-load (master plan REQ-012): the abertura carries what the page answers · which two services · format · rhythm · languages · reach, as semantic HTML with **exactly one `h1`**. The page had none before.
- **REQ-005**: **Discrete Q&A blocks** (CONCEPT §10): a `<dl>` of `<dt>`/`<dd>` pairs separated by a hairline, every answer in the server-rendered HTML, no interaction required to read anything.
- **REQ-006**: `FAQPage` JSON-LD is emitted here and nowhere else (master plan TASK-032), and its entries are **derived from the rendered sections** rather than from the flat list, so it can never declare a question the visitor does not see.
- **REQ-007**: Both locales render; untranslated fields fall back to Portuguese through Payload's `fallback: true` (master plan RISK-001).
- **REQ-008**: `getFaq(locale): Promise<FaqEntry[]>` keeps its signature and return type — `src/app/(frontend)/llms.txt/route.ts` reads it and Phase 7 owns that file. Grouping is a **separate pure rule** with its own colocated test, not a change to the action.
- **SEC-001**: The page reads nothing about the visitor. No cookie, no storage, no per-visitor branching, no rotation keyed to anything but the clock.
- **CON-001**: Online-only. No question, answer, section heading, plate caption or placeholder label may imply a room a patient walks into. Two of her six supplied answers described one and were restructured (master plan CON-001).
- **CON-002**: Layered architecture (master plan CON-003): `infrastructure/payload/` accessor → `domain/perguntas/` type + mapper + action and `domain/faq/` entries + grouping rule → route fetches and passes props → `view/perguntas/` renders. No component sees a raw Payload shape; nothing in `src/domain/` imports React, Next or next-intl.
- **CON-003**: Server components throughout. Nothing on this page needs an interaction, which is the point of refusing accordions.
- **GUD-001**: DESIGN.md governs every visual call — all-serif, the plate the only saturation, terracotta the one recurring accent, flat on parchment, near-sharp edges, one drop cap for the page, the two-voices rule on every text element.
- **GUD-002**: CONCEPT §11 authorship. Her supplied text is the source copy: six of the sixteen answers are hers and are organized and trimmed, never rewritten. The nine drafts are marked as drafts in `FAQ_DEFAULTS` and listed below for her sign-off.
- **PAT-001**: Placeholder policy (master plan REQ-005): the plate slot renders `MediaPlaceholder` with a label saying what belongs there until her painting is chosen and its provenance verified.
- **PAT-002**: One plate per page, at most one wow — this page takes the plate and declines the wow.
- **PAT-003**: One concept per file, named exports, no barrels.

## 2. Implementation Steps

### Implementation Phase 1

- GOAL-001: The data slice — the page's frame and the four sections' worth of questions reach a React component as normalized domain types, with a code fallback for every field.

| Task     | Description                                                                                                                                                                                                                                                                                                                                            | Completed | Date       |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- | ---------- |
| TASK-001 | Rework `src/payload/globals/pages/perguntas.ts`: drop `abertura.eyebrow`, add a `plate` tab (`mediaSlot` + painter · localized title · year, copying `primeiraConversa.permissoes.plate`) and a `fecho` tab (heading · body · WhatsApp label · link label), and write the mini-FAQ register rule into the global's doc comment and admin descriptions. | ✅        | 2026-08-05 |
| TASK-002 | Create `src/infrastructure/payload/getPagePerguntasGlobal.ts` — locale-aware accessor with request-scoped `cache()`, `depth: 1` for the plate upload; colocate its raw `PayloadPagePerguntas` type, with `sections` keyed by `FaqCategory` so a fifth category becomes a type error rather than a section that silently never renders.                 | ✅        | 2026-08-05 |
| TASK-003 | Create `src/domain/perguntas/Perguntas.ts` — the type (`abertura`, `sections` as `Record<FaqCategory, PerguntasSection>`, `plate`, `fecho`) plus `PERGUNTAS_DEFAULTS`. The four section headings are CONCEPT §6's names verbatim; the opening and close are drafts.                                                                                    | ✅        | 2026-08-05 |
| TASK-004 | Create `src/domain/perguntas/perguntasFromPayload.ts` + `getPerguntas.ts`, with a colocated `perguntasFromPayload.test.ts` covering the empty global, cleared strings, the per-section heading fallback, the intro's deliberate absence, and the plate resolving to a label without an image.                                                          | ✅        | 2026-08-05 |
| TASK-005 | Create `src/domain/faq/groupFaqByCategory.ts` + test — the pure rule: order by `FAQ_CATEGORIES` (never by arrival), drop a category with no questions, keep within-section order stable, lose and duplicate nothing. `getFaq` is untouched (REQ-008).                                                                                                  | ✅        | 2026-08-05 |
| TASK-006 | Audit the six existing `FAQ_DEFAULTS` entries against CONCEPT v3 and CON-001, and draft nine more so all four sections have questions. Regroup the array into CONCEPT §6's category order so the file reads the way the page reads.                                                                                                                    | ✅        | 2026-08-05 |

### Implementation Phase 2

- GOAL-002: The page, built on the shared grammar — an opening that front-loads, four sections that cannot print an empty heading, and a close that hands off quietly.

| Task     | Description                                                                                                                                                                                                                                                                  | Completed | Date       |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-007 | `src/view/perguntas/Abertura.tsx` — the page's one `h1` at Headline scale and one paragraph in body prose carrying the page's single `.dropcap` and the whole AEO front-load. No eyebrow, no portrait.                                                                       | ✅        | 2026-08-05 |
| TASK-008 | `src/view/perguntas/Secao.tsx` — one category section: `SectionHeading`, the optional intro, then a `<dl>` of discrete Q&A blocks separated by `<Ornament variant="rule" />`. No numbering, no accordion, no cards.                                                          | ✅        | 2026-08-05 |
| TASK-009 | `src/view/perguntas/Secoes.tsx` — the sequence, plus the plate at the breath after the second rendered section, via `<Plate>` and `pagePlateFrom`'s label (PAT-001/PAT-002).                                                                                                 | ✅        | 2026-08-05 |
| TASK-010 | `src/view/perguntas/Fecho.tsx` — the close on `parchment-deep`: her line, a `WhatsAppCta variant="quiet"` and a `SectionLink` to `/primeira-conversa`. No terracotta block, no availability line.                                                                            | ✅        | 2026-08-05 |
| TASK-011 | Rewrite the route: `getClinica` + `getPerguntas` + `getFaq` in parallel, `groupFaqByCategory`, `FaqJsonLd` fed from the grouped sections, `BreadcrumbJsonLd`, then the sections in order. Delete `src/view/faq/Faq.tsx` and the now-empty `src/view/faq/`.                   | ✅        | 2026-08-05 |
| TASK-012 | Write the handoff: the `perguntas` message namespace and the corrected `meta.perguntas` pair, the `page-perguntas` seed snippet, and the integrator's list (the schema drop and its rename hazard, the two admin descriptions in files owned elsewhere, the runtime checks). | ✅        | 2026-08-05 |

**Execution notes (2026-08-05)**

- **As built.** `src/domain/perguntas/{Perguntas,perguntasFromPayload,perguntasFromPayload.test,getPerguntas}.ts` · `src/domain/faq/{groupFaqByCategory,groupFaqByCategory.test}.ts` · `src/domain/faq/FaqEntry.ts` (audited + 9 drafts + regrouped) · `src/infrastructure/payload/getPagePerguntasGlobal.ts` · `src/view/perguntas/{Abertura,Secao,Secoes,Fecho}.tsx` · `src/payload/globals/pages/perguntas.ts` · the route. Deleted: `src/view/faq/Faq.tsx` and its directory. 15 new tests in 2 files.

- **Nine decisions the task text left open.**
  1. **The `eyebrow` field does not earn its place, and was removed rather than left unrendered.** Início's `contato` is the site's one precedent for a tracked-caps kicker, and it earns it on two counts DESIGN §6 respects: the string is her own copy, and it marks a genuine change of register at the ask. Neither holds at the top of a reference page. This page stacks one `h1` over four `h2`s; a fifth orienting line before the first says nothing the title does not, and DESIGN §6 names exactly that as scaffolding. Leaving the field in the schema unrendered was the worse third option — a CMS field she can type into that never appears is a trap, not a spare. The cost is the only `DROP COLUMN` in Phase 6, on a global the seed has never written; the migration hazard it creates is flagged in the handoff.

  2. **The opening stayed a textarea rather than becoming rich text.** `primeiraConversa.abertura.lead` is a rich-text field carrying two paragraphs; this one is one paragraph, and converting `varchar` → `jsonb` would have been the second destructive change in an otherwise additive migration for a paragraph count. One paragraph is also the right length: the answers are the content of this page, and an opening that argued would delay exactly what the visitor came for.

  3. **The numbering did not survive the split.** The old flat list printed `1.` to `6.` down one column. Continuous numbering across four sections starts the second section at four; per-section restarts print four short ordered lists. DESIGN reserves `.roman-numeral` and enumerators for sequences that genuinely are ordered — the pillars, the passo a passo — and nobody reads a FAQ in order; they jump to the doubt they arrived with. Dropping the numbers also keeps the enumerator vocabulary meaningful on the pages that have a real sequence.

  4. **RISK-002 is resolved as a register split, written down in three places.** The mini-FAQ and this page can drift into answering the same question differently. The rule: _this_ page carries the question somebody would type into a search box, answered at reference length; the mini-FAQ carries the doubt that stops somebody on the threshold, in two sentences, and repeats no question from here. Implemented where I own the files — the rule is stated in `FaqEntry.ts`'s header and in `page-perguntas`'s doc comment and admin description, and every draft was checked against the mini-FAQ's four. One pair was genuinely too close and was deliberately worded apart: the mini-FAQ's "Você atende quem mora fora do Brasil?" (permission, two sentences) against this page's "Como funcionam as sessões para quem mora fora do Brasil?" (format, three), and the two agree on every fact. Two admin descriptions that would hold _her_ to the rule live in files this task does not own (`primeiraConversa.ts`'s miniFaq tab and `Faq.ts`'s collection description); both are written out verbatim in the handoff for the integrator.

  5. **The plate sits after the second rendered section, by a rule rather than by a category name.** With all four sections present that is the hinge between the two about the work and the two about how it runs. Expressing it as "after `orientacao`" would have broken the moment she empties that section — the plate would land immediately after the opening's neighbour. `Math.min(1, sections.length - 1)` keeps it mid-scroll at any section count and reads as what it is: the page's one breath, in the middle.

  6. **`FaqJsonLd` is fed from the grouped sections, not from `getFaq`'s flat list.** The two are equal today — every entry carries one of the four categories, and a section is empty exactly when nothing is filed under it. But "equal today" is the kind of invariant that quietly stops holding, and the failure is invisible: markup declaring a question the page does not show. `sections.flatMap((s) => s.entries)` makes the equality structural instead of incidental, and `groupFaqByCategory`'s test asserts the count and uniqueness that guarantee it.

  7. **No `Comecar` block.** `Comecar` exists in `view/general/` and its own doc comment scopes it to "a service or reach page". CONCEPT §6 gives this page four sections and no "Começar", so the close is two marginalia affordances instead — and the availability line was left out entirely, because the footer already carries it and `/primeira-conversa` found that two copies within one screen read as a rendering fault.

  8. **The four `sections[*].intro` fields ship empty, not drafted.** They are the only fields on the page with no default. Four drafted framing lines would put four paragraphs between the reader and the first answer on a page whose job is speed; the field exists for the section that one day needs one. This is also the mapper's only field where trimming is load-bearing rather than cosmetic — with no default to fall back to, a whitespace-only value would render as a blank gap above the section's first question. That is the mutant the test suite initially missed (below).

  9. **The credencial strip stays on this page.** It is not in the header nav and a visitor can arrive here from a Google FAQ result having seen nothing else of the site, so the strip is the only thing on the first screen answering "who will receive me here?". `width="column"`, matching the reading column, per the alignment defect the primeira-conversa build fixed.

- **The audit of her six answers came out narrower than the task text expected, and for a good reason.** `docs/content-export-2026-08.md` shows all six are **her own copy from the old site's database**, not defaults drafted for her — including the two the file's TODO had flagged as suspect. So CONCEPT §11 binds: they are organized and trimmed, never rewritten. What changed and what did not:
  - **"E em relação a valores?"** — kept verbatim. The TODO asked for her pricing policy to be confirmed; the export shows the policy _is_ hers ("conforme a modalidade e a frequência", with `modalidade` already dropped for CON-001, and the "respondo em até um dia útil" response window). Worth recording as a side finding: **the response window the primeira-conversa build flagged as an unconfirmed draft is actually her own wording**, which resolves half of that flag. What remains genuinely open is narrower and is now the specific TASK-052 question: the answer predates the two-door model and describes analysis, so is orientação priced apart? It quotes no number, so it cannot go stale against `clinica.fees`.
  - **"Você atende adolescentes ou crianças?"** — kept. "O consultório atende adultos" had already become "A clínica atende adultos" for CON-001. Considered and rejected: moving it from `analise` to `pratico`, since the answer is clinic-wide. It is a question about who the clinical work is for, and CONCEPT §6 gives `pratico` a different subject list (fees · schedules · confidentiality · video sessions).
  - **"Como funcionam as sessões on-line?"** — kept as previously restructured. Her question was "Atendimento online ou presencial?" and her answer named an office in Guarulhos; the choice no longer exists, so the question became how the online session works, and her own closing sentence ("pela tela, o trabalho não se faz menos") survives because it answers the doubt underneath the question rather than the question.
  - **Nothing contradicted CONCEPT v3.** The only genuine gap was a missing subject, not a wrong statement: CONCEPT §6 names "confidentiality online" as one of `pratico`'s four subjects and her copy answered it only as a clause inside another answer — while the page's own metadata already promised "sigilo". That is now a drafted entry of its own.
  - **The array was regrouped** into CONCEPT §6's category order (it had been interleaved), so `seed/faq.ts` writes `order` as the within-section order and the file reads the way the page reads.

- **A surviving mutant was found and closed.** Replacing `intro: filled(raw?.intro)` with `intro: raw?.intro ?? null` in the mapper passed the whole suite. The test asserted that an _unwritten_ intro is absent and that a _written_ one survives, but never that a **cleared** one is absent — and because `intro` is the one field with no default, trimming is the only thing standing between a whitespace-only value and a blank paragraph opening a gap above the section's first question. This is the same shape of gap the primeira-conversa build found in `feeQuoteFrom`: a condition tested on one side only. Added the case; the mutant now dies. Three mutations of `groupFaqByCategory` were also confirmed to kill tests — dropping the empty-section guard (3 failures), grouping in first-appearance order instead of `FAQ_CATEGORIES` order (1), and reversing within-section order (2) — as was dropping the per-section heading fallback (1).

- **Copy needing her sign-off.** Six of sixteen answers are hers. **Nine are drafts** and are marked `DRAFT` in `FAQ_DEFAULTS`: four under Sobre a orientação profissional (duration, the tests, the deliverable, the boundary with análise), four under Internacional (how sessions work from abroad, time zones, paying from abroad, sessions in English), and one under Prático (online confidentiality). The page's opening paragraph and the whole close are drafts too. **Three of the drafts are policy rather than description** and need her word specifically, not merely her approval: "Não gravo os encontros", "Não faço conversão automática do valor em reais" (CONCEPT §8.9 fixes the framing but not this sentence), and — hers, but still a commitment — "posso indicar colegas de confiança". TASK-052 owns the review; every one is a CMS row, so her wording replaces a draft with no deploy.

- **Deliberately not done.**
  - **No set-piece and no wow.** DESIGN allows at most one per page, not at least one. A visitor scanning for one paragraph gains nothing from a moment that asks to be watched, and the two greenlit set-pieces (the Cosmos, the wheel) belong to Início and `/analise`.
  - **No per-section link to the page each section derives from.** It was attractive — a resolved doubt is a reader ready for depth — but four link affordances plus the close's makes five identical marginalia gestures on one page, which is repetition rather than navigation, and it would have made this page depend on three sibling routes existing. The header and footer carry the map.
  - **No English `FAQ_DEFAULTS`.** `getFaq`'s signature is fixed by `/llms.txt` (REQ-008), and a second locale-keyed default set would make this the only page on the site with one. `/en/questions` shows Portuguese answers until she translates them in the admin — the site-wide RISK-001, flagged in the handoff as the largest single translation debt on the site (16 rows × 2 localized fields).
  - **The plate is a labeled frame.** PAT-002 is satisfied structurally; the painting arrives through the CMS with no deploy, and a vector stand-in would invert the idea into the generated ornament DESIGN bans.
  - **`<hr>` inside `<dl>`** is retained. The hairline sits inside the `div` wrapping each `dt`/`dd` pair, which the HTML content model does not strictly allow. It is `aria-hidden`, it is exactly what the shipped `MiniFaq.tsx` does, and diverging would make the site's two FAQ surfaces structurally different to save a validator warning. Recorded in the handoff so a Phase 8 validator run is not a surprise, with the fix (a `border-t` on the wrapper) to be applied to both components at once if it is.

**Verified 2026-08-05:** `pnpm typecheck` exit 0 across the whole repository (it reported 8 errors mid-task, all in `src/view/mandala/Symbols.tsx` and `src/view/analise/MandalaWheel.tsx` — a sibling's in-flight TASK-037 work, none in this page's files; they cleared before the final run) · `vitest run src/domain/perguntas src/domain/faq` 15 tests in 2 files green and mutation-checked (4 mutations of `groupFaqByCategory`/the mapper each kill at least one test; the one that survived is closed) · `oxlint --threads=1` over every file of this task: 0 warnings, 0 errors on 17 files · `oxfmt --write` clean · impeccable's mechanical detector returns `[]` over all four new components and the route · no remaining reference to `@/view/faq` anywhere in `src/`.

Not verified, because the brief reserves it for the integrator: no `payload migrate:create`, no `generate:types`, no `pnpm seed`, no `pnpm build`, no browser. The handoff lists every runtime check that pass should run, with expected counts.

## 3. Alternatives

- **ALT-001**: Render the `eyebrow` field above the `h1`. Rejected — DESIGN §6 names a kicker over a heading as scaffolding, and Início's precedent earns its eyebrow on grounds (her own copy, a genuine change of register at the ask) that do not exist at the top of a reference page.
- **ALT-002**: Leave `eyebrow` in the schema, unrendered. Rejected as the worst of the three: a CMS field she can type into that never reaches the page.
- **ALT-003**: Add grouping to `getFaq` by returning a grouped shape. Rejected — `/llms.txt` reads `getFaq(locale): Promise<FaqEntry[]>` and Phase 7 owns that file (REQ-008). Grouping is a pure rule with its own test, which is where it belongs anyway: it has no I/O.
- **ALT-004**: Render all four sections always, with an empty state for the two without questions. Rejected — an `h2` over nothing reads as breakage, and an "answers coming soon" frame on the page whose job is answering is worse than a missing section. `MediaPlaceholder`'s policy is for _assets_, not for copy.
- **ALT-005**: Ship two sections and wait for her answers. Rejected — CONCEPT's map is law and a page missing half its structure cannot be reviewed at TASK-052, which is the point of shipping drafts at all.
- **ALT-006**: Accordions, so sixteen questions fit one screen. Rejected — CONCEPT §10 asks for discrete Q&A blocks, a collapsed answer costs a crawler a second read and an anxious reader a decision, and the page's whole purpose is that the answer is already there.
- **ALT-007**: Keep the numbering, restarting per section. Rejected — DESIGN reserves enumerators for genuine sequences, and a FAQ is read by jumping.
- **ALT-008**: Use `Comecar` for the close, with the terracotta block. Rejected — CONCEPT §6 gives this page no "Começar", and a filled CTA after sixteen answers turns a reference page into a sales page.
- **ALT-009**: A `SectionLink` at the end of each section, to the page it derives from. Rejected — five identical marginalia gestures on one page is repetition, and it would make this page depend on three sibling routes landing.
- **ALT-010**: Convert `abertura.intro` to rich text, matching `/primeira-conversa`'s lead. Rejected — a `varchar` → `jsonb` change for a paragraph count, in a migration that is otherwise additive but one drop.
- **ALT-011**: Draft an English `FAQ_DEFAULTS` set so `/en/questions` reads in English on an empty database. Rejected — it would make this the only page with locale-keyed defaults, and Payload's `fallback: true` is the site's answer to untranslated copy everywhere else.

## 4. Dependencies

- **DEP-001**: Phases 1–5 of `plan/architecture-site-restructure-1.md` plus TASK-035 and TASK-036 — the layered architecture, the i18n routing, the `page-perguntas` global and the `faq` collection from Phase 4, the Phase 5 primitives, and the page grammar promoted out of `view/inicio/`.
- **DEP-002**: `src/domain/clinica/getClinica.ts` for the credential strip and the WhatsApp number in the close.
- **DEP-003**: `src/view/seo/jsonLd.tsx`'s `FaqJsonLd` and `BreadcrumbJsonLd`, used unmodified.
- **DEP-004**: `next-intl` for the two plate scaffolding strings and the typed `Link` href to `/primeira-conversa`.
- **DEP-005**: Content from Luiza (master plan DEP-005) — never blocking: the nine drafted answers, the English translations, the plate and its provenance all arrive through the CMS with no deploy.

## 5. Files

- **FILE-001**: `src/domain/perguntas/{Perguntas,perguntasFromPayload,perguntasFromPayload.test,getPerguntas}.ts` — new.
- **FILE-002**: `src/domain/faq/{groupFaqByCategory,groupFaqByCategory.test}.ts` — new.
- **FILE-003**: `src/domain/faq/FaqEntry.ts` — audited, regrouped, nine drafts added (6 → 16 entries).
- **FILE-004**: `src/infrastructure/payload/getPagePerguntasGlobal.ts` — new.
- **FILE-005**: `src/view/perguntas/{Abertura,Secao,Secoes,Fecho}.tsx` — new.
- **FILE-006**: `src/view/faq/Faq.tsx` — **deleted**, with its directory.
- **FILE-007**: `src/app/(frontend)/[locale]/(pages)/perguntas/page.tsx` — rewritten.
- **FILE-008**: `src/payload/globals/pages/perguntas.ts` — `abertura.eyebrow` removed; `plate` and `fecho` tabs added; the register rule written into the doc comment and the admin descriptions. Needs a migration (integrator).
- **FILE-009**: `messages/{pt,en}.json` — a `perguntas` namespace plus a corrected `meta.perguntas` pair (integrator, from the handoff).
- **FILE-010**: `src/payload/seed/pages.ts` — the `page-perguntas` block (integrator, from the handoff). `src/payload/seed/faq.ts` is unchanged but now writes 16 rows.
- **FILE-011**: `plan/architecture-site-restructure-1.md` — TASK-040 marked complete with execution notes (integrator).

## 6. Testing

- **TEST-001**: `groupFaqByCategory.test.ts` — nothing to render from an empty list; the section order is `FAQ_CATEGORIES` whatever order entries arrive in; within-section order is stable; a category with no questions produces no section; a single populated category produces one section; every entry is filed exactly once; the shipped defaults fill all four CONCEPT sections.
- **TEST-002**: `perguntasFromPayload.test.ts` — an untouched global maps to the defaults; cleared strings fall back; her wording survives field by field; a section heading falls back to CONCEPT's own section name; a section intro is absent rather than drafted, and a _cleared_ intro is absent rather than a blank paragraph; the plate resolves to a label without an image and refuses an upload with no intrinsic size.
- **TEST-003**: Mutation checks — the empty-section guard, the `FAQ_CATEGORIES` ordering, within-section stability, the per-section heading fallback, and the intro's trim each kill at least one test.
- **TEST-004**: `pnpm typecheck` clean for this task's files; `oxlint --threads=1` 0 errors and 0 warnings over them; `oxfmt` clean; impeccable's detector `[]`.
- **TEST-005** _(integrator)_: `/perguntas` and `/en/questions` return 200 with **exactly one `h1`**, four section ids in CONCEPT order plus the close, 16 `<dt>`, 12 hairlines and one `.dropcap`.
- **TEST-006** _(integrator)_: `FAQPage` `mainEntity` has 16 members and its `name` set equals the page's `<dt>` set in both directions.
- **TEST-007** _(integrator)_: emptying `orientacao` in the admin removes its `h2` entirely, leaves three sections, drops `mainEntity` to 12, and moves the plate after `pratico`.
- **TEST-008** _(integrator)_: CON-001 sweep on both locales — no `guarulhos`, `presencial`, `consultório`, `in-person`.
- **TEST-009** _(integrator)_: no terracotta CTA block on the page; the close's two links resolve, the `/primeira-conversa` one localizing to `/en/first-conversation`.
- **TEST-010** _(integrator)_: `/llms.txt` still 200 with a grown `faqTokens`; `/primeira-conversa` unregressed with four mini-FAQ entries and no `FAQPage`.

## 7. Risks & Assumptions

- **RISK-001**: **The one `DROP COLUMN` in Phase 6 lands in the same migration as four new localized varchar columns on the same table.** `migrate:create` will plausibly offer `abertura_eyebrow` → one of the four `fecho_*` columns as a rename, and accepting it would silently move a never-used column into a field the seed then overwrites. Mitigation: the handoff flags it as the page's single migration hazard, with the instruction to answer "create" and to audit the SQL for `RENAME` and add `IF EXISTS` to every drop, per the Phase 4/6 procedure.
- **RISK-002**: **Nine of sixteen answers are not her words**, on the page a cold searcher is most likely to quote. Mitigation: each states only facts CONCEPT/PRODUCT already fix, each is marked `DRAFT` in `FAQ_DEFAULTS` with the fact it rests on, none invents a price or a mechanism, the three that are policy rather than description are called out separately, and every one is a CMS row TASK-052 can replace with no deploy.
- **RISK-003**: **The two FAQ surfaces can still drift**, because keeping them apart is now a written rule rather than a structural guarantee — the mini-FAQ genuinely needs its own shorter answers (ALT-004 of the primeira-conversa plan), so deriving one from the other was never the fix. Mitigation: the rule is stated in three code comments plus two admin descriptions, and no question is duplicated today. Residual: nothing prevents her from adding one. A structural fix would mean a shared question registry, which is more machinery than two surfaces of five and sixteen entries warrant.
- **RISK-004**: **The fee is now described in prose in a FAQ row and quoted from `clinica.fees` on three other pages.** The row quotes no number, so it cannot contradict them — but if she publishes a price in `clinica.fees` and edits the number into this answer too, they can diverge. Mitigation: the recommended collection description says not to write a value here.
- **ASSUMPTION-001**: `page-perguntas` holds no production data — Phase 4 created it, `seed/pages.ts` never wrote it, and the branch has not merged — so dropping `abertura.eyebrow` loses nothing. **The integrator should confirm this against the prod global before migrating**, because prod CMS values override code defaults and are not visible from this repository.
- **ASSUMPTION-002**: English copy falls back to Portuguese wherever she has not translated (master plan RISK-001) — accepted, not a defect of this page, though the volume here is larger than anywhere else.
- **ASSUMPTION-003**: The six carried-over answers are her supplied copy, on the evidence of `docs/content-export-2026-08.md`, and are therefore organized and trimmed rather than rewritten.

## 8. Related Specifications / Further Reading

- [plan/architecture-site-restructure-1.md](./architecture-site-restructure-1.md) — the master plan; this file executes its TASK-040 and closes its TASK-036 note on RISK-002
- [plan/feature-page-primeira-conversa-1.md](./feature-page-primeira-conversa-1.md) — the precedent this plan follows, and the source of RISK-002
- [plan/feature-page-inicio-1.md](./feature-page-inicio-1.md) — the first precedent; the source of the `[]`-is-not-absent rule and the eyebrow's only sanctioned use
- [CONCEPT.md](../CONCEPT.md) §6 (the map, /perguntas), §4 (the two doors and the boundary sentence), §8.9 (currency and time zones), §10 (AEO and the discrete Q&A blocks), §11 (policies)
- [DESIGN.md](../DESIGN.md) — the two voices, the plate grammar, the drop-cap rule, §4 tonal depth, §6 Do's and Don'ts (the eyebrow-as-scaffolding ban)
- [PRODUCT.md](../PRODUCT.md) — ranked audiences; the second (the cold pt-BR searcher) and the sixth (AI agents) are this page's
- `docs/content-export-2026-08.md` — the provenance of the six carried-over answers
- `frontend:layered-frontend-architecture` skill — the architecture contract
