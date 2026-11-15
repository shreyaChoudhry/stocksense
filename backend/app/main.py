
from fastapi import FastAPI
from sqlalchemy import text

from app.database import engine

app = FastAPI(
    title="StockSense API",
    description="Backend API for StockSense inventory intelligence platform",
    version="1.0.0"
)


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
