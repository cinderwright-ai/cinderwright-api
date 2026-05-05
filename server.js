#!/usr/bin/env node
// Cinderwright Discovery Hub - MCP Server
// Full server runs at https://api.ideafactorylab.org
// This file provides MCP stdio compatibility for Glama/MCP clients

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
    { name: 'stats', description: 'Get ecosystem statistics - 1,551 services across x402, MPP, and Lightning protocols', inputSchema: { type: 'object', properties: {} } },
    { name: 'quality', description: 'Get service quality grades - we test 70 services weekly and grade them A-F', inputSchema: { type: 'object', properties: {} } },
    { name: 'protocols', description: 'Get cross-protocol breakdown: x402 vs MPP vs L402/Lightning', inputSchema: { type: 'object', properties: {} } },
    { name: 'prices', description: 'Get market pricing trends across the agent economy', inputSchema: { type: 'object', properties: {} } },
    { name: 'trends', description: 'Get what agents are searching for', inputSchema: { type: 'object', properties: {} } },
    { name: 'discover', description: 'Search for x402/MPP/Lightning services by keyword (costs $0.01 USDC on Base)', inputSchema: { type: 'object', properties: { query: { type: 'string', description: 'Search keyword' } }, required: ['query'] } },
    { name: 'find', description: 'Intent-based discovery - describe what you need in plain English (costs $0.02 USDC on Base)', inputSchema: { type: 'object', properties: { intent: { type: 'string', description: 'Describe what you need' } }, required: ['intent'] } },
    { name: 'compare', description: 'Compare services side by side with quality grades and recommendations (costs $0.02 USDC on Base)', inputSchema: { type: 'object', properties: { capability: { type: 'string', description: 'Service capability to compare' }, sort_by: { type: 'string', enum: ['quality', 'price', 'speed'], description: 'Sort order' } }, required: ['capability'] } },
    { name: 'market_report', description: 'Full market intelligence report - top categories, pricing trends, opportunities (costs $1.00 USDC)', inputSchema: { type: 'object', properties: {} } },
    { name: 'market_opportunity', description: 'Gap analysis - underserved niches and overpriced categories to undercut (costs $0.50 USDC)', inputSchema: { type: 'object', properties: {} } },
    { name: 'submit', description: 'Submit your x402/MPP/Lightning service for free indexing', inputSchema: { type: 'object', properties: { url: { type: 'string', description: 'Your service URL' }, name: { type: 'string', description: 'Service name' }, description: { type: 'string', description: 'What your service does' } }, required: ['url'] } },
    { name: 'agent_check', description: 'Check if an agent wallet is registered and authorized (FREE)', inputSchema: { type: 'object', properties: { wallet: { type: 'string', description: 'Agent wallet address (0x...)' }, category: { type: 'string', description: 'Service category to check authorization for' } }, required: ['wallet'] } },
  ]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  const freeEndpoints = { stats: '/stats', quality: '/quality', protocols: '/protocols', prices: '/prices', trends: '/trends' };

  if (freeEndpoints[name]) {
    const resp = await fetch(BASE_URL + freeEndpoints[name]);
    const data = await resp.json();
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  }

  if (name === 'agent_check') {
    const resp = await fetch(`${BASE_URL}/agent/check?wallet=${args.wallet}${args.category ? '&category=' + args.category : ''}`);
    const data = await resp.json();
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  }

  if (name === 'submit') {
    const resp = await fetch(`${BASE_URL}/submit`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(args) });
    const data = await resp.json();
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  }

  const paidEndpoints = { discover: `/discover?q=${encodeURIComponent(args.query || '')}`, find: null, compare: null, market_report: '/market/report', market_opportunity: '/market/opportunity' };

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({
        message: `This tool requires x402 payment (USDC on Base). Call ${BASE_URL}/${name.replace('_', '/')} directly with an x402-enabled client.`,
        endpoint: BASE_URL + (name === 'discover' ? `/discover?q=${encodeURIComponent(args.query || '')}` : name === 'find' ? '/find' : name === 'compare' ? '/compare' : `/${name.replace('_', '/')}`),
        payment_required: true,
        how_to_pay: 'npm install @x402/fetch && see https://github.com/cinderwright-ai/cinderwright-api/blob/main/DEMO.md'
      }, null, 2)
    }]
  };
});

const transport = new StdioServerTransport();
await server.connect(transport);
