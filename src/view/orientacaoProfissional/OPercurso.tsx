import type { CSSProperties } from "react";
import type { OrientacaoProfissional } from "@/domain/orientacaoProfissional/OrientacaoProfissional";
import { CascadeReveal } from "@/view/general/CascadeReveal";
import { PageSection } from "@/view/general/PageSection";
import { RichTextProse } from "@/view/general/RichTextProse";
import { SectionHeading } from "@/view/general/SectionHeading";

/**
 * Section 3 of CONCEPT §6 — the concrete promise: up to twelve weekly online
 * meetings of tests, conversations and proposed activities, and the thing you leave
 * with.
 *
 * **The numerals are earned here.** DESIGN reserves `.roman-numeral` for sequences
 * that genuinely are ordered, and this one is: the whole product claim is that this
 * is a bounded programme with a beginning, a middle and an end, against a coach's
 * open-ended engagement and a test's single transaction. The order *is* the offer,
 * so an `<ol>` with manuscript enumerators says in one glance what a paragraph
 * would have to argue. They mark the four movements the work passes through, not
 * twelve numbered sessions — the section's own lead makes that explicit, and the
 * mapper numbers a movement she leaves blank from its position.
 *
 * **The deliverable is set apart from them on purpose.** It is the thing the buyer
 * is buying, so it must not read as a fifth step. It closes the section as a band
 * bounded by hairline rules — the grammar the credential strip already uses for a
 * line that has to be read as a statement rather than as an item — at Title scale
 * in Cardo italic, which is her voice. A filled surface here would make it a card,
 * which DESIGN bans, and would put a resting shadow's worth of emphasis on the one
 * sentence that needs none.
 */
export function OPercurso({ content }: { content: OrientacaoProfissional["oPercurso"] }) {
  return (
    <PageSection id="o-percurso" labelledBy="o-percurso-heading">
      <SectionHeading id="o-percurso-heading">{content.heading}</SectionHeading>

      <RichTextProse data={content.body} className="body-prose text-ink mt-8 max-w-[58ch]" />

      <CascadeReveal as="ol" className="mt-14 space-y-12">
        {content.steps.map((step, index) => (
          <li
            key={step.numeral}
            className="grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 sm:grid-cols-[3.5rem_1fr] sm:gap-x-6"
            style={{ "--list-i": index } as CSSProperties}
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
      </CascadeReveal>

      {content.deliverable && (
        <p className="border-rule-soft display-italic text-ink mt-16 border-y py-10 text-[clamp(1.45rem,2.4vw,1.85rem)] leading-[1.35]">
          {content.deliverable}
        </p>
      )}
    </PageSection>
  );
}
