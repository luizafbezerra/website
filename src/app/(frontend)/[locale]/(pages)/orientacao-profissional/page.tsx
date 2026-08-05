import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getClinica } from "@/domain/clinica/getClinica";
import { getOrientacaoProfissional } from "@/domain/orientacaoProfissional/getOrientacaoProfissional";
import type { Locale } from "@/domain/site/Locale";
import { pagePath } from "@/domain/site/pagePath";
import { absoluteUrl } from "@/infrastructure/env/baseUrl";
import { Comecar } from "@/view/general/Comecar";
import { Credencial } from "@/view/general/Credencial";
import { Abertura } from "@/view/orientacaoProfissional/Abertura";
import { NemCoaching } from "@/view/orientacaoProfissional/NemCoaching";
import { OPercurso } from "@/view/orientacaoProfissional/OPercurso";
import { ParaQuem } from "@/view/orientacaoProfissional/ParaQuem";
import { PerguntaMaisFunda } from "@/view/orientacaoProfissional/PerguntaMaisFunda";
import { Pratico } from "@/view/orientacaoProfissional/Pratico";
import { BreadcrumbJsonLd } from "@/view/seo/jsonLd";
import { pageMetadata } from "@/view/seo/pageMetadata";

type OrientacaoProfissionalProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: OrientacaoProfissionalProps): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata("orientacaoProfissional", locale);
}

export const revalidate = 3600;

/**
 * Orientação profissional e de carreira — the seven sections of CONCEPT §6, in the
 * map's order.
 *
 * The order is the page's argument, and it is built for the reader PRODUCT
 * describes: younger, comparison-shopping, reading fast. Answer first (what it is,
 * how long, what you leave with), let them recognise themselves second, show the
 * shape of the work third, and only then make the distinction the page exists to
 * make. The bridge to /analise follows, the price after that, and the ask last.
 *
 * This is also the site's strongest non-brand search asset (CONCEPT §10), which is
 * why the front-load lands entirely in the first section rather than being spread
 * across the scroll.
 *
 * The entity graph — Organization, Person and both Services — is emitted once by
 * the shared `(pages)` layout, so only this page's breadcrumb is added here. No
 * `FAQPage`: that type stays on /perguntas.
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

      <Abertura content={page.abertura} />
      {/* `column`, not the default `wide`: this page opens on a reading column
          rather than on Início's two-column spread, and the strip has to start
          where the `h1` above it does. */}
      <Credencial clinica={clinica} width="column" />
      <ParaQuem content={page.paraQuem} />
      <OPercurso content={page.oPercurso} />
      <NemCoaching content={page.nemCoaching} />
      <PerguntaMaisFunda content={page.perguntaMaisFunda} />
      <Pratico clinica={clinica} content={page.pratico} />
      {/* The orientação-specific opener CONCEPT §6 asks for: the note this tap
          composes names the door it came through, so the message that reaches her
          WhatsApp says the conversation started here — attribution in her wording,
          with nothing tracked about the visitor (CONCEPT §8.1). */}
      <Comecar
        id="comecar"
        labelledBy="comecar-heading"
        content={page.comecar}
        clinica={clinica}
        opener="careerGuidance"
      />
    </>
  );
}
