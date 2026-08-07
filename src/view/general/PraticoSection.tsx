import type { ReactNode } from "react";
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
 * converted automatically, so the international note renders wherever a BRL
 * price does — a Brazilian in Lisbon reading the Portuguese page gets the answer
 * in the same place the price appeared.
 *
 * `fees="none"` suppresses the note along with the rows, because a page that
 * quotes no BRL price states money its own way: /internacional carries a labeled
 * "Valores" row in its own list, in the USD/EUR terms §8.9 gives it. Printing the
 * shared note there as well would say the same thing twice on the one page whose
 * subject it is.
 *
 * **A beat, not a movement.** Every page that carries this band puts it directly
 * after the band that explains the work, and it answers that explanation with
 * what the work costs and how to start. The two belong together, so the band
 * takes the quicker interval on both sides and the sequence reads as one passage
 * — the argument arriving at its practical end, rather than a fourth slab in a
 * row of equal slabs.
 */
export function PraticoSection({
  id,
  labelledBy,
  heading,
  rows,
  clinica,
  fees,
  tone,
  children,
}: {
  id?: string;
  labelledBy: string;
  heading: string;
  rows: FactRow[];
  clinica: Clinica;
  fees: FeeScope;
  tone?: "parchment" | "deep";
  /** What closes the band after the facts — a folded ask, threshold doubts. */
  children?: ReactNode;
}) {
  const feeRows = useFeeRows(clinica.fees, fees);

  return (
    <PageSection id={id} labelledBy={labelledBy} tone={tone} pace="beat">
      <SectionHeading id={labelledBy}>{heading}</SectionHeading>

      <FactList rows={[...feeRows, ...rows]} className="mt-12" />

      {/* Body scale, like the rows above it: how somebody in Lisbon pays is a
          fact they act on, and DESIGN's Marginalia-Is-Voice rule keeps those out
          of small type. It stays `ink-soft` because it is an aside to the price,
          not a row of the list. */}
      {fees !== "none" && clinica.fees.internationalNote && (
        <p className="text-ink-soft mt-6 max-w-[54ch]">{clinica.fees.internationalNote}</p>
      )}

      {children}
    </PageSection>
  );
}
