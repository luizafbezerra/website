import { useTranslations } from "next-intl";
import type { PrimeiraConversa } from "@/domain/primeiraConversa/PrimeiraConversa";
import { PageSection } from "@/view/general/PageSection";
import { Plate } from "@/view/general/Plate";
import { SectionHeading } from "@/view/general/SectionHeading";

const PLATE_ASPECT = "3 / 2";

/**
 * Section 2 of CONCEPT §6 — the three permissions, and the page's plate.
 *
 * The quietest moment on the page, and the only one that asks nothing. Each line is
 * set in Cardo italic at Title scale: this is Luiza speaking directly to the reader
 * (DESIGN's Two-Voices and Italic-Is-Voice rules), so it gets her voice at a scale
 * that can be read in one glance rather than body prose in a list.
 *
 * No bullets, no numerals, no frames. The permissions are not steps, not features,
 * and not three of anything a visitor has to do — the whole point is that the list
 * is short and then it stops.
 *
 * The plate closes the section, which is where the scroll takes its breath: the
 * reassurance has landed and the practical facts have not started. Until her
 * painting is chosen and its provenance verified, the slot is a labeled frame
 * (REQ-005) — a vector stand-in would invert the idea into banned ornament.
 */
export function Permissoes({ content }: { content: PrimeiraConversa["permissoes"] }) {
  const t = useTranslations("primeiraConversa.plate");
  const { plate } = content;

  // A gallery label needs both the hand and the work; a lone painter names nothing.
  const caption =
    plate.painter && plate.workTitle
      ? { painter: plate.painter, title: plate.workTitle, year: plate.year ?? undefined }
      : null;

  return (
    <PageSection labelledBy="permissoes-heading">
      <SectionHeading id="permissoes-heading">{content.heading}</SectionHeading>

      <ul className="mt-12 space-y-8">
        {content.items.map((item) => (
          <li
            key={item}
            className="display-italic text-ink-soft max-w-[42ch] text-[clamp(1.45rem,2.4vw,1.85rem)] leading-[1.3]"
          >
            {item}
          </li>
        ))}
      </ul>

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
