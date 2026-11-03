export const MOVED_MYTHS = [
  {
    myth: "This tracks live Alcor fee-tier migrations",
    reality:
      "Pure moved / (left + moved) in bps from arguments. No pool or API is read.",
  },
  {
    myth: "7500 bps means something was swapped on-chain",
    reality: "It is arithmetic on the numbers you typed.",
  },
  {
    myth: "Basis points round up",
    reality: "Integer division floors. Dust of the ratio is discarded.",
  },
  {
    myth: "allocationBps rebalances remainders across tiers",
    reality:
      "Each bucket floors independently; bpsSum may be less than 10000.",
  },
] as const;

export const GLOSSARY = [
  { term: "moved bps", meaning: "floor(moved * 10000 / total)." },
  { term: "leftBps", meaning: "10000 − moved bps." },
  { term: "fromLegs", meaning: "Sum several moved amounts, then one movedShare." },
  {
    term: "allocationBps",
    meaning: "Floor share of each labeled bucket; reports bpsSum.",
  },
  {
    term: "movedToReachBps",
    meaning: "Extra moved needed (left fixed) to hit a target bps.",
  },
] as const;
