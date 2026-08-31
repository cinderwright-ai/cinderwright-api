from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import os
import requests

app = FastAPI(title="Earn-Admission Agent Swarm API")

# Configuration
X402_API_URL = os.getenv("X402_API_URL", "https://api.x402.com/v1")
USDC_BOUNTY_AMOUNT = 5.0  # USDC
FIRST_JOINER_BOUNTY = 5.0  # USDC

# Data models
class Agent(BaseModel):
    id: str
    name: str
    status: str = "pending"
    joined_at: Optional[datetime] = None

class Swarm(BaseModel):
    id: str
    name: str
    agents: List[Agent] = []
    bounty_claimed: bool = False
    created_at: datetime = datetime.utcnow()

class JoinRequest(BaseModel):
    agent_id: str
    agent_name: str

# In-memory storage (replace with DB in production)
swarms = {}

def verify_x402_payment(payment_token: str):
    """Verify payment with x402 API"""
    try:
        response = requests.get(
            f"{X402_API_URL}/payments/verify",
            headers={"Authorization": f"Bearer {payment_token}"},
            timeout=10
        )
        if response.status_code == 200:
            return response.json()
        return None
    except Exception:
        return None

@app.post("/swarms/{swarm_id}/join")
async def join_swarm(
    swarm_id: str,
    request: JoinRequest,
    payment_token: str = None
):
    """Join an earn-admission agent swarm with payment verification"""
    # Check if swarm exists
    if swarm_id not in swarms:
        swarms[swarm_id] = Swarm(id=swarm_id, name=f"Swarm-{swarm_id}")
    
    swarm = swarms[swarm_id]
    
    # Verify payment if provided (for non-first joiners)
    if payment_token:
        payment_info = verify_x402_payment(payment_token)
        if not payment_info or payment_info.get("amount", 0) < USDC_BOUNTY_AMOUNT:
            raise HTTPException(status_code=402, detail="Payment verification failed")
    
    # Check if agent already exists
    if any(agent.id == request.agent_id for agent in swarm.agents):
        raise HTTPException(status_code=409, detail="Agent already in swarm")
    
    # First joiner gets bounty
    is_first_joiner = len(swarm.agents) == 0
    
    # Add agent to swarm
    new_agent = Agent(
        id=request.agent_id,
        name=request.agent_name,
        status="active",
        joined_at=datetime.utcnow()
    )
    swarm.agents.append(new_agent)
    
    # Handle bounty for first joiner
    if is_first_joiner and not swarm.bounty_claimed:
        swarm.bounty_claimed = True
        # In production, this would trigger a USDC transfer via x402
        # For now, just mark as bounty claimed
    
    return {
        "message": "Successfully joined swarm",
        "agent": new_agent,
        "bounty_claimed": is_first_joiner,
        "total_agents": len(swarm.agents)
    }

@app.get("/swarms/{swarm_id}")
async def get_swarm(swarm_id: str):
    """Get swarm details"""
    if swarm_id not in swarms:
        raise HTTPException(status_code=404, detail="Swarm not found")
    return swarms[swarm_id]

@app.get("/swarms/{swarm_id}/agents")
async def get_agents(swarm_id: str):
    """Get all agents in a swarm"""
    if swarm_id not in swarms:
        raise HTTPException(status_code=404, detail="Swarm not found")
    return {"agents": swarms[swarm_id].agents}