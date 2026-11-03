"use client";

const CASES = [
  {
    title: "Three-quarters moved",
    body: "left 25, moved 75 → 7500 bps. Arguments only.",
  },
  {
    title: "Fully moved",
    body: "left 0 → fullyMoved, 10000 bps.",
  },
  {
    title: "Multi-leg",
    body: "fromLegs sums moved amounts then applies the same formula.",
  },
  {
    title: "Tier allocation",
    body: "allocationBps floors each bucket; bpsSum may be under 10000.",
  },
  {
    title: "Not live Alcor",
    body: "No fee-tier graph or pool TVL is fetched in this package.",
  },
] as const;

export function Cases() {
  return (
    <section aria-label="Teaching cases" style={{ marginTop: "2rem" }}>
      <h2 style={{ fontSize: "1rem" }}>Cases</h2>
      <ul style={{ paddingLeft: "1.2rem", fontSize: "0.9rem" }}>
        {CASES.map((c) => (
          <li key={c.title} style={{ marginBottom: "0.5rem" }}>
            <strong>{c.title}.</strong> {c.body}
          </li>
        ))}
      </ul>
    </section>
  );
}
