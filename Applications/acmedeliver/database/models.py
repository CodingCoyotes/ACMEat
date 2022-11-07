import datetime

from sqlalchemy import Integer, String, LargeBinary, Column, Boolean, ForeignKey, Float, DateTime, Enum, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

import uuid
from acmedeliver.database.db import Base
from acmedeliver.database.enums import UserType, DeliveryStatus


class User(Base):
    __tablename__ = "user"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    surname = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=False)
    password = Column(LargeBinary, nullable=False)
    kind = Column(Enum(UserType), default=UserType.worker)

    deliveries = relationship("Delivery", back_populates="deliverer")


class Delivery(Base):
    __tablename__ = "delivery"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    status = Column(Enum(DeliveryStatus), default=DeliveryStatus.waiting)
    cost = Column(Float, nullable=False)
    receiver = Column(String, nullable=False)
    date = Column(DateTime, default=datetime.datetime.now)
    delivery_time = Column(DateTime, nullable=False)

    deliverer = relationship("User", back_populates="deliveries")
    deliverer_id = Column(UUID(as_uuid=True), ForeignKey("user.id"))
    client = relationship("Client", back_populates="deliveries")
    client_id = Column(UUID(as_uuid=True), ForeignKey("client.id"))


class Client(Base):
    __tablename__ = "client"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    api_key = Column(String, nullable=False)

    deliveries = relationship("Delivery", back_populates="client")
