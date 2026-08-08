/**
 * An image a page can actually render: a source, its alt text, and its intrinsic
 * size so `next/image` reserves the right box and nothing shifts on load.
 *
 * Every field is required on purpose. A half-resolved image — a URL with no
 * dimensions, or a painting with no alt text — is worse than none: it ships
 * layout shift and an unlabeled picture. The mapper therefore returns `null`
 * rather than a partial image, and `null` is exactly what the placeholder policy
 * (REQ-005) knows how to render.
 */
export type PageImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /**
   * The picture at postage-stamp size, inlined, to hold its own box while the
   * full file lands. Optional where the other four are not: an image with no
   * placeholder is complete, just plainer — a row uploaded before the field
   * existed, or one whose LQIP failed to derive, still renders correctly.
   */
  blurDataURL?: string | null;
};
