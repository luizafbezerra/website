import type { Metadata } from "next";
import { getFaq } from "@/domain/faq/getFaq";
import { getNavigation } from "@/domain/site/getNavigation";
import { getIdentity } from "@/domain/site/getIdentity";
import { Footer } from "@/view/chrome/Footer";
import { Header } from "@/view/chrome/Header";
import { StickyHeaderShell } from "@/view/chrome/StickyHeaderShell";
import { Faq } from "@/view/faq/Faq";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/view/seo/jsonLd";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://example.com";

export async function generateMetadata(): Promise<Metadata> {
  const identity = await getIdentity();
  return {
    title: "Perguntas frequentes",
    description:
      "Como funciona uma primeira conversa, duração da análise, frequência das sessões, atendimento online e presencial.",
    alternates: { canonical: `${BASE_URL}/perguntas` },
    openGraph: {
      title: `Perguntas frequentes — ${identity.fullName}`,
      description:
        "Como funciona uma primeira conversa, duração da análise, frequência das sessões, atendimento online e presencial.",
      url: `${BASE_URL}/perguntas`,
      locale: "pt_BR",
      type: "article",
    },
  };
}

export const revalidate = 86400;

export default async function PerguntasPage() {
  const [identity, navLinks, faqEntries] = await Promise.all([
    getIdentity(),
    getNavigation(),
    getFaq(),
  ]);
  return (
    <>
      <FaqJsonLd entries={faqEntries} />
      <BreadcrumbJsonLd
        items={[
          { name: "Início", url: BASE_URL },
          { name: "Perguntas frequentes", url: `${BASE_URL}/perguntas` },
        ]}
      />

      <StickyHeaderShell>
        <Header identity={identity} navLinks={navLinks} />
      </StickyHeaderShell>
      <main id="main">
        <Faq entries={faqEntries} />
      </main>
      <Footer identity={identity} navLinks={navLinks} />
    </>
  );
}
