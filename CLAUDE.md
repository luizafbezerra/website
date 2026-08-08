# Project guide for AI agents

This project was scaffolded from the `next-payload-template`. Skills live at `.agents/skills/` (real dir) with `.claude/skills/` symlinks.

Architecture: the four-layer layout from the `frontend:layered-frontend-architecture` skill — invoke it before any feature work:

- `src/infrastructure/` — Payload local-API accessors, browser storage. No rules, no React.
- `src/domain/` — types, rules, transitions. No React/Next imports, no URLs.
- `src/view/` — React components/hooks/providers, feature-first. Never sees raw Payload shapes.
- `src/app/` — Next.js routes, thin (fetch via domain action → serialize → render view page) + Payload admin.
- `src/payload/` — CMS schema (collections, globals, seed) — backend, outside the frontend layers.

Two conventions the layers depend on: **no barrel files** (import from the defining module) and **named exports** everywhere except where a framework demands a default. Each concept splits into a type file, a mapper, and an action, so a client component can import `type Identity` without dragging a server-only Payload accessor into the bundle. The raw `PayloadX` response shapes live in `src/infrastructure/payload/` beside the accessor that returns them; the domain mapper imports them downward. Request-scoped `cache()` sits on the accessors, where the I/O is — never in `src/domain/`, which stays free of framework imports so its tests need no React.

Enforcement is the skill's review checklist + colocated vitest domain tests (`pnpm test`, node env, `src/domain/**/*.test.ts`) — there is no arch-check script.

For Payload admin: `pnpm payload` to create the first user. For Neon dev branch: `pnpm db:branch`.

## Design Context

**Símbolos do Self** — the online analytical-psychology clinic of psychologist **Luiza Fernandes Bezerra** (the tradition Jung named _analytical psychology_ — never "psicologia junguiana"; the adjective "Jungian"/"junguiano" is reserved for Jung himself, his work and his vocabulary). Site language: **pt-BR**. Her canonical positioning sentence, verbatim, wherever positioning lives: _"Clínica de psicologia analítica (Jung) on-line para todo o Brasil e exterior."_

Source-of-truth documents — read before any product or design work:

- **`CONCEPT.md`** — the agreed experience concept: the 8-page map, the two-door service model (Análise · Orientação profissional e de carreira), art direction, the creative menu, policies, open points. Wins on specifics.
- **`PRODUCT.md`** — canonical who/what/why: ranked audiences (Instagram followers → cold pt-BR searchers → Brazilians abroad → AI agents), positioning, offer, constraints, evidence on hand, the Cosmos carve-out.
- **`DESIGN.md`** — the design system: tokens, the two-voice typography, plate grammar, components, do's and don'ts.

> **Note:** the currently built site (the home sections, `/perguntas`, `/privacidade`) predates CONCEPT.md — its copy still describes in-person work in Guarulhos. The blog and `/simbolos` are already gone; the eight CONCEPT pages arrive in Phase 6 of `plan/architecture-site-restructure-1.md`. Do not treat existing routes or content as product truth.

Facts that bind every session:

- **Online-only.** No page, image, or metadata may claim in-person practice. Reach: Brasil e exterior; sessions in pt/en.
- **North star: WhatsApp conversations started.** WhatsApp `+55 11 96415-8128` is the funnel (in-flow CTA — never sticky, never a floating bubble); email `luizafbezerra@gmail.com`.
- **The world recruits; the person converts.** Símbolos do Self is the place; Luiza is the person who receives you. Every screen answers "where am I?" and "who will receive me here?"
- **Symbols index content, never the visitor.** No birthdate, no "your sign", no personalised readings — anywhere, ever. Measurement is aggregate and cookieless only (Vercel Web Analytics: paths, referrers, countries — the international-reach signal); the only cookie is the language preference; nothing identifies a visitor, so no consent banner exists.
- **Her supplied text is the source copy.** Nothing visitor-facing ships in her name that she didn't write or sign off.
- **Trust, not urgency.** No sticky CTAs, countdowns, or scarcity; no forms, chatbots, popups, or newsletter modals; no blog; no dark mode.
- **Painterly, not generated.** Earth pigments on warm parchment; the plates (public-domain classical paintings, provenance verified) are the only saturation on screen; all-serif (Cardo display + Vollkorn body); no parametric mandalas or AI decoration outside the Cosmos carve-out.
- **Two audiences, both first-class** — humans and AI agents/LLM search. Front-load every page (who · what · for whom · how to reach); JSON-LD via `src/view/seo/jsonLd.tsx` (never bypassed); Markdown twins of content pages + `/llms.txt`; WCAG 2.1 AA; reduced-motion alternatives everywhere; LCP < 2.5s on 4G; mobile-first.
