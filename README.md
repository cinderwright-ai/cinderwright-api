## What shipped this week

**June 9, 2026: Both bridge directions confirmed on mainnet.**

- Lightning --> USDC proxy: pay a Lightning invoice, get agent credit within 30 seconds
- USDC --> Lightning: agent with USDC pays L402 services automatically
- Free demo: [api.ideafactorylab.org](https://api.ideafactorylab.org) -- no account needed
- CLI: `npx cinderwright "Bitcoin price"`
- 2,835 services indexed. $0.10 free credit on new accounts.

# Cinderwright — Universal Payment Router for AI Agents

**x402 + L402 (Lightning) interoperable. First confirmed cross-protocol agent payment June 2026.**

An AI agent with a USDC balance can now call any Lightning-gated (L402) service. We detect the protocol, route the payment, and return the data. The agent never knows which protocol settled.

```bash
# One endpoint. Any protocol. 2,811 services.
curl -X POST https://api.ideafactorylab.org/proxy/do \
  -H "X-CW-Key: sk_cw_your_key" \
  -d '{"task": "get weather in Tokyo"}'
```

## What's Live

| Protocol | Services | Status |
|----------|----------|--------|
| x402 (USDC on Base) | 1,503 | Live |
| L402 (Bitcoin Lightning) | 1,185 | **Live** |
| MPP (Stripe/Tempo) | 92 | Coming soon |

Lightning status: https://api.ideafactorylab.org/lightning-status

## How It Works

1. Agent deposits USDC to their proxy account
2. Agent sends a plain-English task to `/proxy/do`
3. Cinderwright searches 2,811 services, finds the best match
4. Detects the payment protocol from the 402 response headers
5. Routes payment accordingly: USDC for x402, Lightning invoice for L402
6. Returns the data, charges USDC equivalent from agent's balance

The agent never manages wallets, signs transactions, or knows which protocol ran.

## Quick Start

```bash
# Get a proxy account
curl -X POST https://api.ideafactorylab.org/proxy/setup \
  -d '{"wallet": "0xYourBaseWallet"}'

# Deposit USDC on Base to the returned address

# Call any service
curl -X POST https://api.ideafactorylab.org/proxy/do \
  -H "X-CW-Key: sk_cw_your_key" \
  -d '{"task": "Bitcoin price now", "max_cost_usd": 0.10}'
```

## MCP Server for Claude Desktop

```bash
npx cinderwright-mcp-server
```

Add to `claude_desktop_config.json`:
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

17 tools including `proxy_do`, `proxy_setup`, `proxy_balance`, and service discovery.

## Free Developer Tools

| Tool | What it does |
|------|-------------|
| [/test](https://api.ideafactorylab.org/test) | Live service tester |
| [/debug](https://api.ideafactorylab.org/debug) | 16-check diagnostic engine with host pollution + scheme detection |
| [/sandbox](https://api.ideafactorylab.org/sandbox) | Test EIP-3009 signing without spending USDC |
| [/budget](https://api.ideafactorylab.org/budget) | Per-call caps and kill switch |
| [/setup](https://api.ideafactorylab.org/setup) | Wallet setup wizard |
| [/lightning-status](https://api.ideafactorylab.org/lightning-status) | Lightning node status and outbound capacity |
| [/onchain](https://api.ideafactorylab.org/onchain) | On-chain settlement data via TomSmart mapper.db |

## Discovery

```bash
# Free search
curl "https://api.ideafactorylab.org/discover?q=weather"
curl "https://api.ideafactorylab.org/discover?q=bitcoin+price&protocol=l402"

# On-chain settlement data for any service
curl "https://api.ideafactorylab.org/onchain?endpoint=https://your-service.com/api"

# Submit your service
curl -X POST https://api.ideafactorylab.org/submit \
  -d '{"url": "https://your-service.com"}'
```

## Architecture

The universal payment router sits between agents and services:

```
Agent (USDC balance)
    |
    v
POST /proxy/do {"task": "..."}
    |
    v
Cinderwright Router
    |-- detect protocol from 402 response headers
    |-- x402: sign USDC payment via EIP-3009
    |-- L402: pay Lightning invoice via LND REST
    |-- MPP: (coming soon)
    |
    v
Service returns data
    |
    v
Agent receives data + charged USDC equivalent
```

## Links

- Hub: https://api.ideafactorylab.org
- Lightning status: https://api.ideafactorylab.org/lightning-status
- npm: `npx cinderwright-mcp-server`
- Twitter/X: [@Cinderwright](https://x.com/Cinderwright)
