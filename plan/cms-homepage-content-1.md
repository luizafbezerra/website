# Design: CMS-driven homepage content, section ordering, and pt-BR admin

**Date:** 2026-06-07
**Branch (suggested):** `feat/cms-homepage-content`
**Status:** approved design → implementation plan pending

## Goal

Move the homepage's editorial content and structure into Payload so Luiza can
edit copy, reorder/toggle sections, manage testimonials, and update her CRP
without a deploy — and run the admin in Portuguese. Extends the identity
migration already merged (PR #1), reusing its patterns: a pure-TS domain type +
`fromPayload` mapper + `DEFAULTS` fallback + a cached server action per concern.

The site must render identically to today when Payload is off (defaults carry
the current copy), and degrade gracefully field-by-field.

## Scope

In scope:

1. **Admin in pt-BR** — Payload UI language + pt labels on every custom field.
2. **CRP and content live in the CMS** — already a field (`identity.credential`);
   this work moves the remaining homepage content out of code.
3. **Pillars, testimonials, navigation → CMS**, plus **section reordering** and
   per-section enable/disable.
4. **Cosmos enable/disable** (default on) — modeled as a section toggle.
5. **Long-form section copy** editable (hero subtitle/lead, section
   eyebrows/headings, pillars intro, about bio, contact body, etc.).

Out of scope (content tasks, not blocked by this work): writing the real CRP
value, rewriting Luiza's bio, collecting real testimonials. Re-enabling SEO
indexing stays deferred (separate decision). The painted brand assets stay code
assets (only the hero portrait becomes CMS-managed).

## Decisions (locked during brainstorming)

- **Section model:** ordered toggle list on a `Home` global. Header/Hero pinned
  top, Footer pinned bottom; the body sections (pillars, about, cosmos, voices,
  writing, contact) are drag-reorderable + individually toggleable.
- **Testimonials:** a `testimonials` collection with draft/publish + a consent flag.
- **Navigation:** auto-derived from enabled, anchored sections (in section
  order) + an editable list of off-page links.
- **Content depth:** long-form copy is editable.
- **Hero portrait:** CMS upload, falling back to the current `/portrait/luiza.jpg`.
- **Body fields:** Payload `richText` (Lexical), rendered with the blog's
  existing Lexical renderer (preserves inline italic emphasis).

## CMS data model

### `Settings` global (existing — additions only)

- Add pt `label` to every field/group.
- Under the `chrome` group, add `navExtraLinks`: array of `{ label: text, href: text }`.
  Default `[{ label: "Escrita", href: "/blog" }]`. These append after the
  auto-derived in-page anchors.

### `Home` global (new — `slug: "home"`)

- `access`: `read: () => true`, `update: admin` (mirrors Settings).
- `hooks.afterChange`: `revalidatePath("/", "layout")`, guarded by
  `context.skipRevalidate` (same guard as Settings, so seeding is safe).
- Fields (collapsible groups; all copy fields default to the current hardcoded strings):
  - **`sections`** — array, labeled "Seções da página", drag-reorderable. Row:
    - `type`: select — `pillars · about · cosmos · voices · writing · contact` (pt labels).
    - `enabled`: checkbox, default `true`.
    - Default rows = current order: pillars, about, cosmos, voices, writing, contact.
    - The **cosmos toggle** is the cosmos row's `enabled`.

  - **`hero`** group — `subtitle` (text, "Para a vida adulta"), `lead` (richText,
    the dropcap paragraph), `ctaPrimaryLabel` (text, "marcar uma conversa"),
    `ctaSecondaryLabel` (text, "conhecer a abordagem antes"), `portrait` (upload →
    media; renders `/portrait/luiza.jpg` when empty). Eyebrow + figcaption stay
    templated from identity/city in code.

  - **`pillars`** group — `eyebrow` (text, "Como trabalho"), `heading`
    (`accentHeadingField`, terracotta: lead "O que se repete costuma ter algo " ·
    accent "a dizer" · trail "."), `intro` (richText, the two body paragraphs),
    `note` (textarea, "Três frentes que costumam…"), `items` (array
    `{ numeral, title, paragraph }`, defaults = current 3 pillars), `asideNote`
    (textarea, the squared-mandala marginalia).

  - **`about`** group — `eyebrow` (text, "Sobre Luiza"), `heading`
    (`accentHeadingField`, cobalt: "Uma escuta cuidadosa, na tradição " ·
    "junguiana" · "."), `bio` (richText, the 3 bio paragraphs), `formacao` (text,
    "Psicologia clínica"), `idiomas` (text, "Português"), `asideNote` (textarea,
    the Quaternidade marginalia). `Registro` = `identity.credential`; `Atendimento`
    stays templated.

  - **`voices`** group — `eyebrow` (text, "Em primeira pessoa"), `heading`
    (text, "Pacientes contam").

  - **`cosmos`** group — `eyebrow` (text), `intro` (textarea). Exact current
    strings to be lifted from `Cosmos.tsx` during implementation.

  - **`writing`** group — `eyebrow` (text, "Escrita"), `heading`
    (`accentHeadingField`, terracotta: "Algumas " · "anotações" · " do consultório."),
    `intro` (textarea, the standfirst paragraph).

  - **`contact`** group — `eyebrow` (text, "Para começar"), `heading`
    (`accentHeadingField`, terracotta: "Uma conversa breve costuma ser " ·
    "o suficiente" · " para vermos se faz sentido."), `body` (richText, the
    WhatsApp paragraph), `whatsappLabel` (text, "Conversar pelo WhatsApp"),
    `faqLinkLabel` (text, "Perguntas frequentes antes da primeira conversa").

### `Testimonials` collection (new — `slug: "testimonials"`)

- `admin.useAsTitle: "attribution"`, `defaultColumns: ["attribution", "_status"]`.
- `versions: { drafts: true }`.
- `access`: `read` = published OR admin; `create/update/delete` = admin.
- Fields:
  - `body`: textarea, required.
  - `attribution`: text, required (initials only — admin description notes consent norms).
  - `consentGiven`: checkbox, with an admin description ("Só publique com consentimento explícito; use iniciais").
  - `order`: number, for deterministic display order (sort ascending, then `createdAt`).
- `getTestimonials()` returns published testimonials, ordered, mapped to
  `{ body, attribution }`. Powers both `Voices` and the `Review` JSON-LD.

## Rendering

- **`core/sections.ts`** (pure): a `SECTION_REGISTRY` of metadata keyed by type:
  `{ anchorId?: string, navLabel?: string }`. No React here.
  - pillars → `{ anchorId: "abordagem", navLabel: "Como trabalho" }`
  - about → `{ anchorId: "sobre", navLabel: "Sobre" }`
  - contact → `{ anchorId: "contato", navLabel: "Contato" }`
  - cosmos / voices / writing → no anchor.
- **`ui/home/sectionComponents.ts`**: maps section type → React component
  (lives in `ui` to keep `core` React-free).
- **`page.tsx`**: renders `Header` → `Hero` (pinned) → the enabled
  `home.sections` in order (each section receives its content from `home` +
  `identity` + `testimonials`/`posts` where relevant) → `Footer`. JSON-LD stays,
  sourcing testimonials from `getTestimonials()`.

## Navigation (auto-derived)

`navigationFrom(sections, extraLinks)` in `core/navigation.ts` (pure):

- For each enabled section with an `anchorId`, in section order, emit
  `{ label: navLabel, href: "/#" + anchorId }`.
- Append `extraLinks` (from `Settings.chrome.navExtraLinks`).
- `getNavigation()` composes `getHome()` + `getIdentity()`/settings and returns
  the list. `Header`, `Footer`, and `HeaderMobileNav` consume `navLinks`.

**Expected behavior change:** nav order now follows section order (currently
"Como trabalho" sits after "Sobre" in nav but before it on the page; derivation
makes nav match the page). Extra links append at the end. This is intentional —
reordering a section reorders its nav entry.

## Domain layer + actions (`core/` + `app/actions/`)

Mirrors the identity pattern, all pure TS in `core/`, all cached + fallback in actions:

- `core/home.ts` — `Home` type, `HOME_DEFAULTS` (current copy + current pillars),
  `homeFromPayload(doc)` mapper (field-by-field `?? default`).
- `core/testimonials.ts` — `Testimonial` type, `TESTIMONIALS_DEFAULTS = []`,
  `testimonialsFromPayload(docs)`.
- `core/sections.ts` — `SectionType` union + `SECTION_REGISTRY` metadata + default order.
- `core/navigation.ts` — keep `NavLink` type; replace the static list with
  `navigationFrom(...)`.
- `core/accentHeading.ts` — `accentHeadingClass({ accentStyle, accentItalic })`
  → locked Tailwind class string (terracotta/cobalt + optional italic). Pure
  (returns strings, no React). Finally consumes the `accentHeadingField` factory
  already in `src/fields/`.
- `ui/home/AccentHeading.tsx` — renders `lead` + styled `accentWord` + `trail`.
- `app/actions/home.ts` (`getHome`), `app/actions/testimonials.ts`
  (`getTestimonials`), and `getNavigation` (in `home.ts` or `navigation` action).
- `Luiza` namespace shrinks: `pillars`, `testimonials`, and `Navigation` move to
  defaults/derivation. Remaining `Luiza` identity fields already superseded by
  `IDENTITY_DEFAULTS`; keep only what's still referenced.

## Admin pt-BR

- `payload.config.ts`: add `i18n: { supportedLanguages: { pt }, fallbackLanguage: "pt" }`
  (import `pt` from `@payloadcms/translations/languages/pt`). This Portuguese-izes
  the admin chrome.
- Add pt `label` to every custom field, group, array, and collection
  (Settings, Home, Testimonials). Field-level localization of _labels_ only — the
  site itself is single-locale pt-BR, so no content localization.

## Migration + seed

- A baseline migration snapshot now exists (`src/migrations/*.json`), so
  `pnpm db:migrate:create` produces a clean **incremental** migration: new
  `home` + `home_sections` + `testimonials` (+ `_testimonials_v` versions) tables
  and the `settings` nav-links array table. All additive — applies via
  `payload migrate` with no manual reconcile (unlike PR #1).
- Run order against the dev/prod DB (env points at prod, authorized; project not
  live): `pnpm db:migrate:create` → inspect SQL is additive → `payload migrate`
  (loaded via `node --env-file=.env.local ./node_modules/payload/bin.js migrate`)
  → `pnpm seed`.
- Extend seed: `seedHome()` upserts `Home` from `HOME_DEFAULTS` (with
  `context.skipRevalidate`). Testimonials seed empty.

## Degradation model

`getHome`/`getTestimonials`/`getNavigation` return defaults when Payload is off
or a field is blank — identical to `getIdentity`. The `PAYLOAD_ENABLED=false`
build path must still render the full homepage from defaults.

## Architecture compliance

- `core/*` stays React/Next-free (types, defaults, mappers, class-string helpers).
- The type→component map lives in `ui/`; `core/sections.ts` holds only metadata.
- `scripts/arch-check.sh` must continue to pass.

## Verification

- `pnpm typecheck`, `pnpm arch:check`, lint on changed files.
- `pnpm build` with `PAYLOAD_ENABLED=false` (defaults path) **and** DB-enabled
  (reads seeded `Home`/testimonials).
- `migrate:status` shows the new migration `Ran: Yes`; seeded `Home` row verified.
- Manual: reorder/disable a section in admin → homepage + nav reflect it;
  publish a testimonial → Voices + Review JSON-LD appear; admin UI renders pt-BR.

## Phasing (each phase ships green)

1. **Admin pt-BR** — `i18n` config + pt labels on existing Settings fields.
   Independent, low risk.
2. **Testimonials** — collection + `getTestimonials` + wire `Voices` and the
   `Review` JSON-LD; migration + seed (empty).
3. **Home structure** — `Home` global with `sections`, section registry,
   order-driven `page.tsx`, cosmos toggle, nav derivation; migration + seed.
4. **Long-form copy** — move hero/pillars/about/voices/cosmos/writing/contact
   copy into `Home` groups; `AccentHeading` + `accentHeading` resolver; hero
   portrait upload.
5. **Finalize** — full migration/seed verification, defaults cleanup of `Luiza`.

## Open content TODOs (surfaced, not blockers)

- Real CRP value, bio rewrite, real testimonials, confirmed marginalia wording —
  all now editable in the admin once this lands.
