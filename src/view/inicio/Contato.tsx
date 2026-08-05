import { useTranslations } from "next-intl";
import type { Clinica } from "@/domain/clinica/Clinica";
import type { Inicio } from "@/domain/inicio/Inicio";
import { AvailabilityLine } from "@/view/general/AvailabilityLine";
import { RichTextProse } from "@/view/general/RichTextProse";
import { WhatsAppCta } from "@/view/general/WhatsAppCta";
import { PageSection } from "./PageSection";
import { SectionHeading } from "./SectionHeading";
import { SectionLink } from "./SectionLink";

/**
 * Section 11 of CONCEPT §6 — the close. The one place on this page where the
 * WhatsApp block is the loudest thing on screen, and it earns that by arriving
 * last: the conversation is the reward for a calm read, never a demand made over
 * one (REQ-004).
 *
 * The availability line sits with it rather than in the margin. DESIGN's
 * Marginalia-Is-Voice rule keeps operational facts out of decorative small type,
 * and "sem novos atendimentos no momento" is the single fact most likely to
 * change whether someone writes at all.
 *
 * No opener is chosen here: the four pre-written bilhetes belong to
 * /primeira-conversa, where CONCEPT §6 puts the choosing. From the home the note
 * is simply blank, which is the plain fallback §13.5 describes.
 */
export function Contato({ clinica, content }: { clinica: Clinica; content: Inicio["contato"] }) {
  const t = useTranslations("inicio.contato");

  return (
    <PageSection id="contato" labelledBy="contato-heading" tone="deep">
      <p className="tracked text-quill mb-6">{content.eyebrow}</p>

      <SectionHeading id="contato-heading">{content.heading}</SectionHeading>

      <RichTextProse data={content.body} className="body-prose text-ink mt-10 max-w-[58ch]" />

      <address className="mt-12 block not-italic">
        <WhatsAppCta clinica={clinica} label={content.whatsappLabel} />

        <p className="marginalia mt-6">
          {t("orByEmail")}{" "}
          <a
            href={`mailto:${clinica.email}`}
            className="text-quill hover:text-terracotta decoration-terracotta/40 hover:decoration-terracotta underline decoration-1 underline-offset-[0.25em] transition-colors"
          >
            {clinica.email}
          </a>
        </p>

        <AvailabilityLine clinica={clinica} className="mt-6" />
      </address>

      <SectionLink href="/perguntas" className="mt-10">
        {t("faqLink")}
      </SectionLink>
    </PageSection>
  );
}
