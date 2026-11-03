export const SCENARIOS = [
  { id: "75", label: "75 of 100", left: "25", moved: "75" },
  { id: "half", label: "50/50", left: "50", moved: "50" },
  { id: "none", label: "none moved", left: "100", moved: "0" },
  { id: "all", label: "all moved", left: "0", moved: "100" },
] as const;

export const SAMPLE_TIERS = [
  { label: "0.05%", amount: "20" },
  { label: "0.30%", amount: "50" },
  { label: "1.00%", amount: "30" },
] as const;
