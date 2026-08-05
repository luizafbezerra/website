import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAnalise } from "@/domain/analise/getAnalise";
import { getClinica } from "@/domain/clinica/getClinica";
import type { Locale } from "@/domain/site/Locale";
import { pagePath } from "@/domain/site/pagePath";
import { absoluteUrl } from "@/infrastructure/env/baseUrl";
import { Abertura } from "@/view/analise/Abertura";
import { AVisao } from "@/view/analise/AVisao";
import { Mandala } from "@/view/analise/Mandala";
import { OMetodo } from "@/view/analise/OMetodo";
import { OQueTrazem } from "@/view/analise/OQueTrazem";
import { SonhoAmpliado } from "@/view/analise/SonhoAmpliado";
import { Comecar } from "@/view/general/Comecar";
import { Credencial } from "@/view/general/Credencial";
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
 * A Análise — the seven sections of CONCEPT §6, in the map's order, plus the
 * page's own opening.
 *
 * For análise the approach *is* the product, so this is the deepest read on the
 * site and its order is an argument: what it is → what it sees (the whole person)
 * → how it works (the dialogue and the symbolic tools) → the wheel, which is the
 * vocabulary those tools speak → what people actually arrive with, in her own
 * words → the method demonstrated on one dream → the practical facts → the ask.
 * Every section before the last exists to make the last one unnecessary to argue.
 *
 * Sonho ampliado is the one section that can be absent: it renders only while her
 * dream motif is written, so clearing that field in the admin removes it (CONCEPT
 * §9.3 requires her words, and the section must not degrade into empty frames).
 * The component owns that condition, so this list stays a literal section order.
 *
 * No `FaqJsonLd` and no `Service` payload here — the two services are declared
 * once by the shared `(pages)` layout's entity graph, so only this page's
 * breadcrumb is added.
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

      <Abertura content={page.abertura} />
      {/* `column`, not the default `wide`: this page opens on a reading column
          rather than on Início's two-column spread, and the strip has to start
          where the `h1` above it does. */}
      <Credencial clinica={clinica} width="column" />
      <AVisao content={page.aVisao} />
      <OMetodo content={page.oMetodo} />
      <Mandala content={page.mandala} />
      <OQueTrazem content={page.oQueTrazem} />
      <SonhoAmpliado content={page.sonhoAmpliado} />
      <PraticoSection
        id="pratico"
        labelledBy="pratico-heading"
        heading={page.pratico.heading}
        rows={page.pratico.items}
        clinica={clinica}
        fees="analysis"
      />
      <Comecar
        id="para-comecar"
        labelledBy="para-comecar-heading"
        content={page.paraComecar}
        clinica={clinica}
        opener="analysis"
      />
    </>
  );
}
