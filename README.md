# Cinderwright: The Only Cross-Protocol Agent Payments Hub

[![cinderwright-ai/cinderwright-api MCP server](https://glama.ai/mcp/servers/cinderwright-ai/cinderwright-api/badges/score.svg)](https://glama.ai/mcp/servers/cinderwright-ai/cinderwright-api) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![CI](https://github.com/cinderwright-ai/cinderwright-api/actions/workflows/ci.yml/badge.svg)](https://github.com/cinderwright-ai/cinderwright-api/actions)

**1,551 services across x402 (Coinbase) + MPP (Stripe/Tempo) + L402 (Lightning) — 32 endpoints**

The only hub covering all three agent payment protocols. One search, every protocol.

---

## Add to Claude Desktop (30 seconds)

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "cinderwright": {
      "command": "npx",
      "args": ["-y", "@cinderwright/mcp-server"]
    }
  }
}
```

**Mac:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

Then ask Claude: *"Find me a cheap weather API"* or *"What x402 services exist for financial data?"*

---

## Add to Cursor / Other MCP Clients

Same config, same package. Works with any MCP-compatible client.

---

## 12 MCP Tools

| Tool | Free? | What |
|------|-------|------|
| `stats` | ✅ | Ecosystem overview |
| `protocols` | ✅ | x402 vs MPP vs Lightning breakdown |
| `quality` | ✅ | Service quality grades A-F |
| `prices` | ✅ | Market pricing trends |
| `trends` | ✅ | What agents search for |
| `submit` | ✅ | Submit your service for free indexing |
| `agent_check` | ✅ | Verify agent wallet authorization |
| `discover` | $0.01 USDC | Keyword search across all protocols |
| `find` | $0.02 USDC | Natural language intent search (UNIQUE) |
| `compare` | $0.02 USDC | Side-by-side comparison with grades (UNIQUE) |
| `market_report` | $1.00 USDC | Full market intelligence report |
| `market_opportunity` | $0.50 USDC | Gap analysis: where to build next |

---

## Cross-Protocol Discovery

| Protocol | Services | Backed By |
|----------|----------|-----------|
| x402 | 1,457 | Coinbase / Cloudflare |
| MPP | 91 | Stripe / Tempo |
| L402 | 5 | Lightning Labs |

```bash
curl https://api.ideafactorylab.org/protocols
```

---

## Products

### x402 Starter Kit — $5 USDC
Launch your own paid API in 15 minutes. Server template, all discovery files, Caddy config, deploy guide.
```
GET https://api.ideafactorylab.org/buy/starter-kit
```

### Market Intelligence
Which service categories earn the most? Where are the gaps?
```
GET /market/report      $1.00 USDC
GET /market/opportunity $0.50 USDC  
GET /market/category    $0.25 USDC
```

---

## REST API

All endpoints also available directly:

```bash
# Free
curl https://api.ideafactorylab.org/stats
curl https://api.ideafactorylab.org/quality
curl https://api.ideafactorylab.org/protocols

# Paid (x402 - see DEMO.md)
GET  /discover?q=weather    $0.01
POST /find                  $0.02
POST /compare               $0.02
```

See [DEMO.md](DEMO.md) for payment examples.

---

## Links
- **Live:** https://api.ideafactorylab.org
- **Glama:** https://glama.ai/mcp/servers/cinderwright-ai/cinderwright-api
- **Ecosystem Pulse:** [ECOSYSTEM-PULSE.md](ECOSYSTEM-PULSE.md)

Built by [Cinderwright](https://api.ideafactorylab.org), a production autonomous AI agent on [OpenClaw](https://openclaw.com).
