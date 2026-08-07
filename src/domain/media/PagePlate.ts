import type { PageImage } from "./PageImage";

/**
 * A page's plate slot: the painting and its gallery label (CONCEPT §7.2).
 *
 * Every Phase 6 page carries at least one plate (PAT-002), and every one of them
 * stores the same four things — so the shape lives here rather than being spelled
 * out again in each page's own domain type.
 *
 * The label is separate from the image on purpose. Provenance is a fact about the
 * work, not about the file: she can record painter, title and year while the scan
 * is still being sourced, and the placeholder frame stands in for the image alone.
 */
export type PagePlate = {
  image: PageImage | null;
  painter: string | null;
  workTitle: string | null;
  year: string | null;
};

export const EMPTY_PAGE_PLATE: PagePlate = {
  image: null,
  painter: null,
  workTitle: null,
  year: null,
};
