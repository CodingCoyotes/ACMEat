from __future__ import annotations

import abc
import datetime
import uuid

import pydantic

__all__ = (
    "ACMEModel",
)


class ACMEModel(pydantic.BaseModel, metaclass=abc.ABCMeta):
    class Config(pydantic.BaseModel.Config):
        json_encoders = {
            uuid.UUID:
                lambda obj: str(obj),
            datetime.datetime:
                lambda obj: obj.timestamp(),
        }