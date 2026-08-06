import { useTranslations } from "next-intl";
import type { Analise } from "@/domain/analise/Analise";
import { PageSection } from "@/view/general/PageSection";
import { Plate } from "@/view/general/Plate";
import { RichTextProse } from "@/view/general/RichTextProse";
import { SectionHeading } from "@/view/general/SectionHeading";

const PLATE_ASPECT = "4 / 5";

/**
 * How the work happens — one section where three used to stand (2026-08
 * condensation): her five verbatim paragraphs are the spine, one line names the
 * symbolic material where three titled blocks paraphrased it, and A visão's
 * individuação note closes the argument.
 *
 * **The body is her own words, verbatim.** She rewrote it herself; it existed
 * only in the database until TASK-026 rescued it. Nothing here may reword, trim
 * or re-punctuate it, and the mapper refuses to let an emptied field delete it.
 * The drafted paraphrase that once opened this section is gone for the same
 * reason it was cringeworthy: it argued the point her text argues two screens
 * lower, in a voice pretending to be hers.
 *
 * The individuação note states, in the page's copy rather than in a reviewer's
 * note, that individuação describes a direction and not a delivered result.
 * CONCEPT §11 bans promised outcomes anywhere on the site, and this is the one
 * paragraph where the temptation is structural.
 *
 * The closing line is her sentence about collaboration, set in Cardo italic at
 * Title scale (DESIGN's Two-Voices and Italic-Is-Voice rules). The page's plate
 * sits here (PAT-002), beside the idea of a whole life turning toward itself —
 * amplificação performed on the page's own argument.
 */
export function OMetodo({ content }: { content: Analise["oMetodo"] }) {
  const t = useTranslations("analise.plate");
  const { plate } = content;

  // A gallery label needs both the hand and the work; a lone painter names nothing.
  const caption =
    plate.painter && plate.workTitle
      ? { painter: plate.painter, title: plate.workTitle, year: plate.year ?? undefined }
      : null;

  return (
    <PageSection id="o-metodo" labelledBy="o-metodo-heading">
      <SectionHeading id="o-metodo-heading">{content.heading}</SectionHeading>

      <RichTextProse data={content.body} className="body-prose text-ink mt-8 max-w-[62ch]" />

      {content.toolsLine && (
        <p className="body-prose text-ink mt-8 max-w-[62ch]">{content.toolsLine}</p>
      )}

      <RichTextProse
        data={content.individuacao}
        className="body-prose text-ink mt-8 max-w-[62ch]"
      />

      {content.closingLine && (
        <p className="display-italic text-ink-soft mt-14 max-w-[42ch] text-[clamp(1.45rem,2.4vw,1.85rem)] leading-[1.3]">
          {content.closingLine}
        </p>
      )}

      <Plate
        image={plate.image}
        caption={caption}
        placeholder={t("placeholder")}
        placeholderNote={t("placeholderNote")}
        aspectRatio={PLATE_ASPECT}
      />
    </PageSection>
  );
}
