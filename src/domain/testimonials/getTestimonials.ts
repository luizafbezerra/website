import { findPublishedTestimonials as infraFindPublishedTestimonials } from "@/infrastructure/payload/findPublishedTestimonials";
import { type Testimonial, TESTIMONIALS_DEFAULTS } from "./Testimonial";
import { testimonialsFromPayload } from "./testimonialsFromPayload";

/**
 * Published testimonials, ordered by their `order` field. Falls back to an empty
 * list when Payload is off, which makes the Voices section hide itself.
 */
export async function getTestimonials(): Promise<Testimonial[]> {
  const docs = await infraFindPublishedTestimonials();
  if (!docs) return TESTIMONIALS_DEFAULTS;

  return testimonialsFromPayload(docs);
}
