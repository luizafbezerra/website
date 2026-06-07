import type { Payload } from "payload";
import { HOME_DEFAULTS } from "@/core/home";
import type { RichTextContent } from "@/core/richText";
import type { Home as HomeDoc } from "@/payload-types";

// The generated richText field type (same Lexical editor for every body).
type Lexical = NonNullable<NonNullable<HomeDoc["hero"]>["lead"]>;
const rt = (content: RichTextContent): Lexical => content as unknown as Lexical;

/**
 * Seed the `home` global from `HOME_DEFAULTS` — the section order, nav links,
 * and editorial copy the site falls back to in code. Idempotent (globals
 * upsert). Skips revalidation so it can run outside a Next request.
 */
export async function seedHome(payload: Payload): Promise<void> {
  const d = HOME_DEFAULTS;

  await payload.updateGlobal({
    slug: "home",
    overrideAccess: true,
    context: { skipRevalidate: true },
    data: {
      sections: d.sections.map((s) => ({ type: s.type, enabled: s.enabled })),
      navExtraLinks: d.navExtraLinks.map((l) => ({ label: l.label, href: l.href })),
      hero: {
        subtitle: d.hero.subtitle,
        lead: rt(d.hero.lead),
        ctaPrimaryLabel: d.hero.ctaPrimaryLabel,
        ctaSecondaryLabel: d.hero.ctaSecondaryLabel,
      },
      pillars: {
        eyebrow: d.pillars.eyebrow,
        heading: d.pillars.heading,
        intro: rt(d.pillars.intro),
        note: d.pillars.note,
        items: d.pillars.items.map((i) => ({ ...i })),
      },
      about: {
        eyebrow: d.about.eyebrow,
        heading: d.about.heading,
        bio: rt(d.about.bio),
        formacao: d.about.formacao,
        idiomas: d.about.idiomas,
      },
      voices: { eyebrow: d.voices.eyebrow, heading: d.voices.heading },
      writing: {
        eyebrow: d.writing.eyebrow,
        heading: d.writing.heading,
        intro: d.writing.intro,
      },
      contact: {
        eyebrow: d.contact.eyebrow,
        heading: d.contact.heading,
        body: rt(d.contact.body),
        whatsappLabel: d.contact.whatsappLabel,
        faqLinkLabel: d.contact.faqLinkLabel,
      },
    },
  });

  payload.logger.info("  ✓ home global");
}
