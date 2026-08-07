"use client";

import { useLocale, useTranslations } from "next-intl";
import { type Locale, SITE_LOCALES } from "@/domain/site/Locale";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/view/styling/cn";

/**
 * The PT·EN toggle (CONCEPT §6, REQ-002) — typographic, never a flag: flags map
 * to countries, not languages, and a Brazilian in London must be able to stay in
 * Portuguese without being asked to pick a nation.
 *
 * It is a pair of plain links, so it works before hydration and without
 * JavaScript. next-intl renders the target locale's href with an explicit
 * prefix (`/pt/...` even though pt lives unprefixed) precisely so the middleware
 * can update the language cookie before redirecting to the canonical address —
 * that redirect is how the choice persists, and it persists in the visitor's own
 * browser only (SEC-001).
 *
 * `usePathname` returns the internal pathname, which is what keeps the visitor
 * on the page they were reading instead of dropping them at the home page.
 */
export function LanguageToggle({ className }: { className?: string }) {
  const t = useTranslations("chrome.language");
  const current = useLocale() as Locale;
  const pathname = usePathname();

  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      <span className="sr-only">{t("label")}</span>
      {SITE_LOCALES.map((locale, index) => {
        const isCurrent = locale === current;

        return (
          <span key={locale} className="flex items-baseline gap-2">
            {index > 0 && (
              <span aria-hidden="true" className="text-rule">
                ·
              </span>
            )}
            {isCurrent ? (
              <span aria-current="true" className="tracked-ink">
                {t(locale)}
              </span>
            ) : (
              <Link
                href={pathname}
                locale={locale}
                lang={locale}
                aria-label={t(locale === "pt" ? "switchToPt" : "switchToEn")}
                className="tracked hover:text-terracotta no-underline transition-colors"
              >
                {t(locale)}
              </Link>
            )}
          </span>
        );
      })}
    </div>
  );
}
