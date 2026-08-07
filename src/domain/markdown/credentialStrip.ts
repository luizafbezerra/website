import type { Clinica } from "@/domain/clinica/Clinica";

/**
 * The credential strip of CONCEPT §8.8 as one line of text — the CRP first when
 * she has confirmed it, then the confirmed facts, in the order
 * `src/view/general/CredentialLine.tsx` prints them.
 *
 * Same data rule as the rendered strip: only what she has confirmed appears, the
 * CRP hides while it is blank, and deleting an item in the CMS removes it from
 * every surface at once — the twins and `/llms.txt` included.
 */
export function credentialStrip(clinica: Clinica): string | null {
  const items = [clinica.credential, ...clinica.credentials]
    .map((item) => item.trim())
    .filter(Boolean);

  return items.length > 0 ? items.join(" · ") : null;
}
