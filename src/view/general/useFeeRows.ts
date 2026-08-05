import { useTranslations } from "next-intl";
import type { Clinica } from "@/domain/clinica/Clinica";
import type { Fee } from "@/domain/clinica/Fee";
import { feeQuoteFrom } from "@/domain/clinica/feeQuote";
import type { FactRow } from "@/domain/pages/FactRow";

/**
 * Which price a page quotes.
 *
 * A service page quotes its own service and nothing else — printing the
 * orientação price on /analise would ask a reader to compare two things they
 * are not choosing between. `both` belongs to the pages that serve both doors
 * (/primeira-conversa), and `none` to a page that states no price at all.
 */
export type FeeScope = "analysis" | "careerGuidance" | "both" | "none";

/**
 * The fee rows of a prático list, composed from A Clínica rather than from any
 * page's own fields (REQ-005): the price is quoted on four pages, so one edit in
 * the admin has to change all four.
 *
 * "A combinar" is localized chrome, not stored copy — the wording of an absent
 * price belongs to the site, so she never types it in two languages. Whether an
 * unset price is one row or two is a rule, and it lives in `feeQuoteFrom`.
 */
export function useFeeRows(fees: Clinica["fees"], scope: FeeScope): FactRow[] {
  const t = useTranslations("pratico");
  const feeText = (fee: Fee) => (fee.kind === "stated" ? fee.text : t("feeToDiscuss"));

  if (scope === "none") return [];
  if (scope === "analysis") return [{ label: t("fee"), value: feeText(fees.analysis) }];
  if (scope === "careerGuidance") {
    return [{ label: t("fee"), value: feeText(fees.careerGuidance) }];
  }

  const quote = feeQuoteFrom(fees);
  if (quote.kind === "single") return [{ label: t("fee"), value: feeText(quote.fee) }];

  return [
    { label: t("feeAnalysis"), value: feeText(quote.analysis) },
    { label: t("feeCareerGuidance"), value: feeText(quote.careerGuidance) },
  ];
}
