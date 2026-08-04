import type { Metadata } from "next";
import { Fragment, type ReactNode } from "react";
import { getHome } from "@/domain/home/getHome";
import type { SectionType } from "@/domain/sections/sectionRegistry";
import { getIdentity } from "@/domain/site/getIdentity";
import { getNavigation } from "@/domain/site/getNavigation";
import { getTestimonials } from "@/domain/testimonials/getTestimonials";
import { getMandala } from "@/domain/zodiac/getMandala";
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

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://example.com";

export async function generateMetadata(): Promise<Metadata> {
  const identity = await getIdentity();
  const title = `${identity.fullName} — psicóloga junguiana em ${identity.city}`;
  return {
    title,
    description:
      "Psicoterapia junguiana para adultos. Ansiedade, lutos, relações e propósito — atendimento presencial e online em todo o Brasil.",
    alternates: { canonical: BASE_URL },
    openGraph: {
      title,
      description: identity.tagline,
      url: BASE_URL,
      locale: "pt_BR",
      type: "website",
    },
  };
}

export const revalidate = 3600;

export default async function Home() {
  const [identity, home, navLinks, testimonials, mandala] = await Promise.all([
    getIdentity(),
    getHome(),
    getNavigation(),
    getTestimonials(),
    getMandala(),
  ]);

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
        url={BASE_URL}
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
        knowsLanguage={["pt-BR"]}
        workLocation={{
          city: identity.city,
          region: identity.region,
          country: identity.country,
        }}
      />

      <LocalBusinessJsonLd
        type="MedicalBusiness"
        name={`Consultório de ${identity.fullName}`}
        url={BASE_URL}
        description={`Consultório de psicologia clínica em ${identity.city}–${identity.region}. Análise junguiana para adultos. Atendimento presencial e online.`}
        telephone={identity.phoneE164}
        email={identity.email}
        city={identity.city}
        region={identity.region}
        country={identity.country}
        priceRange="$$"
        areaServed={[identity.city, identity.region, identity.country]}
        founder={{ name: identity.fullName, url: BASE_URL }}
      />

      <WebSiteJsonLd
        name={identity.fullName}
        url={BASE_URL}
        description={identity.tagline}
        inLanguage="pt-BR"
      />

      <BreadcrumbJsonLd items={[{ name: "Início", url: BASE_URL }]} />

      {testimonials.length > 0 && (
        <ReviewsJsonLd
          itemName={identity.fullName}
          itemUrl={BASE_URL}
          reviews={testimonials.map((t) => ({
            body: t.body,
            author: t.attribution,
          }))}
        />
      )}

      <StickyHeaderShell>
        <Header identity={identity} navLinks={navLinks} />
      </StickyHeaderShell>
      <main id="main">
        <Hero identity={identity} content={home.hero} />
        {home.sections
          .filter((s) => s.enabled)
          .map((s) => (
            <Fragment key={s.type}>{sectionNodes[s.type]}</Fragment>
          ))}
      </main>
      <Footer identity={identity} navLinks={navLinks} />
    </>
  );
}
