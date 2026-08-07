import { notFound } from "next/navigation";

/**
 * Catch-all so an unknown address reaches the localized `not-found.tsx` instead
 * of Next's built-in English 404 page.
 *
 * It is needed because `pathnames` in the routing config only describes the
 * addresses that exist: the middleware prefixes an unrecognised path with the
 * negotiated locale, and without a segment here to match, nothing under
 * `[locale]/` would render for it.
 */
export default function CatchAllNotFound() {
  notFound();
}
