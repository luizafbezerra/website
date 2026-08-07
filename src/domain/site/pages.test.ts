import { describe, expect, it } from "vitest";
import { DEFAULT_LOCALE, SITE_LOCALES } from "./Locale";
import { pagePath, pagePathEntries, pagePathsByLocale } from "./pagePath";
import {
  builtPages,
  FOOTER_COLUMNS,
  footerColumnPages,
  headerNavPages,
  PAGE_KEYS,
  SITE_PAGES,
  sitePage,
} from "./pages";

/**
 * TEST-002: every navigation surface enumerates exactly the registry's pages in
 * both locales. These assertions are deliberately literal — they pin the URL
 * contract CONCEPT §6 promises never to migrate, so a slug edit has to be a
 * conscious act rather than a refactor side effect.
 */
describe("the page registry", () => {
  it("holds each of the eight page keys exactly once, in CONCEPT map order", () => {
    expect(SITE_PAGES.map((page) => page.key)).toEqual([...PAGE_KEYS]);
  });

  it("resolves every key and rejects unknown ones", () => {
    for (const key of PAGE_KEYS) expect(sitePage(key).key).toBe(key);
    // @ts-expect-error — guarding the runtime path a bad CMS/registry edit takes
    expect(() => sitePage("vocabulario")).toThrow(/Unknown site page/);
  });

  it("pins the pt and en paths locked with the owner (REQ-002)", () => {
    const paths = Object.fromEntries(SITE_PAGES.map((page) => [page.key, page.paths]));

    expect(paths).toEqual({
      inicio: { pt: "/", en: "/" },
      analise: { pt: "/analise", en: "/analysis" },
      orientacaoProfissional: { pt: "/orientacao-profissional", en: "/career-guidance" },
      sobre: { pt: "/sobre", en: "/about" },
      primeiraConversa: { pt: "/primeira-conversa", en: "/first-conversation" },
      perguntas: { pt: "/perguntas", en: "/questions" },
      internacional: { pt: "/internacional", en: "/international" },
      privacidade: { pt: "/privacidade", en: "/privacy" },
    });
  });

  it("keeps paths unique within each locale", () => {
    for (const locale of SITE_LOCALES) {
      const paths = SITE_PAGES.map((page) => page.paths[locale]);
      expect(new Set(paths).size).toBe(paths.length);
    }
  });

  it("writes paths as rooted, lowercase, hyphenated segments", () => {
    for (const page of SITE_PAGES) {
      for (const locale of SITE_LOCALES) {
        expect(page.paths[locale]).toMatch(/^\/$|^\/[a-z]+(-[a-z]+)*$/);
      }
    }
  });
});

describe("locale prefixing", () => {
  it("leaves the canonical locale unprefixed and prefixes the mirror", () => {
    expect(pagePath("inicio", "pt")).toBe("/");
    expect(pagePath("inicio", "en")).toBe("/en");
    expect(pagePath("analise", "pt")).toBe("/analise");
    expect(pagePath("analise", "en")).toBe("/en/analysis");
  });

  it("never prefixes the default locale, for any page", () => {
    for (const page of SITE_PAGES) {
      expect(pagePath(page.key, DEFAULT_LOCALE)).toBe(page.paths[DEFAULT_LOCALE]);
    }
  });

  it("gives every page an hreflang set covering both locales", () => {
    for (const page of SITE_PAGES) {
      const byLocale = pagePathsByLocale(page.key);
      expect(Object.keys(byLocale).sort()).toEqual([...SITE_LOCALES].sort());
      expect(byLocale.en.startsWith("/en")).toBe(true);
    }
  });

  it("enumerates one entry per page per locale", () => {
    const entries = pagePathEntries(SITE_PAGES);
    expect(entries).toHaveLength(SITE_PAGES.length * SITE_LOCALES.length);
    expect(new Set(entries.map((entry) => entry.path)).size).toBe(entries.length);
  });
});

describe("navigation surfaces", () => {
  it("puts exactly the four CONCEPT header items in the header nav", () => {
    expect(headerNavPages().map((page) => page.key)).toEqual([
      "analise",
      "orientacaoProfissional",
      "sobre",
      "primeiraConversa",
    ]);
  });

  it("lists every page in exactly one footer column", () => {
    const listed = FOOTER_COLUMNS.flatMap((column) =>
      footerColumnPages(column).map((page) => page.key),
    );

    expect(listed).toHaveLength(SITE_PAGES.length);
    expect(new Set(listed).size).toBe(SITE_PAGES.length);
  });

  it("keeps the footer-only pages out of the header", () => {
    for (const key of ["perguntas", "internacional", "privacidade"] as const) {
      expect(sitePage(key).inHeaderNav).toBe(false);
      expect(sitePage(key).footerColumn).not.toBeNull();
    }
  });
});

describe("sitemap derivation", () => {
  it("advertises only pages that have a route, in both locales", () => {
    const entries = pagePathEntries(builtPages());

    expect(entries.map((entry) => entry.path)).toEqual([
      "/",
      "/en",
      "/analise",
      "/en/analysis",
      "/orientacao-profissional",
      "/en/career-guidance",
      "/sobre",
      "/en/about",
      "/primeira-conversa",
      "/en/first-conversation",
      "/perguntas",
      "/en/questions",
      "/internacional",
      "/en/international",
      "/privacidade",
      "/en/privacy",
    ]);
  });

  // The registry carried all eight addresses from day one (CONCEPT §6: no URL
  // ever migrates) while `status` kept the unbuilt ones out of the sitemap, so it
  // could never advertise a 404. Phase 6 built the last of them, so the two sets
  // now coincide — and `status` stays in the type as the mechanism for the next
  // page added to the map (`/vocabulario` is already reserved in CONCEPT §6).
  // Asserted as an identity rather than as a filter on "planned": every entry is
  // now the literal `"built"`, so a comparison against "planned" no longer
  // type-checks.
  it("advertises every page in the map, now that all eight are built", () => {
    expect(builtPages().map((page) => page.key)).toEqual([...PAGE_KEYS]);
  });

  it("gives the home page the top priority and never exceeds it", () => {
    expect(sitePage("inicio").sitemapPriority).toBe(1.0);
    for (const page of SITE_PAGES) {
      expect(page.sitemapPriority).toBeGreaterThan(0);
      expect(page.sitemapPriority).toBeLessThanOrEqual(1);
    }
  });

  it("makes the home page the only one that owns its whole title", () => {
    const standalone = SITE_PAGES.filter((page) => page.titlePattern === "standalone");
    expect(standalone.map((page) => page.key)).toEqual(["inicio"]);
  });
});
