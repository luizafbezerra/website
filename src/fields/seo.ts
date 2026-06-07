import type { Field } from "payload";

/**
 * Per-page SEO override group. Every field is optional; the SEO resolver
 * (`@/core/seo`) falls back to the Settings-global defaults when a field is
 * blank — the per-page-override behaviour required by CLAUDE.md.
 *
 * Lives in `src/fields/` (a leaf that imports only Payload types) so it can be
 * reused by any page global without coupling the schema layer to `core`.
 */
export function seoField(): Field {
  return {
    name: "seo",
    type: "group",
    admin: {
      description:
        "Per-page SEO overrides. Leave blank to inherit the site defaults from Settings.",
    },
    fields: [
      {
        name: "title",
        type: "text",
        admin: { description: "Overrides the page <title>. Blank → Settings default." },
      },
      {
        name: "description",
        type: "textarea",
        admin: { description: "Overrides the meta description. Blank → Settings default." },
      },
      {
        name: "ogImage",
        type: "upload",
        relationTo: "media",
        admin: {
          description: "Overrides the social-share image (1200×630). Blank → Settings default.",
        },
      },
    ],
  };
}
