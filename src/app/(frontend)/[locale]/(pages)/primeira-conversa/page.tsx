import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getClinica } from "@/domain/clinica/getClinica";
import { getPrimeiraConversa } from "@/domain/primeiraConversa/getPrimeiraConversa";
import type { Locale } from "@/domain/site/Locale";
import { pagePath } from "@/domain/site/pagePath";
import { absoluteUrl } from "@/infrastructure/env/baseUrl";
import { Abertura } from "@/view/primeiraConversa/Abertura";
import { Bilhete } from "@/view/primeiraConversa/Bilhete";
import { Logistica } from "@/view/primeiraConversa/Logistica";
import { PassoAPasso } from "@/view/primeiraConversa/PassoAPasso";
import { BreadcrumbJsonLd } from "@/view/seo/jsonLd";
import { pageMetadata } from "@/view/seo/pageMetadata";

type PrimeiraConversaProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: PrimeiraConversaProps): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata("primeiraConversa", locale);
}

export const revalidate = 3600;

/**
 * A primeira conversa — four bands (2026-08 condensation of CONCEPT §6's five
 * sections).
 *
 * The order is the page's argument: answer first (what happens, step by step,
 * with the three permissions as that band's coda), price and the last doubts
 * second, and only then hand over a note to send. Anything that moved the ask
 * earlier would make the page pressure a visitor who came here precisely because
 * they were not ready to be pressured.
 *
 * No `FaqJsonLd`: the doubts in O combinado are a shortlist of `/perguntas`,
 * which owns the `FAQPage` entity. The rest of the entity graph is emitted once
 * by the shared `(pages)` layout, so only this page's breadcrumb is added here.
 * The credential band is gone (the who-line in the opening carries its job); the
 * strip remains on Início and /sobre.
 */
export default async function PrimeiraConversaPage({ params }: PrimeiraConversaProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [clinica, page, nav] = await Promise.all([
    getClinica(locale),
    getPrimeiraConversa(locale),
    getTranslations({ locale, namespace: "nav" }),
  ]);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: nav("inicio"), url: absoluteUrl(pagePath("inicio", locale)) },
          {
            name: nav("primeiraConversa"),
            url: absoluteUrl(pagePath("primeiraConversa", locale)),
          },
        ]}
      />

      <Abertura content={page.abertura} clinica={clinica} />
      <PassoAPasso content={page.passoAPasso} />
      <Logistica clinica={clinica} content={page.logistica} />
      <Bilhete clinica={clinica} content={page.bilhete} locale={locale} />
    </>
  );
}
