import type { ReactNode } from "react";
import { cn } from "@/view/styling/cn";

/**
 * The scroll rhythm of Início, held in one place.
 *
 * Eleven sections in a row only read as one page if their vertical measure and
 * their column width agree, and repeating the same padding scale eleven times is
 * how that quietly stops being true. The generosity is deliberate: DESIGN calls
 * the density "editorial and generous", and the first impression is meant to be
 * slow.
 *
 * `tone` is the only variation, and it exists because depth in this system is
 * tonal rather than shadowed (DESIGN §4). It is used exactly twice on this page
 * — the Brasil e exterior band and the closing contato — so a deeper parchment
 * still reads as an event rather than as striping.
 */

type PageSectionProps = {
  id?: string;
  /** Id of the heading that names this section, for `aria-labelledby`. */
  labelledBy: string;
  tone?: "parchment" | "deep";
  /** Wider than the reading column, for the tile row and the two-door spread. */
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
