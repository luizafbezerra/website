import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getClinica } from "@/domain/clinica/getClinica";
import { computeNightSky } from "@/domain/cosmos/nightSky";
import { getInicio } from "@/domain/inicio/getInicio";
import { getInstagramFeed } from "@/domain/instagram/getInstagramFeed";
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

type HomeProps = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

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
 * then the approach, the person, the reach, the process, the voices, the ask —
 * and only then the wow. The Cosmos closes the page rather than interrupting it:
 * a visitor deciding whether to write never has to cross a scroll-pinned scene
 * to reach the ask, and the one who lingers past it gets the wonder as the
 * page's farewell. A CMS that could reorder this could break the one thing the
 * page does.
 *
 * The route stays thin — two domain reads plus the testimonials, then props. The
 * entity graph is emitted once by the shared `(pages)` layout, so only the two
 * payloads that belong to *this* page are added here.
 */
export default async function Home({ params, searchParams }: HomeProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Dev-only preview of O céu desta noite at another instant. Guarded before
  // the await: reading searchParams opts a route out of static rendering, so
  // production never touches it — the sky stays hourly-revalidated and is
  // never addressable by URL, which keeps the chart indexing a place and a
  // time, never a person (CONCEPT §11).
  const skyOverride =
    process.env.NODE_ENV === "development" ? parseSkyInstant((await searchParams).ceu) : null;

  const [clinica, inicio, testimonials, instagramPosts, t] = await Promise.all([
    getClinica(locale),
    getInicio(locale),
    getTestimonials(locale),
    // Her live feed, revalidated hourly like the page itself. Returns [] on any
    // failure, and the section hides itself.
    getInstagramFeed(),
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
      <InstagramBridge clinica={clinica} content={inicio.instagram} posts={instagramPosts} />
      <DoisCaminhos content={inicio.doisCaminhos} />
      <OSintoma clinica={clinica} content={inicio.oSintoma} at={renderedAt} />
      <SobreDigest content={inicio.sobreDigest} />
      <BrasilExterior content={inicio.brasilExterior} />
      <ComoComecar content={inicio.comoComecar} />
      <Vozes testimonials={testimonials} content={inicio.vozes} />
      <Contato clinica={clinica} content={inicio.contato} />
      {/* The sky is computed here, on the server, from the same render clock as
          the rotating passage — so every visitor to this render sees one sky,
          and it is São Paulo's rather than the reader's. */}
      <WowSlot content={inicio.cosmos} sky={computeNightSky(skyOverride ?? renderedAt)} />
    </>
  );
}

/**
 * `?ceu=2027-01-15T22:00:00-03:00` (any string `new Date` accepts; a naive
 * datetime reads in the dev machine's zone). Invalid or absent means now.
 */
function parseSkyInstant(value: string | string[] | undefined): Date | null {
  if (typeof value !== "string") return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}
