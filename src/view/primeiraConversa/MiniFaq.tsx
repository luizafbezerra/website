import type { PrimeiraConversa } from "@/domain/primeiraConversa/PrimeiraConversa";
import { Ornament } from "@/view/general/Ornament";
import { PageSection } from "@/view/general/PageSection";
import { SectionHeading } from "@/view/general/SectionHeading";
import { SectionLink } from "@/view/general/SectionLink";

/**
 * Section 4 of CONCEPT §6 — the four doubts that stop somebody on the threshold,
 * answered short, then the way to all the rest.
 *
 * A shortlist rather than a slice of `/perguntas`: the doubt that stops a person
 * from writing is worded differently from the question they would type into a
 * search box, and it deserves two sentences rather than a paragraph. That is a
 * curation she owns per page, which is why the entries are this page's own fields
 * and the section ends by handing off rather than by competing.
 *
 * Discrete Q&A blocks, in a `<dl>`, separated by a hairline: the same structure
 * `/perguntas` uses, because it is what assistants read cleanly. `FAQPage` JSON-LD
 * stays on `/perguntas` alone — two overlapping FAQPage entities is a worse signal
 * to a crawler than one complete page.
 */
export function MiniFaq({ content }: { content: PrimeiraConversa["miniFaq"] }) {
  return (
    <PageSection labelledBy="mini-faq-heading">
      <SectionHeading id="mini-faq-heading">{content.heading}</SectionHeading>

      <dl className="mt-12 space-y-10">
        {content.items.map((entry, index) => (
          <div key={entry.question}>
            <dt className="display text-foreground text-[clamp(1.2rem,2vw,1.45rem)] leading-[1.22]">
              {entry.question}
            </dt>
            <dd className="body-prose text-ink mt-3 max-w-[58ch]">{entry.answer}</dd>
            {index < content.items.length - 1 && <Ornament variant="rule" className="mt-10" />}
          </div>
        ))}
      </dl>

      <SectionLink href="/perguntas" className="mt-12">
        {content.linkLabel}
      </SectionLink>
    </PageSection>
  );
}
