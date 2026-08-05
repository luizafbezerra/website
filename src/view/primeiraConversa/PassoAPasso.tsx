import type { PrimeiraConversa } from "@/domain/primeiraConversa/PrimeiraConversa";
import { PageSection } from "@/view/general/PageSection";
import { SectionHeading } from "@/view/general/SectionHeading";

/**
 * Section 1 of CONCEPT §6 — the five tempos, I to V: the message, the scheduling,
 * the day, the fifty minutes, and what you decide afterwards.
 *
 * Manuscript numerals rather than a list style, because DESIGN reserves
 * `.roman-numeral` for sequences that genuinely are ordered — and this is the only
 * genuinely ordered thing on the page, which is why the numerals appear here and
 * nowhere else on it. The three permissions that follow are deliberately unnumbered
 * for the same reason: they are not steps and must not read as more to get through.
 *
 * An `<ol>` because the order is the meaning: a screen reader announcing "item 3 of
 * 5" is telling the visitor exactly what an anxious reader wants to know, which is
 * how much of this there is.
 */
export function PassoAPasso({ content }: { content: PrimeiraConversa["passoAPasso"] }) {
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
    </PageSection>
  );
}
