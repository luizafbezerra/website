import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getClinica } from "@/domain/clinica/getClinica";
import { getInicio } from "@/domain/inicio/getInicio";
import type { Locale } from "@/domain/site/Locale";
import { pagePath } from "@/domain/site/pagePath";
import { getTestimonials } from "@/domain/testimonials/getTestimonials";
import { absoluteUrl } from "@/infrastructure/env/baseUrl";
import { BrasilExterior } from "@/view/inicio/BrasilExterior";
import { ComoComecar } from "@/view/inicio/ComoComecar";
import { Contato } from "@/view/inicio/Contato";
import { Credencial } from "@/view/general/Credencial";
import { DoisCaminhos } from "@/view/inicio/DoisCaminhos";
import { Hero } from "@/view/inicio/Hero";
import { InstagramBridge } from "@/view/inicio/InstagramBridge";
import { OSintoma } from "@/view/inicio/OSintoma";
import { SobreDigest } from "@/view/inicio/SobreDigest";
import { Vozes } from "@/view/inicio/Vozes";
import { WowSlot } from "@/view/inicio/WowSlot";
import { BreadcrumbJsonLd, ReviewsJsonLd } from "@/view/seo/jsonLd";
import { pageMetadata } from "@/view/seo/pageMetadata";

type HomeProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: HomeProps): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata("inicio", locale);
}

export const revalidate = 3600;

/**
 * Início — the eleven sections of CONCEPT §6, in the order the map declares.
 *
 * The order is the page's argument, and it is fixed in code rather than
 * configured: recognition, then credentials, then her world, then the two doors,
 * then the approach, the wow, the person, the reach, the process, the voices,
 * and only then the ask. A CMS that could reorder this could break the one thing
 * the page does.
 *
 * The route stays thin — two domain reads plus the testimonials, then props. The
 * entity graph is emitted once by the shared `(pages)` layout, so only the two
 * payloads that belong to *this* page are added here.
 */
export default async function Home({ params }: HomeProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [clinica, inicio, testimonials, t] = await Promise.all([
    getClinica(locale),
    getInicio(locale),
    getTestimonials(locale),
    getTranslations({ locale, namespace: "nav" }),
  ]);

  const url = absoluteUrl(pagePath("inicio", locale));
  // Read once for the whole render, so the rotating passage cannot differ
  // between two components on the same page.
  const renderedAt = new Date();

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: t("inicio"), url }]} />

      {testimonials.length > 0 && (
        <ReviewsJsonLd
          itemName={clinica.clinicName}
          reviews={testimonials.map((testimonial) => ({
            body: testimonial.body,
            author: testimonial.attribution,
          }))}
        />
      )}

      <Hero clinica={clinica} content={inicio.hero} />
      <Credencial clinica={clinica} />
      <InstagramBridge clinica={clinica} content={inicio.instagram} />
      <DoisCaminhos content={inicio.doisCaminhos} />
      <OSintoma clinica={clinica} content={inicio.oSintoma} at={renderedAt} />
      <WowSlot content={inicio.cosmos} />
      <SobreDigest content={inicio.sobreDigest} />
      <BrasilExterior content={inicio.brasilExterior} />
      <ComoComecar content={inicio.comoComecar} />
      <Vozes testimonials={testimonials} content={inicio.vozes} />
      <Contato clinica={clinica} content={inicio.contato} />
    </>
  );
}
