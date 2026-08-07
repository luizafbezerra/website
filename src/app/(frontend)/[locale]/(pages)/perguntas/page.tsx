import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getClinica } from "@/domain/clinica/getClinica";
import { getFaq } from "@/domain/faq/getFaq";
import { groupFaqByCategory } from "@/domain/faq/groupFaqByCategory";
import { getPerguntas } from "@/domain/perguntas/getPerguntas";
import type { Locale } from "@/domain/site/Locale";
import { pagePath } from "@/domain/site/pagePath";
import { absoluteUrl } from "@/infrastructure/env/baseUrl";
import { Abertura } from "@/view/perguntas/Abertura";
import { Fecho } from "@/view/perguntas/Fecho";
import { Secoes } from "@/view/perguntas/Secoes";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/view/seo/jsonLd";
import { pageMetadata } from "@/view/seo/pageMetadata";

type PerguntasProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: PerguntasProps): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata("perguntas", locale);
}

// A day. The `faq` collection's own `afterChange`/`afterDelete` hooks already
// revalidate both locales of this path plus /llms.txt, so the interval only bounds
// how stale an edit that bypassed a hook can get.
export const revalidate = 86400;

/**
 * Perguntas — the four category sections of CONCEPT §6, in the map's order,
 * preceded by the page's own opening.
 *
 * Two data sources meet here and neither owns the other: the *frame* (the opening,
 * the four section headings, the plate, the close) is the `page-perguntas` global,
 * and the *questions* are rows of the `faq` collection. `groupFaqByCategory` joins
 * them by category, drops the sections with nothing filed under them, and fixes the
 * order as CONCEPT's rather than as whatever order the rows arrive in.
 *
 * **This page owns `FAQPage`.** The master plan reserves the type here and
 * `/primeira-conversa`'s mini-FAQ deliberately emits none, because two overlapping
 * FAQPage entities is a worse signal to a crawler than one complete page. The
 * entries are read back out of the grouped sections rather than from the flat list,
 * so the markup is derived from the same structure the page renders and cannot
 * declare a question the visitor never sees.
 */
export default async function PerguntasPage({ params }: PerguntasProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [clinica, page, faqEntries, nav] = await Promise.all([
    getClinica(locale),
    getPerguntas(locale),
    getFaq(locale),
    getTranslations({ locale, namespace: "nav" }),
  ]);

  const sections = groupFaqByCategory(faqEntries);
  const rendered = sections.flatMap((section) => section.entries);

  return (
    <>
      <FaqJsonLd entries={rendered} />
      <BreadcrumbJsonLd
        items={[
          { name: nav("inicio"), url: absoluteUrl(pagePath("inicio", locale)) },
          { name: nav("perguntas"), url: absoluteUrl(pagePath("perguntas", locale)) },
        ]}
      />

      <Abertura content={page.abertura} />
      {/* No credential strip. DESIGN reserves the full band for Início and /sobre —
          the two pages whose job is verification — and this one's job is to answer
          a doubt: a strip of facts between the opening and the first question is a
          band of things the visitor did not come here to read. What it answered for
          the cold searcher survives without it: the opening states the format,
          languages and reach, and the footer's colophon binds the clinic to her name
          and CRP on every page. */}
      <Secoes sections={sections} headings={page.sections} plate={page.plate} />
      <Fecho clinica={clinica} content={page.fecho} />
    </>
  );
}
