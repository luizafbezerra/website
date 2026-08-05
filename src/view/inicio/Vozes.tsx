import type { Inicio } from "@/domain/inicio/Inicio";
import type { Testimonial } from "@/domain/testimonials/Testimonial";
import { PageSection } from "./PageSection";
import { SectionHeading } from "./SectionHeading";

/**
 * Section 10 of CONCEPT §6 — testimonials, and nothing at all when there are
 * none (SEC-002). An empty "em preparação" frame would read as apology, which is
 * worse than absence; the placeholder policy covers missing _assets_, not
 * missing people.
 *
 * The gate is structural rather than visual: the domain action already excludes
 * records without recorded consent, so an unconsented voice cannot reach this
 * component to be filtered out here.
 *
 * Attribution follows CONCEPT §11 — an initial plus context ("M., orientação de
 * carreira"), never a full name, never a star rating.
 */
export function Vozes({
  testimonials,
  content,
}: {
  testimonials: Testimonial[];
  content: Inicio["vozes"];
}) {
  if (testimonials.length === 0) return null;

  return (
    <PageSection labelledBy="vozes-heading">
      <SectionHeading id="vozes-heading" className="text-center">
        {content.heading}
      </SectionHeading>

      <ul className="mt-16 space-y-24 sm:space-y-28">
        {testimonials.map((quote, index) => (
          // An initial is not unique, so the index carries the key.
          <li key={`${quote.attribution}-${index}`}>
            <figure className="mx-auto max-w-[58ch]">
              <blockquote className="display-italic text-ink text-center text-[clamp(1.45rem,2.4vw,1.85rem)] leading-[1.35] text-balance">
                {quote.body}
              </blockquote>
              <figcaption className="marginalia mt-8 text-center">
                — {quote.attribution}
                {quote.context ? `, ${quote.context}` : ""}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </PageSection>
  );
}
