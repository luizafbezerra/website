import type { Sobre } from "@/domain/sobre/Sobre";
import { PageSection } from "@/view/general/PageSection";
import { SectionHeading } from "@/view/general/SectionHeading";

/**
 * Section 3 of CONCEPT §6 — the academic record, plainly. "No editorializing;
 * the record speaks."
 *
 * This is the coldest section on the site, and deliberately so: it is the one a
 * sceptical reader scrolled here for, and the fastest way to lose them is to
 * decorate it. So there is no intro, no numerals, no ornament, no adjective — a
 * one-word heading and then the rows. The warmth on this page lives in the two
 * sections around it; here, restraint *is* the argument.
 *
 * Rows are a list, not a `<dl>`: an institution is not a term the course defines,
 * so a description list would be the wrong semantics for what is really one
 * record per line. Hairline rules do the structuring, as they do on every other
 * fact list in the system.
 *
 * Both lines are body type. DESIGN's Marginalia-Is-Voice rule binds hardest
 * here — a credential in decorative small caps is a credential somebody squints
 * at — so the institution takes the same treatment `CredentialLine` gives the
 * strip: body font, `ink-soft`, small but readable.
 *
 * `period` prints only when she has written it. No source document states a year
 * for any of these, and a guessed year on the page whose job is verification is
 * the one mistake this page cannot afford (CONCEPT §11: provenance is never
 * invented — the rule that governs a plate's year governs hers).
 */
export function Formacao({ content }: { content: Sobre["formacao"] }) {
  return (
    <PageSection labelledBy="formacao-heading">
      <SectionHeading id="formacao-heading">{content.heading}</SectionHeading>

      <ul className="border-rule-soft mt-12 border-t">
        {content.items.map((item) => (
          <li
            key={`${item.title}·${item.institution ?? ""}`}
            className="border-rule-soft border-b py-5"
          >
            <p className="text-ink max-w-[54ch]">{item.title}</p>

            {(item.institution || item.period) && (
              <p className="text-ink-soft mt-1 text-sm">
                {item.institution}
                {item.institution && item.period && <span aria-hidden="true"> · </span>}
                {item.period}
              </p>
            )}
          </li>
        ))}
      </ul>
    </PageSection>
  );
}
