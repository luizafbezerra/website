import { useTranslations } from "next-intl";
import type { PrimeiraConversa } from "@/domain/primeiraConversa/PrimeiraConversa";
import { PageSection } from "@/view/general/PageSection";
import { Plate } from "@/view/general/Plate";
import { SectionHeading } from "@/view/general/SectionHeading";

const PLATE_ASPECT = "3 / 2";

/**
 * Como acontece — the four tempos, I to IV, with the three permissions as the
 * band's coda (the 2026-08 condensation: the permissions stopped being a band of
 * their own, but they kept their voice and their plate).
 *
 * The steps carry logistics only: every reassurance the old five-step sequence
 * repeated — nothing to prepare, nothing to sign — lives exactly once, in the
 * permissions below or in the final step where it is the step's own content.
 *
 * Manuscript numerals rather than a list style, because DESIGN reserves
 * `.roman-numeral` for sequences that genuinely are ordered — and this is the only
 * genuinely ordered thing on the page. The permissions that follow are deliberately
 * unnumbered for the same reason: they are not steps and must not read as more to
 * get through. An `<ol>` because the order is the meaning: a screen reader
 * announcing "item 3 of 4" is telling an anxious visitor exactly how much of this
 * there is.
 *
 * Each permission line is set in Cardo italic at Title scale: this is Luiza
 * speaking directly to the reader (DESIGN's Two-Voices and Italic-Is-Voice rules).
 * The plate closes the band, where the scroll takes its breath: the reassurance
 * has landed and the practical facts have not started. Until her painting is
 * chosen and its provenance verified, the slot is a labeled frame (REQ-005).
 */
export function PassoAPasso({ content }: { content: PrimeiraConversa["passoAPasso"] }) {
  const t = useTranslations("primeiraConversa.plate");
  const { plate } = content.permissoes;

  // A gallery label needs both the hand and the work; a lone painter names nothing.
  const caption =
    plate.painter && plate.workTitle
      ? { painter: plate.painter, title: plate.workTitle, year: plate.year ?? undefined }
      : null;

  return (
    <PageSection labelledBy="passo-a-passo-heading">
      <SectionHeading id="passo-a-passo-heading">{content.heading}</SectionHeading>

      <ol className="mt-14 space-y-12">
        {content.steps.map((step) => (
          <li
            key={step.numeral}
            className="grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 sm:grid-cols-[3.5rem_1fr] sm:gap-x-6"
          >
            <span aria-hidden="true" className="roman-numeral">
              {step.numeral}
            </span>
            <div>
              <h3 className="display text-foreground text-[clamp(1.45rem,2.4vw,1.85rem)] leading-[1.2] tracking-[-0.005em]">
                {step.title}
              </h3>
              <p className="body-prose text-ink mt-3 max-w-[58ch]">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>

      {content.permissoes.items.length > 0 && (
        <ul className="border-rule-soft mt-16 space-y-8 border-t pt-12">
          {content.permissoes.items.map((item) => (
            <li
              key={item}
              className="display-italic text-ink-soft max-w-[42ch] text-[clamp(1.45rem,2.4vw,1.85rem)] leading-[1.3]"
            >
              {item}
            </li>
          ))}
        </ul>
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
