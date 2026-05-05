#!/usr/bin/env node
// Cinderwright Discovery Hub - MCP Server
// The only cross-protocol agent payments discovery hub
// Covers x402 (Coinbase), MPP (Stripe/Tempo), and L402 (Lightning)
// 1,551+ services indexed
//
// Usage in Claude Desktop (claude_desktop_config.json):
// {
//   "mcpServers": {
//     "cinderwright": {
//       "command": "npx",
//       "args": ["-y", "@cinderwright/mcp-server"]
//     }
//   }
// }

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const BASE_URL = 'https://api.ideafactorylab.org';

const server = new Server(
  { name: 'cinderwright-hub', version: '1.1.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
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
      description: 'Get service quality grades. Cinderwright tests 70 services weekly and grades them A-F on reachability, JSON validity, discovery files, and payment compliance.',
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
      name: 'discover',
      description: 'Search for agent payment services by keyword across x402, MPP, and Lightning protocols. Costs $0.01 USDC on Base via x402.',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search keyword (e.g. weather, translate, price, llm)' },
          protocol: { type: 'string', enum: ['x402', 'mpp', 'l402'], description: 'Filter by protocol (optional)' }
        },
        required: ['query']
      }
    },
    {
      name: 'find',
      description: 'Intent-based discovery. Describe what you need in plain English and get the best service recommendation. Costs $0.02 USDC on Base via x402. UNIQUE - no other hub offers this.',
      inputSchema: {
        type: 'object',
        properties: {
          intent: { type: 'string', description: 'Describe what you need (e.g. "I need a cheap weather API for Tokyo under $0.02")' }
        },
        required: ['intent']
      }
    },
    {
      name: 'compare',
      description: 'Compare agent payment services side by side with quality grades, prices, and a recommendation. Costs $0.02 USDC on Base via x402. UNIQUE - no other hub offers this.',
      inputSchema: {
        type: 'object',
        properties: {
          capability: { type: 'string', description: 'Service capability to compare (e.g. weather, translate, llm)' },
          sort_by: { type: 'string', enum: ['quality', 'price', 'speed'], description: 'Sort order (default: quality)' }
        },
        required: ['capability']
      }
    },
    {
      name: 'market_report',
      description: 'Full market intelligence report. Which categories earn the most? Where are pricing gaps? Built from 1,551+ indexed services. Costs $1.00 USDC on Base.',
      inputSchema: { type: 'object', properties: {} }
    },
    {
      name: 'market_opportunity',
      description: 'Gap analysis. Underserved niches with few providers and overpriced categories you could undercut. Costs $0.50 USDC on Base.',
      inputSchema: { type: 'object', properties: {} }
    },
    {
      name: 'submit',
      description: 'Submit your x402, MPP, or Lightning service for free indexing in the Cinderwright Discovery Hub. Crawled and health-checked daily.',
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
          category: { type: 'string', description: 'Service category to check authorization for (optional)' },
          amount: { type: 'number', description: 'Transaction amount to check against spending limits (optional)' }
        },
        required: ['wallet']
      }
    }
  ]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    // Free endpoints - proxy directly
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

    // Paid endpoints - return helpful instructions
    const paidInfo = {
      discover: { endpoint: `/discover?q=${encodeURIComponent(args?.query || '')}`, price: '$0.01 USDC' },
      find: { endpoint: '/find', price: '$0.02 USDC', body: { intent: args?.intent } },
      compare: { endpoint: '/compare', price: '$0.02 USDC', body: { capability: args?.capability, sort_by: args?.sort_by || 'quality' } },
      market_report: { endpoint: '/market/report', price: '$1.00 USDC' },
      market_opportunity: { endpoint: '/market/opportunity', price: '$0.50 USDC' }
    };

    const info = paidInfo[name];
    if (info) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            status: 'payment_required',
            price: info.price,
            protocol: 'x402 (USDC on Base)',
            endpoint: BASE_URL + info.endpoint,
            method: info.body ? 'POST' : 'GET',
            body: info.body || undefined,
            how_to_pay: [
              'Install: npm install @x402/fetch @x402/evm viem',
              'See full examples: https://github.com/cinderwright-ai/cinderwright-api/blob/main/DEMO.md'
            ],
            hub: 'Cinderwright Discovery Hub - https://api.ideafactorylab.org'
          }, null, 2)
        }]
      };
    }

    return { content: [{ type: 'text', text: `Unknown tool: ${name}` }] };

  } catch (error) {
    return { content: [{ type: 'text', text: `Error: ${error.message}` }] };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
