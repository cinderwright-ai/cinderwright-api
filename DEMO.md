# Cinderwright Demo — Getting Started

## Free (no wallet needed)

```bash
# Ecosystem stats
curl https://api.ideafactorylab.org/stats

# Search 2,811 services by keyword
curl "https://api.ideafactorylab.org/discover?q=weather"
curl "https://api.ideafactorylab.org/discover?q=translate"
curl "https://api.ideafactorylab.org/discover?q=bitcoin+price"

# Quality grades
curl https://api.ideafactorylab.org/quality

# Market pricing
curl https://api.ideafactorylab.org/prices
```

---

## The Proxy (easiest way to use paid services)

No signing, no wallet keys in your code. Deposit USDC once, call anything.

```bash
# Step 1: create an account
curl -X POST https://api.ideafactorylab.org/proxy/setup \
  -H "Content-Type: application/json" \
  -d '{"wallet": "0xYourBaseWalletAddress"}'
# returns: { "key": "sk_cw_...", "deposit_address": "0x..." }

# Step 2: send USDC on Base to that deposit address

# Step 3: describe what you need
curl -X POST https://api.ideafactorylab.org/proxy/do \
  -H "X-CW-Key: sk_cw_your_key" \
  -H "Content-Type: application/json" \
  -d '{"task": "Bitcoin price now"}'
# {"symbol":"BTC","price_usd":67475,"change_24h":-4.94,...}

curl -X POST https://api.ideafactorylab.org/proxy/do \
  -H "X-CW-Key: sk_cw_your_key" \
  -H "Content-Type: application/json" \
  -d '{"task": "weather in Tokyo"}'
# {"location":"Tokyo","temp_c":"22","condition":"Heavy rain",...}

curl -X POST https://api.ideafactorylab.org/proxy/do \
  -H "X-CW-Key: sk_cw_your_key" \
  -H "Content-Type: application/json" \
  -d '{"task": "translate hello world to Japanese"}'
# {"translated":"こんにちは世界","target_language":"Japanese",...}

curl -X POST https://api.ideafactorylab.org/proxy/do \
  -H "X-CW-Key: sk_cw_your_key" \
  -H "Content-Type: application/json" \
  -d '{"task": "sentiment of this review", "context": "The product was great but delivery was slow"}'
# {"sentiment":"mixed","confidence":0.82,"summary":"Positive product, negative delivery"}

# Check your balance and call history
curl https://api.ideafactorylab.org/proxy/balance \
  -H "X-CW-Key: sk_cw_your_key"

# Call any indexed service directly by URL
curl "https://api.ideafactorylab.org/proxy?url=https://some-x402-service.com/endpoint" \
  -H "X-CW-Key: sk_cw_your_key"
```

**Pricing:** service cost + 10% markup. Bitcoin price: $0.011. Weather: $0.011. Translation: $0.022.

Dashboard: https://api.ideafactorylab.org/proxy/dashboard

---

## Direct x402 Payment (for developers building payment-aware agents)

Install:
```bash
npm install @x402/fetch @x402/evm viem
```

```javascript
import { withPaymentInterceptor } from "@x402/fetch";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";

const account = privateKeyToAccount("0xYourPrivateKey");
const walletClient = createWalletClient({
  account,
  chain: base,
  transport: http()
});

const fetchWithPayment = withPaymentInterceptor(fetch, walletClient);

// Find a service
const discovery = await fetch(
  "https://api.ideafactorylab.org/discover?q=weather"
).then(r => r.json());

const serviceUrl = discovery.results[0].full_url + "?location=Tokyo";

// Call it — payment happens automatically if needed
const response = await fetchWithPayment(serviceUrl);
const data = await response.json();
console.log(data);
```

---

## In Claude Desktop (MCP)

Without proxy key (discovery only):
```json
{
  "mcpServers": {
    "cinderwright": {
      "command": "npx",
      "args": ["-y", "cinderwright-mcp-server"]
    }
  }
}
```

With proxy key (full access, recommended):
```json
{
  "mcpServers": {
    "cinderwright": {
      "command": "npx",
      "args": ["-y", "cinderwright-mcp-server"],
      "env": { "CW_KEY": "sk_cw_your_key_here" }
    }
  }
}
```

Then ask Claude: "Get the Bitcoin price" or "What's the weather in London?"

---

## Developer Tools (all free)

| Tool | URL |
|------|-----|
| Service Tester | https://api.ideafactorylab.org/test |
| Payment Debugger | https://api.ideafactorylab.org/debug |
| x402 Sandbox | https://api.ideafactorylab.org/sandbox |
| Budget Enforcer | https://api.ideafactorylab.org/budget |
| Wallet Setup | https://api.ideafactorylab.org/setup |
