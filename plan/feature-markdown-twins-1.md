---
goal: Ship the Markdown twins of all eight pages in both locales, and rebuild /llms.txt as the machine-readable index — everything derived from the page registry and rendered from the same CMS data the HTML pages read
version: 1.0
date_created: 2026-08-05
last_updated: 2026-08-05
owner: João Vogler (dev); content sign-off — Luiza Fernandes Bezerra
status: "Completed"
tags: [feature, aeo, seo, i18n, machine-audience]
---

# Introduction

![Status: Completed](https://img.shields.io/badge/status-Completed-brightgreen)

This plan executes **TASK-043** of [`plan/architecture-site-restructure-1.md`](./architecture-site-restructure-1.md), the first task of Phase 7 (being-found), and it serves **REQ-011** and **CONCEPT §10**: clean Markdown twins of every content page in both locales, plus a machine-readable index of public content.

PRODUCT.md ranks **AI agents and LLM search as a co-equal audience**, fourth in the list only because the list is ordered by volume. So this is not a courtesy file behind the real site: **the sixteen twins and `/llms.txt` are that audience's version of the whole site**, and they are judged by the same standard every page is — does the first screen answer who · what · for whom · format · languages · reach, and does everything on it come from the CMS.

Two facts about the tree shaped the work more than any preference:

- **`localePrefix: 'as-needed'` plus translated slugs means the physical route tree is Portuguese**, and `src/middleware.ts` excludes any path containing a dot. That single exclusion is what lets a machine-facing address resolve in one request with no locale negotiation — and it is also why a dotted single-segment address is unreachable, because it lands on `[locale]` (the live `/favicon.ico` collision, TASK-046).
- **The eight pages have eight unrelated domain shapes.** Nothing generic walks them, and eight hand-written serializers would each re-decide what an absence means. The seam is one level lower: a block model with constructors that treat an absence as an absence, and a `section` that refuses to print a heading over nothing.

## 0. Shape brief

There is no visual design here; the equivalent brief is what the document _is_.

- **A twin is the page's answer, linearised — not a transcription of the page.** Every section that carries prose is in, in the page's own order. Everything that exists to be _looked at_ is out: the Cosmos overture, the Instagram squares, the Lâmina's travelling captions, the plates and their gallery labels, the portrait, the scanned signature, the wheel's nomenclature. A machine has nothing to do with a frame, and REQ-005's placeholder policy is a rule about layout honesty — a text file has no frames to be honest about.
- **The frame mirrors the chrome, not the page.** The rendered site carries her WhatsApp number in the header and her email and reach in the footer on every screen. A twin has no chrome, so those anchor facts move into the document: title, the lockup and her positioning sentence verbatim, then canonical URL · other locale · credential strip · agenda · WhatsApp · email · Instagram, then the page's lead. Identical on all sixteen, so a client that enters at `/llms/en/privacy.md` knows as much about where it is as one that enters at the home twin.
- **Repetition is the failure mode of a generated document.** The site's positioning sentence, its reach and its languages are stated in the identity line, the credential strip, the lead and often a prático row. That is already three or four times; the `<meta>` description would have been a fifth, saying the same thing in the compressed form a search snippet needs. It is not in the twins. It is in `/llms.txt`, where one line per page _is_ the document and compression is the point.
- **Discrete Q&A blocks, as CONCEPT §10 asks.** Both FAQ surfaces render `###` question + answer, so a retrieval step returns one complete answer rather than a page.
- **`/llms.txt` is one bilingual file.** The convention puts it at the origin root; a client that fetches it should discover the whole site rather than half of it and a pointer, and a second index under `/en` would be a second place for the identity block to go stale.
- **Anti-goals.** No prefilled WhatsApp deep links (see ALT-006). No per-visitor or per-clock variation — nothing in a twin depends on when it was rendered, so the bytes are stable and cacheable (SEC-001 already forbids the visitor half). No summarising: where the page states sixteen questions, the twin states sixteen. No second copy of any sentence that lives in Payload.

## 1. Requirements & Constraints

- **REQ-001**: All eight pages × two locales have a Markdown twin, at addresses **derived from `src/domain/site/pages.ts`** — never hand-written twice.
- **REQ-002**: Every twin resolves in one request, with **no middleware redirect**, for a client with no cookie and no `Accept-Language`.
- **REQ-003**: Every twin renders from the **same domain actions the rendered page reads** (`getAnalise`, `getFaq`, `getClinica`, …). No second copy of any visitor-facing string (GUD-002); the composed fee row and the agenda sentence come from A Clínica exactly as `PraticoSection` and `AvailabilityLine` compose them.
- **REQ-004**: `/llms.txt` is rebuilt from the registry: identity block, then every built page in both locales with its localized title, its front-loaded description, its canonical URL, its twin's URL and a **measured** token count.
- **REQ-005**: The twin's first screen front-loads the answer (who · what · for whom · format · languages · reach) and carries exactly one `#`.
- **SEC-001**: A twin reads nothing about the visitor and varies with nothing but the CMS. The Jung passage rotation — a function of the clock — is therefore out.
- **SEC-002**: An unconsented testimonial cannot reach a twin. The home twin reads `getTestimonials`, whose mapper drops every record without recorded consent; the gate is not re-implemented here.
- **CON-001**: Online-only. No twin may contain `guarulhos`, `presencial`, `consultório` or `in-person` — the twins are metadata as much as content.
- **CON-002**: English register — "clinical psychologist working in the Jungian tradition", never "Jungian analyst". Every string in a twin comes from the CMS, so this is hers to keep; the sweep verifies it.
- **CON-003**: Layering. Text shaping is pure and lives in `src/domain/markdown/`; nothing there imports React, Next, next-intl or `src/view/`. Absolute URLs (an env read) and localized labels (next-intl) are resolved in the routes layer and passed down.
- **CON-004**: Files not owned by this task stay untouched: no `src/view/**`, no page's domain type or mapper, no `src/payload/**`, no `src/domain/site/pages.ts`, no `src/app/{sitemap,robots}.ts`, no page route.

## 2. Implementation Steps

### Implementation Phase 1

- GOAL-001: The address rule and the text-shaping primitives, pure and tested.

| Task     | Description                                                                                                                                                                                                                                                                                                                      | Completed | Date       |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-001 | `src/domain/markdown/twinPath.ts` — `TWIN_PREFIX`, `twinPath(key, locale)` derived from `pagePath`, `twinEntries()` for prerendering and indexing, `twinFromSegments()` for the route. The file argues the address choice, including why `/analise.md` is structurally unreachable.                                              | ✅        | 2026-08-05 |
| TASK-002 | `src/domain/richText/extractParagraphs.ts` — one paragraph-preserving Lexical walker, with both emphasis flags. `extractRuns` is rewritten to project from it (flatten + drop `italic`), so the accent heading keeps its exact two-field shape and its tests pass untouched.                                                     | ✅        | 2026-08-05 |
| TASK-003 | `src/domain/markdown/MarkdownBlock.ts` — the block model (`heading`, `paragraph`, `quote`, `bullets`, `numbered`) plus constructors that return `null` for a blank value, `labelled`/`factBullets` for `**Label** — value` rows, `blocks` to flatten absences away, and `section`, which emits nothing when nothing is under it. | ✅        | 2026-08-05 |
| TASK-004 | `src/domain/markdown/renderMarkdown.ts` — blocks → text, one blank line between blocks, one trailing newline, no escaping (argued in the file). `richTextToMarkdown.ts` — Lexical → paragraphs carrying `*italic*` / `**bold**`, with the markers hugging the word.                                                              | ✅        | 2026-08-05 |
| TASK-005 | `src/domain/markdown/credentialStrip.ts` and `twinFeeRows.ts` — the two cross-page facts a twin composes rather than reads: the strip in `CredentialLine`'s order, and the fee rows through `feeQuoteFrom`, scoped per page exactly as `useFeeRows` scopes them.                                                                 | ✅        | 2026-08-05 |

### Implementation Phase 2

- GOAL-002: One builder per page, and the frame they share.

| Task     | Description                                                                                                                                                                                                                                                                           | Completed | Date       |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-006 | `src/domain/markdown/TwinContext.ts` — what a builder needs beyond the page's own copy: the practice, the absolute addresses, the nav labels, the agenda sentence, and the scaffolding labels. The type states which boundary each field crosses and why.                             | ✅        | 2026-08-05 |
| TASK-007 | `src/domain/markdown/twinDocument.ts` — the shared frame: `#` title, the lockup + positioning sentence, the facts block, the page's lead, its sections, and the way back to `/llms.txt`.                                                                                              | ✅        | 2026-08-05 |
| TASK-008 | `src/domain/markdown/twins/{inicio,analise,orientacaoProfissional,sobre,primeiraConversa,perguntas,internacional,privacidade}Doc.ts` — eight pure builders, each a declarative list of its page's sections in the page's own order, each documenting what it leaves out and why.      | ✅        | 2026-08-05 |
| TASK-009 | The two locale-dependent rules are consulted, not re-implemented: `inEnglishSectionFor` drops the In-English block on `/en`, `noteOpenersFor` drops the English bilhete opener there. `/analise`'s `sonhoAmpliado` disappears with her motif, exactly as the page's own section does. | ✅        | 2026-08-05 |

### Implementation Phase 3

- GOAL-003: The routes — sixteen twins and one index, both reading the same assembly.

| Task     | Description                                                                                                                                                                                                                                                      | Completed | Date       |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-010 | `src/app/(frontend)/llms/twinMarkdown.ts` — the routes layer's half: read the CMS through the domain actions, resolve the URLs and labels, dispatch to the page's builder, render. A module rather than a route function, because `/llms.txt` needs it too.      | ✅        | 2026-08-05 |
| TASK-011 | `src/app/(frontend)/llms/[...twin]/route.ts` — one catch-all serving all sixteen, `generateStaticParams` from `twinEntries()`, `text/markdown; charset=utf-8`, 404 for an address the registry did not produce.                                                  | ✅        | 2026-08-05 |
| TASK-012 | `src/app/(frontend)/llms.txt/route.ts` — rebuilt from the registry: identity block (kept, plus the English positioning line), then both locales' page lists with measured token counts and twin links. The stale two-page hardcoded list is gone.                | ✅        | 2026-08-05 |
| TASK-013 | `messages/{pt,en}.json` — a four-key `twin` namespace (`pages`, `page`, `alternate`, `index`). Everything else reuses labels that already exist: `chrome.credentialLabel`, `chrome.availability.*`, `chrome.footer.email`, `pratico.*`, `nav.*`, `meta.<key>.*`. | ✅        | 2026-08-05 |

**Execution notes**

_As built._ Sixteen twins at `/llms/<locale path>.md` (`/llms/index.md`, `/llms/analise.md`, `/llms/en/analysis.md`, …) served by one catch-all route from one address rule; `/llms.txt` rebuilt as a bilingual index of all eight pages × both locales with token counts measured on the bytes each twin actually serves. Twelve new domain modules with six colocated test files; four new message keys; two files changed outside the new set (`src/domain/richText/extractRuns.ts`, rewritten to project from the new walker, and `messages/{pt,en}.json`).

_The decisions the task text left open._

1. **The address is `/llms/<locale path>.md`, not `<path>.md`.** The llms.txt convention appends `.md` to the page's own URL, and that is the address an agent guesses without reading the index — so it was the first choice and it does not work here. `src/middleware.ts` excludes dotted paths, which is what a machine-facing address needs, but it also means `/analise.md` reaches the router unrewritten and matches `[locale]/(pages)/page.tsx` with `locale = "analise.md"`. A dynamic segment beats a catch-all, so no catch-all can claim those addresses; only sixteen static route folders could, which would write the registry's slugs down a second time and let a twin quietly survive a slug change. The home page has no `.md` form either (`/` + `.md` is `/.md`), so the convention needs an `index` special case regardless. A single static prefix keeps one route, one rule and one place a slug is written — and `/llms/` pairs the mirror with the `/llms.txt` that indexes it. **No middleware change was needed**, which was the point of keeping the extension.
2. **The `<meta>` description is in the index, not in the twins.** Argued in §0: inside a full document it is the fifth restatement of the positioning sentence.
3. **The wheel is the largest omission.** `/analise`'s mandala section keeps its heading and its intro — the intro is where the site states the policy that binds every symbol on it, _"nunca uma previsão, nunca uma leitura sobre quem você é"_, which is exactly the sentence a machine should be able to quote. Dropped: the twelve × five nomenclature table in `src/domain/zodiac/zodiacContent.ts` (scholarly apparatus for a drawing that does not exist in text) and her twenty-four per-sign readings, `null` at launch by design (REQ-007). A test pins the second half of that decision by writing a reading and asserting the twin still omits it — so if the choice is ever revisited, a test fails rather than a page silently changing.
4. **Plates are omitted entirely, provenance included.** A gallery label with no painting to label is apparatus, not answer; every plate on the site is currently empty, and the colophon's "pinturas de domínio público, com proveniência verificada" is a chrome fact rather than a page's. If she fills a plate's provenance, the twin will not mention it — recorded as a limitation rather than a bug.
5. **Testimonials are in, through the same gate.** SEC-002 is satisfied structurally: `getTestimonials`'s mapper drops every record without recorded consent, the twin reads that action, and an empty list produces no section because `section` refuses a heading over nothing. Consent covers publication on this site, and a twin is this site.
6. **The frame is identical on all sixteen twins, including `/privacidade`'s**, which carries no credential strip and no ask on the page. Argued in §0: the frame stands in for chrome the format does not have.
7. **The bilhete's openers are quoted, never linked.** ALT-006.
8. **The home twin's title repeats the clinic's name once.** Its `h1` _is_ the lockup ("Símbolos do Self", with her name under it), so `# Símbolos do Self` sits above an identity line that says it again with her role attached. The alternative was a title on one page that no rendered heading matches; one repeated proper noun on one of sixteen files is the cheaper defect.
9. **`Content-Type`.** Twins are `text/markdown; charset=utf-8` (correct for the extension; a browser offers to save the file, which is the right trade for a machine mirror). `/llms.txt` stays `text/plain; charset=utf-8`, because it is meant to be read in place by a crawler and by anyone checking what the crawler sees.

_Findings._

- **The revalidation hooks do not know the twin addresses.** `src/payload/globals/pages/shared.ts` revalidates `pagePath(key, locale)`, `Faq.ts` revalidates `/perguntas` + `/llms.txt`, and `clinica.ts` revalidates `("/", "layout")` — which route handlers do not participate in. So an admin save updates the page immediately and the twin within the hour. This task does not own `src/payload/**`; the exact change is in the handoff (RISK-001).
- **The English content is real, not falling back.** The database has translated copy for every page global, so `/llms/en/*.md` are genuinely English documents — including `role` as "Clinical psychologist working in the Jungian tradition" (CON-002) and the whole of `/en/international`. RISK-001 of the master plan is narrower than assumed.
- **The tree is currently unbuildable, for an unrelated reason.** An untracked `src/app/favicon.ico` appeared mid-session — a PNG carrying an `.ico` extension — and Turbopack fails the whole compilation on it (`Format error decoding Ico: The PNG is not in RGBA format!`), which 500s **every** route in dev and aborts `next build` with that one error. It is not this task's file and was left alone. All sixteen twins were verified against a real database on `next dev` before it landed; the build is the one check that could not be run (TEST-003), and the mechanism it would have exercised — `generateStaticParams` on a route handler — is the same one `src/app/share-card/[locale]/[key]/route.tsx` has been proving at build time since Phase 5.

_Deliberately not done._

- No `/en/llms.txt` (ALT-004). No `llms-full.txt` — sixteen linked twins with measured sizes let a client choose what to fetch, which is what the single-file variant exists to avoid needing.
- No sitemap entry for the twins. `sitemap.ts` is not owned by this task, and a twin is an alternate representation of a page that is already listed — `/llms.txt` is where the mirror is advertised. Noted in the handoff as an owner call.
- No change to `src/middleware.ts`. The address scheme was chosen so none was needed; had the twins carried no extension, the matcher would have needed an `llms` exclusion to avoid a locale-negotiation redirect.

**Verified 2026-08-05:** `pnpm typecheck` (tsgo) clean · `vitest run` **385 tests in 31 files green** (from 228 in 24), mutation-checked five ways — an empty `section` keeping its heading, the home twin losing its `index` filename, emphasis markers not hugging their word, the In-English block surviving on `/en`, and a BRL fee row appearing on `/internacional` each kill 1–4 tests · `oxlint --threads=1 src/` **0 errors, 40 warnings all in `src/migrations/`** (the baseline) · `oxfmt --write` applied to every new file · `pnpm build` **blocked by the unrelated `src/app/favicon.ico`** decode error described above.

Checked on `next dev` against the seeded database, before the favicon landed:

| Check                            | Result                                                                                                                                                                       |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| All 16 twins                     | 200, `text/markdown; charset=utf-8`, 2.5–7.0 KB, **no redirect** (`redirect_url` empty on every one)                                                                         |
| `/llms.txt`                      | 200, `text/plain; charset=utf-8`, 6.8 KB, 8 pt lines + 8 en lines, every URL and token count present                                                                         |
| Unknown twins                    | `/llms/blog.md`, `/llms/en/analise.md` (pt slug under the en prefix) → 404                                                                                                   |
| One `h1`                         | exactly one `^# ` in all 16 twins and in `/llms.txt`                                                                                                                         |
| CON-001 sweep, all 17 files      | no `guarulhos` · `presencial` · `consultóri` · `in-person`                                                                                                                   |
| CON-002 sweep, all 17 files      | no "Jungian analyst"                                                                                                                                                         |
| Placeholder sweep                | no "em prepara" · "in preparation"                                                                                                                                           |
| Fee                              | one "A combinar na primeira conversa." row on `/analise`, `/orientacao-profissional`, `/primeira-conversa`; none on `/internacional`, which states dólar/euro in its own row |
| Locale rules                     | In-English block on `/llms/internacional.md` only; four bilhete openers on pt, three on en                                                                                   |
| `/perguntas`' twin               | 4 category `##` + 16 question `###`, every answer complete                                                                                                                   |
| Other routes, before the favicon | `/` `/en` `/analise` `/en/analysis` `/perguntas` `/robots.txt` `/sitemap.xml` `/share-card/pt/analise` all still resolving                                                   |

## 3. Alternatives

- **ALT-001**: `<path>.md` at the site root (`/analise.md`, `/en/analysis.md`) — the llms.txt convention. Rejected on structure, not taste: `[locale]` claims every single-segment path, so only sixteen static route folders could serve these addresses, duplicating the registry's slugs and surviving a slug change silently; and `/` has no `.md` form, so the pattern needs an `index` special case anyway. Recorded in `twinPath.ts` so the next reader does not re-litigate it.
- **ALT-002**: `/md/analise` with no extension, plus an `md` exclusion in the middleware matcher. Rejected: an extensionless path is inside the matcher, so an English-preferring client with no cookie would be **redirected** rather than answered — the exact failure the share cards were moved to avoid — and buying it back with a matcher exclusion trades a self-evident rule (dotted paths are files) for a list that has to be maintained.
- **ALT-003**: A root catch-all (`src/app/(frontend)/[...twin]/route.ts`). Rejected: it collides with `[locale]` at the same segment position, and even where it resolves, a dynamic segment wins over a catch-all — so it could never claim the addresses it was added for.
- **ALT-004**: A per-locale index (`/llms.txt` + `/en/llms.txt`). Rejected: the convention places the file at the origin root, one fetch should reveal the whole site, and two indexes are two places for the identity block to go stale. The English section carries English titles and descriptions, which is what a locale-specific index would have added.
- **ALT-005**: One generic serializer walking the eight domain types. Rejected: the eight shapes have nothing in common, so the walker would have to be told what every field means — a configuration language for eight call sites. The seam that pays is one level lower (blocks and `section`), which is why the eight builders are short and declarative.
- **ALT-006**: Prefilled `wa.me` deep links for the four bilhete openers. Rejected: on the page each opener is a tap that composes a message _the visitor_ is about to send, which is CONCEPT §8.1's attribution with nothing tracked. In a text file a machine would choose the door, and the arriving message would attribute a decision the person never made. The twin quotes the four openers as what to say and states the plain WhatsApp address once.
- **ALT-007**: Include the wheel's twenty-four readings and its nomenclature table. Rejected for now — see execution note 3. The trigger for revisiting is her writing the readings, at which point they become the page's longest prose.
- **ALT-008**: Extend `extractRuns` with an `italic` flag. Rejected: `ExtractedRun` is asserted field-for-field by its own tests and consumed by `AccentHeading`, neither of which this task owns. Adding `extractParagraphs` underneath it and projecting down keeps one Lexical walker, changes no behaviour, and leaves the existing tests as the proof.
- **ALT-009**: Escape Markdown metacharacters in her copy. Rejected: the source is editorial prose (`Lei nº 13.709/2018`, `NEXT_LOCALE`, guillemets, em dashes), CommonMark treats all of it literally mid-line, and escaping would put backslashes into her sentences for a machine to read back. Block-level ambiguity is prevented structurally instead — every paragraph and list item is trimmed and emitted as its own block.

## 4. Dependencies

- **DEP-001**: Phase 6 complete — all eight pages built, all eight globals seeded, and `status: "built"` for every entry in `src/domain/site/pages.ts`.
- **DEP-002**: `src/domain/site/{pages,pagePath}.ts` — the registry and the locale-prefix rule. `twinPath` derives from `pagePath` rather than restating it.
- **DEP-003**: The eight page actions plus `getClinica`, `getFaq`, `getTestimonials` — the only reads a twin makes.
- **DEP-004**: `src/domain/tokens/{estimateTokens,formatTokens}.ts` — unchanged; they already did exactly what the index needed once it had real text to measure.
- **DEP-005**: `src/middleware.ts` — unchanged, and load-bearing: its dotted-path exclusion is what makes every twin resolve without a redirect. `twinPath.test.ts` asserts the invariant that depends on it.

## 5. Files

- **FILE-001**: `src/domain/markdown/{MarkdownBlock,renderMarkdown,richTextToMarkdown,twinPath,twinDocument,twinFeeRows,credentialStrip,TwinContext}.ts` — new, with colocated tests for the five that hold rules.
- **FILE-002**: `src/domain/markdown/twins/*Doc.ts` (eight) + `twins/twinDocs.test.ts` — new.
- **FILE-003**: `src/domain/richText/extractParagraphs.ts` + `.test.ts` — new; `src/domain/richText/extractRuns.ts` — rewritten to project from it, behaviour and tests unchanged.
- **FILE-004**: `src/app/(frontend)/llms/twinMarkdown.ts` and `src/app/(frontend)/llms/[...twin]/route.ts` — new.
- **FILE-005**: `src/app/(frontend)/llms.txt/route.ts` — rebuilt from the registry.
- **FILE-006**: `messages/{pt,en}.json` — a four-key `twin` namespace.
- **FILE-007**: `plan/architecture-site-restructure-1.md` — TASK-043 to be marked complete by the integrator (not owned by this task).

## 6. Testing

- **TEST-001**: `MarkdownBlock.test.ts` — a blank value is an absence in every constructor; `section` emits nothing when nothing is under it, and an empty inner section does not keep the outer heading alive; `labelled` never prints a dangling label.
- **TEST-002**: `renderMarkdown.test.ts` — every block kind, one blank line between blocks, one trailing newline, ordered lists renumbered from one, and no escaping of her punctuation.
- **TEST-003**: `richTextToMarkdown.test.ts` — one paragraph per paragraph; italic, bold and both; markers hug the word and padding moves outside them; a whitespace-only run stays unmarked; blank paragraphs drop.
- **TEST-004**: `extractParagraphs.test.ts` — paragraph grouping, both emphasis flags read independently from the bitmask, malformed nodes skipped rather than thrown on.
- **TEST-005**: `twinPath.test.ts` — the sixteen addresses, the home page's `index` filename, uniqueness, the **dot-in-every-address** invariant the middleware depends on, and a round trip through `twinFromSegments` including five near-miss addresses that must 404.
- **TEST-006**: `twinFeeRows.test.ts` — the four scopes, one "a combinar" row while both prices are unset, two labeled rows once either is set, and each half falling back independently.
- **TEST-007**: `twins/twinDocs.test.ts` — all eight builders × both locales from the code defaults: one `h1`, the whole facts block, the index link last, no CON-001 term, no placeholder wording, no heading deeper than `h3`; the fee scoped per page; both locale rules; the FAQ's discrete blocks; the wheel's omission (including after she writes a reading); Vozes absent with no consented voice and correct with one; `/sobre`'s record printed at the precision she confirmed.
- **TEST-008**: Mutation checks on the five rules most likely to rot silently — recorded in the Verified line above; each kills at least one test.
- **TEST-009**: Live verification of all 16 twins + `/llms.txt` against the seeded database, with the sweeps and the redirect check — the table above.
- **TEST-010**: `pnpm build` with all 16 twins prerendered — **not run**; blocked by the unrelated `src/app/favicon.ico` decode error.

## 7. Risks & Assumptions

- **RISK-001**: An admin save updates a page immediately and its twin within the hour, because the revalidation hooks do not know the twin addresses. Mitigation (owner's, one line each): add `revalidatePath(twinPath(key, locale))` beside the existing call in `src/payload/globals/pages/shared.ts`, add the `/perguntas` twins and `/llms.txt` to `Faq.ts`, and add `/llms.txt` + the sixteen twins to `clinica.ts` (its `("/", "layout")` call does not reach route handlers).
- **RISK-002**: A twin can drift from its page — a new section lands in a page route and not in its builder. Mitigation: the builders read the same domain objects, so a _field_ cannot drift; only a section can. The invariant test in TEST-007 catches structural regressions but cannot know about a section that was never added.
- **RISK-003**: `estimateTokens` is four characters per token, a coarse pt-BR approximation. It is advertised with a `~` and only ever helps a client budget; no decision depends on its precision.
- **RISK-004**: The twins are `noindex` along with the whole site (`robots.txt` is `Disallow: /` until launch), so nothing here is discoverable yet. That is correct and out of scope; TASK-045 owns the launch-gate checks.
- **ASSUMPTION-001**: Consent recorded for a published testimonial covers this site's own alternate representation of the page it appears on. If the owner reads consent more narrowly, the fix is one line in `inicioDoc`.
- **ASSUMPTION-002**: `/llms/*` is not a path any future page will want. The prefix is a static route segment, so a page at `/llms` would collide.

## 8. Related Specifications / Further Reading

- [plan/architecture-site-restructure-1.md](./architecture-site-restructure-1.md) — the master plan; this file executes its TASK-043 (Phase 7)
- [plan/feature-page-primeira-conversa-1.md](./feature-page-primeira-conversa-1.md) — the plan shape this file follows
- [CONCEPT.md](../CONCEPT.md) §6 (the eight-page map and every page's section list), §10 (AEO: front-loaded answers, Markdown twins, the machine-readable index, discrete Q&A), §8.1 (o bilhete and its attribution), §8.9 (currency and time)
- [PRODUCT.md](../PRODUCT.md) — the four ranked audiences; AI agents and LLM search as co-equal
- [llms.txt](https://llmstxt.org/) — the convention this index follows, and the `.md`-suffix recommendation ALT-001 could not adopt
