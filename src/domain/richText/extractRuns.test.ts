import { describe, expect, it } from "vitest";
import { extractRuns } from "./extractRuns";
import type { RichTextContent } from "./RichTextContent";
import { richText } from "./richText";

describe("extractRuns", () => {
  it("flags the bold run an editor marked as the accent word", () => {
    const heading = richText([
      [
        { text: "O que se repete costuma ter algo " },
        { text: "a dizer", bold: true },
        { text: "." },
      ],
    ]);

    expect(extractRuns(heading)).toEqual([
      { text: "O que se repete costuma ter algo ", bold: false },
      { text: "a dizer", bold: true },
      { text: ".", bold: false },
    ]);
  });

  it("does not mistake italic for the accent mark", () => {
    const line = richText([[{ text: "ansiedade", italic: true }]]);
    expect(extractRuns(line)).toEqual([{ text: "ansiedade", bold: false }]);
  });

  it("reads a run marked both bold and italic as an accent", () => {
    const line = richText([[{ text: "a dizer", bold: true, italic: true }]]);
    expect(extractRuns(line)).toEqual([{ text: "a dizer", bold: true }]);
  });

  it("collapses paragraph breaks, because a heading is one line", () => {
    const twoParagraphs = richText(["primeira", "segunda"]);
    expect(extractRuns(twoParagraphs).map((run) => run.text)).toEqual(["primeira", "segunda"]);
  });

  it("yields an empty list for absent or malformed content instead of throwing", () => {
    expect(extractRuns(null)).toEqual([]);
    expect(extractRuns(undefined)).toEqual([]);
    expect(extractRuns({} as RichTextContent)).toEqual([]);
    expect(
      extractRuns({ root: { children: "not an array" } } as unknown as RichTextContent),
    ).toEqual([]);
  });

  it("skips non-text nodes rather than emitting empty runs", () => {
    const withLineBreak = {
      root: {
        children: [{ children: [{ type: "linebreak" }, { type: "text", text: "só isto" }] }],
      },
    } as unknown as RichTextContent;

    expect(extractRuns(withLineBreak)).toEqual([{ text: "só isto", bold: false }]);
  });
});
