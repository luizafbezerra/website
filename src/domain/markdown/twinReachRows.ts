import { REACH } from "@/domain/clinica/reach";
import type { FactRow } from "@/domain/pages/FactRow";
import type { TwinLabels } from "./TwinContext";

/**
 * The clinic's reach as a twin states it: one row per place, country and city,
 * in the same west-to-east order the rendered strip runs in.
 *
 * **No hours, and that is the point.** On the page the difference from Brasília
 * is computed at the instant a reader is looking at it. A twin is a cached
 * document — served from a static render and revalidated on a timer — so an hour
 * stamped into it would be wrong within minutes and a *difference* stamped into
 * it would be wrong for weeks at a time, twice a year, on both sides of two
 * daylight-saving changeovers Brazil does not observe. The list of places is the
 * durable fact; the arithmetic belongs to the live surface.
 *
 * Mirrors `twinFeeRows` in shape and for the same reason: the rule about what a
 * twin says lives in the domain, and only the label lookup differs between the
 * rendered page (`useTranslations`) and the document (`TwinLabels`).
 */
export function twinReachRows(labels: Pick<TwinLabels, "reach">): FactRow[] {
  return REACH.map((place) => labels.reach[place.key]).filter(
    (row): row is FactRow => row !== undefined,
  );
}
