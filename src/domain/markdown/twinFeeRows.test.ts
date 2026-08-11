import { describe, expect, it } from "vitest";
import { CLINICA_DEFAULTS } from "@/domain/clinica/Clinica";
import { feeFrom } from "@/domain/clinica/Fee";
import type { TwinLabels } from "./TwinContext";
import { twinFeeRows } from "./twinFeeRows";

const LABELS = {
  fee: "Valor",
  feeAnalysis: "Valor · análise",
  feeCareerGuidance: "Valor · orientação profissional",
  feeToDiscuss: "A combinar antes da primeira sessão.",
} as TwinLabels;

const BOTH_UNSET = CLINICA_DEFAULTS.fees;
const BOTH_STATED = {
  ...BOTH_UNSET,
  analysis: feeFrom("R$ 250 por sessão"),
  careerGuidance: feeFrom("R$ 3.000 pelo percurso"),
};

describe("twinFeeRows", () => {
  it("quotes nothing where the page quotes nothing", () => {
    expect(twinFeeRows(BOTH_STATED, "none", LABELS)).toEqual([]);
  });

  it("quotes one service on a service page, and only its own", () => {
    expect(twinFeeRows(BOTH_STATED, "analysis", LABELS)).toEqual([
      { label: "Valor", value: "R$ 250 por sessão" },
    ]);
    expect(twinFeeRows(BOTH_STATED, "careerGuidance", LABELS)).toEqual([
      { label: "Valor", value: "R$ 3.000 pelo percurso" },
    ]);
  });

  it("says 'a combinar' once while both prices are unset, rather than twice", () => {
    expect(twinFeeRows(BOTH_UNSET, "both", LABELS)).toEqual([
      { label: "Valor", value: "A combinar antes da primeira sessão." },
    ]);
  });

  it("labels the two doors apart once either price is set", () => {
    expect(twinFeeRows(BOTH_STATED, "both", LABELS)).toEqual([
      { label: "Valor · análise", value: "R$ 250 por sessão" },
      { label: "Valor · orientação profissional", value: "R$ 3.000 pelo percurso" },
    ]);
  });

  it("falls back to 'a combinar' for whichever half is still unset", () => {
    const onlyAnalysis = { ...BOTH_UNSET, analysis: feeFrom("R$ 250 por sessão") };

    expect(twinFeeRows(onlyAnalysis, "both", LABELS)).toEqual([
      { label: "Valor · análise", value: "R$ 250 por sessão" },
      { label: "Valor · orientação profissional", value: "A combinar antes da primeira sessão." },
    ]);
    expect(twinFeeRows(onlyAnalysis, "careerGuidance", LABELS)).toEqual([
      { label: "Valor", value: "A combinar antes da primeira sessão." },
    ]);
  });
});
