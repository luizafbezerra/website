import { type NavLink, NAV_EXTRA_LINKS_DEFAULT } from "./navigation";
import { richText, type RichTextContent } from "./richText";
import { type SectionConfig, isSectionType, SECTIONS_DEFAULT } from "./sections";

// ---------------------------------------------------------------------------
// Home domain — the homepage's structure (section order + toggles), navigation
// links, and editable section copy. The copy lives across one small Payload
// global per section (all grouped under "Página inicial") instead of one
// monolithic document; this file keeps the single `Home` domain shape the page +
// components consume, plus a composing mapper.
//
// Each accent heading is a single constrained rich-text field (the editor marks
// the accent word in bold); the locked colour/italic per section lives in
// `core/accentHeading.ts`. The painted-asset captions (Quaternidade, squared-
// mandala marginalia) and the Cosmos section's copy stay in code.
// ---------------------------------------------------------------------------

export type PillarItem = { numeral: string; title: string; paragraph: string };

export type Home = {
  sections: SectionConfig[];
  navExtraLinks: NavLink[];
  hero: {
    subtitle: string;
    lead: RichTextContent;
    ctaPrimaryLabel: string;
    ctaSecondaryLabel: string;
    portraitUrl: string | null;
  };
  pillars: {
    eyebrow: string;
    heading: RichTextContent;
    intro: RichTextContent;
    note: string;
    items: PillarItem[];
  };
  about: {
    heading: RichTextContent;
    bio: RichTextContent;
    formacao: string;
    idiomas: string;
  };
  voices: { heading: string };
  contact: {
    eyebrow: string;
    heading: RichTextContent;
    body: RichTextContent;
    whatsappLabel: string;
    faqLinkLabel: string;
  };
};

export const HOME_DEFAULTS: Home = {
  sections: SECTIONS_DEFAULT,
  navExtraLinks: NAV_EXTRA_LINKS_DEFAULT,
  hero: {
    subtitle: "Para a vida adulta",
    lead: richText([
      [
        {
          text: "Atendo adultos em momentos em que a vida cotidiana já não dá conta do que está acontecendo: uma ",
        },
        { text: "ansiedade", italic: true },
        { text: " que não passa, um " },
        { text: "luto", italic: true },
        {
          text: " recente, um trabalho que perdeu o sentido. Escuto o que insiste e o que ainda não encontrou palavras.",
        },
      ],
    ]),
    ctaPrimaryLabel: "marcar uma conversa",
    ctaSecondaryLabel: "conhecer a abordagem antes",
    portraitUrl: null,
  },
  pillars: {
    eyebrow: "Como trabalho",
    heading: richText([
      [
        { text: "O que se repete costuma ter algo " },
        { text: "a dizer", bold: true },
        { text: "." },
      ],
    ]),
    intro: richText([
      "Tomo a sério o que se manifesta em sonhos, fantasias, imagens e sintomas. Não são ruído: são as maneiras pelas quais a psique fala sobre o que ainda não cabe em palavras.",
      "No trabalho clínico, isso aparece como uma atenção demorada, uma curiosidade pelo que está por trás do que dói. Não removo sintomas com pressa; procuro entender o que vieram dizer, para que o caminho à frente seja escolhido, e não apenas suportado.",
    ]),
    note: "Três frentes que costumam trazer alguém para a análise. Quase sempre se cruzam, e o trabalho começa por onde dói mais agora.",
    items: [
      {
        numeral: "I",
        title: "Ansiedade & humor",
        paragraph:
          "Ansiedade que aperta o peito, episódios de tristeza, medos que paralisam, uma melancolia que se instala sem nome. O trabalho começa por ouvir o que esses estados querem dizer.",
      },
      {
        numeral: "II",
        title: "Relações & vida",
        paragraph:
          "Lutos, separações, conflitos com a família, solidão, carências antigas. Os vínculos formam quem somos; quando ruem ou pesam, vale voltar para dentro e distinguir o que é nosso do que é do outro.",
      },
      {
        numeral: "III",
        title: "Carreira & propósito",
        paragraph:
          "Insatisfação profissional, estresse no trabalho, a sensação de estar no caminho errado, a busca por uma vocação que faça sentido. A análise abre espaço para escutar o que a psique já sabe.",
      },
    ],
  },
  about: {
    heading: richText([
      [
        { text: "Uma escuta cuidadosa, na tradição " },
        { text: "junguiana", bold: true },
        { text: "." },
      ],
    ]),
    bio: richText([
      "Sou psicóloga clínica. Atendo adultos que atravessam ansiedade, lutos, transições de carreira ou sofrimento nos vínculos.",
      "O ritmo importa tanto quanto o conteúdo. Nada do que costuma trazer alguém à análise se entende com pressa: sintomas persistentes, sonhos que voltam, símbolos que tocam algo antes de termos palavras.",
      "As primeiras sessões servem para vermos juntos se podemos seguir.",
    ]),
    formacao: "Psicologia clínica",
    idiomas: "Português",
  },
  voices: { heading: "Pacientes contam" },
  contact: {
    eyebrow: "Para começar",
    heading: richText([
      [
        { text: "Uma conversa breve costuma ser " },
        { text: "o suficiente", bold: true },
        { text: " para vermos se faz sentido." },
      ],
    ]),
    body: richText([
      "O caminho mais simples é o WhatsApp. Você me escreve uma mensagem curta (não precisa contar tudo de uma vez) e combinamos um horário para uma primeira conversa, sem compromisso. A partir dela decidimos juntos como seguir.",
    ]),
    whatsappLabel: "Conversar pelo WhatsApp",
    faqLinkLabel: "Perguntas frequentes antes da primeira conversa",
  },
};

// ── Raw Payload shapes (one per home-section global) ────────────────────────

type PayloadMedia = { url?: string | null } | string | number | null;
type PayloadRich = RichTextContent | null | undefined;

/** The repurposed `home` global: only page structure + off-page nav links. */
export type PayloadHomeStructure = {
  sections?: Array<{ type?: string | null; enabled?: boolean | null }> | null;
  navExtraLinks?: Array<{ label?: string | null; href?: string | null }> | null;
};

export type PayloadHomeHero = {
  subtitle?: string | null;
  lead?: PayloadRich;
  ctaPrimaryLabel?: string | null;
  ctaSecondaryLabel?: string | null;
  portrait?: PayloadMedia;
} | null;

export type PayloadHomePillars = {
  eyebrow?: string | null;
  heading?: PayloadRich;
  intro?: PayloadRich;
  note?: string | null;
  items?: Array<{
    numeral?: string | null;
    title?: string | null;
    paragraph?: string | null;
  }> | null;
} | null;

export type PayloadHomeAbout = {
  heading?: PayloadRich;
  bio?: PayloadRich;
  formacao?: string | null;
  idiomas?: string | null;
} | null;

export type PayloadHomeVoices = { heading?: string | null } | null;

export type PayloadHomeContact = {
  eyebrow?: string | null;
  heading?: PayloadRich;
  body?: PayloadRich;
  whatsappLabel?: string | null;
  faqLinkLabel?: string | null;
} | null;

/** The home-section globals, read together and composed into `Home`. */
export type PayloadHomeGlobals = {
  structure?: PayloadHomeStructure | null;
  hero?: PayloadHomeHero;
  pillars?: PayloadHomePillars;
  about?: PayloadHomeAbout;
  voices?: PayloadHomeVoices;
  contact?: PayloadHomeContact;
};

// ── Mapper ───────────────────────────────────────────────────────────────

/** Use a stored rich-text value only when it actually has content. */
function richOr(value: PayloadRich, fallback: RichTextContent): RichTextContent {
  const children = value?.root?.children;
  return Array.isArray(children) && children.length > 0 ? (value as RichTextContent) : fallback;
}

function portraitUrl(raw: PayloadMedia | undefined): string | null {
  if (raw && typeof raw === "object" && typeof raw.url === "string") return raw.url;
  return HOME_DEFAULTS.hero.portraitUrl;
}

export function homeFromPayload(docs: PayloadHomeGlobals): Home {
  const d = HOME_DEFAULTS;
  const { structure, hero, pillars, about, voices, contact } = docs;

  const sections: SectionConfig[] = (Array.isArray(structure?.sections) ? structure.sections : [])
    .filter((s) => isSectionType(s?.type))
    .map((s) => ({ type: s.type as SectionConfig["type"], enabled: s.enabled ?? true }));

  const navExtraLinks: NavLink[] =
    structure?.navExtraLinks == null
      ? d.navExtraLinks
      : structure.navExtraLinks
          .filter((l): l is { label: string; href: string } => Boolean(l?.label && l?.href))
          .map((l) => ({ label: l.label, href: l.href }));

  const items: PillarItem[] = Array.isArray(pillars?.items)
    ? pillars.items
        .filter((i): i is { numeral: string; title: string; paragraph: string } =>
          Boolean(i?.numeral && i?.title && i?.paragraph),
        )
        .map((i) => ({ numeral: i.numeral, title: i.title, paragraph: i.paragraph }))
    : d.pillars.items;

  return {
    sections: sections.length > 0 ? sections : d.sections,
    navExtraLinks,
    hero: {
      subtitle: hero?.subtitle ?? d.hero.subtitle,
      lead: richOr(hero?.lead, d.hero.lead),
      ctaPrimaryLabel: hero?.ctaPrimaryLabel ?? d.hero.ctaPrimaryLabel,
      ctaSecondaryLabel: hero?.ctaSecondaryLabel ?? d.hero.ctaSecondaryLabel,
      portraitUrl: portraitUrl(hero?.portrait),
    },
    pillars: {
      eyebrow: pillars?.eyebrow ?? d.pillars.eyebrow,
      heading: richOr(pillars?.heading, d.pillars.heading),
      intro: richOr(pillars?.intro, d.pillars.intro),
      note: pillars?.note ?? d.pillars.note,
      items: items.length > 0 ? items : d.pillars.items,
    },
    about: {
      heading: richOr(about?.heading, d.about.heading),
      bio: richOr(about?.bio, d.about.bio),
      formacao: about?.formacao ?? d.about.formacao,
      idiomas: about?.idiomas ?? d.about.idiomas,
    },
    voices: {
      heading: voices?.heading ?? d.voices.heading,
    },
    contact: {
      eyebrow: contact?.eyebrow ?? d.contact.eyebrow,
      heading: richOr(contact?.heading, d.contact.heading),
      body: richOr(contact?.body, d.contact.body),
      whatsappLabel: contact?.whatsappLabel ?? d.contact.whatsappLabel,
      faqLinkLabel: contact?.faqLinkLabel ?? d.contact.faqLinkLabel,
    },
  };
}
