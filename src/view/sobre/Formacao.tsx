import type { Sobre } from "@/domain/sobre/Sobre";
import { FormacaoList } from "@/view/general/FormacaoList";
import { PageSection } from "@/view/general/PageSection";
import { SectionHeading } from "@/view/general/SectionHeading";

/**
 * Section 3 of CONCEPT §6 — the academic record, plainly. "No editorializing;
 * the record speaks."
 *
 * This is the coldest section on the site, and deliberately so: it is the one a
 * sceptical reader scrolled here for, and the fastest way to lose them is to
 * decorate it. So there are no numerals, no ornament, no adjective — a one-word
 * heading and then the rows. The warmth on this page lives in the two sections
 * around it; here, restraint *is* the argument.
 *
 * `intro` is the single exception, and it exists because she wrote it: one
 * sentence of hers about why the record is long, which says something the rows
 * cannot say for themselves. It is optional and prints nothing when empty, so
 * the cold version of this section is still one cleared field away — and no
 * drafted sentence may ever take its place, because the exception is granted to
 * her voice, not to the slot.
 *
 * The rows themselves are `FormacaoList`, shared with the home page since she
 * asked for the record to stand there without a click. This file stays the
 * *section*: the heading, her intro, and the interval around them — the part
 * that belongs to /sobre and to nowhere else.
 *
 * A `beat`, for the same reason the section is cold: the restraint is the
 * argument, and a record given the monumental interval on both sides would be
 * making a monument of it. It belongs to the two warm sections it sits between —
 * they are the ones this page is asking a reader to believe.
 */
export function Formacao({ content }: { content: Sobre["formacao"] }) {
  return (
    <PageSection labelledBy="formacao-heading" pace="beat">
      <SectionHeading id="formacao-heading">{content.heading}</SectionHeading>

      {content.intro && <p className="body-prose text-ink mt-8 max-w-[62ch]">{content.intro}</p>}

      <FormacaoList items={content.items} className="border-rule-soft mt-12 border-t" />
    </PageSection>
  );
}
