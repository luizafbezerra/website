import { describe, expect, it } from "vitest";
import { CLINICA_DEFAULTS } from "./Clinica";
import { whatsappUrlFromPhone } from "./whatsappUrlFromPhone";

describe("whatsappUrlFromPhone", () => {
  it("strips every non-digit from an E.164 number", () => {
    expect(whatsappUrlFromPhone("+5511964158128")).toBe("https://wa.me/5511964158128");
  });

  it("strips the punctuation of a display-formatted number", () => {
    expect(whatsappUrlFromPhone("+55 (11) 96415-8128")).toBe("https://wa.me/5511964158128");
  });

  it("derives the same link from the stored phone and its display form", () => {
    expect(whatsappUrlFromPhone(CLINICA_DEFAULTS.whatsappDisplay)).toBe(
      whatsappUrlFromPhone(CLINICA_DEFAULTS.whatsappE164),
    );
  });

  it("keeps the clinic defaults' derived link in sync with its phone number", () => {
    expect(CLINICA_DEFAULTS.whatsappUrl).toBe(whatsappUrlFromPhone(CLINICA_DEFAULTS.whatsappE164));
  });
});
