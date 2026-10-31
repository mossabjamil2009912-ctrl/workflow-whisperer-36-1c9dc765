import { describe, it, expect } from "vitest";
import { tieredOptions, optionsForResBill, optionsForCom, dailyProduction } from "@/components/QuoteBuilder";

describe("three independence choices", () => {
  it("recommended = the right system (home bill 50,000)", () => expect(tieredOptions("res", "bill", 50000)!.rec).toBe(optionsForResBill(50000)[0]));
  it("less is smaller, more is larger", () => {
    const t = tieredOptions("res", "bill", 50000)!;
    expect(dailyProduction(t.low!)).toBeLessThan(dailyProduction(t.rec));
    expect(dailyProduction(t.high!)).toBeGreaterThan(dailyProduction(t.rec));
  });
  it("smallest system has no 'less'", () => expect(tieredOptions("res", "bill", 3000)!.low).toBeUndefined());
  it("diesel uses same rule", () => expect(tieredOptions("com", "diesel", 270)!.rec).toBe(optionsForCom("diesel", 270)[0]));
  it("largest home system: 'more' crosses into business", () => expect(tieredOptions("res", "bill", 106.9 * 30 * 290)!.high!.type).toBe("com"));
  it("tie: neither neighbour is one of the tied systems", () => {
    const tied = optionsForResBill(21750); const t = tieredOptions("res", "bill", 21750)!;
    expect(tied).not.toContain(t.low); expect(tied).not.toContain(t.high);
  });
});
