import { describe, expect, it } from "vitest";
import { PAGE_KEYS } from "@/domain/site/pages";
import { TWIN_EXTENSION, TWIN_PREFIX, twinEntries, twinFromSegments, twinPath } from "./twinPath";

describe("twinPath", () => {
  it("mirrors the page's own locale path one segment deeper", () => {
    expect(twinPath("analise", "pt")).toBe("/llms/analise.md");
    expect(twinPath("analise", "en")).toBe("/llms/en/analysis.md");
    expect(twinPath("primeiraConversa", "pt")).toBe("/llms/primeira-conversa.md");
    expect(twinPath("primeiraConversa", "en")).toBe("/llms/en/first-conversation.md");
    expect(twinPath("privacidade", "en")).toBe("/llms/en/privacy.md");
  });

  it("names the home page's twin `index`, in both locales", () => {
    expect(twinPath("inicio", "pt")).toBe("/llms/index.md");
    expect(twinPath("inicio", "en")).toBe("/llms/en/index.md");
  });

  it("gives every page in every locale its own address", () => {
    const paths = twinEntries().map((entry) => entry.path);

    expect(paths).toHaveLength(PAGE_KEYS.length * 2);
    expect(new Set(paths).size).toBe(paths.length);
  });

  /**
   * The load-bearing invariant of the whole address scheme: `src/middleware.ts`
   * excludes any path containing a dot, which is what lets a twin resolve in one
   * request with no locale negotiation and no redirect. An address that lost its
   * extension would start being rewritten by next-intl, and an agent with an
   * English `Accept-Language` would be redirected instead of answered.
   */
  it("keeps a dot in every address, so the locale middleware never sees one", () => {
    for (const { path } of twinEntries()) {
      expect(path.endsWith(TWIN_EXTENSION)).toBe(true);
      expect(path.startsWith(`${TWIN_PREFIX}/`)).toBe(true);
      expect(path).toMatch(/\./);
    }
  });
});

describe("twinFromSegments", () => {
  it("round-trips every address the registry produces", () => {
    for (const entry of twinEntries()) {
      const segments = entry.path.slice(`${TWIN_PREFIX}/`.length).split("/");

      expect(twinFromSegments(segments)).toEqual({ key: entry.key, locale: entry.locale });
    }
  });

  it("refuses an address the registry did not produce", () => {
    // The right slug in the wrong locale, the wrong extension, the pt slug under
    // the en prefix, a missing file, and the index by its page path.
    expect(twinFromSegments(["analysis.md"])).toBeNull();
    expect(twinFromSegments(["analise.txt"])).toBeNull();
    expect(twinFromSegments(["en", "analise.md"])).toBeNull();
    expect(twinFromSegments(["blog.md"])).toBeNull();
    expect(twinFromSegments([".md"])).toBeNull();
    expect(twinFromSegments([])).toBeNull();
  });
});
