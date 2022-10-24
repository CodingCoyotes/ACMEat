import typing as t
from uuid import UUID
from datetime import datetime
from acmeat.database.enums import OrderStatus

from acmeat.database import models
from acmeat.schemas import base

__all__ = (
    "UserEdit",
    "UserNew"
)


class UserEdit(base.ACMEORMModel):
    """
    **Edit** model for :class:`.database.tables.User`.
    """

    name: str
    surname: str
    password: bytes
    email: str

    class Config(base.ACMEORMModel.Config):
        schema_extra = {
            "example": {
                "name": "John",
                "surname": "Doe"
            },
        }


class UserBase(base.ACMEORMModel):
    """
    **Edit** model for :class:`.database.tables.User`.
    """

    name: str
    surname: str

    class Config(base.ACMEORMModel.Config):
        schema_extra = {
            "example": {
                "name": "John",
                "surname": "Doe"
            },
        }


class UserNew(base.ACMEORMModel):
    name: str
    surname: str
    email: str
    password: str

    class Config(base.ACMEORMModel.Config):
        schema_extra = {
            "example": {
                "name": "John",
                "surname": "Doe",
                "email": "jdh@who.us",
                "password": "password"
            },
        }


class Coords(base.ACMEModel):
    latitude: float
    longitude: float

    def jsonify(self):
        return {"latitude":self.latitude, "longitude": self.longitude}


class Time(base.ACMEModel):
    day: str
    time: str

    def jsonify(self):
        return {"day": self.day, "time": self.time}


class RestaurantEdit(base.ACMEORMModel):
    name: str
    address: str
    coords: Coords
    open_times: t.List[Time]
    closed: bool
    city_id: UUID

    def jsonify_time(self):
        res = []
        for entry in self.open_times:
            res.append(entry.jsonify())
        return res


class MenuEntry(base.ACMEModel):
    name: str
    desc: str


class MenuEdit(base.ACMEORMModel):
    name: str
    contents: t.List[MenuEntry]
    cost: float
    hidden: bool


class OrderEdit(base.ACMEORMModel):
    date_order: datetime
    delivery_time: datetime
    total: float
    status: OrderStatus
    deliverer_id: t.Optional[UUID]


class ContentEdit(base.ACMEORMModel):
    order_id = UUID
    menu_id = UUID
    qty = int


class CityEdit(base.ACMEORMModel):
    name: str
    nation: str


class DelivererEdit(base.ACMEORMModel):
    name: str
    api_url: str
