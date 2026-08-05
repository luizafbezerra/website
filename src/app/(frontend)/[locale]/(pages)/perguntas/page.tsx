import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getFaq } from "@/domain/faq/getFaq";
import { getClinica } from "@/domain/clinica/getClinica";
import type { Locale } from "@/domain/site/Locale";
import { pagePath } from "@/domain/site/pagePath";
import { siteNavigation } from "@/domain/site/siteNavigation";
import { absoluteUrl } from "@/infrastructure/env/baseUrl";
import { Footer } from "@/view/chrome/Footer";
import { Header } from "@/view/chrome/Header";
import { StickyHeaderShell } from "@/view/chrome/StickyHeaderShell";
import { Faq } from "@/view/faq/Faq";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/view/seo/jsonLd";
import { pageMetadata } from "@/view/seo/pageMetadata";

type PerguntasProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: PerguntasProps): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata("perguntas", locale);
}

export const revalidate = 86400;

export default async function PerguntasPage({ params }: PerguntasProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const navLinks = siteNavigation();
  const [clinica, faqEntries, nav] = await Promise.all([
    getClinica(locale),
    getFaq(locale),
    getTranslations({ locale, namespace: "nav" }),
  ]);

  return (
    <>
      <FaqJsonLd entries={faqEntries} />
      <BreadcrumbJsonLd
        items={[
          { name: nav("inicio"), url: absoluteUrl(pagePath("inicio", locale)) },
          { name: nav("perguntas"), url: absoluteUrl(pagePath("perguntas", locale)) },
        ]}
      />

      <StickyHeaderShell>
        <Header clinica={clinica} navLinks={navLinks} />
      </StickyHeaderShell>
      <main id="main">
        <Faq entries={faqEntries} />
      </main>
      <Footer clinica={clinica} navLinks={navLinks} />
    </>
  );
}
