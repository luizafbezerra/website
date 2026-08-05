import type { Analise } from "@/domain/analise/Analise";
import { PageSection } from "@/view/general/PageSection";
import { RichTextProse } from "@/view/general/RichTextProse";
import { SectionHeading } from "@/view/general/SectionHeading";

/**
 * Section 3 of CONCEPT §6 — the free, welcoming, non-judgemental dialogue, and
 * the three symbolic tools that work alongside it.
 *
 * The tools are a `<ul>`, not an `<ol>`, and they carry no numerals. DESIGN
 * reserves `.roman-numeral` for sequences that genuinely are ordered, and these
 * are three ways of looking that happen at once — numbering them would promise a
 * protocol the analysis does not have. The three pillars two sections down *are*
 * an ordered enumeration she named I–III, so the numerals live there and nowhere
 * else on this page.
 *
 * Each tool's title is set at Title scale rather than as a bold run inside a
 * paragraph: bold is structural weight in this system, and the titles are where
 * the section's scan-ability lives for a reader deciding whether this is the kind
 * of therapy they want.
 *
 * The closing line is her sentence about collaboration, set in Cardo italic at
 * Title scale — Luiza's own voice closing the section that describes her work
 * (DESIGN's Two-Voices and Italic-Is-Voice rules).
 */
export function OMetodo({ content }: { content: Analise["oMetodo"] }) {
  return (
    <PageSection id="o-metodo" labelledBy="o-metodo-heading">
      <SectionHeading id="o-metodo-heading">{content.heading}</SectionHeading>

      <RichTextProse data={content.body} className="body-prose text-ink mt-8 max-w-[62ch]" />

      <ul className="mt-14 space-y-10">
        {content.tools.map((tool) => (
          <li key={tool.title}>
            <h3 className="display text-foreground text-[clamp(1.45rem,2.4vw,1.85rem)] leading-[1.2] tracking-[-0.005em]">
              {tool.title}
            </h3>
            <p className="body-prose text-ink mt-3 max-w-[58ch]">{tool.text}</p>
          </li>
        ))}
      </ul>

      {content.closingLine && (
        <p className="display-italic text-ink-soft mt-14 max-w-[42ch] text-[clamp(1.45rem,2.4vw,1.85rem)] leading-[1.3]">
          {content.closingLine}
        </p>
      )}
    </PageSection>
  );
}
