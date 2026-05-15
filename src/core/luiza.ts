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

  // TODO: replace with Luiza's real CRP number (state + digits)
  export const credential = "CRP placeholder";

  // TODO: confirm with Luiza — used as meta description fallback and in OG tags
  export const tagline =
    "Psicoterapia para adultos na tradição da psicologia analítica de C. G. Jung — presencial em Guarulhos e online em todo o Brasil.";

  // The three pillar titles come from the brief and are confirmed.
  // TODO: pillar paragraphs — confirm or rewrite with Luiza
  export const pillars = [
    {
      numeral: "I",
      title: "Ansiedade & humor",
      paragraph:
        "Ansiedade que aperta o peito, episódios de tristeza, medos que paralisam, uma melancolia que se instala sem nome. O trabalho começa por ouvir o que esses estados estão tentando dizer.",
    },
    {
      numeral: "II",
      title: "Relações & vida",
      paragraph:
        "Lutos, separações, conflitos com a família, solidão, carências antigas. Os vínculos formam quem somos; quando ruem ou pesam, vale voltar à própria interioridade para entender o que pertence a nós e o que pertence ao outro.",
    },
    {
      numeral: "III",
      title: "Carreira & propósito",
      paragraph:
        "Insatisfação profissional, estresse no trabalho, a sensação de estar no caminho errado, a busca por uma vocação que faça sentido. A análise abre espaço para escutar o que a psique já sabe.",
    },
  ] as const;

  // Empty until Luiza provides real testimonials with permission.
  // The Voices section auto-hides while this array is empty.
  // TODO: collect 3–5 testimonials from existing patients (with consent + initials only).
  export const testimonials: ReadonlyArray<{
    body: string;
    attribution: string;
  }> = [];

  // TODO: confirm hours and response window with Luiza before publishing.
  export const availability = {
    presentialCity: city,
    onlineRegion: country,
    // Set to null to hide the row in Contact until confirmed.
    hours: null as string | null,
    responseNote: null as string | null,
  } as const;
}
