# Sources

| Source | Use |
| --- | --- |
| [docs.alcor.exchange/api](https://docs.alcor.exchange/api) | Live TVL would be v3 analytics. This page does not request it |
| [SECURITY.md](SECURITY.md) | Moved-share is arithmetic, not permission to migrate |

## Product facts

- Moved-share is basis points on a sample grid: left × moved.
- Sample fee-tier labels are not live TVL and not an Alcor fee tier.
- No pool read on the measure path. Not v2, not v3.
- A threshold flag is not an authorization to move liquidity and not a signed migration.
- Share URLs carry demo numbers only. No session token.
- The bps idea ports. The WAX account `swap.alcor` is the AMM name on WAX, EOS, Telos, and XPR in the Alcor docs, and the tables are still per chain. This lab does not call the account.

## Alcor HTTP (this lab does not call it)

The `v2` in the repository name is historical. It is not the HTTP version, and it is not an instruction to keep a new client on `/api/v2`.

[docs.alcor.exchange/api](https://docs.alcor.exchange/api) is the reference. Checked against that index:

| Job | Call | Status |
| --- | --- | --- |
| New token, pool, price, depth | `https://<chain>.alcor.exchange/api/v3/market/...` | Preferred |
| Live updates | `wss://<chain>.alcor.exchange/api/v3/market/stream` | Preferred over polling |
| TVL, volume, scores | `/api/v3/analytics/...` on the same chain host | Preferred |
| Cross-chain feed | `https://api.alcor.exchange/v3/feed/...` | Ids include `wax`, `eos`, `telos`, or `xpr` |
| Spot pairs, tickers, candles, AMM lists | `/api/v2/pairs`, `/api/v2/tickers`, `/api/v2/amm/...` | **Still hosted.** Not what this lab uses |

`<chain>` is `wax`, `eos`, `telos`, or `proton`. `https://alcor.exchange/api/` redirects to WAX. The XPR feed prefix is `xpr`, not `proton`.

Token id is `<symbol>-<contract>` lowercase (`wax-eosio.token`, `tlm-alien.worlds`). On-chain, the market row's `base_token` is the **API target** (the quote). `quote_token` is the API base.

v2 errors are plain text. v3 errors are `{"error":"..."}`.

| Chain | Spot contract | AMM contract |
| --- | --- | --- |
| WAX | `alcordexmain` | `swap.alcor` |
| EOS | `eostokensdex` | `swap.alcor` |
| Telos | `eostokensdex` | `swap.alcor` |
| XPR | `alcor` | `swap.alcor` |

The same AMM account name is not the same table. Integer rules in this lab do port. Those account names do not.

WharfKit, if a later host signs: [wharfkit/skill](https://github.com/wharfkit/skill) (`git clone https://github.com/wharfkit/skill.git ~/.claude/skills/wharfkit`). There is no Alcor MCP to install. Do not invent one.

