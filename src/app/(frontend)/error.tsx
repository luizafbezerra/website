"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Luiza } from "@/core";

// Route-level error boundary. Renders inside the root layout (html/body/fonts +
// globals.css), so the manuscript utilities are available. Kept calm and brief
// — an apology, a retry, and a way to reach Luiza — never a stack trace.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const linkClass =
    "display-italic text-foreground decoration-terracotta hover:text-terracotta inline-flex text-[1.08rem] underline decoration-1 underline-offset-[0.22em] transition-colors";

  return (
    <main id="main" className="flex min-h-screen items-center px-6 py-32 sm:px-10 sm:py-44">
      <div className="mx-auto max-w-2xl text-center sm:text-left">
        <p className="tracked mb-6">Algo saiu do lugar</p>
        <h1 className="display text-foreground text-balance text-[clamp(2rem,4.4vw,3rem)] leading-[1.12] tracking-[-0.01em]">
          Um <span className="display-italic text-terracotta-deep">imprevisto</span> aconteceu.
        </h1>
        <p className="body-prose text-ink mt-8 max-w-[52ch] text-[1.085rem] leading-[1.74]">
          Não foi possível carregar esta página agora. Tente novamente em instantes; se o problema
          continuar, me escreva pelo WhatsApp e eu dou um jeito.
        </p>

        <div className="mt-12 flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-10">
          <button
            type="button"
            onClick={() => reset()}
            className="bg-terracotta-deep hover:bg-foreground inline-flex items-center gap-3 px-6 py-3 text-parchment no-underline transition-colors"
          >
            <span className="display-italic text-[1.05rem]">Tentar novamente</span>
            <span aria-hidden="true">↺</span>
          </button>
          <Link href="/" className={linkClass}>
            Voltar ao início
          </Link>
          <a
            href={Luiza.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            Conversar pelo WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}
