import typing as t
from acmegeolocate.schemas import base

__all__ = (
    "Address",
    "DistanceRequest",
    "DistanceResponse",
    "CoordsRequest",
    "CoordsResponse",
)


class Address(base.ACMEModel):
    nation: str
    city: str
    roadname: str
    number: int

    def __repr__(self):
        return f"{self.number},{self.roadname},{self.city},{self.nation}"


class DistanceRequest(base.ACMEModel):
    source: Address
    destination: Address


class DistanceResponse(base.ACMEModel):
    distance_km: float


class CoordsRequest(base.ACMEModel):
    address: Address


class CoordsResponse(base.ACMEModel):
    longitude: float
    latitude: float
