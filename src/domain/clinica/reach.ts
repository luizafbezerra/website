// ---------------------------------------------------------------------------
// Where the clinic's day reaches, and how far each place is from Brasília.
//
// **Code, not a CMS field.** Every other visitor-facing fact on this site is hers
// to edit, and this one is not, because half of it is not prose: an IANA
// time-zone id is a technical identifier, and a typo in one prints a wrong hour
// on the surface whose entire job is being trusted about logistics. The names a
// visitor reads are chrome (`messages/{pt,en}.json`, the `horas` namespace),
// which is where the other place names on the site already live.
//
// Adding a country is a one-line change here plus its two labels. That is the
// deal: cheap to extend, impossible to get subtly wrong.
// ---------------------------------------------------------------------------

/** One place the clinic's day reaches. `key` indexes the `horas.places` labels. */
export type ReachPlace = { key: string; timeZone: string };

/** The clock everything else is measured against — the clinic's own (CONCEPT §8.9). */
export const REACH_ANCHOR = "America/Sao_Paulo";

/**
 * West to east, so the list reads as one sweep across the clock rather than as
 * Brasília plus a list of elsewheres.
 *
 * The cities stand for the countries she named, not the other way round: she
 * gave countries ("nos países que atendo adicionar o Canadá e Holanda") and a
 * clock needs a city. Toronto and Amsterdã are the defaults — the largest
 * Brazilian communities in each — and both are pending her confirmation, because
 * a client in Vancouver would make that row wrong by three hours.
 */
export const REACH: ReachPlace[] = [
  { key: "eua", timeZone: "America/New_York" }, // Nova York
  { key: "canada", timeZone: "America/Toronto" }, // Toronto
  { key: "brasil", timeZone: REACH_ANCHOR }, // Brasília — the anchor
  { key: "portugal", timeZone: "Europe/Lisbon" }, // Lisboa
  { key: "inglaterra", timeZone: "Europe/London" }, // Londres
  { key: "holanda", timeZone: "Europe/Amsterdam" }, // Amsterdã
];

/**
 * How many minutes a zone's clock reads ahead of another's at a given instant —
 * negative when it reads behind.
 *
 * Computed rather than written down, which is the whole point. Brazil abolished
 * daylight saving time in 2019 and Europe and North America did not, and their
 * two changeovers do not even fall on the same dates, so every hand-written
 * figure on this subject has to hedge into a range ("três ou quatro horas à
 * frente, conforme o horário de verão europeu"). An instant has no such problem:
 * at any moment the difference is exactly one number.
 *
 * `now` is a parameter and never `Date.now()` inside, so the arithmetic is a pure
 * function of an instant and a test can pin it to a fixed one.
 */
export function offsetMinutes(now: Date, timeZone: string, from = REACH_ANCHOR): number {
  return Math.round((wallClock(now, timeZone) - wallClock(now, from)) / 60_000);
}

/**
 * The instant as a zone's wall clock reads it, expressed as a UTC timestamp of
 * those same digits. Subtracting two of these gives the difference between the
 * two clocks, which is what a reader arranging a session actually needs.
 *
 * `hourCycle: "h23"` rather than `hour12: false` alone: the two disagree at
 * midnight on some ICU builds, where `hour12: false` prints hour 24.
 */
function wallClock(now: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);

  const field = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value ?? "0");

  return Date.UTC(
    field("year"),
    field("month") - 1,
    field("day"),
    field("hour"),
    field("minute"),
    field("second"),
  );
}
