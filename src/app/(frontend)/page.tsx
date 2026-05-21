import type { Metadata } from "next";
import { getAllPosts } from "@/app/actions/blog";
import { Luiza } from "@/core";
import {
  About,
  Contact,
  Cosmos,
  Footer,
  Header,
  Hero,
  Pillars,
  StickyHeaderShell,
  Voices,
  Writing,
} from "@/ui/home";
import {
  BreadcrumbJsonLd,
  LocalBusinessJsonLd,
  PersonJsonLd,
  ReviewsJsonLd,
  WebSiteJsonLd,
} from "@/ui/lib/jsonLd";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://example.com";

export const metadata: Metadata = {
  title: `${Luiza.fullName} — psicóloga junguiana em ${Luiza.city}`,
  description:
    "Psicoterapia junguiana para adultos. Ansiedade, lutos, relações e propósito — atendimento presencial e online em todo o Brasil.",
  alternates: { canonical: BASE_URL },
  openGraph: {
    title: `${Luiza.fullName} — psicóloga junguiana em ${Luiza.city}`,
    description: Luiza.tagline,
    url: BASE_URL,
    locale: "pt_BR",
    type: "website",
  },
};

export const revalidate = 3600;

export default async function Home() {
  const posts = await getAllPosts("pt-BR");
  const recentPosts = posts.slice(0, 3);

  return (
    <>
      <PersonJsonLd
        name={Luiza.fullName}
        url={BASE_URL}
        jobTitle={`${Luiza.role} — ${Luiza.tradition}`}
        email={Luiza.email}
        telephone={Luiza.phoneE164}
        description={Luiza.tagline}
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
          city: Luiza.city,
          region: Luiza.region,
          country: Luiza.country,
        }}
      />

      <LocalBusinessJsonLd
        type="MedicalBusiness"
        name={`Consultório de ${Luiza.fullName}`}
        url={BASE_URL}
        description={`Consultório de psicologia clínica em ${Luiza.city}–${Luiza.region}. Análise junguiana para adultos. Atendimento presencial e online.`}
        telephone={Luiza.phoneE164}
        email={Luiza.email}
        city={Luiza.city}
        region={Luiza.region}
        country={Luiza.country}
        priceRange="$$"
        areaServed={[Luiza.city, Luiza.region, Luiza.country]}
        founder={{ name: Luiza.fullName, url: BASE_URL }}
      />

      <WebSiteJsonLd
        name={Luiza.fullName}
        url={BASE_URL}
        description={Luiza.tagline}
        inLanguage="pt-BR"
      />

      <BreadcrumbJsonLd items={[{ name: "Início", url: BASE_URL }]} />

      {Luiza.testimonials.length > 0 && (
        <ReviewsJsonLd
          itemName={Luiza.fullName}
          itemUrl={BASE_URL}
          reviews={Luiza.testimonials.map((t) => ({
            body: t.body,
            author: t.attribution,
          }))}
        />
      )}

      <StickyHeaderShell>
        <Header />
      </StickyHeaderShell>
      <main id="main">
        <Hero />
        <Pillars />
        <About />
        <Cosmos />
        <Voices />
        <Writing posts={recentPosts} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
