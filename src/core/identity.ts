import { Luiza } from "./luiza";

// ---------------------------------------------------------------------------
// Domain type — everything the site needs about the practitioner & practice.
// `whatsappUrl` is derived (never stored), the same principle the original
// `Luiza.whatsappUrl` followed.
// ---------------------------------------------------------------------------

export type Identity = {
  // identity
  fullName: string;
  shortName: string;
  role: string;
  tradition: string;
  credential: string;
  // location (NAP)
  city: string;
  region: string;
  country: string;
  countryCode: string;
  // contact
  phoneE164: string;
  phoneDisplay: string;
  email: string;
  instagramUrl: string;
  instagramHandle: string;
  whatsappUrl: string; // derived from phoneE164
  // availability (nullable → row hides when absent)
  availability: { hours: string | null; responseNote: string | null };
  // chrome
  headerByline: string;
  footerByline: string;
  // copy / meta
  tagline: string;
  siteName: string;
  description: string;
  ogImageUrl: string | null;
  social: { label: string; url: string }[];
};

// ---------------------------------------------------------------------------
// Raw Payload `settings` global shape (loose, like blog.ts's PayloadPost).
// Groups flatten to nested objects; every field is optional so the mapper can
// fall back to defaults field-by-field.
// ---------------------------------------------------------------------------

type PayloadMediaObject = { url?: string | null };

export type PayloadSettings = {
  siteName?: string | null;
  description?: string | null;
  ogImage?: PayloadMediaObject | string | number | null;
  social?: Array<{ label?: string | null; url?: string | null }> | null;
  tagline?: string | null;
  identity?: {
    fullName?: string | null;
    shortName?: string | null;
    role?: string | null;
    tradition?: string | null;
    credential?: string | null;
  } | null;
  nap?: {
    city?: string | null;
    region?: string | null;
    country?: string | null;
    countryCode?: string | null;
  } | null;
  contact?: {
    phoneE164?: string | null;
    phoneDisplay?: string | null;
    email?: string | null;
    instagramUrl?: string | null;
    instagramHandle?: string | null;
  } | null;
  availability?: {
    hours?: string | null;
    responseNote?: string | null;
  } | null;
  chrome?: {
    headerByline?: string | null;
    footerByline?: string | null;
  } | null;
};

// ---------------------------------------------------------------------------
// Derivations & defaults
// ---------------------------------------------------------------------------

/** wa.me link from any phone string — strips non-digits, same as Luiza.whatsappUrl. */
export function whatsappUrlFromPhone(phoneE164: string): string {
  return `https://wa.me/${phoneE164.replace(/\D/g, "")}`;
}

/**
 * The hardcoded values the site renders when Payload is disabled or a field is
 * blank. Sourced from `luiza.ts` (the transitional single source) plus the few
 * chrome/meta strings that previously lived inline in layout/Header/Footer.
 */
export const IDENTITY_DEFAULTS: Identity = {
  fullName: Luiza.fullName,
  shortName: Luiza.shortName,
  role: Luiza.role,
  tradition: Luiza.tradition,
  credential: Luiza.credential,
  city: Luiza.city,
  region: Luiza.region,
  country: Luiza.country,
  countryCode: Luiza.countryCode,
  phoneE164: Luiza.phoneE164,
  phoneDisplay: Luiza.phoneDisplay,
  email: Luiza.email,
  instagramUrl: Luiza.instagramUrl,
  instagramHandle: Luiza.instagramHandle,
  whatsappUrl: Luiza.whatsappUrl,
  availability: {
    hours: Luiza.availability.hours,
    responseNote: Luiza.availability.responseNote,
  },
  headerByline: "psicóloga · análise junguiana",
  footerByline: "psicóloga clínica",
  tagline: Luiza.tagline,
  siteName: "Luiza Fernandes Bezerra — Psicóloga",
  description:
    "Psicóloga clínica em Guarulhos. Análise junguiana para ansiedade, relações e propósito. Atendimento online e presencial em pt-BR.",
  ogImageUrl: null,
  social: [],
};

// ---------------------------------------------------------------------------
// Mapper
// ---------------------------------------------------------------------------

function resolveOgImageUrl(raw: PayloadSettings["ogImage"]): string | null {
  if (raw && typeof raw === "object" && typeof raw.url === "string") return raw.url;
  return IDENTITY_DEFAULTS.ogImageUrl;
}

export function identityFromPayload(doc: PayloadSettings): Identity {
  const d = IDENTITY_DEFAULTS;
  const phoneE164 = doc.contact?.phoneE164 ?? d.phoneE164;

  const social = Array.isArray(doc.social)
    ? doc.social
        .filter((s): s is { label: string; url: string } => Boolean(s?.label && s?.url))
        .map((s) => ({ label: s.label, url: s.url }))
    : d.social;

  return {
    fullName: doc.identity?.fullName ?? d.fullName,
    shortName: doc.identity?.shortName ?? d.shortName,
    role: doc.identity?.role ?? d.role,
    tradition: doc.identity?.tradition ?? d.tradition,
    credential: doc.identity?.credential ?? d.credential,
    city: doc.nap?.city ?? d.city,
    region: doc.nap?.region ?? d.region,
    country: doc.nap?.country ?? d.country,
    countryCode: doc.nap?.countryCode ?? d.countryCode,
    phoneE164,
    phoneDisplay: doc.contact?.phoneDisplay ?? d.phoneDisplay,
    email: doc.contact?.email ?? d.email,
    instagramUrl: doc.contact?.instagramUrl ?? d.instagramUrl,
    instagramHandle: doc.contact?.instagramHandle ?? d.instagramHandle,
    whatsappUrl: whatsappUrlFromPhone(phoneE164),
    availability: {
      hours: doc.availability?.hours ?? d.availability.hours,
      responseNote: doc.availability?.responseNote ?? d.availability.responseNote,
    },
    headerByline: doc.chrome?.headerByline ?? d.headerByline,
    footerByline: doc.chrome?.footerByline ?? d.footerByline,
    tagline: doc.tagline ?? d.tagline,
    siteName: doc.siteName ?? d.siteName,
    description: doc.description ?? d.description,
    ogImageUrl: resolveOgImageUrl(doc.ogImage),
    social,
  };
}
