/**
 * Share of a balance that has moved, in basis points.
 * Arguments only — no Alcor pool, fee tier, or chain is read.
 */

export type ShareOk = {
  ok: true;
  total: bigint;
  bps: bigint;
  leftBps: bigint;
  fullyMoved: boolean;
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

export function allocationBps(
  amounts: readonly { label: TierLabel; amount: bigint }[]
): {
  ok: false;
  reason: string;
} | {
  ok: true;
  total: bigint;
  rows: { label: string; amount: bigint; bps: bigint }[];
  /** Sum of floored bps — may be < 10000 */
  bpsSum: bigint;
} {
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
  const bpsSum = rows.reduce((acc, r) => acc + r.bps, 0n);
  return { ok: true, total, rows, bpsSum };
}

export function movedBar(leftBehind: bigint, moved: bigint): string {
  const s = movedShare(leftBehind, moved);
  if (!s.ok) return s.reason;
  const filled = Number(s.bps / 1_000n);
  const clamped = Math.max(0, Math.min(10, filled));
  return `[${"#".repeat(clamped)}${".".repeat(10 - clamped)}] ${s.bps.toString()} bps moved`;
}

/** Whether moved share has reached a target bps threshold. */
export function reachedThreshold(
  leftBehind: bigint,
  moved: bigint,
  minBps: bigint
): { ok: false; reason: string } | { ok: true; met: boolean; bps: bigint } {
  if (minBps < 0n || minBps > 10_000n) {
    return { ok: false, reason: "minBps must be 0..10000" };
  }
  const s = movedShare(leftBehind, moved);
  if (!s.ok) return s;
  return { ok: true, met: s.bps >= minBps, bps: s.bps };
}

/** Compare two independent (left, moved) pairs. */
export function compareShares(
  a: { left: bigint; moved: bigint },
  b: { left: bigint; moved: bigint }
): { ok: false; reason: string } | { ok: true; a: ShareOk; b: ShareOk; bpsDelta: bigint } {
  const sa = movedShare(a.left, a.moved);
  const sb = movedShare(b.left, b.moved);
  if (!sa.ok) return sa;
  if (!sb.ok) return sb;
  return { ok: true, a: sa, b: sb, bpsDelta: sa.bps - sb.bps };
}

/** Amount still needed to reach target moved bps (assuming left fixed). */
export function movedToReachBps(
  leftBehind: bigint,
  currentMoved: bigint,
  targetBps: bigint
): { ok: false; reason: string } | { ok: true; addMoved: bigint } {
  if (leftBehind < 0n || currentMoved < 0n) {
    return { ok: false, reason: "amounts must be non-negative" };
  }
  if (targetBps < 0n || targetBps > 10_000n) {
    return { ok: false, reason: "targetBps must be 0..10000" };
  }
  if (targetBps === 10_000n) {
    // need leftBehind → 0, so move everything still left
    return { ok: true, addMoved: leftBehind };
  }
  if (targetBps === 0n) {
    return { ok: true, addMoved: 0n };
  }
  // need moved / (left + moved) >= target/10000
  // 10000 * moved >= target * (left + moved)
  // 10000 * moved - target * moved >= target * left
  // moved * (10000 - target) >= target * left
  // moved >= ceil(target * left / (10000 - target))
  const denom = 10_000n - targetBps;
  const needMoved = (targetBps * leftBehind + denom - 1n) / denom;
  const add = needMoved > currentMoved ? needMoved - currentMoved : 0n;
  return { ok: true, addMoved: add };
}
