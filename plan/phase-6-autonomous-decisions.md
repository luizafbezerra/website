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
`/internacional` prints none (see D-3).

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

_(Per-page entries continue below, filled in as each page lands.)_

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
