import typing as t
from bank_intermediary.schemas import base

__all__ = (
    "LoginRequest",
    "LoginResponse"
)


class LoginRequest(base.ACMEModel):
    username: str


class LoginResponse(base.ACMEModel):
    sid: str
