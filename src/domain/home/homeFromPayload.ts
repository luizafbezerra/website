import type { RichTextContent } from "@/domain/richText/RichTextContent";
import { isSectionType, type SectionConfig } from "@/domain/sections/sectionRegistry";
import type { NavLink } from "@/domain/site/NavLink";
import type {
  PayloadHomeAbout,
  PayloadHomeContact,
  PayloadHomeHero,
  PayloadHomePillars,
  PayloadHomeStructure,
  PayloadHomeVoices,
  PayloadMedia,
} from "@/infrastructure/payload/homeGlobalShapes";
import { type Home, HOME_DEFAULTS, type PillarItem } from "./Home";

/** The home-section globals, read together and composed into `Home`. */
export type PayloadHomeGlobals = {
  structure: PayloadHomeStructure;
  hero: PayloadHomeHero;
  pillars: PayloadHomePillars;
  about: PayloadHomeAbout;
  voices: PayloadHomeVoices;
  contact: PayloadHomeContact;
};

/** Use a stored rich-text value only when it actually has content. */
function richOr(
  value: RichTextContent | null | undefined,
  fallback: RichTextContent,
): RichTextContent {
  if (!value) return fallback;

  const children = value.root?.children;
  return Array.isArray(children) && children.length > 0 ? value : fallback;
}

function portraitUrl(raw: PayloadMedia | undefined): string | null {
  if (raw && typeof raw === "object" && typeof raw.url === "string") return raw.url;
  return HOME_DEFAULTS.hero.portraitUrl;
}

export function homeFromPayload(docs: PayloadHomeGlobals): Home {
  const defaults = HOME_DEFAULTS;
  const { structure, hero, pillars, about, voices, contact } = docs;

  const sections: SectionConfig[] = (Array.isArray(structure?.sections) ? structure.sections : [])
    .filter((section) => isSectionType(section?.type))
    .map((section) => ({
      type: section.type as SectionConfig["type"],
      enabled: section.enabled ?? true,
    }));

  const navExtraLinks: NavLink[] =
    structure?.navExtraLinks == null
      ? defaults.navExtraLinks
      : structure.navExtraLinks
          .filter((link): link is { label: string; href: string } =>
            Boolean(link?.label && link?.href),
          )
          .map((link) => ({ label: link.label, href: link.href }));

  const items: PillarItem[] = Array.isArray(pillars?.items)
    ? pillars.items
        .filter((item): item is PillarItem =>
          Boolean(item?.numeral && item?.title && item?.paragraph),
        )
        .map((item) => ({ numeral: item.numeral, title: item.title, paragraph: item.paragraph }))
    : defaults.pillars.items;

  return {
    sections: sections.length > 0 ? sections : defaults.sections,
    navExtraLinks,
    hero: {
      subtitle: hero?.subtitle ?? defaults.hero.subtitle,
      lead: richOr(hero?.lead, defaults.hero.lead),
      ctaPrimaryLabel: hero?.ctaPrimaryLabel ?? defaults.hero.ctaPrimaryLabel,
      ctaSecondaryLabel: hero?.ctaSecondaryLabel ?? defaults.hero.ctaSecondaryLabel,
      portraitUrl: portraitUrl(hero?.portrait),
    },
    pillars: {
      eyebrow: pillars?.eyebrow ?? defaults.pillars.eyebrow,
      heading: richOr(pillars?.heading, defaults.pillars.heading),
      intro: richOr(pillars?.intro, defaults.pillars.intro),
      note: pillars?.note ?? defaults.pillars.note,
      items: items.length > 0 ? items : defaults.pillars.items,
    },
    about: {
      heading: richOr(about?.heading, defaults.about.heading),
      bio: richOr(about?.bio, defaults.about.bio),
      formacao: about?.formacao ?? defaults.about.formacao,
      idiomas: about?.idiomas ?? defaults.about.idiomas,
    },
    voices: {
      heading: voices?.heading ?? defaults.voices.heading,
    },
    contact: {
      eyebrow: contact?.eyebrow ?? defaults.contact.eyebrow,
      heading: richOr(contact?.heading, defaults.contact.heading),
      body: richOr(contact?.body, defaults.contact.body),
      whatsappLabel: contact?.whatsappLabel ?? defaults.contact.whatsappLabel,
      faqLinkLabel: contact?.faqLinkLabel ?? defaults.contact.faqLinkLabel,
    },
  };
}
