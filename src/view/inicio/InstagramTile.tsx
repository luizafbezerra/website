import Image from "next/image";
import { useTranslations } from "next-intl";
import type { InstagramTile as Tile } from "@/domain/inicio/Inicio";
import { MediaPlaceholder } from "@/view/general/MediaPlaceholder";
import { cn } from "@/view/styling/cn";

/**
 * One square in the Instagram row — the crop a follower already knows from the
 * feed, and the control that opens it.
 *
 * A real `<button>`, not a div with a click handler: the un-crop is the page's
 * second interactive moment and it has to be reachable by keyboard with a
 * visible focus ring like any other control. `aria-expanded` and `aria-controls`
 * tell a screen reader that activating it reveals the panel below the row rather
 * than navigating away.
 *
 * The square is the point. The feed's own rhythm is what a follower recognises,
 * so the tile is not restyled into a card — no rounding, no shadow, just the
 * painting and a hairline when it is the open one.
 */
export function InstagramTile({
  tile,
  index,
  isOpen,
  panelId,
  onOpen,
}: {
  tile: Tile;
  index: number;
  isOpen: boolean;
  panelId: string;
  onOpen: () => void;
}) {
  const t = useTranslations("inicio.instagram");
  const label = tile.workTitle ?? t("tileFallbackLabel", { number: index + 1 });

  return (
    <li className="w-40 shrink-0 snap-start sm:w-48">
      <button
        type="button"
        onClick={onOpen}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className={cn(
          "focus-visible:outline-terracotta block w-full cursor-pointer border transition-colors focus-visible:outline-2 focus-visible:outline-offset-[3px]",
          isOpen ? "border-terracotta" : "border-transparent hover:border-rule",
        )}
      >
        <span className="sr-only">{t("tileAction", { work: label })}</span>
        {tile.crop ? (
          <Image
            src={tile.crop.src}
            alt=""
            width={tile.crop.width}
            height={tile.crop.height}
            sizes="12rem"
            className="aspect-square h-auto w-full select-none object-cover"
          />
        ) : (
          // Compact: the frame keeps its accessible name but drops the visible
          // caption. Five squares in a row would otherwise print the same notice
          // five times, which reads as an error state rather than as reserved
          // space — so the row is labeled once, beneath it, instead.
          <MediaPlaceholder description={t("tilePlaceholder")} aspectRatio="1 / 1" size="compact" />
        )}
      </button>
    </li>
  );
}
