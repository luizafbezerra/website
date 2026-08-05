import type { Metadata } from "next";
import { Fragment, type ReactNode } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getClinica } from "@/domain/clinica/getClinica";
import { HOME_DEFAULTS } from "@/domain/home/Home";
import type { SectionType } from "@/domain/sections/sectionRegistry";
import type { Locale } from "@/domain/site/Locale";
import { pagePath } from "@/domain/site/pagePath";
import { getTestimonials } from "@/domain/testimonials/getTestimonials";
import { MANDALA_DEFAULTS } from "@/domain/zodiac/MandalaContent";
import { absoluteUrl } from "@/infrastructure/env/baseUrl";
import { Cosmos } from "@/view/cosmos/Cosmos";
import { About } from "@/view/home/About";
import { Contact } from "@/view/home/Contact";
import { Hero } from "@/view/home/Hero";
import { Pillars } from "@/view/home/Pillars";
import { Voices } from "@/view/home/Voices";
import { Symbols } from "@/view/mandala/Symbols";
import { BreadcrumbJsonLd, ReviewsJsonLd } from "@/view/seo/jsonLd";
import { pageMetadata } from "@/view/seo/pageMetadata";

type HomeProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: HomeProps): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata("inicio", locale);
}

export const revalidate = 3600;

export default async function Home({ params }: HomeProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [clinica, testimonials, t] = await Promise.all([
    getClinica(locale),
    getTestimonials(locale),
    getTranslations({ locale, namespace: "nav" }),
  ]);

  // This page's editorial copy comes from code defaults, not from the CMS: the
  // seven `home-*` globals it used to read are gone (their model predates
  // CONCEPT v3) and the `page-inicio` global that replaces them is built section
  // by section in TASK-035. Same for the wheel's prose and the section order.
  const home = HOME_DEFAULTS;
  const mandala = MANDALA_DEFAULTS;

  const url = absoluteUrl(pagePath("inicio", locale));

  // Hero is pinned first and Footer last; these body sections render in the
  // order configured on the Home global, skipping any that are disabled.
  const sectionNodes: Record<SectionType, ReactNode> = {
    pillars: <Pillars content={home.pillars} />,
    about: <About clinica={clinica} content={home.about} />,
    cosmos: <Cosmos />,
    // Desktop-only: the painted wheel needs the room and pointer affordances of
    // a wide viewport. CSS gate (lg = ≥1024px) — SSR-safe, no client JS.
    symbols: (
      <div className="hidden lg:block">
        <Symbols content={mandala} />
      </div>
    ),
    voices: <Voices testimonials={testimonials} content={home.voices} />,
    contact: <Contact clinica={clinica} content={home.contact} />,
  };

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

      <Hero clinica={clinica} content={home.hero} />
      {home.sections
        .filter((section) => section.enabled)
        .map((section) => (
          <Fragment key={section.type}>{sectionNodes[section.type]}</Fragment>
        ))}
    </>
  );
}
