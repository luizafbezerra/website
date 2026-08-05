import "server-only";
import { cache } from "react";
import type { Locale } from "@/domain/site/Locale";
import { getPayloadSafe } from "./getPayloadSafe";
import type { PayloadHomeAbout } from "./homeGlobalShapes";

/** The about section global, or null when Payload is disabled. */
export const getHomeAboutGlobal = cache(async function getHomeAboutGlobal(
  locale: Locale,
): Promise<PayloadHomeAbout> {
  const payload = await getPayloadSafe();
  if (!payload) return null;

  const doc = await payload.findGlobal({
    slug: "home-about",
    locale,
    depth: 0,
    overrideAccess: true,
  });
  return doc as PayloadHomeAbout;
});
