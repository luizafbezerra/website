"use client";

import { type CSSProperties, useEffect, useId, useRef, useState } from "react";
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
 * The drawer is a native `<dialog>` opened with `showModal()` (PRODUCT.md,
 * Accessibility): the top layer, the focus trap, Escape handling and focus
 * return to the trigger all come from the platform — the manual keydown trap
 * this component used to carry is gone with nothing lost. The open/close
 * choreography lives in globals.css (`.nav-drawer`): `@starting-style` +
 * `allow-discrete` transitions that older browsers simply skip, snapping the
 * drawer open and closed but losing nothing functional.
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
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const dialogId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      // Browsers disagree on where `showModal()` lands focus when nothing
      // carries `autofocus` (an attribute React swallows anyway). Land on the
      // round close button deliberately — consistent with the icon-button
      // focus vocabulary; auto-focusing a text link stamped a boxed outline
      // that read as off-brand on the manuscript page.
      closeButtonRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Light dismiss for browsers without `closedby` (Safari). A click that
  // reaches the dialog element itself came from the backdrop — unless it fell
  // inside the panel's own bounds (the gaps between its children), which the
  // bounding-box check keeps open.
  const onDialogClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current;
    if (!dialog || event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    const insidePanel =
      rect.top <= event.clientY &&
      event.clientY <= rect.bottom &&
      rect.left <= event.clientX &&
      event.clientX <= rect.right;
    if (!insidePanel) setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls={dialogId}
        aria-label={t("nav.open")}
        className="nav-trigger text-foreground hover:text-terracotta focus-visible:ring-terracotta focus-visible:ring-offset-parchment inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 lg:hidden"
      >
        {/* Three hand-set ink rules; the middle one stops short until hover
            draws it out, and opening crosses the outer two into an ×. */}
        <span aria-hidden="true" className="nav-trigger-glyph">
          <span />
          <span />
          <span />
        </span>
      </button>

      <dialog
        ref={dialogRef}
        id={dialogId}
        aria-labelledby={titleId}
        closedby="any"
        onClose={() => setOpen(false)}
        onClick={onDialogClick}
        className="nav-drawer"
      >
        {/* The drawn margin: the panel's left hairline, ruled top-to-bottom
            as the panel arrives (globals.css). */}
        <span aria-hidden="true" className="nav-drawer-rule" />

        <div
          className="nav-drawer-settle flex items-center justify-between px-7 pt-7 pb-4"
          style={{ "--drawer-i": 0 } as CSSProperties}
        >
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
            {/* The same two crossed ink rules the trigger morphs into. */}
            <span aria-hidden="true" className="nav-close-glyph">
              <span />
              <span />
            </span>
          </button>
        </div>

        <nav aria-label={t("nav.primary")} className="px-7 pt-2 pb-6">
          <ul className="flex flex-col gap-5">
            {navItems.map((item, index) => (
              <li
                key={item.key}
                className="nav-drawer-settle"
                style={{ "--drawer-i": index + 1 } as CSSProperties}
              >
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
        <p
          className="marginalia nav-drawer-settle px-7 pt-1 pb-2"
          style={{ "--drawer-i": navItems.length + 1 } as CSSProperties}
        >
          {clinica.positioning}
        </p>

        <div
          className="border-rule-soft nav-drawer-settle mt-auto flex flex-col gap-4 border-t px-7 py-6"
          style={{ "--drawer-i": navItems.length + 2 } as CSSProperties}
        >
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
      </dialog>
    </>
  );
}
