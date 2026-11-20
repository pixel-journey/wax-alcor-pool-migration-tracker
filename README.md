# A moved share in basis points — not an Alcor tracker

> **Trust:** `educational-reference`  
> **Catalog:** `wax-ecosystem-blueprint-catalog` (private index; not this public course)

**One-sentence goal:** Teach `floor(moved * 10000 / (left + moved))`, multi-leg sums, floored bucket splits, and how much more must move to hit a target — from arguments, not from Alcor.

**Real code:** `npm test`. **Does not** read a pool, a fee tier, or a chain.

The course is [EDUCATION.md](EDUCATION.md).

## What is true (executed)

| Rule | Result |
| --- | --- |
| `movedShare(25n, 75n)` | 7500 bps |
| left 0, moved 50 | fully moved, 10000 |
| left 50, moved 0 | none moved, 0 |
| both zero or negative | refused |
| `fromLegs(25n, [50n, 25n])` | 7500 |
| buckets 20 / 50 / 30 | middle row 5000; sum ≤ 10000 |
| three 1-unit buckets | bpsSum 9999 |
| `reachedThreshold(25n, 75n, 7000n)` | met |
| compare 75/25 against 50/50 | delta 2500 |
| `movedToReachBps(100n, 0n, 5000n)` | add 100 |
| already at 7500, target 7000 | add 0 |
| target 10000 with 40 left | add 40 |

## What is in the repo

| Piece | Role |
| --- | --- |
| `src/moved.ts` | share, legs, allocation, threshold, reach |
| `src/moved.test.ts` | the executed rule |
| `src/Demo.tsx` | interactive pairs |
| Docs | EDUCATION · POLICY · SECURITY · VERIFICATION-LOG |

## Run

```bash
npm install
npm test
npm run dev
```

## Best practice and the opposite

**Do** pass bigint amounts you already fetched.  
**Do** expect floor dust on multi-bucket splits.  
**Do** treat labels as text.

**Do not** call this a live Sankey of Alcor fee tiers.  
**Do not** require `allocationBps` to sum to 10000.  
**Do not** infer "rotated" versus "exited" from a single moved number.

## Related

- [wax-lp-fee-lifecycle-auditor](https://github.com/pixel-journey/wax-lp-fee-lifecycle-auditor) — labels after a collect, not a pool read
- [wax-lp-impermanent-loss-heat-map](https://github.com/pixel-journey/wax-lp-impermanent-loss-heat-map) — full-range IL, not this moved-share
- [dust floors](https://github.com/pixel-journey/px-token-dust-truncation-visualizer) — why three 1-unit buckets sum to 9999
- Alcor itself is a different system. This file does not call it: [alcor-exchange](https://github.com/alcor-exchange)
- `px-treasury-incoming-fee-splitter` (the lab that *does* require 10000)

MIT — Pixel Journey
