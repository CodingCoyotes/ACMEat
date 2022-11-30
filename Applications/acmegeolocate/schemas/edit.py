import typing as t
from acmegeolocate.schemas import base

__all__ = (
    "Address",
    "DistanceRequest",
    "DistanceResponse",
    "CoordsRequest",
    "CoordsResponse"
)


class Address(base.ACMEModel):
    nation: str
    city: str
    roadname: str
    number: int


class DistanceRequest(base.ACMEModel):
    address1: Address
    address2: Address


class DistanceResponse(base.ACMEModel):
    distance_km: float


class CoordsRequest(base.ACMEModel):
    address: Address


class CoordsResponse(base.ACMEModel):
    longitude: float
    latitude: float