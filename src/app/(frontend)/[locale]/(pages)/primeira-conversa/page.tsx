import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getClinica } from "@/domain/clinica/getClinica";
import { getPrimeiraConversa } from "@/domain/primeiraConversa/getPrimeiraConversa";
import type { Locale } from "@/domain/site/Locale";
import { pagePath } from "@/domain/site/pagePath";
import { absoluteUrl } from "@/infrastructure/env/baseUrl";
import { Credencial } from "@/view/general/Credencial";
import { Abertura } from "@/view/primeiraConversa/Abertura";
import { Bilhete } from "@/view/primeiraConversa/Bilhete";
import { Logistica } from "@/view/primeiraConversa/Logistica";
import { MiniFaq } from "@/view/primeiraConversa/MiniFaq";
import { PassoAPasso } from "@/view/primeiraConversa/PassoAPasso";
import { Permissoes } from "@/view/primeiraConversa/Permissoes";
import { BreadcrumbJsonLd } from "@/view/seo/jsonLd";
import { pageMetadata } from "@/view/seo/pageMetadata";

type PrimeiraConversaProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: PrimeiraConversaProps): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata("primeiraConversa", locale);
}

export const revalidate = 3600;

/**
 * A primeira conversa — the five sections of CONCEPT §6, in the map's order.
 *
 * The order is the page's argument: answer first (what happens, step by step),
 * reassure second (the three permissions and the plate's breath), price third,
 * resolve the last doubt fourth, and only then hand over a note to send. Anything
 * that moved the ask earlier would make the page pressure a visitor who came here
 * precisely because they were not ready to be pressured.
 *
 * No `FaqJsonLd`: the mini-FAQ is a shortlist of `/perguntas`, which owns the
 * `FAQPage` entity. The rest of the entity graph is emitted once by the shared
 * `(pages)` layout, so only this page's breadcrumb is added here.
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

      <Abertura content={page.abertura} />
      {/* `column`, not the default `wide`: this page opens on a reading column
          rather than on Início's two-column spread, and the strip has to start
          where the `h1` above it does. */}
      <Credencial clinica={clinica} width="column" />
      <PassoAPasso content={page.passoAPasso} />
      <Permissoes content={page.permissoes} />
      <Logistica clinica={clinica} content={page.logistica} />
      <MiniFaq content={page.miniFaq} />
      <Bilhete clinica={clinica} content={page.bilhete} locale={locale} />
    </>
  );
}
