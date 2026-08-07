import type { Privacidade } from "@/domain/privacidade/Privacidade";
import { PageOpening } from "@/view/general/PageOpening";
import { RichTextProse } from "@/view/general/RichTextProse";

/**
 * The page's opening — its one `h1`, and the page's single drop cap.
 *
 * Most people who open this page are checking one thing and leaving, so the lead
 * answers the whole page in three sentences: what stays in your browser, what the
 * visit statistics are, and why there is no cookie notice. A reader who stops
 * here has been told the truth; the sections below only make it specific.
 *
 * **No eyebrow.** The `abertura` tab's `eyebrow` field was removed rather than
 * rendered: the only text it could plausibly have held is the page's own name,
 * which the footer link, the tab title and the breadcrumb already say, and
 * DESIGN §6 names a tracked-caps kicker over a heading as scaffolding rather than
 * voice.
 *
 * **No breadcrumb.** The page it replaces hand-rolled a visual trail; no other
 * page on the site renders one, the chrome already answers "where am I?", and the
 * machine-readable `BreadcrumbList` is emitted from the route.
 */
export function Abertura({ content }: { content: Privacidade["abertura"] }) {
  return (
    <PageOpening labelledBy="abertura-heading">
      <h1
        id="abertura-heading"
        className="display text-foreground text-[clamp(2rem,4vw,3.1rem)] leading-[1.12] tracking-[-0.005em] text-balance"
      >
        {content.heading}
      </h1>

      <RichTextProse
        data={content.body}
        className="body-prose dropcap text-ink mt-10 max-w-[62ch]"
      />
    </PageOpening>
  );
}
