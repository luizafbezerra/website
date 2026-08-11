import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Inicio } from "@/domain/inicio/Inicio";
import type { Sobre } from "@/domain/sobre/Sobre";
import { FormacaoList } from "@/view/general/FormacaoList";
import { RichTextProse } from "@/view/general/RichTextProse";
import { PageSection } from "@/view/general/PageSection";
import { SectionHeading } from "@/view/general/SectionHeading";
import { SectionLink } from "@/view/general/SectionLink";

/**
 * Section 6 of CONCEPT §6 — who receives you, and on what record.
 *
 * The bio is four lines and a hook; the academic record under it is the whole
 * thing, six rows, read from `/sobre`'s own field rather than copied here. This
 * section used to argue the opposite — that repeating the record here would
 * spend the reason to click through — and she overruled it: "na parte do meu
 * currículo, eu preferia que ficasse em evidência sem precisar clicar no link."
 * A reader deciding whether to write should not have to take a second page's
 * word for the credentials.
 *
 * Her `formacao.intro` stays behind on /sobre. It is the one editorial sentence
 * that section gets, and the rows here need no argument for being long — the
 * eyebrow says what they are and they say the rest.
 *
 * The mandala mark sits beside the bio at profile scale — the same circular
 * avatar the header carries, grown to the size a follower knows from the feed.
 * "Quem recebe você" next to the image 45K people already associate with her is
 * the recognition doing the introduction. It breathes at ±2% on a slow
 * six-second cycle (CONCEPT §9.11) — an ornament with a pulse, never labelled a
 * breathing exercise, no instructions, no timer — and holds still under
 * `prefers-reduced-motion`.
 *
 * A beat, not a movement: this opens the quick run of short passages (the
 * person, the reach, the process, the voices) that carries the reader from the
 * doors to the ask. Giving each of them the monumental interval made them read
 * as fragments; the tighter cadence makes them one sequence.
 */
export function SobreDigest({
  content,
  formacao,
}: {
  content: Inicio["sobreDigest"];
  formacao: Sobre["formacao"]["items"];
}) {
  const t = useTranslations("inicio.sobreDigest");

  return (
    <PageSection labelledBy="sobre-digest-heading" pace="beat">
      <div className="grid grid-cols-1 gap-x-12 gap-y-8 lg:grid-cols-[auto_1fr]">
        <span
          aria-hidden="true"
          className="mandala-respira border-terracotta/70 bg-parchment-deep relative block aspect-square w-20 shrink-0 overflow-hidden rounded-full border lg:mt-2 lg:w-28"
        >
          <Image
            src="/art/quaternity.jpg"
            alt=""
            width={400}
            height={400}
            sizes="(min-width: 1024px) 112px, 80px"
            className="h-full w-full scale-[1.18] object-cover object-center select-none"
          />
        </span>

        <div>
          <SectionHeading id="sobre-digest-heading">{content.heading}</SectionHeading>

          <RichTextProse data={content.body} className="body-prose text-ink mt-8 max-w-[62ch]" />

          {/* The world's voice, not a second heading: the band already owns
              "Quem recebe você", and a display-scale title here would split one
              introduction into two sections. An `h3` all the same — the record is
              a real part of the outline, and a screen reader should be able to
              jump to it. */}
          {formacao.length > 0 && (
            <>
              <h3 className="tracked mt-10">{t("formacaoLabel")}</h3>
              <FormacaoList items={formacao} className="border-rule-soft mt-4 border-t" />
            </>
          )}

          <SectionLink href="/sobre" className="mt-10">
            {content.linkLabel}
          </SectionLink>
        </div>
      </div>
    </PageSection>
  );
}
