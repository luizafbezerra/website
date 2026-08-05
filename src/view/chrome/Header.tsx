import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { Clinica } from "@/domain/clinica/Clinica";
import { whatsappUrlFromPhone } from "@/domain/clinica/whatsappUrlFromPhone";
import type { Locale } from "@/domain/site/Locale";
import { headerNavPages } from "@/domain/site/pages";
import { Link } from "@/i18n/navigation";
import { WhatsAppGlyph } from "@/view/general/WhatsAppGlyph";
import type { ChromeNavItem } from "./ChromeNavItem";
import { HeaderMobileNav } from "./HeaderMobileNav";
import { LanguageToggle } from "./LanguageToggle";

/**
 * The header of CONCEPT §6: the mark and the "por" lockup on the left, the four
 * nav pages, the PT·EN toggle, and WhatsApp as the visually distinct terminal
 * item. Sticky and never hiding — it does not slide away on scroll — and never a
 * floating bubble.
 *
 * Everything it lists comes from the page registry, so the header cannot
 * disagree with the footer, the sitemap or the hreflang set about which pages
 * exist. Perguntas and Internacional are deliberately absent: they belong in the
 * footer and wherever the doubt actually occurs.
 *
 * The WhatsApp item is distinguished by a hairline terracotta frame rather than
 * a solid block. It has to read as the terminal action (DESIGN, Navigation), but
 * a filled CTA riding a fixed header is a sticky CTA, which the site bans
 * outright — the solid terracotta block belongs in the flow of a page, at the
 * end of a thought.
 */

export async function Header({ clinica, locale }: { clinica: Clinica; locale: Locale }) {
  const [chrome, nav] = await Promise.all([
    getTranslations({ locale, namespace: "chrome" }),
    getTranslations({ locale, namespace: "nav" }),
  ]);

  const navItems: ChromeNavItem[] = headerNavPages().map((page) => ({
    key: page.key,
    href: page.paths.pt,
    label: nav(page.key),
  }));

  return (
    <div className="sticky-header">
      <header className="bg-parchment border-rule-soft border-b">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-4 sm:px-10 sm:py-5">
          <Link
            href="/"
            aria-label={chrome("homeAria", { name: clinica.clinicName })}
            className="group inline-flex shrink-0 items-center gap-3 no-underline sm:gap-4"
          >
            <span className="border-terracotta/70 bg-parchment-deep relative block aspect-square w-9 shrink-0 overflow-hidden rounded-full border transition-[box-shadow] duration-200 group-hover:[box-shadow:0_0_0_1px_var(--color-terracotta),0_0_16px_-2px_oklch(0.75_0.13_80/0.5)] sm:w-10">
              <Image
                src="/art/quaternity.jpg"
                alt=""
                width={400}
                height={400}
                sizes="(min-width: 640px) 40px, 36px"
                className="h-full w-full scale-[1.18] select-none object-cover object-center"
                priority
              />
            </span>
            {/* The "por" lockup (CONCEPT §8.6): the place in the world's
                small-caps voice, the person in hers, bound in one word. */}
            <span className="inline-flex flex-col leading-tight">
              <span className="tracked-ink">{clinica.clinicName}</span>
              <span className="marginalia mt-0.5">
                {chrome("lockupBy")}{" "}
                <span className="display-italic text-ink-soft">{clinica.fullName}</span>
              </span>
            </span>
          </Link>

          <nav aria-label={chrome("nav.primary")} className="ml-auto hidden lg:block">
            <ul className="flex items-baseline gap-7">
              {navItems.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="display text-foreground hover:text-terracotta text-base tracking-wide no-underline transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto hidden items-center gap-6 lg:ml-7 lg:flex">
            <LanguageToggle />
            <a
              href={whatsappUrlFromPhone(clinica.whatsappE164)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={chrome("whatsapp.aria", { phone: clinica.whatsappDisplay })}
              className="border-terracotta text-foreground hover:bg-terracotta-deep hover:text-parchment hover:border-terracotta-deep inline-flex items-center gap-2 border px-4 py-2 no-underline transition-colors"
            >
              <WhatsAppGlyph className="h-[1.1em] w-[1.1em] -translate-y-px" />
              <span className="display-italic">WhatsApp</span>
            </a>
          </div>

          <div className="ml-auto lg:hidden">
            <HeaderMobileNav clinica={clinica} navItems={navItems} />
          </div>
        </div>
      </header>
    </div>
  );
}
