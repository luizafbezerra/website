"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { Clinica } from "@/domain/clinica/Clinica";
import { whatsappUrlFromPhone } from "@/domain/clinica/whatsappUrlFromPhone";
import { Link } from "@/i18n/navigation";
import { WhatsAppGlyph } from "@/view/general/WhatsAppGlyph";
import type { ChromeNavItem } from "./ChromeNavItem";
import { LanguageToggle } from "./LanguageToggle";

/**
 * The header's small-screen face: the same registry pages, the same PT·EN
 * toggle, the same terminal WhatsApp item, in a drawer.
 *
 * The overlay is a plain `position: fixed` child now that `.sticky-header`
 * carries no `transform`/`will-change` — those properties used to make the
 * header the containing block for anything fixed inside it, which is why this
 * component previously portaled itself to `<body>`.
 */
export function HeaderMobileNav({
  clinica,
  navItems,
}: {
  clinica: Clinica;
  navItems: ChromeNavItem[];
}) {
  const t = useTranslations("chrome");
  const [open, setOpen] = useState<boolean>(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const dialogId = useId();

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key === "Tab" && drawerRef.current) {
        const focusables = drawerRef.current.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled])",
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKey);
    // Focus the round close button (consistent with the icon-button focus
    // vocabulary) rather than the first nav link — auto-focusing a text link
    // stamped a boxed outline that read as off-brand on the manuscript page.
    closeButtonRef.current?.focus();

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      // Hand the keyboard back to the button that opened the drawer. Letting
      // focus fall to `<body>` instead — which is what closing did before —
      // makes a keyboard visitor re-tab the whole document to get anywhere
      // (WCAG 2.4.3), and it is silent: nothing on screen says it happened.
      triggerRef.current?.focus({ preventScroll: true });
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls={dialogId}
        aria-label={t("nav.open")}
        className="text-foreground hover:text-terracotta focus-visible:ring-terracotta focus-visible:ring-offset-parchment inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 lg:hidden"
      >
        <span aria-hidden="true" className="flex h-4 w-5 flex-col justify-between">
          <span className="bg-current block h-px w-full" />
          <span className="bg-current block h-px w-full" />
          <span className="bg-current block h-px w-full" />
        </span>
      </button>

      {open && (
        <div
          id={dialogId}
          className="fixed inset-0 z-40 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <button
            type="button"
            aria-label={t("nav.close")}
            onClick={() => setOpen(false)}
            className="bg-ink/30 absolute inset-0 cursor-default"
            tabIndex={-1}
          />
          <div
            ref={drawerRef}
            className="bg-parchment border-rule-soft absolute inset-y-0 right-0 flex h-full w-[min(20rem,86vw)] flex-col border-l"
          >
            <div className="flex items-center justify-between px-7 pt-7 pb-4">
              <span id={titleId} className="tracked">
                {t("nav.title")}
              </span>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t("nav.close")}
                className="text-foreground hover:text-terracotta focus-visible:ring-terracotta focus-visible:ring-offset-parchment inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              >
                <span aria-hidden="true" className="display text-2xl leading-none">
                  ×
                </span>
              </button>
            </div>

            <nav aria-label={t("nav.primary")} className="px-7 pt-2 pb-6">
              <ul className="flex flex-col gap-5">
                {navItems.map((item) => (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="display-italic text-foreground hover:text-terracotta text-xl no-underline transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Quiet reassurance line — names the practice and its reach,
                and gives the drawer's mid-section content so it doesn't read
                as a half-empty panel. */}
            <p className="marginalia px-7 pt-1 pb-2">{clinica.positioning}</p>

            <div className="border-rule-soft mt-auto flex flex-col gap-4 border-t px-7 py-6">
              <LanguageToggle className="mb-1" />
              <a
                href={whatsappUrlFromPhone(clinica.whatsappE164)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="display-italic text-foreground decoration-terracotta hover:text-terracotta inline-flex items-center gap-2 text-lg underline decoration-1 underline-offset-[0.3em] transition-colors"
                aria-label={t("whatsapp.aria", { phone: clinica.whatsappDisplay })}
              >
                <WhatsAppGlyph className="text-terracotta h-[1.1em] w-[1.1em] -translate-y-px" />
                <span>WhatsApp</span>
              </a>
              <a
                href={clinica.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="display-italic text-foreground hover:text-terracotta inline-flex items-baseline gap-2 no-underline transition-colors"
              >
                <span>Instagram</span>
                <span className="marginalia text-quill">{clinica.instagramHandle}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
