# wax-alcor-pool-migration-tracker — Alcor Pool Migration Tracker

> **Status:** 🔒 Private (In Development) | Target Public Release: August 2026  
> **Category:** Alcor & DeFi Visualizers — Fee Tier Rotation & Capital Flight Analysis  
> **Parent Catalog:** [pixel-journey/wax-ecosystem-blueprint-catalog](https://github.com/pixel-journey/wax-ecosystem-blueprint-catalog)

**An interactive Sankey/stream graph and multi-pool table visualizer that tracks capital moving between Alcor fee tiers (0.05% / 0.30% / 1.00%) or exiting to other protocols, revealing rotation patterns, migration velocity, and opportunities for LPs and protocols on WAX.**

---

## 1. Overview & Goal

This blueprint provides deep visibility into how liquidity capital flows across Alcor's different fee tiers and out of the protocol entirely. It answers: **"Where is the money actually going after it leaves a position?"**

- **Intra-tier rotation**: LPs moving from high-fee (1.00%) to low-fee (0.05%) pools or vice-versa as volatility or volume shifts.
- **Inter-protocol flight**: Capital leaving Alcor entirely for other DEXes, bridges, or yield farms.
- **Velocity & stickiness metrics**: How quickly capital rotates and which tiers retain it longest.

**Why it matters:**
- Helps protocol teams understand fee tier effectiveness and potential need for dynamic fee adjustments or incentives.
- Allows LPs to spot emerging trends (e.g., capital fleeing to lower fee tiers during low-vol periods).
- Provides early warning signals for liquidity fragmentation or protocol health.
- Complements existing Alcor analytics with behavioral flow data rather than just static snapshots.

**Public infrastructure only:** Alcor public pool state + historical swap/liquidity actions via Hyperion. No custom contracts.

**Target users:** Protocol developers, LP strategists, on-chain analysts, market makers, DAO treasurers.

**Success metrics:** Clear visualization of 1000+ migration events in <3s, accurate flow attribution >90%, beautiful exportable insights.

---

## 2. Concepts & Inspiration

### Core Concepts
- **Alcor Fee Tiers**: Separate concentrated liquidity pools per fee level. Capital can be moved by removing from one and adding to another (or via swaps).
- **Migration Events**: Sequences of remove_liquidity + add_liquidity (same or different pool) or swap out to stables/other DEXes within short time windows.
- **Sankey / Flow Visualization**: Perfect for showing source → destination capital volumes over time.

### Pain Points
- Current tools show current TVL per pool but hide the dynamic movement of capital between them.
- No easy way to see if low-fee pools are gaining at expense of high-fee ones, or if capital is leaving WAX DeFi altogether.

### Inspirations
- Similar to CEX "order flow" or "capital rotation" dashboards in TradFi.
- Web3: Dune Analytics flow queries, but fully client-side and WAX-specific.
- Pairs with `wax-alcor-lp-behavioral-profiler`, `wax-lp-fee-lifecycle-auditor`, `wax-cross-pool-arbitrage-fatigue-meter`.

---

## 3. Design Specifications

### Visual & Interaction
- Dark modern dashboard with flowing Sankey diagram (D3 or react-flow) as hero visual.
- Time-range selector (7d/30d/90d/all) with live updating flows.
- Side panel with top migrating pairs and "hot" destination pools.
- Color coding: green for intra-Alcor rotation (healthy), amber for tier shifts, rose for exits.
- Responsive: Desktop rich viz, mobile stacked cards + simplified flow list.

### Key Components
- `MigrationSankey.tsx` — Interactive flow diagram with hover details (volume, # of moves, avg time).
- `FeeTierMatrix.tsx` — Heatmap or chord diagram showing from/to tier transitions.
- `MigrationTable.tsx` — Sortable/filterable table of recent large migrations with links to tx.
- `VelocityGauge.tsx` — Overall protocol migration velocity score + trend sparkline.

### A11y & Performance
- WCAG AA, keyboard accessible controls, screen-reader friendly data tables.
- Virtualized table for large datasets, Web Worker for flow calculations, aggressive caching.
- Lighthouse targets: Perf 90+, A11y 95+.

---

## 4. Technical Architecture

**Stack:** Next.js 15 + TS + Tailwind + shadcn + Recharts/D3 + @wharfkit + Hyperion client + Alcor public APIs.

**Data Flow:**
Wallet (optional) → Position history → Detect migration sequences (remove + add/swap in window) → Aggregate flows → Sankey + table render.

**Folder structure** similar to sibling blueprints (lib/wax/alcor-client.ts, hyperion-client.ts, migration-detector.ts).

**Security:** Read-only analysis. Optional signed reports.

---

## 5. Implementation Examples

Core migration detection logic (simplified TS):
```ts
// Detect sequences where capital leaves one pool and enters another or exits
interface MigrationEvent {
  fromPool: string;
  toPool: string | 'external';
  volumeUSD: number;
  blockDelta: number;
  txHash: string;
}

function detectMigrations(actions: Action[]): MigrationEvent[] {
  // Group by actor + short time windows
  // Classify remove_liquidity followed by add_liquidity or swap
  // ... implementation details
  return events;
}
```

Sankey data transform for visualization lib.

---

## 6. Demo & Testing
- Demo mode with realistic mock migration flows.
- Live mode via Hyperion queries.
- E2E tests for flow detection accuracy and viz interactions.
- Vercel previews.

---

## 7. Roadmap
**Phase 0-1:** Scaffold + data layer (Alcor + Hyperion migration parser) — 4 days
**Phase 2:** Sankey + matrix + table UI — 5 days
**Phase 3:** Polish, a11y, exports, performance — 3 days
**Phase 4:** Docs + public — 2 days

Future: Alerts for unusual migration spikes, comparison across multiple fee tiers or vs competitors, integration with other DeFi blueprints.

---

## 8. Visual References
Hero: Beautiful animated Sankey with pulsing flows. Sidebar filters by volume threshold or time. Clean data-dense tables. Inspired by flow diagrams in modern analytics tools (e.g. Amplitude, Mixpanel funnels + Sankey libs).

---

## 9. Related Blueprints
- `wax-alcor-lp-behavioral-profiler` & `wax-lp-fee-lifecycle-auditor` — LP-centric view of the same ecosystem health.
- `wax-cross-pool-arbitrage-fatigue-meter` — Complements with bot vs organic flow impact.
- `wax-market-cap-bubble` — Macro view that this migration tracker explains in detail.

---

## 10. License & Credits
MIT License. Pixel Journey standards. Thanks to Alcor and Hyperion public infrastructure.

**Pixel Journey — Beautiful interfaces for public blockchain data.**