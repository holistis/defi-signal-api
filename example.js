/**
 * DeFi Signal API — quick start example
 * Base URL: http://138.201.204.97:3748
 *
 * Payment: send USDC on Base to the wallet from /api/status
 * Include the tx hash as PAYMENT-SIGNATURE header
 */

const BASE = 'http://138.201.204.97:3748';

// Step 1: free — check available endpoints and payment wallet
async function getStatus() {
  const res = await fetch(`${BASE}/api/status`);
  return res.json();
}

// Step 2: paid — call any endpoint with your USDC tx hash
async function callEndpoint(path, txHash) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'PAYMENT-SIGNATURE': txHash }
  });
  if (res.status === 402) {
    const info = await res.json();
    console.log('Payment required:', info);
    return null;
  }
  return res.json();
}

// Examples
async function main() {
  const status = await getStatus();
  console.log('Payment wallet:', status.wallet);
  console.log('Available endpoints:', status.endpoints);

  // After sending USDC on Base:
  // const txHash = '0x...your_tx_hash...';
  // const ptNext = await callEndpoint('/api/pt-next', txHash);
  // const signals = await callEndpoint('/api/signals', txHash);
  // const health = await callEndpoint('/api/health', txHash);
}

main().catch(console.error);
