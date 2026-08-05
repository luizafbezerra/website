import type { Clinica } from "@/domain/clinica/Clinica";
import type { Internacional } from "@/domain/internacional/Internacional";
import { PraticoSection } from "@/view/general/PraticoSection";

/**
 * Section 4 of CONCEPT §6 — fusos, valores e pagamento, plataforma, idiomas, and
 * where in the world she attends from.
 *
 * **`fees="none"` is the currency policy, not an omission** (CONCEPT §8.9). The
 * shared fee rows quote A Clínica's price, which she sets in reais for the
 * Portuguese pages; printing it here would ask a reader who pays in euros to do
 * the conversion the site is forbidden from doing for them. So this page frames
 * money on its own terms instead, in its own "Valores" row: dollars or euros, with
 * the value and the arrangement settled in the first conversation.
 *
 * That row is a page field rather than A Clínica's `internationalNote` on purpose.
 * On the pages that quote reais the note is a *carve-out* beside a price — "for
 * people abroad it is different" — and it renders under the list in small type.
 * Here there is no price for it to qualify: the sentence *is* the price statement,
 * so it belongs in the fact list in body type, where DESIGN puts every fact
 * somebody acts on. The note still renders beneath if she writes one, as an
 * addition rather than as the answer.
 *
 * No payment provider, bank mechanism or video platform is named anywhere in the
 * rows. Nothing she has supplied says which ones she uses, and inventing one here
 * would be the most consequential kind of invented fact on the site: a person
 * abroad would arrange their money around it.
 */
export function Pratico({
  clinica,
  content,
}: {
  clinica: Clinica;
  content: Internacional["pratico"];
}) {
  return (
    <PraticoSection
      id="pratico"
      labelledBy="pratico-heading"
      heading={content.heading}
      rows={content.items}
      clinica={clinica}
      fees="none"
    />
  );
}
