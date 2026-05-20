"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { Luiza, Navigation } from "@/core";

export function HeaderMobileNav() {
  const [open, setOpen] = useState<boolean>(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
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
    firstLinkRef.current?.focus();

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
        className="text-foreground hover:text-terracotta focus-visible:ring-terracotta inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-parchment md:hidden"
      >
        <span aria-hidden="true" className="flex h-4 w-5 flex-col justify-between">
          <span className="bg-current block h-px w-full" />
          <span className="bg-current block h-px w-full" />
          <span className="bg-current block h-px w-full" />
        </span>
      </button>

      {open && (
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
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fechar navegação"
                className="text-foreground hover:text-terracotta focus-visible:ring-terracotta inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-parchment"
              >
                <span aria-hidden="true" className="display text-[1.4rem] leading-none">
                  ×
                </span>
              </button>
            </div>

            <nav aria-label="Principal" className="px-7 pt-2 pb-6">
              <ul className="flex flex-col gap-5">
                {Navigation.links.map((link, idx) => (
                  <li key={link.href}>
                    <Link
                      ref={idx === 0 ? firstLinkRef : undefined}
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

            <div className="mt-auto border-rule-soft flex flex-col gap-4 border-t px-7 py-6">
              <a
                href={Luiza.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="display-italic text-foreground decoration-terracotta hover:text-terracotta inline-flex items-baseline gap-2 text-[1.05rem] underline decoration-1 underline-offset-[0.3em] transition-colors"
                aria-label={`Iniciar conversa pelo WhatsApp ${Luiza.phoneDisplay}`}
              >
                <span>WhatsApp</span>
                <span aria-hidden="true" className="text-terracotta">
                  →
                </span>
              </a>
              <a
                href={Luiza.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="display-italic text-foreground hover:text-terracotta inline-flex items-baseline gap-2 text-[1rem] no-underline transition-colors"
                aria-label={`Símbolos no Instagram, ${Luiza.instagramHandle}, abre em nova aba`}
              >
                <span>Instagram</span>
                <span className="marginalia text-quill text-[0.82rem]">
                  {Luiza.instagramHandle}
                </span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
