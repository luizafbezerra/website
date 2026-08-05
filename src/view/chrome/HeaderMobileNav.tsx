"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Clinica } from "@/domain/clinica/Clinica";
import type { NavLink } from "@/domain/site/NavLink";
import { WhatsAppGlyph } from "@/view/general/WhatsAppGlyph";

export function HeaderMobileNav({ clinica, navLinks }: { clinica: Clinica; navLinks: NavLink[] }) {
  const [open, setOpen] = useState<boolean>(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

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
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls={titleId}
        aria-label="Abrir navegação"
        className="text-foreground hover:text-terracotta focus-visible:ring-terracotta inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-parchment md:hidden"
      >
        <span aria-hidden="true" className="flex h-4 w-5 flex-col justify-between">
          <span className="bg-current block h-px w-full" />
          <span className="bg-current block h-px w-full" />
          <span className="bg-current block h-px w-full" />
        </span>
      </button>

      {/* Portaled to <body> so it escapes the StickyHeaderShell ancestor,
          whose `transform`/`will-change` would otherwise become the containing
          block for this `position: fixed` overlay and collapse it to the
          header's height. */}
      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-40 md:hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
          >
            <button
              type="button"
              aria-label="Fechar navegação"
              onClick={() => setOpen(false)}
              className="bg-ink/30 absolute inset-0 cursor-default"
              tabIndex={-1}
            />
            <div
              ref={drawerRef}
              className="bg-parchment border-rule-soft absolute inset-y-0 right-0 flex h-full w-[min(20rem,86vw)] flex-col border-l shadow-[-12px_0_40px_-24px_rgba(0,0,0,0.18)]"
            >
              <div className="flex items-center justify-between px-7 pt-7 pb-4">
                <span id={titleId} className="tracked">
                  Navegação
                </span>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Fechar navegação"
                  className="text-foreground hover:text-terracotta focus-visible:ring-terracotta inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-parchment"
                >
                  <span aria-hidden="true" className="display text-[1.4rem] leading-none">
                    ×
                  </span>
                </button>
              </div>

              <nav aria-label="Principal" className="px-7 pt-2 pb-6">
                <ul className="flex flex-col gap-5">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="display-italic text-foreground hover:text-terracotta text-[1.2rem] no-underline transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Quiet reassurance line — names the practice and its reach,
                  and gives the drawer's mid-section content so it doesn't read
                  as a half-empty panel. */}
              <p className="marginalia px-7 pt-1 pb-2 text-[0.92rem] leading-[1.5]">
                {clinica.positioning}
              </p>

              <div className="mt-auto border-rule-soft flex flex-col gap-4 border-t px-7 py-6">
                <a
                  href={clinica.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="display-italic text-foreground decoration-terracotta hover:text-terracotta inline-flex items-center gap-2 text-[1.05rem] underline decoration-1 underline-offset-[0.3em] transition-colors"
                  aria-label={`Iniciar conversa pelo WhatsApp ${clinica.whatsappDisplay}`}
                >
                  <WhatsAppGlyph className="text-terracotta h-[1.1em] w-[1.1em] -translate-y-px" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={clinica.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="display-italic text-foreground hover:text-terracotta inline-flex items-baseline gap-2 text-[1rem] no-underline transition-colors"
                  aria-label={`Símbolos no Instagram, ${clinica.instagramHandle}, abre em nova aba`}
                >
                  <span>Instagram</span>
                  <span className="marginalia text-quill text-[0.82rem]">
                    {clinica.instagramHandle}
                  </span>
                </a>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
