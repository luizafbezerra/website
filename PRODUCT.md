# Product

> Strategic context for the Luiza Fernandes Bezerra psychotherapy site. This is the canonical "who / what / why" document; every impeccable command reads it before doing work. Precise visual tokens (OKLCH values, type scale, components) live in `DESIGN.md`. Together these two files supersede the older `.impeccable.md`, which can be retired once it is fully redundant. CLAUDE.md / AGENTS.md carry a condensed pointer to this file for general agents.

## Register

brand

The design _is_ the product. The public site (home, blog, FAQ, symbol glossary) is a marketing / portfolio / long-form-content surface whose job is to earn trust and convert through craft. The Payload `/admin` is the only product-register surface, and it is secondary — not the design's center of gravity.

## The Practitioner

**Luiza Fernandes Bezerra** — clinical psychologist in **Guarulhos / São Paulo, Brazil**, working in the **Jungian / analytical psychology** tradition (individuation, dreams, archetypes, symbols, shadow). Site language: **Portuguese (pt-BR)**.

Three practice pillars (her own framing):

1. **Ansiedade & humor** — anxiety, depression, melancholia, paralyzing fears.
2. **Relações & vida** — grief, breakups, loneliness, emotional deprivation, conflict.
3. **Carreira & propósito** — professional dissatisfaction, work stress, vocational orientation.

The work is **individual analysis** across all life stages (young adults → elderly), with a personalised approach.

Contact channels:

- **WhatsApp `+55 11 96415-8128`** — the primary CTA. Brazilian audiences expect WhatsApp.
- **Email `luizafbezerra@gmail.com`**.

She has **real client testimonials** praising _competência_, _acolhimento_ (warmth / welcome), and _ética_. These belong on the new site (rendered as `Review` / `AggregateRating`).

## Users

Adults (Brazilian, Portuguese-speaking) considering psychotherapy with Luiza. They arrive in private moments — often after weeks of hesitation, often on a phone, often anxious, sometimes at night. **They are not browsing for a service; they are deciding whether to trust a person with their inner life.**

Three primary jobs they come to do:

1. **Decide whether to book a first session.** They want to know who Luiza is, how she works, whether her Jungian approach fits their need. The WhatsApp CTA / contact form is the conversion, but trust is built _before_ they reach it.
2. **Read the blog for ideas and companionship.** Returning visitors treat the blog as ongoing support — essays on individuation, dreams, archetypes, shadow work. The blog is a **primary surface, not SEO bait**.
3. **Book or reschedule** as existing clients (lower priority — an admin task, not the design's focus).

A second, co-equal audience: **AI agents and LLM-backed search** (ChatGPT, Claude, Perplexity, Gemini, coding agents) answering questions about Jungian therapy / symbolic dreamwork in Portuguese. See **Discoverability**.

## Product Purpose

Replace Luiza's templated Google Sites page with a site that reads as **made by a designer** and earns a stranger's trust well enough to start a WhatsApp conversation. Success = a calm, confident visitor who books a first session, _and_ a blog that returning readers come back to for companionship. The **north-star metric is WhatsApp / contact-form completions**; everything else is secondary.

The site must also be a first-class citizen of both Google search and AI-agent retrieval for Brazilian-Portuguese psychology / Jungian queries — the two audiences (humans + agents) reinforce each other.

## Brand Personality

Three words: **Warm · Human · Approachable** — interpreted through Jungian / depth-psychology craft, **not** wellness-startup pastel cheer.

- **Warm** = earth pigments and parchment surfaces, not white-and-mint. The warmth of an old book read by lamplight, not a meditation app.
- **Human** = hand-textured, painterly, slightly imperfect. The opposite of vector-flat and algorithmically generated. Humanist type; ornament that looks painted.
- **Approachable** = contemplative, never clinical. Slow pace, generous space, plain language. The site _invites_; it does not sell. No "Book Your Free Consultation Now" sticky banner.

Emotional goals: **confidence, calm, curiosity.** The visitor should feel they have arrived somewhere serious but not severe — **a reading room, not a clinic**. Anxious users on phones at night: the site must not be foreboding, but it also must not be clinical.

## Aesthetic Direction

**The page as an illuminated manuscript.** The painted references (`/references/01.jpg`, `02.jpg`, `03.jpg`, `05.jpg`, `06.jpg`, `logo.jpg`, `wheel.jpg`, plus the Instagram screenshot `print01.png`) sit firmly in the tradition of Carl Jung's _Red Book_ (Liber Novus): hand-painted mandalas, alchemical illustration, archetypal symbols, mythic landscapes. The account [@simbolos.do.self](https://www.instagram.com/simbolos.do.self/) confirms the lineage. `logo.jpg` is the practice logo (a mandala with four cardinal-archetype circles) and anchors brand identity.

Translated to a website:

- **Painterly, not generated.** Real painted assets (the client's actual artwork) carry the aesthetic. Avoid programmatically drawn mandalas, parametric SVG flourishes, AI-generated decoration (one scoped exception: the Cosmos prelude props — see **Carve-outs**).
- **Symbols are content, not decoration.** An archetypal image appears because it carries meaning _at that point_ — section breaks, post openers, hero. Never as filler.
- **Earth pigments only**, drawn from the references: terracotta / rust, deep cobalt, ochre / saffron, forest moss, gilt accent, charcoal ink — on warm parchment cream. Never neon, never pastel-startup, never sterile grey-on-grey. **60-30-10 weight rule**: ~60% parchment + ink, ~30% muted / secondary, ~10% accent. Accents are _rare_; rarity is what makes them work.
- **Editorial pacing.** Long-form essays, generous margins, a single warm column of body text, drop caps, marginalia, painted symbols at section breaks. Reading is contemplative, not transactional.
- **Slow first impression.** Type-first hero. No stock photo above the fold, no urgency banner. Conversion through trust earned over the page.

**Theme**: light, warm parchment — paper / vellum tones, never stark white, never dark-with-glowing-accents.

**Typography direction** (committed; exact scale in DESIGN.md):

- **Display / headings**: `Cardo` (Bembo-derived, scholarly, exquisite italic). Italics carry voice the way printed books use them.
- **Body**: `Vollkorn` (robust, scholarly, slightly imperfect humanist serif that holds at small sizes).
- **Banned for this project**: Inter, Fraunces, Cormorant family, Playfair, Newsreader, Crimson family, IBM Plex family, Space Grotesk, Outfit, DM Sans / Serif, Plus Jakarta, Instrument family — and any monospace used as "technical" shorthand. All choices must support full Portuguese diacritics and Latin Extended.

**Palette intent** (indicative — DESIGN.md owns the precise OKLCH tokens): parchment background, warm near-black ink (never `#000`), terracotta primary accent (rare), cobalt secondary (mandala-center moments), moss tertiary (rare, tags / marginalia), gilt highlight (used like gold leaf, never a gradient), tinted low-contrast borders.

## Anti-references

What the site must **not** look like. If a layout drifts toward any of these, stop and rewrite.

- **Her current Google Sites page** (`sites.google.com/view/psicologa-luiza`) — the floor we are rising from. Templated chrome, generic sans, stock landscape photos, basic bulleted services, "Skip to main content" boilerplate, Google Sites footer attribution, no headshot, no painterly identity. She calls it "too simple and amateur." The new site must read as **made by a designer**.
- **BetterHelp / Talkspace clinical telehealth** — sky blue + white + cheerful sans + sticky CTA. The opposite of this brief.
- **Wellness-startup pastel** (Calm, Headspace, Mindbloom) — friendly mountains, smiling abstract people.
- **Stock photography of therapy clichés** — hands holding hands, woman on a cliff at sunset, journal with coffee, plant on a windowsill. Use the client's actual painted references instead.
- **Generic "modern" tech site** — Inter sans, dark mode with neon, gradient buttons, glassmorphism.
- **Auto-generated geometric mandalas** — Spirograph SVG, parametric flourishes, "sacred geometry" generators. The references are _paintings_; honor that.
- **Greens-and-whites "natural therapy" palette** — sage + cream + rounded sans.
- **Cards-everywhere SaaS layout** — identical icon + heading + text card grids. Editorial layout instead.
- **Border-left accent stripes, gradient text, side-stripe callouts** — banned per impeccable's absolute rules.

## Discoverability (SEO + AEO)

First-class, not polish. The site must be findable on Google for Brazilian-Portuguese psychology / Jungian queries **and** consumable by AI agents. Both audiences are first-class; a choice that satisfies one but breaks the other is wrong. These requirements shape every page:

1. **SSG/SSR + semantic HTML.** No client-only routes for content. Strict heading hierarchy (one `h1`, no skipping). Real landmarks (`header`, `nav`, `main`, `article`, `aside`, `footer`). Slugged pt-BR URLs (`/sobre`, `/blog/<slug>`, `/contato`). `lang="pt-BR"` on `<html>`. Front-load every page: the first ~500 tokens answer who Luiza is, what she does, how to reach her.
2. **JSON-LD on every page**, embedded in the head: `Person` (Luiza) + `LocalBusiness` / `MedicalBusiness` (practice in Guarulhos, consistent NAP) + `Article` / `BlogPosting` (posts) + `FAQPage` (Q&A) + `Review` / `AggregateRating` (testimonials) + `BreadcrumbList`. Extend `src/ui/lib/jsonLd.tsx`; never bypass it.
3. **Meta + social** derived from the Payload `Settings` global with per-page override. One painted-asset OG-image template (1200×630) using Luiza's references — not the generic gradient. Audit `sitemap.ts` / `robots.ts`.
4. **`/llms.txt`** at site root — flat Markdown index of public content with one-line descriptions and token counts, generated from Payload at build time.
5. **`AGENTS.md`** in repo root — currently symlinked to `CLAUDE.md`; ensure agents find the design context.
6. **Markdown source for every blog post** at `/blog/<slug>.md` — clean, no chrome — via a route handler that serializes Payload Lexical to Markdown.
7. **"Copiar para IA" button** on posts — copies the clean Markdown to the clipboard. Aesthetic must respect the manuscript brief (no generic icon button).
8. **Token-count metadata** — server-side estimate (chars/4) as `<meta name="ai:token-count">` and in `llms.txt`. Aim < 20K tokens per post; split if longer.
9. **`robots.txt` must not block AI-agent user-agents.**
10. **Performance / CWV.** LCP < 2.5s on 4G (type-first hero buys this). `next/image` (AVIF/WebP, blur placeholder, correct sizes) for painted references — never inline a 2 MB JPEG. Self-host fonts via `next/font/google` with `display: swap` + pt-BR subset (no FOIT, no third-party font CDN). No render-blocking third-party scripts; GA, if wired, loads `afterInteractive`.

## Design Principles

1. **The page is an illuminated manuscript.** Editorial pacing, generous margins, single warm column for body text, drop caps, marginalia, painted symbols at section breaks. Reading is contemplative, not transactional.
2. **Painterly, not generated.** Texture and irregularity are features. Real painted assets do the work; programmatic ornament does not. If something looks algorithmically clean, it is wrong here.
3. **Symbols carry meaning.** Archetypal imagery appears only where it earns its place — never decoration, never flourish.
4. **Earth pigments, used rarely.** Terracotta, cobalt, ochre, moss, gilt — from the client's references. Accents are sparing; their power is in their rarity. No neon, no pastel, no gradient.
5. **Trust, not urgency.** No sticky CTAs, no countdown timers, no "limited spots." The visitor books because the page gave them a calm, clear sense of the practitioner. Conversion is earned, not pressured.
6. **Designed for two audiences at once.** Every page must be scannable and beautiful for humans **and** structured, semantic, token-efficient for AI agents. The disciplines reinforce each other; if a choice satisfies one but breaks the other, it is wrong.

## Accessibility & Inclusion

Target **WCAG 2.1 AA**. Users are often anxious, often on phones, sometimes at night — clarity and calm are accessibility features here.

- **Contrast.** Body text ≥ 4.5:1 against its background; large text ≥ 3:1. The parchment-cream background is light and warm — verify ink and muted text actually clear 4.5:1 against it (the classic failure is "elegant" light-grey body text on a tinted near-white). Placeholder text needs the same 4.5:1.
- **Reduced motion is not optional.** Every animation needs a `prefers-reduced-motion: reduce` alternative (crossfade or instant). This binds hardest on the **Cosmos** scroll-pinned cinema, which must degrade to a static painted composite / static sigil wheel and drop smooth-scroll.
- **Keyboard + focus.** Visible focus rings (terracotta ring token), logical tab order, skip-to-content, all interactive controls reachable and operable by keyboard. Native `<dialog>` / popover for menus so they escape clipping stacking contexts.
- **Semantics + language.** Correct landmarks and heading order (doubles as AEO). `lang="pt-BR"`; full Portuguese diacritic support in every font and slug.
- **Touch targets** ≥ 44px on mobile (the dominant device for this audience).

## Carve-outs

Site-wide rules above stand by default. Specific, named, **scoped** suspensions live here. Any new suspension requires a new entry; do not generalize an existing one.

### Cosmos (celestial-atlas section, home page)

**Scope.** `src/ui/home/Cosmos*` and the home page that consumes it (`src/app/(frontend)/page.tsx`). Nowhere else.

**Suspended (only inside the scope).** Principle 2 (painterly, not generated) and Principle 3 (symbols never as decoration).

**Permitted inside the scope.** Parametric star positions / twinkle / constellation-line animation via Three.js / `@react-three/fiber`; an armillary sphere from real 3D geometry (concentric torus rings + central gilt sun, `MeshBasicMaterial`, light baked into textures, no real lighting); multi-layer parallax star field + scroll-driven camera path; sparse painted cosmic atmosphere (a few textured nebula planes, one Milky Way band, one painted comet at a time); constellation line networks (thin gilt strokes ≤ 1.5px on real RA/Dec positions for ~25 constellations) + bright vertex-star sprites; twelve zodiac sigils as small painted-style cartouches (or Cardo-italic Unicode glyphs as a stub); a scroll-pinned cinema timeline (~200–375vh) across enter / prelude / approach / orbit / tilt / recede; and a **painted-scene prelude** of discrete cut-out props (clouds, a horizon land strip, trees, rocks, a bush, and a _single solitary contemplative figure_) staged in the same `<Canvas>`, fading out per-prop as the camera dollies past, cleared entirely by p≈0.20. **AI image generation is permitted for the prelude prop assets only**, by direct user direction; the static composite is the first ship target, with per-prop motion deferred until approved. On mobile / reduced-motion, props pre-flatten to a single static composite.

**Still forbidden inside the scope.** Parametric mandalas / generated "sacred geometry" / AI-flourish ornament; a dark / starfield-simulation ground (the section stays on parchment); AI-generated imagery for any texture asset _other than_ the named prelude props (everything else uses public-domain Renaissance plates — Bayer, Cellarius — commissioned hand-painted assets, or procedural shaders); real lighting / glow / atmospheric blur / bloom; particles or instanced ornament beyond the explicitly named elements; any astrological reading or predictive language (the zodiac is framed as Jungian _vocabulary_, not prediction — a short disclaimer makes this legible); a literal painted "ground" silhouette in the descent beat (the retired v5 procedural fallback is permanently retired; a real commissioned plate would need a new carve-out entry); and any two-figure / romantic reading of a figure — any figure must be solitary, because the practice is individual analysis.

**Why it exists.** A moment of wonder right after the type-first hero serves the home page's emotional contract — the practice's work (individuation, depth, archetypes) lives in the territory the section evokes. The risk (that this becomes the site's _real_ identity) is managed by keeping it parchment-toned, framing it as vocabulary-not-prediction, and limiting its scroll real estate so the column-based reading rhythm stays dominant.
