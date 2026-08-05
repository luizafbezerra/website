import "server-only";
import { cache } from "react";
import type { Locale } from "@/domain/site/Locale";
import { getPayloadSafe } from "./getPayloadSafe";
import type { PayloadHomeHero } from "./homeGlobalShapes";

/** The hero section global, or null when Payload is disabled. */
export const getHomeHeroGlobal = cache(async function getHomeHeroGlobal(
  locale: Locale,
): Promise<PayloadHomeHero> {
  const payload = await getPayloadSafe();
  if (!payload) return null;

  const doc = await payload.findGlobal({
    slug: "home-hero",
    locale,
    depth: 0,
    overrideAccess: true,
  });
  return doc as PayloadHomeHero;
});
