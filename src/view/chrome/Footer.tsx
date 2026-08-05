import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { Clinica } from "@/domain/clinica/Clinica";
import type { NavLink } from "@/domain/site/NavLink";
import { FooterCosmosRestore } from "./FooterCosmosRestore";

export async function Footer({ clinica, navLinks }: { clinica: Clinica; navLinks: NavLink[] }) {
  const t = await getTranslations("chrome");
  const footerByline = t("footerByline");
  const year = new Date().getFullYear();

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
                <li key={link.href}>
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
