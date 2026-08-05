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
 * `tone` is the only variation, and it exists because depth in this system is
 * tonal rather than shadowed (DESIGN §4). Spend it once or twice per page — a
 * deeper parchment reads as an event, and striping is what it stops being.
 */

type PageSectionProps = {
  id?: string;
  /** Id of the heading that names this section, for `aria-labelledby`. */
  labelledBy: string;
  tone?: "parchment" | "deep";
  /** Wider than the reading column, for tile rows and two-column spreads. */
  width?: "column" | "wide";
  className?: string;
  children: ReactNode;
};

export function PageSection({
  id,
  labelledBy,
  tone = "parchment",
  width = "column",
  className,
  children,
}: PageSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        "px-6 py-24 sm:px-10 sm:py-32 lg:py-40",
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
