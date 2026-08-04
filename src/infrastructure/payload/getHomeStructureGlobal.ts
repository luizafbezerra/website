import "server-only";
import { cache } from "react";
import { getPayloadSafe } from "./getPayloadSafe";
import type { PayloadHomeStructure } from "./homeGlobalShapes";

/** The homepage structure global (section order + off-page nav links), or null when Payload is disabled. */
export const getHomeStructureGlobal = cache(
  async function getHomeStructureGlobal(): Promise<PayloadHomeStructure> {
    const payload = await getPayloadSafe();
    if (!payload) return null;

    const doc = await payload.findGlobal({ slug: "home", depth: 0, overrideAccess: true });
    return doc as PayloadHomeStructure;
  },
);
