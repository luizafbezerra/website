import { getSettingsGlobal as infraGetSettingsGlobal } from "@/infrastructure/payload/getSettingsGlobal";
import { type Identity, IDENTITY_DEFAULTS } from "./Identity";
import type { Locale } from "./Locale";
import { identityFromPayload } from "./identityFromPayload";

/**
 * The practitioner identity + practice metadata. Falls back to
 * `IDENTITY_DEFAULTS` when Payload is off. This is the single read path for the
 * global; the site, layout metadata, and JSON-LD all consume it.
 */
export async function getIdentity(locale: Locale): Promise<Identity> {
  const settings = await infraGetSettingsGlobal(locale);
  if (!settings) return IDENTITY_DEFAULTS;

  return identityFromPayload(settings);
}
