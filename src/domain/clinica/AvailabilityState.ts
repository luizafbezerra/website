/**
 * The three honest states of CONCEPT §8.2. The third one is the anti-urgency
 * move: saying "no openings right now — write and I'll let you know" is what
 * stops messages from falling into silence, and it is the reason the site needs
 * no scarcity mechanics at all.
 *
 * The wording each state renders is localized chrome, not a stored string.
 */
export const AVAILABILITY_STATES = ["open", "waitlist", "closed"] as const;

export type AvailabilityState = (typeof AVAILABILITY_STATES)[number];

export function isAvailabilityState(value: unknown): value is AvailabilityState {
  return typeof value === "string" && (AVAILABILITY_STATES as readonly string[]).includes(value);
}
