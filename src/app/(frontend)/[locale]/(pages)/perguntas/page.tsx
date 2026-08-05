import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getFaq } from "@/domain/faq/getFaq";
import type { Locale } from "@/domain/site/Locale";
import { pagePath } from "@/domain/site/pagePath";
import { absoluteUrl } from "@/infrastructure/env/baseUrl";
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

  const [faqEntries, nav] = await Promise.all([
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

      <Faq entries={faqEntries} />
    </>
  );
}
