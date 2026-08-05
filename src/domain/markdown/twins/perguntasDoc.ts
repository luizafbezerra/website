import type { FaqSection } from "@/domain/faq/groupFaqByCategory";
import {
  blocks,
  link,
  type MarkdownBlock,
  paragraph,
  section,
} from "@/domain/markdown/MarkdownBlock";
import type { TwinContext } from "@/domain/markdown/TwinContext";
import { twinDocument } from "@/domain/markdown/twinDocument";
import type { Perguntas } from "@/domain/perguntas/Perguntas";

/**
 * Perguntas' twin — the four category sections of CONCEPT §6 with every question
 * filed under them.
 *
 * Nothing is summarised and nothing is dropped: CONCEPT §10 asks for the FAQ as
 * *discrete Q&A blocks*, and this is the one page whose entire content is already
 * in that shape, so the twin is a straight rendering — `###` per question, the
 * answer under it. An assistant retrieving one heading gets one complete answer,
 * which is what the page's `FAQPage` structured data promises a crawler.
 *
 * The two data sources meet here exactly as they do on the page: the frame (the
 * opening, the four headings, the close) is the `page-perguntas` global, the
 * questions are rows of the `faq` collection grouped by `groupFaqByCategory` —
 * whose order is CONCEPT's, not the rows' — and a category with no questions
 * produces no section on either surface.
 */
export function perguntasDoc(
  page: Perguntas,
  faqSections: readonly FaqSection[],
  ctx: TwinContext,
): MarkdownBlock[] {
  return twinDocument(ctx, {
    title: page.abertura.heading,
    lead: blocks(paragraph(page.abertura.intro)),
    sections: blocks(
      ...faqSections.map((faqSection) => {
        const frame = page.sections[faqSection.category];

        return section(
          2,
          frame.heading,
          paragraph(frame.intro),
          ...faqSection.entries.map((entry) => section(3, entry.question, paragraph(entry.answer))),
        );
      }),
      section(
        2,
        page.fecho.heading,
        paragraph(page.fecho.body),
        paragraph(link(page.fecho.linkLabel, ctx.pageUrls.primeiraConversa)),
      ),
    ),
  });
}
