import type { FaqEntry } from "@/domain/faq/FaqEntry";
import type { PerguntasSection } from "@/domain/perguntas/Perguntas";
import { Ornament } from "@/view/general/Ornament";
import { PageSection } from "@/view/general/PageSection";
import { SectionHeading } from "@/view/general/SectionHeading";

/**
 * One of the four sections of CONCEPT §6 — its heading and its questions.
 *
 * **Discrete Q&A blocks, in a `<dl>`, separated by a hairline** (CONCEPT §10's own
 * words for what this page owes the machine audience, and what `/primeira-conversa`'s
 * mini-FAQ already uses). No accordions: a collapsed answer is an answer a crawler
 * has to be given twice and an anxious reader has to work for, and hiding the text
 * would be spending the page's whole purpose to save some scroll. No card grid
 * either — DESIGN bans it, and a question is a paragraph rather than a tile.
 *
 * **No numbering.** The old flat version printed `1.` to `6.` down one list. With
 * the questions split into four sections a continuous count starts the second
 * section at five, and restarting per section prints four short ordered lists —
 * but DESIGN reserves manuscript numerals for sequences that genuinely are ordered,
 * and nobody reads a FAQ in order. They jump to the one doubt they arrived with.
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

  return (
    <PageSection id={id} labelledBy={headingId}>
      <SectionHeading id={headingId}>{content.heading}</SectionHeading>

      {content.intro && <p className="body-prose text-ink mt-8 max-w-[58ch]">{content.intro}</p>}

      <dl className="mt-12 space-y-10">
        {entries.map((entry, index) => (
          <div key={entry.question}>
            <dt className="display text-foreground text-[clamp(1.2rem,2vw,1.45rem)] leading-[1.22]">
              {entry.question}
            </dt>
            <dd className="body-prose text-ink mt-3 max-w-[58ch]">{entry.answer}</dd>
            {index < entries.length - 1 && <Ornament variant="rule" className="mt-10" />}
          </div>
        ))}
      </dl>
    </PageSection>
  );
}
