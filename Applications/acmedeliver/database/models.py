import datetime

from sqlalchemy import Integer, String, LargeBinary, Column, Boolean, ForeignKey, Float, DateTime, Enum, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

import uuid
from acmedeliver.database.db import Base
from acmedeliver.database.enums import UserType


class User(Base):
    __tablename__ = "user"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    surname = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=False)
    password = Column(LargeBinary, nullable=False)
    kind = Column(Enum(UserType), default=UserType.worker)
