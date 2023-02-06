"""
Questo modulo contiene gli schemi JSON per la creazione e modifica di oggetti nel database.
"""
import typing as t
from uuid import UUID
from datetime import datetime
import enum
from acmerestaurant.database import models
from acmerestaurant.schemas import base

__all__ = (
    "UserEdit",
    "UserNew"
)


class OrderStatus(enum.Enum):
    created = 0
    w_restaurant_ok = 1
    w_deliverer_ok = 2
    confirmed_by_thirds = 3
    cancelled = 4
    w_payment = 5
    w_cancellation = 6
    w_kitchen = 7
    w_transport = 8
    delivering = 9
    delivered = 10


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


class OrderEdit(base.ACMEModel):
    status: t.Optional[OrderStatus]



class ContentEdit(base.ACMEORMModel):
    menu_id: UUID
    qty: int


class DelivererEdit(base.ACMEModel):
    name: str
    api_url: str
    address: str


class MenuEntry(base.ACMEModel):
    name: str
    desc: str

    def jsonify(self):
        return {"name": self.name, "desc": self.desc}


class MenuEdit(base.ACMEModel):
    name: str
    contents: t.List[MenuEntry]
    cost: float
    hidden: bool

    def jsonify_contents(self):
        res = []
        for entry in self.contents:
            res.append(entry.jsonify())
        return res