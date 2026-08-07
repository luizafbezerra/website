import type { PrivacyItem } from "@/domain/privacidade/Privacidade";
import { cn } from "@/view/styling/cn";

/**
 * One of the page's two honest lists.
 *
 * A `<dl>` of title/fact pairs, in the same setting `/primeira-conversa`'s
 * mini-FAQ uses for a short titled answer — a named thing with a description is
 * exactly what a description list is for, and it is what an assistant reads
 * cleanly. No bullets, no frames, no grid: DESIGN bans card grids, and a privacy
 * page that arranges its disclosures into tiles is decorating a disclosure.
 *
 * The titles carry the scanning weight, because the asymmetry between the two
 * lists is this page's whole argument: the "keeps" list is short and specific, the
 * "never does" list is longer and reads as relief. Both must be scannable in one
 * pass without reading a word of the body.
 */
export function ItemList({ items, className }: { items: PrivacyItem[]; className?: string }) {
  if (items.length === 0) return null;

  return (
    <dl className={cn("space-y-10", className)}>
      {items.map((item) => (
        <div key={item.title}>
          <dt className="display text-foreground text-[clamp(1.2rem,2vw,1.45rem)] leading-[1.22]">
            {item.title}
          </dt>
          <dd className="body-prose text-ink mt-3 max-w-[58ch]">{item.text}</dd>
        </div>
      ))}
    </dl>
  );
}
