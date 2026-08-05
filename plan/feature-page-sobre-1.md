---
goal: Build Sobre (`/sobre`) — the four CONCEPT §6 sections in both locales, CMS-backed, with the portrait as the page's image moment and the academic record stated cold
version: 1.0
date_created: 2026-08-05
last_updated: 2026-08-05
owner: João Vogler (dev); content sign-off — Luiza Fernandes Bezerra
status: "Completed"
tags: [feature, page, design, i18n, cms]
---

# Introduction

![Status: Completed](https://img.shields.io/badge/status-Completed-brightgreen)

This plan executes **TASK-039** of [`plan/architecture-site-restructure-1.md`](./architecture-site-restructure-1.md) under its per-page ritual (PAT-001): the person's page, built from the `page-sobre` global that Phase 4 created and the primitives Phase 5 built, following the precedent of [`plan/feature-page-primeira-conversa-1.md`](./feature-page-primeira-conversa-1.md).

The page's job, in CONCEPT's words: **meet the person behind the name; verify the credentials are real.** Two visitors want two different things from it and the page has to serve both without changing register mid-scroll — the Instagram follower who already trusts her voice and is checking that a real practice exists behind it, and the cold pt-BR searcher comparing four therapist tabs who wants to know whether she is qualified.

It is also the page where the site's thesis resolves. **The world recruits; the person converts** (CONCEPT §2, PRODUCT principle 1): every other page is Símbolos do Self speaking, and this one is Luiza. First person throughout, warm — with one section deliberately cold, because the record is more persuasive unadorned than described.

**Two decisions were taken before writing this plan** and are treated as settled inputs:

1. **The page's global gains an `abertura` tab.** Its five tabs are the CONCEPT §6 sections and none of them is an `h1` plus a front-loaded lead, so the page would open on "Quem é a Luiza" as its heading (failing REQ-012) or carry its opening hardcoded (failing GUD-002). This is the tab TASK-036 introduced and the master plan's Phase 6 notes assign to every remaining page.
2. **The `credencial` tab is deleted rather than rendered.** It duplicates `clinica.identity.credentials`, which Phase 5 created as the cross-page home for the strip CONCEPT §8.8 puts on every core page. TASK-035 dropped the identical tab from `page-inicio` (migration `20260805_031704`) and its notes say `page-sobre` "should go the same way when that page is built, and for the same reason". CONCEPT §6's "credencial above the fold" is satisfied by the band sitting directly under the opening.

## 0. Shape brief

The direction contract is settled — PRODUCT.md and DESIGN.md define the world, CONCEPT §6 fixes the four sections and their order — so the shape work resolved only what was materially open: what the page's one image is, and how cold the record is allowed to be. Mode: **Persuade**, but of an unusual kind. Success here is not a message sent; it is a doubt that never forms.

- **Sequence: the person, then the proof, then the place, then her hand.** Abertura (her name · what she does · for whom · in which languages · from where) → the credencial strip → **quem é a Luiza** with the portrait → **formação** → **a clínica** → **assinatura**. Warmth, then cold verification, then the world's own story, then a signature. A visitor who reads only the first screen has the answer; a visitor who came to check the record hits it third, still above the fold-and-a-half on desktop.
- **The `h1` is her name.** Every other page opens on what the place offers. This one opens on the person: /sobre is the URL the entity graph already gives the `Person` node, and the query the page exists to win is somebody typing "Luiza Fernandes Bezerra psicóloga" after seeing the name on a bio link. The credential strip under it then answers the second question in one glance.
- **Focal moment: the portrait, and only the portrait.** CONCEPT §7.1 calls it "the single highest-leverage asset the site doesn't have" and asks for it "editorially set, plate-like — never a full-bleed marketing headshot". So it enters at the head of the section that is about her, at a modest width inside the reading column rather than in a side-by-side grid, and the prose below keeps its 60–72ch measure. **No second painting.** This page's image is a face; a plate beside it would compete for the one thing the page must land.
- **Formação is cold on purpose.** No intro, no numerals, no ornament, no adjective — a one-word heading and then the rows. This is the section a sceptic scrolled here for, and the fastest way to lose them is to decorate it. The warmth on the page lives in the two sections around it, which is what makes the restraint legible as a choice rather than as a gap.
- **Tonal rhythm.** Parchment throughout with exactly one break: `parchment-deep` under **a clínica**, the only section whose subject is the world rather than Luiza. Depth in this system is tonal (DESIGN §4), so a change of voice is the right thing to spend it on.
- **Anti-goals.** No wow set-piece (CONCEPT gives this page none, and the portrait is the focal moment). No CTA section — CONCEPT §6 gives /sobre no "começar", the sticky header carries the WhatsApp item the whole way down, and the footer carries the ask. No tracked-caps eyebrow per section. No card grid for the record. No testimonial (that is Início's Vozes). No typeset or vector signature. Nothing after the signature.

## 1. Requirements & Constraints

- **REQ-001**: All four CONCEPT §6 sections ship in the map's order — Quem é a Luiza · Formação · A clínica · Assinatura — preceded by the page's abertura and the credencial strip.
- **REQ-002**: Every visitor-facing string reads from `page-sobre` or from A Clínica — never hardcoded (master plan GUD-002). Only scaffolding a visitor cannot meaningfully edit lives in `messages/{pt,en}.json`: the portrait's alt fallback and the signature slot's three strings. The portrait's _placeholder_ text is the site-wide `placeholder.slots.portrait`, not a page string.
- **REQ-003**: Both locales render; untranslated fields fall back to Portuguese through Payload's `fallback: true` (master plan RISK-001).
- **REQ-004**: AEO front-load (master plan REQ-012): the abertura carries who · what · for whom · in which languages · from where, as semantic HTML with exactly one `h1` — her name.
- **REQ-005**: The academic record is stated **plainly, with no editorializing** (CONCEPT §6): PUC-SP graduação · Instituto Numen pós · PUC-SP aprimoramentos (clínica junguiana; orientação profissional) · extensões (PUC-SP Psicologia e Religião; USP Fenômenos Anômalos). **No fact about the record is invented** — `period` is unset on every row because no source document states a year, and a course whose subject no document names is stated without one.
- **REQ-006**: The portrait and the signature are both `mediaSlot`s and both are empty; each renders a labeled `MediaPlaceholder` describing what belongs there (master plan REQ-005). The signature in particular may **never** be simulated with type or a vector — that is DESIGN §6's banned stand-in, and forging the one mark that is hers alone is the worst possible version of it.
- **REQ-007**: The credential strip comes from A Clínica through `<Credencial width="column" />`, never from a page field (CONCEPT §8.8).
- **SEC-001**: The page reads nothing about the visitor. No cookie, no storage, no per-visitor branching, no measurement beyond the site-wide aggregate analytics.
- **CON-001**: Online-only. No section, caption, alt text, placeholder label or metadata may imply a room a patient walks into (master plan CON-001). The reach is "on-line · Brasil e exterior".
- **CON-002**: English register (master plan CON-002): "clinical psychologist working in the Jungian tradition", never "Jungian analyst". This page's English is the likeliest place on the site to get that wrong, because it is the page that describes what she _is_.
- **CON-003**: Layered architecture (master plan CON-003): `infrastructure/payload/` accessor → `domain/sobre/` type + mapper + action → route fetches and passes props → `view/sobre/` renders. No component sees a raw Payload shape; nothing in `src/domain/` imports React, Next, or next-intl.
- **CON-004**: **No client components.** Nothing on this page is interactive, so nothing is gated behind hydration and there is no animation to give a reduced-motion alternative to.
- **CON-005**: `pnpm build` peaks near 3.5 GB RSS and stays pressure-sensitive; when it dies, fall back to `tsc` + `next dev` + the Vercel preview (master plan CON-004).
- **GUD-001**: DESIGN.md governs every visual call — all-serif, terracotta the one recurring accent, flat on parchment, near-sharp edges, one `.dropcap` at the page opening, the two-voices rule on every text element.
- **GUD-002**: Operational facts are body type, never decorative small type (DESIGN's Marginalia-Is-Voice rule). On this page that binds the formação list: an institution is a credential, and a credential in tracked small caps is a credential somebody squints at.
- **PAT-001**: Compose the Phase 5 primitives and the page grammar rather than re-implementing them: `PageSection`, `SectionHeading`, `SectionLink`, `Credencial`, `MediaPlaceholder`, `RichTextProse`.
- **PAT-002**: One concept per file, named exports, no barrels.

## 2. Implementation Steps

### Implementation Phase 1

- GOAL-001: The data slice — the page's copy, the record, the portrait and the signature reach a React component as normalized domain types, with a code fallback for every field.

| Task     | Description                                                                                                                                                                                                                                                                                                                                                        | Completed | Date       |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- | ---------- |
| TASK-001 | Add an `abertura` tab to `src/payload/globals/pages/sobre.ts` (localized `heading` + `lead` rich text), delete the `credencial` tab, and add `aClinica.linkLabel`. Per the Introduction's two settled decisions. Migration is the integrator's job; the drop needs `IF EXISTS` per the Phase 4 precedent.                                                          | ✅        | 2026-08-05 |
| TASK-002 | Create `src/domain/sobre/Sobre.ts`: the type — one member per tab (`abertura`, `quemE`, `formacao`, `aClinica`, `assinatura`) plus the `FormacaoItem` row type — and `SOBRE_DEFAULTS`. Her bio and its heading are carried **verbatim** from the literals in `seed/pages.ts`; everything else is a draft from CONCEPT §6, marked as such in the file comment.      | ✅        | 2026-08-05 |
| TASK-003 | Create `src/infrastructure/payload/getPageSobreGlobal.ts` — locale-aware accessor with request-scoped `cache()`, `depth: 1` for the two uploads, mirroring `getPagePrimeiraConversaGlobal.ts`; colocate its raw `PayloadPageSobre` response type.                                                                                                                  | ✅        | 2026-08-05 |
| TASK-004 | Create `src/domain/sobre/sobreFromPayload.ts` (raw → type, every field falling back, both uploads through `pageImageFrom`) and `getSobre.ts` (the action the route calls). Colocate `sobreFromPayload.test.ts` covering the empty global, the blank-string and empty-Lexical absences, the empty-array rule the record chose, and the two independent media slots. | ✅        | 2026-08-05 |
| TASK-005 | Hand the integrator a `seed.snippet.ts` sourcing `page-sobre` from `SOBRE_DEFAULTS`, replacing the four-line literal block in `src/payload/seed/pages.ts` and deleting the now-unused `BIO` const — so a seeded row and the code fallback start from one source of truth (the Início and primeira-conversa precedent).                                             | ✅        | 2026-08-05 |

### Implementation Phase 2

- GOAL-002: The five sections — server components in `src/view/sobre/`, each declaring its voice per DESIGN's two-voices rule.

| Task     | Description                                                                                                                                                                                                                                                                                                                                                | Completed | Date       |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-006 | `src/view/sobre/Abertura.tsx` — the page's one `h1` at Headline scale carrying her name, then her lead in body prose opening with the page's single `.dropcap`. No portrait: CONCEPT §7.1 keeps the opening type-led and her face belongs to the section about her.                                                                                        | ✅        | 2026-08-05 |
| TASK-007 | `src/view/sobre/QuemE.tsx` — heading, then the portrait at `min(20rem,70%)` inside the reading column, then her bio at 62ch. `MediaPlaceholder` until the shoot (REQ-006), reusing the site's own `placeholder.slots.portrait` strings. No figcaption — Início's own defect fix, and here the page already says "quem recebe você" three other ways.       | ✅        | 2026-08-05 |
| TASK-008 | `src/view/sobre/Formacao.tsx` — the record as a hairline-ruled `<ul>`, course title in body ink, institution (and period, when written) in body `ink-soft` at small size, matching `CredentialLine`'s treatment of the strip. No intro, no numerals, no ornament.                                                                                          | ✅        | 2026-08-05 |
| TASK-009 | `src/view/sobre/AClinica.tsx` — the origin story on the page's one `tone="deep"` band, ending on a single `SectionLink` to `/primeira-conversa`. And `src/view/sobre/Assinatura.tsx` — her closing line in Cardo italic at Title scale (labelling the section, since you do not title a signature), then the signature slot at 5/2 with its labeled frame. | ✅        | 2026-08-05 |
| TASK-010 | Hand the integrator a `messages.json` with `meta.sobre.{title,description}` in both locales (`pageMetadata` throws without them) plus the four `sobre.*` scaffolding strings, English written to CON-002's register.                                                                                                                                       | ✅        | 2026-08-05 |

### Implementation Phase 3

- GOAL-003: Compose the route and verify what can be verified without a database, a build or a browser.

| Task     | Description                                                                                                                                                                                                                                                         | Completed | Date       |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-011 | Create `src/app/(frontend)/[locale]/(pages)/sobre/page.tsx` as a thin route: `getClinica(locale)` + `getSobre(locale)` + the nav translations in parallel, `pageMetadata("sobre", locale)`, `BreadcrumbJsonLd`, then the six blocks in order. `revalidate = 86400`. | ✅        | 2026-08-05 |
| TASK-012 | Record for the integrator: the registry flip (`sobre` → `built`) and both edits `pages.test.ts` needs, the exact schema changes for the migration audit, and the `alumniOf` answer the master plan asked this task for.                                             | ✅        | 2026-08-05 |
| TASK-013 | Run the checks available in a shared tree: `pnpm typecheck`, targeted `vitest run src/domain/sobre`, `oxlint --threads=1`, `oxfmt --write`, impeccable's mechanical detector. Mutation-check the mapper.                                                            | ✅        | 2026-08-05 |

**Execution notes (2026-08-05)**

- **As built.** `src/domain/sobre/{Sobre,sobreFromPayload,sobreFromPayload.test,getSobre}.ts` · `src/infrastructure/payload/getPageSobreGlobal.ts` · `src/view/sobre/{Abertura,QuemE,Formacao,AClinica,Assinatura}.tsx` · `src/app/(frontend)/[locale]/(pages)/sobre/page.tsx` · the `abertura` tab, the `aClinica.linkLabel` field and the `credencial` tab's deletion in `src/payload/globals/pages/sobre.ts`. Eleven new tests. **No client component, no new CSS, no new primitive** — the page is composed entirely from `view/general/`, which is the strongest evidence the page grammar TASK-036 promoted is the right size.
- **Six decisions the task text left open.**
  1. **No plate; the portrait is this page's plate-scale image.** A deliberate partial against PAT-002, argued rather than overlooked. CONCEPT §6 names only two images for /sobre — the portrait and the signature — and §7.1 already asks the portrait to be "editorially set, plate-like". Two large images in one reading column compete, and the one that must win is her face on the one page whose job is that a stranger meets her. It also matters that both slots are empty today: a third labeled frame is Início's five-identical-placeholder-tiles defect at page scale. The reversal is purely additive and is written into the handoff (a `plate` group on `aClinica`, rendered on the deep band); it is not built, because adding a painting changes what the page is about.
  2. **Her name is the `h1`, as a page field rather than as `clinica.fullName`.** /sobre is the `Person` node's URL and the name is the query this page wins, so the name is the heading. But it is `abertura.heading` — a title she owns — rather than a component reading the identity global, because a page's title is content and because the strip immediately below already reads the name and the CRP from A Clínica. Nothing is asked to agree with anything about a fact. The cost is a second stored copy of her name that could go stale; the probability is near zero and the alternative takes her page's title away from her.
  3. **One quiet hand-off, at the end of `A clínica` rather than after the signature.** CONCEPT §6 gives this page no "começar" section and none was added — no WhatsApp block, no availability line, no second ask. But every other prose section on this site ends on a marginalia link, and a reader who has just been convinced should not have to scroll back to the header to act. Placing it before the assinatura is the whole reason it works: **nothing follows a signature.** Its label is a new CMS field, so the wording is hers.
  4. **The record's coldness is structural, not stylistic.** "No editorializing" was implemented by giving the section nothing to editorialize _with_: no intro field is rendered, no numerals, no ornament, and a one-word heading. Both lines of every row are body type — the institution takes exactly `CredentialLine`'s treatment (`ink-soft`, small, body font), because DESIGN's Marginalia-Is-Voice rule makes a credential an operational fact and this is the section where that rule earns its keep.
  5. **Two rows state less than they could, on purpose.** The Instituto Numen row reads "Pós-graduação" with no subject: no source document names the course, and inferring "em Psicologia Analítica" from the institution's specialism would be inventing a line of her CV. `period` is unset on all six rows for the same reason — CONCEPT §11's "provenance is never invented" governs a plate's year, and her years are the same kind of fact on the page where getting one wrong costs the most.
  6. **`A clínica` is the one tonal event.** It is the only section whose subject is the world rather than Luiza, and a deeper parchment is how this system marks a change of voice. Assinatura stays on plain parchment: a closing line and a signature want air, not emphasis.
- **Three findings worth recording.**
  1. **The master plan's `alumniOf` question now has an answer, and it is "not quite".** The constant in `src/view/seo/jsonLd.tsx` holds two institutions; the record has three — the USP extension is missing. PUC-SP and Instituto Numen are named correctly. `jsonLd.tsx` was left alone (not this task's file); the handoff carries the one-line fix and argues that _deriving_ `alumniOf` from `formacao.items[].institution` — deduplicated, since PUC-SP appears four times — is a real improvement but belongs to TASK-045, because it couples the site-wide entity graph to one page's array and cannot happen in the layout, which does not read `page-sobre`.
  2. **A `ProfilePage` node is the strongest AEO signal still missing from this URL**, and it cannot be added from here: `jsonLd.tsx` is the only module allowed to emit structured data (REQ-011) and it is not this task's file. Recorded for TASK-045.
  3. **The formação list is the first array on the site whose "drop a half-typed row" rule is one-sided in an interesting way.** A row with a course and no institution is _kept_ (a course still reads as a course); a row with an institution and no course is _dropped_ ("PUC-SP" alone states nothing verifiable). Both directions have a test, because the mirror mutation — filtering on `institution` instead of `title` — is exactly the kind that survived in `feeQuoteFrom` on the previous page.
- **Copy that needs her sign-off.** `quemE.heading` and three of the four paragraphs of `quemE.body` are **hers, verbatim**, carried from the old home's `home-about` block. Everything else is a draft stating only facts CONCEPT §6 and PRODUCT already fix. Two need her attention specifically: the **second paragraph of her bio**, which is the one sentence added _inside_ her own prose (the twenty-two years, the 2014 date, Jung in her second year and "um caminho sem volta"), and the **"vinte e dois anos" figure itself**, which ages — it will be wrong in a year and nothing in the code will notice. Asking her for a start year is the fix; deriving 2004 from 2026 − 22 would have been inventing a fact about her record. TASK-052 owns the review.
- **Deliberately not done.**
  - **No plate** (decision 1). PAT-002 is answered with an argument rather than with a frame.
  - **No wow set-piece.** CONCEPT gives this page none, and one would have to compete with the portrait for the page's single focal moment.
  - **No `ProfilePage` / `AboutPage` JSON-LD**, no change to `alumniOf` — both live in a file this task does not own (finding 1, finding 2).
  - **No reduced-motion work**, because nothing on the page moves. That is a property of the design, not an omission: the one page whose job is to be believed had no reason to animate.
  - **Nothing was seen in a browser.** Per the Phase 6 brief this task ran no build, no server, no migration and no seed; the layout, the portrait's weight in the column and the signature frame's proportions are argued, not observed. The handoff lists the runtime checks, and names the signature frame at 5/2 × 24rem as the first thing to look at.

**Verified 2026-08-05:** `pnpm typecheck` — the only errors in the tree are in `src/payload/globals/pages/analise.ts` and `src/view/mandala/Symbols.tsx`, TASK-037's concurrent work; nothing points at this page's files · `vitest run src/domain/sobre` 11 tests green · `oxlint --threads=1` over all twelve files: 0 errors, 0 warnings · `oxfmt --write` clean · impeccable's mechanical detector returns nothing over all five components and the route.

Mutation-checked, seven mutants, all killed:

| Mutation                                                                     | Killed by                                                          |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `formacaoFrom`: unset array → `[]` instead of the defaults                   | the untouched-global test                                          |
| `formacaoFrom`: drop the empty-result fallback                               | the empty-array test **and** the nothing-readable test             |
| `formacaoFrom`: keep every row (no filter)                                   | the title-only/institution-only test and the nothing-readable test |
| `formacaoFrom`: filter on `institution` instead of `title` (the mirror side) | three tests                                                        |
| `filled()`: stop treating a blank string as an absence                       | three tests                                                        |
| `filledRichText()`: treat an emptied Lexical state as a value                | the empty-paragraphs test                                          |
| `assinatura.image` reads the portrait slot                                   | the two-independent-slots test                                     |

## 3. Alternatives

- **ALT-001**: Render the `credencial` tab instead of deleting it. Rejected: the strip appears on every core page (CONCEPT §8.8), so a per-page copy drifts the moment one is edited — the exact reasoning TASK-035 applied to `page-inicio`, whose notes named this page as the remaining case.
- **ALT-002**: Add a plate slot alongside the portrait, for literal PAT-002 compliance. Rejected — see execution decision 1. The reversal is additive and written into the handoff, so the owner can overrule this in one commit.
- **ALT-003**: Render the `h1` from `clinica.fullName` rather than from a page field. Rejected: a page's title is content she should own, and the strip below already reads the name from A Clínica, so nothing is asked to agree about a fact twice on one screen.
- **ALT-004**: `h1` = "Quem recebe você" (Início's digest heading and the hero's portrait caption). Rejected: Início's `sobreDigest` links here, so the visitor would arrive at the phrase they just clicked away from — and the name is the stronger heading for both audiences.
- **ALT-005**: Put the portrait beside the prose in a two-column grid, as Início's hero does. Rejected twice over: a 48rem reading column minus a 15rem portrait leaves the body at ~55ch, below DESIGN's 60ch floor, and a `width="wide"` section between two `column` sections would jog the page's left edge — the same defect TASK-036 fixed on the credencial strip.
- **ALT-006**: Set the formação institutions in the tracked small-caps voice, as "the world speaking". Rejected: DESIGN's Marginalia-Is-Voice rule puts credentials in body type precisely because someone has to read and act on them, and `CredentialLine` already established that treatment for exactly these facts.
- **ALT-007**: Add a `Comecar` section with the WhatsApp block, on the grounds that this is where the person converts. Rejected: CONCEPT §6 gives this page no ask, the header's WhatsApp item is on screen the whole way down, and a terracotta block after her signature would turn a letter into a landing page. One marginalia link, before the signature, is the version that keeps both.
- **ALT-008**: Give `aClinica.linkLabel` no default, so blanking it removes the link. Rejected for consistency: every other field on the site treats blank as an absence and falls back, and the link is part of the page's design rather than a piece of content she curates away.
- **ALT-009**: Guess the Instituto Numen course subject and plausible years for the record. Rejected outright — REQ-005. A wrong year on the page whose job is verification is worse than a thin one.

## 4. Dependencies

- **DEP-001**: Phases 1–5 of `plan/architecture-site-restructure-1.md` plus TASK-035 and TASK-036 — the layered architecture, the i18n routing, the `page-sobre` global, the Phase 5 primitives, and the page grammar promoted into `src/view/general/`.
- **DEP-002**: `src/domain/clinica/getClinica.ts` for the credential strip, the CRP and her name.
- **DEP-003**: `next-intl` for the four scaffolding strings, the metadata, and the typed `Link` href to `/primeira-conversa`.
- **DEP-004**: The integrator, for the migration, `payload generate:types`, the message merge, the seed edit and the registry flip — all listed in the handoff.
- **DEP-005**: Content from Luiza (master plan DEP-005) — never blocking: the portrait, the scanned signature, her exact course titles and any years all arrive through the CMS with no deploy.

## 5. Files

- **FILE-001**: `src/domain/sobre/{Sobre,sobreFromPayload,sobreFromPayload.test,getSobre}.ts` — new.
- **FILE-002**: `src/infrastructure/payload/getPageSobreGlobal.ts` — new.
- **FILE-003**: `src/view/sobre/{Abertura,QuemE,Formacao,AClinica,Assinatura}.tsx` — new.
- **FILE-004**: `src/app/(frontend)/[locale]/(pages)/sobre/page.tsx` — new.
- **FILE-005**: `src/payload/globals/pages/sobre.ts` — `abertura` tab added, `credencial` tab deleted, `aClinica.linkLabel` added; a new migration under `src/migrations/` (integrator).
- **FILE-006**: `src/payload/seed/pages.ts` — the `page-sobre` block sourced from `SOBRE_DEFAULTS`, the `BIO` const deleted (integrator, from `seed.snippet.ts`).
- **FILE-007**: `messages/{pt,en}.json` — a `sobre` namespace + `meta.sobre` (integrator, from `messages.json`).
- **FILE-008**: `src/domain/site/{pages,pages.test}.ts` — `sobre` flipped to `built` (integrator).
- **FILE-009**: `plan/architecture-site-restructure-1.md` — TASK-039 marked complete with execution notes (integrator).

## 6. Testing

- **TEST-001**: `sobreFromPayload.test.ts` — an empty global maps to `SOBRE_DEFAULTS`; a populated one maps every section; blank strings and empty Lexical states fall back; the record survives order; a row with a course and no institution is kept and a row with an institution and no course is dropped; a populated array with nothing readable falls back; the two uploads resolve independently; an upload with no intrinsic size resolves to `null` rather than shipping layout shift.
- **TEST-002**: `pnpm typecheck` clean for this page's files; `oxlint` 0 errors and 0 warnings; `oxfmt` clean.
- **TEST-003**: `pnpm build` exit 0 with `/[locale]/sobre` `● (SSG)` prerendered for both locales — trivially expected here, since the page has no client boundary at all.
- **TEST-004**: `/sobre` and `/en/about` return 200 with exactly one `h1` and the four sections in CONCEPT §6 order after the abertura and the strip; `/en/sobre` 307s to the English slug.
- **TEST-005**: CON-001 sweep on both locales: no `guarulhos`, `presencial`, `consultório`, `in-person`.
- **TEST-006**: Formação renders six rows in the documented order, and **no year prints anywhere** on the page.
- **TEST-007**: Placeholder completeness: exactly two labeled `MediaPlaceholder` frames (portrait 4/5, signature 5/2), neither silently blank, and the portrait prints its note with no figcaption.
- **TEST-008**: Alignment: the `h1`, the credencial strip and the first `h2` all start at the same x.
- **TEST-009**: The page contains no WhatsApp block, no availability line and nothing after the signature; exactly one link leaves the page's body, to `/primeira-conversa`.
- **TEST-010**: The sitemap gains `/sobre` and `/en/about`, and `/share-card/{pt,en}/sobre` return `image/png`.

## 7. Risks & Assumptions

- **RISK-001**: **The portrait does not exist**, and this page is where its absence costs most — CONCEPT §7.1 calls it the site's highest-leverage missing asset, and here it is the focal moment rather than a side slot. Mitigation: the slot is a labeled frame that says what belongs there, the layout is built around the real proportions (4/5), and the photograph lands through the CMS with no deploy. The aesthetic judgment on the section is deferred to that moment rather than claimed now.
- **RISK-002**: **The record is thinner than the section deserves** while two rows lack a subject or a year. Mitigation: every row is a CMS row, the admin description on `period` tells her that blank beats wrong, and the handoff asks her for the Instituto Numen course title. The failure mode of the alternative — a plausible guess — is unrecoverable, because a visitor who catches one wrong fact on this page disbelieves the other five.
- **RISK-003**: **"vinte e dois anos" ages.** It is correct in 2026 and silently wrong in 2027. Mitigation: flagged in `SOBRE_DEFAULTS`, in the handoff and here; the durable fix is a year from her, which no one may derive on her behalf.
- **RISK-004**: The `credencial` tab's deletion drops a table. Mitigation: `IF EXISTS` on the drops in `down`, and ASSUMPTION-001 below.
- **ASSUMPTION-001**: `page-sobre.credencial` holds no production data — it was seeded empty in Phase 4 and the only seeded `page-sobre` field is `quemE` — so dropping the tab loses nothing. Verify against the row before generating the migration.
- **ASSUMPTION-002**: English copy falls back to Portuguese wherever she has not translated (master plan RISK-001) — accepted, not a defect of this page. The strings this task _does_ write in English (metadata, the four scaffolding strings) follow CON-002's register.
- **ASSUMPTION-003**: Her bio in `seed/pages.ts` is her own text, per TASK-005 of the Início plan and `docs/content-export-2026-08.md`, and is carried here unaltered.

## 8. Related Specifications / Further Reading

- [plan/architecture-site-restructure-1.md](./architecture-site-restructure-1.md) — the master plan; this file executes its TASK-039
- [plan/feature-page-primeira-conversa-1.md](./feature-page-primeira-conversa-1.md) — the precedent this plan follows, and the source of the `abertura` tab pattern
- [plan/feature-page-inicio-1.md](./feature-page-inicio-1.md) — the first precedent; the source of the credencial-tab decision and the portrait placeholder treatment
- [CONCEPT.md](../CONCEPT.md) §2 (the two voices, the place and the person), §6 (the map, /sobre), §7.1 (the portrait), §8.8 (the credential line), §11 (policies)
- [DESIGN.md](../DESIGN.md) — the two voices, the Marginalia-Is-Voice rule, the plate grammar, §6 Do's and Don'ts
- [PRODUCT.md](../PRODUCT.md) — the ranked audiences, "Evidence on hand" (her academic record), the brand commitments
- `frontend:layered-frontend-architecture` skill (+ `references/vertical-slice.md`) — the architecture contract
