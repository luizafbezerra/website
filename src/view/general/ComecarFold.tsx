import type { Clinica, NoteOpeners } from "@/domain/clinica/Clinica";
import { AvailabilityLine } from "@/view/general/AvailabilityLine";
import { SectionLink } from "@/view/general/SectionLink";
import { WhatsAppCta } from "@/view/general/WhatsAppCta";

/**
 * The ask, folded into the end of a page's practical band (the 2026-08
 * condensation: "Para começar"/"Começar" stopped being sections of their own on
 * /analise and /orientacao-profissional). A hairline rule separates the facts
 * from the invitation — the manuscript's grammar for a change of register, not a
 * new band.
 *
 * Everything `Comecar` promises still holds here: the WhatsApp block is the
 * loudest thing on the page and it arrives last (REQ-004); `opener` names the
 * door the note came through (CONCEPT §8.1); the availability line sits with the
 * ask because it is the fact most likely to change whether someone writes; and
 * the link to /primeira-conversa stays the quiet door beside it.
 */
export function ComecarFold({
  content,
  clinica,
  opener,
}: {
  content: { body: string; linkLabel: string };
  clinica: Clinica;
  /** Which pre-written note this page's tap should carry. */
  opener: keyof NoteOpeners;
}) {
  return (
    <div className="border-rule-soft mt-16 border-t pt-12">
      {content.body && <p className="body-prose text-ink max-w-[58ch]">{content.body}</p>}

      <div className="mt-10">
        <WhatsAppCta clinica={clinica} opener={opener} />
        <AvailabilityLine clinica={clinica} className="mt-6" />
      </div>

      {content.linkLabel && (
        <SectionLink href="/primeira-conversa" className="mt-10">
          {content.linkLabel}
        </SectionLink>
      )}
    </div>
  );
}
