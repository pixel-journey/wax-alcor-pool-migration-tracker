/**
 * Share of a balance that has moved, in basis points.
 * Arguments only — no Alcor pool, fee tier, or chain is read.
 */

export type ShareOk = {
  ok: true;
  total: bigint;
  bps: bigint;
  /** 10000 - bps (floor share still left) */
  leftBps: bigint;
  /** true when moved === total */
  fullyMoved: boolean;
  /** true when moved === 0 */
  noneMoved: boolean;
};

export type ShareErr = { ok: false; reason: string };
export type Share = ShareOk | ShareErr;

export function movedShare(leftBehind: bigint, moved: bigint): Share {
  if (typeof leftBehind !== "bigint" || typeof moved !== "bigint") {
    return { ok: false, reason: "amounts must be bigint" };
  }
  if (leftBehind < 0n || moved < 0n) {
    return { ok: false, reason: "amounts must be non-negative" };
  }
  const total = leftBehind + moved;
  if (total === 0n) return { ok: false, reason: "both amounts are zero" };
  const bps = (moved * 10_000n) / total;
  const leftBps = 10_000n - bps;
  return {
    ok: true,
    total,
    bps,
    leftBps,
    fullyMoved: leftBehind === 0n,
    noneMoved: moved === 0n,
  };
}

export function assertShareInvariants(
  leftBehind: bigint,
  moved: bigint,
  s: ShareOk
): void {
  if (s.total !== leftBehind + moved) throw new Error("total mismatch");
  if (s.bps + s.leftBps !== 10_000n) throw new Error("bps + leftBps must be 10000");
  if (s.fullyMoved && leftBehind !== 0n) throw new Error("fullyMoved flag");
  if (s.noneMoved && moved !== 0n) throw new Error("noneMoved flag");
}

/** Sum legs then measure (educational multi-hop totals). */
export function fromLegs(
  leftBehind: bigint,
  movedLegs: readonly bigint[]
): Share {
  if (movedLegs.length < 1 || movedLegs.length > 32) {
    return { ok: false, reason: "pass 1 to 32 moved legs" };
  }
  let moved = 0n;
  for (const leg of movedLegs) {
    if (typeof leg !== "bigint" || leg < 0n) {
      return { ok: false, reason: "each leg must be a non-negative bigint" };
    }
    moved += leg;
  }
  return movedShare(leftBehind, moved);
}

export type TierLabel = string;

/**
 * Allocate `total` across labeled buckets; report bps per bucket (floor).
 * Remainders of the bps split are not redistributed (educational).
 */
export function allocationBps(
  amounts: readonly { label: TierLabel; amount: bigint }[]
): { ok: false; reason: string } | { ok: true; total: bigint; rows: { label: string; amount: bigint; bps: bigint }[] } {
  if (amounts.length < 1 || amounts.length > 16) {
    return { ok: false, reason: "pass 1 to 16 buckets" };
  }
  let total = 0n;
  for (const a of amounts) {
    if (typeof a.amount !== "bigint" || a.amount < 0n) {
      return { ok: false, reason: "amounts must be non-negative bigint" };
    }
    if (!a.label.trim()) return { ok: false, reason: "labels required" };
    total += a.amount;
  }
  if (total === 0n) return { ok: false, reason: "total is zero" };
  const rows = amounts.map((a) => ({
    label: a.label,
    amount: a.amount,
    bps: (a.amount * 10_000n) / total,
  }));
  return { ok: true, total, rows };
}

/** ASCII bar for moved bps (0–10 blocks). */
export function movedBar(leftBehind: bigint, moved: bigint): string {
  const s = movedShare(leftBehind, moved);
  if (!s.ok) return s.reason;
  const filled = Number(s.bps / 1_000n);
  const clamped = Math.max(0, Math.min(10, filled));
  return `[${"#".repeat(clamped)}${".".repeat(10 - clamped)}] ${s.bps.toString()} bps moved`;
}
