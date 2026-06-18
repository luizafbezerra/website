import { getAllPosts } from "@/app/actions/blog";
import { getFaq } from "@/app/actions/faq";
import { getIdentity } from "@/app/actions/identity";
import { Blog } from "@/core/blog";
import { NextResponse } from "next/server";

export const revalidate = 3600;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://example.com";

/** Human-readable token count: "~840 tokens" / "~1.4k tokens". */
function fmtTokens(n: number): string {
  return n >= 1000 ? `~${(n / 1000).toFixed(1)}k tokens` : `~${n} tokens`;
}

/**
 * Posts carry no body in the lightweight `getAllPosts` shape, so estimate from
 * reading time (≈200 words/min) bumped to tokens — Portuguese runs a little
 * over one token per word. Coarse on purpose; the exact count lives in each
 * `/blog/<slug>.md` front-matter.
 */
function postTokens(readingTimeMinutes: number): number {
  return Math.round(readingTimeMinutes * 200 * 1.4);
}

// Flat Markdown index of public content for AI agents (the /llms.txt
// convention). Front-loaded: the first lines answer who Luiza is, what she
// does, and how to reach her — agents have limited patience. Then a
// task-organized index with one-line descriptions, absolute URLs, and token
// counts. Served as text/plain regardless of the launch gate; harmless while
// robots.txt is locked.
export async function GET(): Promise<NextResponse> {
  const [identity, posts, faqEntries] = await Promise.all([
    getIdentity(),
    getAllPosts("pt-BR"),
    getFaq(),
  ]);

  // Computed from the live FAQ copy (cheap + accurate); Início/Mandala are
  // coarse page-size hints since their copy is spread across many components.
  const faqTokens = Blog.estimateTokens(
    faqEntries.map((e) => `${e.question} ${e.answer}`).join(" "),
  );

  const staticPages = [
    {
      title: "Início",
      url: `${BASE_URL}/`,
      description:
        "Quem é Luiza, a abordagem junguiana, as três frentes de trabalho (ansiedade & humor, relações & vida, carreira & propósito) e como marcar uma primeira conversa.",
      tokens: 900,
    },
    {
      title: "Perguntas frequentes",
      url: `${BASE_URL}/perguntas`,
      description:
        "Como funciona a primeira conversa, duração e frequência das sessões, atendimento online e presencial, sigilo.",
      tokens: faqTokens,
    },
    {
      title: "Mandala dos signos",
      url: `${BASE_URL}/simbolos`,
      description:
        "Mandala pintada com doze figuras zodiacais e vinte e sete nakshatras védicos — um mapa de ressonâncias arquetípicas, na tradição da psicologia analítica.",
      tokens: 1400,
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
  lines.push(
    "> Cada publicação do blog tem uma versão Markdown limpa em /blog/<slug>.md, pensada para leitura por agentes.",
  );
  lines.push("");

  // ── Páginas ──────────────────────────────────────────────────────────────
  lines.push("## Páginas");
  lines.push("");
  for (const page of staticPages) {
    lines.push(`- [${page.title}](${page.url}) — ${page.description} (${fmtTokens(page.tokens)})`);
  }
  lines.push("");

  // ── Escrita (blog) ─────────────────────────────────────────────────────────
  if (posts.length > 0) {
    lines.push("## Escrita (blog)");
    lines.push("");
    for (const post of posts) {
      const md = `${BASE_URL}/blog/${post.slug}.md`;
      lines.push(
        `- [${post.title}](${BASE_URL}/blog/${post.slug}) — ${post.description} (${fmtTokens(postTokens(post.readingTime))}; Markdown: ${md})`,
      );
    }
    lines.push("");
  }

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": `public, s-maxage=${revalidate}, stale-while-revalidate`,
    },
  });
}
