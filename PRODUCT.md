# Product

<!-- impeccable:product-schema 1 -->

> Strategic context for **Símbolos do Self** — the online analytical-psychology clinic of psychologist **Luiza Fernandes Bezerra**. This is the canonical who/what/why document; every impeccable command reads it before doing work. Visual tokens and the design system live in `DESIGN.md`. The agreed experience concept — pages, sections, features, the creative menu — lives in `CONCEPT.md`; where this file summarizes it, CONCEPT.md carries the full detail and wins on specifics.

## Platform

web

## Register

brand

The design _is_ the product. The public site is a persuasion surface whose job is to earn a stranger's trust well enough to start a WhatsApp conversation. The Payload `/admin` is the only product-register surface, and it is secondary — not the design's center of gravity.

## Users

Ranked by warmth × volume (CONCEPT §3):

1. **The Instagram follower** — @simbolos.do.self has **45.4K followers, verified**. Already trusts her voice; arrives via the bio link asking "is this a real practice?" Needs instant recognition (name, mark, the paintings), credentials fast, WhatsApp one tap away.
2. **The cold pt-BR searcher in distress** — anxious, on a phone, often at night, comparing therapists. Needs: does she work with what I have, is she qualified, what happens if I write, what does it cost.
3. **Brazilians abroad** — Portugal, UK, USA (her three real client countries). Search in Portuguese; pay in strong currencies. Need _permission and logistics_: "sim, atendo quem mora fora", time zones, paying from abroad. Served by the pt-BR site itself.
4. **Portuguese natives** — same pt-BR funnel; need only explicit mention that Portugal is normal here.
5. **English-speaking foreigners** — smallest, hardest segment. Need one complete English page proving she is real, licensed, and works in English. (In English she is a _"clinical psychologist working in the Jungian tradition"_ — never "Jungian analyst", a formally protected title.)
6. **AI agents / LLM search** — co-equal machine audience; every page front-loads who/what/how-to-reach in its first screen of content.

They are not browsing for a service; they are deciding whether to trust a person with their inner life.

## Product Purpose

Two goals, in tension by design (CONCEPT §1):

1. **Capture as many clients as possible.** North-star metric: **WhatsApp conversations started.**
2. **Capture and keep her identity** — the vibe of @simbolos.do.self — on the website.

The resolution: **the art earns the trust that converts.** Her world is the reason a visitor with four therapist tabs open closes the other three. The site replaces her templated Google Sites page with one that reads as _made by a designer_ — her own stated goal: "me achar super profissional."

## Positioning

**Símbolos do Self is the place. Luiza is the person who receives you there.** Her tradition distinguishes the archetypal (collective, symbolic) from the personal; the site enacts it — the **world** speaks in ornament, plates, Jung's words and the mandala mark; **Luiza** speaks in first-person prose, the portrait, the origin story. Every screen must answer two questions at a glance: _"where am I?"_ and _"who will receive me here?"_ **The world recruits; the person converts.**

The canonical positioning sentence, hers, verbatim, wherever positioning lives:

> **"Clínica de psicologia analítica (Jung) on-line para todo o Brasil e exterior."**

Her signature method has a name in her own tradition — **amplificação**, setting a symbol beside its parallels. The site treats it as her craft, not a social-media habit.

One rule governs every symbolic surface: **symbols index content, never the visitor.** The site explores her world; it never reads you. No birthdate, no "your sign", no personalised interpretation, anywhere, ever.

## The Offer — Two Doors

The practice sells **two distinct services**, and the site is organised around that (CONCEPT §4):

- **Porta A — Análise (psicoterapia junguiana).** Open-ended, weekly, the core practice. The three pillars live _inside_ this door as its themes: _I ansiedade & humor · II relações & vida · III carreira & propósito_.
- **Porta B — Orientação profissional e de carreira.** A **bounded program**: PUC-SP specialization, psychological tests + conversations + proposed activities, up to 12 weekly online meetings, a deliverable at the end. A different product with a different buyer — career-focused, often younger, comparison-shopping against coaches and loose vocational tests — and the easier first purchase, a natural gateway into análise.

One boundary sentence routes between the doors: _sentido do trabalho → análise · qual profissão → orientação._ The overlap at pillar III is the bridge, not a bug.

## Operating Context

- **Online-only.** No page, image, or metadata may claim in-person practice. Weekly sessions over video; the practice follows Brazilian telepsychology regulation (stated as a trust signal, not a disclaimer).
- **Languages:** sessions in Portuguese and English. English on the _site_ appears only in named places: the glosa margin lines, /internacional's In-English section, and (later) /en.
- **Reach:** Brasil e exterior — real client history in Portugal, UK, USA.
- **The funnel is WhatsApp** (`+55 11 96415-8128`), with email (`luizafbezerra@gmail.com`) at equal weight on /en. No booking system, no forms — the visitor composes a WhatsApp message in their own browser.
- **Time & currency policy:** all times anchored to horário de Brasília with city examples abroad. pt-BR pages quote BRL (or "a combinar"); /internacional and /en quote USD/EUR on their own terms; never automatic side-by-side conversion.
- **Aliveness is editorial, not automated:** availability state (three editable states, including the anti-urgency "sem novos atendimentos — escreva e eu aviso"), response window ("respondo em até um dia útil"), rotating Jung passages from a CMS pool she grows, the Instagram feed (CMS-curated tiles until her Meta connection is live).
- **Copy lives in the Payload CMS** and is deliberately out of the concept's scope; her supplied text is the source copy.
- **Attribution without tracking:** each pre-written WhatsApp opener ("o bilhete") is worded per origin — the arriving message tells her which page and service the conversation came from. Zero visitor tracking; LGPD-clean.

## Capabilities and Constraints

**The map (CONCEPT §6):** eight pages, each owning one visitor job — `/` (decide in one scroll that she is my person, and which door is mine) · `/analise` · `/orientacao-profissional` · `/sobre` · `/primeira-conversa` · `/perguntas` · `/internacional` · `/privacidade` (footer only). Every navigation surface derives from one canonical page list so header and footer can never disagree. Header: mark + lockup left; Análise · Orientação profissional · Sobre · Primeira conversa · [WhatsApp] as the visually distinct terminal item; sticky, never hiding, never a floating bubble.

**Reserved URLs (decided now, zero cost):** `/en` is the root of all English content forever — day one a single complete self-contained English page (deferred until her English copy exists), growing into `/en/*` at i18n time with pt-BR canonical at root and hreflang from day `/en` ships. `/vocabulario` — Jungian terms in her own words; no route until the words exist.

**WON'T have (CONCEPT §12):** sticky CTAs, floating WhatsApp bubbles, urgency mechanics of any kind; online booking/calendar; forms that collect personal data, chatbots, popups, newsletter modals; anything that reads the visitor; **a blog** (its old jobs are reassigned: companionship → the Instagram bridge + rotating passages; search depth → the service pages, FAQ and, later, /vocabulario); dark mode; auto-published content; zodiac imagery on the orientação page; English outside the named places.

**Undecided product facts — record, don't invent:**

- **Fee** — publish or "a combinar"; value(s); whether international pricing differs. Her decision.
- **The wheel's readings** — her words or visual-only at launch. Recommendation on file: visual-only until her text exists.
- **Creative-touch greenlight** — CONCEPT §9 is a menu, not a commitment. Recommendation on file: A Lâmina + O selo + Glosa + the moon colophon for launch.
- **Portrait logistics** — who shoots, when.
- **CRP number** — currently read off her public bio; needs written confirmation before it ships anywhere.
- **Domain** — recommendation simbolosdoself.com.br (+ .com if free); her confirmation pending.

## Brand Commitments

- **The name and the duality:** Símbolos do Self always appears bound to her name — the "por" lockup (`SÍMBOLOS DO SELF · por Luiza Fernandes Bezerra`) everywhere the mark appears, and the **colophon sentence** in every footer: Símbolos do Self is the online clinic of psychologist Luiza Fernandes Bezerra (CRP). Humans, Google, and LLMs all read the same binding.
- **The credential line:** who · how · from-where-to-where · what, one strip on every core page. **Only client-confirmed facts enter it** (CRP · PUC-SP · desde 2014 · on-line · pt/en · Brasil e exterior).
- **The mandala mark** — her existing avatar, the image 45K people already associate with her: header mark, favicon, social-share mark, section-break ornament.
- **Voice / authorship:** her supplied text is the source copy — organized, trimmed, typeset; **never invented.** Nothing visitor-facing ships in her name that she didn't write or sign off (this covers the wheel's readings). Register: the Instagram warmth ("Jung para todos!") one register deeper — and her colloquial voice survives untranslated in named places: the WhatsApp openers, the FAQ answers, the marginal notes.
- **Professional standards:** no promised outcomes anywhere ("individuação" is a concept, never _your_ guaranteed result); symbols are vocabulary, never prediction; testimonials render only when consent is recorded — structurally, not as policy — presented as first name or initial + context, verbatim words, **no star ratings**.
- **Provenance:** every image on the site has verified public-domain status or explicit rights before launch. Banned stays banned: stock therapy clichés, AI decoration outside the Cosmos carve-out, generated "sacred geometry."

## Evidence on Hand

- **The Instagram account** — 45.4K followers, verified, alive: classical public-domain paintings + Jung quotes in pt-BR. The single largest existing asset; the site's top of funnel.
- **Real client testimonials** exist (praising _competência_, _acolhimento_, _ética_) — publishable only through the consent gate; a consent round including one voice from abroad is on the ask list.
- **Her academic record**, stated plainly, no editorializing: PUC-SP graduação · Instituto Numen pós · PUC-SP aprimoramentos (clínica junguiana; orientação profissional) · extensões (PUC-SP Psicologia e Religião; USP Fenômenos Anômalos). 22 anos na psicologia; clínica desde 2014; Jung since her 2nd year — "um caminho sem volta."
- **Real client geography:** Portugal, Inglaterra, EUA.
- **Reference assets** in `/references/` (01–06.jpg, logo.jpg, wheel.jpg, luiza.png, print01.png). Several current image picks fail the provenance test and are replaced.
- **The portrait does not exist yet.** The current photo is a casual selfie; as the first image beside competitors' professional headshots it re-creates the amateur register she is paying to leave. A portrait session is the one asset money must buy; the hero stays type-led regardless.
- **Pending from Luiza (CONCEPT §13):** fee decision, CRP in writing, availability + response-window sentences, the four bilhete openers, 6–10 Jung passages + 4–6 favorite posts, the Meta/Instagram connection, the bio-link fix on launch day, domain confirmation, and later the wheel readings, /en copy, one testimonial from abroad.
- **Do not fabricate:** fees, testimonials, credentials, her voice, benchmarks, or any in-person practice claim.

## Product Principles

1. **The world recruits; the person converts.** Every screen answers "where am I?" (Símbolos do Self) and "who will receive me here?" (Luiza). An element that can't say which voice it belongs to gets rewritten.
2. **Trust, not urgency.** No sticky CTAs, no countdowns, no scarcity. The anti-urgency availability state exists precisely to _refuse_ false scarcity. The visitor writes because the page gave them a calm, clear sense of the practitioner.
3. **Symbols index content, never the visitor.** The site explores her world; it never reads you.
4. **Nothing ships in her name that she didn't write or sign off.** Her supplied text is the source copy; features gated on her words (wheel readings, bilhete lines, glosses) ship visual-only or plain until the words exist.
5. **Two audiences at once, both first-class.** Beautiful and scannable for humans; structured, semantic, front-loaded, token-efficient for AI agents. A choice that satisfies one but breaks the other is wrong.

## Discoverability (SEO + AEO)

First-class, not polish (CONCEPT §10):

1. **As "Símbolos do Self":** title pattern `<página> · Símbolos do Self`, home title carrying the positioning sentence + her name. Structured data declares the clinic (professional organization, **no street address — online-only**), the person (credentials, alumniOf, languages pt/en), the two services, and `sameAs` binding the Instagram account and directory profiles into one entity. The Google→Instagram bridge is built here, not asserted.
2. **The share loop:** the social-share card (from the plate system, 1200×630) exists _before_ she announces the site to the account — that announcement is the largest share event the site will ever have.
3. **Search reality, honestly:** with no blog, organic reach = brand-name queries + commercial-intent pages. Strongest non-brand asset: **/orientacao-profissional** ("orientação profissional online" is a real commercial vertical almost no Jungian occupies); /analise targets the "análise junguiana / terapia junguiana online" cluster; /internacional targets expat queries in the words expats actually type. /vocabulario is the future long-tail unlock.
4. **AEO:** every page front-loads its complete answer (what · for whom · format · languages · reach) in the first screen of content; clean **Markdown twins** of the content pages; a **machine-readable index** of public content (`/llms.txt`); FAQ structured as discrete Q&A blocks (análise · orientação · prático · internacional) — the exact questions assistants get asked.
5. **Mechanics:** SSG/SSR + semantic HTML, one `h1`, real landmarks, slugged pt-BR URLs, `lang="pt-BR"`; JSON-LD on every page via `src/ui/lib/jsonLd.tsx` (never bypassed); meta + social from the Payload `Settings` global with per-page override; `robots.txt` never blocks AI-agent user-agents; `AGENTS.md` findable in the repo root.
6. **Performance:** LCP < 2.5s on 4G (the type-first hero buys this). Self-hosted fonts via `next/font/google`, `display: swap`, pt-BR subset. `next/image` (AVIF/WebP) for every painted asset. No render-blocking third-party scripts.
7. **Off-site, part of launch:** Doctoralia profile with photo + CRP + teleconsulta; the expat channel is her own Instagram — the fixed bio link landing on a hero that says "Brasil e exterior" closes that loop by itself.

## Accessibility & Inclusion

Target **WCAG 2.1 AA**. Users are often anxious, on phones, sometimes at night — clarity and calm are accessibility features here.

- **Contrast:** body text ≥ 4.5:1 on the warm parchment (the classic failure is "elegant" light-grey on tinted near-white); large text ≥ 3:1; placeholders 4.5:1.
- **Reduced motion is not optional.** Every animation — the Cosmos, every §9 creative touch — has a `prefers-reduced-motion` alternative. A creative idea without a designed fallback doesn't ship.
- **Keyboard + focus:** visible focus rings (terracotta), logical tab order, skip-to-content, native `<dialog>`/popover for overlays.
- **Semantics + language:** correct landmarks and heading order (doubles as AEO); `lang="pt-BR"`; full Portuguese diacritics in every font and slug.
- **Touch targets ≥ 44px**; mobile-first — the dominant device for this audience. Anything desktop-only (the Cosmos) gets a _designed_ mobile substitute, never a hidden hole.

## Anti-references

What the site must **not** look like. If a layout drifts toward any of these, stop and rewrite.

- **Her current Google Sites page** — the floor we are rising from: templated chrome, generic sans, stock landscape photos, no headshot, no painterly identity. She calls it "too simple and amateur."
- **BetterHelp / Talkspace clinical telehealth** — sky blue + white + cheerful sans + sticky CTA.
- **Wellness-startup pastel** (Calm, Headspace, Mindbloom).
- **Stock photography of therapy clichés** — hands, cliffs at sunset, journals with coffee.
- **Generic "modern" tech site** — Inter sans, dark mode with neon, gradient buttons, glassmorphism.
- **Auto-generated geometric mandalas** — parametric SVG, "sacred geometry" generators. The references are _paintings_.
- **Greens-and-whites "natural therapy" palette.**
- **Cards-everywhere SaaS layout.**
- **Border-left accent stripes, gradient text, side-stripe callouts** — banned per impeccable's absolute rules.
- **The saturated feed transplanted:** the site is not Instagram-on-a-domain. Calm parchment UI; the paintings carry the color. Same world, grown up.

## Carve-outs

Site-wide rules above stand by default. Specific, named, **scoped** suspensions live here. Any new suspension requires a new entry; do not generalize an existing one.

### Cosmos (celestial-atlas set-piece, home page — desktop)

**Scope.** `src/ui/home/Cosmos*` and the home page that consumes it. Nowhere else. The home's single wow set-piece (the painted wheel owns /analise; **one wow per page, never competing**).

**Suspended (only inside the scope).** "Painterly, not generated" and "symbols never as decoration."

**Permitted inside the scope.** Parametric star positions / twinkle / constellation-line animation via Three.js / `@react-three/fiber`; an armillary sphere from real 3D geometry (concentric torus rings + central gilt sun, baked light, no real lighting); multi-layer parallax star field + scroll-driven camera path; sparse painted cosmic atmosphere (a few textured nebula planes, one Milky Way band, one painted comet at a time); constellation line networks (thin gilt strokes ≤ 1.5px on real RA/Dec positions) + bright vertex-star sprites; twelve zodiac sigils as small painted-style cartouches; a scroll-pinned cinema timeline; and a **painted-scene prelude** of discrete cut-out props (clouds, horizon strip, trees, rocks, a _single solitary contemplative figure_). **AI image generation is permitted for the prelude prop assets only**, by direct user direction.

**Mobile / reduced motion.** The slot gets a **designed substitute** — A Lâmina (one painting as a scroll-cinema, CONCEPT §9.1) or, minimally, a full-bleed painted celestial plate — **never a hidden section, never a raw static screenshot of the desktop scene.**

**Still forbidden inside the scope.** Parametric mandalas / generated "sacred geometry" / AI-flourish ornament; a dark starfield-simulation ground (the section stays on parchment); AI-generated imagery for any asset _other than_ the named prelude props (everything else: public-domain Renaissance plates — Bayer, Cellarius — commissioned hand-painted assets, or procedural shaders); real lighting / glow / bloom; any astrological reading or predictive language (the zodiac is Jungian _vocabulary_, not prediction); any two-figure / romantic reading of a figure — the practice is individual analysis.

**Why it exists.** A moment of wonder serves the home's emotional contract — the practice's territory (individuação, depth, archetypes) lives in what the section evokes. It closes the page, after Contato: the wow is the farewell, never an obstacle between a visitor and the ask. The risk that it becomes the site's _real_ identity is managed by parchment tone, vocabulary-not-prediction framing, its end-of-page position, and bounded scroll real estate.
