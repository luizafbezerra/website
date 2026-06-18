import { SECTION_ACCENT } from "@/core/accentHeading";
import type { Home } from "@/core/home";
import { AccentHeading } from "./AccentHeading";
import { Ornament } from "./Ornament";
import { PaintedAsset } from "./PaintedAsset";
import { RichTextProse } from "./RichTextProse";

export function Pillars({ content }: { content: Home["pillars"] }) {
  return (
    <section
      id="abordagem"
      aria-labelledby="approach-heading"
      className="px-6 py-28 sm:px-10 sm:py-36 lg:py-40"
    >
      <div className="mx-auto max-w-3xl lg:grid lg:max-w-5xl lg:grid-cols-[minmax(0,40rem)_1fr] lg:gap-x-16 xl:gap-x-24">
        <div className="lg:col-start-1">
          <header className="mb-16 sm:mb-20">
            {content.eyebrow && (
              <p className="tracked mb-5 text-center sm:text-left">{content.eyebrow}</p>
            )}
            <h2
              id="approach-heading"
              className="display text-foreground text-balance text-center text-[clamp(1.95rem,3.8vw,2.75rem)] leading-[1.13] tracking-[-0.008em] sm:text-left"
            >
              <AccentHeading heading={content.heading} accent={SECTION_ACCENT.pillars} />
            </h2>

            <RichTextProse
              data={content.intro}
              className="body-prose text-ink mt-10 max-w-[60ch] text-[1.085rem] leading-[1.74]"
            />
          </header>

          <Ornament variant="trinity" className="mb-20 sm:mb-24" />

          <div className="mb-14 sm:mb-20">
            <p className="display-italic text-quill max-w-[58ch] text-[1.02rem] leading-[1.7]">
              {content.note}
            </p>
          </div>

          <ol className="space-y-24 sm:space-y-28">
            {content.items.map((pillar) => (
              <li key={pillar.numeral} className="group">
                <article className="relative">
                  <span
                    aria-hidden="true"
                    className="display-italic text-cobalt float-left mr-3 -mt-2 -ml-1 select-none text-[clamp(4rem,8vw,7rem)] leading-[0.82] tracking-[-0.02em] sm:mr-5 sm:-ml-2"
                  >
                    {pillar.numeral}
                  </span>
                  <h3 className="display text-foreground text-[clamp(1.45rem,2.4vw,1.85rem)] leading-[1.18] tracking-[-0.005em]">
                    {pillar.title}
                  </h3>
                  <p className="text-ink mt-5 max-w-[58ch] text-[1.06rem] leading-[1.74]">
                    {pillar.paragraph}
                  </p>
                </article>
              </li>
            ))}
          </ol>
        </div>

        {/* The wide outer margin on large screens carries a painted plate
            rather than empty parchment — symbol-as-content, the way the About
            mandala anchors its row. Hidden on mobile, where there is no void. */}
        <aside className="hidden lg:col-start-2 lg:block">
          <div className="lg:sticky lg:top-32">
            <PaintedAsset
              src="squared-mandala"
              width={520}
              height={520}
              sizes="(min-width: 1024px) 16rem, 0px"
              className="w-full max-w-[16rem]"
            />
            <p className="marginalia mt-5 max-w-[16rem] text-[0.86rem] leading-[1.5]">
              Uma imagem de centramento, das que reaparecem quando algo interno procura ordem.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
