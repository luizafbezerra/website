import type { JungPassage } from "./Clinica";

/**
 * Which passage of the pool the site is showing right now (CONCEPT §8.5).
 *
 * The rotation is a function of the clock, not of the visitor: the site says
 * something new between visits without ever knowing who is reading. Two people
 * loading the page in the same half-day read the same passage, which is what
 * keeps this compatible with static rendering and with the no-tracking rule.
 *
 * Twelve hours — morning and evening — is short enough that a returning
 * visitor meets a different line, long enough that a passage is never a flicker.
 */
export const JUNG_ROTATION_HOURS = 12;

const HOUR_MS = 60 * 60 * 1000;

/** The pool index for a moment in time. Exported for the test's sake. */
export function jungRotationAt(at: Date): number {
  return Math.floor(at.getTime() / (JUNG_ROTATION_HOURS * HOUR_MS));
}

/**
 * The passage on show at `at`, or null while the pool is empty — she grows it
 * in the CMS, and an empty pool renders no section rather than an invented one.
 */
export function pickJungPassage(passages: readonly JungPassage[], at: Date): JungPassage | null {
  if (passages.length === 0) return null;

  const rotation = jungRotationAt(at);
  // Modulo of a negative rotation (a date before 1970) would index backwards.
  const index = ((rotation % passages.length) + passages.length) % passages.length;

  return passages[index];
}
