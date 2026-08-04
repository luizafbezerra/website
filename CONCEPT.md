# CONCEPT.md — Símbolos do Self · the website concept (v2)

> **Status: draft for agreement.** This describes the site as an experience — pages, sections,
> images, identity, features — as if nothing were built yet. Copy is deliberately out of scope
> (it lives in the CMS and will change). Once this is agreed, we write the implementation spec
> that maps it onto the codebase, and PRODUCT.md / DESIGN.md get synced to match.

## 1. The two goals

1. **Capture as many clients as possible.** North-star: WhatsApp conversations started.
2. **Capture and keep her identity — the vibe of @simbolos.do.self — on the website.**

The tension: conversion wants clarity and reassurance; the Instagram vibe wants art and
contemplation. The resolution: **the art earns the trust that converts.** Her world is the
reason a visitor with four therapist tabs open closes the other three.

## 2. What the site is

**Símbolos do Self is the place. Luiza is the person who receives you there.**

Her tradition distinguishes the archetypal (collective, symbolic) from the personal. The site
enacts it: the **world** speaks in ornament, plates, Jung's words and the mandala mark; **Luiza**
speaks in first-person prose, the portrait, the origin story. The operational test: every
screen must answer two questions at a glance — _"where am I?"_ (Símbolos do Self) and _"who
will receive me here?"_ (Luiza). If an element can't say which voice it belongs to, it gets
rewritten.

**The world recruits; the person converts.**

The canonical positioning sentence, hers, verbatim, used wherever positioning lives (hero,
credential line, page descriptions):

> **"Clínica de psicologia analítica (Jung) on-line para todo o Brasil e exterior."**

And one rule governs every symbolic surface: **symbols index content, never the visitor.**
The site explores her world; it never reads you. No birthdate, no "your sign," no
personalised interpretation, anywhere, ever.

## 3. Who arrives

Ranked by warmth × volume:

1. **The Instagram follower** (45.4K and growing, verified account). Already trusts her voice;
   arrives via the bio link to check "is this a real practice?" Needs: instant recognition
   (name, mark, the paintings), credentials visible fast, WhatsApp one tap away.
2. **The cold pt-BR searcher in distress** — anxious, on a phone, often at night, comparing
   therapists. Needs: does she work with what I have, is she qualified, what happens if I
   write, what does it cost.
3. **Brazilians abroad** — Portugal, UK, USA (her three real client countries; ~5M Brazilians
   live abroad, concentrated exactly there). Search in Portuguese; pay in strong currencies.
   Need: _permission and logistics_ — "sim, atendo quem mora fora", time zones, how to pay
   from abroad. Served by the pt-BR site itself.
4. **Portuguese natives** — reached by the same pt-BR funnel; need only explicit mention that
   Portugal is normal here.
5. **English-speaking foreigners** — smallest, hardest segment. Need one complete English
   page proving she is real, licensed, and works in English. (In English she is a _"clinical
   psychologist working in the Jungian tradition"_ — never "Jungian analyst", a formally
   protected title.)
6. **AI agents / LLM search** — co-equal machine audience; every page front-loads who/what/
   how-to-reach in its first screen of content.

## 4. The offer — two doors

The practice sells **two distinct services**, and the site is organised around that:

- **Porta A — Análise (psicoterapia junguiana).** Open-ended, weekly, the core practice.
  Her three pillars live inside this door as its themes: _I ansiedade & humor · II relações
  & vida · III carreira & propósito_.
- **Porta B — Orientação profissional e de carreira.** A **bounded program**: PUC-SP
  specialization, psychological tests + conversations + proposed activities, up to 12 weekly
  online meetings, a deliverable at the end (clarity about "a profissão que faz mais sentido
  no momento atual da sua vida"). A different product with a different buyer: career-focused,
  often younger, comparison-shopping against coaches and loose vocational tests — and the
  easier first purchase, a natural gateway into análise.

One boundary sentence routes visitors between the doors: _sentido do trabalho → análise ·
qual profissão → orientação._ The two overlap at pillar III by design — that's the bridge,
not a bug.

## 5. The vibe translation — Instagram → site

What the account is: classical public-domain paintings + Jung quotes in pt-BR; "Jung para
todos!" — accessible, warm, occasionally playful; alive by posting; saturated and
image-forward. What she does there has a name in her own tradition — **amplificação**,
setting a symbol beside its parallels — and the site treats that as her signature method,
not a social-media habit.

| Instagram                                 | Website                                                                                                                                                      |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| The gallery — a stream of curated moments | The house behind the gallery — where the practice lives                                                                                                      |
| Paintings as square tiles                 | Paintings as **plates** — full editorial moments at real scale                                                                                               |
| Jung quote burned into the image          | Jung quote set in the site's own typographic voice                                                                                                           |
| Popular register ("Jung para todos!")     | Same warmth, one register deeper — and her colloquial voice survives untranslated in named places: the WhatsApp openers, the FAQ answers, the marginal notes |
| Saturated color in every tile             | Calm parchment UI; **the paintings carry the color**                                                                                                         |
| Alive by posting                          | Alive by design (§8)                                                                                                                                         |

**The recognition rule:** within the first ~1.5 mobile screens, a follower must have seen the
three signatures of the feed — the mandala mark, one classical painting, and Jung's voice.
Recognition is ambient from the first screen; it does not depend on reaching the carousel.

**The deliberate gap:** the site is calmer and more spacious than the feed — that is her own
stated goal ("me achar super profissional"). Same world, grown up.

## 6. The map

Eight pages. Every nav item is a real page; header and footer derive from one canonical page
list so they can never disagree.

```
/                       INÍCIO
│  job: decide in one scroll that she is my person — and which door is mine
├── 1  Hero             lockup "SÍMBOLOS DO SELF · por Luiza Fernandes Bezerra ·
│                       psicóloga · CRP" + her positioning sentence + portrait +
│                       lead + CTA WhatsApp + secondary CTA → /primeira-conversa
├── 2  Credencial       one line: CRP · PUC-SP · desde 2014 · on-line · pt/en ·
│                       Brasil e exterior   (only client-confirmed facts appear here)
├── 3  Instagram        ★ the bridge — the feed, titled as the world's own name;
│                       tiles that un-crop into full paintings (§9.2)
├── 4  Dois caminhos    the two doors: Análise (carrying the three pillars) ·
│                       Orientação profissional — with the boundary sentence
├── 5  O sintoma        approach digest: the symptom as a call + rotating Jung
│      como chamado     passage → /analise
├── 6  Cosmos           ★ wow (desktop) · on phones, a designed substitute — one
│                       painting as a scroll-cinema (§9.1) — never a hidden hole
├── 7  Sobre digest     4 lines + the origin-story hook → /sobre
├── 8  Brasil e         short band: Portugal · Inglaterra · EUA · pt/en
│      exterior         → /internacional
├── 9  Como é começar   3 beats, ~80 words → /primeira-conversa
├── 10 Vozes            testimonials — mix curated across both services + at least
│                       one voice from abroad (all consent-gated; hides at zero)
└── 11 Contato          WhatsApp · email · availability state · response window
                        (times anchored to horário de Brasília)

/analise                A ANÁLISE      (the approach page — for análise, the
│                       approach IS the product)
│  job: understand what Jungian analysis with her is and how it works, enough to begin
├── 1  Abertura         espaço seguro de escuta, reflexão e transformação; the
│                       symptom has a purpose — a call from the unconscious
├── 2  A visão          the whole person · individuação ("tornar-se quem você
│                       realmente é, integrando suas luzes e sombras")
├── 3  O método         free, welcoming, non-judgemental dialogue + symbolic tools:
│                       dream analysis · images/fantasies/symbols of daily life ·
│                       repetitive patterns · "é um trabalho de colaboração"
├── 4  A mandala        ★ this page's wow — the painted wheel as archetypal
│                       vocabulary (readings ship only in her words or with her
│                       sign-off; visual-only until then)
├── 5  O que as         the three pillars in full + the boundary line to
│      pessoas trazem   orientação ("quando a pergunta é qual profissão →")
├── 6  Prático          weekly · online · pt/en · Brasil e exterior
└── 7  Para começar     → /primeira-conversa · WhatsApp

/orientacao-profissional   ORIENTAÇÃO PROFISSIONAL E DE CARREIRA
│  job: decide whether this bounded program answers my career question
│       (vs a coach, vs a loose vocational test)
├── 1  Abertura         what it is; PUC-SP specialization; the promise in her words
├── 2  Para quem        first career choice · transition · work that lost meaning ·
│                       restarts (younger adults enter through this door)
├── 3  O percurso       up to 12 weekly online meetings: tests + conversations +
│                       activities; what you leave with
├── 4  Nem coaching,    the honest comparison: a licensed psychologist, tests
│      nem teste solto  inside a guided psychological process, vocation read in
│                       depth (the page's one Jungian anchor: vocation as a door
│                       of individuação)
├── 5  Quando a         bridge to análise → /analise
│      pergunta é
│      mais funda
├── 6  Prático          duration · online · pt/en · fee (TBD — her decision)
└── 7  Começar          → /primeira-conversa (orientação-specific opener) · WhatsApp
     NOTE: no zodiac imagery anywhere on this page — a wheel next to psychological
     tests would read as predictive assessment. Its art moment, if any, is a small
     painted crossroads/labyrinth plate (§9, could-have).

/sobre                  SOBRE
│  job: meet the person behind the name; verify the credentials are real
├── 1  Credencial       above the fold
├── 2  Quem é a Luiza   portrait · 22 anos na psicologia · clínica desde 2014 ·
│                       Jung in her 2nd year — "um caminho sem volta"
├── 3  Formação         the full academic record, plainly: PUC-SP graduação ·
│                       Instituto Numen pós · PUC-SP aprimoramentos (clínica
│                       junguiana; orientação profissional) · extensões (PUC-SP
│                       Psicologia e Religião; USP Fenômenos Anômalos) — no
│                       editorializing; the record speaks
├── 4  A clínica        the Símbolos do Self story: from the page (45K) to the
│                       clinic with the same name; the place-and-person idea;
│                       online, Brasil e exterior, pt/en
└── 5  Assinatura       her signature closes the page

/primeira-conversa      A PRIMEIRA CONVERSA
│  job: cross the threshold — know exactly what happens when I write, and write
├── 1  Passo a passo    I–V in manuscript numerals: message → scheduling → the
│                       day → the fifty minutes → what you decide after
├── 2  Permissões       "você não precisa preparar nada · não precisa saber
│                       nomear o que sente · não existe assunto pequeno demais"
├── 3  Logística        fee (TBD) · duration · platform · rescheduling · time
│                       zones · languages
├── 4  Mini-FAQ         the 4–5 threshold doubts → /perguntas
└── 5  O bilhete        pre-written WhatsApp openers, tap to choose: one for
                        análise · one for orientação · one "não sei qual caminho
                        é o meu" · one in English. Each opener is worded per
                        origin — the arriving message tells her where the
                        conversation began (attribution in her voice, zero
                        tracking of the visitor)

/perguntas              PERGUNTAS
│  job: resolve the one specific doubt stopping me from writing
├── 1  Sobre a análise
├── 2  Sobre a orientação profissional
├── 3  Prático          fees · schedules · confidentiality online · video sessions
└── 4  Internacional    time zones · paying from abroad · sessions in English

/internacional          BRASIL E EXTERIOR
│  job: confirm she attends from where I live — fuso, payment, language — and how
├── 1  Abertura         brasileiros no exterior e estrangeiros ao redor do mundo;
│                       real history: Portugal · Inglaterra · EUA; "o atendimento
│                       segue a regulamentação brasileira de telepsicologia" (a
│                       trust signal, not a disclaimer)
├── 2  Para brasileiros terapia em português, no seu fuso — with city examples
│      fora do Brasil   (Lisboa, Londres, Nova York)
├── 3  In English       one short English section: Jungian-oriented psychotherapy
│                       and career guidance, online, in English (seeds /en)
├── 4  Prático          time zones · international payment · video platform
└── 5  Começar          → /primeira-conversa (international/English opener)

/privacidade            footer only — finished text, one honest line: the site
                        stores nothing about you; the note you write composes a
                        WhatsApp link in your own browser

HEADER (all pages)      mark + lockup left · Análise · Orientação profissional ·
                        Sobre · Primeira conversa · [WhatsApp] as the visually
                        distinct terminal item. Sticky, never hiding, never a
                        floating bubble. (Perguntas and Internacional live in the
                        footer and as contextual links where the doubt occurs.)

FOOTER (all pages)      three columns — A clínica (pages) · Começar (primeira
                        conversa, perguntas, internacional, WhatsApp, email,
                        availability) · O mundo (Instagram, CRP, "português e
                        inglês · Brasil e exterior", privacidade) — plus the
                        colophon band: the canonical sentence binding clinic name
                        to her name + CRP, plate credits, © year
```

**Reserved for the future (URLs decided now, zero cost):**

- **/en** is the root of all English content, forever. Day one (deferred): one complete,
  self-contained English page — who she is, licensed Brazilian clinical psychologist, CRP,
  22 years, the approach in three paragraphs, sessions in English, fee guidance in USD,
  time-zone note, how the first conversation works, WhatsApp _and email at equal weight_,
  an English pre-written opener. Never a teaser. At i18n time, /en grows into /en/\* with
  translated slugs; pt-BR stays at the root as canonical; hreflang ships the day /en exists.
  No URL ever migrates between phases.
- **/vocabulario** — Jungian terms in her own words; no route until the words exist.

## 7. Art direction

### Pictures — four classes, each with a job

1. **The portrait.** The single highest-leverage asset the site doesn't have. The current
   photo is a casual selfie; as the first image beside competitors' professional headshots it
   re-creates the exact amateur register she is paying to leave. Not vanity — the
   practitioner's photo is consistently among the top decision factors in therapist choice.
   45 minutes, natural light, calm background, 2–3 frames. The hero stays _type-led_ (the
   lockup and her sentence speak first); the portrait enters as _the person who receives
   you_ — editorially set, plate-like — never a full-bleed marketing headshot.
2. **The plates — her curation becomes the site's visual matter.** A **plate** is one
   classical painting given a full editorial moment: generous parchment around it, never
   cropped into a card, never a texture behind text; a marginalia caption in the
   gallery-label voice (painter, title, year); at most one or two per page, at section-scale
   moments; always public-domain from a clean scan (museum/open-access sources); selected by
   her feed's own amplificação logic — the image sits beside the idea it amplifies. The
   plates are the **only saturated elements on any screen**: the 60-30-10 pigment rule
   governs the UI, not the art. Every page carries at least one plate; the home carries
   several.
3. **The mandala mark** — her existing avatar, the image 45K people already associate with
   her: header mark, favicon, social-share mark, section-break ornament. Sanctioned ornament
   sources are exactly two: the mark, and details cropped from the plates. If that proves
   thin, the escalation path is commissioning a small set of hand-painted symbols — never
   generation.
4. **The two wow set-pieces** — the Cosmos (home) and the painted wheel (/analise). One per
   page, never competing. On phones the Cosmos slot gets a _designed substitute_ (§9.1), not
   a hidden section.

**Provenance policy:** every image on the site has verified public-domain status or explicit
rights before launch. Several current picks fail that test and are replaced. **Banned stays
banned:** stock therapy clichés, AI decoration outside the Cosmos carve-out, generated
"sacred geometry."

### Color

Warm parchment, near-black warm ink, terracotta as the one recurring accent, cobalt/ochre/
moss/gilt as rare events. The paintings carry the saturation; the UI stays quiet around them.

### Typography

Two scholarly serifs (display + body), all-serif throughout, italics carry voice. Two voices,
formalised: **tracked small-caps labels = the world speaking; body prose and italics = Luiza
speaking.** Jung passages get one consistent, ownable typographic treatment — the site's
equivalent of her tile format. Operational facts (fees, availability, credentials) are never
set in decorative small type: marginalia is for voice, not for facts someone must act on.

## 8. Alive, and the touches

Ordered by conversion impact:

1. **O bilhete** — the pre-written openers (§6, /primeira-conversa). Kills blank-message
   paralysis at the moment of highest anxiety, and doubles as the site's entire analytics
   system: the opener's wording tells her which page and which service the conversation came
   from. No tracking, LGPD-clean.
2. **Availability state** — one editable line, three states: _com horários disponíveis ·
   lista de espera curta · sem novos atendimentos no momento — escreva e eu aviso._ The
   third state is the anti-urgency move and prevents messages into silence.
3. **Response window** — "respondo em até um dia útil (horário de Brasília)."
4. **The live feed** — the site updates when she posts. CMS-curated tiles until the Meta
   connection is done on her side; live thereafter.
5. **The rotating Jung passage** — drawn from a pool she grows in the CMS; the site says
   something new between visits.
6. **The "por" lockup** — `SÍMBOLOS DO SELF · por Luiza Fernandes Bezerra` — the duality in
   one word, everywhere the mark appears.
7. **The colophon sentence** — every page's footer states, once, canonically: Símbolos do
   Self is the online clinic of psychologist Luiza Fernandes Bezerra (CRP). Humans, Google
   and LLMs all read the same binding.
8. **The credential line** — who · how · from-where-to-where · what, in one strip on every
   core page. Only client-confirmed facts enter it.
9. **Currency & time-zone policy** — pt-BR pages quote BRL (or "a combinar"); the
   international page and /en quote USD/EUR on their own terms ("valores em dólar/euro —
   combinamos na primeira conversa"), never automatic side-by-side conversion. All times
   anchored to horário de Brasília with city examples abroad.
10. **Micro-motion with restraint** — nudge, fade, color; wonder concentrated in exactly one
    set-piece per page; every animation has a reduced-motion alternative.

## 9. The creative menu — invited ideas, effort-tagged

In the Cosmos's spirit (her astrology affinity, symbols as vocabulary). None reads the
visitor; all have reduced-motion fallbacks; each is only as good as its painted assets —
a vector stand-in inverts any of them into banned generated ornament.

**The three best:**

1. **A Lâmina — one painting as the mobile scroll-cinema.** ★ the Cosmos substitute on
   phones. The viewport becomes a lens travelling down a tall crop of one classical canvas
   at near-1:1 scale — brushwork, craquelure, a face emerging — two or three rubricated
   captions surfacing at chosen details, ending on the whole plate with painter, year, and
   one line from her. Does the one thing a 1080px feed tile cannot: scale. Her curation, so
   the wow is hers. _(medium)_
2. **O quadro inteiro — the tile that un-crops.** In the Instagram section, each tile
   appears as the square followers know; tap, and the frame expands — the rest of the canvas
   fades in around the familiar fragment, with painter, year, and the Jung passage she
   paired. Performs the site's thesis in two seconds: _the feed shows the crop; the house
   shows the whole painting._ _(medium)_
3. **Sonho ampliado — her method, demonstrated.** On /analise: one archetypal dream motif
   ("sonhei que encontrava um cômodo desconhecido na minha casa") — touch it and three
   parallels arrange themselves beside it like plates on a table: a painting detail, a myth
   in one line, a Jung passage. Closing line in her voice. The only idea that _demonstrates_
   the method instead of decorating the page — and it amplifies the site's material, never
   the visitor's. Her words required. _(medium)_

**The "alive" family — ship at most one to start:**

4. **A lua no colofão** — eight small painted moon-phase plates; the footer shows tonight's
   actual phase ("sob a lua minguante de agosto"). Books of hours tracked the moon; every
   page gets a heartbeat for near-zero cost. Kept in the colophon, far from the CTA. _(small)_
5. **O céu desta noite** — the Cosmos driven by the real sky over São Paulo tonight,
   rendered through the existing painted vocabulary; a server-side static star-chart plate
   becomes the mobile/reduced-motion frame. The strongest "alive between visits" signal
   possible. _(large)_
6. **Estações da casa** — the hero plate, section symbols and one colophon line rotate with
   the actual Brazilian season, from four CMS-scheduled sets she curates. Alive by curation —
   her actual skill — with a southern-hemisphere correctness that quietly says "this is
   hers, not a template." _(medium; creates a 4×/year curation ritual)_

**Craft touches:**

7. **O selo** — choosing a bilhete opener folds the note once and presses her mandala mark
   into it like a wax seal (<600ms, never blocking the WhatsApp handoff). The scariest tap
   on the site becomes sending a letter to a person. _(small)_
8. **Glosa — the English line in the margin.** Real manuscript practice: one interlinear
   English sentence in the hero margin and on /sobre — "Sessions also in English — for
   Brazilians abroad and English speakers" → /internacional (later /en). One line, one place
   per page; never a flag icon or language dropdown. _(small)_
9. **Iluminura que se pinta** — each core page's opening drop cap paints itself in (~1.2s,
   stroke-masked over a genuinely painted initial), then is still forever. Enacts
   "hand-made" instead of asserting it. Requires real painted initials first. _(medium)_
10. **O fio — Ariadne's red thread.** On the two longest reads, a hand-drawn terracotta
    thread runs the margin connecting the rubricated key sentences, ending at the CTA —
    wayfinding disguised as rubrication, named in one marginal note (the labyrinth is fair
    Jungian vocabulary). Survives only if genuinely irregular and drawn. _(medium)_
11. **A mandala que respira** — between home sections, the mark scales ±2% on a slow
    six-second cycle beside one Jung line on mandalas as centering. Never labelled a
    breathing exercise; no instructions, no timer. One step from a meditation-app cliché —
    the guardrails are absolute. _(small)_
12. **Vocabulário iluminado** — the first occurrence of sombra/persona/anima/Self/
    individuação carries a small rubric mark; tap opens a marginal gloss (mobile: a footnote
    drawer) with her one-paragraph plain-Portuguese definition. Her captions' job, done in
    the site's idiom — and each gloss is a quotable pt-BR definition for LLM search. Her
    definitions required; capped at ~5 terms per page. When /vocabulario comes, it simply
    collects glosses that already exist. _(medium)_

## 10. Being found

- **As "Símbolos do Self":** domain decision made with her (recommend simbolosdoself.com.br,
  plus .com if free); title pattern `<página> · Símbolos do Self`, home title carrying the
  positioning sentence + her name; structured data declaring the clinic (professional
  organization, no street address — online-only), the person (credentials, alumniOf,
  languages pt/en), the two services, and `sameAs` binding the Instagram account and
  directory profiles into one entity. The Google→Instagram bridge she asked for is built
  here, not asserted.
- **The share loop:** the social-share card (from the plate system) exists _before_ she
  announces the site to the account — that announcement is the largest share event the site
  will ever have. Every WhatsApp share of her link renders this card.
- **Search reality, stated honestly:** with no blog, organic reach = brand-name queries +
  commercial-intent pages. The strongest non-brand asset is **/orientacao-profissional**
  ("orientação profissional online" is a real commercial vertical almost no Jungian
  occupies); /analise targets the "análise junguiana / terapia junguiana online" cluster;
  /internacional targets the expat queries ("psicóloga brasileira online exterior") in the
  words expats actually type. /vocabulario is the future long-tail unlock.
- **AEO:** every page front-loads its complete answer (what · for whom · format · languages ·
  reach) in the first screen of content; clean markdown twins of the content pages; a
  machine-readable index of public content; FAQ structured as discrete Q&A blocks (análise ·
  orientação · prático · internacional) — the exact questions assistants get asked.
- **Directories** (off-site, part of launch): Doctoralia profile with photo + CRP +
  teleconsulta; the expat channel is her own Instagram — the fixed bio link landing on a
  hero that says "Brasil e exterior" closes that loop by itself.

## 11. Policies (the compact block — all of them)

- **Authorship:** her supplied text is the source copy — we organize, trim and typeset it;
  we never invent her voice. Nothing visitor-facing ships in her name that she didn't write
  or sign off. (This covers the wheel's readings: visual-only until her words exist.)
- **Provenance:** every image verified public-domain or cleared before launch.
- **Online-only:** no page, image or metadata may claim in-person practice.
- **One page registry:** every navigation surface derives from a single canonical list.
- **Consent:** testimonials render only when consent is recorded — structurally, not as
  policy. Presentation: first name or initial + context ("M., orientação de carreira"),
  verbatim words, no star ratings.
- **Professional standards, once:** the clinic name always appears bound to her name + CRP;
  no promised outcomes anywhere ("individuação" is described as a concept, never as _your_
  guaranteed result); symbols are vocabulary, never prediction.

## 12. Will · Should · Could · Won't

### WILL have

- The 8-page map of §6, each page owning one visitor job; header/footer as specified
- The two-door service model, with /orientacao-profissional as a full service page
- Her positioning sentence verbatim as the canonical line
- Marca conjunta: "por" lockup + colophon sentence + credential line
- Instagram bridge high on the home (curated tiles first, live feed when she completes the
  Meta connection)
- Cosmos on the home with a **designed mobile substitute** (A Lâmina or, minimally, a
  full-bleed painted celestial plate) — the wheel on /analise, visual-first
- /primeira-conversa with the service-aware bilhete (incl. the English opener)
- /internacional with the expat logistics + the In-English section
- The portrait (real one), the plate grammar, the mandala-mark system
- Availability state + response window; currency & time-zone policies
- Being-found package: domain, title pattern, entity graph with sameAs → Instagram,
  share card before announcement, markdown twins, machine-readable index
- The policies block (§11), WCAG 2.1 AA, reduced-motion everywhere, fast on 4G, mobile-first

### SHOULD have

- Fee published for Brazil (her call; international priced separately per §8.9)
- /en as the complete English one-pager (gates: her English copy; the /en URL is reserved
  regardless)
- O selo + Glosa (the two small creative touches with outsized identity value)
- One "alive" idea from the family (recommend the moon colophon as the cheap proof)
- Her signature closing /sobre
- Directory presence; testimonial consent round incl. one voice from abroad
- Sonho ampliado and O quadro inteiro (her words/curation required)

### COULD have

- O céu desta noite (the real-sky Cosmos upgrade) · Estações da casa · Iluminura que se
  pinta · O fio · A mandala que respira · Vocabulário iluminado
- /vocabulario when her definitions exist
- Full i18n pass: /en/\* mirroring the tree (architecture already reserved)
- A small painted crossroads plate as orientação's art moment

### WON'T have

- Sticky CTAs, floating WhatsApp bubbles, urgency mechanics of any kind
- Online booking/calendar (WhatsApp is the funnel; a scheduler adds friction she doesn't need)
- Forms that collect personal data; chatbots; popups; newsletter modals
- Anything that reads the visitor — no birthdate, no "your sign", no personalised readings
- A blog (its old jobs are reassigned: companionship → the Instagram bridge + rotating
  passages; search depth → the service pages, FAQ and, later, /vocabulario)
- Dark mode; auto-published content; zodiac imagery on the orientação page
- English anywhere except the glosa lines, /internacional's In-English section, and /en

## 13. What we need from Luiza

1. **Portrait session** — the one asset money must buy; everything else ships around it.
2. **Fee decision** — publish or "a combinar", value(s), and whether international pricing
   differs (standard practice; her call).
3. **CRP confirmation in writing** (currently read off her public bio).
4. **Availability + response window** — two honest sentences; session length/format
   confirmation arrives free with them.
5. **The bilhete lines** — 4 openers in her voice (análise · orientação · "não sei" ·
   English). If she won't write them, we ship the plain button.
6. **6–10 Jung passages + 4–6 favorite posts** (the rotating passage pool + the curated
   carousel + the un-crop pairs).
7. **The Meta/Instagram connection** on her side (unblocks the live feed) and **the bio
   link fix** the day the site is live — the single highest-ROI minute of the project.
8. **Domain confirmation** (simbolosdoself.com.br).
9. Later, when ready: the wheel readings in her words; /en English copy; one testimonial
   from a client abroad (consent-gated).

## 14. Open points (the real ones)

1. **Fee** — publish or not; value; international differential. Hers.
2. **The wheel's readings** — her words, her sign-off on drafts, or visual-only at launch.
   Recommendation: visual-only until her text exists.
3. **Which creative touches get greenlit** — §9 is a menu, not a commitment. Recommendation:
   A Lâmina (mobile wow) + O selo + Glosa + the moon colophon for launch; the rest by appetite.
4. **Portrait logistics** — who shoots, when.
