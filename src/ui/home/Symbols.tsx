import { Luiza } from "@/core";
import { PaintedAsset } from "./PaintedAsset";

export function Symbols() {
  return (
    <section
      id="simbolos"
      aria-labelledby="symbols-heading"
      className="relative px-6 py-28 sm:px-10 sm:py-36 lg:py-44"
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <span className="bg-terracotta/70 h-px w-24" aria-hidden="true" />

        <PaintedAsset
          src="quaternity"
          width={896}
          height={896}
          sizes="(min-width: 768px) 28rem, 70vw"
          className="mt-14 w-[min(28rem,70vw)]"
        />

        <h2
          id="symbols-heading"
          className="display text-foreground mt-12 text-balance text-[clamp(1.7rem,3.2vw,2.4rem)] leading-[1.18] tracking-[-0.006em]"
        >
          Símbolos no <span className="display-italic text-terracotta-deep">Instagram</span>
        </h2>

        {/* TODO: rewrite this short paragraph with Luiza's voice */}
        <p className="body-italic text-ink mt-7 max-w-[52ch] text-[1.06rem] leading-[1.7]">
          Luiza pinta os símbolos que aparecem na análise. Cada peça é um trabalho com os
          arquétipos. Acompanhar os símbolos é uma forma de continuar perto.
        </p>

        <a
          href={Luiza.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Veja os símbolos de Luiza no Instagram, abre em nova aba"
          className="display-italic text-foreground decoration-terracotta hover:text-terracotta focus-visible:ring-terracotta mt-10 inline-flex items-baseline gap-3 text-[1.1rem] underline decoration-1 underline-offset-[0.28em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-parchment"
        >
          <span>{Luiza.instagramHandle}</span>
          <span aria-hidden="true" className="text-terracotta">
            →
          </span>
        </a>
      </div>
    </section>
  );
}
