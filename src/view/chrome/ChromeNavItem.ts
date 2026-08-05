import type { PageKey, SitePathname } from "@/domain/site/pages";

/**
 * One navigation entry as the chrome renders it: the registry's address plus
 * the label for the visitor's language.
 *
 * The chrome never invents an entry — header, footer and mobile drawer all map
 * over `headerNavPages()` / `footerColumnPages()`, so they cannot disagree about
 * which pages exist (REQ-001). The label is read from `messages/{pt,en}.json`
 * keyed by `key`, because the registry holds no human-facing copy.
 *
 * `href` is the internal (pt) pathname next-intl routes on; it renders as the
 * visitor's locale variant.
 */
export type ChromeNavItem = {
  key: PageKey;
  href: SitePathname;
  label: string;
};
