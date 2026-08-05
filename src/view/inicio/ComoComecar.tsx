import type { Inicio } from "@/domain/inicio/Inicio";
import { PageSection } from "./PageSection";
import { SectionHeading } from "./SectionHeading";
import { SectionLink } from "./SectionLink";

/**
 * Section 9 of CONCEPT §6 — three beats, about eighty words, answering the
 * question that actually stops people from writing: what happens if I do?
 *
 * Manuscript numerals rather than a numbered list style, because DESIGN reserves
 * `.roman-numeral` for sequences that genuinely are ordered — and this one is:
 * you cannot decide before the conversation you have not had yet.
 */
export function ComoComecar({ content }: { content: Inicio["comoComecar"] }) {
  if (content.beats.length === 0) return null;

  return (
    <PageSection labelledBy="como-comecar-heading">
      <SectionHeading id="como-comecar-heading">{content.heading}</SectionHeading>

      <ol className="mt-12 space-y-9">
        {content.beats.map((beat) => (
          <li key={beat.numeral} className="grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4">
            <span aria-hidden="true" className="roman-numeral">
              {beat.numeral}
            </span>
            <p className="body-prose text-ink max-w-[56ch]">{beat.text}</p>
          </li>
        ))}
      </ol>

      <SectionLink href="/primeira-conversa" className="mt-12">
        {content.linkLabel}
      </SectionLink>
    </PageSection>
  );
}
