import { useTranslations } from "next-intl";
import type { Clinica } from "@/domain/clinica/Clinica";
import type { Fee } from "@/domain/clinica/Fee";
import { feeQuoteFrom } from "@/domain/clinica/feeQuote";
import type { LogisticsRow, PrimeiraConversa } from "@/domain/primeiraConversa/PrimeiraConversa";
import { PageSection } from "@/view/general/PageSection";
import { SectionHeading } from "@/view/general/SectionHeading";

/**
 * Section 3 of CONCEPT §6 — duration, format, rescheduling, time zones, languages,
 * and the price.
 *
 * Every line here is an operational fact, so every line is body type. DESIGN's
 * Marginalia-Is-Voice rule binds harder on this section than anywhere else on the
 * site: a fee set in decorative small caps is a fee somebody misreads, and this is
 * the page where misreading one costs a conversation.
 *
 * A `<dl>` rather than a table or a set of cards. These are name/value pairs, that
 * is what a description list is for, and it stays a single warm column at every
 * width instead of collapsing a grid on a phone.
 *
 * The price comes first, and it comes from A Clínica rather than from this page
 * (REQ-005): it is quoted on the two service pages too, so one edit has to change
 * all three. `feeQuoteFrom` decides whether that is one line or two.
 */
export function Logistica({
  clinica,
  content,
}: {
  clinica: Clinica;
  content: PrimeiraConversa["logistica"];
}) {
  const t = useTranslations("primeiraConversa.logistica");
  const quote = feeQuoteFrom(clinica.fees);

  // "A combinar" is localized chrome, not stored copy — the wording of an absent
  // price belongs to the site, so she never has to type it in two languages.
  const feeText = (fee: Fee) => (fee.kind === "stated" ? fee.text : t("feeToDiscuss"));

  const feeRows: LogisticsRow[] =
    quote.kind === "single"
      ? [{ label: t("fee"), value: feeText(quote.fee) }]
      : [
          { label: t("feeAnalysis"), value: feeText(quote.analysis) },
          { label: t("feeCareerGuidance"), value: feeText(quote.careerGuidance) },
        ];

  return (
    <PageSection labelledBy="logistica-heading">
      <SectionHeading id="logistica-heading">{content.heading}</SectionHeading>

      <dl className="border-rule-soft mt-12 border-t">
        {[...feeRows, ...content.items].map((row) => (
          <div
            key={row.label}
            className="border-rule-soft grid grid-cols-1 gap-x-8 gap-y-1 border-b py-5 sm:grid-cols-[11rem_1fr]"
          >
            <dt className="text-ink-soft body-italic">{row.label}</dt>
            <dd className="text-ink max-w-[54ch]">{row.value}</dd>
          </div>
        ))}
      </dl>

      {/* CONCEPT §8.9: prices are quoted in the page's own currency and never
          converted automatically. Her one note about paying from abroad renders
          wherever a price does, so a Brazilian in Lisbon reading the Portuguese
          page gets the answer in the same place a price appeared. */}
      {clinica.fees.internationalNote && (
        <p className="text-ink-soft mt-6 max-w-[54ch] text-sm">{clinica.fees.internationalNote}</p>
      )}
    </PageSection>
  );
}
