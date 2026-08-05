import { type MoonPhase, moonPhaseCenterFraction } from "@/domain/moon/moonPhase";
import { cn } from "@/view/styling/cn";

/**
 * Tonight's moon drawn as a small engraved diagram: a hairline circle with the
 * lit portion in gilt, the way books of hours diagrammed the lunar month. It
 * stands in for the painted plates (REQ-005) — when those land, `MOON_PLATES`
 * in MoonColophon.tsx overrides it — and stays a diagram rather than imitating
 * a painting, so the plates remain the only painterly thing on screen.
 *
 * Orientation is the southern sky's: from Brazil the waxing moon lights its
 * left limb, the mirror of the emoji convention. The clinic looks up from
 * São Paulo, so the colophon does too.
 */

const CENTER = 18;
const RADIUS = 16;

/**
 * The lit region between the moon's outer limb and the terminator, as an SVG
 * path. The limb is the half of the circle on the lit side; the terminator is
 * a half-ellipse whose width follows the cosine of the cycle position —
 * bulging toward the lit side while the moon is a crescent, away from it once
 * gibbous. Full and new have no terminator and are drawn by the caller.
 */
function litRegionPath(cycleFraction: number): string {
  const cosine = Math.cos(2 * Math.PI * cycleFraction);
  const litLeft = cycleFraction < 0.5;
  const top = `${CENTER} ${CENTER - RADIUS}`;
  const bottom = `${CENTER} ${CENTER + RADIUS}`;
  const limb = `M ${top} A ${RADIUS} ${RADIUS} 0 0 ${litLeft ? 0 : 1} ${bottom}`;

  const terminatorRx = RADIUS * Math.abs(cosine);
  if (terminatorRx < 0.5) {
    return `${limb} L ${top} Z`;
  }

  const bulgesLeft = cosine > 0 === litLeft;
  const terminator = `A ${terminatorRx} ${RADIUS} 0 0 ${bulgesLeft ? 1 : 0} ${top}`;
  return `${limb} ${terminator} Z`;
}

export function MoonGlyph({
  phase,
  size = 28,
  className,
}: {
  phase: MoonPhase;
  /** Rendered size in px — an attribute, not a class, so it never depends on CSS. */
  size?: number;
  className?: string;
}) {
  const cycleFraction = moonPhaseCenterFraction(phase);

  return (
    <svg
      viewBox="0 0 36 36"
      width={size}
      height={size}
      aria-hidden="true"
      className={cn("shrink-0 select-none", className)}
    >
      {phase === "full" ? (
        <circle cx={CENTER} cy={CENTER} r={RADIUS} className="fill-gilt" />
      ) : (
        phase !== "new" && <path d={litRegionPath(cycleFraction)} className="fill-gilt" />
      )}
      <circle
        cx={CENTER}
        cy={CENTER}
        r={RADIUS}
        strokeWidth="1"
        className="stroke-quill fill-none"
      />
    </svg>
  );
}
