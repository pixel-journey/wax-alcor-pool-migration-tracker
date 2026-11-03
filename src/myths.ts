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
    reality: "Each bucket floors independently; bps may not sum to exactly 10000.",
  },
] as const;

export const GLOSSARY = [
  { term: "moved bps", meaning: "floor(moved * 10000 / total)." },
  { term: "leftBps", meaning: "10000 − moved bps (also floored pair)." },
  { term: "fromLegs", meaning: "Sum several moved amounts, then one movedShare." },
  {
    term: "allocationBps",
    meaning: "Floor share of each labeled bucket of a total.",
  },
] as const;
