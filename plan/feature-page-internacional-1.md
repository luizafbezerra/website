---
goal: Build Brasil e exterior (`/internacional`) — the five CONCEPT §6 sections in both locales, CMS-backed, with the In-English section as a tested locale rule and no wow set-piece
version: 1.0
date_created: 2026-08-05
last_updated: 2026-08-05
owner: João Vogler (dev); content sign-off — Luiza Fernandes Bezerra
status: "Completed"
tags: [feature, page, design, i18n, cms, seo]
---

# Introduction

![Status: Completed](https://img.shields.io/badge/status-Completed-brightgreen)

This plan executes **TASK-041** of [`plan/architecture-site-restructure-1.md`](./architecture-site-restructure-1.md) under its per-page ritual (PAT-001): the reach page, built from the `page-internacional` global that Phase 4 created and the primitives Phase 5 built, following the precedent in [`plan/feature-page-primeira-conversa-1.md`](./feature-page-primeira-conversa-1.md).

The page's job, in CONCEPT's words: **confirm she attends from where I live — fuso, payment, language — and how.** Its reader is PRODUCT's third audience: Brazilians in Portugal, the UK and the USA — her three real client countries, where roughly five million Brazilians live. They search in Portuguese and pay in strong currencies, and what they need first is not logistics but **permission**: "sim, atendo quem mora fora." CONCEPT §10 also makes this page the site's target for the expat queries "in the words expats actually type", which is why its `h1` is a sentence about a Brazilian psychologist working online rather than the page's own name. The fourth audience — Portuguese natives — needs only the explicit mention that Portugal is normal here, and gets it in the opening and in the city examples.

Because nothing of hers survives for this page, **every string on it is a draft** stating only facts CONCEPT and PRODUCT already fix. Two invention bans bind harder here than anywhere else on the site, and both are written into the code: never a licence, registration or right to practise under another country's law — she is a Brazilian psychologist working online under Brazilian regulation, which is exactly what the trust line says — and never a named payment provider, bank mechanism or video platform, because a person abroad would arrange their money around it.

## 0. Shape brief

The direction contract was settled before this page started — PRODUCT.md and DESIGN.md define the world, CONCEPT §6 fixes the five sections and their order — so the shape work resolved only what was materially open. Mode: **Reassure**; success is a person in Lisbon writing without first having to ask whether they are eligible.

- **Sequence: permit, then measure, then translate, then price, then invite.** Abertura (who · what · languages · reach · the telepsychology signal) → credencial strip → **para brasileiros fora do Brasil** with the city examples and the plate → **In English** → **prático** → **começar**. The permission comes first because it is the only thing that makes the logistics worth reading; the ask is last.
- **The trust line is a sentence of the opening, not a footnote.** `abertura.trustLine` carries "o atendimento segue a regulamentação brasileira de telepsicologia", set in the same body type as the lead, immediately above the credencial strip — where a reader weighing legitimacy is actually looking. DESIGN's Marginalia-Is-Voice rule forbids the alternative outright: this is an operational fact somebody acts on.
- **Focal moment: none, deliberately.** PAT-002 allows zero wow set-pieces and this is the page that should have zero. A comparing reader arrives with a logistical question; a scroll-driven event would put wonder between them and the answer. The page's art moment is its **plate**, placed after the city examples — the point where the permission has landed and the arithmetic is done, and where a painting of distance (sea, voyage, a port) amplifies exactly the idea the section just stated. That is her feed's own amplificação logic.
- **Tonal rhythm: two breaks on the Portuguese page, one on the English one.** `parchment-deep` under **In English**, because a block in another language is a genuine event in the scroll and DESIGN's depth vocabulary is tonal — the language change is announced by the page rather than by a flag, a badge or a dropdown, all three banned. And `parchment-deep` under **Começar**, which is `Comecar`'s own default.
- **The city examples are the page's craft moment, and the craft is factual, not visual.** They are set in the same fact list as the prático rows rather than in a treatment of their own: a time difference is an operational fact and DESIGN puts those in body type. The care is spent on making each note stay true all year (§2, Execution notes).
- **Anti-goals.** No Jung passage (CONCEPT §6 does not ask for one here, and this page's contemplative budget is spent on the plate). No tracked-caps eyebrow per section. No card grid for the cities. No flag, no language dropdown, no currency converter, no BRL figure anywhere. No second CTA style. No sticky anything.

## 1. Requirements & Constraints

- **REQ-001**: All five CONCEPT §6 sections ship in the map's order — Abertura · Para brasileiros fora do Brasil · In English · Prático · Começar — with the credencial strip under the opening.
- **REQ-002**: Every visitor-facing string reads from `page-internacional` or from A Clínica — never hardcoded (master plan GUD-002). Only scaffolding a visitor cannot meaningfully edit lives in `messages/{pt,en}.json`: the plate's placeholder caption and note, and the page's `meta` title and description.
- **REQ-003**: Both locales render. The `inEnglish` fields are deliberately **not** localized — that section is written in English once — and every other field falls back to Portuguese through Payload's `fallback: true` (master plan RISK-001). This page's seed additionally writes English drafts, for the reason in §2's Execution notes.
- **REQ-004**: AEO front-load (master plan REQ-012): the opening carries who she attends · what she offers · in which languages · how · from where, as semantic HTML with exactly one `h1`, and the `h1` itself carries the expat query words CONCEPT §10 names.
- **REQ-005**: **CONCEPT §8.9 currency.** This page quotes no BRL and never converts: the money row states dollars or euros with the amount and the arrangement settled in the first conversation. `fees="none"` is what keeps A Clínica's reais off the page.
- **REQ-006**: Every time on the page is anchored to horário de Brasília, and every city note stays true across both hemispheres' daylight-saving changes.
- **REQ-007**: The In-English section renders on the Portuguese page only, as a **tested pure rule** rather than as a conditional inside a component (the `noteOpenersFor` precedent).
- **SEC-001**: The page reads nothing about the visitor. No cookie, no storage, no per-visitor branching, no geolocation — the city examples are content, not a lookup of where the reader is. Which locale a reader gets is decided by the URL they are on.
- **CON-001**: Online-only. No section, row, caption, alt text or placeholder label may imply a room a patient walks into (master plan CON-001).
- **CON-002**: English register — "clinical psychologist working in the Jungian tradition", never "Jungian analyst", a formally protected title. This is the one page with English prose written by hand, so the rule is enforced in the field's admin description _and_ in a test.
- **CON-003**: No claim of a licence, registration or right to practise under another country's law, and no named payment provider, banking mechanism or video platform.
- **CON-004**: Layered architecture (master plan CON-003): `infrastructure/payload/` accessor → `domain/internacional/` type + mapper + rule + action → route fetches and passes props → `view/internacional/` renders. No component sees a raw Payload shape; nothing in `src/domain/` imports React, Next or next-intl.
- **CON-005**: No client component anywhere on the page. Nothing here is interactive beyond links, so the whole page is server-rendered and works with JavaScript off.
- **GUD-001**: DESIGN.md governs every visual call — all-serif, the plate the only saturation, terracotta the one recurring accent, flat on parchment, near-sharp edges, one drop cap for the page, the two-voices rule on every text element, at most two tonal breaks.
- **GUD-002**: Operational facts (fuso, valores, plataforma, idiomas, the trust line) are body type or the credential strip — never decorative small type.
- **PAT-001**: Placeholder policy (master plan REQ-005): the plate slot renders `MediaPlaceholder` with a label saying what belongs there until her painting is chosen and its provenance verified.
- **PAT-002**: Compose the Phase 5 primitives rather than re-implementing them: `PageSection`, `SectionHeading`, `Credencial`, `Plate`, `MediaPlaceholder`, `RichTextProse`, `FactList`, `PraticoSection`, `Comecar`. At least one plate per page; at most one wow — this page carries zero.
- **PAT-003**: One concept per file, named exports, no barrels.

## 2. Implementation Steps

### Implementation Phase 1

- GOAL-001: The data slice — the page's copy, its city notes and its plate reach a React component as normalized domain types, with a code fallback for every field.

| Task     | Description                                                                                                                                                                                                                                                                                     | Completed | Date       |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-001 | Add a `plate` group to `brasileirosFora` in `src/payload/globals/pages/internacional.ts` (`mediaSlot` + painter · localized workTitle · year, matching `primeiraConversa.permissoes.plate`), localize `cities[].city`, widen `cities[].note` to a textarea, and sharpen the admin descriptions. | ✅        | 2026-08-05 |
| TASK-002 | Create `src/domain/internacional/Internacional.ts`: the type — one member per tab — plus `INTERNACIONAL_DEFAULTS`. Every string is a draft from CONCEPT §6/§8.9 facts, marked as such in the file comment, with the two invention bans written out.                                             | ✅        | 2026-08-05 |
| TASK-003 | Create `src/infrastructure/payload/getPageInternacionalGlobal.ts` — locale-aware accessor with request-scoped `cache()`, `depth: 1` for the plate upload; colocate its raw `PayloadPageInternacional` response type.                                                                            | ✅        | 2026-08-05 |
| TASK-004 | Create `src/domain/internacional/internacionalFromPayload.ts` (raw → type, every field falling back, plate through `pagePlateFrom`) and `getInternacional.ts` (the action the route calls). Colocate `internacionalFromPayload.test.ts`.                                                        | ✅        | 2026-08-05 |
| TASK-005 | Extract `inEnglishSectionFor(section, locale)` to `src/domain/internacional/` with its own colocated test — the rule that keeps the In-English section off the English mirror (REQ-007).                                                                                                        | ✅        | 2026-08-05 |

### Implementation Phase 2

- GOAL-002: The five sections, composed from the shared page grammar.

| Task     | Description                                                                                                                                                                                                                                                                        | Completed | Date       |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-006 | `src/view/internacional/Abertura.tsx` — the page's one `h1`, her lead with the page's single `.dropcap`, and the telepsychology trust line in body type directly above the credencial strip.                                                                                       | ✅        | 2026-08-05 |
| TASK-007 | `src/view/internacional/BrasileirosFora.tsx` — the permission, then the three city notes through `FactList`, then the plate through `<Plate>` with a labeled `MediaPlaceholder` until her painting exists (PAT-001).                                                               | ✅        | 2026-08-05 |
| TASK-008 | `src/view/internacional/InEnglish.tsx` — the English block on `parchment-deep`, with `lang="en"` on the wrapper and a `Link href="/" locale="en"` to the English home.                                                                                                             | ✅        | 2026-08-05 |
| TASK-009 | `src/view/internacional/Pratico.tsx` — `PraticoSection` with `fees="none"`, so no BRL row is composed and the page's own "Valores" row is the price statement (REQ-005).                                                                                                           | ✅        | 2026-08-05 |
| TASK-010 | Draft the page's `meta.internacional.{title,description}` and the `internacional.plate` scaffolding for `messages/{pt,en}.json`, and the `page-internacional` seed block sourced from `INTERNACIONAL_DEFAULTS` — both handed to the integrator, who owns those files in this pass. | ✅        | 2026-08-05 |

### Implementation Phase 3

- GOAL-003: The route, and the checks that do not need a database.

| Task     | Description                                                                                                                                                                                                                                                                    | Completed | Date       |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- | ---------- |
| TASK-011 | Create `src/app/(frontend)/[locale]/(pages)/internacional/page.tsx` as a thin route: `getClinica(locale)` + `getInternacional(locale)` in parallel, `pageMetadata("internacional", locale)`, `BreadcrumbJsonLd`, then the five sections with `Comecar opener="international"`. | ✅        | 2026-08-05 |
| TASK-012 | Run the checks available without a server: `pnpm typecheck`, the colocated vitest files, `oxlint`, `oxfmt`, impeccable's mechanical detector. Mutation-check every rule and every fallback.                                                                                    | ✅        | 2026-08-05 |

**Execution notes (2026-08-05)**

- **As built.** `src/domain/internacional/{Internacional,internacionalFromPayload,internacionalFromPayload.test,getInternacional,inEnglishSectionFor,inEnglishSectionFor.test}.ts` · `src/infrastructure/payload/getPageInternacionalGlobal.ts` · `src/view/internacional/{Abertura,BrasileirosFora,InEnglish,Pratico}.tsx` · `src/app/(frontend)/[locale]/(pages)/internacional/page.tsx` · the `plate` group, the localized `city` and the sharpened descriptions in `src/payload/globals/pages/internacional.ts`. 15 new tests in 2 files. **No client component**: the page has no interaction beyond links, so it is entirely server-rendered.

- **Seven decisions the task text left open.**
  1. **The `h1` is the expat query, not the page's name.** CONCEPT names the page "Brasil e exterior" and the nav and the `<title>` keep that name, but the heading a visitor reads is "Psicóloga brasileira on-line, para quem mora fora". CONCEPT §10 asks this page to target the expat queries "in the words expats actually type", and REQ-012 asks the first screen to answer the visitor's question rather than announce a section. A heading reading "Brasil e exterior" does neither: it is the world naming a place, which is the credencial strip's job two elements later.
  2. **The In-English section renders on the Portuguese page only, and the rule lives in the domain.** `inEnglishSectionFor(section, locale)` returns the section on `pt` and `null` on `en`, exactly as `noteOpenersFor` drops the English bilhete opener on `/en` and for the same reason: on the mirror the whole page is already English, so the block would repeat the page in three lines and its link would point at the page it sits on. It is consulted in the **route**, not inside the component, because a section that structurally disappears in one locale is a fact about the page's composition — a component quietly returning `null` would make the route read as though the page always has five sections. The counter-argument was weighed and rejected: while her English translations do not exist, `/en/international` falls back to Portuguese and this block is the only guaranteed English prose on it. That is a launch artifact of the translation pass, not a reason to ship a permanently redundant section — and decision 3 closes it directly.
  3. **This page is seeded in pt _and_ en.** Every other page is seeded in Portuguese only and leans on Payload's `fallback: true` until her polish pass. That is acceptable everywhere except here: this is the page CONCEPT §6 charges with serving anglophones, and combined with decision 2 a Portuguese-only seed would make `/en/international` the one English page with no English on it. The English strings are drafts in exactly the same sense as the Portuguese ones, so writing them puts no more prose in her name than the page already does. The seed snippet carries the row-id handling the two localized arrays need — the trap `seedClinica` documents for its credential rows.
  4. **The link in the In-English section goes to `/en`, not to `/en/international`.** CONCEPT says "links to /en", and the reader is an anglophone who needs the practice in English; `/en/international` is the page about _Brazilians abroad_, which is the wrong subject for them. It is hand-rolled rather than a `SectionLink` because it is the only link on the site that changes language as well as page, and next-intl needs an explicit `locale` for that — `SectionLink` lives in `view/general/`, which this pass does not own.
  5. **The money row is the page's own field, and `fees="none"` keeps A Clínica's reais off the page.** `PraticoSection`'s own doc comment expects `clinica.fees.internationalNote` to be this page's price statement, and that field is unset — so honoring it literally would have shipped a page whose whole subject includes paying from abroad and which states no currency at all, on the strength of an edit to a file this pass does not own. Instead the "Valores" row states it, inside the fact list, in body type: on the pages that quote reais the note is a _carve-out beside a price_, and here there is no price for it to qualify. The cost is a duplication risk — the note still renders under the list if she writes it, and its admin description invites her to write exactly this sentence — which is recorded in the handoff with two possible fixes, both in files this pass does not own.
  6. **The city examples are set in the shared fact list.** A treatment of their own (tracked-caps place names, a rubricated aside) was drafted and dropped: a time difference is something a reader acts on, DESIGN puts those in body type, and DESIGN §6 explicitly warns against spending the tracked-caps voice as decoration. The page therefore carries two fact lists, which is honest — both are name/value operational facts — and it cost no new markup.
  7. **The plate sits after the cities, not in the opening.** In the opening it would come between the lead and the trust line, which is the last thing to delay on this page. At the end it would compete with the ask. After the city notes the section has finished both its jobs and a painting of distance reads as a breath — and it forms the hinge between the Portuguese half of the page and the English one.

- **The factual trap this page exists to avoid, and how the copy avoids it.** Brazil abolished daylight saving time in 2019; Europe and the United States still observe it, on different changeover dates. So any city note claiming a fixed difference — "cinco horas à frente" — is **wrong for part of every year**, on the one page whose entire value is being trusted about logistics. The three notes therefore name a _range_ and say what moves it ("três ou quatro horas à frente de Brasília, conforme o horário de verão europeu"), and each described moment was checked to hold at both ends of its range: late afternoon in Lisbon is mid-afternoon in Brasília at +3 and at +4; early evening in London is late afternoon in Brazil at both; late afternoon in New York is early evening in Brasília at −1 and at −2. London is described as sharing Lisbon's zone rather than repeating the arithmetic, which is both true and shorter. The reasoning is written into `INTERNACIONAL_DEFAULTS` beside the notes, because the next person to edit them will not have this plan open.

- **Three findings worth recording.**
  1. **`cities[].city` had to become localized.** It was a plain `text` field, which would have printed "Nova York" inside an English sentence on `/en`. This is the only schema change in this pass that moves a column (into the array's `_locales` table), so it is the only one whose generated SQL needs the rename audit.
  2. **`page-internacional` already had its `abertura` tab.** TASK-036 recorded that the remaining six pages each need one added; this page is the exception, because CONCEPT §6 numbers Abertura as its _first section_ rather than as an unnumbered opening. The tab needed only a description saying what belongs in it.
  3. **`PraticoSection` renders `internationalNote` at `text-sm text-ink-soft`.** That is right for a carve-out under a stated price and wrong for a page's only price statement — which is part of why decision 5 went the way it did. Flagged for the integrator rather than fixed, since the component is not this pass's.

- **Copy that needs her sign-off.** All of it, in both languages — this page did not exist before CONCEPT v3 and she has supplied no text for it. Three drafts are policy rather than description and need her confirmation specifically: **the trust line** ("o atendimento segue a regulamentação brasileira de telepsicologia"), **the USD/EUR framing** in the Valores row, and **the client history** in Portugal, Inglaterra and Estados Unidos — CONCEPT states it as fact, and she should still confirm it is publishable. Every field is a CMS field and TASK-052 owns the review.

- **Deliberately not done.**
  - **No wow set-piece.** PAT-002 allows zero and this page should have zero; the plate is its art moment. Recorded here so a later reader does not read the absence as an omission.
  - **The plate is a labeled frame.** PAT-002 is satisfied structurally; the painting arrives through the CMS with no deploy, and a vector stand-in would invert the idea into the generated ornament DESIGN bans.
  - **No `FAQPage` JSON-LD.** The type stays on `/perguntas` (TASK-040), whose fourth category _is_ "Internacional". This page adds only its breadcrumb.
  - **No "skip to the ask" link.** `/primeira-conversa` has one because eight screens separate its opening from its notes; this page is five sections and the ask is two scrolls away.
  - **No Jung passage.** CONCEPT §6 does not ask for one here, and the page's one contemplative moment is its plate.
  - **No geolocation, ever.** The obvious "helpful" feature for this page — detect the reader's country and pre-compute their time difference — is exactly what SEC-001 forbids. The city examples are content the site states, not a reading of the visitor.

**Verified 2026-08-05:** `pnpm typecheck` clean for every file in this pass (the only errors in the run are eight in `src/view/mandala/Symbols.tsx`, a sibling's in-flight TASK-037 work) · `oxlint --threads=1` 0 warnings and 0 errors over all 13 files · `oxfmt --write` clean · `vitest run src/domain/internacional` 15 tests in 2 files green · impeccable's mechanical detector returns `[]` over the four components and the route.

**Mutation-checked**, ten mutants, all killed: inverting `inEnglishSectionFor`'s locale test (4 tests fail); making it always return the section (1); dropping either empty-array fallback (1 each); dropping either half of the cities filter (1 each); dropping either half of the prático filter (1 each); reading an absent `cities` array as empty (1); and dropping the `trim()` from `filled` (1). Both sides of every two-sided condition kill a test — the defect TASK-036 found in `feeQuoteFrom` was checked for specifically here.

Not verified — no server, no build, no migration, no browser was run in this pass, per the Phase 6 execution protocol. The handoff enumerates what the integrator's browser pass must check and what could not be seen: the generated migration SQL, the seed's row-id handling, SSG prerendering, every visual call, and that `Link href="/" locale="en"` emits `/en`.

## 3. Alternatives

- **ALT-001**: Render the In-English section in both locales. Rejected: on `/en` it repeats the page in three lines and links to the page it sits on. The one real argument for it — that it is the only guaranteed English prose while her translations are pending — is answered by seeding this page's English drafts instead (decision 3), which fixes the whole page rather than one block of it.
- **ALT-002**: Put the locale condition inside `InEnglish.tsx` and let it return `null`. Rejected: the route would read as though the page always has five sections, and the rule would be untestable without rendering a component. The `noteOpenersFor` precedent is explicit that this kind of redundancy is a rule about content.
- **ALT-003**: Use `"Brasil e exterior"` as the `h1`. Rejected: it announces a section instead of answering the visitor, and it spends the first screen on words no expat types (CONCEPT §10). The name survives in the nav, the `<title>` and the breadcrumb.
- **ALT-004**: Let `clinica.fees.internationalNote` be the page's price statement, as `PraticoSection`'s doc comment expects, and ask the integrator to draft a default for it. Rejected: it makes the price statement on the most money-sensitive page depend on an edit to a file this pass does not own, it renders at `text-sm` where DESIGN wants body type for a fact somebody acts on, and in the un-applied case the page names no currency at all. The duplication risk it avoids is recorded instead, with two fixes.
- **ALT-005**: Quote the BRL fee with a note that international pricing differs. Rejected outright by CONCEPT §8.9 — it is the automatic side-by-side conversion the policy forbids, one step removed, and it invites a reader in Lisbon to do the arithmetic the site refuses to do for them.
- **ALT-006**: Give the city examples their own treatment — tracked-caps place names, or a rubricated marginal aside. Rejected: a time difference is an operational fact, DESIGN puts those in body type, and DESIGN §6 warns against spending the tracked-caps voice as decoration. The shared fact list is also the same shape assistants read cleanly.
- **ALT-007**: Compute the reader's time difference from their browser or their IP. Rejected: SEC-001. The site never reads the visitor, and the three cities are content the page states.
- **ALT-008**: Name a payment provider, or the video platform, to sound concrete. Rejected: no source document states either, and this is the page where an invented operational fact would cost somebody money.
- **ALT-009**: Put the plate in the opening. Rejected: it would sit between the lead and the trust line, which is the sentence this page most needs a reader to reach.
- **ALT-010**: Give the page a wow set-piece so it matches the home and `/analise`. Rejected: PAT-002 allows zero, and a set-piece here would delay the one answer the reader came for. The plate is the art moment.

## 4. Dependencies

- **DEP-001**: Phases 1–5 of `plan/architecture-site-restructure-1.md` plus TASK-035 and TASK-036 — the layered architecture, the i18n routing, the `page-internacional` global, the Phase 5 primitives, and the page grammar promoted out of `view/inicio/`.
- **DEP-002**: `src/domain/clinica/getClinica.ts` for the credential strip, the WhatsApp number, the availability state and the `international` bilhete opener (added in `3592c6e` for this page).
- **DEP-003**: `next-intl` for the plate's placeholder strings, the typed `Link` href to `/primeira-conversa`, and the explicit `locale="en"` link to the English home.
- **DEP-004**: The integrator, for the four files this pass does not own: `messages/{pt,en}.json`, `src/payload/seed/pages.ts`, `src/domain/site/pages.ts` (+ its test), and the migration. All four are specified exactly in the handoff.
- **DEP-005**: Content from Luiza (master plan DEP-005) — never blocking: her own wording for every section, her English polish pass, and the plate all arrive through the CMS with no deploy.

## 5. Files

- **FILE-001**: `src/domain/internacional/{Internacional,internacionalFromPayload,internacionalFromPayload.test,getInternacional,inEnglishSectionFor,inEnglishSectionFor.test}.ts` — new.
- **FILE-002**: `src/infrastructure/payload/getPageInternacionalGlobal.ts` — new.
- **FILE-003**: `src/view/internacional/{Abertura,BrasileirosFora,InEnglish,Pratico}.tsx` — new.
- **FILE-004**: `src/app/(frontend)/[locale]/(pages)/internacional/page.tsx` — new.
- **FILE-005**: `src/payload/globals/pages/internacional.ts` — the plate group, the localized `city`, the textarea `note`, sharpened descriptions. Plus a new migration under `src/migrations/` (the integrator's).
- **FILE-006**: `messages/{pt,en}.json` — `meta.internacional` + an `internacional.plate` namespace (the integrator's; delivered as `messages.json`).
- **FILE-007**: `src/payload/seed/pages.ts` — the `page-internacional` block, pt and en (the integrator's; delivered as `seed.snippet.ts`).
- **FILE-008**: `src/domain/site/{pages,pages.test}.ts` — `internacional` flipped to `built` (the integrator's).
- **FILE-009**: `plan/architecture-site-restructure-1.md` — TASK-041 marked complete with execution notes (the integrator's).

## 6. Testing

- **TEST-001**: `internacionalFromPayload.test.ts` — an untouched global maps to the defaults; blank strings and empty Lexical states fall back; her wording survives section by section; both empty arrays fall back rather than dropping a required section; populated arrays keep their order and drop the rows with nothing to read; the plate resolves fully, resolves to nulls when unchosen, and returns `null` for an upload with no intrinsic size.
- **TEST-002**: `inEnglishSectionFor.test.ts` — the section renders on `pt`, is `null` on `en`, is handed back by reference rather than rebuilt, and the drafted default carries CON-002's register and not the protected title.
- **TEST-003**: Mutation coverage — every fallback and every filter half kills a test (see the Verified block).
- **TEST-004**: `pnpm typecheck`, `oxlint`, `oxfmt`, impeccable's detector clean for this pass's files.
- **TEST-005** _(integrator)_: `/internacional` and `/en/international` return 200 with exactly one `h1`; the pt page shows five CONCEPT sections in order and the en page shows four (`in-english` absent).
- **TEST-006** _(integrator)_: CON-001 sweep on both locales — no `guarulhos`, `presencial`, `consultório`, `in-person`; CON-002 sweep — no "Jungian analyst".
- **TEST-007** _(integrator)_: no BRL figure and no fee row on either locale; the money row present once; no `internationalNote` paragraph while that field is unset.
- **TEST-008** _(integrator)_: the In-English wrapper carries `lang="en"` and its link resolves to `/en`; the `comecar` CTA carries the `international` opener.
- **TEST-009** _(integrator)_: the plate slot renders a labeled `MediaPlaceholder` and no slot is silently blank; exactly one `.dropcap`; two `parchment-deep` sections on pt and one on en.
- **TEST-010** _(integrator)_: the sitemap lists 9 `<url>` with both alternates each, and `/share-card/{pt,en}/internacional` return `image/png`.

## 7. Risks & Assumptions

- **RISK-001**: **The duplication risk on the money statement.** `PraticoSection` renders `clinica.fees.internationalNote` even at `fees="none"`, and that field's admin description invites her to write the same sentence this page's "Valores" row already states. Mitigation: the field is unset today, the handoff records two fixes (sharpen the admin description, or suppress the note at `fees="none"`), and either is a one-line change in a file this pass does not own.
- **RISK-002**: **The time notes go stale if Brazilian daylight saving time returns.** Mitigation: the notes name ranges rather than offsets, the reasoning is written beside them in `INTERNACIONAL_DEFAULTS`, and every note is a CMS field — the fix is an edit, not a deploy.
- **RISK-003**: **`cities[].city` becoming localized moves a column.** Mitigation: ASSUMPTION-001 below, plus the rename audit the handoff asks for — the Phase 4 procedure, since `migrate:create` may offer the move as a create-or-rename pair.
- **RISK-004**: **The English drafts are the first English copy shipped in her name.** Mitigation: they state the same facts as the Portuguese, CON-002's register is enforced in a test, and TASK-052 owns the review. If she rejects them, deleting the English values restores the Portuguese fallback with no code change.
- **RISK-005**: **The mini-FAQ on `/primeira-conversa` and `/perguntas`' "Internacional" category can drift from this page** — all three answer "você atende quem mora fora?". Worth resolving with all three in hand at TASK-040; this page is the canonical answer and the other two should point at it.
- **ASSUMPTION-001**: `page-internacional` holds no production data — it was seeded empty in Phase 4 and prod has not been edited — so localizing `city` loses nothing.
- **ASSUMPTION-002**: The three real client countries (Portugal, Inglaterra, EUA) are publishable as stated in CONCEPT §3/§6 and PRODUCT's evidence section. Flagged for her confirmation, not invented here.
- **ASSUMPTION-003**: Brazil observes no daylight saving time (abolished 2019) and Europe and the US still do. Everything in the city notes follows from this pair.
- **ASSUMPTION-004**: Every string on this page is a draft, not her voice, and is labeled as such in `INTERNACIONAL_DEFAULTS` and in the seed snippet.

## 8. Related Specifications / Further Reading

- [plan/architecture-site-restructure-1.md](./architecture-site-restructure-1.md) — the master plan; this file executes its TASK-041
- [plan/feature-page-primeira-conversa-1.md](./feature-page-primeira-conversa-1.md) — the precedent this plan follows; its TASK-036 notes predicted the `inEnglishSectionFor` rule
- [plan/feature-page-inicio-1.md](./feature-page-inicio-1.md) — the first precedent, and the source of the empty-array rule
- [CONCEPT.md](../CONCEPT.md) §3 (the third and fourth audiences), §6 (the map, /internacional), §8.9 (currency and time zones), §10 (the expat queries), §11 (policies), §12 (won't-have)
- [DESIGN.md](../DESIGN.md) — the two voices, the plate grammar, the operational strips, the Marginalia-Is-Voice rule, §6 Do's and Don'ts
- [PRODUCT.md](../PRODUCT.md) — the ranked audiences; the third is this page's audience, the fourth needs one sentence
- `frontend:layered-frontend-architecture` skill — the architecture contract
