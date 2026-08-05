import Image from "next/image";
import type { Inicio } from "@/domain/inicio/Inicio";
import { RichTextProse } from "@/view/general/RichTextProse";
import { PageSection } from "@/view/general/PageSection";
import { SectionHeading } from "@/view/general/SectionHeading";
import { SectionLink } from "@/view/general/SectionLink";

/**
 * Section 6 of CONCEPT §6 — four lines and the hook, enough to want to click
 * through to /sobre. Deliberately short: the full record, the formação and the
 * clinic's origin story belong to that page, and repeating them here would spend
 * the reason to go.
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
export function SobreDigest({ content }: { content: Inicio["sobreDigest"] }) {
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

          <SectionLink href="/sobre" className="mt-10">
            {content.linkLabel}
          </SectionLink>
        </div>
      </div>
    </PageSection>
  );
}
