from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_analytics():
    return {
        "total_scans": 128,
        "high_threats": 23,
        "medium_threats": 54,
        "low_threats": 51,
        "top_issue": "SQL Injection",
        "system_health": "Stable"
    }