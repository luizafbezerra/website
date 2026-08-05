import type { Metadata } from "next";
import { Fragment, type ReactNode } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getClinica } from "@/domain/clinica/getClinica";
import { HOME_DEFAULTS } from "@/domain/home/Home";
import type { SectionType } from "@/domain/sections/sectionRegistry";
import { type Locale, LOCALE_TAGS } from "@/domain/site/Locale";
import { pagePath } from "@/domain/site/pagePath";
import { siteNavigation } from "@/domain/site/siteNavigation";
import { getTestimonials } from "@/domain/testimonials/getTestimonials";
import { MANDALA_DEFAULTS } from "@/domain/zodiac/MandalaContent";
import { absoluteUrl } from "@/infrastructure/env/baseUrl";
import { Footer } from "@/view/chrome/Footer";
import { Header } from "@/view/chrome/Header";
import { StickyHeaderShell } from "@/view/chrome/StickyHeaderShell";
import { Cosmos } from "@/view/cosmos/Cosmos";
import { About } from "@/view/home/About";
import { Contact } from "@/view/home/Contact";
import { Hero } from "@/view/home/Hero";
import { Pillars } from "@/view/home/Pillars";
import { Voices } from "@/view/home/Voices";
import { Symbols } from "@/view/mandala/Symbols";
import {
  BreadcrumbJsonLd,
  OnlineClinicJsonLd,
  PersonJsonLd,
  ReviewsJsonLd,
  WebSiteJsonLd,
} from "@/view/seo/jsonLd";
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
  const navLinks = siteNavigation();

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
      <PersonJsonLd
        name={clinica.fullName}
        url={url}
        jobTitle={clinica.role}
        email={clinica.email}
        telephone={clinica.whatsappE164}
        description={clinica.positioning}
        knowsAbout={[
          "Psicologia analítica",
          "Análise junguiana",
          "Psicoterapia",
          "Sonhos",
          "Individuação",
          "Ansiedade",
          "Luto",
        ]}
        // She works in both languages (CONCEPT §6) — for an anglophone searcher
        // this is the signal that matters most.
        knowsLanguage={[LOCALE_TAGS.pt, LOCALE_TAGS.en]}
      />

      <OnlineClinicJsonLd
        name={clinica.clinicName}
        url={url}
        description={clinica.positioning}
        telephone={clinica.whatsappE164}
        email={clinica.email}
        sameAs={clinica.instagramUrl ? [clinica.instagramUrl] : []}
        // The international-reach signal, in the vocabulary a machine reads.
        areaServed={["BR", "Worldwide"]}
        founder={{ name: clinica.fullName, url }}
      />

      <WebSiteJsonLd
        name={clinica.clinicName}
        url={url}
        description={clinica.positioning}
        inLanguage={LOCALE_TAGS[locale]}
      />

      <BreadcrumbJsonLd items={[{ name: t("inicio"), url }]} />

      {testimonials.length > 0 && (
        <ReviewsJsonLd
          itemName={clinica.clinicName}
          itemUrl={url}
          reviews={testimonials.map((testimonial) => ({
            body: testimonial.body,
            author: testimonial.attribution,
          }))}
        />
      )}

      <StickyHeaderShell>
        <Header clinica={clinica} navLinks={navLinks} />
      </StickyHeaderShell>
      <main id="main">
        <Hero clinica={clinica} content={home.hero} />
        {home.sections
          .filter((section) => section.enabled)
          .map((section) => (
            <Fragment key={section.type}>{sectionNodes[section.type]}</Fragment>
          ))}
      </main>
      <Footer clinica={clinica} navLinks={navLinks} />
    </>
  );
}
