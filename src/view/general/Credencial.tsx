import type { Clinica } from "@/domain/clinica/Clinica";
import { CredentialLine } from "@/view/general/CredentialLine";
import { cn } from "@/view/styling/cn";

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
 *
 * `width` has to match the opening the band sits under, because a strip that
 * starts 190px left of the `h1` above it reads as a different page's furniture.
 * Início's opening is a wide two-column spread; a text page's is a reading column.
 */
export function Credencial({
  clinica,
  width = "wide",
}: {
  clinica: Clinica;
  width?: "column" | "wide";
}) {
  const hasFacts = clinica.credential !== "" || clinica.credentials.length > 0;
  if (!hasFacts) return null;

  return (
    <div className="border-rule-soft border-y px-6 py-6 sm:px-10">
      <CredentialLine
        clinica={clinica}
        className={cn("mx-auto", width === "wide" ? "max-w-6xl" : "max-w-3xl")}
      />
    </div>
  );
}
