import { Luiza } from "@/core";
import { PaintedAsset } from "./PaintedAsset";

// Auto-hides when no testimonials exist. The brief calls Voices the trust
// anchor of the page — shipping an empty "Em preparação" placeholder reads as
// apology, which is worse than the section being absent. Once testimonials are
// collected (with consent + initials, per luiza.ts TODO), the section returns.
export function Voices() {
  if (Luiza.testimonials.length === 0) return null;

  return (
    <section aria-labelledby="voices-heading" className="px-6 py-20 sm:px-10 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-3xl">
        <header className="mb-16 text-center">
          <p className="tracked mb-5">Em primeira pessoa</p>
          <h2
            id="voices-heading"
            className="display text-foreground text-balance text-[clamp(1.7rem,3vw,2.3rem)] leading-[1.16]"
          >
            Pacientes contam
          </h2>
        </header>

        <ul className="space-y-28 sm:space-y-32">
          {Luiza.testimonials.map((quote) => (
            <li key={quote.attribution}>
              <figure className="mx-auto max-w-[58ch]">
                <blockquote className="display-italic text-ink text-balance text-center text-[clamp(1.25rem,2.1vw,1.55rem)] leading-[1.45]">
                  {quote.body}
                </blockquote>
                <figcaption className="marginalia mt-8 text-center">
                  — {quote.attribution}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <div aria-hidden="true" className="mt-24 flex justify-center">
          <PaintedAsset
            src="serpent-flame"
            width={520}
            height={693}
            sizes="16rem"
            className="opacity-80"
            imgClassName="w-full max-w-[16rem]"
          />
        </div>
      </div>
    </section>
  );
}
