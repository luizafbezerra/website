import { useTranslations } from "next-intl";
import type { Inicio } from "@/domain/inicio/Inicio";
import { HorasDaClinica } from "@/view/general/HorasDaClinica";
import { PageSection } from "@/view/general/PageSection";
import { SectionHeading } from "@/view/general/SectionHeading";
import { SectionLink } from "@/view/general/SectionLink";

/**
 * Section 7 of CONCEPT §6 — the short band that tells a Brazilian in Lisbon or
 * London that they are not an exception here.
 *
 * PRODUCT ranks that reader third by warmth × volume, and what they need is
 * permission before logistics: the named countries are the ones she works with,
 * not a market claim. Deeper parchment sets the band apart — one of exactly two
 * tonal breaks in the scroll, so the shift still reads as an event — and the
 * living hours under the prose are the event: the same minute, told in every
 * country the practice spans.
 *
 * **The strip is the country list.** The prose above it used to name three of
 * them in a sentence, which is why adding two meant rewriting it; now the
 * sentence says what the work is and the strip says where, so a sixth place is a
 * line of data rather than a comma. Hence the visible label: a run of names under
 * an `aria-label` alone was a list only a screen reader knew it was reading.
 */
export function BrasilExterior({ content }: { content: Inicio["brasilExterior"] }) {
  const t = useTranslations("horas");

  return (
    <PageSection labelledBy="brasil-exterior-heading" tone="deep" pace="beat">
      <SectionHeading id="brasil-exterior-heading">{content.heading}</SectionHeading>

      <p className="body-prose text-ink mt-8 max-w-[62ch]">{content.body}</p>

      <p className="text-quill body-italic mt-10">{t("stripLabel")}</p>
      <HorasDaClinica className="mt-3" />

      <SectionLink href="/internacional" className="mt-10">
        {content.linkLabel}
      </SectionLink>
    </PageSection>
  );
}
