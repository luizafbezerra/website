import type { Analise } from "@/domain/analise/Analise";
import type { Clinica } from "@/domain/clinica/Clinica";
import { PageOpening } from "@/view/general/PageOpening";
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
 * The `h1` is simply the page's name. It used to read "a análise junguiana" to
 * carry that search cluster (CONCEPT §10); the site now names the tradition
 * "psicologia analítica" — Jung's own name for it — and the search term sits in
 * the meta title and the lead's first sentence instead.
 *
 * No portrait and no CTA. `/sobre` is the page whose subject is the person, and
 * this page's whole argument is the approach; a terracotta block in the first
 * screen would ask for the message before the page has said anything that earns
 * it (DESIGN: trust, not urgency).
 */
export function Abertura({ content, clinica }: { content: Analise["abertura"]; clinica: Clinica }) {
  return (
    <PageOpening labelledBy="abertura-heading">
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
    </PageOpening>
  );
}
