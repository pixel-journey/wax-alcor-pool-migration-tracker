/** Parse comma/space separated non-negative integer legs. */

export function parseLegs(
  text: string
): { ok: false; reason: string } | { ok: true; legs: bigint[] } {
  const parts = text
    .split(/[,\s]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length < 1 || parts.length > 32) {
    return { ok: false, reason: "enter 1 to 32 legs" };
  }
  const legs: bigint[] = [];
  for (const p of parts) {
    try {
      const n = BigInt(p);
      if (n < 0n) return { ok: false, reason: "legs must be non-negative" };
      legs.push(n);
    } catch {
      return { ok: false, reason: `invalid leg: ${p}` };
    }
  }
  return { ok: true, legs };
}
