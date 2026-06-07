import {
  type PayloadTestimonial,
  type Testimonial,
  TESTIMONIALS_DEFAULTS,
  testimonialsFromPayload,
} from "@/core/testimonials";
import { getPayloadSafe } from "@/lib/payload";
import { cache } from "react";

/**
 * Published testimonials, ordered by their `order` field. Falls back to an
 * empty list when Payload is off (same degradation model as `getIdentity`),
 * which makes the Voices section hide itself.
 */
export const getTestimonials = cache(async function getTestimonials(): Promise<Testimonial[]> {
  const payload = await getPayloadSafe();
  if (!payload) return TESTIMONIALS_DEFAULTS;

  const { docs } = await payload.find({
    collection: "testimonials",
    where: { _status: { equals: "published" } },
    sort: "order",
    depth: 0,
    limit: 100,
    overrideAccess: true,
  });

  return testimonialsFromPayload(docs as PayloadTestimonial[]);
});
