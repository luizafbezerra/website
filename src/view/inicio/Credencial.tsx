import type { Clinica } from "@/domain/clinica/Clinica";
import { CredentialLine } from "@/view/general/CredentialLine";

/**
 * Section 2 of CONCEPT §6 — one line of confirmed facts, set between the hero
 * and the Instagram bridge as a thin rule-bound band.
 *
 * Thin on purpose: the recognition rule (CONCEPT §5) gives the page ~1.5 mobile
 * screens before a follower must have seen a painting, and this strip sits
 * directly in that path. It earns its place by answering the cold searcher's
 * "is she qualified?" in a single glance, then getting out of the way.
 *
 * The facts themselves are A Clínica's, not this page's: the strip appears on
 * every core page (CONCEPT §8.8), so a per-page copy would drift the moment one
 * of the two was edited.
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
