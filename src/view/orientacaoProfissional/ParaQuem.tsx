import type { OrientacaoProfissional } from "@/domain/orientacaoProfissional/OrientacaoProfissional";
import { PageSection } from "@/view/general/PageSection";
import { SectionHeading } from "@/view/general/SectionHeading";

/**
 * Section 2 of CONCEPT §6 — the four situations that bring somebody to this door:
 * a first career choice, a transition, work that lost its meaning, a restart.
 *
 * Recognition is the whole job, so the four are titled and unadorned and the
 * section holds no paragraph in front of them. A reader scanning for themselves
 * finds a title, not a lead-in.
 *
 * A `<ul>`, and deliberately not the `<ol>` the percurso uses: these are
 * alternatives, only one of which is the reader's, and numbering them would say
 * they are stages of something. Same reason there are no `.roman-numeral`
 * enumerators here — DESIGN reserves them for sequences that genuinely are ordered,
 * and this section is the counter-example on its own page.
 *
 * No card grid (DESIGN bans it outright): four situations set as cards would invite
 * comparison between them, when the visitor only needs to find the one that is
 * theirs and read on.
 */
export function ParaQuem({ content }: { content: OrientacaoProfissional["paraQuem"] }) {
  return (
    <PageSection id="para-quem" labelledBy="para-quem-heading">
      <SectionHeading id="para-quem-heading">{content.heading}</SectionHeading>

      <ul className="mt-14 space-y-12">
        {content.cases.map((situation) => (
          <li key={situation.title}>
            <h3 className="display text-foreground text-[clamp(1.45rem,2.4vw,1.85rem)] leading-[1.2] tracking-[-0.005em] text-balance">
              {situation.title}
            </h3>
            <p className="body-prose text-ink mt-3 max-w-[58ch]">{situation.text}</p>
          </li>
        ))}
      </ul>
    </PageSection>
  );
}
