import { getTranslations } from "next-intl/server";
import type { Clinica } from "@/domain/clinica/Clinica";
import { whatsappUrlFromPhone } from "@/domain/clinica/whatsappUrlFromPhone";
import type { Locale } from "@/domain/site/Locale";
import { FOOTER_COLUMNS, type FooterColumn, footerColumnPages } from "@/domain/site/pages";
import { Link } from "@/i18n/navigation";
import { AvailabilityLine } from "@/view/general/AvailabilityLine";
import { CredentialLine } from "@/view/general/CredentialLine";
import type { ChromeNavItem } from "./ChromeNavItem";
import { FooterCosmosRestore } from "./FooterCosmosRestore";
import { MoonColophon } from "./MoonColophon";

/**
 * The footer of CONCEPT §6: three columns — A clínica (the pages) · Começar
 * (how to reach her) · O mundo (where else she is) — over the colophon band.
 *
 * The pages in each column come from the registry's own `footerColumn` field, so
 * the footer and the header cannot disagree about what the site contains, and a
 * page added in Phase 6 appears here by existing.
 *
 * The colophon states the binding once, canonically: Símbolos do Self is the
 * online clinic of Luiza Fernandes Bezerra, psicóloga, CRP (§8.7). Humans,
 * Google and assistants all read the same sentence. The moon sits at the far
 * end of that band, as far from the WhatsApp column as the layout allows.
 */

const LINK_CLASS =
  "text-foreground hover:text-terracotta decoration-terracotta/30 hover:decoration-terracotta no-underline transition-colors hover:underline hover:decoration-1 hover:underline-offset-[0.28em]";

export async function Footer({ clinica, locale }: { clinica: Clinica; locale: Locale }) {
  const [chrome, nav] = await Promise.all([
    getTranslations({ locale, namespace: "chrome" }),
    getTranslations({ locale, namespace: "nav" }),
  ]);

  const columnPages = (column: FooterColumn): ChromeNavItem[] =>
    footerColumnPages(column).map((page) => ({
      key: page.key,
      href: page.paths.pt,
      label: nav(page.key),
    }));

  const renderedAt = new Date();

  return (
    <footer className="border-rule border-t px-6 py-16 sm:px-10 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {FOOTER_COLUMNS.map((column) => (
            <nav key={column} aria-label={chrome(`footer.${column}`)}>
              <h2 className="tracked mb-5">{chrome(`footer.${column}`)}</h2>
              <ul className="flex flex-col gap-3">
                {columnPages(column).map((page) => (
                  <li key={page.key}>
                    <Link href={page.href} className={LINK_CLASS}>
                      {page.label}
                    </Link>
                  </li>
                ))}

                {/* Começar carries the ways to reach her, next to the pages
                    that prepare the visitor to do it. */}
                {column === "comecar" && (
                  <>
                    <li>
                      <a
                        href={whatsappUrlFromPhone(clinica.whatsappE164)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={LINK_CLASS}
                        aria-label={chrome("whatsapp.aria", { phone: clinica.whatsappDisplay })}
                      >
                        WhatsApp
                      </a>
                    </li>
                    {clinica.email && (
                      <li>
                        <a href={`mailto:${clinica.email}`} className={LINK_CLASS}>
                          {chrome("footer.email")}
                        </a>
                      </li>
                    )}
                    <li className="mt-2">
                      <AvailabilityLine clinica={clinica} />
                    </li>
                  </>
                )}

                {/* O mundo: where else she is, and how far the practice goes. */}
                {column === "mundo" && (
                  <>
                    {clinica.instagramUrl && (
                      <li>
                        <a
                          href={clinica.instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={LINK_CLASS}
                        >
                          Instagram <span className="marginalia">{clinica.instagramHandle}</span>
                        </a>
                      </li>
                    )}
                    <li className="marginalia">{chrome("footer.reach")}</li>
                  </>
                )}
              </ul>
            </nav>
          ))}
        </div>

        {/* The colophon band. */}
        <div className="border-rule mt-16 border-t pt-8">
          <p className="text-ink-soft text-sm">
            {chrome("colophon.binding", { clinic: clinica.clinicName, name: clinica.fullName })}
          </p>
          <CredentialLine clinica={clinica} className="mt-3 justify-start" />

          <div className="text-quill mt-8 flex flex-col gap-4 text-sm sm:flex-row sm:items-center sm:justify-between">
            <span>
              {chrome("colophon.rights", {
                year: renderedAt.getFullYear(),
                name: clinica.fullName,
              })}
              {" · "}
              {chrome("colophon.plateCredits")}
            </span>
            <MoonColophon at={renderedAt} />
          </div>

          <FooterCosmosRestore className="mt-6 inline-block" />
        </div>
      </div>
    </footer>
  );
}
