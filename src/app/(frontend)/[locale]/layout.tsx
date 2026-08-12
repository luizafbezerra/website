import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Cardo, Vollkorn } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getClinica } from "@/domain/clinica/getClinica";
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

/**
 * Only the faces the site actually sets. `next/font` preloads every face it is
 * asked for, at the highest priority, before first paint — so an unused weight
 * is not latent capacity, it is bytes spent ahead of the hero.
 *
 * `latin` only: no glyph the site renders reaches Latin Extended-A. pt-BR's
 * `ã õ ç á é í ó ú â ê` all sit in Latin-1 Supplement, which `latin` covers, and
 * so does the English copy. Should a name ever need `ł` or `č`, `display: "swap"`
 * drops that one character to the Georgia fallback rather than breaking the page.
 *
 * Cardo is display-only (`--font-display`, headings and eyebrows) and headings
 * are never bold, so it ships regular + italic. Vollkorn carries the body, and
 * body copy comes out of Lexical rich text she authors — a bold run there emits
 * `<strong>`, so it keeps one real 700 rather than letting the browser smear a
 * synthetic bold across a serif. Nothing sets 500 or 600.
 */
const cardo = Cardo({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cardo",
});

const vollkorn = Vollkorn({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-vollkorn",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * Exactly two locales exist, so a segment that is not one of them is a 404 and
 * never something to render on demand (TASK-046).
 *
 * This closes a whole class of 500. The middleware matcher deliberately excludes
 * paths containing a dot — machine-facing addresses want to reach the router
 * unrewritten — so a request for `/favicon.ico`, `/analise.md` or any probe for
 * `/wp-login.php` arrives here with `locale` set to that string. Without this the
 * segment tried to render dynamically and threw ("Page changed from static to
 * dynamic at runtime"), so the site answered **500** to requests that are simply
 * not found. Crawlers and scanners make those requests constantly, and a 500 is a
 * far worse signal than a 404.
 */
export const dynamicParams = false;

export const generateMetadata = async ({ params }: LocaleRouteProps): Promise<Metadata> => {
  const { locale } = await params;
  // An unknown segment is a 404, which the layout below raises; its metadata
  // would never be read.
  if (!hasLocale(routing.locales, locale)) return {};

  // `getClinica` always resolves (falls back to CLINICA_DEFAULTS when Payload is
  // off), so the clinic name and her positioning sentence are the single source
  // for these defaults — no local duplicates needed.
  const clinica = await getClinica(locale);
  return {
    // Lets Next resolve the relative OG image route against the real origin.
    metadataBase: new URL(BASE_URL),
    title: {
      default: clinica.clinicName,
      // REQ-011's `<página> · Símbolos do Self`. The name comes from the CMS
      // rather than a literal, so she owns it.
      template: `%s · ${clinica.clinicName}`,
    },
    // Her positioning sentence is the site's default description: one line that
    // answers what this is, for whom, and how far it reaches.
    description: clinica.positioning,
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
      siteName: clinica.clinicName,
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
        {/* Vercel Web Analytics (SEC-001): aggregate and cookieless — paths,
            referrers, countries, which is how we learn whether the
            international reach is working. It sets no cookie and identifies no
            visitor, so the site still needs no consent banner, and /privacidade
            can describe it honestly. */}
        <Analytics />
      </body>
    </html>
  );
}
