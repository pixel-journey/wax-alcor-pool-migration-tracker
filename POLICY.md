# Policy — moved share

**Trust label:** `educational-reference`  
**Updated:** 2026-11-03

## In scope

- Pure `movedShare`, `fromLegs`, `allocationBps`, `movedBar`, `reachedThreshold`, `compareShares`, `movedToReachBps`, `parseLegs`
- Offline demo, share URL, exports

## Out of scope

- Live Alcor Sankey / fee-tier product
- Swap routing or on-chain migration claims
- Network calls from the measure path

## Rules

1. `npm test` never requires network.
2. Docs must not claim live pool TVL.
3. Prefer WharfKit if a future host adds intentional chain actions.
