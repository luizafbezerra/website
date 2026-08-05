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
        pace === "movement" ? "py-24 sm:py-32 lg:py-40" : "py-16 sm:py-20 lg:py-24",
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
