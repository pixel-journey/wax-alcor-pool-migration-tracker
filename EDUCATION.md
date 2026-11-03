# Education — moved share

## Pattern

```text
bps     = floor(moved * 10000 / (leftBehind + moved))
leftBps = 10000 - bps
```

## Teaching points

1. **Not live Alcor.** No fee-tier graph is fetched.
2. **Floor bps** — ratio dust is discarded; flags mark fully/none moved.
3. **fromLegs / parseLegs** only sum moved amounts before the same formula.
4. **allocationBps** multi-bucket floor split; `bpsSum` may be &lt; 10000.
5. **movedToReachBps** plans extra moved with left fixed — still not a swap route.
6. **reachedThreshold** is a boolean gate on the same integer bps.

## Worked examples

| left | moved | bps | leftBps |
|------|-------|-----|---------|
| 25 | 75 | 7500 | 2500 |
| 50 | 50 | 5000 | 5000 |
| 100 | 0 | 0 | 10000 |
| 0 | 100 | 10000 | 0 |
| 1 | 2 | 6666 | 3334 |

## Related

- `wax-lp-behavioral-profiler` · `wax-lp-fee-lifecycle-auditor` · `wax-lp-impermanent-loss-heat-map`
