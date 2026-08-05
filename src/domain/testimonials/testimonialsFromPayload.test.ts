import { describe, expect, it } from "vitest";
import { testimonialsFromPayload } from "./testimonialsFromPayload";

const consented = {
  body: "Encontrei um lugar para pensar.",
  attribution: "M.",
  context: "análise",
  service: "analise",
  abroad: false,
  consentGiven: true,
};

describe("testimonialsFromPayload", () => {
  it("keeps a consented, complete quote", () => {
    expect(testimonialsFromPayload([consented])).toEqual([
      {
        body: "Encontrei um lugar para pensar.",
        attribution: "M.",
        context: "análise",
        service: "analise",
        abroad: false,
      },
    ]);
  });

  // SEC-002: consent gates rendering structurally, not by convention.
  it.each([
    ["consent is unchecked", { consentGiven: false }],
    ["consent is missing", { consentGiven: undefined }],
    ["consent is null", { consentGiven: null }],
  ])("drops a quote when %s", (_case, override) => {
    expect(testimonialsFromPayload([{ ...consented, ...override }])).toEqual([]);
  });

  it("drops incomplete quotes even when consent is recorded", () => {
    const docs = [
      { ...consented, body: "   " },
      { ...consented, attribution: "" },
      { ...consented, body: undefined },
    ];
    expect(testimonialsFromPayload(docs)).toEqual([]);
  });

  it("normalizes the optional fields", () => {
    const [testimonial] = testimonialsFromPayload([
      { ...consented, context: "  ", service: "coaching", abroad: undefined },
    ]);
    expect(testimonial).toMatchObject({ context: null, service: null, abroad: false });
  });

  it("reads the abroad flag, which CONCEPT wants at least one of", () => {
    const [testimonial] = testimonialsFromPayload([
      { ...consented, abroad: true, context: "análise, Lisboa" },
    ]);
    expect(testimonial).toMatchObject({ abroad: true, context: "análise, Lisboa" });
  });

  it("yields nothing for an empty collection, which hides the section", () => {
    expect(testimonialsFromPayload([])).toEqual([]);
  });
});
