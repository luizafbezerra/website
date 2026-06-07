// ---------------------------------------------------------------------------
// Testimonials domain — the shape the site renders, plus a mapper from the raw
// Payload `testimonials` collection. Mirrors the identity/blog pattern: a loose
// raw type, field-by-field guarding, and a defaults fallback (empty — Voices
// auto-hides when there are none).
// ---------------------------------------------------------------------------

export type Testimonial = {
  body: string;
  attribution: string;
};

export type PayloadTestimonial = {
  body?: string | null;
  attribution?: string | null;
};

/** No testimonials by default — the Voices section hides itself when empty. */
export const TESTIMONIALS_DEFAULTS: Testimonial[] = [];

export function testimonialsFromPayload(docs: PayloadTestimonial[]): Testimonial[] {
  return docs
    .filter((d): d is { body: string; attribution: string } => Boolean(d?.body && d?.attribution))
    .map((d) => ({ body: d.body, attribution: d.attribution }));
}
