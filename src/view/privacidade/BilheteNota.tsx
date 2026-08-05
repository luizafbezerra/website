import type { Privacidade } from "@/domain/privacidade/Privacidade";
import { PageSection } from "@/view/general/PageSection";
import { SectionHeading } from "@/view/general/SectionHeading";
import { SectionLink } from "@/view/general/SectionLink";

/**
 * Section 4 of CONCEPT §6 — the bilhete, explained.
 *
 * The most interesting thing on the page, and the reason it is not merely a
 * compliance notice. On `/primeira-conversa` the pre-written notes are plain
 * `wa.me` anchors: `whatsappUrlFromPhone` puts the opener in the link's own
 * `?text=`, so the message is composed in the visitor's browser, which note was
 * tapped is recorded nowhere, and nothing reaches her until the visitor presses
 * send from their own WhatsApp. The arriving message still tells her which door
 * the conversation came through — because that is what is written in it, not
 * because the site reported anything. That is CONCEPT §8.1 exactly: attribution in
 * her voice, zero tracking of the visitor.
 *
 * One paragraph, then the way to the page it describes. Nothing here needs a
 * heading of its own or a diagram; the mechanism is small enough to say.
 */
export function BilheteNota({ content }: { content: Privacidade["bilheteNota"] }) {
  return (
    <PageSection labelledBy="bilhete-nota-heading">
      <SectionHeading id="bilhete-nota-heading">{content.heading}</SectionHeading>

      <p className="body-prose text-ink mt-10 max-w-[62ch]">{content.body}</p>

      <SectionLink href="/primeira-conversa" className="mt-10">
        {content.linkLabel}
      </SectionLink>
    </PageSection>
  );
}
