import typing as t
from bank_intermediary.schemas import base

__all__ = (
    "Request",
    "Response"
)


class Request(base.ACMEModel):
    xml: str
    action: str


class Response(base.ACMEModel):
    xml: str
