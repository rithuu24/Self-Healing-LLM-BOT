from fastapi import APIRouter
import asyncio

# Initialize the router
router = APIRouter()

# GET request to fetch the high-level system metrics for the landing page
@router.get("/home-metrics")
async def get_home_metrics():
    # Simulate a quick database retrieval delay
    await asyncio.sleep(0.4)
    
    # Return the exact data structure needed for your MetricCards
    return {
        "metrics": [
            {
                "label": "Success Rate", 
                "value": "99.2%", 
                "sub": "Verified repairs"
            },
            {
                "label": "Time Saved", 
                "value": "124 hrs", 
                "sub": "Per project/mo"
            },
            {
                "label": "Repair Latency", 
                "value": "142ms", 
                "sub": "Avg. fix speed"
            },
            {
                "label": "Active Nodes", 
                "value": "Stable", 
                "sub": "System health"
            }
        ]
    }