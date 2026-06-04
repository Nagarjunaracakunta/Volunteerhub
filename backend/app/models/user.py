import enum
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum, Text
from app.database import Base


class UserRole(str, enum.Enum):
    admin = "admin"
    host = "host"
    volunteer = "volunteer"
    agency = "agency"


class UserStatus(str, enum.Enum):
    active = "active"
    pending = "pending"      # awaiting admin approval (hosts / agencies)
    suspended = "suspended"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.volunteer)
    status = Column(Enum(UserStatus), nullable=False, default=UserStatus.active)

    # Profile fields
    phone = Column(String(20), nullable=True)
    location = Column(String(255), nullable=True)
    bio = Column(Text, nullable=True)
    avatar_url = Column(String(500), nullable=True)

    # For hosts / agencies — org name
    org_name = Column(String(255), nullable=True)
    website = Column(String(500), nullable=True)

    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc),
                        onupdate=lambda: datetime.now(timezone.utc))
    last_login = Column(DateTime, nullable=True)
