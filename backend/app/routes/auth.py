from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import asyncio

# Initialize the router
router = APIRouter()

# --- Pydantic Models for strict type checking ---
class LoginRequest(BaseModel):
    email: str
    password: str

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str

class AuthResponse(BaseModel):
    token: str
    message: str
    user: dict

# --- Mock Login Endpoint ---
@router.post("/login", response_model=AuthResponse)
async def login(request: LoginRequest):
    # Simulate database lookup and password verification delay
    await asyncio.sleep(1.0)
    
    # Mock authentication logic
    if request.email == "admin@guardian.dev":
        return AuthResponse(
            token="mock_jwt_token_admin_12345",
            message="Login successful",
            user={"name": "Admin_User", "email": request.email, "plan": "Pro Plan"}
        )
    else:
        # Accept any other login for UI testing purposes
        return AuthResponse(
            token="mock_jwt_token_user_67890",
            message="Login successful",
            user={"name": "Test User", "email": request.email, "plan": "Basic Plan"}
        )

# --- Mock Signup Endpoint ---
@router.post("/signup", response_model=AuthResponse)
async def signup(request: SignupRequest):
    # Simulate database writing and account creation delay
    await asyncio.sleep(1.5)
    
    # Return mock token and new user details
    return AuthResponse(
        token="mock_jwt_token_new_user_99999",
        message="Account created successfully",
        user={"name": request.name, "email": request.email, "plan": "Free Tier"}
    )