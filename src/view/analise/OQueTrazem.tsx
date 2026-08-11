import type { CSSProperties } from "react";
import type { Analise } from "@/domain/analise/Analise";
import { CascadeReveal } from "@/view/general/CascadeReveal";
import { PageSection } from "@/view/general/PageSection";
import { SectionHeading } from "@/view/general/SectionHeading";
import { SectionLink } from "@/view/general/SectionLink";

/**
 * The three pillars in full, and the line that routes the career question to the
 * other door. Second band of the page since the 2026-08 condensation:
 * recognition before method, because the searcher's first question is "does she
 * work with what I have". (Her five-paragraph intro moved to `OMetodo`, where it
 * is the method section's spine — it was always her account of how she works.)
 *
 * **The three pillars are her own words, verbatim.** Nothing in this component
 * may reword, trim or re-punctuate them, and the mapper refuses to let an
 * emptied field delete them.
 *
 * `.roman-numeral` I–III is genuine here in a way it is not anywhere else on this
 * page: the pillars are the numbered themes of CONCEPT §4's first door, and she
 * numbers them herself. They are still an unordered `<ul>` in the markup — the
 * numerals name the three frentes, they do not sequence them, and her own note
 * says the work begins wherever it hurts most now.
 *
 * The boundary line closes the section, because pillar III genuinely overlaps the
 * career programme (CONCEPT §4: "the overlap is the bridge, not a bug"). It hands
 * off in the marginalia voice rather than as a second button: only one action on
 * this page is a terracotta block, and it is the WhatsApp conversation.
 */
export function OQueTrazem({ content }: { content: Analise["oQueTrazem"] }) {
  return (
    <PageSection id="o-que-trazem" labelledBy="o-que-trazem-heading">
      <SectionHeading id="o-que-trazem-heading">{content.heading}</SectionHeading>

      {content.note && <p className="marginalia mt-8 max-w-[52ch]">{content.note}</p>}

      <CascadeReveal as="ul" className="mt-14 space-y-12">
        {content.pillars.map((pillar, index) => (
          <li
            key={pillar.title}
            className="grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 sm:grid-cols-[3.5rem_1fr] sm:gap-x-6"
            style={{ "--list-i": index } as CSSProperties}
          >
            <span aria-hidden="true" className="roman-numeral">
              {pillar.numeral}
            </span>
            <div>
              <h3 className="display text-foreground text-[clamp(1.45rem,2.4vw,1.85rem)] leading-[1.2] tracking-[-0.005em]">
                {pillar.title}
              </h3>
              <p className="body-prose text-ink mt-3 max-w-[58ch]">{pillar.text}</p>
            </div>
          </li>
        ))}
      </CascadeReveal>

      {content.boundary && (
        <p className="body-prose text-ink mt-16 max-w-[62ch]">{content.boundary}</p>
      )}

      {content.linkLabel && (
        <SectionLink href="/orientacao-profissional" className="mt-8">
          {content.linkLabel}
        </SectionLink>
      )}
    </PageSection>
  );
}
