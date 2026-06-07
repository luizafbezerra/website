import type { Metadata } from "next";
import { getAllPosts } from "@/app/actions/blog";
import { getIdentity } from "@/app/actions/identity";
import { getTestimonials } from "@/app/actions/testimonials";
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
  const [identity, testimonials, posts] = await Promise.all([
    getIdentity(),
    getTestimonials(),
    getAllPosts("pt-BR"),
  ]);
  const recentPosts = posts.slice(0, 3);

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
        <Header identity={identity} />
      </StickyHeaderShell>
      <main id="main">
        <Hero identity={identity} />
        <Pillars />
        <About identity={identity} />
        <Cosmos />
        <Voices testimonials={testimonials} />
        <Writing posts={recentPosts} />
        <Contact identity={identity} />
      </main>
      <Footer identity={identity} />
    </>
  );
}
