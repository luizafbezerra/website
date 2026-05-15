# Project guide for AI agents

This project was scaffolded from the `next-payload-template`. Skills live at `.agents/skills/` (real dir) with `.claude/skills/` symlinks. Architecture rules:

- `src/core/` — pure TypeScript. No React/Next imports. No imports from `app/` or `ui/`.
- `src/lib/` — shared helpers. May import React. No imports from `app/` or `ui/`.
- `src/ui/` — React components. Consumes `core` via `lib`.
- `src/app/` — Next.js routes + server actions. Composes everything.

CI enforces these via `scripts/arch-check.sh`.

For Payload admin: `pnpm payload` to create the first user. For Neon dev branch: `pnpm db:branch`.

## Design Context

### The practitioner

**Luiza Fernandes Bezerra** — clinical psychologist, **Guarulhos / São Paulo, Brazil**. Jungian / analytical psychology tradition. Site language: **pt-BR**.

Three pillars: **Ansiedade & humor** · **Relações & vida** · **Carreira & propósito**. Audience spans young adults → elderly.

Contact: WhatsApp `+55 11 96415-8128` (primary CTA), email `luizafbezerra@gmail.com`. Real client testimonials exist and belong on the new site.

### Users

Adults (Brazilian, Portuguese-speaking) considering psychotherapy with Luiza. They arrive in private moments, often anxious, often deciding whether to trust a person with their inner life — not browsing for a service.

Primary jobs: (1) decide whether to book a first session, (2) read the blog for ongoing companionship/ideas, (3) book or reschedule (existing clients, lower priority).

### Brand Personality

**Warm · Human · Approachable** — interpreted through Jungian/depth-psychology craft, NOT wellness-startup pastel cheer.
- Warm = earth pigments and parchment, not white-and-mint.
- Human = hand-textured, painterly, slightly imperfect — opposite of vector-flat.
- Approachable = contemplative, not clinical. The site invites; it does not sell.

Emotional goals: confidence, calm, curiosity. A reading room, not a clinic.

### Aesthetic Direction

**The page as an illuminated manuscript.** References (`/references/01.jpg` through `05.jpg`, `/references/logo.jpg`, and [@simbolos.do.self](https://www.instagram.com/simbolos.do.self/)) sit in the tradition of Jung's *Red Book* (Liber Novus): hand-painted mandalas, alchemical illustration, archetypal symbols.

- **Painterly, not generated.** Real painted assets carry the aesthetic. No parametric SVG mandalas, no AI flourishes.
- **Symbols are content, not decoration** — they appear because they carry meaning at that point.
- **Earth pigments only**, drawn from the references: terracotta, cobalt, ochre, moss, gilt, on warm parchment.
- **Editorial pacing.** Generous margins, single warm column of body text, drop caps, marginalia.
- **Slow first impression.** Type-first hero. No stock photo, no urgency banner. Trust earned over the page.

**Theme**: Light, warm parchment cream — never stark white, never dark with glowing accents.

**Typography starting points** (refine in `/impeccable craft`):
- Display: `Cardo` (Bembo-derived, scholarly, exquisite italic).
- Body: `Vollkorn` or `EB Garamond` / `Source Serif 4`. Warm humanist serif that holds at small sizes.
- BANNED for this project: Inter, Fraunces, Cormorant family, Playfair, Newsreader, Crimson family, IBM Plex family, Space Grotesk, Outfit, DM Sans/Serif, Plus Jakarta, Instrument family — and any monospace used as "technical" shorthand.
- Italics carry voice (the way printed books use them). All choices must support Portuguese diacritics.

**Indicative palette** (OKLCH, light theme):
- Background (parchment): `oklch(0.97 0.012 75)`
- Surface: `oklch(0.94 0.018 75)`
- Ink (foreground): `oklch(0.22 0.02 35)` — never `#000`
- Muted: `oklch(0.50 0.02 60)`
- Terracotta (primary accent): `oklch(0.55 0.16 35)`
- Cobalt (secondary): `oklch(0.40 0.14 250)`
- Moss (tertiary, rare): `oklch(0.45 0.10 145)`
- Gilt (rare highlight): `oklch(0.75 0.13 80)`
- Border: `oklch(0.85 0.015 75)`

60-30-10 weight rule. Accents are rare; rarity is what makes them work.

### Anti-references (do NOT look like)

- **Her current Google Sites page** at `sites.google.com/view/psicologa-luiza` — the floor we are rising from. Templated chrome, generic sans, stock landscape photos, no headshot, no painterly identity, Google Sites attribution in the footer. She herself calls it "too simple and amateur." The new site must read as **made by a designer**.
- BetterHelp / Talkspace clinical telehealth — sky blue + white + sticky CTA.
- Wellness-startup pastel (Calm / Headspace / Mindbloom).
- Stock photography of therapy clichés (hands, cliffs, journals).
- Generic "modern" tech aesthetic — Inter sans-serif, dark mode with neon, gradient buttons, glassmorphism.
- Auto-generated mandalas — parametric SVG, "sacred geometry" generators.
- Greens-and-whites "natural therapy" palette.
- Cards-everywhere SaaS layout.
- Border-left accent stripes, gradient text, side-stripe callouts (banned by impeccable's absolute rules).

### Discoverability — SEO + AEO (first-class, not polish)

Goal: world-class SEO **and** AEO (Agentic Engine Optimization). The site must be findable on Google for Brazilian Portuguese psychology / Jungian queries **and** consumable by AI agents (ChatGPT, Claude, Perplexity, Gemini, coding agents). Both audiences are first-class.

Hard requirements every page must meet:

1. **SSG/SSR + semantic HTML.** No client-only routes for content. Strict heading hierarchy (one `h1`, no skipping). Real landmarks. Slugged pt-BR URLs. `lang="pt-BR"` on `<html>`.
2. **JSON-LD on every page.** `Person` (Luiza) + `LocalBusiness`/`MedicalBusiness` (practice in Guarulhos with NAP) + `Article`/`BlogPosting` for posts + `FAQPage` for Q&A + `Review`/`AggregateRating` for testimonials + `BreadcrumbList`. Extend the existing `src/ui/lib/jsonLd.tsx` helper; don't bypass it.
3. **Meta + social** derived from the Payload `Settings` global, with per-page override. One painted-asset OG-image template (1200×630), not the generic gradient.
4. **`/llms.txt` at site root** — flat Markdown index of public content with one-line descriptions and token counts. Generate from Payload at build time.
5. **`AGENTS.md` in repo root** — point at this CLAUDE.md (symlink or duplicate). Currently CLAUDE.md fills this role; ensure agents find it.
6. **Markdown source for every blog post** at `/blog/<slug>.md` — clean, no nav/footer chrome. Implemented as a route handler that serializes Payload Lexical to Markdown.
7. **"Copiar para IA" button** on blog posts — copies the clean Markdown to clipboard. Aesthetic must respect the manuscript brief (no generic icon button).
8. **Token count metadata** — server-side estimate (chars/4) as `<meta name="ai:token-count">` and in `llms.txt`. Aim < 20K tokens per post; split if longer.
9. **Front-load the page.** First ~500 tokens answer who Luiza is, what she does, how to reach her. Agents have limited patience.
10. **Performance.** LCP < 2.5s on 4G. Self-host fonts via `next/font/google` with `display: swap` + pt-BR subset. `next/image` (AVIF/WebP) for painted references. No render-blocking third-party scripts.
11. **`robots.txt` does not block AI agent user-agents.** Audit `src/app/(frontend)/robots.ts`.

The two audiences (humans + agents) reinforce each other: if a design choice satisfies one but breaks the other, it is the wrong choice.

### Design Principles

1. **The page is an illuminated manuscript.** Editorial pacing, generous margins, single column, drop caps, marginalia, painted symbols at section breaks.
2. **Painterly, not generated.** Texture and irregularity are features. Programmatic ornament is not.
3. **Symbols carry meaning** — never decoration.
4. **Earth pigments, used rarely.** Terracotta, cobalt, ochre, moss, gilt. No neon, no pastel, no gradient.
5. **Trust, not urgency.** No sticky CTAs, no countdown timers. The visitor books because the page gave them a calm, clear sense of the practitioner.
6. **Designed for two audiences at once.** Beautiful and scannable for humans; structured, semantic, token-efficient for AI agents.

Full version with rationale, palette specifics, and implementation requirements: `/.impeccable.md`.
