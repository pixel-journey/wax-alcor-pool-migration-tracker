import { describe, expect, it } from "vitest";
import {
  allocationBps,
  assertShareInvariants,
  compareShares,
  fromLegs,
  movedBar,
  movedShare,
  movedToReachBps,
  reachedThreshold,
} from "./moved";

describe("movedShare", () => {
  it("is 7500 bps when 75 of 100 has moved", () => {
    const s = movedShare(25n, 75n);
    expect(s.ok && s.bps).toBe(7500n);
    if (s.ok) assertShareInvariants(25n, 75n, s);
  });

  it("fully / none moved", () => {
    expect(movedShare(0n, 50n).ok && movedShare(0n, 50n).fullyMoved).toBe(true);
    expect(movedShare(50n, 0n).ok && movedShare(50n, 0n).noneMoved).toBe(true);
  });

  it("rejects both zero", () => {
    expect(movedShare(0n, 0n).ok).toBe(false);
  });
});

describe("fromLegs", () => {
  it("sums legs", () => {
    expect(fromLegs(25n, [50n, 25n]).ok && fromLegs(25n, [50n, 25n]).bps).toBe(7500n);
  });
});

describe("allocationBps", () => {
  it("splits buckets and reports bpsSum", () => {
    const a = allocationBps([
      { label: "0.05%", amount: 20n },
      { label: "0.30%", amount: 50n },
      { label: "1.00%", amount: 30n },
    ]);
    expect(a.ok).toBe(true);
    if (!a.ok) return;
    expect(a.rows[1].bps).toBe(5000n);
    expect(a.bpsSum).toBeLessThanOrEqual(10_000n);
  });
});

describe("movedBar", () => {
  it("includes bps", () => {
    expect(movedBar(25n, 75n)).toContain("7500");
  });
});

describe("reachedThreshold", () => {
  it("met at 7500 when min 7000", () => {
    expect(reachedThreshold(25n, 75n, 7000n)).toEqual({
      ok: true,
      met: true,
      bps: 7500n,
    });
  });
});

describe("compareShares", () => {
  it("delta between two pairs", () => {
    const c = compareShares(
      { left: 25n, moved: 75n },
      { left: 50n, moved: 50n }
    );
    expect(c.ok && c.bpsDelta).toBe(2500n);
  });
});

describe("movedToReachBps", () => {
  it("from 0 moved toward 5000 with 100 left", () => {
    const r = movedToReachBps(100n, 0n, 5000n);
    expect(r.ok && r.addMoved).toBe(100n);
  });
  it("already above target needs 0", () => {
    const r = movedToReachBps(25n, 75n, 7000n);
    expect(r.ok && r.addMoved).toBe(0n);
  });
});
