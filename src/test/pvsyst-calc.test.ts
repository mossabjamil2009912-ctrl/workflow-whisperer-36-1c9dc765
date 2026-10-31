import { describe, it, expect } from "vitest";
import { parseSystem, simulate } from "@/lib/pvsyst-calc";
import { shapeArabic } from "@/lib/arabic-shape";

describe("simulation report numbers", () => {
  it("reference system (396 × 720 W) gives the reference yearly production", () => {
    const s = simulate({ kw: 50, invCount: 5.5, three: true, panels: 396, batKwh: 1018 });
    expect(s.kwp).toBe(285.12);
    expect(Math.abs(s.produced - 576816) / 576816).toBeLessThan(0.002);
    expect(Math.abs(s.specific - 2023)).toBeLessThanOrEqual(2);
  });
  it("reads the bot's system text", () => {
    expect(parseSystem("إنفرتر سوليس 50 كيلو وات 3 فاز جهد عالي × 2 | ألواح: 150 (108 ك.و) | بطاريات: 128 كيلو"))
      .toEqual({ kw: 50, invCount: 2, three: true, panels: 150, batKwh: 128 });
  });
  it("capacity is panels × 0.72 kWp and DC/AC ratio follows", () => {
    const s = simulate({ kw: 50, invCount: 2, three: true, panels: 150, batKwh: 128 });
    expect(s.kwp).toBe(108);
    expect(s.pnomRatio).toBe(1.08);
  });
  it("Latin names stay unchanged; Arabic names are reshaped", () => {
    expect(shapeArabic("Dhamran Sawan Center")).toBe("Dhamran Sawan Center");
    expect(shapeArabic("محمد")).not.toBe("محمد");
  });
});
