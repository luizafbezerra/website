import type { CSSProperties } from "react";
import type { Inicio } from "@/domain/inicio/Inicio";
import { CascadeReveal } from "@/view/general/CascadeReveal";
import { PageSection } from "@/view/general/PageSection";
import { SectionHeading } from "@/view/general/SectionHeading";
import { SectionLink } from "@/view/general/SectionLink";

/**
 * Section 8 of CONCEPT §6 — three beats, about eighty words, answering the
 * question that actually stops people from writing: what happens if I do?
 *
 * Manuscript numerals rather than a numbered list style, because DESIGN reserves
 * `.roman-numeral` for sequences that genuinely are ordered — and this one is:
 * you cannot decide before the conversation you have not had yet.
 *
 * On wider screens the beats stand side by side, divided by the same hairline
 * rule that separates the two doors — a triptych, read left to right like the
 * steps it describes. They are written in from the margin one after the other
 * when the row comes into view (`CascadeReveal`): the stagger is the I→II→III
 * sequence made visible, and it reads the same left-to-right whether the beats
 * are a row or a column, because the order comes from `--list-i` rather than
 * from where each one happens to sit.
 */
export function ComoComecar({ content }: { content: Inicio["comoComecar"] }) {
  if (content.beats.length === 0) return null;

  return (
    <PageSection labelledBy="como-comecar-heading" pace="beat" width="wide">
      <SectionHeading id="como-comecar-heading">{content.heading}</SectionHeading>

      {/* Held deeper into the screen and paced slower than a record list: three
          beats side by side are read as one picture, so they should arrive
          once the reader is actually looking at them, and unhurriedly enough
          that the I→II→III order is legible in the arrival itself. */}
      <CascadeReveal
        as="ol"
        trigger={0.34}
        style={{ "--list-dur": "1300ms", "--list-step": "240ms" } as CSSProperties}
        className="mt-12 grid grid-cols-1 gap-y-9 md:grid-cols-3 md:gap-y-0 md:divide-x md:divide-[color:var(--color-rule)]"
      >
        {content.beats.map((beat, index) => (
          <li
            key={beat.numeral}
            className="grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 md:block md:px-10 md:first:pl-0 md:last:pr-0"
            style={{ "--list-i": index } as CSSProperties}
          >
            <span aria-hidden="true" className="roman-numeral md:text-4xl">
              {beat.numeral}
            </span>
            <p className="body-prose text-ink max-w-[56ch] md:mt-5">{beat.text}</p>
          </li>
        ))}
      </CascadeReveal>

      <SectionLink href="/primeira-conversa" className="mt-12">
        {content.linkLabel}
      </SectionLink>
    </PageSection>
  );
}
