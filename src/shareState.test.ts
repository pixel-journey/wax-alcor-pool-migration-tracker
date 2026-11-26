import { describe, expect, it } from "vitest";
import { decodeShareState, encodeShareState } from "./shareState";

describe("shareState", () => {
  it("round-trips", () => {
    const raw = encodeShareState({
      left: "25",
      moved: "75",
      useLegs: false,
      legsText: "",
      showTiers: true,
    });
    const d = decodeShareState(raw);
    expect(d.left).toBe("25");
    expect(d.moved).toBe("75");
    expect(d.showTiers).toBe(true);
    expect(d.useLegs).toBeUndefined();
  });

  it("round-trips legs mode", () => {
    const raw = encodeShareState({
      left: "0",
      moved: "0",
      useLegs: true,
      legsText: "50,25,25",
      showTiers: false,
    });
    const d = decodeShareState(raw);
    expect(d.useLegs).toBe(true);
    expect(d.legsText).toBe("50,25,25");
    expect(d.showTiers).toBeUndefined();
  });

  it("accepts a leading question mark on decode", () => {
    const raw = encodeShareState({
      left: "10",
      moved: "90",
      useLegs: false,
      legsText: "",
      showTiers: false,
    });
    const d = decodeShareState(`?${raw}`);
    expect(d.left).toBe("10");
    expect(d.moved).toBe("90");
  });
});
