import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getClinica } from "@/domain/clinica/getClinica";
import { pagePath } from "@/domain/site/pagePath";
import type { Locale } from "@/domain/site/Locale";
import { getSobre } from "@/domain/sobre/getSobre";
import { absoluteUrl } from "@/infrastructure/env/baseUrl";
import { Credencial } from "@/view/general/Credencial";
import { BreadcrumbJsonLd } from "@/view/seo/jsonLd";
import { pageMetadata } from "@/view/seo/pageMetadata";
import { AClinica } from "@/view/sobre/AClinica";
import { Abertura } from "@/view/sobre/Abertura";
import { Assinatura } from "@/view/sobre/Assinatura";
import { Formacao } from "@/view/sobre/Formacao";
import { QuemE } from "@/view/sobre/QuemE";

type SobreProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: SobreProps): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata("sobre", locale);
}

// A day rather than an hour: this page states a record and a history, and the
// registry already calls its change frequency yearly.
export const revalidate = 86400;

/**
 * Sobre — the four sections of CONCEPT §6, in the map's order, after the page's
 * opening and the credential strip.
 *
 * The order is the page's argument, and it is the one page where the site's thesis
 * resolves: **the world recruits; the person converts.** Her name and her lead
 * introduce the person, the strip proves she is licensed, her prose and her face
 * make her a person rather than a profile, the record answers the sceptic, and the
 * clinic's story hands the world back its name. Then she signs it.
 *
 * "Credencial above the fold" (CONCEPT §6.1) is satisfied by the band sitting
 * directly under the opening rather than by a tab of its own: the facts belong to
 * A Clínica, which is where every core page reads them from (§8.8).
 *
 * No CTA section. CONCEPT §6 gives this page none, the sticky header carries the
 * WhatsApp item the whole way down, and the one quiet hand-off to
 * /primeira-conversa lives at the end of the clinic's story — before the
 * signature, because nothing follows a signature.
 *
 * The `Person` node of the entity graph already points at this URL from the shared
 * `(pages)` layout, so only this page's breadcrumb is added here.
 */
export default async function SobrePage({ params }: SobreProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [clinica, page, nav] = await Promise.all([
    getClinica(locale),
    getSobre(locale),
    getTranslations({ locale, namespace: "nav" }),
  ]);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: nav("inicio"), url: absoluteUrl(pagePath("inicio", locale)) },
          { name: nav("sobre"), url: absoluteUrl(pagePath("sobre", locale)) },
        ]}
      />

      <Abertura content={page.abertura} />
      {/* `column`, not the default `wide`: this page is a reading column, and the
          strip has to start where the `h1` above it does. */}
      <Credencial clinica={clinica} width="column" />
      <QuemE clinica={clinica} content={page.quemE} />
      <Formacao content={page.formacao} />
      <AClinica content={page.aClinica} />
      <Assinatura clinica={clinica} content={page.assinatura} />
    </>
  );
}
