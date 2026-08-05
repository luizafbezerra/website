import Image from "next/image";
import type { Home } from "@/domain/home/Home";
import type { Clinica } from "@/domain/clinica/Clinica";
import { RichTextProse } from "@/view/general/RichTextProse";
import { WhatsAppGlyph } from "@/view/general/WhatsAppGlyph";

const PORTRAIT_FALLBACK = "/portrait/luiza.jpg";

export function Hero({ clinica, content }: { clinica: Clinica; content: Home["hero"] }) {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative px-6 pt-40 pb-24 sm:px-10 sm:pt-44 sm:pb-32 lg:pt-48 lg:pb-40"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-12 lg:grid lg:grid-cols-[1.45fr_1fr] lg:gap-x-20 lg:gap-y-14">
        {/* Identity first — on every viewport a stranger meets who she is and
            what she does before the portrait. On desktop this anchors the
            top-left cell of the two-column grid. */}
        <div className="lg:col-start-1 lg:row-start-1">
          {/* Her positioning sentence, verbatim — the line that says where the
              visitor is and how far the practice reaches (CONCEPT §2). */}
          <p className="tracked mb-8 text-center sm:text-left">{clinica.positioning}</p>

          <h1
            id="hero-heading"
            className="display text-foreground text-balance text-center text-[clamp(2.6rem,6vw,4.4rem)] leading-[1.05] tracking-[-0.012em] sm:text-left"
          >
            <span className="block">{clinica.fullName}</span>
            <span className="display-italic text-terracotta-deep mt-3 block text-[0.42em] tracking-[0.05em]">
              {content.subtitle}
            </span>
          </h1>
        </div>

        {/* TODO: replace with portrait served from PayloadCMS once content extraction lands */}
        {/* Portrait in a supporting role: capped on mobile so it follows the
            name rather than filling the first screen; on desktop it fills the
            right column across both text rows. */}
        <figure className="mx-auto w-[min(17rem,72%)] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mx-0 lg:w-full lg:max-w-[26rem] lg:self-start lg:pt-2">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src={content.portraitUrl ?? PORTRAIT_FALLBACK}
              alt={`Retrato de ${clinica.fullName}, ${clinica.role.toLowerCase()}`}
              fill
              priority
              sizes="(min-width: 1024px) 26rem, 17rem"
              className="vignette object-cover"
            />
          </div>
          <figcaption className="marginalia mt-5 text-center lg:text-left">
            <span className="display-italic text-ink-soft">{clinica.shortName}</span> — atendimento
            on-line, Brasil e exterior.
          </figcaption>

          {/* A quiet WhatsApp affordance for hesitant phone visitors, right under
              the portrait. Desktop hides it — the solid primary button below
              already carries the action. */}
          <a
            href={clinica.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-terracotta-deep hover:text-terracotta mt-4 inline-flex items-baseline gap-2 text-[0.95rem] no-underline transition-colors lg:hidden"
            aria-label={`Iniciar conversa pelo WhatsApp ${clinica.whatsappDisplay}`}
          >
            <WhatsAppGlyph className="text-terracotta h-[1.05em] w-[1.05em] -translate-y-px" />
            <span className="display-italic decoration-terracotta/40 underline decoration-1 underline-offset-[0.28em]">
              Conversar agora
            </span>
          </a>
        </figure>

        {/* Body + actions. On desktop this is the bottom-left cell, beneath the
            identity block and sharing the left column with it. */}
        <div className="lg:col-start-1 lg:row-start-2">
          <div className="mb-10 flex items-center justify-center sm:justify-start">
            <span className="bg-terracotta/70 h-px w-24" />
          </div>

          <RichTextProse
            data={content.lead}
            className="body-prose dropcap text-ink max-w-[60ch] text-[1.115rem] leading-[1.72]"
          />

          <div className="mt-12 flex flex-col items-center gap-5 sm:items-start">
            <a
              href="#contato"
              className="bg-terracotta-deep hover:bg-foreground group inline-flex items-baseline gap-3 px-7 py-4 text-parchment no-underline transition-colors"
            >
              <span className="display-italic text-[1.05rem]">{content.ctaPrimaryLabel}</span>
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </a>

            <a
              href="#abordagem"
              className="marginalia text-quill hover:text-terracotta decoration-terracotta/40 hover:decoration-terracotta inline-flex items-baseline gap-2 underline decoration-1 underline-offset-[0.28em] transition-colors"
            >
              <span>{content.ctaSecondaryLabel}</span>
              <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
