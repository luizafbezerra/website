import "server-only";
import { cache } from "react";
import { getInstagramAuthGlobal } from "@/infrastructure/payload/getInstagramAuthGlobal";
import { resolveInstagramToken } from "./resolveInstagramToken";

// ---------------------------------------------------------------------------
// Her latest posts, straight from the Instagram Graph API.
//
// The rows are named `RawInstagramMedia`, not `PayloadInstagramMedia`: the
// `Payload*` prefix is reserved for CMS response shapes across this folder, and
// nothing about this data comes from the CMS.
//
// **Nothing is persisted.** `media_url` is a signed CDN link that expires, so
// storing it would produce broken images with no way to tell when; Meta's terms
// also forbid mirroring the media. The row is fetched, rendered, and forgotten.
// The one-hour `revalidate` is what keeps the URLs fresh, and it matches the
// home page's own ISR window.
//
// The token is in the query string, which makes it part of Next's cache key —
// so a rotation invalidates the cached response instead of replaying a request
// signed with a token that no longer exists. That is a happy accident of Meta's
// API shape, but it is load-bearing, hence the note.
//
// Never throws. A dead token or an outage must cost the visitor a section, not
// the page (CONCEPT: the site never breaks over her feed).
// ---------------------------------------------------------------------------

const API_VERSION = "v25.0";
const FIELDS = [
  "id",
  "caption",
  "media_type",
  "media_url",
  "permalink",
  "thumbnail_url",
  "timestamp",
  "alt_text",
].join(",");

/** One row of `/me/media`, as the Graph API returns it. */
export type RawInstagramMedia = {
  id?: string | null;
  caption?: string | null;
  media_type?: string | null;
  media_url?: string | null;
  permalink?: string | null;
  /** Present for VIDEO, where `media_url` is the video file itself. */
  thumbnail_url?: string | null;
  timestamp?: string | null;
  /** The accessibility caption she typed in the app; empty on every post today. */
  alt_text?: string | null;
};

/** The latest `limit` posts, or null when there is no token or the call fails. */
export const findInstagramMedia = cache(async function findInstagramMedia(
  limit: number,
): Promise<RawInstagramMedia[] | null> {
  const auth = await getInstagramAuthGlobal();
  const token = resolveInstagramToken(auth);
  if (!token) return null;

  const url =
    `https://graph.instagram.com/${API_VERSION}/me/media` +
    `?fields=${FIELDS}&limit=${limit}&access_token=${encodeURIComponent(token)}`;

  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });
    if (!response.ok) {
      console.error(`[instagram] /me/media answered HTTP ${response.status}`);
      return null;
    }

    const body = (await response.json()) as { data?: unknown };
    if (!Array.isArray(body.data)) {
      console.error("[instagram] /me/media answered without a data array");
      return null;
    }

    return body.data as RawInstagramMedia[];
  } catch (error) {
    console.error("[instagram] /me/media request failed:", error);
    return null;
  }
});
