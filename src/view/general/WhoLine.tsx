import { useTranslations } from "next-intl";
import type { Clinica } from "@/domain/clinica/Clinica";
import { cn } from "@/view/styling/cn";

/**
 * The byline under a service page's `h1` — one clause answering "who will
 * receive me here?" on the pages that no longer carry the credential band
 * (the 2026-08 condensation kept the band on Início and /sobre only).
 *
 * Composed from A Clínica, never typed into a page: the name is `fullName` and
 * the CRP renders only once she has confirmed it in writing — the same data rule
 * the credential strip follows (CONCEPT §8.8). Body type, not marginalia:
 * credentials are operational facts (DESIGN's Marginalia-Is-Voice rule).
 */
export function WhoLine({ clinica, className }: { clinica: Clinica; className?: string }) {
  const t = useTranslations("chrome");

  return (
    <p className={cn("text-ink-soft text-sm", className)}>
      {t("whoLine", { name: clinica.fullName })}
      {clinica.credential && (
        <>
          <span aria-hidden="true" className="text-terracotta">
            {" · "}
          </span>
          {clinica.credential}
        </>
      )}
    </p>
  );
}
