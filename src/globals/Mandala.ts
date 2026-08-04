import type { Field, GlobalConfig } from "payload";
import { revalidatePath } from "next/cache";
import { WHEEL_ZODIAC } from "../core/wheel";
import { type Element, VEDIC_CONTENT, ZODIAC_CONTENT } from "../core/zodiacContent";

/**
 * "Mandala dos signos" — the editable prose of the painted zodiac wheel.
 *
 * Only the two paragraphs per sign (the sign text and the Vedic summary) live
 * here; the structural reference (element, regente, the nakshatra table) stays
 * in `src/core/zodiacContent.ts`, since it is interlocking scholarly data, not
 * editorial voice. See `mandalaFromPayload` for the merge.
 *
 * The twelve sign groups are partitioned into four UNNAMED tabs by element
 * (Fogo/Terra/Ar/Água) so an editor finds a sign quickly. Unnamed tabs are
 * presentational — each sign group keeps its existing data path, so this is a
 * pure admin reorganization with no migration.
 */
const signGroup = (sign: (typeof WHEEL_ZODIAC)[number]): Field => ({
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
});

const ELEMENT_TABS: { element: Element; label: string }[] = [
  { element: "fogo", label: "Fogo" },
  { element: "terra", label: "Terra" },
  { element: "ar", label: "Ar" },
  { element: "água", label: "Água" },
];

export const Mandala: GlobalConfig = {
  slug: "mandala",
  label: "Mandala dos signos",
  admin: { group: "Páginas" },
  access: {
    read: () => true,
    update: ({ req }) => req.user?.role === "admin",
  },
  hooks: {
    afterChange: [
      ({ context }) => {
        if (context?.skipRevalidate) return;
        // The wheel renders on the homepage (desktop only). It gains a second
        // home on /analise in Phase 6; add that path with the page.
        revalidatePath("/");
      },
    ],
  },
  fields: [
    {
      type: "tabs",
      tabs: ELEMENT_TABS.map(({ element, label }) => ({
        label,
        fields: WHEEL_ZODIAC.filter((sign) => ZODIAC_CONTENT[sign.id].element === element).map(
          signGroup,
        ),
      })),
    },
  ],
};
