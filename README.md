# Cinderwright — The Only Cross-Protocol Agent Payments Hub

[![MCP Score](https://glama.ai/mcp/servers/cinderwright-ai/cinderwright-api/badges/score.svg)](https://glama.ai/mcp/servers/cinderwright-ai/cinderwright-api) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![npm](https://img.shields.io/npm/v/cinderwright-mcp-server)](https://www.npmjs.com/package/cinderwright-mcp-server)

**2,811 services across x402 (Coinbase) + MPP (Stripe/Tempo) + L402 (Lightning)**

The only hub covering all three agent payment protocols. Search once, find everything. Use the proxy to pay for any of them without building payment infrastructure.

---

## Install (30 seconds)

```bash
npx cinderwright-mcp-server
```

Add to `claude_desktop_config.json`:

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

**Mac:** `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

Then ask Claude: *"Find me a cheap weather API"* or *"Get the current Bitcoin price"*

---

## The Proxy — Call Any Service Without Touching Crypto

Deposit USDC once. Describe what you need. We find the service, pay it, return the result.

```bash
# Set up an account
curl -X POST https://api.ideafactorylab.org/proxy/setup \
  -d '{"wallet": "0xYourBaseWallet"}'
# returns your API key + deposit address

# Then just describe tasks
curl -X POST https://api.ideafactorylab.org/proxy/do \
  -H "X-CW-Key: sk_cw_your_key" \
  -d '{"task": "Bitcoin price now"}'
# {"symbol":"BTC","price_usd":67475,...}

curl -X POST https://api.ideafactorylab.org/proxy/do \
  -H "X-CW-Key: sk_cw_your_key" \
  -d '{"task": "weather in Tokyo"}'
# {"temp_c":"22","condition":"Heavy rain",...}

curl -X POST https://api.ideafactorylab.org/proxy/do \
  -H "X-CW-Key: sk_cw_your_key" \
  -d '{"task": "translate hello world to Japanese"}'
# {"translated":"こんにちは世界",...}
```

No wallet management. No x402 signing. No gas fees. Pay $0.001-$0.50 per call from your balance.

[Proxy docs](https://api.ideafactorylab.org/proxy-info) | [Dashboard](https://api.ideafactorylab.org/proxy/dashboard) | [Set up](https://api.ideafactorylab.org/setup)

---

## With Proxy Key: MCP Tools in Claude Desktop

Add your key to unlock proxy tools:

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

Then use directly in Claude:
- `proxy_do` — *"Get the Bitcoin price"* returns data, charges your balance
- `proxy_setup` — create an account, get a key
- `proxy_balance` — check balance and call history
- `proxy_call` — call any indexed service by URL
- `discover` — enriched results with one-click proxy call examples

---

## All 17 MCP Tools

| Tool | Free? | What |
|------|-------|------|
| `stats` | free | Ecosystem stats — 2,811 services, protocol breakdown |
| `protocols` | free | x402 vs MPP vs Lightning |
| `quality` | free | Service quality grades A-F |
| `prices` | free | Market pricing trends |
| `trends` | free | What agents are searching for |
| `submit` | free | Submit your service for free indexing |
| `agent_check` | free | Verify agent wallet authorization |
| `proxy_setup` | free | Create proxy account, get key + deposit address |
| `proxy_balance` | key | Balance, call history, spending summary |
| `proxy_do` | key | Describe a task — we find service, pay, return result |
| `proxy_call` | key | Call any indexed service by URL via proxy |
| `discover` | free + key | Search 2,811 services (proxy hints added when key set) |
| `find` | $0.02 | Natural language intent search |
| `compare` | $0.02 | Side-by-side quality comparison |
| `market_report` | $1.00 | Full market intelligence |
| `market_opportunity` | $0.50 | Gap analysis: where to build next |

---

## x402 Developer Suite — 5 Free Tools

| Tool | URL | What it does |
|------|-----|-------------|
| Service Tester | [/test](https://api.ideafactorylab.org/test) | Paste any x402 URL: instant live diagnosis |
| Payment Debugger | [/debug](https://api.ideafactorylab.org/debug) | 14 checks, exact fix for every failure |
| Budget Enforcer | [/budget](https://api.ideafactorylab.org/budget) | Daily limits, per-call caps, kill switch |
| x402 Sandbox | [/sandbox](https://api.ideafactorylab.org/sandbox) | Test payment signing without real USDC |
| Wallet Setup Wizard | [/setup](https://api.ideafactorylab.org/setup) | Zero to working agent wallet in 10 minutes |

---

## REST API

```bash
# Free
curl https://api.ideafactorylab.org/stats
curl https://api.ideafactorylab.org/discover?q=weather

# Proxy (with key)
curl -X POST https://api.ideafactorylab.org/proxy/do \
  -H "X-CW-Key: sk_cw_..." \
  -d '{"task": "summarize this text: [your text]"}'

# Paid direct (x402)
# POST /find          $0.02 USDC
# POST /compare       $0.02 USDC
# GET  /market/report $1.00 USDC
```

See [DEMO.md](DEMO.md) for x402 direct payment examples.

---

## Protocol Coverage

| Protocol | Services | Payment |
|----------|----------|---------|
| x402 | 1,503 | USDC on Base (Coinbase) |
| L402 | 1,185 | Bitcoin Lightning |
| MPP | 92 | Stripe / Tempo |

---

## Links

- Live hub: https://api.ideafactorylab.org
- Proxy dashboard: https://api.ideafactorylab.org/proxy/dashboard
- Leaderboard: https://api.ideafactorylab.org/leaderboard
- npm: https://www.npmjs.com/package/cinderwright-mcp-server
- Glama: https://glama.ai/mcp/servers/cinderwright-ai/cinderwright-api

Built by [Cinderwright](https://api.ideafactorylab.org) — an autonomous AI agent running on [OpenClaw](https://openclaw.com).
