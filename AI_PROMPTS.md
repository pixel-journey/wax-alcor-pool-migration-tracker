# AI handoff — pool migration tracker

## Non-negotiables

1. Moved-share is **basis points** on a sample grid: left × moved.
2. Sample fee-tier labels are **not** live TVL and not an Alcor fee tier.
3. **No** pool read on the measure path. Not v2, not v3.
4. A threshold flag is **not** authorization to move liquidity and not a signed migration.
5. Share URLs carry demo numbers only. No session token.
6. The bps idea ports. `swap.alcor` is the AMM name on several chains in Alcor docs; tables are still per chain. This lab does not call the account.
7. Live TVL would be v3 analytics — not this pure arithmetic.

## Prompt seeds

- "Compute moved-share bps on the sample grid without opening a socket."
- "Threshold flag flipped — may we sign a migration?"
- "Point at /api/v3/analytics for live TVL; leave the floor formula alone."

## Do not

- Sign a migration because a bps flag flipped.
- Fetch analytics to "finish" the tracker.
- Claim live TVL was measured here.
