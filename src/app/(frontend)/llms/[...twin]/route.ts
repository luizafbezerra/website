import { NextResponse } from "next/server";
import { TWIN_PREFIX, twinEntries, twinFromSegments } from "@/domain/markdown/twinPath";
import { twinMarkdown } from "../twinMarkdown";

/**
 * The Markdown twins — every content page, in both locales, as clean Markdown for
 * the machine audience (REQ-011, CONCEPT §10). PRODUCT ranks AI agents and LLM
 * search as a co-equal audience, so this mirror is that audience's version of the
 * whole site rather than a courtesy file.
 *
 * `src/domain/markdown/twinPath.ts` owns the addresses and explains them: the
 * `.md` extension is what keeps a twin out of the locale middleware, so a client
 * with no cookie and no `Accept-Language` gets the document in one request with no
 * redirect, and the `/llms` prefix is what lets this one catch-all serve all
 * sixteen from the registry instead of sixteen static folders duplicating the slug
 * map.
 *
 * All sixteen are prerendered from the registry. An address that is not one of
 * them 404s rather than guessing, because a machine that mistyped a twin should
 * learn that rather than receive a plausible other page.
 */

// One hour, matching the content pages. The page globals' `afterChange` hooks
// revalidate `pagePath(key, locale)` and do not yet know the twin addresses, so
// until they do this interval is what bounds an edit's staleness here — see the
// plan's execution notes.
export const revalidate = 3600;

export function generateStaticParams() {
  return twinEntries().map((entry) => ({
    twin: entry.path.slice(`${TWIN_PREFIX}/`.length).split("/"),
  }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ twin: string[] }> },
): Promise<NextResponse> {
  const { twin } = await params;
  const target = twinFromSegments(twin);
  if (!target) return new NextResponse("Not found", { status: 404 });

  const body = await twinMarkdown(target.key, target.locale);

  return new NextResponse(body, {
    headers: {
      // The correct type for the extension. Agents read the bytes; a browser
      // offers to save the file, which is the right trade for a machine mirror.
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": `public, s-maxage=${revalidate}, stale-while-revalidate`,
    },
  });
}
