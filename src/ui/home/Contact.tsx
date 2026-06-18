import Link from "next/link";
import { SECTION_ACCENT } from "@/core/accentHeading";
import type { Home } from "@/core/home";
import type { Identity } from "@/core/identity";
import { AccentHeading } from "./AccentHeading";
import { RichTextProse } from "./RichTextProse";

export function Contact({ identity, content }: { identity: Identity; content: Home["contact"] }) {
  return (
    <section
      id="contato"
      aria-labelledby="contact-heading"
      className="bg-parchment-deep px-6 py-32 sm:px-10 sm:py-44 lg:py-52"
    >
      <div className="mx-auto max-w-3xl">
        {content.eyebrow && (
          <p className="tracked mb-6 text-center sm:text-left">{content.eyebrow}</p>
        )}

        <h2
          id="contact-heading"
          className="display text-foreground text-balance text-center text-[clamp(2rem,4.4vw,3rem)] leading-[1.12] tracking-[-0.01em] sm:text-left"
        >
          <AccentHeading heading={content.heading} accent={SECTION_ACCENT.contact} />
        </h2>

        <RichTextProse
          data={content.body}
          className="body-prose text-ink mt-12 max-w-[58ch] text-[1.085rem] leading-[1.74]"
        />

        <address className="not-italic block">
          <div className="mt-14">
            <a
              href={identity.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-terracotta-deep hover:bg-foreground group inline-flex items-baseline justify-between gap-6 px-7 py-5 text-parchment no-underline transition-colors sm:justify-start"
              aria-label={`Iniciar conversa pelo WhatsApp ${identity.phoneDisplay}`}
            >
              <span className="flex flex-col items-start gap-1">
                <span className="display-italic text-[1.2rem] sm:text-[1.3rem]">
                  {content.whatsappLabel}
                </span>
                <span className="text-parchment/75 text-[0.92rem] tracking-wide">
                  {identity.phoneDisplay}
                </span>
              </span>
              <span
                aria-hidden="true"
                className="display text-[1.2rem] transition-transform group-hover:translate-x-1 sm:text-[1.3rem]"
              >
                →
              </span>
            </a>

            {identity.email && (
              <p className="marginalia mt-5">
                ou por e-mail —{" "}
                <a
                  href={`mailto:${identity.email}`}
                  className="text-quill hover:text-terracotta decoration-terracotta/40 hover:decoration-terracotta underline decoration-1 underline-offset-[0.25em] transition-colors"
                >
                  {identity.email}
                </a>
              </p>
            )}

            <p className="marginalia mt-3">
              <Link
                href="/perguntas"
                className="text-quill hover:text-terracotta decoration-terracotta/40 hover:decoration-terracotta underline decoration-1 underline-offset-[0.25em] transition-colors"
              >
                {content.faqLinkLabel}
              </Link>{" "}
              <span aria-hidden="true" className="text-terracotta/70">
                →
              </span>
            </p>
          </div>

          <dl className="text-quill mt-14 grid grid-cols-1 gap-y-8 sm:grid-cols-2 sm:gap-x-12">
            <div>
              <dt className="display text-quill mb-2 text-[0.96rem]">Atendimento presencial</dt>
              <dd className="text-foreground text-[1.1rem] leading-[1.4]">
                {identity.city}–{identity.region}
              </dd>
            </div>

            <div>
              <dt className="display text-quill mb-2 text-[0.96rem]">Atendimento online</dt>
              <dd className="text-foreground text-[1.1rem] leading-[1.4]">
                Em todo o {identity.country}
              </dd>
            </div>

            {identity.availability.hours && (
              <div>
                <dt className="display text-quill mb-2 text-[0.96rem]">Faixa de horário</dt>
                <dd className="text-foreground text-[1.1rem] leading-[1.4]">
                  {identity.availability.hours}
                </dd>
              </div>
            )}

            {identity.availability.responseNote && (
              <div>
                <dt className="display text-quill mb-2 text-[0.96rem]">Tempo de resposta</dt>
                <dd className="text-foreground text-[1.1rem] leading-[1.4]">
                  {identity.availability.responseNote}
                </dd>
              </div>
            )}
          </dl>
        </address>
      </div>
    </section>
  );
}
