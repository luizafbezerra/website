import {
  type AccentHeading,
  accentHeadingFromPayload,
  type PayloadAccentHeading,
} from "./accentHeading";
import { type NavLink, NAV_EXTRA_LINKS_DEFAULT } from "./navigation";
import { richText, type RichTextContent } from "./richText";
import { type SectionConfig, isSectionType, SECTIONS_DEFAULT } from "./sections";

// ---------------------------------------------------------------------------
// Home domain — the homepage's structure (section order + toggles), navigation
// links, and editable section copy. Mirrors the identity pattern: loose raw
// type, field-by-field guarding, defaults fallback. The painted-asset captions
// (Quaternidade, squared-mandala marginalia) and the Cosmos section's copy stay
// in code — they describe hardcoded brand plates / live in core/cosmos.ts.
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
    heading: AccentHeading;
    intro: RichTextContent;
    note: string;
    items: PillarItem[];
  };
  about: {
    eyebrow: string;
    heading: AccentHeading;
    bio: RichTextContent;
    formacao: string;
    idiomas: string;
  };
  voices: { eyebrow: string; heading: string };
  writing: { eyebrow: string; heading: AccentHeading; intro: string };
  contact: {
    eyebrow: string;
    heading: AccentHeading;
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
          text: "Atendo adultos em momentos em que a vida cotidiana parece insuficiente para conter o que está acontecendo — uma ",
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
    heading: {
      lead: "O que se repete costuma ter algo ",
      accentWord: "a dizer",
      trail: ".",
      accentStyle: "terracotta",
      accentItalic: true,
    },
    intro: richText([
      "Tomo a sério aquilo que se manifesta em sonhos, fantasias, imagens e sintomas. Eles não são ruído: são as maneiras pelas quais a psique fala sobre o que ainda não cabe em palavras.",
      "No trabalho clínico, isso aparece como uma atenção demorada — uma curiosidade pelo que está por trás daquilo que dói. Não trato de remover sintomas com pressa: ajudo a entender o que vieram dizer, para que o caminho à frente seja escolhido — e não apenas suportado.",
    ]),
    note: "Três frentes que costumam trazer alguém para a análise — quase sempre se cruzam, e o trabalho começa por onde dói mais agora.",
    items: [
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
    ],
  },
  about: {
    eyebrow: "Sobre Luiza",
    heading: {
      lead: "Uma escuta cuidadosa, na tradição ",
      accentWord: "junguiana",
      trail: ".",
      accentStyle: "cobalt",
      accentItalic: false,
    },
    bio: richText([
      "Sou psicóloga clínica. O foco do trabalho está em adultos que atravessam ansiedade, lutos, transições de carreira ou sofrimento nos vínculos.",
      "O ritmo importa tanto quanto o conteúdo. Nada do que costuma trazer alguém à análise — sintomas persistentes, sonhos que voltam, símbolos que tocam algo antes de termos palavras — se entende com pressa.",
      "As primeiras sessões servem para compreendermos juntos se podemos seguir juntos.",
    ]),
    formacao: "Psicologia clínica",
    idiomas: "Português",
  },
  voices: { eyebrow: "Em primeira pessoa", heading: "Pacientes contam" },
  writing: {
    eyebrow: "Escrita",
    heading: {
      lead: "Algumas ",
      accentWord: "anotações",
      trail: " do consultório.",
      accentStyle: "terracotta",
      accentItalic: false,
    },
    intro:
      "Notas sobre o que costuma ficar dito nas entrelinhas da vida adulta. Não substituem o trabalho clínico — fazem companhia entre as sessões e fora delas.",
  },
  contact: {
    eyebrow: "Para começar",
    heading: {
      lead: "Uma conversa breve costuma ser ",
      accentWord: "o suficiente",
      trail: " para vermos se faz sentido.",
      accentStyle: "terracotta",
      accentItalic: true,
    },
    body: richText([
      "O caminho mais simples é o WhatsApp. Você me escreve uma mensagem curta — não precisa contar tudo de uma vez — e combinamos um horário para uma primeira conversa, sem compromisso. A partir dela decidimos juntos como seguir.",
    ]),
    whatsappLabel: "Conversar pelo WhatsApp",
    faqLinkLabel: "Perguntas frequentes antes da primeira conversa",
  },
};

// ── Raw Payload shape ──────────────────────────────────────────────────────

type PayloadMedia = { url?: string | null } | string | number | null;
type PayloadRich = RichTextContent | null | undefined;

export type PayloadHome = {
  sections?: Array<{ type?: string | null; enabled?: boolean | null }> | null;
  navExtraLinks?: Array<{ label?: string | null; href?: string | null }> | null;
  hero?: {
    subtitle?: string | null;
    lead?: PayloadRich;
    ctaPrimaryLabel?: string | null;
    ctaSecondaryLabel?: string | null;
    portrait?: PayloadMedia;
  } | null;
  pillars?: {
    eyebrow?: string | null;
    heading?: PayloadAccentHeading | null;
    intro?: PayloadRich;
    note?: string | null;
    items?: Array<{
      numeral?: string | null;
      title?: string | null;
      paragraph?: string | null;
    }> | null;
  } | null;
  about?: {
    eyebrow?: string | null;
    heading?: PayloadAccentHeading | null;
    bio?: PayloadRich;
    formacao?: string | null;
    idiomas?: string | null;
  } | null;
  voices?: { eyebrow?: string | null; heading?: string | null } | null;
  writing?: {
    eyebrow?: string | null;
    heading?: PayloadAccentHeading | null;
    intro?: string | null;
  } | null;
  contact?: {
    eyebrow?: string | null;
    heading?: PayloadAccentHeading | null;
    body?: PayloadRich;
    whatsappLabel?: string | null;
    faqLinkLabel?: string | null;
  } | null;
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

export function homeFromPayload(doc: PayloadHome): Home {
  const d = HOME_DEFAULTS;

  const sections: SectionConfig[] = (Array.isArray(doc.sections) ? doc.sections : [])
    .filter((s) => isSectionType(s?.type))
    .map((s) => ({ type: s.type as SectionConfig["type"], enabled: s.enabled ?? true }));

  const navExtraLinks: NavLink[] =
    doc.navExtraLinks == null
      ? d.navExtraLinks
      : doc.navExtraLinks
          .filter((l): l is { label: string; href: string } => Boolean(l?.label && l?.href))
          .map((l) => ({ label: l.label, href: l.href }));

  const items: PillarItem[] = Array.isArray(doc.pillars?.items)
    ? doc.pillars.items
        .filter((i): i is { numeral: string; title: string; paragraph: string } =>
          Boolean(i?.numeral && i?.title && i?.paragraph),
        )
        .map((i) => ({ numeral: i.numeral, title: i.title, paragraph: i.paragraph }))
    : d.pillars.items;

  return {
    sections: sections.length > 0 ? sections : d.sections,
    navExtraLinks,
    hero: {
      subtitle: doc.hero?.subtitle ?? d.hero.subtitle,
      lead: richOr(doc.hero?.lead, d.hero.lead),
      ctaPrimaryLabel: doc.hero?.ctaPrimaryLabel ?? d.hero.ctaPrimaryLabel,
      ctaSecondaryLabel: doc.hero?.ctaSecondaryLabel ?? d.hero.ctaSecondaryLabel,
      portraitUrl: portraitUrl(doc.hero?.portrait),
    },
    pillars: {
      eyebrow: doc.pillars?.eyebrow ?? d.pillars.eyebrow,
      heading: accentHeadingFromPayload(doc.pillars?.heading, d.pillars.heading),
      intro: richOr(doc.pillars?.intro, d.pillars.intro),
      note: doc.pillars?.note ?? d.pillars.note,
      items: items.length > 0 ? items : d.pillars.items,
    },
    about: {
      eyebrow: doc.about?.eyebrow ?? d.about.eyebrow,
      heading: accentHeadingFromPayload(doc.about?.heading, d.about.heading),
      bio: richOr(doc.about?.bio, d.about.bio),
      formacao: doc.about?.formacao ?? d.about.formacao,
      idiomas: doc.about?.idiomas ?? d.about.idiomas,
    },
    voices: {
      eyebrow: doc.voices?.eyebrow ?? d.voices.eyebrow,
      heading: doc.voices?.heading ?? d.voices.heading,
    },
    writing: {
      eyebrow: doc.writing?.eyebrow ?? d.writing.eyebrow,
      heading: accentHeadingFromPayload(doc.writing?.heading, d.writing.heading),
      intro: doc.writing?.intro ?? d.writing.intro,
    },
    contact: {
      eyebrow: doc.contact?.eyebrow ?? d.contact.eyebrow,
      heading: accentHeadingFromPayload(doc.contact?.heading, d.contact.heading),
      body: richOr(doc.contact?.body, d.contact.body),
      whatsappLabel: doc.contact?.whatsappLabel ?? d.contact.whatsappLabel,
      faqLinkLabel: doc.contact?.faqLinkLabel ?? d.contact.faqLinkLabel,
    },
  };
}
