import { SECTION_ACCENT } from "@/core/accentHeading";
import type { Home } from "@/core/home";
import type { Identity } from "@/core/identity";
import { AccentHeading } from "./AccentHeading";
import { PaintedAsset } from "./PaintedAsset";
import { RichTextProse } from "./RichTextProse";

export function About({ identity, content }: { identity: Identity; content: Home["about"] }) {
  return (
    <section
      id="sobre"
      aria-labelledby="about-heading"
      className="bg-parchment-deep relative px-6 py-28 sm:px-10 sm:py-36 lg:py-52"
    >
      <div className="mx-auto grid max-w-5xl gap-16 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <aside className="order-2 lg:order-1">
          <div className="lg:sticky lg:top-28">
            <PaintedAsset
              src="quaternity"
              width={520}
              height={520}
              sizes="(min-width: 1024px) 22rem, 18rem"
              className="mx-auto block w-[min(18rem,80%)] lg:w-full lg:max-w-[22rem]"
            />
            <p className="marginalia mt-6 mx-auto max-w-[22rem] text-center lg:text-left">
              <span className="display-italic text-ink-soft">Quaternidade.</span> Centro e quatro
              direções, uma das imagens que retornam ao longo de um caminho de individuação.
            </p>
          </div>
        </aside>

        <div className="order-1 lg:order-2">
          <h2
            id="about-heading"
            className="display text-foreground text-balance text-[clamp(1.9rem,3.6vw,2.7rem)] leading-[1.14] tracking-[-0.008em]"
          >
            <AccentHeading heading={content.heading} accent={SECTION_ACCENT.about} />
          </h2>

          <RichTextProse
            data={content.bio}
            className="body-prose text-ink mt-10 max-w-[60ch] text-[1.085rem] leading-[1.74]"
          />

          {/* Each row renders only when it has a real value, so clearing a
              field in the CMS (or an unset CRP) hides the row instead of
              leaving a dangling label. "Atendimento" is derived from the NAP
              and always present. */}
          <dl className="text-quill mt-12 grid grid-cols-1 gap-y-6 text-[0.98rem] leading-[1.55] sm:grid-cols-[10rem_1fr] sm:gap-x-8 sm:gap-y-5">
            {content.formacao && (
              <>
                <dt className="display text-quill text-[0.96rem]">Formação</dt>
                <dd className="text-foreground">{content.formacao}</dd>
              </>
            )}

            {identity.credential && (
              <>
                <dt className="display text-quill text-[0.96rem]">Registro</dt>
                <dd className="text-foreground">{identity.credential}</dd>
              </>
            )}

            <dt className="display text-quill text-[0.96rem]">Atendimento</dt>
            <dd className="text-foreground">
              Presencial em {identity.city} · online em todo o {identity.country}
            </dd>

            {content.idiomas && (
              <>
                <dt className="display text-quill text-[0.96rem]">Idiomas</dt>
                <dd className="text-foreground">{content.idiomas}</dd>
              </>
            )}
          </dl>
        </div>
      </div>
    </section>
  );
}
