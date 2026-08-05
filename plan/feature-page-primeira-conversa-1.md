---
goal: Build A primeira conversa (`/primeira-conversa`) — the five CONCEPT §6 sections in both locales, CMS-backed, with O bilhete and its wax seal as the page's one set-piece
version: 1.0
date_created: 2026-08-05
last_updated: 2026-08-05
owner: João Vogler (dev); content sign-off — Luiza Fernandes Bezerra
status: "Completed"
tags: [feature, page, design, i18n, cms]
---

# Introduction

![Status: Completed](https://img.shields.io/badge/status-Completed-brightgreen)

This plan executes **TASK-036** of [`plan/architecture-site-restructure-1.md`](./architecture-site-restructure-1.md) under its per-page ritual (PAT-001): the threshold page, built from the `page-primeira-conversa` global that Phase 4 created and the primitives Phase 5 built, following the Início precedent in [`plan/feature-page-inicio-1.md`](./feature-page-inicio-1.md).

The page's job, in CONCEPT's words: **cross the threshold — know exactly what happens when I write, and write.** Every other page argues that she is the right person; this one removes the last reason not to send a message. Its audience is PRODUCT's second user at their worst moment — anxious, on a phone, at night — so the page's whole craft is spent on lowering the cost of one tap.

It is also the page where the site's north star is actually collected. Início ends on a WhatsApp CTA; `/analise`, `/orientacao-profissional` and `/internacional` will each hand off here. **O bilhete is therefore not a nice touch on this page — it is the page.**

**One decision was taken before writing this plan** and is treated as a settled input:

- **The four bilhete openers ship as drafts** (owner decision, 2026-08-05). `clinica.notes` is empty by design — Phase 4 chose "empty is the correct seed" and `clinicaFromPayload` maps unset to `null` — which would have left this page's terminal section degrading to a plain button (CONCEPT §13.5's own fallback) on the very preview she reviews. The openers are the **visitor's** first-person message, not prose in her name: the visitor reads it verbatim before tapping and can still edit it in WhatsApp. So four drafts land in `CLINICA_DEFAULTS.notes`, are seeded, and are flagged for her sign-off (TASK-052) exactly as Início's four drafted sections were. Rejected: the plain-button fallback (keeps the page's set-piece invisible until she writes, so nobody can review it), and labeled placeholder notes (four unsendable frames beside one real CTA reads as scaffolding at the exact moment the visitor is deciding to write).

## 0. Shape brief

The `impeccable` shape run found the direction contract settled — PRODUCT.md and DESIGN.md define the world, CONCEPT §6 fixes the five sections and their order — so it resolved only what was materially open. Mode: **Persuade**; the design is the product, and success is one sent message.

- **The page has no opening in the CMS, and needs one.** The global's five tabs are the five numbered sections; there is no field for an `h1` or a lead, so the page would either open on "Passo a passo" as its heading (no front-load, failing REQ-012) or carry its opening hardcoded (failing GUD-002). An **`abertura` tab** is added — heading, lead, and the page's single drop cap. This is the shape the remaining six Phase 6 pages need too, and each will add its own.
- **Sequence: answer, then reassure, then price, then permit.** Abertura (what happens when you write · format · languages · reach) → credencial strip → **passo a passo I–V** → **permissões** → the plate → **logística** → **mini-FAQ** → **o bilhete**. The facts come before the ask, and the ask is last: nothing on this page competes with the note the visitor is about to send.
- **Focal moment.** One set-piece, as DESIGN demands: **O bilhete** with **O selo**, at the end of the scroll. The four notes are set as written notes in her voice on a deeper parchment — DESIGN §5 is explicit that they are "notes in Luiza's voice, not buttons in a grid" — and choosing one folds the note once and presses the mandala mark into it like wax.
- **The seal must never be in the handoff's way.** Each note is a real `<a href="wa.me/…">`, so the browser navigates the instant it is tapped and the fold plays on the element left behind. No interception, no timer, no deferred `window.open` for a popup blocker to eat — and the whole conversion path works with JavaScript off, which is the strongest possible reading of "never blocks the WhatsApp handoff" (REQ-008).
- **One plate, placed at the breath.** PAT-002 wants a plate per page; this one sits **after permissões** — the page's lowest-pressure point, where a full editorial painting reads as a breath rather than as an obstacle between a visitor and the answer they came for. Placing it in the opening would delay the front-load; placing it near the bilhete would dilute the set-piece.
- **Tonal rhythm.** Parchment throughout with exactly one break: `parchment-deep` under the bilhete, so the four notes read as sheets laid on a desk.
- **Anti-goals.** No Jung passage (it would compete with the bilhete for the page's one contemplative moment, and CONCEPT §6 does not ask for one here). No tracked-caps eyebrow per section. No card grid for the permissions or the notes. No second CTA style — the notes and the fallback button are the same terracotta voice. No sticky anything, no countdown, no "vagas limitadas" anywhere near an availability line.

## 1. Requirements & Constraints

- **REQ-001**: All five CONCEPT §6 sections ship in the map's order — Passo a passo · Permissões · Logística · Mini-FAQ · O bilhete — preceded by the page's abertura and credencial strip.
- **REQ-002**: Every visitor-facing string reads from `page-primeira-conversa` or from A Clínica — never hardcoded (master plan GUD-002). Only scaffolding a visitor cannot meaningfully edit lives in `messages/{pt,en}.json`: the logística fee row's label, the "a combinar" wording (already `Fee`'s localized chrome), the note-choice aria labels, the seal's accessible name.
- **REQ-003**: Both locales render; untranslated fields fall back to Portuguese through Payload's `fallback: true` (master plan RISK-001). The `english` opener is deliberately **not** localized — it is the note offered to anglophones on the Portuguese pages too.
- **REQ-004**: The passo a passo uses `.roman-numeral` I–V (DESIGN reserves manuscript numerals for sequences that genuinely are ordered; this one is).
- **REQ-005**: The fee reaches the page from `clinica.fees` through the `Fee` type, never from a page field, and renders "a combinar" when unset (master plan REQ-006). Both services are quoted when they differ and collapse to one row when both are to be discussed — two identical "a combinar" rows read as a bug.
- **REQ-006**: AEO front-load (master plan REQ-012): the abertura carries what happens · for whom · format · duration · languages · reach, as semantic HTML with exactly one `h1`.
- **REQ-007**: **O bilhete** — the four openers, tap to choose, each a real link that composes the WhatsApp message in the visitor's own browser (CONCEPT §8.1). **O selo** folds the chosen note and presses the mark into it in under 600 ms and never blocks the handoff (REQ-008 of the master plan), with a reduced-motion form that is an instant handoff and no fold.
- **REQ-008**: Every time on the page is anchored to horário de Brasília, and the pt page quotes BRL or "a combinar" — never an automatic conversion (CONCEPT §8.9).
- **SEC-001**: The page reads nothing about the visitor. Which note was tapped is never recorded anywhere: the attribution lives entirely in the wording of the message that arrives in her WhatsApp. No cookie, no storage, no measurement beyond the site-wide aggregate analytics.
- **CON-001**: Online-only. No step, logística row, FAQ answer, plate caption, or placeholder label may imply a room a patient walks into (master plan CON-001).
- **CON-002**: Layered architecture (master plan CON-003): `infrastructure/payload/` accessor → `domain/primeiraConversa/` type + mapper + action → route fetches and passes props → `view/primeiraConversa/` renders. No component sees a raw Payload shape; nothing in `src/domain/` imports React, Next, or next-intl.
- **CON-003**: Client components only where an interaction genuinely needs one — the bilhete's seal. The abertura, the five prose sections and the plate are server components, and the four note links exist in the server-rendered HTML.
- **CON-004**: No popup, modal, overlay, sticky bar, or floating bubble anywhere on the page (CONCEPT §12). The seal animates in place.
- **CON-005**: `pnpm build` peaks near 3.5 GB RSS and stays pressure-sensitive; when it dies, fall back to `tsc` + `next dev` + the Vercel preview (master plan CON-004).
- **GUD-001**: DESIGN.md governs every visual call — all-serif, the plate the only saturation, terracotta the one recurring accent, flat on parchment, near-sharp edges, one drop cap for the page, the two-voices rule on every text element.
- **GUD-002**: Operational facts (fee, duration, platform, time zone, availability) are body type or the credential strip — never decorative small type (DESIGN's Marginalia-Is-Voice rule). This page is almost entirely operational facts, so the rule binds harder here than anywhere else on the site.
- **PAT-001**: Placeholder policy (master plan REQ-005): the plate slot renders `MediaPlaceholder` with a label saying what belongs there until her painting is chosen and its provenance verified.
- **PAT-002**: Compose the Phase 5 primitives rather than re-implementing them: `Plate`, `CredentialLine`, `WhatsAppCta`, `AvailabilityLine`, `MediaPlaceholder`, `RichTextProse` — plus the page grammar Início introduced (`PageSection`, `SectionHeading`, `SectionLink`), promoted out of `view/inicio/` in this pass.
- **PAT-003**: One concept per file, named exports, no barrels.

## 2. Implementation Steps

### Implementation Phase 1

- GOAL-001: The data slice — the page's copy and the four openers reach a React component as normalized domain types, with a code fallback for every field.

| Task     | Description                                                                                                                                                                                                                                                                                                                                                                       | Completed | Date       |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-001 | Add an `abertura` tab to `src/payload/globals/pages/primeiraConversa.ts` (localized `heading` + `lead` rich text) and a `plate` group to the `permissoes` tab (`mediaSlot` + painter · title · year), per the shape brief. Run `payload migrate:create`; hand-audit the generated SQL for `RENAME` statements and add `IF EXISTS` to drops, per the Phase 4 precedent.            | ✅        | 2026-08-05 |
| TASK-002 | Create `src/domain/primeiraConversa/PrimeiraConversa.ts`: the type — one member per section (`abertura`, `passoAPasso`, `permissoes`, `logistica`, `miniFaq`, `bilhete`) — plus `PRIMEIRA_CONVERSA_DEFAULTS`. The five step titles/texts, the three permissions, the logística rows and the four mini-FAQ entries are drafts from CONCEPT §6, marked as such in the file comment. | ✅        | 2026-08-05 |
| TASK-003 | Create `src/infrastructure/payload/getPagePrimeiraConversaGlobal.ts` — locale-aware accessor with request-scoped `cache()`, `depth: 1` for the plate upload, mirroring `getPageInicioGlobal.ts`; colocate its raw `PayloadPagePrimeiraConversa` response type.                                                                                                                    | ✅        | 2026-08-05 |
| TASK-004 | Create `src/domain/primeiraConversa/primeiraConversaFromPayload.ts` (raw → type, every field falling back, media through `pageImageFrom`) and `getPrimeiraConversa.ts` (the action the route calls). Colocate `primeiraConversaFromPayload.test.ts` covering the empty global, the array normalizations, and the empty-array rule each array chose.                               | ✅        | 2026-08-05 |
| TASK-005 | Draft the four bilhete openers per the Introduction decision: add them to `CLINICA_DEFAULTS.notes`, fall `clinicaFromPayload` back to them (`filled(…) ?? CLINICA_DEFAULTS.notes.x`) so a blank stored value on production still yields a note, and write them in `src/payload/seed/clinica.ts` (pt + en; `english` is not localized).                                            | ✅        | 2026-08-05 |
| TASK-006 | Seed `page-primeira-conversa` from `PRIMEIRA_CONVERSA_DEFAULTS` in `src/payload/seed/pages.ts`, so a seeded row and the code fallback start from one source of truth (the Início precedent).                                                                                                                                                                                      | ✅        | 2026-08-05 |

### Implementation Phase 2

- GOAL-002: The shared page grammar, promoted out of Início, and the four prose sections built on it.

| Task     | Description                                                                                                                                                                                                                                                                                                                            | Completed | Date       |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-007 | Move `PageSection`, `SectionHeading`, `SectionLink` and `Credencial` from `src/view/inicio/` to `src/view/general/`, updating Início's imports. A pure move — six more pages need them and `view/inicio/` is not where a shared page grammar lives. No behavior change in this commit (Phase 2's RISK-007 discipline).                 | ✅        | 2026-08-05 |
| TASK-008 | `src/view/primeiraConversa/Abertura.tsx` — the page's one `h1` at Headline scale, her lead in body prose opening with the page's single `.dropcap`, then the reach and language facts inline (REQ-006). No portrait: the person is `/sobre`'s subject, and this page's subject is the process.                                         | ✅        | 2026-08-05 |
| TASK-009 | `src/view/primeiraConversa/PassoAPasso.tsx` — an `<ol>` of five steps in a `[numeral, content]` grid: `.roman-numeral` enumerator, step title at Title scale, step text in body prose. The only place on the page where a sequence is asserted, so the numerals stay exclusive to it.                                                  | ✅        | 2026-08-05 |
| TASK-010 | `src/view/primeiraConversa/Permissoes.tsx` — the three permissions as an unadorned list, each at Title scale in Cardo italic (her voice giving permission), generous space between, no bullets and no numerals. The page's quietest moment. Then the plate via `<Plate />`, `MediaPlaceholder` until her painting is chosen (PAT-001). | ✅        | 2026-08-05 |
| TASK-011 | `src/view/primeiraConversa/Logistica.tsx` — a `<dl>` of her label/value rows in body type, prefixed by the fee row(s) composed from `clinica.fees` per REQ-005. And `src/view/primeiraConversa/MiniFaq.tsx` — four discrete Q&A blocks separated by `<Ornament variant="rule" />`, ending on a `SectionLink` to `/perguntas`.          | ✅        | 2026-08-05 |

### Implementation Phase 3

- GOAL-003: O bilhete and O selo — the four notes as real links, with a fold-and-seal that cannot delay the handoff.

| Task     | Description                                                                                                                                                                                                                                                                                                                                                                                                                              | Completed | Date       |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-012 | `src/view/primeiraConversa/Bilhete.tsx` — heading, her intro, the choose label, then the written notes she has filled, each an `<a href>` to `wa.me` carrying that opener, set as a note on `parchment-deep` with a hairline rule and her text in Cardo italic. Falls back to a single `WhatsAppCta variant="primary"` when all four are unwritten (CONCEPT §13.5). Closes on `<AvailabilityLine />` — the anti-urgency line at the ask. | ✅        | 2026-08-05 |
| TASK-013 | `src/view/primeiraConversa/BilheteNote.tsx` (client) — **O selo** (REQ-007): the tapped note folds once and the mandala mark presses into it, under 600 ms, as a CSS animation on an element the browser has already left. Navigation is never intercepted, `prefers-reduced-motion` renders the handoff with no fold, and the note is a keyboard-reachable link with a visible focus ring.                                              | ✅        | 2026-08-05 |
| TASK-014 | Add the page's scaffolding strings to `messages/{pt,en}.json` under a `primeiraConversa` namespace (the fee row labels, the note aria labels, the seal's accessible name, the plate's placeholder caption) plus `meta.primeiraConversa.{title,description}` — `pageMetadata` throws without the latter.                                                                                                                                  | ✅        | 2026-08-05 |

### Implementation Phase 4

- GOAL-004: Compose the route, publish the address, and verify the page against the master plan's Phase 6 checklist in both locales.

| Task     | Description                                                                                                                                                                                                                                                                                                                                                                  | Completed | Date       |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-015 | Create `src/app/(frontend)/[locale]/(pages)/primeira-conversa/page.tsx` as a thin route: `getPrimeiraConversa(locale)` + `getClinica(locale)` in parallel, `pageMetadata("primeiraConversa", locale)`, `BreadcrumbJsonLd`, then the sections in order. **No `FaqJsonLd`** — the master plan reserves `FAQPage` for `/perguntas`, and the mini-FAQ is a shortlist of it.      | ✅        | 2026-08-05 |
| TASK-016 | Flip `primeiraConversa` to `status: "built"` in `src/domain/site/pages.ts` and update `pages.test.ts`'s built/planned split. The sitemap grows to 8 `<url>` and two more share cards prerender.                                                                                                                                                                              | ✅        | 2026-08-05 |
| TASK-017 | Run the check suite: `tsgo --noEmit`, `pnpm lint`, `pnpm test`, `pnpm build`. Then verify on `next start`: `/primeira-conversa` and `/en/first-conversation` at 200 with one `h1`, six sections, the CON-001 sweep clean, and the four `wa.me` links carrying distinct prefilled openers.                                                                                    | ✅        | 2026-08-05 |
| TASK-018 | Behavioral verification: keyboard-reachable notes with a visible focus ring; the seal playing without delaying navigation and absent under `prefers-reduced-motion`; the fee row reading "a combinar" with fees unset and collapsing to one row; the plate slot showing a labeled placeholder. Run impeccable's mechanical detector over the new files. Record the findings. | ✅        | 2026-08-05 |

**Execution notes (2026-08-05)**

- **As built.** `src/domain/primeiraConversa/{PrimeiraConversa,primeiraConversaFromPayload,primeiraConversaFromPayload.test,getPrimeiraConversa}.ts` · `src/domain/media/{PagePlate,pagePlateFrom}.ts` · `src/domain/clinica/{feeQuote,feeQuote.test,noteOpenersFor,noteOpenersFor.test}.ts` · `src/infrastructure/payload/getPagePrimeiraConversaGlobal.ts` · `src/view/primeiraConversa/{Abertura,PassoAPasso,Permissoes,Logistica,MiniFaq,Bilhete,BilheteNote,bilheteAnchor}` · `src/view/general/{PageSection,SectionHeading,SectionLink,Credencial}` (moved from `view/inicio/`) · the `.bilhete-*` block in `src/app/globals.css` · migration `20260805_041259_concept_v3_primeira_conversa`. Suite is 140 tests in 16 files, up from 121 in 12.
- **Five decisions the task text left open.**
  1. **`O selo` is a side effect of a tap that has already left.** Each note is a real `<a href="wa.me/…" target="_blank">`, so the browser opens WhatsApp on the click and the crease plays on the note behind it; nothing is intercepted, no timer gates the handoff, and no deferred `window.open` is there for a popup blocker to eat. `target="_blank"` is what makes the moment visible at all — the page stays put, so the chosen note seals itself in view. It also means the whole conversion path survives with JavaScript off: the four links and their prefilled messages are in the server-rendered HTML, and the client boundary exists to set one attribute. Measured in the browser: `bilhete-crease` 520 ms + `bilhete-press` 420 ms at a 100 ms delay = **520 ms total**, inside the <600 ms budget.
  2. **The English note does not render on `/en`.** CONCEPT §6's fourth opener exists so an anglophone reading the _Portuguese_ site has something to send; on the mirror the other three are already English, so it printed a fourth card saying, more vaguely, what the first one said. `noteOpenersFor(notes, locale)` makes that a rule with a test rather than a conditional in a component — pt offers four, en offers three.
  3. **The fee is quoted by a rule, not by the view.** `feeQuoteFrom` collapses to one "a combinar" row while both prices are unset and splits into two labeled rows the moment either is stated (REQ-005). Two identical "a combinar" rows read as a rendering bug; hiding a price she _did_ set would be worse. Both directions are verified against a running server, not only in the unit test.
  4. **`PagePlate` / `pagePlateFrom` were extracted to `domain/media/`** beside `PageImage`, because every remaining Phase 6 page stores the same four things about its painting — and because the label is deliberately separable from the image: she can record painter · title · year while the scan is still being sourced, and the frame stands in for the image alone. Provenance is never invented (CONCEPT §11), so nothing in the plate group has a default.
  5. **The page grammar left `view/inicio/` in its own commit** (TASK-007) before any new section existed, per RISK-004. Their doc comments were generalized off Início's specifics in the same commit — a comment is not behavior, and leaving them describing "eleven sections" on a five-section page would have been worse than the diff.
- **Two defects the visual pass caught and fixed.**
  1. **The credencial strip started 190 px left of the `h1` above it.** `Credencial` hardcoded `max-w-6xl`, which matches Início's two-column hero but not a text page's reading column, so the band read as another page's furniture. It now takes a `width` prop matching `PageSection`'s, defaulting to Início's `wide`. Verified: `h1`, the strip and the first `h2` all start at 329 px.
  2. **A surviving mutant in `feeQuoteFrom`.** Dropping the `careerGuidance` half of the collapse condition passed the whole suite: the test only covered "analysis stated, orientação unset", never the mirror — which is the likelier case, since orientação is the bounded program with a fixed scope and therefore the price she will publish first. The mutant would have hidden it. Added the missing case; both one-sided mutations now fail.
- **Three findings worth recording.**
  1. **`migrate:create` was non-interactive this time.** Phase 4's 85 create-or-rename questions came from a migration snapshot still declaring Phase 1's deleted tables; that snapshot is now accurate, so the additive migration generated clean — zero `RENAME`, and the only drops are in `down`, where `IF EXISTS` was added anyway for a partial rollback. It also replays over the dev-pushed local database without conflict.
  2. **The availability line renders twice on this page** — once at the ask, once in the footer's _Começar_ column — and here they land within one screen because the bilhete is the last section. It is a launch artifact rather than a design flaw: `availability.responseWindow` is unwritten, so only the state prints. Once she writes "respondo em até um dia útil", the line at the ask says meaningfully more than the footer's. Flagged for TASK-052.
  3. **`/favicon.ico` still 500s** (404 in the browser console). Pre-existing, recorded in TASK-035's notes, owned by TASK-046 — nothing in this diff touches middleware, routing or icons.
- **Copy that needs her sign-off.** All of it. This page did not exist before CONCEPT v3, so unlike Início there was no supplied text to carry across: the abertura lead, the five tempos, the three permissions (near-verbatim from CONCEPT §6), the logística rows, the four threshold questions and the bilhete intro are drafts stating only facts CONCEPT and PRODUCT already fix. Two need her confirmation specifically because they are policy rather than description: **the rescheduling line** ("avise com antecedência e a gente remarca") and **the response window** implied by "em até um dia útil". Every field is a CMS field and TASK-052 owns the review.
- **Deliberately not done.**
  - **The plate is a labeled frame.** PAT-002 is satisfied structurally; the painting arrives through the CMS with no deploy, and a vector stand-in would invert the idea into the generated ornament DESIGN bans.
  - **No `FAQPage` JSON-LD** — the type stays on `/perguntas` (TASK-032), and two overlapping FAQPage entities is a worse signal than one complete page. No `HowTo` for the passo a passo either: Google retired HowTo rich results, and "how to start therapy" is not what the type describes.
  - **Reduced motion is verified from the shipped stylesheet, not by emulating the media query** — this MCP browser exposes no `prefers-reduced-motion` override. The built CSS carries `@media (prefers-reduced-motion:reduce){.bilhete-note[data-sealed=true]{animation:none}.bilhete-seal{transform:none}.bilhete-note[data-sealed=true] .bilhete-seal{opacity:1;animation:none}}`, later in source order at equal specificity, so the seal arrives instantly with no fold and no travel.
  - **The `/en` note row is 2 + 1, not symmetric.** Three notes in a two-column grid leave a gap at the bottom right. Left as is: notes laid on a desk need not be rectangular, and switching the column count on a content count is the more fragile of the two.
- **The mini-FAQ can still drift from `/perguntas`** (RISK-002). Worth resolving with both pages in hand at TASK-040.

**Verified 2026-08-05:** `tsgo --noEmit` clean · `oxlint --threads=1 src/` 0 errors, 36 warnings all in `src/migrations/` (the 4 new ones are the same unused `payload`/`req` params as the other files) · `oxfmt --check` clean · `pnpm test` 140 tests in 16 files green and mutation-checked — both one-sided mutations of `feeQuoteFrom` and the miniFaq empty-array guard each kill a test · `pnpm build` exit 0 with `/[locale]/primeira-conversa` `● (SSG)` prerendered for both locales · impeccable's mechanical detector returns `[]` over every new file · six migrations plus this one replay over the local database and `pnpm seed` writes the page global and the four openers in pt and en.

Checked on `next start` against the production build:

| Check                                           | Result                                                                                                                                        |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `/primeira-conversa` · `/en/first-conversation` | 200, exactly one `h1`, six sections in CONCEPT §6 order                                                                                       |
| Section inventory                               | `abertura` · `passo-a-passo` · `permissoes` · `logistica` · `mini-faq` · `bilhete`, plus the credencial band                                  |
| Alignment                                       | `h1`, credencial strip and first `h2` all at 329 px (the defect fixed above)                                                                  |
| CON-001 sweep, both locales                     | no `guarulhos` · `presencial` · `consultório` · `in-person`                                                                                   |
| The four notes                                  | present as `wa.me` anchors in the **server-rendered** HTML, four distinct prefilled openers on pt, three on en (the English one dropped)      |
| O selo                                          | fires on tap, 520 ms total, navigation never intercepted, page stays put, seal ends at opacity 1                                              |
| Keyboard                                        | note focusable by real `Tab`, `:focus-visible` with a 2 px terracotta outline at 3 px offset, 376 × 202 tap target                            |
| Fee, both prices unset                          | one row, "A combinar na primeira conversa." / "Discussed in the first conversation."                                                          |
| Fee, two prices stated                          | two rows, "Valor · análise" and "Valor · orientação profissional"                                                                             |
| International note                              | renders under the fee rows when set, absent when not (CONCEPT §8.9)                                                                           |
| Plate                                           | labeled `MediaPlaceholder`; no slot on the page silently blank                                                                                |
| Mobile 390 × 844                                | single column, no horizontal overflow, notes 342 px wide at 183–209 px tall                                                                   |
| Entity graph                                    | `Organization` + `Person` + 2 × `Service` + `WebSite` + `BreadcrumbList`, zero `PostalAddress`, **no `FAQPage`** (still only on `/perguntas`) |
| Metadata                                        | `The first conversation · Símbolos do Self`, canonical + `pt-BR`/`en`/`x-default` hreflang, OG image `/share-card/en/primeiraConversa`        |
| Sitemap                                         | 8 `<url>`, 16 `xhtml:link` alternates; both share cards 200 `image/png`                                                                       |
| Other routes                                    | `/` `/perguntas` `/privacidade` `/en` `/en/questions` `/en/privacy` `/llms.txt` `/sitemap.xml` `/robots.txt` `/admin` 200                     |
| Redirects and 404s                              | `/en/primeira-conversa` 307 → `/en/first-conversation` · `/blog/foo` `/simbolos` 308 · `/analise` `/nao-existe` `/en/nope` 404                |
| Início unregressed                              | 9 sections, one `h1`, credencial band still `max-w-6xl`                                                                                       |
| Cookies on a page load                          | only `NEXT_LOCALE` (SEC-001)                                                                                                                  |

## 3. Alternatives

- **ALT-001**: Reuse `passoAPasso.heading` as the page's `h1` instead of adding an `abertura` tab. Rejected: the page would open on a section title with no front-loaded answer, failing REQ-012, and the alternative — hardcoding the opening — fails GUD-002. Six more pages need the same tab; adding it here sets the shape.
- **ALT-002**: Intercept the note tap, play the seal, then open WhatsApp on a timer. Rejected: it makes the animation a gate on the north-star action, and a `window.open` after an async gap is what popup blockers exist to stop. Real anchors also keep the conversion path working with JavaScript off.
- **ALT-003**: A two-step bilhete — choose a note, then press send. Rejected: it adds a tap at the highest-anxiety moment for no gain, since the note's full text is already visible on the card before it is tapped.
- **ALT-004**: Derive the mini-FAQ from the `Faq` collection's `pratico` category rather than from page-owned fields. Rejected: the schema already gives the page its own four entries, and a threshold shortlist is a curation rather than a copy — the four doubts that stop someone at the door are shorter and differently worded than the FAQ page's answers. The drift risk is real and is recorded in RISK-002.
- **ALT-005**: Emit `FAQPage` JSON-LD for the mini-FAQ. Rejected: the master plan reserves the type for `/perguntas` (TASK-032), and two FAQPage entities describing overlapping questions is a worse signal than one complete page.
- **ALT-006**: Put the plate in the abertura. Rejected: the page exists to answer a question fast, and a full editorial painting between the lead and step I delays exactly the answer the visitor came for. After permissões the page has already reassured, and a breath is what belongs there.
- **ALT-007**: Keep the four openers empty and ship the plain button (CONCEPT §13.5). Rejected by the owner, 2026-08-05 — see the Introduction.

## 4. Dependencies

- **DEP-001**: Phases 1–5 of `plan/architecture-site-restructure-1.md` plus TASK-035 — the layered architecture, the i18n routing, the `page-primeira-conversa` global, the Phase 5 primitives, and the page grammar Início introduced.
- **DEP-002**: `src/domain/clinica/getClinica.ts` for the openers, the fees, the WhatsApp number, the availability state and the credential strip.
- **DEP-003**: `next-intl` for the scaffolding strings and the typed `Link` href to `/perguntas`.
- **DEP-004**: Content from Luiza (master plan DEP-005) — never blocking: her own wording for the four openers, the fee values, the availability sentences, and the plate all arrive through the CMS with no deploy.

## 5. Files

- **FILE-001**: `src/domain/primeiraConversa/{PrimeiraConversa,primeiraConversaFromPayload,primeiraConversaFromPayload.test,getPrimeiraConversa}.ts` — new.
- **FILE-002**: `src/infrastructure/payload/getPagePrimeiraConversaGlobal.ts` — new.
- **FILE-003**: `src/view/primeiraConversa/{Abertura,PassoAPasso,Permissoes,Logistica,MiniFaq,Bilhete,BilheteNote}.tsx` — new.
- **FILE-004**: `src/view/general/{PageSection,SectionHeading,SectionLink,Credencial}.tsx` — moved from `src/view/inicio/`.
- **FILE-005**: `src/app/(frontend)/[locale]/(pages)/primeira-conversa/page.tsx` — new.
- **FILE-006**: `src/payload/globals/pages/primeiraConversa.ts` (abertura tab + plate group) + a new migration under `src/migrations/`.
- **FILE-007**: `src/domain/clinica/{Clinica,clinicaFromPayload}.ts` — the drafted openers and their fallback.
- **FILE-008**: `src/payload/seed/{clinica,pages}.ts` — the openers and the page's pt defaults.
- **FILE-009**: `src/domain/site/{pages,pages.test}.ts` — `primeiraConversa` flipped to `built`.
- **FILE-010**: `messages/{pt,en}.json` — a `primeiraConversa` namespace + `meta.primeiraConversa`.
- **FILE-011**: `plan/architecture-site-restructure-1.md` — TASK-036 marked complete with execution notes.

## 6. Testing

- **TEST-001**: `primeiraConversaFromPayload.test.ts` — an empty global maps to the defaults; a populated one maps every section; blank strings and empty Lexical states fall back; the plate resolves to `null` rather than to a broken image; arrays survive order and drop rows with nothing to read.
- **TEST-002**: `tsgo --noEmit` clean; `pnpm lint` 0 errors with no new warnings outside `src/migrations/`; `pnpm test` green with the suite grown by TEST-001.
- **TEST-003**: `pnpm build` exit 0 with `/[locale]/primeira-conversa` `● (SSG)` prerendered per locale — the seal's client boundary must not opt the page out of static rendering.
- **TEST-004**: `/primeira-conversa` and `/en/first-conversation` return 200 with exactly one `h1` and the six sections in order; `/en/primeira-conversa` 307s to the English slug.
- **TEST-005**: CON-001 sweep on both locales: no `guarulhos`, `presencial`, `consultório`, `in-person` in the rendered HTML.
- **TEST-006**: The four notes are present as `wa.me` anchors in the **server-rendered** HTML, each carrying a distinct URL-encoded opener, and each is reachable by keyboard with a visible focus ring.
- **TEST-007**: O selo plays in under 600 ms, does not delay or intercept navigation, and renders no fold under `prefers-reduced-motion: reduce`.
- **TEST-008**: Fee fallback: with both fees unset the logística list shows exactly one "a combinar" row; with the two set to different values it shows two labeled rows.
- **TEST-009**: The sitemap lists 8 `<url>` with both alternates each, and `/share-card/{pt,en}/primeiraConversa` return `image/png`.
- **TEST-010**: The plate slot renders a labeled `MediaPlaceholder` with no painting chosen, and no slot on the page is silently blank.

## 7. Risks & Assumptions

- **RISK-001**: The drafted openers are the most voice-bearing copy on the site, and they arrive in her WhatsApp. Mitigation: they are written as the **visitor's** message rather than hers, every one is a CMS textarea, all four are flagged in `CLINICA_DEFAULTS` and in the master plan's notes, and TASK-052 owns her review. If she rejects the idea outright, deleting the four fields restores CONCEPT §13.5's plain button with no code change.
- **RISK-002**: The mini-FAQ and `/perguntas` can drift into disagreeing about the same question (the credencial tab's failure mode, Início's decision 2). Mitigation: the mini-FAQ's admin description says it is a shortlist of threshold doubts and points at the Perguntas collection; the section ends on a link there. Worth revisiting in TASK-040 with both pages in hand.
- **RISK-003**: `payload migrate:create` asked 85 interactive create-or-rename questions in Phase 4 because the migration snapshot still declares Phase 1's deleted tables. Mitigation: expect it, drive it through a pty accepting "create", then audit the generated SQL for `RENAME` and add `IF EXISTS` to every drop — the same procedure the Phase 4 notes record.
- **RISK-004**: Moving four components out of `view/inicio/` touches the page verified in TASK-035. Mitigation: TASK-007 is a pure move in its own commit, with `tsc` and the Início smoke check gating it before any new section is written.
- **ASSUMPTION-001**: `page-primeira-conversa` holds no production data — it was seeded empty in Phase 4 and prod has not been edited — so adding two field groups loses nothing.
- **ASSUMPTION-002**: English copy falls back to Portuguese wherever she has not translated (master plan RISK-001) — accepted, not a defect of this page.
- **ASSUMPTION-003**: The five steps, three permissions and four mini-FAQ entries are drafts from CONCEPT §6, not her words, and are labeled as such wherever they appear.

## 8. Related Specifications / Further Reading

- [plan/architecture-site-restructure-1.md](./architecture-site-restructure-1.md) — the master plan; this file executes its TASK-036
- [plan/feature-page-inicio-1.md](./feature-page-inicio-1.md) — the per-page precedent this plan follows
- [CONCEPT.md](../CONCEPT.md) §6 (the map, /primeira-conversa), §8.1–8.3 (o bilhete, availability, response window), §8.9 (currency and time zones), §9.7 (O selo), §11 (policies)
- [DESIGN.md](../DESIGN.md) — the two voices, manuscript numerals, the operational strips, §5 O bilhete, §6 Do's and Don'ts
- [PRODUCT.md](../PRODUCT.md) — ranked audiences; the second audience is this page's audience
- `frontend:layered-frontend-architecture` skill (+ `references/vertical-slice.md`) — the architecture contract
