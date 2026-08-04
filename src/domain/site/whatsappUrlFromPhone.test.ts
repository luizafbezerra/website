import { describe, expect, it } from "vitest";
import { IDENTITY_DEFAULTS } from "./Identity";
import { whatsappUrlFromPhone } from "./whatsappUrlFromPhone";

describe("whatsappUrlFromPhone", () => {
  it("strips every non-digit from an E.164 number", () => {
    expect(whatsappUrlFromPhone("+5511964158128")).toBe("https://wa.me/5511964158128");
  });

  it("strips the punctuation of a display-formatted number", () => {
    expect(whatsappUrlFromPhone("+55 (11) 96415-8128")).toBe("https://wa.me/5511964158128");
  });

  it("derives the same link from the stored phone and its display form", () => {
    expect(whatsappUrlFromPhone(IDENTITY_DEFAULTS.phoneDisplay)).toBe(
      whatsappUrlFromPhone(IDENTITY_DEFAULTS.phoneE164),
    );
  });

  it("keeps the default identity's derived link in sync with its phone number", () => {
    expect(IDENTITY_DEFAULTS.whatsappUrl).toBe(whatsappUrlFromPhone(IDENTITY_DEFAULTS.phoneE164));
  });
});
