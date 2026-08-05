import type { Clinica } from "@/domain/clinica/Clinica";
import { pickJungPassage } from "@/domain/clinica/pickJungPassage";
import type { Inicio } from "@/domain/inicio/Inicio";
import { JungPassage } from "@/view/general/JungPassage";
import { PaintedAsset } from "@/view/general/PaintedAsset";
import { RichTextProse } from "@/view/general/RichTextProse";
import { PageSection } from "@/view/general/PageSection";
import { SectionHeading } from "@/view/general/SectionHeading";
import { SectionLink } from "@/view/general/SectionLink";

/**
 * Section 5 of CONCEPT §6 — the approach in digest: the symptom is a call, not
 * only a defect. This is where Jung's voice enters the page in the site's own
 * typographic treatment rather than burned into an image, which is the whole
 * translation CONCEPT §5 asks for.
 *
 * The spread is the hero's, mirrored in weight: the reading column keeps its
 * measure and the illumination sits beside it in the margin column. The
 * serpent-flame is chosen by amplificação — the thing that insists, rising —
 * so the painting amplifies the paragraph it faces instead of decorating it.
 *
 * The passage rotates from the pool she grows in A Clínica, picked by the clock
 * rather than by the visitor (CONCEPT §11: symbols index content, never the
 * reader). While the pool is empty `JungPassage` renders nothing — curating a
 * quotation in her name would be exactly the authorship breach §11 forbids.
 */
export function OSintoma({
  clinica,
  content,
  at,
}: {
  clinica: Clinica;
  content: Inicio["oSintoma"];
  /** The moment the page is rendered — passed in so the pick stays a pure function of the clock. */
  at: Date;
}) {
  return (
    <PageSection labelledBy="o-sintoma-heading" width="wide">
      <div className="grid grid-cols-1 gap-x-16 gap-y-12 lg:grid-cols-[1.6fr_1fr]">
        <div className="lg:col-start-1">
          <SectionHeading id="o-sintoma-heading">{content.heading}</SectionHeading>

          <RichTextProse data={content.body} className="body-prose text-ink mt-8 max-w-[62ch]" />

          {/* The link carries its own interval: the passage below it is optional
              (an empty pool renders nothing), and without a margin of its own the
              link sat directly on the prose whenever the passage was absent. */}
          <SectionLink href="/analise" className="mt-10">
            {content.linkLabel}
          </SectionLink>
        </div>

        <PaintedAsset
          src="serpent-flame"
          width={1125}
          height={1498}
          sizes="(min-width: 1024px) 17rem, 13rem"
          imgClassName="vignette"
          className="w-[min(13rem,60%)] lg:col-start-2 lg:w-full lg:max-w-[17rem] lg:justify-self-center lg:self-center"
        />
      </div>

      <JungPassage passage={pickJungPassage(clinica.jungPassages, at)} />
    </PageSection>
  );
}
