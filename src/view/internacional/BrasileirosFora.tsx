import { useTranslations } from "next-intl";
import type { Internacional } from "@/domain/internacional/Internacional";
import { FactList } from "@/view/general/FactList";
import { PageSection } from "@/view/general/PageSection";
import { Plate } from "@/view/general/Plate";
import { RichTextProse } from "@/view/general/RichTextProse";
import { SectionHeading } from "@/view/general/SectionHeading";

const PLATE_ASPECT = "3 / 2";

/**
 * Section 2 of CONCEPT §6 — terapia em português, no seu fuso, with the city
 * examples, and the page's plate.
 *
 * PRODUCT's third audience reads this section, and what they came for is
 * permission before logistics: "sim, atendo quem mora fora." So the prose gives it
 * in the first sentence and only then measures the distance.
 *
 * **The city examples are the page's craft moment, and the craft is factual.** They
 * are set in the same fact list as the prático rows rather than in a decorated
 * treatment of their own, because a time difference is an operational fact and
 * DESIGN puts those in body type; the care is spent on making each note stay true
 * all year (see the reasoning in `INTERNACIONAL_DEFAULTS`). Three of them, one per
 * country she has actually worked with — a fourth would turn her history into a
 * list of markets.
 *
 * The plate closes the section, which is where this page takes its breath: the
 * permission has landed, the arithmetic is done, and the language changes in the
 * next section. A painting of distance — sea, voyage, a port — amplifies exactly
 * the idea the section just stated, which is the amplificação logic her own feed
 * runs on. Until her painting is chosen and its provenance verified the slot is a
 * labeled frame (REQ-005); a vector stand-in would invert the idea into the
 * generated ornament DESIGN bans.
 */
export function BrasileirosFora({ content }: { content: Internacional["brasileirosFora"] }) {
  const t = useTranslations("internacional.plate");
  const { plate } = content;

  // A gallery label needs both the hand and the work; a lone painter names nothing.
  const caption =
    plate.painter && plate.workTitle
      ? { painter: plate.painter, title: plate.workTitle, year: plate.year ?? undefined }
      : null;

  return (
    <PageSection id="brasileiros-fora" labelledBy="brasileiros-fora-heading">
      <SectionHeading id="brasileiros-fora-heading">{content.heading}</SectionHeading>

      <RichTextProse data={content.body} className="body-prose text-ink mt-8 max-w-[62ch]" />

      <FactList
        rows={content.cities.map(({ city, note }) => ({ label: city, value: note }))}
        className="mt-10"
      />

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
