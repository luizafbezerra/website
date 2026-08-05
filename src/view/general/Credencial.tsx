import type { Clinica } from "@/domain/clinica/Clinica";
import { CredentialLine } from "@/view/general/CredentialLine";

/**
 * The credential strip as a page band — one line of confirmed facts directly
 * under a page's opening, bounded by hairline rules (CONCEPT §6, §8.8).
 *
 * Thin on purpose. It earns its place by answering the cold searcher's "is she
 * qualified?" in a single glance and then getting out of the way; on Início it
 * also sits inside the ~1.5 mobile screens the recognition rule (CONCEPT §5)
 * allows before a painting must appear, so height here is borrowed from art.
 *
 * The facts themselves are A Clínica's, not any page's: the strip appears on
 * every core page, so a per-page copy would drift the moment one was edited.
 */
export function Credencial({ clinica }: { clinica: Clinica }) {
  const hasFacts = clinica.credential !== "" || clinica.credentials.length > 0;
  if (!hasFacts) return null;

  return (
    <div className="border-rule-soft border-y px-6 py-6 sm:px-10">
      <CredentialLine clinica={clinica} className="mx-auto max-w-6xl" />
    </div>
  );
}
