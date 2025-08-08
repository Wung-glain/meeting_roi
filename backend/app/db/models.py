from sqlalchemy import Column, String, Text, Boolean, DECIMAL, DateTime, Numeric, TIMESTAMP, ForeignKey, Integer, Float
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime, timezone
import uuid
from app.db.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=lambda: str(uuid.uuid4())) # Assuming UUID for ID
    full_name = Column(String(100))
    email = Column(String(150), unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    profile_picture = Column(String)
    company_name = Column(String(100))
    email_verified = Column(Boolean, default=False)
    plan_status = Column(String(50), default='free', nullable=False)
    plan_id = Column(Integer, ForeignKey("plans.id"), nullable=True)  # New field
    paddle_customer_id = Column(String, unique=True)                 # New field
    paddle_current_subscription_id = Column(String, unique=True)     # New field
    created_at = Column(DateTime, default=datetime.utcnow)
    predictions_used = Column(Integer, default=0, nullable=False)
    plan_updated_at = Column(DateTime(timezone=True))
    # Relationship to subscriptions (optional, but good for querying)
    plan = relationship("Plan", back_populates="users")               # Relationship
    subscriptions = relationship("Subscription", back_populates="user")

class Subscription(Base):
    __tablename__ = "subscriptions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    plan_id = Column(Integer, ForeignKey("plans.id"), nullable=True)
    paddle_subscription_id = Column(String, unique=True, nullable=False)
    paddle_price_id = Column(String, nullable=False)
    status = Column(String, nullable=False)
    current_period_start = Column(DateTime(timezone=True))
    current_period_end = Column(DateTime(timezone=True))
    next_billed_at = Column(DateTime(timezone=True))
    cancel_at_period_end = Column(Boolean, default=False)
    unit_price_amount = Column(Numeric(10, 2))
    quantity = Column(Integer, default=1)
    created_at = Column(DateTime(timezone=True), default=datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))


    # Relationship to User
    user = relationship("User", back_populates="subscriptions")
    plan = relationship("Plan", back_populates="subscriptions")
class Plan(Base):
    __tablename__ = "plans"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)
    price_usd = Column(DECIMAL(10, 2), nullable=False)
    max_predictions_per_month = Column(Integer, nullable=False)
    description = Column(Text)

    # Reverse relationship: one plan has many users
    subscriptions = relationship("Subscription", back_populates="plan")
    users = relationship("User", back_populates="plan")





class RecentPrediction(Base):
    __tablename__ = "recent_predictions"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True)  # REAL Primary Key
    meeting_title = Column(String)
    date = Column(TIMESTAMP)
    is_productive = Column(Boolean)
    confidence_score = Column(Float)


class MeetingOverview(Base):
    __tablename__ = "meeting_overview"
    __table_args__ = {"extend_existing": True}

    user_id = Column(String, primary_key=True)
    total_estimated_cost = Column(Float)
    total_meeting_analyzed = Column(Float)
    total_roi = Column(Float)
    total_estimated_value_gain = Column(Float)