# How to Use the Cinderwright Discovery Hub

## Free Endpoints (No Payment Required)

Try these right now — no wallet needed:

```bash
# Ecosystem stats
curl https://api.ideafactorylab.org/stats

# Quality report — how we grade x402 services
curl https://api.ideafactorylab.org/quality

# Price intelligence — market pricing trends
curl https://api.ideafactorylab.org/prices

# What agents are searching for
curl https://api.ideafactorylab.org/trends

# Submit your x402 service for free indexing
curl -X POST https://api.ideafactorylab.org/submit \
  -H "Content-Type: application/json" \
  -d '{"url":"https://your-api.com","name":"Your API","description":"What it does"}'
```

## Paid Endpoints (x402 USDC on Base)

Paid endpoints return `402 Payment Required` with payment details in the `payment-required` header. Use the `@x402/fetch` client to handle payment automatically.

### Install the x402 Client

```bash
npm install @x402/fetch @x402/evm viem
```

### Example: Search for Services

```javascript
import { x402Client, wrapFetchWithPayment } from '@x402/fetch';
import { registerExactEvmScheme } from '@x402/evm/exact/client';
import { mnemonicToAccount } from 'viem/accounts';

// Your wallet (needs USDC on Base)
const account = mnemonicToAccount('your twelve word mnemonic phrase goes here ...');

// Set up x402 client
const client = new x402Client();
registerExactEvmScheme(client, { signer: account });
const paidFetch = wrapFetchWithPayment(fetch, client);

// Search for weather services ($0.01)
const res = await paidFetch('https://api.ideafactorylab.org/discover?q=weather');
const data = await res.json();
console.log(`Found ${data.total} weather services`);

// Intent-based search ($0.02) — describe what you need
const res2 = await paidFetch('https://api.ideafactorylab.org/find', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ intent: 'I need a cheap weather API for Tokyo' })
});
const recommendation = await res2.json();
console.log('Best match:', recommendation.recommendation);

// Compare services side-by-side ($0.02)
const res3 = await paidFetch('https://api.ideafactorylab.org/compare', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ capability: 'weather', sort_by: 'quality' })
});
const comparison = await res3.json();
console.log('Best overall:', comparison.recommendation.best_overall);
console.log('Cheapest:', comparison.recommendation.cheapest);
```

### All Paid Endpoints

| Endpoint | Method | Price | Description |
|----------|--------|-------|-------------|
| /discover?q=keyword | GET | $0.01 | Search by keyword |
| /find | POST | $0.02 | Intent-based discovery (UNIQUE) |
| /compare | POST | $0.02 | Side-by-side comparison (UNIQUE) |
| /catalog | GET | $0.01 | Browse by category |
| /audit | POST | $0.50 | Agent governance audit |
| /vet | POST | $0.10 | Prompt safety vetting |
| /extract | POST | $0.05 | Web content extraction |
| /ask | POST | $0.02 | LLM inference |
| /translate | POST | $0.02 | Text translation |
| /weather | GET | $0.01 | Weather forecast |
| /dns | GET | $0.01 | DNS lookup |
| /sentiment | POST | $0.01 | Sentiment analysis |
| /price | GET | $0.01 | Crypto prices |
| /safe | POST | $0.03 | URL safety scanner |
| /summarize | POST | $0.03 | Text summarizer |
| /health | POST | $0.25 | Config health check |

## What Makes Us Different

- **Intent Search** — describe what you need in natural language, we find the best match
- **Quality Grades** — we test 70 services weekly and grade them A-F (avg: 34/100, we're the only A)
- **Comparison Engine** — side-by-side with best/cheapest/fastest recommendations
- **Price Intelligence** — track pricing trends across the ecosystem
- **1,455+ services indexed** with daily crawling and health checks
