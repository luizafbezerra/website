import type { Metadata } from "next";
import { Fragment, type ReactNode } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getHome } from "@/domain/home/getHome";
import type { SectionType } from "@/domain/sections/sectionRegistry";
import { getIdentity } from "@/domain/site/getIdentity";
import { getNavigation } from "@/domain/site/getNavigation";
import { type Locale, LOCALE_TAGS } from "@/domain/site/Locale";
import { pagePath } from "@/domain/site/pagePath";
import { getTestimonials } from "@/domain/testimonials/getTestimonials";
import { getMandala } from "@/domain/zodiac/getMandala";
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
  LocalBusinessJsonLd,
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

  const [identity, home, navLinks, testimonials, mandala, t] = await Promise.all([
    getIdentity(locale),
    getHome(locale),
    getNavigation(locale),
    getTestimonials(locale),
    getMandala(locale),
    getTranslations({ locale, namespace: "nav" }),
  ]);

  const url = absoluteUrl(pagePath("inicio", locale));

  // Hero is pinned first and Footer last; these body sections render in the
  // order configured on the Home global, skipping any that are disabled.
  const sectionNodes: Record<SectionType, ReactNode> = {
    pillars: <Pillars content={home.pillars} />,
    about: <About identity={identity} content={home.about} />,
    cosmos: <Cosmos />,
    // Desktop-only: the painted wheel needs the room and pointer affordances of
    // a wide viewport. CSS gate (lg = ≥1024px) — SSR-safe, no client JS.
    symbols: (
      <div className="hidden lg:block">
        <Symbols content={mandala} />
      </div>
    ),
    voices: <Voices testimonials={testimonials} content={home.voices} />,
    contact: <Contact identity={identity} content={home.contact} />,
  };

  return (
    <>
      <PersonJsonLd
        name={identity.fullName}
        url={url}
        jobTitle={`${identity.role} — ${identity.tradition}`}
        email={identity.email}
        telephone={identity.phoneE164}
        description={identity.tagline}
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
        workLocation={{
          city: identity.city,
          region: identity.region,
          country: identity.country,
        }}
      />

      <LocalBusinessJsonLd
        type="MedicalBusiness"
        name={`Consultório de ${identity.fullName}`}
        url={url}
        description={`Consultório de psicologia clínica em ${identity.city}–${identity.region}. Análise junguiana para adultos. Atendimento presencial e online.`}
        telephone={identity.phoneE164}
        email={identity.email}
        city={identity.city}
        region={identity.region}
        country={identity.country}
        priceRange="$$"
        areaServed={[identity.city, identity.region, identity.country]}
        founder={{ name: identity.fullName, url }}
      />

      <WebSiteJsonLd
        name={identity.fullName}
        url={url}
        description={identity.tagline}
        inLanguage={LOCALE_TAGS[locale]}
      />

      <BreadcrumbJsonLd items={[{ name: t("inicio"), url }]} />

      {testimonials.length > 0 && (
        <ReviewsJsonLd
          itemName={identity.fullName}
          itemUrl={url}
          reviews={testimonials.map((testimonial) => ({
            body: testimonial.body,
            author: testimonial.attribution,
          }))}
        />
      )}

      <StickyHeaderShell>
        <Header identity={identity} navLinks={navLinks} />
      </StickyHeaderShell>
      <main id="main">
        <Hero identity={identity} content={home.hero} />
        {home.sections
          .filter((section) => section.enabled)
          .map((section) => (
            <Fragment key={section.type}>{sectionNodes[section.type]}</Fragment>
          ))}
      </main>
      <Footer identity={identity} navLinks={navLinks} />
    </>
  );
}
