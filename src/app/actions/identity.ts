import {
  type Identity,
  IDENTITY_DEFAULTS,
  identityFromPayload,
  type PayloadSettings,
} from "@/core/identity";
import { getPayloadSafe } from "@/lib/payload";
import { cache } from "react";

/**
 * The practitioner identity + practice metadata, from the Payload `settings`
 * global with a graceful fall back to `IDENTITY_DEFAULTS` (same degradation
 * model as `getAllPosts`). This is the single read path for the global; the
 * site, layout metadata, and JSON-LD all consume it.
 */
export const getIdentity = cache(async function getIdentity(): Promise<Identity> {
  const payload = await getPayloadSafe();
  if (!payload) return IDENTITY_DEFAULTS;

  const settings = await payload.findGlobal({
    slug: "settings",
    depth: 1,
    overrideAccess: true,
  });

  return identityFromPayload(settings as PayloadSettings);
});
