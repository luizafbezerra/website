import type { GlobalConfig } from "payload";

/**
 * The rotating Instagram credential — machine state, not content.
 *
 * Instagram-Login tokens expire after 60 days and are renewed by *exchanging*
 * one for the next, so the live token is a value that changes on its own and
 * cannot live in an environment variable: a Vercel env var would be stale from
 * the second refresh onward and would need a human to paste a new one every two
 * months, which is exactly the loop this closes. `INSTAGRAM_TOKEN` stays as the
 * bootstrap and the fallback (see `resolveInstagramToken`); this global is the
 * source of truth once the daily job has run once.
 *
 * **The first hidden and locked global in the repo, deliberately.** Every other
 * global is something Luiza edits. This one holds a bearer credential and a
 * failure log, so:
 *   · `admin.hidden` — it never appears in her sidebar. There is nothing here she
 *     could usefully change, and a token pasted into the wrong box breaks the
 *     feed silently.
 *   · `access.read: () => false` and `access.update: () => false` — the REST and
 *     GraphQL APIs deny everyone, including logged-in admins, so the token can
 *     never be read back over HTTP. Server code reaches it with
 *     `overrideAccess: true`, which is the same convention every accessor in
 *     `src/infrastructure/payload/` already uses; the difference is that here the
 *     override is the *only* door.
 *
 * Not localized (a token has no language), not seeded (there is nothing sensible
 * to write on a fresh database — the env bootstrap covers day one), and no
 * revalidate hook (rotating the credential changes no rendered copy; the feed's
 * own ISR window is what refreshes the page).
 */
export const InstagramAuth: GlobalConfig = {
  slug: "instagram-auth",
  label: "Instagram — credencial",
  admin: { hidden: true, group: "Sistema" },
  access: { read: () => false, update: () => false },
  fields: [
    {
      name: "accessToken",
      type: "text",
      label: "Token de acesso",
      admin: { description: "Escrito pela tarefa diária de renovação. Não editar à mão." },
    },
    {
      name: "previousToken",
      type: "text",
      label: "Token anterior",
      admin: {
        description:
          "O token que a última renovação substituiu, guardado um passo atrás para diagnóstico.",
      },
    },
    {
      name: "expiresAt",
      type: "date",
      label: "Expira em",
      admin: { description: "Cerca de 60 dias após a última renovação bem-sucedida." },
    },
    { name: "lastRefreshedAt", type: "date", label: "Última renovação" },
    {
      name: "consecutiveFailures",
      type: "number",
      label: "Falhas consecutivas",
      defaultValue: 0,
      admin: { description: "Volta a zero na primeira renovação bem-sucedida. Alerta em 3." },
    },
    { name: "lastError", type: "textarea", label: "Último erro" },
  ],
};
