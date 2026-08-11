import { describe, expect, it } from "vitest";
import { REACH } from "@/domain/clinica/reach";
import type { TwinLabels } from "./TwinContext";
import { twinReachRows } from "./twinReachRows";

const LABELS: Pick<TwinLabels, "reach"> = {
  reach: {
    eua: { label: "Estados Unidos", value: "Nova York" },
    canada: { label: "Canadá", value: "Toronto" },
    brasil: { label: "Brasil", value: "Brasília" },
    portugal: { label: "Portugal", value: "Lisboa" },
    inglaterra: { label: "Inglaterra", value: "Londres" },
    holanda: { label: "Holanda", value: "Amsterdã" },
  },
};

describe("twinReachRows", () => {
  it("names every place, country then city, in the strip's own order", () => {
    expect(twinReachRows(LABELS)).toEqual([
      { label: "Estados Unidos", value: "Nova York" },
      { label: "Canadá", value: "Toronto" },
      { label: "Brasil", value: "Brasília" },
      { label: "Portugal", value: "Lisboa" },
      { label: "Inglaterra", value: "Londres" },
      { label: "Holanda", value: "Amsterdã" },
    ]);
  });

  it("covers every place `REACH` declares, so a new country cannot go unlabelled", () => {
    expect(twinReachRows(LABELS)).toHaveLength(REACH.length);
  });

  // A twin is cached; an hour or an offset written into one would be wrong within
  // minutes, or wrong for weeks around a daylight-saving changeover.
  it("states no clock", () => {
    const text = twinReachRows(LABELS)
      .map((row) => `${row.label} ${row.value}`)
      .join(" ");

    expect(text).not.toMatch(/\d/);
  });

  // A half-added country — a `REACH` entry whose labels nobody wrote — drops out
  // rather than printing "undefined" into a document a machine reads.
  it("drops a place with no labels rather than printing a hole", () => {
    const missing = { reach: { brasil: LABELS.reach.brasil } };

    expect(twinReachRows(missing)).toEqual([{ label: "Brasil", value: "Brasília" }]);
  });
});
