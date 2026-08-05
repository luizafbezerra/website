import type { Clinica } from "@/domain/clinica/Clinica";
import type { FactRow } from "@/domain/pages/FactRow";
import { FactList } from "@/view/general/FactList";
import { PageSection } from "@/view/general/PageSection";
import { SectionHeading } from "@/view/general/SectionHeading";
import { type FeeScope, useFeeRows } from "@/view/general/useFeeRows";

/**
 * The "prático" section four of the eight pages carry (CONCEPT §6) — the price
 * first, then the page's own operational facts, then her one note about paying
 * from abroad.
 *
 * The price comes first because it is the fact a comparing reader scrolled to
 * find, and it comes from A Clínica rather than from the page (REQ-005). The
 * rest of the rows are the page's own: what is weekly on /analise is a
 * twelve-meeting programme on /orientacao-profissional.
 *
 * CONCEPT §8.9: prices are quoted in the page's own currency and never
 * converted automatically, so the international note renders wherever a price
 * does — a Brazilian in Lisbon reading the Portuguese page gets the answer in
 * the same place the price appeared. It also renders when `fees="none"`, which
 * is /internacional's case: there the note *is* the price statement, because
 * quoting BRL to a reader who pays in euros is the automatic conversion §8.9
 * forbids, one step removed.
 */
export function PraticoSection({
  id,
  labelledBy,
  heading,
  rows,
  clinica,
  fees,
  tone,
}: {
  id?: string;
  labelledBy: string;
  heading: string;
  rows: FactRow[];
  clinica: Clinica;
  fees: FeeScope;
  tone?: "parchment" | "deep";
}) {
  const feeRows = useFeeRows(clinica.fees, fees);

  return (
    <PageSection id={id} labelledBy={labelledBy} tone={tone}>
      <SectionHeading id={labelledBy}>{heading}</SectionHeading>

      <FactList rows={[...feeRows, ...rows]} className="mt-12" />

      {clinica.fees.internationalNote && (
        <p className="text-ink-soft mt-6 max-w-[54ch] text-sm">{clinica.fees.internationalNote}</p>
      )}
    </PageSection>
  );
}
