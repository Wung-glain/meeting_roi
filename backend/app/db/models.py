from sqlalchemy import Column, String, Text, Boolean, TIMESTAMP, ForeignKey, Integer, Float
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default="gen_random_uuid()")
    full_name = Column(String(100))
    email = Column(String(150), unique=True, nullable=False)
    password_hash = Column(Text, nullable=False)
    profile_picture = Column(Text, nullable=True)
    email_verified = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    reset_token = Column(String(255), nullable=True, unique=True)
    reset_token_expiry = Column(TIMESTAMP(timezone=True), nullable=True)
    subscriptions = relationship("Subscription", back_populates="user")


class Plan(Base):
    __tablename__ = "plans"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)
    description = Column(Text)
    price_usd = Column(Integer, default=0)
    subscriptions = relationship("Subscription", back_populates="plan")


class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default="gen_random_uuid()")
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    plan_id = Column(Integer, ForeignKey("plans.id"))
    status = Column(String(20), default="active")  # Validated via database check
    start_date = Column(TIMESTAMP(timezone=True), server_default=func.now())
    end_date = Column(TIMESTAMP(timezone=True), nullable=True)
    stripe_customer_id = Column(Text, nullable=True)
    stripe_subscription_id = Column(Text, nullable=True)

    user = relationship("User", back_populates="subscriptions")
    plan = relationship("Plan", back_populates="subscriptions")



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