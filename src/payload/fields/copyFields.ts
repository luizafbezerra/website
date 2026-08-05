import type { Field } from "payload";

/**
 * The three sizes of visitor-facing copy field, all `localized: true` (REQ-003).
 *
 * Every string a visitor reads is localized so the English mirror can carry her
 * own words once the polish pass lands; until then Payload's `fallback: true`
 * serves the Portuguese, which is why no page is ever blank in English.
 *
 * Labels and descriptions stay pt-BR — the admin panel is hers.
 */

type CopyOptions = {
  name: string;
  label: string;
  /** Helper text under the field: what belongs here, in her words' terms. */
  description?: string;
  required?: boolean;
};

export function localizedText({ name, label, description, required }: CopyOptions): Field {
  return {
    name,
    type: "text",
    label,
    localized: true,
    ...(required ? { required: true } : {}),
    ...(description ? { admin: { description } } : {}),
  };
}

export function localizedTextarea({ name, label, description, required }: CopyOptions): Field {
  return {
    name,
    type: "textarea",
    label,
    localized: true,
    ...(required ? { required: true } : {}),
    ...(description ? { admin: { description } } : {}),
  };
}

export function localizedRichText({ name, label, description, required }: CopyOptions): Field {
  return {
    name,
    type: "richText",
    label,
    localized: true,
    ...(required ? { required: true } : {}),
    ...(description ? { admin: { description } } : {}),
  };
}
