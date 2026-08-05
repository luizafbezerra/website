import type { FactRow } from "@/domain/pages/FactRow";
import { cn } from "@/view/styling/cn";

/**
 * A page's operational facts, set as a description list.
 *
 * Every line here is something a visitor acts on — a price, a duration, a time
 * zone — so every line is body type. DESIGN's Marginalia-Is-Voice rule binds
 * hardest on these lists: a fee in decorative small caps is a fee somebody
 * misreads, and misreading one costs a conversation.
 *
 * A `<dl>` rather than a table or a set of cards. These are name/value pairs,
 * which is what a description list is for, and it stays a single warm column at
 * every width instead of collapsing a grid on a phone.
 */
export function FactList({ rows, className }: { rows: FactRow[]; className?: string }) {
  if (rows.length === 0) return null;

  return (
    <dl className={cn("border-rule-soft border-t", className)}>
      {rows.map((row) => (
        <div
          key={row.label}
          className="border-rule-soft grid grid-cols-1 gap-x-8 gap-y-1 border-b py-5 sm:grid-cols-[11rem_1fr]"
        >
          <dt className="text-ink-soft body-italic">{row.label}</dt>
          <dd className="text-ink max-w-[54ch]">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
