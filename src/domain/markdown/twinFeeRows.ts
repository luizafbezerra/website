import type { Clinica } from "@/domain/clinica/Clinica";
import { feeQuoteFrom } from "@/domain/clinica/feeQuote";
import type { Fee } from "@/domain/clinica/Fee";
import type { FactRow } from "@/domain/pages/FactRow";
import type { TwinLabels } from "./TwinContext";

/**
 * Which price a twin quotes — the same rule the rendered page follows.
 *
 * A service page quotes its own service, /primeira-conversa quotes both doors,
 * and /internacional quotes none because it states money in its own USD/EUR terms
 * (CONCEPT §8.9 forbids an automatic conversion, and printing reais beside euros
 * is that conversion one step removed).
 *
 * This mirrors `src/view/general/useFeeRows.ts` deliberately rather than sharing
 * it: that module is a React hook — it reads its labels from `useTranslations` —
 * and the domain layer may not import from `src/view/` (CON-003). What matters is
 * that both read `feeQuoteFrom`, so the *rule* about an unset price being one row
 * rather than two is written once; only the label lookup differs.
 */
export type TwinFeeScope = "analysis" | "careerGuidance" | "both" | "none";

export function twinFeeRows(
  fees: Clinica["fees"],
  scope: TwinFeeScope,
  labels: TwinLabels,
): FactRow[] {
  const feeText = (fee: Fee) => (fee.kind === "stated" ? fee.text : labels.feeToDiscuss);

  if (scope === "none") return [];
  if (scope === "analysis") return [{ label: labels.fee, value: feeText(fees.analysis) }];
  if (scope === "careerGuidance") {
    return [{ label: labels.fee, value: feeText(fees.careerGuidance) }];
  }

  const quote = feeQuoteFrom(fees);
  if (quote.kind === "single") return [{ label: labels.fee, value: feeText(quote.fee) }];

  return [
    { label: labels.feeAnalysis, value: feeText(quote.analysis) },
    { label: labels.feeCareerGuidance, value: feeText(quote.careerGuidance) },
  ];
}
