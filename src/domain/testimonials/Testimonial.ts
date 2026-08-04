export type Testimonial = {
  body: string;
  attribution: string;
};

/** No testimonials by default — the Voices section hides itself when empty. */
export const TESTIMONIALS_DEFAULTS: Testimonial[] = [];
