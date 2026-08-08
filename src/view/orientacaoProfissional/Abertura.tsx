import type { Clinica } from "@/domain/clinica/Clinica";
import type { OrientacaoProfissional } from "@/domain/orientacaoProfissional/OrientacaoProfissional";
import { PageOpening } from "@/view/general/PageOpening";
import { RichTextProse } from "@/view/general/RichTextProse";
import { WhoLine } from "@/view/general/WhoLine";

/**
 * Section 1 of CONCEPT §6, which on this page is also the page's opening: its one
 * `h1`, the who-line, her lead, and the page's single drop cap.
 *
 * This page's reader is the one PRODUCT describes as comparison-shopping and
 * reading fast — often younger, with three other tabs open — so the lead carries
 * the whole front-load (REQ-012) in the order that reader asks for it: what it is,
 * who conducts it, how many meetings, in what format, in which languages, from
 * where, and what they leave with. The page says nothing symbolic until the lead
 * has answered "what do I get and how long does it take". Its one analytical-psychology sentence
 * waits three sections, in "nem coaching".
 *
 * The who-line replaced the credential band here (2026-08 condensation); the
 * PUC-SP aprimoramento — this page's load-bearing credential — stays in the lead
 * prose itself.
 *
 * No jump link to the ask. /primeira-conversa opens with one because somebody
 * arriving there has usually already decided; somebody arriving here has not, and
 * an early shortcut past the argument would skip the section on which this page is
 * actually decided.
 */
export function Abertura({
  content,
  clinica,
}: {
  content: OrientacaoProfissional["abertura"];
  clinica: Clinica;
}) {
  return (
    <PageOpening id="abertura" labelledBy="abertura-heading">
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
