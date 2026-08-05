import { describe, expect, it } from "vitest";
import { feeFrom } from "./Fee";
import { feeQuoteFrom } from "./feeQuote";

const fees = (analysis: string | null, careerGuidance: string | null) => ({
  analysis: feeFrom(analysis),
  careerGuidance: feeFrom(careerGuidance),
  internationalNote: null,
});

describe("feeQuoteFrom", () => {
  it("collapses to one line while both prices are still to be discussed", () => {
    expect(feeQuoteFrom(fees(null, null))).toEqual({
      kind: "single",
      fee: { kind: "toDiscuss" },
    });
  });

  it("quotes each door once either price is stated", () => {
    expect(feeQuoteFrom(fees("R$ 250 por sessão", null))).toEqual({
      kind: "perService",
      analysis: { kind: "stated", text: "R$ 250 por sessão" },
      careerGuidance: { kind: "toDiscuss" },
    });
  });

  // The mirror case, and the one a single-sided check would silently swallow:
  // orientação is the likelier price to be published first, since it is a bounded
  // program with a fixed scope. Collapsing here would hide the only price she set.
  it("quotes each door when only the career-guidance price is stated", () => {
    expect(feeQuoteFrom(fees(null, "R$ 3.000 pelo percurso"))).toEqual({
      kind: "perService",
      analysis: { kind: "toDiscuss" },
      careerGuidance: { kind: "stated", text: "R$ 3.000 pelo percurso" },
    });
  });

  it("quotes both doors when the two prices differ", () => {
    const quote = feeQuoteFrom(fees("R$ 250 por sessão", "R$ 3.000 pelo percurso"));

    expect(quote.kind).toBe("perService");
    if (quote.kind !== "perService") throw new Error("expected perService");
    expect(quote.analysis).toEqual({ kind: "stated", text: "R$ 250 por sessão" });
    expect(quote.careerGuidance).toEqual({ kind: "stated", text: "R$ 3.000 pelo percurso" });
  });

  it("reads a blank stored price as to-be-discussed, not as a price", () => {
    expect(feeQuoteFrom(fees("   ", "")).kind).toBe("single");
  });
});
