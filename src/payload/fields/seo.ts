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
    label: "SEO",
    admin: {
      description:
        "Substituições de SEO por página. Deixe em branco para herdar os padrões do site em Configurações.",
    },
    fields: [
      {
        name: "title",
        type: "text",
        label: "Título",
        admin: {
          description: "Substitui o <title> da página. Em branco → padrão de Configurações.",
        },
      },
      {
        name: "description",
        type: "textarea",
        label: "Descrição",
        admin: { description: "Substitui a meta descrição. Em branco → padrão de Configurações." },
      },
      {
        name: "ogImage",
        type: "upload",
        relationTo: "media",
        label: "Imagem social (OG)",
        admin: {
          description:
            "Substitui a imagem de compartilhamento social (1200×630). Em branco → padrão de Configurações.",
        },
      },
    ],
  };
}
