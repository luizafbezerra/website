import { inEnglishSectionFor } from "@/domain/internacional/inEnglishSectionFor";
import type { Internacional } from "@/domain/internacional/Internacional";
import {
  blocks,
  factBullets,
  link,
  type MarkdownBlock,
  paragraph,
  section,
} from "@/domain/markdown/MarkdownBlock";
import { richTextToMarkdown } from "@/domain/markdown/richTextToMarkdown";
import type { TwinContext } from "@/domain/markdown/TwinContext";
import { twinDocument } from "@/domain/markdown/twinDocument";
import { twinFeeRows } from "@/domain/markdown/twinFeeRows";
import { twinReachRows } from "@/domain/markdown/twinReachRows";

/**
 * Brasil e exterior's twin — the five sections of CONCEPT §6, in the page's own
 * order, with the same locale-dependent composition the page has.
 *
 * **The In-English block renders on the Portuguese twin only.**
 * `inEnglishSectionFor` is consulted here for the same reason the page consults it
 * in its route: on `/en/international` the whole document is already English, so
 * the block would repeat five sections in three lines and its link would point at
 * the file it sits in.
 *
 * **No fee row, on purpose.** `fees="none"` on the page, and `"none"` here:
 * quoting reais to a reader who pays in euros is the automatic conversion CONCEPT
 * §8.9 forbids, one step removed. The money is stated in this page's own
 * `Valores` row, in dólar/euro terms — which is also why the shared international
 * note is suppressed here and nowhere else.
 */
export function internacionalDoc(page: Internacional, ctx: TwinContext): MarkdownBlock[] {
  const inEnglish = inEnglishSectionFor(page.inEnglish, ctx.locale);

  return twinDocument(ctx, {
    title: page.abertura.heading,
    lead: blocks(
      richTextToMarkdown(page.abertura.body),
      // The telepsychology signal: body type on the page, a paragraph here —
      // never a footnote (CONCEPT §6).
      paragraph(page.abertura.trustLine),
    ),
    sections: blocks(
      section(
        2,
        page.brasileirosFora.heading,
        richTextToMarkdown(page.brasileirosFora.body),
        // Country and city, with no clock: the page computes the difference from
        // Brasília at the instant a reader looks, and this document is cached (see
        // `twinReachRows`).
        factBullets(twinReachRows(ctx.labels)),
      ),
      inEnglish &&
        section(
          2,
          inEnglish.heading,
          paragraph(inEnglish.body),
          paragraph(link(inEnglish.linkLabel, ctx.englishHomeUrl)),
        ),
      section(
        2,
        page.pratico.heading,
        factBullets([...twinFeeRows(ctx.clinica.fees, "none", ctx.labels), ...page.pratico.items]),
      ),
      section(
        2,
        page.comecar.heading,
        paragraph(page.comecar.body),
        paragraph(link(page.comecar.linkLabel, ctx.pageUrls.primeiraConversa)),
      ),
    ),
  });
}
