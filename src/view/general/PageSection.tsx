import type { ReactNode } from "react";
import { cn } from "@/view/styling/cn";

/**
 * The scroll rhythm of a content page, held in one place.
 *
 * A column of sections only reads as one page if their vertical measure and their
 * column width agree, and repeating the same padding scale at every call site is
 * how that quietly stops being true. The generosity is deliberate: DESIGN calls
 * the density "editorial and generous", and the first impression is meant to be
 * slow.
 *
 * `tone` exists because depth in this system is tonal rather than shadowed
 * (DESIGN §4). Spend it once or twice per page — a deeper parchment reads as an
 * event, and striping is what it stops being.
 *
 * `pace` is the page's cadence. A `movement` is a major act of the argument and
 * keeps the monumental interval; a `beat` is a short supporting passage — a
 * digest, a permission line, a three-step list — set at a quicker interval so a
 * run of them reads as one connected sequence instead of fragments floating in
 * equal voids. If every section on a page is a movement, the intervals stop
 * meaning anything.
 *
 * **The seam is the sum, so read these numbers in pairs.** A section pads both
 * sides, so what a visitor actually sees between two bands is one section's
 * bottom plus the next one's top. The values below are therefore half-intervals:
 *
 * | seam | base | sm | lg |
 * | --- | --- | --- | --- |
 * | movement → movement | 128px | 160px | 224px |
 * | movement → beat, or beat → movement | 104px | 128px | 176px |
 * | beat → beat | 80px | 96px | 128px |
 *
 * They were 320px and 192px at `lg` before 2026-08, which is where "editorial
 * and generous" tipped into a hole between bands — on `/analise`, where every
 * band was a movement, the page was five slabs separated by a third of a screen
 * each. Tune the pair, never one side: raising a single `py` here changes two
 * seams, and the one you were not looking at is the one that breaks.
 *
 * A `tone="deep"` band separates itself — a tonal change already reads as a
 * break (DESIGN §4) — so it never needs a wider seam to be legible as its own
 * act, and the page opening leans deliberately into its first band rather than
 * pairing with it (see each page's `Abertura`).
 */

type PageSectionProps = {
  id?: string;
  /** Id of the heading that names this section, for `aria-labelledby`. */
  labelledBy: string;
  tone?: "parchment" | "deep";
  /** Wider than the reading column, for tile rows and two-column spreads. */
  width?: "column" | "wide";
  /** The section's weight in the scroll rhythm — see above. */
  pace?: "movement" | "beat";
  className?: string;
  children: ReactNode;
};

export function PageSection({
  id,
  labelledBy,
  tone = "parchment",
  width = "column",
  pace = "movement",
  className,
  children,
}: PageSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        "px-6 sm:px-10",
        pace === "movement" ? "py-16 sm:py-20 lg:py-28" : "py-10 sm:py-12 lg:py-16",
        tone === "deep" && "bg-parchment-deep",
        className,
      )}
    >
      <div className={cn("mx-auto w-full", width === "wide" ? "max-w-5xl" : "max-w-3xl")}>
        {children}
      </div>
    </section>
  );
}
