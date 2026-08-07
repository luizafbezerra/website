import Image from "next/image";
import { MediaPlaceholder } from "@/view/general/MediaPlaceholder";
import { cn } from "@/view/styling/cn";

/**
 * The site's signature image component (CONCEPT §7.2, DESIGN §5) — one
 * classical painting given a full editorial moment: generous parchment around
 * it, never cropped into a card, never a texture behind text, with a caption in
 * the gallery-label voice.
 *
 * The plates are the only saturated elements on any screen. Everything about
 * this component is therefore restraint: no frame, no shadow, no rounding —
 * just the painting and its label on parchment.
 *
 * While a plate has not been chosen and its provenance verified, the slot
 * renders the labeled placeholder instead of the painting. That is the same
 * policy the portrait follows (REQ-005): the layout is honest about what is
 * still missing, and the image lands through the CMS with no deploy.
 */

export type PlateImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

/** Gallery-label caption: painter in the world's voice, title and year in hers. */
export type PlateCaption = {
  painter: string;
  title: string;
  year?: string;
};

type PlateProps = {
  image?: PlateImage | null;
  caption?: PlateCaption | null;
  /** What painting belongs here, for the placeholder frame. Localized. */
  placeholder: string;
  /** Why the slot is still empty, in the marginalia voice. Localized. */
  placeholderNote?: string;
  /** Shape of the empty frame; the real image keeps its own proportions. */
  aspectRatio?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
};

export function Plate({
  image,
  caption,
  placeholder,
  placeholderNote,
  aspectRatio = "4 / 3",
  priority,
  sizes = "(min-width: 1024px) 46rem, 92vw",
  className,
}: PlateProps) {
  return (
    <figure className={cn("mx-auto my-16 w-full max-w-[46rem] sm:my-20", className)}>
      {image ? (
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes={sizes}
          priority={priority}
          className="h-auto w-full select-none"
        />
      ) : (
        <MediaPlaceholder
          description={placeholder}
          note={placeholderNote}
          aspectRatio={aspectRatio}
        />
      )}

      {caption && (
        <figcaption className="mt-4 flex flex-col gap-1">
          <span className="tracked">{caption.painter}</span>
          <span className="marginalia">
            {caption.title}
            {caption.year && <span>, {caption.year}</span>}
          </span>
        </figcaption>
      )}
    </figure>
  );
}
