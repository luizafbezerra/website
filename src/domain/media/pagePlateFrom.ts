import type { PayloadMediaField } from "@/infrastructure/payload/PayloadMedia";
import type { PagePlate } from "./PagePlate";
import { pageImageFrom } from "./pageImageFrom";

type StoredPlate =
  | {
      image?: PayloadMediaField;
      painter?: string | null;
      workTitle?: string | null;
      year?: string | null;
    }
  | null
  | undefined;

/** Blank strings are absences, not values — a cleared caption line must not print. */
function filled(value: string | null | undefined): string | null {
  const text = value?.trim();
  return text ? text : null;
}

/**
 * Normalize a stored plate group. Nothing here has a default: a plate she has not
 * chosen renders as a labeled frame (REQ-005), and a caption line she has not
 * filled is simply absent rather than invented — provenance is the one thing on
 * this site that may never be guessed (CONCEPT §11).
 */
export function pagePlateFrom(raw: StoredPlate): PagePlate {
  return {
    image: pageImageFrom(raw?.image),
    painter: filled(raw?.painter),
    workTitle: filled(raw?.workTitle),
    year: filled(raw?.year),
  };
}
