import type { Metadata } from "next";
import { Cardo, Vollkorn } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getIdentity } from "@/domain/site/getIdentity";
import { LOCALE_TAGS } from "@/domain/site/Locale";
import { BASE_URL } from "@/infrastructure/env/baseUrl";
import { SITE_INDEXABLE } from "@/infrastructure/env/siteIndexable";
import { routing } from "@/i18n/routing";
import { HashAnchorScroll } from "@/view/routing/HashAnchorScroll";
import "@/app/globals.css";

/**
 * The frontend's root layout, now under `[locale]`: pt-BR renders unprefixed at
 * the root and English under `/en` (REQ-002). Payload's `(payload)` group keeps
 * its own root layout and is untouched by the locale segment or the middleware.
 */

type LocaleRouteProps = { params: Promise<{ locale: string }> };

const cardo = Cardo({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cardo",
});

const vollkorn = Vollkorn({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-vollkorn",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const generateMetadata = async ({ params }: LocaleRouteProps): Promise<Metadata> => {
  const { locale } = await params;
  // An unknown segment is a 404, which the layout below raises; its metadata
  // would never be read.
  if (!hasLocale(routing.locales, locale)) return {};

  // `getIdentity` always resolves (falls back to IDENTITY_DEFAULTS when Payload
  // is off), so siteName/description are the single source for these defaults —
  // no local duplicates needed.
  const identity = await getIdentity(locale);
  return {
    // Lets Next resolve the relative OG image route against the real origin.
    metadataBase: new URL(BASE_URL),
    title: {
      default: identity.siteName,
      // REQ-011's `<página> · Símbolos do Self`. The name comes from the CMS
      // rather than a literal, so she owns it.
      template: `%s · ${identity.siteName}`,
    },
    description: identity.description,
    // Pre-launch belt-and-suspenders. Pair with robots.ts (Disallow: /) so the
    // placeholder credential, portrait, and bio cannot be indexed before the
    // content pass lands. Once NEXT_PUBLIC_SITE_INDEXABLE flips at launch, the
    // `robots` key is dropped entirely so pages become indexable by default.
    ...(SITE_INDEXABLE
      ? {}
      : {
          robots: {
            index: false,
            follow: false,
            nocache: true,
            googleBot: { index: false, follow: false },
          },
        }),
    openGraph: {
      type: "website",
      siteName: identity.siteName,
    },
  };
};

export default async function FrontendLayout({
  children,
  params,
}: LocaleRouteProps & { children: React.ReactNode }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Opts every server component below out of dynamic rendering, so the pages
  // stay statically rendered per locale.
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "chrome" });

  return (
    <html
      lang={LOCALE_TAGS[locale]}
      className={`${cardo.variable} ${vollkorn.variable}`}
      suppressHydrationWarning
    >
      <body className="parchment-grain text-foreground antialiased">
        <NextIntlClientProvider>
          <HashAnchorScroll />
          <a href="#main" className="skip-link">
            {t("skipToContent")}
          </a>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
