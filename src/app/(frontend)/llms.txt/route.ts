import { getFaq } from "@/domain/faq/getFaq";
import { getIdentity } from "@/domain/site/getIdentity";
import { estimateTokens } from "@/domain/tokens/estimateTokens";
import { formatTokens } from "@/domain/tokens/formatTokens";
import { NextResponse } from "next/server";

export const revalidate = 3600;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://example.com";

/**
 * The home page's copy is spread across many components, so its size is a
 * hand-kept hint rather than a computed count. Phase 7 (TASK-043) rebuilds this
 * file from the page registry and the Markdown twins, where every count is real.
 */
const HOME_TOKENS_HINT = 900;

// Flat Markdown index of public content for AI agents (the /llms.txt
// convention). Front-loaded: the first lines answer who Luiza is, what she
// does, and how to reach her — agents have limited patience. Then a
// task-organized index with one-line descriptions, absolute URLs, and token
// counts. Served as text/plain regardless of the launch gate; harmless while
// robots.txt is locked.
export async function GET(): Promise<NextResponse> {
  const [identity, faqEntries] = await Promise.all([getIdentity(), getFaq()]);

  // Computed from the live FAQ copy — cheap and accurate.
  const faqTokens = estimateTokens(
    faqEntries.map((entry) => `${entry.question} ${entry.answer}`).join(" "),
  );

  const pages = [
    {
      title: "Início",
      url: `${BASE_URL}/`,
      description:
        "Quem é Luiza, a abordagem junguiana, as três frentes de trabalho (ansiedade & humor, relações & vida, carreira & propósito) e como marcar uma primeira conversa.",
      tokens: HOME_TOKENS_HINT,
    },
    {
      title: "Perguntas frequentes",
      url: `${BASE_URL}/perguntas`,
      description:
        "Como funciona a primeira conversa, duração e frequência das sessões, atendimento online e presencial, sigilo.",
      tokens: faqTokens,
    },
  ];

  const lines: string[] = [];

  // ── Front-loaded identity ────────────────────────────────────────────────
  lines.push(`# ${identity.fullName} — ${identity.role}`);
  lines.push("");
  lines.push(identity.tagline);
  lines.push("");
  lines.push(`- Tradição: ${identity.tradition}`);
  lines.push(
    `- Atendimento: presencial em ${identity.city}–${identity.region}; online em todo o ${identity.country}; idioma pt-BR`,
  );
  if (identity.credential) lines.push(`- Registro: ${identity.credential}`);
  lines.push(`- WhatsApp: ${identity.phoneDisplay} — ${identity.whatsappUrl}`);
  if (identity.email) lines.push(`- E-mail: ${identity.email}`);
  if (identity.instagramUrl)
    lines.push(`- Instagram: ${identity.instagramHandle} — ${identity.instagramUrl}`);
  lines.push(`- Site: ${BASE_URL}`);
  lines.push("");

  // ── Páginas ──────────────────────────────────────────────────────────────
  lines.push("## Páginas");
  lines.push("");
  for (const page of pages) {
    lines.push(
      `- [${page.title}](${page.url}) — ${page.description} (${formatTokens(page.tokens)})`,
    );
  }
  lines.push("");

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": `public, s-maxage=${revalidate}, stale-while-revalidate`,
    },
  });
}
