import { describe, expect, it } from "vitest";
import {
  blocks,
  bullets,
  factBullets,
  heading,
  labelled,
  link,
  numbered,
  paragraph,
  quote,
  section,
} from "./MarkdownBlock";

describe("block constructors", () => {
  it("treat a blank string as an absence, not as a value", () => {
    expect(heading(2, "")).toBeNull();
    expect(heading(2, "   ")).toBeNull();
    expect(heading(2, null)).toBeNull();
    expect(paragraph(undefined)).toBeNull();
    expect(quote("\n")).toBeNull();
    expect(bullets([])).toBeNull();
    expect(bullets(["", null, "  "])).toBeNull();
    expect(numbered([])).toBeNull();
    expect(link("", "/x")).toBeNull();
  });

  it("trim the value they keep", () => {
    expect(heading(1, "  A análise  ")).toEqual({ kind: "heading", level: 1, text: "A análise" });
    expect(paragraph(" corpo ")).toEqual({ kind: "paragraph", text: "corpo" });
  });

  it("drop the blank items of a list and keep the rest, in order", () => {
    expect(bullets(["um", "", null, "dois"])).toEqual({
      kind: "bullets",
      items: ["um", "dois"],
    });
  });
});

describe("blocks", () => {
  it("flattens nested runs and removes every absence", () => {
    expect(
      blocks(
        paragraph("um"),
        null,
        undefined,
        false,
        [paragraph("dois")].flatMap((b) => b ?? []),
      ),
    ).toEqual([
      { kind: "paragraph", text: "um" },
      { kind: "paragraph", text: "dois" },
    ]);
  });
});

describe("labelled", () => {
  it("pairs a label with its value", () => {
    expect(labelled("Idiomas", "Português ou inglês.")).toBe("**Idiomas** — Português ou inglês.");
  });

  it("prints the value alone when there is no label", () => {
    expect(labelled("", "Português ou inglês.")).toBe("Português ou inglês.");
    expect(labelled(null, "só o valor")).toBe("só o valor");
  });

  it("prints nothing when there is no value, rather than a dangling label", () => {
    expect(labelled("Idiomas", "")).toBeNull();
    expect(labelled("Idiomas", null)).toBeNull();
    expect(labelled(null, null)).toBeNull();
  });
});

describe("factBullets", () => {
  it("renders a prático list as label/value bullets", () => {
    expect(
      factBullets([
        { label: "Valor", value: "A combinar." },
        { label: "Duração", value: "Cinquenta minutos." },
      ]),
    ).toEqual({
      kind: "bullets",
      items: ["**Valor** — A combinar.", "**Duração** — Cinquenta minutos."],
    });
  });

  it("is nothing at all when there are no rows", () => {
    expect(factBullets([])).toBeNull();
  });
});

describe("section", () => {
  it("keeps the heading above its content", () => {
    expect(section(2, "Na prática", paragraph("corpo"))).toEqual([
      { kind: "heading", level: 2, text: "Na prática" },
      { kind: "paragraph", text: "corpo" },
    ]);
  });

  it("emits nothing when there is nothing under the heading", () => {
    expect(section(2, "Sonho ampliado", null, undefined, bullets([]))).toEqual([]);
  });

  it("emits the content without a heading when the heading is blank", () => {
    expect(section(3, "", paragraph("corpo"))).toEqual([{ kind: "paragraph", text: "corpo" }]);
  });

  it("nests: an inner section's blocks count as the outer section's content", () => {
    expect(section(2, "Dois caminhos", section(3, "Análise", paragraph("corpo")))).toEqual([
      { kind: "heading", level: 2, text: "Dois caminhos" },
      { kind: "heading", level: 3, text: "Análise" },
      { kind: "paragraph", text: "corpo" },
    ]);
  });

  it("does not let an empty inner section keep the outer heading alive", () => {
    expect(section(2, "Dois caminhos", section(3, "Análise", null))).toEqual([]);
  });
});
