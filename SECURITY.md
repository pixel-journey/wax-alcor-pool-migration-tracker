# Security — pool migration moved-share

## Closed in product rules / tests

| Issue | Behavior |
| --- | --- |
| Pure measure path | no Alcor / Hyperion / Atomic calls |
| Sample grid | left × moved arithmetic locked |
| Share URLs | demo numbers only — no session tokens |

## Not closed (production)

| Concern | Guidance |
| --- | --- |
| Live TVL / fee tiers | Sample labels are not live TVL |
| Swap routing / migration execution | Not this product |
| localStorage | last left/moved on same origin; clear on shared devices |
| Authorization | `bps` / `met` thresholds are UI arithmetic, not permission to move liquidity |

## Attack angles

1. Treating moved-share as authorization to migrate.  
2. Claiming sample fee-tier labels are live TVL.  
3. Encoding session tokens into share URLs.  
4. Auto-executing a migration from a threshold flag.

## Honesty limits

No private keys, wallets, or signing. No pool read on the measure path.

| Sibling | Distinction |
| --- | --- |
| [LP fee lifecycle](https://github.com/pixel-journey/wax-lp-fee-lifecycle-auditor) | compound/extract/idle after collect |
| [IL heat map](https://github.com/pixel-journey/wax-lp-impermanent-loss-heat-map) | Full-range IL |
| [range efficiency](https://github.com/pixel-journey/wax-alcor-v2-range-efficiency-backtester) | Truncating fee product |

Prefer **WharfKit** if a host later signs. [docs.wax.io](https://docs.wax.io/).
