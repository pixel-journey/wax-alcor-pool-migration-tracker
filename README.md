# wax-alcor-pool-migration-tracker

> **Trust label:** `educational-reference`  
> **Status:** Full-thrust + polish (2026-11-03)  
> **Catalog:** [wax-ecosystem-blueprint-catalog](https://github.com/pixel-journey/wax-ecosystem-blueprint-catalog)

**One-sentence goal:** Teach **moved / (left + moved)** in basis points — with pure, unit-tested helpers — without claiming to track live Alcor fee-tier migrations.

The repository name is historical. The code is a share / allocation lab.

## What is actually in the repo

| Piece | Role |
|-------|------|
| `src/moved.ts` | `movedShare`, legs, allocation, threshold, compare, planner, bar |
| `src/parse.ts` | `parseLegs` |
| `src/*.test.ts` | Executed claims + sample grid |
| `src/Demo.tsx` | Scenarios, planner, compare, tiers, export, share URL, print |
| `EDUCATION.md` / `ARCHITECTURE.md` / `POLICY.md` / `SECURITY.md` | Teaching + boundaries |

## Quick start

```bash
npm install
npm test
npm run dev
```

```ts
import { movedShare } from "./src/moved";

movedShare(25n, 75n);
// bps: 7500, leftBps: 2500
```

## Related

- `wax-lp-behavioral-profiler` · `wax-lp-fee-lifecycle-auditor` · `wax-lp-impermanent-loss-heat-map`

## License

MIT — Pixel Journey
