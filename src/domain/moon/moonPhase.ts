/**
 * Tonight's moon phase, computed rather than fetched (CONCEPT §9.4).
 *
 * Books of hours tracked the moon, so the colophon does too: one line that is
 * true today and different next week, for the cost of arithmetic. No network
 * call, no key, no per-visitor logic — the phase is a function of the clock
 * alone, which is what keeps it compatible with static rendering and with the
 * rule that the site never reads its visitor.
 *
 * This is the mean-phase approximation: the moon's true phase wanders up to
 * about half a day from the mean because its orbit is elliptical. That is far
 * inside the resolution of the thing being said — each of the eight names covers
 * roughly 3.7 days — so the extra precision of a full ephemeris would buy
 * nothing a reader could notice.
 */

/** The eight names, in cycle order from new moon. Each owns one painted plate. */
export const MOON_PHASES = [
  "new",
  "waxingCrescent",
  "firstQuarter",
  "waxingGibbous",
  "full",
  "waningGibbous",
  "lastQuarter",
  "waningCrescent",
] as const;

export type MoonPhase = (typeof MOON_PHASES)[number];

export function isMoonPhase(value: string): value is MoonPhase {
  return (MOON_PHASES as readonly string[]).includes(value);
}

/** The point in the cycle a phase name is centred on: 0 for new, 0.5 for full. */
export function moonPhaseCenterFraction(phase: MoonPhase): number {
  return MOON_PHASES.indexOf(phase) / MOON_PHASES.length;
}

export type MoonState = {
  phase: MoonPhase;
  /** Position in the cycle: 0 is new, 0.5 is full. */
  fraction: number;
  /** Fraction of the disc lit, 0 at new and 1 at full. */
  illumination: number;
};

/**
 * A reference new moon: 2000-01-06 18:14 UTC, the epoch conventionally used for
 * this calculation.
 */
const REFERENCE_NEW_MOON_MS = Date.UTC(2000, 0, 6, 18, 14, 0);

/** The mean synodic month — new moon to new moon — in days. */
const SYNODIC_MONTH_DAYS = 29.530588853;

const DAY_MS = 24 * 60 * 60 * 1000;

export function moonPhaseAt(at: Date): MoonState {
  const daysSinceReference = (at.getTime() - REFERENCE_NEW_MOON_MS) / DAY_MS;
  const cycles = daysSinceReference / SYNODIC_MONTH_DAYS;
  // A date before the reference gives a negative remainder; shift it forward.
  const fraction = ((cycles % 1) + 1) % 1;

  // Each name is centred on its own point in the cycle rather than starting
  // there, so "full" spans the days around the full moon instead of the days
  // after it. Rounding 0.94–1.0 lands on 8, which wraps back to new.
  const phase = MOON_PHASES[Math.round(fraction * MOON_PHASES.length) % MOON_PHASES.length];

  return {
    phase,
    fraction,
    illumination: (1 - Math.cos(2 * Math.PI * fraction)) / 2,
  };
}
