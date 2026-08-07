import { credentialStrip } from "./credentialStrip";
import { blocks, bullets, heading, labelled, type MarkdownBlock, paragraph } from "./MarkdownBlock";
import type { TwinContext } from "./TwinContext";

// ---------------------------------------------------------------------------
// The frame every twin wears: the page's title, who you are talking to, the
// facts a machine needs before it reads anything, then the page's own lead and
// sections, then the way back to the index.
//
// **The frame is the same on all sixteen twins, and it mirrors the chrome rather
// than the page.** The rendered site carries her WhatsApp number in the header
// and her email and reach in the footer on every screen; a twin has no chrome, so
// the anchor facts move into the document. That is why /privacidade's twin also
// states the agenda and the credential strip: a client that entered there would
// otherwise have to fetch a second file to learn the two things every other
// visitor reads without asking.
//
// **What the frame does not carry is the `<meta>` description.** It is the same
// answer as the page's lead, compressed for a search snippet — and the twin
// already opens on the lead itself, under a title, under the positioning
// sentence, above a credential row that repeats the reach a third time. The
// description does its real work in `/llms.txt`, where one line per page *is* the
// document.
// ---------------------------------------------------------------------------

export type TwinBody = {
  /** The page's `h1`, from its own CMS field. */
  title: string;
  /** The front-loaded lead, already converted from the page's rich-text body. */
  lead: MarkdownBlock[];
  /** The page's sections, in the order the route renders them. */
  sections: MarkdownBlock[];
};

export function twinDocument(ctx: TwinContext, body: TwinBody): MarkdownBlock[] {
  const { clinica, labels } = ctx;

  return blocks(
    heading(1, body.title),
    // Where am I, and who will receive me here — the two questions CLAUDE.md
    // asks every screen to answer, with her positioning sentence verbatim.
    paragraph(
      `**${clinica.clinicName} · ${clinica.fullName}, ${clinica.role}** — ${clinica.positioning}`,
    ),
    bullets([
      labelled(labels.page, ctx.pageUrls[ctx.key]),
      labelled(labels.alternate, ctx.alternateUrl),
      labelled(labels.credentials, credentialStrip(clinica)),
      labelled(labels.availability, ctx.availabilityLine),
      labelled("WhatsApp", `${clinica.whatsappDisplay} · ${clinica.whatsappUrl}`),
      labelled(labels.email, clinica.email),
      labelled("Instagram", instagram(ctx)),
    ]),
    body.lead,
    body.sections,
    bullets([labelled(labels.index, ctx.indexUrl)]),
  );
}

function instagram({ clinica }: TwinContext): string | null {
  if (!clinica.instagramUrl) return null;

  return clinica.instagramHandle
    ? `${clinica.instagramHandle} · ${clinica.instagramUrl}`
    : clinica.instagramUrl;
}
