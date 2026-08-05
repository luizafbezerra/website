import type { Privacidade } from "@/domain/privacidade/Privacidade";
import { PageSection } from "@/view/general/PageSection";
import { SectionHeading } from "@/view/general/SectionHeading";
import { ItemList } from "./ItemList";

/**
 * Section 2 of CONCEPT §6 — what the site keeps, named exactly.
 *
 * Three items, and each one is checkable against the repository rather than
 * asserted: the locale cookie's name, lifetime and payload are configured in
 * `src/i18n/routing.ts`; the aggregate statistics are what `@vercel/analytics`
 * collects from the frontend layout; the third is the Cosmos preference the
 * footer's restore control writes to the browser's own local storage. Naming that
 * third one costs three lines and is the difference between a page that is short
 * and a page that is short *and* complete.
 *
 * The section stays on plain parchment. Its counterpart takes the page's one tonal
 * event, because the relief belongs to the longer list.
 */
export function Guarda({ content }: { content: Privacidade["guarda"] }) {
  return (
    <PageSection labelledBy="guarda-heading">
      <SectionHeading id="guarda-heading">{content.heading}</SectionHeading>
      <ItemList items={content.items} className="mt-12" />
    </PageSection>
  );
}
