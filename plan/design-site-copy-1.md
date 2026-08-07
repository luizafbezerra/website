---
goal: Raise the shipped default copy to a good-enough-to-keep baseline — her supplied text placed verbatim, a bounded grammar correction, a humanize pass over everything we drafted, then the English mirror
version: 1.0
date_created: 2026-08-07
last_updated: 2026-08-07
owner: jv-vogler (developer) · Luiza Fernandes Bezerra (author, sign-off)
status: "In progress"
tags: [design, content, copy, i18n, cms]
---

# Introduction

![Status: In progress](https://img.shields.io/badge/status-In%20progress-yellow)

Every visitor-facing string on the site ships twice: once as a `*_DEFAULTS` object in `src/domain/`, which is both the code fallback and what `seed/pages.ts` writes, and once as a stored row in the Payload globals, which is what production actually renders. Luiza will edit the stored rows to her taste. This plan raises the **default** so that what she edits is already good — and so that a fresh database, a Payload outage, and the Markdown twins all render the better version.

Three jobs, in order:

1. **Place her supplied text.** A block of her own prose (pasted 2026-08-07) partly duplicates copy already shipped verbatim, partly resolves questions the code left explicitly open (the two unnamed formação rows; "aprimoramento" vs "especializada"), and partly says things the site has never said. Each paragraph gets a home or a documented reason it has none.
2. **Correct her grammar, narrowly.** The owner has authorised this. CONCEPT §11 and three code comments say her text is never reworded, so the licence is bounded to four mechanical classes and every edit is logged for her veto.
3. **Humanize what we drafted, then translate.** Portuguese settles completely before any English is written, because English is downstream of it.

The site is a bilingual tree: pt-BR at the root (canonical), English under `/en`. Today only `/internacional` and `/privacidade` have English page copy; every other page falls back to Portuguese through Payload's `fallback: true`. Phase 5 closes that gap. `/internacional`'s `inEnglish` band is English **inside the Portuguese page** on purpose and is not translated, not doubled, and not removed.

## 1. Requirements & Constraints

### Requirements

- **REQ-001**: Every paragraph of her 2026-08-07 supplied text is either placed in a `*_DEFAULTS` field, confirmed already present verbatim, or listed in the ledger with the reason it was not placed. No paragraph is silently dropped.
- **REQ-002**: Her text is placed **verbatim** apart from the corrections permitted by CON-003, and each correction is recorded as a before/after row she can veto individually.
- **REQ-003**: Where her wording resolves a question the code marked open, her wording wins and the code comment that recorded the question is updated to record the answer and its source.
- **REQ-004**: The humanize pass (`writing:humanize`) runs over **drafted** copy only. Copy the defaults files mark as hers, and the protected lines of CON-005, are out of scope for it.
- **REQ-005**: Portuguese is complete and reviewed before the first English string is written (Phases 1–4 gate Phase 5).
- **REQ-006**: English page copy ships for all eight pages, following the `INTERNACIONAL_EN` precedent in `src/payload/seed/pages.ts`.
- **REQ-007**: A regression test pins her verbatim blocks so a future edit that rewords them fails `pnpm test` instead of shipping.
- **REQ-008**: Production delivery never overwrites a field Luiza has edited. A stored value that still equals the pre-change default is safe to update; anything else is a line on a change list she approves.

### Constraints

- **CON-001**: **Online-only.** No string may claim in-person practice. "Consultório estabelecido em Guarulhos" is already gone from visitor-facing copy; it survives only in code comments and one guard test, and stays gone.
- **CON-002**: In English she is a _"clinical psychologist working in the Jungian tradition"_. Never _"Jungian analyst"_ — a formally protected title.
- **CON-003**: **The grammar licence is exactly four classes**, and nothing else:
  1. subject–verb / number agreement (`o conteúdo dos encontros são ditados` → `é ditado`);
  2. orthography under the Acordo Ortográfico (`anti capitalista` → `anticapitalista`, `pós graduações` → `pós-graduações`);
  3. spacing and hyphenation inside proper nouns (`PUC - SP` → `PUC-SP`);
  4. a wrong preposition or contraction (`À primeira vez que entrei` → `Na primeira vez em que entrei`).
     Explicitly **not** permitted: reordering, trimming, merging or splitting her sentences; substituting word choices; "improving" her punctuation or rhythm; deleting her exclamation mark; changing `si mesmo(a)`.
- **CON-004**: `writing:humanize` §14 (ban em dashes) and §19 (straight quotes) are **suspended for this project**. The skill's own Voice Calibration section says a writing sample outranks its style rules, and her supplied text is the sample: it uses an em dash (`a ideia de Individuação — o processo contínuo…`) and curly quotes (`"anti capitalista"`). DESIGN's manuscript typography assumes both. An agent that strips em dashes from this codebase has broken it.
- **CON-005**: **Protected lines** — CONCEPT-fixed, not drafts, and not subject to the humanize pass: `CLINICA_DEFAULTS.positioning`; the colophon binding in `messages/*.json` (`chrome.colophon.binding`); the two-door boundary sentence (`inicio.doisCaminhos.boundary`, `analise.oQueTrazem.boundary`); `analise.oMetodo.closingLine`; `sobre.aClinica.body` paragraph 2 ("Símbolos do Self é o lugar; eu sou quem recebe você nele."); the three `primeiraConversa.passoAPasso.permissoes.items`; the three `chrome.availability` states.
- **CON-006**: **Individuação is described, never promised** (CONCEPT §11). Her own paragraph on it describes a process, so it passes — but the guardrail clause currently closing `analise.oMetodo.individuacao` is kept unless her sign-off removes it.
- **CON-007**: No fact is invented. Where her text is silent (session length, fee, CRP), the field keeps its current draft or stays empty. The six `formacao` rows keep `period: null` — she supplied no years.
- **CON-008**: `FAQ_PLACEHOLDER_MARK` (`[A DEFINIR]`) rows are **not** in scope. They are deliberately unmistakable and must never be replaced by a draft; only her answers retire them.
- **CON-009**: Production is on Luiza's Vercel + Neon accounts. Stored CMS values override code defaults, so no phase here changes what a visitor sees until Phase 6 runs.

### Guidelines & patterns

- **GUD-001**: **Repetition budget.** Per page, these count ≤ 3 occurrences each: `on-line`, `Brasil e exterior` (and its variants), `português ou … inglês`, `individuação`, `encontros semanais`, `a profissão que faz mais sentido no momento atual da sua vida`, `psicologia analítica`/`junguiana`. A fourth occurrence is a defect to fix, not a note to file.
- **GUD-002**: Numbers are spelled out in prose (`doze encontros semanais`, `cinquenta minutos`, `vinte e dois anos`) and left as digits only in the academic record and in fees.
- **GUD-003**: Drafts state facts plainly. Only her words get to be profound.
- **PAT-001**: One concept, one place. Anything readable on more than one page lives in `Clinica`; anything belonging to one screen lives in that page's global.
- **PAT-002**: English page copy lives in `src/payload/seed/pages.ts` as `<PAGE>_EN` constants, not in the domain layer — the domain holds one shape per concept, not one per locale. `PRIVACIDADE_DEFAULTS`'s `Record<Locale, …>` stays the single documented exception.

## 2. Implementation Steps

### Implementation Phase 1

- GOAL-001: Turn her pasted text into a reviewable source-of-truth ledger, with every paragraph given a stable ID, a destination, and (where CON-003 applies) a before/after correction row. **No source file changes in this phase.**

| Task     | Description                                                                                                                                                                                                                                                                                                                                                                                  | Completed | Date       |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-001 | Create `docs/source-copy-2026-08-07.md`. Paste her text unedited under a `## Original, unedited` heading, then split it into numbered blocks `SRC-A` … `SRC-H` per the mapping below. This file is the artifact she reviews; it is never rendered.                                                                                                                                           | ✅        | 2026-08-07 |
| TASK-002 | In that file, add a **placement table** with columns `ID · her text (first words) · destination field · status (already verbatim / replaces draft / new field / not placed)`. Populate from the mapping in §5 below.                                                                                                                                                                         | ✅        | 2026-08-07 |
| TASK-003 | Add a **correction table** with columns `ID · before · after · CON-003 class`. Seed it with the seven known edits: `são ditados`→`é ditado`; `anti capitalista`→`anticapitalista`; `PUC - SP`→`PUC-SP`; `pós graduações`→`pós-graduações`; `À primeira vez que entrei`→`Na primeira vez em que entrei`; `12 encontros`→`doze encontros` (GUD-002); `online`→`on-line` where it is her prose. | ✅        | 2026-08-07 |
| TASK-004 | Add an **open questions** section listing decisions her text creates rather than settles: (a) `especializada` in prose vs `Aprimoramento` in the record — both are hers, both stay, note it as deliberate; (b) whether `analise.oMetodo.toolsLine` stays one condensed line or becomes her three bullets; (c) whether the CON-006 guardrail clause survives beside her individuação prose.   | ✅        | 2026-08-07 |
| TASK-005 | Grep-verify CON-001 across all visitor-facing defaults, not just the twins: `grep -rn "Guarulhos\|onsultóri\|presencial" src/domain src/payload/seed messages` must return only comments and `twinDocs.test.ts:136`.                                                                                                                                                                         | ✅        | 2026-08-07 |

**Completion criteria**: `docs/source-copy-2026-08-07.md` exists; every paragraph of her pasted text appears in exactly one `SRC-*` block; the placement table has no empty `status` cell; TASK-005's grep returns no visitor-facing hit.

### Implementation Phase 2

- GOAL-002: Land her text in the Portuguese defaults, corrected under CON-003, and update the code comments that recorded the now-answered questions.

| Task     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                         | Completed | Date       |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-006 | `src/domain/analise/Analise.ts` — apply CON-003 to `METODO_INTRO` (`são ditados`→`é ditado`, `"anti capitalista"`→`"anticapitalista"`, keeping her curly quotes). Rewrite the `METODO_INTRO` doc comment: it currently forbids touching punctuation; it must now state the CON-003 licence, name the two edits, and cite `docs/source-copy-2026-08-07.md`.                                                                                          | ✅        | 2026-08-07 |
| TASK-007 | `src/domain/analise/Analise.ts` — replace `abertura.body` paragraph 2 with SRC-F.1 (her "Diferente de abordagens que focam apenas em calar um sintoma…"). Keep paragraph 1 as is; it already carries the AEO front-load.                                                                                                                                                                                                                            | ✅        | 2026-08-07 |
| TASK-008 | `src/domain/analise/Analise.ts` — replace `oMetodo.individuacao` with SRC-F.2 (her "Nesta abordagem, olhamos para o ser humano de forma integral… integrando suas luzes e sombras."), preserving the existing italic run on `individuação`, and keep the CON-006 guardrail sentence as the closing clause pending TASK-004(c).                                                                                                                      | ✅        | 2026-08-07 |
| TASK-009 | `src/domain/analise/Analise.ts` — extend `oMetodo.closingLine` to her full sentence: "É um trabalho de colaboração. Juntos, vamos construir pontes entre o seu consciente e o seu inconsciente, promovendo mais equilíbrio, sentido e vitalidade para a sua vida." **This line is hers and is exempt from the humanize pass** — its `-ing` tail and its triad are her voice, not a tell. Record that exemption in the field's comment.              | ✅        | 2026-08-07 |
| TASK-010 | `src/domain/analise/Analise.ts` — reword `oMetodo.toolsLine` in her vocabulary (sonhos; imagens, fantasias e símbolos do dia a dia; padrões que se repetem e bloqueiam o desenvolvimento), keeping it one line per CONCEPT §6 band 3. Record the alternative (her three bullets, which needs a repeatable field) in the ledger's open questions.                                                                                                    | ✅        | 2026-08-07 |
| TASK-011 | `src/domain/analise/Analise.ts` — replace `pratico.comecar.body` with SRC-H, her closing invitation ("Se você sente que é o momento de iniciar essa jornada de volta para si mesmo(a), será uma alegria acompanhar o seu processo."), verbatim including `si mesmo(a)`.                                                                                                                                                                             | ✅        | 2026-08-07 |
| TASK-012 | `src/domain/orientacaoProfissional/OrientacaoProfissional.ts` — replace `abertura.body` with SRC-B, her own paragraph, corrected (`PUC - SP`→`PUC-SP`, `12`→`doze`), and split at her sentence boundaries into the two-paragraph shape the field already uses.                                                                                                                                                                                      | ✅        | 2026-08-07 |
| TASK-013 | `src/domain/orientacaoProfissional/OrientacaoProfissional.ts` — delete the file-header note that flagged "aprimoramento vs especializada" as needing her confirmation and replace it with the answer: her prose says _especializada_, the academic record says _Aprimoramento_, both are hers, both ship. Leave the psychological-tests claim flagged; her text does not address it.                                                                | ✅        | 2026-08-07 |
| TASK-014 | `src/domain/orientacaoProfissional/OrientacaoProfissional.ts` — dedupe against GUD-001: `oPercurso.deliverable` and the new `abertura.body` both end on "a profissão que faz mais sentido no momento atual da sua vida". Keep it in `abertura` (hers, front-loaded) and rewrite `deliverable` to lead with what it adds — that she leaves understanding _how_ she got there, and can therefore choose again.                                        | ✅        | 2026-08-07 |
| TASK-015 | `src/domain/sobre/Sobre.ts` — replace `quemE.body` paragraph 2 with SRC-E.1 + SRC-E.2 (her "A minha jornada na psicologia já soma 22 anos, com atuação direta na clínica desde 2014." and her objective sentence), and paragraph 3 with SRC-E.3 (the Jung origin story in full, including the TCC and the pós-graduações), corrected under CON-003. Keep the existing italic run on "um caminho sem volta".                                         | ✅        | 2026-08-07 |
| TASK-016 | `src/domain/sobre/Sobre.ts` — rewrite the six `formacao.items` to her exact course names: `Graduação em Psicologia`/PUC-SP · `Pós-graduação em Psicologia Clínica`/Instituto Numen · `Aprimoramento em Psicologia Clínica Junguiana`/PUC-SP · `Aprimoramento em Orientação Profissional e de Carreira`/PUC-SP · `Extensão em Psicologia e Religião`/PUC-SP · `Extensão em Psicologia, Religião e Fenômenos Anômalos`/USP. All `period` stay `null`. | ✅        | 2026-08-07 |
| TASK-017 | `src/domain/sobre/Sobre.ts` — rewrite the `formacao.items` comment (which states no source names the two courses) to record that her 2026-08-07 text does, and cite the ledger. Note that the two corrected rows were previously truncated (`Pós-graduação`, `Extensão em Fenômenos Anômalos`).                                                                                                                                                     | ✅        | 2026-08-07 |
| TASK-018 | Add `formacao.intro: string \| null` to `Sobre`, carrying SRC-E.4 ("Acredito que o cuidado com o outro exige estudo constante e aprofundamento rigoroso."). Wire it through `src/payload/globals/pages/sobre.ts` (`localizedTextarea`), `sobreFromPayload.ts`, the Formação section component in `src/view/sobre/`, `src/domain/markdown/twins/sobreDoc.ts`, and `seed/pages.ts`. Run `pnpm generate:types` and `pnpm db:migrate:create`.           | ✅        | 2026-08-07 |
| TASK-019 | `src/domain/internacional/Internacional.ts` — open `abertura.body` with SRC-G.1 (her "Para garantir que a distância não seja um obstáculo para o seu processo de autoconhecimento, os meus atendimentos acontecem no formato online.", corrected to `on-line`), then keep the existing reach and history sentences.                                                                                                                                 | ✅        | 2026-08-07 |
| TASK-020 | Confirm SRC-A (the positioning sentence) is byte-identical at `CLINICA_DEFAULTS.positioning`, and SRC-C/SRC-D are byte-identical in `METODO_INTRO` after TASK-006. Record the confirmation in the ledger.                                                                                                                                                                                                                                           | ✅        | 2026-08-07 |
| TASK-021 | Add `src/domain/sourceCopy.test.ts` (colocated per the vitest glob, node env): assert each of her verbatim blocks appears exactly as the ledger's corrected form inside the relevant `*_DEFAULTS`, by flattening the rich text to plain strings. This is REQ-007's guard against a future agent rewording her.                                                                                                                                      | ✅        | 2026-08-07 |
| TASK-022 | Run `pnpm test`, `pnpm typecheck`, `pnpm lint`. Fix the mapper/twin tests whose expectations moved (`analiseFromPayload.test.ts`, `sobreFromPayload.test.ts`, `orientacaoProfissionalFromPayload.test.ts`, `twinDocs.test.ts`).                                                                                                                                                                                                                     | ✅        | 2026-08-07 |

**Completion criteria**: every `SRC-*` row in the placement table reads `already verbatim` or `placed`; `pnpm test && pnpm typecheck && pnpm lint` pass; `sourceCopy.test.ts` fails if any of her blocks is edited.

### Implementation Phase 3

- GOAL-003: Run `writing:humanize` over the drafted Portuguese copy only, under the CON-004 suspensions and the CON-005 protected list.

| Task     | Description                                                                                                                                                                                                                                                                                                                                                  | Completed | Date       |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- | ---------- |
| TASK-023 | Assemble the humanize input: extract every drafted string from the eight `*_DEFAULTS` plus `CLINICA_DEFAULTS` into a working file under the scratchpad, one block per field path. Each defaults file's header comment already states which copy is hers — use it. Exclude everything hers, every CON-005 line, and every `[A DEFINIR]` row.                  | ✅        | 2026-08-07 |
| TASK-024 | Invoke `writing:humanize` in **file mode** on that working file, with a preamble stating: the voice sample is her supplied text (so §14 and §19 are suspended per CON-004); the register is pt-BR editorial prose, warm and unhurried; facts are fixed by CONCEPT and may not be added, dropped, or made more specific.                                      | ✅        | 2026-08-07 |
| TASK-025 | Review the result field by field before applying. Expected real hits: `orientacaoProfissional.nemCoaching.anchor` (§32 aphorism formula + §9 negative parallelism), `inicio.instagram.intro` (§32), `analise.oQueTrazem.note` (§3 participle tail), `perguntas.fecho.body` (§31 manufactured punchline). Reject any change that flattens a CONCEPT thesis.   | ✅        | 2026-08-07 |
| TASK-026 | Apply the accepted rewrites back into the `*_DEFAULTS` files. Do not touch a field the working file did not contain.                                                                                                                                                                                                                                         | ✅        | 2026-08-07 |
| TASK-027 | Run the GUD-001 repetition audit: for each of the eight pages, count occurrences of the seven budgeted terms across that page's rendered defaults (page global + the `Clinica` facts the page composes: credential line, who-line, fee row, colophon). Any term at 4+ is a defect; fix by deleting the weakest occurrence, never by finding a synonym (§11). | ✅        | 2026-08-07 |
| TASK-028 | Re-run `pnpm test`, `pnpm typecheck`, `pnpm lint`, then `pnpm dev` and read all eight pages end to end at 390px and at desktop width. Read them aloud; the site's whole voice claim is that it does not sound generated.                                                                                                                                     | ✅        | 2026-08-07 |

**Completion criteria**: no budgeted term exceeds 3 occurrences on any page; the diff contains zero changes to hers-verbatim or CON-005 fields; em dashes and curly quotes are unchanged in count; tests pass.

### Implementation Phase 4

- GOAL-004: Bring the Portuguese metadata, structured data and Markdown twins back into agreement with the settled copy.

| Task     | Description                                                                                                                                                                                                                                                                       | Completed | Date       |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-029 | `messages/pt.json` — re-read all eight `meta.*.description` values against the changed page copy. `meta.orientacaoProfissional.description` says "aprimoramento pela PUC-SP"; align it with her prose word or leave it deliberately, and record which in the ledger.              | ✅        | 2026-08-07 |
| TASK-030 | `messages/pt.json` — check `seo.services.*.description` and `seo.knowsAbout` still describe what the pages now say. These strings feed the JSON-LD via `src/view/seo/jsonLd.tsx` and are read by assistants, so they must not drift from the prose.                               | ✅        | 2026-08-07 |
| TASK-031 | Verify the Markdown twins. They derive from the domain content, so they follow automatically — confirm by `pnpm test` (`twinDocs.test.ts`) and by fetching `/llms/analise.md`, `/llms/sobre.md`, `/llms/orientacao-profissional.md` and `/llms.txt` against a running dev server. | ✅        | 2026-08-07 |
| TASK-032 | Confirm `CredentialLine` and the who-line still read correctly beside the new prose on `/sobre` and `/orientacao-profissional` — the who-line names who is speaking, and a page whose opening paragraph now says "Sou especializada…" must not repeat the same fact under its h1. | ✅        | 2026-08-07 |

**Completion criteria**: `pnpm test` green; the four twin URLs render the new copy; no meta description contradicts its page.

### Implementation Phase 5

- GOAL-005: Ship English page copy for all eight pages, translated from the settled Portuguese. **Gated on Phases 1–4 being complete** (REQ-005).

| Task     | Description                                                                                                                                                                                                                                                                                                                       | Completed | Date       |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-033 | Re-read `INTERNACIONAL_EN` in `src/payload/seed/pages.ts` and re-translate it against the Phase 2 changes to `INTERNACIONAL_DEFAULTS` (TASK-019 changed its opening).                                                                                                                                                             | ✅        | 2026-08-07 |
| TASK-034 | Add `INICIO_EN`, `ANALISE_EN`, `ORIENTACAO_PROFISSIONAL_EN`, `SOBRE_EN`, `PRIMEIRA_CONVERSA_EN` and `PERGUNTAS_EN` to `src/payload/seed/pages.ts`, following `INTERNACIONAL_EN`'s shape exactly (PAT-002). Seed each at `locale: "en"` with `withId`/`rowIds` so repeatable rows keep their Portuguese row ids.                   | ✅        | 2026-08-07 |
| TASK-035 | Translate under CON-002: _clinical psychologist working in the Jungian tradition_, never _Jungian analyst_. Her verbatim paragraphs are translated, not paraphrased — an English reader should meet the same person. Keep `individuação` → _individuation_ described, never promised (CON-006).                                   | ✅        | 2026-08-07 |
| TASK-036 | Leave `internacional.inEnglish` untranslated and unlocalized — it is written in English once and read on the Portuguese page. Confirm `inEnglishSectionFor` still suppresses it on `/en` (its test already covers this; extend if the assertion is missing).                                                                      | ✅        | 2026-08-07 |
| TASK-037 | Translate the FAQ. `FAQ_DEFAULTS` is a flat Portuguese array with no locale dimension: add `FAQ_EN` in `src/payload/seed/faq.ts` seeded at `locale: "en"`, matched to the Portuguese rows by index. `[A DEFINIR]` rows are translated as placeholders, kept unmistakable, and keep the same mark (CON-008).                       | ✅        | 2026-08-07 |
| TASK-038 | Translate the `Clinica` strings an English reader meets: `notes.analysis`/`careerGuidance`/`unsure`/`international` (the bilhete openers — `notes.english` is already English and stays), `fees.internationalNote`, and `credentials`. These are localized fields on the `clinica` global; seed the `en` locale alongside the pt. | ✅        | 2026-08-07 |
| TASK-039 | Re-read `messages/en.json` `meta.*` and `seo.*` against the new English page copy and re-sync. Confirm the eight keys that are legitimately identical to `pt.json` (the language-toggle labels, `chrome.colophon.rights`, `Brasília`, `in English`, `signAria`) are still the only ones.                                          | ✅        | 2026-08-07 |
| TASK-040 | Read every `/en/*` route in a browser. Confirm no page falls back to Portuguese, hreflang pairs resolve, and the PT·EN toggle round-trips on all eight pages. Confirm `/llms/en/*.md` twins render English.                                                                                                                       |           |            |

**Completion criteria**: no `/en` page renders a Portuguese sentence; `pnpm test && pnpm typecheck && pnpm lint` pass; the toggle round-trips on all eight pages.

### Implementation Phase 6

- GOAL-006: Get the improved defaults into production without overwriting anything Luiza has edited, and hand her a reviewable sign-off pack.

| Task     | Description                                                                                                                                                                                                                                                                                                                                                                     | Completed | Date |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-041 | Write `scripts/sync-copy.mts` (pattern: `scripts/export-content.mts`, preloading `./scripts/no-schema-push.cjs`). For each page global it compares the stored value against the **pre-change** default. Equal → write the new default. Different → leave it and report it. Default: `--dry-run`; writing requires `--apply`. This is REQ-008 enforced by the tool, not by care. |           |      |
| TASK-042 | Give the script a `--locale=en` mode that writes the English locale unconditionally, since no English value has ever been authored and there is nothing to protect.                                                                                                                                                                                                             |           |      |
| TASK-043 | Run the script `--dry-run` against production and turn its "left alone" report into the **change list**: every field where her stored edit differs from the improved default, shown as her version beside the new one, for her to accept in `/admin` or keep.                                                                                                                   |           |      |
| TASK-044 | Assemble the sign-off pack for her: `docs/source-copy-2026-08-07.md` (placement + corrections + open questions), the change list from TASK-043, and a Vercel preview URL. Ask specifically about TASK-004's three open questions and about each CON-003 correction row.                                                                                                         |           |      |
| TASK-045 | After her sign-off: run `--apply` (pt), then `--locale=en --apply`, and spot-check the eight pages plus the eight `/en` pages in production. Confirm no `[A DEFINIR]` string is live: `grep` the rendered `/perguntas` and `/perguntas.md`.                                                                                                                                     |           |      |

**Completion criteria**: production renders the improved defaults for every field she had not edited; her edited fields are untouched and listed for her; no placeholder mark is publicly visible.

## 3. Alternatives

- **ALT-001**: _Edit the copy directly in the production CMS and leave the code defaults stale._ Rejected — the defaults are also the seed and the fallback, so a fresh database or a Payload outage would resurrect the old text, and the Markdown twins that LLMs read are generated from the domain layer.
- **ALT-002**: _Take her text as a strict transcript and ship it uncorrected._ Rejected on the owner's explicit instruction. The compromise is CON-003's four mechanical classes plus a logged, vetoable diff, rather than an open editing licence.
- **ALT-003**: _Rewrite her paragraphs to fit the site's existing cadence._ Rejected — CONCEPT §11 makes her supplied text the source copy. Where her voice and our draft collide, the draft loses.
- **ALT-004**: _Extend `PRIVACIDADE_DEFAULTS`'s `Record<Locale, …>` shape to all eight pages._ Rejected — the domain layer holds one shape per concept, not one per locale, and the codebase already documents `/privacidade` as the deliberate exception (an English reader falling back to Portuguese legal prose is a defect; falling back on a prose page is a rough edge).
- **ALT-005**: _Translate to English in parallel with the Portuguese work._ Rejected by REQ-005 — every Portuguese change would force a re-translation, and the English would be reviewed against text that had already moved.
- **ALT-006**: _Re-run `pnpm seed` against production._ Rejected — it overwrites every field including hers. TASK-041's compare-then-write is the safe form of the same idea.

## 4. Dependencies

- **DEP-001**: `writing:humanize` skill (`/home/jvogler/.claude/plugins/cache/jv-vogler/writing/1.0.0/skills/humanize/SKILL.md`), invoked in file mode with the CON-004 suspensions stated in the prompt.
- **DEP-002**: Her sign-off on the CON-003 corrections and on TASK-004's three open questions. Phase 6 cannot complete without it; Phases 1–5 can.
- **DEP-003**: Production Neon + Vercel credentials on **her** account for TASK-043/045. `neonctl` on this machine cannot see the production database.
- **DEP-004**: `pnpm generate:types` and a Payload migration for TASK-018's new `formacao.intro` field. Local dev DB is dev-pushed, so `migrate:create` (which is DB-state independent) is the safe generator.
- **DEP-005**: Unchanged and out of scope: her CRP in writing, the fee decision, the portrait, the bilhete openers in her voice, the Jung passage pool. Fields for all of these already exist and stay empty.

## 5. Files

**Her supplied text → destination (the Phase 1 placement map, in full):**

| ID      | Her text                                                              | Destination                                      | Status                        |
| ------- | --------------------------------------------------------------------- | ------------------------------------------------ | ----------------------------- |
| SRC-A   | "Clínica de psicologia analítica (Jung) on-line…"                     | `CLINICA_DEFAULTS.positioning`                   | already verbatim — verify     |
| SRC-B   | "Sou especializada em orientação profissional…"                       | `ORIENTACAO_PROFISSIONAL_DEFAULTS.abertura.body` | replaces draft (TASK-012)     |
| SRC-C   | "Não removo sintomas…" + "Como fazemos isso?…"                        | `Analise.METODO_INTRO` ¶2–3                      | verbatim — correct (TASK-006) |
| SRC-D   | "Gosto de dizer…" + "Eu só farei pontuações…"                         | `Analise.METODO_INTRO` ¶4–5                      | verbatim — correct (TASK-006) |
| SRC-E.1 | "A minha jornada na psicologia já soma 22 anos…"                      | `SOBRE_DEFAULTS.quemE.body` ¶2                   | replaces draft (TASK-015)     |
| SRC-E.2 | "Meu objetivo é oferecer um espaço seguro…"                           | `SOBRE_DEFAULTS.quemE.body` ¶2                   | new (TASK-015)                |
| SRC-E.3 | "A minha abordagem teórica… caminho sem volta… TCC… pós-graduações"   | `SOBRE_DEFAULTS.quemE.body` ¶3                   | replaces draft (TASK-015)     |
| SRC-E.4 | "Acredito que o cuidado com o outro exige estudo constante…"          | `SOBRE_DEFAULTS.formacao.intro` — **new field**  | new field (TASK-018)          |
| SRC-E.5 | The six-line academic record                                          | `SOBRE_DEFAULTS.formacao.items`                  | corrects 2 rows (TASK-016)    |
| SRC-F.1 | "Diferente de abordagens que focam apenas em calar um sintoma…"       | `ANALISE_DEFAULTS.abertura.body` ¶2              | replaces draft (TASK-007)     |
| SRC-F.2 | "Nesta abordagem, olhamos para o ser humano de forma integral…"       | `ANALISE_DEFAULTS.oMetodo.individuacao`          | replaces draft (TASK-008)     |
| SRC-F.3 | "Na prática, as sessões são um espaço de diálogo livre…" + 3 bullets  | `ANALISE_DEFAULTS.oMetodo.toolsLine`             | condensed (TASK-010)          |
| SRC-F.4 | "É um trabalho de colaboração. Juntos, vamos construir pontes…"       | `ANALISE_DEFAULTS.oMetodo.closingLine`           | extends (TASK-009)            |
| SRC-G.1 | "Para garantir que a distância não seja um obstáculo…"                | `INTERNACIONAL_DEFAULTS.abertura.body` ¶1        | new (TASK-019)                |
| SRC-G.2 | "Idiomas: Português e Inglês" · "Alcance: todo o Brasil e o exterior" | `pratico.items` on every page                    | already present — verify      |
| SRC-H   | "Se você sente que é o momento de iniciar essa jornada…"              | `ANALISE_DEFAULTS.pratico.comecar.body`          | replaces draft (TASK-011)     |

**Files changed:**

- **FILE-001**: `docs/source-copy-2026-08-07.md` — new. The ledger: her original text, the placement map, the correction log, the open questions.
- **FILE-002**: `src/domain/analise/Analise.ts` — `METODO_INTRO` corrections, `abertura.body`, `oMetodo.individuacao`, `oMetodo.toolsLine`, `oMetodo.closingLine`, `pratico.comecar.body`, and the header comment rewrite.
- **FILE-003**: `src/domain/sobre/Sobre.ts` — `quemE.body`, `formacao.items`, the new `formacao.intro`, and two comment rewrites.
- **FILE-004**: `src/domain/orientacaoProfissional/OrientacaoProfissional.ts` — `abertura.body`, `oPercurso.deliverable`, and the header comment rewrite.
- **FILE-005**: `src/domain/internacional/Internacional.ts` — `abertura.body`.
- **FILE-006**: `src/domain/inicio/Inicio.ts`, `src/domain/primeiraConversa/PrimeiraConversa.ts`, `src/domain/perguntas/Perguntas.ts`, `src/domain/privacidade/Privacidade.ts` — Phase 3 humanize edits to drafted fields only.
- **FILE-007**: `src/domain/clinica/Clinica.ts` — Phase 3 humanize edits to `fees.internationalNote` and the bilhete openers; `positioning` is protected (CON-005).
- **FILE-008**: `src/payload/globals/pages/sobre.ts` — the new `formacao.intro` field.
- **FILE-009**: `src/domain/sobre/sobreFromPayload.ts`, `src/view/sobre/` (Formação section), `src/domain/markdown/twins/sobreDoc.ts` — wire `formacao.intro` through.
- **FILE-010**: `src/payload/seed/pages.ts` — the six new `<PAGE>_EN` constants, the `INTERNACIONAL_EN` refresh, and the `formacao.intro` seed.
- **FILE-011**: `src/payload/seed/faq.ts` + `src/domain/faq/FaqEntry.ts` — `FAQ_EN`.
- **FILE-012**: `src/payload/seed/clinica.ts` — the English locale for the localized `Clinica` strings.
- **FILE-013**: `messages/pt.json`, `messages/en.json` — `meta.*` and `seo.*` re-sync.
- **FILE-014**: `src/domain/sourceCopy.test.ts` — new, REQ-007's guard.
- **FILE-015**: `src/migrations/*` — one generated migration for `formacao.intro`.
- **FILE-016**: `scripts/sync-copy.mts` — new, the compare-then-write production delivery tool.
- **FILE-017**: `src/payload-types.ts` — regenerated (never hand-edited).

## 6. Testing

- **TEST-001**: `pnpm test` — the existing vitest domain suite. Mapper and twin tests assert default values and **will** fail on the Phase 2 changes; each failure is fixed by updating the expectation to the new copy, never by reverting the copy.
- **TEST-002**: `src/domain/sourceCopy.test.ts` (new) — each of her verbatim blocks appears in the defaults exactly as the ledger records it, after flattening rich text to plain strings. Guards REQ-002 and REQ-007.
- **TEST-003**: Extend the CON-001 guard beyond the twins: assert that no string in any `*_DEFAULTS` or in `messages/*.json` matches `/guarulhos|presencial|consult[óo]ri|in-person/i`.
- **TEST-004**: A repetition test for GUD-001 — flatten each page's defaults and assert every budgeted term appears at most 3 times. Mechanises the audit so it cannot silently regress.
- **TEST-005**: `pnpm typecheck` and `pnpm lint` (oxlint is already capped at `--threads=2`).
- **TEST-006**: Manual read of all eight pages plus all eight `/en` pages at 390px and desktop, on a running `pnpm dev`.
- **TEST-007**: Twin fetch — `/llms.txt`, `/llms/analise.md`, `/llms/sobre.md`, `/llms/orientacao-profissional.md` and their `/en` counterparts render the new copy.
- **TEST-008**: `scripts/sync-copy.mts --dry-run` against production reports zero unintended writes before `--apply` is ever run.

## 7. Risks & Assumptions

- **RISK-001**: _An executing agent applies `writing:humanize` §14 and strips every em dash from the codebase._ There are 43 in `Cosmos.ts` alone and the manuscript typography depends on them. Mitigated by CON-004, by the skill's own Voice Calibration precedence rule, and by TASK-028's em dash count check.
- **RISK-002**: _The grammar licence widens in practice._ Three code comments currently say her text is never touched; once one edit is allowed, "while I'm here" is the failure mode. Mitigated by CON-003's closed list, by the per-edit log, and by TEST-002 pinning the result.
- **RISK-003**: _Her wording contradicts a fact the site states elsewhere._ Already visible once — `especializada` (her prose) vs `Aprimoramento` (her record). Resolved by treating both as hers and documenting it, not by picking one. Any further contradiction goes to the ledger's open questions rather than being resolved silently.
- **RISK-004**: _The English is a translation of a translation._ Her voice is Portuguese; English readers get a translated version of her verbatim paragraphs, which is a real loss of register. Accepted — CONCEPT §13.9 already reserves her polish pass over the English for later. TASK-044 flags the English as explicitly provisional.
- **RISK-005**: _Production delivery clobbers her edits._ Mitigated by TASK-041's compare-then-write, its dry-run default, and the change list. If in doubt, the field is left alone and reported.
- **RISK-006**: _TASK-018 adds a field and therefore a migration._ Local dev is dev-pushed, so `payload migrate` fails on drift; use `migrate:create` and let `vercel-build` run it on deploy.
- **ASSUMPTION-001**: The pasted text is hers and is what she wants on the site. It is treated as source copy under CONCEPT §11, not as a brief.
- **ASSUMPTION-002**: "22 anos" is correct as of 2026 and is written as a duration, not a date. If she prefers a stable form, "na psicologia desde 2004" is offered in the ledger's open questions.
- **ASSUMPTION-003**: The `/en` routes already resolve for all eight pages (they are generated from `SITE_PAGES`), so Phase 5 adds copy only, not routing.
- **ASSUMPTION-004**: Nobody has authored English CMS values in production, which is what makes TASK-042's unconditional write safe. TASK-043's dry run verifies it before `--apply`.

## 8. Related Specifications / Further Reading

- `CONCEPT.md` §2 (the positioning sentence, symbols index content), §4 (the two doors), §6 (the page map and each page's bands), §11 (authorship, placeholders, professional standards), §13 (what we need from Luiza)
- `PRODUCT.md` — ranked audiences, positioning, the evidence on hand behind the academic record
- `DESIGN.md` — the two-voice typography, the plate grammar, the manuscript punctuation this plan's CON-004 protects
- `plan/architecture-site-restructure-1.md` — TASK-052, the owner review this plan is the copy half of
- `plan/feature-page-analise-1.md`, `plan/feature-page-sobre-1.md`, `plan/feature-page-orientacao-profissional-1.md` — each page's "copy needing her sign-off" section, which this plan closes out
- `docs/content-export-2026-08.md` — the pre-teardown content export her earlier verbatim copy was rescued from
- `writing:humanize` skill — Wikipedia's _Signs of AI writing_, and its Voice Calibration precedence rule
