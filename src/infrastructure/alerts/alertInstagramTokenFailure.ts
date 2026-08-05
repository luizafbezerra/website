import type { Payload } from "payload";

/**
 * Tell a human that the Instagram token refresh keeps failing.
 *
 * The recipient is the developer, not Luiza: a dead token is a maintenance task
 * with a Meta dashboard at the end of it, and there is nothing she could do with
 * the message. That is why this reads `ALERT_EMAIL_TO` and not `CONTACT_EMAIL_TO`
 * — the contact address is where visitors' messages go.
 *
 * Degrades to `console.error` when Resend is not configured, because an alert
 * that throws would fail the job for a second reason and bury the first one.
 *
 * Not `server-only`: called from the refresh task, which also runs under the
 * Payload CLI.
 */
export async function alertInstagramTokenFailure(
  payload: Payload,
  error: unknown,
  consecutiveFailures: number,
): Promise<void> {
  const detail = error instanceof Error ? error.message : String(error);
  const recipient = process.env.ALERT_EMAIL_TO?.trim();
  const subject = `[Símbolos do Self] A renovação do token do Instagram falhou ${consecutiveFailures}× seguidas`;
  const text = [
    `A tarefa diária de renovar o token do Instagram falhou ${consecutiveFailures} vezes seguidas.`,
    "",
    `Último erro: ${detail}`,
    "",
    "O que isso significa agora: nada muda no site. O feed continua funcionando com o token atual",
    "até ele expirar (60 dias contados da última renovação bem-sucedida). Se o token expirar, a seção",
    "do Instagram simplesmente deixa de aparecer — nenhuma página quebra.",
    "",
    "O que fazer: gerar um novo token de usuário de longa duração no painel do Meta para",
    "@simbolos.do.self, atualizar INSTAGRAM_TOKEN na Vercel e limpar o campo do token no global",
    '"instagram-auth" para que o novo valor do ambiente volte a ser usado.',
  ].join("\n");

  if (!process.env.RESEND_API_KEY || !recipient) {
    console.error(`[instagram] ${subject}\n${text}`);
    return;
  }

  try {
    await payload.sendEmail({ to: recipient, subject, text });
  } catch (sendError) {
    payload.logger.error({
      msg: "[instagram] could not send the token-failure alert",
      err: sendError,
    });
    console.error(`[instagram] ${subject}\n${text}`);
  }
}
