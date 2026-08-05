import { useTranslations } from "next-intl";
import type { Clinica } from "@/domain/clinica/Clinica";
import { cn } from "@/view/styling/cn";

/**
 * The credential strip of CONCEPT §8.8 — who · how · from-where-to-where · what,
 * in one line on every core page: CRP · PUC-SP · desde 2014 · on-line · pt/en ·
 * Brasil e exterior.
 *
 * Set in body type, not in the decorative small-caps voice: DESIGN's
 * Marginalia-Is-Voice rule reserves marginalia for voice and puts operational
 * facts — credentials among them — where they can be read and acted on.
 *
 * Only client-confirmed facts appear here, which is a data rule rather than a
 * rendering one: the items come from A Clínica, the CRP hides while she has not
 * confirmed it in writing, and deleting an item in the CMS removes it from every
 * page at once.
 */

export function CredentialLine({ clinica, className }: { clinica: Clinica; className?: string }) {
  const t = useTranslations("chrome");
  const items = [clinica.credential, ...clinica.credentials].filter(Boolean);

  if (items.length === 0) return null;

  return (
    <ul
      aria-label={t("credentialLabel")}
      className={cn(
        "text-ink-soft flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 text-sm sm:justify-start",
        className,
      )}
    >
      {items.map((item, index) => (
        <li key={item} className="flex items-baseline gap-x-3">
          {index > 0 && (
            <span aria-hidden="true" className="text-terracotta">
              ·
            </span>
          )}
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
