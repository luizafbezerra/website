import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getClinica } from "@/domain/clinica/getClinica";
import { getOrientacaoProfissional } from "@/domain/orientacaoProfissional/getOrientacaoProfissional";
import type { Locale } from "@/domain/site/Locale";
import { pagePath } from "@/domain/site/pagePath";
import { absoluteUrl } from "@/infrastructure/env/baseUrl";
import { ComecarFold } from "@/view/general/ComecarFold";
import { PraticoSection } from "@/view/general/PraticoSection";
import { Abertura } from "@/view/orientacaoProfissional/Abertura";
import { NemCoaching } from "@/view/orientacaoProfissional/NemCoaching";
import { OPercurso } from "@/view/orientacaoProfissional/OPercurso";
import { ParaQuem } from "@/view/orientacaoProfissional/ParaQuem";
import { BreadcrumbJsonLd } from "@/view/seo/jsonLd";
import { pageMetadata } from "@/view/seo/pageMetadata";

type OrientacaoProfissionalProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: OrientacaoProfissionalProps): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata("orientacaoProfissional", locale);
}

export const revalidate = 3600;

/**
 * Orientação profissional e de carreira — five bands (2026-08 condensation of
 * CONCEPT §6's seven sections).
 *
 * The order is the page's argument, built for the reader PRODUCT describes:
 * younger, comparison-shopping, reading fast. Answer first (what it is, how
 * long, what you leave with — and who conducts it, in the who-line), let them
 * recognise themselves second, show the shape of the work third, then make the
 * distinction the page exists to make — which now also carries the bridge to
 * /analise as its closing paragraph. The price and the ask share the final band.
 *
 * This is also the site's strongest non-brand search asset (CONCEPT §10), which
 * is why the front-load lands entirely in the first section rather than being
 * spread across the scroll.
 *
 * The entity graph — Organization, Person and both Services — is emitted once by
 * the shared `(pages)` layout, so only this page's breadcrumb is added here. No
 * `FAQPage`: that type stays on /perguntas. The credential band is gone (the
 * who-line carries its job); the strip remains on Início and /sobre.
 */
export default async function OrientacaoProfissionalPage({ params }: OrientacaoProfissionalProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [clinica, page, nav] = await Promise.all([
    getClinica(locale),
    getOrientacaoProfissional(locale),
    getTranslations({ locale, namespace: "nav" }),
  ]);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: nav("inicio"), url: absoluteUrl(pagePath("inicio", locale)) },
          {
            name: nav("orientacaoProfissional"),
            url: absoluteUrl(pagePath("orientacaoProfissional", locale)),
          },
        ]}
      />

      <Abertura content={page.abertura} clinica={clinica} />
      <ParaQuem content={page.paraQuem} />
      <OPercurso content={page.oPercurso} />
      <NemCoaching content={page.nemCoaching} />
      {/* The orientação-specific opener CONCEPT §6 asks for: the note this tap
          composes names the door it came through, so the message that reaches her
          WhatsApp says the conversation started here — attribution in her wording,
          with nothing tracked about the visitor (CONCEPT §8.1). */}
      <PraticoSection
        id="pratico"
        labelledBy="pratico-heading"
        heading={page.pratico.heading}
        rows={page.pratico.items}
        clinica={clinica}
        fees="careerGuidance"
      >
        <ComecarFold content={page.pratico.comecar} clinica={clinica} opener="careerGuidance" />
      </PraticoSection>
    </>
  );
}
