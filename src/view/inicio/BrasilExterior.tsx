import type { Inicio } from "@/domain/inicio/Inicio";
import { HorasDaClinica } from "@/view/inicio/HorasDaClinica";
import { PageSection } from "@/view/general/PageSection";
import { SectionHeading } from "@/view/general/SectionHeading";
import { SectionLink } from "@/view/general/SectionLink";

/**
 * Section 7 of CONCEPT §6 — the short band that tells a Brazilian in Lisbon or
 * London that they are not an exception here.
 *
 * PRODUCT ranks that reader third by warmth × volume, and what they need is
 * permission before logistics: the named countries are her real client history,
 * not a market claim. Deeper parchment sets the band apart — one of exactly two
 * tonal breaks in the scroll, so the shift still reads as an event — and the
 * living hours under the prose are the event: the same minute, told in the four
 * cities the practice actually spans.
 */
export function BrasilExterior({ content }: { content: Inicio["brasilExterior"] }) {
  return (
    <PageSection labelledBy="brasil-exterior-heading" tone="deep" pace="beat">
      <SectionHeading id="brasil-exterior-heading">{content.heading}</SectionHeading>

      <p className="body-prose text-ink mt-8 max-w-[62ch]">{content.body}</p>

      <HorasDaClinica className="mt-10" />

      <SectionLink href="/internacional" className="mt-10">
        {content.linkLabel}
      </SectionLink>
    </PageSection>
  );
}
