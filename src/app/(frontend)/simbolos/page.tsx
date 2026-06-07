import type { Metadata } from "next";
import Link from "next/link";
import { getNavigation } from "@/app/actions/home";
import { getIdentity } from "@/app/actions/identity";
import { Footer, Header, StickyHeaderShell, Symbols } from "@/ui/home";
import { BreadcrumbJsonLd } from "@/ui/lib/jsonLd";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://example.com";

export async function generateMetadata(): Promise<Metadata> {
  const identity = await getIdentity();
  return {
    title: "Mandala dos signos",
    description:
      "Doze figuras pintadas, vinte e sete nakshatras, a Terra ao centro — um mapa de ressonâncias, na tradição da psicologia analítica.",
    alternates: { canonical: `${BASE_URL}/simbolos` },
    openGraph: {
      title: `Mandala dos signos — ${identity.fullName}`,
      description: "Doze figuras pintadas, vinte e sete nakshatras, a Terra ao centro.",
      url: `${BASE_URL}/simbolos`,
      locale: "pt_BR",
      type: "article",
    },
  };
}

export const revalidate = 86400;

export default async function SimbolosPage() {
  const [identity, navLinks] = await Promise.all([getIdentity(), getNavigation()]);
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Início", url: BASE_URL },
          { name: "Mandala dos signos", url: `${BASE_URL}/simbolos` },
        ]}
      />

      <StickyHeaderShell>
        <Header identity={identity} navLinks={navLinks} />
      </StickyHeaderShell>
      <main id="main">
        <nav aria-label="Trilha" className="px-6 pt-24 sm:px-10 sm:pt-28 lg:pt-32">
          <p className="marginalia mx-auto max-w-7xl">
            <Link
              href="/"
              className="text-quill hover:text-terracotta decoration-terracotta/30 hover:decoration-terracotta underline decoration-1 underline-offset-[0.28em] transition-colors"
            >
              Início
            </Link>{" "}
            <span aria-hidden="true" className="text-terracotta/60">
              ·
            </span>{" "}
            <span className="text-foreground">Mandala dos signos</span>
          </p>
        </nav>
        <Symbols />
      </main>
      <Footer identity={identity} navLinks={navLinks} />
    </>
  );
}
