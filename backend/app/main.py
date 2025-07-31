from fastapi import FastAPI, HTTPException
from app.core.config import settings

from app.auth import routes as auth_routes
from app.api.routes import predict as api_routes
from app.api.routes.paddle_webhook import paddle_router
from app.api.routes.predict import router
from fastapi.middleware.cors import CORSMiddleware
import uvicorn


app = FastAPI(
    title="MeetingROI API",
    description="Predict if a meeting is productive and estimate cost",
    version="1.0.0"
)
origins = settings.FRONTEND_URL
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_routes.router, prefix="/auth", tags=["Authentication"])
app.include_router(router, prefix="/api", tags=["Meeting ROI"])
app.include_router(paddle_router, prefix="/webhook", tags=["Paddle Webhook Ingtegration"])

@app.get("/")
def root():
    return {"message": "Welcome to meetingROI API"}
