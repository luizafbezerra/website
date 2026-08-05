import type { Privacidade } from "@/domain/privacidade/Privacidade";
import { PageSection } from "@/view/general/PageSection";
import { SectionHeading } from "@/view/general/SectionHeading";
import { ItemList } from "./ItemList";

/**
 * Section 3 of CONCEPT §6 — what the site never does.
 *
 * The page's one tonal event (DESIGN §4: depth is a deeper parchment, never a
 * shadow). It sits here rather than anywhere else because the asymmetry between
 * the two lists is the page's argument, and a second sheet is how a reader sees
 * that asymmetry before reading a word of it: one short list, then a longer one.
 * Every item's title begins with a negation, which does the rest.
 *
 * Five items, one of them CONCEPT §11's rule that the symbols index content and
 * never the visitor — the site's most distinctive privacy commitment and the one a
 * reader arriving from an astrology-adjacent Instagram account is most likely to
 * be checking for.
 */
export function NuncaFaz({ content }: { content: Privacidade["nuncaFaz"] }) {
  return (
    <PageSection labelledBy="nunca-faz-heading" tone="deep">
      <SectionHeading id="nunca-faz-heading">{content.heading}</SectionHeading>
      <ItemList items={content.items} className="mt-12" />
    </PageSection>
  );
}
