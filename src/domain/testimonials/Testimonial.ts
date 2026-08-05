/**
 * A voice, as the Vozes section renders it: the client's words, a first name or
 * initial, and the context that situates them ("M., orientação de carreira").
 * No rating — CONCEPT §11 rules them out.
 *
 * There is no `consentGiven` field here on purpose. Consent is not something the
 * view is trusted to check: a record without it never becomes a `Testimonial` at
 * all (see `testimonialsFromPayload`).
 */
export type TestimonialService = "analise" | "orientacao";

export type Testimonial = {
  body: string;
  attribution: string;
  context: string | null;
  service: TestimonialService | null;
  /** Whether this voice writes from outside Brazil — CONCEPT wants at least one. */
  abroad: boolean;
};

/** No testimonials by default — the Vozes section hides itself when empty. */
export const TESTIMONIALS_DEFAULTS: Testimonial[] = [];
