import Link from "next/link";
import { SECTION_ACCENT } from "@/view/styling/accentHeading";
import type { Home } from "@/domain/home/Home";
import type { Clinica } from "@/domain/clinica/Clinica";
import { AccentHeading } from "@/view/general/AccentHeading";
import { RichTextProse } from "@/view/general/RichTextProse";

export function Contact({ clinica, content }: { clinica: Clinica; content: Home["contact"] }) {
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
              href={clinica.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-terracotta-deep hover:bg-foreground group inline-flex items-baseline justify-between gap-6 px-7 py-5 text-parchment no-underline transition-colors sm:justify-start"
              aria-label={`Iniciar conversa pelo WhatsApp ${clinica.whatsappDisplay}`}
            >
              <span className="flex flex-col items-start gap-1">
                <span className="display-italic text-[1.2rem] sm:text-[1.3rem]">
                  {content.whatsappLabel}
                </span>
                <span className="text-parchment/75 text-[0.92rem] tracking-wide">
                  {clinica.whatsappDisplay}
                </span>
              </span>
              <span
                aria-hidden="true"
                className="display text-[1.2rem] transition-transform group-hover:translate-x-1 sm:text-[1.3rem]"
              >
                →
              </span>
            </a>

            {clinica.email && (
              <p className="marginalia mt-5">
                ou por e-mail —{" "}
                <a
                  href={`mailto:${clinica.email}`}
                  className="text-quill hover:text-terracotta decoration-terracotta/40 hover:decoration-terracotta underline decoration-1 underline-offset-[0.25em] transition-colors"
                >
                  {clinica.email}
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
              <dt className="display text-quill mb-2 text-[0.96rem]">Atendimento</dt>
              <dd className="text-foreground text-[1.1rem] leading-[1.4]">
                On-line · Brasil e exterior
              </dd>
            </div>

            {/* The availability state itself renders from TASK-029's
                AvailabilityLine, which owns the wording of its three cases. */}
            {clinica.availability.responseWindow && (
              <div>
                <dt className="display text-quill mb-2 text-[0.96rem]">Tempo de resposta</dt>
                <dd className="text-foreground text-[1.1rem] leading-[1.4]">
                  {clinica.availability.responseWindow}
                </dd>
              </div>
            )}
          </dl>
        </address>
      </div>
    </section>
  );
}
