import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Analise, DreamParallel } from "@/domain/analise/Analise";
import { MediaPlaceholder } from "@/view/general/MediaPlaceholder";
import { PageSection } from "@/view/general/PageSection";
import { SectionHeading } from "@/view/general/SectionHeading";

const PARALLEL_ASPECT = "4 / 3";

/**
 * Sonho ampliado (CONCEPT §9.3, REQ-008) — her method demonstrated rather than
 * described: one dream motif, and the parallels set beside it.
 *
 * **It is deliberately not a second wow.** DESIGN allows one set-piece per page
 * and the wheel is this page's; so this is a still composition — no scroll
 * pinning, no reveal, no interaction of any kind. What makes it work is the
 * layout: the dream on the left, its parallels gathered on the right, the way
 * amplificação actually looks on a table.
 *
 * **What ships, and what waits.** The intro states what amplificação is, which is
 * a fact about her craft CONCEPT §5 already fixes. The motif is quoted speech —
 * the words a dreamer would use, from CONCEPT §9.3's own example — not prose in
 * her name, and it carries no attribution of any kind: a dream presented as
 * someone's real dream would be a confidentiality problem, and this one is an
 * example of a motif, not a case. Each parallel is her curation ("her words
 * required"), so a parallel renders only once she has written its line, chosen its
 * painting, or at least named the work; three labeled empty frames beside a dream
 * would be scaffolding a visitor has to look at.
 *
 * The whole section is gated on the motif: clearing that one field in the admin
 * removes the section, which is her way out if she would rather not demonstrate
 * the method at all. The gate lives here rather than in the route, next to the
 * `JungPassage` and `Vozes` precedent — a section that can legitimately be absent
 * owns the condition for its own absence.
 */
export function SonhoAmpliado({ content }: { content: Analise["sonhoAmpliado"] }) {
  if (!content.motif) return null;

  return (
    <PageSection id="sonho-ampliado" labelledBy="sonho-ampliado-heading" width="wide">
      <SectionHeading id="sonho-ampliado-heading">{content.heading}</SectionHeading>

      {content.intro && <p className="body-prose text-ink mt-8 max-w-[62ch]">{content.intro}</p>}

      <div className="mt-14 grid gap-12 lg:mt-16 lg:grid-cols-[minmax(0,24rem)_1fr] lg:gap-16">
        <blockquote className="display-italic text-ink border-terracotta/40 border-t pt-8 text-[clamp(1.45rem,2.4vw,1.85rem)] leading-[1.35]">
          {content.motif}
        </blockquote>

        {content.parallels.length > 0 && (
          <ul className="space-y-12">
            {/* Keyed by position as well as label: she names the parallels
                herself, so two can legitimately carry the same word. */}
            {content.parallels.map((parallel, index) => (
              <li key={`${index}-${parallel.label}`}>
                <Parallel parallel={parallel} />
              </li>
            ))}
          </ul>
        )}
      </div>

      {content.closingLine && (
        <p className="display-italic text-ink-soft mt-16 max-w-[46ch] text-[clamp(1.45rem,2.4vw,1.85rem)] leading-[1.3]">
          {content.closingLine}
        </p>
      )}
    </PageSection>
  );
}

/**
 * One parallel: what kind it is, then the parallel itself.
 *
 * Not a `Plate`. A plate is one painting given a full editorial moment at
 * section scale; a parallel is a detail at column scale, sitting in a set of
 * three — reusing `Plate` here would put a 46rem figure inside a 24rem column and
 * make each parallel compete with the wheel. The gallery-label voice is the same,
 * because it is the same voice wherever a painting is credited.
 */
function Parallel({ parallel }: { parallel: DreamParallel }) {
  const t = useTranslations("analise.sonho");
  const { plate } = parallel;
  const hasLabel = Boolean(plate.painter);

  return (
    <figure className="m-0">
      <figcaption className="tracked-ink">{parallel.label}</figcaption>

      {/* A recorded provenance with no scan yet still reserves its frame (REQ-005). */}
      {plate.image ? (
        <Image
          src={plate.image.src}
          alt={plate.image.alt}
          width={plate.image.width}
          height={plate.image.height}
          sizes="(min-width: 1024px) 22rem, 92vw"
          className="mt-4 h-auto w-full max-w-[22rem] select-none"
        />
      ) : hasLabel ? (
        <MediaPlaceholder
          description={t("parallelPlaceholder")}
          aspectRatio={PARALLEL_ASPECT}
          className="mt-4 max-w-[22rem]"
        />
      ) : null}

      {parallel.text && <p className="body-prose text-ink mt-4 max-w-[48ch]">{parallel.text}</p>}

      {hasLabel && (
        <p className="marginalia mt-3">
          {plate.painter}
          {plate.workTitle && <span>, {plate.workTitle}</span>}
          {plate.year && <span>, {plate.year}</span>}
        </p>
      )}
    </figure>
  );
}
