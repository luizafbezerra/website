import { SECTIONS_DEFAULT } from "@/domain/sections/sectionRegistry";
import { describe, expect, it } from "vitest";
import { NAV_EXTRA_LINKS_DEFAULT } from "./NavLink";
import { navigationFrom } from "./navigationFrom";

describe("navigationFrom", () => {
  it("derives an in-page anchor link per navigable enabled section", () => {
    expect(navigationFrom(SECTIONS_DEFAULT, NAV_EXTRA_LINKS_DEFAULT)).toEqual([
      { label: "Como trabalho", href: "/#abordagem" },
      { label: "Sobre", href: "/#sobre" },
      { label: "Contato", href: "/#contato" },
    ]);
  });

  it("never links a disabled section", () => {
    const withoutAbout = SECTIONS_DEFAULT.map((section) =>
      section.type === "about" ? { ...section, enabled: false } : section,
    );
    const hrefs = navigationFrom(withoutAbout, []).map((link) => link.href);
    expect(hrefs).not.toContain("/#sobre");
  });

  it("preserves section order rather than registry order", () => {
    const reversed = [...SECTIONS_DEFAULT].reverse();
    expect(navigationFrom(reversed, []).map((link) => link.href)).toEqual([
      "/#contato",
      "/#sobre",
      "/#abordagem",
    ]);
  });

  it("appends off-page links after the anchors", () => {
    const extra = [{ label: "Perguntas", href: "/perguntas" }];
    const links = navigationFrom(SECTIONS_DEFAULT, extra);
    expect(links.at(-1)).toEqual(extra[0]);
  });

  it("returns only the off-page links when no section is enabled", () => {
    const allDisabled = SECTIONS_DEFAULT.map((section) => ({ ...section, enabled: false }));
    expect(navigationFrom(allDisabled, [])).toEqual([]);
  });
});
