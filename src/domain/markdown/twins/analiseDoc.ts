import type { Analise, DreamParallel } from "@/domain/analise/Analise";
import {
  blocks,
  bullets,
  factBullets,
  labelled,
  link,
  type MarkdownBlock,
  numbered,
  paragraph,
  quote,
  section,
} from "@/domain/markdown/MarkdownBlock";
import { richTextToMarkdown } from "@/domain/markdown/richTextToMarkdown";
import type { TwinContext } from "@/domain/markdown/TwinContext";
import { twinDocument } from "@/domain/markdown/twinDocument";
import { twinFeeRows } from "@/domain/markdown/twinFeeRows";

/**
 * A Análise's twin — the seven sections of CONCEPT §6 plus the page's opening,
 * in the page's own order.
 *
 * **The wheel's reference data and its per-sign readings are not here**, and this
 * is the largest omission in any twin. The mandala section keeps its heading and
 * its intro, because that intro is where the site states the policy that binds
 * every symbol on it — *the signs are vocabulary, never a reading about you*
 * (CONCEPT §11) — which is precisely the sentence a machine should be able to
 * quote back. What it drops is the twelve × five nomenclature table
 * (`src/domain/zodiac/zodiacContent.ts`: element, modality, ruler, body, three
 * lunar mansions each), which is scholarly apparatus for a drawing that does not
 * exist in text, and her twenty-four per-sign readings, which are `null` at
 * launch by design (REQ-007). If she writes them, they become the page's longest
 * prose and this decision is worth revisiting — see the plan's execution notes.
 *
 * `Sonho ampliado` mirrors the page's own condition: the section renders only
 * while her dream motif is written, so clearing that field removes it here too.
 * Each parallel appears only when it has text; the plate slot beside it never
 * does, because a twin states no asset.
 */
export function analiseDoc(page: Analise, ctx: TwinContext): MarkdownBlock[] {
  const { pageUrls } = ctx;

  return twinDocument(ctx, {
    title: page.abertura.heading,
    lead: richTextToMarkdown(page.abertura.body),
    sections: blocks(
      section(2, page.aVisao.heading, richTextToMarkdown(page.aVisao.body)),
      section(
        2,
        page.oMetodo.heading,
        richTextToMarkdown(page.oMetodo.body),
        bullets(page.oMetodo.tools.map((tool) => labelled(tool.title, tool.text))),
        paragraph(page.oMetodo.closingLine),
      ),
      section(2, page.mandala.heading, paragraph(page.mandala.intro)),
      section(
        2,
        page.oQueTrazem.heading,
        richTextToMarkdown(page.oQueTrazem.intro),
        paragraph(page.oQueTrazem.note),
        // Ordered I–III on the page, so ordered here.
        numbered(page.oQueTrazem.pillars.map((pillar) => labelled(pillar.title, pillar.text))),
        paragraph(page.oQueTrazem.boundary),
        paragraph(link(page.oQueTrazem.linkLabel, pageUrls.orientacaoProfissional)),
      ),
      section(
        2,
        page.sonhoAmpliado.heading,
        paragraph(page.sonhoAmpliado.intro),
        // Quoted speech: CONCEPT §9.3's example of a motif somebody brings to a
        // session, not prose in her name.
        quote(page.sonhoAmpliado.motif),
        bullets(page.sonhoAmpliado.parallels.map(parallel)),
        paragraph(page.sonhoAmpliado.closingLine),
      ),
      section(
        2,
        page.pratico.heading,
        // The fee comes from A Clínica, prepended exactly as `PraticoSection`
        // prepends it, so the twin quotes the price the page quotes (REQ-005).
        factBullets([
          ...twinFeeRows(ctx.clinica.fees, "analysis", ctx.labels),
          ...page.pratico.items,
        ]),
        paragraph(ctx.clinica.fees.internationalNote),
      ),
      section(
        2,
        page.paraComecar.heading,
        paragraph(page.paraComecar.body),
        paragraph(link(page.paraComecar.linkLabel, pageUrls.primeiraConversa)),
      ),
    ),
  });
}

/** One parallel beside the dream motif — dropped entirely while she has written no text for it. */
function parallel(item: DreamParallel): string | null {
  return item.text ? labelled(item.label, item.text) : null;
}
