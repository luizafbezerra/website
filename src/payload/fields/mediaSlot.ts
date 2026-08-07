import type { Field } from "payload";

/**
 * An optional image slot. Never required: while it is empty the page renders a
 * quiet labeled frame describing what belongs there (REQ-005 / CONCEPT §11), so
 * a missing painting reads as curation in progress rather than as breakage.
 *
 * The `description` is therefore doing double duty — it tells her what to upload
 * and it is the same intent the placeholder frame announces on screen.
 */
export function mediaSlot({
  name,
  label,
  description,
}: {
  name: string;
  label: string;
  description: string;
}): Field {
  return {
    name,
    type: "upload",
    relationTo: "media",
    label,
    admin: {
      description: `${description} Em branco, o site mostra um quadro reservado com legenda.`,
    },
  };
}
