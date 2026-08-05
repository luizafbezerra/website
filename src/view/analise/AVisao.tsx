import { useTranslations } from "next-intl";
import type { Analise } from "@/domain/analise/Analise";
import { PageSection } from "@/view/general/PageSection";
import { Plate } from "@/view/general/Plate";
import { RichTextProse } from "@/view/general/RichTextProse";
import { SectionHeading } from "@/view/general/SectionHeading";

const PLATE_ASPECT = "4 / 5";

/**
 * Section 2 of CONCEPT §6 — the whole person, and individuação as a concept.
 *
 * The section states, in her copy rather than in a reviewer's note, that
 * individuação describes a direction and not a delivered result. CONCEPT §11
 * bans promised outcomes anywhere on the site, and this is the one paragraph on
 * the site where the temptation to promise one is structural: the word is the
 * most attractive thing analytical psychology has to offer a stranger.
 *
 * The page's plate sits here (PAT-002). This is the section where a painting
 * *amplifies* rather than decorates — amplificação is her own method (CONCEPT
 * §5), and setting a classical image beside the idea of a whole life turning
 * toward itself is that method performed on the page's own argument. The wheel
 * two sections down is a painted asset too, but it is the set-piece; keeping the
 * two roles distinct is why the plate is here and not there.
 */
export function AVisao({ content }: { content: Analise["aVisao"] }) {
  const t = useTranslations("analise.plate");
  const { plate } = content;

  // A gallery label needs both the hand and the work; a lone painter names nothing.
  const caption =
    plate.painter && plate.workTitle
      ? { painter: plate.painter, title: plate.workTitle, year: plate.year ?? undefined }
      : null;

  return (
    <PageSection id="a-visao" labelledBy="a-visao-heading">
      <SectionHeading id="a-visao-heading">{content.heading}</SectionHeading>

      <RichTextProse data={content.body} className="body-prose text-ink mt-8 max-w-[62ch]" />

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
