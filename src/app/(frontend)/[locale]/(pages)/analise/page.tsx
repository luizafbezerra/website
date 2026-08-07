import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAnalise } from "@/domain/analise/getAnalise";
import { getClinica } from "@/domain/clinica/getClinica";
import type { Locale } from "@/domain/site/Locale";
import { pagePath } from "@/domain/site/pagePath";
import { absoluteUrl } from "@/infrastructure/env/baseUrl";
import { Abertura } from "@/view/analise/Abertura";
import { Mandala } from "@/view/analise/Mandala";
import { OMetodo } from "@/view/analise/OMetodo";
import { OQueTrazem } from "@/view/analise/OQueTrazem";
import { SonhoAmpliado } from "@/view/analise/SonhoAmpliado";
import { ComecarFold } from "@/view/general/ComecarFold";
import { PraticoSection } from "@/view/general/PraticoSection";
import { BreadcrumbJsonLd } from "@/view/seo/jsonLd";
import { pageMetadata } from "@/view/seo/pageMetadata";

type AnaliseProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: AnaliseProps): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata("analise", locale);
}

// A day rather than an hour: this page's copy is her account of how she works,
// which changes on the timescale of a rewrite, not of an availability edit. The
// global's `afterChange` hook revalidates it the moment she saves anyway.
export const revalidate = 86400;

/**
 * A Análise — five bands (2026-08 condensation of CONCEPT §6's seven sections).
 *
 * The order is the page's argument, uninterrupted from question to ask: what it
 * is (and who receives you) → what people bring, in recognition terms → how the
 * work happens, in her own words → the practical facts, closing on the ask. The
 * wheel comes after the ask, as the page's farewell — the same grammar as the
 * Cosmos on the home, so the wow never sits between a visitor and the CTA.
 *
 * Sonho ampliado can be present between the method and the facts: it renders
 * only while her dream motif is written (CONCEPT §9.3 requires her words), and
 * it ships empty. The component owns that condition.
 *
 * No `FaqJsonLd` and no `Service` payload here — the two services are declared
 * once by the shared `(pages)` layout's entity graph, so only this page's
 * breadcrumb is added. The credential band is gone (the who-line in the opening
 * carries its job); the strip remains on Início and /sobre.
 */
export default async function AnalisePage({ params }: AnaliseProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [clinica, page, nav] = await Promise.all([
    getClinica(locale),
    getAnalise(locale),
    getTranslations({ locale, namespace: "nav" }),
  ]);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: nav("inicio"), url: absoluteUrl(pagePath("inicio", locale)) },
          { name: nav("analise"), url: absoluteUrl(pagePath("analise", locale)) },
        ]}
      />

      <Abertura content={page.abertura} clinica={clinica} />
      <OQueTrazem content={page.oQueTrazem} />
      <OMetodo content={page.oMetodo} />
      <SonhoAmpliado content={page.sonhoAmpliado} />
      <PraticoSection
        id="pratico"
        labelledBy="pratico-heading"
        heading={page.pratico.heading}
        rows={page.pratico.items}
        clinica={clinica}
        fees="analysis"
      >
        <ComecarFold content={page.pratico.comecar} clinica={clinica} opener="analysis" />
      </PraticoSection>
      <Mandala content={page.mandala} />
    </>
  );
}
