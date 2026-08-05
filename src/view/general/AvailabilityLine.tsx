import { useTranslations } from "next-intl";
import type { Clinica } from "@/domain/clinica/Clinica";
import { cn } from "@/view/styling/cn";

/**
 * One honest line about her agenda (CONCEPT §8.2) plus the response window.
 *
 * The third state — "sem novos atendimentos no momento, escreva e eu aviso" —
 * is the anti-urgency move: it stops messages from falling into silence, and it
 * is why the site needs no scarcity mechanics at all. The state is a stored
 * choice; the wording of each case is localized chrome, so the three sentences
 * are written once here instead of twice in the CMS.
 *
 * Body type, never decorative small caps: an availability state is an
 * operational fact someone acts on (DESIGN, the Marginalia-Is-Voice rule).
 */

export function AvailabilityLine({ clinica, className }: { clinica: Clinica; className?: string }) {
  const t = useTranslations("chrome.availability");
  const { state, responseWindow } = clinica.availability;

  return (
    <p className={cn("text-ink-soft text-sm", className)}>
      <span>{t(state)}</span>
      {responseWindow && <span className="text-quill"> {responseWindow}</span>}
    </p>
  );
}
