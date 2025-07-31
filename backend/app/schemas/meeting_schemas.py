from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from uuid import UUID

class RecentPredictionOut(BaseModel):
    id: UUID
    meeting_title: str
    date: datetime
    is_productive: bool
    confidence_score: float

    class Config:
        from_attributes = True

class MeetingOverviewOut(BaseModel):
    user_id: UUID
    total_estimated_cost: float
    total_meeting_analyzed: float
    total_roi: float
    total_estimated_value_gain: float

    class Config:
        from_attributes = True

class DashboardResponse(BaseModel):
    overview: MeetingOverviewOut
    recent_predictions: List[RecentPredictionOut]