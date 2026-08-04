import "server-only";
import { cache } from "react";
import type { WheelSign } from "@/domain/wheel/wheelGeometry";
import { getPayloadSafe } from "./getPayloadSafe";

/** Raw shape of the Payload `mandala` global read at depth 0. */
export type PayloadMandala = Partial<
  Record<WheelSign["id"], { paragraph?: string | null; vedicParagraph?: string | null } | null>
> | null;

/** The `mandala` global's editable prose, or null when Payload is disabled. */
export const getMandalaGlobal = cache(async function getMandalaGlobal(): Promise<PayloadMandala> {
  const payload = await getPayloadSafe();
  if (!payload) return null;

  const doc = await payload.findGlobal({ slug: "mandala", depth: 0, overrideAccess: true });
  return doc as unknown as PayloadMandala;
});
