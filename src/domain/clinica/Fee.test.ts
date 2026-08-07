import { describe, expect, it } from "vitest";
import { feeFrom } from "./Fee";

describe("feeFrom", () => {
  it("keeps a stated value", () => {
    expect(feeFrom("R$ 250")).toEqual({ kind: "stated", text: "R$ 250" });
  });

  it("trims a stated value", () => {
    expect(feeFrom("  R$ 250 ")).toEqual({ kind: "stated", text: "R$ 250" });
  });

  it.each([
    ["unset", undefined],
    ["null", null],
    ["empty", ""],
    ["whitespace only", "   "],
  ])("falls back to the to-be-discussed state when %s", (_case, stored) => {
    expect(feeFrom(stored)).toEqual({ kind: "toDiscuss" });
  });

  it("never yields a stated fee with empty text", () => {
    for (const stored of [undefined, null, "", " ", "\n\t"]) {
      const fee = feeFrom(stored);
      expect(fee.kind === "stated" && fee.text === "").toBe(false);
    }
  });
});
