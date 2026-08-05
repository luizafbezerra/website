import { noteOpenersFor } from "@/domain/clinica/noteOpenersFor";
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
import type { PrimeiraConversa } from "@/domain/primeiraConversa/PrimeiraConversa";

/**
 * A primeira conversa's twin — the five sections of CONCEPT §6, in the page's own
 * order.
 *
 * This is the page an assistant is most likely to be *acting* from: somebody has
 * asked how to start. So the twin keeps the whole step sequence, the three
 * permissions, the fee for both doors, the four threshold doubts — and it quotes
 * the pre-written openers as text.
 *
 * **It quotes them; it does not link them.** On the page each opener is a tap that
 * opens WhatsApp with that message already composed, which is the attribution
 * system CONCEPT §8.1 describes: the arriving message names the door it came
 * through, with nothing tracked. Four prefilled deep links in a text file would
 * carry that attribution into a context where it is no longer true — the machine
 * chose the door, not the person — so the twin states the plain WhatsApp address
 * once, in its facts block, and shows the four openers as what to say.
 *
 * `noteOpenersFor` is the same rule the page uses, including its dropping of the
 * English opener on `/en`, where the other three are already English.
 */
export function primeiraConversaDoc(page: PrimeiraConversa, ctx: TwinContext): MarkdownBlock[] {
  const openers = noteOpenersFor(ctx.clinica.notes, ctx.locale);

  return twinDocument(ctx, {
    title: page.abertura.heading,
    lead: richTextToMarkdown(page.abertura.lead),
    sections: blocks(
      section(
        2,
        page.passoAPasso.heading,
        numbered(page.passoAPasso.steps.map((step) => labelled(step.title, step.text))),
      ),
      // No numerals: three permissions are not a sequence.
      section(2, page.permissoes.heading, bullets(page.permissoes.items)),
      section(
        2,
        page.logistica.heading,
        factBullets([
          ...twinFeeRows(ctx.clinica.fees, "both", ctx.labels),
          ...page.logistica.items,
        ]),
        paragraph(ctx.clinica.fees.internationalNote),
      ),
      section(
        2,
        page.miniFaq.heading,
        // Discrete Q&A blocks (CONCEPT §10), like /perguntas — the question as its
        // own heading, so a retrieval step can return one answer.
        ...page.miniFaq.items.map((item) => section(3, item.question, paragraph(item.answer))),
        paragraph(link(page.miniFaq.linkLabel, ctx.pageUrls.perguntas)),
      ),
      section(
        2,
        page.bilhete.heading,
        richTextToMarkdown(page.bilhete.intro),
        ...openers.map((opener) => quote(opener.text)),
      ),
    ),
  });
}
