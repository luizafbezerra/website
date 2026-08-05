import config from "../src/payload.config";
import { getPayload } from "payload";

/**
 * Show the state of the Instagram credential and its refresh history.
 *
 * The `instagram-auth` global is hidden from the admin and denies read over
 * HTTP by design, which leaves no window into it — this script is that window.
 * Run with `pnpm instagram:status` (talks to whatever database `.env.local`
 * points at).
 */

const DAY_MS = 24 * 60 * 60 * 1000;

function ago(iso: string | null | undefined): string {
  if (!iso) return "nunca";
  const days = (Date.now() - new Date(iso).getTime()) / DAY_MS;
  return `${iso} (${days.toFixed(1)} dias atrás)`;
}

async function main() {
  const payload = await getPayload({ config });

  const auth = (await payload.findGlobal({
    slug: "instagram-auth",
    overrideAccess: true,
    depth: 0,
  })) as {
    accessToken?: string | null;
    expiresAt?: string | null;
    lastRefreshedAt?: string | null;
    consecutiveFailures?: number | null;
    lastError?: string | null;
  };

  const token = auth?.accessToken?.trim();
  const envToken = process.env.INSTAGRAM_TOKEN?.trim();

  console.log("── instagram-auth ────────────────────────────────────────────");
  console.log(`token armazenado:      ${token ? `${token.slice(0, 8)}… (${token.length} chars)` : "nenhum"}`);
  console.log(`token do ambiente:     ${envToken ? `${envToken.slice(0, 8)}… (fallback)` : "nenhum"}`);
  console.log(`em uso agora:          ${token ? "o armazenado" : envToken ? "o do ambiente (bootstrap)" : "NENHUM — a seção está oculta"}`);

  if (auth?.expiresAt) {
    const remaining = (new Date(auth.expiresAt).getTime() - Date.now()) / DAY_MS;
    const flag = remaining < 7 ? "  ⚠ CRÍTICO" : remaining < 30 ? "  (janela de renovação)" : "";
    console.log(`expira em:             ${auth.expiresAt} (${remaining.toFixed(1)} dias)${flag}`);
  } else {
    console.log("expira em:             desconhecido — a próxima execução renova imediatamente");
  }

  console.log(`última renovação:      ${ago(auth?.lastRefreshedAt)}`);
  console.log(`falhas consecutivas:   ${auth?.consecutiveFailures ?? 0}`);
  if (auth?.lastError) console.log(`último erro:           ${auth.lastError}`);

  const jobs = await payload.find({
    collection: "payload-jobs",
    limit: 5,
    sort: "-createdAt",
    overrideAccess: true,
    depth: 0,
  });

  console.log("── últimas execuções (payload-jobs) ──────────────────────────");
  if (jobs.docs.length === 0) {
    console.log("nenhuma — o job ainda não rodou neste banco.");
  }
  for (const job of jobs.docs as unknown as Array<Record<string, unknown>>) {
    const state = job.hasError ? "FALHOU" : job.completedAt ? "ok" : "pendente";
    console.log(
      `${String(job.createdAt).slice(0, 19)}  ${state.padEnd(8)} tentativas=${job.totalTried ?? 0}  ${job.workflowSlug ?? job.taskSlug ?? ""}`,
    );
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
