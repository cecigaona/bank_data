#py -m fastapi run server.py

from fastapi import FastAPI, HTTPException
from sqlalchemy import create_engine, text
import os
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Pydantic model for request body
class Item(BaseModel):
    query: str

# Database connection URL using SQLAlchemy
DATABASE_URL = f"mysql+pymysql://{os.getenv('DB_USER', 'admin')}:{os.getenv('DB_PASSWORD', 'admin')}@{os.getenv('DB_HOST', 'localhost')}/{os.getenv('DB_NAME', 'bank')}"

# Create FastAPI app
app = FastAPI()

# Allow CORS for Angular frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create a database connection function
def get_db_connection():
    engine = create_engine(DATABASE_URL)
    return engine.connect()

# API Route to Fetch Data (POST request)
@app.post("/api/data")
def get_data(item: Item):
    try:
        with get_db_connection() as conn:
            result = conn.execute(text(item.query))
            data = [row._asdict() for row in result]
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# API Route to Test MySQL Connection
@app.get("/api/test")
def test():
    try:
        with get_db_connection() as conn:
            result = conn.execute(text("SHOW tables;"))
            data = [row._asdict() for row in result]
        return data
        return {"tables": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Root route
@app.get("/")
def home():
    return {"message": "FastAPI is running!"}
