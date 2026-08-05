// ---------------------------------------------------------------------------
// The block model the Markdown twins are assembled from (REQ-011, CONCEPT §10).
//
// The twins could have been built by concatenating strings, and the reason they
// are not is that every page has to answer the same two questions — "is there
// anything under this heading?" and "is this value worth a line?" — and string
// concatenation answers them with `if` statements scattered across eight
// serializers. Here the answer is a rule: a constructor returns `null` for an
// absence, `section` drops a heading with nothing under it, and `blocks`
// flattens the nulls away. So a page's twin reads as a list of its sections,
// which is exactly how its route reads.
//
// The kinds are only the ones the site's copy actually needs. There is no image
// block on purpose: a twin never mentions an asset slot, because a machine has
// nothing to do with a frame that says "em preparação" (REQ-005 is a rule about
// layout honesty, not about content).
// ---------------------------------------------------------------------------

import type { FactRow } from "@/domain/pages/FactRow";

export type MarkdownBlock =
  | { kind: "heading"; level: 1 | 2 | 3; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "quote"; text: string }
  | { kind: "bullets"; items: string[] }
  | { kind: "numbered"; items: string[] };

/** Anything a builder may hand to `blocks`: a block, an absence, or a run of them. */
type BlockInput = MarkdownBlock | MarkdownBlock[] | null | undefined | false;

/** Flatten and compact a builder's arguments into a block list. */
export function blocks(...inputs: BlockInput[]): MarkdownBlock[] {
  return inputs.flatMap((input) => {
    if (!input) return [];
    return Array.isArray(input) ? input : [input];
  });
}

export function heading(level: 1 | 2 | 3, text: string | null | undefined): MarkdownBlock | null {
  const value = text?.trim();
  return value ? { kind: "heading", level, text: value } : null;
}

export function paragraph(text: string | null | undefined): MarkdownBlock | null {
  const value = text?.trim();
  return value ? { kind: "paragraph", text: value } : null;
}

export function quote(text: string | null | undefined): MarkdownBlock | null {
  const value = text?.trim();
  return value ? { kind: "quote", text: value } : null;
}

export function bullets(items: ReadonlyArray<string | null | undefined>): MarkdownBlock | null {
  const kept = keep(items);
  return kept.length > 0 ? { kind: "bullets", items: kept } : null;
}

export function numbered(items: ReadonlyArray<string | null | undefined>): MarkdownBlock | null {
  const kept = keep(items);
  return kept.length > 0 ? { kind: "numbered", items: kept } : null;
}

/** A markdown link, for use inside a paragraph or a list item. */
export function link(label: string | null | undefined, url: string): string | null {
  const text = label?.trim();
  return text ? `[${text}](${url})` : null;
}

/**
 * `**Label** — value` bullets, the shape every "prático" and "logística" list
 * takes. `FactRow` guarantees both halves are non-empty by the time a row
 * exists, so a row with a blank half is a mapper bug and is dropped here too
 * rather than printing a dangling label.
 */
export function factBullets(rows: readonly FactRow[]): MarkdownBlock | null {
  return bullets(rows.map((row) => labelled(row.label, row.value)));
}

/** `**Label** — value`, or just one half when the other is missing. */
export function labelled(label: string | null | undefined, value: string | null | undefined) {
  const name = label?.trim();
  const text = value?.trim();
  if (!name) return text ?? null;
  if (!text) return null;

  return `**${name}** — ${text}`;
}

/**
 * A `##`/`###` section: its heading, then its content — **or nothing at all**.
 *
 * A heading over an empty section is the one failure a generated document makes
 * that a hand-written one does not: it reads as a file that broke rather than as
 * a page with nothing to say there. `groupFaqByCategory` takes the same position
 * about the rendered page, for the same reason.
 */
export function section(
  level: 2 | 3,
  headingText: string | null | undefined,
  ...content: BlockInput[]
): MarkdownBlock[] {
  const body = blocks(...content);
  if (body.length === 0) return [];

  const title = heading(level, headingText);
  return title ? [title, ...body] : body;
}

function keep(items: ReadonlyArray<string | null | undefined>): string[] {
  return items.flatMap((item) => {
    const value = item?.trim();
    return value ? [value] : [];
  });
}
