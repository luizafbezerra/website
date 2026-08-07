"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import type { Inicio } from "@/domain/inicio/Inicio";
import { MediaPlaceholder } from "@/view/general/MediaPlaceholder";
import { useMotionAllowed } from "@/view/general/useMotionAllowed";
import { cn } from "@/view/styling/cn";

/**
 * **A Lâmina** (CONCEPT §9.1) — the designed substitute for the Cosmos, and the
 * page's wow wherever the celestial atlas cannot go.
 *
 * The viewport becomes a lens travelling down a tall canvas at near-1:1: not a
 * picture of a painting, but the thing a 1080-pixel feed tile physically cannot
 * do — scale. Brushwork, craquelure, a face emerging. Two or three of her
 * captions surface at the details she chose, and the journey ends on the whole
 * plate with painter, year, and one line in her voice.
 *
 * The curation is hers, which is the point: the wow belongs to her eye rather
 * than to an effect. That is also why there is no vector or generated stand-in —
 * DESIGN is explicit that a creative touch without its real painted asset does
 * not ship, so an uncurated slot renders the labeled frame and the at-rest
 * layout instead of a synthetic substitute.
 *
 * Reduced motion gets the same content with no travel: the whole plate at rest,
 * the captions listed beneath it. Not a degraded version — the same material,
 * held still.
 */

/** How much of the scroll is spent travelling before the plate resolves whole. */
const TRAVEL_FRACTION = 0.82;

export function Lamina({ content }: { content: Inicio["cosmos"] }) {
  const { lamina, caption } = content;
  const motionAllowed = useMotionAllowed();

  // No canvas to travel over, and no travel to make: both fall to the at-rest
  // layout, which is a complete section rather than a fallback. This is also the
  // pre-hydration render, so the HTML a crawler or a no-JS reader receives is the
  // whole section — plate, captions and her line — rather than an empty track.
  if (!lamina.plate || !motionAllowed) {
    return <LaminaAtRest content={content} />;
  }

  return <LaminaCinema lamina={lamina} caption={caption} />;
}

function LaminaCinema({
  lamina,
  caption,
}: {
  lamina: NonNullable<Inicio["cosmos"]["lamina"]>;
  caption: string | null;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const plate = lamina.plate;
  if (!plate) return null;

  const captions = lamina.captions;
  const whole = progress > TRAVEL_FRACTION;
  const travel = Math.min(progress / TRAVEL_FRACTION, 1);
  // Which caption the lens is currently passing, or none.
  const activeCaption =
    captions.length > 0 && !whole
      ? Math.min(Math.floor(travel * captions.length), captions.length - 1)
      : -1;

  return (
    <section
      aria-labelledby="lamina-heading"
      className="relative"
      // Three viewports of travel: enough for the lens to move a real distance
      // down the canvas without the section outstaying its welcome.
      style={{ height: "300vh" }}
      ref={trackRef}
    >
      <LaminaScrollProgress trackRef={trackRef} onProgress={setProgress} />

      <h2 id="lamina-heading" className="sr-only">
        {[lamina.painter, lamina.workTitle].filter(Boolean).join(" · ") || "A Lâmina"}
      </h2>

      <div className="bg-parchment-deep sticky top-0 h-svh overflow-hidden">
        {/* The travelling lens: the canvas held at cover scale while its focal
            point walks from the top of the painting to the bottom. */}
        <Image
          src={plate.src}
          alt={plate.alt}
          fill
          sizes="100vw"
          style={{ objectPosition: `50% ${travel * 100}%` }}
          className={cn(
            "object-cover transition-opacity duration-700",
            whole ? "opacity-0" : "opacity-100",
          )}
        />

        {/* The resolution: the same canvas, whole, with room around it. */}
        <Image
          src={plate.src}
          alt=""
          fill
          sizes="100vw"
          aria-hidden="true"
          className={cn(
            "object-contain p-6 transition-opacity duration-700 sm:p-12",
            whole ? "opacity-100" : "opacity-0",
          )}
        />

        {captions.map((text, index) => (
          // Two details can share a caption, so the position carries the key.
          <p
            key={`${index}-${text}`}
            className={cn(
              "marginalia text-parchment absolute right-6 bottom-24 left-6 mx-auto max-w-[30ch] text-center transition-opacity duration-500 [text-shadow:0_1px_6px_oklch(0.22_0.02_35/0.8)]",
              activeCaption === index ? "opacity-100" : "opacity-0",
            )}
          >
            {text}
          </p>
        ))}

        <LaminaColophon lamina={lamina} caption={caption} visible={whole} />
      </div>
    </section>
  );
}

/** Painter · title · year, and her closing line, on the whole plate. */
function LaminaColophon({
  lamina,
  caption,
  visible,
}: {
  lamina: NonNullable<Inicio["cosmos"]["lamina"]>;
  caption: string | null;
  visible: boolean;
}) {
  const gallery = [lamina.painter, lamina.workTitle, lamina.year].filter(Boolean).join(" · ");
  const closing = lamina.closingLine ?? caption;

  if (!gallery && !closing) return null;

  return (
    <div
      className={cn(
        "absolute right-6 bottom-8 left-6 mx-auto flex max-w-[46ch] flex-col items-center gap-3 text-center transition-opacity duration-700 delay-200",
        visible ? "opacity-100" : "opacity-0",
      )}
    >
      {closing && (
        <p className="display-italic text-parchment text-[clamp(1.45rem,2.4vw,1.85rem)] leading-[1.3] text-balance [text-shadow:0_1px_8px_oklch(0.22_0.02_35/0.85)]">
          {closing}
        </p>
      )}
      {gallery && (
        <span className="tracked text-parchment/85 [text-shadow:0_1px_6px_oklch(0.22_0.02_35/0.85)]">
          {gallery}
        </span>
      )}
    </div>
  );
}

/**
 * The at-rest form: the whole plate, its gallery label, her line, and the
 * travelling captions listed as what they are — the details she wanted noticed.
 */
function LaminaAtRest({ content }: { content: Inicio["cosmos"] }) {
  const t = useTranslations("inicio.lamina");
  const { lamina, caption } = content;
  const gallery = [lamina.painter, lamina.workTitle, lamina.year].filter(Boolean).join(" · ");
  const closing = lamina.closingLine ?? caption;

  return (
    <section
      aria-labelledby="lamina-heading"
      className="bg-parchment-deep px-6 py-24 sm:px-10 sm:py-32"
    >
      <div className="mx-auto w-full max-w-[46rem]">
        <h2 id="lamina-heading" className="sr-only">
          {gallery || t("fallbackHeading")}
        </h2>

        <figure className="m-0">
          {lamina.plate ? (
            <Image
              src={lamina.plate.src}
              alt={lamina.plate.alt}
              width={lamina.plate.width}
              height={lamina.plate.height}
              sizes="(min-width: 1024px) 46rem, 92vw"
              className="h-auto w-full select-none"
            />
          ) : (
            <MediaPlaceholder
              description={t("platePlaceholder")}
              note={t("platePlaceholderNote")}
              aspectRatio="3 / 4"
            />
          )}

          {gallery && <figcaption className="tracked mt-5">{gallery}</figcaption>}
        </figure>

        {lamina.captions.length > 0 && (
          <ul className="marginalia mt-8 space-y-2">
            {lamina.captions.map((text, index) => (
              <li key={`${index}-${text}`}>{text}</li>
            ))}
          </ul>
        )}

        {closing && (
          <p className="display-italic text-ink-soft mt-10 text-[clamp(1.45rem,2.4vw,1.85rem)] leading-[1.3] text-balance">
            {closing}
          </p>
        )}
      </div>
    </section>
  );
}

/**
 * Reports how far the lens has travelled, as 0→1 across the track's scroll.
 *
 * Split out so the reading — the one genuinely imperative part — sits in a
 * component with no markup of its own, and so the listener is installed only on
 * the path that actually animates.
 */
function LaminaScrollProgress({
  trackRef,
  onProgress,
}: {
  trackRef: React.RefObject<HTMLDivElement | null>;
  onProgress: (value: number) => void;
}) {
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame = 0;
    const measure = () => {
      frame = 0;
      const rect = track.getBoundingClientRect();
      const travelled = rect.height - window.innerHeight;
      if (travelled <= 0) return onProgress(0);
      onProgress(Math.min(Math.max(-rect.top / travelled, 0), 1));
    };
    const onScroll = () => {
      if (frame === 0) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame !== 0) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [trackRef, onProgress]);

  return null;
}
