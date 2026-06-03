#!/usr/bin/env node
// Cinderwright Discovery Hub - MCP Server v1.2.0
// The only cross-protocol agent payments discovery hub
// Covers x402 (Coinbase), MPP (Stripe/Tempo), and L402 (Lightning)
// 2,811+ services indexed
//
// Usage in Claude Desktop (claude_desktop_config.json):
// {
//   "mcpServers": {
//     "cinderwright": {
//       "command": "npx",
//       "args": ["-y", "cinderwright-mcp-server"],
//       "env": { "CW_KEY": "sk_cw_your_key_here" }
//     }
//   }
// }
//
// Get a key: POST https://api.ideafactorylab.org/proxy/setup
// with {"wallet": "0xYourBaseWallet"}

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const BASE_URL = 'https://api.ideafactorylab.org';
const CW_KEY = process.env.CW_KEY || '';

const server = new Server(
  { name: 'cinderwright-hub', version: '1.2.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    // =============================================
    // FREE TOOLS — no key required
    // =============================================
    {
      name: 'stats',
      description: 'Get ecosystem statistics for the agent payments economy. Returns total services indexed across x402, MPP, and Lightning protocols.',
      inputSchema: { type: 'object', properties: {} }
    },
    {
      name: 'protocols',
      description: 'Get cross-protocol breakdown: x402 (Coinbase/USDC) vs MPP (Stripe/Tempo) vs L402 (Bitcoin Lightning). Shows service count and description for each protocol.',
      inputSchema: { type: 'object', properties: {} }
    },
    {
      name: 'quality',
      description: 'Get service quality grades. Cinderwright tests services weekly and grades them A-F on reachability, payment compliance, and response time.',
      inputSchema: { type: 'object', properties: {} }
    },
    {
      name: 'prices',
      description: 'Get market pricing intelligence. Average, median, min, and max prices across the ecosystem with category breakdowns.',
      inputSchema: { type: 'object', properties: {} }
    },
    {
      name: 'trends',
      description: 'Get what agents and developers are searching for in the discovery hub.',
      inputSchema: { type: 'object', properties: {} }
    },
    {
      name: 'submit',
      description: 'Submit your x402, MPP, or Lightning service for free indexing. Crawled and health-checked daily.',
      inputSchema: {
        type: 'object',
        properties: {
          url: { type: 'string', description: 'Your service URL (e.g. https://your-api.com)' },
          name: { type: 'string', description: 'Service name' },
          description: { type: 'string', description: 'What your service does' }
        },
        required: ['url']
      }
    },
    {
      name: 'agent_check',
      description: 'Check if an agent wallet is registered and authorized for a specific service category. Free - service providers use this before accepting payment.',
      inputSchema: {
        type: 'object',
        properties: {
          wallet: { type: 'string', description: 'Agent wallet address (0x...)' },
          category: { type: 'string', description: 'Service category to check (optional)' },
          amount: { type: 'number', description: 'Transaction amount to check against spending limits (optional)' }
        },
        required: ['wallet']
      }
    },

    // =============================================
    // PROXY TOOLS — require CW_KEY env var
    // Set up: POST https://api.ideafactorylab.org/proxy/setup
    // =============================================
    {
      name: 'proxy_setup',
      description: 'Create a Cinderwright proxy account to call any indexed service without handling x402 payments yourself. Returns your API key and deposit instructions. Deposit USDC on Base to fund your account.',
      inputSchema: {
        type: 'object',
        properties: {
          wallet: { type: 'string', description: 'Your Base wallet address (0x...) - deposits from this address auto-credit your balance' }
        },
        required: ['wallet']
      }
    },
    {
      name: 'proxy_balance',
      description: 'Check your Cinderwright proxy account balance, recent calls, and spending history. Requires CW_KEY env var.',
      inputSchema: { type: 'object', properties: {} }
    },
    {
      name: 'proxy_do',
      description: 'Describe a task in plain English and Cinderwright finds the right service, pays for it, and returns the result. No x402 knowledge needed. Examples: "get the Bitcoin price", "weather in Tokyo", "translate hello to Japanese", "summarize this text: ...". Costs the service price + 10% markup from your proxy balance. Requires CW_KEY env var.',
      inputSchema: {
        type: 'object',
        properties: {
          task: { type: 'string', description: 'What you need in plain English (e.g. "current Bitcoin price", "weather in London", "translate hello world to Spanish")' },
          max_cost_usd: { type: 'number', description: 'Maximum cost you\'ll pay in USD (default: 0.10)' },
          context: { type: 'string', description: 'Optional extra context for the task (e.g. text to translate or summarize)' }
        },
        required: ['task']
      }
    },
    {
      name: 'proxy_call',
      description: 'Call any indexed x402 service directly by URL. Cinderwright handles the payment and returns the result. Good when you already know the service URL from discover. Requires CW_KEY env var.',
      inputSchema: {
        type: 'object',
        properties: {
          url: { type: 'string', description: 'Full URL of the x402 service endpoint (e.g. https://api.example.com/weather?city=Tokyo)' },
          method: { type: 'string', enum: ['GET', 'POST'], description: 'HTTP method (default: GET)' },
          body: { type: 'object', description: 'Request body for POST requests (optional)' },
          max_cost_usd: { type: 'number', description: 'Maximum cost you\'ll pay in USD (default: no limit)' }
        },
        required: ['url']
      }
    },

    // =============================================
    // DISCOVERY TOOLS — work free OR via proxy if CW_KEY set
    // =============================================
    {
      name: 'discover',
      description: 'Search for agent payment services by keyword across 2,811+ x402, MPP, and Lightning services. Free to search. If CW_KEY is set, results include proxy_hint with ready-to-use proxy_call commands.',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search keyword (e.g. weather, translate, bitcoin price, sentiment)' },
          protocol: { type: 'string', enum: ['x402', 'mpp', 'l402'], description: 'Filter by protocol (optional)' },
          max_price: { type: 'number', description: 'Maximum price filter in USD (optional)' }
        },
        required: ['query']
      }
    },
    {
      name: 'find',
      description: 'Intent-based discovery. Describe what you need and get the best service recommendation. Costs $0.02 from proxy balance if CW_KEY is set, otherwise returns payment instructions.',
      inputSchema: {
        type: 'object',
        properties: {
          intent: { type: 'string', description: 'What you need in plain English (e.g. "cheap weather API for Tokyo under $0.02")' }
        },
        required: ['intent']
      }
    },
    {
      name: 'compare',
      description: 'Compare agent payment services side by side with quality grades. Costs $0.02 from proxy balance if CW_KEY is set.',
      inputSchema: {
        type: 'object',
        properties: {
          capability: { type: 'string', description: 'Service capability to compare (e.g. weather, translate, llm)' },
          sort_by: { type: 'string', enum: ['quality', 'price', 'speed'], description: 'Sort order (default: quality)' }
        },
        required: ['capability']
      }
    }
  ]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    // =============================================
    // FREE TOOLS
    // =============================================
    const freeEndpoints = {
      stats: '/stats',
      quality: '/quality',
      protocols: '/protocols',
      prices: '/prices',
      trends: '/trends'
    };

    if (freeEndpoints[name]) {
      const resp = await fetch(BASE_URL + freeEndpoints[name]);
      const data = await resp.json();
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }

    if (name === 'agent_check') {
      const params = new URLSearchParams({ wallet: args.wallet });
      if (args.category) params.append('category', args.category);
      if (args.amount) params.append('amount', args.amount.toString());
      const resp = await fetch(`${BASE_URL}/agent/check?${params}`);
      const data = await resp.json();
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }

    if (name === 'submit') {
      const resp = await fetch(`${BASE_URL}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(args)
      });
      const data = await resp.json();
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }

    // =============================================
    // DISCOVER — free but enriched with proxy hints if key present
    // =============================================
    if (name === 'discover') {
      const params = new URLSearchParams({ q: args.query });
      if (args.protocol) params.append('protocol', args.protocol);
      if (args.max_price) params.append('max_price', args.max_price.toString());
      const resp = await fetch(`${BASE_URL}/discover?${params}`);
      const data = await resp.json();

      if (CW_KEY && data.results) {
        // Add a ready-to-use proxy_call snippet for each result
        data.results = data.results.slice(0, 5).map(r => ({
          ...r,
          proxy_call_example: `Use proxy_call tool with url="${r.full_url}" to call this service via your proxy balance`
        }));
        data.proxy_ready = true;
        data.proxy_hint = `You have a CW_KEY set. Use proxy_call or proxy_do to call any of these without handling x402 payments yourself.`;
      }

      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }

    // =============================================
    // PROXY TOOLS — require CW_KEY
    // =============================================
    if (!CW_KEY && ['proxy_setup', 'proxy_balance', 'proxy_do', 'proxy_call', 'find', 'compare'].includes(name)) {
      if (name === 'proxy_setup') {
        // proxy_setup doesn't need a key — it creates one
      } else {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              error: 'CW_KEY not configured',
              fix: 'Add CW_KEY to your Claude Desktop config env vars',
              get_key: 'Use proxy_setup tool with your wallet address to create an account and get a key',
              example_config: {
                mcpServers: {
                  cinderwright: {
                    command: 'npx',
                    args: ['-y', 'cinderwright-mcp-server'],
                    env: { CW_KEY: 'sk_cw_your_key_here' }
                  }
                }
              }
            }, null, 2)
          }]
        };
      }
    }

    if (name === 'proxy_setup') {
      const resp = await fetch(`${BASE_URL}/proxy/setup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet: args.wallet })
      });
      const data = await resp.json();
      if (data.key) {
        data.next_step = `Add CW_KEY="${data.key}" to your Claude Desktop MCP config env vars, then deposit USDC to ${data.deposit_address} on Base network.`;
      }
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }

    if (name === 'proxy_balance') {
      const resp = await fetch(`${BASE_URL}/proxy/balance`, {
        headers: { 'X-CW-Key': CW_KEY }
      });
      const data = await resp.json();
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }

    if (name === 'proxy_do') {
      const resp = await fetch(`${BASE_URL}/proxy/do`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CW-Key': CW_KEY },
        body: JSON.stringify({
          task: args.task,
          max_cost_usd: args.max_cost_usd || 0.10,
          context: args.context
        })
      });
      const headers = Object.fromEntries(resp.headers.entries());
      const data = await resp.json();
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            result: data,
            meta: {
              service: headers['x-cw-service'],
              cost: headers['x-cw-cost'],
              balance_remaining: headers['x-cw-balance'],
              explanation: headers['x-cw-explanation']
            }
          }, null, 2)
        }]
      };
    }

    if (name === 'proxy_call') {
      const url = `${BASE_URL}/proxy?url=${encodeURIComponent(args.url)}`;
      const resp = await fetch(url, {
        method: args.method || 'GET',
        headers: { 'X-CW-Key': CW_KEY, 'Content-Type': 'application/json' },
        body: args.body ? JSON.stringify(args.body) : undefined
      });
      const headers = Object.fromEntries(resp.headers.entries());
      const text = await resp.text();
      let data;
      try { data = JSON.parse(text); } catch { data = text; }
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            result: data,
            meta: {
              service: headers['x-cw-service'],
              cost: headers['x-cw-total-cost'],
              balance_remaining: headers['x-cw-balance'],
              cached: headers['x-cw-cache']
            }
          }, null, 2)
        }]
      };
    }

    // =============================================
    // PAID DISCOVERY — find/compare use proxy balance if key present
    // =============================================
    if (name === 'find') {
      const resp = await fetch(`${BASE_URL}/find`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(CW_KEY ? { 'X-CW-Key': CW_KEY } : {})
        },
        body: JSON.stringify({ intent: args.intent })
      });
      const data = await resp.json();
      if (data.recommendation && CW_KEY) {
        data.proxy_ready = `Use proxy_call with url="${data.recommendation.url}${data.recommendation.endpoint}" or proxy_do with task="${args.intent}"`;
      }
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }

    if (name === 'compare') {
      const resp = await fetch(`${BASE_URL}/compare`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(CW_KEY ? { 'X-CW-Key': CW_KEY } : {})
        },
        body: JSON.stringify({ capability: args.capability, sort_by: args.sort_by || 'quality' })
      });
      const data = await resp.json();
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }

    return { content: [{ type: 'text', text: `Unknown tool: ${name}` }] };

  } catch (error) {
    return { content: [{ type: 'text', text: `Error: ${error.message}` }] };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
