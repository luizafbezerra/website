import type { RawInstagramMedia } from "@/infrastructure/instagram/findInstagramMedia";
import type { InstagramPost } from "./InstagramPost";

/** How much of a caption stands in for a missing accessibility caption. */
const ALT_FROM_CAPTION_LIMIT = 100;

/**
 * Normalize `/me/media` rows into the posts the page renders.
 *
 * Two things the API's shape forces:
 *
 *   · **Which URL is the image.** For a VIDEO, `media_url` is the video file and
 *     `thumbnail_url` is the still; for IMAGE and CAROUSEL_ALBUM there is no
 *     thumbnail and `media_url` is the image. Getting this backwards would put a
 *     video file in an `<img>` and render nothing.
 *   · **Alt text.** Every one of her posts came back with `alt_text` empty — she
 *     writes captions, not accessibility captions — so the caption's opening
 *     stands in. An empty string is the last resort: the tile carries its own
 *     accessible name from the button label, and a screen reader announcing a
 *     truncated caption twice is worse than a decorative image announced once.
 *
 * A row with no usable image URL or no permalink is dropped rather than rendered
 * as a gap: there is nothing to show and nowhere to send the click.
 */
export function instagramPostsFrom(rows: RawInstagramMedia[]): InstagramPost[] {
  return rows.flatMap((row) => {
    const imageUrl = imageUrlFor(row);
    const permalink = filled(row.permalink);
    const id = filled(row.id);

    if (!imageUrl || !permalink || !id) return [];

    const caption = filled(row.caption);

    return [
      {
        id,
        caption,
        imageUrl,
        permalink,
        timestamp: filled(row.timestamp) ?? "",
        altText: filled(row.alt_text) ?? altFromCaption(caption),
      },
    ];
  });
}

function imageUrlFor(row: RawInstagramMedia): string | null {
  if (row.media_type === "VIDEO") return filled(row.thumbnail_url);
  return filled(row.media_url);
}

/**
 * The caption's first sentence-worth, cut on a word boundary so a screen reader
 * never reads a word in half.
 */
function altFromCaption(caption: string | null): string {
  if (!caption) return "";

  const firstLine = caption.split("\n")[0]?.trim() ?? "";
  if (firstLine.length <= ALT_FROM_CAPTION_LIMIT) return firstLine;

  const cut = firstLine.slice(0, ALT_FROM_CAPTION_LIMIT);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

/** Blank strings are absences, not values — the same rule the CMS mappers use. */
function filled(value: string | null | undefined): string | null {
  const text = value?.trim();
  return text ? text : null;
}
