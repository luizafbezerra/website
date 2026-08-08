import { describe, expect, it } from "vitest";
import type { MarkdownBlock } from "./MarkdownBlock";
import { renderMarkdown } from "./renderMarkdown";

describe("renderMarkdown", () => {
  it("renders each kind and separates blocks with one blank line", () => {
    const document: MarkdownBlock[] = [
      { kind: "heading", level: 1, text: "A análise" },
      { kind: "paragraph", text: "Um espaço seguro de escuta." },
      { kind: "heading", level: 2, text: "Na prática" },
      { kind: "bullets", items: ["**Valor** — A combinar.", "**Idiomas** — Português ou inglês."] },
      { kind: "heading", level: 3, text: "Passo a passo" },
      { kind: "numbered", items: ["Você me escreve", "Combinamos o horário"] },
      { kind: "quote", text: "Sonhei que encontrava um cômodo desconhecido." },
    ];

    expect(renderMarkdown(document)).toBe(
      [
        "# A análise",
        "",
        "Um espaço seguro de escuta.",
        "",
        "## Na prática",
        "",
        "- **Valor** — A combinar.",
        "- **Idiomas** — Português ou inglês.",
        "",
        "### Passo a passo",
        "",
        "1. Você me escreve",
        "2. Combinamos o horário",
        "",
        "> Sonhei que encontrava um cômodo desconhecido.",
        "",
      ].join("\n"),
    );
  });

  it("numbers an ordered list from one, whatever numerals the page prints", () => {
    const rendered = renderMarkdown([{ kind: "numbered", items: ["I", "II", "III", "IV", "V"] }]);

    expect(rendered).toBe("1. I\n2. II\n3. III\n4. IV\n5. V\n");
  });

  it("ends with exactly one newline, so the file is a well-formed text document", () => {
    expect(renderMarkdown([{ kind: "paragraph", text: "fim" }])).toBe("fim\n");
  });

  it("renders an empty document as a single newline rather than throwing", () => {
    expect(renderMarkdown([])).toBe("\n");
  });

  it("leaves her punctuation alone — no escaping", () => {
    const rendered = renderMarkdown([
      {
        kind: "paragraph",
        text: "Lei nº 13.709/2018 · um cookie chamado NEXT_LOCALE — e nada mais.",
      },
    ]);

    expect(rendered).toBe("Lei nº 13.709/2018 · um cookie chamado NEXT_LOCALE — e nada mais.\n");
  });
});
