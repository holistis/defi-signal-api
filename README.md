# DeFi Signal API

Live bot-intelligence from 50+ DeFi bots running on Base, Arbitrum, OP and Solana.

**RapidAPI:** [rapidapi.com/defisignalapi/api/defi-signal](https://rapidapi.com/defisignalapi/api/defi-signal)

---

## What this is

This API exposes live telemetry from a fleet of DeFi bots. Not aggregated market data — actual bot signals, draw schedules, earnings and health from bots that run 24/7.

Pay per call in USDC on Base. No signup. No API key. No dashboard.

## Endpoints

| Endpoint | What it returns | Price |
|----------|----------------|-------|
| `GET /api/status` | All endpoints, prices, payment wallet | Free |
| `GET /api/pt-next` | PoolTogether next draw timing on Base/Arb/OP/Scroll | $0.001 |
| `GET /api/pt` | PT draw scans and recent claim results | $0.001 |
| `GET /api/signals` | SOL arb near-win signals (last 2 hours) | $0.002 |
| `GET /api/earnings` | Bot earnings today across all chains | $0.003 |
| `GET /api/health` | Live PM2 status of all 50+ bots on VPS | $0.002 |
| `GET /api/murshid` | Nightly DeFi strategy report | $0.010 |
| `GET /api/edge` | Strategy verdicts with expected vs actual returns | $0.008 |
| `GET /api/rpc-status` | Live RPC-provider health per chain (getLogs caps, rate-limits, liveness latency) | First 20 calls/day per IP free, then $0.002 |
| `GET /api/liquidation-watch` | Live multi-chain liquidation risk — Morpho Blue + Aave V3 + Compound V3 on Ethereum/Avalanche/Polygon, top at-risk accounts by health factor, no cache | $0.002 |
| `GET /api/morpho-borrowers` | Morpho Blue (Base) — active borrowers per market | $0.010 |
| `GET /api/aave-health` | Aave V3 (Base + Arbitrum) — near-liquidation positions, last 48h | $0.008 |
| `GET /api/compound-borrowers` | Compound V3 (Ethereum/Base/Arb/Polygon) — active borrowers per market | $0.010 |
| `GET /api/compound-health` | Compound V3 — live scan telemetry: liquidation signal + bot status, last 6h | $0.008 |
| `GET /api/jup-lend` | Jupiter Lending (Solana) — live scan telemetry: liquidation signal + RPC health | $0.008 |
| `GET /api/vuln-search` | 3ilm smart-contract vulnerability pattern search (1,032 exact-reconciled findings, 10 Sherlock contests) | $0.005 |
| `GET /api/audit-signals` | Audit priority signals — Cantina + Sherlock contests/bounties enriched with our own audit-density/ratio/priority-score analysis, refreshed 2x/day. Never HackenProof/Immunefi/CodeHawks. | $0.010 |
| `POST /api/bug-intel` | AI security scan of a public smart contract repo, report within 24h (Al-Mizaan v3) | $5.00 |
| `GET /api/bug-intel/:jobId` | Poll status / fetch report for a submitted scan | Free |

Two of the JSON endpoints above also have a free, human-readable HTML twin fed by the same live telemetry — no payment, no auth: [`/rpc-status`](https://api.mergefix.com/rpc-status) and [`/liquidation-watch`](https://api.mergefix.com/liquidation-watch).

Base URL: `https://api.mergefix.com` (also reachable at `http://138.201.204.97:3748` directly)

Card / iDEAL payment also available for `/api/bug-intel` via Stripe: see the pricing table on [api.mergefix.com](https://api.mergefix.com).

## How payment works (x402)

1. Call `GET /api/status` to get the payment wallet address
2. Send USDC on Base mainnet to that wallet (exact price per endpoint)
3. Include the tx hash as `PAYMENT-SIGNATURE` header in your request
4. Server verifies on-chain. Each tx hash works once.

```javascript
// Example: get next PoolTogether draw timing
const statusRes = await fetch('https://api.mergefix.com/api/status');
const { payment, endpoints } = await statusRes.json();

// Send USDC to wallet on Base (use your preferred method)
const txHash = await sendUSDC(payment.wallet, 0.001); // $0.001

// Call the endpoint with payment proof
const res = await fetch('https://api.mergefix.com/api/pt-next', {
  headers: { 'PAYMENT-SIGNATURE': txHash }
});
const draws = await res.json();
// { base: { drawId: 412, nextDrawAt: "2026-08-03T18:00:00.000Z", timeUntilMs: 3600000, periodH: 24 }, ... }
```

## Who this is for

- **PoolTogether bot builders** — time your claim transactions precisely with `/api/pt-next`
- **Solana arb researchers** — study near-miss patterns from `/api/signals` to calibrate your own bot
- **DeFi infrastructure monitors** — track bot fleet health via `/api/health`
- **Strategy researchers** — get real expected vs actual returns from `/api/edge`

## What it does not do

It does not execute transactions. It does not give trading advice. It is a data layer. You decide what to do with the numbers.

## OpenAPI spec

Available at: `https://api.mergefix.com/openapi.json`

## Related

The `/api/vuln-search` and `/api/bug-intel` routes on this API share their dataset and Al-Mizaan 7-gate logic with two purpose-built MCP servers, for anyone who'd rather call them as MCP tools than raw HTTP:

- **[bug-bounty-intelligence-mcp](https://github.com/holistis/bug-bounty-intelligence-mcp)** — same lookup plus a paid full-repo `scan_contract` scan
- **[3ilm-mcp](https://github.com/holistis/3ilm-mcp)** — free-only pattern search, MCP-native
- **[al-mizaan-judge](https://github.com/holistis/al-mizaan-judge)** — local CLI that runs a candidate bug-bounty finding through the same 7 gates before you submit it

---

Built and maintained by [@holistis](https://github.com/holistis)
