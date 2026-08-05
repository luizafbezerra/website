"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useId, useState } from "react";
import type { Clinica } from "@/domain/clinica/Clinica";
import type { Inicio, InstagramTile as Tile } from "@/domain/inicio/Inicio";
import { PageSection } from "@/view/general/PageSection";
import { SectionHeading } from "@/view/general/SectionHeading";
import { InstagramReveal } from "./InstagramReveal";
import { InstagramTile } from "./InstagramTile";

/**
 * Section 3 of CONCEPT §6 — the bridge between the gallery and the house.
 *
 * A horizontal row of the squares a follower already knows, in the feed's own
 * rhythm: drag, swipe, or arrow-key through them, no chevron buttons riding the
 * edges. Chosen over a grid because six squares in a grid reads as a portfolio
 * and sits against DESIGN's ban on card grids, while a row reads as a feed.
 *
 * Tapping one un-crops it in the panel below (`InstagramReveal`). One at a time:
 * two open canvases would turn the section into the gallery it is supposed to be
 * the alternative to.
 *
 * Until her posts are curated the row holds labeled placeholder squares that
 * open the same way, so the behaviour ships and is reviewable before a single
 * image exists (REQ-004) — and the images land through the CMS with no deploy.
 */

const PLACEHOLDER_TILE_COUNT = 5;

const EMPTY_TILE: Tile = {
  crop: null,
  full: null,
  painter: null,
  workTitle: null,
  year: null,
  passage: null,
  postUrl: null,
};

export function InstagramBridge({
  clinica,
  content,
}: {
  clinica: Clinica;
  content: Inicio["instagram"];
}) {
  const t = useTranslations("inicio.instagram");
  const panelPrefix = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const awaitingCuration = content.tiles.length === 0;
  const tiles = awaitingCuration
    ? Array.from({ length: PLACEHOLDER_TILE_COUNT }, () => EMPTY_TILE)
    : content.tiles;

  const close = useCallback(() => setOpenIndex(null), []);

  useEffect(() => {
    if (openIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [openIndex, close]);

  const openTile = openIndex === null ? null : tiles[openIndex];
  const panelId = `${panelPrefix}-reveal`;

  return (
    <PageSection labelledBy="instagram-heading" width="wide">
      <SectionHeading id="instagram-heading">{content.heading}</SectionHeading>

      {content.intro && <p className="body-prose text-ink mt-8 max-w-[60ch]">{content.intro}</p>}

      {/* Negative margins let the row bleed to the viewport edge on phones, so a
          partial square at the right edge says "there is more" without an arrow. */}
      <ul className="-mx-6 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 sm:-mx-10 sm:px-10">
        {tiles.map((tile, index) => (
          <InstagramTile
            key={tile.postUrl ?? tile.crop?.src ?? index}
            tile={tile}
            index={index}
            isOpen={openIndex === index}
            panelId={panelId}
            onOpen={() => setOpenIndex(openIndex === index ? null : index)}
          />
        ))}
      </ul>

      {/* The placeholder policy for the row as a whole (REQ-005): one line that
          says what the five reserved squares are waiting for, rather than the
          same notice printed inside each of them. */}
      {awaitingCuration && <p className="marginalia mt-4">{t("tilesPending")}</p>}

      {openTile && (
        <InstagramReveal
          // Remounting per tile restarts the reveal, which is the whole point:
          // switching tiles should un-crop again, not swap an already-open image.
          key={openIndex}
          tile={openTile}
          panelId={panelId}
          instagramUrl={clinica.instagramUrl}
          onClose={close}
        />
      )}

      <p className="marginalia mt-10">
        <a
          href={clinica.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-quill hover:text-terracotta decoration-terracotta/40 hover:decoration-terracotta underline decoration-1 underline-offset-[0.28em] transition-colors"
        >
          {t("follow", { handle: clinica.instagramHandle })}
        </a>
      </p>
    </PageSection>
  );
}
