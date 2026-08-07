---
name: Símbolos do Self · por Luiza Fernandes Bezerra
description: The online analytical-psychology clinic of Luiza Fernandes Bezerra as an illuminated manuscript — earth pigments on warm parchment, all-serif, painterly; the paintings carry the color.
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

# Design System: Símbolos do Self · por Luiza Fernandes Bezerra

## 1. Overview

**Creative North Star: "The house behind the gallery — an illuminated manuscript."**

The Instagram feed (@simbolos.do.self, 45.4K) is the gallery — a stream of curated moments, saturated and image-forward. The site is **the house behind it: where the practice lives.** It is rendered as a page in the tradition of Jung's _Red Book_ — hand-painted, lamp-lit, scholarly: **iron-gall ink on warm vellum, lettered in two literary serifs, with earth-pigment illuminations (terracotta, lapis cobalt, saffron ochre, forest moss) and gold leaf used as sparingly as a medieval scribe used it.** Deliberately calmer and more spacious than the feed — same world, grown up ("me achar super profissional").

The system carries a **duality** everywhere: **Símbolos do Self is the place; Luiza is the person who receives you there.** The _world_ speaks in tracked small-caps, ornament, plates, and Jung's set passages; _Luiza_ speaks in body prose, italics, the portrait, first person. Every element must know which voice it belongs to.

The paintings — not the UI — carry the color. Density is editorial and generous: a single warm column of body text, wide margins, drop caps, marginalia, painted plates at section-scale moments. The first impression is deliberately slow — a type-first hero, no urgency — yet **within the first ~1.5 mobile screens a follower must have seen the three signatures of the feed: the mandala mark, one classical painting, and Jung's voice.** Trust is earned down the page; conversion (a WhatsApp conversation) is the reward for a calm, confident read, never a pressured ask.

This system explicitly **rejects** the clinical-telehealth look (BetterHelp/Talkspace sky-blue-and-white with a sticky CTA), wellness-startup pastel (Calm/Headspace), therapy-cliché stock photography, the generic modern-tech aesthetic (Inter, dark mode, neon, gradient buttons, glassmorphism), auto-generated "sacred geometry" mandalas, sage-and-cream "natural therapy" palettes, and the cards-everywhere SaaS grid. The floor it rises from is her old templated Google Sites page; the bar is _unmistakably made by a designer_.

**Key Characteristics:**

- **All-serif voice.** Cardo display + Vollkorn body. No sans anywhere; Cardo tracked caps carry labels.
- **Two voices, formalised.** Tracked small-caps = the world speaking; body prose + italics = Luiza speaking.
- **The plates carry the saturation.** Classical paintings at editorial scale are the only saturated elements on any screen; the UI stays quiet parchment around them. 60-30-10 governs the UI, not the art.
- **Earth pigments, used rarely.** Terracotta is the one recurring accent; cobalt/ochre/moss/gilt are events.
- **Near-sharp edges.** Radii top out at 8px; most surfaces are square (0–2px). No pills, no rounded cards.
- **Flat on parchment.** Depth = tonal vellum layering + warm hairline rules, never shadow. Blur/shadow exist only inside the Cosmos carve-out.
- **Painterly, not generated.** Texture and irregularity are features; programmatic ornament is forbidden outside the scoped Cosmos atlas. A vector stand-in for a painted asset inverts the idea into banned generated ornament.
- **One wow per page.** The Cosmos owns the home (desktop); the painted wheel owns /analise. Set-pieces never compete, and anything desktop-only gets a designed mobile substitute — never a hidden hole.
- **Two audiences at once.** Beautiful and scannable for humans; semantic, front-loaded, token-efficient for AI agents.

## 2. Colors

An earth-pigment palette lifted from the painted references — warm, low-key, lamp-lit. Nothing is pure: the background is vellum (never white), the ink is warm near-black (never `#000`), and the accents are mineral pigments rather than digital primaries.

### Primary

- **Bole Terracotta** (`oklch(0.55 0.16 35)`): the single recurring accent — the rust-red bole under gold leaf. Drop-cap initials, hairline section dividers, rubrication, link hover, the focus ring, text selection. Its **deep** shade (`oklch(0.42 0.14 30)`) is the primary CTA fill; its **soft** shade (`oklch(0.66 0.13 35)`) is for hover/text-on-dark moments.

### Secondary

- **Lapis Cobalt** (`oklch(0.4 0.14 250)`): the rarest pigment, reserved for "mandala-center" moments — the deep blue of a manuscript sky. Used as an event, never as routine UI color. **Cobalt-deep** (`oklch(0.3 0.12 250)`) for the darkest variant.

### Tertiary

- **Saffron Ochre** (`oklch(0.68 0.13 75)`): warm illumination accent, adjacent to the parchment hue.
- **Forest Moss** (`oklch(0.45 0.1 145)`): the green pigment — tags and marginalia only, the rarest of the rare.
- **Gold-Leaf Gilt** (`oklch(0.75 0.13 80)`): gilding. Used like literal gold leaf — a thin highlight, the Cosmos sun and constellation strokes. **Never** a gradient, never a fill.

### Neutral

- **Vellum Parchment** (`oklch(0.97 0.012 75)`): the body background. Warm cream with a hint of ochre. Two raised tones layer depth without shadow: **parchment-deep** (`oklch(0.945 0.018 75)`, surfaces) and **parchment-edge** (`oklch(0.91 0.022 70)`); **vellum** (`oklch(0.93 0.024 70)`) is the muted fill.
- **Iron-Gall Ink** (`oklch(0.22 0.02 35)`): foreground text — warm near-black. **Ink-soft** (`oklch(0.34 0.02 45)`) for emphasis italics; **Quill** (`oklch(0.5 0.022 55)`) for muted/marginalia text.
- **Warm Rule** (`oklch(0.84 0.018 70)`, with **rule-soft** `oklch(0.88 0.014 72)`): tinted hairline borders and dividers — low-contrast, never grey.

### Named Rules

**The Plates-Carry-Color Rule.** The classical paintings are the only saturated elements on any screen. The 60-30-10 pigment discipline governs the UI _around_ them, never the art itself. If the UI competes with a plate for chroma, the UI is wrong.

**The 60-30-10 Rule.** ~60% parchment + ink, ~30% muted/secondary, ~10% accent on any screen of UI. Accents are rare; rarity is what gives them power.

**The Gold-Leaf Rule.** Gilt behaves like physical gold leaf — a thin, rare highlight. It is **never** a gradient and never a button fill.

**The One-Voice Rule.** Terracotta is the only accent that recurs. Cobalt, ochre, moss, and gilt appear as deliberate events. If two non-terracotta accents share a screen, one is wrong.

## 3. Typography

**Display Font:** Cardo (with Georgia, 'Times New Roman', serif) — Bembo-derived, scholarly, with an exquisite italic. Weights 400/700, normal + italic, subset for `latin` + `latin-ext` (full pt-BR diacritics), `display: swap`, self-hosted via `next/font/google`.
**Body Font:** Vollkorn (with Georgia, serif) — a robust, slightly imperfect humanist serif that holds at small sizes ("whole grain"). Weights 400/500/600/700, normal + italic, same subset and loading.
**Label Font:** Cardo small caps / tracked caps — there is no sans in the system.

**Character:** Two serifs paired on a contrast axis (a refined Renaissance display against a sturdy reading face), not two similar faces. The pairing reads as a well-set printed book. **Italics carry voice** the way printed books use them.

### Hierarchy

- **Display** (Cardo 400, `clamp(2.6rem, 6vw, 4.4rem)`, lh 1.05, tracking -0.012em): the hero `h1` only — the lockup territory.
- **Headline** (Cardo 400, `clamp(2rem, 4vw, 3.1rem)`, lh 1.12, tracking -0.005em): section `h2`. `text-wrap: balance`.
- **Title** (Cardo 400, `clamp(1.45rem, 2.4vw, 1.85rem)`, lh 1.2): `h3`, pull-quotes, and the Jung-passage setting.
- **Body** (Vollkorn 400, `1.0625rem`, lh 1.65, oldstyle numerals): the warm reading column — Luiza's voice. Capped at **60–72ch**. Paragraphs after the first are indented (1.4em), not spaced — book setting. `text-wrap: pretty`, `hyphens: auto`.
- **Label** (Cardo 400, `0.74rem`, uppercase, tracking 0.22em → 0.16em ≤640px): the `.tracked` kicker — the world's voice. Nav, the credential line, plate captions' small line, popover titles.

### Named Rules

**The Two-Voices Rule.** Every text element belongs to one of two named voices. **The world (Símbolos do Self):** tracked small-caps labels, the lockup, plate captions, section ornaments, Jung's set passages. **Luiza:** body prose, first person, Cardo italic emphasis, the marginal notes, the FAQ answers, the WhatsApp openers — her colloquial register survives untranslated there. If an element can't say which voice it belongs to, it gets rewritten.

**The Jung-Passage Treatment.** Jung quotes get one consistent, ownable format — the site's equivalent of her Instagram tile: set in Cardo italic at Title scale, ink on plain parchment, generous vertical space, with a rubricated terracotta attribution line in the tracked-caps label voice (`C. G. Jung · obra`). One treatment everywhere a passage appears (o sintoma como chamado, the rotating pool, plate pairings); never burned into an image, never a "quote card."

**The Marginalia-Is-Voice Rule.** Marginalia is for voice, not for facts someone must act on. Operational facts — fees, availability, credentials, session logistics — are never set in decorative small type; they get body type or the credential-line strip.

**The All-Serif Rule.** No sans-serif anywhere. UI labels use Cardo small caps or tracked caps. A neutral sans would break the manuscript voice instantly.

**The Italic-Is-Voice Rule.** Emphasis, captions, epigraphs, and marginalia are Cardo _italic_ — never bold, never underline-for-emphasis. Bold is for structural weight only.

**The Banned-Faces Rule.** Prohibited for this project: Inter, Fraunces, Cormorant family, Playfair, Newsreader, Crimson family, IBM Plex family, Space Grotesk, Outfit, DM Sans/Serif, Plus Jakarta, Instrument — and any monospace used as "technical" shorthand. These are the trained reflexes; they are not this site.

**The Drop-Cap Rule.** Core pages open with a `.dropcap` — a 4.4em Cardo _italic_ terracotta initial, floated. Once per page opening, not per section. (The self-painting initial, "Iluminura que se pinta," is a could-have that requires genuinely painted initials first.)

## 4. Elevation

**This system is flat on parchment.** Depth is conveyed through **tonal layering** of the vellum ramp (parchment → parchment-deep → parchment-edge) and **warm hairline rules** (`--color-rule`), not through drop shadows. Surfaces sit on the page like sheets of paper, not floating cards. There is no global shadow vocabulary, and there are no resting-state shadows on buttons, cards, or inputs.

The single exception is **scoped to the Cosmos carve-out**, where the marginalia popover floats above a dark 3D canvas and genuinely needs to detach from it: a layered soft shadow plus a `backdrop-filter: blur(7px)` parchment card. Glassmorphism is banned everywhere else by default — this one instance is justified by the popover sitting over live painted nebula, not over the parchment page.

### Shadow Vocabulary (Cosmos popover only)

- **Floating-card** (`box-shadow: 0 1px 0 …inset, 0 8px 24px -10px oklch(0.22 0.02 35 / 0.32), 0 2px 6px -2px oklch(0.22 0.02 35 / 0.16)`): the only shadow in the system. Do not reuse on the parchment page.
- **Text halo** (compounding `text-shadow` of 1–5 ink layers): not a box shadow — keeps parchment-colored text legible over the nebula sweep without a backing card.

### Named Rules

**The Flat-On-Parchment Rule.** Surfaces are flat at rest. If a card or button has a resting drop shadow, it is wrong. Depth = a deeper parchment tone or a warm hairline rule. The only legitimate shadow lives over the Cosmos canvas.

## 5. Components

### Buttons

The brand's primary action is **hand-rolled, not the shadcn primitive.** (A shadcn-derived `button.tsx` exists for admin/utility use; its dark-mode and `shadow-xs` defaults are off-voice for the public site — do not reach for it on brand surfaces.)

- **Shape:** square. The primary CTA has **0 radius**; the rest of the system tops out at 8px (`{rounded.2xl}`). No pills, ever.
- **Primary:** a solid **terracotta-deep** block, parchment text, `16px 28px` padding, with a Cardo-_italic_ label and a trailing `→` that nudges `translateX` on hover. Color-only transition (no scale, no shadow). The WhatsApp CTA is this button — in flow, never sticky, never a floating bubble.
- **Hover/Focus:** background shifts terracotta-deep → **ink**. Focus-visible draws a 2px terracotta outline at 3px offset.
- **Secondary:** a text link in the marginalia voice — quill, Cardo italic, 1px terracotta underline at 0.28em offset, hover to terracotta. Low-commitment actions ("conhecer a primeira conversa").

### The Plate

The site's signature image component — **her curation become the site's visual matter.** A plate is one classical painting given a full editorial moment:

- Generous parchment around it; **never cropped into a card, never a texture behind text.**
- A marginalia caption in the gallery-label voice: painter, title, year (tracked-caps small line + Cardo italic).
- At most **one or two per page**, at section-scale moments; the home carries several, every page carries at least one.
- Always public-domain from a clean scan (museum/open-access sources); provenance verified before launch.
- Selected by amplificação — the image sits beside the idea it amplifies; symbols index content, never the visitor.
- `next/image` (AVIF/WebP), correct sizes, blur placeholder; never an inline multi-MB JPEG.

### The Mark (ornament system)

The mandala mark — her existing avatar — is the identity anchor: header mark, favicon, social-share mark, section-break ornament. It always appears with the **"por" lockup**: `SÍMBOLOS DO SELF · por Luiza Fernandes Bezerra`. Sanctioned ornament sources are exactly three: **the mark, details cropped from the plates, and the approved painted set in `/public/art`** (quaternity · landscape-quaternity · red-script · squared-mandala · winter-star · serpent-flame — client-approved as illuminations, placed by amplificação beside the idea each amplifies). If that proves thin, the escalation path is commissioning more hand-painted symbols — never generation.

### Cards / Containers

- **Corner Style:** square to barely-softened (0–2px). No rounded SaaS cards.
- **Background:** parchment-deep or vellum over the parchment page; the `.parchment-grain` texture carries the painterly surface.
- **Shadow Strategy:** none (see Elevation).
- **Border:** a single warm hairline rule when separation is needed. **Never** a colored side-stripe (`border-left`/`-right` > 1px is banned).

### Navigation

- **Header (all pages):** mark + lockup left · Análise · Orientação profissional · Sobre · Primeira conversa · **[WhatsApp]** as the visually distinct terminal item — the primary-button voice, i.e. a filled terracotta-deep chip, not an outline. This is not the banned sticky CTA: the ban targets a CTA riding the viewport outside the page's own flow (a floating bubble, a bar pinned over content); a small filled item inside the header's own static height is no different from any other nav item beside it. **Sticky, never hiding** — it does not slide away on scroll — and never a floating bubble. Perguntas and Internacional live in the footer and as contextual links where the doubt occurs.
- **Style:** Cardo, restrained, `.tracked`/`.tracked-ink` tracked-caps voice. Ink at rest, terracotta on hover/active; 1px underline at a generous offset, never a background fill. Mobile gets a dedicated `HeaderMobileNav`.
- **Footer (all pages):** three columns — _A clínica_ (pages) · _Começar_ (primeira conversa, perguntas, internacional, WhatsApp, email, availability) · _O mundo_ (Instagram, CRP, "português e inglês · Brasil e exterior", privacidade) — plus the **colophon band**: the canonical sentence binding clinic name to her name + CRP, plate credits, © year.
- **One page registry:** header and footer derive from a single canonical page list so they can never disagree.

### Operational strips (facts in body voice, never decorative)

- **The credential line:** one strip on Início and /sobre — CRP · PUC-SP · desde 2014 · on-line · pt/en · Brasil e exterior. Only client-confirmed facts enter it.
- **The who-line:** on /analise, /orientacao-profissional and /primeira-conversa the strip's job is carried by one quiet clause under the `h1` — "Com a psicóloga {nome}" + CRP once confirmed — composed from the same A Clínica facts, body type, small (`WhoLine`).
- **The availability line:** one editable line, three states (com horários disponíveis · lista de espera curta · sem novos atendimentos — escreva e eu aviso) + the response window ("respondo em até um dia útil, horário de Brasília").

### O bilhete (the opener chooser)

On /primeira-conversa: pre-written WhatsApp openers, tap to choose — análise · orientação · "não sei qual caminho é o meu" · English. Set as notes in Luiza's voice, not as buttons in a grid; each opener worded per origin (attribution in her voice, zero visitor tracking). The whole interaction composes a WhatsApp link in the visitor's own browser. (The wax-seal fold, "O selo," is a should-have micro-moment: <600ms, never blocking the handoff.)

### Signature manuscript components

- **Drop cap** (`.dropcap`): floated 4.4em Cardo italic terracotta initial — opens core pages.
- **Tracked kicker** (`.tracked` / `.tracked-ink`): the world's label voice (Cardo caps, 0.22em tracking). A _named brand voice_, not a per-section eyebrow.
- **Marginalia** (`.marginalia`): Cardo/Vollkorn italic quill notes in the margin — voice only, never operational facts. The glosa (one interlinear English line, hero margin + /sobre) lives here.
- **Manuscript numerals** (`.roman-numeral`): Cardo italic terracotta enumerators (I–V) where an ordered sequence genuinely exists — the pillars, the passo a passo.
- **Wow set-pieces — one per page, never competing:** the **Cosmos** celestial atlas on the home (desktop; scroll-pinned Three.js, entirely under its carve-out in PRODUCT.md) and the **painted wheel** on /analise (a real painted asset — archetypal vocabulary, visual-only until her readings exist). On phones and under reduced motion the Cosmos slot gets a _designed substitute_ — A Lâmina (one painting as a scroll-cinema) or minimally a full-bleed painted celestial plate — never a hidden section.

## 6. Do's and Don'ts

### Do:

- **Do** make every element declare its voice: tracked small-caps for the world, body prose and italics for Luiza.
- **Do** keep the body to a single warm column, 60–72ch, indented (not spaced) paragraphs, a drop cap to open the page.
- **Do** let the plates be the only saturation on screen — full editorial moments with gallery-label captions, never cropped into cards, never textures behind text.
- **Do** hold the 60-30-10 weight on the UI and let terracotta be the one recurring accent.
- **Do** convey depth with a deeper parchment tone or a warm hairline rule — surfaces stay flat at rest.
- **Do** keep edges near-sharp (0–8px); the primary CTA is a square terracotta-deep block, in flow.
- **Do** set every Jung passage in the one canonical treatment — Cardo italic, Title scale, rubricated attribution.
- **Do** put operational facts (fees, availability, credentials) in body type or the credential strip — never in decorative small type.
- **Do** verify contrast on the warm parchment: body and quill text ≥ 4.5:1; large text ≥ 3:1; placeholders 4.5:1.
- **Do** give every animation a `prefers-reduced-motion` alternative, and every desktop-only set-piece a designed mobile substitute.
- **Do** front-load every page (who · what · for whom · how to reach) with semantic landmarks + one `h1` — humans and AI agents at once.
- **Do** anchor every time to horário de Brasília, and quote currency per the page's own policy (BRL on pt-BR pages; USD/EUR on /internacional and /en) — never automatic conversion.

### Don't:

- **Don't** introduce any sans-serif, dark mode, neon, gradient buttons, or glassmorphism — the generic modern-tech look is banned across the board.
- **Don't** ship the clinical-telehealth aesthetic, wellness-startup pastel, or greens-and-whites "natural therapy" palette.
- **Don't** use gradient text (`background-clip: text`), `border-left`/`-right` > 1px colored side-stripes, or side-stripe callouts — banned by impeccable's absolute rules.
- **Don't** build cards-everywhere SaaS grids. Use editorial layout.
- **Don't** put a tracked-caps eyebrow or numbered marker above every section. The `.tracked` label is a deliberate voice, not scaffolding.
- **Don't** auto-generate mandalas or "sacred geometry", and don't substitute vector stand-ins for painted assets — a creative touch without its real painted asset doesn't ship. Programmatic ornament is forbidden outside the scoped Cosmos atlas.
- **Don't** add resting drop shadows to buttons, cards, or inputs. The only shadow in the system lives over the Cosmos canvas.
- **Don't** use pure white backgrounds or `#000` ink — it's vellum and iron-gall ink, always warm.
- **Don't** add sticky CTAs, floating WhatsApp bubbles, countdown timers, or "limited spots." Trust, not urgency. The header is sticky; the CTA is not.
- **Don't** hide the header on scroll — it is sticky and never disappears.
- **Don't** ship astrological/predictive language anywhere — the zodiac is Jungian _vocabulary_; symbols index content, never the visitor. No zodiac imagery at all on /orientacao-profissional.
- **Don't** place English outside its named places (the glosa lines, /internacional's In-English section, /en) — and never a flag icon or language dropdown.
- **Don't** render testimonials without recorded consent, and never with star ratings.
