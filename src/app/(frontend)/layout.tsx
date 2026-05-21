import type { Metadata } from "next";
import { Cardo, Vollkorn } from "next/font/google";
import { getSettings } from "@/lib/payload";
import { HashAnchorScroll } from "@/ui/lib/HashAnchorScroll";
import "@/app/globals.css";

const cardo = Cardo({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cardo",
});

const vollkorn = Vollkorn({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-vollkorn",
});

const SITE_NAME_DEFAULT = "Luiza Fernandes Bezerra — Psicóloga";
const DESCRIPTION_DEFAULT =
  "Psicóloga clínica em Guarulhos. Análise junguiana para ansiedade, relações e propósito. Atendimento online e presencial em pt-BR.";

export const generateMetadata = async (): Promise<Metadata> => {
  const settings = await getSettings();
  return {
    title: {
      default: settings?.siteName ?? SITE_NAME_DEFAULT,
      template: `%s — ${settings?.siteName ?? SITE_NAME_DEFAULT}`,
    },
    description: settings?.description ?? DESCRIPTION_DEFAULT,
    // Pre-launch belt-and-suspenders. Pair with robots.ts (Disallow: /) so the
    // placeholder credential, portrait, and bio cannot be indexed before the
    // content pass lands.
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: { index: false, follow: false },
    },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: settings?.siteName ?? SITE_NAME_DEFAULT,
    },
  };
};

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${cardo.variable} ${vollkorn.variable}`}
      suppressHydrationWarning
    >
      <body className="parchment-grain text-foreground antialiased">
        <HashAnchorScroll />
        <a href="#main" className="skip-link">
          Pular para o conteúdo
        </a>
        {children}
      </body>
    </html>
  );
}
