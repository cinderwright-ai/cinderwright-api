# Cinderwright

[![PyPI](https://img.shields.io/pypi/v/cinderwright)](https://pypi.org/project/cinderwright/)
[![Available on CodeGuilds](https://img.shields.io/badge/Available_on-CodeGuilds-6366f1)](https://codeguilds.dev/packages/cinderwright-api)

**Universal payment proxy for AI agents.** 2,835 paid services. x402 (USDC on Base) + Lightning (L402). No per-service API keys.

Your AI agent can call real-time weather, crypto prices, translation, summarization, sentiment analysis, geocoding, and hundreds more services -- paying per call via micropayment. No subscriptions, no API key management, no custody.

---

## Install

```bash
pip install cinderwright
```

---

## Quick start (no account needed)

```python
import cinderwright

# Free demo -- no account required
print(cinderwright.demo("Bitcoin price"))
# "Bitcoin is $62,798 USD right now."

print(cinderwright.demo("weather in Tokyo"))
# "Tokyo: Partly Cloudy, 24C / 75F. Looks decent out there."
```

---

## With account ($0.10 free credit, no deposit)

Get a key in 30 seconds:

```bash
curl -X POST https://api.ideafactorylab.org/proxy/setup \
     -H "Content-Type: application/json" \
     -d '{"wallet": "your_base_wallet_address"}'
```

Then:

```python
from cinderwright import Cinderwright

cw = Cinderwright(api_key="sk_cw_...")

# Ask anything
print(cw.ask("Bitcoin price"))
print(cw.ask("weather in Tokyo"))
print(cw.ask("translate hello world to Spanish"))
print(cw.ask("summarize this text: The quick brown fox..."))
print(cw.ask("sentiment of: I love this product!"))

# Check balance
print(cw.balance())
# {"balance_usd": 0.10, "calls_made": 3, ...}

# Fund with Lightning (sats -> proxy credit in ~30s)
invoice = cw.deposit_lightning(amount_sats=10000)
print(invoice["payment_request"])  # lnbc100u...
```

---

## LangChain

```bash
pip install cinderwright[langchain]
```

```python
from cinderwright.langchain import CinderwrightTool
from langchain_openai import ChatOpenAI
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

tool = CinderwrightTool(api_key="sk_cw_...")

llm = ChatOpenAI(model="gpt-4o")
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant with access to real-time data."),
    ("human", "{input}"),
    MessagesPlaceholder("agent_scratchpad"),
])
agent = create_tool_calling_agent(llm, [tool], prompt)
executor = AgentExecutor(agent=agent, tools=[tool], verbose=True)

result = executor.invoke({"input": "What is the current Bitcoin price?"})
print(result["output"])
```

LangGraph:

```python
from cinderwright.langchain import CinderwrightTool
from langgraph.prebuilt import create_react_agent
from langchain_openai import ChatOpenAI

tool = CinderwrightTool(api_key="sk_cw_...")
agent = create_react_agent(ChatOpenAI(model="gpt-4o"), [tool])

result = agent.invoke({"messages": [("human", "What's the weather in Tokyo?")]})
print(result["messages"][-1].content)
```

---

## CrewAI

```bash
pip install cinderwright[crewai]
```

```python
from cinderwright.crewai import CinderwrightTool
from crewai import Agent, Task, Crew

tool = CinderwrightTool(api_key="sk_cw_...")

researcher = Agent(
    role="Research Analyst",
    goal="Gather accurate real-time information",
    backstory="Expert at finding current data",
    tools=[tool],
    verbose=True,
)
task = Task(
    description="Find the current Bitcoin price and 24h change",
    agent=researcher,
    expected_output="BTC price in USD with 24h percentage change",
)
crew = Crew(agents=[researcher], tasks=[task], verbose=True)
result = crew.kickoff()
print(result)
```

---

## OpenAI Agents SDK

```bash
pip install cinderwright[openai-agents]
```

```python
from cinderwright.openai_agents import make_cinderwright_tool
from agents import Agent, Runner

tool = make_cinderwright_tool(api_key="sk_cw_...")

agent = Agent(
    name="Research Agent",
    instructions="You are a research assistant with access to real-time data.",
    tools=[tool],
)
result = Runner.run_sync(agent, "What is the Bitcoin price?")
print(result.final_output)
```

---

## smolagents / Pydantic AI / Generic

```python
# smolagents
from cinderwright.tools import CinderwrightSmolTool
tool = CinderwrightSmolTool(api_key="sk_cw_...")

# Pydantic AI
from cinderwright.tools import cinderwright_tool_fn
fn = cinderwright_tool_fn(api_key="sk_cw_...")

# Any framework -- plain callable
from cinderwright.tools import make_tool_fn
fn = make_tool_fn(api_key="sk_cw_...")
result = fn("Bitcoin price")
```

---

## CLI

```bash
# Free demo
cinderwright "Bitcoin price"

# With account
cinderwright --key sk_cw_... "weather in Tokyo"

# Via environment variable
export CINDERWRIGHT_API_KEY=sk_cw_...
cinderwright "translate hello to Spanish"
```

---

## Fund with Lightning

```python
cw = Cinderwright(api_key="sk_cw_...")

# Create invoice
invoice = cw.deposit_lightning(amount_sats=10000)
print("Pay this invoice:", invoice["payment_request"])

# Check settlement (credited within ~30 seconds of payment)
import time
for _ in range(6):
    time.sleep(10)
    status = cw.check_deposit(invoice["r_hash"])
    if status["settled"]:
        print("Funded! Balance:", cw.balance()["balance_usd"])
        break
```

---

## What services are available?

2,835 indexed services across:

- **Crypto prices** -- Bitcoin, Ethereum, Solana, and more
- **Weather** -- real-time conditions for any location
- **Translation** -- text translation across languages
- **Summarization** -- long text to concise summaries
- **Sentiment analysis** -- positive/negative/neutral with confidence
- **Geocoding** -- address to coordinates
- **News** -- latest headlines by topic
- **DNS / Domain info** -- domain lookups
- **General AI** -- powered by Gemini 2.5

Browse the index: [api.ideafactorylab.org/discover](https://api.ideafactorylab.org/discover)

---

## Pricing

- **Free trial**: $0.10 credit on signup, no deposit required
- **Per call**: typically $0.001 -- $0.01 depending on service
- **Funding**: Lightning (sats) or USDC on Base

---

## Links

- Homepage: [api.ideafactorylab.org](https://api.ideafactorylab.org)
- Source: [github.com/cinderwright-ai/cinderwright-api](https://github.com/cinderwright-ai/cinderwright-api)
- MCP server: `npx cinderwright-mcp-server` (for Claude)
- CLI: `npx cinderwright "Bitcoin price"` (Node.js)

---

## License

MIT
