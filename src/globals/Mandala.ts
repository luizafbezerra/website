import type { Field, GlobalConfig } from "payload";
import { revalidatePath } from "next/cache";
import { WHEEL_ZODIAC } from "../core/wheel";
import { VEDIC_CONTENT, ZODIAC_CONTENT } from "../core/zodiacContent";

/**
 * "Mandala dos signos" — the editable prose of the painted zodiac wheel.
 *
 * Only the two paragraphs per sign (the sign text and the Vedic summary) live
 * here; the structural reference (element, regente, the nakshatra table) stays
 * in `src/core/zodiacContent.ts`, since it is interlocking scholarly data, not
 * editorial voice. See `mandalaFromPayload` for the merge.
 *
 * Each sign is one labelled group, seeded by reference from the code defaults,
 * so the rendered wheel is unchanged until Luiza edits a paragraph and a blank
 * field falls back to the code text.
 */
const signGroups: Field[] = WHEEL_ZODIAC.map(
  (sign): Field => ({
    name: sign.id,
    type: "group",
    label: sign.label,
    admin: {
      description: `${sign.dateRange} · ${ZODIAC_CONTENT[sign.id].archetype}`,
    },
    fields: [
      {
        name: "paragraph",
        type: "textarea",
        label: "Texto do signo",
        defaultValue: ZODIAC_CONTENT[sign.id].paragraph,
      },
      {
        name: "vedicParagraph",
        type: "textarea",
        label: "Texto védico — três mansões lunares",
        defaultValue: VEDIC_CONTENT[sign.id].paragraph,
      },
    ],
  }),
);

export const Mandala: GlobalConfig = {
  slug: "mandala",
  label: "Mandala dos signos",
  access: {
    read: () => true,
    update: ({ req }) => req.user?.role === "admin",
  },
  hooks: {
    afterChange: [
      ({ context }) => {
        if (context?.skipRevalidate) return;
        // The wheel renders on the homepage (desktop) and on /simbolos.
        revalidatePath("/");
        revalidatePath("/simbolos");
      },
    ],
  },
  fields: signGroups,
};
