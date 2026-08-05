import {
  blocks,
  bullets,
  link,
  type MarkdownBlock,
  paragraph,
  section,
} from "@/domain/markdown/MarkdownBlock";
import { richTextToMarkdown } from "@/domain/markdown/richTextToMarkdown";
import type { TwinContext } from "@/domain/markdown/TwinContext";
import { twinDocument } from "@/domain/markdown/twinDocument";
import type { FormacaoItem, Sobre } from "@/domain/sobre/Sobre";

/**
 * Sobre's twin — the four sections of CONCEPT §6 after the page's opening.
 *
 * This is the page the entity graph points its `Person` node at, so it is also
 * the twin most likely to be the answer to "who is this psychologist": the
 * academic record is therefore rendered in full, one row per line, and a row with
 * no confirmed year prints with no year rather than with a guess (the domain
 * defaults leave `period` unset on all six for exactly that reason).
 *
 * Her portrait slot and her scanned signature are not mentioned. The closing line
 * above the signature is, because it is the last thing she says on the page.
 *
 * CON-002 binds the English twin as it binds the page: she is a clinical
 * psychologist working in the Jungian tradition, never a "Jungian analyst" — and
 * because every string here comes from the CMS, the register is hers to keep
 * rather than this file's to enforce.
 */
export function sobreDoc(page: Sobre, ctx: TwinContext): MarkdownBlock[] {
  return twinDocument(ctx, {
    title: page.abertura.heading,
    lead: richTextToMarkdown(page.abertura.lead),
    sections: blocks(
      section(2, page.quemE.heading, richTextToMarkdown(page.quemE.body)),
      section(2, page.formacao.heading, bullets(page.formacao.items.map(formacaoLine))),
      section(
        2,
        page.aClinica.heading,
        richTextToMarkdown(page.aClinica.body),
        paragraph(link(page.aClinica.linkLabel, ctx.pageUrls.primeiraConversa)),
      ),
      // No heading of its own on the page either: the signature closes the
      // reading column, and nothing follows a signature.
      paragraph(page.assinatura.closingLine),
    ),
  });
}

/** `Graduação em Psicologia — PUC-SP (2003)`, at whatever precision she has confirmed. */
function formacaoLine(item: FormacaoItem): string | null {
  const title = item.title?.trim();
  if (!title) return null;

  const institution = item.institution?.trim();
  const period = item.period?.trim();

  return [title, institution && `— ${institution}`, period && `(${period})`]
    .filter(Boolean)
    .join(" ");
}
