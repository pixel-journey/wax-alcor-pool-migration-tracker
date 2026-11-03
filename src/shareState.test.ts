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
  });
});
