import type { Inicio } from "@/domain/inicio/Inicio";
import { PageSection } from "./PageSection";
import { SectionHeading } from "./SectionHeading";
import { SectionLink } from "./SectionLink";

/**
 * Section 8 of CONCEPT §6 — the short band that tells a Brazilian in Lisbon or
 * London that they are not an exception here.
 *
 * PRODUCT ranks that reader third by warmth × volume, and what they need is
 * permission before logistics: the named countries are her real client history,
 * not a market claim. Deeper parchment sets the band apart — one of exactly two
 * tonal breaks in the scroll, so the shift still reads as an event.
 */
export function BrasilExterior({ content }: { content: Inicio["brasilExterior"] }) {
  return (
    <PageSection labelledBy="brasil-exterior-heading" tone="deep">
      <SectionHeading id="brasil-exterior-heading">{content.heading}</SectionHeading>

      <p className="body-prose text-ink mt-8 max-w-[62ch]">{content.body}</p>

      <SectionLink href="/internacional" className="mt-10">
        {content.linkLabel}
      </SectionLink>
    </PageSection>
  );
}
