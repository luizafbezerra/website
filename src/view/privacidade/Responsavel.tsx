import { useTranslations } from "next-intl";
import type { Clinica } from "@/domain/clinica/Clinica";
import type { Privacidade } from "@/domain/privacidade/Privacidade";
import { Ornament } from "@/view/general/Ornament";
import { PageSection } from "@/view/general/PageSection";
import { RichTextProse } from "@/view/general/RichTextProse";
import { SectionHeading } from "@/view/general/SectionHeading";

/**
 * The section CONCEPT §6 does not list, and the page needs.
 *
 * The four sections above describe the *site*, which keeps almost nothing. This
 * one describes the *conversation*, which is where data actually exists — and it
 * carries the three things the pre-CONCEPT draft got right and would otherwise
 * have been lost with it: who is responsible for a message once it arrives and how
 * to reach them, the LGPD rights sentence, and the sigilo profissional that covers
 * the content of sessions regardless of anything on this page. Without it the page
 * would be true and incomplete at the same time, which on a privacy page is a way
 * of being untrue.
 *
 * Her name, her role, the CRP and the email are read from A Clínica rather than
 * restated here (REQ-003): the identification a reader would act on must be the
 * same string the colophon binds on every page, and one CMS edit has to move both.
 * The CRP joins the line the moment she confirms it, and stays out while
 * `clinica.credential` is blank rather than advertising a registration number the
 * site has not verified.
 *
 * Two rows in a `<dl>`, in body type. DESIGN's Marginalia-Is-Voice rule binds
 * hardest here: this is the one address on the site somebody writes to in order to
 * exercise a right, and a right nobody can find is not a right.
 */
export function Responsavel({
  clinica,
  content,
}: {
  clinica: Clinica;
  content: Privacidade["responsavel"];
}) {
  const t = useTranslations("privacidade");

  // Only confirmed facts join the line: `credential` is blank until she confirms
  // her CRP in writing, and a blank must not print an empty separator.
  const responsible = [clinica.fullName, clinica.role, clinica.credential]
    .filter((part) => part.trim().length > 0)
    .join(" · ");

  return (
    <PageSection labelledBy="responsavel-heading">
      <SectionHeading id="responsavel-heading">{content.heading}</SectionHeading>

      <dl className="border-rule-soft mt-12 border-t">
        <div className="border-rule-soft grid grid-cols-1 gap-x-8 gap-y-1 border-b py-5 sm:grid-cols-[11rem_1fr]">
          <dt className="text-ink-soft body-italic">{t("responsible")}</dt>
          <dd className="text-ink max-w-[54ch]">{responsible}</dd>
        </div>

        <div className="border-rule-soft grid grid-cols-1 gap-x-8 gap-y-1 border-b py-5 sm:grid-cols-[11rem_1fr]">
          <dt className="text-ink-soft body-italic">{t("contact")}</dt>
          <dd className="text-ink max-w-[54ch]">
            {clinica.email ? (
              <a
                href={`mailto:${clinica.email}`}
                className="text-quill hover:text-terracotta decoration-terracotta/40 hover:decoration-terracotta underline decoration-1 underline-offset-[0.25em] transition-colors"
              >
                {clinica.email}
              </a>
            ) : (
              <a
                href={clinica.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-quill hover:text-terracotta decoration-terracotta/40 hover:decoration-terracotta underline decoration-1 underline-offset-[0.25em] transition-colors"
              >
                {clinica.whatsappDisplay}
              </a>
            )}
          </dd>
        </div>
      </dl>

      <RichTextProse data={content.body} className="body-prose text-ink mt-10 max-w-[62ch]" />

      <p className="body-prose text-ink mt-8 max-w-[62ch]">{content.rights}</p>

      {/* The sigilo is set apart because it is the one statement on the page that
          does not depend on the page: it holds whatever this text says, and it
          outlives any edit to it. */}
      <Ornament variant="rule" className="mt-14" />

      <p className="body-prose text-ink-soft mt-14 max-w-[58ch]">{content.confidentiality}</p>
    </PageSection>
  );
}
