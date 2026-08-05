/**
 * A `media` upload as Payload returns it at `depth: 1` — the shape every page
 * accessor in this folder shares, because every page global has at least one
 * `mediaSlot` field.
 *
 * At `depth: 0` an upload relation comes back as a bare row id, which is why the
 * page accessors read at depth 1: a page needs the file's URL and intrinsic size
 * to render it without layout shift. An unfilled slot arrives as `null` and an
 * unpopulated one as a number, so both are part of the type and the domain
 * mapper collapses them to "no image".
 */
export type PayloadMedia = {
  url?: string | null;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
};

/** An upload field's value: populated, a bare id, or empty. */
export type PayloadMediaField = PayloadMedia | number | null | undefined;
