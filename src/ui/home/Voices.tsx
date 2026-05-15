import { Luiza } from "@/core";
import { PaintedAsset } from "./PaintedAsset";

export function Voices() {
  if (Luiza.testimonials.length === 0) return null;

  return (
    <section aria-labelledby="voices-heading" className="px-6 py-28 sm:px-10 sm:py-36 lg:py-40">
      <div className="mx-auto max-w-3xl">
        <header className="mb-16 text-center">
          <p className="tracked mb-5">Vozes do consultório</p>
          <h2
            id="voices-heading"
            className="display-italic text-foreground text-balance text-[clamp(1.7rem,3vw,2.3rem)] leading-[1.16]"
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

        <div aria-hidden="true" className="mt-24 hidden justify-center sm:flex">
          <PaintedAsset
            src="squared-mandala"
            width={520}
            height={520}
            sizes="20rem"
            className="opacity-80"
            imgClassName="vignette w-full max-w-[20rem]"
          />
        </div>
      </div>
    </section>
  );
}
