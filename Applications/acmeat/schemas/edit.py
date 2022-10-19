import typing as t
from uuid import UUID

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
