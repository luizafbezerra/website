import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getClinica } from "@/domain/clinica/getClinica";
import { getPrivacidade } from "@/domain/privacidade/getPrivacidade";
import type { Locale } from "@/domain/site/Locale";
import { pagePath } from "@/domain/site/pagePath";
import { absoluteUrl } from "@/infrastructure/env/baseUrl";
import { Abertura } from "@/view/privacidade/Abertura";
import { BilheteNota } from "@/view/privacidade/BilheteNota";
import { Guarda } from "@/view/privacidade/Guarda";
import { NuncaFaz } from "@/view/privacidade/NuncaFaz";
import { Responsavel } from "@/view/privacidade/Responsavel";
import { BreadcrumbJsonLd } from "@/view/seo/jsonLd";
import { pageMetadata } from "@/view/seo/pageMetadata";

type PrivacidadeProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: PrivacidadeProps): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata("privacidade", locale);
}

export const revalidate = 86400;

/**
 * Privacidade — CONCEPT §6's four sections in the map's order, plus the page's
 * opening and the one section the map has no room for.
 *
 * The order is the page's argument: answer the whole thing in three sentences,
 * then name what the site keeps (short), then what it never does (longer, and the
 * relief), then the one mechanism worth explaining, and last the part that is not
 * about the site at all — who holds a message once it arrives, what the law
 * guarantees the person who sent it, and the confidentiality that covers the
 * sessions themselves.
 *
 * This is a launch gate: Vercel Web Analytics ships in the frontend layout, and
 * the site must not be indexable before this page names those aggregate statistics
 * honestly (SEC-001). Every claim on it is checkable in this repository rather than
 * asserted — see `PRIVACIDADE_DEFAULTS`.
 *
 * No plate, no wow, no CTA, and no client component of its own. The plate
 * exemption is argued in the page's plan (PAT-002 wants one per page; a full
 * editorial painting on the one page being deliberately literal would be
 * decoration exactly where decoration reads as a hedge). The entity graph is
 * emitted once by the shared `(pages)` layout, so only this page's breadcrumb is
 * added here.
 */
export default async function PrivacidadePage({ params }: PrivacidadeProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [clinica, page, nav] = await Promise.all([
    getClinica(locale),
    getPrivacidade(locale),
    getTranslations({ locale, namespace: "nav" }),
  ]);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: nav("inicio"), url: absoluteUrl(pagePath("inicio", locale)) },
          { name: nav("privacidade"), url: absoluteUrl(pagePath("privacidade", locale)) },
        ]}
      />

      <Abertura content={page.abertura} />
      <Guarda content={page.guarda} />
      <NuncaFaz content={page.nuncaFaz} />
      <BilheteNota content={page.bilheteNota} />
      <Responsavel clinica={clinica} content={page.responsavel} />
    </>
  );
}
