import { findInstagramMedia as infraFindInstagramMedia } from "@/infrastructure/instagram/findInstagramMedia";
import type { InstagramPost } from "./InstagramPost";
import { instagramPostsFrom } from "./instagramPostsFrom";

/** How many squares the row holds — the latest six, no curation. */
const FEED_LIMIT = 6;

/**
 * Her latest posts for the Instagram bridge.
 *
 * Returns `[]` on every failure, and the section renders nothing when it gets an
 * empty list. A dead token, a Meta outage, or a rate limit costs the visitor one
 * section; it must never cost her the home page.
 */
export async function getInstagramFeed(): Promise<InstagramPost[]> {
  try {
    const rows = await infraFindInstagramMedia(FEED_LIMIT);
    if (!rows) return [];

    return instagramPostsFrom(rows);
  } catch (error) {
    console.error("[instagram] feed read failed, hiding the section:", error);
    return [];
  }
}
