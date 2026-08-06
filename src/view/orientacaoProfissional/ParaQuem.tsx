import type { OrientacaoProfissional } from "@/domain/orientacaoProfissional/OrientacaoProfissional";
import { PageSection } from "@/view/general/PageSection";
import { SectionHeading } from "@/view/general/SectionHeading";

/**
 * Section 2 of CONCEPT §6 — the four situations that bring somebody to this door:
 * a first career choice, a transition, work that lost its meaning, a restart.
 *
 * One line per situation since the 2026-08 condensation: recognition is the whole
 * job, and a reader scanning for themselves finds their line and reads on. The
 * titled blocks the section once carried made four alternatives read as four
 * chapters.
 *
 * A `<ul>`, and deliberately not the `<ol>` the percurso uses: these are
 * alternatives, only one of which is the reader's, and numbering them would say
 * they are stages of something. Same reason there are no `.roman-numeral`
 * enumerators here — DESIGN reserves them for sequences that genuinely are ordered,
 * and this section is the counter-example on its own page.
 *
 * `pace="beat"`: a run of four one-line recognitions is a supporting passage, not
 * a movement of the argument (PageSection's own distinction).
 */
export function ParaQuem({ content }: { content: OrientacaoProfissional["paraQuem"] }) {
  return (
    <PageSection id="para-quem" labelledBy="para-quem-heading" pace="beat">
      <SectionHeading id="para-quem-heading">{content.heading}</SectionHeading>

      <ul className="mt-10 space-y-6">
        {content.cases.map((situation) => (
          <li key={situation} className="body-prose text-ink max-w-[58ch]">
            {situation}
          </li>
        ))}
      </ul>
    </PageSection>
  );
}
