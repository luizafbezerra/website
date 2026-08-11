import { useTranslations } from "next-intl";
import type { Internacional } from "@/domain/internacional/Internacional";
import { HorasDaClinica } from "@/view/general/HorasDaClinica";
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
 * **The time difference is the page's craft moment, and the craft is factual.**
 * It used to be three hand-written notes, and each had to hedge into a range —
 * "três ou quatro horas à frente, conforme o horário de verão europeu" — because
 * Brazil stopped observing daylight saving time in 2019 and Europe and North
 * America did not. `HorasDaClinica` computes the difference at the instant the
 * reader is looking, so it is exact, it can never go stale, and a sixth country
 * costs one line rather than one more paragraph of hedging.
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

      <HorasDaClinica variant="full" className="mt-10" />

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
