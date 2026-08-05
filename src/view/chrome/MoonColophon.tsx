import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";
import { type MoonPhase, moonPhaseAt } from "@/domain/moon/moonPhase";
import { MediaPlaceholder } from "@/view/general/MediaPlaceholder";
import { cn } from "@/view/styling/cn";

/**
 * A lua no colofão (CONCEPT §9.4): eight small painted moon plates, of which the
 * footer shows tonight's. Books of hours tracked the moon; this gives every page
 * a heartbeat for the cost of arithmetic.
 *
 * Deliberately discrete and far from any call to action — it is a colophon
 * ornament, not a nudge. The phase name is the ornament's whole payload; nothing
 * about it reads the visitor.
 *
 * The eight slots exist now and hold labeled placeholders until the plates are
 * painted (REQ-005). Filling `MOON_PLATES` is the only change needed then.
 */

const MOON_PLATE_SIZE_PX = 40;

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
 * `at` is the render time: statically rendered pages carry the phase of their
 * last revalidation, which is well inside the ~3.7 days each name covers.
 */
export function MoonColophon({ at, className }: { at: Date; className?: string }) {
  const t = useTranslations("chrome.colophon");
  const phaseName = useTranslations("chrome.moonPhase");
  const format = useFormatter();

  const { phase } = moonPhaseAt(at);
  const name = phaseName(phase);
  const plate = MOON_PLATES[phase];

  return (
    <p className={cn("marginalia flex items-center gap-3", className)}>
      {plate ? (
        <Image
          src={plate}
          alt=""
          width={MOON_PLATE_SIZE_PX}
          height={MOON_PLATE_SIZE_PX}
          className="shrink-0 select-none"
        />
      ) : (
        <MediaPlaceholder
          size="compact"
          aspectRatio="1 / 1"
          description={t("moonSlot", { phase: name })}
          className="w-10 shrink-0"
        />
      )}
      <span>{t("moon", { phase: name, month: format.dateTime(at, { month: "long" }) })}</span>
    </p>
  );
}
