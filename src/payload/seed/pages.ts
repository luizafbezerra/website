import type { Payload } from "payload";
import { HOME_DEFAULTS } from "@/domain/home/Home";
import type { RichTextContent } from "@/domain/richText/RichTextContent";
import { extractRuns } from "@/domain/richText/extractRuns";
import type { PageInicio } from "@/payload-types";

/**
 * Seed the page globals with the copy that already exists (TASK-026).
 *
 * Only three pages get anything: her words are carried from where they lived on
 * the old single-page site to the section that owns them in the eight-page map.
 * The other five globals stay empty on purpose — inventing prose in her name
 * would break the authorship policy (CONCEPT §11), and each field's admin
 * description already says what belongs there. The wheel's twelve readings stay
 * empty for the same reason (REQ-007): the wheel ships visual-only.
 *
 * Portuguese only. English falls back to Portuguese through Payload's
 * `fallback: true` until her polish pass (RISK-001).
 */

// Every richText field across the page globals shares the same Lexical editor
// shape; one cast bridges our structural RichTextContent to it.
type Lexical = NonNullable<NonNullable<PageInicio["hero"]>["lead"]>;
const rt = (content: RichTextContent): Lexical => content as unknown as Lexical;

/** The plain-text form of a heading that used to carry an accent word. */
const plain = (content: RichTextContent): string =>
  extractRuns(content)
    .map((run) => run.text)
    .join("");

export async function seedPages(payload: Payload): Promise<void> {
  const home = HOME_DEFAULTS;
  const shared = { locale: "pt", overrideAccess: true, context: { skipRevalidate: true } } as const;

  // Início — her opening paragraph, the closing invitation, the Vozes title.
  await payload.updateGlobal({
    ...shared,
    slug: "page-inicio",
    data: {
      hero: {
        lead: rt(home.hero.lead),
        ctaPrimaryLabel: home.hero.ctaPrimaryLabel,
        ctaSecondaryLabel: home.hero.ctaSecondaryLabel,
      },
      vozes: { heading: home.voices.heading },
      contato: {
        eyebrow: home.contact.eyebrow,
        heading: plain(home.contact.heading),
        body: rt(home.contact.body),
        whatsappLabel: home.contact.whatsappLabel,
      },
    },
  });

  // A Análise — the three pillars and the intro she rewrote herself, which is the
  // one piece of copy that existed only in the database.
  await payload.updateGlobal({
    ...shared,
    slug: "page-analise",
    data: {
      oQueTrazem: {
        heading: plain(home.pillars.heading),
        intro: rt(home.pillars.intro),
        note: home.pillars.note,
        pillars: home.pillars.items.map((item) => ({
          numeral: item.numeral,
          title: item.title,
          text: item.paragraph,
        })),
      },
    },
  });

  // Sobre — her bio moves from the home digest to the page that owns it.
  await payload.updateGlobal({
    ...shared,
    slug: "page-sobre",
    data: {
      quemE: { heading: plain(home.about.heading), body: rt(home.about.bio) },
    },
  });

  payload.logger.info("  ✓ page globals (início, análise, sobre)");
}
