import type { PayloadSettings } from "@/infrastructure/payload/getSettingsGlobal";
import { type Identity, IDENTITY_DEFAULTS } from "./Identity";
import { whatsappUrlFromPhone } from "./whatsappUrlFromPhone";

function resolveOgImageUrl(raw: PayloadSettings["ogImage"]): string | null {
  if (raw && typeof raw === "object" && typeof raw.url === "string") return raw.url;
  return IDENTITY_DEFAULTS.ogImageUrl;
}

/** Normalize the raw `settings` global, falling back field-by-field. */
export function identityFromPayload(doc: PayloadSettings): Identity {
  const defaults = IDENTITY_DEFAULTS;
  const phoneE164 = doc.contact?.phoneE164 ?? defaults.phoneE164;

  const social = Array.isArray(doc.social)
    ? doc.social
        .filter((entry): entry is { label: string; url: string } =>
          Boolean(entry?.label && entry?.url),
        )
        .map((entry) => ({ label: entry.label, url: entry.url }))
    : defaults.social;

  return {
    fullName: doc.identity?.fullName ?? defaults.fullName,
    shortName: doc.identity?.shortName ?? defaults.shortName,
    role: doc.identity?.role ?? defaults.role,
    tradition: doc.identity?.tradition ?? defaults.tradition,
    credential: doc.identity?.credential ?? defaults.credential,
    city: doc.nap?.city ?? defaults.city,
    region: doc.nap?.region ?? defaults.region,
    country: doc.nap?.country ?? defaults.country,
    countryCode: doc.nap?.countryCode ?? defaults.countryCode,
    phoneE164,
    phoneDisplay: doc.contact?.phoneDisplay ?? defaults.phoneDisplay,
    email: doc.contact?.email ?? defaults.email,
    instagramUrl: doc.contact?.instagramUrl ?? defaults.instagramUrl,
    instagramHandle: doc.contact?.instagramHandle ?? defaults.instagramHandle,
    whatsappUrl: whatsappUrlFromPhone(phoneE164),
    availability: {
      hours: doc.availability?.hours ?? defaults.availability.hours,
      responseNote: doc.availability?.responseNote ?? defaults.availability.responseNote,
    },
    headerByline: doc.chrome?.headerByline ?? defaults.headerByline,
    footerByline: doc.chrome?.footerByline ?? defaults.footerByline,
    tagline: doc.tagline ?? defaults.tagline,
    siteName: doc.siteName ?? defaults.siteName,
    description: doc.description ?? defaults.description,
    ogImageUrl: resolveOgImageUrl(doc.ogImage),
    social,
  };
}
