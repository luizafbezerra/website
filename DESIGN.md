---
name: Luiza Fernandes Bezerra — Psicologia Junguiana
description: An illuminated-manuscript site for a Jungian clinical psychologist in Guarulhos, Brazil. Earth pigments on warm parchment, all-serif, painterly.
colors:
  parchment: "oklch(0.97 0.012 75)"
  parchment-deep: "oklch(0.945 0.018 75)"
  parchment-edge: "oklch(0.91 0.022 70)"
  vellum: "oklch(0.93 0.024 70)"
  ink: "oklch(0.22 0.02 35)"
  ink-soft: "oklch(0.34 0.02 45)"
  quill: "oklch(0.5 0.022 55)"
  terracotta: "oklch(0.55 0.16 35)"
  terracotta-deep: "oklch(0.42 0.14 30)"
  terracotta-soft: "oklch(0.66 0.13 35)"
  cobalt: "oklch(0.4 0.14 250)"
  cobalt-deep: "oklch(0.3 0.12 250)"
  ochre: "oklch(0.68 0.13 75)"
  moss: "oklch(0.45 0.1 145)"
  gilt: "oklch(0.75 0.13 80)"
  rule: "oklch(0.84 0.018 70)"
  rule-soft: "oklch(0.88 0.014 72)"
  destructive: "oklch(0.55 0.2 25)"
typography:
  display:
    fontFamily: "Cardo, Georgia, 'Times New Roman', serif"
    fontSize: "clamp(2.6rem, 6vw, 4.4rem)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.012em"
  headline:
    fontFamily: "Cardo, Georgia, serif"
    fontSize: "clamp(2rem, 4vw, 3.1rem)"
    fontWeight: 400
    lineHeight: 1.12
    letterSpacing: "-0.005em"
  title:
    fontFamily: "Cardo, Georgia, serif"
    fontSize: "clamp(1.45rem, 2.4vw, 1.85rem)"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "-0.005em"
  body:
    fontFamily: "Vollkorn, Georgia, 'Times New Roman', serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
    fontFeature: "'kern' 1, 'liga' 1, 'calt' 1, 'onum' 1"
  label:
    fontFamily: "Cardo, Georgia, serif"
    fontSize: "0.74rem"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "0.22em"
rounded:
  sm: "0.0625rem"
  md: "0.125rem"
  lg: "0.25rem"
  xl: "0.375rem"
  2xl: "0.5rem"
components:
  button-primary:
    backgroundColor: "{colors.terracotta-deep}"
    textColor: "{colors.parchment}"
    typography: "{typography.label}"
    rounded: "0"
    padding: "16px 28px"
  button-primary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.parchment}"
  link-secondary:
    textColor: "{colors.quill}"
    typography: "{typography.body}"
  link-secondary-hover:
    textColor: "{colors.terracotta}"
  sigil-button:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.display}"
    rounded: "{rounded.2xl}"
    padding: "0.45rem 0.55rem"
---

# Design System: Luiza Fernandes Bezerra — Psicologia Junguiana

## 1. Overview

**Creative North Star: "The Illuminated Manuscript"**

This is a clinical psychologist's site rendered as a page from Carl Jung's _Red Book_ — hand-painted, lamp-lit, scholarly. The whole system is built from the materials of an illuminated manuscript: **iron-gall ink on warm vellum, lettered in two literary serifs, with earth-pigment illuminations (terracotta, lapis cobalt, saffron ochre, forest moss) and gold leaf used as sparingly as a medieval scribe used it.** Reading is the act; the page is contemplative, never transactional. A returning blog reader should feel they have opened a familiar book by lamplight.

Density is editorial and generous: a single warm column of body text, wide margins, drop caps, marginalia, painted symbols at section breaks. The first impression is deliberately slow — a type-first hero, no stock photo above the fold, no urgency. Trust is earned down the page; conversion (a WhatsApp conversation) is the reward for a calm, confident read, never a pressured ask.

This system explicitly **rejects** the clinical-telehealth look (BetterHelp/Talkspace sky-blue-and-white with a sticky CTA), wellness-startup pastel (Calm/Headspace), therapy-cliché stock photography (hands, cliffs, journals), the generic modern-tech aesthetic (Inter, dark mode, neon, gradient buttons, glassmorphism), auto-generated "sacred geometry" mandalas, sage-and-cream "natural therapy" palettes, and the cards-everywhere SaaS grid. The floor it rises from is Luiza's old templated Google Sites page; the bar is _unmistakably made by a designer_.

**Key Characteristics:**

- **All-serif voice.** Cardo display + Vollkorn body. No sans anywhere; small caps from Cardo carry labels.
- **Earth pigments, used rarely.** ~60% parchment + ink, ~30% muted, ~10% accent. Terracotta is the one recurring voice; cobalt/ochre/moss/gilt are events.
- **Near-sharp edges.** Radii top out at 8px and most surfaces are square (0–2px). No pill buttons, no rounded cards.
- **Flat on parchment.** Depth comes from tonal vellum layering and warm hairline rules, not shadow. Blur/shadow exist only inside the Cosmos carve-out.
- **Painterly, not generated.** Texture (parchment grain, painted plates) and irregularity are features; programmatic ornament is forbidden outside the scoped Cosmos atlas.
- **Two audiences at once.** Beautiful and scannable for humans; semantic, front-loaded, token-efficient for AI agents.

## 2. Colors

An earth-pigment palette lifted from the painted references — warm, low-key, lamp-lit. Nothing is pure: the background is vellum (never white), the ink is warm near-black (never `#000`), and the accents are mineral pigments rather than digital primaries.

### Primary

- **Bole Terracotta** (`oklch(0.55 0.16 35)`): the single recurring accent — the rust-red bole under gold leaf. Drop-cap initials, hairline section dividers, link hover, the focus ring, text selection. Its **deep** shade (`oklch(0.42 0.14 30)`) is the primary CTA fill; its **soft** shade (`oklch(0.66 0.13 35)`) is for hover/text-on-dark moments.

### Secondary

- **Lapis Cobalt** (`oklch(0.4 0.14 250)`): the rarest pigment, reserved for "mandala-center" moments — the deep blue of a manuscript sky. Used as an event, never as routine UI color. **Cobalt-deep** (`oklch(0.3 0.12 250)`) for the darkest variant.

### Tertiary

- **Saffron Ochre** (`oklch(0.68 0.13 75)`): warm illumination accent, adjacent to the parchment hue.
- **Forest Moss** (`oklch(0.45 0.1 145)`): the green pigment — tags and marginalia only, the rarest of the rare.
- **Gold-Leaf Gilt** (`oklch(0.75 0.13 80)`): gilding. Used like literal gold leaf — a thin highlight, the Cosmos sun and constellation strokes. **Never** a gradient, never a fill.

### Neutral

- **Vellum Parchment** (`oklch(0.97 0.012 75)`): the body background. Warm cream with a hint of ochre. Two raised tones layer depth without shadow: **parchment-deep** (`oklch(0.945 0.018 75)`, cards/surfaces) and **parchment-edge** (`oklch(0.91 0.022 70)`); **vellum** (`oklch(0.93 0.024 70)`) is the muted fill.
- **Iron-Gall Ink** (`oklch(0.22 0.02 35)`): foreground text — warm near-black. **Ink-soft** (`oklch(0.34 0.02 45)`) for emphasis italics; **Quill** (`oklch(0.5 0.022 55)`) for muted/marginalia text.
- **Warm Rule** (`oklch(0.84 0.018 70)`, with **rule-soft** `oklch(0.88 0.014 72)`): tinted hairline borders and dividers — low-contrast, never grey.

### Named Rules

**The 60-30-10 Rule.** ~60% parchment + ink, ~30% muted/secondary, ~10% accent on any screen. Accents are rare; rarity is what gives them power.

**The Gold-Leaf Rule.** Gilt behaves like physical gold leaf — a thin, rare highlight. It is **never** a gradient and never a button fill. The same prohibition the brief makes site-wide.

**The One-Voice Rule.** Terracotta is the only accent that recurs. Cobalt, ochre, moss, and gilt appear as deliberate events. If two non-terracotta accents share a screen, one is wrong.

## 3. Typography

**Display Font:** Cardo (with Georgia, 'Times New Roman', serif) — Bembo-derived, scholarly, with an exquisite italic. Weights 400/700, normal + italic, subset for `latin` + `latin-ext` (full pt-BR diacritics), `display: swap`, self-hosted via `next/font/google`.
**Body Font:** Vollkorn (with Georgia, serif) — a robust, slightly imperfect humanist serif that holds at small sizes ("whole grain"). Weights 400/500/600/700, normal + italic, same subset and loading.
**Label Font:** Cardo small caps / tracked caps — there is no sans in the system.

**Character:** Two serifs paired on a contrast axis (a refined Renaissance display against a sturdy reading face), not two similar faces. The pairing reads as a well-set printed book. **Italics carry voice** the way printed books use them — emphasis, captions, marginalia, and the epigraphs are all Cardo italic.

### Hierarchy

- **Display** (Cardo 400, `clamp(2.6rem, 6vw, 4.4rem)`, lh 1.05, tracking -0.012em): the hero `h1` (name) only. The subtitle drops to ~0.42em of the h1 in Cardo italic terracotta-deep.
- **Headline** (Cardo 400, `clamp(2rem, 4vw, 3.1rem)`, lh 1.12, tracking -0.005em): section `h2`. `text-wrap: balance`.
- **Title** (Cardo 400, `clamp(1.45rem, 2.4vw, 1.85rem)`, lh 1.2): `h3` and pull-quotes.
- **Body** (Vollkorn 400, `1.0625rem`, lh 1.65, oldstyle numerals): the warm reading column. Capped at **60–72ch**. Paragraphs after the first are indented (1.4em), not spaced — book setting. `text-wrap: pretty`, `hyphens: auto`.
- **Label** (Cardo 400, `0.74rem`, uppercase, tracking 0.22em → 0.16em ≤640px): the `.tracked` kicker (e.g. "Consultório psicológico · estabelecido em…"), nav, and popover titles.

### Named Rules

**The All-Serif Rule.** No sans-serif anywhere. UI labels use Cardo small caps or tracked caps. A neutral sans would break the manuscript voice instantly.

**The Italic-Is-Voice Rule.** Emphasis, captions, epigraphs, and marginalia are Cardo _italic_ — never bold, never underline-for-emphasis. Bold is for structural weight only.

**The Banned-Faces Rule.** Prohibited for this project: Inter, Fraunces, Cormorant family, Playfair, Newsreader, Crimson family, IBM Plex family, Space Grotesk, Outfit, DM Sans/Serif, Plus Jakarta, Instrument — and any monospace used as "technical" shorthand. These are the trained reflexes; they are not this site.

**The Drop-Cap Rule.** Lead essays and the hero lead open with a `.dropcap` — a 4.4em Cardo _italic_ terracotta initial, floated. It marks the start of reading; use it once per article opening, not per section.

## 4. Elevation

**This system is flat on parchment.** Depth is conveyed through **tonal layering** of the vellum ramp (parchment → parchment-deep → parchment-edge) and **warm hairline rules** (`--color-rule`), not through drop shadows. Surfaces sit on the page like sheets of paper, not floating cards. There is no global shadow vocabulary, and there are no resting-state shadows on buttons, cards, or inputs.

The single exception is **scoped to the Cosmos carve-out**, where the marginalia popover floats above a dark 3D canvas and genuinely needs to detach from it: a layered soft shadow plus a `backdrop-filter: blur(7px)` parchment card. Glassmorphism is banned everywhere else by default — this one instance is justified by the popover sitting over live painted nebula, not over the parchment page.

### Shadow Vocabulary (Cosmos popover only)

- **Floating-card** (`box-shadow: 0 1px 0 …inset, 0 8px 24px -10px oklch(0.22 0.02 35 / 0.32), 0 2px 6px -2px oklch(0.22 0.02 35 / 0.16)`): the only shadow in the system. Detaches the sigil popover from the dark canvas. Do not reuse on the parchment page.
- **Text halo** (compounding `text-shadow` of 1–5 ink layers): not a box shadow — used to keep parchment-colored epigraph/skip text legible across the nebula's orange→blue sweep without a backing card.

### Named Rules

**The Flat-On-Parchment Rule.** Surfaces are flat at rest. If a card or button has a resting drop shadow, it is wrong. Depth = a deeper parchment tone or a warm hairline rule. The only legitimate shadow lives over the Cosmos canvas.

## 5. Components

### Buttons

The brand's primary action is **hand-rolled, not the shadcn primitive.** (A shadcn-derived `button.tsx` with `default/outline/ghost/secondary/link/destructive` variants exists for admin/utility use, but it carries dark-mode and `shadow-xs` defaults that are off-voice for the public site — do not reach for it on brand surfaces.)

- **Shape:** square. The primary CTA has **0 radius**; the rest of the system tops out at 8px (`{rounded.2xl}`). No pills, ever.
- **Primary:** a solid **terracotta-deep** block, parchment text, `16px 28px` padding, with a Cardo-_italic_ label and a trailing `→` that nudges `translateX` on hover. Color-only transition (no scale, no shadow).
- **Hover/Focus:** background shifts terracotta-deep → **ink** (`{colors.ink}`). Focus-visible draws a 2px terracotta outline at 3px offset.
- **Secondary:** a text link in the marginalia voice — quill, Cardo italic, 1px terracotta underline at 0.28em offset, hover to terracotta. Used for "scroll to approach" / low-commitment actions.

### Cards / Containers

- **Corner Style:** square to barely-softened (0–2px). No rounded SaaS cards.
- **Background:** parchment-deep or vellum over the parchment page; the `.parchment-grain` texture (`/texture/parchment.webp`, fixed-attachment) carries the painterly surface.
- **Shadow Strategy:** none (see Elevation — Flat-On-Parchment).
- **Border:** a single warm hairline rule when separation is needed. **Never** a colored side-stripe (`border-left`/`-right` > 1px is banned).

### Inputs / Fields

- **Style:** warm hairline stroke on parchment, near-sharp corners, body serif text. Tinted, low-contrast borders (`--color-input` = rule).
- **Focus:** 2px terracotta outline at 3px offset (the global `:focus-visible` treatment) — no glow, no shadow.
- **Placeholder:** must clear 4.5:1 on parchment — not the default light grey.

### Navigation

- **Style:** Cardo, restrained, in the `.tracked`/`.tracked-ink` tracked-caps label voice. A `.sticky-header` slides out of view on scroll-down and back on scroll-up (`translateY`, 380ms; transition removed under reduced-motion). Mobile gets a dedicated `HeaderMobileNav`.
- **States:** ink at rest, terracotta on hover/active. Links use a 1px underline at a generous offset rather than a background fill.

### Signature manuscript components

- **Drop cap** (`.dropcap`): floated 4.4em Cardo italic terracotta initial — opens essays.
- **Tracked kicker** (`.tracked` / `.tracked-ink`): the one deliberate label system (Cardo caps, 0.22em tracking). This is a _named brand voice_, not a per-section eyebrow — use it where a label genuinely orients the reader, not above every heading.
- **Marginalia** (`.marginalia`): Cardo/Vollkorn italic quill notes in the margin — captions and asides.
- **Roman numerals** (`.roman-numeral`): Cardo italic terracotta section enumerators where an ordered sequence genuinely exists.
- **Cosmos celestial atlas** (`.cosmos-*`): the scroll-pinned (375vh) Three.js armillary-sphere section on the home page. Lives entirely under its own carve-out (see PRODUCT.md → Carve-outs); parametric ornament is permitted _only_ inside this scope. It degrades to a static painted composite + flat sigil wheel under reduced-motion and on mobile.

## 6. Do's and Don'ts

### Do:

- **Do** keep the body to a single warm column, 60–72ch, with indented (not spaced) paragraphs and a drop cap to open.
- **Do** use Cardo _italic_ for all emphasis, captions, epigraphs, and marginalia. Bold is structural only.
- **Do** hold the 60-30-10 weight: ~60% parchment + ink, ~30% muted, ~10% accent. Let terracotta be the one recurring accent.
- **Do** convey depth with a deeper parchment tone or a warm hairline rule — surfaces stay flat at rest.
- **Do** keep edges near-sharp (0–8px). The primary CTA is a square terracotta-deep block with a Cardo-italic label and a nudging arrow.
- **Do** verify contrast on the warm parchment: body ink and quill text must clear 4.5:1; large text 3:1; placeholders 4.5:1.
- **Do** give every animation a `prefers-reduced-motion` alternative — binding hardest on the Cosmos cinema (static composite + flat wheel).
- **Do** front-load every page and keep semantic landmarks + one `h1`; the structure serves humans and AI agents at once.
- **Do** use real painted assets (the references, `next/image` AVIF/WebP) — never therapy-cliché stock.

### Don't:

- **Don't** introduce any sans-serif (no Inter), dark mode with neon accents, gradient buttons, or glassmorphism — the generic modern-tech look is banned across the board.
- **Don't** ship the clinical-telehealth aesthetic (BetterHelp/Talkspace: sky blue + white + cheerful sans + sticky CTA), wellness-startup pastel (Calm/Headspace/Mindbloom), or a greens-and-whites "natural therapy" palette.
- **Don't** use gradient text (`background-clip: text`), `border-left`/`-right` > 1px colored side-stripes, or side-stripe callouts — banned by impeccable's absolute rules.
- **Don't** build cards-everywhere SaaS grids (identical icon + heading + text cards). Use editorial layout.
- **Don't** put a tracked-caps eyebrow or numbered marker (01/02/03) above every section. The `.tracked` label is a deliberate voice, not section scaffolding.
- **Don't** auto-generate mandalas or "sacred geometry" (parametric SVG, Spirograph). The references are _paintings_; programmatic ornament is forbidden outside the scoped Cosmos atlas.
- **Don't** add resting drop shadows to buttons, cards, or inputs. The only shadow in the system lives over the Cosmos canvas.
- **Don't** use pure white backgrounds or `#000` ink — it's vellum and iron-gall ink, always warm.
- **Don't** add sticky CTAs, countdown timers, or "limited spots." Trust, not urgency.
- **Don't** ship astrological/predictive language in the Cosmos section — the zodiac is framed as Jungian _vocabulary_, not prediction.
