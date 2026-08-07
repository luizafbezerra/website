import { describe, expect, it } from "vitest";
import type { RichTextContent } from "@/domain/richText/RichTextContent";
import { richText } from "@/domain/richText/richText";
import { richTextToMarkdown } from "./richTextToMarkdown";

const texts = (content: RichTextContent | null | undefined) =>
  richTextToMarkdown(content).map((block) =>
    block.kind === "paragraph" ? block.text : block.kind,
  );

describe("richTextToMarkdown", () => {
  it("keeps one paragraph per paragraph", () => {
    expect(texts(richText(["primeira", "segunda"]))).toEqual(["primeira", "segunda"]);
  });

  it("carries the emphasis she set", () => {
    const body = richText([
      [
        { text: "Jung deu um nome a esse movimento: " },
        { text: "individuação", italic: true },
        { text: " — tornar-se quem você é." },
      ],
    ]);

    expect(texts(body)).toEqual([
      "Jung deu um nome a esse movimento: *individuação* — tornar-se quem você é.",
    ]);
  });

  it("renders bold, and bold-italic as one triple marker", () => {
    expect(texts(richText([[{ text: "a dizer", bold: true }]]))).toEqual(["**a dizer**"]);
    expect(texts(richText([[{ text: "ambos", bold: true, italic: true }]]))).toEqual([
      "***ambos***",
    ]);
  });

  it("moves a run's padding outside the markers, because ` * text * ` is not emphasis", () => {
    const body = richText([
      [{ text: "antes " }, { text: " no meio ", italic: true }, { text: "depois" }],
    ]);

    expect(texts(body)).toEqual(["antes  *no meio* depois"]);
  });

  it("leaves a whitespace-only run unmarked", () => {
    const body = richText([[{ text: "antes" }, { text: " ", italic: true }, { text: "depois" }]]);

    expect(texts(body)).toEqual(["antes depois"]);
  });

  it("drops a paragraph with nothing readable in it", () => {
    const body = richText(["", "conteúdo", "   "]);

    expect(texts(body)).toEqual(["conteúdo"]);
  });

  it("returns no blocks for an absent or empty editor state", () => {
    expect(richTextToMarkdown(null)).toEqual([]);
    expect(richTextToMarkdown(undefined)).toEqual([]);
    expect(richTextToMarkdown(richText([]))).toEqual([]);
  });
});
