import type { Perguntas } from "@/domain/perguntas/Perguntas";

/**
 * The page's opening — its one `h1`, one paragraph, and the page's single drop cap.
 *
 * This page had neither before: it opened on an `h2` with a hardcoded Portuguese
 * heading, so `/en/questions` printed Portuguese and the document had no `h1` at
 * all. The paragraph is the whole AEO front-load (REQ-006): which two works the
 * questions are about, in what format, at what rhythm, in which languages, and
 * from where somebody may be reading. The credential strip directly under it
 * answers the remaining question, "who will receive me here?".
 *
 * No tracked-caps eyebrow, and the CMS field for one was removed rather than left
 * unrendered. DESIGN §6 names a kicker over a heading as scaffolding rather than
 * voice, and this page stacks one `h1` over four `h2`s: a fifth orienting line
 * before the first would say nothing the title does not. Início's `contato` keeps
 * its eyebrow because that one is her own copy marking a change of register at the
 * ask — there is no equivalent moment at the top of a reference page.
 *
 * One paragraph, not a rich-text body. The answers are the content of this page;
 * an opening that argued at length would delay exactly what the visitor came for.
 */
export function Abertura({ content }: { content: Perguntas["abertura"] }) {
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

        <p className="body-prose dropcap text-ink mt-10 max-w-[62ch]">{content.intro}</p>
      </div>
    </section>
  );
}
