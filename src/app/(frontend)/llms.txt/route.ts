import { NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";
import { getClinica } from "@/domain/clinica/getClinica";
import { credentialStrip } from "@/domain/markdown/credentialStrip";
import {
  blocks,
  bullets,
  heading,
  labelled,
  type MarkdownBlock,
  link,
  paragraph,
} from "@/domain/markdown/MarkdownBlock";
import { renderMarkdown } from "@/domain/markdown/renderMarkdown";
import { twinPath } from "@/domain/markdown/twinPath";
import { DEFAULT_LOCALE, type Locale, otherLocale, SITE_LOCALES } from "@/domain/site/Locale";
import { pagePath } from "@/domain/site/pagePath";
import { builtPages, type PageKey } from "@/domain/site/pages";
import { estimateTokens } from "@/domain/tokens/estimateTokens";
import { formatTokens } from "@/domain/tokens/formatTokens";
import { absoluteUrl, BASE_URL } from "@/infrastructure/env/baseUrl";
import { twinMarkdown } from "../llms/twinMarkdown";

/**
 * `/llms.txt` — the machine-readable index of everything public (REQ-011,
 * CONCEPT §10).
 *
 * Front-loaded, because agents budget their patience as well as their context: the
 * first lines answer who she is, what she does, how far the practice reaches and
 * how to reach her. Then one line per page per locale, each with its title, its
 * front-loaded description, its canonical URL, its Markdown twin and the twin's
 * measured size.
 *
 * **Everything here is derived.** The page list is `builtPages()` × locales from
 * the canonical registry, so the index cannot advertise a route that does not exist
 * or miss one that does; the addresses come from `pagePath` and `twinPath`; the
 * titles and descriptions are the same `meta.<key>` strings the pages' `<title>`
 * and `<meta name="description">` carry; and every token count is measured on the
 * bytes that twin actually serves. The version this replaced listed two of the
 * eight pages, with hand-written descriptions and one hand-kept size hint.
 *
 * **One bilingual file, not one per locale.** The convention puts this document at
 * the origin root, and a client that fetches it should discover the whole site
 * rather than half of it plus a pointer; a second index under `/en` would be a
 * second place for the identity block to go stale. So the identity is stated once,
 * in Portuguese with the English positioning sentence beside it, and the pages are
 * listed in two sections — each page's title and description in its own language.
 */

export const revalidate = 3600;

export async function GET(): Promise<NextResponse> {
  const [clinica, clinicaEn, labels] = await Promise.all([
    getClinica(DEFAULT_LOCALE),
    getClinica(otherLocale(DEFAULT_LOCALE)),
    getTranslations({ locale: DEFAULT_LOCALE, namespace: "chrome" }),
  ]);

  const sections = await Promise.all(SITE_LOCALES.map(pageSection));

  const document = blocks(
    heading(1, `${clinica.clinicName} — ${clinica.fullName}, ${clinica.role}`),
    paragraph(clinica.positioning),
    // The same sentence in English, so an anglophone client has the whole answer
    // before it reaches the second section. Identical strings mean the field is
    // still falling back to Portuguese, and one copy is enough.
    clinicaEn.positioning === clinica.positioning ? null : paragraph(clinicaEn.positioning),
    bullets([
      // The strip already states on-line · português e inglês · Brasil e exterior,
      // which the positioning sentence above states again in prose — a third
      // restatement of the reach would be noise, not front-loading.
      labelled(labels("credentialLabel"), credentialStrip(clinica)),
      labelled("WhatsApp", `${clinica.whatsappDisplay} · ${clinica.whatsappUrl}`),
      labelled(labels("footer.email"), clinica.email),
      clinica.instagramUrl
        ? labelled("Instagram", `${clinica.instagramHandle} · ${clinica.instagramUrl}`)
        : null,
      labelled("Site", BASE_URL),
      labelled("Sitemap", absoluteUrl("/sitemap.xml")),
    ]),
    ...sections,
  );

  return new NextResponse(renderMarkdown(document), {
    headers: {
      // `.txt`, so `text/plain`: this file is meant to be read in place, by a
      // crawler and by anyone checking what the crawler sees.
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": `public, s-maxage=${revalidate}, stale-while-revalidate`,
    },
  });
}

/** One locale's page list, in the registry's CONCEPT §6 order. */
async function pageSection(locale: Locale): Promise<MarkdownBlock[]> {
  const t = await getTranslations({ locale, namespace: "twin" });
  const lines = await Promise.all(builtPages().map((page) => pageLine(page.key, locale)));

  return blocks(heading(2, t("pages")), bullets(lines));
}

/**
 * `- [Title](url): description — markdown: <twin> (~1.2k tokens)`
 *
 * The llms.txt convention's own line shape, with the twin and its measured size
 * appended so a client can decide what to fetch before fetching it.
 */
async function pageLine(key: PageKey, locale: Locale): Promise<string> {
  // The `meta.<key>` namespace, read exactly as `pageMetadata` reads it, so an
  // index line and a `<title>` can never describe the same page differently.
  const meta = await getTranslations({ locale, namespace: `meta.${key}` });
  const url = absoluteUrl(pagePath(key, locale));
  const twinUrl = absoluteUrl(twinPath(key, locale));
  const tokens = formatTokens(estimateTokens(await twinMarkdown(key, locale)));

  const titled = link(meta("title"), url) ?? url;

  return `${titled}: ${meta("description")} — markdown: ${twinUrl} (${tokens})`;
}
