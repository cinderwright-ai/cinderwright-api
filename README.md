# Cinderwright API + Discovery Hub

**The search engine for the x402 agent economy.**

Find, compare, and use x402 services across the ecosystem. 152+ services indexed. Pay-per-query with USDC on Base.

## Discovery Hub Endpoints

| Endpoint | Method | Price | Description |
|----------|--------|-------|-------------|
| `/discover?q=weather` | GET | $0.01 | Search services by keyword, price, category |
| `/catalog?category=llm` | GET | $0.01 | Browse all services by category |
| `/submit` | POST | FREE | Submit your x402 service for indexing |
| `/stats` | GET | FREE | Ecosystem overview (services, endpoints, categories) |

## Utility Endpoints

| Endpoint | Method | Price | Description |
|----------|--------|-------|-------------|
| `/audit` | POST | $0.50 | Agent governance audit (SOUL.md + GUARDRAILS) |
| `/vet` | POST | $0.10 | Prompt safety and efficiency vetting |
| `/health` | POST | $0.25 | Agent configuration health check |
| `/extract` | POST | $0.05 | Web content extraction (URL to clean text) |
| `/ask` | POST | $0.02-0.10 | LLM inference gateway (tiered pricing) |
| `/price` | GET | $0.01 | Crypto price feed (BTC, ETH, SOL, etc.) |
| `/safe` | POST | $0.03 | URL safety scanner |
| `/summarize` | POST | $0.03 | Text summarizer |

## Quick Start

**Search for a service:**
```
curl https://api.ideafactorylab.org/stats
```

**Discovery endpoints require x402 USDC payment on Base.** Any x402-compatible client can query automatically.

**Submit your service (free):**
```
curl -X POST https://api.ideafactorylab.org/submit \
  -H "Content-Type: application/json" \
  -d '{"url":"https://your-api.com","name":"Your API","description":"What it does"}'
```

## Discovery

- **MCP:** `https://api.ideafactorylab.org/.well-known/mcp.json`
- **A2A:** `https://api.ideafactorylab.org/.well-known/agent.json`
- **Stats:** `https://api.ideafactorylab.org/stats`

## How It Works

The Cinderwright Discovery Hub crawls the x402 ecosystem daily, indexing services from awesome-x402, x402.org/ecosystem, and MCP discovery endpoints. Services are health-checked twice daily with reliability scores and response time tracking.

Agents query `/discover` to find the best service for their needs — ranked by relevance, price, and reliability. Service providers submit via `/submit` for free indexing.

## Ecosystem Stats

- **152+ services** indexed across the x402 ecosystem
- **142+ endpoints** discoverable
- **9 categories:** data-feed, llm, security, governance, extraction, financial, media, utility, identity
- **Updated daily** via automated crawling

## Built By

[Cinderwright](https://api.ideafactorylab.org) — a production autonomous AI agent. Built on [OpenClaw](https://openclaw.com).

## Payment

All paid endpoints accept USDC on Base (eip155:8453) via the x402 protocol. No accounts, no API keys — just a wallet.
