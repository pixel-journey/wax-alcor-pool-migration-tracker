import { describe, expect, it } from "vitest";
import {
  allocationBps,
  assertShareInvariants,
  fromLegs,
  movedBar,
  movedShare,
} from "./moved";

describe("movedShare", () => {
  it("is 7500 bps when 75 of 100 has moved", () => {
    const s = movedShare(25n, 75n);
    expect(s).toEqual({
      ok: true,
      total: 100n,
      bps: 7500n,
      leftBps: 2500n,
      fullyMoved: false,
      noneMoved: false,
    });
    if (s.ok) assertShareInvariants(25n, 75n, s);
  });

  it("fully moved", () => {
    const s = movedShare(0n, 50n);
    expect(s.ok && s.fullyMoved).toBe(true);
    expect(s.ok && s.bps).toBe(10_000n);
  });

  it("none moved", () => {
    const s = movedShare(50n, 0n);
    expect(s.ok && s.noneMoved).toBe(true);
    expect(s.ok && s.bps).toBe(0n);
  });

  it("rejects both zero", () => {
    expect(movedShare(0n, 0n).ok).toBe(false);
  });
});

describe("fromLegs", () => {
  it("sums legs", () => {
    const s = fromLegs(25n, [50n, 25n]);
    expect(s.ok && s.bps).toBe(7500n);
  });
});

describe("allocationBps", () => {
  it("splits fee-tier style buckets", () => {
    const a = allocationBps([
      { label: "0.05%", amount: 20n },
      { label: "0.30%", amount: 50n },
      { label: "1.00%", amount: 30n },
    ]);
    expect(a.ok).toBe(true);
    if (!a.ok) return;
    expect(a.total).toBe(100n);
    expect(a.rows[1].bps).toBe(5000n);
  });
});

describe("movedBar", () => {
  it("includes bps", () => {
    expect(movedBar(25n, 75n)).toContain("7500");
  });
});
