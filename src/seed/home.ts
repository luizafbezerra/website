import type { Payload } from "payload";
import { HOME_DEFAULTS } from "@/core/home";
import type { RichTextContent } from "@/core/richText";
import type { HomeHero } from "@/payload-types";

// Every richText field across the home globals shares the same Lexical editor
// shape; one cast bridges our structural RichTextContent to it.
type Lexical = NonNullable<HomeHero["lead"]>;
const rt = (content: RichTextContent): Lexical => content as unknown as Lexical;

/**
 * Seed the seven home-section globals from `HOME_DEFAULTS` — the section order,
 * nav links, and editorial copy the site falls back to in code. Idempotent
 * (globals upsert). Skips revalidation so it can run outside a Next request.
 */
export async function seedHome(payload: Payload): Promise<void> {
  const d = HOME_DEFAULTS;
  const ctx = { skipRevalidate: true };

  // Structure: section order/toggles + off-page nav links.
  await payload.updateGlobal({
    slug: "home",
    overrideAccess: true,
    context: ctx,
    data: {
      sections: d.sections.map((s) => ({ type: s.type, enabled: s.enabled })),
      navExtraLinks: d.navExtraLinks.map((l) => ({ label: l.label, href: l.href })),
    },
  });

  await payload.updateGlobal({
    slug: "home-hero",
    overrideAccess: true,
    context: ctx,
    data: {
      subtitle: d.hero.subtitle,
      lead: rt(d.hero.lead),
      ctaPrimaryLabel: d.hero.ctaPrimaryLabel,
      ctaSecondaryLabel: d.hero.ctaSecondaryLabel,
    },
  });

  await payload.updateGlobal({
    slug: "home-pillars",
    overrideAccess: true,
    context: ctx,
    data: {
      eyebrow: d.pillars.eyebrow,
      heading: rt(d.pillars.heading),
      intro: rt(d.pillars.intro),
      note: d.pillars.note,
      items: d.pillars.items.map((i) => ({ ...i })),
    },
  });

  await payload.updateGlobal({
    slug: "home-about",
    overrideAccess: true,
    context: ctx,
    data: {
      heading: rt(d.about.heading),
      bio: rt(d.about.bio),
      formacao: d.about.formacao,
      idiomas: d.about.idiomas,
    },
  });

  await payload.updateGlobal({
    slug: "home-voices",
    overrideAccess: true,
    context: ctx,
    data: { heading: d.voices.heading },
  });

  await payload.updateGlobal({
    slug: "home-writing",
    overrideAccess: true,
    context: ctx,
    data: {
      heading: rt(d.writing.heading),
      intro: d.writing.intro,
    },
  });

  await payload.updateGlobal({
    slug: "home-contact",
    overrideAccess: true,
    context: ctx,
    data: {
      eyebrow: d.contact.eyebrow,
      heading: rt(d.contact.heading),
      body: rt(d.contact.body),
      whatsappLabel: d.contact.whatsappLabel,
      faqLinkLabel: d.contact.faqLinkLabel,
    },
  });

  payload.logger.info("  ✓ home globals (structure + 6 sections)");
}
