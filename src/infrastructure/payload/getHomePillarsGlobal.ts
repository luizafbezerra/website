import "server-only";
import { cache } from "react";
import type { Locale } from "@/domain/site/Locale";
import { getPayloadSafe } from "./getPayloadSafe";
import type { PayloadHomePillars } from "./homeGlobalShapes";

/** The pillars section global, or null when Payload is disabled. */
export const getHomePillarsGlobal = cache(async function getHomePillarsGlobal(
  locale: Locale,
): Promise<PayloadHomePillars> {
  const payload = await getPayloadSafe();
  if (!payload) return null;

  const doc = await payload.findGlobal({
    slug: "home-pillars",
    locale,
    depth: 0,
    overrideAccess: true,
  });
  return doc as PayloadHomePillars;
});
