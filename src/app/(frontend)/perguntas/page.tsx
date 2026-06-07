import type { Metadata } from "next";
import { getNavigation } from "@/app/actions/home";
import { getIdentity } from "@/app/actions/identity";
import { Faq as FaqData } from "@/core";
import { Footer, Header, StickyHeaderShell } from "@/ui/home";
import { Faq } from "@/ui/home/Faq";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/ui/lib/jsonLd";

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
  const [identity, navLinks] = await Promise.all([getIdentity(), getNavigation()]);
  return (
    <>
      <FaqJsonLd entries={[...FaqData.entries]} />
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
        <Faq entries={FaqData.entries} />
      </main>
      <Footer identity={identity} navLinks={navLinks} />
    </>
  );
}
