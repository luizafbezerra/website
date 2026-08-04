import type { GlobalConfig } from "payload";
import { revalidatePath } from "next/cache";

/**
 * The homepage is split into seven small globals (one focused editor per
 * section) so a non-technical editor sees "Sobre", "Contato", etc. as their own
 * sidebar entries instead of one monolithic document. They share the sidebar
 * group, access rules, and revalidate-on-save behaviour defined here.
 */
export const HOME_GROUP = "Página inicial";

export const homeAccess: GlobalConfig["access"] = {
  read: () => true,
  update: ({ req }) => req.user?.role === "admin",
};

/**
 * Revalidate the homepage when a section global is saved. `layout` is used for
 * the structure global (the nav is derived from it and renders on every page);
 * the content globals only need the homepage. Skipped during seed, which writes
 * outside a Next request where `revalidatePath` throws.
 */
export const revalidateHomeHook = (
  layout = false,
): NonNullable<GlobalConfig["hooks"]>["afterChange"] => [
  ({ context }) => {
    if (context?.skipRevalidate) return;
    if (layout) revalidatePath("/", "layout");
    else revalidatePath("/");
  },
];
