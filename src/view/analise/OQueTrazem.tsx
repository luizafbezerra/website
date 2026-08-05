import type { Analise } from "@/domain/analise/Analise";
import { PageSection } from "@/view/general/PageSection";
import { RichTextProse } from "@/view/general/RichTextProse";
import { SectionHeading } from "@/view/general/SectionHeading";
import { SectionLink } from "@/view/general/SectionLink";

/**
 * Section 5 of CONCEPT §6 — the three pillars in full, and the line that routes
 * the career question to the other door.
 *
 * **The intro and the three pillars are her own words, verbatim.** She rewrote
 * them herself; they existed only in the database until TASK-026 rescued them.
 * Nothing in this component may reword, trim or re-punctuate them, and the mapper
 * refuses to let an emptied field delete them.
 *
 * No tracked-caps eyebrow above the heading, even though the global once carried
 * a field for one. DESIGN §6 names a kicker over every section as scaffolding
 * rather than voice, and the field is gone.
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

      <RichTextProse data={content.intro} className="body-prose text-ink mt-8 max-w-[62ch]" />

      {content.note && <p className="marginalia mt-10 max-w-[52ch]">{content.note}</p>}

      <ul className="mt-14 space-y-12">
        {content.pillars.map((pillar) => (
          <li
            key={pillar.title}
            className="grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 sm:grid-cols-[3.5rem_1fr] sm:gap-x-6"
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
      </ul>

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
