import type { PayloadTestimonial } from "@/infrastructure/payload/findPublishedTestimonials";
import type { Testimonial } from "./Testimonial";

/** Keep only rows that carry both a body and an attribution. */
export function testimonialsFromPayload(docs: PayloadTestimonial[]): Testimonial[] {
  return docs
    .filter((doc): doc is Testimonial => Boolean(doc?.body && doc?.attribution))
    .map((doc) => ({ body: doc.body, attribution: doc.attribution }));
}
