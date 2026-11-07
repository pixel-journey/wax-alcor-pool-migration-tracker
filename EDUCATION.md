# Education — a moved share, not a migration tracker

> **Rung:** `npm test` passes. `movedShare` is `floor(moved * 10000 / (left + moved))`. No Alcor pool, fee tier, or chain is read.  
> **The test is the rule.**

## What you should be able to do

| Level | After this file |
| --- | --- |
| Beginner | Turn 75 moved and 25 left into 7500 bps |
| Intermediate | Sum legs, floor a three-bucket allocation, and compute how much more must move |
| Masterclass | Say why a label like `0.30%` is a string you passed, not a fee tier |

---

## Beginner — one scene

```ts
movedShare(25n, 75n)
// ok, bps 7500, leftBps 2500, fullyMoved false, noneMoved false
```

| Call | Result |
| --- | --- |
| `movedShare(0n, 50n)` | fully moved, 10000 bps |
| `movedShare(50n, 0n)` | none moved, 0 bps |
| `movedShare(0n, 0n)` | refused |
| negative | refused |

Amounts must be bigint. `bps + leftBps` is 10000 on every successful call the grid tests.

### Words

| Word | Meaning here |
| --- | --- |
| Left | Amount that stayed |
| Moved | Amount that left |
| bps | Floor of moved over total, in basis points |
| Leg | One of up to 32 moved amounts that get summed first |

### Predict, then run

```bash
npm test
```

1. `fromLegs(25n, [50n, 25n])` is also 7500.
2. `reachedThreshold(25n, 75n, 7000n)` is met.
3. `compareShares({ left: 25n, moved: 75n }, { left: 50n, moved: 50n })` has `bpsDelta` 2500.

---

## Intermediate — floors and the amount still needed

`allocationBps` of 20 / 50 / 30 gives the middle row 5000 bps. Sum of floors is ≤ 10000. Three equal 1-unit buckets sum to **9999**, not 10000. That is the floor. Do not copy the fee-splitter rule (must sum to 10000) onto this one.

`movedToReachBps`:

| Call | addMoved |
| --- | --- |
| left 100, moved 0, target 5000 | 100 |
| left 25, moved 75, target 7000 | 0 (already above) |
| left 40, moved 10, target 10000 | 40 (must move the rest) |

Target 10000 means left must become 0. Target 0 needs nothing more.

### Attack → test

| Attack | Naive code | This lab | Test |
| --- | --- | --- | --- |
| Divide by a zero total | Infinity | refused | `rejects both zero and negatives` |
| Claim three equal buckets sum to 10000 | Lost 1 bp | 9999 | `uneven amounts still floor` |
| Treat a string label as a live fee tier | Fake Alcor read | label is just a string | allocation test uses `"0.05%"` as text |
| Round the share up | Overstate migration | floor | 75/100 is exactly 7500; the invariant grid locks floor sums |

---

## Masterclass — arguments are not a Sankey

A product that wants real migration must fetch balances, decide what "moved" means, and pass two bigints. This file does not know a pool id, a fee tier, or a timestamp. The labels in `allocationBps` are whatever you typed.

Still absent:

- An Alcor API call.
- A distinction between a fee-tier rotation and an exit. Both are just "moved" here.
- Time. Two snapshots are not in the type.

`leftBps` is `10000 - bps`, so the pair sums exactly even when the floor dropped a unit into the left side. That is intentional for the two-bucket share. The multi-bucket `allocationBps` does **not** do that repair. Do not mix them.

### Exercise

1. 25 left, 75 moved. bps? (7500. Tested.)
2. Why is the three-way 1/1/1 sum 9999? (Floor of 10000/3 is 3333. Three of those is 9999. Tested.)
3. Does this repo know the 0.30% Alcor tier? (No. `"0.30%"` is a label in a test.)

---

## What this course will not teach

- A live migration tracker
- Fee-tier economics
- That capital "rotated" rather than left
