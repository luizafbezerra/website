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
        "marginalia text-quill hover:text-terracotta decoration-terracotta/40 hover:decoration-terracotta inline-flex items-baseline gap-2 underline decoration-1 underline-offset-[0.28em] transition-colors",
        className,
      )}
    >
      <span>{children}</span>
      <span aria-hidden="true">→</span>
    </Link>
  );
}
