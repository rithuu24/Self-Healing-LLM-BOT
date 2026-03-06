from fastapi import APIRouter
import asyncio

# Initialize the router
router = APIRouter()

# We use a GET request here because Analytics is just retrieving data, not submitting code
@router.get("/metrics")
async def get_system_metrics():
    # Simulate a small database/telemetry fetch delay
    await asyncio.sleep(0.5)
    
    # Return the exact JSON structure needed for Recharts and the Dashboard
    return {
        "latency_data": [
            {"time": "00:00", "latency": 120},
            {"time": "04:00", "latency": 110},
            {"time": "08:00", "latency": 135},
            {"time": "12:00", "latency": 180},
            {"time": "16:00", "latency": 150},
            {"time": "20:00", "latency": 125},
            {"time": "24:00", "latency": 115},
        ],
        "repair_data": [
            {"day": "Mon", "fixes": 12},
            {"day": "Tue", "fixes": 18},
            {"day": "Wed", "fixes": 15},
            {"day": "Thu", "fixes": 24},
            {"day": "Fri", "fixes": 20},
            {"day": "Sat", "fixes": 8},
            {"day": "Sun", "fixes": 10},
        ],
        "header_stats": {
            "total_repairs": {"value": "1,492", "trend": "+12%", "trendUp": True},
            "avg_healing_time": {"value": "1.2s", "trend": "-0.3s", "trendUp": True},
            "system_uptime": {"value": "99.9%", "trend": "+0.1%", "trendUp": True},
            "unresolved_errors": {"value": "24", "trend": "+5", "trendUp": False}
        },
        "engine_health": [
            {"name": "Qwen 2.5 Inference", "status": "Online", "load": 42, "color": "bg-emerald-500"},
            {"name": "DOM Snapshot API", "status": "Online", "load": 18, "color": "bg-emerald-500"},
            {"name": "Polyglot Translator", "status": "Degraded", "load": 89, "color": "bg-amber-500"},
            {"name": "Security Auditor", "status": "Offline", "load": 0, "color": "bg-rose-500"}
        ]
    }