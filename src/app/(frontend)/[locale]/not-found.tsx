import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { getClinica } from "@/domain/clinica/getClinica";
import type { Locale } from "@/domain/site/Locale";
import { siteNavigation } from "@/domain/site/siteNavigation";
import { Link } from "@/i18n/navigation";
import { Footer } from "@/view/chrome/Footer";
import { Header } from "@/view/chrome/Header";
import { StickyHeaderShell } from "@/view/chrome/StickyHeaderShell";

// Rendered inside the `[locale]` layout, so it inherits the visitor's language:
// an English browser that lands on a missing address is answered in English.
// `getLocale` rather than route params — Next renders not-found without them.
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("notFound");
  return { title: t("metaTitle") };
}

export default async function NotFound() {
  const [t, locale] = await Promise.all([getTranslations("notFound"), getLocale()]);
  const clinica = await getClinica(locale as Locale);
  const navLinks = siteNavigation();

  const linkClass =
    "display-italic text-foreground decoration-terracotta hover:text-terracotta inline-flex text-[1.08rem] underline decoration-1 underline-offset-[0.22em] transition-colors";

  return (
    <>
      <StickyHeaderShell>
        <Header clinica={clinica} navLinks={navLinks} />
      </StickyHeaderShell>
      <main
        id="main"
        className="flex min-h-[60vh] items-center px-6 py-32 sm:px-10 sm:py-44 lg:py-52"
      >
        <div className="mx-auto max-w-2xl text-center sm:text-left">
          <p className="tracked mb-6">{t("eyebrow")}</p>
          <h1 className="display text-foreground text-balance text-[clamp(2rem,4.4vw,3rem)] leading-[1.12] tracking-[-0.01em]">
            {t.rich("title", {
              em: (chunks) => <span className="display-italic text-terracotta-deep">{chunks}</span>,
            })}
          </h1>
          <p className="body-prose text-ink mt-8 max-w-[52ch] text-[1.085rem] leading-[1.74]">
            {t("body")}
          </p>

          <div className="mt-12 flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-10">
            <Link href="/" className={linkClass}>
              {t("backHome")}
            </Link>
            <a
              href={clinica.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              {t("whatsapp")}
            </a>
          </div>
        </div>
      </main>
      <Footer clinica={clinica} navLinks={navLinks} />
    </>
  );
}
