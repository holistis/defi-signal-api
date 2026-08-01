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
| `POST /api/bug-intel` | AI security scan of a public smart contract repo, report within 24h (Al-Mizaan v3) | $5.00 |
| `GET /api/bug-intel/:jobId` | Poll status / fetch report for a submitted scan | Free |

Base URL: `http://138.201.204.97:3748`

Card / iDEAL payment also available for `/api/bug-intel` via Stripe: see the pricing table on [api.mergefix.com](https://api.mergefix.com).

## How payment works (x402)

1. Call `GET /api/status` to get the payment wallet address
2. Send USDC on Base mainnet to that wallet (exact price per endpoint)
3. Include the tx hash as `PAYMENT-SIGNATURE` header in your request
4. Server verifies on-chain. Each tx hash works once.

```javascript
// Example: get next PoolTogether draw timing
const statusRes = await fetch('http://138.201.204.97:3748/api/status');
const { wallet, endpoints } = await statusRes.json();

// Send USDC to wallet on Base (use your preferred method)
const txHash = await sendUSDC(wallet, 0.001); // $0.001

// Call the endpoint with payment proof
const res = await fetch('http://138.201.204.97:3748/api/pt-next', {
  headers: { 'PAYMENT-SIGNATURE': txHash }
});
const draws = await res.json();
// { base: { nextDrawAt: 1721390400000, timeUntilMs: 3600000, tierPrizesEth: [...] }, ... }
```

## Who this is for

- **PoolTogether bot builders** — time your claim transactions precisely with `/api/pt-next`
- **Solana arb researchers** — study near-miss patterns from `/api/signals` to calibrate your own bot
- **DeFi infrastructure monitors** — track bot fleet health via `/api/health`
- **Strategy researchers** — get real expected vs actual returns from `/api/edge`

## What it does not do

It does not execute transactions. It does not give trading advice. It is a data layer. You decide what to do with the numbers.

## OpenAPI spec

Available at: `http://138.201.204.97:3748/openapi.json`

---

Built and maintained by [@holistis](https://github.com/holistis)
