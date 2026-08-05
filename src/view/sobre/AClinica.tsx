import type { Sobre } from "@/domain/sobre/Sobre";
import { PageSection } from "@/view/general/PageSection";
import { RichTextProse } from "@/view/general/RichTextProse";
import { SectionHeading } from "@/view/general/SectionHeading";
import { SectionLink } from "@/view/general/SectionLink";

/**
 * Section 4 of CONCEPT §6 — the Símbolos do Self story: from the page 45K people
 * follow to the clinic that took its name, and the place-and-person idea the whole
 * site is built on (CONCEPT §2).
 *
 * This is the **only** place the site tells that story in full. Início's sobre
 * digest is four lines and a link precisely so it does not have to, and repeating
 * it anywhere else would spend the reason to come here.
 *
 * The page's one tonal event (`deep`), and it belongs to this section rather than
 * to any other: everywhere else on /sobre Luiza is speaking, and here the subject
 * is the world she made. A deeper parchment is how this system marks a change of
 * voice, since it marks nothing with shadow (DESIGN §4).
 *
 * The section ends on the page's one hand-off. CONCEPT §6 gives /sobre no
 * "começar" section and none is added — the header's WhatsApp item is on screen
 * the whole way down and the footer carries the ask — but a reader who has just
 * been convinced should not have to scroll back up to act on it. One link in the
 * marginalia voice, the same grammar every other prose section on the site ends
 * with, and it stops here rather than after her signature: nothing follows a
 * signature.
 */
export function AClinica({ content }: { content: Sobre["aClinica"] }) {
  return (
    <PageSection labelledBy="a-clinica-heading" tone="deep">
      <SectionHeading id="a-clinica-heading">{content.heading}</SectionHeading>

      <RichTextProse data={content.body} className="body-prose text-ink mt-8 max-w-[62ch]" />

      <SectionLink href="/primeira-conversa" className="mt-10">
        {content.linkLabel}
      </SectionLink>
    </PageSection>
  );
}
