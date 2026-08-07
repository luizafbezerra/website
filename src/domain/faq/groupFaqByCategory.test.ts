import { describe, expect, it } from "vitest";
import { FAQ_CATEGORIES, type FaqCategory } from "./FaqCategory";
import { FAQ_DEFAULTS, type FaqEntry } from "./FaqEntry";
import { groupFaqByCategory } from "./groupFaqByCategory";

const entry = (question: string, category: FaqCategory): FaqEntry => ({
  question,
  answer: `resposta para ${question}`,
  category,
});

describe("groupFaqByCategory", () => {
  it("has nothing to render when there are no questions", () => {
    expect(groupFaqByCategory([])).toEqual([]);
  });

  // The order is CONCEPT §6's, not the order rows happen to arrive in: one
  // re-ordered row in the admin must not rewrite the page's structure.
  it("orders the sections by FAQ_CATEGORIES, whatever order the entries arrive in", () => {
    const sections = groupFaqByCategory([
      entry("fuso", "internacional"),
      entry("valores", "pratico"),
      entry("testes", "orientacao"),
      entry("duração", "analise"),
    ]);

    expect(sections.map((section) => section.category)).toEqual([
      "analise",
      "orientacao",
      "pratico",
      "internacional",
    ]);
  });

  // Stability, not sorting: `findFaqEntries` already sorted by `order` in the
  // database, and `FaqEntry` carries no `order` field to re-sort by.
  it("keeps the entries of a section in the order they arrived", () => {
    const sections = groupFaqByCategory([
      entry("primeira", "pratico"),
      entry("de outra seção", "analise"),
      entry("segunda", "pratico"),
      entry("terceira", "pratico"),
    ]);

    const pratico = sections.find((section) => section.category === "pratico");
    expect(pratico?.entries.map((item) => item.question)).toEqual([
      "primeira",
      "segunda",
      "terceira",
    ]);
  });

  // An `h2` over nothing reads as a broken page. Two of the four sections ship
  // empty until she has answered them.
  it("drops a category with no questions instead of printing an empty heading", () => {
    const sections = groupFaqByCategory([entry("duração", "analise"), entry("valores", "pratico")]);

    expect(sections.map((section) => section.category)).toEqual(["analise", "pratico"]);
    expect(sections.every((section) => section.entries.length > 0)).toBe(true);
  });

  it("renders a single section when every question is filed under one category", () => {
    const sections = groupFaqByCategory([entry("a", "orientacao"), entry("b", "orientacao")]);

    expect(sections).toEqual([
      { category: "orientacao", entries: [entry("a", "orientacao"), entry("b", "orientacao")] },
    ]);
  });

  // The page's FAQPage JSON-LD is derived from the grouped sections, so losing or
  // duplicating an entry here would silently desync the markup from the page.
  it("files every entry exactly once", () => {
    const sections = groupFaqByCategory(FAQ_DEFAULTS);
    const grouped = sections.flatMap((section) => section.entries);

    expect(grouped).toHaveLength(FAQ_DEFAULTS.length);
    expect(new Set(grouped.map((item) => item.question)).size).toBe(FAQ_DEFAULTS.length);
    for (const section of sections) {
      expect(section.entries.every((item) => item.category === section.category)).toBe(true);
    }
  });

  // The shipped defaults must actually reach every section CONCEPT §6 asks for —
  // the failure this page had before: two of the four had no questions at all.
  it("fills all four CONCEPT sections from the shipped defaults", () => {
    const sections = groupFaqByCategory(FAQ_DEFAULTS);

    expect(sections.map((section) => section.category)).toEqual([...FAQ_CATEGORIES]);
  });
});
