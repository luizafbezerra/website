import type { Clinica } from "@/domain/clinica/Clinica";
import type { OrientacaoProfissional } from "@/domain/orientacaoProfissional/OrientacaoProfissional";
import { PraticoSection } from "@/view/general/PraticoSection";

/**
 * Section 6 of CONCEPT §6 — duration, format, languages, reach, time zone, and the
 * price.
 *
 * `fees="careerGuidance"`: a service page quotes its own service and nothing else.
 * Printing the analysis fee beside it would ask a reader to compare two things they
 * are not choosing between — and on this page in particular, where the visitor is
 * already comparing against a coach and a vocational test, a second price is one
 * more axis of comparison for no gain. The fee itself comes from A Clínica (REQ-005)
 * and reads "a combinar" until she sets it (CONCEPT §14.1), so nothing here invents
 * a number.
 */
export function Pratico({
  clinica,
  content,
}: {
  clinica: Clinica;
  content: OrientacaoProfissional["pratico"];
}) {
  return (
    <PraticoSection
      id="pratico"
      labelledBy="pratico-heading"
      heading={content.heading}
      rows={content.items}
      clinica={clinica}
      fees="careerGuidance"
    />
  );
}
