import type { Clinica } from "@/domain/clinica/Clinica";
import { pickJungPassage } from "@/domain/clinica/pickJungPassage";
import type { Inicio } from "@/domain/inicio/Inicio";
import { JungPassage } from "@/view/general/JungPassage";
import { RichTextProse } from "@/view/general/RichTextProse";
import { PageSection } from "./PageSection";
import { SectionHeading } from "./SectionHeading";
import { SectionLink } from "./SectionLink";

/**
 * Section 5 of CONCEPT §6 — the approach in digest: the symptom is a call, not
 * only a defect. This is where Jung's voice enters the page in the site's own
 * typographic treatment rather than burned into an image, which is the whole
 * translation CONCEPT §5 asks for.
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
    <PageSection labelledBy="o-sintoma-heading">
      <SectionHeading id="o-sintoma-heading">{content.heading}</SectionHeading>

      <RichTextProse data={content.body} className="body-prose text-ink mt-8 max-w-[62ch]" />

      <JungPassage passage={pickJungPassage(clinica.jungPassages, at)} />

      <SectionLink href="/analise">{content.linkLabel}</SectionLink>
    </PageSection>
  );
}
