import Image from "next/image";
import { Luiza } from "@/core";
import { WhatsAppGlyph } from "./WhatsAppGlyph";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative px-6 pt-40 pb-24 sm:px-10 sm:pt-44 sm:pb-32 lg:pt-48 lg:pb-40"
    >
      <div className="mx-auto grid max-w-6xl items-start gap-14 lg:grid-cols-[1.45fr_1fr] lg:gap-20">
        <div className="order-2 lg:order-1">
          <p className="tracked mb-10 text-center sm:text-left">
            Consultório psicológico · estabelecido em {Luiza.city}
          </p>

          <h1
            id="hero-heading"
            className="display text-foreground text-balance text-center text-[clamp(2.6rem,6vw,4.4rem)] leading-[1.05] tracking-[-0.012em] sm:text-left"
          >
            <span className="block">{Luiza.fullName}</span>
            <span className="display-italic text-terracotta-deep mt-3 block text-[0.42em] tracking-[0.05em]">
              Para a vida adulta
            </span>
          </h1>

          <div className="my-12 flex items-center justify-center sm:justify-start">
            <span className="bg-terracotta/70 h-px w-24" />
          </div>

          <div className="body-prose dropcap text-ink max-w-[58ch] text-[1.115rem] leading-[1.72]">
            <p>
              Atendo adultos em momentos em que a vida cotidiana parece insuficiente para conter o
              que está acontecendo — uma <em>ansiedade</em> que não passa, um <em>luto</em> recente,
              um trabalho que perdeu o sentido. Escuto o que insiste e o que ainda não encontrou
              palavras.
            </p>
          </div>

          <div className="mt-14 flex flex-col items-center gap-5 sm:items-start">
            <a
              href="#contato"
              className="border-terracotta-deep text-terracotta-deep hover:bg-terracotta-deep hover:text-parchment group inline-flex items-baseline gap-3 border px-6 py-3 no-underline transition-colors"
            >
              <span className="display-italic text-[1.05rem]">marcar uma conversa</span>
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </a>

            <a
              href="#abordagem"
              className="marginalia text-quill hover:text-terracotta decoration-terracotta/40 hover:decoration-terracotta inline-flex items-baseline gap-2 underline decoration-1 underline-offset-[0.28em] transition-colors"
            >
              <span>conhecer a abordagem antes</span>
              <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>

        {/* TODO: replace with portrait served from PayloadCMS once content extraction lands */}
        <figure className="order-1 mx-auto w-[min(20rem,80%)] lg:order-2 lg:mx-0 lg:w-full lg:max-w-[26rem] lg:pt-2">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="/portrait/luiza.png"
              alt={`Retrato de ${Luiza.fullName}, ${Luiza.role.toLowerCase()}`}
              fill
              priority
              sizes="(min-width: 1024px) 26rem, 20rem"
              className="vignette object-cover"
            />
          </div>
          <figcaption className="marginalia mt-5 text-center lg:text-left">
            <span className="display-italic text-terracotta-deep">{Luiza.shortName}</span> —
            atendimento presencial e online em todo o {Luiza.country}.
          </figcaption>

          {/* Above-the-fold action on mobile only. Desktop already shows the
              outlined "marcar uma conversa" button in the left column above
              the figure; on phones the portrait-first ordering pushes that
              button below the fold, so this tiny WhatsApp affordance gives
              hesitant phone visitors a tappable next step without scrolling. */}
          <a
            href={Luiza.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-terracotta-deep hover:text-terracotta mt-4 inline-flex items-baseline gap-2 text-[0.95rem] no-underline transition-colors lg:hidden"
            aria-label={`Iniciar conversa pelo WhatsApp ${Luiza.phoneDisplay}`}
          >
            <WhatsAppGlyph className="text-terracotta h-[1.05em] w-[1.05em] -translate-y-px" />
            <span className="display-italic decoration-terracotta/40 underline decoration-1 underline-offset-[0.28em]">
              Conversar agora
            </span>
          </a>
        </figure>
      </div>
    </section>
  );
}
