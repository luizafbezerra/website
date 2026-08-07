"use client";

import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { isMoonPhase, type MoonPhase, moonPhaseAt } from "@/domain/moon/moonPhase";
import { MoonGlyph } from "@/view/chrome/MoonGlyph";
import { cn } from "@/view/styling/cn";

/**
 * A lua no colofão (CONCEPT §9.4): the footer shows tonight's moon. Books of
 * hours tracked the moon; this gives every page a heartbeat for the cost of
 * arithmetic.
 *
 * Deliberately discrete and far from any call to action — it is a colophon
 * ornament, not a nudge. The phase name is the ornament's whole payload; nothing
 * about it reads the visitor.
 *
 * Until the eight painted plates exist (REQ-005) the phase is drawn as a small
 * engraved diagram (MoonGlyph). Filling `MOON_PLATES` is the only change needed
 * when the paintings land.
 */

const MOON_SIZE_PX = 28;

/** One painted plate per phase. Null until the paintings exist. */
const MOON_PLATES: Record<MoonPhase, string | null> = {
  new: null,
  waxingCrescent: null,
  firstQuarter: null,
  waxingGibbous: null,
  full: null,
  waningGibbous: null,
  lastQuarter: null,
  waningCrescent: null,
};

/**
 * A `?moon=<phase>` query override for eyeballing all eight states — read after
 * hydration, so the statically rendered page stays byte-identical without it.
 * It swaps glyph and label together; only the month stays real. A picture the
 * visitor asked for, never a reading of the visitor.
 */
function useForcedMoonPhase(): MoonPhase | null {
  const [forced, setForced] = useState<MoonPhase | null>(null);

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("moon");
    setForced(requested !== null && isMoonPhase(requested) ? requested : null);
  }, []);

  return forced;
}

/**
 * `at` is the render time: statically rendered pages carry the phase of their
 * last revalidation, which is well inside the ~3.7 days each name covers.
 */
export function MoonColophon({ at, className }: { at: Date; className?: string }) {
  const t = useTranslations("chrome.colophon");
  const phaseName = useTranslations("chrome.moonPhase");
  const format = useFormatter();

  const forcedPhase = useForcedMoonPhase();
  const phase = forcedPhase ?? moonPhaseAt(at).phase;
  const name = phaseName(phase);
  const plate = MOON_PLATES[phase];

  return (
    <p className={cn("marginalia flex items-center gap-3", className)}>
      {plate ? (
        <Image
          src={plate}
          alt=""
          width={MOON_SIZE_PX}
          height={MOON_SIZE_PX}
          className="shrink-0 select-none"
        />
      ) : (
        <MoonGlyph phase={phase} size={MOON_SIZE_PX} />
      )}
      <span>{t("moon", { phase: name, month: format.dateTime(at, { month: "long" }) })}</span>
    </p>
  );
}
