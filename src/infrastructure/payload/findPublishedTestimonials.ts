import "server-only";
import { cache } from "react";
import type { Locale } from "@/domain/site/Locale";
import { getPayloadSafe } from "./getPayloadSafe";

/** Raw shape of a `testimonials` collection row read at depth 0. */
export type PayloadTestimonial = {
  body?: string | null;
  attribution?: string | null;
  context?: string | null;
  service?: string | null;
  abroad?: boolean | null;
  consentGiven?: boolean | null;
};

const MAX_TESTIMONIALS = 100;

/**
 * Published, consented testimonials in `order`, or null when Payload is disabled.
 *
 * The consent condition is part of the query rather than of the caller (SEC-002):
 * an unconsented quote never leaves the database, so no code path downstream can
 * leak one. The domain mapper checks it again — cheap, and it is the check a test
 * can assert on.
 */
export const findPublishedTestimonials = cache(async function findPublishedTestimonials(
  locale: Locale,
): Promise<PayloadTestimonial[] | null> {
  const payload = await getPayloadSafe();
  if (!payload) return null;

  const { docs } = await payload.find({
    collection: "testimonials",
    // Sibling keys are ANDed by Payload — published *and* consented.
    where: { _status: { equals: "published" }, consentGiven: { equals: true } },
    sort: "order",
    depth: 0,
    limit: MAX_TESTIMONIALS,
    locale,
    overrideAccess: true,
  });
  return docs as PayloadTestimonial[];
});
