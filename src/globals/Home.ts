import type { GlobalConfig } from "payload";
import { revalidatePath } from "next/cache";
import { accentHeadingField } from "../fields/accentHeading";

/**
 * Homepage structure: the orderable/toggleable body sections and the editable
 * off-page navigation links. Header/Hero are pinned at the top of the page and
 * Footer at the bottom; only the sections listed here are reorderable.
 *
 * Long-form section copy is added to this global in a later phase.
 */
export const Home: GlobalConfig = {
  slug: "home",
  label: "Página inicial",
  access: {
    read: () => true,
    update: ({ req }) => req.user?.role === "admin",
  },
  hooks: {
    afterChange: [
      ({ context }) => {
        if (context?.skipRevalidate) return;
        // Nav (derived from sections) renders on every page → revalidate layout.
        revalidatePath("/", "layout");
      },
    ],
  },
  fields: [
    {
      name: "sections",
      type: "array",
      label: "Seções da página",
      labels: { singular: "Seção", plural: "Seções" },
      admin: {
        description:
          "Arraste para reordenar. Desmarque para ocultar uma seção (ex.: o Cosmos). Cabeçalho e rodapé são fixos.",
        initCollapsed: false,
      },
      defaultValue: [
        { type: "pillars", enabled: true },
        { type: "about", enabled: true },
        { type: "cosmos", enabled: true },
        { type: "symbols", enabled: true },
        { type: "voices", enabled: true },
        { type: "writing", enabled: true },
        { type: "contact", enabled: true },
      ],
      fields: [
        {
          name: "type",
          type: "select",
          label: "Seção",
          required: true,
          options: [
            { label: "Como trabalho (pilares)", value: "pillars" },
            { label: "Sobre", value: "about" },
            { label: "Cosmos (mandala dos signos)", value: "cosmos" },
            { label: "Mandala dos signos", value: "symbols" },
            { label: "Vozes (depoimentos)", value: "voices" },
            { label: "Escrita (blog recente)", value: "writing" },
            { label: "Contato", value: "contact" },
          ],
        },
        {
          name: "enabled",
          type: "checkbox",
          label: "Ativa",
          defaultValue: true,
        },
      ],
    },
    // ── Hero (pinned first) ───────────────────────────────────────────────
    {
      name: "hero",
      type: "group",
      label: "Início (hero)",
      fields: [
        {
          name: "subtitle",
          type: "text",
          label: "Subtítulo",
          admin: { description: 'Linha sob o nome, ex.: "Para a vida adulta".' },
        },
        { name: "lead", type: "richText", label: "Parágrafo de abertura" },
        { name: "ctaPrimaryLabel", type: "text", label: "Botão principal" },
        { name: "ctaSecondaryLabel", type: "text", label: "Link secundário" },
        {
          name: "portrait",
          type: "upload",
          relationTo: "media",
          label: "Retrato",
          admin: { description: "Foto da Luiza. Em branco, usa a imagem padrão do código." },
        },
      ],
    },

    // ── Pillars (Como trabalho) ───────────────────────────────────────────
    {
      name: "pillars",
      type: "group",
      label: "Como trabalho (pilares)",
      fields: [
        { name: "eyebrow", type: "text", label: "Sobrescrito" },
        accentHeadingField({ label: "Título", defaultAccentStyle: "terracotta" }),
        { name: "intro", type: "richText", label: "Introdução" },
        { name: "note", type: "textarea", label: "Nota das frentes" },
        {
          name: "items",
          type: "array",
          label: "Pilares",
          labels: { singular: "Pilar", plural: "Pilares" },
          fields: [
            {
              name: "numeral",
              type: "text",
              label: "Numeral",
              admin: { description: "Ex.: I, II, III." },
            },
            { name: "title", type: "text", label: "Título" },
            { name: "paragraph", type: "textarea", label: "Parágrafo" },
          ],
        },
      ],
    },

    // ── About (Sobre) ─────────────────────────────────────────────────────
    {
      name: "about",
      type: "group",
      label: "Sobre",
      fields: [
        { name: "eyebrow", type: "text", label: "Sobrescrito" },
        accentHeadingField({ label: "Título", defaultAccentStyle: "cobalt" }),
        { name: "bio", type: "richText", label: "Biografia" },
        { name: "formacao", type: "text", label: "Formação" },
        { name: "idiomas", type: "text", label: "Idiomas" },
      ],
    },

    // ── Voices (depoimentos) ──────────────────────────────────────────────
    {
      name: "voices",
      type: "group",
      label: "Vozes (depoimentos)",
      fields: [
        { name: "eyebrow", type: "text", label: "Sobrescrito" },
        { name: "heading", type: "text", label: "Título" },
      ],
    },

    // ── Writing (Escrita) ─────────────────────────────────────────────────
    {
      name: "writing",
      type: "group",
      label: "Escrita (blog)",
      fields: [
        { name: "eyebrow", type: "text", label: "Sobrescrito" },
        accentHeadingField({ label: "Título", defaultAccentStyle: "terracotta" }),
        { name: "intro", type: "textarea", label: "Introdução" },
      ],
    },

    // ── Contact (Contato) ─────────────────────────────────────────────────
    {
      name: "contact",
      type: "group",
      label: "Contato",
      fields: [
        { name: "eyebrow", type: "text", label: "Sobrescrito" },
        accentHeadingField({ label: "Título", defaultAccentStyle: "terracotta" }),
        { name: "body", type: "richText", label: "Texto" },
        { name: "whatsappLabel", type: "text", label: "Rótulo do botão WhatsApp" },
        { name: "faqLinkLabel", type: "text", label: "Rótulo do link de perguntas" },
      ],
    },

    {
      name: "navExtraLinks",
      type: "array",
      label: "Links extras de navegação",
      admin: {
        description:
          "Links que não são seções da página (ex.: o blog). Aparecem após os links das seções.",
      },
      defaultValue: [{ label: "Escrita", href: "/blog" }],
      fields: [
        { name: "label", type: "text", label: "Rótulo", required: true },
        { name: "href", type: "text", label: "Endereço", required: true },
      ],
    },
  ],
};
