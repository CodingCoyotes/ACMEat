"""
Questo modulo contiene gli schemi JSON per la creazione e modifica di oggetti nel database.
"""
import typing
import typing as t
from uuid import UUID
from datetime import datetime
from acmeat.database.enums import OrderStatus

from acmeat.database import models
from acmeat.schemas import base

__all__ = (
    "UserEdit",
    "UserNew",
    "RestaurantEdit",
    "MenuEdit",
    "OrderEdit",
    "DelivererEdit",
    "PaymentEdit",
    "CityEdit",
    "ContentEdit",
    "DelivererDeliveryEdit"
)


class UserEdit(base.ACMEORMModel):
    name: str
    surname: str
    password: bytes
    email: str


class UserBase(base.ACMEORMModel):
    name: str
    surname: str


class UserNew(base.ACMEORMModel):
    name: str
    surname: str
    email: str
    password: str


class Coords(base.ACMEModel):
    latitude: float
    longitude: float

    def jsonify(self):
        return {"latitude": self.latitude, "longitude": self.longitude}


class Time(base.ACMEModel):
    day: str
    time: str

    def jsonify(self):
        return {"day": self.day, "time": self.time}


class RestaurantEdit(base.ACMEORMModel):
    name: str
    address: str
    number: str
    open_times: t.List[Time]
    closed: bool
    city_id: UUID
    bank_address: str

    def jsonify_time(self):
        res = []
        for entry in self.open_times:
            res.append(entry.jsonify())
        return res


class MenuEntry(base.ACMEModel):
    name: str
    desc: str

    def jsonify(self):
        return {"name": self.name, "desc": self.desc}


class MenuEdit(base.ACMEORMModel):
    name: str
    contents: t.List[MenuEntry]
    cost: float
    hidden: bool

    def jsonify_contents(self):
        res = []
        for entry in self.contents:
            res.append(entry.jsonify())
        return res


class OrderEdit(base.ACMEORMModel):
    status: t.Optional[OrderStatus]



class DelivererDeliveryEdit(base.ACMEModel):
    api_key: UUID


class ContentEdit(base.ACMEORMModel):
    menu_id: UUID
    qty: int


class CityEdit(base.ACMEORMModel):
    name: str
    nation: str


class DelivererEdit(base.ACMEORMModel):
    name: str
    api_url: str
    nation: str
    city: str
    address: str
    number: str
    external_api_key: str
    api_key: UUID
    bank_address: str


class OrderCreation(base.ACMEModel):
    contents: typing.List[ContentEdit]
    delivery_time: datetime
    address: str
    number: str
    city: str
    nation: str


class PaymentEdit(base.ACMEORMModel):
    token: UUID
