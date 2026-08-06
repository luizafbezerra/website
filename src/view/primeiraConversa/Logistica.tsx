import type { Clinica } from "@/domain/clinica/Clinica";
import type { PrimeiraConversa } from "@/domain/primeiraConversa/PrimeiraConversa";
import { Ornament } from "@/view/general/Ornament";
import { PraticoSection } from "@/view/general/PraticoSection";
import { SectionLink } from "@/view/general/SectionLink";

/**
 * O combinado — duration, format, rescheduling, time zones, languages, the price,
 * and the threshold doubts the sections above have not answered (the 2026-08
 * condensation folded the mini-FAQ's survivors in here; the rest of the doubts
 * live on /perguntas, one link away).
 *
 * The composition is shared with the service pages ("na prática"); what is
 * particular to this page is the scope of the price: this is the one page that
 * serves both doors, so it is the one page that may quote two fees. The service
 * pages quote only their own.
 *
 * The doubts keep the discrete Q&A shape (`<dl>`, hairline between entries) that
 * /perguntas uses, because it is what assistants read cleanly. `FAQPage` JSON-LD
 * stays on /perguntas alone — two overlapping FAQPage entities is a worse signal
 * to a crawler than one complete page.
 */
export function Logistica({
  clinica,
  content,
}: {
  clinica: Clinica;
  content: PrimeiraConversa["logistica"];
}) {
  return (
    <PraticoSection
      labelledBy="logistica-heading"
      heading={content.heading}
      rows={content.items}
      clinica={clinica}
      fees="both"
    >
      {content.doubts.length > 0 && (
        <dl className="border-rule-soft mt-14 space-y-10 border-t pt-12">
          {content.doubts.map((entry, index) => (
            <div key={entry.question}>
              <dt className="display text-foreground text-[clamp(1.2rem,2vw,1.45rem)] leading-[1.22]">
                {entry.question}
              </dt>
              <dd className="body-prose text-ink mt-3 max-w-[58ch]">{entry.answer}</dd>
              {index < content.doubts.length - 1 && <Ornament variant="rule" className="mt-10" />}
            </div>
          ))}
        </dl>
      )}

      <SectionLink href="/perguntas" className="mt-12">
        {content.linkLabel}
      </SectionLink>
    </PraticoSection>
  );
}
