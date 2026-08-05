import "server-only";
import { cache } from "react";
import type { Locale } from "@/domain/site/Locale";
import { getPayloadSafe } from "./getPayloadSafe";
import type { PayloadHomeContact } from "./homeGlobalShapes";

/** The contact section global, or null when Payload is disabled. */
export const getHomeContactGlobal = cache(async function getHomeContactGlobal(
  locale: Locale,
): Promise<PayloadHomeContact> {
  const payload = await getPayloadSafe();
  if (!payload) return null;

  const doc = await payload.findGlobal({
    slug: "home-contact",
    locale,
    depth: 0,
    overrideAccess: true,
  });
  return doc as PayloadHomeContact;
});
