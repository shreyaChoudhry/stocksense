
from fastapi import FastAPI
from sqlalchemy import text
from app.auth import get_current_user
from fastapi import Depends
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine
from app.tenancy import get_current_business
from app.routers.products import router as products_router
app = FastAPI(
    title="StockSense API",
    description="Backend API for StockSense inventory intelligence platform",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(products_router)

@app.get("/")
def root():
    return {
        "message": "Welcome to StockSense API",
        "status": "running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "StockSense Backend"
    }


@app.get("/health/database")
def database_health():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {
            "status": "connected",
            "database": "stocksense"
        }

    except Exception:
        return {
            "status": "disconnected",
            "database": "stocksense"
        }
@app.get("/auth/me")
def get_me(current_user: dict = Depends(get_current_user)):
    return {
        "message": "Authentication successful",
        "user": current_user
    }
@app.get("/auth/me/business")
def get_my_business(
    business: dict = Depends(get_current_business),
):
    return {
        "message": "Business access verified",
        "business": business,
    }