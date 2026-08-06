import type { FaqEntry } from "@/domain/faq/FaqEntry";
import type { PerguntasSection } from "@/domain/perguntas/Perguntas";
import { PageSection } from "@/view/general/PageSection";
import { SectionHeading } from "@/view/general/SectionHeading";
import { Pergunta } from "./Pergunta";

/**
 * One of the four sections of CONCEPT §6 — its heading, and its questions as a
 * ruled list of disclosures.
 *
 * **The heading never collapses.** Only the answers do. The four section names are
 * how a visitor decides which part of the page is theirs before reading a single
 * question, so they stay on the page at full Headline scale with their questions
 * listed under them; collapsing the sections would hide the map along with the
 * territory. `Pergunta` carries why the answers themselves are closed, and why
 * closing them costs neither the crawler nor find-in-page anything.
 *
 * **Ruled, not carded.** Each question sits under a warm hairline and the last one
 * closes the list, so a section reads as one ruled block rather than as a stack of
 * tiles — DESIGN bans the card grid, and a question is a line in a list, not an
 * object.
 *
 * **No numbering.** A continuous count across four sections starts the second at
 * five, and restarting per section prints four short ordered lists — but DESIGN
 * reserves manuscript numerals for sequences that genuinely are ordered, and nobody
 * reads a FAQ in order. They jump to the one doubt they arrived with.
 *
 * The `intro` renders only when she has written one; most sections should start on
 * the first question.
 */
export function Secao({
  id,
  content,
  entries,
}: {
  id: string;
  content: PerguntasSection;
  entries: FaqEntry[];
}) {
  const headingId = `${id}-heading`;

  // `beat`, not the default `movement`. Collapsed, a section is four lines tall,
  // and the monumental interval left each one stranded in a void that read as a
  // rendering fault rather than as breathing room. At the quicker interval the four
  // sections read as one continuous index — which is what the page now is.
  return (
    <PageSection id={id} labelledBy={headingId} pace="beat">
      <SectionHeading id={headingId}>{content.heading}</SectionHeading>

      {content.intro && <p className="body-prose text-ink mt-8 max-w-[58ch]">{content.intro}</p>}

      <div className="border-rule-soft mt-10 border-b">
        {entries.map((entry) => (
          <Pergunta key={entry.question} entry={entry} />
        ))}
      </div>
    </PageSection>
  );
}
