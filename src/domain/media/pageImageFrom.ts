import type { PayloadMediaField } from "@/infrastructure/payload/PayloadMedia";
import type { PageImage } from "./PageImage";

/**
 * Normalize an upload field to something renderable, or to `null`.
 *
 * `null` is the honest answer for every incomplete case — an empty slot, an
 * unpopulated relation that arrived as a bare id, a file with no URL, or an
 * upload whose intrinsic size Payload never recorded. Each of those would
 * otherwise reach `next/image` as a broken or shifting picture; as `null` they
 * reach `MediaPlaceholder` instead, which says what belongs there.
 *
 * Alt text is required by the Media collection, so an empty one means the row is
 * mid-edit; the image still renders, with an empty alt, which is the correct
 * markup for a decorative image and never a made-up description.
 */
export function pageImageFrom(value: PayloadMediaField): PageImage | null {
  if (!value || typeof value === "number") return null;

  const src = value.url?.trim();
  if (!src) return null;

  const { width, height } = value;
  if (typeof width !== "number" || typeof height !== "number") return null;
  if (width <= 0 || height <= 0) return null;

  return { src, alt: value.alt?.trim() ?? "", width, height };
}
