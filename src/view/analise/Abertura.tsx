import type { Analise } from "@/domain/analise/Analise";
import type { Clinica } from "@/domain/clinica/Clinica";
import { RichTextProse } from "@/view/general/RichTextProse";
import { WhoLine } from "@/view/general/WhoLine";

/**
 * The page's opening — its one `h1`, the who-line, her lead, and the page's
 * single drop cap.
 *
 * The lead is the whole AEO front-load (REQ-012): what the analysis is, how often
 * it happens, in which languages, from where — and then the one idea the rest of
 * the page unfolds, that the symptom is a call rather than only a defect. A
 * visitor who reads nothing else has still been answered, and so has an assistant
 * quoting the page back to someone.
 *
 * The who-line replaced the credential band here (2026-08 condensation): the
 * page speaks in first person, so the opening names who is speaking, composed
 * from A Clínica exactly as the strip was.
 *
 * The `h1` carries "análise junguiana" because this page is the site's entry for
 * that search cluster (CONCEPT §10) — the term is what people type, and it is
 * also simply the page's name.
 *
 * No portrait and no CTA. `/sobre` is the page whose subject is the person, and
 * this page's whole argument is the approach; a terracotta block in the first
 * screen would ask for the message before the page has said anything that earns
 * it (DESIGN: trust, not urgency).
 */
export function Abertura({ content, clinica }: { content: Analise["abertura"]; clinica: Clinica }) {
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

        <WhoLine clinica={clinica} className="mt-5" />

        <RichTextProse
          data={content.body}
          className="body-prose dropcap text-ink mt-10 max-w-[62ch]"
        />
      </div>
    </section>
  );
}
