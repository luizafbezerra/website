import type { Metadata } from "next";
import { Cardo, Vollkorn } from "next/font/google";
import { getIdentity } from "@/app/actions/identity";
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

export const generateMetadata = async (): Promise<Metadata> => {
  // `getIdentity` always resolves (falls back to IDENTITY_DEFAULTS when Payload
  // is off), so siteName/description are the single source for these defaults —
  // no local duplicates needed.
  const identity = await getIdentity();
  return {
    title: {
      default: identity.siteName,
      template: `%s — ${identity.siteName}`,
    },
    description: identity.description,
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
      siteName: identity.siteName,
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
