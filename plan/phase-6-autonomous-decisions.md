---
goal: Record every decision taken without the owner while Phase 6 of architecture-site-restructure-1 was completed unattended, with the alternatives rejected, so each one can be reviewed and reversed cheaply
version: 1.0
date_created: 2026-08-05
last_updated: 2026-08-05
owner: João Vogler (dev); review — João Vogler, then Luiza Fernandes Bezerra for anything marked COPY
status: "Open for review"
tags: [decisions, phase-6, review]
---

# Phase 6 — decisions taken without the owner

![Status: Open for review](https://img.shields.io/badge/status-open%20for%20review-blue)

Phase 6 of [`plan/architecture-site-restructure-1.md`](./architecture-site-restructure-1.md) — the
six remaining CONCEPT §6 pages — was executed in one unattended session on the owner's explicit
instruction: _finish the pages without my input; where you would have asked me, record the decision
and the alternatives so we can review and fix later._

This file is that record. It holds only the calls that a normal session would have put to the owner.
Every per-page design decision also lives in that page's own plan (`plan/feature-page-<key>-1.md`),
which is the fuller account; this file is the review queue.

**How to read a row.** `REVERSAL` says what it costs to undo. Anything tagged **COPY** is prose
drafted for her and needs her sign-off under TASK-052 — none of it is her voice yet.

---

## A. Process decisions (how the phase was run)

### A-1 · The per-page `impeccable` shape run was replaced by a written shape brief

**Decision.** PAT-001's ritual is _author the page plan → run `impeccable` **shape** → implement →
`impeccable` finish-review_. The shape run is interactive: it asks the operator to settle what the
documents leave open. Under "no prompts", it cannot run. Each page's builder therefore wrote the
`## 0. Shape brief` section itself, from CONCEPT §6, DESIGN.md and PRODUCT.md, and resolved the open
questions in writing — the same artifact the shape run produces, authored rather than elicited. The
mechanical half of the ritual _was_ kept: impeccable's non-interactive anti-pattern detector ran over
every new component.

**Alternatives rejected.** (a) Run the shape skill and answer its questions as the owner — that is
impersonating a decision-maker on design calls that are genuinely hers to weigh. (b) Defer the six
pages until an interactive session — the owner ruled that out explicitly. (c) Skip the shape step
entirely — it is where the page's sequence and focal moment get decided, and six pages built without
it would drift from each other.

**REVERSAL** — free. The shape briefs are documents; a later interactive run can revise any page.

### A-2 · The finish-review was a self-review against the checklist, not the `impeccable:impeccable-finish-reviewer` agent

**Decision.** Each page was verified against the master plan's Phase 6 checklist and DESIGN's do's
and don'ts by its builder, then again at integration in a real browser. The dedicated
finish-reviewer agent was not invoked per page.

**Alternatives rejected.** Running six finish-reviewer agents on top of six builders — the review
value is real but it needs the built page in a browser, which only the integration pass had.

**REVERSAL** — free, and worth doing: a finish-review pass over the six pages together is a good use
of a later session, before TASK-052.

### A-3 · Six pages were built in parallel by six agents in one working tree

**Decision.** Each builder owned a disjoint file set (its global, its `domain/<key>/`, its accessor,
its `view/<key>/`, its route, its plan file) and was forbidden from touching any shared file. Shared
wiring — `messages/{pt,en}.json`, `src/domain/site/pages.ts`, `src/payload/seed/pages.ts`, the
migration, `payload-types.ts`, `globals.css` — was integrated afterwards from per-page handoff
artifacts. No builder ran a build, a server, or any database command.

**Why.** Payload migrations are serial by nature and the message catalogues are two files six agents
would have raced on. Splitting ownership this way is what made parallelism safe.

**Cost, recorded honestly.** Six agents could not see each other's pages, so cross-page consistency
rests on the shared brief and on the integration pass rather than on any one author's eye. Where two
pages solve the same problem differently, that is the seam to look at first.

### A-4 · Shared page grammar was promoted _before_ the pages, by the integrator

**Decision.** `FactList`, `PraticoSection`, `Comecar`, `useFeeRows` and `domain/pages/FactRow` were
extracted from `/primeira-conversa`'s `Logistica` into `src/view/general/` in their own commit
(`c8a16a0`), and builders were forbidden from adding anything to `src/view/general/`.

**Alternatives rejected.** (a) Let each page build its own prático and começar sections — four
near-copies, and the fee rule duplicated four times. (b) Let builders add to `view/general/` — two
agents would have created the same file.

**REVERSAL** — cheap; these are small components with one call site each per page.

### A-5 · `useFeeRows` gained a per-service scope, changing what a service page quotes

**Decision.** `feeQuoteFrom` (REQ-006, TEST-006) decides whether an unset price is one row or two,
and `/primeira-conversa` still uses it via `fees="both"`. But a service page now quotes **only its
own** service: `/analise` prints the analysis fee, `/orientacao-profissional` its own, and
`/internacional` prints none (see B-8).

**Reasoning.** Printing both prices on `/analise` asks a reader to compare two things they are not
choosing between, and the two doors are two products with two buyers (CONCEPT §4).

**Alternatives rejected.** Quote both on every page — simpler, and wrong for the reader.

**REVERSAL** — one prop per page.

---

## B. Product decisions (visible to a visitor)

### B-1 · A fifth bilhete opener was added, for whoever writes from abroad · **COPY**

**Decision.** `clinica.notes` gained `international`, and `/internacional`'s ask uses it.
`noteOpenersFor` deliberately does **not** list it, so `/primeira-conversa`'s bilhete still offers
exactly the four doors CONCEPT §6 names (commit `3592c6e`, with a test asserting the exclusion).

**Reasoning.** CONCEPT §6 gives `/internacional` a "começar" section with an
"international/English opener", and none of the four existing openers is that: on the reach page the
fact worth attributing is not which service a visitor came for but that they are writing from outside
Brazil — the exact permission the page exists to give (CONCEPT §8.1 makes the opener's wording the
whole attribution system). `plan/feature-page-primeira-conversa-1.md` predicted this gap and left it
to TASK-041.

**Alternatives rejected.** (a) Reuse `english` — wrong for the largest group the page serves, a
Brazilian in Lisbon reading Portuguese. (b) Reuse `unsure` — says nothing about where they are.
(c) Add it to the bilhete as a fifth note — deviates from CONCEPT §6's four doors on the one page
CONCEPT specifies exactly.

**REVERSAL** — delete the field in the admin and the page falls back to a bare WhatsApp link;
delete the schema field for a full reversal (one migration).

### B-2 · Every drafted string on the six pages is a draft in her name and is listed for sign-off · **COPY**

Four of the six pages had **no** surviving copy (`/orientacao-profissional`, `/internacional`, and
the openings of `/analise` and `/sobre` beyond what was already seeded); two had partial
(`/perguntas`' six FAQ answers, `/privacidade`' LGPD draft). Following the precedent set for Início's
four new sections and for the whole of `/primeira-conversa`, each page ships **drafts stating only
facts CONCEPT and PRODUCT already fix**, marked as drafts in the page's `*_DEFAULTS` file comment and
enumerated in its plan under "copy needing her sign-off".

Two things were never invented anywhere: **a price**, and **provenance** (a plate's painter, title or
year has no default — CONCEPT §11).

**REVERSAL** — every string is a CMS field; she overwrites in the admin with no deploy.

### B-3 · Two pages ship with no wow set-piece, and two ship with no plate

PAT-002 says _at most_ one wow and _at least_ one plate per page. Two pages take the low end of the
first and two take a documented exemption from the second.

- **No wow on `/orientacao-profissional`** — CON-006 forbids the only symbol its vocabulary suggests
  (a wheel beside psychological tests reads as predictive assessment), and inventing a substitute
  would be decoration looking for a reason. Its art moment is a crossroads plate slot.
- **No wow on `/internacional`** — its reader came for an answer about time zones and payment.
- **No plate on `/sobre`** — CONCEPT §6 names only two images there and §7.1 already asks the portrait
  to be "editorially set, plate-like". A third labeled frame, while both existing slots are still
  empty, is Início's five-identical-tiles defect at page scale. **Reversal is purely additive**: a
  `plate` group on the `aClinica` tab. _Do not treat this as an omission to be quietly fixed — adding
  a painting changes what the page is about._
- **No plate on `/privacidade`** — with no painting chosen, REQ-005 renders a labeled "a painting
  belongs here" frame, i.e. an admission of incompleteness printed exactly where the reader is
  deciding whether to trust the site. Scoped to this page, explicitly not a precedent.

### B-4 · The wheel's placeholder prose was deleted, not merely left unrendered · **COPY**

REQ-007 ships the wheel visual-only, and `src/domain/zodiac/zodiacContent.ts` carried 24 dev-written
sign paragraphs, 24 Vedic paragraphs and 36 nakshatra `motif` glosses behind an `_isPlaceholder` flag.
Not rendering them would have left a loaded gun for the next reader of that file, so they are gone and
a test fails if a prose key returns. The nakshatra `motif` was judged authored prose too ("a chama que
separa e revela" is a poetic gloss on the datum `symbol: "lâmina"`), so the mansions now print name ·
pada range · deity · ruler · symbol and nothing more.

**Alternative rejected.** Keep the prose and gate it on a flag — one edit away from shipping words in
her name, on the page where CONCEPT §11 binds hardest.

**REVERSAL** — the deleted prose is in git history, but the correct fix is her readings in the CMS.

### B-5 · `/perguntas` grew from 6 FAQ entries to 16 · **COPY**

CONCEPT §6 specifies four sections; Phase 4 deliberately left `orientacao` and `internacional` empty
to avoid inventing her answers, which would have shipped a four-section page with two sections. Ten
drafts were written from facts CONCEPT and PRODUCT already fix, following the primeira-conversa
mini-FAQ precedent. Numbering was dropped (continuous numbering starts section two at four;
per-section restarts assert four sequences).

**Also decided here:** RISK-002 — the mini-FAQ drifting from `/perguntas` — is resolved as a **register
split**: the search-box question lives on `/perguntas`, the threshold doubt on `/primeira-conversa`,
and the one near-collision is worded apart. Written into three code comments and two admin
descriptions rather than left as an intention.

**English translation debt is largest here**: 16 rows × 2 localized fields, in the section an
anglophone most needs.

### B-6 · `/privacidade` gained a fifth section, and states three things the site keeps

CONCEPT §6 gives the page four sections, all describing the _site_ — which keeps almost nothing. Data
actually exists in the _conversation_, so a `responsavel` tab was appended carrying the responsibility
statement and contact, the LGPD rights sentence, and sigilo profissional: the two things the old
pre-CONCEPT page carried that the new one should not silently lose.

**And a correction to the project's own understanding:** the site does not only write the language
cookie. `src/infrastructure/browser/cosmosPreference.ts` writes `cosmos:show` to `localStorage` for the
footer's Cosmos-restore control, so "what the site keeps" lists three items, not two.

**Alternatives rejected.** (a) Keep only CONCEPT's four sections and drop the LGPD/sigilo lines — a
silent regression on a page whose whole value is completeness. (b) Fold them into `bilheteNota` — the
wrong subject.

### B-7 · `/internacional`'s In-English section disappears on `/en`, by rule

On the English mirror the whole page is already English and the section's link would point at the page
you are reading. Extracted as a tested pure rule (`inEnglishSectionFor`) and consulted **in the
route**, not inside the component: a section that structurally disappears in one locale is a fact about
the page's composition, and a component quietly returning `null` would make the route read as five
sections always. Same shape `noteOpenersFor` gave the fourth bilhete opener.

The In-English link goes to **`/en`**, not `/en/international`: an anglophone needs the practice in
English, and the English twin of this page is about _Brazilians abroad_ — the wrong subject for them.

### B-8 · `/internacional` quotes no BRL price, and the abroad framing moved to A Clínica · **COPY**

CONCEPT §8.9 gives that page USD/EUR on its own terms and forbids automatic conversion, so it passes
`fees="none"` and states money in its own labeled "Valores" row. The page's builder flagged that
`clinica.fees.internationalNote` was unset, which would have left the page whose subject includes
paying from abroad stating no currency at all.

**Resolved at integration:** the note is CONCEPT §8.9's own policy sentence rather than a price, so it
is now seeded in A Clínica in pt and en, and `PraticoSection` suppresses it when a page passes
`fees="none"`. The result: the three BRL pages carry the abroad framing beneath their price, and
`/internacional` states it once, in body type, in its own row.

**Alternatives rejected.** (a) Leave the note unset and keep only the page-owned row — the framing then
never reaches a Brazilian in Lisbon reading `/primeira-conversa`. (b) Seed the note and keep the row —
it prints twice on the one page whose subject it is.

### B-9 · Two pages are seeded in both locales; the rest still fall back to Portuguese

RISK-001 accepts Portuguese-on-`/en` until her polish pass, and that stands for `/analise`,
`/orientacao-profissional`, `/sobre` and `/perguntas`. Two pages are exceptions:
`/internacional`, because its In-English section is dropped on `/en` (B-7) and a Portuguese
`/en/international` would be the one English page with no English on it; and `/privacidade`, whose
defaults are keyed by locale so it degrades to English **even with Payload off** — an anglophone
reading a privacy statement they cannot read is a defect rather than a rough edge.

### B-10 · Three `eyebrow` fields were dropped from the schema rather than left unrendered

DESIGN §6 names a tracked-caps kicker above every section as scaffolding rather than voice, so
`page-analise.oQueTrazem.eyebrow`, `page-perguntas.abertura.eyebrow` and
`page-privacidade.abertura.eyebrow` could never reach a page. A field that renders nowhere is worse
than a `DROP COLUMN` on a global Phase 4 seeded empty.

**ASSUMPTION to confirm:** production holds no stored value in any of the three. They were seeded
empty in Phase 4 and no `/admin` edit has touched them, but that is inferred from the repository, not
observed on Luiza's database.

### B-11 · Two `/sobre` rows deliberately state less than they could · **COPY**

The Instituto Numen row reads "Pós-graduação" with no subject, because no source document names the
course, and `period` is unset on all six formação rows because no source states a year. On the page
whose job is verification, a guessed year is the one error it cannot afford. The fix is her exact
course title and start year, not a better guess.

**One drafted line ages and nothing in the code will notice:** "vinte e dois anos" on `/sobre` will be
wrong in a year. Deriving 2004 from 2026 − 22 was refused; the durable fix is a start year from her.

### B-12 · Smaller page-level calls, recorded in each page's own plan

Each of these is argued at length in `plan/feature-page-<key>-1.md`; listed here so the review queue is
complete.

- **`/sobre`'s `h1` is her name** — it is the `Person` node's URL and the query the page exists to win.
  Kept as a CMS field rather than reading `clinica.fullName`, so the title stays hers to edit.
- **`/sobre` has no CTA section** — CONCEPT gives it none; one marginalia link closes _A clínica_,
  before the signature, because nothing follows a signature.
- **`/internacional`'s `h1` is the expat query**, not the page's name ("Psicóloga brasileira on-line,
  para quem mora fora"); the name survives in the nav, the `<title>` and the breadcrumb.
- **The city time-notes name a range and say what moves it** — Brazil abolished DST in 2019, Europe and
  the US did not, so a fixed hour difference would be wrong for part of every year.
- **`/orientacao-profissional`'s percurso is numbered I–IV** (the bounded programme is the product
  claim, so the order is meaning) while `para quem` is deliberately unnumbered on the same page.
- **Its distinctions are rubricated prose, not a comparison table** — no competitor column, no
  checkmarks, and nobody disparaged.
- **Its rubrication uses `terracotta-deep`** — the recurring `terracotta` computes near 4.1:1 at body
  size on `parchment-deep`, under the AA floor.
- **Its draft copy says "aprimoramento pela PUC-SP"**, not "especialização": CONCEPT §4 says
  specialization, PRODUCT's evidence records an aprimoramento, so the narrower documented word won.
  **Worth confirming with her.**
- **`/analise`'s Sonho ampliado renders gated on the motif**, with the motif shipped as a draft (a
  dreamer's quoted speech, not her clinical prose) and the three parallels rendering only once
  curated. Static, so it cannot compete with the wheel for the page's one wow.
- **`/analise` keeps the wheel image as a code asset** — `wheelGeometry` is calibrated to those exact
  pixels, so replacing it is a code change, not an upload. **`/art/wheel.jpg` has unverified
  provenance while the footer colophon already claims provenance is verified** — flagged, and it is a
  launch item.
- **On `/en` the wheel's nomenclature stays Portuguese** (`Element — fogo`, `Ruler — Marte`): it is code
  reference data with no locale mechanism, while the surrounding chrome localizes. ~68 strings,
  purely additive to fix.
- **`/perguntas` has no `Comecar` block** — CONCEPT gives it none, and a terracotta block after sixteen
  answers turns a reference page into a sales page. Two quiet affordances instead.
- **`/perguntas`' plate is placed by rule, not by category name** (`Math.min(1, sections.length - 1)`),
  so it survives her emptying a section.

---

## C. Schema decisions

### C-1 · One migration for all six pages, created by the integrator

Builders changed their own global's fields freely and ran **no** migration command;
`payload migrate:create` ran once at integration over the whole set. `migrate:create` diffs the config
against the last snapshot and is independent of database state, so a single additive migration is
equivalent to six — and six agents racing on `src/migrations/` is not.

**Note for the reviewer.** The Phase 4 procedure applies to the audit of that migration: check for
`RENAME` statements (there must be none), and add `IF EXISTS` to every drop.

### C-2 · The `abertura` tab pattern was applied per page, not once globally

`/primeira-conversa` introduced an `abertura` tab because a page's `h1` and front-loaded lead have no
home among its CONCEPT §6 sections, and its notes say every remaining page needs the same. Of the six,
`/analise`, `/orientacao-profissional`, `/internacional`, `/perguntas` and `/privacidade` already had
one from Phase 4; only `/sobre` needed the tab added.

### C-3 · `page-sobre`'s duplicate `credencial` tab was deleted

It duplicated `clinica.identity.credentials`, the cross-page home Phase 5 built for a strip CONCEPT
§8.8 puts on every core page. TASK-035 already dropped the identical tab from `page-inicio`
(migration `20260805_031704`) and its notes said `page-sobre` should follow "when that page is built,
and for the same reason". `/sobre` renders `<Credencial>` from A Clínica instead.

**REVERSAL** — one migration; but the drift the duplicate invites is the reason it went.

---

## D. Open items this session could not close

These are not decisions — they are things a human has to do or confirm.

- **TASK-052 · her review of every drafted string.** The single largest open item. Every page's plan
  lists its own drafts.
- **Legal read of `/privacidade`.** The page states what the site does, verified against the code, and
  is honest — but it is the one page where a lawyer's read is worth more than a designer's, and none
  has happened. Recorded on the page's own plan too.
- **Vercel Web Analytics is still not enabled in the dashboard** (owner action on Luiza's account,
  Phase 5 note). `/privacidade` is written to be true either way.
- **DEP-005 content from Luiza** — the portrait, the plates and their provenance, the signature asset,
  the wheel readings, the Jung passage pool, the fee values, the CRP confirmation, the availability
  sentences. Every one of them lands through the CMS with no deploy; every empty slot renders a
  labeled frame meanwhile (REQ-005).
- **Real-hardware performance and a11y passes** (TASK-049 / TASK-050) — the MCP browser here is
  software WebGL and exposes no `prefers-reduced-motion` override, so motion and Cosmos/wheel
  performance were verified structurally, from the shipped stylesheet and the DOM, not measured.
- **A finish-review pass over the six pages together** (A-2), with them in a browser side by side.
  Cross-page consistency is the thing six parallel builders could not check, and the seams worth
  looking at first are: whether the four `abertura` field shapes should converge (`body` on
  `/analise` and `/orientacao-profissional`, `lead` on `/sobre` and `/primeira-conversa`, `intro` on
  `/perguntas` — a rename costs a migration, so it was left alone), whether every page's terminal
  section carries the same weight, and whether the tonal `parchment-deep` breaks land at a similar
  rhythm across the eight.
- **`/art/wheel.jpg` provenance** (B-12) — the colophon claims verified provenance site-wide; this
  asset does not have it, and because the wheel geometry is measured off those pixels, replacing it is
  a code change rather than a CMS upload.
- **`alumniOf` in `src/view/seo/jsonLd.tsx` is missing USP** (Fenômenos Anômalos). The constant holds
  PUC-SP and Instituto Numen; `/sobre` now seeds three institutions. The one-line fix agrees the
  constant with the page; _deriving_ `alumniOf` from `page-sobre.formacao` is a real improvement but
  couples the site-wide graph to one page's array and cannot happen in the layout, which does not read
  that global. Recommended for TASK-045, together with a `ProfilePage` node for `/sobre` — the
  strongest AEO signal that URL is still missing.
- **`/favicon.ico` returns 500** and has since TASK-035 (the middleware matcher excludes dotted paths,
  so the request lands on `[locale]/` with `locale = "favicon.ico"`, and no icon asset exists).
  Owned by TASK-046.
