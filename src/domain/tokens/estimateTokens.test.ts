import { describe, expect, it } from "vitest";
import { estimateTokens } from "./estimateTokens";
import { formatTokens } from "./formatTokens";

describe("estimateTokens", () => {
  it("counts nothing for empty text", () => {
    expect(estimateTokens("")).toBe(0);
  });

  it("rounds a partial token up, so a count is never understated", () => {
    expect(estimateTokens("abcd")).toBe(1);
    expect(estimateTokens("abcde")).toBe(2);
  });

  it("grows with the length of the body", () => {
    expect(estimateTokens("a".repeat(400))).toBeGreaterThan(estimateTokens("a".repeat(40)));
  });
});

describe("formatTokens", () => {
  it("writes small counts in whole tokens", () => {
    expect(formatTokens(840)).toBe("~840 tokens");
  });

  it("switches to thousands at a thousand", () => {
    expect(formatTokens(1000)).toBe("~1.0k tokens");
    expect(formatTokens(1400)).toBe("~1.4k tokens");
  });

  it("keeps 999 below the threshold", () => {
    expect(formatTokens(999)).toBe("~999 tokens");
  });
});
