export type ShareState = {
  left: string;
  moved: string;
  useLegs: boolean;
  legsText: string;
  showTiers: boolean;
};

export function encodeShareState(s: ShareState): string {
  const q = new URLSearchParams();
  q.set("l", s.left);
  q.set("m", s.moved);
  if (s.useLegs) {
    q.set("legs", "1");
    q.set("g", s.legsText);
  }
  if (s.showTiers) q.set("tiers", "1");
  return q.toString();
}

export function decodeShareState(search: string): Partial<ShareState> {
  const q = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const out: Partial<ShareState> = {};
  if (q.has("l")) out.left = q.get("l") ?? undefined;
  if (q.has("m")) out.moved = q.get("m") ?? undefined;
  if (q.get("legs") === "1") {
    out.useLegs = true;
    out.legsText = q.get("g") ?? "";
  }
  if (q.get("tiers") === "1") out.showTiers = true;
  return out;
}
