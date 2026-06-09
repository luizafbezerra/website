export namespace Luiza {
  export const fullName = "Luiza Fernandes Bezerra";
  export const shortName = "Luiza Bezerra";
  export const role = "Psicóloga clínica";
  export const tradition = "Análise junguiana";
  export const city = "Guarulhos";
  export const region = "São Paulo";
  export const country = "Brasil";
  export const countryCode = "BR";

  export const phoneE164 = "+5511964158128";
  export const phoneDisplay = "+55 11 96415-8128";
  export const email = "luizafbezerra@gmail.com";
  export const whatsappUrl = `https://wa.me/${phoneE164.replace(/\D/g, "")}`;

  export const instagramUrl = "https://www.instagram.com/simbolos.do.self/";
  export const instagramHandle = "@simbolos.do.self";

  // Empty until Luiza supplies her real CRP. Left blank (not a placeholder like
  // "CRP 00/00000") so the "Registro" row in About hides instead of advertising a
  // fake registration. Editable via the Payload Settings → identity.credential
  // field; set it there (e.g. "CRP 06/123456") and the row reappears.
  export const credential = "";

  // TODO: confirm with Luiza — used as meta description fallback and in OG tags
  export const tagline =
    "Psicoterapia para adultos na tradição da psicologia analítica de C. G. Jung — presencial em Guarulhos e online em todo o Brasil.";

  // Pillars now live in the Home global (`core/home.ts` HOME_DEFAULTS.pillars),
  // and testimonials in the `testimonials` collection — both removed from here.

  // TODO: confirm hours and response window with Luiza before publishing.
  export const availability = {
    presentialCity: city,
    onlineRegion: country,
    // Set to null to hide the row in Contact until confirmed.
    hours: null as string | null,
    responseNote: null as string | null,
  } as const;
}
