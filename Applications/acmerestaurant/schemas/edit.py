import typing as t
from uuid import UUID
from datetime import datetime
import enum

from acmeat.database.enums import OrderStatus
from acmerestaurant.database import models
from acmerestaurant.schemas import base

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


class OrderEdit(base.ACMEORMModel):
    date_order: datetime
    delivery_time: datetime
    restaurant_total: float
    deliverer_total: t.Optional[float]
    status: OrderStatus
    deliverer_id: t.Optional[UUID]


class ContentEdit(base.ACMEORMModel):
    menu_id: UUID
    qty: int


class DelivererEdit(base.ACMEORMModel):
    name: str
    api_url: str
    address: str


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
