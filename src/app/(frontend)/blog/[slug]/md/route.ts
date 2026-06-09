import { getPost } from "@/app/actions/blog";
import { Blog } from "@/core/blog";
import { getPayloadSafe } from "@/lib/payload";
import { convertLexicalToMarkdown, editorConfigFactory } from "@payloadcms/richtext-lexical";
import { NextResponse } from "next/server";

export const revalidate = 3600;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://example.com";

/** Quote + escape a value so it is always a valid single-line YAML string. */
function yamlString(value: string): string {
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, " ")}"`;
}

// Clean Markdown source for a single post — no nav/footer chrome — so AI agents
// (and humans via "Copiar para IA") consume the article token-efficiently. Uses
// Payload's official `convertLexicalToMarkdown` with the same editor config the
// `posts.content` field is built from; no hand-rolled serializer.
//
// Reached at the public URL /blog/<slug>.md via a `beforeFiles` rewrite in
// next.config.ts (Next 16 won't reliably route a suffixed [slug].md segment).
// The defensive `.md` strip below keeps this correct whether the rewrite's
// `:slug` captures "<slug>" or "<slug>.md".
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
): Promise<NextResponse> {
  const { slug: rawSlug } = await params;
  const slug = rawSlug.replace(/\.md$/, "");

  let content: Awaited<ReturnType<typeof getPost>>["content"];
  let post: Awaited<ReturnType<typeof getPost>>["post"];
  try {
    const data = await getPost(slug, "pt-BR");
    content = data.content;
    post = data.post;
  } catch {
    return new NextResponse(null, { status: 404 });
  }

  const payload = await getPayloadSafe();
  if (!payload) return new NextResponse(null, { status: 404 });

  const editorConfig = await editorConfigFactory.default({ config: payload.config });
  const markdown = convertLexicalToMarkdown({ data: content, editorConfig });

  const canonical = `${BASE_URL}/blog/${slug}`;
  const body = `# ${post.title}\n\n${markdown.trim()}\n`;
  const tokenCount = Blog.estimateTokens(body);

  const frontMatter = [
    "---",
    `title: ${yamlString(post.title)}`,
    `description: ${yamlString(post.description)}`,
    `date: ${post.date}`,
    `canonical: ${canonical}`,
    `ai-token-count: ${tokenCount}`,
    "---",
  ].join("\n");

  return new NextResponse(`${frontMatter}\n\n${body}`, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": `public, s-maxage=${revalidate}, stale-while-revalidate`,
    },
  });
}
