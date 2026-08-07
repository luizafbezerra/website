import type { FaqEntry } from "@/domain/faq/FaqEntry";
import { questionAnchor } from "./questionAnchor";

/**
 * One question, closed until asked.
 *
 * **Why a disclosure and not the open Q&A this page used to print.** Sixteen
 * answers set out in full make a scroll nobody reads: the visitor arrives with one
 * doubt, and finding it meant reading past every answer that was not theirs. Closed,
 * the page becomes a list of the doubts themselves — the four section headings and
 * their questions visible at once, which is the shape the visitor is actually
 * scanning for.
 *
 * **Nothing is hidden from anyone who cannot click.** Native `<details>` keeps the
 * answer in the document: find-in-page opens the question around a match, a fragment
 * link opens its own question on arrival, and the page's `FAQPage` JSON-LD still
 * carries all sixteen answers to a crawler. That is what makes the collapse a change
 * of presentation rather than a loss of content — the objection that kept this page
 * flat, answered by the element rather than argued away.
 *
 * **Independent, not exclusive** (no shared `name`): somebody comparing the análise
 * and orientação answers keeps both open. An exclusive group would close the answer
 * they were reading to show the one they were comparing it to.
 *
 * The `h3` sits inside the `<summary>`, where it is valid and stays in the document
 * outline, so a screen-reader user can still jump question to question and hears
 * the collapsed state on each. The whole row is the control; the mark is a
 * passenger (`aria-hidden`), since the element announces its own state.
 *
 * **The mark leads, and the answer hangs off it.** Parked at the right edge of the
 * reading column it sat a third of a screen from the short question it belonged to,
 * with nothing in between. In the margin it stays bound to its question, and the
 * marks stack into a rubricated column down the page — a scribe's hand, not a
 * control panel. The answer indents to the question's own left edge, so a question
 * and its answer read as one hanging paragraph.
 */
export function Pergunta({ entry }: { entry: FaqEntry }) {
  return (
    <details className="pergunta border-rule-soft border-t">
      {/* The anchor sits on the `summary`, not on the `details`. A fragment opens
          the `details` elements that are *ancestors* of what it targets, so an id
          on the `details` itself scrolls to a question that stays shut; one step
          down, the same link both scrolls and opens. */}
      <summary
        id={questionAnchor(entry.question)}
        className="pergunta-summary group flex items-start gap-4 py-5"
      >
        <Marca />
        <h3 className="display text-foreground group-hover:text-terracotta group-focus-visible:text-terracotta text-[clamp(1.1rem,1.8vw,1.3rem)] leading-[1.3] transition-colors duration-200">
          {entry.question}
        </h3>
      </summary>

      {/* 1.875rem = the mark's 0.875rem plus the summary's 1rem gap: the answer
          starts exactly under the first letter of its question. */}
      <p className="body-prose text-ink max-w-[58ch] pb-8 pl-[1.875rem]">{entry.answer}</p>
    </details>
  );
}

/**
 * The scribe's mark — a drawn hairline cross, not a glyph from a font: at this
 * weight a typographic `+` renders as a different thickness in every browser, and
 * the turn to a single stroke is the animation.
 */
function Marca() {
  return (
    // The 14px lives in the attributes, not in a utility class: it is one half of
    // the answer's 1.875rem indent, and an SVG with no intrinsic size stretches to
    // fill its flex line if the class is ever missing.
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 14 14"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      className="text-terracotta mt-[0.45em] shrink-0"
    >
      <line x1="0.75" y1="7" x2="13.25" y2="7" />
      <line className="pergunta-mark-stem" x1="7" y1="0.75" x2="7" y2="13.25" />
    </svg>
  );
}
