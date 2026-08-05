import "server-only";
import { cache } from "react";
import type { Locale } from "@/domain/site/Locale";
import { getPayloadSafe } from "./getPayloadSafe";
import type { PayloadHomeVoices } from "./homeGlobalShapes";

/** The voices section global, or null when Payload is disabled. */
export const getHomeVoicesGlobal = cache(async function getHomeVoicesGlobal(
  locale: Locale,
): Promise<PayloadHomeVoices> {
  const payload = await getPayloadSafe();
  if (!payload) return null;

  const doc = await payload.findGlobal({
    slug: "home-voices",
    locale,
    depth: 0,
    overrideAccess: true,
  });
  return doc as PayloadHomeVoices;
});
