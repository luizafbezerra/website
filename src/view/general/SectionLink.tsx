import { Link } from "@/i18n/navigation";
import { cn } from "@/view/styling/cn";
import type { ComponentProps } from "react";

/**
 * The secondary action of DESIGN §5 — a text link in the marginalia voice, quill
 * with a hairline terracotta underline at a generous offset. Every section that
 * hands off to a deeper page ends on one.
 *
 * It is deliberately not a button. Only one action per page is a filled
 * terracotta block, and it is the WhatsApp conversation; a page of equally
 * weighted buttons would make the north star compete with links to itself.
 *
 * `href` is the internal Portuguese pathname — next-intl renders the visitor's
 * own locale variant from the registry, so `/analise` becomes `/en/analysis`
 * without this component knowing a locale exists.
 *
 * The vertical padding is a thumb target, not spacing: one line of this type is
 * 23px tall, and the project's floor is 44px. It is padding rather than a taller
 * box so the text keeps its own baseline, and the underline keeps its offset;
 * `min-h-11` is what actually guarantees the floor, since the padding alone lands
 * a pixel short of it.
 */
export function SectionLink({
  href,
  children,
  className,
}: {
  href: ComponentProps<typeof Link>["href"];
  children: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "marginalia text-quill hover:text-terracotta decoration-terracotta/40 hover:decoration-terracotta inline-flex min-h-11 items-baseline gap-2 py-2.5 underline decoration-1 underline-offset-[0.28em] transition-colors",
        className,
      )}
    >
      <span>{children}</span>
      <span aria-hidden="true">→</span>
    </Link>
  );
}
