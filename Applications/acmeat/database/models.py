import datetime

from sqlalchemy import Integer, String, LargeBinary, Column, Boolean, ForeignKey, Float, DateTime, Enum, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

import uuid
from acmeat.database.db import Base
from acmeat.database.enums import UserType, OrderStatus


class User(Base):
    __tablename__ = "user"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    surname = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=False)
    password = Column(LargeBinary, nullable=False)
    kind = Column(Enum(UserType), default=UserType.customer)

    restaurants = relationship("Restaurant", back_populates="owner")
    orders = relationship("Order", back_populates="user")


class Restaurant(Base):
    __tablename__ = "restaurant"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    address = Column(String, nullable=False)
    number = Column(String, nullable=False)
    open_times = Column(JSON, nullable=False)
    closed = Column(Boolean, default=False, nullable=False)
    bank_address = Column(String, nullable=False)

    owner_id = Column(UUID(as_uuid=True), ForeignKey("user.id"))
    owner = relationship("User", back_populates="restaurants")
    menus = relationship("Menu", back_populates="restaurant")
    city_id = Column(UUID(as_uuid=True), ForeignKey("city.id"))
    city = relationship("City", back_populates="restaurants")


class Menu(Base):
    __tablename__ = "menu"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    contents = Column(JSON, nullable=False)
    cost = Column(Float, nullable=False)
    hidden = Column(Boolean, default=False, nullable=False)

    restaurant_id = Column(UUID(as_uuid=True), ForeignKey("restaurant.id"))
    restaurant = relationship("Restaurant", back_populates="menus")
    requests = relationship("Content", back_populates="menu")


class Order(Base):
    __tablename__ = "order"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    date_order = Column(DateTime, default=datetime.datetime.now, nullable=False)
    delivery_time = Column(DateTime)
    restaurant_total = Column(Float)
    deliverer_total = Column(Float)
    status = Column(Enum(OrderStatus), nullable=False)
    nation = Column(String, nullable=False)
    city = Column(String, nullable=False)
    address = Column(String, nullable=False)
    number = Column(String, nullable=False)

    user_id = Column(UUID(as_uuid=True), ForeignKey("user.id"))
    user = relationship("User", back_populates="orders")
    contents = relationship("Content", back_populates="order")
    deliverer_id = Column(UUID(as_uuid=True), ForeignKey("deliverer.id"))
    deliverer = relationship("Deliverer", back_populates="orders")
    payment = relationship("Payment", back_populates="order")


class Payment(Base):
    __tablename__ = "payment"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    bank_id = Column(UUID(as_uuid=True), unique=True)
    date = Column(DateTime, default=datetime.datetime.now, nullable=False)
    verified = Column(Boolean, default=False, nullable=False)

    order_id = Column(UUID(as_uuid=True), ForeignKey("order.id"), unique=True)
    order = relationship("Order", back_populates="payment")


class Content(Base):
    __tablename__ = "content"

    order_id = Column(UUID(as_uuid=True), ForeignKey("order.id"), primary_key=True)
    order = relationship("Order", back_populates="contents")
    menu_id = Column(UUID(as_uuid=True), ForeignKey("menu.id"), primary_key=True)
    menu = relationship("Menu", back_populates="requests")
    qty = Column(Integer, nullable=False)


class City(Base):
    __tablename__ = "city"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, unique=True, nullable=False)
    nation = Column(String, nullable=False)

    restaurants = relationship("Restaurant", back_populates="city")


class Deliverer(Base):
    __tablename__ = "deliverer"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, unique=True, nullable=False)
    api_url = Column(String, unique=True, nullable=False)
    api_key = Column(UUID(as_uuid=True), nullable=False, unique=True, default=uuid.uuid4)
    nation = Column(String, nullable=False)
    city = Column(String, nullable=False)
    address = Column(String, nullable=False)
    number = Column(String, nullable=False)
    external_api_key = Column(String, nullable=False)
    bank_address = Column(String, nullable=False)

    orders = relationship("Order", back_populates="deliverer")
