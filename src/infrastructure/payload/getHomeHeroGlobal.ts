import "server-only";
import { cache } from "react";
import { getPayloadSafe } from "./getPayloadSafe";
import type { PayloadHomeHero } from "./homeGlobalShapes";

/** The hero section global, or null when Payload is disabled. */
export const getHomeHeroGlobal = cache(
  async function getHomeHeroGlobal(): Promise<PayloadHomeHero> {
    const payload = await getPayloadSafe();
    if (!payload) return null;

    const doc = await payload.findGlobal({ slug: "home-hero", depth: 0, overrideAccess: true });
    return doc as PayloadHomeHero;
  },
);
