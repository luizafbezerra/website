import type { Metadata } from "next";
import { Luiza } from "@/core";
import { Footer, Header, StickyHeaderShell, Symbols } from "@/ui/home";
import { BreadcrumbJsonLd } from "@/ui/lib/jsonLd";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://example.com";

export const metadata: Metadata = {
  title: "Mandala dos signos",
  description:
    "Doze figuras pintadas, vinte e sete nakshatras, a Terra ao centro — um mapa de ressonâncias, na tradição da psicologia analítica.",
  alternates: { canonical: `${BASE_URL}/simbolos` },
  openGraph: {
    title: `Mandala dos signos — ${Luiza.fullName}`,
    description: "Doze figuras pintadas, vinte e sete nakshatras, a Terra ao centro.",
    url: `${BASE_URL}/simbolos`,
    locale: "pt_BR",
    type: "article",
  },
};

export const revalidate = 86400;

export default function SimbolosPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Início", url: BASE_URL },
          { name: "Mandala dos signos", url: `${BASE_URL}/simbolos` },
        ]}
      />

      <StickyHeaderShell>
        <Header />
      </StickyHeaderShell>
      <main id="main">
        <Symbols />
      </main>
      <Footer />
    </>
  );
}
