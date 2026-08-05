import type { Inicio } from "@/domain/inicio/Inicio";
import { PageSection } from "@/view/general/PageSection";
import { SectionHeading } from "@/view/general/SectionHeading";
import { SectionLink } from "@/view/general/SectionLink";

/**
 * Section 8 of CONCEPT §6 — three beats, about eighty words, answering the
 * question that actually stops people from writing: what happens if I do?
 *
 * Manuscript numerals rather than a numbered list style, because DESIGN reserves
 * `.roman-numeral` for sequences that genuinely are ordered — and this one is:
 * you cannot decide before the conversation you have not had yet.
 *
 * On wider screens the beats stand side by side, divided by the same hairline
 * rule that separates the two doors — a triptych, read left to right like the
 * steps it describes. Each beat inks in as it enters the viewport, one after
 * the other (`.beat-reveal`): the stagger is the sequence made visible, not an
 * entrance effect. Browsers without scroll-driven animations — and readers who
 * prefer reduced motion — get the beats already on the page.
 */
export function ComoComecar({ content }: { content: Inicio["comoComecar"] }) {
  if (content.beats.length === 0) return null;

  return (
    <PageSection labelledBy="como-comecar-heading" pace="beat" width="wide">
      <SectionHeading id="como-comecar-heading">{content.heading}</SectionHeading>

      <ol className="mt-12 grid grid-cols-1 gap-y-9 md:grid-cols-3 md:gap-y-0 md:divide-x md:divide-[color:var(--color-rule)]">
        {content.beats.map((beat) => (
          <li
            key={beat.numeral}
            className="beat-reveal grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 md:block md:px-10 md:first:pl-0 md:last:pr-0"
          >
            <span aria-hidden="true" className="roman-numeral md:text-4xl">
              {beat.numeral}
            </span>
            <p className="body-prose text-ink max-w-[56ch] md:mt-5">{beat.text}</p>
          </li>
        ))}
      </ol>

      <SectionLink href="/primeira-conversa" className="mt-12">
        {content.linkLabel}
      </SectionLink>
    </PageSection>
  );
}
