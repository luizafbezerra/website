import type { Metadata } from "next";
import { Faq as FaqData, Luiza } from "@/core";
import { Footer, Header, StickyHeaderShell } from "@/ui/home";
import { Faq } from "@/ui/home/Faq";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/ui/lib/jsonLd";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://example.com";

export const metadata: Metadata = {
  title: "Perguntas frequentes",
  description:
    "Como funciona uma primeira conversa, duração da análise, frequência das sessões, atendimento online e presencial.",
  alternates: { canonical: `${BASE_URL}/perguntas` },
  openGraph: {
    title: `Perguntas frequentes — ${Luiza.fullName}`,
    description:
      "Como funciona uma primeira conversa, duração da análise, frequência das sessões, atendimento online e presencial.",
    url: `${BASE_URL}/perguntas`,
    locale: "pt_BR",
    type: "article",
  },
};

export const revalidate = 86400;

export default function PerguntasPage() {
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
        <Header />
      </StickyHeaderShell>
      <main id="main">
        <Faq entries={FaqData.entries} />
      </main>
      <Footer />
    </>
  );
}
