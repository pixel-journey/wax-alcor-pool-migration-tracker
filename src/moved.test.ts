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
    const full = movedShare(0n, 50n);
    expect(full.ok && full.fullyMoved && full.bps).toBe(10_000n);
    const none = movedShare(50n, 0n);
    expect(none.ok && none.noneMoved && none.bps).toBe(0n);
  });

  it("rejects both zero and negatives", () => {
    expect(movedShare(0n, 0n).ok).toBe(false);
    expect(movedShare(-1n, 1n).ok).toBe(false);
  });

  it("holds invariants across a sample grid", () => {
    for (const left of [0n, 1n, 25n, 50n, 99n]) {
      for (const moved of [0n, 1n, 25n, 50n, 100n]) {
        if (left === 0n && moved === 0n) continue;
        const s = movedShare(left, moved);
        expect(s.ok).toBe(true);
        if (s.ok) assertShareInvariants(left, moved, s);
      }
    }
  });
});

describe("fromLegs", () => {
  it("sums legs", () => {
    const s = fromLegs(25n, [50n, 25n]);
    expect(s.ok && s.bps).toBe(7500n);
  });
});

describe("allocationBps", () => {
  it("splits buckets and reports bpsSum ≤ 10000", () => {
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

  it("uneven amounts still floor", () => {
    const a = allocationBps([
      { label: "a", amount: 1n },
      { label: "b", amount: 1n },
      { label: "c", amount: 1n },
    ]);
    expect(a.ok).toBe(true);
    if (!a.ok) return;
    // 3333*3 = 9999
    expect(a.bpsSum).toBe(9999n);
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
  it("rejects out-of-range minBps", () => {
    expect(reachedThreshold(1n, 1n, 10_001n).ok).toBe(false);
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
  it("full move for 10000 target", () => {
    const r = movedToReachBps(40n, 10n, 10_000n);
    expect(r.ok && r.addMoved).toBe(40n);
  });
});
