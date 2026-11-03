# Education — moved share

## Pattern

```text
bps = floor(moved * 10000 / (leftBehind + moved))
```

## Teaching points

1. **Not live Alcor.** No fee-tier graph is fetched.
2. **Floor bps** can leave a ratio dust (bps + leftBps = 10000 by construction here).
3. **fromLegs** only sums moved amounts before the same formula.
4. **allocationBps** is a multi-bucket floor split for teaching labels like 0.05% / 0.30% / 1.00% — still static arguments.

## Related

- `wax-lp-behavioral-profiler` · `wax-lp-fee-lifecycle-auditor` · `wax-lp-impermanent-loss-heat-map`
