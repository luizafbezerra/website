import type { Clinica, NoteOpeners } from "@/domain/clinica/Clinica";
import { AvailabilityLine } from "@/view/general/AvailabilityLine";
import { PageSection } from "@/view/general/PageSection";
import { SectionHeading } from "@/view/general/SectionHeading";
import { SectionLink } from "@/view/general/SectionLink";
import { WhatsAppCta } from "@/view/general/WhatsAppCta";

/**
 * The terminal section of a service or reach page (CONCEPT §6: "Para começar",
 * "Começar") — the one place on the page where the WhatsApp block is the loudest
 * thing on screen, and it earns that by arriving last (REQ-004).
 *
 * `opener` is what makes this section carry the site's attribution system: the
 * note the tap composes names the door it came through, so the message that
 * reaches her WhatsApp says which page sent it — in her wording, with nothing
 * tracked about the visitor (CONCEPT §8.1).
 *
 * The availability line sits with the ask rather than in the margin. "Sem novos
 * atendimentos no momento" is the single fact most likely to change whether
 * someone writes at all, and DESIGN keeps operational facts out of decorative
 * small type.
 *
 * The link to /primeira-conversa is the low-commitment door beside it, in the
 * marginalia voice: somebody not ready to write can still find out what happens
 * if they do, without the page raising its voice a second time.
 */
export function Comecar({
  id,
  labelledBy,
  content,
  clinica,
  opener,
  tone = "deep",
}: {
  id?: string;
  labelledBy: string;
  content: { heading: string; body: string; linkLabel: string };
  clinica: Clinica;
  /** Which pre-written note this page's tap should carry. */
  opener: keyof NoteOpeners;
  tone?: "parchment" | "deep";
}) {
  return (
    <PageSection id={id} labelledBy={labelledBy} tone={tone}>
      <SectionHeading id={labelledBy}>{content.heading}</SectionHeading>

      {content.body && <p className="body-prose text-ink mt-8 max-w-[58ch]">{content.body}</p>}

      <div className="mt-12">
        <WhatsAppCta clinica={clinica} opener={opener} />
        <AvailabilityLine clinica={clinica} className="mt-6" />
      </div>

      {content.linkLabel && (
        <SectionLink href="/primeira-conversa" className="mt-10">
          {content.linkLabel}
        </SectionLink>
      )}
    </PageSection>
  );
}
