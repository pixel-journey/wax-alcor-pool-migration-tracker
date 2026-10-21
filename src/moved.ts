/**
 * Share of a balance that has moved, in basis points.
 * Both amounts are arguments. No pool is read.
 */

export type Share = { ok: false; reason: string } | { ok: true; total: bigint; bps: bigint };

export function movedShare(leftBehind: bigint, moved: bigint): Share {
  if (leftBehind < 0n || moved < 0n) return { ok: false, reason: "amounts must be non-negative" };
  const total = leftBehind + moved;
  if (total === 0n) return { ok: false, reason: "both amounts are zero" };
  return { ok: true, total, bps: (moved * 10_000n) / total };
}
