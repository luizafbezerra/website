import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import type { InstagramTile } from "@/domain/inicio/Inicio";
import { JungPassage } from "@/view/general/JungPassage";
import { MediaPlaceholder } from "@/view/general/MediaPlaceholder";
import { cn } from "@/view/styling/cn";

/**
 * **O quadro inteiro** (CONCEPT §9.2) — the panel that opens beneath the row and
 * performs the site's thesis in two seconds: _the feed shows the crop; the house
 * shows the whole painting._
 *
 * The reveal is a `clip-path` that starts as the centred square the tile showed
 * and opens to the full frame, so the canvas genuinely grows around the familiar
 * fragment instead of cross-fading into an unrelated image. The square is
 * computed from the canvas's own proportions rather than from stored crop
 * coordinates, which the CMS has no field for — an approximation, and the reason
 * the plan records it as one (ALT-005).
 *
 * Inline, never a modal: CONCEPT bans overlays and popups outright, and keeping
 * the row visible above the panel is also what makes the crop→canvas comparison
 * legible at all.
 */

/** The centred square inset, as `clip-path: inset()` percentages. */
function squareInset(width: number, height: number): string {
  if (width >= height) {
    const side = ((width - height) / 2 / width) * 100;
    return `inset(0% ${side}%)`;
  }
  const side = ((height - width) / 2 / height) * 100;
  return `inset(${side}% 0%)`;
}

export function InstagramReveal({
  tile,
  panelId,
  instagramUrl,
  onClose,
}: {
  tile: InstagramTile;
  panelId: string;
  instagramUrl: string;
  onClose: () => void;
}) {
  const t = useTranslations("inicio.instagram");
  const [opened, setOpened] = useState(false);

  // One frame after mount, so the browser has a closed state to animate from.
  // Without it the element is born open and the reveal never plays.
  useEffect(() => {
    const frame = requestAnimationFrame(() => setOpened(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const caption = [tile.painter, tile.workTitle, tile.year].filter(Boolean).join(" · ");

  return (
    <div id={panelId} className="border-rule-soft mt-10 border-t pt-10">
      <figure className="mx-auto max-w-[46rem]">
        {tile.full ? (
          <Image
            src={tile.full.src}
            alt={tile.full.alt}
            width={tile.full.width}
            height={tile.full.height}
            sizes="(min-width: 1024px) 46rem, 92vw"
            style={{
              clipPath: opened ? "inset(0%)" : squareInset(tile.full.width, tile.full.height),
            }}
            className="h-auto w-full select-none transition-[clip-path] duration-[600ms] ease-out motion-reduce:transition-none"
          />
        ) : (
          <MediaPlaceholder
            description={t("revealPlaceholder")}
            note={t("revealPlaceholderNote")}
            aspectRatio="4 / 3"
          />
        )}

        <figcaption
          className={cn(
            "mt-5 flex flex-col gap-1 transition-opacity duration-500 delay-200 motion-reduce:transition-none motion-reduce:delay-0",
            opened ? "opacity-100" : "opacity-0",
          )}
        >
          {caption && <span className="tracked">{caption}</span>}
        </figcaption>
      </figure>

      {/* Her pairing, in the one canonical passage treatment — the same setting
          the rotating pool gets, so Jung reads as one voice across the site. */}
      {tile.passage && <JungPassage passage={{ text: tile.passage, attribution: null }} />}

      <div className="mt-8 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-4">
        <button
          type="button"
          onClick={onClose}
          className="marginalia text-quill hover:text-terracotta decoration-terracotta/40 hover:decoration-terracotta focus-visible:outline-terracotta cursor-pointer underline decoration-1 underline-offset-[0.28em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-[3px]"
        >
          {t("close")}
        </button>

        <a
          href={tile.postUrl ?? instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="marginalia text-quill hover:text-terracotta decoration-terracotta/40 hover:decoration-terracotta inline-flex items-baseline gap-2 underline decoration-1 underline-offset-[0.28em] transition-colors"
        >
          <span>{t("seePost")}</span>
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  );
}
