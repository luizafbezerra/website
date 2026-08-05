import type { Clinica } from "@/domain/clinica/Clinica";
import type { PrimeiraConversa } from "@/domain/primeiraConversa/PrimeiraConversa";
import { PraticoSection } from "@/view/general/PraticoSection";

/**
 * Section 3 of CONCEPT §6 — duration, format, rescheduling, time zones,
 * languages, and the price.
 *
 * The composition itself is shared with the three service and reach pages, which
 * carry the same section under CONCEPT's own name for it ("prático"). What is
 * particular to this page is the scope of the price: this is the one page that
 * serves both doors, so it is the one page that may quote two fees. The service
 * pages quote only their own.
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
    />
  );
}
