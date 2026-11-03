# Security notes

**Trust label:** `educational-reference`

## What this package does not do

- No private keys, wallets, or signing
- No Alcor / Hyperion / Atomic calls on the measure path
- No claim that sample fee-tier labels are live TVL
- No swap routing or migration execution

## Host-product guidance

- Treat `bps` and `met` thresholds as **UI arithmetic**, not authorization to move liquidity.
- Share URLs only encode demo numbers — not session or auth tokens.
- localStorage holds last left/moved on the same origin; clear on shared devices.
- Prefer **WharfKit** (not eosjs / Anchor Link) if a future host adds intentional chain actions.

## Supply-chain

Correctness is locked by pure unit tests (including a small left×moved grid). Pin dependencies for any public deploy.
