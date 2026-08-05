import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getClinica } from "@/domain/clinica/getClinica";
import { getInternacional } from "@/domain/internacional/getInternacional";
import { inEnglishSectionFor } from "@/domain/internacional/inEnglishSectionFor";
import type { Locale } from "@/domain/site/Locale";
import { pagePath } from "@/domain/site/pagePath";
import { absoluteUrl } from "@/infrastructure/env/baseUrl";
import { Comecar } from "@/view/general/Comecar";
import { Credencial } from "@/view/general/Credencial";
import { Abertura } from "@/view/internacional/Abertura";
import { BrasileirosFora } from "@/view/internacional/BrasileirosFora";
import { InEnglish } from "@/view/internacional/InEnglish";
import { Pratico } from "@/view/internacional/Pratico";
import { BreadcrumbJsonLd } from "@/view/seo/jsonLd";
import { pageMetadata } from "@/view/seo/pageMetadata";

type InternacionalProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: InternacionalProps): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata("internacional", locale);
}

// The page's own copy changes about as often as her reach does, but it renders A
// Clínica's availability state at the ask, which is the fact on it most likely to
// move in a week — so it revalidates on the same hour as the other content pages.
export const revalidate = 3600;

/**
 * Brasil e exterior — the five sections of CONCEPT §6, in the map's order.
 *
 * The page answers one question ("do you attend from where I live?") in the order
 * a person abroad actually asks it: yes, and it is regulated → in Portuguese, in
 * your own time zone → in English, if that is your language → the money, the
 * platform and the languages → write, from where you are.
 *
 * **The In-English section renders on the Portuguese page only.** On `/en` the
 * whole page is English already, so the block would repeat the page and its link
 * would point at the page it sits on; `inEnglishSectionFor` is the rule, and it is
 * consulted here rather than inside the component because a section that
 * structurally disappears in one locale belongs to the page's composition.
 *
 * No wow set-piece, deliberately. PAT-002 allows zero, and this is the page a
 * comparing reader arrives at with a logistical question — the plate inside
 * `BrasileirosFora` is its art moment, and a scroll-driven event would put wonder
 * between somebody and the answer they came for.
 */
export default async function InternacionalPage({ params }: InternacionalProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [clinica, page, nav] = await Promise.all([
    getClinica(locale),
    getInternacional(locale),
    getTranslations({ locale, namespace: "nav" }),
  ]);

  const inEnglish = inEnglishSectionFor(page.inEnglish, locale);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: nav("inicio"), url: absoluteUrl(pagePath("inicio", locale)) },
          { name: nav("internacional"), url: absoluteUrl(pagePath("internacional", locale)) },
        ]}
      />

      <Abertura content={page.abertura} />
      {/* `column`, not the default `wide`: this page opens on a reading column,
          and the strip has to start where the `h1` above it does. */}
      <Credencial clinica={clinica} width="column" />
      <BrasileirosFora content={page.brasileirosFora} />
      {inEnglish && <InEnglish content={inEnglish} />}
      <Pratico clinica={clinica} content={page.pratico} />
      {/* The fifth opener, written for this page: what the arriving message
          attributes is not which door the visitor came through but that they write
          from outside Brazil — the thing this page exists to permit. */}
      <Comecar
        id="comecar"
        labelledBy="comecar-heading"
        content={page.comecar}
        clinica={clinica}
        opener="international"
      />
    </>
  );
}
