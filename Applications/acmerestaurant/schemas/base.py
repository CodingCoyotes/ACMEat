"""
Questo modulo contiene la definizione degli schemi base, orm e non.
"""
from __future__ import annotations

import abc
import datetime
import uuid

import pydantic

import acmerestaurant.database.models
import acmerestaurant.database.enums

__all__ = (
    "ACMEModel",
    "ACMEORMModel",
)


class ACMEModel(pydantic.BaseModel, metaclass=abc.ABCMeta):

    class Config(pydantic.BaseModel.Config):
        json_encoders = {
            uuid.UUID:
                lambda obj: str(obj),
            datetime.datetime:
                lambda obj: obj.timestamp(),
            acmerestaurant.database.enums.UserType:
                lambda obj: obj.value,
            acmerestaurant.database.enums.OrderStatus:
                lambda obj: obj.value,
        }


class ACMEORMModel(ACMEModel, metaclass=abc.ABCMeta):

    class Config(ACMEModel.Config):
        orm_mode = True