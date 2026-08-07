import config from "../src/payload.config";
import { getPayload } from "payload";

/**
 * Replace the stored Instagram token — the recovery path the alert email names.
 *
 * The `instagram-auth` global denies writes over HTTP and is hidden from the
 * admin, so when the stored token dies (expired beyond refresh, revoked, wrong
 * account) there is no way to replace it through the panel; this script is the
 * one door. It validates the new token against the Graph API before writing,
 * because saving a broken token would just move the failure one day later.
 *
 * `expiresAt` is deliberately written as null: the token's real expiry is
 * unknown here, and null makes the nightly workflow renew it immediately —
 * the refresh response is what knows the true date.
 *
 * Usage: `pnpm instagram:set-token <long-lived-user-token>`
 * (Talks to whatever database `.env.local` points at.)
 */

async function main() {
  const token = process.argv[2]?.trim();
  if (!token) {
    console.error("uso: pnpm instagram:set-token <token de usuário de longa duração>");
    process.exit(1);
  }

  console.log("Validando o token contra a Graph API…");
  const probe = await fetch(
    `https://graph.instagram.com/v25.0/me?fields=id,username&access_token=${encodeURIComponent(token)}`,
    { cache: "no-store" },
  );
  const body = (await probe.json().catch(() => null)) as {
    id?: string;
    username?: string;
    error?: { message?: string };
  } | null;

  if (!probe.ok || !body?.id) {
    console.error(`O token não funciona — nada foi gravado. Meta respondeu HTTP ${probe.status}:`);
    console.error(body?.error?.message ?? JSON.stringify(body));
    process.exit(1);
  }

  console.log(`Token válido para @${body.username ?? body.id}. Gravando…`);

  const payload = await getPayload({ config });
  await payload.updateGlobal({
    slug: "instagram-auth",
    overrideAccess: true,
    data: {
      accessToken: token,
      previousToken: null,
      expiresAt: null,
      lastRefreshedAt: null,
      consecutiveFailures: 0,
      lastError: null,
    },
  });

  console.log(
    "Gravado. A próxima execução do job renova o token imediatamente (expiresAt desconhecido) e registra a validade real.",
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
