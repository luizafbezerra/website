import { FAQ_CATEGORIES, type FaqCategory } from "@/domain/faq/FaqCategory";
import { pagePlateFrom } from "@/domain/media/pagePlateFrom";
import type { PayloadPagePerguntas } from "@/infrastructure/payload/getPagePerguntasGlobal";
import { PERGUNTAS_DEFAULTS, type Perguntas, type PerguntasSection } from "./Perguntas";

/** Blank strings are absences, not values — a cleared field must fall back. */
function filled(value: string | null | undefined): string | null {
  const text = value?.trim();
  return text ? text : null;
}

/**
 * This page has no arrays of its own, so the `[]`-is-not-absent rule the other
 * pages carry does not apply: the only repeating content is the `faq` collection,
 * where an emptied collection is handled by `getFaq` falling back to
 * `FAQ_DEFAULTS`.
 *
 * The four section groups are read one at a time from the same category list the
 * global generates them from, so a heading she has not written falls back to
 * CONCEPT §6's section name rather than leaving an `h2` blank. The `intro` is the
 * one field on the page with no default: it is absent until she writes one, and
 * absent means the section starts on its first question.
 */
function sectionFrom(
  raw: NonNullable<PayloadPagePerguntas["sections"]>[FaqCategory],
  category: FaqCategory,
): PerguntasSection {
  return {
    heading: filled(raw?.heading) ?? PERGUNTAS_DEFAULTS.sections[category].heading,
    intro: filled(raw?.intro),
  };
}

/** Normalize the raw `page-perguntas` global, falling back field by field. */
export function perguntasFromPayload(doc: PayloadPagePerguntas): Perguntas {
  const defaults = PERGUNTAS_DEFAULTS;

  const sections = {} as Record<FaqCategory, PerguntasSection>;
  for (const category of FAQ_CATEGORIES) {
    sections[category] = sectionFrom(doc.sections?.[category], category);
  }

  return {
    abertura: {
      heading: filled(doc.abertura?.heading) ?? defaults.abertura.heading,
      intro: filled(doc.abertura?.intro) ?? defaults.abertura.intro,
    },
    sections,
    plate: pagePlateFrom(doc.plate),
    fecho: {
      heading: filled(doc.fecho?.heading) ?? defaults.fecho.heading,
      body: filled(doc.fecho?.body) ?? defaults.fecho.body,
      whatsappLabel: filled(doc.fecho?.whatsappLabel) ?? defaults.fecho.whatsappLabel,
      linkLabel: filled(doc.fecho?.linkLabel) ?? defaults.fecho.linkLabel,
    },
  };
}
