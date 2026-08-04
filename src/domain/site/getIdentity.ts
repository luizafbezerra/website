import { getSettingsGlobal as infraGetSettingsGlobal } from "@/infrastructure/payload/getSettingsGlobal";
import { type Identity, IDENTITY_DEFAULTS } from "./Identity";
import { identityFromPayload } from "./identityFromPayload";

/**
 * The practitioner identity + practice metadata. Falls back to
 * `IDENTITY_DEFAULTS` when Payload is off. This is the single read path for the
 * global; the site, layout metadata, and JSON-LD all consume it.
 */
export async function getIdentity(): Promise<Identity> {
  const settings = await infraGetSettingsGlobal();
  if (!settings) return IDENTITY_DEFAULTS;

  return identityFromPayload(settings);
}
