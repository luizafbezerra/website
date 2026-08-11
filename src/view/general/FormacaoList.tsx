import type { CSSProperties } from "react";
import type { FormacaoItem } from "@/domain/sobre/Sobre";
import { CascadeReveal } from "@/view/general/CascadeReveal";

/**
 * Her academic record, one row per line — the rows themselves, with no heading
 * and no editorial line around them.
 *
 * Extracted from `/sobre`'s Formação section when the home page asked for the
 * same record ("eu preferia que ficasse em evidência sem precisar clicar no
 * link"). Two readers, one source: both pages read `sobre.formacao`, so a course
 * she edits in the admin changes in both places and neither can drift.
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
 * for any of these, and a guessed year on a record whose job is verification is
 * the one mistake it cannot afford (CONCEPT §11: provenance is never invented —
 * the rule that governs a plate's year governs hers).
 *
 * The records are written in from the margin, one after the other, the first
 * time the list comes into view (`CascadeReveal`). Each row carries its own
 * `--list-i`, which is the only thing that decides its place in the cascade.
 */
export function FormacaoList({ items, className }: { items: FormacaoItem[]; className?: string }) {
  if (items.length === 0) return null;

  return (
    <CascadeReveal as="ul" className={className}>
      {items.map((item, index) => (
        <li
          key={`${item.title}·${item.institution ?? ""}`}
          className="border-rule-soft border-b py-5"
          style={{ "--list-i": index } as CSSProperties}
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
    </CascadeReveal>
  );
}
