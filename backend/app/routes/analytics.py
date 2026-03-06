from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
import random

router = APIRouter()

# ---------------- PYDANTIC DATA MODELS ----------------
# These perfectly match the TypeScript interfaces in your React frontend

class LatencyPoint(BaseModel):
    time: str
    latency: int

class RepairPoint(BaseModel):
    day: str
    fixes: int

class StatMetrics(BaseModel):
    total_repairs: int
    avg_healing_time: float
    system_uptime: float
    unresolved_errors: int

class HealthNodeData(BaseModel):
    name: str
    status: str
    load: int
    color: str

class DashboardResponse(BaseModel):
    latency_data: List[LatencyPoint]
    repair_data: List[RepairPoint]
    stats: StatMetrics
    health_nodes: List[HealthNodeData]


# ---------------- API ENDPOINT ----------------

@router.get("/analytics", response_model=DashboardResponse)
async def get_dashboard_analytics():
    """
    Provides real-time telemetry data for the Guardian V2 React Dashboard.
    Data is slightly randomized on each request to simulate a live, active system.
    """
    
    # Generate dynamic latency data for the area chart
    base_latency = 120
    latency_data = [
        {"time": "00:00", "latency": base_latency + random.randint(-15, 20)},
        {"time": "04:00", "latency": base_latency + random.randint(-20, 10)},
        {"time": "08:00", "latency": base_latency + random.randint(10, 40)},
        {"time": "12:00", "latency": base_latency + random.randint(40, 90)}, # Mid-day spike
        {"time": "16:00", "latency": base_latency + random.randint(20, 50)},
        {"time": "20:00", "latency": base_latency + random.randint(0, 30)},
        {"time": "24:00", "latency": base_latency + random.randint(-10, 15)},
    ]

    # Generate dynamic repair fixes data
    repair_data = [
        {"day": "Mon", "fixes": random.randint(10, 25)},
        {"day": "Tue", "fixes": random.randint(15, 30)},
        {"day": "Wed", "fixes": random.randint(10, 20)},
        {"day": "Thu", "fixes": random.randint(20, 40)},
        {"day": "Fri", "fixes": random.randint(15, 35)},
        {"day": "Sat", "fixes": random.randint(5, 15)},
        {"day": "Sun", "fixes": random.randint(5, 12)},
    ]

    # Dynamically calculate health node statuses based on simulated load
    translator_load = random.randint(70, 95)
    translator_color = "bg-amber-500" if translator_load >= 85 else "bg-emerald-500"
    translator_status = "Degraded" if translator_load >= 85 else "Online"

    health_nodes = [
        {"name": "Qwen 2.5 Inference", "status": "Online", "load": random.randint(35, 55), "color": "bg-emerald-500"},
        {"name": "DOM Snapshot API", "status": "Online", "load": random.randint(10, 25), "color": "bg-emerald-500"},
        {"name": "Polyglot Translator", "status": translator_status, "load": translator_load, "color": translator_color},
        {"name": "Security Auditor", "status": "Offline", "load": 0, "color": "bg-rose-500"},
    ]

    # Package everything into the final response
    return DashboardResponse(
        latency_data=latency_data,
        repair_data=repair_data,
        stats=StatMetrics(
            total_repairs=1492 + random.randint(0, 15), # Slowly increments over time
            avg_healing_time=round(random.uniform(1.1, 1.5), 1),
            system_uptime=99.9,
            unresolved_errors=random.randint(20, 30)
        ),
        health_nodes=health_nodes
    )