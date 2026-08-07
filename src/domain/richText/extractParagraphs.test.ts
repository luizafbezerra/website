import { describe, expect, it } from "vitest";
import { extractParagraphs } from "./extractParagraphs";
import type { RichTextContent } from "./RichTextContent";
import { richText } from "./richText";

describe("extractParagraphs", () => {
  it("keeps one group per paragraph", () => {
    const body = richText(["primeira", "segunda"]);

    expect(extractParagraphs(body)).toEqual([
      [{ text: "primeira", bold: false, italic: false }],
      [{ text: "segunda", bold: false, italic: false }],
    ]);
  });

  it("reads both emphases from the Lexical bitmask, independently", () => {
    const body = richText([
      [
        { text: "individuação", italic: true },
        { text: " — " },
        { text: "a dizer", bold: true },
        { text: "ambos", bold: true, italic: true },
      ],
    ]);

    expect(extractParagraphs(body)).toEqual([
      [
        { text: "individuação", bold: false, italic: true },
        { text: " — ", bold: false, italic: false },
        { text: "a dizer", bold: true, italic: false },
        { text: "ambos", bold: true, italic: true },
      ],
    ]);
  });

  it("yields nothing for absent or malformed content instead of throwing", () => {
    expect(extractParagraphs(null)).toEqual([]);
    expect(extractParagraphs(undefined)).toEqual([]);
    expect(extractParagraphs({} as RichTextContent)).toEqual([]);
    expect(
      extractParagraphs({ root: { children: "not an array" } } as unknown as RichTextContent),
    ).toEqual([]);
  });

  it("drops a paragraph whose children are not an array, rather than emitting an empty group", () => {
    const malformed = {
      root: {
        children: [{ type: "paragraph" }, { children: [{ type: "text", text: "só isto" }] }],
      },
    } as unknown as RichTextContent;

    expect(extractParagraphs(malformed)).toEqual([
      [{ text: "só isto", bold: false, italic: false }],
    ]);
  });

  it("skips non-text nodes inside a paragraph", () => {
    const withLineBreak = {
      root: {
        children: [{ children: [{ type: "linebreak" }, { type: "text", text: "só isto" }] }],
      },
    } as unknown as RichTextContent;

    expect(extractParagraphs(withLineBreak)).toEqual([
      [{ text: "só isto", bold: false, italic: false }],
    ]);
  });

  it("keeps an empty group for a paragraph that has children but no text", () => {
    const empty = {
      root: { children: [{ children: [{ type: "linebreak" }] }] },
    } as unknown as RichTextContent;

    expect(extractParagraphs(empty)).toEqual([[]]);
  });
});
