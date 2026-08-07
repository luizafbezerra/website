import type { Inicio } from "@/domain/inicio/Inicio";
import {
  blocks,
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
import type { Testimonial } from "@/domain/testimonials/Testimonial";

/**
 * Início's twin — the eleven sections of CONCEPT §6 in the page's own order,
 * minus the two that are pure image.
 *
 * **The Cosmos slot and the Instagram tiles are not here.** The overture is a
 * scroll-driven set-piece whose copy is a caption for something a reader is
 * looking at, and the Instagram row is nine squares that open into paintings. A
 * twin that transcribed either would be describing the site rather than
 * answering the visitor's question. The Instagram *section* stays, because its
 * heading and its one line of prose say where her world is and the facts block
 * links it.
 *
 * The `h1` is the lockup — the clinic's name, with hers under it — so the twin's
 * title says the clinic's name and the identity line under it says it again with
 * her role attached. That repetition is the price of one rule ("the title is the
 * page's `h1`") holding for all eight pages, and the alternative was a title on
 * this one page that no rendered heading matches.
 */
export function inicioDoc(
  page: Inicio,
  testimonials: readonly Testimonial[],
  ctx: TwinContext,
): MarkdownBlock[] {
  const { pageUrls } = ctx;

  return twinDocument(ctx, {
    title: ctx.clinica.clinicName,
    lead: blocks(
      richTextToMarkdown(page.hero.lead),
      paragraph(link(page.hero.ctaSecondaryLabel, pageUrls.primeiraConversa)),
    ),
    sections: blocks(
      section(
        2,
        page.instagram.heading,
        paragraph(page.instagram.intro),
        paragraph(link(ctx.clinica.instagramHandle, ctx.clinica.instagramUrl)),
      ),
      section(
        2,
        page.doisCaminhos.heading,
        paragraph(page.doisCaminhos.intro),
        section(
          3,
          page.doisCaminhos.analysis.title,
          paragraph(page.doisCaminhos.analysis.body),
          paragraph(link(page.doisCaminhos.analysis.linkLabel, pageUrls.analise)),
        ),
        section(
          3,
          page.doisCaminhos.careerGuidance.title,
          paragraph(page.doisCaminhos.careerGuidance.body),
          paragraph(
            link(page.doisCaminhos.careerGuidance.linkLabel, pageUrls.orientacaoProfissional),
          ),
        ),
        // CONCEPT §4's routing sentence: which door answers which question.
        paragraph(page.doisCaminhos.boundary),
      ),
      section(
        2,
        page.oSintoma.heading,
        richTextToMarkdown(page.oSintoma.body),
        paragraph(link(page.oSintoma.linkLabel, pageUrls.analise)),
      ),
      section(
        2,
        page.sobreDigest.heading,
        richTextToMarkdown(page.sobreDigest.body),
        paragraph(link(page.sobreDigest.linkLabel, pageUrls.sobre)),
      ),
      section(
        2,
        page.brasilExterior.heading,
        paragraph(page.brasilExterior.body),
        paragraph(link(page.brasilExterior.linkLabel, pageUrls.internacional)),
      ),
      section(
        2,
        page.comoComecar.heading,
        numbered(page.comoComecar.beats.map((beat) => beat.text)),
        paragraph(link(page.comoComecar.linkLabel, pageUrls.primeiraConversa)),
      ),
      // SEC-002: `getTestimonials` drops every record without recorded consent
      // before this list exists, and an empty list produces no section at all —
      // the same gate the rendered page relies on, not a second one.
      section(2, page.vozes.heading, ...testimonials.map(voice)),
      section(
        2,
        page.contato.heading,
        richTextToMarkdown(page.contato.body),
        // The one hand-off on this page whose link text is chrome rather than her
        // copy, so the twin borrows the nav label.
        paragraph(link(ctx.pageLabels.perguntas, pageUrls.perguntas)),
      ),
    ),
  });
}

/** A voice: the quote, then the initial and the context (CONCEPT §11 — never a full name). */
function voice(testimonial: Testimonial): MarkdownBlock[] {
  const attribution = testimonial.context
    ? `${testimonial.attribution}, ${testimonial.context}`
    : testimonial.attribution;

  return blocks(quote(testimonial.body), paragraph(`— ${attribution}`));
}
