import { whatsappUrlFromPhone } from "./whatsappUrlFromPhone";

// ---------------------------------------------------------------------------
// Everything the site needs about the practitioner & practice. `whatsappUrl` is
// derived from the phone number, never stored.
//
// IDENTITY_DEFAULTS is what renders when Payload is disabled or a field is
// blank. These values predate CONCEPT v3 (they still describe in-person work in
// Guarulhos); Phase 4 replaces them with the "A Clínica" global's online-only
// defaults, so they are carried over verbatim here rather than rewritten.
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

const PHONE_E164 = "+5511964158128";

export const IDENTITY_DEFAULTS: Identity = {
  fullName: "Luiza Fernandes Bezerra",
  shortName: "Luiza Bezerra",
  role: "Psicóloga clínica",
  tradition: "Análise junguiana",
  // Empty until she supplies her real CRP. Left blank (not a placeholder like
  // "CRP 00/00000") so the "Registro" row hides instead of advertising a fake
  // registration. Editable via Settings → identity.credential.
  credential: "",
  city: "Guarulhos",
  region: "São Paulo",
  country: "Brasil",
  countryCode: "BR",
  phoneE164: PHONE_E164,
  phoneDisplay: "+55 11 96415-8128",
  email: "luizafbezerra@gmail.com",
  instagramUrl: "https://www.instagram.com/simbolos.do.self/",
  instagramHandle: "@simbolos.do.self",
  whatsappUrl: whatsappUrlFromPhone(PHONE_E164),
  // TODO: confirm hours and response window with her before publishing. Null
  // hides the row.
  availability: { hours: null, responseNote: null },
  headerByline: "psicóloga · análise junguiana",
  footerByline: "psicóloga clínica",
  // TODO: confirm with her — used as meta description fallback and in OG tags.
  tagline:
    "Psicoterapia para adultos na tradição da psicologia analítica de C. G. Jung — presencial em Guarulhos e online em todo o Brasil.",
  siteName: "Luiza Fernandes Bezerra — Psicóloga",
  description:
    "Psicóloga clínica em Guarulhos. Análise junguiana para ansiedade, relações e propósito. Atendimento online e presencial.",
  ogImageUrl: null,
  social: [],
};
