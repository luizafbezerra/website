import config from "@payload-config";
import fs from "node:fs";
import path from "node:path";
import { getPayload, type Payload } from "payload";

/**
 * One-shot content export, run before the CONCEPT v3 teardown (plan
 * TASK-001 / RISK-003). The rebuild drops the blog, the `home-*` globals,
 * `mandala` and `settings`, and reconciles the schema with a destructive
 * `migrate:fresh`. Everything Luiza (or the seed) ever wrote must survive that
 * as readable prose, so the new page globals can be re-seeded from a document
 * instead of from a database that no longer exists.
 *
 * Run with `pnpm export:content` (preloads the no-schema-push shim, so opening
 * Payload against a real database can never mutate it).
 *
 * Reads whatever the *connected* database holds — for the local dev branch that
 * is mostly seeded defaults. Values Luiza edited only in production live on her
 * Neon account, unreachable from here, so the export ends with a manual
 * checklist for a pass over the production `/admin`.
 */

const OUTPUT_PATH = path.join(process.cwd(), "docs", "content-export-2026-08.md");

/** Documents holding credentials, not content — never exported. */
const EXCLUDED_COLLECTION_SLUGS: ReadonlySet<string> = new Set(["users"]);

/** Payload's own bookkeeping collections (migrations, locks, jobs) share this prefix. */
const SYSTEM_COLLECTION_PREFIX = "payload-";

/** Payload bookkeeping and upload derivatives: structure, not editorial content. */
const OMITTED_FIELD_NAMES: ReadonlySet<string> = new Set([
  "id",
  "_id",
  "createdAt",
  "updatedAt",
  "globalType",
  "sizes",
  "thumbnailURL",
  "mimeType",
  "filesize",
  "width",
  "height",
  "focalX",
  "focalY",
]);

/** Documents per collection page; high enough that every collection fits in one read. */
const COLLECTION_PAGE_SIZE = 500;

const INDENT = "  ";

// ── Lexical flattening ──────────────────────────────────────────────────────
//
// Rich-text fields are stored as a Lexical editor state. Dumping that JSON
// would make the export unreadable, and the export exists to be read, so each
// state is flattened to its paragraphs. Typed structurally rather than imported
// from `lexical` because this script must keep running after the blog (and its
// lexical dependencies) are deleted.

type LexicalNode = {
  type?: string;
  text?: string;
  children?: LexicalNode[];
};

type LexicalEditorState = { root: LexicalNode };

function isLexicalEditorState(value: unknown): value is LexicalEditorState {
  if (typeof value !== "object" || value === null) return false;
  const root = (value as { root?: unknown }).root;
  return (
    typeof root === "object" &&
    root !== null &&
    Array.isArray((root as { children?: unknown }).children)
  );
}

function nodeToText(node: LexicalNode): string {
  if (typeof node.text === "string") return node.text;
  return (node.children ?? []).map(nodeToText).join("");
}

/** Top-level Lexical blocks as separate lines, blank ones dropped. */
function lexicalToParagraphs(state: LexicalEditorState): string[] {
  return (state.root.children ?? []).map(nodeToText).filter((line) => line.trim().length > 0);
}

// ── Markdown rendering ──────────────────────────────────────────────────────

function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

/** Continuation lines of a multi-line value, aligned under its bullet. */
function continuation(lines: string[], indent: string): string[] {
  return lines.map((line) => `${indent}${INDENT}${line}`);
}

function renderValue(label: string, value: unknown, depth: number): string[] {
  const indent = INDENT.repeat(depth);
  const bullet = `${indent}- **${label}**`;

  if (isLexicalEditorState(value)) {
    const paragraphs = lexicalToParagraphs(value);
    if (paragraphs.length === 0) return [];
    if (paragraphs.length === 1) return [`${bullet}: ${paragraphs[0]}`];
    return [
      bullet,
      ...continuation(
        paragraphs.map((p) => `- ${p}`),
        indent,
      ),
    ];
  }

  if (Array.isArray(value)) {
    const items = value.filter((item) => !isEmpty(item));
    if (items.length === 0) return [];
    const lines = [bullet];
    items.forEach((item, index) => {
      if (typeof item === "object" && item !== null) {
        lines.push(`${indent}${INDENT}- _${index + 1}._`);
        lines.push(...renderObject(item as Record<string, unknown>, depth + 2));
      } else {
        lines.push(`${indent}${INDENT}- ${String(item)}`);
      }
    });
    return lines;
  }

  if (typeof value === "object" && value !== null) {
    const nested = renderObject(value as Record<string, unknown>, depth + 1);
    return nested.length === 0 ? [] : [bullet, ...nested];
  }

  const text = String(value);
  const textLines = text.split("\n").filter((line) => line.trim().length > 0);
  if (textLines.length <= 1) return [`${bullet}: ${text}`];
  return [
    bullet,
    ...continuation(
      textLines.map((line) => `- ${line}`),
      indent,
    ),
  ];
}

function renderObject(doc: Record<string, unknown>, depth: number): string[] {
  return Object.entries(doc)
    .filter(([key, value]) => !OMITTED_FIELD_NAMES.has(key) && !isEmpty(value))
    .flatMap(([key, value]) => renderValue(key, value, depth));
}

/**
 * Payload's generated document types are closed shapes with no index signature,
 * while the renderer walks fields generically — this is the one narrowing point
 * where that is stated instead of repeated at every call site.
 */
function asFields(doc: object): Record<string, unknown> {
  return doc as Record<string, unknown>;
}

// ── Export ──────────────────────────────────────────────────────────────────

/** Payload labels can be a string, a per-language record, or a React component. */
function labelToText(label: unknown, fallback: string): string {
  if (typeof label === "string") return label;
  if (typeof label === "object" && label !== null) {
    const pt = (label as Record<string, unknown>).pt;
    if (typeof pt === "string") return pt;
  }
  return fallback;
}

async function exportGlobals(payload: Payload): Promise<string[]> {
  const lines = ["## Globais", ""];

  for (const global of payload.config.globals) {
    lines.push(`### ${labelToText(global.label, global.slug)} — \`${global.slug}\``, "");
    try {
      const doc = await payload.findGlobal({
        slug: global.slug,
        depth: 1,
        overrideAccess: true,
      });
      const body = renderObject(asFields(doc), 0);
      lines.push(...(body.length > 0 ? body : ["_Sem valores gravados._"]), "");
    } catch (error) {
      lines.push(`_Leitura falhou: ${(error as Error).message}_`, "");
    }
  }

  return lines;
}

async function exportCollections(payload: Payload): Promise<string[]> {
  const lines = ["## Coleções", ""];

  for (const collection of payload.config.collections) {
    if (collection.slug.startsWith(SYSTEM_COLLECTION_PREFIX)) continue;
    if (EXCLUDED_COLLECTION_SLUGS.has(collection.slug)) continue;

    const label = labelToText(collection.labels?.plural ?? collection.slug, collection.slug);
    try {
      const { docs } = await payload.find({
        collection: collection.slug,
        limit: COLLECTION_PAGE_SIZE,
        depth: 1,
        overrideAccess: true,
        pagination: false,
        draft: true,
      });

      lines.push(
        `### ${label} — \`${collection.slug}\` (${docs.length} ${docs.length === 1 ? "documento" : "documentos"})`,
        "",
      );

      if (docs.length === 0) {
        lines.push("_Nenhum documento._", "");
        continue;
      }

      docs.forEach((doc, index) => {
        const fields = asFields(doc);
        lines.push(`#### ${index + 1}. ${describeDocument(fields)}`, "");
        lines.push(...renderObject(fields, 0), "");
      });
    } catch (error) {
      lines.push(`### ${label} — \`${collection.slug}\``, "");
      lines.push(`_Leitura falhou: ${(error as Error).message}_`, "");
    }
  }

  return lines;
}

/** First recognizable human label on a document, for its heading. */
function describeDocument(doc: Record<string, unknown>): string {
  for (const key of ["title", "question", "name", "filename", "slug"]) {
    const value = doc[key];
    if (typeof value === "string" && value.trim().length > 0) return value;
  }
  return String(doc.id ?? "documento");
}

function header(): string[] {
  return [
    "# Exportação de conteúdo — agosto de 2026",
    "",
    "Snapshot textual do CMS **antes** da reconstrução CONCEPT v3 (`plan/architecture-site-restructure-1.md`,",
    "TASK-001). Gerado por `pnpm export:content` a partir do banco conectado no momento da execução.",
    "",
    "Serve a dois propósitos: preservar a cópia que a Luiza escreveu antes do `migrate:fresh` destrutivo",
    "(RISK-003) e alimentar os defaults de seed dos novos globais de página (TASK-026).",
    "",
    "Campos vazios, IDs, datas de sistema e derivados de upload são omitidos. Textos ricos aparecem",
    "achatados em parágrafos.",
    "",
    "> **Pendência manual:** valores editados apenas em produção vivem na conta Neon da Luiza, inacessível",
    "> daqui. Antes da migração destrutiva, confira no `/admin` de produção os campos que sabemos divergir",
    '> dos defaults do código (ex.: CRP gravado, seções ativas da home) e cole-os abaixo, em "Ajustes de',
    '> produção".',
    "",
    "## Ajustes de produção",
    "",
    "_Preencher manualmente a partir do `/admin` de produção._",
    "",
  ];
}

async function main(): Promise<void> {
  const payload = await getPayload({ config });
  payload.logger.info("Exporting CMS content …");

  const lines = [
    ...header(),
    ...(await exportGlobals(payload)),
    ...(await exportCollections(payload)),
  ];

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, `${lines.join("\n").trimEnd()}\n`, "utf8");

  payload.logger.info(`Wrote ${path.relative(process.cwd(), OUTPUT_PATH)}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
