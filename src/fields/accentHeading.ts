import type { Field } from "payload";

type AccentHeadingOptions = {
  /** Field name; the heading group is nested under this key. Defaults to "heading". */
  name?: string;
  label?: string;
  /** Default accent colour when an editor hasn't chosen one. */
  defaultAccentStyle?: "terracotta" | "cobalt";
};

/**
 * A manuscript heading split into three parts so the accent word can carry a
 * locked design treatment: `lead` + coloured/italic `accentWord` + `trail`
 * (e.g. "Sob o " · "céu" · " interior").
 *
 * Colour is a constrained select — never free CSS — so the typography brief
 * cannot be broken from the admin. The runtime maps `accentStyle` to a locked
 * Tailwind class in `@/core/accentHeading`.
 */
export function accentHeadingField(options: AccentHeadingOptions = {}): Field {
  const { name = "heading", label, defaultAccentStyle = "terracotta" } = options;
  return {
    name,
    type: "group",
    label,
    fields: [
      {
        name: "lead",
        type: "text",
        label: "Texto inicial",
        admin: { description: "Texto simples antes da palavra de destaque." },
      },
      {
        name: "accentWord",
        type: "text",
        label: "Palavra de destaque",
        admin: { description: "A palavra colorida / em itálico." },
      },
      {
        name: "trail",
        type: "text",
        label: "Texto final",
        admin: { description: "Texto simples depois da palavra de destaque." },
      },
      {
        name: "accentStyle",
        type: "select",
        label: "Cor do destaque",
        defaultValue: defaultAccentStyle,
        options: [
          { label: "Terracota", value: "terracotta" },
          { label: "Cobalto", value: "cobalt" },
        ],
      },
      {
        name: "accentItalic",
        type: "checkbox",
        label: "Itálico",
        defaultValue: true,
      },
    ],
  };
}
