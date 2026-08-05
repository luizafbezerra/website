/**
 * One of her posts, as the site renders it.
 *
 * `imageUrl` is a signed Instagram CDN link with an expiry, which is why nothing
 * here is ever stored: the row is fetched an hour at a time and rendered
 * straight from the API. Meta's terms also forbid mirroring the media, so the
 * view renders a plain `<img>` — `next/image` would proxy and cache the bytes.
 *
 * `timestamp` is a plain ISO string rather than a `Date`. These posts cross the
 * server/client boundary as props and nothing computes with the date, so there
 * is no serialization step to maintain — the same choice the rest of this domain
 * makes.
 *
 * `altText` is never null. Her posts carry no accessibility caption in the app
 * (every `alt_text` came back empty), so the mapper derives one from the caption
 * and the type records that a fallback always happened.
 */
export type InstagramPost = {
  id: string;
  caption: string | null;
  imageUrl: string;
  permalink: string;
  timestamp: string;
  altText: string;
};
