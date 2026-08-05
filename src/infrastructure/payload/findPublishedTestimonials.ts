import "server-only";
import { cache } from "react";
import type { Locale } from "@/domain/site/Locale";
import { getPayloadSafe } from "./getPayloadSafe";

/** Raw shape of a `testimonials` collection row read at depth 0. */
export type PayloadTestimonial = {
  body?: string | null;
  attribution?: string | null;
};

const MAX_TESTIMONIALS = 100;

/** Published testimonials in `order`, or null when Payload is disabled. */
export const findPublishedTestimonials = cache(async function findPublishedTestimonials(
  locale: Locale,
): Promise<PayloadTestimonial[] | null> {
  const payload = await getPayloadSafe();
  if (!payload) return null;

  const { docs } = await payload.find({
    collection: "testimonials",
    where: { _status: { equals: "published" } },
    sort: "order",
    depth: 0,
    limit: MAX_TESTIMONIALS,
    locale,
    overrideAccess: true,
  });
  return docs as PayloadTestimonial[];
});
