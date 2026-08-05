import { useTranslations } from "next-intl";
import type { Clinica } from "@/domain/clinica/Clinica";
import { noteOpenersFor } from "@/domain/clinica/noteOpenersFor";
import { whatsappUrlFromPhone } from "@/domain/clinica/whatsappUrlFromPhone";
import type { PrimeiraConversa } from "@/domain/primeiraConversa/PrimeiraConversa";
import type { Locale } from "@/domain/site/Locale";
import { AvailabilityLine } from "@/view/general/AvailabilityLine";
import { PageSection } from "@/view/general/PageSection";
import { RichTextProse } from "@/view/general/RichTextProse";
import { SectionHeading } from "@/view/general/SectionHeading";
import { WhatsAppCta } from "@/view/general/WhatsAppCta";
import { BILHETE_ANCHOR } from "./bilheteAnchor";
import { BilheteNote } from "./BilheteNote";

/**
 * Section 5 of CONCEPT §6, and the page — **O bilhete**.
 *
 * The site's north star is collected here. It kills blank-message paralysis at the
 * moment of highest anxiety (CONCEPT §8.1): the hardest sentence on the site is the
 * first one a stranger has to write, so it is already written, and the visitor
 * picks the one that sounds like their situation. Each opener names the door it came
 * through, which is the whole of the site's attribution system — nothing about the
 * visitor is read, stored, or measured; the message itself says where it began.
 *
 * On a deeper parchment, the one tonal break in the scroll: the notes read as sheets
 * laid on a desk rather than as a fifth section of prose.
 *
 * With none of the four written the section falls back to the plain button CONCEPT
 * §13.5 names. The conversion path never disappears because her copy is pending —
 * it only loses the moment.
 *
 * It closes on the availability line, not on urgency. A visitor who has just read
 * five sections and reached for a note deserves to know before they write whether
 * she is taking anyone on; the honest third state ("sem novos atendimentos — escreva
 * e eu aviso") is precisely what lets this page carry no scarcity at all.
 */

export function Bilhete({
  clinica,
  content,
  locale,
}: {
  clinica: Clinica;
  content: PrimeiraConversa["bilhete"];
  locale: Locale;
}) {
  const t = useTranslations("primeiraConversa.bilhete");
  // Which notes this locale offers is a rule, not a rendering detail — `/en` drops
  // the English one, where the other three are already English.
  const notes = noteOpenersFor(clinica.notes, locale);

  return (
    <PageSection id={BILHETE_ANCHOR} labelledBy="bilhete-heading" tone="deep">
      <SectionHeading id="bilhete-heading">{content.heading}</SectionHeading>

      <RichTextProse data={content.intro} className="body-prose text-ink mt-8 max-w-[60ch]" />

      {notes.length > 0 ? (
        <>
          <p className="tracked text-quill mt-12">{content.chooseLabel}</p>

          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {notes.map(({ door, text }) => (
              <BilheteNote
                key={door}
                doorLabel={t(`doors.${door}`)}
                text={text}
                href={whatsappUrlFromPhone(clinica.whatsappE164, text)}
              />
            ))}
          </ul>
        </>
      ) : (
        <div className="mt-12">
          <WhatsAppCta clinica={clinica} />
        </div>
      )}

      <AvailabilityLine clinica={clinica} className="mt-10" />
    </PageSection>
  );
}
