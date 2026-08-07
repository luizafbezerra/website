import type { InEnglishSection } from "@/domain/internacional/Internacional";
import { Link } from "@/i18n/navigation";
import { PageSection } from "@/view/general/PageSection";
import { SectionHeading } from "@/view/general/SectionHeading";

/**
 * Section 3 of CONCEPT §6 — one short section in English, inside the Portuguese
 * page, that hands an anglophone the English site.
 *
 * It only ever renders on the Portuguese page: whether it renders at all is
 * `inEnglishSectionFor`'s decision, taken in the route, because a section that
 * structurally disappears in one locale is a fact about the page's composition
 * rather than about this component.
 *
 * `lang="en"` sits on the wrapper so every string below it inherits it. Without it
 * a screen reader would read English prose with Portuguese phonetics, which is the
 * one accessibility failure this section could plausibly cause — and the reader it
 * would fail is the exact reader it exists for.
 *
 * The deeper parchment is one of the page's two tonal breaks. It earns it: a block
 * in another language is a genuine event in the scroll, and DESIGN's depth
 * vocabulary is tonal, so the language change is announced by the page rather than
 * by a flag, a badge, or a dropdown — all three banned (CONCEPT §12).
 *
 * The link goes to `/en`, the English home, not to this page's English twin. An
 * anglophone who has found their way here needs the practice in English, and
 * `/en/international` is the page about *Brazilians abroad* — the wrong subject
 * for the reader this section is written for.
 */
export function InEnglish({ content }: { content: InEnglishSection }) {
  return (
    <PageSection id="in-english" labelledBy="in-english-heading" tone="deep">
      <div lang="en">
        <SectionHeading id="in-english-heading">{content.heading}</SectionHeading>

        {content.body && <p className="body-prose text-ink mt-8 max-w-[62ch]">{content.body}</p>}

        {content.linkLabel && (
          // Not `SectionLink`: this is the one link on the site that has to change
          // language as well as page, and next-intl needs an explicit `locale` for
          // that. The marginalia-voice styling is the same.
          <Link
            href="/"
            locale="en"
            className="marginalia text-quill hover:text-terracotta decoration-terracotta/40 hover:decoration-terracotta mt-10 inline-flex items-baseline gap-2 underline decoration-1 underline-offset-[0.28em] transition-colors"
          >
            <span>{content.linkLabel}</span>
            <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>
    </PageSection>
  );
}
