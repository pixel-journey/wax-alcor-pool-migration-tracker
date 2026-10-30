export const MOVED_MYTHS = [
  {
    myth: "This tracks live Alcor fee-tier migrations",
    reality:
      "It only computes moved / (left + moved) in basis points from two arguments.",
  },
  {
    myth: "7500 bps means something was swapped on-chain",
    reality:
      "7500 bps is pure arithmetic for the numbers you typed. No pool is read.",
  },
  {
    myth: "Remainder is rounded up",
    reality:
      "bps uses integer division (floor). Dust of the ratio is discarded.",
  },
] as const;
