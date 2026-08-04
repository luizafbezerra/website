# Project guide for AI agents

This project was scaffolded from the `next-payload-template`. Skills live at `.agents/skills/` (real dir) with `.claude/skills/` symlinks. Architecture rules:

- `src/core/` — pure TypeScript. No React/Next imports. No imports from `app/` or `ui/`.
- `src/lib/` — shared helpers. May import React. No imports from `app/` or `ui/`.
- `src/ui/` — React components. Consumes `core` via `lib`.
- `src/app/` — Next.js routes + server actions. Composes everything.

CI enforces these via `scripts/arch-check.sh`.

For Payload admin: `pnpm payload` to create the first user. For Neon dev branch: `pnpm db:branch`.

## Design Context

**Símbolos do Self** — the online analytical-psychology clinic of psychologist **Luiza Fernandes Bezerra** (Jungian tradition). Site language: **pt-BR**. Her canonical positioning sentence, verbatim, wherever positioning lives: _"Clínica de psicologia analítica (Jung) on-line para todo o Brasil e exterior."_

Source-of-truth documents — read before any product or design work:

- **`CONCEPT.md`** — the agreed experience concept: the 8-page map, the two-door service model (Análise · Orientação profissional e de carreira), art direction, the creative menu, policies, open points. Wins on specifics.
- **`PRODUCT.md`** — canonical who/what/why: ranked audiences (Instagram followers → cold pt-BR searchers → Brazilians abroad → AI agents), positioning, offer, constraints, evidence on hand, the Cosmos carve-out.
- **`DESIGN.md`** — the design system: tokens, the two-voice typography, plate grammar, components, do's and don'ts.

> **Note:** the currently built site (blog, /simbolos, home sections) predates CONCEPT.md. A rewrite mapping the concept onto the codebase is planned; do not treat existing routes or content as product truth.

Facts that bind every session:

- **Online-only.** No page, image, or metadata may claim in-person practice. Reach: Brasil e exterior; sessions in pt/en.
- **North star: WhatsApp conversations started.** WhatsApp `+55 11 96415-8128` is the funnel (in-flow CTA — never sticky, never a floating bubble); email `luizafbezerra@gmail.com`.
- **The world recruits; the person converts.** Símbolos do Self is the place; Luiza is the person who receives you. Every screen answers "where am I?" and "who will receive me here?"
- **Symbols index content, never the visitor.** No birthdate, no "your sign", no personalised readings, no visitor tracking — anywhere, ever.
- **Her supplied text is the source copy.** Nothing visitor-facing ships in her name that she didn't write or sign off.
- **Trust, not urgency.** No sticky CTAs, countdowns, or scarcity; no forms, chatbots, popups, or newsletter modals; no blog; no dark mode.
- **Painterly, not generated.** Earth pigments on warm parchment; the plates (public-domain classical paintings, provenance verified) are the only saturation on screen; all-serif (Cardo display + Vollkorn body); no parametric mandalas or AI decoration outside the Cosmos carve-out.
- **Two audiences, both first-class** — humans and AI agents/LLM search. Front-load every page (who · what · for whom · how to reach); JSON-LD via `src/ui/lib/jsonLd.tsx` (never bypassed); Markdown twins of content pages + `/llms.txt`; WCAG 2.1 AA; reduced-motion alternatives everywhere; LCP < 2.5s on 4G; mobile-first.
