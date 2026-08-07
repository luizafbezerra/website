import type { Clinica } from "@/domain/clinica/Clinica";
import type { Perguntas } from "@/domain/perguntas/Perguntas";
import { PageSection } from "@/view/general/PageSection";
import { SectionHeading } from "@/view/general/SectionHeading";
import { SectionLink } from "@/view/general/SectionLink";
import { WhatsAppCta } from "@/view/general/WhatsAppCta";

/**
 * The close — for the visitor whose question was not on the page.
 *
 * **Deliberately not a `Comecar` block.** CONCEPT §6 gives this page four sections
 * and no "Começar": the terminal terracotta ask belongs to the service and reach
 * pages, and to `/primeira-conversa`, where the whole page is the ask. A filled
 * terracotta block after sixteen answers would turn a reference page into a sales
 * page at the exact moment the visitor is being careful — and would put the site's
 * one CTA voice somewhere trust was still being earned. So both affordances here
 * are marginalia: `WhatsAppCta variant="quiet"` and a `SectionLink`.
 *
 * No availability line either. The footer's *Começar* column already carries it on
 * every page, and `/primeira-conversa` learned that two copies within one screen
 * read as a rendering fault rather than as emphasis.
 *
 * The one tonal event on this page (`tone="deep"`, DESIGN §4's budget of at most
 * two): a long uniform scroll of four sections needs one signal that the answers
 * have ended, and a deeper parchment says it without raising the page's voice.
 */
export function Fecho({ clinica, content }: { clinica: Clinica; content: Perguntas["fecho"] }) {
  return (
    <PageSection id="fecho" labelledBy="fecho-heading" tone="deep">
      <SectionHeading id="fecho-heading">{content.heading}</SectionHeading>

      <p className="body-prose text-ink mt-8 max-w-[58ch]">{content.body}</p>

      <div className="mt-12 flex flex-col items-start gap-6">
        <WhatsAppCta clinica={clinica} label={content.whatsappLabel} variant="quiet" />
        <SectionLink href="/primeira-conversa">{content.linkLabel}</SectionLink>
      </div>
    </PageSection>
  );
}
