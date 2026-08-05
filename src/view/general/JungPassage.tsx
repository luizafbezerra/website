import type { JungPassage as Passage } from "@/domain/clinica/Clinica";
import { cn } from "@/view/styling/cn";

/**
 * The one ownable typographic treatment for a Jung passage (DESIGN §3, the
 * Jung-Passage Treatment) — the site's equivalent of her Instagram tile format:
 * Cardo italic at Title scale, ink on plain parchment, generous vertical space,
 * and a rubricated attribution in the tracked-caps world voice.
 *
 * Never burned into an image, never a "quote card": the passage is Jung
 * speaking, so it belongs to the world's voice and is set in type, not framed
 * like a testimonial.
 *
 * One treatment everywhere a passage appears. Pair it with
 * `pickJungPassage(clinica.jungPassages, new Date())` for the rotating pool
 * (CONCEPT §8.5); pass a specific passage where the page pairs one with a plate.
 */

type JungPassageProps = {
  /** Null while her pool is empty — the section then renders nothing. */
  passage: Passage | null;
  className?: string;
};

export function JungPassage({ passage, className }: JungPassageProps) {
  if (!passage) return null;

  return (
    <figure className={cn("mx-auto my-14 max-w-[38rem] text-center sm:my-16", className)}>
      <blockquote className="display-italic text-ink text-2xl leading-[1.35] text-balance">
        {passage.text}
      </blockquote>
      {passage.attribution && (
        <figcaption className="tracked text-terracotta mt-6">{passage.attribution}</figcaption>
      )}
    </figure>
  );
}
