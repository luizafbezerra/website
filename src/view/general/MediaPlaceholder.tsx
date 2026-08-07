import { useTranslations } from "next-intl";
import { cn } from "@/view/styling/cn";

/**
 * The site-wide placeholder policy made into a component (REQ-005 / CONCEPT
 * §11): while an intended asset does not exist, its slot renders as a quiet
 * labeled frame that says what belongs there — never a stand-in stock image,
 * never the casual selfie.
 *
 * The frame is deliberately legible rather than hidden: a labeled reservation
 * reads as curation in progress, an empty gap reads as breakage. Assets land
 * through the CMS afterwards, with no deploy.
 *
 * `compact` is for slots too small to hold type (the moon in the colophon):
 * the frame keeps its accessible name and drops the visible caption.
 */

type MediaPlaceholderProps = {
  /** What belongs in this slot, in the visitor's language. */
  description: string;
  /** CSS `aspect-ratio` for the frame, e.g. `"4 / 5"`. */
  aspectRatio?: string;
  /** An extra line in the marginalia voice — why the slot is still empty. */
  note?: string;
  size?: "default" | "compact";
  className?: string;
};

export function MediaPlaceholder({
  description,
  aspectRatio = "4 / 5",
  note,
  size = "default",
  className,
}: MediaPlaceholderProps) {
  const t = useTranslations("placeholder");

  if (size === "compact") {
    return (
      <span
        role="img"
        aria-label={t("aria", { description })}
        style={{ aspectRatio }}
        className={cn("border-rule bg-parchment-deep block border", className)}
      />
    );
  }

  return (
    <figure className={cn("m-0", className)}>
      <div
        style={{ aspectRatio }}
        className="border-rule bg-parchment-deep flex flex-col items-center justify-center gap-3 border px-6 py-8 text-center"
      >
        <span className="tracked">{t("pending")}</span>
        <span className="bg-rule h-px w-10" aria-hidden="true" />
        <figcaption className="marginalia max-w-[26ch] text-balance">{description}</figcaption>
      </div>
      {note && <p className="marginalia mt-3">{note}</p>}
    </figure>
  );
}
