import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { getClinica } from "@/domain/clinica/getClinica";
import { routing } from "@/i18n/routing";
import { Footer } from "@/view/chrome/Footer";
import { Header } from "@/view/chrome/Header";
import { SiteEntityGraphJsonLd } from "@/view/seo/jsonLd";

/**
 * The chrome every content page wears: header, the `<main>` landmark, footer.
 *
 * It lives on the `(pages)` route group rather than on `[locale]` because the
 * catch-all 404 and the error boundary need to render their own shells — and
 * because a route group changes no URL, so the eight CONCEPT addresses stay
 * exactly where the registry puts them.
 *
 * Pages below return their sections and their page-specific structured data;
 * nothing about the chrome is a page's business any more.
 */

type PagesLayoutProps = {
  children: React.ReactNode;
  // Next types a layout's route params as plain strings; `hasLocale` narrows
  // to `Locale` below, the same guard the root layout uses.
  params: Promise<{ locale: string }>;
};

export default async function PagesLayout({ children, params }: PagesLayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  const clinica = await getClinica(locale);

  return (
    <>
      {/* One entity graph per page, from one place (REQ-011). */}
      <SiteEntityGraphJsonLd clinica={clinica} locale={locale} />
      <Header clinica={clinica} locale={locale} />
      <main id="main">{children}</main>
      <Footer clinica={clinica} locale={locale} />
    </>
  );
}
