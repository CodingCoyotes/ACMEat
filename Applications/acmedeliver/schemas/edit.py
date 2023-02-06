import typing as t
from uuid import UUID
from datetime import datetime

from acmedeliver.database import models
from acmedeliver.schemas import base

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


class DeliveryEdit(base.ACMEORMModel):
    cost: float
    receiver: str
    source: str
    source_id: UUID
    delivery_time: datetime


class DeliveryPreviewCost(base.ACMEORMModel):
    cost: float


class ClientDeliveryRequest(base.ACMEORMModel):
    api_key: str
    request: DeliveryEdit


class ClientEdit(base.ACMEORMModel):
    name: str
    api_url: str
    remote_api_key: UUID


class ClientRequest(base.ACMEORMModel):
    api_key: str


class ApiKey(base.ACMEModel):
    api_key: UUID