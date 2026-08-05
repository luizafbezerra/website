import "server-only";
import { cache } from "react";
import type { Locale } from "@/domain/site/Locale";
import { getPayloadSafe } from "./getPayloadSafe";
import type { PayloadHomeStructure } from "./homeGlobalShapes";

/** The homepage structure global (section order + off-page nav links), or null when Payload is disabled. */
export const getHomeStructureGlobal = cache(async function getHomeStructureGlobal(
  locale: Locale,
): Promise<PayloadHomeStructure> {
  const payload = await getPayloadSafe();
  if (!payload) return null;

  const doc = await payload.findGlobal({ slug: "home", locale, depth: 0, overrideAccess: true });
  return doc as PayloadHomeStructure;
});
