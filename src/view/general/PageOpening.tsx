import type { ReactNode } from "react";
import { cn } from "@/view/styling/cn";

/**
 * The opening band of a content page — its `h1`, its who-line, its lead — and
 * the other half of the scroll rhythm `PageSection` holds.
 *
 * It exists because seven pages had written the same measure by hand
 * (`px-6 pt-32 pb-16 sm:px-10 sm:pt-36 sm:pb-20 lg:pt-40`) around the same
 * `max-w-3xl` column. Seven copies of one decision is how a rhythm drifts: the
 * seam a visitor sees below an opening is this band's bottom plus the next
 * section's top, so tuning the interval meant editing eight files and agreeing
 * with yourself seven times.
 *
 * **The bottom is deliberately the quick half-interval, not the monumental one.**
 * A page's opening states the idea its first band unfolds — on `/analise` the
 * lead ends on the symptom as a call and the next heading is what people bring —
 * so the two lean together. Pairing this band's bottom with a `movement` top
 * gives 104px / 128px / 176px; before 2026-08 it was 240px at `lg`, the widest
 * seam on the page sitting between its two most connected bands.
 *
 * The top is generous on purpose and unrelated to any seam: it clears the sticky
 * header and buys the deliberately slow first impression DESIGN asks for.
 *
 * `Hero` on Início is not built from this — its opening is a two-column grid at a
 * wider measure — but it carries the same bottom scale so the seam below it reads
 * as the same page rhythm.
 */
export function PageOpening({
  id,
  labelledBy,
  className,
  children,
}: {
  id?: string;
  /** Id of the heading that names this band, for `aria-labelledby`. */
  labelledBy: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn("px-6 pt-32 pb-10 sm:px-10 sm:pt-36 sm:pb-12 lg:pt-40 lg:pb-16", className)}
    >
      <div className="mx-auto w-full max-w-3xl">{children}</div>
    </section>
  );
}
