from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import httpx
import uuid  # To generate a unique device ID

app = FastAPI()

TARGET_URL = "https://api.warframe.market/v1"

# Model for item details
class ItemDetails(BaseModel):
    item_id: str
    price: float

# Model for storing login credentials
class LoginCredentials(BaseModel):
    email: str
    password: str

# Store the session token in memory for simplicity
session_token = None

@app.get("/api/rivens")
async def get_rivens(weapon: str = None):
    async with httpx.AsyncClient() as client:
        if weapon:
            response = await client.get(f"{TARGET_URL}/auctions/search?type=riven&buyout_policy=direct&weapon_url_name={weapon}&sort_by=price_asc")
        else:
            response = await client.get(f"{TARGET_URL}/riven/items")
    
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Error fetching rivens")
    
    return response.json()

@app.post("/api/login")
async def login(credentials: LoginCredentials):
    global session_token
    
    device_id = str(uuid.uuid4())
    login_data = {
        "auth_type": "cookie",
        "email": credentials.email,
        "password": credentials.password,
        "device_id": device_id
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{TARGET_URL}/auth/signin",
            json=login_data
        )
    
    print(response.json())  # Debugging
    
    if response.status_code == 200:
        # Check if the token is in cookies or data field
        session_token = response.cookies.get("JWT")
        if session_token is None:
            raise HTTPException(status_code=500, detail="Token not found")
        return {"message": "Login successful", "token": session_token}
    else:
        raise HTTPException(status_code=response.status_code, detail=response.json())

@app.post("/api/auto-list")
async def auto_list(item_details: ItemDetails):
    global session_token
    if session_token is None:
        raise HTTPException(status_code=403, detail="User is not logged in")
    
    print(f"Session Token: {session_token}")  # Debugging
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{TARGET_URL}/listings",
            json=item_details.dict(),
            headers={"Authorization": f"Bearer {session_token}"}
        )
    
    if response.status_code == 200:
        return {"message": "Item listed successfully", "data": response.json()}
    else:
        raise HTTPException(status_code=response.status_code, detail=response.json())
