from fastapi import FastAPI, HTTPException
from app.core.config import settings

from app.auth import routes as auth_routes
from app.api.routes import predict as api_routes
from app.api.routes.predict import router
from fastapi.middleware.cors import CORSMiddleware
import uvicorn


app = FastAPI(
    title="MeetingROI API",
    description="Predict if a meeting is productive and estimate cost",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],  # Use ["http://localhost:3000"] in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_routes.router, prefix="/auth", tags=["Authentication"])
app.include_router(router, prefix="/api", tags=["Meeting ROI"])

@app.get("/")
def root():
    return {"message": "Welcome to meetingROI API"}
