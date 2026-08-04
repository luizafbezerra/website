import type { GlobalConfig } from "payload";
import { headingField } from "../../fields/accentHeading";
import { HOME_GROUP, homeAccess, revalidateHomeHook } from "./shared";

/** Pillars (Como trabalho) — eyebrow, accent heading, intro, note, three frentes. */
export const HomePillars: GlobalConfig = {
  slug: "home-pillars",
  label: "Como trabalho",
  admin: { group: HOME_GROUP },
  access: homeAccess,
  hooks: { afterChange: revalidateHomeHook() },
  fields: [
    { name: "eyebrow", type: "text", label: "Sobrescrito" },
    headingField({ label: "Título" }),
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
};
