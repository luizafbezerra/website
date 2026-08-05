import { getTranslations } from "next-intl/server";
import type { Clinica } from "@/domain/clinica/Clinica";
import type { Locale } from "@/domain/site/Locale";
import { headerNavPages } from "@/domain/site/pages";
import { Link } from "@/i18n/navigation";
import { FooterCosmosRestore } from "./FooterCosmosRestore";
import type { ChromeNavItem } from "./ChromeNavItem";

export async function Footer({ clinica, locale }: { clinica: Clinica; locale: Locale }) {
  const [t, nav] = await Promise.all([
    getTranslations({ locale, namespace: "chrome" }),
    getTranslations({ locale, namespace: "nav" }),
  ]);
  const footerByline = t("footerByline");
  const year = new Date().getFullYear();

  const navLinks: ChromeNavItem[] = headerNavPages().map((page) => ({
    key: page.key,
    href: page.paths.pt,
    label: nav(page.key),
  }));

  return (
    <footer className="border-rule border-t px-6 py-16 sm:px-10 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col gap-12 sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <Link
              href="/"
              className="display-italic text-foreground hover:text-terracotta inline-block text-2xl no-underline transition-colors"
            >
              {clinica.fullName}
            </Link>
            <p className="marginalia mt-2">{footerByline}</p>
          </div>

          <nav aria-label="Rodapé">
            <ul className="display flex flex-col gap-2 text-[0.98rem] sm:items-end">
              {navLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="text-foreground hover:text-terracotta no-underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/perguntas"
                  className="text-foreground hover:text-terracotta no-underline transition-colors"
                >
                  Perguntas frequentes
                </Link>
              </li>
              <li>
                <Link
                  href="/privacidade"
                  className="text-foreground hover:text-terracotta no-underline transition-colors"
                >
                  Privacidade
                </Link>
              </li>
              {clinica.instagramUrl && (
                <li>
                  <a
                    href={clinica.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="display-italic text-foreground hover:text-terracotta no-underline transition-colors"
                  >
                    Instagram
                  </a>
                </li>
              )}
              <li>
                <a
                  href={clinica.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="display-italic text-foreground hover:text-terracotta no-underline transition-colors"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="border-rule mt-12 flex flex-col gap-3 border-t pt-8 text-[0.85rem] sm:flex-row sm:items-baseline sm:justify-between">
          <p className="text-quill">
            © {year} {clinica.fullName}. Todos os direitos reservados.
          </p>
          <FooterCosmosRestore />
        </div>
      </div>
    </footer>
  );
}
