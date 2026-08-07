import {
  blocks,
  bullets,
  factBullets,
  labelled,
  link,
  type MarkdownBlock,
  numbered,
  paragraph,
  section,
} from "@/domain/markdown/MarkdownBlock";
import { richTextToMarkdown } from "@/domain/markdown/richTextToMarkdown";
import type { TwinContext } from "@/domain/markdown/TwinContext";
import { twinDocument } from "@/domain/markdown/twinDocument";
import { twinFeeRows } from "@/domain/markdown/twinFeeRows";
import type { OrientacaoProfissional } from "@/domain/orientacaoProfissional/OrientacaoProfissional";

/**
 * Orientação profissional e de carreira's twin — the five bands of the condensed
 * page, in the page's own order.
 *
 * This is the site's strongest non-brand search asset (CONCEPT §10) and the page
 * a comparing reader reads fastest, which is exactly the reader an assistant is
 * usually answering for. So the twin keeps the whole comparison apparatus: the
 * four situations, the four movements, the three distinctions, the deliverable
 * sentence, the boundary with análise (folded into "nem coaching", as on the
 * page), and the fee row — everything the page uses to answer "what do I get,
 * how long does it take, and how is this different from coaching".
 *
 * The fee is scoped to `careerGuidance`: a page quotes its own service, so a
 * reader is never asked to compare two prices they are not choosing between.
 */
export function orientacaoProfissionalDoc(
  page: OrientacaoProfissional,
  ctx: TwinContext,
): MarkdownBlock[] {
  const { pageUrls } = ctx;

  return twinDocument(ctx, {
    title: page.abertura.heading,
    lead: richTextToMarkdown(page.abertura.body),
    sections: blocks(
      section(
        2,
        page.paraQuem.heading,
        // Unordered on purpose: these are alternatives, only one of which is the
        // reader's.
        bullets(page.paraQuem.cases),
      ),
      section(
        2,
        page.oPercurso.heading,
        richTextToMarkdown(page.oPercurso.body),
        numbered(page.oPercurso.steps.map((step) => labelled(step.title, step.text))),
        paragraph(page.oPercurso.deliverable),
      ),
      section(
        2,
        page.nemCoaching.heading,
        richTextToMarkdown(page.nemCoaching.body),
        bullets(page.nemCoaching.distinctions.map((item) => labelled(item.title, item.text))),
        paragraph(page.nemCoaching.anchor),
        // The bridge to análise, folded in exactly as the page folds it.
        paragraph(page.nemCoaching.bridge.body),
        paragraph(link(page.nemCoaching.bridge.linkLabel, pageUrls.analise)),
      ),
      section(
        2,
        page.pratico.heading,
        factBullets([
          ...twinFeeRows(ctx.clinica.fees, "careerGuidance", ctx.labels),
          ...page.pratico.items,
        ]),
        paragraph(ctx.clinica.fees.internationalNote),
        // The ask, folded into the band exactly as the page folds it.
        paragraph(page.pratico.comecar.body),
        paragraph(link(page.pratico.comecar.linkLabel, pageUrls.primeiraConversa)),
      ),
    ),
  });
}
