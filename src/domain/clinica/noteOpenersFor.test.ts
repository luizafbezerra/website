import { describe, expect, it } from "vitest";
import type { NoteOpeners } from "./Clinica";
import { noteOpenersFor } from "./noteOpenersFor";

const ALL: NoteOpeners = {
  analysis: "sobre a análise",
  careerGuidance: "sobre a orientação",
  unsure: "não sei qual caminho",
  english: "about sessions in English",
};

describe("noteOpenersFor", () => {
  it("offers the four notes in CONCEPT map order on the Portuguese page", () => {
    expect(noteOpenersFor(ALL, "pt").map((note) => note.door)).toEqual([
      "analysis",
      "careerGuidance",
      "unsure",
      "english",
    ]);
  });

  it("drops the English note on the English mirror, where it is redundant", () => {
    expect(noteOpenersFor(ALL, "en").map((note) => note.door)).toEqual([
      "analysis",
      "careerGuidance",
      "unsure",
    ]);
  });

  it("skips the notes she has not written, keeping the rest in order", () => {
    const partial: NoteOpeners = { ...ALL, careerGuidance: null, unsure: "   " };

    expect(noteOpenersFor(partial, "pt")).toEqual([
      { door: "analysis", text: "sobre a análise" },
      { door: "english", text: "about sessions in English" },
    ]);
  });

  it("returns nothing when none is written, so the page can fall back to the plain button", () => {
    const none: NoteOpeners = { analysis: null, careerGuidance: null, unsure: null, english: null };

    expect(noteOpenersFor(none, "pt")).toEqual([]);
    expect(noteOpenersFor(none, "en")).toEqual([]);
  });
});
