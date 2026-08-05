import { getFaq } from "@/domain/faq/getFaq";
import { getClinica } from "@/domain/clinica/getClinica";
import { DEFAULT_LOCALE } from "@/domain/site/Locale";
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
  // Still a single pt-BR index: TASK-043 rebuilds this from the page registry
  // with one file per locale, alongside the Markdown twins.
  const [clinica, faqEntries] = await Promise.all([
    getClinica(DEFAULT_LOCALE),
    getFaq(DEFAULT_LOCALE),
  ]);

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
        "Como funciona a primeira conversa, duração e frequência das sessões, atendimento on-line no Brasil e no exterior, sigilo.",
      tokens: faqTokens,
    },
  ];

  const lines: string[] = [];

  // ── Front-loaded identity ────────────────────────────────────────────────
  lines.push(`# ${clinica.clinicName} — por ${clinica.fullName}, ${clinica.role}`);
  lines.push("");
  lines.push(clinica.positioning);
  lines.push("");
  lines.push("- Atendimento: on-line, para todo o Brasil e exterior");
  lines.push("- Idiomas: português e inglês");
  if (clinica.credential) lines.push(`- Registro: ${clinica.credential}`);
  lines.push(`- WhatsApp: ${clinica.whatsappDisplay} — ${clinica.whatsappUrl}`);
  if (clinica.email) lines.push(`- E-mail: ${clinica.email}`);
  if (clinica.instagramUrl)
    lines.push(`- Instagram: ${clinica.instagramHandle} — ${clinica.instagramUrl}`);
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
