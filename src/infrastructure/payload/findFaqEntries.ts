import "server-only";
import { cache } from "react";
import { getPayloadSafe } from "./getPayloadSafe";

/** Raw shape of a `faq` collection row read at depth 0. */
export type PayloadFaq = {
  question?: string | null;
  answer?: string | null;
};

/** The collection has no drafts, so every row is public. */
const MAX_ENTRIES = 100;

/** Every FAQ row in `order`, or null when Payload is disabled. */
export const findFaqEntries = cache(async function findFaqEntries(): Promise<PayloadFaq[] | null> {
  const payload = await getPayloadSafe();
  if (!payload) return null;

  const { docs } = await payload.find({
    collection: "faq",
    sort: "order",
    depth: 0,
    limit: MAX_ENTRIES,
    overrideAccess: true,
  });
  return docs as PayloadFaq[];
});
