import type { GlobalConfig } from "payload";
import { HOME_GROUP, homeAccess, revalidateHomeHook } from "./shared";

/**
 * Homepage structure: the orderable/toggleable body sections and the editable
 * off-page navigation links. Header/Hero are pinned at the top of the page and
 * Footer at the bottom; only the sections listed here are reorderable. The
 * per-section copy lives in the sibling `home-*` globals.
 */
export const HomeStructure: GlobalConfig = {
  slug: "home",
  label: "Estrutura da página",
  admin: { group: HOME_GROUP },
  access: homeAccess,
  // The nav is derived from these sections and renders on every page.
  hooks: { afterChange: revalidateHomeHook(true) },
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
        { type: "voices", enabled: true },
        { type: "writing", enabled: true },
        { type: "symbols", enabled: true },
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
