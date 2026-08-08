import { describe, expect, it } from "vitest";
import { inEnglishSectionFor } from "./inEnglishSectionFor";
import { INTERNACIONAL_DEFAULTS, type InEnglishSection } from "./Internacional";

const SECTION: InEnglishSection = {
  heading: "In English",
  body: "I am a Brazilian clinical psychologist working in the analytical-psychology tradition.",
  linkLabel: "the whole site in English",
};

describe("inEnglishSectionFor", () => {
  it("offers the section on the Portuguese page, where its whole reason exists", () => {
    expect(inEnglishSectionFor(SECTION, "pt")).toEqual(SECTION);
  });

  it("drops the section on the English mirror, where it would repeat the page", () => {
    expect(inEnglishSectionFor(SECTION, "en")).toBeNull();
  });

  it("hands back the stored section itself, never a rebuilt or partial copy", () => {
    // The section's prose is hers to edit; the rule decides *whether* it renders
    // and must not touch *what* renders.
    expect(inEnglishSectionFor(SECTION, "pt")).toBe(SECTION);
  });

  // CON-002 binds the register of the one section written in English by hand.
  it("carries the drafted default without the protected title", () => {
    const drafted = inEnglishSectionFor(INTERNACIONAL_DEFAULTS.inEnglish, "pt");

    expect(drafted?.body).toContain(
      "clinical psychologist working in the analytical-psychology tradition",
    );
    expect(drafted?.body).not.toContain("Jungian analyst");
  });
});
