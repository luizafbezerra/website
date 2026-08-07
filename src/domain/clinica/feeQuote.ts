import type { Clinica } from "./Clinica";
import type { Fee } from "./Fee";

/**
 * How a page quotes the practice's prices (REQ-006, CONCEPT §8.9).
 *
 * The two doors are two products and can carry two prices, but while both are
 * still to be discussed there is only one thing to say — and saying it twice, once
 * per service, reads as a rendering bug rather than as a policy. So the shape of
 * the answer is decided here, as a rule, and the view only labels whichever case
 * it is handed.
 */
export type FeeQuote =
  | { kind: "single"; fee: Fee }
  | { kind: "perService"; analysis: Fee; careerGuidance: Fee };

export function feeQuoteFrom(fees: Clinica["fees"]): FeeQuote {
  const bothUnset = fees.analysis.kind === "toDiscuss" && fees.careerGuidance.kind === "toDiscuss";
  if (bothUnset) return { kind: "single", fee: fees.analysis };

  return {
    kind: "perService",
    analysis: fees.analysis,
    careerGuidance: fees.careerGuidance,
  };
}
