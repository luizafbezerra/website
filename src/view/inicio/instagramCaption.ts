/**
 * Caption shaping for the Instagram section — text presentation, so it lives in
 * the view. The domain hands over her caption verbatim; these helpers decide how
 * much of it a given surface prints.
 *
 * Hashtags and @-mention lines are dropped everywhere: they are the feed's own
 * machinery, and on the page they would read as decoration nobody wrote.
 */

/** How much of a caption becomes a tile button's accessible label. */
const LABEL_LIMIT = 48;

/** How long the set opening line may run before it stops being a lede. */
const LEDE_LIMIT = 180;

/** How much of the remaining prose the reading column prints. */
const REST_LIMIT = 300;

/** Cut on a word boundary with an ellipsis, or return the text whole. */
function truncateAtWord(text: string, limit: number): string {
  if (text.length <= limit) return text;

  const cut = text.slice(0, limit);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

/** Her caption down to readable prose: one paragraph, no feed machinery. */
function captionProse(caption: string): string {
  return caption
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !/^[#@]/.test(line))
    .join(" ")
    .replace(/\s+#[^\s#]+(?=\s|$)/g, "")
    .trim();
}

/** The shortest opening sentence worth setting as a display line. */
const LEDE_MIN = 25;

/**
 * Reference-list captions open like "JUNG, Carl Gustav. A prática…" — an
 * all-caps surname and a comma. A bibliography line set large in italic reads
 * as a title nobody chose, so those captions go straight to body prose.
 */
const CITATION_OPENING = /^[A-ZÀ-Ü]{2,},/;

/**
 * The reading column's split: her captions usually open with the post's quote
 * or thesis as a first sentence, and that line is what the column sets large.
 * The split is an offer, not a requirement — a caption that opens like a
 * citation, or runs on with no early sentence break, is all body; a short
 * single-sentence caption is all lede.
 */
export function splitCaption(
  caption: string | null,
): { lede: string | null; body: string | null } | null {
  if (!caption) return null;

  const prose = captionProse(caption);
  if (!prose) return null;

  if (!CITATION_OPENING.test(prose)) {
    const sentence = /^(.{24,179}?[.!?…]["”']?)\s+(\S[\s\S]*)$/.exec(prose);
    if (sentence) return { lede: sentence[1], body: truncateAtWord(sentence[2], REST_LIMIT) };

    if (prose.length >= LEDE_MIN && prose.length <= LEDE_LIMIT) {
      return { lede: prose, body: null };
    }
  }

  return { lede: null, body: truncateAtWord(prose, REST_LIMIT) };
}

/** A caption's opening, cut on a word boundary — or nothing, for a bare post. */
export function captionLabel(caption: string | null): string | null {
  if (!caption) return null;

  const firstLine = caption.split("\n")[0]?.trim();
  if (!firstLine) return null;

  return truncateAtWord(firstLine, LABEL_LIMIT);
}
