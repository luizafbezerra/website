import {
  blocks,
  bullets,
  labelled,
  link,
  type MarkdownBlock,
  paragraph,
  section,
} from "@/domain/markdown/MarkdownBlock";
import { richTextToMarkdown } from "@/domain/markdown/richTextToMarkdown";
import type { TwinContext } from "@/domain/markdown/TwinContext";
import { twinDocument } from "@/domain/markdown/twinDocument";
import type { Privacidade } from "@/domain/privacidade/Privacidade";

/**
 * Privacidade's twin — CONCEPT §6's four sections plus the page's opening and the
 * one section the map has no room for.
 *
 * This is the page whose *English* version is written rather than fallen back to
 * (`PRIVACIDADE_DEFAULTS` is keyed by locale, uniquely on this page), and the twin
 * inherits that for free: it renders whatever `getPrivacidade(locale)` returns, so
 * `/llms/en/privacy.md` degrades to English even with Payload switched off.
 *
 * It is also the twin an agent is most likely to be asked to *summarise* — "does
 * this site track me?" — which is the argument for rendering both honest lists in
 * full rather than compressing them: the asymmetry between the short list of what
 * the site keeps and the long list of what it never does *is* the page's answer.
 */
export function privacidadeDoc(page: Privacidade, ctx: TwinContext): MarkdownBlock[] {
  return twinDocument(ctx, {
    title: page.abertura.heading,
    lead: richTextToMarkdown(page.abertura.body),
    sections: blocks(
      section(
        2,
        page.guarda.heading,
        bullets(page.guarda.items.map((item) => labelled(item.title, item.text))),
      ),
      section(
        2,
        page.nuncaFaz.heading,
        bullets(page.nuncaFaz.items.map((item) => labelled(item.title, item.text))),
      ),
      section(
        2,
        page.bilheteNota.heading,
        paragraph(page.bilheteNota.body),
        paragraph(link(page.bilheteNota.linkLabel, ctx.pageUrls.primeiraConversa)),
      ),
      section(
        2,
        page.responsavel.heading,
        richTextToMarkdown(page.responsavel.body),
        // Two facts kept as their own fields so either can be corrected alone: the
        // LGPD rights sentence, and the professional confidentiality that holds
        // regardless of anything else on the page.
        paragraph(page.responsavel.rights),
        paragraph(page.responsavel.confidentiality),
      ),
    ),
  });
}
