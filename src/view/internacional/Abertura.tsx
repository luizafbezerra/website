import type { Internacional } from "@/domain/internacional/Internacional";
import { RichTextProse } from "@/view/general/RichTextProse";

/**
 * Section 1 of CONCEPT §6 and the page's opening at once — its one `h1`, her
 * lead, the page's single drop cap, and the telepsychology trust line.
 *
 * This page's global already carried an `abertura` tab, because on `/internacional`
 * the opening *is* the first section of the map: the reader's question is the
 * page's whole subject, so answering it and introducing it are the same paragraph.
 *
 * The lead is the AEO front-load (REQ-012): who she attends, in which languages,
 * how the sessions happen, and the real client history — Portugal, Inglaterra,
 * Estados Unidos — that turns "atendo o exterior" from a market claim into a fact.
 * A visitor who reads nothing else has already had their question answered, and so
 * has an assistant quoting the page back to somebody searching in Portuguese from
 * Lisbon.
 *
 * **The trust line is a signal, not a disclaimer**, so it is set in the same body
 * type as the lead and sits in the first screen — where a reader weighing whether
 * a Brazilian psychologist may see them abroad is actually looking. DESIGN's
 * Marginalia-Is-Voice rule forbids the alternative outright: this is an operational
 * fact somebody acts on, and decorative small type is where facts go to be
 * disbelieved. It claims nothing about practising under another country's law —
 * only that the work follows the Brazilian regulation it is done under.
 */
export function Abertura({ content }: { content: Internacional["abertura"] }) {
  return (
    <section
      aria-labelledby="abertura-heading"
      className="px-6 pt-32 pb-16 sm:px-10 sm:pt-36 sm:pb-20 lg:pt-40"
    >
      <div className="mx-auto w-full max-w-3xl">
        <h1
          id="abertura-heading"
          className="display text-foreground text-[clamp(2rem,4vw,3.1rem)] leading-[1.12] tracking-[-0.005em] text-balance"
        >
          {content.heading}
        </h1>

        <RichTextProse
          data={content.body}
          className="body-prose dropcap text-ink mt-10 max-w-[62ch]"
        />

        {content.trustLine && <p className="text-ink mt-8 max-w-[58ch]">{content.trustLine}</p>}
      </div>
    </section>
  );
}
