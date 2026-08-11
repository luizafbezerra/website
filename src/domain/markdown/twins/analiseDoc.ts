import type { Analise, DreamParallel } from "@/domain/analise/Analise";
import {
  blocks,
  factBullets,
  labelled,
  link,
  type MarkdownBlock,
  numbered,
  paragraph,
  quote,
  section,
  bullets,
} from "@/domain/markdown/MarkdownBlock";
import { richTextToMarkdown } from "@/domain/markdown/richTextToMarkdown";
import type { TwinContext } from "@/domain/markdown/TwinContext";
import { twinDocument } from "@/domain/markdown/twinDocument";
import { twinFeeRows } from "@/domain/markdown/twinFeeRows";

/**
 * A Análise's twin — the five bands of the condensed page, in the page's own
 * order: what people bring, how the work happens (her verbatim text), the
 * practical facts with the ask folded in, and the mandala closing after it.
 *
 * **The wheel's reference data and its per-sign readings are not here**, and this
 * is the largest omission in any twin. The mandala section keeps its heading and
 * its intro, because that intro is where the site states the policy that binds
 * every symbol on it — *the signs are vocabulary, never a reading about you*
 * (CONCEPT §11) — which is precisely the sentence a machine should be able to
 * quote back. What it drops is the twelve × five nomenclature table
 * (`src/domain/zodiac/zodiacContent.ts`), which is scholarly apparatus for a
 * drawing that does not exist in text, and her twenty-four per-sign readings,
 * which are `null` at launch by design (REQ-007).
 *
 * `Sonho ampliado` mirrors the page's own condition: it appears only while her
 * dream motif is written — the intro alone must not keep the section alive here
 * when the page hides it. Each parallel appears only when it has text; the plate
 * slot beside it never does, because a twin states no asset.
 */
export function analiseDoc(page: Analise, ctx: TwinContext): MarkdownBlock[] {
  const { pageUrls } = ctx;

  return twinDocument(ctx, {
    title: page.abertura.heading,
    lead: richTextToMarkdown(page.abertura.body),
    sections: blocks(
      section(
        2,
        page.oQueTrazem.heading,
        paragraph(page.oQueTrazem.note),
        // Ordered I–III on the page, so ordered here.
        numbered(page.oQueTrazem.pillars.map((pillar) => labelled(pillar.title, pillar.text))),
        paragraph(page.oQueTrazem.boundary),
        paragraph(link(page.oQueTrazem.linkLabel, pageUrls.orientacaoProfissional)),
      ),
      section(
        2,
        page.oMetodo.heading,
        richTextToMarkdown(page.oMetodo.body),
        paragraph(page.oMetodo.toolsLine),
        richTextToMarkdown(page.oMetodo.individuacao),
        paragraph(page.oMetodo.closingLine),
      ),
      page.sonhoAmpliado.motif
        ? section(
            2,
            page.sonhoAmpliado.heading,
            paragraph(page.sonhoAmpliado.intro),
            // Quoted speech: CONCEPT §9.3's example of a motif somebody brings to
            // a session, not prose in her name.
            quote(page.sonhoAmpliado.motif),
            bullets(page.sonhoAmpliado.parallels.map(parallel)),
            paragraph(page.sonhoAmpliado.closingLine),
          )
        : null,
      section(
        2,
        page.pratico.heading,
        // The fee comes from A Clínica, prepended exactly as `PraticoSection`
        // prepends it, so the twin quotes the price the page quotes (REQ-005).
        factBullets([
          ...twinFeeRows(ctx.clinica.fees, "analysis", ctx.labels),
          ...page.pratico.items,
        ]),
        paragraph(ctx.clinica.fees.note),
        paragraph(ctx.clinica.fees.internationalNote),
        // The ask, folded into the band exactly as the page folds it.
        paragraph(page.pratico.comecar.body),
        paragraph(link(page.pratico.comecar.linkLabel, pageUrls.primeiraConversa)),
      ),
      section(2, page.mandala.heading, paragraph(page.mandala.intro)),
    ),
  });
}

/** One parallel beside the dream motif — dropped entirely while she has written no text for it. */
function parallel(item: DreamParallel): string | null {
  return item.text ? labelled(item.label, item.text) : null;
}
