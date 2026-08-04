import "server-only";
import { cache } from "react";
import { getPayloadSafe } from "./getPayloadSafe";
import type { PayloadHomeAbout } from "./homeGlobalShapes";

/** The about section global, or null when Payload is disabled. */
export const getHomeAboutGlobal = cache(
  async function getHomeAboutGlobal(): Promise<PayloadHomeAbout> {
    const payload = await getPayloadSafe();
    if (!payload) return null;

    const doc = await payload.findGlobal({ slug: "home-about", depth: 0, overrideAccess: true });
    return doc as PayloadHomeAbout;
  },
);
