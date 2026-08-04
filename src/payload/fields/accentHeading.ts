import type { Field } from "payload";
import {
  BoldFeature,
  InlineToolbarFeature,
  lexicalEditor,
  ParagraphFeature,
} from "@payloadcms/richtext-lexical";

type HeadingOptions = {
  /** Field name; defaults to "heading". */
  name?: string;
  label?: string;
};

/**
 * A manuscript heading as a single, constrained rich-text field. The editor
 * types the whole title and marks the accent word in bold ("destaque"); the
 * renderer (`@/ui/home/AccentHeading`) applies the section's LOCKED colour +
 * italic to the bold run, so the typography brief can't be broken from the
 * admin. The editor is restricted to paragraph + bold + inline toolbar — no
 * headings, lists, or links — so "destaque" is the only mark available.
 */
export function headingField(options: HeadingOptions = {}): Field {
  const { name = "heading", label = "Título" } = options;
  return {
    name,
    type: "richText",
    label,
    admin: {
      description:
        "Escreva o título e marque a palavra de destaque (negrito) — ela aparece na cor da seção.",
    },
    editor: lexicalEditor({
      features: () => [ParagraphFeature(), BoldFeature(), InlineToolbarFeature()],
    }),
  };
}
