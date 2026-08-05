import { cn } from "@/view/styling/cn";

/**
 * The `h2` of a page section — DESIGN's Headline scale, balanced, in Cardo.
 *
 * There is no tracked-caps eyebrow above it. DESIGN §6 names a kicker over every
 * section as scaffolding rather than voice: the `.tracked` label is a brand voice
 * reserved for where the world genuinely speaks (plate captions, the credential
 * strip, the gallery label on an un-cropped canvas), and printing one above every
 * heading on a page would spend it down to nothing.
 */
export function SectionHeading({
  id,
  children,
  className,
}: {
  id: string;
  children: string;
  className?: string;
}) {
  return (
    <h2
      id={id}
      className={cn(
        "display text-foreground text-[clamp(2rem,4vw,3.1rem)] leading-[1.12] tracking-[-0.005em] text-balance",
        className,
      )}
    >
      {children}
    </h2>
  );
}
